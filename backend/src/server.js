// Starts and listens for connections from the client, initializing the application's server.
const app = require('./app');  // Import app.js
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

