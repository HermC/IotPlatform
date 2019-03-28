const express = require('express');
const router = express.Router();

const connector = require('../db/mysql');

router.get('/list', function (req, res, next) {
    connector.query('SELECT * FROM device', function (error, results, fields) {
        if (error)
            res.send(fail(error.errno));
        else
            res.send(success(results));
    });
});

router.get('/:deviceId/sensor', function (req, res, next) {
    connector.query(`SELECT * FROM sensor WHERE device_id = ${req.params.deviceId}`, function (error, results, fields) {
        if (error)
            res.send(fail(error.errno));
        else
            res.send(success(results));
    });
});

router.post('/:deviceId/update', function (req, res, next) {
    connector.query(`SELECT 1 FROM device WHERE id = '${req.params.deviceId}'`, function (error, results, fields) {
        const data = req.body;
        if (error) {
            console.log(error);
            res.send(fail(error.errno));
        } else {
            if (!results || results.length === 0) {
                connector.query(`INSERT INTO device VALUES ('${data.name}', '${data.deviceId}', '${data.os}', '${data.version}', '${data.ip}', 'active', '${new Date().format('yyyy-MM-dd hh:mm:ss')}')`, function (error, results, fields) {
                    if (error) {
                        res.send(fail(error.errno));
                    } else {
                        res.send(success(results));
                    }
                });
            } else {
                connector.query(`UPDATE device SET name = '${data.name}', os = '${data.os}', version = '${data.version}', state = 'active', handshake = '${new Date().format('yyyy-MM-dd hh:mm:ss')}' WHERE id = '${req.params.deviceId}'`, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.send(fail(error.errno));
                    } else {
                        res.send(success(results));
                    }
                });
            }
        }
    });
});

router.post('/:deviceId/sensor/:sensorId', function (req, res, next) {
    connector.query(`SELECT 1 FROM sensor WHERE id = '${req.params.sensorId}' and device_id = '${req.params.deviceId}'`, function(error, results, fields) {
        const data = req.body;
        if (error) {
            console.log(error);
            res.send(fail(error.errno));
        } else {
            if (!results || results.length === 0) {
                connector.query(`INSERT INTO sensor VALUES ('${req.params.sensorId}','${req.params.deviceId}', '${data.name}', ${port}, '${data.protocol}', '${data.type}', '${data.state}')`, function(error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.send(fail(error.errno));
                    } else {
                        res.send(success(results));
                    }
                });
            } else {
                connector.query(`UPDATE sensor SET name = '${data.name}', port = ${data.port}, protocol = '${data.protocol}', type = '${data.type}', state = 'active' WHERE id = '${req.params.sensorId}' and device_id = '${req.params.deviceId}'`, function(error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.send(fail(error.errno));
                    } else {
                        res.send(success(results));
                    }
                });
            }
        }
    });
});

router.post('/sensor/:sensorId/data', function(req, res, next) {
    const data = req.body;
    console.log(data);
    connector.query(`SELECT * FROM sensor_data WHERE sensor_id = '${req.params.sensorId}' AND (record_time BETWEEN '${data.start}' AND '${data.end}') ORDER BY record_time ASC `, function(error, results, fields) {
         if (error) {
             console.log(error);
             res.send(fail(error.errno));
         } else {
             res.send(success(results));
         }
    });
});

setInterval(function() {
    connector.query(`SELECT id FROM device WHERE (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(handshake)) / 60.0 > 1.0`, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            for (let i = 0; i < results.length; i++) {
                connector.query(`UPDATE sensor SET state = 'down' WHERE device_id = '${results[i].id}'`, function(error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                });
                connector.query(`UPDATE device SET state = 'down' WHERE id = '${results[i].id}'`, function(error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        }
    });
}, 30000);

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

Date.prototype.format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

module.exports = router;