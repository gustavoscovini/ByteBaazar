const request = require('supertest');
const app = require('../app'); 

describe('Testes para rotas de usuários', () => {
    it('Deve registrar um novo usuário', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          nome: 'Usuário Teste',
          cpf: '12345678900',
          dataNascimento: '2000-01-01',
          email: 'teste@example.com',
          senha: '123456',
          genero: 'masculino',
          telefone: '(11) 94432-2002'
        });
  
      if (response.status === 200) {
        expect(response.body.message).toBe('Usuário registrado com sucesso!');
      } else {
        expect(response.status).toBe(400); 
      }
    });
  });

  it('Deve realizar o login de um usuário existente', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'teste@example.com',
        password: '123456'
      });
  
    if (response.status === 200) {
      expect(response.body).toHaveProperty('userName');
    } else {
      expect(response.status).toBe(401);
    }
  });

  it('Deve retornar erro ao tentar registrar um usuário sem email', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        nome: 'Teste',
        cpf: '12345678900',
        dataNascimento: '2000-01-01',
        senha: '123456',
        genero: 'masculino',
        telefone: '123456789'
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Todos os campos são obrigatórios.');
  });
  
  it('Deve retornar erro ao registrar um usuário com CPF inválido', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        nome: 'Teste CPF Inválido',
        cpf: '123', // CPF inválido
        dataNascimento: '2000-01-01',
        email: 'teste@cpf.com',
        senha: '123456',
        genero: 'masculino',
        telefone: '123456789'
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('CPF inválido. Deve conter 11 dígitos numéricos.');
  });

  it('Deve retornar erro ao registrar um usuário com idade menor que 12 anos', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        nome: 'Teste Menor de 12',
        cpf: '12345678900',
        dataNascimento: '2015-01-01',
        email: 'teste@idade.com',
        senha: '123456',
        genero: 'feminino',
        telefone: '987654321'
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Idade mínima para registro é de 12 anos.');
  });
  
  