<template>
    <div class="sys-page" style="background-color: #ffffff">
        <div class="container">
            <aside class="asideNav">
                <ul>
                    <li @click="unionTab('basic')" :class="{asideActive:asideActive=='basic'}">基层工会组织</li>
                    <li @click="unionTab('union')" :class="{asideActive:asideActive=='union'}">机关工会组织</li>
                    <li @click="unionTab('look')" :class="{asideActive:asideActive=='look'}"><i v-if="showVerify" @time-click="ajaxMode">{{dVerifyNum}}</i>待审核基层组织</li>
                </ul>
            </aside>
            <look v-if="asideActive=='look'"></look>
            <basic v-if="asideActive=='basic'"></basic>
            <union v-if="asideActive=='union'"></union>
        </div>
    </div>
</template>

<script>
    import union from './union'
    import basic from './basicUnion'
    import look from './lookUnion'
    import {mapState, mapActions} from 'vuex'
    export default {
        name: "manage",
        data() {
            return {
                asideActive: 'basic',
                dVerifyNum : "",
                showVerify : true,
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                value1: '',
                value2: '',
            }
        },
        methods: {
            showdata(item) {
                console.log(item)
            },
            unionTab(name) {
                this.asideActive = name;
                sessionStorage.setItem("asideActive", name);//**防止刷新数据清空************* */
                this.ajaxMode('');
            },
            ajaxMode(val) {
                console.log('222222wwwww');
                let data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: 300,
                    pageindex: 0,
                    value: "0"
                };
                this.$axios.get('/SysOrganize/GetOrganizesByAuditStatus', {params: data})
                    .then(res => {
                        console.log(res);
                        this.dVerifyNum = res.totalRows;
                        console.log(this.dVerifyNum);
                        if(res.totalRows == 0){
                            this.showVerify = false;
                        }else{
                            this.showVerify = true;
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        mounted() {
            if (sessionStorage.getItem("asideActive")) {
                this.asideActive = sessionStorage.getItem("asideActive");
            }
            this.ajaxMode();
        },
        components: {
            union,
            basic,
            look
        }
    }
</script>

<style scoped>

    .manage {
        min-width: 1024px;
        height: 100%;
    }

    .container {
        padding: 3px;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-flow: row nowrap;
        justify-content: start;
        /*background: #fff;*/
        /*border: 1px solid #eaeaea;*/
        /*border-radius: 0px;*/
        /*box-shadow: 0px 3px 10px #e4e4e4;*/
    }

    .asideNav > ul {
        width: 25px;
        font-size: 13px;
    }

    .asideNav > ul > li {
        padding: 20px 4px;
        position: relative;
        cursor: pointer;
    }

    .asideNav > ul > li > i {
        font-style: normal;
        position: absolute;
        top: 0px;
        right: -10px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: red;
        color: #fff;
        border-radius: 50%;
    }

    .asideNav > ul > li.asideActive {
        background: #00B8EE;
        text-align: center;
        color: #fff;
    }


</style>
