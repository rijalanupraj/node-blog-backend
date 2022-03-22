// External Import
const http = require('http');
const dotenv = require('dotenv').config();

// Internal Import
const { PORT } = require('./config/keys');

// Create HTTP server.
const server = http.createServer();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
