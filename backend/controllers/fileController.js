const { validationResult } = require('express-validator');
const File = require("../models/fileModel");

const uploadFile = async (req, res) => {
    // TODO: Implement API response payload structure
    if (!req.file) return res.status(400).json({ message: 'Invalid File' });
    try {
        const file = await File.create({
            contentType: req.file.mimetype,
            data: req.file.buffer,
            size: req.file.size,
            title: req.file.originalname,
            userId: req.user._id,
        });
        // TODO: Implement data transfer object (DTO)
        res.status(201).json({
            contentType: file.contentType,
            data: file.data.toString('base64'),
            size: file.size,
            title: file.title,
            userId: file.userId,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteFile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const file = await File.findOneAndDelete({ _id: id, userId });
        if (!file) {
            return res.status(404)
                .json({ message: 'File not found' });
        }
        res.status(204).json({});
    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getFile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const file = await File.findOne({ _id: id, userId });
        if (!file) {
            return res.status(404)
                .json({ message: 'File not found' });
        }
        // TODO: Implement data transfer object (DTO)
        res.status(200).json({
            contentType: file.contentType,
            data: file.data.toString('base64'),
            size: file.size,
            title: file.title,
            userId: file.userId,
        });
    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getFiles = async (req, res) => {
    try {
        const { _id, email } = req.user;
        const files = await File.find({
            $or: [
                { userId: _id },
                { collaborators: { $in: [email] }}
            ]
        });
        res.status(200).json(files.map(file => {
            return {
                id: file.id,
                contentType: file.contentType,
                data: file.data.toString('base64'),
                size: file.size,
                title: file.title,
                userId: file.userId,
            };
        }));
    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateFile = async (req, res) => {
    // Supported operation(s): Update the title of the file
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const { title } = req.body;
        const file = await File.findOneAndUpdate(
            { _id: id, userId },
            { title },
            { new: true, runValidators: true },
        )
        if (!file) {
            return res.status(400)
                .json({ message: 'Bad Request' });
        }
        // TODO: Implement data transfer object (DTO)
        res.status(201).json({
            contentType: file.contentType,
            data: file.data.toString('base64'),
            size: file.size,
            title: file.title,
            userId: file.userId,
        });
    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const shareDocument = async (req, res) => {
    const documentId = req.params.id;
    const { users } = req.body;

    // Validation
    const results = validationResult(req);
    if (!results.isEmpty()) return res.status(400).json({ errors: results.array() });

    const file = await File.findById(documentId);
    if (!file) return res.status(404).json({ message: 'File does not exist' });

    // TODO: Check for duplicates
    const collaborators = users.map(user => user.email);
    const updatedFile = await File.findByIdAndUpdate(documentId, {$push: { collaborators }}, { new: true, runValidators: true });

    res.status(200).json({ message: {collaborators: updatedFile.collaborators}});
}

module.exports = { deleteFile, getFile, getFiles, shareDocument, updateFile, uploadFile };