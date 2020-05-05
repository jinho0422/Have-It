import requests

f=open('/home/pi/rasp_haveit/text/device_id.txt','r')
line=f.read()
print(line)
f.close()
url='http://a2d9d7f8.ngrok.io/'
serial=line.split('\n')

params={
    'serialNumber':serial[0]
}

response=requests.post(url=url,json=params)
print(response)