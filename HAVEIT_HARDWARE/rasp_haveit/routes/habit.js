var { Notification, sequelize } = require('../models');
var express = require('express');
var router = express.Router();
const moment = require('moment');
const controller=require('./habit_controller');
var fs=require('fs');
//console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

router.get('/', function (req, res, next) {

});

router.post('/name', function (req, res, next) {
    console.log(req.body);

    controller.changeName(req,res,next);
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
            
        }).catch(err=>{
            console.error(err);
        })
    };
});

router.post('/activate', function (req, res, next) {
    console.log(req.body);

    controller.changeActive(req,res,next);
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
            
        }).catch(err=>{
            console.error(err);
        })
    };
});

router.post('/all/activate', function (req, res, next) {
    console.log(req.body);

    controller.notActive(req,res,next);
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
            
        }).catch(err=>{
            console.error(err);
        })
    };
});

router.delete('/delete/:id', function (req, res, next) {
    console.log(req.params.id);

    controller.deletehabit(req,res);
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
    
        }).catch(err=>{
            console.error(err);
        })
    };
});

module.exports = router;

