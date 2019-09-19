<template>
    <div class="timeSelect" style="font-size:18px">
        <div class="container">
           <div class="manageContent">
               <div class="unionState">
                  <ul>
                      <li :class="{activeNav:choosedNav=='us'}" @click="chooseNav('us')"><span>联系我们</span></li>
                      <li :class="{activeNav:choosedNav=='qq'}" @click="chooseNav('qq')"><span>QQ/微信</span></li>
                      <li :class="{activeNav:choosedNav=='bq'}" @click="chooseNav('bq')"><span>版权</span></li>
                      <li :class="{activeNav:choosedNav=='pn'}" @click="chooseNav('pn')"><span>平台名称</span></li>
                  </ul>
               </div>
               <div class="formData">
                   <div class="editBtn">
                       <template v-if="edit">
                           <button class="cancelBtn" @click="cancelEdit">取消</button>
                           <button @click="saveEdit">保存</button>
                       </template>
                      <template v-else>
                          <button @click="editClick">修改</button>
                      </template>
                   </div>
                    <div v-if="choosedNav=='us'" class="editArea">
                        <ul>
                            <li>
                                <div>联系电话</div>
                                <div>
                                    <input v-model="linkusForm.linkphone" @keyup="verifyPhone">
                                </div>
                            </li>
                            <li>
                                <div>客服QQ</div>
                                <div>
                                    <input v-model="linkusForm.customservice" @keyup="verifyPhone">
                                </div>
                            </li>
                            <li>
                                <div>公司传真</div>
                                <div>
                                    <input v-model="linkusForm.fax" @keyup="verifyPhone">
                                </div>
                            </li>
                            <li>
                                <div>联系邮箱</div>
                                <div>
                                    <input v-model="linkusForm.email">
                                </div>
                            </li>
                            <li>
                                <div>公司网址</div>
                                <div>
                                    <input v-model="linkusForm.weburl">
                                </div>
                            </li>
                            <li>
                                <div>公司地址</div>
                                <div>
                                    <input v-model="linkusForm.address">
                                </div>
                            </li>
                        </ul>
                    </div>
                   <div v-if="choosedNav=='qq'"  class="editArea">
                            <div style="margin-top: 50px">
                                <div :class="{'disableLoad':!edit}" style="float: left;text-align: center;width: 30%;">
                                    <el-upload
                                        ref="qqImg"
                                        action="qq"
                                        list-type="picture-card"
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove"
                                        :http-request='uploadFileMethod'
                                        :file-list="qqForm.qqImg"
                                        :auto-upload="false"
                                        :limit="1" >
                                        <i class="el-icon-plus"></i>
                                        <div slot="tip" class="el-upload__tip">QQ客服二维码上传</div>
                                    </el-upload>
                                </div>
                                <div :class="{'disableLoad':!edit}" style="float: left;text-align: center;width: 30%;">
                                    <el-upload
                                        ref="weiImg"
                                        action="weChat"
                                        list-type="picture-card"
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove"
                                        :http-request='uploadFileMethod'
                                        :file-list="qqForm.weiImg"
                                        :limit="1"
                                        :auto-upload="false"
                                    >
                                        <i class="el-icon-plus"></i>
                                        <div slot="tip" class="el-upload__tip">微信公众号二维码上传</div>
                                    </el-upload>
                                </div>
                            </div>

                   </div>
                   <div v-if="choosedNav=='bq'" class="editArea">
                       <ul>
                           <li>
                               <div>网站备案</div>
                               <div>
                                   <input v-model="bqFrom.keeprecord">
                               </div>
                           </li>
                           <li>
                               <div>版       权</div>
                               <div>
                                   <input v-model="bqFrom.copy">
                                   <!--<span style="padding-left: 20px">Copyright  @</span>
                                   <input style="width: 540px" v-model="bqFrom.copy">
                                   <span>.All Rights Reserved</span>-->
                               </div>
                           </li>
                           <li>
                               <div>主办单位</div>
                               <div>
                                   <input v-model="bqFrom.hostunit">
                               </div>
                           </li>
                           <li>
                               <div>发行单位</div>
                               <div>
                                   <input v-model="bqFrom.publishunit">
                               </div>
                           </li>
                           <li>
                               <div>技术支持</div>
                               <div>
                                   <input v-model="bqFrom.supportunit">
                               </div>
                           </li>
                       </ul>
                   </div>
                   <div v-if="choosedNav=='pn'" class="editArea">
                       <ul>
                           <li>
                               <div>平台名称</div>
                               <div>
                                   <input @change="changedName()" v-model="pnForm.platformname">
                               </div>
                           </li>
                           <li>
                               <div>LOGO</div>
                               <div :class="{'disableLoad':!edit}">
                                  <el-upload
                                        ref="loadImg"
                                        action=""
                                        list-type="picture-card"
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove"
                                        :on-change="handleChange"
                                        :http-request='uploadFileMethod'
                                        :file-list="pnForm.fileList"
                                        :limit="1"
                                        :auto-upload="false"
                                  >
                                  <i class="el-icon-plus"></i>
                                  </el-upload>
                               </div>
                           </li>
                       </ul>
                   </div>
               </div>
           </div>
            <el-dialog :visible.sync="dialogVisible">
                <img :src="dialogImgUrl" width="100%">
            </el-dialog>
        </div>

        <message :message="saasMessage.message" :visible.sync="saasMessage.visible"></message>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    export default {
        name: "index",
        data(){
            return{
                choosedNav:'us',//选择的栏目
                edit:false,//是否修改,true表示可修改，false表示不可修改
                linkusForm:{
                    address: "",
                    customservice: "",
                    email: "",
                    fax: "",
                    linkphone: "",
                    weburl: ""
                },
                qqForm:{
                    qqImg:[],
                    weiImg:[]
                },
                bqFrom:{
                    copy: "",
                    hostunit: "",
                    keeprecord: "",
                    publishunit: "",
                    supportunit: ""
                },
                pnForm:{
                    fileList:[],
                    logo: "/UpLoadFiles/SysPicture/2019-04-13/logo2.png",
                    platformname: ""
                },
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'' //消息主体内容**************
                },
                dialogImgUrl:'',//弹窗显示图片
                dialogVisible:false,//弹窗显示隐藏

                isChangedImg:false, //记录图片是否已被修改
                isChangedName:false // 记录名称是否被修改
            }
        },
        mounted(){
          this.disableInput(true);
          this.getDataByType();
        },
        methods:{
            //选择栏目
            chooseNav:function(type){
                this.choosedNav=type;
                this.edit=false;
                //调用input禁用方法
                this.$nextTick(() => {
                    this.disableInput(true);
                    this.getDataByType();
                })

            },
            //input禁用方法  type:true-禁用  false-取消禁用
            disableInput:function(type){
                let inputList = document.getElementsByTagName("input");
                console.log(inputList);
                for(let i=0; i< inputList.length; i++){
                    if(type){
                        inputList[i].setAttribute('disabled',type);
                    }else{
                        inputList[i].removeAttribute('disabled')
                    }
                }
            },
            //数据查询
            getDataByType:function(){
                let type='linkus';
                switch (this.choosedNav) {
                    case 'us':
                        type='linkus';
                        break;
                    case 'qq':
                        type='linkus2';
                        break;
                    case 'bq':
                        type='copyright';
                        break;
                    case 'pn':
                        type='platform';
                        break;
                    default:
                        this.saasMessage={
                            visible:true,  //消息弹出框*******
                            message:'数据获取失败，请重试' //消息主体内容**************
                        };
                        break;
                }
                let data={
                    value:type
                }
                this.$axios.get('SysMessage/GetSysSettingMessage',{params:data}).then(res=>{
                    console.log(res);
                    switch (this.choosedNav) {
                        case 'us':
                            this.linkusForm=res['linkus'];
                            break;
                        case 'qq':
                            this.qqForm=res['linkus2'];
                            let qqImg={},weiImg={};
                            if(res['linkus2'].qq!=''){
                                qqImg={
                                    name:'qq',
                                    url:httpConfig.baseurl+res['linkus2'].qq
                                };
                                this.qqForm['qqImg']=[qqImg];
                            }
                            if(res['linkus2'].wechat!=''){
                                weiImg={
                                    name:'wechat',
                                    url:httpConfig.baseurl+res['linkus2'].wechat
                                };
                                this.qqForm['weiImg']=[weiImg];
                            }

                            break;
                        case 'bq':
                            this.bqFrom=res['copyright'];
                            break;
                        case 'pn':
                            this.pnForm=res['platform'];
                            if(res['platform'].logo!=''){
                                let fileList={
                                    name:'logo',
                                    url:res['platform'].logo?httpConfig.baseurl+res['platform'].logo:''
                                };
                                this.pnForm['fileList']=[fileList];
                            }
                            break;
                        default:
                            this.saasMessage={
                                visible:true,  //消息弹出框*******
                                message:'数据获取失败，请重试' //消息主体内容**************
                            };
                            break;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            //修改按钮点击事件
            editClick:function(){
                this.edit=true;
                this.disableInput(false);
            },
            //保存修改
            saveEdit:function(){
                //禁用input修改
                this.disableInput(true);
                this.edit=false;
                //判断需要修改的内容
                let type='linkus';
                let data=new FormData();
                let requestType=0;//发起请求的类型，多文件上传--1 还是普通表单--0
                switch (this.choosedNav) {
                    case 'us':
                        //data=this.linkusForm;
                        for(var i in this.linkusForm){
                            data.append(i,this.linkusForm[i]);
                        }
                        break;
                    case 'qq':
                        console.log(this.$refs.qqImg);
                        console.log(this.$refs.weiImg);
                        if(this.$refs.qqImg.uploadFiles.length==0){
                            console.log('删除图片');
                            data.append('qq','');
                        }else{
                            if(this.$refs.qqImg.uploadFiles[0].url!=this.$refs.qqImg.fileList[0].url){
                                this.$refs.qqImg.submit();
                            }else{
                                console.log('qq图片未更换');
                            }
                        }
                        if(this.$refs.weiImg.uploadFiles.length==0){
                            data.append('wechat','');
                        }else{
                            if(this.$refs.weiImg.fileList.length==0||this.$refs.weiImg.uploadFiles[0].url!=this.$refs.weiImg.fileList[0].url){
                                this.$refs.weiImg.submit();
                            }else{
                                console.log('微信图片未更换');
                            }
                            //this.$refs.weiImg.submit();
                        }
                        break;
                    case 'bq':
                        for(var i in this.bqFrom){
                            data.append(i,this.bqFrom[i]);
                        }
                        requestType=0;
                        break;
                    case 'pn':
                        if(this.$refs.loadImg.uploadFiles.length==0){
                            data.append('logo','');
                            data.append('platformname',this.pnForm.platformname);
                        }else {
                            if(this.$refs.loadImg.fileList.length==0||this.$refs.loadImg.uploadFiles[0].url!=this.$refs.loadImg.fileList[0].url){
                                this.$refs.loadImg.submit();
                            }else{
                                data.append('platformname',this.pnForm.platformname);
                            }
                        }

                       /* if (this.isChangedImg &&this.isChangedName){
                            this.$refs.loadImg.submit();
                        }else {
                            this.isChangedName = false;
                            this.isChangedImg = false;
                            this.getDataByType()
                        }

                        return;
                        */
                        break;
                    default:
                        this.saasMessage={
                            visible:true,  //消息弹出框*******
                            message:'数据获取失败，请重试' //消息主体内容**************
                        };
                        break;
                }
                this.postUpload(data);

            },
            //取消修改
            cancelEdit:function(){
                this.isChangedName = false;
                this.isChangedImg = false
                //禁用input修改
              this.disableInput(true);
              this.edit=false;
              //重新查询数据，防止页面改动
                this.getDataByType()
            },
            //图片删除事件
            handleRemove:function(file,fileList){
                console.log(file,fileList)
            },
            //图片预览事件
            handlePictureCardPreview:function(file){
                this.dialogImgUrl = file.url;
                this.dialogVisible = true;
            },
            //图片上传
            uploadFileMethod(param) {
                let formData = new FormData();
                formData.append('file',param.file);
                console.log(param);
                switch (this.choosedNav) {
                    case 'qq':
                        if(param.action=='qq'){
                            formData.append('qq',param.file.name || '');
                        }else{
                            formData.append('wechat',param.file.name || '');
                        }
                        break;
                    case 'pn':
                        formData.append('logo',param.file.name || '');
                        formData.append('platformname',this.pnForm.platformname);
                        break;
                    default:break;
                }
                this.postUpload(formData);
            },
            //修改上传接口封装
            postUpload:function(data){
                let baseheader=httpConfig.getHeaderConfig(this.dbname);

                let base=httpConfig.getAxiosBaseConfig();

                let config_header = { "Content-Type": "multipart/form-data" };
                var new_header = Object.assign({},config_header, baseheader);
                console.log(data);
                axios.create(base).post('SysMessage/PostUpdateSettingMessage', data, { headers:new_header }).then(res=>{
                    let data=JSON.parse(res.data);
                    this.saasMessage={
                        visible:true,  //消息弹出框*******
                        message:data.Msg //消息主体内容**************
                    };
                    this.edit=false;
                    this.getDataByType();
                    this.isChangedName = false;
                    this.isChangedImg = false
                }).catch(err=>{
                    console.log(err);
                    this.isChangedName = false;
                    this.isChangedImg = false
                })
            },
            //手机号限制
            verifyPhone:function(){
                let obj =this.linkusForm.linkphone;
                //obj.value = obj.value.replace(/[\u4e00-\u9fa5]/g,"");  //清除“汉字”和“.”以外的字符
                obj = obj.replace(/[^\d-]/g,"");  //清除“数字”和“.”以外的字符
                this.linkusForm.linkphone=obj;
            },
            //图片改变事件
            handleChange(){
                this.isChangedImg = true
            },
            //标题改变事件
            changedName(){
                this.isChangedName = true
            }
        },
        watch:{
            isChangedName(){
                console.log(this.isChangedName,this.isChangedImg)
            },
            isChangedImg(){
                console.log(this.isChangedName,this.isChangedImg)
            }
        }
    }
</script>

<style scoped>
    .container{
        padding-right: 20px;
    }
    .unionState{
        border-bottom:1px solid #00B8EE;
        height: 30px;
    }
    .unionState ul li{
        display: inline-block;
        float: left;
        width: 100px;
        text-align: center;
        height: 30px;
        vertical-align: bottom;
        cursor: pointer;
    }
    .unionState ul li span{
        display: inline-block;

        text-align: center;
        height: 30px;
        vertical-align: bottom;
    }
    .unionState ul li.activeNav span{
        display: inline-block;
        color: #00b7ee;
        border-bottom:4px solid #00b7ee;
    }
    .editArea ul li{
        height: 60px;
        line-height: 60px;
        vertical-align: center;
        clear: both;
    }
    .editArea ul li>div:nth-of-type(1){
        width: 100px;
        display: inline-block;
        text-align: center;
        float: left;
    }
    .editArea ul li>div:nth-of-type(2){
        width: 800px;
        display: inline-block;
        float: left;
    }
    .editArea input{
        border-width: 0 0 1px 0;
        border-color: #b1bec6;
        height: 40px;
        line-height: 40px;
        width: inherit;
        padding-left: 20px;
    }
    .editBtn{
        height: 40px;
        float: right;
    }
    .editBtn button{
        width: 70px;
        height: 28px;
        border: 1px solid #00B8EE;
        border-radius: 3px;
        background-color: #00B8EE;
        color: #fff;
    }
    .editBtn button:hover{
        background-color: #fff;
        color: #00B8EE;
    }
    .cancelBtn{
        background-color: #fff!important;
        color: #00B8EE!important;
    }

</style>
<style>
    .editArea .el-upload-list--picture-card .el-upload-list__item{
        position: absolute;
        margin: 0px;
    }
    .disableLoad .el-upload-list__item-delete{
        display: none!important;
    }
    .editArea .el-upload-list__item.is-success .el-upload-list__item-status-label{
        display: none !important;
    }
</style>
