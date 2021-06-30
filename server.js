const express=require('express');
const http=require('http');
const path = require('path');
//to send everyrhinf to everoe else except the user sending itself 
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);



app.use(express.static(path.join(__dirname, 'public')));

//mongo "mongodb+srv://cluster0-gpac9.mongodb.net/test" --username vinay


  // Set static folder
//basically server emits the informatio of the users in the html 
// and the client receives the infrormation and performs the desired action 
const mongoose =require ("mongoose") ;
mongoose.connect ("mongodb+srv://vinay:HZbpldPvIcPHOqq6@cluster0-gpac9.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser:
true,useUnifiedTopology: true});
const Post=require ("./post");

const botName = 'Chattit Bot';

// Run when client connects
//to join the room
io.on('connection', socket => {
  
  //join room using the usernmane and room nam efrom the router aranertrer 
  // is perfromed when ever the joinRoom event is firesd off 
  // actions the client that the iser wants to join the room
    socket.on('joinRoom', ({ username, room }) => {
      //this will return the user to the consr user 
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user 
    // and send the message to everyone that this person has been added in the room of users 
    socket.emit('message',formatMessage(botName, 'Welcome to Chattit'));

    // Broadcast when a user connects
    //emit to everyone else aoyt the entry of any person
    socket.broadcast.to(user.room)
    .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  // when chat message command is hit , then it emits the message to be sens to the user 
                    socket.on('chatMessage', msg => {
                      const user = getCurrentUser(socket.id);
                      const message=formatMessage(user.username, msg);
                      const msgtime =new Date(msg.time); 
                      const post =new Post ({
                        name :user.username,
                        room :user.room,
                        time :msgtime.toTimeString,
                        message:message.text
                      })
                      post.save()
                      .then (()=>{
                        console.log("post saved");
                      }).catch(err=>console.log(err));
                      



                      io.to(user.room).emit('message', formatMessage(user.username, msg));
                    });

  
  
  
 // Runs when client disconnects from the web page 
 // only when the user leaves the chat.html web page
  socket.on('disconnect', () => {
    //returns the list of users that are actially in the room after  leaving that particular id 
    const user = userLeave(socket.id);

    if (user) {
      //emits  main the message that this user has left the chat   
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      // server only sends the information of the users that are still int the room 
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

});





//finally at the end the funal connection is made to rhe port
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

