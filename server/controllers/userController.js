const generateToken = require('../lib/utils');
const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const cloudinary = require('../lib/cloudinary')

const signUp = async (req, res) => {
    try {
        
        const { fullName, email, password, bio } = req.body;

        if(!fullName || !email || !password || !bio) {
            return res.json({success: false, message: "Missing details"});
        }

        const user = await userModel.findOne({ email});

        if(user) {
            return res.json({success: false, message: "Account already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            fullName, 
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id);

        res.json({success: true, userData: newUser, token, message: "Account created successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}  

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        
        if(!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password); // Add await here

        if(!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.json({success: true, userData: user, token, message: "Login successful"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
}

const updatedProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if(profilePic) {
            // Upload image to cloudinary
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await userModel.findOneAndUpdate(
                { _id: userId }, 
                { profilePic: upload.secure_url, bio, fullName }, 
                { new: true }
            );
        } else {
            // Update without profile pic
            updatedUser = await userModel.findOneAndUpdate(
                { _id: userId }, 
                { bio, fullName }, 
                { new: true }
            );
        }

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message }); // Fix: should be success: false
    }
}

module.exports = { signUp, login, checkAuth, updatedProfile };