const File = require("../models/fileModel");

const createFile = async (req, res) => {
    if (!req.file) { return res.json({ "message": "Invalid file" }) };

    try {
        await File.create({
            contentType: req.file.mimetype,
            data: req.file.buffer,
            title: req.file.originalname,
        });
        return res.json({ message: "File created" });
    } catch (e) {
        console.log("An internal server error has occurred");
    }
    return res.json({ message: "An internal server error has occurred" });
};

const deleteFile = (req, res) => {
    return res.json({ message: `Deleted file id: ${req.params.id}` });
};

const getFiles = async (req, res) => {
    const files = await File.find();

    if (files) { return res.json({ files }); }
    return res.status(400).json(
        { message: "An internal server error has occurred" }
    );
};

const updateFile = (req, res) => {
    return res.json({ message: `Updated file id: ${req.params.id}` });
};

module.exports = {
    createFile,
    deleteFile,
    getFiles,
    updateFile,
};
