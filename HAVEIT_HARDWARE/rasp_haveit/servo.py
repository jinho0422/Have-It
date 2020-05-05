import RPi.GPIO as gpio
import time

pin1 = 18 # PWM pin num 18
pin2 = 13 # PWM pin num 18
switch = 21
switch1 = 23

gpio.setmode(gpio.BCM)

gpio.setup(switch, gpio.IN, pull_up_down=gpio.PUD_DOWN)
gpio.setup(switch1, gpio.IN, pull_up_down=gpio.PUD_DOWN)

gpio.setup(pin1, gpio.OUT)
gpio.setup(pin2, gpio.OUT)

val = 1
inc = 0.1

try :

    while True :

        gpio.output(pin1, False)
        gpio.output(pin2, False)

        time.sleep(0.5)

        gpio.output(pin1, True)
        gpio.output(pin2, True)

        time.sleep(0.5)

        val += inc
        #time.sleep(0.5)

        if val > 2 or val < 0.6 :
            inc *= -1
        
        if gpio.input(21) == 0:
            break
        if gpio.input(23) == 0:
            break

except KeyboardInterrupt :

    gpio.cleanup()

