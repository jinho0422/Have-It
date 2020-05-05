import I2C_LCD_driver
import RPi.GPIO as GPIO
from time import *

switch = 21
mylcd = I2C_LCD_driver.lcd()

GPIO.setmode(GPIO.BCM)
GPIO.setup(switch, GPIO.IN)

try:
    f = open('data.txt',"r")
    data=f.read()
    while 1:
        mylcd.lcd_display_string(data,1)

        if GPIO.input(21) == 0:
            mylcd.lcd_clear()
            f.close()
            break
except KeyboardInterrupt:
    now = localtime()
    dt = "%04d-%02d-%02d"%(now.tm_year, now.tm_mon, now.tm_mday)
    tt = "%02d:%02d:%02d"%(now.tm_hour, now.tm_min, now.tm_sec)
    mylcd.lcd_display_string(dt, 1)
    mylcd.lcd_display_string(tt, 2)

