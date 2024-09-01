const connection = require('../dbConfig');

exports.registerProduct = (req, res) => {
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  const imagem = req.file ? req.file.filename : null;

  console.log('req.file:', req.file); // Verifica se o arquivo foi recebido
  console.log('req.body:', req.body);
  
  if (!imagem) {
    return res.status(400).json({ error: 'Imagem não foi carregada corretamente' });
  }

  const query = 'INSERT INTO produtos (PRD_NOME, PRD_DESCRICAO, PRD_PRECO, PRD_QUANTIDADE, PRD_CATEGORIA, PRD_IMAGEM) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nome, descricao, preco, quantidade, categoria, imagem];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao registrar produto:', err);
      return res.status(500).json({ error: 'Erro ao registrar produto' });
    }
    res.status(201).json({ message: 'Produto registrado com sucesso', id: results.insertId });
  });
};

exports.getAllProducts = (req, res) => {
  const query = `
    SELECT 
      PRD_ID as id, 
      PRD_NOME as name, 
      PRD_DESCRICAO as description, 
      PRD_PRECO as price, 
      PRD_QUANTIDADE as quantity, 
      PRD_CATEGORIA as category, 
      CONCAT('/uploads/', PRD_IMAGEM) as imageUrl 
    FROM produtos`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar produtos:', err);
      return res.status(500).json({ error: 'Erro ao consultar produtos', details: err.message });
    }
    res.json(results);
  });
};
