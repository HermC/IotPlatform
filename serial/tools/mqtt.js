const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:6000');

let qtt = {
    data: 'hello world'
};
client.publish('TEST', JSON.stringify(qtt), { qos: 0, retain: true });

module.exports = client;