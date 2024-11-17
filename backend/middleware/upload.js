const multer = require('multer');
const path = require('path');
//Define a pasta /uploads como armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
//Define um nome aleatório e único pra imagem 
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 1000000000);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
