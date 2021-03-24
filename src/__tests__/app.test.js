const request = require('supertest');
const { API_PORT } = require('../config/environment');

const url = `localhost:${API_PORT}`;

const api = request(url);

describe('inicio dos testes', () => {
  it('acessa a rota da home e verifica se a api está no ar', async () => {
    const response = await api.get('/');

    expect(response.status).toEqual(200);
    expect(response.text).toContain('WINX :)');
  });
});
