##! /bin/sh
/usr/local/bin/ngrok/ngrok start --all \
  --config=/home/pi/.ngrok2/ngrok.yml \
  --log=stdout \
  > /home/pi/ngrok.log &
