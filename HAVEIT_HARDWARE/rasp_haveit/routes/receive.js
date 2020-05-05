var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    var object=req.body;
    console.log(object);
    res.status(200).json({
      object
  });
  });

  module.exports = router;