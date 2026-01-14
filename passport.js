const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./src/models'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allow access to req so we can look at query params too
        },
        async (req, username, password, callback) => {
            // Fall back to query params if credentials are not in the body
            const effectiveUsername = username || req.query.username;
            const effectivePassword = password || req.query.password;

            console.log(`${effectiveUsername} ${effectivePassword}`);

            await Users.findOne({ username: effectiveUsername })
                .then((user) => {
                    if (!user) {
                        console.log('Incorrect username');
                        return callback(null, false, { message: 'Incorrect username or password.' });
                    }
                    if (!user.validatePassword(password)) {
                        console.log('Incorrect password');
                        return callback(null, false, { message: 'Incorrect password.' });
                    }
                    console.log('finished');
                    return callback(null, user);
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }
                });
        }
    )
);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));