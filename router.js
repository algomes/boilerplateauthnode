const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport'); 
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false})
const requireSignin = passport.authenticate('local', {session: false})
module.exports = function (app) {
    app.get('/', requireAuth, function(req, res) {
        res.send({hi: 'there'});
        
    })

    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
    // app.get('/', function (req, res, next) {
    //     // req = request
    //     // res = response
    //     // next = error handling
    //     res.send(['string 1', 'string 2', 'string 3']);
    // })
}