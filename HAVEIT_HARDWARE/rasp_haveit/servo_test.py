import RPi.GPIO as GPIO
import time

pin1 = 18 # PWM pin num 18
pin2 = 13 # PWM pin num 18
switch = 21
switch1 = 23

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin1, GPIO.OUT)
GPIO.setup(pin2, GPIO.OUT)

GPIO.setup(switch, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(switch1, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

p1 = GPIO.PWM(pin1, 50)
p2 = GPIO.PWM(pin2, 50)
p1.start(0)
p2.start(0)
cnt = 0
c = 0

try: 
    while 1:
        print(c)
        p1.ChangeDutyCycle(1)
        p2.ChangeDutyCycle(1)
        time.sleep(0.1)
        p1.ChangeDutyCycle(3)
        p2.ChangeDutyCycle(3)
        time.sleep(0.1)
        p1.ChangeDutyCycle(5)
        p2.ChangeDutyCycle(5)
        time.sleep(0.1)
        c = c + 0.3
        if c >= 10:
            break

        # if GPIO.input(21) == 0:
        #     break
        # if GPIO.input(23) == 0:
        #     break

            
except KeyboardInterrupt:
    # p1.ChangeDutyCycle(0)
    # p2.ChangeDutyCycle(1)
    print('ke')
    p1.stop()
    p2.stop()
    GPIO.cleanup()

