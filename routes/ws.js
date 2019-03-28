const WebSocket = require('ws');
const mysql  = require('../db/mysql');

const wss = new WebSocket.Server({ port: 6001 });

const CTL_DATA = 1000;

wss.on('connection', function(wsc) {
    wsc.on('message', function(text) {
        console.log('wss message received:' + text);
        let msg;
        try {
            msg = JSON.parse(text);
        } catch (e) {
            return;
        }
        if (msg.code === CTL_DATA) {
            let data = msg.data;
            mysql.query(`INSERT INTO sensor_data(sensor_id, value, unit, record_time) VALUES ('${data.sensorId}', ${data.value}, '', '${new Date().format()}')`, function(error, results, fields) {
                if (error) {
                    console.log(error);
                }
            });
            mysql.query(`UPDATE sensor SET state = 'active' WHERE id = '${data.sensorId}'`, function(error, results, fields) {
                if (error) {
                    console.log(error);
                }
            });
            mysql.query(`UPDATE device SET state = 'active' WHERE id = '${data.deviceId}'`, function(error, results, fields) {
                if (error) {
                    console.log(error);
                }
            });
        }
    }) ;
});

wss.on('close', function(wsc) {

});

module.exports = wss;