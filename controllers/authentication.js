const jwt = require('jwt-simple');
const User = require('../models/user');
const config =  require('../config');

function tokenForUser(user) {

    const timestamp = new Date().getTime();

    //JWT CONVENTIONS:
        //sub: subject (whose this token belongs to)
        //iat: Issue At Time  
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    // User has already had their email and pass auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user)});
    
}

exports.signup = function(req, res, next) {
    // res.send({ success: 'true' });

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({error: 'Email or Password not provided'});
    }

    //Mongoose -- if does not exists, existingUser will come as null
    User.findOne({email: email}, function(err, existingUser) {
        if(err) { return next(err); }
        
        if(existingUser) {
            return res.status(422).send({error: 'Email is in Use'});
        }

        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err) {
            if(err) {return next(err); }

            //return tru to inform user has been created.
            res.json({ token: tokenForUser(user) });
        } );
    });

}
