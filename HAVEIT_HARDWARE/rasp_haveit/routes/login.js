var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var fs=require('fs');

router.post('/', function(req, res, next) {
	var Nick = 'Hello, '+req.body.nickName;
	console.log(req.body);
	console.log(Nick);

    fs.writeFile('./data.txt',Nick,function(err){
	  if(err)
	  {	 console.error(err);
		  // throw err;
	  }
	  else
	  	{console.log('File write completed');}
   });

   exec('python I2C_LCD1.py', (error, stdout, stderr) => {
	if (error) {
		console.error(`lcd error: ${error}`);
		return;
	  }
	else
	  console.log(`${stdout}`);
	}); 

	exec('python servo_test.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
        }
    else
        console.log(`${stdout}`);
    });
});
// router.get('/', function(req, res, next) {
// 	//res.render('get', { title: a});
// });

module.exports = router;