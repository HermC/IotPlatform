import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

import router from './router/'
import echarts from 'echarts'

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

new Vue({
    router,
    template: '<App/>',
    render: h => h(App),
}).$mount('#app');
