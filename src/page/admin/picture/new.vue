<template>
    <div class="sys-page new" style="background-color: #ffffff">
        <div class="container">
            <div class="handle-box" style="padding-top:5px;">
                <el-row>
                    <el-col :span="24">




                        <el-button size="small" class="el-icon-refresh" style="float: right;padding:0;margin:0 0 0px 10px;background: #FFFFFF;border-color: #ffffff;"
                                   @click="freshPage">
                        </el-button>

                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="PageNotPublish">取消发布
                        </el-button>
                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="PagePublish">发布
                        </el-button>
                        <el-button type="info" size="small" class="handle-del mr10" style="float: right"
                                   @click="PageDelete">删除
                        </el-button>
                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="PageEdit">修改
                        </el-button>
                        <el-button type="info" size="small" class="handle-del mr10" style="float: right"
                                   @click="PageAdd">新增
                        </el-button>
                        <el-button type="primary" style="float: right;margin:0;border-radius:0" @click="searchList" size="small">搜索</el-button>

                        <el-input v-model="select_word" placeholder="标题" prefix-icon="el-icon-search" size="small" style="float: right;max-width: 200px"
                                  class="handle-input mr10" ></el-input>
                        <div style="float:left;margin-right: 10px;width: 150px; height: 100%" class="picNewState">
                            <span style="float: left; text-align: center;line-height:30px">发布状态：</span>
                            <el-select v-model="state_mark" placeholder=""  style="margin-top: 0px;width: 50%; float:right" align="center">
                                <el-option label="全部" value="0" style="width: 100%"></el-option>
                                <el-option label="未发布" value="1"></el-option>
                                <el-option label="已发布" value="2"></el-option>
                            </el-select>
                        </div>
                        <div style="float: left;margin-right: 10px;width: 330px; height: 100%">
                            <span style="float: left; text-align: center;width: 80px;line-height:30px;">创建时间：</span>
                            <el-date-picker
                                v-model="state_time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                size="small"
                                style="width: 250px;">
                            </el-date-picker>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                v-loading="loading"
                      style="font-size:18px"
                ref="roleListTable"
                highlight-current-row
                :header-cell-style="{background:'#d3e9f9',color:'#000',textAlign:'center'}"
                @row-click="handleClickRow">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="Title" label="标题" ></el-table-column>
                <el-table-column label="图片附件" align="center">
                    <template slot-scope="scope" >
                        <el-popover trigger="hover" v-if="scope.row.Picpath">
                            <img :src="picUrl+scope.row.Picpath" style="height: 300px;width: 500px" />
                            <img slot="reference" :src="picUrl+scope.row.Picpath" style="height: 30px;width: 30px"/>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="Author" label="创建人" ></el-table-column>
                <el-table-column prop="NgInsertDt" label="创建时间"></el-table-column>
                <el-table-column prop="Publish" label="发布状态" align="center">
                    <template slot-scope="scope" >
                        <el-button v-if="scope.row.Publish===1" type="success" icon="el-icon-check" size="mini" circle style="text-align: center"></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle style="text-align: center"></el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="Publisher" label="发布人" align="center"></el-table-column>
                <el-table-column prop="PublishTime" label="发布时间" align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total,prev, pager, next"
                               :page-size="pageSize" :total="totalCount">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogState=='add'?'新增':'编辑'" :visible.sync="editVisible" width="40%" style="height: 800px">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                <el-form-item label="标题：" prop="Title">
                    <el-input v-model="form.Title" placeholder="不超过30个汉字！"></el-input>
                </el-form-item>
                <el-form-item label="图片：" prop="Picpath">
                    <!--<el-input v-model="orgForm.EnterpriseCode" class="pic-input"></el-input>-->
                    <el-upload
                        ref="uploadEnterprise"
                        class="avatar-uploadernew"
                        action=""
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        :http-request='uploadFileMethodPic'>
                        <img v-if="form.Picpath" :src="picUrl+form.Picpath"
                             class="avatarnew">
                        <i v-else class="el-icon-plus" style="text-align: center;margin-top: 21%; font-size: 30px"></i>
                    </el-upload>
                    <!--<el-input v-model="form.Picpath"></el-input>-->
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false" style="color: #00B8EE; border-color: #00B8EE;">取 消</el-button>                
                <el-button type="primary" @click="PublishBut">发 布</el-button>
                <el-button type="primary" @click="EditBut">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import UserInfo from "@/util/auth";
    import {mapState, mapActions} from "vuex";
    import pictureUpload from "@/components/upload";
    export default {
        name: "new",
        data() {
            return {
                loading: false,
                tableData: [], //table数据
                pageSize: 20, //pageSize
                pageIndex: 1, //pageIndex
                totalCount: 0, //总页数
                singleSelection: [], //选中行
                state_mark: "", //发布状态
                select_word: "", //搜索字段
                state_time:[],//创建时间
                dialogState: "add",
                editVisible: false,
                Publish:'0',
                form: {
                    Publish:'',
                    AttachmentName: '',
                    NgRecordVer:'',
                    Publisher:'',
                    PublishTime:'',
                    PositionType:'',
                    PhId :'',
                    Title: "",
                    Picpath: "",
                    AttachmentSize: '',
                    Author:'',
                },
                rules: {
                },
            };
        },
        created() {
            this.getData();
        },
        computed: {
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                username:state=> state.user.username,
            }),
            picUrl: function () {
                return httpConfig.baseurl;
            }
        },
        components: { pictureUpload,},
        methods: {
            ...mapActions({
                uploadFile: 'uploadFile/Pictureupload'
            }),
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
            //覆盖默认的上传行为，自定义上传
            uploadFileMethodPic(param) {
                let fileObject = param.file;
                let formData = new FormData();
                formData.append('id', this.form.PhId)
                formData.append("file", fileObject);
                console.log(formData);
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
                        this.$message.success("上传成功");
                        console.log(this.form.Picpath);
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '上传附件失败', type: 'error'})
                })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getData();
            },
            //刷新按钮
            freshPage(){
                this.getData();
            },
            //搜索按钮
            searchList(){
                let endT = '', startT ='';
                let pub;
                if(this.state_mark == '' || this.state_mark == null){
                    pub = '0';
                }else{
                    pub = this.state_mark;
                }
                if(this.state_time !=[] && this.state_time != null){
                    startT = this.state_time[0];
                    endT = this.state_time[1];
                }
                let page={
                    PositionType: 'bottom',
                    // 'Publish': pub,
                    // 'StartTime': startT,
                    // 'EndTime': endT,
                    Title: this.select_word
                };
                // console.log({
                //     PageIndex: "0",
                //     PageSize: "20",
                //     uid: "8",
                //     orgid: "0",
                //     pictureModel: JSON.parse({Title:'xie'})
                // });
                this.$axios.get("/SysPicture/GetSysPictureQueryList", {
                    params: {
                        PageIndex: "0",
                        PageSize: "20",
                        uid: "8",
                        orgid: "0",
                        PositionType: 'bottom',
                        Publish: pub,
                        StartTime: startT,
                        EndTime: endT,
                        Title: this.select_word
                    }
                }).then(
                    res => {
                        this.loading = false;
                        console.log(res);
                        this.tableData = res.list;
                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                        this.$message({ showClose: true, message: '图片新闻列表获取错误', type: 'error' });
                    }
                );
                // this.$axios.get('/SysPicture/GetSysPictureQueryList', {
                //     params:{
                //         PageIndex: this.pageIndex - 1,
                //         PageSize: this.pageSize,
                //         uid: "2",
                //         orgid: "2",
                //         pictureModel: this.form
                //     }
                // }).then(res=>{
                //     this.loading = false;
                //     console.log(res);
                //     console.log(page);
                //     //this.tableData = res.list;
                //     },
                //     error => {
                //         console.log(error);
                //         this.loading = false;
                //         this.$message({ showClose: true, message: '图片新闻列表获取错误', type: 'error' });
                //     }
                // )
            },
            //新增按钮
            PageAdd(){
                this.form.Title = '';
                this.form.Picpath = '';
                this.dialogState = 'add';
                this.editVisible = true;
            },
            //修改按钮
            PageEdit(){
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                console.log(id);
                if (id != 0) {
                    this.$axios.get("/SysPicture/GetSysPicture", {
                        params: {
                            uid: "0",
                            orgid: "0",
                            id: id
                        }
                    }).then(res => {
                        console.log(res);
                        this.form = res;
                        this.dialogState = "edit";
                        this.editVisible = true;
                        // this.AttachmentName = res.AttachmentName;
                        // this.AttachmentSize = res.AttachmentSize;
                        // this.Publish = res.Publish;
                        // this.NgRecordVer = res.NgRecordVer;
                        // this.PositionType = res.PositionType;

                        // this.PhId = res.PhId;
                        this.singleSelection = [];
                        this.$forceUpdate();
                    });
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //删除按钮
            PageDelete(){
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                console.log(id);
                if (id != 0) {
                    var data = {
                        uid: "0",
                        orgid: "0",
                        infoData: object[0]
                    };
                    this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$axios.post("/SysPicture/PostDeleteSysPicture", data)
                                .then(res => {
                                    if(res.Status=='success'){
                                        this.$message.success("删除成功");
                                    }else{
                                        this.$message.error('删除失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getData('');
                                });
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                    this.getData('');
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //发布按钮
            PagePublish(){
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                console.log(id);
                if (id != 0) {
                    let pub = object[0].Publish;
                    if(pub == '1'){
                        this.$message.error('此条数据处于发布状态，无法进行发布的操作!');
                        return;
                    }
                    var page = [];
                    page.push({
                        'PhId': id,
                        'Publish': '1',
                        'Publisher': this.username,
                        'PublishTime': new Date,
                    });
                    // page.push({
                    //     'PhId': id,
                    //     'Publish': '1',
                    //     'Publisher': this.username,
                    //     'PublishTime': new Date,
                    // });
                    var data =
                        {
                            uid: "0",
                            orgid: "0",
                            infoData: page
                        };
                    console.log(data);
                    this.$confirm("此操作将发布该数据, 是否继续?", "发布提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$axios.post("/SysPicture/PostUpdatePublish", data)
                                .then(res => {
                                    if(res.Status=='success'){
                                        this.$message.success("发布成功");
                                    }else{
                                        this.$message.error('发布失败,请重试!');
                                    }
                                    //this.$message.success("删除成功");
                                    this.singleSelection = [];
                                    this.getData();
                                });
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消发布"
                            });
                        });
                    this.getData();
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //取消发布按钮
            PageNotPublish(){
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                console.log(id);
                if (id != 0) {
                    let pub = object[0].Publish;
                    if(pub == '0'){
                        this.$message.error('此条数据处于未发布状态，无法进行取消发布的操作!');
                        return;
                    }
                    var page = [];
                    page.push({
                        'PhId': id,
                        'Publish': '0',
                        'Publisher': this.username,
                        'PublishTime': new Date,
                    });
                    var data = {
                        uid: "0",
                        orgid: "0",
                        infoData: page
                    };
                    this.$confirm("此操作将取消发布该数据, 是否继续?", "取消发布提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$axios.post("/SysPicture/PostUpdatePublish", data)
                                .then(res => {
                                    if(res.Status=='success'){
                                        this.$message.success("取消发布成功");
                                    }else{
                                        this.$message.error('取消发布失败,请重试!');
                                    }
                                    //this.$message.success("删除成功");
                                    this.singleSelection = [];
                                    this.getData('');
                                });
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消发布"
                            });
                        });
                    this.getData();
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //保存按钮
            EditBut(){
                if(this.dialogState == 'add'){
                    var page = {
                        'PositionType': 'bottom',
                        'Title': this.form.Title,
                        'Picpath': this.form.Picpath,
                        'AttachmentName': this.form.AttachmentName,
                        'AttachmentSize': this.form.AttachmentSize,
                        'Publish': '0',
                        'Author': this.username,
                        'NgRecordVer': this.NgRecordVer
                    };
                    if(this.form.Picpath != ''&& this.form.Picpath != null){
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: page
                        };
                        this.$axios.post('/SysPicture/PostAdd', data)
                            .then(res => {
                                if (res.Status == 'success') {
                                    this.editVisible = false;
                                    this.$message.success("新增成功");

                                }else{
                                    this.$message.error('新增失败,请重试!');
                                }
                                this.getData();
                            })
                    }else{
                        this.$message.error('标题与内容都不能为空,请重试!');
                    }
                }else{
                    // var page = {
                    //     'PhId': this.PhId,
                    //     'Title': this.form.Title,
                    //     'Picpath': this.form.Picpath,
                    //     'AttachmentName': this.AttachmentName,
                    //     'AttachmentSize': this.AttachmentSize,
                    //     'Publish': this.Publish,
                    //     'Author': this.username,
                    //     'NgRecordVer': this.NgRecordVer
                    // };
                    if(this.form.Picpath != ''&& this.form.Picpath != null){
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: this.form
                        };
                        this.$axios.post('/SysPicture/PostUpdate', data)
                            .then(res => {
                                if (res.Status == 'success') {
                                    this.editVisible = false;
                                    this.$message.success("保存成功");
                                }else{
                                    this.$message.error('保存失败,请重试!');
                                }
                                this.getData();
                            })
                    }else{
                        this.$message.error('标题与内容都不能为空,请重试!');
                    }
                }
            },
            //发布按钮
            PublishBut(){
                if(this.dialogState == 'add'){
                    var page = {
                        'PositionType': 'bottom',
                        'Title': this.form.Title,
                        'Picpath': this.form.Picpath,
                        'AttachmentName': this.form.AttachmentName,
                        'AttachmentSize': this.form.AttachmentSize,
                        'Publish': '1',
                        'Publisher': this.username,
                        'PublishTime': new Date,
                        'Author': this.username
                    };
                    if(this.form.Title != '' && this.form.Title != null && this.form.Picpath != ''&& this.form.Picpath != null){
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: page
                        };
                        this.$axios.post('/SysPicture/PostAdd', data)
                            .then(res => {
                                if (res.Status == 'success') {
                                    this.editVisible = false;
                                    this.$message.success("发布成功");
                                }else{
                                    this.$message.error('发布失败,请重试!');
                                }
                                this.getData();
                            })
                    }else{
                        this.$message.error('标题与内容都不能为空,请重试!');
                    }
                }else{
                    this.form.Publish = '1';
                    this.form.Publisher = this.username;
                    this.form.PublishTime = new Date;
                    if(this.form.Title != '' && this.form.Title != null && this.form.Picpath != ''&& this.form.Picpath != null){
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: this.form,
                        };
                        this.$axios.post('/SysPicture/PostUpdate', data)
                            .then(res => {
                                if (res.Status == 'success') {
                                    this.editVisible = false;
                                    this.$message.success("发布成功");
                                }else{
                                    this.$message.error('发布失败,请重试!');
                                }
                                this.getData();
                            })
                    }else{
                        this.$message.error('标题与内容都不能为空,请重试!');
                    }
                }
            },
            //选择行
            handleClickRow(row) {
                this.singleSelection = [];
                this.singleSelection.push(row);

                console.log(row);
                console.log(this.singleSelection);
            },
            //获取图片列表
            getData(){
                // console.log(this.username);
                this.loading = true;
                this.$axios.get("/SysPicture/GetSysPictureByPage", {
                    params: {
                        PageIndex: this.pageIndex - 1,
                        PageSize: this.pageSize,
                        uid: "",
                        orgid: "",
                        value:"bottom"
                    }
                }).then(
                    res => {
                        this.loading = false;
                        console.log(res);
                        this.tableData = res.list;
                        // this.AttachmentName = res.AttachmentName;
                        // this.AttachmentSize = res.AttachmentSize;
                        this.totalCount = Number(res.Total);
                        console.log(this.tableData);
                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                        this.$message({ showClose: true, message: '图片新闻列表获取错误', type: 'error' });
                    }
                );
            }
        }
    }
</script>

<style scoped>
    .el-icon-refresh:before {
        /* content: "\E6D0"; */
        font-size: 20px;
        color: #00B8EE;
    }
    .el-checkbox-role {
        width: 100%;
        float: left;
        margin-left: 0px;
    }

    /* .el-checkbox-role >.el-checkbox__label{
        width: 80%;
    } */
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .el-icon-refresh:before {
        /* content: "\E6D0"; */
        font-size: 25px;
        color: #00B8EE;
    }
</style>
<style>
    .picNewState .el-input--suffix .el-input__inner {
        margin: 0px 7px 0px -7px;
        padding-right: 0;
        height: 30px;
        line-height: 30px;
    }
    .new .el-icon-plus:before {
        content: "\E62B";
        text-align: center;
    }
    .new .avatar-uploadernew .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .new .avatar-uploadernew  .el-upload:hover {
        border-color: #409EFF;
    }

    .mew .avatar-uploadernew .el-upload--text {
        width: 80px;
        height: 80px;
    }
    .new .avatarnew{
        width: 100%;
        height: 100%;
        display: block;
    }
    .new .avatar-uploader-iconnew {
        font-size: 20px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
    }
    .el-button--info:hover, .el-button--info:focus {
        /*background: #a6a9ad;*/
        /*border-color: #a6a9ad;*/
        /*color: #fff;*/
        background: #fff;
        color: #00B8EE;
    }
    .el-button--info {
        color: #fff;
        background-color: #00B8EE;
        border-color: #00B8EE;
    }

    .el-message-box__btns .el-button:nth-child(1) {
        border-color: #00B8EE;
        color: #00B8EE;
    }
</style>
