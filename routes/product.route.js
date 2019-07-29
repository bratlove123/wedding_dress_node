const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.post('/add', productController.create);
router.get('/getsort', productController.getSort);
router.get('/getall', productController.getAll);
router.get('/get/:id', productController.getProductById);
router.put('/update/:id', productController.edit);
router.delete('/delete/:id', productController.delete);

module.exports=router;