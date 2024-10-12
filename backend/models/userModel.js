const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
        }
    },
    password: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);