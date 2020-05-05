var { Cushion } = require('../models');
var express = require('express');
var router = express.Router();
var fs=require('fs');

router.get('/',function(req, res, next) {
	Cushion.findAll(
		{where : {id: 1}}
	)
	.then((result) => {
		data = JSON.stringify(result);	
		console.log(data);	
		res.send(data).status(200);
	}).catch(err=>{
		console.error(err);
	})
});

module.exports = router;