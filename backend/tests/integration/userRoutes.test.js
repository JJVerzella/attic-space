const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/userModel');
const {
    invalidLoginCredentials,
    registerUserPayload,
    loginUserPayload
} = require('../fixtures/users');


describe('User API', () => {

    let mongoServer;

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoURI = mongoServer.getUri();

        await mongoose.connect(mongoURI);
    });

    afterEach(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should not get the current user (no token)', async () => {
        const response = await request(app)
            .get('/api/v1/users/');
        expect(response.status).toBe(401);
        expect(response.body?.message).toEqual('Not Authorized');
    });

    it('should not get the current user (no token)', async () => {
        const response = await request(app)
            .get('/api/v1/users/')
            .set('Authorization', 'Bearer');
        expect(response.status).toBe(401);
        expect(response.body?.message).toEqual('Not Authorized');
    });

    it('should get the current user (token)', async () => {
        const { body } = await request(app)
            .post('/api/v1/users/register')
            .set('Accept', 'application/json')
            .send(registerUserPayload);

        const { token } = body;
        const response = await request(app)
            .get('/api/v1/users/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body?.message.firstName).toEqual('John');
        expect(response.body?.message.lastName).toEqual('Doe');
        expect(response.body?.message.email).toEqual('john.doe@gmail.com');
    });

    it('should login the user (invalid login)', async () => {
        await request(app)
            .post('/api/v1/users/register')
            .set('Accept', 'application/json')
            .send(registerUserPayload);
        
        const response = await request(app)
            .post('/api/v1/users/login')
            .set('Accept', 'application/json')
            .send(invalidLoginCredentials);
        
        expect(response.status).toBe(400);
        expect(response.body?.message).toEqual('Invalid login attempt');
    });

    it('should login the user', async () => {
        await request(app)
            .post('/api/v1/users/register')
            .set('Accept', 'application/json')
            .send(registerUserPayload);
        
        const response = await request(app)
            .post('/api/v1/users/login')
            .set('Accept', 'application/json')
            .send(loginUserPayload);
        
        expect(response.status).toBe(200);
        expect(response.body?.email).toEqual('john.doe@gmail.com');
        expect(response.body?.token).toBeTruthy();
    });

    it('should update the user', async () => {
        const { body } = await request(app)
            .post('/api/v1/users/register')
            .set('Accept', 'application/json')
            .send(registerUserPayload);
        const { token } = body;
        
        const response = await request(app)
            .put('/api/v1/users/')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .send({
                firstName: 'Steve',
                lastName: 'Jobs',
            });
        
        expect(response.status).toBe(200);
        expect(response.body?.message.firstName).toEqual("Steve");
        expect(response.body?.message.lastName).toEqual("Jobs");
        expect(response.body?.message.email).toEqual("john.doe@gmail.com");
    });

    it('should delete the user', async () => {
        const { body} = await request(app)
            .post('/api/v1/users/register')
            .set('Accept', 'application/json')
            .send(registerUserPayload);
        const {token} = body;

        const response = await request(app)
            .delete('/api/v1/users/')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json');
        
        const result = await User.findOne({email: 'john.doe@gmail.com'});
        expect(response.status).toBe(204);
        expect(result).toBe(null);
    });
});