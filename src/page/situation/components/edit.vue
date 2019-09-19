<template>
    <section style="height: 100%">
        <div class="unionState" style="width: 100%;height: 5vh">
            <div style="width:100%;float: right">
                <ul class="flexUl handle">
                    <li @click="showReportMsg.loadFlag=true">人员导入</li >
                    <li @click="staffSave">保存</li>
                    <li  style="width: 72px;" @click="$emit('close')">取消</li>
                </ul>
            </div>
        </div>
        <div class="editArea">
                <div class="leftBtn">
                    <ul>
                        <li style="padding:22px 10px;" :class="{active:choice=='staff'}" @click="choice='staff'">人员</li>
                        <li  style="padding: 10px;" :class="{active:choice=='unit'}" @click="choice='unit'">单位面积</li>
                    </ul>
                </div>
                <div style="height: 100%">
                    <div class="timeSelect">
                        <div class="container">
                        <staff :style="{display:choice=='staff'?'block':'none'}" :save="save" :staffProps="staffProps" @getStaff="getStaff"></staff>
                        <unit  :style="{display:choice=='unit'?'block':'none'}" :save="save" :unitProps="unitProps" @getUnit="getUnit"></unit>
                    </div>
                </div>
            </div>
        </div>

        <!--文件上传-->
        <div class="cover" :style="{'display':(showReportMsg.loadFlag?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30%;">
                <div class="flexPublic">
                    <p>选择文件</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.loadFlag=false;"></i>
                </div>
                <div style="text-align: center">
                    <el-upload
                        ref="piclist"
                        drag
                        action=""
                        :limit="1"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUploadPic"
                        :http-request='uploadFileMethod'>
                        <i class="el-icon-upload"></i>

                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传{{'Excel'}}文件</div>

                    </el-upload>
                    <div class="button" style='cursor: pointer;width: 110px;padding: 0;margin-top:10px' @click="loadExcel">下载导入模板</div>
                </div>
            </div>
        </div>
        <!--文件上传成功，数据库导入-->
        <div class="cover" :style="{'display':(showReportMsg.loadFlagSecond?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30%;">
                <div class="flexPublic">
                    <p>批量导入</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.loadFlagSecond=false"></i>
                </div>
                <div>
                    <div style="color: #02a7e7;border: none;">
                        {{showReportMsg.loadFlagSecondMsg}}
                    </div>
                    <div style="margin-top: 15px;padding:0 ">是否跳过重复及错误数据，继续批量导入？</div>
                </div>
                <ul class="flexPublic handle" style="margin-bottom: 20px">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="clearFile">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="updateFile">导入</li>
                </ul>
            </div>
        </div>

        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </section>
</template>

<script>
    import staff from './edit/staff'
    import unit from './edit/unitArea'
    import saasMsg from '@/components/message/message'
    import axios from "axios";
    import qs from 'qs';
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState } from "vuex";
    export default {
        name: "edit",
        components: {staff,unit,saasMsg,mapState},
        props:{
            editData:{
                type:Object,
                default:()=>{
                    return {}
                }
            }
        },
        data(){
            return{
                choice:'staff',
                save:false,
                //用于判断点击保存时，人员及单位面积 数据是否返回
                saveFlag:{
                    staff:false,
                    area:false
                },
                saasMessage:{
                    visible:false,  //消息弹出框*******
                        message:'', //消息主体内容**************
                        delay:0
                },
                //主页传值，数据格式化，用于向staff和unit传值，减少数据查询
                staffProps:{
                    staffList:[],
                    staffCount:{},
                },
                unitProps:{
                    unitCount:{},
                },
                //人员导入参数
                showReportMsg: {
                    flag: false,
                    show:false,
                    loadFlag:false,
                    loadFlagSecond:false,
                    loadFlagSecondMsg:'',
                    loadFile:{
                        name:'',
                        type:''
                    }
                },
            }
        },
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
        watch:{
            saveFlag:{
                handler(val) {
                    if(this.saveFlag.staff&&this.saveFlag.area){
                        this.saveFuc()
                    }
                },
                deep:true
            },
            editData:{
                handler(val) {
                    if(val){
                        this.staffProps.staffList=this.editData.SysPers;
                        this.staffProps.staffCount={
                            'FinancePerNum': this.editData.FinancePerNum,
                            'AdminPerNum': this.editData.AdminPerNum,
                            'FundPerNum': this.editData.FundPerNum,
                            'SumPerNum': this.editData.SumPerNum,
                        }
                        this.unitProps={
                            'HouseSumArea': this.editData.HouseSumArea,
                            'HouseFreeArea': this.editData.HouseFreeArea,
                            'LandSumArea': this.editData.LandSumArea,
                            'LandFreeArea': this.editData.LandFreeArea,
                        }
                    }
                },
                deep:true
            }
        },
        mounted(){
            this.staffProps.staffList=this.editData.SysPers;
            this.staffProps.staffCount={
                'FinancePerNum': this.editData.FinancePerNum,
                'AdminPerNum': this.editData.AdminPerNum,
                'FundPerNum': this.editData.FundPerNum,
                'SumPerNum': this.editData.SumPerNum,
            }
            this.unitProps={
                'HouseSumArea': this.editData.HouseSumArea,
                'HouseFreeArea': this.editData.HouseFreeArea,
                'LandSumArea': this.editData.LandSumArea,
                'LandFreeArea': this.editData.LandFreeArea,
            }
        },
        methods:{
            staffSave:function(){
                this.save=true;
                this.saveFlag.staff=false;
                this.saveFlag.area=false;
            },
            //获取人员列表
            getStaff(val){
                if(val.Msg==''){
                    this.editData['SysPers']=val.staffList;
                    this.editData.FinancePerNum=val.staffNum.cz;
                    this.editData.AdminPerNum=val.staffNum.xz;
                    this.editData.FundPerNum=val.staffNum.gh;
                    this.editData.SumPerNum=val.staffCount;
                    this.saveFlag.staff=true;
                }else{
                    if(this.choice!='staff'){
                        this.saasMessage={
                            message:val.Msg,
                            delay:3000,
                            visible:true
                        };
                    }
                    this.saveFlag.staff=false;
                }
                this.save=false;

            },
            //获取土地信息
            getUnit(val){
                this.editData.HouseSumArea=val.HouseSumArea;
                this.editData.HouseFreeArea=val.HouseFreeArea;
                this.editData.LandSumArea=val.LandSumArea;
                this.editData.LandFreeArea=val.LandFreeArea;
                this.save=false;
                this.saveFlag.area=true;
            },
            //录入信息保存
            saveFuc:function(){
                var loading=this.$loading();
                this.$axios.post('/SysPerInormation/PostUpdate',this.editData).then(res=>{
                    console.log(res)
                    this.saveFlag={
                        staff:false,
                        area:false
                    }
                    if(res.Status=='success'){
                        this.saasMessage={
                            message:'保存成功',
                            delay:3000,
                            visible:true
                        };
                        this.$emit('up-data','')
                    }else{
                        this.saasMessage={
                            message:res.Msg,
                            delay:3000,
                            visible:true
                        };
                    }

                    loading.close();
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //人员导入
            //模板下载
            onloadOrg:function(val){
                this.showReportMsg.loadFlag=true;
            },
            //只能选择一个文件
            handleExceed(files, fileList) {
                this.$message.warning(`一次只能导入一个文件！`);
            },
            //文件类型判断
            beforeUploadPic(file) {

                var isRightType = (file.type === 'application/vnd.ms-excel');
                if (!isRightType) {
                    this.$message.error('请选择Excel文档!');
                    return false
                }
            },
            //excel上传
            uploadFileMethod(param) {
                var _$this=this;
                var url='/SysPerInormation/PostInportOrgPers';
                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);
//加时间戳，防止IE缓存
                formData.append('timeCode',(new Date()).getTime().toString());
                let loading=this.$loading();
                loading.setText('文件正在上传...')
                let timer = setTimeout(function(){
                    loading.setText('数据比对中，请耐心等待..')
                },1500);
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();

                let config_header = { "Content-Type": "multipart/form-data" };
                var new_header = Object.assign({},config_header, baseheader);

                axios.create(base).post(url, formData, { headers:new_header }).then(res => {
                    loading.close();
                    var response=JSON.parse(res.data);

                    if(response.Status=='success'){
                        this.showReportMsg.loadFlagSecondMsg=response.Msg;
                        this.showReportMsg.loadFlagSecond=true;
                        this.showReportMsg.loadFlag=false;//UploadPath IsRepeat
                        this.showReportMsg.loadFile.name=response.UploadPath;
                        this.showReportMsg.loadFile.type=response.IsRepeat;
                    }else{
                        _$this.$refs.piclist.clearFiles();
                        _$this.$message({showClose: true, message: response.Msg, type: 'error'});
                    }

                }).catch((error) =>{
                    loading.close();
                    //错误
                    this.showReportMsg.loadFlag=false;
                    _$this.$refs.piclist.clearFiles();
                    _$this.$message({showClose: true, message: error, type: 'error'});
                });

            },

            ///组织导入模板下载
            loadExcel:function(){
                let base=httpConfig.getAxiosBaseConfig();
                window.location.href = base.baseURL + "/File/GetExportFile?filePath=template&fileName=人员信息批量导入模板.xls";
            },
            //清除文件
            clearFile:function(){
                this.showReportMsg.loadFlagSecondMsg='';
                this.showReportMsg.loadFlagSecond=false;
                this.showReportMsg.loadFile.name='';
                this.showReportMsg.loadFile.type='';
                this.$refs.piclist.clearFiles();
            },
            //组织批量导入接口
            updateFile:function(){
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();
                let loading=this.$loading();

                let timer = setTimeout(function(){
                    loading.setText('导入时间过长，请耐心等待，勿关闭浏览器')
                },3000);
                let param={
                    OrgId:this.orgid,
                    Year:this.editData.Year,
                    IsIgnore:this.showReportMsg.loadFile.type,
                    UploadPath:this.showReportMsg.loadFile.name,
                    //加时间戳，防止IE缓存
                    timeCode:(new Date()).getTime().toString()
                };
                axios.create(base).post('/SysPerInormation/PostSaveOrgPers',qs.stringify(param), { headers:baseheader }).then(res => {
                    this.$emit('up-data','');
                    loading.close();
                    //这里去clear
                    clearTimeout(timer);
                    res=qs.parse(res);
                    res=JSON.parse(res.data);
                    if(res.Status=='success'){
                        this.showReportMsg.loadFlagSecond=false;
                        this.$message({showClose: true, message: '批量导入成功', type: 'success'});
                        this.$refs.piclist.clearFiles();
                    }else{
                        this.showReportMsg.loadFlagSecond=false;
                        this.$message({showClose: true, message: res.Msg, type: 'error'});
                        this.$refs.piclist.clearFiles();
                    }
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .container{
        top: 0;
        bottom: 0;
        left: 40px;
        right: 0;
        padding: 20px;
    }
    .editArea{
        position: relative;
        height: 73vh;
        margin-top: 1vh;
    }
    .leftBtn{
        display: inline-block;
        width: 50px;
        float: left;
        position: absolute;
        z-index: 99;
        >ul{
            >li{
                color: #00d1b2;
                border: 1px solid #00d1b2;
                height: 100px;
                word-break: break-all;
                width: 38px;
                text-align: center;
                letter-spacing: 2px;
                cursor: pointer;
            }
            .active{
                background-color: #00d1b2!important;
                color: #fff!important;
            }
        }
    }
    .rightEditAra{
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #00b7ee;
        padding-left: 50px;
    }

    .cover{
        position:-ms-page;
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
        margin: -87.5px -181px;
        box-shadow: 0 0 5px 1px #d3e9f9;
    }
    .coverContent .button{
        height: 30px;
        width: auto;
        color:#00B8EE;
        background-color: #fff ;
        border: 1px solid #00B8EE;
        border-radius: 3px;
        line-height: 30px;
        margin: auto;
    }
    .coverContent .button:hover{
        color: #00B8EE;
        background-color: #fff;
    }
    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 10px 20px;
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

    .coverContent ul li:nth-of-type(2){
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(2):hover{
        color: #00B8EE;
        background: #fff;
    }

</style>
