var { Notification, sequelize } = require('../models');
var express = require('express');
var router = express.Router();
const moment = require('moment');
const controller=require('./alarm_controller');
var fs=require('fs');
//console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

router.get('/', function (req, res, next) {

});

router.post('/insert', function (req, res, next) {

    controller.insertnotification(req,res);
    getnotification = async () => {
        //Notification=require('../models');
        var data = [];
        Notification.findAll({
            raw: true,
            order: [['weekId', 'DESC'], ['time', 'ASC']]
        }).then(notification => {
            //res.send(notification);
            res.send(200);
            data = JSON.stringify(notification);
            console.log(JSON.stringify(data));
            fs.writeFile('../Device/Data.json', JSON.stringify(data), function (err) {
                if (err)
                    console.error(err);
                else
                    console.log('Write');
            });
    
        })
    };
});

router.post('/sync', function (req, res, next) {
    console.log(req.body);
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
            res.status(200).json({
                "message": '200',
            });
    
        }).catch(err=>{
            console.error(err);
        })
    };
    // update = async () => {
    //     var data = [];
    //     Notification.findAll({
    //         raw: true,
    //         order: [['weekId', 'DESC'], ['time', 'ASC']]
    //     }).then(notification => {
    //         //res.send(notification);
    
    //         data = JSON.stringify(notification);
    //         console.log(JSON.stringify(data));
    //         fs.writeFile('../Device/Data.json', JSON.stringify(data), function (err) {
    //             if (err)
    //                 console.error(err);
    //             else
    //                 console.log('Write');
    //         });
    //         res.send(200);
    //     }).catch(err=>{
    //         console.error(err);
    //     })
    // };
});

router.delete('/delete/:id', function (req, res, next) {
    console.log(req.params.id);

    const notiId=req.params.id;
    // 받은 json을 db에 저장

    controller.deletenotification(req,res);
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
            res.status(200).json({
                "message": '200',
            });
    
        }).catch(err=>{
            console.error(err);
        })
    };
});




// router.post('/update', function (req, res, next) {
//     var object = req.body;
//     var sz = Object.keys(object).length;
//     console.log(object);
//     console.log(sz);
    
//     // 받은 json을 db에 저장
//     const updatenotification = async (object) => {
//         deletenotification(object);

//         const insertnotification = async (object) => {
//             //const end_time= moment(object.time, 'HH:mm').format('HH:mm');
//             const repeat = Number(object.repeat);

//             if (object.repeat == 0) {
//                 Notification.create({
//                     notiId: object.notificationId,
//                     noti_detailId:object.id,
//                     weekId: object.weekId,
//                     time: object.time,
//                     habitName: object.habitName,
//                 }).then(notification => {
//                     //res.send(200)
//                     //console.log('update : ',notification);
//                     //res.send(notification);
//                 })
//                     .catch(err => {
//                         console.log(err);
//                     })
//             }


//             else {
//                 for (var start_time = object.time; start_time <= end_time; start_time = moment(start_time, 'HH:mm').add(repeat, 'm').format('HH:mm')) {
//                     Notification.create({
//                         notiId: object.notificationId,
//                         noti_detailId:object.id,
//                         weekId: object.weekId,
//                         time: start_time,
//                         habitName: object.habitName,
//                     }).then(notification => {
//                         //console.log('update : ',notification);
//                         //res.send(200);
//                     })
//                         .catch(err => {
//                             console.log(err);
//                         })
//                 }
//             }
//         };
//         insertnotification(object);

//         const deletenotification = async (object) => {
//             Notification.destroy(
//                 {
//                     where: {
//                         notiId: object[i].id
//                     }
//                 }
//             ).then(notification => {
//                 //res.send(200)
//                 //console.log('update : ',notification);
//                 //res.send(0);
//             })
//                 .catch(err => {
//                     console.log(err);
//                 })

//         };

//     };
//     updatenotification(object);

//     const getnotification = async () => {
//         //Notification=require('../models');
//         var data = [];
//         Notification.findAll({
//             raw: true,
//             order: [['weekId', 'DESC'], ['time', 'ASC']]
//         }).then(notification => {
//             data = JSON.stringify(notification);
//             //console.log(JSON.stringify(data));

//             fs.writeFile('../LCD/Data.json', JSON.stringify(data), function (err) {
//                 if (err)
//                     console.error(err);
//                 else
//                     console.log('Write');
//             });
//             //res.send(200);
//         })
//     };
//     getnotification();
// });

module.exports = router;

