const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    const SECRETS = JSON.parse(process.env.SECRETS);
    return jwt.sign({ id }, SECRETS.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;