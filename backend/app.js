const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;
