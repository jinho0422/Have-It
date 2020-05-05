#! /usr/bin/python
import json
import time
import os
import datetime


with open('/home/pi/Device/Data.json','r') as st_json:
    data=json.load(st_json)
    notifications=json.loads(data)

    now=time.localtime()
    print("now : %d:%d %d" % (now.tm_hour,now.tm_min,now.tm_wday))

    
    for noti in notifications:
        if(noti['is_activated']==False or noti['activate']==False):
            pass
        #print(noti)
        #print(noti['weekId'])
        #print((1<<(now.tm_wday+1))&(noti['weekId']))
        day=(now.tm_wday+1)%7
        #print(now)
        
        date=time.strftime('%H:%M',now)
        if((1<<day)==noti['weekId']):
            #date=('%2d:%2d' %(now.tm_hour,now.tm_min))
            #date="aa:00"
            #date="14:00"
            if(noti['time']==date):
                #print(noti)
                message=str(noti['notiId'])+' '+str(noti['noti_detailId'])+' '+noti['habitName']+' '+noti['time']+' '
                print(message)
                os.system('/home/pi/Device/msgq_send {}'.format(message))
                
                #if(noti['time']==now):
                    #print(noti['time'])
