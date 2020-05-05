var express = require('express');
var router = express.Router();
var controller = require('./habit_controller');
var fs=require('fs');
var { Notification, sequelize } = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'abc' });
});

router.get('/check', function (req, res, next) {
  res.send(200);
}); //인터넷 연결

router.post('/', function (req, res, next) {
  var object = req.body;
  console.log(object);
  res.send({ "msg": "OK" });
});

router.delete('/delete/All', function (req, res, next) {

  controller.alldelete(req,res);
  getnotification = async () => {
    //Notification=require('../models');
    var data = [];
    Notification.findAll({
        raw: true,
        order: [['weekId', 'DESC'], ['time', 'ASC']]
    }).then(notification => {
        //res.send(notification);

        data = JSON.stringify(notification);
        console.log(JSON.stringify(data));
        fs.writeFile('../Device/Data.json', JSON.stringify(data), function (err) {
            if (err)
                console.error(err);
            else
                console.log('Write');
        });
        res.status(200);
        
    }).catch(err=>{
        console.error(err);
    })
};

});//공장초기화

// router.get('/activate', function(req, res, next) {
//   var activate=process.env['is_activated'];
//   if(activate==0)
//     process.env['is_activated']=1;
//   else
//     process.env['is_activated']=0;
//   res.send(process.env['is_activated']);
//   console.log(process.env['is_activated']);
// }); // 하루 비활성화

module.exports = router;
