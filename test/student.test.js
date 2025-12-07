const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mockDB = require('./setup');
const User = require('../models/User');
const { expect } = chai;

chai.use(chaiHttp);

describe('Student Operations Tests', () => {
  let studentToken;
  let teacherToken;
  let studentId;
  let teacherId;

  before(async () => await mockDB.connect());
  afterEach(async () => await mockDB.clearDatabase());
  after(async () => await mockDB.closeDatabase());

  beforeEach(async () => {
    // Create teacher
    const teacherRes = await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher',
        verificationCode: 'STEPUNITY_MASTER_2025',
        styleSpecialization: 'Hip-hop'
      });
    teacherToken = teacherRes.body.token;
    teacherId = teacherRes.body.user.id;

    // Create student
    const studentRes = await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student',
        rollNumber: 'CS001',
        department: 'Computer Science',
        interestedStyle: 'Hip-hop'
      });
    studentToken = studentRes.body.token;
    studentId = studentRes.body.user.id;

    // Assign teacher to student
    await User.findByIdAndUpdate(studentId, { assignedTeacher: teacherId });
  });

  describe('GET /api/student/dashboard', () => {
    it('should get student dashboard', async () => {
      const res = await chai.request(app)
        .get('/api/student/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('student');
      expect(res.body.data).to.have.property('teacher');
    });
  });

  describe('POST /api/student/leave', () => {
    it('should submit leave request', async () => {
      const res = await chai.request(app)
        .post('/api/student/leave')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          reason: 'Medical emergency',
          date: new Date()
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
    });
  });
});
