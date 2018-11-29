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
            <ul>
                <li>项目</li>
                <li>年初数</li>
                <li>期末数</li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>一、收入</li>
                <li></li>
                <li></li>
            </ul>
            <ul v-for="(item,index) of inMoney" class="formDataList formDataItems flexPublic">
                <li>{{item.code}}</li>
                <li>{{item.name}}</li>
                <li></li>
                <li></li>
            </ul>
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
            <ul v-for="(item,index) of inMoney" class="formDataList formDataItems flexPublic">
                <li>{{item.code}}</li>
                <li>{{item.name}}</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li class="align-center ">本期合计支出</li>
                <li></li>
                <li></li>
            </ul>



        </div>
    </div>
</template>

<script>
    export default {
        name: "user",
        data(){
            return{
                inMoney:[
                    {code:401,name:'会费收入'},
                    {code:402,name:'拨浇经费收入'},
                    {code:40301,name:'上级补助收入'},
                    {code:40401,name:'回拨补助'}
                ],
                outMoney:[
                    {code:501,name:'职工活动支出'},
                    {code:502,name:'职工教育费'},
                    {code:60301,name:'文体活动费'},
                    {code:60401,name:'回拨补助'}
                ],
                userState:0,
                userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}],
                dataInfo:[
                    {PhId:1,PDate:'2018-01-01',Abstract:'test1', PNo:'0001',JSum:'1111',DSum:'1111',JD:'1',money:'2222'},
                    {PhId:1,PDate:'2018-02-01',Abstract:'test2', PNo:'0001',JSum:'333',DSum:'',JD:'2',money:'3333'},
                    {PhId:1,PDate:'2018-03-01',Abstract:'test3', PNo:'0001',JSum:'',DSum:'333',JD:'0',money:'4444'}
                ]
            }
        },
        mounted(){

        },
        methods:{
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
        border-right:1px solid #2780d1;
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
