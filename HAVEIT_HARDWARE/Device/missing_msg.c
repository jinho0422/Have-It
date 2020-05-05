#include <stdio.h>
#include <stdlib.h>
#include <wiringPi.h>
#include <unistd.h>
#define BUTTON 4 //21
#define LED 14 //27

int main(void)
{
    if(wiringPiSetup()==-1) {
	   return -1;
    }

	pinMode(BUTTON,INPUT);
	pinMode(LED, OUTPUT);
    digitalWrite(LED,HIGH);
	while(1)
	{
		if(digitalRead(BUTTON)==LOW){
			printf("Button was pressed !! \n");
			digitalWrite(LED, HIGH);
        }
		 else {
			printf("Button was NOT pressed !! \n");
			digitalWrite(LED, LOW);
         
		 }
		 sleep(1);
		
	}
	return 0;
}
