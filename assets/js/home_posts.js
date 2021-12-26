{
    // console.log("Hello");
      // method to submit the form data for new post using AJAX
      let createPost = function(){
    let newPostForm = $('#new-post-form');
        //adding event listener .submit
    newPostForm.submit(function(e){
        //prevent default action of action
        e.preventDefault();
        //submitting using ajax
        $.ajax({
            //type is post request
            type: 'post',
            //specifying the url 
            url: '/posts/create',
            //data is send   converts form data into json
            // in the format as content will be the key and value will be 
            // value in the form
            data: newPostForm.serialize(),
            //funtion where we recieve some data
            success: function(data){
                // data has key data inside data we have post
                let newPost = newPostDom(data.data.post);
                //ul unordered list should have prepend
                //putting in the first position
                $('#posts-list-container>ul').prepend(newPost);
                //deleting the class of post
                deletePost($(' .delete-post-button', newPost));

                // call the create comment class
                new PostComments(data.data.post._id);

                new Noty({
                    theme: 'relax',
                    text: "Post published!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

            }, error: function(error){
                console.log(error.responseText);
            }
        });
    });
}
 // method to create a post in DOM
 let newPostDom = function(post){
     //back tick as it allows javascript expression
    return $(`<li id="post-${post._id}">
                <p>
                    
                    <small>
                        <a class="delete-post-button"  href="/posts/destroy/${ post._id }">X</a>
                    </small>
                   
                    ${ post.content }
                    <br>
                    <small>
                    ${ post.user.name }
                    </small>
                </p>
                <div class="post-comments">
                    
                        <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type Here to add comment..." required>
                            <input type="hidden" name="post" value="${ post._id }" >
                            <input type="submit" value="Add Comment">
                        </form>
           
            
                    <div class="post-comments-list">
                        <ul id="post-comments-${ post._id }">
                            
                        </ul>
                    </div>
                </div>
                
            </li>`)
}


// method to delete a post from DOM
// pass on the a tag in function  from home.ejs
let deletePost = function(deleteLink){
    //when this delete link is clicked
    $(deleteLink). click(function(e){
        //prevent default behaviour
        e.preventDefault();
        //making ajax request
        $.ajax({
            type: 'get',
            //get the value of href in a tag 
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
                new Noty({
                    theme: 'relax',
                    text: "Post Deleted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show(); 

            },error: function(error){
                //if error than display error
                console.log(error.responseText);
            }
        });

    });
}





// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
let convertPostsToAjax = function(){
    $('#posts-list-container>ul>li').each(function(){
        let self = $(this);
        let deleteButton = $(' .delete-post-button', self);
        deletePost(deleteButton);

        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1]
        new PostComments(postId);
    });
}



createPost();
convertPostsToAjax();
}