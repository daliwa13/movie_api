const express = require('express'),
    app = express(),
    morgan = require('morgan'),
// import built in node modules fs and path
    fs = require('fs'),  
    path = require('path');
const { writer } = require('repl');

let topMovies = [
    {
        title: 'Rubber',
        director: 'Quentin Dupieux',
        writer: 'Quentin Dupieux',
        year: 2010,
        description: 'A homicidal car tire, discovering it has destructive psionic power, sets its sights on a desert town once a mysterious woman becomes its obsession.'
    },
    {
        title: 'Original title: The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson',
        writer: 'Fran Walsh, Philippa Boyens, Peter Jackson',
        year: 2003,
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis',
        writer: 'Eric Roth',
        year: 1994,
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher',
        writer: 'Chuck Palahniuk (novel), Jim Uhls (screenplay)',
        year: 1999,
        description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.'
    },
    {
        title: 'Inception',
        director: 'Christopher Nolan',
        writer: 'Christopher Nolan',
        year: 2010,
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.'
    },
    {
        title: 'The Silcence of the Lambs',
        director: 'Jonathan Demme',
        writer: 'Thomas Harris (novel), Ted Tally (screenplay)',
        year: 1991,
        description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.'
    },
    {
        title: 'Joker',
        director: 'Todd Phillips',
        writer: 'Todd Phillips, Scott Silver, Bob Kane',
        year: 2019,
        description: 'Arthur Fleck, a party clown and a failed stand-up comedian, leads an impoverished life with his ailing mother. However, when society shuns him and brands him as a freak, he decides to embrace the life of chaos in Gotham City.'
    },
    {
        title: 'Intouchables',
        director: 'Olivier Nakache, Éric Toledano',
        writer: 'Olivier Nakache, Éric Toledano, Philippe Pozzo di Borgo',
        year: 2011,
        description: 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.'
    },
    {
        title: 'Django Unchained',
        director: 'Quentin Tarantino',
        writer: 'Quentin Tarantino',
        year: 2012,
        description: 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        writer: 'Quentin Tarantino, Roger Avary',
        year: 1994,
        description: 'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
    }
];

// Access ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// middleware to serve static files
app.use(express.static('public'))

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET requests
app.get('/', (req, res) => {
    res.send('Navigate to /documentation for API documentation.<br>Navigate to /movies to see the list of top movies.');
});

app.get('/documentation.html', (req, res) => {
    res.sendFile('documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});


// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});