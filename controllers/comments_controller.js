// // const Comment = require('../models/comment');
// // const Post = require('../models/post');

// // module.exports.create = function(req, res){
// //     //find the post with that post id and then create after it
// //     Post.findById(req.body.post, function(err, post){

// //         if (post){
// //             Comment.create({
// //                 content: req.body.content,
// //                 post: req.body.post,
// //                 user: req.user._id
// //             }, function(err, comment){
// //                 // handle error
// //                 //Adding comment to post
// //                 post.comments.push(comment);
// //                 //when there is a update i need to save it
// //                 post.save();
                
// //                 res.redirect('/');
// //             });
// //         }

// //     });
// // }
// const Comment = require('../models/comment');
// const Post = require('../models/post');

// module.exports.create = async function(req, res){

//     try{
//         let post = await Post.findById(req.body.post);

//         if (post){
//             let comment = await Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             });
//             //Adding the comment into post list of comment id
//             post.comments.push(comment);
//             post.save();
//             req.flash('success', 'Comment published!');

//             res.redirect('/');
//         }
//     }catch(err){
//         req.flash('error', err);
//         console.log("error");
//         return;
//     }
    
// }


// module.exports.destroy = async function(req, res){

//     try{
//         let comment = await Comment.findById(req.params.id);

//         if (comment.user == req.user.id){

//             let postId = comment.post;

//             comment.remove();

//             let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
//             // req.flash('success', 'Comment deleted!');

//             return res.redirect('back');
//         }else{
//             // req.flash('error', 'Unauthorized');
//             return res.redirect('back');
//         }
//     }catch(err){
//         // req.flash('error', err);
//         return;
//     }
    
// }
const Comment = require('../models/comment');
const Post = require('../models/post');
// const commentsMailer = require('../mailers/comments_mailer');
// const commentEmailWorker=require('../workers/comment_email_worker');
module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            
            comment = await comment.populate('user', 'name email').execPopulate();
            //calling mailer file here
            commentsMailer.newComment(comment);
    //    let job=  queueMicrotask.create('mails',comment).save(function(err){
    //             if(err){
    //                 console.log("error in creating a queue");

    //             }
    //             cosnole.log(job.id);
    //         });

            
            if (req.xhr){
                
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}