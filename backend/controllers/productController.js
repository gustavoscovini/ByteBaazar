const fs = require('fs');
const connection = require('../dbConfig');
const path = require('path');

exports.registerProduct = (req, res) => {
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  const imagem = req.file ? req.file.filename : null;

  if (!imagem) {
    return res.status(400).json({ message: 'Imagem não foi carregada corretamente' });
  }

  const productQuery = 'INSERT INTO produtos (PRD_NOME, PRD_DESCRICAO, PRD_PRECO, PRD_QUANTIDADE, PRD_CATEGORIA, PRD_IMAGEM) VALUES (?, ?, ?, ?, ?, ?)';
  const productValues = [nome, descricao, preco, quantidade, categoria, imagem];

  connection.query(productQuery, productValues, (err, productResults) => {
    if (err) {
      console.error('Erro ao registrar produto:', err);
      return res.status(500).json({ error: 'Erro ao registrar produto' });
    }

    const stockQuery = 'INSERT INTO estoque (EST_PRODUTO_ID, EST_QUANTIDADE) VALUES (?, ?)';
    const stockValues = [productResults.insertId, quantidade];

    connection.query(stockQuery, stockValues, (err, stockResults) => {
      if (err) {
        console.error('Erro ao registrar estoque:', err);
        return res.status(500).json({ error: 'Erro ao registrar estoque' });
      }

      res.status(201).json({ message: 'Produto e estoque registrados com sucesso', id: productResults.insertId });
    });
  });
};


exports.getAllProducts = (req, res) => {
  const query = `
    SELECT 
      p.PRD_ID as id, 
      p.PRD_NOME as name, 
      p.PRD_DESCRICAO as description, 
      p.PRD_PRECO as price, 
      p.PRD_QUANTIDADE as quantity, 
      p.PRD_CATEGORIA as category, 
      CONCAT('/uploads/', p.PRD_IMAGEM) as imageUrl,
      e.EST_QUANTIDADE as stockQuantity
    FROM produtos p
    JOIN estoque e ON p.PRD_ID = e.EST_PRODUTO_ID
    WHERE e.EST_QUANTIDADE > 0`;

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
      p.PRD_ID as id, 
      p.PRD_NOME as name, 
      p.PRD_DESCRICAO as description, 
      p.PRD_PRECO as price, 
      p.PRD_QUANTIDADE as quantity, 
      p.PRD_CATEGORIA as category, 
      CONCAT('/uploads/', p.PRD_IMAGEM) as imageUrl,
      e.EST_QUANTIDADE as stockQuantity
    FROM produtos p
    JOIN estoque e ON p.PRD_ID = e.EST_PRODUTO_ID
    WHERE p.PRD_ID = ? AND e.EST_QUANTIDADE > 0`;

  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Erro ao consultar produto:', err);
      return res.status(500).json({ error: 'Erro ao consultar produto', details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado ou sem estoque' });
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
    const imagemFinal = imagem || produtoExistente.PRD_IMAGEM;

    const updateProductQuery = `
      UPDATE produtos 
      SET PRD_NOME = ?, PRD_DESCRICAO = ?, PRD_PRECO = ?, PRD_QUANTIDADE = ?, PRD_CATEGORIA = ?, PRD_IMAGEM = ?
      WHERE PRD_ID = ?
    `;
    const productValues = [nome, descricao, preco, quantidade, categoria, imagemFinal, id];

    connection.query(updateProductQuery, productValues, (err, productResults) => {
      if (err) {
        console.error('Erro ao atualizar produto:', err);
        return res.status(500).json({ error: 'Erro ao atualizar produto' });
      }

      // Atualizar a quantidade na tabela ESTOQUE
      const updateStockQuery = 'UPDATE estoque SET EST_QUANTIDADE = ? WHERE EST_PRODUTO_ID = ?';
      connection.query(updateStockQuery, [quantidade, id], (err, stockResults) => {
        if (err) {
          console.error('Erro ao atualizar estoque:', err);
          return res.status(500).json({ error: 'Erro ao atualizar estoque' });
        }
        
        res.status(200).json({ message: 'Produto excluído com sucesso' });
      });
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

    // Excluir a referência do estoque primeiro
    const deleteStockQuery = 'DELETE FROM estoque WHERE EST_PRODUTO_ID = ?';
    connection.query(deleteStockQuery, [id], (err, stockResults) => {
      if (err) {
        console.error('Erro ao excluir referência de estoque:', err);
        return res.status(500).json({ error: 'Erro ao excluir referência de estoque' });
      }

      // Agora, excluir o produto
      const deleteProductQuery = 'DELETE FROM produtos WHERE PRD_ID = ?';
      connection.query(deleteProductQuery, [id], (err, productResults) => {
        if (err) {
          console.error('Erro ao excluir produto:', err);
          return res.status(500).json({ error: 'Erro ao excluir produto' });
        }

        res.status(200).json({ message: 'Produto excluído com sucesso' });
      });
    });
  });
};
