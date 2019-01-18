<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px">
                        <div style="width:100%;float: right">
                            <ul  class="flexUl handle" style="float: left;line-height: 30px">
                                <el-checkbox>只显示一级科目</el-checkbox>
                                <el-checkbox>剔除本期发生为零</el-checkbox>
                                <el-checkbox>剔除期末余额为零</el-checkbox>
                            </ul>
                            <ul class="flexUl handle">
                                <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel">导出</li ></a>
                                <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                                <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                            </ul>
                            <ul  class="flexUl handle" style="line-height: 30px">
                                <li class="searcherValue"><input type="text" placeholder="凭证字号/摘要" v-model="inputKvalue"></li>
                                <li  class="searcherBtn" @click="selectBtn">搜索</li>
                                <li   class="searcherBtn" @click="showType='block'" style="margin-left: 10px">高级</li>
                                <div class="searchPanel" :style="{'display':showType}">
                                    <div class="flexPublic searchPanel_title">
                                        <div>高级查询</div>
                                        <div class="el-icon-close" @click="showType='none'"></div>
                                    </div>
                                    <div class="flexPublic">
                                        <div>凭证日期:</div>
                                        <div>
                                            <el-date-picker
                                                v-model="zwTime"
                                                type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                value-format="yyyy-MM-dd"
                                                style="width: 250px;border:none;padding-right: 0;"
                                                popper-class="popper"
                                            >
                                            </el-date-picker>
                                        </div>
                                    </div>
                                    <div class="flexPublic">
                                        <div>凭证号码</div>
                                        <div class="flexPublic">
                                            <input v-model="StartPNo"/>至<input v-model="EndPno"/>
                                        </div>

                                    </div>
                                    <div class="flexPublic">
                                        <div>发生金额</div>
                                        <div class="flexPublic">
                                            <input v-model="startMoney"/>至<input v-model="endMoney"/>
                                        </div>
                                    </div>
                                    <div class="flexPublic searchPanel_bottom">
                                        <div class="searchPanel_btn greybtn" @click="clearPorp">重置</div>
                                        <div class="searchPanel_btn bluebtn" @click="searchDetail">搜索</div>
                                    </div>
                                </div>


                            </ul>

                        </div>

                    </div>

                    <div>
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="8%"/>
                                    <col width="12%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <td rowspan="2">科目编码</td>
                                        <td rowspan="2">科目名称</td>
                                        <td colspan="2">期初余额</td>
                                        <td colspan="2">本期发生</td>
                                        <td colspan="2">本年累计</td>
                                        <td colspan="2">期末余额</td>
                                    </tr>
                                    <tr>
                                        <td>借方</td>
                                        <td>贷方</td>
                                        <td>借方</td>
                                        <td>贷方</td>
                                        <td>借方</td>
                                        <td>贷方</td>
                                        <td>借方</td>
                                        <td>贷方</td>
                                    </tr>
                                </thead>

                            </table>
                        </div>
                        <div class="tbBody" >
                            <table>
                                <colgroup>
                                    <col width="8%"/>
                                    <col width="12%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                </colgroup>
                                <tbody>

                                <tr v-for="item in dataList">
                                    <td>{{item.subject_code}}</td>
                                    <td>{{item.k_name}}</td>
                                    <td>{{item.ye_j_sum}}</td>
                                    <td>{{item.ye_d_sum}}</td>
                                    <td>{{item.yh_j_sum}}</td>
                                    <td>{{item.yh_d_sum}}</td>
                                    <td>{{item.yl_j_sum}}</td>
                                    <td>{{item.yl_d_sum}}</td>
                                    <td>{{item.ys_j_sum}}</td>
                                    <td>{{item.ys_d_sum}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose"
                                     :showtype="'doubleTime'"
                    ></time-select-bar>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import httpConfig from '@/util/ajaxConfig';
    import { mapState, mapGetters } from "vuex";
    import Countdownpop from "../../../components/countDownPop/index";  //自定义ajax头部配置*****
    import qs from 'qs'

    export default {
        name: "balance",
        data (){
            return{
                date1:'',
                dataList:'',
                showType:'none',
                zwTime:'',
                StartPNo:'',
                EndPno:'',
                startMoney:'',
                endMoney:'',
                inputKvalue:''

            }
        },
        components: {Countdownpop, TimeSelectBar},
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgcode:state => state.user.orgcode
            }),
        },
        mounted(){
            this.getData();
        },
        methods:{
            selectBtn:function(){

            },
            //数据查询
            getData:function(){
                let data={
                    "Year":  2019,
                    "OrgIds": this.orgid,
                    "StartTime":"",
                    "EndTime":"",
                    "StartPNo":"",
                    "EndPno":"",
                    "value":""

                };
                this.$axios.get(
                    'PVoucherMst/GetSubjectBalanceReport',
                    {params:data}
                ).then(res=>{
                    this.dataList=qs.parse(res).Record;
                    console.log(qs.parse(res));
                }).catch(err=>{
                    console.log(err);
                })
            },
            //清除高级查询数据
            clearPorp:function(){
                this.zwTime='';
                this.startCode='';
                this.endCode='';
                this.startMoney='';
                this.endMoney=''
            },
            searchDetail:function(){
                if(this.startCode>this.endCode){
                    this.saasMessage={
                        message:'开始凭证号不应大于结束凭证号码',
                        delay:3000,
                        visible:true
                    };
                    //this.$message.error('开始凭证号码不应大于结束凭证号码');
                }else if(this.startMoney>this.endMoney){
                    this.saasMessage={
                        message:'开始发生金额不应大于结束发生金额',
                        delay:3000,
                        visible:true
                    };
                    //this.$message.error('开始发生金额不应大于结束发生金额');
                }
                else{
                    this.showType='none';
                    this.getData(false);
                }

            },
            //时间选择器选择时间返回值
            dateChoose:function(val){
                this.date1=val;
                this.getData();
            },
            //刷新
            refresh:function(){
                this.getData();
            },
         /*
          *author:hyz
          *导出Excel表格
          *
          * */
            postBalanceSheetExcel:function() {
                let param = {'uid':this.userid,
                    'orgid':this.orgid,
                    'Year': this.date1.choosedYear};

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios.get('DealingsMst/GetDealingsExcel',{params:param}).then(res => {
                    window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            // 打印
            printContent(e){
                let dm = this.$refs.printFrom.parentNode.firstChild.cloneNode(true);
                dm.classList.add('first_child');
                let cop = this.$refs.printFrom.cloneNode(true);
                cop.insertBefore(dm,cop.firstChild);
                cop.classList.remove('formData_content');
                this.$print(cop) // 使用
            },
        }
    }
</script>

<style scoped>
    .flexUl{
        float: right;
    }
    .flexUl>a>li,.flexUl li{
        display: inline-block;
        float: left;
        vertical-align: top;
    }
    .tbHeader{
        width: 100%;
        text-align: center;
    }
    .tbBody{
        margin-top: -1px;
        position: absolute;
        bottom: 0;
        top: 102px;
        right: -17px;
        left: 0;
        overflow-y: scroll;
    }
    .tbBody table{
        width: 100%;
    }
    .tbHeader table{
        height: 100%;
        width: 100%;
    }
    thead td{
        border-width: 0px 0px 1px 1px;
        border-color:white;
        border-style: solid;
        text-align:center ;
        height: 30px;
        line-height: 30px;
        background: #d3e9f9;
        color: #000;
    }
    thead td:nth-of-type(1),thead td:last-of-type{
        border-right: 1px;
    }

    tbody td{
        height: 48px;
        line-height: 48px;
        background: transparent;
        color: #000;
        border-width: 1px 0px 0px 1px;
        border-color:#ebeef5;
        border-style: solid;
        padding:0 10px;
    }
    tbody tr td:last-child{
        border-right: 1px solid #ebeef5;
    }
    tbody tr:hover{
        background-color: #fafafa;
        transition: background-color .25s ease;
    }
    tbody tr:last-child td{
        border-bottom: 1px solid #ebeef5;
    }


    .searchPanel{
        position: absolute;
        top: 42px;
        right: 130px;
        z-index: 99;
        background-color: #fff;
        width: 339px;
        height: 230px;
        box-shadow: 0 0 6px 2px #c9ccce;
        border-radius: 10px 10px;
    }
    .searchPanel .flexPublic{
        padding: 5px 10px;
        height: 45px;
    }
    .searchPanel .searchPanel_title{
        height: 29px;
        background-color: #00b7ee;
        color: #fff;
        border-radius: 10px 10px 0 0 ;
    }
    .searchPanel .searchPanel_title div:nth-of-type(2){
        padding: 3px;
        border-radius: 15px;
        background: white;
        font-size: 15px;
        color: #00b7ee;
        cursor: pointer;
    }
    .searchPanel>.flexPublic:nth-of-type(3)>div:last-child,
    .searchPanel>.flexPublic:nth-of-type(4)>div:last-child{
        width: 250px;
        padding-left: 10px;
    }
    .searchPanel>.flexPublic:nth-of-type(3)>div:last-child input,
    .searchPanel>.flexPublic:nth-of-type(4)>div:last-child input{
        width: 116px;
        display: inline;
        font-size: 14px;
        color: #606266;
        border: none;
        padding-left: 5px;
    }
    .searchPanel input:focus{
        box-shadow:0 0 3px .1px #00B8EE;
    }
    .searchPanel .searchPanel_bottom{
        height: 65px;
        border-top: 1px solid #dddfe4;
        padding: 0 40px;
    }
    .searchPanel .searchPanel_btn{
        width: 135px;
        height: 33px;
        color: #fff;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;
    }

    .searchPanel .greybtn{
        border: 1px solid #ccc;
        color: #fff;
        background-color: #ccc;
        padding: 0px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .searchPanel .greybtn:hover{
        color: #ccc;
        background-color: #fff;
    }
    .searchPanel .bluebtn{
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 0px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .searchPanel .bluebtn:hover{
        color: #00B8EE;
        background: #fff;
    }

</style>
