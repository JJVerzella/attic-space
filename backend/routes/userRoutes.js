const express = require("express");
const {
    createUser,
    deleteUser,
    getUser,
    loginUser,
    updateUser,
} = require("../controllers/userController");
const { protectRoute } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protectRoute, getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id", protectRoute, updateUser);
router.delete("/:id", protectRoute, deleteUser);

module.exports = router;
