const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    data: { type: Buffer, required: true },
    collaborators: [{
        type: String, required: true, validate: {
            validator: function (value) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
        }, unique: true,
    }],
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema);