const mongoose = require("mongoose");

const connect = async () => {
    try {
        console.log(process.env.MONGO_URI);
        console.log(process.env['MONGO_URI']);
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch (e) {
        console.error('Connection failed');
        process.exit(1);
    }
};

module.exports = connect;