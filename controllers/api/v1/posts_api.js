const Post =require('../../../models/post');
const Comment = require('../../../models/comment');
//index is used to list down something as an action name
module.exports.index = async  function(req, res){

    let posts=await Post.find({})
    //sorted according to nearest
    //-createdAt will sort in order of latest to old
    .sort('-createdAt') 
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    });
    //send back json data we do res.data code with success
    return res.json(200, {
        //sending message
        message: "List of posts",
        //post is intially like this 
        posts: posts
    })
}
//find out the post delete the post and delete the comments
//associated with it
module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){
            post.remove();


            await Comment.deleteMany({post: req.params.id});


    
            return res.json(200, {
                message: "Post and associated comments deleted successfully!"
            });
        }else
            {
                return res.json(200,{
                    message:"you cannot delete this post"
                })
            }
        // }else{
        //     req.flash('error', 'You cannot delete this post!');
        //     return res.redirect('back');
        // }

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
    
}