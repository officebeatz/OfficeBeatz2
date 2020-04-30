// manually set NODE_ENV (rather than in the npm script)
require('dotenv').config();
process.env.NODE_ENV = 'dev';

const app = require('../app'); // TODO: change app.js to export app before app.listen
const supertest = require('supertest');

// wrapped object of our express app, which we can use to make HTTP requests
const requests = supertest(app);

describe('/', () => {
    test('GET: return 200', async () => {
        const response = await requests.get('/');
        expect(response.status).toEqual(200);
    })

    // Example failing test, to prove that it can fail
    // test('GET: should fail to return 400', async () => {
    //     const response = await requests.get('/');
    //     expect(response.status).toEqual(400);
    // })
})
