var mosca = require('mosca');
var settings = {
    port: 6000,
};
var server = new mosca.Server(settings);

server.on('ready', function(){
    console.log('Mosca server is up and running');
});
server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});

module.exports = server;