<template>
    <div class="sys-page">
        <div class="container">
            <el-container>
                <el-header>
                    <div class="choose">
                        <ul class="flexPublic">
                            <li v-show="!isedit"  @click="edit">修改</li>
                            <li v-show="isedit" @click="save">保存</li>
                            <li @click="Backups">备份</li>
                            <li>恢复</li>
                            <li @click="testFile">附件</li>
                        </ul>
                    </div>
                </el-header>
                <el-main>
                     <h4 class="addTitle">基层组织账套管理</h4>
                    <div class="container" v-if='isedit'>
                        <el-form :model="orgForm" :rules="rules" ref="orgForm" class="orgform" label-width="200px" label-position="right" v-loading.fullscreen.lock="loading">
                            <el-form-item label="工会名称：" prop="OrgName">
                                <el-input v-model="orgForm.OrgName" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码：" prop="EnterpriseCode">
                                <el-input v-model="orgForm.EnterpriseCode" class="pic-input"></el-input>
                                <el-upload
                                    ref="uploadEnterprise"
                                    class="avatar-uploader"
                                    action=""
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :http-request='uploadFileMethodEnterprise'>
                                    <img v-if="orgForm.EnterpriseAttachment" :src="picUrl+orgForm.EnterpriseAttachment" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="单位地址：">
                                <el-input v-model="orgForm.Address" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                <el-input v-model="orgForm.TelePhone" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="隶属工会：" prop="ParentName">
                                <el-input v-model="orgForm.ParentName" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="会计制度：">
                                <el-input v-model="orgForm.AccountSystem" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="启用日期：">
                                <el-date-picker
                                    v-model="orgForm.EnableTime"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="工会主席：" prop="Chairman">
                                <el-input v-model="orgForm.Chairman" class="pic-input"></el-input>
                                <el-upload
                                    ref="uploadChairman"
                                    class="avatar-uploader"
                                    action=""
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :http-request='uploadFileMethodChairman'>
                                    <img v-if="orgForm.ChairmanAttachment" :src="picUrl+orgForm.ChairmanAttachment" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="经审会主任：" prop="Director">
                                <el-input v-model="orgForm.Director" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="使用期限：">
                                <el-date-picker
                                    v-model="orgForm.ServiceStartTime"
                                    type="date"
                                    placeholder="选择开始日期">
                                </el-date-picker>
                                --
                                <el-date-picker
                                    v-model="orgForm.ServiceEndTime"
                                    type="date"
                                    placeholder="选择结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="container" v-else>
                        <ul>
                            <li class="orgedit-linehight">
                               <div class="orgedit-title"><span class="orgtitle-ringt">工会名称：</span></div>
                               <div class="orgedit-value">{{orgForm.OrgName}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">统一社会信用代码：</span></div>
                                <div class="orgedit-value">{{orgForm.EnterpriseCode}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">单位地址：</span></div>
                                <div class="orgedit-value">{{orgForm.Address}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">联系电话：</span></div>
                                <div class="orgedit-value">{{orgForm.TelePhone}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">隶属工会：</span></div>
                                <div class="orgedit-value">{{orgForm.ParentName}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">会计制度：</span></div>
                                <div class="orgedit-value">{{orgForm.AccountSystem}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">启用日期：</span></div>
                                <div class="orgedit-value">{{orgForm.EnableTime}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">工会主席：</span></div>
                                <div class="orgedit-value">{{orgForm.Chairman}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">经审会主任：</span></div>
                                <div class="orgedit-value">{{orgForm.Director}}</div>
                            </li> 
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">使用期限：</span></div>
                                <div class="orgedit-value">{{orgForm.ServiceStartTime}}-{{orgForm.ServiceEndTime}}</div>
                            </li> 
                        </ul>
                    </div>
                </el-main>
            </el-container>
            <!-- 附件弹出框 -->
            <el-dialog title="选择附件" :visible.sync="fileVisible" width="40%">
                <picture-upload class="pictrueUpload" @uploadimg="uploadimg" :imgList="imglist" :limit="3" @removeimg="removeimg"></picture-upload>
            </el-dialog>
        </div>
    </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
import UserInfo from "@/util/auth";
import { SysOrgModel,SysOrgUpdate,SysOrgUploadFile,SysOrgDelete } from '@/api/organize/orgInfo'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import pictureUpload from "@/components/upload";

export default {
    name: 'demo',
    data(){
        return {
            isedit:false,
            loading: false,
            fileVisible:false,
            imglist:[
                { 
                    PhId:0,
                    BTable:'gcw3_voucher_mst',
                    BName:'aa.jpg',
                    BType:'.jpg',
                    BSize:'203',
                    BFilebody:'',
                    BUrlPath:'/UpLoadFiles/Voucher/2018-12-07/62ad64e635a3435d82b6cc1c770124f7.jpg',
                    BRemark:'',
                    RelPhid:''
                }
            ],
            orgForm:{
                PhId:0,
                OrgName:'',
                EnterpriseCode:'',
                EnterpriseAttachment:'',
                Address:'',
                TelePhone:'',
                ParentName:'',
                AccountSystem:'',
                EnableTime:'',
                Chairman:'',
                ChairmanAttachment:'',
                Director:'',
                ServiceStartTime:'',
                ServiceEndTime:''
            },
            rules:{
                OrgName:[
                    { required: true, message: '请输入工会名称', trigger: 'blur' },
                ],
                EnterpriseCode:[
                    { required: true, message: '请输入统一社会信用代码：', trigger: 'blur' },
                ],
                ParentName:[
                    { required: true, message: '请输入隶属工会：', trigger: 'blur' },
                ],
                Chairman:[
                    { required: true, message: '请输入工会主席：', trigger: 'blur' },
                ],
                Director:[
                    { required: true, message: '请输入经审会主任：', trigger: 'blur' },
                ]
            }
        }
    },
    //组件
    components: {
        pictureUpload
    },
    created() {
       
    },
    mounted(){
         this.getData();
    },
    computed:{
        ...mapState({
            userid: state => state.user.userid,
            orgid: state => state.user.orgid
        }),
        picUrl:function(){
             return httpConfig.baseurl;
        }
    },
    watch:{
        "orgForm.ServiceTime"(val){           
            this.orgForm.ServiceStartTime=''
            this.orgForm.ServiceEndTime=''
        }
    },
    methods: {
        ...mapActions({
            uploadFile: 'uploadFile/Orgupload'
        }),
        //修改编辑页显示
        edit(){
            this.isedit=true
        },
        //修改保存
        save(){
           var route=this.$route;
           var vm=this;
           this.loading = true;
         
          //提交asiox
          SysOrgUpdate(vm,{
              otype:'edit',
              uid:this.userid,
              orgid:this.orgid,
              infoData: this.orgForm
          }).then(res => {
              this.loading = false;
              if(res.Status=='success'){
                this.isedit=false
                this.getData();              
                //移除TagNav
                //this.$store.commit("tagNav/removeTagNav", route);
                //跳转路由
                //this.$router.push('/system/organization');
              }else{
                  this.$message.error('保存失败,请重试!');
              }
          }).catch(error =>{
            console.log(error);
            this.loading = false;
            this.$message.error('保存组织错误');
          })
        },
        //获取组织信息
        getData(){
            var vm=this;
            this.loading = true;

            SysOrgModel(vm,{
                id:this.orgid,
                uid: this.userid,
                orgid: this.orgid
            }).then(res => {
                this.loading = false;
                if(res.Status==="error"){
                    this.$message({ showClose: true, message: res.Msg, type: 'error'});
                    return;
                }
                this.orgForm=res; 

            }).catch(error =>{
                console.log(error);
                this.loading = false;
                this.$message({
                    showClose: true,
                    message: '组织信息获取错误',
                    type: 'error'
                })
            })
        },
        //备份
        Backups(){

            alert('正在开发.....')
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
        beforeAvatarUpload(file) {
            const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif') || (file.type === 'image/jpg');
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isRightType) {
                this.$message.error('上传图片只能是 JPG,png,gif,jpeg 格式!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false
            }
        },
        uploadFileMethodEnterprise(param) {
            let fileObject = param.file;
            let formData = new FormData();
            formData.append('id', this.orgForm.PhId)
            formData.append("file", fileObject);

            this.uploadFile(formData).then(res => {
                if(res.Status==='error'){
                    this.$message.error(res.Msg);
                    return
                }
                //回传的上传临时文件
                if(res.Data[0]){
                    this.orgForm.EnterpriseAttachment = res.Data[0];
                    this.$message.success("上传成功");
                }

            }).catch(error => {      
                console.log(error);
                this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
            })
        },
        uploadFileMethodChairman(param){
            let fileObject = param.file;
            let formData = new FormData();
            formData.append('id', this.orgForm.PhId)
            formData.append("file", fileObject);

            this.uploadFile(formData).then(res => {
                if(res.Status==='error'){
                    this.$message.error(res.Msg);
                    return
                }

                //回传的上传临时文件
                if(res.Data[0]){
                    this.orgForm.ChairmanAttachment = res.Data[0];
                    this.$message.success("上传成功");
                }

            }).catch(error => {      
                console.log(error);
                this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
            })
        },

        testFile(){
            //this.fileVisible=true;
           
        },
        removeimg(item,deleValue) {
            this.imglist=item;
            console.log(item)

            var param={
                PhId:deleValue.phid,
                BTable:'gcw3_voucher_mst',
                BUrlPath:deleValue.imgPath
            };

            this.$axios({
                url: '/PVoucherAttachment/PostDeleteFile',
                method: "post",
                data: param,
            }).then(res => {
               if(res.Status==="error"){
                    this.$message({ showClose: true, message: res.Msg, type: 'error'});
                    return;
                }

            }).catch(error => {
                console.log(error);
                this.$message({ showClose: true, message: '附件删除错误', type: 'error'});
            });
        },
        uploadimg(item) {
            //console.log(item)
            this.imglist.push(item);
        }
    }
}
</script>
<style scoped>

.choose{
  background:#fff;
  padding:5px;
  font-size: 15px;
}
  .choose>ul{
    justify-content: flex-end;
  }
.choose>ul>li{
  margin-left:15px;
  padding:2px 8px;
  border:1px solid #ff9900;
  border-radius: 3px;
  cursor:pointer;
}
.choose>ul>li:hover{
  background: #ff9900;
  color:#fff;
}
.addTitle{
    font-size: 18px;
    font-size: 18px;
    text-align: center;
    padding-bottom: 10px;
}
.pic-input{
    width: 80%;
    float: left;
}
.orgedit-linehight{
    height: 40px;
    border: 1px solid #d9d9d9;
    line-height: 40px;
}
.orgedit-title{
    height: 100%;
    width: 30%;
    float: left;
    color: #fff;
    font-size: 18px;
    background: #00B8EE;
}
.orgtitle-ringt{
    float: right;
}
.orgedit-value{
    height: 100%;
    width: 60%;
    float: left;
    font-size: 18px;
    margin-left: 10px;
}
</style>
<style>
.avatar-uploader{
    position: absolute;
    z-index: 1;
    right: 61px;
    top: -20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader .el-upload--text{
    width: 80px;
    height: 80px;
}

.avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
}
.avatar {
    width: 80px;
    height: 80px;
    display: block;
}
.orgform .el-form-item__label{
    background: #00B8EE;
}

.orgform .el-form-item{
    margin-bottom: 2px;
}
.pictrueUpload{
    width:100%;
    height:100%;
}
</style>
