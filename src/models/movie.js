const mongoose = require('mongoose')

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: String,
    description: String
  },
  director: {
    name: String,
    bio: String,
    birthYear: Date,
    deathYear: Date
  },
  actors: [String],
  imagePath: String,
  featured: Boolean
});


module.exports = mongoose.model('Movie', movieSchema);;


