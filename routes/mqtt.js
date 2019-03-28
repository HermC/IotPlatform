const mosca = require('mosca');
const mysql = require('../db/mysql');

const settings = {
    port: 6000,
};
const server = new mosca.Server(settings);

const CTL_DATA = 1000;

server.on('ready', function(){
    console.log('Mosca server is up and running');
});
server.on('published', function(packet, client) {
    console.log('Published', packet.payload.toString());
    let msg;
    try {
        msg = JSON.parse(packet.payload.toString());
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
});

Date.prototype.format = function (fmt) { //author: meizz
    if (!fmt) {
        fmt = 'yyyy-MM-dd hh:mm:ss';
    }
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

module.exports = server;