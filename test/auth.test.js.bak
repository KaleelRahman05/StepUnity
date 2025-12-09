const { describe, it, expect, beforeEach } = require('@jest/globals');
const { login, logout, register } = require('../src/auth');

describe('Authentication', () => {
    beforeEach(() => {
        // Clear any test data before each test
    });

    describe('register', () => {
        it('should register a new user with valid credentials', async () => {
            const result = await register('user@example.com', 'password123');
            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
        });

        it('should reject duplicate email addresses', async () => {
            await register('user@example.com', 'password123');
            const result = await register('user@example.com', 'password456');
            expect(result.success).toBe(false);
        });
    });

    describe('login', () => {
        it('should login with correct credentials', async () => {
            await register('user@example.com', 'password123');
            const result = await login('user@example.com', 'password123');
            expect(result.success).toBe(true);
            expect(result.token).toBeDefined();
        });

        it('should reject incorrect password', async () => {
            await register('user@example.com', 'password123');
            const result = await login('user@example.com', 'wrongpassword');
            expect(result.success).toBe(false);
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            const result = await logout('token123');
            expect(result.success).toBe(true);
        });
    });
});