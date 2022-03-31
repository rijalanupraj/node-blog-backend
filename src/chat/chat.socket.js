// External Import
const socket = require('socket.io');

// Internal Import
const Message = require('./message.model');

const mySocket = server => {
  const io = socket(server, {
    cors: { origin: 'http://localhost:3000' }
  });
  let users = {};

  io.on('connection', socket => {
    socket.on('user connected', userId => {
      if (users[userId]) {
        socket.emit('error', 'Chat probably opened in another tab. You are disconnected now.');
        socket.disconnect();
        delete users[userId];
      }
      users[userId] = { conversationId: null, socketId: socket.id };
      io.emit('user data', users);

      socket.on('join conversation', conversationId => {
        users[userId] = { conversationId };

        socket.join(conversationId);
        io.emit('user data', users);

        io.to(conversationId).emit('get chat messages');

        socket.on('message seen', () => {
          Message.updateMany(
            {
              $and: [{ conversation: conversationId }, { receiver: userId }]
            },
            { seen: true }
          ).then(() => {
            io.to(conversationId).emit('get chat messages');
          });
        });

        socket.on('start typing', () => {
          socket.broadcast.to(conversationId).emit('typing', true);
        });

        socket.on('stop typing', () => {
          socket.broadcast.to(conversationId).emit('typing', false);
        });

        socket.on('send message', async message => {
          const { sender, receiver, conversation, body } = message;

          let countRoomMember = 0;
          for (const [key, value] of Object.entries(users)) {
            const { conversationId } = value;
            if (conversationId === conversation) {
              countRoomMember++;
            }
          }
          const messageObject = new Message({
            sender,
            receiver,
            conversation,
            body,
            seen: countRoomMember > 1 ? true : false
          });
          messageObject.save((err, msg) => {
            if (err) {
              socket
                .to(conversationId)
                .emit('error', 'An error occured while sending the message.');
            } else {
              io.to(conversationId).emit('message sent', msg);
              if (countRoomMember === 1) {
                socket.broadcast.to(users[receiver]).emit('message', 'for your eyes only');
              }
            }
          });
        });
      });

      socket.on('left conversation', conversationId => {
        users[userId] = { conversationId: null };
        socket.leave(conversationId);
        delete users[userId];
        socket.broadcast.to(conversationId).emit('typing', false);
        socket.disconnect();
        io.emit('user data', users);
      });

      socket.on('disconnect', () => {
        delete users[userId];
        io.emit('user data', users);
      });
    });
  });
};

module.exports = mySocket;
