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
//PIN D5 USCITA: BRAKE forzato a 0

//Definizione degli I/O
#define SPEED    2
#define SPEEDLED 9
#define BRAKE    5

void setup() {
  //apre console 
  Serial.begin(250000);
  //configura I/O
  pinMode(SPEED,INPUT);
  pinMode(SPEEDLED, OUTPUT);
  pinMode(BRAKE,OUTPUT);
  analogWrite(BRAKE,LOW);
}

void loop() {
  int speed=digitalRead(SPEED);
  digitalWrite(SPEEDLED,speed);
  Serial.println(speed);
  delayMicroseconds(400);
}
