<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 30px">
                        <div style="width:100%;float: right">
                            <ul class="flexUl handle">
                                <li :class="{'disableBtn':(editProps.editData.IsReport==1)}" @click="edit">编辑</li >
                                <li  :class="{'disableBtn':(editProps.editData.IsReport==1)}" @click="showCountMsg=(editProps.editData.IsReport==1?false:true)">上报</li>
                                <li  :class="{'disableBtn':(date1.choosedYear!=date1.lastYear)}"  style="width: 72px;" @click="showNextMsg=(date1.choosedYear==date1.lastYear?true:false)">做下年填报</li>
                                <li @click="postBalanceSheetExcel">导出</li >
                                <li @click="printContent">打印</li >
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                        </div>
                    </div>

                    <div class="formData" id="form1">

                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="35%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>项目</td>
                                    <td colspan="4" rowspan="2">指标值</td>
                                </tr>
                                <tr>
                                    <td>基本信息</td>
                                </tr>
                                <tr>
                                    <td>人员信息</td>
                                    <td>合计</td>
                                    <td>财政负担</td>
                                    <td>行政负担（基层）</td>
                                    <td>工会经费负担</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tbBody" style="top:145px;">
                            <table  ref="printFrom">
                                <colgroup>
                                    <col width="35%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <tbody >
                                    <!--人员信息表内容-->
                                    <template>
                                        <tr v-for="(item,index) in dataList">
                                            <td class="center"><p :style="{'text-indent':item.label*45+'px' }">{{item.title}}</p></td>
                                            <td :class="{'ordinary':item.count==0||index==0,'activeNum':item.count>0&&index!=0}" @click.self="item.count>0?showstaff(item.param,0):''">{{item.count}}</td>
                                            <td :class="{'ordinary':item.cz==0||index==0,'activeNum':item.cz>0&&index!=0}" @click.self="item.cz>0?showstaff(item.param,1):''">{{item.cz}}</td>
                                            <td :class="{'ordinary':item.xz==0||index==0,'activeNum':item.xz>0&&index!=0}" @click.self="item.xz>0?showstaff(item.param,2):''">{{item.xz}}</td>
                                            <td :class="{'ordinary':item.gh==0||index==0,'activeNum':item.gh>0&&index!=0}" @click.self="item.gh>0?showstaff(item.param,3):''">{{item.gh}}</td>
                                        </tr>
                                    </template>
                                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                    <!--单位面积情况表-->
                                    <template>
                                        <tr>
                                            <td class="secondTil" colspan="5">单位面积情况</td>
                                        </tr>
                                        <tr v-for="area in dataAreaList">
                                            <td :style="{'text-indent':area.label*45+'px' }">{{area.title}}</td>
                                            <td colspan="4" class="left">{{area.count}}</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <!--表头和表尾隐藏-->
                        <table style="display: none">
                            <colgroup>
                                <col width="35%"/>
                                <col width="15%"/>
                                <col width="15%"/>
                                <col width="15%"/>
                                <col width="15%"/>
                            </colgroup>
                            <div id="theadArea">
                                <tr>
                                    <td colspan="5" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">基本情况表</td>
                                </tr>

                                <tr>
                                    <td class="left" colspan="2" style="border:none;background-color: #fff;">编报单位：{{orgName}}</td>
                                    <td class="left" colspan="3" style="border:none;background-color: #fff;">{{date2}}</td>
                                    <!--<td class="right" style="border:none;background-color: #fff;">单位：元</td>-->
                                </tr>
                            </div>

                            <div id="tbodyArea">
                                <tr>
                                    <td colspan="5" style="border: 0;">
                                    <span  style="width: 25%;display: inline-block;float: left">
                                        工会主席：{{curOrg.Chairman}}
                                    </span>
                                        <span style="width: 35%;display: inline-block">
                                         财务负责人：{{curOrg.Treasurer}}
                                    </span>
                                        <span style="width: 25%;display: inline-block">
                                        复核：
                                    </span>
                                        <span style="width: 15%">
                                        制表：{{username}}
                                    </span>
                                    </td>
                                </tr>
                            </div>

                        </table>
                    </div>
                    <div class="verifyPanel" v-if="editProps.editData.IsReport==1" :style="{display:'block'}">
                        <div>已上报</div>
                        <div style="font-size: 14px">{{editProps.editData.ReportTime.substring(0,10)}}</div>
                    </div>
                </div>

                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose" :showtype="'yearTime'" :sw="true" ref="aa"></time-select-bar>
                </div>
            </div>
        </div>

        <!--提交提示-->
        <div class="cover" :style="{'display':(showCountMsg?'block':'none')}">
            <div class="coverContent">
                <div class="flexPublic">
                    <p>提示</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right;" @click="showCountMsg=false"></i>
                </div>
                <div>
                    <p>上报后不允许更改，确定上报？</p>
                </div>
                <ul class="flexPublic handle">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="showCountMsg=false">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="report">确定</li>
                </ul>
            </div>
        </div>

        <!--做下年预算提示-->
        <div class="cover" :style="{'display':(showNextMsg?'block':'none')}">
            <div class="coverContent">
                <div class="flexPublic">
                    <p>提示</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right;" @click="showNextMsg=false"></i>
                </div>
                <div style="text-align: left">
                    <p>确定做下年信息填报？点击“确定”后，上年数据将被复制，您可对数据进行编辑调整</p>
                </div>
                <ul class="flexPublic handle" style="padding-top:0">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="showNextMsg=false">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="NextYear">确定</li>
                </ul>
            </div>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>

        <!--编辑弹窗-->
        <el-dialog class="editArea" width="90%" title="单位基本信息维护" @close="getData" :visible.sync="editProps.visiable" v-if="editProps.visiable" :close-on-click-modal="false">
            <edit-area  v-if="editProps.visiable" :editData="editProps.editData" @close="closeStaff"  @up-data="refresh" ></edit-area>
        </el-dialog>
        <!--员工查看弹窗-->
        <el-dialog class="editArea" width="90%" title="人员信息查看" :visible.sync="staffProps.visiable" v-if="staffProps.visiable" :close-on-click-modal="false">
            <staff-dialog :prop="staffProps.data"></staff-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState, mapGetters } from "vuex";
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import TimeSelectBar from "@/components/TimeSelectBar/index"
    import saasMsg from '@/components/message/message'
    import editArea from './components/edit'
    import staffDialog from './components/staffDialog'

    export default {
        name: "user",
        data(){
            return{
                showCountMsg:false,
                showNextMsg:false,
                showReportMsg:false,//上报显示false隐藏 true显示
                dataList:[
                    {title:'单位编制人数（人）',label:0,count:0,cz:0,xz:0,gh:0,param:['','','']},
                    {title:'年末实有人数（人）',label:0,count:0,cz:0,xz:0,gh:0,param:[0,'','']},
                    {title:'（一）正式人员',label:1,count:0,cz:0,xz:0,gh:0,param:[1,'','']},
                    {title:'（二）聘用人员',label:1,count:0,cz:0,xz:0,gh:0,param:[2,'','']},
                    {title:'（三）其他',label:1,count:0,cz:0,xz:0,gh:0,param:[3,'','']},
                    {title:'财会人员人数（人）',label:0,count:0,cz:0,xz:0,gh:0,param:['',1,'']},
                    {title:'其中：专职人员数',label:1,count:0,cz:0,xz:0,gh:0,param:['',2,'']},
                    {title:'兼职人员数',label:2,count:0,cz:0,xz:0,gh:0,param:['',3,'']},
                    {title:'离退休人员（人）',label:0,count:0,cz:0,xz:0,gh:0,param:['','',1]},
                    {title:'（一）离休人员',label:1,count:0,cz:0,xz:0,gh:0,param:['','',2]},
                    {title:'（二）退休人员',label:1,count:0,cz:0,xz:0,gh:0,param:['','',3]},
                ],//数据库查询的人员信息
                dataAreaList:[
                    {title:'房屋建筑面积（平方米）',label:0,count:0},
                    {title:'其中：有工会产权的自有面积',label:1,count:0},
                    {title:'房屋建筑面积（平方米）',label:0,count:0},
                    {title:'其中：有工会产权的自有面积',label:1,count:0},
                ],//单位面积list
                date1:[],//时间选择器数据
                currentyear:'',//当前年份

                verify:true,//判断页面是否可以修改，true默认可修改--未上报，若为false不可修改--已上报
                verifyTime:'',
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },

                jyear:'',
                jmonth:0,
                byear:'',
                date2:'',
                //编辑弹窗组件
                editProps:{
                    visiable:false,
                    editData:{}
                },
                //员工信息查看弹窗
                staffProps:{
                    visiable:false,
                    data:{
                        AdministraType:'', //行政编制负担类型(传0,1,2,3 下同)
                        PersonType:'',  //员工类型
                        IsFinance:'',   //是否财会人员
                        OrgId:'',
                        Year:''
                    }
                }
            }
        },
        components: {TimeSelectBar,saasMsg,editArea,staffDialog},

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
                startYear:state=>state.Pconfig.jbuildDate.substring(0,4)//开账年
            }),

        },
        activated(){
            this.getFillYear();
            let current=new Date();
            this.date2=current.getFullYear()+'年'+(1+current.getMonth())+'月'+current.getDate()+'日'
        },
        methods:{
            /*showstaff显示用户
            * (item.param,index)
            * param:['','']
            *
            * */
            showstaff:function(param,index){
                if(param[0]===''&&param[1]===''&&param[2]===''){
                    return;
                }
                this.staffProps.data.AdministraType=index;
                this.staffProps.data.PersonType=param[0];
                this.staffProps.data.IsFinance=param[1];
                this.staffProps.data.IsRetire=param[2];
                this.staffProps.data.OrgId=this.orgid;
                this.staffProps.data.Year=this.date1.choosedYear;
                this.staffProps.visiable=true;
            },
            //关闭编辑页面，并刷新数据
            closeStaff(){
                this.editProps.visiable=false;
                this.getData()
            },
            /*获取最新填报年*/
            getFillYear:function(){
                console.log('获取最新填报年')
               /* var data={
                    orgid:this.orgid,
                }
                this.$axios.get('/PSubjectBudgetMst/GetBudgetYear',{params:data})
                    .then(res=>{
                        if(res.year!=0){
                            this.byear=res.year;//结账年
                        }else{
                            let currentYear = new Date();
                            this.byear=currentYear.getFullYear();
                        }
                    })*/
            },

            /*
            *上报
            *
            * */
            report:function(){
                let data={
                    OrgId:this.orgid,
                    Year:this.date1.choosedYear
                }
                this.$axios.post('/SysPerInormation/PostReportSysOrgPers',data).then(res=>{
                    console.log(res);
                    //Status: "success", Msg: "上报成功！"
                    this.showCountMsg = false;
                    this.saasMessage={
                        message:res.Msg,
                        delay:3000,
                        visible:true
                    };
                    this.getData();
                }).catch(err=>{
                    this.showCountMsg = false;
                    this.saasMessage={
                        message:'上报时出错，请稍后重试',
                        delay:3000,
                        visible:true
                    };
                    console.log(err)
                })
            },


            /*
            * 时间选择器
            * */
            dateChoose:function(val){
                this.date1=val;
                this.getData();
            },

            /*
            * 监听编辑按钮事件
            * */
            edit:function(){
                this.editProps.visiable=(this.editProps.editData.IsReport==1?false:true)
            },


            /*
            * 页面数据查询方法
            * */
            getData:function(){
                let loading = this.$loading();
                let data={
                    OrgId:this.orgid,
                    Year:this.date1.choosedYear
                };
                this.$axios.get('/SysPerInormation/GetSysOrgPersSummary',{params:data}).then(res=>{
                    loading.close()

                    if(res.Status=='success'){
                        /*员工数据整理*/
                        for(var i in this.dataList){
                            console.log(i)
                            for(var j in this.dataList[i]){
                                console.log(j)
                                if(j=='count'){
                                    this.dataList[i][j]=res.Data1[i][0];
                                }
                                if(j=='cz'){
                                    this.dataList[i][j]=res.Data1[i][1];
                                }
                                if(j=='xz'){
                                    this.dataList[i][j]=res.Data1[i][2];
                                }
                                if(j=='gh'){
                                    this.dataList[i][j]=res.Data1[i][3];
                                }
                            }
                        }
                        this.dataAreaList[0].count=res.Data2.HouseSumArea||0;
                        this.dataAreaList[1].count=res.Data2.HouseFreeArea||0;
                        this.dataAreaList[2].count=res.Data2.LandSumArea||0;
                        this.dataAreaList[3].count=res.Data2.LandFreeArea||0;
                        //赋值给编辑弹窗数据，用于弹窗页面进行传值
                        this.editProps.editData=res.Data2;
                        this.editProps.editData.OrgCode=this.orgcode;
                        this.editProps.editData.OrgId=this.orgid;
                        this.editProps.editData.Year=this.date1.choosedYear;
                    }
                }).catch(err=>{
                    loading.close()
                    console.log(err)
                })
            },


            /*
            * 做下年填报
            * */
            NextYear:function(){
                let data={
                    OrgId:this.orgid,
                    Year:this.date1.choosedYear
                }
                this.$axios.post('/SysPerInormation/PostNextYearSysOrgPers ',data).then(res=>{
                    this.showNextMsg=false;
                    this.saasMessage={
                        message:res.Msg,
                        delay:3000,
                        visible:true
                    };
                    this.saasMessage={
                        message:res.Msg,
                        delay:3000,
                        visible:true
                    };
                    if(res.Status=='success'){
                        this.$refs.aa.getSwYear();
                    }
                }).catch(err=>{
                    console.log(err)
                    this.saasMessage={
                        message:'下年填报时出错，请稍后再试',
                        delay:3000,
                        visible:true
                    };
                })
            },

            /*
            *author:hyz
            *导出Excel表格
            *
            * */
            postBalanceSheetExcel:function() {
                console.log('下载')
                let loading=this.$loading();
                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfigUncontrol();
                let param = {
                    'UserId':this.userid,
                    'OrgId':this.orgid,
                    'Year': this.date1.choosedYear
                };
                this.$axios({
                    method: 'post',
                    url: '/SysPerInormation/PostExportSummaryExcel',
                    data: param
                }).then(res => {
                    //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    if(res.Status=="error"){
                        this.saasMessage={
                            message:res.Msg,
                            delay:3000,
                            visible:true
                        };
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
                    loading.close();
                }).catch(err => {
                    loading.close();
                    console.log(err)
                })
            },

            // 打印
            printContent(){
                let loading = this.$loading();
                console.log('打印')
                let print = document.createElement("div");
                print.setAttribute('class','timeSelect');
                print.style.padding='   0px 40px 30px 30px';

                //获取打印表格的内容调整，修改input数据打印无法正常显示
                let printArea=this.$refs.printFrom.cloneNode(true);
                let inputList=printArea.getElementsByTagName('input');
                for(let inNum=0; inNum<inputList.length; inNum++){
                    let text=inputList[0].value==undefined?' ':inputList[0].value;//获取打印区域input的值
                    let text1=inputList[0].parentNode.text==undefined?' ':inputList[0].parentNode.text;//获取打印区域，除input以外的文本，’其中政府补助‘
                    inputList[0].parentNode.innerHTML=' '+text1+text;
                }

                //获取打印表格的表头
                let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                //获取隐藏的工会组织科目名称的表头
                let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                //获取隐藏的表格内容--表尾
                let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
                //表头拼接
                for(let i=thchilds.length-1;i>=0;i--){
                    dm.insertBefore(thchilds[i],dm.firstChild);
                }

                //表格内容拼接表尾
                for(let i=0;i<tbchilds.length;i++){
                    printArea.lastChild.appendChild(tbchilds[i]);
                }
                printArea.insertBefore(dm,printArea.childNodes[2]);
                print.appendChild(printArea);
                dm=null;
                printArea=null;
                console.log(print);
                this.$print(print);
                print=null;
                loading.close()
            },

            //刷新
            refresh:function(){
                this.getData();
            },

            /*
            * 当前时间格式化
            *
            * */
            timeFor:function(ti){
                let time=new Date(ti);
                let year = time.getFullYear(),
                    month = time.getMonth()+1<10?'0'+(time.getMonth()+1):time.getMonth()+1,
                    day = time.getDate()<10?"0"+time.getDate():time.getDate() ,
                    hours=time.getHours()<10?"0"+time.getHours():time.getHours(),
                    minutes=time.getMinutes()<10?"0"+time.getMinutes():time.getMinutes(),
                    second=time.getSeconds()<10?"0"+time.getSeconds():time.getSeconds();

                return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+second
            },

        }
    }
</script>

<style scoped>

  /*  @media print{
        html,body{
            height: inherit;
        }
        body{
            height: inherit !important;
        }
        #printForm{
            height: inherit !important;
        }
    }*/
  .center p{
      width: 235px;
      display: inline-block;
      text-align: left;
  }
    .disableBtn{
        color: #cccccc !important;
        background: #fff !important;
        border-color: #ccc !important;
        cursor: not-allowed !important;
    }
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
    }

    .unionState>ul>li{
        width:100%;
    }


    input{
        border: none;
        line-height: 40px;
        height: 40px;
        width: 100%;
        text-align: right;
    }
    input.other{
        width:55%;
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
        height:auto;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -87.5px -181px;
        box-shadow: 0 0 5px 1px #d3e9f9;
    }

    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 30px 20px;
    }
    .coverContent ul{
        padding: 30px 50px;
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
    .coverContentFace{
        width: 100%;
        background-color: #fff;
        overflow-x: hidden;
        font-size: 16px;
        text-align: center;
        page-break-after: always;
        padding: 15px;
        height: 100%;
    }
    .coverContentFace input{
        border-bottom: 1px solid #ccc;
        text-align: center;
        display: inline-block;
        width: 50px;
        padding-bottom: 0;
        letter-spacing: 0;
    }

    .el-icon-close{
        float: right;
        font-size: 24px;
        padding: 3px;
        cursor: pointer;
        position: relative;
        color: #cccccc
    }

    .ordinary{
        text-align: center;
        color: #bbb;
        cursor: not-allowed;
    }
    .activeNum{
        text-align: center;
        color: #ffa016;
        text-decoration: underline;
        cursor: pointer;
    }
    .secondTil{
        background-color: #d3e9f9;
    }
</style>
<style>
    .editArea .el-dialog{
        margin: 0 auto;
        margin-top: 5vh!important;
        height: 90vh;
        border-radius: 8px;
        box-shadow: 0 0 10px #000;
    }
    .editArea .el-dialog .el-dialog__body{
        height: 85vh;
        padding: 0 20px;
    }
</style>

