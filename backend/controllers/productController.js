const fs = require('fs');
const connection = require('../dbConfig');
const path = require('path');

exports.registerProduct = (req, res) => {
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  const imagem = req.file ? req.file.filename : null;

  console.log('req.file:', req.file);
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

exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const query = `
    SELECT 
      PRD_ID as id, 
      PRD_NOME as name, 
      PRD_DESCRICAO as description, 
      PRD_PRECO as price, 
      PRD_QUANTIDADE as quantity, 
      PRD_CATEGORIA as category, 
      CONCAT('/uploads/', PRD_IMAGEM) as imageUrl 
    FROM produtos WHERE PRD_ID = ?`;

  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Erro ao consultar produto:', err);
      return res.status(500).json({ error: 'Erro ao consultar produto', details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(results[0]);
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params; 
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const checkQuery = 'SELECT PRD_IMAGEM FROM produtos WHERE PRD_ID = ?';
  
  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Erro ao consultar produto:', err);
      return res.status(500).json({ error: 'Erro ao consultar produto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const produtoExistente = results[0];

    if (imagem && produtoExistente.PRD_IMAGEM) {
      const oldImagePath = path.join(__dirname, '../uploads/', produtoExistente.PRD_IMAGEM);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error('Erro ao excluir imagem antiga:', err);
        } else {
          console.log('Imagem antiga excluída:', produtoExistente.PRD_IMAGEM);
        }
      });
    }

    const imagemFinal = imagem || produtoExistente.PRD_IMAGEM;

    const updateQuery = `
      UPDATE produtos 
      SET PRD_NOME = ?, PRD_DESCRICAO = ?, PRD_PRECO = ?, PRD_QUANTIDADE = ?, PRD_CATEGORIA = ?, PRD_IMAGEM = ?
      WHERE PRD_ID = ?
    `;
    const values = [nome, descricao, preco, quantidade, categoria, imagemFinal, id];

    connection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error('Erro ao atualizar produto:', err);
        return res.status(500).json({ error: 'Erro ao atualizar produto' });
      }
      res.status(200).json({ message: 'Produto atualizado com sucesso' });
    });
  });
};



exports.deleteProduct = (req, res) => {
  const { id } = req.params; 

  const checkQuery = 'SELECT PRD_IMAGEM FROM produtos WHERE PRD_ID = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Erro ao consultar produto:', err);
      return res.status(500).json({ error: 'Erro ao consultar produto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const produtoExistente = results[0];

    if (produtoExistente.PRD_IMAGEM) {
      const imagePath = path.join(__dirname, '../uploads/', produtoExistente.PRD_IMAGEM);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Erro ao excluir imagem do produto:', err);
        } else {
          console.log('Imagem do produto excluída:', produtoExistente.PRD_IMAGEM);
        }
      });
    }

    const deleteQuery = 'DELETE FROM produtos WHERE PRD_ID = ?';

    connection.query(deleteQuery, [id], (err, results) => {
      if (err) {
        console.error('Erro ao excluir produto:', err);
        return res.status(500).json({ error: 'Erro ao excluir produto' });
      }

      res.status(200).json({ message: 'Produto excluído com sucesso' });
    });
  });
};
