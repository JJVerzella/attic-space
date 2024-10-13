const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../../server');
const File = require('../../models/fileModel');

describe("Documents API", () => {

    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoURI = mongoServer.getUri();

        await mongoose.connect(mongoURI);

        const response = await request(app)
            .post('/api/v1/users/login')
            .set('Accept', 'application/json')
            .send({ email: 'automation.user@gmail.com', password: 'Password123!' });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it("", () => {

    });
});