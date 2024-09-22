const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    title: String,
    data: Buffer,
    contentType: String,
}, {
    timestamps: true
});

module.exports = mongoose.model("File", fileSchema);

/*
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
*/