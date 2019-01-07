<template>
  <div class="sys-page">
    <div class="container">
            <el-container>
                <el-header>
                    <div class="unionState flexPublic">
                        <ul class="flexPublic">
                            <li class="flexPublic">
                            </li>
                        </ul>
                        <ul class="flexPublic handle" style="float: right">
                            <a>
                                <li @click="publish" style='margin:0 0 0px 10px;'>发布</li>
                            </a>
                        </ul>
                    </div>
                </el-header>
                <el-main style="width: 900px; min-height: 500px; margin: 0 auto">
                    <el-upload
                        ref="piclist"
                        action=""
                        list-type="picture-card"
                        :file-list="fileList"
                        :before-upload="beforeUploadPic"
                        :http-request='uploadFileMethod'
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-main>
            </el-container>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import httpConfig from '@/util/ajaxConfig'

//文章新增、编辑
export default {
  name: "picture-list",
  components: { },
  data() {
    return {
        listInfo:[],      //图片列表信息
        fileList: [],     //图片信息
        pageSize: 20, //pageSize
        pageIndex: 1, //pageIndex
        total:0
    }
  },
  created() {

  },
  //加载数据
  mounted(){
      this.getData();
  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          username: state => state.user.username,
          orgid: state => state.user.orgid
      }),
      picUrl: function () {
        return httpConfig.baseurl;
      }
  },
  methods: {
        ...mapActions({
            PicUpload: 'uploadFile/PicUpload'
        }),
        //获取图片信息
        getData(){
            let data = {
                uid: this.uid,
                orgid: this.orgid,
                pagesize:this.pageSize,
                pageindex:this.pageIndex-1
            };
            this.fileList=[];

            this.$axios.get('/SysPicture/GetSysPictureQueryList',{ params:data })
                .then(res=>{

                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }

                    this.listInfo=res.list;
                    this.total=Number(res.Total);

                    if (this.listInfo.length != 0) {
                        var url=this.picUrl;
                        this.listInfo.forEach(el =>{
                            this.fileList.push({ phid:el.PhId,url: url+ el.Picpath,name:el.Title });
                        })
                    }

                })
                .catch(err=>{
                    console.log(err)
                    this.$message({ showClose: true,message: "图片获取错误", type: "error"});
                })
        },
        //保存按钮
        onSubmit(){

        },
        //发布按钮
        publish(){
            //发布图片
            
        },
        //图片类型判断
        beforeUploadPic(file){
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
        //图片上传
        uploadFileMethod(param){
            let fileObject = param.file;
            let formData = new FormData();
            formData.append("file", fileObject);
            formData.append("PhId", 0);
            formData.append("PositionType", "top");
            formData.append("Title", fileObject.uid);
            formData.append("Author", this.username);    

            this.PicUpload(formData).then(res => {
                if (res.Status === 'error') {
                    this.$message.error(res.Msg);
                    return
                }

                //清空已上传的文件列表
                this.$refs.piclist.clearFiles();
                //重新加载
                this.getData();

            }).catch(error => {
                console.log(error);
                this.$message({showClose: true, message: '上传附件失败', type: 'error'})
            })
        },
        //图片移除
        handleRemove(file, fileList){
            //筛选数据
            var delobj=this.listInfo.find(v =>{ 
               return v.PhId===file.phid
            });

            //删除文件对象 
            let deledata={
                uid: this.uid,
                orgid: this.orgid,
                infoData:delobj
            };

            this.$axios({
                url: '/SysPicture/PostDeleteSysPicture',
                method: "post",
                data: deledata,
            }).then(res => {
                if (res.Status === "error") {
                    this.$message({showClose: true, message: res.Msg, type: 'error'});
                    return;
                }
            }).catch(error => {
                console.log(error);
                this.$message({showClose: true, message: '附件删除错误', type: 'error'});
            });
        }
  }
}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>

</style>
<style>
    .el-upload-list--picture-card .el-upload-list__item{
        width: 350px;
        height: 200px;
    }
</style>