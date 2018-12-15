<template>
    <div class="pictureupload">
        <el-upload
            :action="baseUrl + '/SysOrganize/PostUploadFile'"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            name="img"
            :on-success="upLoadSuccess"
            :data="upLoadData"
            :headers="headers"
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
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****

export default {
    name: 'pictureupload',
    props: {
        // 父组件传递的图片列表
        imgList: {
            type: Array,
            default: []
        }, 
        // 图片数量限制
        limit: "" 
    },
    data() {
        return {
            fileList: [],
            upLoadData: { img: "" },
            dialogVisible: false,
            dialogImageUrl: ""
        };
    },
    computed:{
        ...mapState({
            userid: state => state.user.userid,
            orgid: state => state.user.orgid
        }),
        picUrl:function(){
          return httpConfig.baseurl;
        },
        headers:function(){
          let config_header = httpConfig.getHeaderConfig();

          let new_header={
            'Content-Type': 'multipart/form-data',
            'AppInfo': config_header.AppInfo,
            'Sign':config_header.Sign
          };

          return new_header
        },
        baseUrl:function(){
          return httpConfig.getAxiosBaseConfig().baseURL;
        }
    },
    watch: {
        // 监听imgList的变化： fileList要求的格式为[{url: img}],所以监听imgList变化后将其进行处理，赋值给fileList
        imgList: {
            handler(newValue, oldValue) {
                if(newValue.length === 0) {
                    this.fileList = [];
                    return;
                }
                for (let i = 0; i < newValue.length; i++) {
                    if (oldValue[i] != newValue[i]) {
                        this.fileList = [];
                        newValue.forEach(el => {
                            this.fileList.push({url: el})
                        })
                        return;
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        // 图片移除时处理数据
        handleRemove(file, fileList) {
            let item = [];
            fileList.forEach(el => {
                item.push(el.url);
            });
            this.$emit("removeimg", item);
        },
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
        //点击文件列表中已上传的文件时的钩子
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
            this.upLoadData.file=file;
            this.upLoadData.RelPhid='123';
            this.upLoadData.BTable='123';

        },
        beforeRemove(file, fileList) {},
        // 判断图片数量
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // 上传图片成功事件
        upLoadSuccess(response) {
            var res=JSON.parse(response.data);
            if(res.Status==='error'){
                this.$message.error(res.Msg);
                return
            }
            this.$emit("uploadimg", response.message);
            this.$message("上传成功",);
        }
    },
    mounted() {
        if (this.imgList.length != 0) {
            this.imgList.forEach(el => {
                this.fileList.push({ url: el });
            });
        }
    }
};
</script>