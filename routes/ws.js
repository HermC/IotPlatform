const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 6001 });

const wscs = [];

wss.on('connection', function(wsc) {
    wsc.on('message', function(msg) {
        console.log('wss message received:' + msg);
    }) ;
});

wss.on('close', function(wsc) {
    let index = -1;
    for (let i = 0; i < wscs.length; i++) {
        if (wscs[i] === wsc) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        wscs.splice(index, 1);
    }
});

module.exports = wss;