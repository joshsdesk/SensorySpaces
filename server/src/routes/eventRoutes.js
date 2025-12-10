
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events (with optional filtering)
router.get('/', async (req, res) => {
    try {
        // Basic implementation - fetch all
        // Future: Add geo-near filters here
        const events = await Event.find().sort({ date: 1 }).limit(100);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET query for search/filter
// Implementation of generic search endpoints would go here

// POST create a new event (User submission)
router.post('/', async (req, res) => {
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        location: req.body.location,
        sensoryTags: req.body.sensoryTags,
        // createdBy: req.user._id // Middleware for auth needed
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
