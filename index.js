
//Import necessary modules
const express = require('express'),
    app = express(),
    // import morgan module for logging
    morgan = require('morgan'),
    // import built in node modules fs and path
    fs = require('fs'),
    path = require('path');

const md = require('./src/middlewares');

// Init DB
require('./src/db').initDB();

// import routes
const movieRoutes = require('./src/routes/movie');
const userRoutes = require('./src/routes/user');


// use body parser middleware JSON parsing as built-in in express 4.16+
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS using cors module
const cors = require('cors');
app.use(cors());

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://my-flix-2a35e956c61d.herokuapp.com/']; // Added localhost:1234 for testing with parcel

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

// import auth.js file
require('./auth.js')(app);

// Logging setup for running on local machine; not necessary for Heroku deployment as Heroku provides its own logging
// Access ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// middleware to serve static files
app.use(express.static('public'))

// GET requests
app.get('/', (req, res) => {
    res.send('Navigate to /documentation.html for API documentation.');
});

// Routes
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

// error handling
app.use(md.errorhandler);

// listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Your app is listening on port ${PORT}.`);
});