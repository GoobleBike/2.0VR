//The Gooble Bike 2.0VR!
//Versione CW 
//HW Wemos D1 mini
//Campiona l'angolo del manubrio
//Trasmette la velocità su UDP
//Segnali di I/O
//PIN A0 INGRESSO: ingresso analogico dal potenziometro 0-3,3V convertito in 0-1023 e mappato in -135/+135
//PIN D8 INGRESSO: debug 1= debug 0= no debug (default pulldown=no debug)
//Diagnostica locale
//PIN BUILTIN_LED USCITA: LED che segnala la comunicazione
//Diagnostica su seriale se debug abilitato
//14/11/2017
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
//SSID of your network
char ssid[] = "gooble"; //MFR Wi-Fi router
char pass[] = "Loop-Gooble"; //Password MFR Wi-Fi router

int remotePort = 40000;                   //Porta di servizio
//IPAddress remoteIP={nnn,nnn,nnn,nnn};        //Numero IP of your Server
IPAddress remoteIP={192,168,1,102};  //Numero IP Server
WiFiUDP Udp;

//range del potenziometro
#define MIN_INP  0
#define MAX_INP  1024
#define MIN_OUT  +180 //-135
#define MAX_OUT  -180
#define OFFSET  0

//Definizione pin
#define DEBUG D8

//definizioni costanti
#define TBASE 250000L  //time base 250 mS per il campionamento dell'angolo

//variabili globali
long startTBase;            //t iniziale per base dei tempi calcolo velocità
int inValue;                //misura del pot
int angValue;               //misura angolare in gradi
char txBuf[]="A+000\r\n";     //buffer di trasmissione
int  txBufLen=sizeof(txBuf);
int ris;
int debug;

void setup(){
  
  //apre console 
  Serial.begin(250000);
  delay(2000);

  //configura I/O
  pinMode(BUILTIN_LED,OUTPUT);
  pinMode(DEBUG,INPUT);

  //imposta debug (logica positiva 1=si, 0=no)
  debug=digitalRead(DEBUG);
  //TEMPORANEO!!!
  debug=1;
  //FINE TEMPORANEO!!!
  if(debug){
    Serial.println("Pot 2CW debug mode");
  } 
  // Connect to Wi-Fi network
  if(debug){
    Serial.println();
    Serial.println();
    Serial.print("Connecting to...");
    Serial.println(ssid);
  }
    
  if(WiFi.status()!=WL_CONNECTED) {
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
  }
  else {
    if(debug){
      Serial.println("");
      Serial.println("Wi-Fi already connected");
    } 
  }

}

void loop () {
  //campionamento e trasmissione
  if(micros()-startTBase>= TBASE) {   //verifica se time base 1S scaduto
    digitalWrite(BUILTIN_LED,LOW);
    startTBase=micros();              //riavvia timebase
    inValue=analogRead(A0);
    angValue=map(inValue,MIN_INP,MAX_INP,MIN_OUT,MAX_OUT);
    angValue=angValue+OFFSET;
    if(debug){
      Serial.print(inValue);
      Serial.print(" ");
      Serial.println(angValue);
    }
    //trasmissione
    Udp.beginPacket(remoteIP,remotePort);
    snprintf(txBuf,sizeof(txBuf), "A%+04d\r\n",angValue);
    Udp.write(txBuf,sizeof(txBuf));
    ris=Udp.endPacket();
    digitalWrite(BUILTIN_LED,HIGH);
    if(debug){
      Serial.println(txBuf);
      if (ris==1) {
        Serial.println("tx ok");
      }
      else {
        Serial.println("tx fault");    
      }
    }      
  }  
}

