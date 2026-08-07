const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Handles authentication and profile ownership
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default in queries
    },

    // User preferences (optional)
    preferences: {
        defaultLocation: {
            city: String,
            state: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        defaultRadius: {
            type: Number,
            default: 50 // km
        },
        notifications: {
            type: Boolean,
            default: true
        }
    },

    // Account status
    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: Date

}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// Index for email lookups
userSchema.index({ email: 1 });

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare provided password with stored hash
 * @param {string} candidatePassword - Password to check
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Update last login timestamp
 */
userSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    return await this.save();
};

/**
 * Get safe user object (no sensitive data)
 */
userSchema.methods.toSafeObject = function () {
    return {
        id: this._id,
        email: this.email,
        preferences: this.preferences,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
};

module.exports = mongoose.model('User', userSchema);
