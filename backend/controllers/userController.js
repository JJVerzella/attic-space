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

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.user.email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUser = (req, res) => {
    // Convert to Data Transfer Object (DTO)
    const { firstName, lastName, email } = req.user;
    return res.status(200).json({ message: { firstName, lastName, email } });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({
            id: user.id,
            email: user.email,
            token: generateToken(user.id)
        });
    }
    return res
        .status(400)
        .json({ message: "Invalid login attempt" });
};

const updateUser = async (req, res) => {
    // Find by id instead
    try {
        const { firstName, lastName } = req.body;
        const user = req.user;
        const u = await User.findOneAndUpdate({ email: req.user.email }, { firstName, lastName }, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'No user found' });
        // Create Data Transfer Object (DTO)
        const response = { message: { firstName: u.firstName, lastName: u.lastName, email: u.email } };
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: `Bad request` });
    }
};

module.exports = {
    createUser,
    deleteUser,
    getUser,
    loginUser,
    updateUser,
};
