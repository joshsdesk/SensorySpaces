const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        displayName: String,
        childNotes: String, // e.g., "Sensitive to loud noises"
        preferences: {
            radius: { type: Number, default: 10 },
            accessibility: {
                largeText: { type: Boolean, default: false },
                highContrast: { type: Boolean, default: false }
            }
        }
    },
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    connectionRequests: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
