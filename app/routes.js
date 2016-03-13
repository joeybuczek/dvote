// local vars
var locals = { 
    layoutTitle: 'dVOTE - Digital Voting App - FCC Challenge',
    title: 'dVOTE',
    subtitle: 'Make your digital voice heard!' 
};

module.exports = function(app, passport) {
    
    // HOME PAGE ================================
    app.get('/', function(req, res){
        res.render('index', locals);
    });
    
    // LOGIN PAGE ===============================
    app.get('/login', function(req, res){
        // pass in any flash messages by added to the locals object
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
        // pass in any flash messages by added to the locals object
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
        // pass in user into locals object
        locals.user = req.user;
        res.render('profile', locals);
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