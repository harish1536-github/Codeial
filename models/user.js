const mongoose = require('mongoose');
//defining a schema and using this schema we are accesing the 
// database and sending things to it 


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }

}, {
    //created at and updated at
    timestamps: true
});

//making a collection user with schema defined as userSchema
//User will be name in database and schema will be defined as 
// userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;