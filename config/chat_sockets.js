//Observer
//interation between sockets will take place here
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);
    //EVENT HERE WILL CALLED CONNECTION
    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });
        socket.on('join_room', function(data){
            console.log('joining request rec.', data);
            //if chatroom this name exits then user will 
            //enter in that chat room if it do not create the 
            //chat room then it will create and enter into chatroom
            socket.join(data.chatroom);
            
            //then all the user in chat room should reciever someone new has joined 
            //chatroom
            //for emitting in specific chat room i do io.in
            io.in(data.chatroom).emit('user_joined', data);
        });
         // CHANGE :: detect send_message and broadcast to everyone in the room
         socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });
    });

}