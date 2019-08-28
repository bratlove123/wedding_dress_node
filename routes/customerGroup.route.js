const express = require('express');
const router = express.Router();
const customerGroupController = require('../controllers/customerGroup.controller');

router.post('/add', customerGroupController.create);
router.get('/getsort', customerGroupController.getSort);
router.get('/getall', customerGroupController.getAll);
router.get('/get/:id', customerGroupController.getCustomerGroupById);
router.put('/update/:id', customerGroupController.edit);
router.delete('/delete/:id', customerGroupController.delete);

module.exports=router;