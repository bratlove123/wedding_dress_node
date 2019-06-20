var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      let customFileName = new Date().getTime(),
            fileExtension = file.originalname.split('.')[1];
      cb(null, file.originalname.split('.')[0] + '-' +customFileName + '.' + fileExtension);
    }
});
var upload = multer({storage: storage});

router.post('/image', upload.single('image'), (req, res, next) => {
    res.json({status:'success',message:'File uploaded successfully!', data: req.file.filename});
});

router.get('/image:name', (req, res, next) => {
  if(req.params.name){
    res.sendFile(path.join(__dirname, "./public/uploads/images/" + req.params.name));
  }
});

module.exports = router;