const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    password: {type: String, minLength: 6},
    profilePic: {type: String, default: ""},
    bio: {type: String}
}, {timeStamps: true});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;