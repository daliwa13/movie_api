const express = require('express'),
  // import express validator module
  { check, validationResult } = require('express-validator');

const router = express.Router();

const Models = require('../models');
const Users = Models.User;

const passport = require('passport');

// Users endpoints

// CREATE new user
/* We’ll expect JSON in this format
{
  username: String (required),
  password: String (required),
  email: String (required),
  birthDate: Date
}*/
router.post('/', [
  check('username', "Username is required and must be at least 5 characters long").isLength({ min: 5 }),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required and must be at least 7 characters long').isLength({ min: 7 }),
  check('email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  // Validate the request body
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Hash the password from input
  let hashedPassword = Users.hashPassword(req.body.password);

  await Users.findOne({ username: req.body.username }) // Check if user already exists
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists'); // Response if the user is already in the database
      } else {
        Users
          .create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthDate: req.body.birthDate
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ all users - not accessible to general public, therefore no link in documentation
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== 'admin') {
    return res.status(403).send('Permission denied');
  }

  await Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ user by username
router.get('/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== req.params.username && req.user.username !== 'admin') {
    return res.status(403).send('Permission denied');
  }

  await Users.findOne({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send('User not found');
      } else {
        res.json(user);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
    username: String (required),
    password: String (required),
    email: String (required),
    birthDate: Date
}*/
router.put('/:username',
  // Validation logic for request's body
  [
    check('username', "Username is required and must be at least 5 characters long").isLength({ min: 5 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required and must be at least 7 characters long').isLength({ min: 7 }),
    check('email', 'Email does not appear to be valid').isEmail()
  ],
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // Validate the request body
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.username !== req.params.username) {
      return res.status(403).send('Permission denied');
    }

    // Hash the password from input
    let hashedPassword = Users.hashPassword(req.body.password);

    await Users.findOneAndUpdate(
      { username: req.params.username },
      {
        $set:
        {
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          birthDate: req.body.birthDate
        }
      },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        if (!updatedUser) {
          res.status(400).send('User not found');
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Delete a user by username
router.delete('/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== req.params.username && req.user.username !== 'admin') {
    return res.status(403).send('Permission denied');
  }

  await Users.findOneAndDelete({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
router.post('/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).send('Permission denied');
  }

  try {
    const movie = await Movies.findById(req.params.movieID);
    if (!movie) {
      return res.status(400).send('Movie not found in the database');
    }

    const updatedUser = await Users.findOneAndUpdate(
      { username: req.params.username },
      { $addToSet: { favoriteMovies: req.params.movieID } }, // use $addToSet to avoid duplicates
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).send('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// DELETE user's favorite movies
router.delete('/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).send('Permission denied');
  }

  try {
    const user = await Users.findOne({ username: req.params.username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const movieID = req.params.movieID;
    const hasMovie = user.favoriteMovies.some(favId => favId.toString() === movieID);
    if (!hasMovie) {
      return res.status(400).send('Movie not in user\'s favorites');
    }

    const updatedUser = await Users.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { favoriteMovies: req.params.movieID } },
      { new: true } // This line makes sure that the updated document is returned
    );
    if (!updatedUser) {
      return res.status(400).send('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  };
});

module.exports = router;