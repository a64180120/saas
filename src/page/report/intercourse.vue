<template>
    <div class="timeSelect">
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
                            <template v-for="item in interCourse">
                                <ul class="formDataItems flexPublic">
                                <li>{{item.Asset_Name}}</li>
                                <li >{{item.Asset_Content}}</li>
                                <li>{{item.Asset_Amount}}</li>
                                <li>{{item.Liability_Name}}</li>
                                <li>{{item.Liability_Content}}</li>
                                <li>{{item.Liability_Amount}}</li>
                                </ul>
                            </template>
                            <!--<ul class="formDataItems flexPublic">-->
                                <!--<li>借出款</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>借出款</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->
                            <!--<ul class="formDataItems flexPublic">-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->
                            <!--<ul class="formDataItems flexPublic" >-->
                                <!--<li>应收上级经费</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>应收上级经费</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->
                            <!--<ul class="formDataItems flexPublic">-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->
                            <!--<ul class="formDataItems flexPublic">-->
                                <!--<li>应收下级经费</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>应收下级经费</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->
                            <!--<ul class="formDataItems flexPublic" >-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->
                            <!--<ul class="formDataItems flexPublic" >-->
                                <!--<li>其他应收款</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>其他应收款</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->
                            <!--<ul class="formDataItems flexPublic" >-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                                <!--<li>(按明细项目列)</li>-->
                                <!--<li ></li>-->
                                <!--<li></li>-->
                            <!--</ul>-->

                        </div>
                </div>
            </div>
            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose" :showtype="'singleTime'"></time-select-bar>
            </div>
        </div>
    </div>
</template>

<script>
    import TimeSelectBar from "../../components/TimeSelectBar/index";
    import { mapState, mapGetters } from "vuex";
    export default {
        name: "user",
        data(){
            return{
                date1:[],//存储时间选择器的时间
                loading:false,//页面刷新的等待幕布
                interCourse:[],
            }
        },
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds
            }),
        },
        mounted(){
            this.getData();
        },
        components: { TimeSelectBar },
        methods:{
            dateChoose:function(val){
                this.date1=val;
                // this.getData(time,this.proofType);
            },
            getData:function(){
                let year='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    this.date1.choosedYear=currentyear;
                    year=currentyear;
                }else{
                    year=this.date1.choosedYear
                }
                let data={
                    "orgid":this.orgid,
                    "Year":  year
                }
                this.loading=true;
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'DealingsMst/GetBaseModel',
                    {params:data}
                ).then(res=>{
                    this.loading=false;
                    console.log(res);
                    this.interCourse=res.Record;
                }).catch(err=>{
                    this.loading=false;
                  this.$message(err);
                })
            },
        }
    }
</script>

<style scoped>

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
        width:20%;
    }
    .formData>ul>li:nth-of-type(3){
        width:10%;
    }
    .formData>ul>li:nth-of-type(4){
        width:20%;
    }
    .formData>ul>li:nth-of-type(5){
        width:20%;
    }
    .formData>ul>li:nth-of-type(6){
        width:10%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #d3e9f9;
    }

    .formData>ul>li:first-child{
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
    .manageContent:before{
        content:"";
        display: inline-block;
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
