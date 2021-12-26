const mongoose = require('mongoose');

//creating a schema for post
const postSchema = new mongoose.Schema({
    //Specifying fields in Schema
    content: {
        type: String,
        //need to enter the data  
        required: true
    },
    //Second field of Schema 

    // IT BASICALLY HELP US TO FIND THE ID OF ALL THE USER IN POST
    user: {
        //Whatever post we are creating it is going to link
        //to a user so it need to refer to user schema 


        // WE ARE LINKING IT TO USER SCHEMA//
        // this type is a refrence to objectId type
        type:  mongoose.Schema.Types.ObjectId,
        //refer to user schema
        ref: 'User' 

    },
    //As we want to load comment with post 
    //So we include the array of ids of all comments in this post schema itself
    //Get me all this id instead of going to each comment
    //and finding whee post id is this post will make it super fast

    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},{
    //adding time stamp for having fields created at ....
    timestamps: true
});
//creating post collection with postSchema as schema
const Post = mongoose.model('Post', postSchema);
//exporting model
module.exports = Post;