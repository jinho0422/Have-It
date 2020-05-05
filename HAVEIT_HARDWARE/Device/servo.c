#include <stdio.h>
#include <wiringPi.h>
#include <softPwm.h>
#include <stdlib.h>

#define PIN 1



int main()
{

  if (wiringPiSetup() == -1) 
     exit (1) ;
  
  pinMode(PIN, PWM_OUTPUT);

  pwmSetMode(PWM_MODE_MS); 

  pwmSetClock(384);
  pwmSetRange(1000);


  // pwmWrite(PIN, 500 ); 
  // sleep(1);

  // pwmWrite(PIN, 30);
  // sleep(1);

  // pwmWrite(PIN, 0 ); 
  // sleep(1);


  // float val;

  while(1){
  
    // printf("(30~75~120)= ");
    // scanf("%f", &val);
    
    // if ( val == -1 ) break;
    
    // pwmWrite(PIN, val );
    // sleep(1);

      pwmWrite(PIN, 250 ); 
  sleep(1);

  pwmWrite(PIN, 30);
  sleep(1);

  pwmWrite(PIN, -250 ); 
  sleep(1);
  }
  
  return 0 ;
}
