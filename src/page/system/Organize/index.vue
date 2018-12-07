<template>
    <div class="sys-page">
        <div class="container">
            <el-container>
                <el-header>
                    <div class="choose">
                        <ul class="flexPublic">
                            <li @click="save">修改</li>
                            <li @click="Backups">备份</li>
                            <li>恢复</li>
                        </ul>
                    </div>
                </el-header>
                <el-main>
                     <h4 class="addTitle">基层组织账套管理</h4>
                    <div class="container">
                        <el-form :model="orgForm" :rules="rules" ref="orgForm" label-width="200px" label-position="right" size="mini" v-loading.fullscreen.lock="loading">
                            <el-form-item label="工会名称：" prop="OrgName">
                                <el-input v-model="orgForm.OrgName"></el-input>
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
                                <el-input v-model="orgForm.Address"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                <el-input v-model="orgForm.TelePhone"></el-input>
                            </el-form-item>
                            <el-form-item label="隶属工会：" prop="ParentName">
                                <el-input v-model="orgForm.ParentName"></el-input>
                            </el-form-item>
                            <el-form-item label="会计制度：">
                                <el-input v-model="orgForm.AccountSystem"></el-input>
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
                                <el-input v-model="orgForm.Director"></el-input>
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
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UserInfo from "@/util/auth";
import { SysOrgModel,SysOrgUpdate,SysOrgUploadFile,SysOrgDelete } from '@/api/organize/orgInfo'
import ajaxhttp from '@/util/ajaxConfig' //自定义ajax头部配置*****

export default {
    name: 'demo',
    data(){
        return {
            loading: false,
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
        
    },
    created() {
        this.getData();
    },
    mounted(){
        console.log(this.$store.state.user);
    },
    computed:{
        ...mapState({
            userid: state => state.user.userid,
            orgid: state => state.user.orgid
        }),
        picUrl:function(){
             return ajaxhttp.url;
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
                //移除TagNav
                this.$store.commit("tagNav/removeTagNav", route);
                //跳转路由
                this.$router.push('/home');
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
                //加载附件地址
                // if(res.EnterpriseAttachment){
                //     res.EnterpriseAttachment= this.picUrl + res.EnterpriseAttachment
                // }

                // if(res.ChairmanAttachment){
                //     res.ChairmanAttachment= this.picUrl + res.ChairmanAttachment
                // }
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
</style>
<style>
.avatar-uploader{
    width: 20%;
    float: left;
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
</style>
