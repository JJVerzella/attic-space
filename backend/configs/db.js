const mongoose = require("mongoose");

const connect = async () => {
    try { await mongoose.connect(process.env.MONGODB_URI); }
    catch (e) { process.exit(1); }
};

module.exports = connect;