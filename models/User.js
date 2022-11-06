const mongoose = require('mongoose') ; 
const interview = require('./interview');
const schema = mongoose.Schema ;

const userSchema =  new schema(
    {
        Name :  
        {
            type : String , 
            required :  true 
        } , 
        resume : 
        {
            type :  String 
        },

    }
);

// exporting the schema . 
const User =  mongoose.model('User' , userSchema) ; 
module.exports = User ;  

