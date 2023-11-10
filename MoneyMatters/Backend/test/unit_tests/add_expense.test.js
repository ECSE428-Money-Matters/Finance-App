const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index.js');
const { test, expect, beforeEach, afterEach, describe} = require('@jest/globals');
require('dotenv').config();

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

describe('test adding expense', () =>{

    test('successfully adding an expense', async () => {
        const payload = {
            email: 'test@example.com',
            expense_name: 'Lunch',
            amount: 15,
            posted_date: '2023-10-01',
            category: 'Food',
            optional_description: 'Sandwich and juice'
        };

        dbStub.returns(Promise.resolve({ rows: [payload] }));

        const res = await request(app).post('/add_expense').send(payload);

        expect(res.status).toBe(200);
        console.log(res.body.message)
        expect(res.body.message).toBe('Expense added successfully.');
    });

    test('adding an expense with missing fields', async () => {
        const payload = {
            expense_name: 'Lunch',
            amount: 15,
            posted_date: '2023-10-01',
            category: 'Food'
        };

        const res = await request(app).post('/add_expense').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('All fields are required.');
    });

    test('adding an expense with empty title', async () => {
        const payload = {
            email: 'test@example.com',
            expense_name: '  ',
            amount: 15,
            posted_date: '2023-10-01',
            category: 'Food'
        };

        const res = await request(app).post('/add_expense').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Expense title cannot be empty.');
    });

    test('adding an expense with non-numeric amount', async () => {
        const payload = {
            email: 'test@example.com',
            expense_name: 'Lunch',
            amount: 'abc',
            posted_date: '2023-10-01',
            category: 'Food'
        };

        const res = await request(app).post('/add_expense').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid amount. Amount should be a positive number.');
    });

    test('adding an expense with negative amount', async () => {
        const payload = {
            email: 'test@example.com',
            expense_name: 'Lunch',
            amount: -15,
            posted_date: '2023-10-01',
            category: 'Food'
        };

        const res = await request(app).post('/add_expense').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid amount. Amount should be a positive number.');
    });

    test('adding an expense with zero dollars', async () => {
        const payload = {
            email: 'test@example.com',
            expense_name: 'Lunch',
            amount: 0,
            posted_date: '2023-10-01',
            category: 'Food'
        };

        const res = await request(app).post('/add_expense').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Amount cannot be zero dollars.');
    });


    test('adding an expense with future date', async () => {
        const payload = {
            email: 'test@example.com',
            expense_name: 'Lunch',
            amount: 15,
            posted_date: '2023-12-01',
            category: 'Food'
        };

        const res = await request(app).post('/add_expense').send(payload);

        expect(res.status).toBe(400);
        console.log(res.body.error)
        expect(res.body.error).toBe('Date cannot be in the future.');
    });
});
