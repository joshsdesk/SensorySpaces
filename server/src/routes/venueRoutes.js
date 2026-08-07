const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const inMemoryDb = require('../utils/inMemoryDb');

// GET all venues (with geospatial and keyword search)
router.get('/', async (req, res) => {
    try {
        const { lat, lng, q, radius = 50, type } = req.query;

        if (mongoose.connection && mongoose.connection.readyState === 1) {
            let query = {};

            if (lat && lng) {
                query["location.geo"] = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: parseInt(radius) * 1000
                    }
                };
            }

            if (q) query.$text = { $search: q };
            if (type) query.type = type;

            const venues = await Venue.find(query).limit(100);
            if (venues && venues.length > 0) {
                return res.json(venues);
            }
        }
        res.json(inMemoryDb.getVenues({ q }));
    } catch (err) {
        res.json(inMemoryDb.getVenues({ q: req.query.q }));
    }
});

// GET a single venue
router.get('/:id', async (req, res) => {
    try {
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const venue = await Venue.findById(req.params.id);
            if (venue) return res.json(venue);
        }
        const memoryVenues = inMemoryDb.getVenues();
        const found = memoryVenues.find(v => v._id === req.params.id) || memoryVenues[0];
        res.json(found);
    } catch (err) {
        const memoryVenues = inMemoryDb.getVenues();
        res.json(memoryVenues[0]);
    }
});

module.exports = router;
