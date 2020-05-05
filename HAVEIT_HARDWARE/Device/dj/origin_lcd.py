import I2C_LCD_driver
import RPi.GPIO as GPIO
from time import *
import sys
switch = 21
led = 17
mylcd = I2C_LCD_driver.lcd()
c = 0

GPIO.setmode(GPIO.BCM)
GPIO.setup(switch, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(led, GPIO.OUT)


GPIO.output(17, 0)

try:
    mylcd.lcd_clear()
    f = open('data.txt', "r")
    GPIO.output(17, 1)
    
    while 1:
        mylcd.lcd_display_string(f.read(),1)
        sleep(0.2)
        c = c + 0.2
        
        if c >= 10:
            break


        if GPIO.input(21) == 0:
            f.close()
            GPIO.output(17, 0)
            sleep(0.1)
            if GPIO.input(17) == 0:
                break
except KeyboardInterrupt:
    mylcd.lcd_clear()

import clock
while 1:
    if GPIO.input(21) == 0:
        GPIO.output(17, 0)
        mylcd.lcd_clear()
        if GPIO.input(17) == 0:
            import clock
            
