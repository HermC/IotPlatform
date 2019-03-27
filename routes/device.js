const express = require('express');
const router = express.Router();

const connector = require('../db/mysql');

router.get('/list', function(req, res, next) {
    connector.query('SELECT * FROM device', function(error, results, fields) {
        if (error)
            res.send(fail(error.errno));
        else
            res.send(success(results));
    });
});

router.get('/:deviceId/sensor', function(req, res, next) {
    connector.query(`SELECT * FROM sensor WHERE device_id = ${req.params.deviceId}`, function(error, results, fields) {
        if (error)
            res.send(fail(error.errno));
        else
            res.send(success(results));
    });
});

router.post('/:deviceId/update', function(req, res, next) {
    connector.query(`SELECT 1 FROM device WHERE id = ${req.params.deviceId}`, function(error, results, fields) {
        const data = req.body;
        console.log(req);
        if (error) {
            console.log(error);
            res.send(fail(error.errno));
        }
        else {
            if (!results || results.length === 0) {
                connector.query(`INSERT INTO device VALUES (${req.params.deviceId}, ${data.deviceId}, ${data.os}, ${data.version}, ${data.ip}, 'active', ${Date.now()})`, function(error, results, fields) {
                    console.log(error);
                    if (error)
                        res.send(fail(error.errno));
                    else
                        res.send(success(results));
                });
            } else {
                connector.query(`UPDATE device SET name = ${req.params.deviceId}, os = ${data.os}, version = ${data.version}, state = 'active', handshake = ${Date.now()} WHERE id = ${req.params.deviceId}`, function(error, results, fields) {
                    console.log(error);
                    if (error)
                        res.send(fail(error.errno));
                    else
                        res.send(success(results));
                });
            }
        }
    });
});

function success(data) {
    return JSON.stringify({
        code: 200,
        data: data,
        message: '',
        success: true
    });
}

function fail(msg) {
    return JSON.stringify({
        code: 200,
        data: null,
        message: msg,
        success: false
    });
}

function getDateTime(date) {
    var time = 1542708681;
// 也可以获取当前的毫秒级时间戳
    var time2 = Date.now();
    var date = new Date(time * 1000);
    var dt = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
}

module.exports = router;