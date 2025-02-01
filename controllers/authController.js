const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const authController = {
    register: async (req, res) => {
        try {
            // extract the details from the request body
            const { name, email, password } = req.body;

            // check if the user already exists
            const user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // create a new user
            const newUser = new User({ name, email, password: hashedPassword });

            // save the user to the database
            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        // extract the details from the request body
        const { email, password } = req.body;

        // check if the user exists
        const user = await User.findOne({ email });

        // if the user does not exist
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // generate a token
        const token = jwt.sign({ id: user._id }, JWT_SECRET);

        // store the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });

        res.status(200).json({ message: 'User logged in successfully' });
    },
    logout: async (req, res) => {
        // remove the token from the cookie
        res.clearCookie('token');

        res.status(200).json({ message: 'User logged out successfully' });
    },
    me: async (req, res) => {
        // extract the user id from the request object
        const userId = req.userId;

        // find the user by id and exclude the password field
        const user = await User.findById(userId).select('-password -__v');

        res.status(200).json(user);
    }
}

module.exports = authController;