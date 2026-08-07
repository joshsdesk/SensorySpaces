const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    type: {
        type: String,
        enum: ['Museum', 'Library', 'Park', 'Theater', 'Recreation Center', 'Other'],
        default: 'Other'
    },
    location: {
        address: String,
        city: String,
        state: String,
        zip: String,
        geo: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true } // [long, lat]
        }
    },
    contact: {
        phone: String,
        email: String,
        website: String
    },
    sensoryDefaults: {
        noiseLevel: { type: String, enum: ['Quiet', 'Moderate', 'Lively'], default: 'Moderate' },
        lighting: { type: String, enum: ['Dim', 'Natural', 'Bright', 'Adjustable'], default: 'Natural' },
        crowdDensity: { type: String, enum: ['Small', 'Medium', 'Large'], default: 'Medium' }
    },
    features: [String], // e.g., ['quiet_room', 'sensory_tools']
    externalId: { type: String, unique: true, sparse: true },
    source: String
}, { timestamps: true });

venueSchema.index({ 'location.geo': '2dsphere' });
venueSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Venue', venueSchema);
