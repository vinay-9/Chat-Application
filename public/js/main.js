const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const users = [];
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

                                                  // // Get username and room from URL

                                                  // const {username,room } = Qs.parse(location.search, {
                                                  //   ignoreQueryPrefix: true
                                                  // });
                                                  // // const { username, room } =`?username=${username}&room=${room}`;
                                                  // // const username =this.URL.arguments.usermane.value;
                                                  // // const room =this.URL.arguments.room.value;

  const socket = io();
  function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
  }

                                      // Get current user
                                      function getCurrentUser(id) {
                                        return users.find(user => user.id === id);
                                      }

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

                                        // Get room users
                                        function getRoomUsers(room) {
                                          return users.filter(user => user.room === room);
                                        }
                                        // Join chatroom
                                        socket.emit('joinRoom', { username, room });

                                        // Get room and users
                                        socket.on('roomUsers', ({ room, users }) => {
                                          outputRoomName(room);
                                          outputUsers(users);
                                        });

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

                                      // Output message to DOM
                                      function outputMessage(message) {
                                        const div = document.createElement('div');
                                        div.classList.add('message');
                                        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                                        <p class="text">
                                          ${message.text}
                                        </p>`;
                                        
                                        document.querySelector('.chat-messages').appendChild(div);
                                      }

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

              // Add users to DOM
              function outputUsers(users) {
                userList.innerHTML = `
                  ${users.map(user => `<li>${user.username}</li>`).join('')}
                `;
              }
