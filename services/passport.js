const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Middleware that intercepts requesting to see if user is logged in

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}

//Another strategy (Local strategy)
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    //verifiy email and password , call done with the user
    //if it is the correct email and password 
    // otherwise, call done with false
    User.findOne({ email: email}, function(err, user) {
        if(err){ return done(err); }
        if(!user) { return done(null, false) }

        //compare passwords - encrypted with real password
        user.comparePassword(password, function(err, isMatch) {
            if(err) { return done(err);}
            if(!isMatch) { return done(null, false); }

            return done(null, user);
        })
    });

});


//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) { 
    //see if user Id in the payload exists in our database 
    //If it does, call 'done' with that user
    //Otherwise, call done without a user object 

    User.findById(payload.sub, function(err, user){
        if(err) { return done(err, false)}

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);