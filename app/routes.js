// dependencies
var mongoFn    = require('./mongoFn'),
    dataFormat = require('./dataFormat'),
    requestIP = require('request');

// local vars factory
function getLocals(){
    return { 
        layoutTitle: 'dVOTE - Digital Voting App - FCC Challenge',
        title: 'dVOTE',
        subtitle: 'Make your digital voice count!'
    };
};


// exports ======================================
module.exports = function(app, passport) {
    
    // HOME PAGE ================================
    app.get('/', function(req, res){
        // create locals
        var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        } else {
            locals.guest = req._remoteAddress;
        }
        
        // retrieve all polls and render
        mongoFn.query({}, function(resultObj){
            locals.polls = resultObj.response;
            res.status(200);
            res.render('index', locals);
        });
        
        // render
        // res.render('index', locals);
    });
    
    // LOGIN PAGE ===============================
    app.get('/login', function(req, res){
        var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        } else {
            locals.guest = req._remoteAddress;
        }
        
        // pass in any flash messages by adding to the locals object
        locals.message = req.flash('loginMessage');
        res.render('login', locals);
    });
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash    : true
    }));
    
    // SIGNUP PAGE ==============================
    app.get('/signup', function(req, res){
        // create locals
        var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        } else {
            locals.guest = req._remoteAddress;
        }
        
        // pass in any flash messages by adding to the locals object
        locals.message = req.flash('signupMessage');
        res.render('signup', locals);
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash    : true
    }));
    
    // PROFILE PAGE =============================
    // this is protected, must be logged in to view
    app.get('/profile', isLoggedIn, function(req, res){
        // create locals
        var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        } else {
            locals.guest = req._remoteAddress;
        }
        
        res.render('profile', locals);
    });
    
    // LOGOUT ===================================
    app.get('/logout', function(req, res){
        // create locals
        var locals = getLocals();
        // logout
        req.logout();
        locals.user = false;
        res.redirect('/');
    });
    
    
    // SINGLE POLL ==============================
    app.get('/poll/:id', function(req, res){
        // create locals
       var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        } else {
            locals.guest = req._remoteAddress;
        }
        
        // query the db for the poll requested then render
        var query = { 'id' : +req.params.id };
        mongoFn.query(query, function(results){
            
            if (results.response.length > 0) {
                locals.poll = results.response[0];
                locals.chartData = dataFormat(results.response[0]);
                res.render('poll', locals);
            } else {
                res.render('404', locals);   
            }
        });
    });
    
    // GET NEW POLL =============================
    app.get('/new_poll', isLoggedIn, function(req, res){
        // create locals
       var locals = getLocals();
       locals.user = req.user;
        
        res.render('new_poll', locals);
    });
    
    // POST NEW POLL ============================
    app.post('/new_poll', isLoggedIn, function(req, res){
        // add posting to mongodb functionality here
        // for now, test by logging to console and 
        //  redirecting back to new poll page
        // log tests conclude labels are entered as array
        console.log(req.body);
        res.redirect('/new_poll');
    });
    
    // POLL SUBMIT VOTE =========================
    app.post('/vote', function(req, res){
        console.log(req.body);
        res.redirect('/poll/' + req.body.poll_id);
    });
    
    // TEST POLLS ===============================
    app.get('/testpoll', function(req, res){
        // insert test poll objects
        mongoFn.insert(pollObj1, function(result){
            console.log(result);
            mongoFn.insert(pollObj2, function(result){
                console.log(result);
                res.redirect('/');
            });
        });
    });
    
    // NEXTID LOGGER ============================
    // route to log the next available id number (current largest + 1)
    app.get('/nextid', function(req, res){
        mongoFn.getNextId(function(results){
            console.log('The next available id number is: ' + results.response);
            res.redirect('/');
        });
    });
      
};


// middleware ===================================
// make sure a user is logged in
function isLoggedIn(req, res, next){
    // are they authenticated?
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}


// voter validation =============================
// check if user present in db doc's voters array
// function voted(voters, voter) { 
//     return voters.indexOf(voter) > -1 ? true : false;   
// }

// test objects =================================
var pollObj1 = { 
    id: 1,
    name: 'Apples!', 
    author: 'JohnnyApplecore@gmail.com',
    description: 'What is your favorite type of apple?', 
    choices: [
        {label:'Gala', value: 3},
        {label:'Red Delicious', value: 2},
        {label:'Granny Smith', value: 1}
    ],
    voters: ['username1','username2','ipaddress1']
};
var pollObj2 = {
    id: 2,
    name: 'Fries!',
    author: 'SuzyQ@gmail.com',
    description: 'How many fries can you eat in one sitting?',
    choices: [
        {label:'1 serving', value: 3},
        {label:'2-5 servings', value: 1},
        {label:'6+ servings', value: 1}
    ],
    voters: ['username1','username2','ipaddress2']
};