const jwtSecret = 'your_jwt_secret'; // Ensure this matches the secret in passport.js

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport.js'); // Import the passport configuration from local file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username, // This is the username you are encoding in the JWT
        expiresIn: '7d', // Token expires in 7 days
        algorithm: 'HS256' // Use the HS256 algorithm to encode the values of JWT
    });
}

// Post login route
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json( {user, token });
            });
        })(req, res);
    });
}