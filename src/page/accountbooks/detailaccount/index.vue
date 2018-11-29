<template>
    <div class="manage">
        <section class="container">
            <aside class="asideNav">
                <ul>
                    <li @click="unionTab('details')" :class="{asideActive:asideActive=='details'}">明细表</li>
                    <li @click="unionTab('auxiliary')" :class="{asideActive:asideActive=='auxiliary'}">辅助项科目明细表</li>
                    <li @click="unionTab('subject')" :class="{asideActive:asideActive=='subject'}">科目辅助项明细表</li>
                </ul>
            </aside>
            <detls v-if="asideActive=='details'"></detls>
            <subject v-if="asideActive=='subject'"></subject>
            <auxiliary v-if="asideActive=='auxiliary'"></auxiliary>
        </section>
    </div>
</template>

<script>
    import detls from './details'
    import subject from './subject'
    import auxiliary from './auxiliary'
    export default {
        name: "manage",
        data(){
            return {
                asideActive:'details',
            }
        },
        methods:{
            showdata(item){
                console.log(item)
            },
            unionTab(name){
                this.asideActive=name;
                sessionStorage.setItem("asideActive",name);//**防止刷新数据清空************* */
            }
        },
        mounted(){
            if(sessionStorage.getItem("asideActive")){
                this.asideActive=sessionStorage.getItem("asideActive");
            }

        },
        components:{
            detls,
            subject,
            auxiliary
        }
    }
</script>

<style scoped>

    .manage{
        min-width: 1024px;
        height:100%;
    }
    .container{
        padding:3px;
        width:100%;
        height:100%;
        overflow: hidden;
        display: flex;
        flex-flow:row nowrap;
        justify-content: start;
    }
    .asideNav>ul{
        width:25px;
        font-size:13px;
    }
    .asideNav>ul>li{
        padding:20px 4px;
        position:relative;
        cursor: pointer;
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
        background:#ff9900;
        color:#fff;
    }


</style>
