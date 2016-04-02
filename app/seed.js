// reset the database with this file
var mongoFn = require('./mongoFn');

// example poll objects =================================
var pollObj1 = { 
    id: 1,
    name: 'What is your primary programming language?', 
    author: 'JohnnyApplecore@gmail.com', 
    choices: [
        {label:'JavaScript', value: 12},
        {label:'C#', value: 5},
        {label:'Python', value: 3},
        {label:'Ruby', value: 3}
    ],
    voters: ['username1','username2','ipaddress1']
};
var pollObj2 = {
    id: 2,
    name: 'What is your favorite digital camera brand?',
    author: 'SuzyQ@gmail.com',
    choices: [
        {label:'Nikon', value: 5},
        {label:'Canon', value: 2},
        {label:'Sony', value: 1},
        {label:'Pentax', value: 1}
    ],
    voters: ['username1','username2','ipaddress2']
};

// exports object - accepts a callback
module.exports = function(callback){
    
    // remove polls first
    mongoFn.removeMany({}, function(result){
        console.log(result);
        // insert 1st example poll
        
        mongoFn.insert(pollObj1, function(result){
            console.log(result);
            
            // insert 2nd example poll
            mongoFn.insert(pollObj2, function(result){
                console.log(result);
                
                // return with callback
                callback();
                
            }); // end insert 2
        }); // end insert 1
    }); // end removeMany
       
}; // end module.exports