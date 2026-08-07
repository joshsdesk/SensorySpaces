
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('bufferCommands', false);
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sensoryspaces';
        
        // Attempt connection non-blockingly or with short timeout
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000,
            socketTimeoutMS: 10000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', err => {
            console.warn('Mongoose connection issue:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose disconnected.');
        });

    } catch (error) {
        console.warn(`[AI Studio] MongoDB connection skipped or unavailable (${error.message}). Using in-memory database fallbacks.`);
    }
};

module.exports = connectDB;

