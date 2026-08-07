const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChildProfile = require('../models/ChildProfile');
const authMiddleware = require('../middleware/authMiddleware');
const inMemoryDb = require('../utils/inMemoryDb');

// Helper to handle unauthenticated requests gracefully with default user ID
const getUserId = (req) => (req.user && req.user._id) ? req.user._id : "usr_default";

/**
 * Get all child profiles for user
 * GET /api/profiles
 */
router.get('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const profiles = await ChildProfile.find({
                userId,
                isActive: true
            }).sort({ createdAt: -1 });

            if (profiles && profiles.length > 0) {
                return res.json(profiles);
            }
        }
        res.json(inMemoryDb.getProfiles(userId));
    } catch (err) {
        res.json(inMemoryDb.getProfiles(getUserId(req)));
    }
});

/**
 * Get single child profile
 * GET /api/profiles/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const profile = await ChildProfile.findOne({
                _id: req.params.id,
                userId
            });

            if (profile) return res.json(profile);
        }
        const memProfiles = inMemoryDb.getProfiles(userId);
        const found = memProfiles.find(p => p._id === req.params.id) || memProfiles[0];
        res.json(found);
    } catch (err) {
        const memProfiles = inMemoryDb.getProfiles(getUserId(req));
        res.json(memProfiles[0] || {});
    }
});

/**
 * Create new child profile
 * POST /api/profiles
 */
router.post('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Profile name is required' });
        }

        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const profile = new ChildProfile({
                userId,
                name,
                preferences: req.body.preferences || {
                    noiseLevel: req.body.noiseLevel || [],
                    lighting: req.body.lighting || [],
                    crowdDensity: req.body.crowdDensity || [],
                    interests: req.body.interests || [],
                    avoidances: req.body.avoidances || [],
                    desiredFeatures: req.body.desiredFeatures || [],
                    preferredTimeOfDay: req.body.preferredTimeOfDay || [],
                    venueType: req.body.venueType || ['Both'],
                    weatherImportance: req.body.weatherImportance || 'Important'
                },
                onboardingResponses: req.body.onboardingResponses || {}
            });

            const newProfile = await profile.save();
            return res.status(201).json(newProfile);
        }
        const memProf = inMemoryDb.addProfile(userId, req.body);
        return res.status(201).json(memProf);
    } catch (err) {
        const userId = getUserId(req);
        const memProf = inMemoryDb.addProfile(userId, req.body);
        res.status(201).json(memProf);
    }
});

/**
 * Update child profile
 * PUT /api/profiles/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            const profile = await ChildProfile.findOne({
                _id: req.params.id,
                userId
            });

            if (profile) {
                if (req.body.name) profile.name = req.body.name;
                if (req.body.preferences) {
                    profile.preferences = { ...profile.preferences, ...req.body.preferences };
                }
                if (req.body.onboardingResponses) {
                    profile.onboardingResponses = { ...profile.onboardingResponses, ...req.body.onboardingResponses };
                }

                const updatedProfile = await profile.save();
                return res.json(updatedProfile);
            }
        }
        const memUpdated = inMemoryDb.updateProfile(req.params.id, req.body);
        res.json(memUpdated || { _id: req.params.id, name: req.body.name || "Child Profile" });
    } catch (err) {
        const memUpdated = inMemoryDb.updateProfile(req.params.id, req.body);
        res.json(memUpdated || { _id: req.params.id, name: req.body.name || "Child Profile" });
    }
});

module.exports = router;
