// import mongoose module
const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./utils/config');
const app = require('./app');

// connect to the database
mongoose.connect(MONGODB_URI)
    .then(
        () => {
            console.log('Connected to MongoDB...');

            // start the server
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}...`);
            });
        }
    )
    .catch(err => console.error('Could not connect to MongoDB...'));