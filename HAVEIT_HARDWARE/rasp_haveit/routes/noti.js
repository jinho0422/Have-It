const { Notification,sequelize } = require('../models');
var express = require('express');
var router = express.Router();
const moment = require('moment');

//console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

const getnotification=async()=>{
    Notification.findAll({
         attributes: [ 'id', 'weekId','time' ,'habitId'],
         where: { 
             //weekId: sequelize.fn('WEEKDAY',moment().format('YYYY-MM-DD HH:mm:ss')),
             //time: sequelize.fn('time_format',moment().format('YYYY-MM-DD HH:mm:ss'),'%H:%i')
            },
         raw: true
      }).then(notification => {
            res.send(notification);
           //noti_list.push(JSON.stringify(notification));
            //console.log(JSON.stringify(notification));
      })
      .catch(err=>{
          console.log(err);
      })
};

router.get('/', function(req, res, next) {
    const noti_list = new Array();
    
    // getnotification();
    // for(var i in noti_list)
    // {    
    //     console.log(JSON.parse(noti_list[i]));
    //     res.send(JSON.parse(noti_list[i]));
    // }
    
});

router.post('/:insert', function(req, res, next) {
	var object = req.body;
    var sz=Object.keys(object).length;
	console.log(object);
    console.log(sz);
    
    // 받은 json을 db에 저장
    const insertnotification=async()=>{
        for(var i=0;i<sz;i++)
        {
            Notification.create({
                notiId: object[i].id,
                weekId: object[i].weekId,
                time : object[i].time,
                habitName : object[i].habitName,
            }).then(notification => {
                res.send(notification);
            })
            .catch(err=>{
              console.log(err);
            })
        }
    };
    insertnotification();


});

router.post('/:update', function(req, res, next) {
	var object = req.body;
    var sz=Object.keys(object).length;
	console.log(object);
    console.log(sz);
    
    // 받은 json을 db에 저장
    const insertnotification=async()=>{
        for(var i=0;i<sz;i++)
        {
            Notification.update(
                {
                    weekId:object[i].weekId,
                    time:object[i].time,
                    habitName:object[i].habitName
                },
                {where:{
                    notiId:object[i].id
                }}
            ).then(notification => {
                res.send(notification);
            })
            .catch(err=>{
              console.log(err);
            })
        }
    };
    insertnotification();


});

router.post('/:delete', function(req, res, next) {
	var object = req.body;
    var sz=Object.keys(object).length;
	console.log(object);
    console.log(sz);
    
    // 받은 json을 db에 저장
    const insertnotification=async()=>{
        for(var i=0;i<sz;i++)
        {
            Notification.destroy(
                {where:{
                    notiId:object[i].id
                }}
            ).then(notification => {
                res.send(notification);
            })
            .catch(err=>{
              console.log(err);
            })
        }
    };
    insertnotification();


});
module.exports = router;

