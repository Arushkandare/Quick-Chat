const userModel = require("../models/User");
const messageModel = require("../models/Message");
const cloudinary = require("../lib/cloudinary");
const { getIO, getUserSocketMap } = require("../lib/socket");

const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const fileteredUsers = await userModel.find({ _id: {$ne: userId} }).select("-password");

        const unseenMessages = {};
        const promises = fileteredUsers.map(async (user) => {
            const messages = await messageModel.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);
        res.json({success: true, users: fileteredUsers, unseenMessages});
    } catch (error) {   
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        }) 

        await messageModel.updateMany({
            senderId: selectedUserId, 
            receiverId: myId
        }, {seen: true});

        res.json({success: true, messages});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await messageModel.findOneAndUpdate({ _id: id }, {seen: true});
        res.json({ success: true }); 
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })  

        const userSocketMap = getUserSocketMap();
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId) {
            const io = getIO();
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success: true, newMessage}); 
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

module.exports = { getUserForSidebar, getMessages, markMessageAsSeen, sendMessage };