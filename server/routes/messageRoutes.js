const express = require('express');
const protectRoute = require('../middleware/auth');
const { getMessages, markMessageAsSeen, sendMessage, getUserForSidebar } = require('../controllers/messageController');

const messageRoutes = express.Router();

messageRoutes.get("/users", protectRoute, getUserForSidebar);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.get("/mark/:id", protectRoute, markMessageAsSeen);
messageRoutes.post("/send/:id", protectRoute, sendMessage);

module.exports = messageRoutes;