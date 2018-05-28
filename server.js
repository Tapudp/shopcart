const http = require('http');
const app = require('./app');

var port = process.env.PORT || 3000;

var server = http.createServer(app);

server.listen(port, () => {
    console.log(`~~app is running at ${port}~~`);
});