const connection = require('../dbConfig');

exports.registerUser = (req, res) => {
    const { nome, cpf, dataNascimento, email, senha, genero, telefone } = req.body;
  
    const checkCpfSql = 'SELECT * FROM clientes WHERE CLI_CPF = ?';
    connection.query(checkCpfSql, [cpf], (err, cpfResults) => {
      if (err) {
        console.error('Erro ao verificar CPF: ' + err.stack);
        return res.status(500).send('Erro ao verificar CPF');
      }
  
      if (cpfResults.length > 0) {
        return res.status(400).json({ message: 'CPF já cadastrado' });
      }
  
      const checkEmailSql = 'SELECT * FROM clientes WHERE CLI_EMAIL = ?';
      connection.query(checkEmailSql, [email], (err, emailResults) => {
        if (err) {
          console.error('Erro ao verificar email: ' + err.stack);
          return res.status(500).send('Erro ao verificar email');
        }
  
        if (emailResults.length > 0) {
          return res.status(400).json({ message: 'Email já cadastrado' });
        }
  
        const sql = 'INSERT INTO clientes (CLI_NOME, CLI_CPF, CLI_DATA_NASCIMENTO, CLI_EMAIL, CLI_SENHA, CLI_GENERO, CLI_TELEFONE) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [nome, cpf, dataNascimento, email, senha, genero, telefone];
  
        connection.query(sql, values, (err, result) => {
          if (err) {
            console.error('Erro ao registrar usuário: ' + err.stack);
            return res.status(500).send('Erro ao registrar usuário');
          }
          res.status(200).send('Usuário registrado com sucesso!');
        });
      });
    });
  };

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM clientes WHERE CLI_EMAIL = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário: ' + err.stack);
      return res.status(500).json({ message: 'Erro ao buscar usuário' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = results[0];

    if (user.CLI_SENHA === password) {
      res.status(200).json({ message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  });
};
