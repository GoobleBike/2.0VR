//The Gooble Bike 2.0VR!
//Plotter del sensore di velocità
//Basato su un Arduino UNO/Leonardo
//Acquisisce il segnale di velocità del trainer
//e lo rappresenta graficamente sul plotter seriale
//Segnali di I/O
//PIN D2 INGRESSO: onda quadra (duty cycle 50%) dal trainer
//Richiede la shield 485.
//Diagnostica locale
//PIN D9 USCITA: LED che replica il segnale di ingresso

//Definizione degli I/O
#define SPEED    2
#define SPEEDLED 9

void setup() {
  //apre console 
  Serial.begin(250000);
//  while(!Serial); //(solo per Leonardo)
  //configura I/O
  pinMode(SPEED,INPUT);
  pinMode(SPEEDLED, OUTPUT);
//  attachInterrupt(digitalPinToInterrupt(SPEED), rising, RISING);
}

////ISR sul fronte positivo del segnale SPEED
//void rising() {
//  Serial.println(HIGH);
//  digitalWrite(SPEEDLED,HIGH);
//  attachInterrupt(digitalPinToInterrupt(SPEED), falling, FALLING);
//}

////ISR sul fronte negativo del segnale SPEED
//void falling(){
//  Serial.println(LOW);
//  digitalWrite(SPEEDLED,LOW);
//  attachInterrupt(digitalPinToInterrupt(SPEED), rising, RISING);  
//}

void loop() {
  int speed=digitalRead(SPEED);
  digitalWrite(SPEEDLED,speed);
  Serial.println(speed);
  delayMicroseconds(400);
}
