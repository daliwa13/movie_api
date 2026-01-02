// Set up mongoose connection to operate on MongoDB database
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cf');

//Import necessary modules
const express = require('express'),
    app = express(),
    // import morgan module for logging
    morgan = require('morgan'),
    // import built in node modules fs and path
    fs = require('fs'),  
    path = require('path'),
    // import uuid modules
    uuid = require('uuid');

// use body parser middleware JSON parsing as built-in in express 4.16+
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import auth.js file
require('./auth.js')(app);

// import passport module
const passport = require('passport');
require('./passport.js');

// Access ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// middleware to serve static files
app.use(express.static('public'))

// GET requests
app.get('/', (req, res) => {
    res.send('Navigate to /documentation for API documentation.<br>Navigate to /movies to see the list of top movies.');
});

// Users endpoints
// CREATE new user
/* We’ll expect JSON in this format
{
  ID: Integer,
  username: String,
  password: String,
  email: String,
  birthday: Date
}*/
app.post('/users', async (req, res) => {
    await Users.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.username + ' already exists');
            } else {
                Users
                    .create({
                        username: req.body.username,
                        password: req.body.password,
                        email: req.body.email,
                        birthday: req.body.birthday
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
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.username !== 'admin') {
        return res.status(403).send('Permission denied');
    }
    
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// READ user by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
  username: String,
  (required)
  password: String,
  email: String,
  birthday: Date
}*/
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.username !== req.params.username) {
        return res.status(403).send('Permission denied');
    }
    
    await Users.findOneAndUpdate( 
        { username: req.params.username }, 
        { $set: 
            {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birthday: req.body.birthday
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
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.username !== req.params.username) {
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
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// Movies endpoints
// READ all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!!!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});