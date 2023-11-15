const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index.js');
const { test, expect, beforeEach, afterEach, describe } = require('@jest/globals');
require('dotenv').config();

let dbStub;
const pool = require('../../db.js');

beforeEach(() => {
    dbStub = sinon.stub(pool, 'query');
});

afterEach(() => {
    dbStub.restore();
});

describe('Adding source of income with category', () => {
    test('successfully adding a source of income', async () => {
        const payload = {
            email: 'user@example.com',
            income_name: 'Freelance Work',
            amount: 500,
            posted_date: '2023-01-01',
            category: 'Freelance',
            optional_description: 'Article writing',
            income_period: 30
        };

        // Mock successful database insertion
        dbStub.resolves({ rows: [payload], rowCount: 1 });

        const res = await request(app).post('/incomes').send(payload);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Income added successfully.');
    });

    test('adding a source of income without a category should fail', async () => {
        const payload = {
            email: 'user@example.com',
            income_name: 'Freelance Work',
            amount: 500,
            posted_date: '2023-01-01',
            // Missing category
        };

        const res = await request(app).post('/incomes').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('All fields are required.');
    });

    test('adding a source of income with empty category should fail', async () => {
        const payload = {
            email: 'user@example.com',
            income_name: 'Freelance Work',
            amount: 500,
            posted_date: '2023-01-01',
            category: '' // Empty category
        };

        const res = await request(app).post('/incomes').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('All fields are required.');
    });

    test('adding a source of income with negative amount should fail', async () => {
        const payload = {
            email: 'user@example.com',
            income_name: 'Freelance Work',
            amount: -500, // Negative amount
            posted_date: '2023-01-01',
            category: 'Freelance'
        };

        const res = await request(app).post('/incomes').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid amount. Amount should be a positive number.');
    });

    test('adding a source of income with invalid amount should fail', async () => {
        const payload = {
            email: 'user@example.com',
            income_name: 'Freelance Work',
            amount: 'invalid', // Non-numeric amount
            posted_date: '2023-01-01',
            category: 'Freelance'
        };

        const res = await request(app).post('/incomes').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid amount. Amount should be a positive number.');
    });

    test('adding a source of income with zero amount should fail', async () => {
        const payload = {
            email: 'user@example.com',
            income_name: 'Freelance Work',
            amount: 0, // zero
            posted_date: '2023-01-01',
            category: 'Freelance'
        };

        const res = await request(app).post('/incomes').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Amount cannot be zero dollars.');
    });


    test('adding a source of income without email should fail', async () => {
        const payload = {
            // Missing email
            income_name: 'Freelance Work',
            amount: 500,
            posted_date: '2023-01-01',
            category: 'Freelance',
            optional_description: 'Article writing',
            income_period: 30
        };

        const res = await request(app).post('/incomes').send(payload);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('All fields are required.');
    });
});
