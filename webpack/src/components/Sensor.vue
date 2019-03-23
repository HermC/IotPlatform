<template>
    <el-row>
        <h3>传感器列表</h3>
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
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</template>
<script>
    export default {
        data() {
            return {
                sensors: [{
                    id: '1',
                    device_id: '1',
                    name: '光敏电阻1',
                    port: 7000,
                    type: '光敏电阻',
                    state: 'active'
                }, {
                    id: '2',
                    device_id: '1',
                    name: '光敏电阻2',
                    port: 7001,
                    type: '光敏电阻',
                    state: 'active'
                }, {
                    id: '3',
                    device_id: '1',
                    name: '光敏电阻2',
                    port: 7002,
                    type: '光敏电阻',
                    state: 'active'
                }]
            }
        }
    }
</script>