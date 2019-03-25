<template>
    <el-row>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: 'device'}">设备实例</el-breadcrumb-item>
            <el-breadcrumb-item>传感器</el-breadcrumb-item>
        </el-breadcrumb>
        <h3><label>设备 {{ this.deviceId }}</label>: 传感器列表</h3>
        <el-table
                :data="sensors"
                stripe
                style="width: 100%">
            <el-table-column
                    fixed
                    prop="id" label="ID">
            </el-table-column>
            <el-table-column
                    prop="device_id" label="设备ID">
            </el-table-column>
            <el-table-column
                    prop="name" label="名称">
            </el-table-column>
            <el-table-column
                    prop="port" label="端口">
            </el-table-column>
            <el-table-column
                    prop="type" label="类型">
            </el-table-column>
            <el-table-column
                    prop="state" label="状态">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="showSensorData(scope.row)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</template>
<script>
    import {get, post} from '../tools/http'
    export default {
        data() {
            return {
                deviceId: null,
                sensors: []
            }
        },
        created() {
            this.deviceId = this.$route.params.deviceId;
            if (!this.deviceId) {
                this.$router.push({name: 'device'});
                return;
            }
            this.getSensors();
        },
        methods: {
            getSensors() {
                get(`api/device/${this.deviceId}/sensor`)
                    .then(res => {
                        if (!res.success) {
                            this.$message.error(res.message);
                        } else {
                            this.sensors = res.data;
                        }
                    });
            },
            showSensorData(row) {
                console.log(row);
                this.$router.push({name: 'sensorData', params: {deviceId: this.deviceId, sensorId: row.id}});
            }
        }
    }
</script>