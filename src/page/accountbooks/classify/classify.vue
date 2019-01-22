<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px">
                        <!--<div style="width:100%;float: right">
                            <ul class="flexUl handle">
                                <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel">导出</li ></a>
                                <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                                <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                            </ul>
                        </div>-->
                        <div style="width:100%;float: right">
                            <ul  class="flexUl handle" style="float: left;line-height: 30px">
                                <!--<el-checkbox v-model="showFirst">只显示一级科目</el-checkbox>-->
                                <el-checkbox v-model="showBenqi" @change="dispart">剔除本期发生为零</el-checkbox>
                                <el-checkbox v-model="showQimo" @change="dispart">剔除期末余额为零</el-checkbox>
                                <span style="margin-left: 35px;">科目区间：</span>
                                <el-select v-model="startCode" placeholder="请选择" @change="searchCodeStart">
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
                                <el-select v-model="endCode" placeholder="请选择" @change="searchCodeEnd">
                                    <el-option
                                        v-for="item in subjectLists"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code"
                                        :style="{'text-indent':item.layer*10+'px'}"
                                        :disabled="item.code<startCode"
                                    >
                                    </el-option>
                                </el-select>
                            </ul>
                            <ul class="flexUl handle">
                                <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel">导出</li ></a>
                                <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                                <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                            </ul>
                            <ul  class="flexUl handle" style="line-height: 30px">
                                <li class="searcherValue"><input type="text" placeholder="科目编码/名称" v-model="inputKvalue"></li>
                                <li  class="searcherBtn" @click="searchCode">搜索</li>
                               <!-- <li   class="searcherBtn" @click="showType='block'" style="margin-left: 10px">高级</li>
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
                                                style="width: 250px;border:none;padding-right: 0;"
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
                                    <div class="flexPublic">
                                        <div>金额</div>
                                        <div class="flexPublic">
                                            <input v-model="startMoney"/>至<input v-model="endMoney"/>
                                        </div>
                                    </div>
                                    <div class="flexPublic searchPanel_bottom">
                                        <div class="searchPanel_btn greybtn" @click="clearPorp">重置</div>
                                        <div class="searchPanel_btn bluebtn" @click="searchDetail">搜索</div>
                                    </div>
                                </div>-->
                            </ul>
                        </div>
                    </div>

                    <div>
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="8%"/>
                                    <col width="8%"/>
                                    <col width="10%"/>
                                    <col width="25%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="4%">
                                    <col width="15%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>科目编码</td>
                                    <td>科目名称</td>
                                    <td>期间</td>
                                    <td>摘要</td>
                                    <td>借方金额（元）</td>
                                    <td>贷方金额（元）</td>
                                    <td>方向</td>
                                    <td>余额（元）</td>
                                </tr>
                                </thead>

                            </table>
                        </div>
                        <div class="tbBody" >
                            <table ref="printFrom">
                                <colgroup>
                                    <col width="8%"/>
                                    <col width="8%"/>
                                    <col width="10%"/>
                                    <col width="25%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="4%">
                                    <col width="15%"/>
                                </colgroup>
                                <tbody>
                                <template v-for="(item) in dataList">
                                    <template  v-if="item.Del.length>0">
                                        <tr style="border-top: #00b7ee;page-break-after: always">
                                            <td :rowspan="item.Del.length+1" style="border-bottom-color: #00B8EE">{{item.Kcode}}</td>
                                            <td :rowspan="item.Del.length+1"  style="border-bottom-color: #00B8EE">{{item.Kname}}</td>
                                            <td class="center">{{item.Del[0].Pdate}}</td>
                                            <td class="center">{{item.Del[0].Abstract}}</td>
                                            <td class="right">{{item.Del[0].Jsum}}</td>
                                            <td class="right">{{item.Del[0].Dsum}}</td>
                                            <td class="center">{{item.Del[0].K_balancetype}}</td>
                                            <td class="right">{{item.Del[0].K_balancetype=='借'?item.Del[0].Jsum-item.Del[0].Dsum:item.Del[0].Dsum-item.Del[0].Jsum}}</td>
                                        </tr>
                                        <tr v-for="(del,index) in item.Del" :style="{'page-break-after': index==item.Del.length-1?'always':''}">
                                        <template v-if="index>0">
                                            <td  :style="{'border-bottom-color': index==item.Del.length-1?'#00B8EE':''}">{{del.Pdate}}</td>
                                            <td :style="{'border-bottom-color': index==item.Del.length-1?'#00B8EE':''}">{{del.Abstract}}</td>
                                            <td class="right" :style="{'border-bottom-color': index==item.Del.length-1?'#00B8EE':''}">{{del.Jsum}}</td>
                                            <td class="right" :style="{'border-bottom-color': index==item.Del.length-1?'#00B8EE':''}">{{del.Dsum}}</td>
                                            <td :style="{'border-bottom-color': index==item.Del.length-1?'#00B8EE':''}">{{del.K_balancetype}}</td>
                                            <td class="right" :style="{'border-bottom-color': index==item.Del.length-1?'#00B8EE':''}">{{del.K_balancetype=='借'?item.Del[0].Jsum-item.Del[0].Dsum:item.Del[0].Dsum-item.Del[0].Jsum}}</td>
                                        </template>
                                    </tr>
                                    </template>
                                    <template v-else>
                                        <tr style="border-top: #00b7ee;page-break-after: always">
                                            <td :rowspan="item.Del.length+1" style="border-bottom-color: #00B8EE">{{item.Kcode}}</td>
                                            <td :rowspan="item.Del.length+1"  style="border-bottom-color: #00B8EE">{{item.Kname}}</td>
                                            <td colspan="6" class="center" style="border-bottom-color: #00B8EE">当前搜索数据为空</td>
                                           <!-- <td class="center">{{item.Del[0].Abstract}}</td>
                                            <td class="right">{{item.Del[0].Jsum}}</td>
                                            <td class="right">{{item.Del[0].Dsum}}</td>
                                            <td class="center">{{item.Del[0].K_balancetype}}</td>
                                            <td class="right">{{item.Del[0].K_balancetype=='借'?item.Del[0].Jsum-item.Del[0].Dsum:item.Del[0].Dsum-item.Del[0].Jsum}}</td>-->
                                        </tr>
                                    </template>
                                </template>
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
    import { SubjectList } from '@/api/subject/subjectInfo'
    import Countdownpop from "../../../components/countDownPop/index";  //自定义ajax头部配置*****
    import qs from 'qs'
    import ScrollPane from "../../../components/ScrollBar/scrollPane";

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
                inputKvalue:'',//搜索框输入
                showFirst:false,//显示一级科目
                showBenqi:true,//隐藏本期发生金额为0
                showQimo:false,//隐藏期末发生金额为0
                showType:0,//0全显示，1剔除本期发生金额为0,2剔除余额为0,3全部剔除
                subjectLists:[],//科目列表
                startCode:'',//查询开始科目
                endCode:'',//结束科目
            }
        },
        components: {ScrollPane, Countdownpop, TimeSelectBar},
        computed:{
            ...mapState({
                orgName:state=>state.user.orgName,
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                orgcode:state => state.user.orgcode
            }),
        },
        mounted(){
            //this.getData();
            this.getSubjectData();
        },

        methods:{
            //显示剔除
            dispart:function(){
                if(this.showBenqi&&this.showQimo){
                    this.showType=3
                }else{
                    if(this.showBenqi){
                        this.showType=1;
                    }else if(this.showQimo){
                        this.showType=2;
                    }else{
                        this.showType=0
                    }
                }
                this.getData();
            },
            //数据查询
            getData:function(){
                let KcodeList=[];
                for(var i in this.subjectLists){
                    if(this.subjectLists[i].code>=this.startCode&&this.subjectLists[i].code<=this.endCode){
                        KcodeList.push(this.subjectLists[i].code)
                    }
                }
                let loading=this.$loading();
                let data={
                    "uid": this.userid,
                    "Kcodes": KcodeList,
                    "Year": "2019",
                    "OrgIds": this.orgid,
                    "StartTime": "0",
                    "EndTime": "12",
                    "ZeroType":this.showType
                };
                this.$axios.get(
                    'PVoucherMst/GetDetailAccountALL',
                    {params:data}
                ).then(res=>{
                    loading.close();

                    this.dataList=qs.parse(res).Record;
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //输入框科目查询
            searchCode:function(){
                var k=0;
                for(let i in this.subjectLists){
                    if(this.inputKvalue==this.subjectLists[i].code||this.inputKvalue==this.subjectLists[i].name){
                        this.startCode=this.subjectLists[i].code;
                        this.endCode=this.subjectLists[i].code;
                        this.getData();
                    }else{
                        k++;
                        if(k==this.subjectLists.length){
                            alert('搜索科目编码/名称不存在，请确认');
                        }
                    }
                };
            },
            //开始科目更换查询
            searchCodeStart:function(){
                if(this.startCode>this.endCode){
                    this.endCode=this.startCode
                }
                this.getData();
            },
            //结束科目查询
            searchCodeEnd:function(){
              this.getData()
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
            getSubjectData:function(){
                console.log(11111111111);
                let vm=this;
                let queryfilter={
                    KCode:'',
                    KName:''
                };
                SubjectList(vm,{
                    uid: this.userid,
                    orgid: this.orgid,
                    infoData:queryfilter
                }).then(res => {
                    console.log(res);
                    this.fiyClassList(res);
                    this.startCode=this.subjectLists[0].code;
                    this.endCode=this.subjectLists[0].code;
                    if(res.length>0){
                        //加载第一个科目的明细
                        this.getData(false);
                    }
                }).catch(error =>{
                    this.saasMessage={
                        message:'科目列表获取错误',
                        delay:3000,
                        visible:true
                    };
                })

            },
            //科目列表化，将所有子科目全部取出
            fiyClassList:function(listC){
              for(var i in listC){
                  console.log(listC[i].Layers);
                  this.subjectLists.push({'code':listC[i].KCode,'name':listC[i].KCode+"-"+listC[i].KName,'layer':listC[i].Layers});
                  if(listC[i].children.length>0){
                      this.fiyClassList(listC[i].children);
                  }
              }
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
