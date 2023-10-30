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

    test('should return an empty list when there are no expenses', async () => {
        // Simulate a scenario where there are no expenses in the database
        dbStub.returns(Promise.resolve({ rows: [] }));

        const res = await request(app).get('/view_expenses');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });

    test('should return expenses for a specific category', async () => {
        // Simulate a scenario where you want to filter expenses by category
        const categoryToFilter = 'Food';
        const expenses = [
            { expense_name: 'Expense 1', amount: 100, category: 'Food' },
            { expense_name: 'Expense 2', amount: 200, category: 'Food' },
        ];

        dbStub.returns(Promise.resolve({ rows: expenses }));

        const res = await request(app).get(`/view_expenses?category=${categoryToFilter}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(expenses.length);
        expect(res.body.every(expense => expense.category === categoryToFilter)).toBe(true);
    });

    test('should return expenses in a specific date range', async () => {
        // Simulate a scenario where you want to filter expenses by date range
        const startDate = '2023-10-01';
        const endDate = '2023-10-31';
        const expenses = [
            { expense_name: 'Expense 1', amount: 100, category: 'Food', posted_date: '2023-10-15' },
            { expense_name: 'Expense 2', amount: 200, category: 'Transportation', posted_date: '2023-10-20' },
        ];

        dbStub.returns(Promise.resolve({ rows: expenses }));

        const res = await request(app).get(`/view_expenses?start_date=${startDate}&end_date=${endDate}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(expenses.length);
        expect(res.body.every(expense => {
            const date = new Date(expense.posted_date);
            return date >= new Date(startDate) && date <= new Date(endDate);
        })).toBe(true);
    });
    // Mohammed add here additional test
});