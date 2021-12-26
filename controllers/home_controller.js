// const post=require('../mmodels/post');
// module.exports.home = function(req, res){
//     // console.log(req.cookies);
//     // res.cookie('user_id', 25);


    
//     return res.render('home', {
//         title: "Home"
//     });
// }

// // module.exports.actionName = function(req, res){}
const Post = require('../models/post');
const User = require('../models/user');
/*
//made by promise .exec
module.exports.home = function(req, res){//ansynchronous
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts:  posts
    //     });
    // });

    // populate the user of each post
    Post.find({})//WAIT
    //As look into Robo3t object is is refering to user
    //no we have to display only the required content for user
    //intially only the id was populated 
    // but now the whole object is populated
    //to populate whole user object
    .populate('user')
    //to  models one is comments and other is user
    .populate({
        path: 'comments',
        //further populate user
        populate: {
            path: 'user'
        }
    })//put callback function in exec
    .exec(function(err, posts){//WAIT           
        return res.render('home', {
            title: "Codeial | Home",
            posts:  posts
        });
    })

}
*/
// module.exports.actionName = function(req, res){}




//Using Async Await


//declaring async over here which declares that function contains 
//async statements inside it




// BY DEFAULT THIS WILL RUN AS WE ARE CALLING HOMECONTROLLER DEFAULTLY
module.exports.home= async function(req,res)
{
    try{
         //awaited before moving to next One.Wait till execution of function
         //before which await is present
    let posts=await Post.find({})
    //sorted according to nearest
    //-createdAt will sort in order of latest to old
    .sort('-createdAt') 
    .populate('user')
    .populate({
        // 
        path:'comments',
        populate:{
            //
            path:'user'
        }
    });
    //and then we waited for user search query to be executed
    let users=await User.find({});
    //And return to the browser
return res.render('home',{
    title:"Codeial | home",
    posts: posts,
    all_users:users
    });
    }catch(err)
    {
        console.log(err);
        return;
    }
   
}