var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;
var fs = require('fs');

router.get('/', function(req, res, next) {
    //res.sendfile('test.html',{root: __dirname });
    res.render('test');
});

router.post('/', function(req,res, next){
    data = req.body.send;	//html에서 받은 send를 data변수에 저장
    console.log(data);	//콘솔 출력 함수
    //exec('python ../test.py/', function(error, stout, stderr){});	//쉘명령어로 파이썬 실행
    fs.writeFile('./data.txt',data,function(err){	//파일입출력
      if(err) throw err;
      console.log('File write completed');
     });

    // line = 'python LCD.py '+data;
    // console.log(line)
     exec('python LCD.py', (error, stdout, stderr) => {
      if (error) {
          console.error(`lcd error: ${error}`);
          return;
        }
      else
        console.log(`${stdout}`);
      }); 
    
  //   exec('python servo_test.py', (error, stdout, stderr) => {
  //       if (error) {
  //           console.error(`exec error: ${error}`);
  //           return;
  //         }
  //       else
  //         console.log(`${stdout}`);
  //   });

    
  //   exec('python I2C_LCD.py', (error, stdout, stderr) => {
  //     if (error) {
  //         console.error(`exec error: ${error}`);
  //         return;
  //       }
  //     else
  //       console.log(`${stdout}`);
  // });

    res.render('test');	//다시 html파일 뿌림
   });

module.exports = router;
