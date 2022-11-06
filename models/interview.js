const mongoose = require('mongoose') ; 
const schema = mongoose.Schema ;  

// creating the schema for the admin to create the interview .  
const interSchema =  new schema(
    {
         start : 
         {
            type : Date  , 
            required : true  
         },
         end : 
         {
            type :  Date , 
            required : true 
         },
         participants : [{
           type: schema.ObjectId,
           ref:'User'
    }]
    }
) ; 

// exporting the schema . 
const interview =  mongoose.model('interview' , interSchema) ; 
module.exports = interview ;  