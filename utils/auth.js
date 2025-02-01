const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const User = require('../models/user');

const auth = {
    // Middleware to check if the user is authenticated
    checkAuth: async (req, res, next) => {
        try {
            // extract the token from the cookie
            const token = req.cookies.token;

            // if the token does not exist
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // verify the token
            const decoded = jwt.verify(token, JWT_SECRET);

            if (!decoded) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // store the user id in the request object
            req.userId = decoded.id;

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    isAdmin: async (req, res, next) => {
        try {
            // extract the userId from the request object
            const userId = req.userId;

            // if the userId does not exist
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // get the user from the database
            const user = await User.findById(userId);

            // if the user is not an admin
            if (user.role !== 'admin') {
                return res.status(401).json({ message: 'Forbidden' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = auth;