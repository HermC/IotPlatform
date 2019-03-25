import Vue from 'vue'
import Router from 'vue-router'
import Device from '../components/Device'
import Sensor from '../components/Sensor'
import SensorData from '../components/SensorData'


Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'device',
        component: Device
    },
    {
        path: '/device',
        name: 'device',
        component: Device
    },
    {
        path: '/sensor',
        name: 'sensor',
        component: Sensor
    },
    {
        path: '/sensor/data',
        name: 'sensorData',
        component: SensorData
    }
];

const router = new Router({routes: routes});
// const cookies = require('js-cookie');

router.beforeEach((to, from, next) => {
    // if (to.path !== '/passport' && !cookies('token')) {
    // next('/passport')
    // } else {
    next()
    // }
});

export default router
