module.exports = function(app, passport) {
    
    // HOME PAGE ================================
    app.get('/', function(req, res){
        res.render('index.ejs');
    });
    
    // LOGIN PAGE ===============================
    app.get('/login', function(req, res){
        // pass in any flash messages
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash    : true
    }));
    
    // SIGNUP PAGE ==============================
    app.get('/signup', function(req, res){
        // pass in any flash messages
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash    : true
    }));
    
    // PROFILE PAGE =============================
    // this is protected, must be logged in to view
    app.get('/profile', isLoggedIn, function(req, res){
        // pass in user
        res.render('profile.ejs', { user: req.user });
    });
    
    // LOGOUT ===================================
    app.get('/logout', function(req, res){
        req.logout();
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