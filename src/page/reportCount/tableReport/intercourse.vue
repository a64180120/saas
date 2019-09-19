<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent" v-loading="loading">
                <div class="reportBox">
                    <div class="unionState">
                        <ul class="flexUl" style="float: left;display:none">
                            <el-select placeholder="剔除条件" value="剔除条件" style="width: 100px;">
                                <el-option value="0">
                                    <el-checkbox v-model="proofType">剔除未审核凭证</el-checkbox>
                                </el-option>
                                <el-option value="1">
                                    <el-checkbox v-model="yuejie">剔除未月结月份</el-checkbox>
                                </el-option>
                            </el-select>
                        </ul>
                        <ul class="flexUl handle">
                            <li style='margin:0 0 0px 10px;' @click="aoc(0)">新增</li >
                            <li style='margin:0 0 0px 10px;' @click="aoc(1)">修改</li >
                            <li v-if="Roleauthorize.currentAccount_export!=0" style='margin:0 0 0px 10px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li >
                            <li v-if="Roleauthorize.currentAccount_print!=0" style='margin:0 0 0px 10px;' @click="showPrintArea">打印</li >
                            <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                        </ul>
                    </div>
                    <div class="formData">
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="15%"/>
                                    <col width="20%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="20%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>资产类科目</td>
                                    <td>具体内容</td>
                                    <td>金额(元)</td>
                                    <td>负债类科目</td>
                                    <td>具体内容</td>
                                    <td>金额(元)</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tbBody ">
                            <table  ref="printFrom">
                                <colgroup>
                                    <col width="15%"/>
                                    <col width="20%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="20%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <tbody >
                                <template v-for="item in interCourse">
                                    <tr>
                                        <td :class="{'bolder':item.Layer==1,'center':item.Layer==2}">{{item.Asset_Name}}</td>
                                        <td>{{item.Asset_Content}}</td>
                                        <td class="right">
                                            <template v-if="item.Asset_Content">
                                                {{item.Asset_Amount | NumFormat}}
                                            </template>
                                        </td>
                                        <td :class="{'bolder':item.Layer==1,'center':item.Layer==2}">{{item.Liability_Name}}</td>
                                        <td>{{item.Liability_Content}}</td>
                                        <td class="right">
                                            <template v-if="item.Liability_Content">
                                                {{item.Liability_Amount | NumFormat}}
                                            </template>
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </div>

                        <!--表头和表尾隐藏-->
                        <table style="display: none">
                            <colgroup>
                                <col width="15%"/>
                                <col width="20%"/>
                                <col width="15%"/>
                                <col width="15%"/>
                                <col width="20%"/>
                                <col width="15%"/>
                            </colgroup>
                            <div id="theadArea">
                                <tr>
                                    <td colspan="6" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">往来明细款项表</td>
                                </tr>
                                <tr>
                                    <td colspan="6" style="background-color: #fff;font-size: 14px;border: 0">
                                        {{date1.choosedYear}}年12月31日
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="left" style="background-color: #fff;border: 0;">编制单位：{{orgName}}</td>
                                    <td colspan="3" class="right" style="background-color: #fff;border: 0;">单位：元</td>
                                </tr>
                            </div>

                            <div id="tbodyArea">
                                <tr>
                                    <td colspan="6">
                                    <span style="width: 5%;display: inline-block;float: left">注：</span>
                                    <span style="width: 20%;display: inline-block;float: left">
                                        <input disabled type="checkbox" :checked="proofType" > 剔除未审核凭证
                                    </span>
                                        <span style="width: 45%;display: inline-block">
                                       <input disabled type="checkbox" :checked="yuejie" > 剔除末月结月份
                                   </span>
                                    </td>

                                </tr>
                                <tr>
                                    <td colspan="6" style="border: 0;">
                                    <span  style="width: 25%;display: inline-block;float: left">
                                        工会主席：{{curOrg.Chairman}}
                                    </span>
                                        <span style="width: 25%;display: inline-block">
                                        财务负责人：{{curOrg.Treasurer}}
                                    </span>
                                        <span style="width: 25%;display: inline-block">
                                        复核：
                                    </span>
                                        <span style="width: 25%">
                                        制表：{{username}}
                                    </span>

                                    </td>
                                </tr>
                            </div>

                        </table>
                    </div>

                </div>
                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose" :showtype="'yearTime'"></time-select-bar>
                </div>
                <!--新增和修改共用同一个界面，通过aocType 去判断调用哪边的接口-->
                <div class="cover"  :style="{'z-index':'999'}" v-show="aocType.show">
                    <div class="coverdiv">
                        <div class="head">
                            <p>{{aocType.title}}</p>
                            <i class="el-icon-close" style="cursor: pointer;" @click="iconClose()"></i>
                        </div>
                        <div class="selectarea">
                            <el-radio-group v-model="checkType" @change="changeCheck(checkType,aocType.choose)">
                                <el-radio label="1" value="1">资产类科目</el-radio>
                                <el-radio label="2" value="2" >负债类科目</el-radio>
                            </el-radio-group>
                            <select v-model="chooseSubject"  @change="chooseSub(chooseSubject,aocType.choose)" style="cursor: pointer;">
                                <template  v-for="item in subjectList">
                                    <option :value="item" >{{item.KName}}</option>
                                </template>
                            </select>
                            <!--<el-select  v-model="chooseSubject" :value="chooseSubject.KName" placeholder="请选择"  @change="getCodeDetailData">
                                <el-option
                                    v-for="(item,index) in subjectList"
                                    :key="item.KCode"
                                    :label="item.KName"
                                    :value="item.KCode"
                                    :style="{'margin-left':'30px'}"
                                >
                                </el-option>
                            </el-select>-->
                            <div class="btnArea">
                                <div class=""  @click="closeList()">取消</div>
                                <template v-if="aocType.choose==0">
                                    <div class="" @click="saveList(1)">保存</div>
                                </template>
                               <template v-else>
                                   <div class="" @click="saveList(2)">保存</div>
                               </template>
                            </div>

                        </div>
                        <div class="formData"  style="overflow-y: auto;height: 420px;overflow-x: hidden;top: 90px;left: 30px;right: 30px; ">

                            <ul>
                                <li style="width:60%">具体内容</li>
                                <li style="width:40%">金额(元)</li>
                            </ul>
                            <!--新增-->
                            <template v-if="aocType.choose==0">
                                <template v-for="(item,index) in changeList">
                                    <div class="delArea areaf">
                                        <i @click="delChangeList(index)" style="cursor: pointer">—</i>
                                        <i class="el-icon-lx-add" @click="addChangeList(index)" style="cursor: pointer"></i>
                                    </div>
                                    <ul class="formDataItems flexPublic" @mouseenter="showIcon"><!-- @mouseleave="hideIcon"-->

                                        <li style="width:60%;border-left: 1px solid #ebeef5"><input data-type="0" :data-index="index" v-model="item.content" @keyup="checkLength(index)" @change="tchange=true"></li>
                                        <li style="width:40%">
                                            <input  class="align-right" @keydown="clearZero" @focus="changgeData(item.money,index,0)" @blur="addCountMoneyChange(item,index,0)" v-model="item.money" data-type="1" :data-index="index" @change="inputChange()">

                                        </li>
                                    </ul>
                                </template>
                                <ul class="formDataItems flexPublic" style="height: 80px;">
                                    <li style="width:60%;height: 80px;font-size: 20px;font-weight: 600;padding-left: 0;text-align: center;border-left: 1px solid #ebeef5">合计</li>
                                    <li style="width:40%;height: 80px;font-size: 15px;line-height: 40px" class="align-right">
                                        <div style="height:40px;line-height: 40px;">
                                             {{addCountMoney | NumtoCHN}}
                                        </div>
                                        <div style="color: red;font-size: 13px;line-height: 40px;">
                                           系统总计： {{addCountMoney | NumFormat}}
                                        </div>
                                    </li>
                                </ul>
                            </template>

                            <!--修改-->
                            <template v-else>
                                <template  v-for="(item,index) in changeListFix">
                                    <div class="delArea areat" >
                                        <i @click="delChangeListFix(index)" >—</i>
                                        <i class="el-icon-lx-add" @click="addChangeListFix(index)"></i>
                                    </div>
                                    <ul class="formDataItems flexPublic" @mouseenter="showIconT" style="border-color: #00B8EE">
                                         <li style="width:60%;border-left: 1px solid #ebeef5"><input :disabled="item.Content=='合计'" :class="{bolder:item.Content=='合计'}" v-model="item.Content" data-type="0" :data-index="index" @change="change=true"></li>
                                        <li style="width:40%" class="align-right">
                                            <input class="align-right" @keydown="clearZero" @focus="changgeData(item.AccountSum,index,1)" @blur="fixCountMoneyChange(item,index,1)" @change="change=true" :disabled="item.Content=='合计'" :class="{bolder:item.Content=='合计'}" v-model="item.AccountSum" data-type="1" :data-index="index">
                                        </li>
                                    </ul>
                                </template>
                                <template v-if="changeListFix.length<8">
                                    <template v-for="n in (5-changeListFix.length)">
                                        <ul class="formDataItems flexPublic">
                                            <li  style="width:60%;border-left: 1px solid #ebeef5"></li>
                                            <li style="width:40%"></li>
                                        </ul>
                                    </template>
                                </template>
                                <ul class="formDataItems flexPublic" style="height: 80px;">
                                    <li style="width:60%;height: 80px;line-height: 80px;font-size: 20px;font-weight: 600;padding-left: 0;text-align: center;border-left: 1px solid #ebeef5">合计</li>
                                    <li style="width:40%;height: 80px;font-size: 15px;" class="align-right">
                                        <div style="height:40px;line-height: 40px;">
                                            {{fixCountMoney | NumtoCHN}}
                                        </div>
                                        <div style="color: red;font-size: 13px;line-height: 40px">
                                            系统总计： {{fixCountMoney | NumFormat}}
                                        </div>
                                    </li>
                                </ul>
                            </template>

                        </div>
                    </div>
                </div>

                <!--打印预览界面-->
                <div id="covCon" class="covers" :style="{'display':(showPrint?'block':'none'),'z-index':'999'}">
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

        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import { mapState, mapGetters } from "vuex";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import qs from 'qs'
    import saasMsg from '@/components/message/message'
    export default {
        name: "user",
        data(){
            return{
                downloadLoading:false,
                date1:[],//存储时间选择器的时间
                loading:false,//页面刷新的等待幕布
                interCourse:[],
                date1:[],
                proofType:false,
                yuejie:false,
                checkType:'1',//新增往来明细 1选择资产类  2选择负债类
                subjectList:[],//选择资产类，查询详细的资产类科目
                chooseSubject:'',//选择的资产科目
                aocType:{show:false,choose:0,title:'新增往来明细'}, //选择的增加还是修改,0增加，1修改
                changeList:[],//默认添加的空白表格
                addCountMoney:0,
                changeListFix:[],//修改保存的数据
                fixCountMoney:0,
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                showPrint:false,//打印预览界面 显示隐藏
                monthDay:[31,28,31,30,31,30,31,31,30,31,30,31],//月份天数-非闰年
                monthDayR:[31,29,31,30,31,30,31,31,30,31,30,31],//月份天数-闰年  year%4=0&&year%100!=0
                jyear:0,
                jmonth:0,
                change:false,//判断是否做过修改
                changed:true,//判断type和subject的监听是否重复
                onlyStatus:false,

                oldChooseSubject:'',//缓存改变前的数据
                oldStutas:false,//判断是否使用改变前的数据

            }
        },
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgName:state=>state.user.orgName,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
            }),

        },
        mounted(){
            // console.log(222)
            // this.addBlock();
            // window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件},
        },
        activated(){
            this.addBlock();
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件},
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        components: { TimeSelectBar,saasMsg },
        watch:{
            checkType:function(val,oldVal){
                this.chooseSubject.KType = parseInt(val)
                if (this.aocType.choose === 0 ){
                    let status = false;
                    //判断列表中是否有数据
                    for (let i = 0;i<this.changeList.length;i++){
                        if (this.changeList[i].content !== '' || this.changeList[i].money !== ''){
                            this.onlyStatus = false
                            status = true;
                            break
                        }
                    }
                    if (status){
                        this.$confirm("当前页面未保存, 是否保存?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {

                            this.oldChooseSubject.KType = parseInt(oldVal)
                            this.oldStutas = true


                            this.change=false;
                            this.saveList(1,true);
                            this.changed=false;
                            this.changeList=[];
                            this.addCountMoney=0;
                            this.addBlock();

                            this.changeListFix=[];
                            if(this.aocType.choose==1){
                                this.getCodeDetailData(true);
                            }
                        }).catch(() => {
                            this.change=false;
                            this.changed=false;
                            this.changeList=[];
                            this.addBlock();
                            if(this.aocType.choose==1){
                                this.getCodeDetailData(true);
                            }
                        });
                    }

                }else {
                    console.log(1)
                }

                // if(this.change&&!this.changed){
                //     this.changed=true;
                //     this.$confirm("当前页面未保存, 是否保存?", "提示", {
                //         confirmButtonText: "确定",
                //         cancelButtonText: "取消",
                //         type: "warning"
                //     }).then(() => {
                //         this.change=false;
                //         this.saveList(1,true);
                //         this.changed=false;
                //         this.changeList=[];
                //         this.addCountMoney=0;
                //         this.addBlock();
                //
                //         this.changeListFix=[];
                //         if(this.aocType.choose==1){
                //             this.getCodeDetailData(true);
                //         }
                //     }).catch(() => {
                //         this.change=false;
                //         this.changed=false;
                //         this.changeList=[];
                //         this.addCountMoney=0;
                //         this.addBlock();
                //         this.changeListFix=[];
                //         if(this.aocType.choose==1){
                //             this.getCodeDetailData(true);
                //         }
                //     });
                // }
                // this.getCodeData();

            },
            chooseSubject:function(val,oldVal){
                this.oldChooseSubject = oldVal
                let status = false;
                //判断列表中是否有数据
                for (let i = 0;i<this.changeList.length;i++){
                    if (this.changeList[i].content !== '' || this.changeList[i].money !== ''){
                        status = true;
                        break
                    }
                }
                console.log(val.KName)
                if(status && this.onlyStatus){
                    this.onlyStatus = true
                    this.changed=true;
                    this.$confirm("当前页面未保存, 是否保存?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        this.change=false;
                        this.saveList(1,true);
                        this.changed=false;
                        this.changeList=[];
                        this.addBlock();
                        this.changeListFix=[];
                        if(this.aocType.choose==1){
                            this.getCodeDetailData(true);
                        }
                    }).catch(() => {
                        this.change=false;
                        this.changed=false;
                        this.changeList=[];
                        this.addBlock();
                        this.changeListFix=[];
                        if(this.aocType.choose==1){
                            this.getCodeDetailData(true);
                        }
                    });
                }else {
                    this.onlyStatus = true
                }

            },
            //监听表格内容
            changeList:{
                handler(val){

                    for (let i = 0 ;i<val.length;i++){

                        if(typeof val[i].money == 'string'){
                            this.changeList[i].money = val[i].money.replace(/[^\d.,]/g,"")
                        }
                    }
                },
                deep:true
            }

        },
        methods:{
            //合计变化
            addCountMoneyChange(item,index,type){
                this.clearNoNum(index,type)
                // item.money=parseFloat(item.money);
                if(!item.money){
                    item.money=0;
                }
                var sum=0;
                for(var li of this.changeList){
                    let x =li.money.toString()
                    let money = x.replace(/,/g,"").trim()
                    if(money){
                        sum+=parseFloat(money);
                    }
                }
                this.addCountMoney=sum;
                this.$forceUpdate();
            },
            //修改合计变化
            fixCountMoneyChange(item,index,type){
                this.clearNoNum(index,type)
               // item.AccountSum=parseFloat(item.AccountSum.replace(/,/g,"").trim());
                if(!item.AccountSum){
                    item.AccountSum=0;
                }
                var sum=0;
                for(var li of this.changeListFix){
                    let x =li.AccountSum.toString()
                    let money = x.replace(/,/g,"").trim()
                    if(li.AccountSum){
                        sum+=parseFloat(money);
                    }
                }
                this.fixCountMoney=sum;
                this.$forceUpdate();
            },
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
            //页面加载，默认添加表格
            addBlock:function (){
                if (this.changeList.length != 0) {
                    this.changeList = []
                }
                for(let i=0;i<5;i++){
                    let c={'content':'','money':''};
                    this.changeList.push(c)
                    // this.changeList[i]=c//默认添加的空白表格
                }
            },
            //选择增加还是隐藏
            aoc:function(type){
              this.aocType.show=true;
              //this.changed=false;
              this.aocType.choose=type;
              if(type==0){
                  this.aocType.title='新增往来款项明细';
                  this.getCodeData(0);
              }else{
                  this.aocType.title='修改往来款项明细';
                  this.getCodeData(1);

              }
            },
            //时间选择器选择时间返回值
            dateChoose:function(val){
                this.date1=val;
                this.getData();
            },
            //获取数据
            getData:function(){
                let param='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    param=currentyear;
                }else{
                    param=this.date1.choosedYear;
                }
                let data={
                    "orgid":this.orgid,
                    "Year":  param
                }
                const loadings=this.$loading();
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'DealingsMst/GetBaseModel',
                    {params:data}
                ).then(res=>{
                    loadings.close();
                    this.interCourse=res.Record;
                }).catch(err=>{
                    loadings.close();
                    this.saasMessage={
                        message:err,
                        delay:3000,
                        visible:true
                    };
                  //this.$message(err);
                })
            },
            //根据类型获取科目列表
            getCodeData:function(type){
                let param='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    param=currentyear;
                }else{
                    param=this.date1.choosedYear;
                }
                let data={
                    "orgid":this.orgid,
                    "Year":  param,
                    'Type': this.checkType
                }
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'DealingsMst/GetPSubjectByType',
                    {params:data}
                ).then(res=>{
                    this.subjectList=res.Record; // 缓存下拉列表
                    this.chooseSubject=res.Record[0];
                    if(type==1){
                        this.getCodeDetailData(true);
                    }
                }).catch(err=>{
                    this.saasMessage={
                        message:err,
                        delay:3000,
                        visible:true
                    };
                    //this.$message(err);
                })
            },
            //根据科目类型获取明细列表
            getCodeDetailData:function(type){
                if(type){
                    this.changeListFix='';
                    let param='';
                    if(this.date1.choosedYear==undefined){
                        let currentYear = new Date();
                        let currentyear=currentYear.getFullYear(currentYear);
                        let currentMonth=currentYear.getMonth()+1;
                        this.date1.choosedYear=currentyear;
                        this.date1.choosedMonth=currentMonth;
                        param=currentyear;
                    }else{
                        param=this.date1.choosedYear;
                    }
                    let data={
                        "orgid":this.orgid,
                        "Year":  param,
                        'Type': this.chooseSubject.KType,
                        'KCode':this.chooseSubject.KCode
                    }
                    const loadings=this.$loading();
                    console.log(data)
                    this.$axios.get(
                        'DealingsMst/GetDealingDtlByOrgidUyearTypeKcode',
                        {params:data}
                    ).then(res=>{
                        loadings.close();
                        console.log(res.Record)
                        if(res.Record.length==0){
                            this.saasMessage={
                                message:'当前科目不存在可修改内容，请先添加',
                                delay:3000,
                                visible:true
                            };
                            //this.$message('当前科目不存在可修改内容，清先添加');
                        }
                        this.changeListFix=res.Record;


                        this.fixCountMoney=0;
                        for(var i in res.Record){
                            this.fixCountMoney+=res.Record[i].AccountSum;
                        }
                        this.$nextTick(function () {
                            for (let i = 0;i<this.changeListFix.length;i++) {
                                let AccountSum = parseFloat(this.changeListFix[i].AccountSum).toLocaleString()
                                let arr = AccountSum.split('.')
                                if (arr[1] === undefined){
                                    this.changeListFix[i].AccountSum = AccountSum + '.00'
                                }else if (parseInt(arr[1])>0 && parseInt(arr[1])<10) {
                                    this.changeListFix[i].AccountSum = AccountSum + '0'
                                }else {
                                    this.changeListFix[i].AccountSum = AccountSum
                                }
                            }
                        })
                    }).catch(err=>{
                        loadings.close();
                        this.saasMessage={
                            message:err,
                            delay:3000,
                            visible:true
                        };
                        //this.$message(err);
                    })
                }
            },
            /*
            * 保存信息，
            * 新增this.aocType.choose==0
            * 修改this.aocType.choose==1
            *type:1保存  2修改
            * 接口：同一个  DealingsMst/PostSaveDealings
            * */
            saveList:function(type,flag){
                let saveList=[];
                if(this.oldStutas){
                    saveList= [{
                        'OptionType':type,
                        'PhId':this.oldChooseSubject.PhId_DealingMst,
                        'OrgId':this.orgid,
                        'OrgCode':this.OrgCode,
                        // 'Type':this.chooseSubject.KType,
                        'Type':this.oldChooseSubject.KType,//
                        'PhidSubject':this.oldChooseSubject.PhId,
                        'SubjectCode':this.oldChooseSubject.KCode,
                        'TotalSum':    0 ,
                        'Uyear':this.date1.choosedYear,
                        'NgRecordVer':this.oldChooseSubject.NgRecordVer_DealingMst,
                        'Dtls':[]
                    }];
                }else {
                    saveList= [{
                        'OptionType':type,
                        'PhId':this.chooseSubject.PhId_DealingMst,
                        'OrgId':this.orgid,
                        'OrgCode':this.OrgCode,
                        // 'Type':this.chooseSubject.KType,
                        'Type':this.chooseSubject.KType,//
                        'PhidSubject':this.chooseSubject.PhId,
                        'SubjectCode':this.chooseSubject.KCode,
                        'TotalSum':    0 ,
                        'Uyear':this.date1.choosedYear,
                        'NgRecordVer':this.chooseSubject.NgRecordVer_DealingMst,
                        'Dtls':[]
                    }];
                }

               let dtls=[];
               if(this.aocType.choose==0){
                   for(var i in this.changeList){
                       if(this.changeList[i].content!=''){
                           let dtl={
                               PhId:0,
                               DealPhid:"",
                               Content:this.changeList[i].content,
                               AccountSum:this.changeList[i].money.replace(/,/g,'').trim(),
                           };
                           if (this.oldStutas){
                               dtl.DealPhid = this.oldChooseSubject.PhId_DealingMst
                           } else{
                               dtl.DealPhid = this.chooseSubject.PhId_DealingMst
                           }
                           dtls.push(dtl);
                       }
                   };
               }else{
                   for(var i in this.changeListFix){
                       if(this.changeListFix[i].Content==''||this.changeListFix.AccountSum==''){
                           this.saasMessage={
                               message:'存在未填写的内容，请补全信息，或删除不必要的数据',
                               delay:3000,
                               visible:true
                           };
                           //this.$message({showClose: true, message:'存在未填写的内容，请补全信息，或删除不必要的数据',type: 'error' });
                           return
                       }
                       this.changeListFix[i].AccountSum = this.changeListFix[i].AccountSum.replace(/,/g,'').trim()
                   }
                   dtls=this.changeListFix;
               }

                saveList[0].Dtls=dtls;
                let data={infoData:saveList};//JSON.stringify(JSON.stringify(saveList))
                console.log(data)
                this.oldStutas = false
                this.$axios.post(
                    'DealingsMst/PostSaveDealings',
                    data
                ).then(res=>{
                    this.saasMessage={
                        message:res.Msg,
                        delay:3000,
                        visible:true
                    };
                    //this.$message(res.Msg,'success');
                    if(res.Status=='success'){
                        if(!flag){
                            this.changed=true;
                            this.aocType.show=false;
                        }

                        this.getCodeData();//每次保存成功之后都要测重新获取科目列表，刷新版本号
                        this.getData();//页面数据刷新
                        this.changeList=[];
                        this.addCountMoney=0;
                        this.addBlock();
                        this.getCodeData();
                        this.changeListFix=[];
                        if(this.aocType.choose==1){
                            this.getCodeDetailData(true);
                        }
                    }else{

                    }

                }).catch(err=>{
                    console.log(err);
                })
            },
            closeList(){
                if (this.aocType.choose==0){
                    let status = false;
                    //判断列表中是否有数据
                    for (let i = 0;i<this.changeList.length;i++){
                        if (this.changeList[i].content !== '' || this.changeList[i].money !== ''){
                            status = true;
                            break
                        }
                    }
                    if(status){
                        this.$confirm("当前页面未保存, 是否保存?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() =>{
                            this.saveList(1,true);
                            this.changeList=[];
                            this.addBlock();
                            this.addCountMoney=0;
                            this.aocType.show=false
                        }).catch(()=>{
                            this.aocType.show=true
                        })
                    } else {
                        this.changeList=[];
                        this.addBlock();
                        this.addCountMoney=0;
                        this.aocType.show=false
                    }
                }else {
                    this.aocType.show=false
                }
            },
            // 点击图标关闭窗口
            iconClose(){
                this.changeList=[];
                this.addCountMoney=0;
                this.addBlock()
                this.aocType.show=false;
                this.changed = true
            },
            /*
            *新增 input输入监听
            * type:0--content   1--money
            * index:修改的哪个数组
            * */
            newChildAdd:function(val){
                let type=val.target.dataset.type,index=val.target.dataset.index,value=val.target.value;
                if(type==0){
                    this.changeList[index].content=value;
                }else{
                    if(this.changeList[index].money!=''){
                        //先计算后赋值
                        this.addCountMoney=(Number(this.addCountMoney)-Number(this.changeList[index].money)+Number(value)).toFixed(2);
                    }else{
                        this.addCountMoney=Number(this.addCountMoney)+Number(value);
                    }
                    this.changeList[index].money=value;
                }
            },
            /*
            *修改 input输入监听
            * */
            newChildFix:function(val){
                let type=val.target.dataset.type,index=val.target.dataset.index,value=val.target.value;
                if(type==0){
                    this.changeListFix[index].Content=value;
                }else{
                    this.fixCountMoney=(this.fixCountMoney-Number(this.changeListFix[index].AccountSum)+Number(value)).toFixed(2);
                    this.changeListFix[index].AccountSum=value;
                }
            },
            //显示隐藏的小图标
            showIcon:function(val){
                let list=document.getElementsByClassName('areaf');
                for(var i=0;i<list.length;i++){
                    list[i].style.display='none';
                }
                val.target.previousElementSibling.style.display='block';
            },
            showIconT:function(val){
                let list=document.getElementsByClassName('areat');
                for(var i=0;i<list.length;i++){
                    list[i].style.display='none';
                }
                val.target.previousElementSibling.style.display='block';
            },
            //隐藏小图标
            hideIcon:function(val){
                val.target.previousElementSibling.style.display='none';
            },
            //新增删除行
            delChangeList:function(index){
                this.addCountMoney=(this.addCountMoney-this.changeList[index].money).toFixed(2);
                console.log(this.addCountMoney);
                this.changeList.splice(index,1);
                if(this.changeList.length<5){
                    this.changeList.push({'content':'','money':''});
                }
            },
            //新增添加行
            addChangeList:function(index){
                this.changeList.push({'content':'','money':''});
            },
            //修改删除数据
            delChangeListFix:function(index){
                this.fixCountMoney=(this.fixCountMoney-this.changeListFix[index].money).toFixed(2);
                this.changeListFix.splice(index,1);
                this.change=true;
            },
            //修改增加行
            addChangeListFix:function(index){
                let addList=JSON.stringify( this.changeListFix[0]);
                addList=JSON.parse(addList);
                addList.Content='';
                addList.AccountSum='';
                addList.PhId=0;
                this.changeListFix.push(addList);
            },

            //刷新
            refresh:function(){
                this.getData();
            },
            /*
            *author:hyz
            *导出资产负债表Excel表格--待修改
            * 接口：PVoucherMst/PostBalanceSheetExcel
            * 参数：Data--资产负债表数据的整个data
            * */
            /*
          *author:hyz
          *导出Excel表格
          *
          * */
            postBalanceSheetExcel:function() {
                let loading=this.$loading();
                let param = {'uid':this.userid,
                    'orgid':this.orgid,
                    'Year': this.date1.choosedYear};

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfigUncontrol();

                //下载Excel
                this.downloadLoading = true
                this.$axios.get('DealingsMst/GetDealingsExcel',{params:param}).then(res => {
                    //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
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

            //下载文件
            fileDownload (data,fileName){
                if (!data) {
                    return
                }
                let blob = new Blob([data],{type:'application/octet-stream'});
                let filename = fileName || "filename.xls";

                if (typeof window.navigator.msSaveBlob !== "undefined") {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var blobURL = window.URL.createObjectURL(blob);
                    var tempLink = document.createElement("a");
                    tempLink.style.display = "none";
                    tempLink.href = blobURL;
                    tempLink.setAttribute("download", filename);
                    if (typeof tempLink.download === "undefined") {
                        tempLink.setAttribute("target", "_blank");
                    }
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    window.URL.revokeObjectURL(blobURL);
                }
            },
            // 打印
            /*printContent(e){
                let dm = this.$refs.printFrom.parentNode.firstChild.cloneNode(true);
                dm.classList.add('first_child');
                let cop = this.$refs.printFrom.cloneNode(true);
                cop.insertBefore(dm,cop.firstChild);
                cop.classList.remove('formData_content');
                this.$print(cop) // 使用
            },*/
           /* printContent(e){
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
                this.showPrint=true;
                //获取打印内容，渲染于弹窗
                let print = document.createElement("div");
                print.setAttribute('class','timeSelect');
                print.style.padding='30px 40px 30px 30px';
                //获取页面显示的打印表格的表头
                let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                //获取隐藏的工会组织科目名称的表头
                let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                //获取隐藏的表格内容--表尾
                let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
                //表头拼接
                for(let i=thchilds.length-1;i>=0;i--){
                    dm.insertBefore(thchilds[i],dm.firstChild);
                }
                //获取页面的表格内容
                let cop = this.$refs.printFrom.cloneNode(true);
                //表格内容拼接表尾
                for(let i=0;i<tbchilds.length;i++){
                    cop.lastChild.appendChild(tbchilds[i]);
                }
                //表格内容拼接表头
                cop.insertBefore(dm,cop.childNodes[2]);
                print.appendChild(cop);
                //内容全部放入打印预览
                document.getElementById('printContentArea').appendChild(print);
            },
            //关闭打印预览
            closePrintArea:function(){
                this.showPrint=false;
                document.getElementById('printContentArea').innerHTML='';
            },
            // 打印
            printContent(e){
                let print =document.getElementById('printContentArea');
                this.$print(print) // 使用
            },
            //清除0
            clearZero(val){
              var obj=val.target.value;
              if(obj==0){
                  val.target.value='';
              }
            },
            //输入框限定***
            clearNoNum(index,type){
                let fixList=null;
                let obj = ''
                if(type==0){
                    fixList=this.changeList;
                    obj=fixList[index].money;
                }else{
                    fixList=this.changeListFix;
                    obj=fixList[index].AccountSum;
                }

                //判断输入的是否是数字 如果不是设置为'0'
                if (isNaN(parseFloat(obj))) {
                    obj = '0'
                }
                if (typeof obj =='string') {
                    obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
                    obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                    obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                    obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
                    if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                        obj= parseFloat(obj);
                    }
                }
                obj= parseFloat(obj);
                let money = '';
                if (type == 0) {
                    fixList[index].money = obj.toLocaleString();//将数据用千分符分隔
                    money = fixList[index].money.split('.');
                } else {
                    fixList[index].AccountSum = obj.toLocaleString();//将数据用千分符分隔
                    money = fixList[index].AccountSum.split('.');
                }
                //判断给数字保留两位小数，不足补0
                if (money[1] === undefined)  {
                    money = money.toString() + '.00'
                }else if (0< parseInt(money[1]) && parseInt(money[1]) < 10){
                    money = money[0]+'.'+ money[1]+ '0'
                }else if ( parseInt(money[1]) > 9) {
                    money = money[0]+'.'+ money[1]
                }
                if (type == 0) {
                    fixList[index].money = money
                    if(obj==0){
                        fixList[index].money='';
                    }
                } else {
                    fixList[index].AccountSum = money
                    if(obj==0){
                        fixList[index].AccountSum='';
                    }
                }
            },
            //获取焦点时将去掉千分符号
            changgeData(val,index,type){
                if (type ==0 && typeof this.changeList[index].money == 'string'){
                    this.changeList[index].money = this.changeList[index].money.replace(/[^\d.]/g,"");
                }else if(type ==1 && typeof this.changeListFix[index].AccountSum == 'string'){
                    this.changeListFix[index].AccountSum = this.changeListFix[index].AccountSum.replace(/[^\d.]/g,"");
                }
            },
            //输入框限制长度
            checkLength:function(val){
                if(this.changeList[val].content.length>20){
                    this.changeList[val].content=this.changeList[val].content.toString().substring(0,20)
                }
                this.$forceUpdate();
            },
            //下拉框值改变时 更新下方表格数据 item:改变后的项，choose：0：新增 1：修改
            chooseSub(item,choose){
                if (choose !== 0){
                    this.getCodeDetailData(true)
                }
            },
            changeCheck(checkType,choose){
                console.log(checkType)
                if (choose === 0){
                    this.getCodeData(0)
                } else {
                    this.getCodeData(1)
                }
            },
            inputChange(){
                this.change = true
            },
            onInpnt(a,b,c){
                console.log(c)
                if (isNaN(parseInt(c.money))){
                    this.changeList[b].money = '';
                }
            }
        }
    }
</script>

<style scoped>
    .delArea{
        position: relative;
        left: 4px;
        top:4px;
        z-index: 999;
        display: none;
        height: 0;
        margin-top: -4px;
    }
    .delArea i:last-child{
        width: 14px;
        height: 14px;
        background-color: #00B8EE;
        color:white;
        border-radius: 10px;
        display: block;
        margin-top:4px;
    }
    .delArea i:first-child{
        width: 14px;
        height: 14px;
        font-size: 10px;
        background-color: red;
        border-radius: 10px;
        display: block;
        text-align: center;
        margin-top:5px;
        color: #fff;
        font-weight: 600;
    }

    select{
        margin-left: 150px;
        width: 178px;
        height:30px;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        color: #6f6f6f;
        border: none;
        border-bottom: 1px solid #cccccc;
    }
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
    }
    .cover input{
        height: 40px;
        width: 90%;
        border: 0;
        padding-left: 20px;
    }
    .coverdiv{
        margin: auto;
        width: 80%;
        height: 549px;
        background-color: #fff;
        position: relative;
        top: 50%;
        margin-top: -274px;
        padding: 10px 30px;
    }
    .coverdiv .head:first-child{
        border-bottom: 1px solid #cecece;
        height: 40px;
        line-height: 40px;
        font-size: 20px ;
        font-weight: 900;
    }
    .coverdiv .head:first-child p{
        display: inline-block;
        float: left;
    }
    .coverdiv .head:first-child i{
       float: right;
        margin-top: 10px;
        color: #CCCCCC;
    }
    .cover .selectarea{
        height: 45px;
        padding-top: 10px;
        font-size: 16px ;
    }
    .cover .selectarea .btnArea{
        display: inline-block;
        font-size: 14px;
        float: right;
    }
    .cover .selectarea .btnArea div:nth-of-type(1){
        border: 1px solid #00B8EE;
        color: #00B8EE;
        background:#FFF ;
    }
    .cover .selectarea .btnArea div{
        width: 90px;
        height: 30px;
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        display: inline-block;
        margin-left: 10px;
        margin-top: -5px;
        line-height: 30px;
        text-align:center ;
        cursor: pointer;
        border-radius: 3px;
    }
    .cover .selectarea .btnArea div:hover{
        color: #00B8EE;
        background: #fff;
    }
    .formData_content{
        margin-top: 0;
        position: absolute;
        overflow-y: scroll;
        bottom: 0px;
        top: 90px;
        left: 0;
        right: -17px;
    }
    .formData_content>ul:first-child{
        background: transparent;
        margin-top: 0;
    }
    .formData>ul>li{
        border-right:1px solid #ebeef5;
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
        border-right:1px solid #ebeef5;
    }

    .formData>ul>li:first-child{
        padding:0 2px;
    }


    .formDataItems{
        border-bottom:1px solid #ebeef5;
        background-color: white;
    }

    .formData>ul.formDataItems>li{
        border-right:1px solid #ebeef5;
        border-left:0;
        border-bottom:0;
        text-align: left;
        line-height: 48px;
        height:48px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding:0 15px;
    }

    .formData>ul.formDataItems>li.bolder{
        font-weight: bold;
    }
    .formData>ul.formDataItems>li.align-center{
        text-align: center;
    }
    .formData>ul.formDataItems>li .align-right{
        text-align: right;
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

    .covers{
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
        top: 5%;
        left: 5%;
        right: 5%;
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
        .covers{
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
</style>
<style>
    .flexUl .el-input--suffix .el-input__inner{
        line-height: 30px;
    }
</style>
