import I2C_LCD_driver
import RPi.GPIO as GPIO
from time import *

led = 17

lcd = I2C_LCD_driver.lcd()
lcd.lcd_clear()

GPIO.setmode(GPIO.BCM)
GPIO.setup(led, GPIO.OUT)


if GPIO.input(17) == 0:
    now = localtime()
    dt = "%04d-%02d-%02d"%(now.tm_year, now.tm_mon, now.tm_mday)
    lcd.lcd_display_string(dt,1)
    
    while 1:
        
        if GPIO.input(17) == 1:
            sleep(0.1)
            break
        now1 = localtime()
        tt = "%02d:%02d:%02d"%(now1.tm_hour,now1.tm_min, now1.tm_sec)
        lcd.lcd_display_string(tt,2)
        sleep(1)

    

