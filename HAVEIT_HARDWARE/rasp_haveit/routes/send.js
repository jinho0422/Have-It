var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/',function(req, res, next) {
    var params = {
        "msg" : "chocolate"
    }
    request.post({
        url:'http://localhost:8001',
        body:params,
        json: true
    }, function(err, response, body){
        console.log(body);
    })
    res.render('send', {title: params.msg});
});
module.exports = router;
