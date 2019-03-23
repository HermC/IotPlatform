<template>
    <el-row>
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
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</template>
<script>
    // import {get, post} from '../tools/http'
    export default {
        data() {
            return {
                devices: [{
                    id: '1',
                    name: '设备1',
                    os: 'os',
                    version: '1.1.0',
                    ip: '127.0.0.1',
                    state: 'active'
                }, {
                    id: '2',
                    name: '设备2',
                    os: 'os',
                    version: '1.1.1',
                    ip: '127.0.0.1',
                    state: 'active'
                }, {
                    id: '3',
                    name: '设备3',
                    os: 'os',
                    version: '1.1.1',
                    ip: '127.0.0.1',
                    state: 'active'
                }]
            }
        },
        methods: {
            handleClick(row) {
                console.log(row);
            }
        },
    }
</script>
<style scoped>

</style>