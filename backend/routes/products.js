const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', upload.single('imagem'), productController.registerProduct);
router.get('/', productController.getAllProducts);

module.exports = router;
