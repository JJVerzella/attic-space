require('dotenv/config');
const mongoose = require("mongoose");

const connect = async () => {
    try {
        console.log(process.env.SECRETS);
        console.log(process.env.SECRETS.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch (e) {
        console.error('Connection failed');
        process.exit(1);
    }
};

module.exports = connect;