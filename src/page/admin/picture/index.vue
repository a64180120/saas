<template>
    <div class="sys-page" style="font-size:18px">
        <div class="container adminPicture">
            <el-container>
                <el-header>
                    <div class="unionState flexPublic">
                        <ul class="flexPublic">
                            <li class="flexPublic">
                            </li>
                        </ul>
                        <ul class="flexPublic handle" style="float: right">
                            <a>
                                <li v-show="publishData===0" @click="publish" style='margin:0 0 0px 10px;'>发布</li>
                                <li v-show="publishData===1" @click="publish" style='margin:0 0 0px 10px;'>取消发布</li>
                            </a>
                        </ul>
                    </div>
                </el-header>
                <el-main style="width: 900px; min-height: 500px; margin: 0 auto">
                    <el-upload
                        class='adminPicList'
                        ref="piclist"
                        action=""
                        list-type="picture-card"
                        :limit="6"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        v-loading="loading"
                        :before-upload="beforeUploadPic"
                        :http-request='uploadFileMethod'
                        :on-change='uploadSuccess'
                        :on-remove="handleRemove">

                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import httpConfig from '@/util/ajaxConfig'
    // import pictureUpload from "@/components/upload";

    //文章新增、编辑
    export default {
        name: "picture-list",
        components: { },
        data() {
            return {
                file:'',
                //listInfo: [],      //所有图片列表信息
                fileList: [],     //图片信息
                publishData: 0,    //发布信息
                pageSize: 20, //pageSize
                pageIndex: 1, //pageIndex
                total: 0,
     
                loading : false
            }
        },
        created() {

        },
        //加载数据
        mounted() {
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
            //给发布的图片添加样式
            published(){
                var pics=document.getElementsByClassName('el-upload-list__item');
                for(var f in this.fileList){
                    console.log(pics)
                    if(this.fileList[f].Publish){
                        pics[f].className='el-upload-list__item published'
                    }else{
                        pics[f].className='el-upload-list__item'
                    }


                }
            },
            //获取图片信息
            getData() {
               var  vm =this;
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                    PositionType: 'top'
                };
                //this.listInfo=[];
                this.total=0;
                const loading=this.$loading();
                this.$axios.get('/SysPicture/GetSysPictureQueryList', {params: data})
                    .then(res => {
                        loading.close();
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        this.fileList = res.list;
                        if(res.list.length=='0'){
                            this.publishData = 0;
                        }else{
                             this.publishData = this.fileList[this.fileList.length-1].Publish;
                        }
                        
                       
                        for(var file of this.fileList){
                            file.name=file.Title;
                            file.url=this.picUrl+file.Picpath;
                        }

                        this.total = Number(res.Total);
                        this.$nextTick(this.published)
                        // if (this.listInfo.length != 0) {
                        //     var url = this.picUrl;
                        //     this.publishData = this.listInfo[0].Publish;
                        //     this.listInfo.forEach(el => {
                        //         this.fileList.push({phid: el.PhId, url: url + el.Picpath, name: el.Title});
                        //     })
                        // }
                    })
                    .catch(err => {
                        loading.close();
                        console.log(err)
                        //this.$message({showClose: true, message: "图片获取错误", type: "error"});
                        this.$message({showClose: true, message: err, type: "error"});
                    })
            },
            //超过6个轮播图不能再添加
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 6 个轮播图！`);
            },
            //保存按钮
            onSubmit() {

            },
            //发布按钮
            publish(val) {
                var val = this.publishData === 0 ? 1 : 0;
                //发布图片
                console.log(this.fileList)
                var newArry = this.fileList.map(el => {
                    el.Publisher = this.username;
                    el.Publish = val;
                    return el
                });
                console.log(newArry);
                if(newArry.length < 1){
                    this.$message.warning(`暂无图片！`);
                    return;
                }
                var me = this;
                this.$axios({
                    url: '/SysPicture/PostUpdatePublish',
                    method: "post",
                    data: {
                        uid: this.uid,
                        orgid: this.orgid,
                        infoData: newArry
                    }
                }).then(res => {
                    if (res.Status === "error") {
                        this.$message({showClose: true, message: res.Msg, type: 'error'});
                        return;
                    }

                    this.publishData = val;
                    if(this.publishData === 0){
                        this.$message.success("取消发布成功！");
                    }
                    if(this.publishData === 1){
                        this.$message.success("发布成功！");
                    }
                    this.$nextTick(this.published)
                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '附件删除错误', type: 'error'});
                });

            },
            //图片类型判断
            beforeUploadPic(file) {
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
            uploadFileMethod(param) {
                console.log(param)
                var _$this=this;
                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);
                // formData.append("id", '0');
                formData.append("PhId", '0');
                formData.append("PositionType", "top");
                formData.append("Title", fileObject.uid);
                formData.append("Author", this.username);
                //console.log(formData);
                console.log(this.fileList)
                this.PicUpload(formData).then(res => {
                    console.log(res,this.fileList);
                    if (res.Status === 'error') {
                        _$this.$message.error(res.Msg);
                        _$this.getData();
                        return
                    }
                    this.fileList[this.fileList.length-1].AttachmentName=res.Data.AttachmentName
                    this.fileList[this.fileList.length-1].AttachmentNameAttachmentSize=res.Data.AttachmentNameAttachmentSize
                    this.fileList[this.fileList.length-1].Author=res.Data.Author
                    this.fileList[this.fileList.length-1].BusinessPrimaryKeys=res.Data.BusinessPrimaryKeys
                    this.fileList[this.fileList.length-1].Content=res.Data.Content
                    this.fileList[this.fileList.length-1].Creator=res.Data.Creator
                    this.fileList[this.fileList.length-1].CurOrgId=res.Data.CurOrgId
                    this.fileList[this.fileList.length-1].Description=res.Data.Description
                    this.fileList[this.fileList.length-1].Editor=res.Data.Editor
                    this.fileList[this.fileList.length-1].EndTime=res.Data.EndTime
                    this.fileList[this.fileList.length-1].ExtendObjects=res.Data.ExtendObjects
                    this.fileList[this.fileList.length-1].ForeignKeys=res.Data.ForeignKeys
                    this.fileList[this.fileList.length-1].GroundColor=res.Data.GroundColor
                    this.fileList[this.fileList.length-1].Linkaddress=res.Data.Linkaddress
                    this.fileList[this.fileList.length-1].NgInsertDt=res.Data.NgInsertDt
                    this.fileList[this.fileList.length-1].NgRecordVer=res.Data.NgRecordVer
                    this.fileList[this.fileList.length-1].NgUpdateDt=res.DataNgUpdateDt
                    this.fileList[this.fileList.length-1].Ontop=res.Data.Ontop
                    this.fileList[this.fileList.length-1].PersistentState=res.Data.PersistentState
                    this.fileList[this.fileList.length-1].PhId=res.Data.PhId
                    this.fileList[this.fileList.length-1].Picpath=res.Data.Picpath
                    this.fileList[this.fileList.length-1].PositionType=res.Data.PositionType
                    this.fileList[this.fileList.length-1].PropertyBytes=res.Data.PropertyBytes
                    this.fileList[this.fileList.length-1].Publish=res.Data.Publish
                    this.fileList[this.fileList.length-1].PublishTime=res.Data.PublishTime
                    this.fileList[this.fileList.length-1].Publisher=res.Data.Publisher
                    this.fileList[this.fileList.length-1].SortCode=res.Data.SortCode
                    this.fileList[this.fileList.length-1].StartTime=res.Data.StartTime
                    this.fileList[this.fileList.length-1].Title=res.Data.Title
                    //this.fileList[this.fileList.length-1].name=res.Data.name
                    //this.fileList[this.fileList.length-1].status=res.Data.status
                    //this.fileList[this.fileList.length-1].uid=res.Data.uid
                    //this.fileList[this.fileList.length-1].url=res.Data.url
                    this.fileList[this.fileList.length-1]._OldIdValue_=res.Data._OldIdValue_

                        this.publishData = 0;//发布
                    this.$nextTick(this.published)
                    // res.Data.name=res.Data.Title;
                    // res.Data.url=this.picUrl+res.Data.Picpath;
                    // this.fileList[this.fileList.length-1]=res.Data;
                    // console.log(this.fileList[this.fileList.length-1])
                    //this.fileList.push(res.Data);
                    // //清空已上传的文件列表
                    // _$this.$refs.piclist.clearFiles();
                    // //console.log(this.$refs);
                    // //重新加载
                     //_$this.getData();
                }).catch(error => {
                    console.log(error);
                    //重新加载
                    _$this.getData();
                    _$this.$message({showClose: true, message: '上传附件失败', type: 'error'})
                })

            },
            //
             uploadSuccess(response, file, fileList){
                 this.fileList=file;


            },
            //图片移除
            handleRemove(file, fileList) {
                this.fileList=fileList;
                if(fileList.length=='0'){
                    this.publishData = 0;
                }else{
                    this.publishData = fileList[fileList.length-1].Publish;
                }
                // //筛选数据
                // var delobj = this.fileList.find(v => {
                //     return v.PhId === file.phid
                // });
                // this.loading = true;
                //删除文件对象
                let deledata = {
                    uid: this.uid,
                    orgid: this.orgid,
                    infoData: file
                };
                console.log(file)
                this.$axios({
                    url: '/SysPicture/PostDeleteSysPicture',
                    method: "post",
                    data: deledata,
                }).then(res => {
                    this.loading = false;
                    this.$nextTick(this.published)
                    if (res.Status === "error") {
                        this.getData();
                        this.$message({showClose: true, message: res.Msg, type: 'error'});
                        return;
                    }
                   
                }).catch(error => {
                    this.loading = false;
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


</style>
