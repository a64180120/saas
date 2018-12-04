<template>
    <div class="manageContent">
        <div class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic">
                    <div>账期:</div>
                    <div class="selectContainer">
                        <select  v-model="userState">
                            <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.uname}}</option>
                        </select>
                    </div>
                    <div>至</div>
                    <div class="selectContainer">
                        <select  v-model="userState">
                            <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.uname}}</option>
                        </select>
                    </div>
                </li>
            </ul>
            <ul class="flexPublic handle">
                <a href=""><li>打印</li></a>
                <a href=""><li>导出</li></a>
            </ul>
        </div>
        <div class="formData">
            <ul class="formDataItems flexPublic">
                <li>一、收入</li>
                <li></li>
                <li></li>
            </ul>
            <!-- <ul v-for="item of inMoney" :key="item.code" class="formDataList formDataItems flexPublic">
                <li>{{item.code}}</li>
                <li>{{item.name}}</li>
                <li></li>
                <li></li>
            </ul> -->
            <tree-table 
                :data="inMoney" 
                :expand-all="expandAll" 
                :columns="columns" 
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                v-loading="loading"
                highlight-current-row
                border>
            </tree-table>
            <ul class="formDataItems flexPublic">
                <li class="align-center ">本期合计收入</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>二、支出</li>
                <li></li>
                <li></li>
            </ul>
            <!-- <ul v-for="(item) of inMoney" :key="item.code" class="formDataList formDataItems flexPublic">
                <li>{{item.code}}</li>
                <li>{{item.name}}</li>
                <li></li>
                <li></li>
            </ul> -->
            <tree-table 
                :data="outMoney" 
                :expand-all="expandAll" 
                :columns="columns" 
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                v-loading="loading"
                highlight-current-row
                border>
            </tree-table>
            <ul class="formDataItems flexPublic">
                <li class="align-center ">本期合计支出</li>
                <li></li>
                <li></li>
            </ul>



        </div>
    </div>
</template>

<script>
    /**
     * 收入支出表
     */
    import { IncomList,IncomListToExcel } from '@/api/voucher/reportInfo'
    import { mapState, mapActions } from 'vuex'
    import treeTable from "@/components/tree-table";

    export default {
        name: "expensesRe",
        data(){
            return{
                loading: false,
                expandAll: true,
                columns: [
                    {
                        text: "编码",
                        value: "KCode",
                        width: 200
                    },
                    {
                        text: "名称",
                        value: "KName"
                    },
                    {
                        text: "本月数",
                        value: "StartSum"
                    },
                    {
                        text: "本年累计数",
                        value: "EndSum"
                    }
                ],
                //收入
                inMoney:[],
                outMoney:[],
                userState:0,
                userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}]
            }
        },
        components: { treeTable },
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
        created(){

        },
        mounted(){

            this.getData();
        },
        methods:{
            getData(){
                //收入科目的数据
                var data = {
                    accountPeriod: '2018-11-03', //账期
                    isContainUncheck: '1',      //是否包含未审核的凭证(1=包含，0=不包含)
                };
                var vm=this;
                IncomList(vm,data).then(res => {
                    this.loading = false;
                    console.log(res);
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }

                    var data=res.Data;
                    this.inMoney=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="4"
                    })

                    this.outMoney=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="5"
                    })

                    //this.inMoney=res.Data;

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({ showClose: true,  message: '收入科目获取错误',  type: 'error' })
                })

            }
        }
    }
</script>

<style scoped>
    .unionState>ul>li{
        width:100%;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2){
        width:25%;
    }
    .formData>ul>li:nth-of-type(3){
        width:25%;
    }

    .formData>ul:first-child>li:last-of-type{
        /* border-right:1px solid #2780d1; */
    }

    .formData>ul>li:first-child{
        width:50%;
        min-width: 70px;
        padding:0 2px;
    }

    .formDataItems{
        border-bottom:1px solid #ddd;
    }
    .formData>ul.formDataItems>li{
        border-right:1px solid #ddd;
        border-left:0;
        border-bottom:0;
        text-align: center;
        line-height: 40px;
        height:40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .unionLists{
        width:20%;
        align-self: flex-start;
        margin-right: 10px;
        margin-top: 10px;
    }
    .manageContent:before{
        content:"";
        display: inline-block;
    }
    .unionLists~.formData{
        width:80%;
        align-self: flex-start;
    }
    .unionLists>p{
        text-align: center;
        background: #83c350;
        height:50px;
        line-height: 50px;
        color:#fff;
        font-size: 15px;
        margin-bottom: 5px;

    }
    .unionListsContent ul{
        padding-left: 15px;
        position: relative;
    }
    .unionListsContent ul:before{
        content:"";
        height:100%;
        width:1px;
        border-left:1px dotted #aaa;
        position: absolute;
        left:7.5px;
    }
    .unionListsContent ul>li{
        position: relative;
        cursor: pointer;
    }
    .unionListsContent ul>li:before{
        content:"";
        position: absolute;
        width:7.5px;
        left:-7.5px;
        top:9px;
        border-top: 1px dotted #aaa;
    }
    .unionListsContent ul>li:last-child:after{
        content:"";
        height:100%;
        width:7.5px;
        position: absolute;
        left:-7.5px;
        top:10px;
        background: #fff;
    }
    .formData>ul.formDataItems>li:first-of-type{
        text-align: left;
    }
    .manageContent>.formData>ul.formDataItems>li:first-of-type{
        width:50%;
        padding-left: 10px;
    }
    .manageContent>.formData>ul.formDataList>li{
        padding-left: 15px;
        width:25%;
    }
    .manageContent>.formData>ul.formDataList>li:first-of-type{
        width:25%;
    }
    .align-center{
        text-align: center!important;
    }

</style>
