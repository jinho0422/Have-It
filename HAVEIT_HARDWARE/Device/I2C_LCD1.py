import I2C_LCD_driver
import RPi.GPIO as GPIO
from time import *
import sys

mylcd = I2C_LCD_driver.lcd()
switch = 21
led = 17

GPIO.setmode(GPIO.BCM)
GPIO.setup(switch, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(led, GPIO.OUT)
GPIO.output(17, 0)
print(sys.argv[1])

try:
    GPIO.output(17, 0)
    sleep(0.5)
    #f = open('data.txt','r')
    #data=f.read()
    c = 0
    mylcd.lcd_clear()
    sleep(0.2)
    while 1:
        GPIO.output(17, 1)
        #mylcd.lcd_display_string(f.read(), 1)
        mylcd.lcd_display_string(sys.argv[1], 1)
        sleep(0.2)
        c = c + 0.2
        if c >= 10:
            if GPIO.input(21) == 1:
                #f.close()
                GPIO.output(17, 0)
                sleep(0.2)
                if GPIO.input(17) == 0:
                    GPIO.output(17, 1)
                    import clock1
            break
        if GPIO.input(21) == 0:
            GPIO.output(17, 0)
            #f.close()
            sleep(0.2)
            if GPIO.input(17) == 0:
                import clock
                break
except KeyboardInterrupt:
    mylcd.lcd_clear()
