const express = require('express')
const router = express.Router();

const Models = require('../models');

const Movies = Models.Movie;
const passport = require('passport');

// Movies endpoints
// READ all movies
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ movie by title
router.get('/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ title: req.params.title })
    .then((movie) => {
      if (!movie) {
        res.status(400).send('Movie not found');
      } else {
        res.json(movie);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ Genre by it's name/title
router.get('/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "genre.name": req.params.genreName })
    .then((movie) => {
      if (!movie) {
        res.status(400).send('Genre not found');
      } else {
        res.json(movie.genre);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ Director by their name
router.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "director.name": req.params.directorName })
    .then((movie) => {
      if (!movie) {
        res.status(400).send('Director not found');
      } else {
        res.json(movie.director);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

module.exports = router;