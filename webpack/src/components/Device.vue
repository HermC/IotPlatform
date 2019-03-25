<template>
    <el-row>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: 'device'}">设备实例</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>设备列表</h3>
        <el-table
                :data="devices"
                stripe
                style="width: 100%">
            <el-table-column
                    fixed
                    prop="id" label="ID">
            </el-table-column>
            <el-table-column
                    prop="name" label="名称">
            </el-table-column>
            <el-table-column
                    prop="os" label="系统">
            </el-table-column>
            <el-table-column
                    prop="version" label="版本">
            </el-table-column>
            <el-table-column
                    prop="ip" label="地址">
            </el-table-column>
            <el-table-column
                    prop="state" label="状态">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="showDeviceInfo(scope.row)" type="text" size="small">查看</el-button>
                    <!--<el-button type="text" size="small">编辑</el-button>-->
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
                devices: []
            }
        },
        created: function() {
            this.getDevices();
        },
        methods: {
            showDeviceInfo(row) {
                this.$router.push({name: 'sensor', params: {deviceId: row.id}})
            },
            getDevices() {
                get('api/device/list')
                    .then(res => {
                        console.log(res);
                        if (!res.success) {
                            this.$message.error(res.message);
                        } else {
                            this.devices = res.data;
                        }
                    })
            }
        },
    }
</script>
<style scoped>

</style>