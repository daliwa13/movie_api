const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthDate: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// hash password function
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// validate password function
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);;

