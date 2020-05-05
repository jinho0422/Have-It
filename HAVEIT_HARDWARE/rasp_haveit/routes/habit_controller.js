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
        console.log('all delete');
        this.getnotification();
        res.send(200);
    })
        .catch(err => {
            console.log(err);
        })

};

module.exports.changeName=async(req,res,next)=>{
    try {
        var object=req.body;
        Notification.update(
            { habitName:object.habitName},
            { where:{  habitId:object.habitId}}
        )
        .then(notification=>{
            this.getnotification();
            res.send(200);
        })
        .catch(err=>{
            console.error(err);
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
    
};

module.exports.changeActive=async(req,res,next)=>{
    try {
        var object=req.body;
        Notification.update(
            { is_activated:object.is_activated},
            { where:{  habitId:object.habitId}}
        )
        .then(notification=>{
            this.getnotification();
            res.send(200);
        })
        .catch(err=>{
            console.error(err);
        })
    } 
    catch (error) {
        console.error(error);
        next(error)
    }
    
};

module.exports.notActive=async(req,res,next)=>{
    var object=req.body.is_activated;
    
    try {
        Notification.update(
            { activate:!object},
            {
                where:{},
            }
        )
        .then(notification=>{
            this.getnotification();
            res.send(200);
        })
        .catch(err=>{
            console.error(err);
        })
    } 
    catch (error) {
        console.error(error);
        next(error)
    }
    
};