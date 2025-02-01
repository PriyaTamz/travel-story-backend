const express = require('express');
const multer = require('multer');
const path = require('path');
const { createStory, updateStory, deleteStory, searchStories, getStories, getStoryById } = require('../controllers/storyController');

const router = express.Router();

// Set up multer for image upload
const uploadDir = path.join(__dirname, '../uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Routes
router.post('/story', upload.single('image'), createStory);
router.get('/story', getStories);
router.get('/story/:id', getStoryById);
router.put('/story/:id', upload.single('image'), updateStory);
router.delete('/story/:id', deleteStory);
router.get('/stories/search', searchStories);

module.exports = router;
