// config/database.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Get MongoDB URI from environment variable or use default
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stepunity';
        
        
        // Connect without deprecated options
        await mongoose.connect(mongoURI);
        
        console.log(' MongoDB Connected Successfully!');
        
        
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Make sure MongoDB is running on your system');
        console.error('Try starting MongoDB with: mongod');
        process.exit(1);
    }
};

// // Handle connection events
// mongoose.connection.on('connected', () => {
//     console.log(' Mongoose connected to MongoDB');
// });

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

module.exports = connectDB;
