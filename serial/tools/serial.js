const SerialPort = require('serialport');
const serialport = new SerialPort('COM4', {
    baudRate: 9600,
    autoOpen: false
});

serialport.on('data', function(data) {
    console.log('data received: ' + data);
});

serialport.on('error', function(error) {

});

SerialPort.list(function(error, ports) {
    ports.forEach(function(port) {
        console.log(port.comName, port.pnpId, port.manufacturer);
    });
});

module.exports = serialport;