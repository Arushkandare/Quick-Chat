const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text: String,
    image: String,
    seen: {
        type: Boolean,
        default: false
    },

}, {timeStamps: true});

const messageModel = mongoose.model("message", messageSchema);
module.exports = messageModel;