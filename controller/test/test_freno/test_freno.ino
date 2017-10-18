//The Gooble Bike 2.0VR!
//Test freno
//Basato su un Arduino UNO/Leonardo
//Acquisisce il segnale di velocità del trainer
//ed attua un segnale di frenata proporzionale alla velocità
//Segnali di I/O
//PIN D2 INGRESSO: onda quadra (duty cycle 50%) dal trainer
//Richiede la shield 485.
//Diagnostica locale
//PIN D9 USCITA: LED che replica il segnale di ingresso
//PIN D5 USCITA: BRAKE proporzionale alla velocità
//PIN D3 USCITA: LED che replica il segnale di BRAKE

//Definizione degli I/O
#define SPEED    2
#define SPEEDLED 9
#define BRAKE    5
#define BRAKELED 3

//variabili globali
volatile long startTBase;
volatile long counter;
 
void setup() {
  //apre console 
  Serial.begin(250000);
  //configura I/O
  pinMode(SPEED,INPUT);
  pinMode(SPEEDLED, OUTPUT);
  pinMode(BRAKE,OUTPUT);
  analogWrite(BRAKE,LOW);
  //avvia contatore ed interrupt
  startTBase=micros();
  counter=0;
  attachInterrupt(digitalPinToInterrupt(SPEED), rising, RISING);
}

////ISR sul fronte positivo del segnale SPEED
void rising() {
  counter=counter+1;
  digitalWrite(SPEEDLED,HIGH);
  attachInterrupt(digitalPinToInterrupt(SPEED), falling, FALLING);
}

////ISR sul fronte positivo del segnale SPEED
void falling() {
  digitalWrite(SPEEDLED,LOW);
  attachInterrupt(digitalPinToInterrupt(SPEED), rising, RISING);
}

void loop() {
  //stampa e resetta il contatore ogni secondo
  if(micros()-startTBase> 1000000L) {
    int vel=map(counter,0,86,0,39);
    int brk=map(counter,0,86,0,255);
    analogWrite(BRAKELED,brk);
    Serial.print(vel);
    Serial.print(" km/h ");
    Serial.print(brk);
    Serial.println("/255");
    startTBase=micros();
    counter=0;
  }
}
