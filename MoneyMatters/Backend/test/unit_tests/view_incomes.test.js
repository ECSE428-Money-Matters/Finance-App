const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index.js');
require('dotenv').config();

let dbStub;
const pool = require('../../db.js');

beforeEach(() => {
  // Before each test, we stub the database to control its behavior
  dbStub = sinon.stub(pool, 'query');
});

afterEach(() => {
  // After each test, we restore the original functionality of the database
  dbStub.restore();
});

describe('Viewing Incomes', () => {
  // Mocking the existence of incomes for the given email
  const mockIncomes = [
    { email: 'user@example.com', income_name: 'BusPatrol', amount: 5000, posted_date: '2023-01-01', category: 'Salary', income_period: 30},
    { email: 'user@example.com', income_name: 'Freelance Work', amount: 600, posted_date: '2023-02-02', category: 'Freelance', income_period: 30 },
  ];

//   test('View all incomes for a user', async () => {
//     const email = 'user@example.com';
//     const res = await request(app)
//       .get('/incomes')
//       .query({ email: email, column_name: 'None' });

//     console.log(res.body);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   test('Get incomes by period', async () => {
//     const queryParams = {
//       email: "qi.chen6@mail.mcgill.ca",
//       column_name: "income_period",
//       column_value_start: "1",
//       column_value_end: "1",
//     };
  

//     const res = await request(app)
//       .get("/incomes")
//       .send(queryParams);
  
//     expect(res.status).toBe(200); 
//   });
  

//   test('View incomes for a user by category', async () => {
//     const email = 'user@example.com';
//     const category = 'Salary';
//     const res = await request(app)
//       .get('/incomes')
//       .query({
//         email: email,
//         column_name: 'category',
//         column_value_start: category,
//         column_value_end: category
//       });

//     console.log(res.body);

//     expect(res.status).toBe(200);
//   });

      
  test('Request incomes without email should fail', async () => {
    const res = await request(app).get('/incomes');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email is required.');
  });

});
