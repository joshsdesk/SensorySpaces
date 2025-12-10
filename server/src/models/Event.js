const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }, // Optional link
    sensoryTags: [{
        type: String,
        enum: [
            'Low Light', 'Quiet', 'Audio Compatible', 'Wheelchair Accessible',
            'Crowd Controlled', 'Scent Free', 'Break Area Available'
        ]
    }],
    source: { type: String, default: 'user_submission' }, // or 'automated'
    isVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

eventSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Event', eventSchema);
