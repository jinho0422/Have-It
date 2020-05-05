import I2C_LCD_driver
import RPi.GPIO as GPIO
import threading
import time

##setup GPIO_PIN
SWITCH = 21
LED = 17
MOTOR = 18
mylcd = I2C_LCD_driver.lcd()

flag = False

def interrupt_callback(channel):
    print("switch pressed")
    sleep(0.4);
    flag = True

GPIO.setmode(GPIO.BCM)
#GPIO.cleanup()
GPIO.setup(SWITCH, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(MOTOR, GPIO.OUT)
GPIO.add_event_detect(SWITCH, GPIO.FALLING, callback=interrupt_callback)
GPIO.setup(LED, GPIO.OUT)

#servo = GPIO.PWM(pin, 50)
#p.start(0)



def screen_timer():
    global sec
    sec += 1
    timer = threading.Timer(1, screen_timer)
    timer.start()

    if sec == 5 or flag == True:
        timer.cancel()
        GPIO.output(MOTOR, 0)

try:
    mylcd.lcd_clear()
    f = open('data.txt', "r")
    GPIO.output(LED, 1)
    flag = False

    if flag == True:
        GPIO.output(LED, 0)

    mylcd.lcd_clear()


except keyboardInterrupt:
    mylcd.lcd_clear()

import clock
