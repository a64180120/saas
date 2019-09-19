<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 39px;overflow: hidden;position:relative">
                        <i class="el-icon-d-arrow-left iicon" style="left:0;" @click.stop="unionStateScroll(false)"></i>
                        <i style="right:0;" class="el-icon-d-arrow-right iicon" @click.stop="unionStateScroll(true)"></i>
                        <div class="scrollNav" style="float: right">

                            <ul class="flexUl handle" style="float: right">
                                <li v-if="Roleauthorize.subjectBalance_export!=0" @click="postBalanceSheetExcel">导出</li >
                                <li v-if="Roleauthorize.subjectBalance_print!=0" @click="showPrintArea">打印</li >
                                <li style="    width: 40px;margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                            <div class="flexUl handle" style="line-height: 30px;margin-left: 10px;float: right">
                                <div class="searcherValue"><input type="text" placeholder="科目编码/名称" v-model="inputKvalue"></div>
                                <div  class="searcherBtn" @click="searchCode">搜索</div>
                            </div>
                            <div class="cl" style="">
                                <div  id="rollArea" :style="{'margin-left':offsetWidth+'px','white-space':'nowrap','float':'left'}">
                                    <div style="width: 110px;">
                                        <el-select placeholder="剔除条件" value="剔除条件" style="width: 100px;height: 30px">
                                            <el-option value="">
                                                <el-checkbox v-model="showFirst">只显示一级科目</el-checkbox>
                                            </el-option>
                                            <el-option value="">
                                                <el-checkbox v-model="showBenqi">剔除本期发生为零</el-checkbox>
                                            </el-option>
                                            <el-option value="">
                                                <el-checkbox v-model="showQimo">剔除期末余额为零</el-checkbox>
                                            </el-option>
                                            <el-option value="">
                                                <el-checkbox v-model="proofType">剔除未审核凭证</el-checkbox>
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div style="width: 230px;vertical-align:bottom;">
                                        <el-date-picker
                                            v-model="zwTime"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd"
                                            style="width: 235px;padding-right: 0;height: 30px"
                                            size="small"
                                            :clearable="false"
                                            :unlink-panels="true"
                                            @change="getData"
                                        >
                                        </el-date-picker>
                                    </div>
                                    <div style="width: 410px;">
                                        <el-select v-model="startCode" placeholder="请选择" filterable @change="searchCodeStart" style="margin-left: 15px;">
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
                                        <el-select v-model="endCode" placeholder="请选择" filterable @change="searchCodeEnd">
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
                                    </div>
                                    <!--<div style="width:260px;">
                                        <span>科目级别：</span>
                                        <input type="number" v-model="levelFirst"/>级至<input type="number" v-model="levelSecond"/>级
                                    </div>-->
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="formData">
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="8%"/>
                                    <col width="12%"/>
                                    <col width="5%"/>
                                    <col width="15%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="5%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <td rowspan="2">科目编码</td>
                                        <td rowspan="2">科目名称</td>
                                        <td rowspan="2">借/贷</td>
                                        <td rowspan="2">期初余额</td>
                                        <td colspan="2">本期发生</td>
                                        <td colspan="2">本年累计</td>
                                        <td rowspan="2">借/贷</td>
                                        <td rowspan="2">期末余额</td>
                                    </tr>
                                    <tr>
                                        <td>借方</td>
                                        <td>贷方</td>
                                        <td>借方</td>
                                        <td>贷方</td>
                                    </tr>
                                </thead>

                            </table>
                        </div>
                        <div class="tbBody" style="top: 51px;">
                            <table  ref="printFrom">
                                <colgroup>
                                    <col width="8%"/>
                                    <col width="12%"/>
                                    <col width="5%"/>
                                    <col width="15%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="5%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <tbody>
                                <template v-for="item in dataList">

                                    <tr  v-if="item.subject_code.substring(0,3)=='102'":style="{'display':(showFirst&&item.Layers!=0)?'none':''}">
                                        <td :style="{'text-indent':item.Layers==0?'':'20px','text-align':'left'}" @click="hideMoney">
                                            {{ (item.subject_code=='JFHJ'||item.subject_code=='DFHJ')?'':item.subject_code}}
                                            <i v-if="item.subject_code=='102'" :class="{'hyzIcon_eye':!hideMoneyType,'hyzIcon_eyeclose':hideMoneyType}" style="margin-top:3px;float: right"></i>
                                        </td>
                                        <td :class="{'bolder':(item.subject_code=='JFHJ'||item.subject_code=='DFHJ')}">{{item.k_name}}</td>
                                        <td class="center ">
                                            <template v-if="item.ye_d_sum-item.ye_j_sum==0">
                                                平
                                            </template>
                                            <template v-else>
                                                {{balance[item.k_balanceType]}}
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="hideMoneyType">
                                                ********
                                            </template>
                                            <template v-else>
                                                <template v-if="item.k_balanceType==1">
                                                    {{(item.ys_j_sum-item.ys_d_sum).toFixed(2) | NumFormat}}
                                                </template>
                                                <template v-else>
                                                    {{(item.ys_d_sum-item.ys_j_sum).toFixed(2) | NumFormat}}
                                                </template>
                                            </template>

                                        </td>
                                        <td class="right">
                                            <template v-if="hideMoneyType">
                                                ********
                                            </template>
                                            <template v-else>
                                                <template v-if="item.yh_j_sum!=0">
                                                    {{item.yh_j_sum.toFixed(2) | NumFormat}}
                                                </template>
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="hideMoneyType">
                                                ********
                                            </template>
                                            <template v-else>
                                                <template v-if="item.yh_d_sum!=0">
                                                    {{item.yh_d_sum.toFixed(2) | NumFormat}}
                                                </template>
                                            </template>

                                        </td>
                                        <td class="right">
                                            <template v-if="hideMoneyType">
                                                ********
                                            </template>
                                            <template v-else>
                                                <template v-if="item.yl_j_sum!=0">
                                                    {{item.yl_j_sum.toFixed(2) | NumFormat}}
                                                </template>
                                            </template>

                                        </td>
                                        <td class="right">
                                            <template v-if="hideMoneyType">
                                                ********
                                            </template>
                                            <template v-else>
                                                <template v-if="item.yl_d_sum!=0">
                                                    {{item.yl_d_sum.toFixed(2) | NumFormat}}
                                                </template>
                                            </template>

                                        </td>
                                        <td class="center">
                                            <template v-if="item.ye_d_sum-item.ye_j_sum==0">
                                                平
                                            </template>
                                            <template v-else>
                                                {{balance[item.k_balanceType]}}
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="hideMoneyType">
                                                ********
                                            </template>
                                            <template v-else>
                                                <template v-if="item.k_balanceType==1">
                                                    {{(item.ye_j_sum-item.ye_d_sum).toFixed(2) | NumFormat}}
                                                </template>
                                                <template v-else>
                                                    {{(item.ye_d_sum-item.ye_j_sum).toFixed(2) | NumFormat}}
                                                </template>
                                            </template>
                                        </td>
                                    </tr>

                                    <tr v-else  :style="{'display':(showFirst&&item.Layers!=0)?'none':''}">
                                        <td :style="{'text-indent':item.Layers==0?'':'20px','text-align':'left'}">
                                            {{ (item.subject_code=='JFHJ'||item.subject_code=='DFHJ')?'':item.subject_code}}
                                        </td>
                                        <td :class="{'bolder':(item.subject_code=='JFHJ'||item.subject_code=='DFHJ')}">{{item.k_name}}</td>
                                        <td class="center">
                                            <!--<template v-if="item.k_balanceType==2">
                                                {{balance[(item.ys_d_sum-item.ys_j_sum)<0?1:(item.ys_j_sum==item.ys_d_sum?3:2)]}}

                                            </template>
                                            <template v-else>
                                                {{balance[(item.ys_j_sum-item.ys_d_sum)>0?1:(item.ys_j_sum==item.ys_d_sum?3:2)]}}
                                            </template>-->
                                            <template v-if="item.ye_d_sum-item.ye_j_sum==0">
                                                平
                                            </template>
                                            <template v-else>
                                                {{balance[item.k_balanceType]}}
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="item.k_balanceType==1">
                                                {{(item.ys_j_sum-item.ys_d_sum).toFixed(2) | NumFormat}}
                                            </template>
                                            <template v-else>
                                                {{(item.ys_d_sum-item.ys_j_sum).toFixed(2) | NumFormat}}
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="item.yh_j_sum!=0">
                                                {{item.yh_j_sum.toFixed(2) | NumFormat}}
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="item.yh_d_sum!=0">
                                                {{item.yh_d_sum.toFixed(2) | NumFormat}}
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="item.yl_j_sum!=0">
                                                {{item.yl_j_sum.toFixed(2) | NumFormat}}
                                            </template>
                                        </td>
                                        <td class="right">
                                            <template v-if="item.yl_d_sum!=0">
                                                {{item.yl_d_sum.toFixed(2) | NumFormat}}
                                            </template>
                                        </td>
                                        <td class="center">
                                            <template v-if="item.ye_d_sum-item.ye_j_sum==0">
                                                平
                                            </template>
                                            <template v-else>
                                                {{balance[item.k_balanceType]}}
                                            </template>

                                            <!-- <template v-if="item.k_balanceType==1">
                                                 <template v-if="item.ye_j_sum!=0||item.ye_d_sum!=0">
                                                     {{item.ye_j_sum-item.ye_d_sum | NumFormat}}
                                                 </template>
                                             </template>
     -->
                                        </td>
                                        <td class="right">

                                            <template v-if="item.k_balanceType==1">
                                                {{(item.ye_j_sum-item.ye_d_sum).toFixed(2) | NumFormat}}
                                            </template>
                                            <template v-else>
                                                {{(item.ye_d_sum-item.ye_j_sum).toFixed(2) | NumFormat}}
                                            </template>

                                            <!--<template v-if="item.k_balanceType==2">
                                                <template v-if="item.ye_j_sum!=0||item.ye_d_sum!=0">
                                                    {{item.ye_d_sum-item.ye_j_sum | NumFormat}}
                                                </template>
                                            </template>-->
                                        </td>
                                    </tr>
                                </template>

                                <template v-if="dataList.length==0">
                                    <tr>
                                        <td colspan="10" class="center ">
                                            未搜索到对应科目，请确搜索科目是否存在
                                        </td>
                                    </tr>
                                </template>

                                </tbody>
                            </table>
                        </div>

                        <!--表头和表尾隐藏-->
                        <table style="display: none">
                            <colgroup>
                                <col width="8%"/>
                                <col width="12%"/>
                                <col width="5%"/>
                                <col width="15%"/>
                                <col width="10%"/>
                                <col width="10%"/>
                                <col width="10%"/>
                                <col width="10%"/>
                                <col width="5%"/>
                                <col width="15%"/>
                            </colgroup>
                            <div id="theadArea">
                                <tr>
                                    <td colspan="10" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">科目余额表</td>
                                </tr>
                                <tr>
                                    <td colspan="10" style="background-color: #fff;font-size: 14px;border: 0">
                                        {{zwTime[0].split('-')[0]+'年'+(zwTime[0].split('-')[1]<10?'0'+zwTime[0].split('-')[1]:zwTime[0].split('-')[1])+'月'+(zwTime[0].split('-')[2]<10?'0'+zwTime[0].split('-')[2]:zwTime[0].split('-')[2])+'日'}}
                                        -
                                        {{zwTime[1].split('-')[0]+'年'+(zwTime[1].split('-')[1]<10?'0'+zwTime[1].split('-')[1]:zwTime[1].split('-')[1])+'月'+(zwTime[1].split('-')[2]<10?'0'+zwTime[1].split('-')[2]:zwTime[0].split('-')[2])+'日'}}
                                        {{ zwTime[1].split('-')[0] < jyear ?'':((zwTime[1].split('-')[0]=jyear &&zwTime[1].split('-')[1] <= jmonth)?'':'(未结账)') }}

                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5" class="left" style="background-color: #fff;border: 0;">编制单位：{{orgName}}</td>
                                    <td colspan="5" class="right" style="background-color: #fff;border: 0;">单位：元</td>
                                </tr>
                            </div>

                            <div id="tbodyArea">
                                <tr>
                                    <td colspan="10">
                                        注：
                                        <!--<input disabled type="checkbox" :checked="showFirst" > 剔除非一级科目-->
                                        <input disabled type="checkbox" :checked="showBenqi" > 剔除本期发生为零
                                        <input disabled type="checkbox" :checked="showQimo" > 剔除期末余额为零
                                        <input disabled type="checkbox" :checked="proofType" > 剔除未审核凭证
                                        <!--<el-checkbox v-model="proofType" @change="dispart">剔除未审核凭证</el-checkbox>-->
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="4" style="border: 0;">
                                        财务主管：{{curOrg.Treasurer}}
                                    </td>
                                    <td colspan="3" style="border: 0;">审核：</td>
                                    <td colspan="3" style="border: 0;">制表：{{username}}</td>
                                </tr>
                            </div>

                        </table>
                    </div>
                </div>
                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose"
                                     :showtype="'yearTime'"
                    ></time-select-bar>
                </div>
            </div>
        </div>
        <!--打印预览界面-->
        <div id="covCon" class="cover" :style="{'display':(showPrint?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30px;left:40px;right: 40px;margin-top: 0;margin-left:0;">
                <div id="covTil" class="" style="text-align: left">
                    <span>打印预览界面</span>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right;float: right;padding-top: 4px;margin-left: 50px;" @click="closePrintArea"></i>
                    <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right' @click="printContent">打印</a>
                    <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right;color: #333333' @click="closePrintArea">取消</a>
                </div>
                <div id="printContentArea" style="margin-bottom: 20px">

                </div>
                <ul class=" handle" style="margin-bottom: 20px;margin-top: 20px">
                </ul>
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
    import Cookies from 'js-cookie'

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
                zwTime:['2019-1-1','2019-1-1'],
                StartPNo:'',
                EndPno:'',
                startMoney:'',
                endMoney:'',
                inputKvalue:'',
                showFirst:false,
                showBenqi:false,
                showQimo:false,
                proofType:false,
                subjectLists:[],//科目列表
                startCode:'',//查询开始科目
                endCode:'',//结束科目
                balance:{
                    1:'借',
                    2:'贷',
                    3:'平'
                },
                showPrint:false,//打印预览界面 显示隐藏
                offsetWidth:0,
                levelFirst:1,
                levelSecond:5,
                jyear:0,
                jmonth:0,
                hideMoneyType:false,//102银行存款是否显示,true显示,false隐藏
                hideMoneyList:{},//存储102银行存款格式化的金额
                hideMoneyTypePrint:false,//102银行存款是否显示,true显示,false隐藏,用于存放打印时修改hideMoneyType
            }
        },
        watch: {
            showFirst:function(){
                this.getData();
            },
            showBenqi:function(){
                this.getData();
            },
            showQimo:function(){
                this.getData();
            },
            proofType:function(){
                this.getData();
            }
        },
        components: {Countdownpop, TimeSelectBar},
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgcode:state => state.user.orgcode,
                orgName:state=>state.user.orgName,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
            }),
        },
        mounted(){
            this.getCheckeds();
            this.checkCookieN();
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        methods:{
            //滚动事件
            handleScroll: function () {
                let scObj = document.getElementById('covCon');//打印区域滚动
                if(scObj==undefined){
                    window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件
                }else{
                    if(scObj.scrollTop>35){
                        document.getElementById('covTil').classList.add('fixTitle');
                    }else{
                        document.getElementById('covTil').classList.remove('fixTitle');
                    }
                }
            },
            /*获取结账年月*/
            getCheckeds(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        console.log(res);
                        if(res.Record.length>0){
                            this.jyear=res.Record[0].JYear;
                            this.jmonth=res.Record[0].JAccountPeriod;
                        }else{
                            let currentYear = new Date();
                            this.jyear=currentYear.getFullYear();
                            this.jmonth=0;
                        }
                    })
                    .catch(err=>console.log(err))
            },
            // //左滚动
            // leftScroll:function(){
            //     let widt=300;
            //     let ot=document.getElementById('rollArea').clientWidth;//总宽度，550是外层父级元素宽度
            //     let st=document.getElementById('rollArea').style.marginLeft;//相对左边的位置，，负数
            //     let start=Number(st.split('px')[0]);//得到当前的位置
            //
            //     console.log(ot+start);
            //     if(start<0){
            //         let offwid=-start<widt?-start:widt;
            //         this.timer(start,offwid,0)
            //     }
            // },
            // //右滚动
            // rightScroll:function(){
            //     let widt=300;
            //     let ot=document.getElementById('rollArea').clientWidth;//总宽度，550是外层父级元素宽度
            //     let st=document.getElementById('rollArea').style.marginLeft;//相对左边的位置，，负数
            //     let start=Number(st.split('px')[0]);//得到当前的位置
            //
            //     console.log(ot+start);
            //     if(ot+start-550>=0){
            //         let offwid=ot+start-550<widt?ot+start-550:widt;
            //         this.timer(start,offwid,1)
            //     }
            //     //document.getElementById('rollArea').style.marginLeft=((ot-this.offsetWidth)<=-450?-450:ot-this.offsetWidth)+'px';
            // },
            //滚动
            unionStateScroll(bool){
                console.log(111)
                var union=document.getElementsByClassName('scrollNav')[0];
                var unionStateCon=document.getElementsByClassName('unionState')[0];
                var pWidth=parseInt(window.getComputedStyle(unionStateCon).width);//父级宽度
                console.log(pWidth)
                if(!parseInt(union.style.marginRight)) {
                    union.style.marginRight='0px';
                }
                if(bool){
                    if(parseInt(union.style.marginRight)>0){
                        return;
                    }else{
                        union.style.marginRight=parseInt(union.style.marginRight)+100+'px';
                    }
                }else{
                    if((1200+parseInt(union.style.marginRight)+100)<=pWidth){
                        return;
                    }else{
                        union.style.marginRight=parseInt(union.style.marginRight)-100+'px';
                    }
                }
            },
            //动效
            timer(str,data,type){
                let that=this;
                setTimeout(function(){
                    if(type==1){
                        if(data>0){
                            data-=20;
                            str-=20;
                            console.log(str);
                            that.offsetWidth=str;
                            that.timer(str,data,1);
                        }
                    }else{
                        if(data>0){
                            data-=20;
                            str+=20;
                            console.log(str);
                            that.offsetWidth=str;
                            that.timer(str,data,0);
                        }
                    }

                },30)
            },
            //数据查询
            getData:function(){
                console.log(this.zwTime)
                if(!this.zwTime){
                    this.zwTime=[this.date1.choosedYear+'-1-1',this.date1.choosedYear+'-12-31'];
                    console.log(this.zwTime)
                    return;
                }

                const loading=this.$loading();
                let data;
                if(this.inputKvalue!=''){
                    data={
                        "Year":  this.date1.choosedYear,
                        "OrgIds": this.orgid,
                        "StartTime":this.zwTime[0],
                        "EndTime":this.zwTime[1],
                        "StartPNo":'',
                        "EndPno":'',
                        "value":this.inputKvalue,
                        'YJKM':this.showFirst?'1':'0',
                        'Verify':this.proofType?'1':'0',
                        'BQFS':this.showBenqi?'1':'0',
                        'QMYE':this.showQimo?'1':'0',
                    };
                }else{
                    data={
                        "Year":  this.date1.choosedYear,
                        "OrgIds": this.orgid,
                        "StartTime":this.zwTime[0],
                        "EndTime":this.zwTime[1],
                        "StartPNo":this.startCode,
                        "EndPno":this.endCode,
                        "value":'',
                        'YJKM':this.proofType?'1':'0',
                        'Verify':this.proofType?'1':'0',
                        'BQFS':this.showBenqi?'1':'0',
                        'QMYE':this.showQimo?'1':'0',
                    };
                }

                this.$axios.get(
                    'PVoucherMst/GetSubjectBalanceReport',
                    {params:data}
                ).then(res=>{
                    console.log('------------数据获取------------');
                    console.log(qs.parse(res).Record)
                    console.log('------------数据获取------------');
                    this.dataList=qs.parse(res).Record;
                    if(qs.parse(res).Record.length>0&&this.inputKvalue!=''){
                        this.startCode=qs.parse(res).Record[0].subject_code;
                        this.endCode=qs.parse(res).Record[qs.parse(res).Record.length-3].subject_code;
                    }

                    loading.close();
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //时间选择器选择时间返回值
            dateChoose:function(val){
                this.date1=val;
                this.zwTime=[];
                this.zwTime.push(this.date1.choosedYear+'-'+this.date1.choosedMonth+'-'+1);
                this.zwTime.push(this.date1.choosedYearEnd+'-12-31');
                this.getSubjectData();
            },
            //输入框科目查询
            searchCode:function(){
                if(this.inputKvalue=='') {
                    this.startCode = this.subjectLists[0].code;
                    this.endCode = this.subjectLists[this.subjectLists.length - 1].code;
                }
                this.getData();
            },
            //开始科目更换查询
            searchCodeStart:function(){
                this.inputKvalue='';
                if(this.startCode>this.endCode){
                    this.endCode=this.startCode
                }
                this.getData();
            },
            //结束科目查询
            searchCodeEnd:function(){
                this.inputKvalue='';
                this.getData()
            },

            getSubjectData:function(){
                console.log(111111111111)
                let vm=this;
                this.subjectLists=[];
                let queryfilter={
                    KCode:'',
                    KName:''
                };
                SubjectList(vm,{
                    uid: this.userid,
                    orgid: this.orgid,
                    Ryear:this.date1.choosedYear,
                    infoData:queryfilter
                }).then(res => {
                    this.fiyClassList(res);
                    this.startCode=this.subjectLists[0].code;
                    this.endCode=this.subjectLists[this.subjectLists.length-1].code;
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
                let loading=this.$loading();
                let data='';
                if(this.inputKvalue!=''){
                    data={
                        'uid':this.userid,
                        "Year":  this.date1.choosedYear,
                        "OrgIds": this.orgid,
                        "StartTime":this.zwTime[0],
                        "EndTime":this.zwTime[1],
                        "StartPNo":'',
                        "EndPno":'',
                        "value":this.inputKvalue,
                        'YJKM':this.proofType?'1':'0',
                        'Verify':this.proofType?'1':'0',
                        'BQFS':this.showBenqi?'1':'0',
                        'QMYE':this.showQimo?'1':'0',
                    };
                }else{
                    data={
                        'uid':this.userid,
                        "Year":  this.date1.choosedYear,
                        "OrgIds": this.orgid,
                        "StartTime":this.zwTime[0],
                        "EndTime":this.zwTime[1],
                        "StartPNo":this.startCode,
                        "EndPno":this.endCode,
                        "value":'',
                        'YJKM':this.proofType?'1':'0',
                        'Verify':this.proofType?'1':'0',
                        'BQFS':this.showBenqi?'1':'0',
                        'QMYE':this.showQimo?'1':'0',
                    };
                }

                /*let param = {'uid':this.userid,
                    'orgid':this.orgid,
                    'Year': this.date1.choosedYear};*/

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfigUncontrol();

                //下载Excel
                this.downloadLoading = true
                this.$axios.get('PVoucherMst/GetSubjectAllBalanceExcel',{params:data}).then(res => {
                    //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                       /* let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                        myWindow=null;*/
                        let tempLink = document.createElement("a");
                        let downloadUrl=base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        tempLink.style.display = "none";
                        tempLink.href = downloadUrl;
                        tempLink.setAttribute("download", res.filename);
                        if (typeof tempLink.download === "undefined") {
                            tempLink.setAttribute("target", "_blank");
                        }
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        document.body.removeChild(tempLink);
                    }
                    this.downloadLoading = false;
                    loading.close();
                }).catch(err => {
                    loading.close();
                    console.log(err)
                })
            },
            /*// 打印
            printContent(e){
                let print = document.createElement("div");
                print.setAttribute('class','timeSelect');
                //获取打印表格的表头
                let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                let cop = this.$refs.printFrom.cloneNode(true);
                cop.insertBefore(dm,cop.childNodes[2]);
                print.appendChild(cop)
                this.$print(print) // 使用
            },*/
            //显示打印预览
            showPrintArea:function(){
                this.hideMoneyTypePrint=this.hideMoneyType;
                this.hideMoneyType=false;
                let that=this;
                that.showPrint=true;
                setTimeout(function(){
                    //获取打印内容，渲染于弹窗
                    let print = document.createElement("div");
                    print.setAttribute('class','timeSelect');
                    print.style.padding='30px 40px 30px 30px';
                    //获取页面显示的打印表格的表头
                    let dm = that.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                    //获取隐藏的工会组织科目名称的表头
                    let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                    //获取隐藏的表格内容--表尾
                    let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
                    //表头拼接
                    for(let i=thchilds.length-1;i>=0;i--){
                        dm.insertBefore(thchilds[i],dm.firstChild);
                    }
                    //获取页面的表格内容
                    let cop = that.$refs.printFrom.cloneNode(true);
                    //表格内容拼接表尾
                    for(let i=0;i<tbchilds.length;i++){
                        cop.lastChild.appendChild(tbchilds[i]);
                    }
                    //表格内容拼接表头
                    cop.insertBefore(dm,cop.childNodes[2]);
                    print.appendChild(cop);
                    //内容全部放入打印预览
                    document.getElementById('printContentArea').appendChild(print);
                },30);

            },
            //关闭打印预览
            closePrintArea:function(){
                this.hideMoneyType=this.hideMoneyTypePrint;
                this.showPrint=false;
                document.getElementById('printContentArea').innerHTML='';
            },
            // 打印
            printContent(e){
                this.hideMoneyType=this.hideMoneyTypePrint;
                let print =document.getElementById('printContentArea');
                this.$print(print) // 使用
            },
            //查询cookie选择是否调用隐藏金额的方法
            checkCookieN:function(){
                let type=Cookies.get('hideMoney');
                if(type=='true'){
                    this.hideMoneyType=true;//显示金额
                }else{
                    this.hideMoneyType=false;//隐藏金额
                }
            },
            //隐藏金额
            hideMoney:function(val){
                let maxAge=new Date(new Date().getTime() + 60 * 60 * 1000);
                let type=this.hideMoneyType;
                if(type){
                    Cookies.set('hideMoney', false, { expires: maxAge });
                    this.hideMoneyType=false;//隐藏金额
                }else{
                    Cookies.set('hideMoney', true, { expires: maxAge });
                    this.hideMoneyType=true;
                }
               /* if(type){
                    Cookies.set('hideMoney', false, { expires: maxAge });
                    this.hideMoneyType=false;//隐藏金额
                    let child=val.target.parentNode.parentNode.children;
                    let kIndex=0;
                    console.log(this.hideMoneyList);
                    if(this.hideMoneyList.length<1) return;
                    for(let i in child){
                        if(child[i].nodeType==1&&child[i].className=='right'){
                            child[i].innerText=this.hideMoneyList[kIndex];
                            kIndex++;
                        }
                    }
                }else{
                    Cookies.set('hideMoney', true, { expires: maxAge });
                    this.hideMoneyType=true;
                    let child=val.target.parentNode.parentNode.children;
                    let ls=[];
                    for(let i in child){
                        if(child[i].nodeType==1&&child[i].className=='right'){
                            let moneyOld=child[i].innerText;
                            ls.push(moneyOld);
                            let money=moneyOld.split('');
                            for(let j in money){
                                money[j]='*';
                                console.log(money[j]);
                            }
                            let newMoney='';
                            for(let k in money){
                                newMoney+=money[k];
                            }
                            child[i].innerText=newMoney;
                        }
                    }
                    this.hideMoneyList=ls;
                }*/

            }
        }
    }
</script>
<style>
    .cl .el-input--suffix .el-input__inner{
        line-height: 30px;
    }
    .el-range-editor--small .el-range-separator {
        height: 30px;
        line-height: 29px;
        font-size: 13px;
        width: 20px;
    }
</style>
<style scoped>
    .cl{
        width: 760px;
        white-space: nowrap;
        overflow: hidden;
        float: left;
        display: inline-block
    }
    .cl input{
        width: 50px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 3px;
        padding: 10px;
        margin: 0 10px;
    }
    .cl>div>div{
        display: inline-block;
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
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
        text-align: center;
        overflow-y: auto;
    }
    .coverContent{
        background-color: #fff;
        width: 362px;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -87.5px;
        margin-left:-181px;
        margin-bottom: 50px;
        box-shadow: 0 0 5px 1px #d3e9f9;
    }

    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 0px 20px;
    }
    .coverContent ul{
        padding: 0px 50px;
        margin-bottom: 20px;
    }
    .coverContent ul li:nth-of-type(1){
        border: 1px solid #00B8EE;
        color: #00B8EE;
        background:#FFF ;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li{
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:hover{
        color: #00B8EE;
        background: #fff;
    }

    /*兼容IE11样式  测试后才可确定是否可用*/
    @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
        .cover{
            position: -ms-page;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(66,66,66,0.45);
            z-index: 99;
            text-align: center;
            overflow-y: auto;
        }
    }
    .iicon{

        height: 30px;
        line-height: 30px;
        color: #00b8ee;
        font-size: 20px;
        cursor: pointer;
        display: none;
        position:absolute;
        top:0px;
        height:100%;
        background: #fff;
        z-index:9;
    }
    .scrollNav{
        width:100%;
        -webkit-transition: all 0.2s linear;
        -moz-transition: all 0.2s linear;
        -ms-transition: all 0.2s linear;
        -o-transition: all 0.2s linear;
        transition: all 0.2s linear;
    }
    @media screen and (max-width: 1390px){
        .iicon{
            display:block;
        }
        .unionState{
            padding-right:20px;
        }

    }
    @media screen and (max-width: 1400px){
        .scrollNav{
            width:1375px;
        }
        .cl{
            float:right;
        }
    }
    /*打印样式纵向打印*/
    @page {
        size: A4 portrait !important;
    }
</style>
