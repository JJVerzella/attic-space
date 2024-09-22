const express = require("express");
const multer = require("multer");
const {
    createFile,
    deleteFile,
    getFiles,
    updateFile,
} = require("../controllers/fileController");

const router = express.Router();
const upload = multer();

router.get("/", getFiles);
router.post("/upload", upload.single('file'), createFile);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

module.exports = router;