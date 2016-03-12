// dependencies
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// user model
var userSchema = mongoose.Schema({
    
    local : {
        email    : String,
        password : String
    }
    
});

// methods ==============
// hash - async method calls
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// password validation
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);  
};

// exports
module.exports = mongoose.model('User', userSchema);
