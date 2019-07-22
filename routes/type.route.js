const express = require('express');
const router = express.Router();
const typeController = require('../controllers/type.controller');

router.post('/add', typeController.create);
router.get('/getsort', typeController.getSort);
router.get('/getall', typeController.getAll);
router.get('/get/:id', typeController.getTypeById);
router.put('/update/:id', typeController.edit);
router.delete('/delete/:id', typeController.delete);

module.exports=router;