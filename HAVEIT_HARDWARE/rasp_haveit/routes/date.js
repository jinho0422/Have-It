var express = require('express');
var router = express.Router();
const moment = require('moment');
require('moment-timezone');
var request = require('request');
moment.tz.setDefault('Asia/Seoul');
const exec = require('child_process').exec;

router.get('/',function(req,res,next){

      request.get("http://www.naver.com" ,function (req, res, err){
        if(err) console.log(err);
        //console.log(res.headers.date);
        var nowdate = Date.parse(res.headers.date);
        console.log(nowdate);
        exec("sudo date -s @"+(nowdate/1000));
        // console.log("TIME SETTING SUCCESS");
    });
    res.json(200);
}); 


// const servertime = async function(){
//   request.get("https://aws.amazon.com" ,function (err, res, body){
//       if(err) console.log(err);
//       console.log(res.headers.date);
//       var nowdate = Date.parse(res.headers.date);
//       exec("sudo date -s @"+(nowdate/1000));
//       console.log("TIME SETTING SUCCESS");
//   });
// }

module.exports = router;
