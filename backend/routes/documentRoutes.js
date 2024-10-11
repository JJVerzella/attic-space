const express = require('express');
const { protectRoute } = require('../middleware/authMiddleware');
const { createDocument, getDocument, saveDocument, shareDocument } = require('../controllers/documentController');

const router = express.Router();

router.get('/:documentId', protectRoute, getDocument);
router.patch('/:documentId', protectRoute, saveDocument);
router.post('/', protectRoute, createDocument);
router.put('/:documentId/share', protectRoute, shareDocument);


module.exports = router;