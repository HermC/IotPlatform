const SerialPort = require('serialport');
const portName = '/dev/tty.usbmodem141401';
const serialport = new SerialPort(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',   //奇偶校验
    stopBits: 1,   //停止位
    // autoOpen: true,
    flowControl: false
});

serialport.on('open', function(error) {
    if (error) {
        console.log('open serial port ' + portName + ' error');
    } else {
        console.log('open success');
        let d = '';
        serialport.on('data', function(data) {
            let s = data.toString();
            if (s && s.charAt(s.length - 1) === '\n') {
                d += s;
                console.log(parseFloat(d));
                d = '';
            } else {
                d += s;
            }
        });
    }
});

serialport.on('error', function(error) {
    console.log('error: ' + error);
});

SerialPort.list(function(error, ports) {
    ports.forEach(function(port) {
        console.log(port.comName, port.pnpId, port.manufacturer);
    });
});

module.exports = serialport;