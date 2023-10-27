const request = require('supertest');
const sinon = require('sinon');
const pgp = require('pg-promise')();
const app = require('../../index.js');
const { test, expect, beforeEach, afterEach, describe} = require('@jest/globals');
require('dotenv').config();
const nodemailer = require('nodemailer');

let dbStub;
const pool = require('../../db.js');

describe('testing create-user', () => {

    // Tests for the '/register' endpoint
    describe('testing /register endpoint', () => {
        afterEach(async () => {
            // Clean up database after each test to ensure no interference
            await pool.query('DELETE FROM users WHERE email = $1', ['testemail@example.com']);
        });

        test('should return error when email already exists', async () => {
            // Insert a test user into the database
            await pool.query("INSERT INTO users (email, username, hashed_password) VALUES('testemail@example.com', 'testuser', 'testpassword')");

            const res = await request(app).post('/register').send({
                email: 'testemail@example.com',
                username: 'testuser2',
                password: 'testpassword2'
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email already exists');
        });

        test('should register successfully', async () => {
            const res = await request(app).post('/register').send({
                email: 'anthony.boustany@hotmail.com',
                username: 'testuser',
                password: 'testpassword'
            });

            expect(res.status).toBe(200);
            console.log(res.body.message)
            expect(res.body.message).toBe('Verification code sent to email. Please verify to complete registration.');


            const verificationCode = res.body.verificationCode;
            console.log(`Received verification code: ${verificationCode}`);
        });
    });

    // Tests for the '/verify' endpoint
    describe('testing /verify endpoint', () => {
        let verificationCode;
        beforeEach(async () => {

            // Calling register because it's the only way to create a Verification code
            const res = await request(app).post('/register').send({
                email: 'anthony.boustany@hotmail.com',
                username: 'testuser',
                password: 'testpassword'
            });
            verificationCode = res.body.verificationCode;
            console.log(`Received verification code: ${verificationCode}`);
        });

        afterEach(async () => {
            // Clean up database after each test to ensure no interference
            await pool.query('DELETE FROM users WHERE email = $1', ['anthony.boustany@hotmail.com']);
        });

        test('should verify successfully', async () => {

            const res = await request(app).post('/verify').send({
                email: 'anthony.boustany@hotmail.com',
                code: verificationCode
            });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Account created successfully!');
        });

        test('should return error for invalid verification code', async () => {
            const res = await request(app).post('/verify').send({
                email: 'anthony.boustany@hotmail.com',
                code: 654321  // Incorrect code
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid verification code');
        });
    });


    describe('testing /users endpoint', () => {

        beforeEach(() => {
            // Mock the database pool
            dbStub = sinon.stub(pool, 'query');

        });

        afterEach(() => {
            // Restore the database pool and email sending function to their original states after each test
            dbStub.restore();
        });

        // Test GET user call
        test('should retrieve a list of users', async () => {
            const email = 'test9@example.com';
            const username = 'testUser';
            const password = 'testPass123';

            // Mock the database to return the user list
            dbStub.resolves({rows: [{email, username, password}]});

            const res = await request(app)
                .get('/users')
                .send();

            expect(res.status).toBe(200);
            const users = res.body;
            console.log(users)
            expect(users.some(user => user.email === email)).toBe(true);
        });
    });
});