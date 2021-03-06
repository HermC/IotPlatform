const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:6001');

ws.isOpen = false;

ws.on('open', function() {
    ws.isOpen = true;
    console.log('ws connection established!');
});

ws.on('message', function(msg) {
    console.log('ws message received: ' + msg);
});

ws.on('error', function(err) {
    console.log(err);
});

module.exports = ws;