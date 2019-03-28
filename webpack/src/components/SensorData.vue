<template>
    <el-row>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item :to="{name: 'device'}">设备实例</el-breadcrumb-item>
            <el-breadcrumb-item :to="{name: 'sensor', params: {deviceId: this.deviceId}}">传感器</el-breadcrumb-item>
            <el-breadcrumb-item>数据</el-breadcrumb-item>
        </el-breadcrumb>
        <h3><label>传感器 {{ this.sensorId }}</label> 数据</h3>
        <div id="chart" class="chart">

        </div>
    </el-row>
</template>

<script>
    import {get, post} from '../tools/http';
    export default {
        data() {
            return {
                deviceId: null,
                sensorId: null,

                start: null,
                end: null,

                chart: null,
                data: [],

                now: +new Date(1997, 9, 3),
                oneDay: 24 * 3600 * 1000,
                value: Math.random() * 1000,

                getDataInterval: null
            }
        },
        created() {
            this.deviceId = this.$route.params.deviceId;
            this.sensorId = this.$route.params.sensorId;

            // console.log(this.sensorId);
            if (!this.deviceId || !this.sensorId) {
                this.$router.push({name: 'device'});
            }
        },
        mounted() {
            this.start = new Date('2019-03-27 00:00:00');
            this.end = new Date('2019-03-27 01:00:00');

            this.drawChart();
            this.getData(this.start.format('yyyy-MM-dd hh:mm:ss'), this.end.format('yyyy-MM-dd hh:mm:ss'));

            this.getDataInterval = setInterval(() => {
                this.start = this.end;
                this.end = new Date(+this.end + 60 * 1000);
                this.getData(this.start.format('yyyy-MM-dd hh:mm:ss'), this.end.format('yyyy-MM-dd hh:mm:ss'));
            }, 2000);
        },
        beforeDestroy() {
            clearInterval(this.getDataInterval);
        },
        methods: {
            getData(start, end) {
                if (this.sensorId) {
                    post(`api/device/sensor/${this.sensorId}/data`, {start: start, end: end})
                        .then(res => {
                            if (!res.success) {
                                this.$message.success(res.message);
                            } else {
                                // console.log(res.data);
                                for (let i = 0; i < res.data.length; i++) {
                                    let item = res.data[i];
                                    if (this.data.length > 1000) {
                                        this.data.shift();
                                    }
                                    this.data.push([item.record_time, item.value]);
                                }
                                this.chart.setOption({
                                    series: [{
                                        data: this.data
                                    }]
                                })
                            }
                        });
                }
            },
            drawChart() {
                // console.log(this.$echarts);
                this.chart = this.$echarts.init(document.getElementById('chart'));
                const chartOptions = {
                    title: {
                        text: '传感器数据',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: '数据',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: this.data
                    }]
                };
                this.chart.setOption(chartOptions);
            }
        }
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
</script>

<style scoped>
    .chart {
        width: 100%;
        height: 400px;
    }
</style>