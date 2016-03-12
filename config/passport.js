// vars
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../app/models/user');

// exports
module.exports = function(passport) {
  
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    
    // serialize user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // deserialize
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // override default of username with email instead
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true  // pass entire request to the callback
    },
    function(req, email, password, done) {
        
        // async
        // User.findOne will not fire unless data is sent back
        process.nextTick(function() {
            
            // find user with same email as form's email
            // checking to see if user already exists
            User.findOne({ 'local.email' : email }, function(err, user) {
                // check for errors
                if (err) return done(err);
    
                // check if user exists
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    
                    // if no user with that email, then create email
                    var newUser = new User();
                    
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    }); // end save
                
                } // end else       
            }); // end User.findOne
        }); // end process.nextTick
    })); // passport.use('local-signup')
    
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // override username with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        
        // find user with same email as form's
        // check if user exists
        User.findOne({ 'local.email' : email }, function(err, user) {
            // error handling
            if (err) return done(err);
            
            // if no user found, return the message
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
            
            // if user is found, but password is wrong
            if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Invalid password.'));
            
            // success, return the user
            return done(null, user);
        }); // end User.findOne
    })); // end passport.use('local-login')

}; // end exports    
