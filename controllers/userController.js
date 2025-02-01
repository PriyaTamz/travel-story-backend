const User = require('../models/user');

const userController = {
    getUser: async (req, res) => {
        try {
            // get the user id from the request object
            const userId = req.userId;

            // get the user from the database
            const user = await User.findById(userId).select('-password -__v');

            // send the user as response
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateUser: async (req, res) => {
        // get the user name from the request body
        const { name } = req.body;

        // get the user id from the request object
        const userId = req.userId;

        // update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { name }, { new: true }).select('-password -__v');

        // send the updated user as response
        res.status(200).json(updatedUser);
    },
    deleteUser: async (req, res) => {
        try {
            // get the user id from the request object
            const userId = req.userId;

            // delete the user from the database
            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                // send the error response
                return res.status(404).json({ message: 'User not found' });
            }

            // send the success response
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateProfilePicture: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Please upload a file' });
            }

            // get the user id from the request object
            const userId = req.userId;
            const profilePicture = req.file.path;

            // update the user in the database
            const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true }).select('-password -__v');

            if (!updatedUser) {
                // send the error response
                return res.status(404).json({ message: 'User not found' });
            }

            // send the updated user as response
            res.status(200).json({ message: 'Profile picture updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = userController;