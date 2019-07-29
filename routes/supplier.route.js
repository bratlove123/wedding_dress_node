const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');

router.post('/add', supplierController.create);
router.get('/getsort', supplierController.getSort);
router.get('/getall', supplierController.getAll);
router.get('/get/:id', supplierController.getSupllierById);
router.put('/update/:id', supplierController.edit);
router.delete('/delete/:id', supplierController.delete);

module.exports=router;