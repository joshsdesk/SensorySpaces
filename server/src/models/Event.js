const mongoose = require('mongoose');

// Sub-schema for granular provenance per attribute
const sensoryAttributeSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['inferred', 'verified', 'unknown'],
        default: 'inferred'
    },
    source: {
        type: String,
        enum: ['human', 'baseline', 'nlp_strong', 'nlp_weak', 'manual_override'],
        required: true
    },
    sourceDetail: String, // e.g., "Keyword: 'Quiet Hour'", "Baseline: 'Lib_01'"
    inferenceReason: {
        type: String,
        enum: ['keyword', 'regex', 'venue_baseline', 'user_submission']
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    version: { type: Number, default: 1 },
    lastUpdatedAt: { type: Date, default: Date.now }
}, { _id: false });

const eventSchema = new mongoose.Schema({
    // LAYER A: Core Metadata
    metadata: {
        title: { type: String, required: true },
        description: String,
        date: { type: Date, required: true },
        location: {
            address: String,
            geo: {
                type: { type: String, enum: ['Point'], default: 'Point' },
                coordinates: { type: [Number], required: true } // [long, lat]
            }
        },
        venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
        organizer: String,
        source: { type: String, default: 'manual' }, // e.g., 'predict_hq', 'user_submission'
        externalId: { type: String, unique: true, sparse: true }
    },

    // LAYER B: Sensory Profile
    sensoryProfile: {
        noiseLevel: sensoryAttributeSchema,
        lighting: sensoryAttributeSchema,
        crowdDensity: sensoryAttributeSchema,
        details: [{
            value: String,
            source: String
        }]
    },

    // INFERENCE ENGINE DATA
    inference: {
        version: { type: Number, default: 1 },
        lastInferredAt: Date,
        history: [{
            version: Number,
            changedAt: Date,
            changes: Object
        }]
    },

    // LEGACY FALLBACK (For Rollback Safety)
    legacyTags: [String],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Text Indexes for Search
eventSchema.index({ 'metadata.title': 'text', 'metadata.description': 'text' });
eventSchema.index({ 'metadata.location.geo': '2dsphere' });
eventSchema.index({ 'sensoryProfile.noiseLevel.value': 1 });
eventSchema.index({ 'sensoryProfile.lighting.value': 1 });

module.exports = mongoose.model('Event', eventSchema);
