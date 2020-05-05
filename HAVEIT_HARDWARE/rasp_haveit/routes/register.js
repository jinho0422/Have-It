var express = require('express');
var router = express.Router();
var request = require('request');
const ngrok = require('ngrok');
var fs = require('fs');

//쉘 파싱 명령어
//curl --silent --show-error http://127.0.0.1:4040/api/tunnels | sed -nE 's/.*public_url":"https:..([^"]*).*/\1/p' > domain.txt


const regist = async function () {
    const url = await ngrok.connect(3000);
    const api = ngrok.getApi();
    const tunnels = await api.get('api/tunnels');
    var tmp = JSON.parse(tunnels).tunnels[1].public_url.split("//");
    var ngrok_url = 'http://' + tmp[1];
    console.log(ngrok_url);
    
    fs.writeFile('./text/domain.txt', ngrok_url, function(err){
        if(err) throw err;
        console.log('Domain write completed');
    });

    fs.readFile('./text/device_id.txt', 'utf-8', function(err, data){
        if(err){
            console.error(err);
            throw err;
        }
        //DB에 ngrok 자동 업데이트
        request.post({
            url: 'http://a5b7bc3f.ngrok.io/rasp/rasp_register',
            body: {
                "serialNumber" : data.split("\n")[0],
                "domain":ngrok_url
            },
            json:true
        }, function (err, res, body) {
            if(err) {
                console.error(err);
                next(err);
            }
        })
    });
}

module.exports = {
    regist: regist
}