const registerUserPayload = { firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com', password: 'Password123!' };
const loginUserPayload = { email: 'john.doe@gmail.com', password: 'Password123!' };
const invalidLoginCredentials = { email: 'john.doe@gmail.com', password: 'password' };

module.exports = {
    registerUserPayload,
    loginUserPayload,
    invalidLoginCredentials
}