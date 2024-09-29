const express = require("express");
const {
    createUser,
    deleteUser,
    getUser,
    loginUser,
    updateUser,
} = require("../controllers/userController");
const { protectRoute } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           example: ObjectId('66f8309e4f11c6a1ace89446')
 *           description: An auto-generated unique identifier
 *         firstName:
 *           type: string
 *           example: John
 *           description: First name
 *         lastName:
 *           type: string
 *           example: Doe
 *           description: Last name
 *         email:
 *           type: string
 *           example: john.doe@gmail.com
 *           description: Email address
 *         password:
 *           type: string
 *           example: Password123!
 *           description: Password
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-09-28T12:30:00.000Z
 *           description: Created-At Date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-09-28T12:30:00.000Z
 *           description: Updated-By Date
 *         __v:
 *           type: integer
 *           format: int32
 *           example: 0
 *           description: Version
 *       example:
 *         _id: ObjectId('66f00e566217387ee6ff9235')
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@gmail.com
 *         password: Password123!
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
 *   - name: Users
 *     description: The users API
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user account
 *     description: Returns the current user's information
 *     operationId: getCurrentUser
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
 *                 message:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 */
router.get("/", protectRoute, getUser);

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register user
 *     description: Register to the application
 *     operationId: registerUser
 *     requestBody:
 *       description: Register user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Unsuccessful operation (user already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *       500:
 *         description: Unsuccessful operation (internal server error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 */
router.post("/register", createUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user
 *     description: Login user into the application
 *     operationId: loginUser
 *     requestBody:
 *       description: Login user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid login attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user account
 *     description: Update user account
 *     operationId: updateUser
 *     requestBody:
 *       description: Update user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response for the user's account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Unsuccessful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *       404:
 *         description: Unsuccessful response (no user found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 */
router.put("/", protectRoute, updateUser);

/**
 * @swagger
 * /api/v1/users:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user account
 *     description: Delete account
 *     operationId: deleteUser
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
 *         description: Unsuccessful operation (user not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *       500:
 *         description: Unsuccessful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 */
router.delete("/", protectRoute, deleteUser);

module.exports = router;