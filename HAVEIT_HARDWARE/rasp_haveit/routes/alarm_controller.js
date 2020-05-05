var { Notification, sequelize } = require('../models');
var express = require('express');
var fs=require('fs');
const moment = require('moment');

module.exports.getnotification = async () => {
    //Notification=require('../models');
    var data = [];
    Notification.findAll({
        raw: true,
        order: [['weekId', 'DESC'], ['time', 'ASC']]
    }).then(notification => {
        //res.send(notification);

        data = JSON.stringify(notification);
        console.log(JSON.stringify(data));
        fs.writeFile('/home/pi/Device/Data.json', JSON.stringify(data), function (err) {
            if (err)
                console.error(err);
            else
                console.log('Write');
        });
    }).catch(err=>{
        console.error(err);
    })
};

module.exports.insertnotification = async (req,res) => {
    var OBJECT = req.body;
    console.log(OBJECT);
    var sz = Object.keys(OBJECT).length;
    //console.log(OBJECT);
    console.log('size : ' + sz);
 
    
    for (var i = 0; i < sz; i++) {
        var object=OBJECT[i];
        //console.log(object);
        const end_time = moment(object.endTime, 'HH:mm').format('HH:mm');
        const repeat = object.repeat;
        if (object.repeat == 0) {
            Notification.create({
                notiId: object.notificationId,
                noti_detailId:object.id,
                weekId: object.weekId,
                time: object.time,
                habitName: object.habitName,
                habitId: object.habitId,
            }).then(notification => {
                this.getnotification();
                res.send(200);

            }).catch(err => {
                    console.log(err);
                })
        }


        else {
            for (var start_time = object.time; start_time <= end_time; start_time = moment(start_time, 'HH:mm').add(repeat, 'm').format('HH:mm')) {
                console.log(start_time);
                Notification.create({
                    notiId: object.notificationId,
                    noti_detailId:object.id,
                    weekId: object.weekId,
                    time:start_time,
                    habitName: object.habitName,
                    habitId: object.habitId,
                }).then(notification => {
                    this.getnotification();
                    //console.log('update : ',notification);
                    res.send(notification);

                }) .catch(err => {
                        console.log(err);
                    })
            }
        }
    }
};

module.exports.deletenotification = async(req,res) => {
    console.log(req.params.id);

    const notiId=req.params.id;
    
    Notification.destroy(
        {
            where: {
                notiId: notiId
            }
        }
    ).then(notification => {
        //console.log('update : ',notification);
        //res.send(0);
        this.getnotification();
        res.status(200).json({
            "message": '200',
        });
    }) .catch(err => {
            console.log(err);
        })

};

module.exports.deletehabit = async(req,res) => {
    console.log(req.params.id);

    const habitId=req.params.id;
    
    Notification.destroy(
        {
            where: {
                habitId: habitId
            }
        }
    ).then(notification => {
        //console.log('update : ',notification);
        //res.send(0);
        this.getnotification();
        res.send(200);
    }).catch(err => {
            console.log(err);
        })

};

module.exports.alldelete = async(req,res) => {
   
    Notification.destroy({
        where:{},
        truncate:true
    })
    .then(notification => {
        console.log('delete');
        //this.getnotification();
    }).then(notification=>{
        this.insertnotification(req,res);
        //res.send(200);
    })
        .catch(err => {
            console.log(err);
        })

};
