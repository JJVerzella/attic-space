const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const { protectRoute } = require('../middleware/authMiddleware');
const { deleteFile, getFile, getFiles, saveDocument, shareDocument, updateFile, uploadFile } = require('../controllers/fileController');

const router = express.Router();
const upload = multer();

router.get('/', protectRoute, getFiles);
router.get('/:id', protectRoute, getFile);
router.post('/upload', protectRoute, upload.single('file'), uploadFile);
router.put('/:id', protectRoute, upload.single('file'), updateFile);
router.delete('/:id', protectRoute, deleteFile);

router.post('/:id/save', protectRoute, saveDocument);
router.put('/:id/share', protectRoute, [
    body().isObject(),
    body('users').isArray().custom((value) => {
        return value.length !== 0;
    }),
    body('users.*.email').exists().isEmail(),
], shareDocument);

// Version document

module.exports = router;