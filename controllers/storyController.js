const Story = require('../models/Story');
const path = require('path');

// Get all stories
const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 }); // Fetch stories, sorted by latest
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error });
  }
};

const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);  // Using Mongoose's findById method to get the story
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json(story);  // If story is found, return it
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story', error });
  }
};

// Create story
const createStory = async (req, res) => {
  const { title, date, description, location } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !date || !description || !location || !image) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newStory = new Story({
    title,
    date,
    description,
    location,
    image: `/uploads/${image}`, // Ensure correct path
  });

  try {
    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story', error });
  }
};

// Update story
const updateStory = async (req, res) => {
  const { id } = req.params;
  const { title, date, description, location } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { title, date, description, location, image },
      { new: true }
    );
    if (!updatedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating story', error });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStory = await Story.findByIdAndDelete(id);
    if (!deletedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error });
  }
};

// Search stories
const searchStories = async (req, res) => {
  const { query } = req.query;

  try {
    const stories = await Story.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error searching stories', error });
  }
};

module.exports = {
  createStory,
  updateStory,
  deleteStory,
  searchStories,
  getStories,
  getStoryById
};
