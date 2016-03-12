// set up ======================================================================
// env vars
if (!process.env.SESSION_SECRET) { require('./env'); }

// modules and tools
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to the database

require('./config/passport')(passport); // pass passport for configuration

// set up express app
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());

app.set('view engine', 'ejs');

// passport requirements - use env.js for secret in this spot:
app.use(session({ secret: process.env.SESSION_SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persist login sessions
app.use(flash()); 

// routes ======================================================================
require('./app/routes.js')(app, passport); // load routes and pass in app/passport

// 404 catch
app.use(function(req, res){
    res.send('404 - Sorry, unable to locate what you were looking for.');
});

// listen ======================================================================
app.listen(port, function(){
    console.log('Now listening on port ' + port);
});
