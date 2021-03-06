const express = require('express');
const router = express.Router();
const leftNavController = require('../controllers/leftNav.controller');

router.post('/add', leftNavController.create);
router.get('/getsort', leftNavController.getSort);
router.get('/getall', leftNavController.getAll);
router.get('/get/:id', leftNavController.getLeftNavById);
router.put('/update/:id', leftNavController.edit);
router.delete('/delete/:id', leftNavController.delete);
router.get('/check', function(req, res,next){
    res.json({status:'success',message:'Check login success!'});
});
module.exports=router;