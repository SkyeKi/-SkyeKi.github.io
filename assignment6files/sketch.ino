const int numReadings = 10;

int readings[numReadings];
int readIndex = 0;
int total = 0;
int average = 0;

const int UpDown = 9;
const int LeftRight = 10;
const int lEDPin = 11;
long duration;

void setup()
{
  Serial.begin(9600);
  Serial.setTimeout(10);
  pinMode(lEDPin, Output);
  pinMode(UpDown, INPUT); // Sets the trigPin as an Output
  pinMode(LeftRight, INPUT);  // Sets the echoPin as an Input
}

void loop()
{
  Serial.print(analogRead(UpDown));
  Serial.print(",");
  Serial.print(analogRead(LeftRight));
  if(Serial.available()>0){
    int inByte = Serial.read();
    analogWrite(lEDPin,inByte)
  }
}