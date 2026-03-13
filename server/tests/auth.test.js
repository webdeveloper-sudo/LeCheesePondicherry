const request = require('supertest');
const app = require('../server');
const dbHelper = require('./dbHelper');
const OTP = require('../models/OTP');
const User = require('../models/User');

// Mock email service to avoid sending real emails
jest.mock('../utils/emailService', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true)
}));

beforeAll(async () => await dbHelper.connect());
afterEach(async () => await dbHelper.clearDatabase());
afterAll(async () => await dbHelper.closeDatabase());

describe('Auth API Integration Tests', () => {
  it('Should register a new user using the OTP flow', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    // 1. Send OTP
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .send({ email });
    
    expect(sendRes.statusCode).toEqual(200);
    expect(sendRes.body.success).toBe(true);

    // 2. Get OTP from Database
    const otpRecord = await OTP.findOne({ email });
    expect(otpRecord).toBeDefined();
    const otp = otpRecord.otp;

    // 3. Verify OTP
    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email, otp });
    
    expect(verifyRes.statusCode).toEqual(200);
    expect(verifyRes.body.tempToken).toBeDefined();
    const tempToken = verifyRes.body.tempToken;

    // 4. Set Password (Creates the user)
    const setPassRes = await request(app)
      .post('/api/auth/set-password')
      .send({ email, password, tempToken });
    
    expect(setPassRes.statusCode).toEqual(201);
    expect(setPassRes.body.success).toBe(true);
    expect(setPassRes.body.user.email).toBe(email);

    // 5. Verify User exists in DB
    const user = await User.findOne({ email });
    expect(user).toBeDefined();
    expect(user.isEmailVerified).toBe(true);
  });
});
