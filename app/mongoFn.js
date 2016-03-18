// vars
var mongo = require('mongodb').MongoClient;
var configDB = require('../config/database');

// mongoFn object
var mongoFn = {};

// test connection - accepts a callback, returns an object ie: { 'response' : value }
mongoFn.testConnection = function(callback){
    // connect to mongodb
    mongo.connect(configDB.url, function (err, db) {
        // handle errors
        if (err) callback( { 'response' : 'Unable to connect to the database.' } );
        // retrieve all data
        var returnObj = {};
        var data = db.collection('data');
        data.find({}).toArray(function(err, docs){
            // error and success responses
            if (err) {
                returnObj = { 'response' : 'Unable to perform array conversion.' };
            } else {
                returnObj = { 'response' : docs };
            }
            // close and return
            db.close();
            callback(returnObj);
       }); // end find().toArray()
    }); // end connect
}; // end testConnection

// mongoFn query() - accepts a query object and a callback, returns an object
mongoFn.query = function(queryObj, callback){
    
    // if only callback provided, queryObj becomes {} for find all;
    if (arguments.length == 1) {
        callback = queryObj;
        queryObj = {};
    }
    
    // connect and query
    mongo.connect(configDB.url, function (err, db) {
        
        if (err) callback({ 'response' : 'Error: Unable to connect to db' });
        
        var data = db.collection('data');
        data.find(queryObj).toArray(function(err, docs){
            
            // create return object
            var returnObj;
            if (err) {
                returnObj = { 'response' : 'Error: Unable to retrieve docs' };
            } else {
                returnObj = { 'response' : docs };
            }
            
            // close db and run callback
            db.close();
            callback(returnObj);
            
        }); // end find().toArray()        
    }); // end connect
}; // end query()



// exports
module.exports = mongoFn;