import requests,json
import sys

url='http://fb068e10.ngrok.io/' 
name=["dollId","notiId","noti_detail","time","is_done"]

# response=requests.get(url=url)
# print(response)
params={'dollId':"",
'notiId':0,
 'noti_detail':3,
 'time':0,
 'is_done':True}
# for i in range(1,5):
#     print(sys.argv[i])

for i in range(1,5):
    params[name[i]]=sys.argv[i]

response=requests.post(url=url,json=params)

# print(response.json())