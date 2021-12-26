// require post module
const Post = require('../models/post')
const Comment = require('../models/comment');

/*DONE USING SIMPLE METHOD i.e CALLBACK
module.exports.create = function(req, res){
    //create post in database
    Post.create({
        //save the data comming from form to db
        content: req.body.content,
        //cretted request.user._id
        user: req.user._id
    }, function(err, post){
        if(err){console.log('error in creating a post'); return;}

        return res.redirect('back');
    });
}
 const Post = require('../models/post');
const Comment = require('../models/comment');
//can be done using promise also but here we are doing 
// with async await and by callback we have done above
// await means wait for this code to execute then move ahead

*/
// APPLY ASYNC AWAIT ONLY WHEN WE HAVE MULTIPLE CALLBACK
module.exports.create = async function(req, res){
    
    try{

        //creating post using post.create
        await Post.create({

            content: req.body.content,
            //telling which collection it is refering to 
            user: req.user._id
        });
        
         //type of ajax request is XMLHTTP request that is xhr request
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();
            //return json with status
            return res.status(200).json({
                data: {
                    post: post
                },
                //including message also while sending response
                message: "Post created!"
            });
        }
        //used noty here
        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
  
}


module.exports.destroy = async function(req, res){

    try{
        //get the id from query in the parameters
        let post = await Post.findById(req.params.id);
        //find the contact in the database and delete it 
        if (post.user == req.user.id){
            post.remove();

            await  Comment.deleteMany({post: req.params.id});


            if (req.xhr){
                return res.status(200).json({
                    data: {
                        
                        post_id: req.params.id
                    },
                    message: "Post deleted "
                });
            }
            
            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}