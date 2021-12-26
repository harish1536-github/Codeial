const nodeMailer = require('../config/nodemailer');

//newComment=function({

// })
//instead of writting module.exports =newcomment

// this is another way of exporting a method

// argument has new comment
exports.newComment = (comment) => {
    console.log('inside newComment mailer', comment);

    nodeMailer.transporter.sendMail({
       from: 'Your Own Email Address',
       //sending to the person who has commented
       to: comment.user.email, 
       subject: "New Comment Published!",
       html: '<h1>Yup, your comment is now published!</h1>' 
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}
