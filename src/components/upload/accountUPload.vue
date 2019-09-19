<template>
        <div class="fileUpload">
       <el-upload
    class="upload-demo"
    ref="upload"
    action=""
    drag
    :on-remove="handleRemove"
    :file-list="fileList"
    :on-exceed="handleExceed"
    :before-upload="beforeAvatarUpload"
    :http-request='uploadFileMethod'
    :limit="limit">
    <i class="el-icon-upload"></i>

    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过2MB</div>
</el-upload>
        </div>
</template>

<script>
    import { mapState, mapActions } from "vuex";
    import httpConfig from '@/util/ajaxConfig' //自定义ajax头部配置*****

    //附件
    export default {
        name: "fileUpload",
        props: {
            //父组件传递的图片列表
            imgList:{
                type: Array,
                default: []
            },
            //图片数量限制
            limit:'',
            accountInfo:{
                type:Object,
                default:{}
            }
        },
        data() {
            return {
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
                orgid: state => state.user.orgid,
                orgcode:state => state.user.orgcode,
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
                uploadFile: 'uploadFile/accountupload'
            }),
            //图片移除时处理数据
            handleRemove(file, fileList) {
                var me=this;
                //删除文件对象
                console.log(file)
                if(!file.phid){
                    return;
                }
                let deleValue={
                    phid:file.phid,
                    imgPath:file.url.replace(this.picUrl,'')
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
                const isRightType = (file.type === 'application/vnd.ms-excel');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isRightType) {
                    this.$message.error('上传文件只能是 xls 格式!');
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传文件大小不能超过 2MB!');
                    return false
                }
            },
            beforeRemove(file, fileList){},
            //判断图片数量
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            uploadFileMethod(param){
                let me=this;
                let fileObject = param.file;
                let formData = new FormData();
                console.log(param)

                formData.append('accountPhid', this.accountInfo.PhId)
                formData.append('orgid', this.orgid)
                formData.append('orgcode', this.orgcode)
                formData.append("file", fileObject);
                this.uploadFile(formData).then(res => {
                    this.fileList=[];
                    this.$message({ showClose: true,  message:res.Msg})
                    if(res.Status=='success'){
                        this.$emit('closeUpload');
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
                })
            },

        }
    };
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style >
    .fileUpload{
        min-width:250px;
        float: left;
    }
    .fileUpload .el-upload--text{
        width: 365px;
        height: 200px;
        border:0;
    }
</style>
