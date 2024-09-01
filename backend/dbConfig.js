const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  // password: '*****',
  database: 'bytebaazar'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como ID ' + connection.threadId);
});

module.exports = connection;