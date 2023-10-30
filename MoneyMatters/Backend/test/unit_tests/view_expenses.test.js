const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index.js'); // Replace with your app's entry point
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

describe('Viewing Expenses', () => {
    test('should return a list of expenses', async () => {
        const expenses = [
            { expense_name: 'Expense 1', amount: 100, category: 'Food' },
            { expense_name: 'Expense 2', amount: 200, category: 'Transportation' },
        ];
        dbStub.returns(Promise.resolve({ rows: expenses }));
        const res = await request(app).get('/view_expenses');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(expenses.length);
    });


    // Mohammed add here additional tests
    test('handle errors when fetching expenses', async () => {
        const res = await request(app).get('/view_expenses');
        expect(res.status).toBe(500); // Example: Check for a 500 internal server error
    });
});