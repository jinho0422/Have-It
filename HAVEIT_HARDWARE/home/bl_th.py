"""
pos_type == 0 >> middle
pos_type==1 >> front
pos_type==2 >> back
pos_type==3 >> left
pos_type==4 >> right
pos_type==5 >> left_twisted
pos_type==6 >> right_twisted
"""

from bluetooth import *
import json
import pymysql.cursors

client_socket = BluetoothSocket(RFCOMM)
client_socket.connect(("00:19:10:08:56:BF", 1))

conn = pymysql.connect(host='localhost', user='tester', password='haveit', db='haveit', charset='utf8mb4')

cursor = conn.cursor()

while True:
    msg = client_socket.recv(1024)

    type_ = ""
    if msg == '0':
        type_ = 'middle_'
    
    elif msg == '1':
        type_ = 'front_'
    
    elif msg == '2':
       type_ = 'back_'

    elif msg == '3':
        type_ = 'left_'
    
    elif msg == '4':
       type_ = 'right_'

    elif msg == '5':
        type_ = 'left_twisted_'
    
    elif msg == '6':
       type_ = 'right_twisted_'


    print(type_)
    sql = 'select %s from cushions where id = 1' % (type_)
    cursor.execute(sql)

    data = cursor.fetchone()
    data = data[0]
    increase = data + 1

    increase = str(increase)

    sql = 'UPDATE cushions SET %s = %s WHERE id = 1' % (type_, increase)
    cursor.execute(sql)
    conn.commit()


print("Finished")
client_socket.close()
conn.close()

