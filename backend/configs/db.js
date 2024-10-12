require('dotenv/config');
const mongoose = require("mongoose");

const connect = async () => {
    try {
        let value = JSON.parse(process.env.SECRETS);
        console.log(value)
        console.log(value.MONGO_URI);
        console.log(process.env.SECRETS);
        console.log(process.env.SECRETS.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch (e) {
        console.error('Connection failed');
        process.exit(1);
    }
};

module.exports = connect;