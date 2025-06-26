const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        const user = await userModel.findOne( { _id: decoded.userId } ).select("-password");
        if(!user) return res.json({ success: false, message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

module.exports = protectRoute;