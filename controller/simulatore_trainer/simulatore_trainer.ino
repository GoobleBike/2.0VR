//The Gooble Bike 2.0VR!
//Simulatore trainer
//Simula su un Arduino UNO/Leonardo gli I/O di un trainer Elite
//Collegato ad un Controller Gooble Bike consente di simulare
//la presenza di una bicicletta montata sul trainer
//Segnali di I/O
//PIN D2 USCITA: onda quadra (duty cycle 50%) che simula il segnale di velocità da collegare al D2 del controller (senza I/F 485) 
//PIN D5 INGRESSO: segnale PWM di comando del freno EM da collegare al D5 del controller  (senza I/F 485) 
//N.B. i pin hanno la stessa posizione e significato dei rispettivi pin del controller
//     ma essendo il simulatore le direzioni dei segnali sono invertite.
//Diagnostica locale
//PIN D3 USCITA: LED che replica il segnale di ingresso sul pin D5 (ingresso del freno)
//PIN D9 USCITA: LED che replica il segnale di uscita   sul pin D9 (uscita della velocità)
//Console
//Il monitor seriale consente di modificare a step il numero di imp/sec inviati sul segnale di velocità
//Inserire nell casella di ingresso una singola cifra da 0 a 9 e premere invio.
//0=>fermo,1=1 imp/s,2=2 imp/s,3=4 imp/s,4=8 imp/s,5=16 imp/s,6=32 imp/s,7=64 imp/s,8=86 imp/s,9=128 imp/s
//nella casella di uscita viene restituito il valore di semiperiodo impostato in mS o 0 in caso di fermo
//il valore di default all'avvio è 0
//le frequenze impostate corrispondono alle seguenti velocità di avanzamento:
//0=>fermo,1=0,5 km/h,2=1 km/h,3=1,8 km/h,4=3,6 km/h,5=7,2 km/h,6=14,5 km/h,7=30 km/h,8=38 km/h,9=58 km/h
//il valore di 38 km/h (86 imp/s) è il massimo che ci si può aspettare in una configurazione reale.
//baudrate = 250.000
//6/10/2017 iDP

//Definizione degli I/O
#define SPEED 2
#define BRAKE 5
#define SPEEDLED 9
#define BRAKELED 3

//variabili di stato globali
long start;       //istante di inizio del semiperiodo
long duration;    //durata di un semiperiodo (0=fermo)
int speedStatus;  //stato dell'impulso di velocità

void setup() {
  //apre console 
  Serial.begin(250000);
  while(!Serial); //(solo per Leonardo)
  //configura I/O
  pinMode(SPEED,OUTPUT);
  pinMode(BRAKE,INPUT);
  pinMode(SPEEDLED,OUTPUT);
  pinMode(BRAKELED,OUTPUT);
  //inizializza variabili di stato
  start=millis();
  duration=0;
  speedStatus=LOW;
}

void loop() {
  //Lettura non sospensiva della console ed eventuale cambio della frequenza
  if(Serial.available()> 0){  //solo se ci sono caratteri nel buffer di ricezione
    int consoleIn=Serial.read();
    //interpreta carattere: i caratteri accettati sono 0-9 (0x30-0x39) e newline (0x0A)
    switch(consoleIn) {
      case '0':   //fermo
        duration=0;
        break;
      case '1':   //1 imp/s
        duration=500;
        break;
      case '2':   //2 imp/s
        duration=250;
        break;
      case '3':   //4 imp/s
        duration=125;
        break;
      case '4':   //8 imp/s
        duration=62;
        break;
      case '5':   //16 imp/s
        duration=31;
        break;
      case '6':   //32 imp/s
        duration=15;
        break;
      case '7':   //64 imp/s
        duration=8;
        break;
      case '8':   //86 imp/s
        duration=6;
        break;
      case '9':   //128 imp/s
        duration=4;
        break;
      case '\n': //sul newline eco del semiperiodo impostato
        Serial.println(duration);    
        break;  
    }
  }
  //generazione non sospensiva dell'onda quadra
  if (duration==0) { //uscita a 0
    digitalWrite(SPEED,LOW);
    digitalWrite(SPEEDLED,LOW);
  }
  else { //generazione onda quadra
    if(millis()-start > duration) { //semionda terminata cambia stato e inizia nuova semionda
      start=millis();                     //ricalcola istante iniziale
      speedStatus=!speedStatus;           //commuta stato segnale
      digitalWrite(SPEED,speedStatus);    //emette segnale variato
      digitalWrite(SPEEDLED,speedStatus);  
    }
  }
  //lettura segnale freno
  int brakeStatus=digitalRead(BRAKE);
  digitalWrite(BRAKELED,brakeStatus);
}

