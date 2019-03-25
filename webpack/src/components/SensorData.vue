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
    export default {
        data() {
            return {
                deviceId: null,
                sensorId: null,

                chart: null,
                data: [],

                now: +new Date(1997, 9, 3),
                oneDay: 24 * 3600 * 1000,
                value: Math.random() * 1000
            }
        },
        created() {
            this.deviceId = this.$route.params.deviceId;
            this.sensorId = this.$route.params.sensorId;
        },
        mounted() {
            for (let i = 0; i < 1000; i++) {
                this.data.push(this.randomData());
            }
            this.getData();
            this.drawChart();
            setInterval(() => {
                for (let i = 0; i < 5; i++) {
                    this.data.shift();
                    this.data.push(this.randomData());
                }

                this.chart.setOption({
                    series: [{
                        data: this.data
                    }]
                });
            }, 2000);
        },
        methods: {
            randomData() {
                this.now = new Date(+this.now + this.oneDay);
                this.value = this.value + Math.random() * 21 - 10;
                return {
                    name: this.now.toString(),
                    value: [
                        [this.now.getFullYear(), this.now.getMonth() + 1, this.now.getDate()].join('/'),
                        Math.round(this.value)
                    ]
                }
            },
            getData() {
                for (let i = 0; i < 5; i++) {
                    this.data.shift();
                    this.data.push(this.randomData());
                }
            },
            drawChart() {
                console.log(this.$echarts);
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
                        name: '模拟数据',
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
</script>

<style scoped>
    .chart {
        width: 100%;
        height: 400px;
    }
</style>