const mosca = require('mosca');
const settings = {
    port: 6000,
};
const server = new mosca.Server(settings);

const CTL_DATA = 1000;

server.on('ready', function(){
    console.log('Mosca server is up and running');
});
server.on('published', function(packet, client) {
    console.log('Published', packet.payload.toString());
});

module.exports = server;