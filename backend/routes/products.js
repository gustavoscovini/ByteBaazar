const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', upload.single('imagem'), productController.registerProduct);

router.put('/:id', upload.single('imagem'), productController.updateProduct);

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
