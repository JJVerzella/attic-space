const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../configs/generateToken");

const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res
            .status(400)
            .json({ message: "User exists in the system" });
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hash
        });
        return res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user.id),
        })
    } catch (e) {
        return res
            .status(400)
            .json({ message: "An error occurred on the server" });
    }
};

const deleteUser = (req, res) => {
    res.json({ text: `Delete user: ${req.params.id}` });
};

const getUser = (req, res) => {
    res.json({ text: "Get user" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
            id: user.id,
            email: user.email,
            token: generateToken(user.id)
        });
    }
    return res
        .status(400)
        .json({ message: "Invalid login attempt" });
};

const updateUser = (req, res) => {
    res.json({ text: `Update user: ${req.params.id}` });
};

module.exports = {
    createUser,
    deleteUser,
    getUser,
    loginUser,
    updateUser,
};
