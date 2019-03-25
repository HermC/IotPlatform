var express = require('express');
var router = express.Router();

var connector = require('../db/mysql');

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

module.exports = router;