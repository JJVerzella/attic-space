const express = require('express');
const {
    createDocument,
    getDocument,
    getDocumentVersions,
    saveDocument,
    shareDocument
} = require('../controllers/documentController');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:documentId', protectRoute, getDocument);
router.patch('/:documentId', protectRoute, saveDocument);
router.post('/', protectRoute, createDocument);
router.put('/:documentId/share', protectRoute, shareDocument);
router.get('/:documentId/versions', protectRoute, getDocumentVersions);

module.exports = router;