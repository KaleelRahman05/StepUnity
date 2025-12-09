const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mockDB = require('./setup');

const { expect } = chai;
chai.use(chaiHttp);

describe('Authentication (API)', () => {
  before(async () => await mockDB.connect());
  afterEach(async () => await mockDB.clearDatabase());
  after(async () => await mockDB.closeDatabase());

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'User One', email: 'user1@example.com', password: 'password123' });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user');
    });

    it('should reject duplicate email addresses', async () => {
      await chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'User One', email: 'user2@example.com', password: 'password123' });

      const res = await chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'User Two', email: 'user2@example.com', password: 'password456' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      await chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'User Three', email: 'user3@example.com', password: 'password123' });

      const res = await chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'user3@example.com', password: 'password123' });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token');
    });

    it('should reject incorrect password', async () => {
      await chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'User Four', email: 'user4@example.com', password: 'password123' });

      const res = await chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'user4@example.com', password: 'wrongpassword' });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('success', false);
    });
  });
});
