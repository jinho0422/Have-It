import I2C_LCD_driver
import RPi.GPIO as GPIO
from time import *

led = 17
switch = 21
lcd = I2C_LCD_driver.lcd()
lcd.lcd_clear()

GPIO.setmode(GPIO.BCM)
GPIO.setup(led, GPIO.OUT)
GPIO.setup(switch, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

if GPIO.input(17) == 1:
    while 1:
        

        if GPIO.input(21) == 0:
            GPIO.output(17,0)

        now = localtime()
        dt = "%04d-%02d-%02d"%(now.tm_year, now.tm_mon, now.tm_mday)
        tt = "%02d:%02d:%02d"%(now.tm_hour,now.tm_min, now.tm_sec)
        lcd.lcd_display_string(dt,1)
        lcd.lcd_display_string(tt,2)
        sleep(1)

        if GPIO.input(17) == 0:
            import clock
            break
