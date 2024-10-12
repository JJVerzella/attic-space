const mongoose = require("mongoose");

const connect = async () => {
    try {
        const SECRETS = JSON.parse(process.env.SECRETS);
        console.log(SECRETS.MONGO_URI);
        await mongoose.connect(SECRETS.MONGO_URI);
    }
    catch (e) {
        console.error('Connection failed');
        process.exit(1);
    }
};

module.exports = connect;