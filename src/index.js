// External Import
const http = require('http');
const dotenv = require('dotenv').config();

// Internal Import
const app = require('./app');
const { PORT } = require('./config/keys');
require('./config/connectdb');
const mySocket = require('./chat/chat.socket');

// Create HTTP server.
const server = http.createServer(app);

mySocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
