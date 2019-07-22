const express = require('express');
const router = express.Router();
const colorController = require('../controllers/color.controller');

router.post('/add', colorController.create);
router.get('/getsort', colorController.getSort);
router.get('/getall', colorController.getAll);
router.get('/get/:id', colorController.getColorById);
router.put('/update/:id', colorController.edit);
router.delete('/delete/:id', colorController.delete);

module.exports=router;