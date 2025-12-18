const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    // import built in node modules fs and path
    fs = require('fs'),  
    path = require('path'),
    // import bodyParser and uuid modules
    bodyParser = require('body-parser'),
    uuid = require('uuid');

// use body parser middleware JSON parsing
app.use(bodyParser.json());

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
        "Genre": 'Horror, Sci-Fi',
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
        "Genre": 'Adventure, Drama, Fantasy',
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
        "Genre": 'Drama, Romance',
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
        "Genre": 'Action, Adventure, Sci-Fi',
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
        "Genre": 'Crime, Drama, Thriller',
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
        "Genre": 'Crime, Drama, Thriller',
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
        "Genre": 'Biography, Comedy, Drama',
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
        "Genre": 'Drama, Western',
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
        "Genre": 'Crime, Drama',
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

app.get('/movies', (req, res) => {
    res.json(topMovies);
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