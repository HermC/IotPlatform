const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:6001');

ws.on('open', function() {
    console.log('ws connection established!');
});

ws.on('message', function(msg) {
    console.log('ws message received: ' + msg);
});

module.exports = ws;