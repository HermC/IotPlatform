const WebSocket = require('ws');
const connection  = require('../db/mysql');

const wss = new WebSocket.Server({ port: 6001 });

const CTL_DATA = 1000;

wss.on('connection', function(wsc) {
    wsc.on('message', function(msg) {
        console.log('wss message received:' + msg);
        switch(msg['code']) {
            case CTL_DATA:
                handlerCtlData(msg['data']);
                break;
            default:
                console.log('error msg');
        }
    }) ;
});

wss.on('close', function(wsc) {

});

function handlerCtlData(data) {
    connection.query(`INSERT INTO sensor_data(sensor_id, value, unit, record_time) VALUES ('${data.sensorId}', ${data.value}, '${data.unit}', '${data.recordTime}')`, function(error, results, fields) {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = wss;