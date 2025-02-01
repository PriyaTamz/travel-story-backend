const express = require('express');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const storyRoutes = require('./routes/storyRoutes');  // Importing story routes
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173',  // Replace with your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(cookieParser());  // Parse cookies

app.use(express.json());  // Parse JSON request payload
app.use(bodyParser.json());

// Setup the routes
app.use('/auth', authRouter);  // Authentication routes
app.use('/users', userRouter);  // User-related routes
app.use('/stories', storyRoutes);  // Story-related routes

// Export the app
module.exports = app;
