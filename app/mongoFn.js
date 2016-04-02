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
        
        if (err) {
            callback({ 'response' : 'Error: Unable to connect to db' });
        } else {
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
        } // end else      
    }); // end connect
}; // end query()


// mongoFn insert - accepts an object and a callback - returns an object
mongoFn.insert = function(insertObj, callback){
    mongo.connect(configDB.url, function (err, db) {
        if (err) {
            callback({ 'response' : 'Unable to connect to db' });
        } else {
            // insert document
            var data = db.collection('data');
            data.insertOne(insertObj, function(err, result){
                
                // create return object
                var returnObj;
                if (err) {
                    returnObj = { 'response' : 'Error: Unable to insert document' };
                } else {
                    returnObj = { 'response' : result.result };
                }
                
                // close db and run callback
                db.close();
                callback(returnObj);
                
            }); // end insertOne           
        } // end else   
    }); // end connect
}; // end insert()


// mongoFn getNextId - accepts a callback, returns an object that contains the next available id num
mongoFn.getNextId = function(callback){
    mongo.connect(configDB.url, function(err, db){
        if (err) {
            callback({'response':'Unable to connect to db'});
        } else {
            // aggregate through the data to return the largest id number
            var data = db.collection('data');
            var sort = { $sort : { 'id' : -1 } };
            var limit = { $limit : 1 };
            var project = { $project : { '_id' : 0, 'id' : 1} };
            data.aggregate([sort, limit, project]).toArray(function(err, docs){
                var returnObj = {};
                if (err) {
                    returnObj = {'response':'Unable to retrieve docs'};
                } else {
                    // return the next available id num
                    returnObj = {'response': docs[0].id + 1 };
                }

                // close db and run callback
                db.close();
                callback(returnObj);
                
            }); // end aggregate
        } // end else
    }); // end connect
}; //end getNextId


// mongoFn update - accepts 2 objects and a callback, returns an object
mongoFn.update = function(query, update, callback){
    mongo.connect(configDB.url, function(err, db){
        if (err) {
            callback({'response':'Unable to connect to db'});
        } else {
            
            var data = db.collection('data');
            data.updateOne(query, update, function(err, result){
                var returnObj = {};
                if (err) {
                    returnObj = { 'response' : 'Error: Unable to update document' };
                } else {
                    returnObj = { 'response' : result.result };
                }
                
                db.close();
                callback(returnObj);
                
            }); // end updateOne
        } // end else
    }); // end connect
}; // end update


// mongoFn remove - accepts an object and a callback, returns an object
mongoFn.remove = function(removeQuery, callback){
    mongo.connect(configDB.url, function(err, db){
        if (err) {
            callback({'response':'Unable to connect to db'});
        } else {

            var data = db.collection('data');
            data.deleteOne(removeQuery, function(err, result){
                var returnObj = {};
                if (err) {
                    returnObj = { 'response' : 'Error: Unable to remove document' };
                } else {
                    returnObj = { 'response' : result.result };
                }
                
                db.close();
                callback(returnObj);
                
            }); // end deleteOne
        } // end else
    }); // end connect
}; // end mongoFn remove


// mongoFn remove - accepts an object and a callback, returns an object
mongoFn.removeMany = function(removeQuery, callback){
    mongo.connect(configDB.url, function(err, db){
        if (err) {
            callback({'response':'Unable to connect to db'});
        } else {

            var data = db.collection('data');
            data.deleteMany(removeQuery, function(err, result){
                var returnObj = {};
                if (err) {
                    returnObj = { 'response' : 'Error: Unable to remove documents' };
                } else {
                    returnObj = { 'response' : result.result };
                }
                
                db.close();
                callback(returnObj);
                
            }); // end deleteMany
        } // end else
    }); // end connect
}; // end mongoFn removeMany


// exports
module.exports = mongoFn;