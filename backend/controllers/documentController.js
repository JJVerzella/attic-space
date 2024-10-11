const { validationResult } = require("express-validator");
const File = require("../models/fileModel");

const createDocument = async (req, res) => {
    const userId = req.user.id;
    let file;
    try {
        file = await File.create({
            contentType: 'text/plain',
            data: Buffer.alloc(0),
            size: 0,
            title: 'Untitled',
            userId
        });
        res.status(201).json({
            id: file._id,
            contentType: file.contentType,
            data: file.data.toString('base64'),
            size: file.size,
            title: file.title,
            userId: file.userId,
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getDocument = async (req, res) => {
    const { documentId } = req.params;
    const { _id, email } = req.user;
    let file;
    try {
        file = await File.findOne({
            _id: documentId,
            $or: [
                { userId: _id },
                { collaborators: { $in: [email] } }
            ]
        }
        );
    } catch (_) {
        return res.status(404)
            .json({ message: 'File not found' });
    }
    if (!file) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
    return res.status(200).json({
        id: file._id,
        contentType: file.contentType,
        data: file.data.toString('base64'),
        size: file.size,
        title: file.title,
        userId: file.userId,
    })
}

const saveDocument = async (req, res) => {
    const { documentId } = req.params;
    const { content } = req.body;
    const { _id, email } = req.user;
    try {
        await File.updateOne({
            _id: documentId,
            $or: [
                { userId: _id },
                { collaborators: { $in: [email] } }
            ]
        },
            { data: content }
        );
        res.status(204).json({});
    } catch (_) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const shareDocument = async (req, res) => {
    const { documentId } = req.params;
    const { users } = req.body;
    const userId = req.user.id;

    const results = validationResult(req);
    if (!results.isEmpty) {
        return res.status(500)
            .json({ message: 'Internal Server Error' });
    }

    try {
        const collaborators = users.map(user => user.email);
        await File.updateOne(
            { _id: documentId, userId },
            { $push: { collaborators } },
        )
        res.status(204);
    } catch (_) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { createDocument, getDocument, saveDocument, shareDocument };