from bluetooth import *

client_socket = BluetoothSocket(RFCOMM)

client_socket.connect(("00:19:10:08:56:BF", 1))
cnt = 0

while True:
    if cnt == 32:
        print("")
        cnt = 0
    msg = client_socket.recv(1024)
    print("{} ".format(msg))
    cnt += 1

print("Finished")
client_socket.close()
