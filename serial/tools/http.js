const http = require('http');

let body = {
    name: '监控设备1',
    os: 'rtos',
    version: '1.0.2',
    ip: '127.0.0.1',
    sensors: [{
        id: '1',
        name: '光敏电阻',
        port: 6000,
        protocol: 'mqtt',
        type: '光敏电阻',
        state: 'active'
    }, {
        id: '2',
        name: '温湿度传感器',
        port: 6001,
        protocol: 'websocket',
        type: '温湿度传感器',
        state: 'active'
    }]
};

let req = http.request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/device/1/update',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
}, function(res) {
    console.log('STATUS: ' + res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

req.write(JSON.stringify(body));
req.end();

for (let i = 0; i < body.sensors.length; i++) {

}

module.exports = http;

