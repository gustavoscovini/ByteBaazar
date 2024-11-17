const connection = require('../dbConfig');

exports.registerUser = (req, res) => {
  const { nome, cpf, dataNascimento, email, senha, genero, telefone } = req.body;

  // Validação inicial dos campos obrigatórios
  if (!nome || !cpf || !dataNascimento || !email || !senha || !genero || !telefone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Validação do CPF
  if (!/^\d{11}$/.test(cpf)) {
    return res.status(400).json({ message: 'CPF inválido. Deve conter 11 dígitos numéricos.' });
  }

  // Validação da idade mínima
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  if (idade < 12) {
    return res.status(400).json({ message: 'Idade mínima para registro é de 12 anos.' });
  }

  // Verificar se o CPF já existe no banco
  connection.query('SELECT * FROM clientes WHERE CLI_CPF = ?', [cpf], (err, cpfResults) => {
    if (err) {
      console.error('Erro ao verificar CPF:', err);
      return res.status(500).json({ message: 'Erro interno ao verificar CPF.' });
    }

    if (cpfResults.length > 0) {
      return res.status(400).json({ message: 'CPF já cadastrado.' });
    }

    // Verificar se o email já existe no banco
    connection.query('SELECT * FROM clientes WHERE CLI_EMAIL = ?', [email], (err, emailResults) => {
      if (err) {
        console.error('Erro ao verificar email:', err);
        return res.status(500).json({ message: 'Erro interno ao verificar email.' });
      }

      if (emailResults.length > 0) {
        return res.status(400).json({ message: 'Email já cadastrado.' });
      }

      // Inserir o usuário no banco
      const sql = `
        INSERT INTO clientes (CLI_NOME, CLI_CPF, CLI_DATA_NASCIMENTO, CLI_EMAIL, CLI_SENHA, CLI_GENERO, CLI_TELEFONE) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const valores = [nome, cpf, dataNascimento, email, senha, genero, telefone];

      connection.query(sql, valores, (err, result) => {
        if (err) {
          console.error('Erro ao registrar usuário:', err);
          return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
        }
        res.status(200).json({ message: 'Usuário registrado com sucesso!' });
      });
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM clientes WHERE CLI_EMAIL = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário: ', err);
      return res.status(500).json({ message: 'Erro ao buscar usuário', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = results[0];

    if (user.CLI_SENHA === password) {
      res.status(200).json({ userName: user.CLI_NOME });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  });
};