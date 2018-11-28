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
                <li></li>
                <li>资产</li>
                <li>年初数</li>
                <li>期末数</li>
                <li></li>
                <li>资产与净资产</li>
                <li>年初数</li>
                <li>期末数</li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li class="align-center">一、资产</li>
                <li></li>
                <li></li>
                <li></li>
                <li class="align-center">二、负债</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>101</li>
                <li>库存现金</li>
                <li></li>
                <li></li>
                <li>201</li>
                <li>应付工资(离退休费)</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>102</li>
                <li>银行存款</li>
                <li></li>
                <li></li>
                <li>202</li>
                <li>应付地方(部门)津贴补贴</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>111</li>
                <li>零余额账户用款额度</li>
                <li></li>
                <li></li>
                <li>203</li>
                <li>应付其他个人收入</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>112</li>
                <li>政府应返还额度</li>
                <li></li>
                <li></li>
                <li>211</li>
                <li>借入款</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>121</li>
                <li>借出款</li>
                <li></li>
                <li></li>
                <li>222</li>
                <li>应付上级经费</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>131</li>
                <li>应收上级经费</li>
                <li></li>
                <li></li>
                <li>222</li>
                <li>应付下级经费</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>132</li>
                <li>应收下级经费</li>
                <li></li>
                <li></li>
                <li>225</li>
                <li>其他应付款</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>135</li>
                <li>其他应收款</li>
                <li></li>
                <li></li>
                <li>231</li>
                <li>代管经费</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>141</li>
                <li>库存物品</li>
                <li></li>
                <li></li>
                <li></li>
                <li class="align-center">负债合计</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>151</li>
                <li>投资</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>161</li>
                <li>在建工程</li>
                <li></li>
                <li></li>
                <li></li>
                <li class="align-center">三、净资产类</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li>162</li>
                <li>固定资产</li>
                <li></li>
                <li></li>
                <li>301</li>
                <li>固定基金</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li>302</li>
                <li>再见工程占用资金</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li>311</li>
                <li>投资基金</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li>321</li>
                <li>专用基金</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li>322</li>
                <li>后备金</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li>331</li>
                <li>结余</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li class="align-center">净资产合计</li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li class="align-center">资产总计</li>
                <li></li>
                <li></li>
                <li></li>
                <li class="align-center">负债与净资产总计</li>
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
    .formData{
        margin-bottom: 50px;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:10%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2){
        width:20%;
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
    .formData>ul.formDataItems>li{
        text-align: left;
    }
    .formData>ul.formDataItems>li.align-center{
        text-align: center;
    }
</style>
