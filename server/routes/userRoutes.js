const express = require('express');
const { signUp, login, updatedProfile, checkAuth } = require('../controllers/userController');
const protectRoute = require('../middleware/auth');

const userRoutes = express.Router();

userRoutes.post("/signup", signUp);
userRoutes.post("/login", login);
userRoutes.put("/update-profile", protectRoute, updatedProfile);
userRoutes.get("/check", protectRoute, checkAuth);

module.exports = userRoutes;