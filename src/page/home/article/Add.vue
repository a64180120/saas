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
                                   style="float: right" v-show="ispublish"
                                   @click="publish">{{publishName}}
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10"
                                   style="float: right" v-show="form.Publish===0"
                                   @click="onSubmit">保存
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10"
                                   style="float: right" v-show="form.Publish===0"
                                   @click="onSubmit(1)">保存并发布
                        </el-button>

                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10"
                                   style="float: right" v-show="type==='edit'"
                                   @click="preview">预览
                        </el-button>
                    </el-col>
                </el-row>

            </div>
            <div class="updateMask">
                <div class="form" style="float: left;width: 60%;margin-top: 30px;padding-left: 10px;">
                    <el-form
                        ref="form"
                        :model="form"
                        :rules="rules"
                        label-width="80px">
                        <el-form-item label="标题" prop="Title">
                            <el-input v-model="form.Title" placeholder="不超过50个汉字！"></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                            <tinymce-editor
                                v-if="isShowTinymce"
                                ref="editor"
                                id="news-editor"
                                v-model="form.Content"
                                :initvalue="form.Content"
                                :disabled='false'
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
                            <el-select v-model="form.PhIdType" value-key="PhId" placeholder="" style="width: 40%" @change="articleTypeChange">
                                <el-option v-for="item in articleType" :key="item.PhId" :label="item.Name"
                                           :value="item.PhId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="信息来源">
                            <el-input v-model="form.Name" placeholder="不超过10个汉字！" style="width: 40%"></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.PhIdType=='291190117000002'" label="制度级别" prop="LevelType">
                            <el-select v-model="form.LevelType" placeholder="" style="width: 40%">
                                <el-option v-for="item in LevelData" :key="item.value" :label="item.name"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否置顶">
                            <el-switch :disabled="isHaveTop && !isOnTop" active-value="1" inactive-value="0" v-model="form.Ontop"></el-switch>
                            <span v-if="isHaveTop && !isOnTop" style="font-size: 12px;color: red">已有置顶新闻，请先取消置顶内容</span>
                        </el-form-item>
                        <el-form-item label="接收组织">
                            <div class="el-input__inner" style="line-height: 40px" @click="orgListsVisible=true">
                                <template v-for="item in checkedOrgList">
                                    <span>{{item.OrgName +'  '}}</span>
                                </template>
                            </div>
                            <!--<el-input v-model="form.Name" placeholder="不超过10个汉字！" style="width: 40%" @click=""></el-input>-->
                        </el-form-item>
                        <el-form-item v-if="category =='system'" label="封面图片" prop="Picpath">
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
                        <el-form-item v-else label="封面图片">
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
                        <el-form-item label="附件上传" >
                            <el-upload
                                multiple
                                :limit="5"
                                ref="attachmentList"
                                class="upload-demo"
                                action=""
                                :on-remove="attachmentRemove"
                                :before-upload="beforeuploadAttach"
                                :on-change="fileChangeAttach"
                                :file-list="fileList"
                                :auto-upload="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">上传文件不超过2M</div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </div>
                <div @click.stop="showMsg" v-show="updateMask" style="z-index: 9"></div>
            </div>

        </div>
        <message :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></message>
        <!-- 组织树弹窗 -->
        <el-dialog :visible.sync="orgListsVisible" :append-to-body="true" width="300px">
            <el-tree v-if="orgListsVisible"
                :data="orgLists"
                ref="tree"
                show-checkbox
                :check-strictly="true"
                node-key="PhId"
                :props="defaultProps"
                default-expand-all
                :default-checked-keys="checkedOrgListPhId"
            >

            </el-tree>
            <div slot="footer">
                <el-button @click="orgListsVisible=false">取消</el-button>
                <el-button @click="getCheckedOrg">保存</el-button>
            </div>
        </el-dialog>
        <!-- 预览组件 -->
        <el-dialog :visible.sync="visible_preview" :append-to-body="true">
            <preview v-if="visible_preview" :phid="form.PhId" @close="visible_preview=false"></preview>
        </el-dialog>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import httpConfig from '@/util/ajaxConfig'
import tinymceEditor from '@/components/tinymce/tinymce-editor.vue'
import Auth from "@/util/auth"
import preview from './Preview'
import axios from "axios";
    //文章新增、编辑
    export default {
        name: "Article_add",
        components: {preview, tinymceEditor },
        props:{
            newsProp:{
                type: Object,
                default(){
                    return {}
                }
            }
        },
        data() {
            let Picpath = (rules,value,callback)=>{
                if(!value){
                    callback(new Error("请上传封面图片"))
                }else {
                    callback()
                }
            }
            return {
                type: '',
                form: {
                    PhId: 0,         //主键
                    PhIdType: '',   //类型主键
                    CodeType:'',    //类型编码
                    Title: '',       //标题
                    Content: '',     //文本
                    ContentText:'',   //纯文本
                    Name: '',        //信息来源
                    LevelType: '',    //制度级别
                    Ontop: "0",        //是否置顶
                    Picpath: '',     //封面图片
                    Publish:0,
                    AttachmentName: '',     //图片原始名称
                    AttachmentSize: 0,     //图片大小
                },
                Attachment: [],   //附件
                files:[],//要上传的文件对象
                fileList:[], //upload显示附件数据
                ispublish:false,
                publishName:'发布',
                rules: {
                    Title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 50个字以内', trigger: 'blur'}
                    ],
                    PhIdType: [
                        { required: true, message: '请选择信息类别', trigger: 'change' }
                    ],
                    LevelType: [
                        { required: true, message: '请选择制度级别', trigger: 'change' }
                    ],
                    Picpath:[
                        {validator:Picpath, trigger: 'blur' }
                    ]
                },
                LevelData: [
                    {name: '国家', value: 1},
                    {name: '省级', value: 2},
                    {name: '市级', value: 3}
                ],
                articleType: [],
                tinymce:'',
                saasMessage:{},
                updateMask:false,
                isOnTop:false, //当前新闻是否是置顶新闻
                isHaveTop:false,//新闻列表中是否有置顶新闻
                isShowTinymce:true, //控制富文本编辑器的创建与销毁
                category:'',//判断类型是否是内置的
                orgLists:[],//组织
                orgListsVisible: false,//组织树显示
                checkedOrgListPhId:[],//选中的组织PhId集合，用于组织树显示
                checkedOrgList:[],//选中的组织，数据存放
                renderContent:[],
                defaultProps: {
                    children: 'children',
                    label: 'OrgName'
                },
                orgCode:'',//组织code
                visible_preview:false,//预览组件
            }
        },
        //加载数据
        mounted: function () {
            this.getTypeData();
            this.initMethod();
            this.getOrgData();
            if(this.newsProp.phid==0){
                this.ispublish=false;
            }
            //判断跳转类型，新增时清空输入框内容
            if(this.newsProp.type === 'add'){
                this.form.Title = '';
                this.form.Content = '';
                this.form.ContentText = '';
                this.form.Name = '';
                this.form.LevelType = '';
                this.form.Ontop = "0";
                this.form.Picpath = "";
                this.form.Publish = 0;
                this.form.AttachmentName = "";
                this.form.AttachmentSize = 0;
            }
            let cookiesUser = Auth.getUserInfoData();
            this.orgCode=cookiesUser.orgInfo.EnCode;
        },
        activated(){
            //创建富文本编辑器
            this.isShowTinymce =true


            //判断是从什么地方进入页面 不位undefined时由push跳转，否则为标签跳转
           /* if (this.newsProp.type !== undefined) {
                this.getTypeData();
                this.initMethod();
                if(this.newsProp.phid==0){
                    this.ispublish=false;
                }
                //判断跳转类型，新增时清空输入框内容
                if(this.newsProp.type === 'add'){
                    this.form.Title = '';
                    this.form.Content = '';
                    this.form.ContentText = '';
                    this.form.Name = '';
                    this.form.LevelType = '';
                    this.form.Ontop = "0";
                    this.form.Picpath = "";
                    this.form.Publish = 0;
                    this.form.AttachmentName = "";
                    this.form.AttachmentSize = 0;
                }
            }else {
                console.log(this.type)
            }*/
        },
        deactivated(){
            //不缓存附件
            this.fileList = []
            this.files =[]
            //销毁富文本编辑器
            this.isShowTinymce = false
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
        watch:{
            //监听当前新闻是否是置顶新闻，
            // 如果是，改变当期新闻状态是将新闻列表中是否有置顶新闻状态更改为false
          "form.Ontop":{
              handler(val,oldval){
                  console.log(val)
                  if (val == 1){
                      this.isHaveTop = false
                  }
              },
              deep:true
          },
            fileList(val){
              console.log(val)
            }
        },
        methods: {
            ...mapActions({
                uploadFile: 'uploadFile/Newsupload',
                AddSysNews: 'uploadFile/AddSysNews',
                UpdateSysNews: 'uploadFile/UpdateSysNews'
            }),
            /**
             *组织查询，默认选中当前登录组织
             * */
            getOrgData:function(){
                let data={
                    orgId:this.orgid,
                }
                 this.$axios.get('sysOrganize/GetAllOrgListByOrgId',{params:data}).then(res => {
                    if(res.Status=='success'){
                        this.orgLists=JSON.parse(res.Data);
                        this.getChekedOrgObj()
                        console.log(this.orgLists)
                    }else{
                        this.saasMessage={
                            message:data.Msg,
                            delay:3000,
                            visible:true
                        };
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            //页面初始化后，获取对应选中组织集合
            getChekedOrgObj:function() {
                let phidL = this.checkedOrgListPhId;
                let orgL = this.orgLists;
                this.checkedOrgList=[];
                for( var i in orgL){
                    for( var j in phidL){
                        if(orgL[i].PhId==phidL[j]){
                            this.checkedOrgList.push( orgL[i] );
                            if( this.checkedOrgList.length == phidL){
                                return;
                            }
                        }
                    }
                }
            },
            //点击保存时，获取当前选中的组织
            getCheckedOrg:function(){
              this.checkedOrgList=this.$refs.tree.getCheckedNodes();
              this.checkedOrgListPhId=[];
              for( var i in this.checkedOrgList ){
                  this.checkedOrgListPhId.push( this.checkedOrgList[i].PhId )
              }
              this.orgListsVisible=false
            },

            //数据初始化
            initMethod() {
                console.log(this.newsProp)
                this.type = this.newsProp.type|| '';
                this.isHaveTop = this.newsProp.isHaveTop|| '';
                if( this.newsProp.selectedItem ){
                    this.form.PhId = this.newsProp.selectedItem.PhId|| '';
                    this.checkedOrgListPhId = this.newsProp.selectedItem.OrgList||[];
                }
                if (this.newsProp.activeNav) {
                    this.form.PhIdType=this.newsProp.activeNav.PhId
                    this.category = this.newsProp.activeNav.Category|| '';
                }
                if (this.type === 'add') {
                    //alert(type)
                } else if (this.type === 'edit') {
                    //获取编辑数据
                    this.ispublish=true;
                    this.getNewsData();
                }
            },
            //获取文章类别数据
            getTypeData() {
                let data = {
                    value:'signin3',
                    IsOrg:1
                }
                this.$axios.get('/SysNews/GetSysNewsTypeList', {params: data})
                    .then(res => {

                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }

                        this.articleType = res;
                    }).catch(err => {
                    console.log(err)
                    this.$message({showClose: true, message: "新闻类型获取错误", type: "error"});
                })
            },
            getNewsData() {
                this.fileList = []
                let data = {
                    id: this.form.PhId,
                    uid: this.userid,
                    orgid: this.orgid
                };
                const loading=this.$loading();
                //根据新闻id查询新闻信息和附件信息
                this.$axios.get('/SysNews/GetNewsAndAttachmentByNid', {params: data})
                    .then(res => {
                        loading.close();
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        this.isOnTop =  res.NewsModel.Ontop == 1 ? true :false;
                        var NewsModel=res.NewsModel;
                        var AttachmentModels=res.AttachmentModels;
                        NewsModel.Ontop=String(NewsModel.Ontop)

                        for(var art of this.articleType){
                            if(NewsModel.PhIdType==art.PhId){
                                NewsModel.PhIdType=art;
                            }
                            NewsModel.PhIdType = this.newsProp.activeNav.PhId
                        }
                        this.form = NewsModel;
                        console.log(res)

                        this.Attachment=AttachmentModels;
                        this.files=AttachmentModels;
                        this.publishName=NewsModel.Publish===1?'取消发布':'发布';
                        this.updateMask=NewsModel.Publish==1?true:false;
                        for (const attach of AttachmentModels){
                            this.fileList.push({
                                name:attach.BName,
                                url:this.picUrl+attach.BUrlPath,
                                PhId:attach.PhId
                            })
                        }


                    })
                    .catch(err => {
                        loading.close();
                        console.log(err)
                        this.$message({showClose: true, message: "文章获取错误", type: "error"});
                    })
            },
            //发布的新闻提示
            showMsg(){
              this.saasMessage={
                  message:'请先取消发布状态,再进行修改!',
                  visible:true
              }
            },
            /**
             * 预览按钮事件
             */
            preview() {
                /*this.$router.push({path: '/admin/article/preview', query: { phid:this.form.PhId }});*/
                this.visible_preview=true;
            },
            //新闻类型 选中值发生变化Change
            articleTypeChange(value){
               if(value.Name=='政策制度'){
                   this.form.levelType='';
               }else{
                   this.form.levelType=1;
               }
            },
            /**
             * 保存事件
             */
            onSubmit(val) {
                if (this.form.PhIdType != '291190117000002'){
                    this.form.LevelType = 0
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$refs['form2'].validate((valid2) => {
                            if(valid2){
                                // var activeEditor = this.tinymce.activeEditor;
                                // var editBody = activeEditor.getBody();
                                // activeEditor.selection.select(editBody);
                                // this.form.ContentText = activeEditor.selection.getContent({'format':'text'});
                                // if(this.form.PhIdType.Name!='政策制度'){
                                //     this.form.LevelType=2;
                                // }
                                if (this.type === 'add') {
                                    //新增保存
                                    this.AddSave(val);

                                } else if (this.type === 'edit') {
                                    //编辑保存
                                    this.UpdateSave(val);
                                }
                            }
                        });
                    }
                });
            },
            //新增
            async AddSave(val) {
                /**
                 * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
                 * 新增文章
                 *  */
                //创建 formData 对象
                // PersistentState: Added = 1, Modified = 2, Deleted = 3
                let formData = new FormData();
                formData.append("PhId", this.form.PhId);
                formData.append("PhIdType", this.form.PhIdType);
                formData.append("CodeType", this.form.CodeType);
                formData.append("Title", this.form.Title);
                formData.append("Content", this.form.Content);
                formData.append("ContentText", this.form.ContentText);
                formData.append("Ontop", Number(this.form.Ontop));
                formData.append("Name", this.form.Name);
                formData.append("Author", this.username);
                formData.append("Picpath", this.form.Picpath);
                formData.append("AttachmentName", this.form.AttachmentName);
                formData.append("AttachmentSize", this.form.AttachmentSize);
                formData.append("LevelType", this.form.LevelType);
                formData.append("IsOrg", 1);
                formData.append("OrgId", this.orgid);
                formData.append("OrgCode", this.orgCode);
                formData.append("AuthorPhId", this.userid);
                formData.append("OrgList", JSON.stringify( this.checkedOrgListPhId ));
                //新增附件的添加
               for (const file of this.files) {
                    formData.append("files", file);
                }
                //formData.append("files", this.files);
                this.AddSysNews(formData).then(res => {
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    this.$message.success("新增成功!");
                    this.ispublish=true;
                    if(val==1){
                        this.publish();
                    }
                    this.type = 'edit';
                    this.form.PhId=res.KeyCodes[0];
                    this.getNewsData();

                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '文章新增失败', type: 'error'})
                })
            },
            //编辑
            async UpdateSave(val) {
                var updateNews = JSON.parse(JSON.stringify(this.form));
                let formData = new FormData();
                //循环Form数据
                for (var item in updateNews){
                    console.log(item+":"+updateNews[item])
                    if(updateNews[item]!==null && item!=='PersistentState'){
                        formData.append(item, updateNews[item]);
                    }
                }
                let OldAttachments=[];
                //新增附件的添加
                for (const file of this.files) {
                    if( file.lastModified!=undefined) {
                        formData.append("file", file)
                    }else{
                        OldAttachments.push(file);
                    }
                }
                formData.append("OldAttachments", JSON.stringify( OldAttachments ) );
                formData.append("IsOrg", 1);
                formData.append("OrgId", this.orgid);
                formData.append("OrgCode", this.orgCode);
                formData.append("AuthorPhId", this.userid);
                formData.append("OrgList", JSON.stringify( this.checkedOrgListPhId ));
                const loading=this.$loading();
                this.UpdateSysNews(formData).then(res => {
                    loading.close();
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    this.$message.success("修改成功!");
                    if(val==1){
                        this.publish();
                    }
                    this.form.PhId=res.KeyCodes[0];
                    this.getNewsData();

                }).catch(error => {
                    loading.close();
                    console.log(error);
                    this.$message({showClose: true, message: '文章修改失败', type: 'error'})
                })

            },
            /**
             * 发布事件
             */
            publish() {
                this.$confirm('此操作将修改该文章的发布状态, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var updateNews = this.form;
                    if (updateNews.Publish === 0) {
                        //发布
                        updateNews.Publish = 1
                        updateNews.Publisher = this.username;
                    } else if (updateNews.Publish === 1) {
                        //取消发布
                        updateNews.Publish = 0
                        updateNews.Publisher = this.username;
                    }
                    // updateNews.PhIdType = this.form.PhIdType.PhId;
                    // updateNews.CodeType = this.form.PhIdType.Code;
                    updateNews.PhIdType = this.form.PhIdType;
                    updateNews.CodeType = this.form.Code;
                    updateNews["IsOrg"] = 1;
                    updateNews["OrgId"] = this.orgid;
                    updateNews["OrgCode"] = this.orgCode;
                    updateNews["AuthorPhId"] = this.userid;
                    this.$axios.post('/SysNews/PostPutSysNews', {
                        uid: this.userid,
                        orgid: this.orgid,
                        infoData: updateNews
                    }).then(res => {

                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        if (updateNews.Publish === 1) {
                            this.$message.success("发布成功!");

                        } else if (updateNews.Publish === 0) {
                            this.$message.success("取消发布成功!");

                        }
                        this.getNewsData(this.form.PhId);
                    })
                        .catch(err => {
                            console.log(err)
                        })
                })
            },
            /**
             * 取消事件
             */
            cancel() {
                //关闭移除当前的TagNav
                // this.$store.commit("tagNav/removeTagNav", this.$route);
                //跳转列表的首页
                //this.$router.push({path: "/admin/article"});
                this.$emit('close')
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
                this.tinymce=tinymceObj;
            },
            //删除附件
            attachmentRemove(file, fileList){
                let that= this
                this.$axios.post('/SysNews/PostAttachmentDelete', {
                    uid: this.userid,
                    orgid: this.orgid,
                    id: file.PhId
                }).then(res => {
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    console.log(that.files)
                    for (const k in that.files){
                        if (that.files[k].PhId&&that.files[k].PhId == file.PhId||that.files[k].uid&&that.files[k].uid == file.uid){
                            that.files.splice(k,1)
                        }
                    }
                    console.log(that.files)
                    this.$message.success("删除成功!");
                })
                .catch(err => {
                    console.log(err)
                })
            },
            beforeuploadAttach(file){
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 1MB!');
                    return false
                }
            },
            fileChangeAttach(file){
                this.files.push(file.raw);//上传文件变化时将文件对象push进files数组
            }
        }
    }</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .updateMask{
        position:relative;
        overflow: hidden;
    }
    .updateMask>div:last-of-type{
       position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
    }
</style>
<style >
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
        /* height: 100%; */
    }
    .upload-demo .el-upload--text{
        width: 100px;
        height: 40px;
        border: 0px;
    }
    .el-input__inner{
        line-height:30px;
    }
</style>
