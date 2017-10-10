//The Gooble Bike 2.0VR!
//Misuratore di semiperiodi
//Basato su un Arduino UNO/Leonardo
//Acquisisce il segnale di velocità del trainer
//e determina la durata dei semiperiodi ON e OFF
//Segnali di I/O
//PIN D2 INGRESSO: onda quadra (duty cycle 50%) dal trainer
//Richiede la shield 485.
//Diagnostica locale
//PIN D9 USCITA: LED che replica il segnale di ingresso

//Definizione degli I/O
#define SPEED    2
#define SPEEDLED 9

//variabili globali
volatile long startON;
volatile long startOFF;
volatile long durationON;
volatile long durationOFF;
 
void setup() {
  //apre console 
  Serial.begin(250000);
  //configura I/O
  pinMode(SPEED,INPUT);
  pinMode(SPEEDLED, OUTPUT);
  startON=micros();
  startOFF=micros();
  durationON=0;
  durationOFF=0;
  attachInterrupt(digitalPinToInterrupt(SPEED), rising, RISING);
}

////ISR sul fronte positivo del segnale SPEED
void rising() {
  long now=micros();
  durationOFF=now-startOFF;
  startON=now;
  digitalWrite(SPEEDLED,HIGH);
  attachInterrupt(digitalPinToInterrupt(SPEED), falling, FALLING);
}

////ISR sul fronte negativo del segnale SPEED
void falling(){
  long now=micros();
  durationON=now-startON;
  startOFF=now;
  digitalWrite(SPEEDLED,LOW);
  attachInterrupt(digitalPinToInterrupt(SPEED), rising, RISING);  
}

void loop() {
  delay(1000);
  float don=((float)durationON)/1000;
  float dof=((float)durationOFF)/1000;
  Serial.print("H:");
  Serial.print(don,3);
  Serial.print(" L:");
  Serial.println(dof,3);
}
