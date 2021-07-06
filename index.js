//main starting point of the application
//node index.js start backend as JS
/*nodemon watches changes in any file without needing to restart server
only requires a prop dev in package.json and can be run as npm run dev*/
const express = require('express');
const http = require('http');
const morgan = require('morgan');
// const bodyParser = require('body-parser'); // deprecated
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

//db Setup
mongoose.connect('mongodb://localhost:auth/auth', 
    {useNewUrlParser: true}, 
    (err) => {
    if (err)
        console.error(err);
    else
        console.log("Connected to the mongodb"); 
});

//App Setup
app.use(morgan('combined')); //loggin framework 
app.use(express.urlencoded({extended: true})); 
app.use(express.json({ type: '*/*'})); //parse incoming request
router(app);

//Server Setup
//If there's already a environment variable port use it, instead 3090
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);

console.log('server listening on ', port)

