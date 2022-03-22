// External Import
const http = require('http');
const dotenv = require('dotenv').config();

// Internal Import
const app = require('./app');
const { PORT } = require('./config/keys');
require('./config/connectdb');

// Create HTTP server.
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
