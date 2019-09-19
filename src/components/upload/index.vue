<template>
    <div class="pictureupload" @mouseover="picShow($event)" @mouseleave="picHide($event)">
        <el-upload
            ref="upload"
       action=""
            :disabled="disabled"
            list-type="picture-card"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :http-request='uploadFileMethod'
            :limit="limit">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div v-show="imgSrc" class="imgShow">
            <img :src="imgSrc" alt="">
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import httpConfig from '@/util/ajaxConfig' //自定义ajax头部配置*****

//附件
export default {
  name: "pictureUpload",
  props: {
    //父组件传递的图片列表
    imgList:{
        type: Array,
        default: []
    },
      disabled:{
        type:Boolean,
        default:false
      },
    //图片数量限制
    limit:''
  },
  data() {
    return {
        removing:false,//删除中,防止多次点击
        imgSrc:'', //鼠标悬停时的img地址
        fileList: [],
        upLoadData: { img: "" },
        dialogVisible: false,
        dialogImageUrl: "",
        curimgList:this.imgList
    };
  },
  //计算
  computed: {
    ...mapState({
        userid: state => state.user.userid,
        orgid: state => state.user.orgid
    }),
    picUrl:function(){
        return httpConfig.baseurl;
    }
  },
  watch:{
        // 'curimgList':function (newValue,oldValue) {
        //      if(newValue.length === 0) {
        //          this.fileList = [];
        //          return;
        //      }
        //      for (let i = 0; i < newValue.length; i++) {
        //          if (oldValue[i] != newValue[i]) {
        //             this.fileList = [];
        //             newValue.forEach(el=>{
        //                  this.fileList.push({ phid:el.PhId,url: url+ el.BUrlPath })
        //             })
        //             return;
        //          }
        //      }
        //     console.log(1);
        //     console.log(this.fileList);
        // }
  },
  created() {},
  //加载数据
  mounted(){
      var url=this.picUrl;
      if (this.curimgList.length != 0) {
          this.curimgList.forEach(el =>{
              this.fileList.push({ phid:el.PhId,url: url+ el.BUrlPath,name:el.BName });
          })
      }
  },
  methods: {
        ...mapActions({
            uploadFile: 'uploadFile/Voucherupload'
        }),
        //团片下载*****
        picDownload(e){
            var imgsrc=e.target.parentNode.parentNode.children[0].src;
            var index=imgsrc.indexOf('UpLoadFiles');
            var    filePath=imgsrc.slice(index);
            var    fileName=imgsrc.split('/');
            fileName=fileName[fileName.length-1];
            let base = httpConfig.getAxiosBaseConfig();
            window.location.href= base.baseURL+"/File/GetDownLoadPicture?filePath="+filePath+"&fileName="+fileName;
        },
        //图片预览****下载箭头
        picShow($event){
            if($event.target.className=="el-upload-list__item-actions"||$event.target.className=="el-upload-list__item-actions voucherPicDownload"){
                this.imgSrc=$event.target.parentNode.children[0].src;
                $event.target.className="el-upload-list__item-actions voucherPicDownload";
                var img;
                img=$event.target.children[1];  //下载箭头****
                if(img){
                    img.style.display='inline';
                }else{
                    var reg=/^blob/;
                    if(reg.test(this.imgSrc)){ //防止没有上传保存成功的图片直接下载,不显示箭头
                        return;
                    }
                    img=document.createElement('img');  //添加下载箭头
                    img.src='../../../static/img/download.svg';
                    img.onclick=this.picDownload;
                    $event.target.appendChild(img);
                }
            }else{
                this.imgSrc='';
            }
        },
        //鼠标离开图片***
        picHide($event){
            this.imgSrc='';
            if($event.target.className=="el-upload-list__item-actions"||$event.target.className=="el-upload-list__item-actions voucherPicDownload"){
               var img=document.querySelector('.voucherPicDownload>img');
               img.style.display=none;
            }
        },
        //图片移除时处理数据
        handleRemove(file, fileList) {
            var me=this;
            if(file.raw){
                const isRightType =  (file.raw.type === 'image/png') || (file.raw.type === 'application/pdf') || (file.raw.type === 'image/gif') || (file.raw.type === 'image/jpeg');
                if(!isRightType){
                    return;
                }
            }
            //删除文件对象 
            let deleValue={
                phid:file.phid,
                imgPath:file.url.replace(me.picUrl,'')
            };
            for(let ind in me.curimgList){                
                if(me.curimgList[ind].BName === file.name){
                    deleValue.phid=me.curimgList[ind].PhId
                    deleValue.imgPath=me.curimgList[ind].BUrlPath
                    me.curimgList.splice(ind,1);      
                }
            }
            me.$emit("removeimg", me.curimgList, deleValue);
        },
        //附件上传前的判断
        beforeAvatarUpload(file){

            const isRightType =  (file.type === 'image/png') || (file.type === 'application/pdf') || (file.type === 'image/gif') || (file.type === 'image/jpeg');
            const isLt2M = file.size / 1024 / 1024 < 2;
            console.log(file)
            if (!isRightType) {
                this.$message.error('上传图片只能是 JPG,png,gif,jpeg,pdf 格式!');
                return false;
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false
            }
        },
        beforeRemove(file, fileList){

        //    if(fileList.length<1){
        //        return false;
        //    }



        },
        //判断图片数量
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        uploadFileMethod(param){
            let me=this;
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
                    
                    var model=res.Data
                    var url_=me.picUrl

                    for (var i = 0; i < model.length; i++){
                         me.curimgList.push(model[i]);
                    }
                    this.$emit("uploadimg", me.curimgList);
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
<style lang='scss' scoped>
.pictureupload{
    position:relative;
}
.imgShow{
    position:absolute;
    top:100%;
    left:0;
    width:auto;
    height:auto;
    border:1px solid #ccc;
    >img{
        width:100%;
        
    }
}


</style>
<style>
.voucherPicDownload>img{
    position:absolute;
    z-index:9;
    bottom:5px;
    right:5px;
    width:25px;
    cursor:pointer;
}
</style>
