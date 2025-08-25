// Quiz Application Arduino Controller - No Push Button Version
// Controls LEDs and buzzer for quiz feedback

// Pin definitions
const int GREEN_LED = 3;
const int RED_LED = 5;
const int YELLOW_LED = 6;
const int BUZZER = 9;

// State variables
bool quizActive = false;

void setup() {
  // Initialize pins
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
  // Initialize serial communication
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect
  }

  
  // Initial LED test sequence
  testLeds();
  
  Serial.println("QUIZ_READY");
}

void loop() {
  // Read serial commands
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    processCommand(command);

  }
}

void processCommand(String command) {
  if (command == "QUIZ_STARTED") {
    quizActive = true;
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    playTone(1000, 200);
    Serial.println("ACK_QUIZ_STARTED");
  }
  else if (command == "CORRECT_ANSWER") {
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    playTone(1500, 300);
    blinkLed(GREEN_LED, 3, 200);
    Serial.println("ACK_CORRECT");
  }
  else if (command == "WRONG_ANSWER") {
    digitalWrite(RED_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    playTone(200, 1000);
    blinkLed(RED_LED, 3, 200);
    Serial.println("ACK_WRONG");
  }
  else if (command == "TIME_WARNING") {
    digitalWrite(YELLOW_LED, HIGH);
    playTone(1000, 100);
    blinkLed(YELLOW_LED, 5, 100);
    Serial.println("ACK_TIME_WARNING");
  }
  else if (command == "QUIZ_PASSED") {
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    victorySequence();
    Serial.println("ACK_PASSED");
    quizActive = false;
  }
  else if (command == "QUIZ_FAILED") {
    digitalWrite(RED_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    failureSequence();
    Serial.println("ACK_FAILED");
    quizActive = false;
  }
  else if (command == "S") {
    // Status request
    Serial.println("ARDUINO_READY");
  }
  else if (command == "TEST_BUZZER") {
    // Manual buzzer test
    testBuzzer();
    Serial.println("BUZZER_TESTED");
  }
}

void testLeds() {
  // Test sequence for LEDs
  digitalWrite(GREEN_LED, HIGH);
  delay(300);
  digitalWrite(GREEN_LED, LOW);
  
  digitalWrite(RED_LED, HIGH);
  delay(300);
  digitalWrite(RED_LED, LOW);
  
  digitalWrite(YELLOW_LED, HIGH);
  delay(300);
  digitalWrite(YELLOW_LED, LOW);
  
  // Test buzzer
  testBuzzer();
}

void testBuzzer() {
  // Comprehensive buzzer test
  Serial.println("Testing buzzer...");
  
  // Test 1: Simple tone
  tone(BUZZER, 1000, 200);
  delay(300);
  
  // Test 2: Different frequency
  tone(BUZZER, 1500, 200);
  delay(300);
  
  // Test 3: Another frequency
  tone(BUZZER, 2000, 200);
  delay(300);
  
  // Test 4: Melody
  int melody[] = {262, 294, 330, 349, 392, 440, 494, 523};
  for (int i = 0; i < 8; i++) {
    tone(BUZZER, melody[i], 100);
    delay(120);
  }
  
  noTone(BUZZER);
  Serial.println("Buzzer test complete");
}

void playTone(int frequency, int duration) {
  if (frequency <= 0) {
    noTone(BUZZER);
    return;
  }
  
  tone(BUZZER, frequency, duration);
  delay(duration); // Wait for the tone to finish
  noTone(BUZZER); // Ensure tone stops
}

void blinkLed(int ledPin, int times, int delayTime) {
  for (int i = 0; i < times; i++) {
    digitalWrite(ledPin, HIGH);
    delay(delayTime);
    digitalWrite(ledPin, LOW);
    if (i < times - 1) delay(delayTime); // Don't delay after last blink
  }
}

void victorySequence() {
  // Celebration sequence for passing the quiz
  for (int i = 0; i < 5; i++) {
    digitalWrite(GREEN_LED, HIGH);
    playTone(1500 + (i * 100), 100);
    digitalWrite(GREEN_LED, LOW);
    delay(150);
  }
  
  // Final celebratory tone
  playTone(2000, 300);
  digitalWrite(GREEN_LED, HIGH);
}

void failureSequence() {
  // Disappointment sequence for failing the quiz
  for (int i = 0; i < 3; i++) {
    digitalWrite(RED_LED, HIGH);
    playTone(500, 300);
    digitalWrite(RED_LED, LOW);
    delay(500);
  }
  
  digitalWrite(RED_LED, HIGH);
}

/*int buzzerPin = 9; // Connect buzzer + to pin 9, - to GND

void setup() {
  pinMode(buzzerPin, OUTPUT); 
}

void loop() {
  digitalWrite(buzzerPin, HIGH); // Send 5V
  delay(1000);                   // Wait 1 second
  digitalWrite(buzzerPin, LOW);  // Turn off (0V)
  delay(1000);                   // Wait 1 second
}*/


