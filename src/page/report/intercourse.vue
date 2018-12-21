<template>
    <div class="container">
        <div class="manageContent" v-loading="loading">
            <div class="reportBox">
                <div class="unionState flexPublic">
                    <ul class="flexPublic">

                    </ul>
                    <ul class="flexPublic handle">
                        <a href=""><li>打印</li></a>
                        <a href=""><li>导出</li></a>
                    </ul>
                </div>
                    <div class="formData">
                        <ul>
                            <li>资产类科目</li>
                            <li>具体内容</li>
                            <li>金额(元)</li>
                            <li>负债类科目</li>
                            <li>具体内容</li>
                            <li>余额(元)</li>
                        </ul>
                        <ul class="formDataItems flexPublic">
                            <li>借出款</li>
                            <li ></li>
                            <li></li>
                            <li>借出款</li>
                            <li ></li>
                            <li></li>
                        </ul>
                        <ul class="formDataItems flexPublic">
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                        </ul>
                        <ul class="formDataItems flexPublic" >
                            <li>应收上级经费</li>
                            <li ></li>
                            <li></li>
                            <li>应收上级经费</li>
                            <li ></li>
                            <li></li>
                        </ul>
                        <ul class="formDataItems flexPublic">
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                        </ul>
                        <ul class="formDataItems flexPublic">
                            <li>应收下级经费</li>
                            <li ></li>
                            <li></li>
                            <li>应收下级经费</li>
                            <li ></li>
                            <li></li>
                        </ul>
                        <ul class="formDataItems flexPublic" >
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                        </ul>
                        <ul class="formDataItems flexPublic" >
                            <li>其他应收款</li>
                            <li ></li>
                            <li></li>
                            <li>其他应收款</li>
                            <li ></li>
                            <li></li>
                        </ul>
                        <ul class="formDataItems flexPublic" >
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                            <li>(按明细项目列)</li>
                            <li ></li>
                            <li></li>
                        </ul>

                    </div>
            </div>
        </div>
        <div class="timeSelectBox">
            <time-select-bar @item-click="dateChoose" :showtype="'singleTime'"></time-select-bar>
        </div>
    </div>
</template>

<script>
    import TimeSelectBar from "../../components/TimeSelectBar/index";
    export default {
        name: "user",
        data(){
            return{
                date1:[],
                loading:false
            }
        },
        mounted(){

        },
        components: { TimeSelectBar },
        methods:{
            dateChoose:function(val){
                this.date1=val;
                // this.getData(time,this.proofType);
            },
        }
    }
</script>

<style scoped>
    .reportBox{
        margin-right: 60px;
    }
    .timeSelectBox{
        position: fixed;
        right: 0;
        top: 110px;
        bottom:0;
        width: 60px;
        z-index: 2;
    }
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
        width:24%;
    }
    .formData>ul>li:nth-of-type(4){
        width:18%;
    }
    .formData>ul>li:nth-of-type(5){
        width:18%;
    }
    .formData>ul>li:nth-of-type(6){
        width:10%;
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
        background-color: white;
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
    .formData>ul:nth-of-type(2n)>li{
        text-align: left;
        padding-left:5px;
    }

</style>
