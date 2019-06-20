const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

router.post('/add', roleController.create);
router.get('/getsort', roleController.getSort);
router.get('/getall', roleController.getAll);
router.get('/get/:id', roleController.getRoleById);
router.put('/update/:id', roleController.edit);
router.delete('/delete/:id', roleController.delete);
module.exports=router;