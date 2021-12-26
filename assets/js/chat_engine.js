//file that is going to be contacting with server
//Useror Subscriber
//it will intiate the connection

class ChatEngine{
    constructor(chatBoxId, userEmail){

        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        //io is global variable availabl as soon as i included cdn in home.ejs
        //io is given to us by socket.io file
        this.socket = io.connect('http://localhost:5000');
        

        //it is called if ther is user email
        if (this.userEmail){
            this.connectionHandler();
        }

    }

    //creating a connection handler
    //this will have too fro interaction with
    //observer and subscriber.
    connectionHandler(){
    
        let self = this;
        //on means detecting the event
        //first event on socket takes place is connecction
        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');
        });

        //once connected then call the event ass join_room
        self.socket.emit('join_room', {
            //seding a request to join room 
            //i can which user to join
            user_email: self.userEmail,
            //room which i want to join
            chatroom: 'codeial'
        });
        
        self.socket.on('user_joined', function(data){
            console.log('a user joined!', data);
        })
    
    // CHANGE :: send a message on clicking the send message button
    $('#send-message').click(function(){
        let msg = $('#chat-message-input').val();

        if (msg != ''){
            self.socket.emit('send_message', {
                message: msg,
                user_email: self.userEmail,
                chatroom: 'codeial'
            });
        }

    });
    self.socket.on('receive_message', function(data){
        
        console.log('message received', data.message);

        //crete a li 
        let newMessage = $('<li>');

        let messageType = 'other-message';

        //check if it is our message
        if (data.user_email == self.userEmail){
            messageType = 'self-message';
        }

        newMessage.append($('<span>', {
            'html': data.message
        }));
      
        newMessage.append($('<sub>', {
            'html': data.user_email
        }));

        newMessage.addClass(messageType);

        $('#chat-messages-list').append(newMessage);
    })
    }
}