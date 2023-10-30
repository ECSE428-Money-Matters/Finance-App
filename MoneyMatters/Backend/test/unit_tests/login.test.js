const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index.js');
const { test, expect, beforeEach, afterEach, describe} = require('@jest/globals');

let dbStub;

const pool = require('../../db.js');

beforeEach(() => {
    // Mock the database pool
    dbStub = sinon.stub(pool, 'query');
});

afterEach(() => {
    // Restore the database pool to its original state after each test
    dbStub.restore();
});

describe('login automated tests', () => {

    test('successful login', async () => {
        const username = 'test_login_User';
        const password = 'testPass123';

        // Mock a successful DB response
        dbStub.returns(Promise.resolve({ rows: [{ username: username, hashed_password: password }] }));

        const res = await request(app).post('/login').send({ username, password });

        expect(res.status).toBe(200);
        expect(res.body).toBe('Login successful');
    });

    test('invalid password', async () => {
        const username = 'testUser';
        const password = 'testPass123';

        // Mock a DB response with a different password
        dbStub.returns(Promise.resolve({ rows: [{ username: username, hashed_password: "wrong_pass" }] }));

        const res = await request(app).post('/login').send({ username, password });

        expect(res.status).toBe(200);
        expect(res.body).toBe('Invalid password');
    });

    test('non-existent username', async () => {
        const username = 'testUser';
        const password = 'testPass123';

        // Mock a DB response indicating no such user
        dbStub.returns(Promise.resolve([]));

        const res = await request(app).post('/login').send({ username, password });

        expect(res.status).toBe(200);
        expect(res.body).toBe('Username not found');
    });

    test('exceeding login attempts', async () => {
        const username = 'testUser';
        const password = 'testPass123';

        // Simulate 3 failed attempts
        for (let i = 0; i < 3; i++) {
            // Mock a DB response with a different password for failed attempt
            dbStub.returns(Promise.resolve({ rows: [{ username: username, hashed_password: i }] }));
            await request(app).post('/login').send({ username, password });
        }

        const res = await request(app).post('/login').send({ username, password });

        expect(res.status).toBe(200);
        expect(res.body).toBe("Too many login attempts. Select 'Forgot Password' to proceed.");
    });
})