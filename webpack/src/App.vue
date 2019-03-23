<template>
    <div id="app">
        <el-container>
            <el-header class="header">
                <h4>IoT Platform</h4>
            </el-header>
            <el-container>
                <el-aside width="250px">
                    <el-menu
                            default-active="1"
                            :router="true"
                            style="min-height: 80vh">
                        <label class="nav-header">导航栏</label>
                        <el-menu-item index="1" route="device">
                            <i class="el-icon-setting"></i>
                            <span slot="title">设备</span>
                        </el-menu-item>
                        <el-menu-item index="2" route="sensor">
                            <i class="el-icon-view"></i>
                            <span slot="title">传感器</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {

    }
</script>

<style>
    body{
        margin:0;
        padding:0;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*text-align: center;*/
        color: #2c3e50;
    }
    .header {
        width: 100%;
        height: 60px;
        padding: 15px 30px;
        box-sizing: border-box;
        box-shadow: 0 0 2px 2px #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px #ddd solid;
    }
    .nav-header {
        display: block;
        padding: 0 20px;
        margin-top: 20px;
        color: gray;
        font-size: 13px;
    }
</style>
