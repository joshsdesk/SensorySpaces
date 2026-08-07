const mongoose = require('mongoose');
const Event = require('./src/models/Event');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sensoryspaces';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const sampleEvents = [
    {
        metadata: {
            title: "Children's Museum of Denver - Low Sensory Mornings",
            description: "A special time for children with disabilities and their families to experience the Museum in a less crowded, quiet environment.",
            date: new Date(new Date().getTime() + 86400000 * 3),
            location: {
                address: "2121 Children's Museum Dr, Denver, CO 80211",
                geo: { type: 'Point', coordinates: [-105.0192, 39.7594] }
            },
            organizer: "Children's Museum of Denver",
            source: 'seed'
        },
        sensoryProfile: {
            noiseLevel: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
            lighting: { value: 'Natural', status: 'verified', source: 'human', confidence: 1.0 },
            crowdDensity: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
            details: [
                { value: 'Quiet Room', source: 'human' },
                { value: 'Wheelchair Accessible', source: 'human' }
            ]
        },
        inference: { version: 1, lastInferredAt: new Date(), history: [] }
    },
    {
        metadata: {
            title: "Denver Zoo - Sensory Friendly Nights",
            description: "Experience the Zoo with lower attendance, quiet zones, and sensory kits available.",
            date: new Date(new Date().getTime() + 86400000 * 7),
            location: {
                address: "2300 Steele St, Denver, CO 80205",
                geo: { type: 'Point', coordinates: [-104.9489, 39.7501] }
            },
            organizer: "Denver Zoo",
            source: 'seed'
        },
        sensoryProfile: {
            noiseLevel: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
            lighting: { value: 'Dimmed', status: 'verified', source: 'human', confidence: 1.0 },
            crowdDensity: { value: 'Low', status: 'verified', source: 'human', confidence: 1.0 },
            details: [
                { value: 'Sensory Kits', source: 'human' },
                { value: 'Outdoor', source: 'human' }
            ]
        },
        inference: { version: 1, lastInferredAt: new Date(), history: [] }
    },
    {
        metadata: {
            title: "Red Rocks Amphitheatre - Sensory Room Access",
            description: "The sensory room at Red Rocks offers a quiet space for guests who need a break from the noise and crowds.",
            date: new Date(new Date().getTime() + 86400000 * 1),
            location: {
                address: "18300 W Alameda Pkwy, Morrison, CO 80465",
                geo: { type: 'Point', coordinates: [-105.2057, 39.6654] }
            },
            organizer: "Red Rocks",
            source: 'seed'
        },
        sensoryProfile: {
            noiseLevel: { value: 'High', status: 'inferred', source: 'baseline', confidence: 0.6 }, // Amphitheatre defaults to loud
            lighting: { value: 'Bright', status: 'inferred', source: 'baseline', confidence: 0.6 },
            crowdDensity: { value: 'High', status: 'inferred', source: 'baseline', confidence: 0.6 },
            details: [
                { value: 'Quiet Room', source: 'human' }, // Specific amenity verified
                { value: 'Outdoor', source: 'human' }
            ]
        },
        inference: { version: 1, lastInferredAt: new Date(), history: [] }
    }
];

const seedDB = async () => {
    try {
        await Event.deleteMany({ "metadata.source": 'seed' });
        await Event.insertMany(sampleEvents);
        console.log("Database seeded with sample events (Schema V2)!");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
