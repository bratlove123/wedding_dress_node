var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      let customFileName = new Date().getTime();
      let nameSplit = file.originalname.split('.');
      let fileExtension = nameSplit[nameSplit.length-1];
      delete nameSplit[nameSplit.length-1];
      let fileName = nameSplit.join('.');
      cb(null, fileName + '-' + customFileName + '.' + fileExtension);
    }
});
var upload = multer({storage: storage});

router.post('/image', upload.single('image'), (req, res, next) => {
    res.json({status:'success',message:'Image uploaded successfully!', data: req.file.filename});
});

router.post('/images', upload.array('image', 10), function(req, res) {
  res.json({status:'success',message:'Images uploaded successfully!', data: req.files});
});

router.get('/image:name', (req, res, next) => {
  if(req.params.name){
    res.sendFile(path.join(__dirname, "./public/uploads/images/" + req.params.name));
  }
});

module.exports = router;