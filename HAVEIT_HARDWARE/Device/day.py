#!/usr/bin/env python
import json
import time
import os
import datetime

with open('/home/pi/Device/Data.json','r') as st_json:
    data=json.load(st_json)
    notifications=json.loads(data)

    now=datetime.date(2020,2,9)
    print("now : %d" % (now.tm_wday))

    
    #for noti in notifications:
        #print(noti['weekId'])
        #print((1<<(now.tm_wday+1))&(noti['weekId']))
        #day=now.tm_wday+1
        #if((1<<day)&noti['weekId']):
            #date=('%d:%d' %(now.tm_hour,now.tm_min))
            #if(noti['time']==date):
                #print(noti)
                #message=str(noti['notiId'])+' '+str(noti['noti_detailId'])+' '+noti['habitName']+' '+noti['time']+' '
                #print(message)
                #if(noti['time']==now):
                    #print(noti['time'])
