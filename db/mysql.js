var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '139.196.92.241',
    port: '3306',
    user: 'root',
    password: 'mf1832225',
    database: 'alertplatform'
});

connection.connect();

module.exports = connection;
