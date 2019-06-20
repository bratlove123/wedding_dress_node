var express = require('express');
var router = express.Router();
var path = require("path");

router.get('/image/:name', (req, res, next) => {
  if(req.params.name){
    let dir = path.join(__dirname, "../public/images/uploads/" + req.params.name);
    res.sendFile(dir);
  }
});

module.exports = router;