const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt =('bcrypt');

const getOneUser = async (req, res) => {
    console.log("getOneUser call");
    console.log("req: ", req.body);

    const { userId } = req.body;

    try {
        // Assuming you have a User model to interact with your database
        const user = await User.findById(userId).select('-password'); // Exclude password field

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found: ", user);
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// *** EMAIL AND PASSWORD ARE CASE SENSITIVE ***
const login = async (req, res) => {
    console.log("login call");
    console.log("req: ", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Login failed" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Login failed" });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '7d' });
        res.status(200).json({ message: "Success", token, user });
    } catch (error) {
        console.error("Error during login: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const register = async (req, res) => {
    console.log("register call");
    console.log("req: ", req.body);

    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ message: "name, password, and email are required" });
    }

    try {
        const newUser = new User({ name, password, email });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user: ", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database and exclude their passwords
        const users = await User.find().select('-password'); // Exclude password field

        if (!users || users.length === 0) {
            console.log("No users found");
            return res.status(404).json({ message: "No users found" });
        }

        console.log("Users found: ", users);
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { login, register, getOneUser, getAllUsers };