const SerialPort = require('serialport');

const ws = require('./ws');
const mqtt = require('./mqtt');


const portName = '/dev/tty.usbmodem144301';
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
            // console.log(s);
            if (s && s.charAt(s.length - 1) === '\n') {
                d += s;
                console.log(d);

                let line = d.trim().split('\n');
                if (line.length >= 2) {
                    let val1 = line[0].split('=');
                    console.log(val1);
                    let val2 = line[1].split('=');
                    console.log(val2);

                    sendData(val1);
                    sendData(val2);
                } else {
                    let val1 = line[0].split('=');
                    console.log(val1);

                    sendData(val1);
                }

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

const CTL_DATA = 1000;
function sendData(val) {
    if (val[0] === 'L') {
        mqtt.publish('LIGHT', JSON.stringify({
            code: CTL_DATA,
            data: {
                deviceId: '1',
                sensorId: '1',
                value: parseFloat(val[1])
            }
        }, { qos: 0, retain: true }));
    } else if (val[0] === 'T') {
        if (ws.isOpen) {
            ws.send(JSON.stringify({
                code: CTL_DATA,
                data: {
                    deviceId: '1',
                    sensorId: '2',
                    value: parseFloat(val[1])
                }
            }));
        }
    }
}

module.exports = serialport;