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
        }
        
        // retrieve all polls and render
        mongoFn.query({}, function(resultObj){
            locals.polls = resultObj.response;
            res.status(200);
            res.render('index', locals);
        }); // end query

    }); // end app.get('/')
    
    // LOGIN PAGE ===============================
    app.get('/login', function(req, res){
        var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        }
        
        // pass in any flash messages by adding to the locals object
        locals.message = req.flash('loginMessage');
        res.render('login', locals);
    }); // end app.post('/login')
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash    : true
    })); // end app.post('/login')
    
    // SIGNUP PAGE ==============================
    app.get('/signup', function(req, res){
        // create locals
        var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        }
        
        // pass in any flash messages by adding to the locals object
        locals.message = req.flash('signupMessage');
        res.render('signup', locals);
    }); // end end app.get('/signup')
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash    : true
    })); // end app.post('/signup')
    
    // PROFILE PAGE =============================
    // this is protected, must be logged in to view
    app.get('/profile', isLoggedIn, function(req, res){
        // create locals
        var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        }
        
        // gather all polls for this user
        var query = {"author":locals.user.local.email};
        mongoFn.query(query, function(resultObj){
            locals.polls = resultObj.response;
            res.status(200);
            res.render('profile', locals);
            
        }); // end query
    }); // end app.get('/profile')
    
    // LOGOUT ===================================
    app.get('/logout', function(req, res){
        // create locals
        var locals = getLocals();
        // logout
        req.logout();
        locals.user = false;
        res.redirect('/');
    }); // end app.get('/logout')
    
    
    // GET NEW POLL =============================
    app.get('/poll/new', isLoggedIn, function(req, res){
        // create locals
       var locals = getLocals();
       locals.user = req.user;
        
        res.render('new_poll', locals);
    }); // end app.get('/poll/new')
    
    // POST NEW POLL ============================
    app.post('/new_poll', isLoggedIn, function(req, res){
        // validate submission
        if ((req.body.name != '') && (req.body.labels.length > 1)) {
         
            // convert response into document format for db
            createPollObject(req.body, function(insertResult){
                
                // insert formatted document
                mongoFn.insert(insertResult, function(result){
                    // redirect to new poll
                    res.redirect('/poll/' + insertResult.id);
                }); // end insert
                
            }); // end createPollObject
            
        } else {
            // didn't pass validation
            res.redirect('/new_poll');
        } // end else
    }); // end app.post('/new_poll')
    
    // SINGLE POLL ==============================
    app.get('/poll/:id', function(req, res){
        // create locals
       var locals = getLocals();
        // add user info if present, otherwise add guest ip
        if (req.user) {
            locals.user = req.user;
        }

        // query the db for the poll requested then render
        var query = { 'id' : +req.params.id };
        mongoFn.query(query, function(results){
            
            if (results.response.length > 0) {
                var pollObj = results.response[0];
                locals.poll = pollObj;
                locals.chartData = dataFormat(pollObj);

                // check if user already voted and set locals.voted to true/false
                if ((locals.user) && (pollObj.voters)) {
                    if (pollObj.voters.indexOf(locals.user.local.email) >= 0) {
                        locals.voted = true;
                    } else {
                        locals.voted = false;
                    }
                }
                
                res.render('poll', locals);
            } else {
                res.render('404', locals);   
            } // end else
        }); // end query
    }); // end app.get('/poll/:id')
    
    // POLL SUBMIT VOTE =========================
    app.post('/vote', function(req, res){
        // create query for db lookup
        var query = { "id": parseInt(req.body.poll_id), "choices.label": req.body.choice };
        // create update object
        var update = { "$inc" : { "choices.$.value" : 1 }, "$addToSet" : { "voters": req.body.voter } };

        // update in db
        mongoFn.update(query, update, function(result){
            res.redirect('/poll/' + req.body.poll_id);
        }); // end update
    }); // end app.post('/vote')
    
    // TEST POLLS ===============================
    app.get('/testpoll', function(req, res){
        // insert test poll objects
        mongoFn.insert(pollObj1, function(result){
            console.log(result);
            mongoFn.insert(pollObj2, function(result){
                console.log(result);
                res.redirect('/');
            }); // end insert 2
        }); // end insert 1
    }); // end app.get('/testpoll')
    
    // NEXTID LOGGER ============================
    // route to log the next available id number (current largest + 1)
    app.get('/nextid', function(req, res){
        mongoFn.getNextId(function(results){
            console.log('The next available id number is: ' + results.response);
            res.redirect('/');
        }); // end getNextId()
    }); // end app.get('/nextid')
      
}; // end module.exports


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

// Create Poll Object
// accepts a POST object and callback, updates mongodb, and returns object (success/error)
function createPollObject(postData, callback){
    
    // get next id
    mongoFn.getNextId(function(results){
        // store next id response
        var nextId = results.response;
        
        // convert postData into db document with initial data
        var insertDocument = { 
            id:     nextId,
            name:   postData.name,
            author: postData.author
        };
        // add labels from postData
        var choicesArray = [];
        postData.labels.forEach(function(label){
            // loop through labels and push to array
            choicesArray.push({ "label": label, "value": 0 });
        });
        insertDocument.choices = choicesArray;
        
        // test insertDocument by sending back to be console.logged
        callback(insertDocument);
        
    }); // end getNextId
}


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