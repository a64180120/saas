<template>
    <div class="sys-page Article_add">
        <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10"
                                   style="float: right;margin-left: 10px"
                                   @click="cancel">取消
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10"
                                   style="float: right"
                                   @click="publish">发布
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10"
                                   style="float: right"
                                   @click="onSubmit">保存
                        </el-button>

                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10"
                                   style="float: right"
                                   @click="preview">预览
                        </el-button>
                    </el-col>
                </el-row>

            </div>
            <div class="form" style="float: left;width: 60%;margin-top: 30px;">
                <el-form
                    ref="form"
                    :model="form"
                    :rules="rules"
                    label-width="80px">
                    <el-form-item label="标题" prop="Title">
                        <el-input v-model="form.Title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容">
                        <!-- <quill-editor
                            v-model="form.Content"
                            ref="editorElem"
                            @blur="onEditorBlur($event)">
                        </quill-editor> -->
                        <tinymce-editor
                            ref="editor"
                            v-model="form.Content"
                            :initvalue="form.Content"
                            @onClick='tinymceClick'>
                        </tinymce-editor>
                    </el-form-item>
                </el-form>
            </div>
            <div class="form" style="float: left;width: 40%;margin-top: 30px;">
                <el-form
                    ref="form2"
                    :model="form"
                    :rules="rules"
                    label-width="80px">
                    <el-form-item label="信息类别" prop="PhIdType">
                        <el-select v-model="form.PhIdType" placeholder="" style="width: 40%">
                            <el-option v-for="item in articleType" :key="item.PhId" :label="item.Name"
                                       :value="item.PhId" style="height: 100%"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="信息来源">
                        <el-input v-model="form.Name" placeholder="不超过10个汉字！" style="width: 40%"></el-input>
                    </el-form-item>
                    <el-form-item label="制度级别" prop="LevelType">
                        <el-select v-model="form.LevelType" placeholder="" style="width: 40%">
                            <el-option v-for="item in LevelData" :key="item.value" :label="item.name"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否置顶">
                        <el-switch v-model="form.Ontop"></el-switch>
                    </el-form-item>
                    <el-form-item label="封面图片">
                        <!-- <el-input v-model="form.Picpath"></el-input> -->
                        <el-upload
                            ref="newsPic"
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :before-upload="beforeUploadNews"
                            :http-request='uploadFileMethod'>
                            <img v-if="form.Picpath" :src="picUrl+form.Picpath"
                                 class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="附件上传">

                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import httpConfig from '@/util/ajaxConfig'
    import tinymceEditor from '@/components/tinymce/tinymce-editor.vue'

    //文章新增、编辑
    export default {
        name: "Article_add",
        components: { tinymceEditor },
        data() {
            return {
                type: '',
                phid: '',
                form: {
                    PhId: 0,         //主键
                    PhIdType: '',   //信息类别
                    Title: '',       //标题
                    Content: '',     //文本
                    Name: '',        //信息来源
                    LevelType: '',    //制度级别
                    Ontop: 0,        //是否置顶
                    Picpath: '',     //封面图片
                    AttachmentName: '',     //图片原始名称
                    AttachmentSize: '',     //图片大小
                    Attachment: []   //附件
                },
                rules: {
                    Title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    PhIdType: [
                        { required: true, message: '请选择信息类别', trigger: 'change' }
                    ],
                    LevelType: [
                        { required: true, message: '请选择制度级别', trigger: 'change' }
                    ]
                },
                LevelData: [
                    {name: '国家', value: 1},
                    {name: '省级', value: 2},
                    {name: '市级', value: 3}
                ],
                articleType: []
            }
        },
        created() {
            this.getTypeData()
        },
        //加载数据
        mounted: function () {
            this.initMethod();
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
                uploadFile: 'uploadFile/Newsupload'
            }),
            //数据初始化
            initMethod() {
                this.type = this.$route.query.type;
                this.phid = this.$route.query.phid;
                if (this.type === 'add') {
                    //alert(type)
                } else if (this.type === 'edit') {
                    //获取编辑数据
                    this.getNewsData(this.phid);
                }
            },
            //获取文章类别数据
            getTypeData() {
                this.$axios.get('/SysNews/GetSysNewsTypeList', {params: ''})
                    .then(res => {

                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }

                        this.articleType = res;

                    }).catch(err => {
                    console.log(err)
                    this.$message({showClose: true, message: "辅助项获取错误", type: "error"});
                })
            },
            getNewsData(phid) {
                let data = {
                    id: phid,
                    uid: this.userid,
                    orgid: this.orgid
                };

                this.$axios.get('/SysNews/GetSysNews', {params: data})
                    .then(res => {

                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        this.form = res;
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({showClose: true, message: "文章获取错误", type: "error"});
                    })
            },
            /**
             * 预览按钮事件
             */
            preview() {
                this.$router.push({path: '/admin/article/detail', query: { phid:this.form.PhId }});
            },
            /**
             * 保存事件
             */
            onSubmit() {

                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$refs['form2'].validate((valid2) => {
                            if(valid2){
                                if (this.type === 'add') {
                                    //新增保存
                                    this.AddSave();

                                } else if (this.type === 'edit') {
                                    //编辑保存
                                    this.UpdateSave();
                                }
                            }
                        });
                    }
                });
            },
            //新增
            async AddSave() {
                /**
                 * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
                 * 新增文章
                 *  */
                var newsinfo = {
                    PhId: this.form.PhId,
                    PersistentState: 1,
                    PhIdType: this.form.PhIdType,
                    Title: this.form.Title,
                    Content: this.form.Content,
                    Ontop: this.form.Ontop,
                    Name: this.form.Name,
                    Author: this.username,
                    Picpath: this.form.Picpath,
                    AttachmentName: this.form.AttachmentName,
                    AttachmentSize: this.form.AttachmentSize,
                    LevelType: this.form.LevelType,
                };

                this.$axios.post('/SysNews/PostAdd', {
                    uid: this.userid,
                    orgid: this.orgid,
                    infoData: newsinfo

                }).then(res => {
                    console.log(res)
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    this.$message.success("新增成功!");
                })
                .catch(err => {
                    console.log(err)
                })
            },
            //编辑
            async UpdateSave() {
                var updateNews = this.form;

                this.$axios.post('/SysNews/PostUpdate', {
                    uid: this.userid,
                    orgid: this.orgid,
                    infoData: updateNews
                }).then(res => {
                    console.log(res)
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    this.$message.success("修改成功!");
                })
                    .catch(err => {
                        console.log(err)
                    })
            },
            /**
             * 发布事件
             */
            publish() {

            },
            /**
             * 取消事件
             */
            cancel() {
                //关闭移除当前的TagNav
                this.$store.commit("tagNav/removeTagNav", this.$route);
                //跳转列表的首页
                this.$router.push({path: "/admin/article"});
            },
            //在这里接受子组件传过来的参数，赋值给data里的参数
            catchData(value) {
                this.form.Content = value
            },
            beforeUploadNews(file) {
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
            uploadFileMethod(param) {
                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);

                this.uploadFile(formData).then(res => {
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    //回传的上传临时文件
                    if (res.Data[0]) {
                        this.form.Picpath = res.Data[0].Picpath;
                        this.form.AttachmentName = res.Data[0].AttachmentName;
                        this.form.AttachmentSize = res.Data[0].AttachmentSize;
                        //this.$message.success("上传成功");
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '上传附件失败', type: 'error'})
                })
            },
            tinymceClick(e,tinymceObj){
                console.log(e);
            }
        }
    }
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>
<style>
    .avatar-uploader {
        right: 25px;
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

    .avatar-uploader .el-upload--text {
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
    .Article_add .container {
        padding: 20px 20px 20px 20px;
        margin-bottom: 50px;
        background: #fff;
        border: 1px solid #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px 2px #d3e9f9;
        height: 100%;
    }
    .Article_add .el-input--suffix .el-input__inner {
        margin: 0;
        padding-right: 0;
        height: 100%;
    }
</style>
