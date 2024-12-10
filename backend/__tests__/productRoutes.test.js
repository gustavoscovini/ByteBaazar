const request = require('supertest');
const app = require('../app'); 

describe('Testes para rotas de produtos', () => {
  it('Deve retornar uma lista de produtos', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

it('Deve registrar um novo produto com imagem', async () => {
const response = await request(app)
    .post('/api/products/register')
    .field('nome', 'Produto Teste')
    .field('descricao', 'Descrição do produto')
    .field('preco', 100.0)
    .field('quantidade', 10)
    .field('categoria', '1')
    .attach('imagem', '__tests__/test-image.jpg'); 

expect(response.status).toBe(201);
expect(response.body).toHaveProperty('id');
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
  
  it('Deve retornar uma lista de produtos', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
  });

  it('Deve retornar um produto específico', async () => {
    const productId = 5;
    const response = await request(app).get(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', productId);
    expect(response.body).toHaveProperty('name');
  });
  
  it('Deve retornar erro ao tentar registrar um produto sem imagem', async () => {
    const response = await request(app)
      .post('/api/products/register')
      .send({
        nome: 'Produto Sem Imagem',
        descricao: 'Este produto não possui imagem',
        preco: 200.0,
        quantidade: 15,
        categoria: '3'
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Imagem não foi carregada corretamente');
  });
  
  it('Deve retornar um produto específico', async () => {
    const productId = 5;
    const response = await request(app).get(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', productId);
    expect(response.body).toHaveProperty('name');
  });
  

  it('Deve excluir um produto', async () => {
    const productResponse = await request(app)
    .post('/api/products/register')
    .field('nome', 'Produto Teste de deleção')
    .field('descricao', 'Descrição do produto')
    .field('preco', 100.0)
    .field('quantidade', 10)
    .field('categoria', '1')
    .attach('imagem', '__tests__/test-image.jpg'); 
  
    const productId = productResponse.body.id;

    const response = await request(app).delete(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Produto excluído com sucesso');
  });
  
  
  
  