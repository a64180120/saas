<template>
    <div class="timeSelect">
        <section class="container">
            <aside class="asideNav">
                <ul>
                    <li @click="unionTab('unread')" :class="{asideActive:asideActive=='unread'}">未读留言<span v-if="unreadCount>0">{{unreadCount>99?99:unreadCount}}</span></li>
                    <li @click="unionTab('read')" :class="{asideActive:asideActive=='read'}">已读留言</li>
                </ul>
            </aside>
            <unread @asd="ssss" v-if="asideActive=='unread'"></unread>
            <read  v-if="asideActive=='read'"></read>
        </section>
    </div>
</template>

<script>
    import read from "./read"
    import unread from "./unread"
    export default {
        name: "index",
        data(){
            return {
                asideActive:'unread',//侧边选择器
                unreadCount:0,//未读消息数
            }
        },
        mounted(){
            if(sessionStorage.getItem("asideActive")){
                this.asideActive=sessionStorage.getItem("asideActive");
            }
        },
        components:{
            read,
            unread
        },
        methods:{
            unionTab(name){
                this.asideActive=name;
                sessionStorage.setItem("asideActive",name);//**防止刷新数据清空************* */
            },
            ssss(val){
                this.unreadCount=val;
            }
        },

    }
</script>

<style scoped>
    .asideNav{
        position: fixed;
        z-index: 99;
        top: 160px;
        bottom: 90px;
        border-right: 1px solid #ddf7ff;
    }
    .asideNav>ul{
        width:25px;
        font-size:13px;
    }
    .asideNav>ul>li{
        padding:20px 4px;
        position:relative;
        cursor: pointer;
        color: #000;
        height: 150px;
        background:#ddf7ff;
    }
    .asideNav>ul>li>i{
        font-style: normal;
        position: absolute;
        top:0px;
        right:-10px;
        width:20px;
        height:20px;
        line-height:20px;
        text-align: center;
        background: red;
        color:#fff;
        border-radius: 50%;
    }
    .asideNav>ul>li.asideActive{
        background:#00b8ee;
        color:#fff;
    }
    .asideNav>ul>li>span{
        display: block;
        position: relative;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background-color: red;
        text-align: center;
        color: #fff;
        border-radius: 20px;
        top: -100px;
        right: -9px;
    }
    .timeSelect .container{
        padding-right: 20px;
    }
</style>
