const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const {
    deleteFile,
    getFile,
    getFiles,
    shareDocument,
    updateFile,
    uploadFile,
} = require('../controllers/fileController');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - collaborators
 *         - contentType
 *         - data
 *         - size
 *         - title
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: An auto-generated unique identifier
 *         collaborators:
 *           type: array
 *           items:
 *             type: string
 *           description: The user's email account
 *         contentType:
 *           type: string
 *           description: The content type of the file
 *         data:
 *           type: string
 *           format: binary
 *           description: The binary representation of the data
 *         size:
 *           type: integer
 *           format: int32
 *           description: The size of the file
 *         title:
 *           type: string
 *           description: The title of the file
 *         userId:
 *           type: string
 *           format: ObjectId
 *           description: The user's id
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the file was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the file was updated
 *         __v:
 *           type: integer
 *           format: int32
 *           description: The version of the file object
 *       example:
 *         _id: ObjectId('66f83e6439902ffc69260f84')
 *         collaborators: ['john.doe@gmail.com']
 *         contentType: application/pdf
 *         data: Binary.createFromBase64('')
 *         size: 405266
 *         title: Sample Title
 *         userId: ObjectId('66f82ee35f208657e9e50ff0')
 *         createdAt: '2024-09-28T12:30:00.000Z'
 *         updatedAt: '2024-09-28T12:30:00.000Z'
 *         __v: 0
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Files
 *     description: The files API
 */

/**
 * @swagger
 * /api/v1/files:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get current user's files
 *     description: Get user's files
 *     operationId: getFiles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contentType:
 *                   type: string
 *                 data:
 *                   type: string
 *                 size:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 userId:
 *                   type: string
 *       500:
 *         description: Unsuccessful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/', protectRoute, getFiles);

/**
 * @swagger
 * paths:
 *   /api/v1/files/{id}:
 *     get:
 *       tags:
 *         - Files
 *       summary: Get file
 *       description: Get file by id
 *       operationId: getFile
 *       parameters:
 *         - name: id
 *           in: path
 *           description: File Id
 *           required: true
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   contentType:
 *                     type: string
 *                   data:
 *                     type: string
 *                   size:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   userId:
 *                     type: string
 *         404:
 *           description: Unsuccessful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         500:
 *           description: Unsuccessful option (invalid)
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */
router.get('/:id', protectRoute, getFile);

/**
 * @swagger
 * /api/v1/files/upload:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload file
 *     description: Update file to the system
 *     operationId: uploadFile
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contentType:
 *                   type: string
 *                 data:
 *                   type: string
 *                 size:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Unsuccessful operation (invalid file)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unsuccessful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/upload', protectRoute, upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/v1/files/{id}:
 *   put:
 *     tags:
 *       - Files
 *     summary: Update file
 *     description: Update file
 *     operationId: updateFile
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of file to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contentType:
 *                   type: string
 *                 data:
 *                   type: string
 *                 size:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Unsuccessful operation (file not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unsuccessful operation (internal server error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/:id', protectRoute, upload.single('file'), updateFile);

/**
 * @swagger
 * /api/v1/files/{id}:
 *   delete:
 *     tags:
 *       - Files
 *     summary: Delete file
 *     description: Delete file
 *     operationId: deleteFile
 *     parameters:
 *       - name: id
 *         in: path
 *         description: File id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Unsuccessful opreation (file not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unsuccessful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:id', protectRoute, deleteFile);

/**
 * @swagger
 * /api/v1/files/{id}/share:
 *   put:
 *     tags:
 *       - Files
 *     summary: Share file
 *     description: Share file
 *     operationId: shareFile
 *     parameters:
 *       - name: id
 *         in: path
 *         description: File id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Emails
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   collaborators:
 *                     type: array
 *       400:
 *         description: Unsuccessful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Unsuccessful operation (file not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/:id/share', [
    body().isObject(),
    body('users').isArray().custom((value) => {
        return value.length !== 0;
    }),
    body('users.*.email').exists().isEmail(),
], shareDocument);

module.exports = router;