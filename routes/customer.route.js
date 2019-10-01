const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.post('/add', customerController.create);
router.get('/getsort', customerController.getSort);
router.get('/getall', customerController.getAll);
router.get('/find', customerController.findCustomer);
router.get('/get/:id', customerController.getCustomerById);
router.put('/update/:id', customerController.edit);
router.delete('/delete/:id', customerController.delete);

module.exports=router;