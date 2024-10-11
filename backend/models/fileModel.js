const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    contentType: { type: String, required: true },
    data: { type: Buffer },
    size: { type: Number, required: true },
    collaborators: { type: [String] },
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema);

/*
validate: {
    validator: function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    },
},
*/