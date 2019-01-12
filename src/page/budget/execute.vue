<template>
    <div class="manageContent">
        <div class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic">
                    <div>年度:</div>
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
                <li>科目编码</li>
                <li>科目名称</li>
                <li>上报预算数(元)</li>
                <li>实际支出数(元)</li>
                <li>执行率(%)</li>
                <li>说明</li>
            </ul>
            <ul v-for="(item,index) of income" :key="index"  class="formDataItems flexPublic">
                <li>{{item.KCode}}</li>
                <li >{{item.KName}}</li>
                <li>{{item.heding}}</li>
                <li>{{item.shiji}}</li>
                <li >
                    <div class="progressContainer" >
                        <div class="progress" :style="{background:infoStyle[index],width:item.zhixing+'%'}">{{item.zhixing < 80 ?'':item.zhixing+' %'}}</div>
                        <div  :style="{color:infoStyle[index],width:(100-item.zhixing)<20?20:100-item.zhixing+'%',display:(100-item.zhixing)<20?'none':'block'}">{{item.zhixing}} %</div>
                    </div>
                </li>
                <li>{{item.info}}</li>
            </ul>
            <ul class="formDataItems flexPublic count">
                <li>本年合计收入</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul v-for="(item,index) of pay" :key="index"  class="formDataItems flexPublic">
                <li>{{item.KCode}}</li>
                <li >{{item.KName}}</li>
                <li>{{item.heding}}</li>
                <li>{{item.shiji}}</li>
                <li >
                    <div class="progressContainer" >
                        <div class="progress" :style="{background:infoStyle[index],width:item.zhixing+'%'}">{{item.zhixing < 80 ?'':item.zhixing+' %'}}</div>
                        <div  :style="{color:infoStyle[index],width:(100-item.zhixing)<20?20:100-item.zhixing+'%',display:(100-item.zhixing)<20?'none':'block'}">{{item.zhixing}} %</div>
                    </div>
                </li>
                <li>{{item.info}}</li>
            </ul>
            <ul class="formDataItems flexPublic count">
                <li>本年支出合计</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>本年结余</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li>加:本年结余</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li>加:本年收回投资</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li>减:本年投资</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li>减:本年提取后备金</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>期末滚存结余</li>
                <li></li>
                <li></li>
                <li></li>
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
                income:[
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'},
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'},
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'},
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'}
                ],
                pay:[
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'},
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'},
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'},
                    {KCode:101,KName:'会费收入',heding:'100',shiji:200,zhixing:20,info:'666'}
                ],
                userState:0,
                userStateValues:[{id:0,uname:'2018年'},{id:1,uname:'2017年'},{id:2,uname:'2016年'},{id:3,uname:'2015年'}],
                dataInfo:[
                    {PhId:1,PDate:'2018-01-01',Abstract:'test1', PNo:'0001',JSum:'1111',DSum:'1111',JD:'1',money:'2222'},
                    {PhId:1,PDate:'2018-02-01',Abstract:'test2', PNo:'0001',JSum:'333',DSum:'',JD:'2',money:'3333'},
                    {PhId:1,PDate:'2018-03-01',Abstract:'test3', PNo:'0001',JSum:'',DSum:'333',JD:'0',money:'4444'}
                ],
                infoStyle:[]
            }
        },
        mounted(){

        },
        methods:{
            getInfoStyle(){
                var infos=this.dataInfo;
                var val=[];
                for(var i in infos){
                    infos[i].zhixing=parseInt(infos[i].zhixing);
                    val[i]=infos[i].zhixing;
                    if(val[i]<30){
                        val[i]=`#ff0000`;
                    }else if(val[i]>=30&&val[i]<50){
                        val[i]=`#ff9900`;
                    }else if(val[i]>=50&&val[i]<80){
                        val[i]=`#2473eb`;
                    }else{
                        val[i]=`#83c350`;
                    }
                }
                this.infoStyle=val;
            },
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
        width:24%;
    }
    .formData>ul>li:nth-of-type(3){
        width:14%;
    }
    .formData>ul>li:nth-of-type(4){
        width:14%;
    }
    .formData>ul>li:nth-of-type(5){
        width:22%;
    }
    .formData>ul>li:nth-of-type(6){
        width:20%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #2780d1;
    }

    .formData>ul>li:first-child{
        width:10%;
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
    .formData>ul.formDataItems.count>li:first-child{
        width:34%;
    }
    .formData>ul.formDataItems.count>li:nth-of-type(2){
        width:14%;
    }
    .formData>ul.formDataItems.count>li:nth-of-type(3){
        width:14%;
    }
    .formData>ul.formDataItems.count>li:nth-of-type(4){
        width:22%;
    }
    .formData>ul.formDataItems.count>li:nth-of-type(5){
        width:20%;
    }
    .manageContent:before{
        content:"";
        display: inline-block;
    }

    .progressContainer{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        height:27px;
        width:100%;
        border:1px solid #ddd;
        border-radius: 15px;
        background: #ebeef5;
        margin:5px;
    }
    .progressContainer>div{
        text-align: left;
        padding-left:3px;
    }
    .progressContainer>div.progress{
        border-radius: 15px;
        height:100%;
        text-align: right;
        line-height: 27px;
    }
</style>
