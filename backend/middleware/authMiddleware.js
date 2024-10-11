const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
    let authorization = req.headers.authorization;
    let token = "";
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            
            next();
        } catch (e) {
            console.log('Called 1')
            return res.status(401).json({ message: "Not Authorized" });
        }
    }

    if (!token) {
        console.log('Called 2')
        return res.status(401).json({ message: "Not Authorized" });
    }
};

module.exports = { protectRoute };