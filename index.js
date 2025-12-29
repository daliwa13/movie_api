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
/*     bodyParser = require('body-parser'), */
    uuid = require('uuid');

// use body parser middleware JSON parsing as built-in in express 4.16+
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Movie data
let movies = [
    {
        "title": 'Rubber',
        "director": {
            "name": 'Quentin Dupieux',
            "bio": 'Quentin Dupieux is a French filmmaker and electronic musician known for his surreal and absurdist style. He often incorporates elements of dark humor and unconventional storytelling in his works.',
            "birthYear": 1974
        },
        "writer": 'Quentin Dupieux',
        "year": 2010,
        "Genre": 'Horror',
        "imageUrl": 'https://m.media-amazon.com/images/M/MV5BMTgyMTU1Nzc4MV5BMl5BanBnXkFtZTcwNTIwMzYzNA@@._V1_.jpg',
        "description": 'A homicidal car tire, discovering it has destructive psionic power, sets its sights on a desert town once a mysterious woman becomes its obsession.'
    },
    {
        "title": 'The Lord of the Rings: The Return of the King',
        "director": {
            "name": 'Peter Jackson',
            "bio": 'Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for directing the epic fantasy film trilogy "The Lord of the Rings" and "The Hobbit".',
            "birthYear": 1961
        },
        "writer": 'Fran Walsh, Philippa Boyens, Peter Jackson',
        "year": 2003,
        "Genre": 'Fantasy',
        "imageUrl": 'view-source:https://m.media-amazon.com/images/M/MV5BMTZkMjBjNWMtZGI5OC00MGU0LTk4ZTItODg2NWM3NTVmNWQ4XkEyXkFqcGc@._V1_.jpg',
        "description": 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.'
    },
    {
        "title": 'Forrest Gump',
        "director": {
            "name": 'Robert Zemeckis',
            "bio": 'Robert Zemeckis is an American film director, producer, and screenwriter known for his innovative use of visual effects and storytelling techniques.',
            "birthYear": 1951
        },
        "writer": 'Eric Roth',
        "year": 1994,
        "Genre": 'Drama',
        "imageUrl": 'view-source:https://m.media-amazon.com/images/M/MV5BM2JmYjc5MWEtNjY1MS00NGQwLTlhMWEtMGM1YjkxODllMmYyXkEyXkFqcGc@._V1_.jpg',
        "description": 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.'
    },
    {
        "title": 'Fight Club',
        "director": {
            "name": 'David Fincher',
            "bio": 'David Fincher is an American film director known for his dark and stylish films, often exploring themes of psychological thriller and crime.',
            "birthYear": 1962
        },
        "writer": 'Chuck Palahniuk (novel), Jim Uhls (screenplay)',
        "year": 1999,
        "Genre": 'Drama',
        "imageUrl": 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg',
        "description": 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.'
    },
    {
        "title": 'Inception',
        "director": {
            "name": 'Christopher Nolan',
            "bio": 'Christopher Nolan is a British-American film director, producer, and screenwriter known for his complex storytelling and innovative filmmaking techniques.',
            "birthYear": 1970
        },
        "writer": 'Christopher Nolan',
        "year": 2010,
        "Genre": 'Action',
        "imageUrl": 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        "description": 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.'
    },
    {
        "title": 'The Silence of the Lambs',
        "director": {
            "name": 'Jonathan Demme',
            "bio": 'Jonathan Demme was an American director, producer, and screenwriter known for his work in various genres, including thriller and drama.',
            "birthYear": 1944
        },
        "writer": 'Thomas Harris (novel), Ted Tally (screenplay)',
        "year": 1991,
        "Genre": 'Thriller',
        "imageUrl": 'https://m.media-amazon.com/images/M/MV5BNDdhOGJhYzctYzYwZC00YmI2LWI0MjctYjg4ODdlMDExYjBlXkEyXkFqcGc@._V1_.jpg',
        "description": 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.'
    },
    {
        "title": 'Joker',
        "director": {
            "name": 'Todd Phillips',
            "bio": 'Todd Phillips is an American film director, producer, and screenwriter known for his work on comedy and drama films, including the critically acclaimed "Joker".',
            "birthYear": 1970
        },
        "writer": 'Todd Phillips, Scott Silver, Bob Kane',
        "year": 2019,
        "Genre": 'Crime',
        "imageUrl": 'https://m.media-amazon.com/images/M/MV5BNzY3OWQ5NDktNWQ2OC00ZjdlLThkMmItMDhhNDk3NTFiZGU4XkEyXkFqcGc@._V1_.jpg',
        "description": 'Arthur Fleck, a party clown and a failed stand-up comedian, leads an impoverished life with his ailing mother. However, when society shuns him and brands him as a freak, he decides to embrace the life of chaos in Gotham City.'
    },
    {
        "title": 'Intouchables',
        "director": {
            "name": 'Olivier Nakache',
            "bio": 'Olivier Nakache is a French film director and screenwriter known for his work on the critically acclaimed film "Intouchables".',
            "birthYear": 1970
        },
        "writer": 'Olivier Nakache, Éric Toledano, Philippe Pozzo di Borgo',
        "year": 2011,
        "Genre": 'Biography',
        "imageUrl": 'https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_.jpg',
        "description": 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.'
    },
    {
        "title": 'Django Unchained',
        "director": {
            "name": 'Quentin Tarantino',
            "bio": 'Quentin Tarantino is an American film director, screenwriter, producer, and actor known for his stylized films and sharp dialogue.',
            "birthYear": 1963
        },
        "writer": 'Quentin Tarantino',
        "year": 2012,
        "Genre": 'Western',
        "imageUrl": 'view-source:https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_.jpg',
        "description": 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.'
    },
    {
        "title": 'Pulp Fiction',
        "director": {
            "name": 'Quentin Tarantino',
            "bio": 'Quentin Tarantino is an American film director, screenwriter, producer, and actor known for his stylized films and sharp dialogue.',
            "birthYear": 1963
        },
        "writer": 'Quentin Tarantino, Roger Avary',
        "year": 1994,
        "Genre": 'Drama',
        "imageUrl": 'view-source:https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_.jpg',
        "description": 'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
    }
];

// User data
let users = [
    {
        id: 1,
        name: "Alice",
        favorites: ["Inception", "The Lord of the Rings: The Return of the King"]
    },
    {
        id: 2,
        name: "Bob",
        favorites: ["Forrest Gump", "Fight Club"]
    },
];

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
                return res.status(400).send(req.body.username + 'already exists');
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

// UPDATE existing user's name
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(404).send('User not found');
    }

});

// UPDATE user's favorite movies
app.put('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favorites.push(movieTitle);
        res.status(200).send(`Favorite movies for user ${id} updated successfully by adding ${movieTitle}`);
    } else {
        res.status(404).send('User not found');
    }
});

// DELETE user's favorite movies
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favorites = user.favorites.filter( title => title !== movieTitle);
        res.status(200).send(`Favorite movies for user ${id} updated successfully by removing ${movieTitle}`);
    } else {
        res.status(404).send('User not found');
    }
});

// DELETE user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`User ${id} deleted successfully`);
    } else {
        res.status(404).send('User not found');
    }
});

//READ all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});
// READ movie by title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( (movie) => movie.title === title);

        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(400).send('Movie not found');
        }
});

// READ Genre by movie title
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre == genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('Genre not found');
    }
});

// READ Director by movie title
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name == directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('Director not found');
    }
});

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});