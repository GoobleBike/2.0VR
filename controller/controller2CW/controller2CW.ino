//The Gooble Bike 2.0VR!
//Versione CW 
//HW Wemos D1 R2
//Campiona la velocità con interrupt (senza filtri antirimbalzo)
//NON Campiona il valore analogico dello sterzo; prevede la presenza di un controller dedicato
//Trasmette la velocità su UDP ogni 1 S
//Riceve la pendenza da UDP ogni 1 S
//Attua la pendenza
//Segnali di I/O
//PIN D1 INGRESSO: onda quadra (duty cycle 50%) dal trainer
//PIN D3 USCITA: intensità di frenata PWM 0-255
//PIN D5 INGRESSO: switch di debug: logica negata 1 no debug (default), 0 debug
//Richiede la shield 485 per Wemos D1 R2.
//Diagnostica locale
//PIN D8 USCITA: LED che indica la velocità
//PIN D7 USCITA: LED che indica la frenata
//PIN D6 USCITA: LED che segnala la comunicazione
//N.B.: le posizioni dei pin sono diverse rispetto allo standard Arduino UNO
//vedi definizioni I/O per le corrispondenze
//14/11/2017
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <stdio.h>
//network config
char ssid[] = "gooble"; //SSID of your Wi-Fi router
char pass[] = "Loop-Gooble"; //Password of your Wi-Fi router

int remotePort = 40000;                   //Porta di servizio
//IPAddress remoteIP={nnn,nnn,nnn,nnn4};  //Numero IP del Server
//TEMPORANEO!!!
IPAddress remoteIP={192,168,1,64};        //Numero IP del Server debug
//FINE TEMPORANEO!!!
WiFiUDP Udp;

//Definizione degli I/O
#define BKSPEED  D1      //segnale di ingresso velocità    pin 3 (era pin 2)
#define BRAKE    D3      //segnale di uscita freno (PWM)   pin 5 (stessa posizione)
#define SPEEDLED D8      //LED segnalazione velocità (PWM) pin 10(era pin 3)
#define BRAKELED D7      //LED segnalazione freno (PWM)    pin 9 (stessa posizione)
#define COMLED   D6      //LED segnalazione comunicazione  pin 8  (era pin 12)
#define DEBUG    D5      //pin debug 1=debug, 0= no debug  pin 7  (era pin 6)

//definizioni costanti
#define TBASE 1000000L  //time base 1 secondo per calcolo velocità

//variabili globali
volatile long counter;      //contatore impulsi
long startTBase;            //t iniziale per base dei tempi calcolo velocità
int bkspeed;                 //misura ingresso velocità
int pend;                   //valore pendenza in %
int brake;                  //valore uscita di frenata
int debug;                  //stato di debug
char txBuf[]="V00";         //buffer di trasmissione
int  txBufLen=sizeof(txBuf);//lunghezza del buffer di tx
char rxBuf[]="00";          //buffer di ricezione
int  rxBufLen=sizeof(rxBuf);
int  nRxChar;

void setup() {
  //apre console 
  Serial.begin(250000);
  delay(10);

 //configura I/O
  pinMode(BKSPEED,INPUT);
  pinMode(SPEEDLED, OUTPUT);
  analogWrite(SPEEDLED,LOW);
  pinMode(BRAKE,OUTPUT);
  analogWrite(BRAKE,LOW);
  pinMode(BRAKELED,OUTPUT);
  digitalWrite(BRAKELED,LOW);
  pinMode(COMLED,OUTPUT);
  digitalWrite(COMLED,LOW);
  pinMode(DEBUG,INPUT_PULLUP);

  //inizializza variabili di stato
  bkspeed=0;
  pend=0;
  brake=0;

  //imposta debug (logica negativa 1=no, 0=si)
  debug=!digitalRead(DEBUG);
  //TEMPORANEO!!!
  debug=1;
  //FINE TEMPORANEO!!!
  if(debug){
    Serial.println("Controller 2CW Debug mode");
  }

  //inizializza timers
  startTBase=micros();

  // Connect to Wi-Fi network
  if(debug){
    Serial.println();
    Serial.println();
    Serial.print("Connecting to...");
    Serial.println(ssid);
  }  
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    if(debug) {
      Serial.print(".");
    }
  }
  if(debug){
    Serial.println("");
    Serial.println("Wi-Fi connected successfully");
  }

  //avvia contatore ed interrupt
  counter=0;
  attachInterrupt(digitalPinToInterrupt(BKSPEED), rising, RISING);
}

//ISR sul fronte positivo del segnale SPEED: incrementa contatore e diagnostica
void rising() {
  counter=counter+1;        //conta impulso
  //digitalWrite(SPEEDLED,HIGH);
  attachInterrupt(digitalPinToInterrupt(BKSPEED), falling, FALLING);
}

//ISR sul fronte positivo del segnale SPEED: solo diagnostica
void falling() {
  //digitalWrite(SPEEDLED,LOW);
  attachInterrupt(digitalPinToInterrupt(BKSPEED), rising, RISING);
}

void loop() {
  
  //gestione velocità  trasmissione e ricezione
  if(micros()-startTBase>= TBASE) {   //verifica se time base 1S scaduto
    int c=constrain(counter,0,86);    //limita conteggio in range
    bkspeed=map(c,0,86,0,39);       //converte in velocità [km/h]  
    int speedLed=map(bkspeed,0,39,0,255);
    analogWrite(SPEEDLED,speedLed);  
    startTBase=micros();              //riavvia timebase
    counter=0;                        //resetta contatore impulsi
    digitalWrite(COMLED,HIGH);        //diagnostica on
    snprintf(txBuf,txBufLen, "V%02d", bkspeed);
    Udp.beginPacket(remoteIP,remotePort);
    Udp.write(txBuf,txBufLen);
    int ris=Udp.endPacket();
    digitalWrite(COMLED,LOW);         //diagnostica off
  }
  //ricezione
  if(Udp.parsePacket()>0) {
    nRxChar=Udp.read(rxBuf,rxBufLen);
    if(debug){
      rxBuf[rxBufLen]=0;
      Serial.print(nRxChar);
      Serial.print(" ");
      Serial.println(rxBuf);
    }
    if(nRxChar>0){
      if((rxBuf[0]>='0')&&(rxBuf[0]<='9')){
        pend=(rxBuf[0] & 0x0F)*10;
      }
      if((rxBuf[1]>='0')&&(rxBuf[1]<='9')){
        pend=pend+ (rxBuf[1] & 0x0F);
      }      
    }  
  }
    
  //attuazione freno
  if(bkspeed<=1){                       //per sicurezza spegne freno se rullo fermo
    pend=0;
  }
  pend=constrain(pend,0,20);          //in range 0-20%
  brake=map(pend,0,20,0,255);         //proporzionale al pwm 0-255
  analogWrite(BRAKE,brake);           //attua freno 
  analogWrite(BRAKELED,brake);        //diagnostica locale
}
