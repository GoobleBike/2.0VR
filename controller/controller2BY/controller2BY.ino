//The Gooble Bike 2.0VR!
//Versione BY (Yun)
//Campiona la velocità con interrupt (senza filtri antirimbalzo)
//Campiona il valore analogico dello sterzo
//Trasmette i dati su UDP via Bridge
//Riceve la pendenza da UDP via Bridge
//Attua la pendenza
//Segnali di I/O
//PIN D2 INGRESSO: onda quadra (duty cycle 50%) dal trainer
//PIN A0 INGRESSO: angolazione dello sterzo valore analogico 0-1023
//PIN D5 USCITA: intensità di frenata PWM 0-255
//Richiede la shield 485.
//Diagnostica locale
//PIN D9 USCITA: LED che indica la velocità
//PIN D3 USCITA: LED che indica la frenata
//PIN D12 USCITA: LED che segnala la comunicazione
//8/11/2017
#include <Bridge.h>
#include <stdio.h>
//Definizione degli I/O
#define BKSPEED  2      //segnale di ingresso velocità
#define BRAKE    5      //segnale di uscita freno
#define SPEEDLED 3      //LED segnalazione velocità
#define BRAKELED 9      //LED segnalazione freno
#define COMLED  12      //LED segnalazione comunicazione
#define POT     A0      //Potenziometro angolazione

//definizioni costanti
#define TBASE 1000000L  //time base 1 secondo per calcolo velocità
#define TSEND 250000L   //time base 250 mS per trasmissione
#define WT_1ST_CH 0     //automa rx: attesa primo carattere
#define WT_2ND_CH 1     //automa rx: attesa secondo carattere
#define WT_CR     2     //automa rx: attesa CR
#define WT_LF     3     //automa rx: attesa LF

//variabili globali
volatile long counter;      //contatore impulsi
long startTBase;            //t iniziale per base dei tempi calcolo velocità
long startTSend;            //t iniziale per base dei tempi comunicazione
int bkspeed;                  //misura ingresso velocità
int angle;                  //misura ingresso angolazione
int pend;                   //valore pendenza in %
int brake;                  //valore uscita di frenata
int rxStatus;               //stato automa ricezione
int rxValue;                //valore ricevuto 

void setup() {
  //apre console 
  Serial.begin(250000);
  Bridge.begin();
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
  //inizializza variabili di stato
  bkspeed=0;
  angle=0;
  pend=0;
  brake=0;
  rxStatus=WT_1ST_CH;
  rxValue=0;
  //inizializza timers
  startTSend=micros();
  startTBase=micros();
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
  //gestione velocità
  if(micros()-startTBase>= TBASE) {   //verifica se time base 1S scaduto
    int c=constrain(counter,0,86);    //limita conteggio in range
    bkspeed=map(c,0,86,0,39);       //converte in velocità [km/h]  
    int speedLed=map(bkspeed,0,39,0,255);
    analogWrite(SPEEDLED,speedLed);  
    startTBase=micros();              //riavvia timebase
    counter=0;                        //resetta contatore impulsi
  }
  
  //gestione angolo
  int a=analogRead(A0);               //legge valore analogico
  angle=map(a,0,1023,-135,135);       //converte in angolo [gradi]
  
  //invio/ricezione dati
  if(micros()-startTSend>= TSEND) {   //verifica se time base 250 mS scaduto
    startTSend=micros();              //riavvia timebase
    digitalWrite(COMLED,HIGH);        //diagnostica on
    char txBuf[10];
    sprintf(txBuf, "%02d %+04d", bkspeed,angle);
    Bridge.put("spdang",String(txBuf));
    char rxBuf[10];
    rxBuf[0]="0";
    rxBuf[1]="0";
    rxBuf[2]=0;
    int nchar=Bridge.get("slope",rxBuf,10);
    //pend=atoi(rxBuf);
    if((rxBuf[0]>="0")&&(rxBuf[0]<="9")){
      pend=(rxBuf[0] & 0x0F)*10;
    }
    if((rxBuf[1]>="0")&&(rxBuf[1]<="9")){
      pend=pend+ (rxBuf[1] & 0x0F);
    }
    digitalWrite(COMLED,LOW);         //diagnostica off
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
