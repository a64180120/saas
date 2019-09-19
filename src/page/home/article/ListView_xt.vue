<template>
    <div class="sys-page">
        <div class="journalism_box">
            <div class="journalism">
                <div class="journalism1">
                    <div style="overflow:hidden; padding:30px;">
                        <h4 class="artTitle"> {{ article.Title }}</h4>
                        <div class="info">
                            <p style="margin-top:10px;border-bottom: 1px solid #c5c9cf;">
                                <span>{{article.Name}}</span>
                                <span>{{ article.PublishTime | formatDate('YYYY-MM-DD HH:mm')}}</span>
                                <i class="hyzIcon_eye" style="color:#999;"></i>
                                <!-- <i style="width: 20px; height: 20px;display: inline-block;margin-left: 10px;margin-right:-12px;">
                                     <img  src="@/assets/images/yan.png" style="width: 100%;height: 100%;" />
                                 </i>-->
                                <span >{{article.Hitrate}}</span>
                            </p>
                        </div>
                    </div>
                    <div style="overflow:hidden; padding-left:30px; padding-right:30px; padding-bottom:30px;">
                        <art-preview :contents="article.Content" />
                    </div>
                    <div class="attachement" v-if='AttachmentList.length>0'>
                        <p>附件</p>
                        <ul class="attlist">
                            <li @click.stop="AttachmentDownLoad(item)" v-for="(item,index) of AttachmentList" :key="index">{{item.BName}}</li>
                        </ul>
                    </div>
                </div>
                <!--行业动态-->
                <template>
                    <div class="journalism2">
                        <div class="hyzTitleContent">
                            <div id="hyzTitle" class="hyzTitle">{{title}}</div>
                            <h3 class="fh"><router-link to="/home">返回首页</router-link></h3>
                        </div>
                        <ul>
                            <li v-for="(item,index) of listInfo" :key="index">
                                <div :class="{'active':item.PhId==article.PhId}" @click.stop="changeNews(item)" style='cursor: pointer;'>
                                    <h5>{{ item.Title}}</h5>
                                    <p>{{ item.PublishTime | formatDate('YYYY-MM-DD')}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from "vuex";
    import config from "@/util/ajaxConfig";
    import Auth from "@/util/auth";
    import md5 from "js-md5";
    import desHelper from "@/util/desHelper";
    import artPreview from '@/components/ArticlePreview'
    import httpConfig from '@/util/ajaxConfig'
    import topNav from '@/components/home/topNav'
    //文章新增、编辑
    export default {
        name: "Article_view",
        components: { artPreview,topNav },
        data() {
            let validPaw = (rule, value, callback) => {
                if (value == "" || value == undefined) {
                    callback();
                } else {
                    let reg = /^([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    if (!reg.test(value)) {
                        callback(new Error("不符合输入规则:6-12位"));
                    } else {
                        callback();
                    }
                }
            };
            return {
                userDropDown: false, //修改密码弹窗
                dialog: {
                    editPaw: {
                        show: false
                    }
                },
                editPaw: {
                    oldPaw: "",
                    newPaw: "",
                    confirmNewPaw: ""
                },
                editPawRules: {
                    oldPaw: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
                    newPaw: [
                        { required: true, message: "请输入新密码", trigger: "blur" },
                        { required: true, validator: validPaw, trigger: "blur" }
                    ],
                    confirmNewPaw: [
                        { required: true, message: "请再次输入新密码", trigger: "blur" },
                        { required: true, validator: validPaw, trigger: "blur" }
                    ]
                },
                article: {
                    PhId: '',         //主键
                    PhIdType: '',   //信息类别
                    Title: '',       //标题
                    Content: '',     //文本
                    Name: '',        //信息来源
                    LevelType: '',    //制度级别
                    Ontop: 0,        //是否置顶
                    Picpath: '',     //封面图片
                    AttachmentName: '',     //图片原始名称
                    AttachmentSize: '',     //图片大小
                    Publisher: '',   //发布人
                    PublishTime:''
                },
                typePhid:0,
                AttachmentList: [],   //附件
                listInfo:[],      //列表信息
                pageSize: 100, //pageSize
                pageIndex: 1, //pageIndex
                total:0,
                title:'',//新闻类别名
            };
        },
        watch:{
            'article.PhId':function(val1 ,val2){
                console.log(val1,val2)
                if(this.article.PhId){
                    this.getData(this.article.PhId);
                }

                this.getNewsListAll(this.typePhid)
            }
        },
        created() {},
        //加载数据
        activated: function() {
            this.article.PhId = this.$route.query.phid;
            this.typePhid = this.$route.query.typePhid;
            this.title=this.$route.query.title;
        },
        //计算
        computed: {
            picUrl: function() {
                return config.baseurl;
            },
            ...mapState({
                uid: state => state.user.userid,
                username: state => state.user.username,
                orgcode: state => state.user.orgcode,
                orgid: state => state.user.orgid,
                defultdbname: state => state.user.defultdbname
            }),
            userinfo: function() {
                var user = Auth.getUserInfoData();

                if (user) {
                    return user.userInfo;
                }
            }
        },
        methods: {
            ...mapActions({
                sysLogout: "user/logout",
                GetNewsList: "news/GetNewsList"
            }),
            //获取新闻数据
            getData(phid) {
                let data = {
                    id: phid,
                    type:'true',
                    defultdbname: true
                };

                this.$axios.get('/SysNews/GetNewsAndAttachmentByNid', {params: data})
                    .then(res => {
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        this.article = res.NewsModel;
                        this.AttachmentList=res.AttachmentModels;
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({showClose: true, message: "新闻获取错误", type: "error"});
                    })
            },
            //获取新闻列表
            getNewsListAll(phid){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    value:phid,
                    pagesize:this.pageSize,
                    pageindex:this.pageIndex-1,
                    queryfilter: '',
                    IsOrg:1
                };
                this.$axios.get('/SysNews/GetSysNewsListByTypeIdByOrg',{params:data})
                    .then(res=>{
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.$set(this,'listInfo',res.List)
                        this.total=Number(res.Total);
                    })
                    .catch(err=>{
                        console.log(err)
                        this.$message({ showClose: true,message: "新闻列表失败", type: "error"});
                    })


            },
            //修改内容
            changeNews(object){
                this.article.PhId=object.PhId;
            },
            //修改密码
            editPawClick() {
                this.dialog.editPaw.show = true;
            },
            //修改密码提交
            editPawSubmit() {
                this.$refs.editPaw.validate(valid => {
                    if (valid) {
                        if (this.editPaw.newPaw != this.editPaw.confirmNewPaw) {
                            this.$message.error("新密码与确认新密码不一致!");
                            return;
                        }

                        var oldPwd = md5(this.editPaw.oldPaw);
                        var newPwd = desHelper.Encrypt(this.editPaw.newPaw, oldPwd);

                        //接口要包含3个参数： uid、 oldPwd、 newPwd
                        let data = {
                            uid: this.uid,
                            orgid: this.orgid,
                            OldPwd: oldPwd,
                            NewPwd: newPwd
                        };
                        this.$axios
                            .post("/SysUser/PostUpdatePassword", data)
                            .then(res => {
                                if (res.Status == "success") {
                                    this.$message.success("密码修改成功!");
                                    this.dialog.editPaw.show = false;
                                    this.editPaw.oldPaw = "";
                                    this.editPaw.newPaw = "";
                                    this.editPaw.confirmNewPaw = "";
                                    this.$router.push("/login");
                                }

                                if (res.Status == "error") {
                                    this.$message.error(res.Msg);
                                    return false;
                                }
                            })
                            .catch(err => console.log(err));
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            //下载附件
            AttachmentDownLoad(item){
                let base=httpConfig.getAxiosBaseConfig();
                window.location.href = base.baseURL+"/File/GetDownLoadFile?filePath="+item.BUrlPath+"&fileName="+item.BName;
            },
            logoutClick() {
                //退出事件
                this.sysLogout().then(() => {
                    this.$router.push("/login");
                });
            },
        }
    };
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang="scss" scoped>
    .sys-page{
        padding:0;
        background: rgb(244, 244, 244);
    }
    .Top_navigation {
        width: 1177px;
        height: 70px;
        margin: auto auto 0;
    }
    .logo_box {
        max-width: 750px;
        float: left;
        height: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .logo_box img {
        width: 100%;
        margin-top: 15px;
    }
    .search_box {
        position:relative;
        float: right;
        z-index:50;
        width: 70px;
        height: 70px;
        background: rgba(0,0,0,0.5);
    }
    .sousuo{
        width: 245px;
        height: 40px;
        border-radius: 8px;
        position: absolute;
        background: #fff;
        right: 2px;
        bottom: -48px;
        z-index:50;
    }
    .nm{
        animation: flipInX 1s ease;
        animation-fill-mode: backwards;
    }
    .bottom_box {
        background: #282828;
        width: 1120px;
        margin: 15px auto 0;
        height: 360px;
        padding-left: 10px;
        padding-right: 7px;
        padding-top: 19px;
        padding-bottom: 10px;
    }
    .input_box{
        width:200px;
        height:30px;
        border: none;
        margin-top:4px;
        margin-left:9px;
        outline:none;
        color: #505050;
        line-height:0;
    }
    .search_box img {
        display: block;
        margin: 14px auto 0;
    }.Sign_box {
         float: right;
         width: 140px;
         height: 70px;

     }
    .Sign_box * {
        float: left;
    }
    .Sign_box p {
        font-size: 16px;
        line-height: 70px;
        color: #7fa409;
        margin-left: 5px;
    }
    .Sign_box img {
        width: 25%;
        margin-top: 17px;

    }
    .contact_box {
        width: 200px;
        float: right;
        height: 70px;
    }
    .contact_box * {
        float: left;
    }
    .policy {
        width: 1132px;
        height: 443px;
        margin: 15px auto 0;
        background: url('../../../assets/img/q6.png');
        background-size: 100%;
        padding-left: 16px;
        padding-right: 13px;
        padding-top: 19px;
        padding-bottom: 10px;
    }
    .chuang{
        position:absolute;
        right:-9px;
        top:-9px;
        width:136px;
        height:118px;
        background: url('../../../assets/img/g1.png');
        z-index:999;
    }
    .contact_box p {
        font-size: 16px;
        line-height: 70px;
        color: #7fa409;
        margin-left: 5px;
    }
    .contact_box img {
        width: 17%;
        margin-top: 17px;
        margin-left: 23px;
    }
    .decorate {
        background: #0183fd;
        width: 100%;
        height: 490px;
        margin-top: 35px;
        position: relative;
        overflow: hidden;
        animation: a 0.5s;
    }
    .decorate img {
        position: absolute;
    }
    .bottom_box_left{
        width:545px;
        height:330px;
        float:left;
    }
    .bottom_box_right{
        width:545px;
        height:330px;
        float:right;
    }
    .bottom_box_right ul{
        width:100%;
        height:100%;
        overflow:hidden;
    }
    .bottom_box_right ul li{
        width:300px;
        height:40px;
        color:#fff;
        float:left;
        line-height:37px;
        padding-left:0px;
        margin-left:145px;
    }
    .bottom_box_right ul li *{
        float:left;
    }
    .bottom_box_left ul li img{
        width:7%;
        margin-top:8px;
        margin-right:9px;
    }
    .bottom_box_left ul{
        width:100%;
        height:100%;
        overflow:hidden;

    }
    .bottom_box_left ul li{
        width:300px;
        height:40px;
        color:#fff;
        float:left;
        line-height:37px;
        padding-left:0px;
        margin-left:145px;
    }
    .bottom_box_left ul li *{
        float:left;
    }
    .bottom_box_left ul li img{
        width:7%;
        margin-top:8px;
        margin-right:9px;
    }
    .bottom_box_right ul{
        width:100%;
        height:100%;
        overflow:hidden;
    }
    .bottom_box_right ul li{
        width:300px;
        height:40px;
        color:#fff;
        float:left;
        line-height:37px;
        padding-left:0px;
        margin-left:145px;
    }
    .bottom_box_right ul li *{
        float:left;
    }
    .bottom_box_left ul li img{
        width:7%;
        margin-top:8px;
        margin-right:9px;
    }

    >ul.userDropDown{
        height:auto;
        opacity:1;
        border: 1px solid #E6E6FA;
        >li:first-of-type{
            margin-top:10px;
            >div{
                height:50%;
                line-height:100%;
            }
        }
    }
    .userInfo{
        display: inline-block;
        position:relative;
        color:#333;
        width:75%;
        >div{
            padding:0 20px 10px;
            height:70px;
            line-height:70px;
            position:relative;
            cursor:pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            >div{
                position:absolute;
                border:5px solid transparent;
                border-top-color:#333;
                top:30px;
                right:0px;
            }
        }
        >ul{
            position: absolute;
            height:0;
            overflow: hidden;
            top:70px;
            right:-37px;
            z-index: 99;
            background: #fff;
            transition:all 0.3s linear;
            opacity:0;
            border-radius:  0 0 3px 3px;
            >li{
                width:135px;
                height:45px;
                line-height:45px;
                text-align:center;
                cursor:pointer;
                padding:0 5px;
                >div{
                    width:100%;
                    text-align: center;
                }
                &:hover{
                    background:#e6f8fd;
                    color:#33c6f1;
                }
            }
        }
        >ul.userDropDown{
            height:auto;
            opacity:1;
            //   border: 1px solid #E6E6FA;
            >li:first-of-type{
                border-bottom: 1px solid #ebeef5;
                font-weight: 600;
                margin-bottom: 6px;
                padding-bottom: 6px;
                margin-top:10px;
                >div{
                    height:50%;
                    line-height:100%;
                }
            }
        }

    }
    /* */

    .journalism_box{
        width:100%;
        overflow:hidden;
    }
    .img_box{
        width:100%;
        height:40%;
    }

    .journalism{
        overflow: hidden;
        width: 1000px;
        margin: auto auto 0;
        margin-top: 20px;
    }
    .journalism1{
        overflow: hidden;
        width: 730px;
        background: #FFF;
        float: left;
        margin-bottom: 20px;
    }
    .journalism2{
        width:250px;
        background:#FFF;
        float:right;
        padding-bottom:10px;
    }
    .journalism1 ul{
        width: 100%;
        padding: 0 15px;
    }
    .journalism1 ul li{
        border-bottom: 1px solid #f0f2f5;
        cursor: pointer;
    }
    .tct{
        margin-top:10px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        font-size: 16px;
        height: 72px;

    }
    .x5{
        margin-top:10px !important;
        word-break: break-all !important;
        text-overflow: ellipsis !important;
        -webkit-box-orient: vertical !important;
        -webkit-line-clamp: 2 !important;

        -ms-box-orient: vertical !important;
        -ms-line-clamp: 2 !important;

        overflow: hidden !important;
        white-space: nowrap !important;
        display:block !important;
    }

    .ie .tct{
        margin-top:10px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -ms-box-orient: vertical;
        -ms-line-clamp: 2;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        white-space: nowrap;
        font-size: 16px;
    }
    .newstitle{
        font-size: 18px;
        font-weight: 600;
        line-height: 1.1;
        color: inherit;
        >h4:hover{
            color: #7fa409;
        }
    }

    .journalism2 ul{
        overflow: hidden;
        width: 220px;
        margin-top: 15px;
        margin-left: 15px;
        margin-bottom:15px;
    }
    .journalism2 ul li{
        width:100%;
        margin-top:10px;
        line-height:30px;
        border-bottom: 1px solid #f0f2f5;

    }
    .journalism2 ul li a{
        display:block;
        width:100%;
    }
    .journalism2 ul li a h5{
        color: #7fa409;
        line-height: 20px;
    }

    .fh{
        position: absolute !important;
        right: 15px !important;
        font-size: 15px !important;
        color: #7fa409 !important;
        >a, a:link, a:active, a:visited{
            color: #7fa409;
        }
    }
    .sou1{
        width: 84%;
        height: 100%;
        border: none;
        margin-left: 6px;
    }

    .hyzTitleContent{
        height:40px;
        padding: 0 0 10px 0;
        position: relative;
        overflow:hidden;
        border-bottom: #7fa409 2px solid;
        line-height: 40px;
    }
    .hyzTitle{
        padding: 0px 15px;
        color: #ffffff;
        height: 40px;
        position: absolute;
        z-index: 133;
    }
    #hyzTitle:after{
        content: '';
        display: inline-block;
        float: left;
        -webkit-transform: scale(1.1, 1.3) perspective(0.5em) rotateX(2.2deg);
        transform: scale(1.1, 1.3) perspective(0.5em) rotateX(2.2deg);
        -webkit-transform-origin: bottom left;
        -ms-transform-origin: bottom left;
        transform-origin: bottom left;
        background: #7fa409;
        border-top-right-radius: 2px;
        border-top-left-radius: 2px;
        position: absolute;
        top: 0px;
        bottom: -1px;
        left: -15px;
        right: 0px;
        z-index: -1;
    }
    .active{
        color: #7fa409;
    }
    .attachement{
        padding: 20px 30px;
        border-top: 1px solid #7fa409;
        p{
            margin-bottom: 15px;
            border-left: 6px solid #7fa409;
            padding-left: 6px;
            height: 10px;
            vertical-align: middle;
            line-height: 10px;
            font-size: 15px;
        }
        li{
            color: #00b7ee;
            text-decoration: underline;
            margin-bottom: 0;
            padding: 10px 0;
        }
    }
    .artTitle{
        font-size: 20px;
        text-align: center;
    }
    .info{
        text-align: right;
        color: #9e9e9e;
    }
</style>

