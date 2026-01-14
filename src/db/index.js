const mongoose = require('mongoose');

function initDB() {
  // Production MongoDB location string
  let databaseUrl = process.env.CONNECTION_URI || 'mongodb://localhost:27017/cf';

  // Set up mongoose connection to operate on MongoDB database using the connection string from lines 1-6
  mongoose.connect(databaseUrl); // had to remove the the legacy options "useNewUrlParser" and "useUnifiedTopology" to get it to work with the latest mongoose version

  // Check mongoose connection
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', function () {
    console.log('Connected to MongoDB database!');
  });
}

module.exports = { initDB };