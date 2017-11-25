//The Gooble Bike 2.0VR!
//Versione AY
//HW Arduino Yun/Leonardo
//Campiona la velocità con interrupt (senza filtri antirimbalzo)
//Campiona il valore analogico dello sterzo
//Trasmette i dati su USB ogni 250 mS
//Riceve la pendenza da USB ogni 250 mS
//Attua la pendenza
//Segnali di I/O
//PIN D2 INGRESSO: onda quadra (duty cycle 50%) dal trainer
//PIN A0 INGRESSO: angolazione dello sterzo valore analogico 0-1023
//PIN D5 USCITA: intensità di frenata PWM 0-255
//Richiede la shield 485.
//Diagnostica locale
//PIN D9 USCITA: LED che indica la frenata
//PIN D3 USCITA: LED che indica la velocità
//PIN D12 USCITA: LED che segnala la comunicazione
//non c'è diagnostica seriale perchè i lcanale è occupato dalla comunicazione
//14/11/2017

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
char txBuf[]="00 +000";     //buffer di trasmissione
int txBufLen=sizeof(txBuf); //dimensione del buffer di trasmissione

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
  
  //invio dati
  if(micros()-startTSend>= TSEND) {   //verifica se time base 250 mS scaduto
    startTSend=micros();              //riavvia timebase
    snprintf(txBuf,txBufLen, "%02d %+04d", bkspeed,angle);
    if(Serial.availableForWrite()>10) { //verifica se canale disponibile
      digitalWrite(COMLED,HIGH);        //diagnostica on
      Serial.println(txBuf);              //invia messaggio "## ###CRLF"
      digitalWrite(COMLED,LOW);         //diagnostica off
    }  
  }
  
  //ricezione dati
  if(Serial.available()> 0){          //verifica se carattere in attesa di lettura
    int consoleIn=Serial.read();      //leggi carattere
    switch(rxStatus){                 //automa ricezione
      case WT_1ST_CH:                 //attesa 1° ch
        if((consoleIn >='0')&&(consoleIn<='9')){ //se 0-9 
          digitalWrite(COMLED,HIGH);              
          rxValue=(consoleIn & 0x0F)*10;        //memorizza centinaia in valore ricevuto 
          rxStatus=WT_2ND_CH;                    //passa ad attesa 2° ch 
        }
        else {                                   //qualunque altro ch: rimani in attesa 1° ch 
          digitalWrite(COMLED,LOW);          
        }
        break;
      case WT_2ND_CH:                 //attesa 2° ch
        if((consoleIn >='0')&&(consoleIn<='9')){ //se 0-9
          digitalWrite(COMLED,HIGH);
          rxValue+=consoleIn & 0x0F;        //aggiungi decine a valore ricevuto
          rxStatus=WT_CR;                    //passa ad attesa 3° ch 
        }
        else {                                   //qualunque altro ch: torna in attesa 1° ch 
          digitalWrite(COMLED,LOW);          
          rxStatus=WT_1ST_CH;          
        }
        break;
      case WT_CR:                     //attesa CR
        if(consoleIn ==0x0D){         //se CR
          digitalWrite(COMLED,HIGH);
          rxStatus=WT_LF;             //passa ad attesa LF
        }
        else {                        //qualunque altro ch: torna in attesa 1° ch 
          digitalWrite(COMLED,LOW);
          rxStatus=WT_1ST_CH;          
        }      
        break;
      case WT_LF:                     //attesa LF
        if(consoleIn ==0x0A){         //se LF
          pend=rxValue;              //aggiorna valore di pendenza
        }
        rxStatus=WT_1ST_CH;           //passa ad attesa 1° ch
        digitalWrite(COMLED,LOW);    
        break;
      default:                        //non dovrebbe accadere: torna in attesa 1° ch
        digitalWrite(COMLED,LOW);
        rxStatus=WT_1ST_CH;          
        break;     
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
