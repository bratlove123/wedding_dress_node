const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/add', userController.create);
router.get('/getsort', userController.getSort);
router.get('/get/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.delete);
router.put('/active/:id', userController.toggleActive);
router.get('/roles/:id', userController.getRoles);
module.exports=router;
