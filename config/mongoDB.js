







const mongoose = require('mongoose');

const DB = process.env.MONGO_URL;


async function connectToMongoDB() {
    try {
        await mongoose.connect(DB)
        console.log('Connection successful to MongoDB');
    } catch (err) {
        console.error('No connection to MongoDB', err);
    }
}

connectToMongoDB();

module.exports = mongoose;