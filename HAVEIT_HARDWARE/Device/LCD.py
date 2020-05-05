import I2C_LCD_driver
import RPi.GPIO as GPIO
from time import *
import sys
import requests
import os


name=["dollId","notificationId","notiDetailId","time","is_done"]
url='http://a5b7bc3f.ngrok.io/rasp'
params={'dollId':'2',
'notificationId':'0',
 'notiDetailId':'0',
 'time':'',
 'is_done':'0'}

mylcd = I2C_LCD_driver.lcd()
switch = 21
switch1 = 23
led = 11
motor = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(switch, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(switch1, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(led, GPIO.OUT)
GPIO.setup(motor, GPIO.OUT)
GPIO.output(led, 0)


for i in range(1,4):
    params[name[i]]=str(sys.argv[i])

print(params)
#os.system('python /home/pi/Device/servo_test.py')

try:
    GPIO.output(led, 0)
    sleep(0.5)

    c = 0
    p = GPIO.PWM(motor, 50)
    p.start(0)
    mylcd.lcd_clear()
    sleep(0.2)

    while 1:
        GPIO.output(led, 1)
        mylcd.lcd_display_string(sys.argv[4], 1)
        p.ChangeDutyCycle(3)
        sleep(0.2)
        p.ChangeDutyCycle(12)
        sleep(0.2)
        p.ChangeDutyCycle(7.5)
        sleep(0.2)
        c = c + 0.2
        if c >= 10:
            p.stop()
            if GPIO.input(21) == 1:
                GPIO.output(led, 0)
                sleep(0.2)
                if GPIO.input(led) == 0:
                    GPIO.output(led, 1)
                    params['is_done']=str(0)
                    response=requests.post(url=url,json=params)
                    #print(response.json())
                    message=sys.argv[3]+' '+sys.argv[4]+' '
                    os.system('sudo /home/pi/Device/msgq_send {}'.format(message))
                    print(message)
                    exit(1)
            break
        if GPIO.input(21) == 0:
            p.stop()
            GPIO.output(led, 0)
            sleep(0.2)
            if GPIO.input(led) == 0:
                params['is_done']=str(1)
                response=requests.post(url=url,json=params)
                break
except KeyboardInterrupt:
    mylcd.lcd_clear()
    GPIO.cleanup()
