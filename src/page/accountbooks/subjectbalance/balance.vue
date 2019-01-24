<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px">
                        <div style="width:100%;float: right">
                            <ul  class="flexUl handle" style="float: left;line-height: 30px">
                                <el-checkbox v-model="showFirst">只显示一级科目</el-checkbox>
                                <el-checkbox v-model="showBenqi">剔除本期发生为零</el-checkbox>
                                <el-checkbox v-model="showQimo">剔除期末余额为零</el-checkbox>
                                <!--<span style="margin-left: 15px;">科目区间：</span>
                                <el-select v-model="startCode" placeholder="请选择" @change="searchCodeStart"  style="width: 120px">
                                    <el-option
                                        v-for="item in subjectLists"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code"
                                        :style="{'text-indent':item.layer*15+'px'}"
                                    >
                                    </el-option>
                                </el-select>
                                <span>至</span>
                                <el-select v-model="endCode" placeholder="请选择" @change="searchCodeEnd" style="width: 120px">
                                    <el-option
                                        v-for="item in subjectLists"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code"
                                        :style="{'text-indent':item.layer*10+'px'}"
                                        :disabled="item.code<startCode"
                                    >
                                    </el-option>
                                </el-select>-->
                            </ul>
                            <ul class="flexUl handle">
                                <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel">导出</li ></a>
                                <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                                <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                            </ul>
                            <ul  class="flexUl handle" style="line-height: 30px">
                                <li class="searcherValue"><input type="text" placeholder="科目编码/名称" v-model="inputKvalue"></li>
                                <li  class="searcherBtn" @click="getData">搜索</li>
                                <li   class="searcherBtn" @click="showType='block'" style="margin-left: 10px">高级</li>
                                <div class="searchPanel" :style="{'display':showType}">
                                    <div class="flexPublic searchPanel_title">
                                        <div>高级查询</div>
                                        <div class="el-icon-close" @click="showType='none'"></div>
                                    </div>
                                    <div class="flexPublic">
                                        <div>账期</div>
                                        <div>
                                            <el-date-picker
                                                v-model="zwTime"
                                                type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                value-format="yyyy-MM-dd"
                                                style="width: 270px;border:none;padding-right: 0;"
                                                popper-class="popper"
                                            >
                                            </el-date-picker>
                                        </div>
                                    </div>
                                    <div class="flexPublic">
                                        <div>科目编码</div>
                                        <div class="flexPublic">
                                            <input v-model="StartPNo"/>至<input v-model="EndPno"/>
                                        </div>

                                    </div>
                                    <!--<div class="flexPublic">
                                        <div>金额</div>
                                        <div class="flexPublic">
                                            <input v-model="startMoney"/>至<input v-model="endMoney"/>
                                        </div>
                                    </div>-->
                                    <div class="flexPublic searchPanel_bottom">
                                        <div class="searchPanel_btn greybtn" @click="clearPorp">重置</div>
                                        <div class="searchPanel_btn bluebtn" @click="searchDetail">搜索</div>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>

                    <div >
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
                            <table  ref="printFrom">
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
                                <tr v-for="item in dataList" :style="{'display':
                                (showFirst&&item.Layers!=0||
                                showBenqi&&item.yh_j_sum==0&&item.yh_d_sum==0||
                                showQimo&&item.ys_j_sum==0&&item.ys_d_sum==0)?'none':''}">
                                    <td :style="{'text-indent':item.Layers==0?'':'20px','text-align':'left'}">{{item.subject_code}}</td>
                                    <td>{{item.k_name}}</td>
                                    <td class="right">
                                        <template v-if="item.ye_j_sum!=0">
                                            {{item.ye_j_sum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.ye_d_sum!=0">
                                            {{item.ye_d_sum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.yh_j_sum!=0">
                                            {{item.yh_j_sum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.yh_d_sum!=0">
                                            {{item.yh_d_sum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.yl_j_sum!=0">
                                            {{item.yl_j_sum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.yl_d_sum!=0">
                                            {{item.yl_d_sum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.ys_j_sum!=0">
                                            {{item.ys_j_sum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.ys_d_sum!=0">
                                            {{item.ys_d_sum | NumFormat}}
                                        </template>
                                    </td>
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
                date1:{
                    choosedMonth: '',
                    choosedMonthEnd: '',
                    choosedYear: '',
                    choosedYearEnd: '',
                },
                dataList:'',
                showType:'none',
                zwTime:'',
                StartPNo:'',
                EndPno:'',
                startMoney:'',
                endMoney:'',
                inputKvalue:'',
                showFirst:false,
                showBenqi:false,
                showQimo:false

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
            let currentYear = new Date();
            let currentyear=currentYear.getFullYear(currentYear);
            let currentMonth=currentYear.getMonth()+1;
            this.date1.choosedMonth=currentMonth;
            this.date1.choosedMonthEnd=currentMonth;
            this.date1.choosedYear=currentyear;
            this.date1.choosedYearEnd=currentyear;
            this.getData();
        },
        methods:{
            //数据查询
            getData:function(){
                const loading=this.$loading();
                let data={
                    "Year":  this.date1.choosedYear,
                    "OrgIds": this.orgid,
                    "StartTime":this.zwTime[0],
                    "EndTime":this.zwTime[1],
                    "StartPNo":this.StartPNo,
                    "EndPno":this.EndPno,
                    "value":this.inputKvalue
                };
                this.$axios.get(
                    'PVoucherMst/GetSubjectBalanceReport',
                    {params:data}
                ).then(res=>{
                    this.dataList=qs.parse(res).Record;
                    loading.close();
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //清除高级查询数据
            clearPorp:function(){
                this.zwTime='';
                this.StartPNo='';
                this.EndPno='';
                this.startMoney='';
                this.endMoney=''
            },
            searchDetail:function(){
                if(this.StartPNo>this.EndPno){
                    this.saasMessage={
                        message:'开始科目编码不应大于结束科目编码',
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
                //获取打印表格的表头
                let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                let cop = this.$refs.printFrom.cloneNode(true);
                cop.insertBefore(dm,cop.childNodes[2]);
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
    thead td{
        height: 24px;
        line-height: 24px;
    }
    .searchPanel{
        position: absolute;
        top: 42px;
        right: 0px;
        z-index: 99;
        background-color: #fff;
        width: 360px;
        height: 180px;
        box-shadow: 0 0 6px 2px #c9ccce;
        border-radius: 10px 10px;
        overflow: hidden;
    }
    .searchPanel input{
        height: 100%;
        background-color: #fff;
    }

    .searchPanel .flexPublic{
        padding: 5px 10px;
        height: 45px;
        background-color: #eee;
    }
    .searchPanel .searchPanel_title{
        height: 29px;
        background-color: #00b7ee;
        color: #fff;
        border-radius: 10px 10px 0 0;
    }
    .searchPanel .searchPanel_title div:nth-of-type(2){
        padding: 3px;
        border-radius: 15px;
        background: white;
        font-size: 15px;
        color: #00b7ee;
        cursor: pointer;
    }
    .searchPanel>.flexPublic:nth-of-type(3)>div:last-child{
        width: 270px;
        padding: 5px 0;
    }
    .searchPanel>.flexPublic:nth-of-type(3)>div:last-child input{
        width: 116px;
        display: inline;
        font-size: 14px;
        color: #606266;
        border: none;
        padding-left: 5px;
    }
    .searchPanel .searchPanel_bottom{
        height: 65px;
        border-top: 1px solid #dddfe4;
        padding: 0 40px;
        background-color: #fff;
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
