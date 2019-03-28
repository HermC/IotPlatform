<template>
    <el-row>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item :to="{name: 'device'}">设备实例</el-breadcrumb-item>
            <el-breadcrumb-item :to="{name: 'sensor', params: {deviceId: this.deviceId}}">传感器</el-breadcrumb-item>
            <el-breadcrumb-item>数据</el-breadcrumb-item>
        </el-breadcrumb>
        <h3><label>传感器 {{ this.sensorId }}</label> 数据</h3>
        <el-card shadow="hover">
            <div slot="header">
                <span>实时数据</span>
            </div>
            <div id="chart" class="chart">

            </div>
        </el-card>
        <br>
        <el-card shadow="hover">
            <div slot="header">
                <span>历史数据</span>
                <el-date-picker v-model="timeRange"
                                type="datetimerange"
                                :picker-options="pickerOptions2"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right"
                                style="margin-left: 50px"
                                @change="selectTimeRange">

                </el-date-picker>
            </div>
            <div id="history-chart" class="chart">

            </div>
        </el-card>
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

                historyChart: null,
                historyData: [],

                getDataInterval: null,

                timeRange: null,

                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
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
            let now = new Date();

            this.start = new Date(now - 1800 * 1000);
            this.end = new Date(now);

            this.drawChart();
            this.getData(this.start.format(), this.end.format(), this.data, this.changeChartData);

            this.timeRange = [new Date(new Date('2019-03-27 01:00:00') - 1800 * 1000), new Date('2019-03-27 01:00:00')];
            this.drawHistoryData();
            this.getData(this.timeRange[0].format(), this.timeRange[1].format(), this.historyData, this.changeHistoryChartData);
            this.getDataInterval = setInterval(() => {
                this.start = this.end;
                this.end = new Date(+this.end + 5 * 1000);
                this.getData(this.start.format(), this.end.format(), this.data, this.changeChartData);
            }, 5000);
        },
        beforeDestroy() {
            clearInterval(this.getDataInterval);
        },
        methods: {
            getData(start, end, data, cb) {
                if (this.sensorId) {
                    post(`api/device/sensor/${this.sensorId}/data`, {start: start, end: end})
                        .then(res => {
                            if (!res.success) {
                                this.$message.success(res.message);
                            } else {
                                // console.log(res.data);
                                for (let i = 0; i < res.data.length; i++) {
                                    let item = res.data[i];
                                    if (data.length > 1000) {
                                        data.shift();
                                    }
                                    data.push([item.record_time, item.value]);
                                }
                                cb(data);
                            }
                        });
                }
            },
            // getData2(start, end, cb) {
            //     if (this.sensorId) {
            //         post(`api/device/sensor/${this.sensorId}/data`, {start: start, end: end})
            //             .then(res => {
            //                 if (!res.success) {
            //                     this.$message.success(res.message);
            //                 } else {
            //                     console.log(res.data);
            //                     this.data = res.data;
            //                     cb(this.data);
            //                 }
            //             });
            //     }
            // },
            drawChart() {
                this.chart = this.$echarts.init(document.getElementById('chart'));
                const chartOptions = {
                    title: {
                        text: '传感器实时数据',
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
                        data: this.data,
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 6
                            }]
                        }
                    }]
                };
                this.chart.setOption(chartOptions);
            },
            changeChartData(data) {
                this.chart.setOption({
                    series: [{
                        data: data
                    }]
                });
            },
            drawHistoryData() {
                this.historyChart = this.$echarts.init(document.getElementById('history-chart'));
                const historyChartOptions = {
                    title: {
                        text: '传感器历史数据',
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
                        data: this.data,
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 6
                            }]
                        }
                    }]
                };
                this.historyChart.setOption(historyChartOptions);
            },
            changeHistoryChartData(data) {
                this.historyChart.setOption({
                    series: [{
                        data: data
                    }]
                });
            },
            selectTimeRange() {
                this.getData(this.timeRange[0].format(), this.timeRange[1].format(), this.changeHistoryChartData);
            }
        }
    }

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
</script>

<style scoped>
    .chart {
        width: 100%;
        height: 400px;
    }
</style>