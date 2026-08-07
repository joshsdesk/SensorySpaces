const mongoose = require('mongoose');

/**
 * Child Profile Schema
 * Captures sensory preferences and interests for personalized event matching
 * All data stored locally on device (privacy-first)
 */
const childProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        required: true,
        maxlength: 50,
        comment: 'Display name only (e.g., "Child 1") - no PII'
    },

    // Sensory Environment Preferences
    preferences: {
        noiseLevel: {
            type: [String],
            enum: ['Quiet', 'Moderate', 'Lively'],
            default: []
        },

        lighting: {
            type: [String],
            enum: ['Dim', 'Natural', 'Bright', 'Adjustable'],
            default: []
        },

        crowdDensity: {
            type: [String],
            enum: ['Small', 'Medium', 'Large'],
            default: []
        },

        // Activity Type Preferences
        interests: {
            type: [String],
            enum: [
                'Animals/Nature',
                'Museums/Science',
                'Music/Performance',
                'Sports/Physical Activity',
                'Art/Crafts',
                'Technology/Gaming',
                'Therapeutic Play',
                'Outdoor Exploration',
                'Indoor Activities'
            ],
            default: []
        },

        // Sensory Triggers to Avoid
        avoidances: {
            type: [String],
            enum: [
                'Loud Sounds',
                'Flashing Lights',
                'Strong Smells',
                'Crowded Spaces',
                'Unpredictable Noises',
                'Bright Lights',
                'Physical Contact'
            ],
            default: []
        },

        // Event Features Desired
        desiredFeatures: {
            type: [String],
            enum: [
                'quiet_room',
                'sensory_tools',
                'visual_schedule',
                'social_stories',
                'certified_inclusive',
                'flexible_exit',
                'pre_visit_info'
            ],
            default: []
        },

        // Time Preferences
        preferredTimeOfDay: {
            type: [String],
            enum: ['Morning', 'Afternoon', 'Evening'],
            default: []
        },

        // Indoor/Outdoor Preference
        venueType: {
            type: [String],
            enum: ['Indoor', 'Outdoor', 'Both'],
            default: ['Both']
        },

        // Weather Sensitivity
        weatherImportance: {
            type: String,
            enum: ['Critical', 'Important', 'Flexible'],
            default: 'Important'
        }
    },

    // Onboarding Questionnaire Responses (for reference)
    onboardingResponses: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Active status
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for user lookup
childProfileSchema.index({ userId: 1, isActive: 1 });

// Virtual for calculating match score with an event
childProfileSchema.methods.calculateMatchScore = function (event) {
    let score = 0;
    const sensoryProfile = event.sensoryProfile;

    // Noise Level Match (10 points)
    if (this.preferences.noiseLevel.includes(sensoryProfile.noiseLevel?.value)) {
        score += 10;
    }

    // Lighting Match (10 points)
    if (this.preferences.lighting.includes(sensoryProfile.lighting?.value)) {
        score += 10;
    }

    // Crowd Density Match (10 points)
    if (this.preferences.crowdDensity.includes(sensoryProfile.crowdDensity?.value)) {
        score += 10;
    }

    // Interest Match (15 points possible)
    // Check if event tags match any interests
    const eventTags = event.tags || [];
    const matchingInterests = this.preferences.interests.filter(interest => {
        const interestKeywords = interest.toLowerCase().split('/');
        return eventTags.some(tag =>
            interestKeywords.some(keyword => tag.toLowerCase().includes(keyword))
        );
    });
    score += Math.min(matchingInterests.length * 5, 15);

    // Avoidance Penalties (-20 points each)
    this.preferences.avoidances.forEach(avoidance => {
        if (avoidance === 'Loud Sounds' && sensoryProfile.noiseLevel?.value === 'Loud') {
            score -= 20;
        }
        if (avoidance === 'Flashing Lights' && eventTags.includes('flashing_lights')) {
            score -= 20;
        }
        if (avoidance === 'Crowded Spaces' && sensoryProfile.crowdDensity?.value === 'Large') {
            score -= 20;
        }
    });

    // Desired Features Bonus (5 points each, max 15)
    const featureMatches = this.preferences.desiredFeatures.filter(feature =>
        eventTags.includes(feature)
    );
    score += Math.min(featureMatches.length * 5, 15);

    // Apply confidence multiplier
    const avgConfidence = (
        (sensoryProfile.noiseLevel?.confidence || 0) +
        (sensoryProfile.lighting?.confidence || 0) +
        (sensoryProfile.crowdDensity?.confidence || 0)
    ) / 3;

    score = Math.round(score * avgConfidence);

    return {
        score,
        maxPossible: 55,
        matchReasons: this._generateMatchReasons(event, sensoryProfile),
        confidence: avgConfidence
    };
};

childProfileSchema.methods._generateMatchReasons = function (event, sensoryProfile) {
    const reasons = [];

    if (this.preferences.noiseLevel.includes(sensoryProfile.noiseLevel?.value)) {
        reasons.push(`✓ ${sensoryProfile.noiseLevel.value} Environment`);
    }

    if (this.preferences.lighting.includes(sensoryProfile.lighting?.value)) {
        reasons.push(`✓ ${sensoryProfile.lighting.value} Lighting`);
    }

    if (this.preferences.crowdDensity.includes(sensoryProfile.crowdDensity?.value)) {
        reasons.push(`✓ ${sensoryProfile.crowdDensity.value} Crowd`);
    }

    // Add interest matches
    const eventTags = event.tags || [];
    this.preferences.interests.forEach(interest => {
        const interestKeywords = interest.toLowerCase().split('/');
        if (eventTags.some(tag => interestKeywords.some(keyword => tag.toLowerCase().includes(keyword)))) {
            reasons.push(`✓ Matches: ${interest}`);
        }
    });

    return reasons;
};

module.exports = mongoose.model('ChildProfile', childProfileSchema);
