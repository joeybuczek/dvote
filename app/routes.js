// dependencies
var mongoFn = require('./mongoFn');

// local vars
var locals = { 
    layoutTitle: 'dVOTE - Digital Voting App - FCC Challenge',
    title: 'dVOTE',
    subtitle: 'Make your digital voice count!' 
};

// test array
var testArr = [{ poll: "poll 1" }];

module.exports = function(app, passport) {
    
    // HOME PAGE ================================
    app.get('/', function(req, res){
        // check if user present for layout.html purposes
        if (req.user) locals.user = req.user;
        
        // testing array
        locals.polls = testArr;
        
        res.render('index', locals);
    });
    
    // LOGIN PAGE ===============================
    app.get('/login', function(req, res){
        // check if user present for layout.html purposes
        if (req.user) locals.user = req.user;
        
        // pass in any flash messages by adding to the locals object
        locals.message = req.flash('loginMessage');
        res.render('login', locals);
    });
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash    : true
    }));
    
    // SIGNUP PAGE ==============================
    app.get('/signup', function(req, res){
        // check if user present for layout.html purposes
        if (req.user) locals.user = req.user;
        
        // pass in any flash messages by adding to the locals object
        locals.message = req.flash('signupMessage');
        res.render('signup', locals);
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash    : true
    }));
    
    // PROFILE PAGE =============================
    // this is protected, must be logged in to view
    app.get('/profile', isLoggedIn, function(req, res){
        // pass in user by adding into locals object
        locals.user = req.user;
        res.render('profile', locals);
    });
    
    // LOGOUT ===================================
    app.get('/logout', function(req, res){
        req.logout();
        locals.user = false;
        res.redirect('/');
    });
};

// middleware to make sure a user is logged in
function isLoggedIn(req, res, next){
    // are they authenticated?
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}