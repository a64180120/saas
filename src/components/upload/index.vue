<template>
    <div class="pictureupload">
        <el-upload
            ref="upload"
            action=""
            list-type="picture-card"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request='uploadFileMethod'
            :limit="limit">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ajaxhttp from '@/util/ajaxConfig' //自定义ajax头部配置*****

//附件
export default {
  name: "pictureUpload",
  props: {
    //父组件传递的图片列表
    imgList:{
        type: Array,
        default: []
    },
    //图片数量限制
    limit:''
  },
  data() {
    return {
        fileList: [],
        upLoadData: { img: "" },
        dialogVisible: false,
        dialogImageUrl: ""
    };
  },
  //计算
  computed: {
    ...mapState({
        userid: state => state.user.userid,
        orgid: state => state.user.orgid
    }),
    picUrl:function(){
        return ajaxhttp.url;
    }
  },
  watch:{
    //    imgList:{
    //      handler(newValue, oldValue) {
    //          if(newValue.length === 0) {
    //              this.fileList = [];
    //              return;
    //          }
    //          for (let i = 0; i < newValue.length; i++) {
    //              if (oldValue[i] != newValue[i]) {
    //                 this.fileList = [];
    //                 newValue.forEach(el=>{
    //                      this.fileList.push({url: this.picUrl + el.BUrlPath,phid:el.PhId})
    //                 })
    //                 return;
    //              }
    //          }
    //      },
    //      deep: true
    //   }
  },
  created() {},
  //加载数据
  mounted(){
      var url=this.picUrl;
      this.fileList=[];
      if (this.imgList.length != 0) {
          this.imgList.forEach(el =>{
              this.fileList.push({ phid:el.PhId,url: url+ el.BUrlPath });
          })
      }
  },
  methods: {
        ...mapActions({
            uploadFile: 'uploadFile/Voucherupload'
        }),
        //图片移除时处理数据
        handleRemove(file, fileList) {
            let item = [];
            //删除文件对象 
            let deleValue={
                phid:file.phid,
                imgPath:file.url.replace(this.picUrl,'')
            };

            //文件剩余对象
            this.imgList.forEach(el =>{
                if(el.BUrlPath!==deleValue.imgPath){
                    item.push(el);
                }
            })
            this.$emit("removeimg", item, deleValue);
        },
        //附件上传前的判断
        beforeAvatarUpload(file){
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
        beforeRemove(file, fileList){},
        //判断图片数量
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        uploadFileMethod(param){
            let fileObject = param.file;
            let formData = new FormData();
            formData.append('RelPhid', '0')
            formData.append('BTable', 'gcw3_voucher_mst')
            formData.append("file", fileObject);
            this.uploadFile(formData).then(res => {
                if(res.Status==='error'){
                    this.$message.error(res.Msg);
                    return
                }
                //回传的上传临时文件
                if(res.Data){
                    this.$emit("uploadimg", res.Data);
                    var attachment=res.Attachment
                    var url_=this.picUrl
                    attachment.forEach(t=>{
                        this.fileList.push({url: url_+ t})
                    });
                    
                }

            }).catch(error => {      
                console.log(error);
                this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
            })
        }
  }
};
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
</style>