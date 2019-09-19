<template>
    <div class="orgVerify">
        <div class="endTime">
            <div>到期服务提醒:&nbsp;&nbsp;距离到期</div>
            <div>
                <div class="inputContainer">
                    <input @keyup="onlyNum($event)" type="text"  :class="{inputDisabled:!endTimeOpen}" :disabled="!endTimeOpen" v-model="endTime">
                </div>
            </div>
            <span>天</span>
            <el-switch style="position:relative;top:-3px"
                v-model="endTimeOpen"
                @change="saveEndTime"
                active-color="#13ce66"
                inactive-color="#ccc">
            </el-switch>
            <span>{{endTimeOpen?'编辑中...':'执行中...'}}</span>
        </div>
        <div  class="content">
            <div class="loadContainer">
                <el-row :gutter="70">
                    <el-col :span="12">
                        <div class="loadContent" @click.stop="downloadSel=true">
                            <el-row  :gutter="30">
                                <el-col :span="12">
                                    <img src="../../../assets/images/dc.png" alt="">
                                </el-col>
                                <el-col style=" padding-top: 20px;" :span="12">
                                    <div class="loadTitle">导出</div>
                                    <div class="loadName">授权组织</div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="loadContent" @click.stop="uploadSel=true">
                            <el-row :gutter="30">
                                <el-col :span="12">
                                    <img src="../../../assets/images/dr.png" alt="">
                                </el-col>
                                <el-col style=" padding-top: 20px;" :span="12">
                                    <div class="loadTitle">导入</div>
                                    <div class="loadName">授权组织</div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div @click.stop="downloadSel=false"  v-if="downloadSel" class="downLoadSelCon">
            <div @click.stop="0" class="downLoadSel">
                <p>筛选条件设置 <i @click="downloadSel=false" class="el-icon-close"></i></p>
                <ul>
                    <li>
                        <div>距离到期</div>
                        <div>
                            <i @click.stop="add(false)" class="el-icon-minus"></i>
                            <div class="inputContainer">
                                <input @keyup="onlyNum($event)" type="text" v-model="downloadEndTime">
                            </div>
                            <i @click.stop="add(true)" class="el-icon-plus"></i>
                            <span>天</span>
                        </div>
                    </li>
                    <li>
                        <div style="position:relative;top:-5px;">组织编码类型</div>
                        <div>
                            <div class="selectContainer">
                                <select >
                                    <option value="">全部</option>
                                    <option value="basic">一般工会</option>
                                    <option value="industry">产业工会</option>
                                </select>
                            </div>
                        </div>
                    </li>
                    <li>
                        <span @click="downloadSel=false" class="btngrey">取消</span>
                        <span @click="downloadTxt" class="btn">确认</span>
                    </li>
                </ul>
            </div>
        </div>
        <div @click.stop="uploadSel=false" v-if="uploadSel" class="upLoadSelCon">
            <div @click.stop="jacascript(0)">
                <i @click.stop="uploadSel=false" class="el-icon-close" style="float:right;cursor:pointer;position:relative;top:-15px;left:10px"></i>
                <el-upload
                    ref="piclist"
                    drag
                    action=""
                    :limit="1"
                    :on-exceed="handleExceed"
                    :before-upload="beforeUpload"
                    :http-request='uploadFileMethod'>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传{{'TXT'}}文件</div>
                </el-upload>
            </div>
        </div>
        <message
            :message="saasMessage.message"
            :visible.sync="saasMessage.visible" >
        </message>
    </div>
</template>

<script>
    import axios from "axios";
    import qs from 'qs';
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState, mapActions } from 'vuex'

    export default {
        name: "verify",
        data(){
            return {
                endTime:'',//到期服务提醒
                endTimeOpen:false,//是否可更改
                downloadSel:false,//导出条件弹窗显示
                downloadEndTime:3,//导出筛选到期时间
                downloadUnionType:'',//导出筛选工会类型
                uploadSel:false,//上传
                saasMessage:{
                    message:'',
                    visible:false
                }
            }
        },
        mounted(){
          this.getEndTime();
        },
        //计算
        computed: {
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                username:state=> state.user.username,
                invitationCode: state=> state.user.invitationCode,
                dbname:state=>state.user.dbname,
            })
        },
        methods: {
            //加密导出
            downloadTxt(){
                var param={
                    date:this.downloadEndTime,
                    type:this.downloadUnionType,
                    isbasic:'',
                }
                let base = httpConfig.getAxiosBaseConfig();
                this.$axios.get('/SysOrganize/GetOrganizeTxt',{params:param})
                    .then(res => {
                    //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;

                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        // console.log(window.open)
                        //  ;
                        // alert(window.location.href)
                        window.open( base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename);
                    }
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },


            handleExceed(){
                console.log(222)
                this.saasMessage={
                    message:'一次只能上传一个文件!',
                    visible:true
                }

            },
            //上传文件前
            beforeUpload(file){
                if(file.type!='text/plain'){
                    this.saasMessage={
                        message:'只能上传TXT文件!',
                        visible:true
                    }
                    return false
                }
            },
            //上传文件方法 //加密导入
            uploadFileMethod(param){
                var url='/SysOrganize/PostInportTxt'
                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);

                let loading=this.$loading();
                loading.setText('文件正在上传...')
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();

                let config_header = { "Content-Type": "multipart/form-data" };
                var new_header = Object.assign({},config_header, baseheader);

                axios.create(base).post(url, formData, { headers:new_header }).then(res => {
                    loading.close();
                    var data=JSON.parse(res.data);
                    if(data.Status=='success'){
                        this.saasMessage={
                            message:data.Msg,
                            visible:true
                        }
                        this.uploadSel=false;
                    }else {
                        this.saasMessage={
                            message:data.Msg,
                            visible:true
                        }
                    }

                }).catch(err=>{
                    loading.close();
                    this.$message({ showClose: true,message: '导入出错了!', type: "error"})
                })
            },
            //获取提醒时间
            getEndTime(){
                this.$axios.get('SysUser/GetSystemConfig')
                    .then(res=>{
                        if(res.Status=='error'){
                            this.saasMessage={
                                message:res.Msg,
                                visible:true
                            }
                        }else{
                            this.endTime=res.Value
                        }
                    })
                    .catch(err=>{
                        this.saasMessage={
                            message:'获取提醒时间失败了!',
                            visible:true
                        }
                    })
            },
            //修改提醒时间
            saveEndTime(bool){
                if(bool){

                }else{
                    var data={
                        infoData:{
                            Value:this.endTime
                        }
                    }
                    this.$axios.post('SysUser/PostUpdateSystemConfig',data)
                        .then(res=>{
                            if(res.Status=='success'){
                                this.saasMessage={
                                    message:'修改提醒时间成功!',
                                    visible:true
                                }
                            }else{
                                this.saasMessage={
                                    message:res.Msg,
                                    visible:true
                                }
                                this.getEndTime();
                            }
                        })
                        .catch(err=>{
                            this.saasMessage={
                                message:'修改提醒时间失败了!',
                                visible:true
                            }
                            this.getEndTime();
                        })
                }
            },
            //日期加减
            add(bool){
                if(bool){
                    this.downloadEndTime=parseInt(this.downloadEndTime)+1;
                }else if(this.downloadEndTime>0){
                    this.downloadEndTime=parseInt(this.downloadEndTime)-1;
                }
            },
            //只能输入数字
            onlyNum(event){
                var obj=event.target;
                obj.value = obj.value.replace(/[^\d]/g,"");  //清除“数字”以外的字符
                obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
                if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                    obj.value= parseFloat(obj.value);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .orgVerify{
        width:100%;
        height:100%;
        padding:20px;
        font-size: 18px;
        color:#3bbcd9;
        >.endTime{
            width:520px;
            height:30px;
            line-height: 30px;
            float:right;
            letter-spacing: 4px ;
            >div{
                display: inline-block;
                >.inputContainer{
                    width:40px;
                    height:22px;

                    display: inline-block;

                    >input{
                        padding-top: 0;
                        color:red;
                        padding-right:0;
                        padding-left:2px;
                    }
                }
            }
            .inputDisabled{
                background: #ccc;
            }
        }
        .content{
            width:100%;
            height:100%;
            text-align: center;
            >div{
                display: inline-block;
                vertical-align: middle;
                height:250px;
                width:100%;
                >div{
                    height:100%;
                    >div {
                        height: 100%;
                        .loadContent {
                            height: 100%;
                            box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.08);
                            border-radius: 4px;
                            padding:35px;
                            cursor:pointer;
                            .loadTitle{
                                font-size: 50px;
                                font-weight: 800;
                            }
                            .loadName{
                                font-size: 40px;
                                font-weight: 400;
                            }
                        }
                    }
                }
            }
            &:after{
                display: inline-block;
                content:'';
                width:0;
                height:100%;
                vertical-align: middle;
            }
        }
        .upLoadSelCon,
        .downLoadSelCon{
            position:-ms-page;
            position:fixed;
            z-index:99;
            left:0;
            right:0;
            top:0;
            bottom:0;
            text-align: center;
            background: rgba(0,0,0,0.5);
            >.downLoadSel{
                    display: inline-block;
                    vertical-align: middle;
                    background: #FFF;
                    width:660px;
                    height:320px;
                    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.08);
                    padding:10px;
                    i{
                        cursor: pointer;
                    }
                    >p{
                        height:40px;
                        line-height: 30px;
                        border-bottom:1px solid #3bbcd9;
                        padding:5px 0;
                        text-align: left;
                        >i{
                            float:right;
                            margin-top:5px;
                            cursor: pointer;
                            &:hover{
                                color:#ccc;
                            }
                        }
                    }
                    >ul{
                        >li{
                            margin-top:30px;
                            height:40px;
                            line-height: 40px;

                            >div{
                                font-size: 22px;
                                font-weight: 400;
                                letter-spacing: 2px;
                                display: inline-block;
                                .selectContainer{
                                    border:0;
                                    border-radius: 0;
                                    border-bottom:1px solid #3bbcd9;
                                    width:200px;
                                   overflow: hidden;
                                    height:100%;
                                }
                                .inputContainer{
                                    width:100px;
                                    height:25px;
                                }
                                >div{
                                    display: inline-block;
                                }
                                &:first-of-type{
                                    margin-right:20px;
                                }
                            }
                            &:last-of-type{
                                margin-top:50px;
                                >span{
                                    margin-right:30px;
                                    height:40px;
                                    line-height: 40px;
                                    width:120px;
                                }
                            }
                        }
                    }
            }
            &:after{
                content: '';
                display: inline-block;
                vertical-align: middle;
                width:0;
                height:100%;
            }
        }
        .upLoadSelCon{
            >div{
                display: inline-block;
                background: #fff;
                padding:20px;
                width:600px;
                height:300px;
                box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.08);

            }
        }
    }

</style>
<style>
    .upLoadSelCon div.el-upload--text {
            width:500px;
            height:215px;
            margin:0 auto;
        }
    .upLoadSelCon div.el-upload--text>.el-upload-dragger {
        width:100%;
        height:100%;
        padding-top: 30px;
    }

</style>
