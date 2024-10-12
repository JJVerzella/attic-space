const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
    let authorization = req.headers.authorization;
    let token = "";
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            const SECRETS = JSON.parse(process.env.SECRETS);
            token = authorization.split(" ")[1];
            const decoded = jwt.verify(token, SECRETS.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            
            next();
        } catch (e) {
            return res.status(401).json({ message: "Not Authorized" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not Authorized" });
    }
};

module.exports = { protectRoute };