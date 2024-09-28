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

router.get("/", protectRoute, getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/", protectRoute, updateUser);
router.delete("/", protectRoute, deleteUser);

module.exports = router;