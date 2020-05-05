 

import RPi.GPIO as GPIO
import time

pin = 18 # PWM pin num 18
switch = 21
switch1 = 23

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)

GPIO.setup(switch, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(switch1, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

p = GPIO.PWM(pin, 50)
p.start(0)
cnt = 0
c = 0

try: 
    while 1:
        p.ChangeDutyCycle(3)
        time.sleep(0.5)
        p.ChangeDutyCycle(12)
        time.sleep(0.5)
        p.ChangeDutyCycle(7.5)
        time.sleep(0.5)
        c = c + 0.3
        #if c >= 10:
        #    break

        #if GPIO.input(21) == 0:
        #    break
        #if GPIO.input(23) == 0:
        #    break

            
except KeyboardInterrupt:
    p.stop()
    GPIO.cleanup()

