var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app);
var bodyParser = require('body-parser');
var fs = require('fs');
var exec = require('child_process').exec;

var data;

app.use(bodyParser.json());	//Json으로 넘어온 경우, 여기서는 필요 없는거 같지만...
app.use(bodyParser.urlencoded({ extended : false }));	//html의 form에서 넘어온 경우

app.get('', function(req,res){	//html파일을 클라이언트에 뿌려준다
 res.sendfile('web_lcd.html',{root: __dirname });
});

app.post('', function(req,res){
 data = req.body.send;	//html에서 받은 send를 data변수에 저장
 console.log(data);	//콘솔 출력 함수
 fs.writeFile('./data.txt',data,function(err){	//파일입출력
  if(err) throw err;
  console.log('File write completed');
 });
 exec('python I2C_LCD.py', function(error, stout, stderr){});	//쉘명령어로 파이썬 실행
 exec('python servo_test.py', function(error, stout, stderr){});
 res.sendfile('web_lcd.html',{root: __dirname });	//다시 html파일 뿌림
});

server.listen(8000,function(){	//서버를 8000포트로 연다
 console.log('express server listening on port ' + server.address().port)
});
