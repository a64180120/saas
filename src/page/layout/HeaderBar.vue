<template>
    <div class="sys-header">
        <!-- 折叠按钮 -->
        <!-- <div class="collapse-btn" >
                <i class="el-icon-menu" @click="collapseChage"></i>
        </div>-->
        <div class="logo" style="margin-right:40px;">
            <slot name="logo"></slot>
        </div>
        <slot name="topnav"></slot>
        <div @mouseenter="topMsgStop"  @mouseout="setTopMsgWidth"  v-if="topMsg" class="topMsgCon">
            <div>
                <img src="@/assets/images/lb.png" alt>
                <div class="topMsg" v-html="topMsg"></div>
            </div>

        </div>
        <div v-show="topMsgInfoCon" style="z-index: 999;" class="topMsgInfoCon" v-html="topMsg">

        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                            <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                                <i class="el-icon-rank"></i>
                            </el-tooltip>
                </div>-->
                <!-- 消息中心 -->
                <div class="telPhone">
                    <!-- <img src="../../assets/images/finance/SAAS-03.png"><span>0571-88270588</span> -->
                    <img src="@/assets/images/d1.png" alt="">
                    <div @click.stop="curOrgidZindex($event)" v-show="curOrgidShow" style="position:fixed;z-index:999;left:0;right:0;top:0;bottom:0;"></div>
                    <ul class="OrgNameCon">
                        <li :title="curOrg.OrgName" @click.stop="curOrgidZindex($event)" >{{curOrg.OrgName}}</li>
                        <li v-show="curOrgidShow">
                            <ul>
                                <li :title="item.OrgName" @click.stop="selectOrg(item.PhId)" v-for="item in orgList" :key="item.PhId">{{item.OrgName}}</li>
                            </ul>
                        </li>
                    </ul>
                    <!--<el-select v-model="curOrgid" filterable @change="SearchOrg">-->
                    <!--<el-option v-for="item in orgList" :key="item.PhId" :label="item.OrgName" :value="item.PhId" ></el-option>-->
                    <!--</el-select>-->
                </div>
                <!-- <div class="btn-bell">
                            <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                                <a @click="developing">
                                    <div class="message"><img src="../../assets/images/finance/SAAS-02.png"></div>
                </a>-->
                <!-- <router-link to="/notice">
                                    <div class="message"><img src="../../assets/images/finance/SAAS-02.png"></div>
                </router-link>-->
                <!-- </el-tooltip>
                            <span class="btn-bell-badge" v-if="message"></span>
                </div>-->
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/images/finance/SAAS-01.png">
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="userOperation">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="header-user">
                            <div>{{userInfoHead.RealName}}</div>
                            <div>({{userInfoHead.MobilePhone}})</div>
                        </el-dropdown-item>
                        <el-dropdown-item command="index">首页</el-dropdown-item>
                        <el-dropdown-item command="editPaw">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- el-dialog 弹出修改密码页面-->
        <el-dialog
            title="修改密码"
            :visible.sync="dialog.editPaw.show"
            :modal-append-to-body="false"
            custom-class="editPawDialog"
        >
            <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px">
                <el-form-item label="旧密码" prop="oldPaw">
                    <el-input type="password" v-model="editPaw.oldPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPaw" id="newPaw">
                    <el-input type="password" key="inpNewPaw" v-model="editPaw.newPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmNewPaw">
                    <el-input
                        type="password"
                        key="inpConfirmNewPaw"
                        v-model="editPaw.confirmNewPaw"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="textC">
                <el-button type="primary" @click="editPawSubmit">保存</el-button>
            </div>
        </el-dialog>
        <message :visible.sync="saasMessage.visible" :message="saasMessage.message"></message>
    </div>
</template>

<script>
    import { mapState, mapActions } from "vuex";
    import md5 from "js-md5";
    import desHelper from "@/util/desHelper";
    import auth from "@/util/auth";
    import httpajax from "axios";

    export default {
        data() {
            let validPaw = (rule, value, callback) => {
                if (value == "" || value == undefined) {
                    callback();
                } else {
                    let reg = /^(?=.*[A-Za-z!@#\$%\^&\*\(\)])([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    if (!reg.test(value)) {
                        callback(new Error("6-12位且至少包含一个字母或其他字符"));
                    } else {
                        callback();
                    }
                }
            };
            return {
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
                message: 2,
                userInfoHead: {},
                topMsg: "",
                saasMessage: {
                    message: "",
                    visible: false
                },
                curOrgid:'',
                orgList: [],
                curOrgidShow:false,  //组织选择显示
                topMsgInterval:'',//定时器
                topMsgInfoCon:false, //滚动消息详细信息弹窗
            };
        },
        created() {
            this.curOrgid=this.orgid;
            this.getOrgByUser()
        },
        mounted() {
            this.userinfoget();
            this.getTopMsg();
        },
        computed: {
            ...mapState({
                username: state => state.user.username,
                lang: state => state.lang,
                orgid: state => state.user.orgid,
                orgcode: state => state.user.orgcode,
                uid: state => state.user.userid,
                phone: state => state.user.username,
                roleInfo:state=>state.user.roleInfo,
                curOrg: state => state.user.curOrg,   //当前的组织信息

            }),
            collapse() {
                return this.$store.state.isCollapse;
            }
        },
        watch: {
            $route(newValue, oldValue) {
                this.addTagNav();
                //this.scrollToCurTag();
            }
        },
        methods: {
            addTagNav() {
                // 如果需要缓存则必须使用组件自身的name，而不是router的name
                this.$store.commit("tagNav/addTagNav", {
                    name: this.$router.getMatchedComponents()[1].name,
                    path: this.$route.path,
                    fullPath: this.$route.fullPath,
                    title: this.$route.meta.name,
                    noCache: this.$route.meta.noCache
                });
            },
            developing() {
                this.$message("功能未开放!");
            },
            ...mapActions({
                turnOrgClearInfo:"user/turnOrgClearInfo",
                sysLogout: "user/logout",
                orgByUser:'user/GetOrgByUser',
                relogin: 'user/reloginByOrg',
                businessConfig:'Pconfig/getBusinessConfig',
                GetAllRoleauthorize: 'user/GetAllRoleauthorize',
            }),
            userinfoget: function() {
                let user = auth.getUserInfoData();
                if (user) {
                    this.userInfoHead = user.userInfo;
                }
                //this.userInfoHead=auth.getUserInfoData().userInfo;
            },
            userOperation(command) {
                // 用户名下拉菜单选择事件
                switch (command) {
                    case "logout":
                        this.logout();
                        break;
                    case "editPaw":
                        this.editPaw.oldPaw = "";
                        this.editPaw.newPaw = "";
                        this.editPaw.confirmNewPaw = "";
                        this.dialog.editPaw.show = true;
                        break;
                    case "index":
                        this.NavTo('finance');
                        //this.$router.push('/finance') //跳转主页
                       //this.$route.NavTo('finance');
                       break;
                }
            },
            NavTo(str){
                var userinfo=auth.getUserInfoData();
                if(!userinfo){
                    this.$router.push({path:'/login'});
                }else{
                    // var data = {
                    //     orgId: this.orgid,
                    //     userId: this.uid
                    // };
                    // this.$axios.get("SysRole/GetDefaultPageByRoles", { params: data }).then(res => {
                    //      
                    //     if (res.Status === 'error') {
                    //         this.$message.error(res.Msg);
                    //         return
                    //     }
                    //     if (res.UrlAddress == null || res.UrlAddress == '') {
                    //         this.$message.error("当前用户还未赋予有页面的菜单权限，请联系管理员!");
                    //     } else {
                    //         this.$router.push({path:res.UrlAddress});
                    //     }
                    // })
                    // .catch(err => {
                    //     this.saasMessage = {
                    //         message: "获取默认页面失败了!",
                    //         visible: true
                    //     };
                    // });

                    this.$router.push({path:"/index"});
                }
            },
            logout() {
                //退出事件
                this.sysLogout().then(() => {
                    this.$router.push("/login");
                });
            },
            //
            curOrgidZindex($event){
                var ul=document.getElementsByClassName('OrgNameCon')[0];
                if(this.curOrgidShow){
                    this.curOrgidShow=false;
                    ul.style.zIndex='';
                }else{
                    this.curOrgidShow=true;
                    ul.style.zIndex=999;
                }
            },
            //获取导航滚动消息
            getTopMsg() {
                var data = {
                    orgid: this.orgid,
                    uid: this.uid
                };
                this.$axios
                    .get("SysOrganize/GetSystemConfigMessage", { params: data })
                    .then(res => {
                        if (res.Status == "success") {
                            this.topMsg = res.Msg;
                            if (!res.Msg) {
                                return;
                            }
                            this.topMsg = this.topMsg.replace(/\./g, "。");
                            this.$nextTick(this.setTopMsgWidth);
                            //自适应窗口
                            var vm = this;
                            window.addEventListener("resize", () => {
                                vm.setTopMsgWidth(2);
                            });
                        } else {
                            this.saasMessage = {
                                message: res.Msg,
                                visible: true
                            };
                        }
                    })
                    .catch(err => {
                        this.saasMessage = {
                            message: "获取滚动消息失败了!",
                            visible: true
                        };
                    });
            },
            //导航滚动消息设置元素宽度,启动定时器
            setTopMsgWidth(val) {
                var msg = document.getElementsByClassName("topMsg")[0];
                if(!msg){
                    return;
                }
                var header = document.getElementsByClassName("sys-header")[0];
                var logo = document.getElementsByClassName("logo")[0];
                var right = document.getElementsByClassName("header-right")[0];
                var msgCon = document.getElementsByClassName("topMsgCon")[0];
                var topMsgInfoCon = document.getElementsByClassName("topMsgInfoCon")[0];

                var h_w = window.getComputedStyle(header).width;
                var l_w = window.getComputedStyle(logo).width;
                var r_w = window.getComputedStyle(right).width;
                var m_w = window.getComputedStyle(msg).width;


                    topMsgInfoCon.style.width=msgCon.style.width =
                    parseFloat(h_w) - parseFloat(l_w) - parseFloat(r_w) - 110-170 + "px";  //减掉内外边距

                this.topMsgInfoCon=false;
                if(val!==2&&!this.topMsgInterval){
                    this.topMsgInterval=setInterval(function(){
                        if(parseInt(msg.style.marginLeft)<parseInt(m_w)*-1){
                            msg.style.marginLeft='0px';
                        }
                        if(!msg.style.marginLeft){
                            msg.style.marginLeft='0px';
                        }
                        msg.style.marginLeft=parseInt(msg.style.marginLeft)-1+'px';
                    },40)
                }
            },
            //导航滚动消息鼠标悬停
            topMsgStop(){
                var msg = document.getElementsByClassName("topMsg")[0];
                clearInterval(this.topMsgInterval);
                this.topMsgInterval=null;
                this.topMsgInfoCon=true;
            },

            collapseChage() {
                // 侧边栏折叠
                //this.collapseprop = !this.collapseprop;
                // childByValue是在父组件on监听的方法
                // 第二个参数this.childValue是需要传的值
                //this.$emit("collapseByValue", this.collapseprop);
            },
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
                                    return true;
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
            //获取当前账户的组织信息
            getOrgByUser() {
                this.$axios.get('/SysOrganize/GetSysOrganizeListByUser', {params: {
                        UserId:this.uid
                    }})
                    .then(res => {
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return;
                        }
                        //获取组织信息
                        this.orgList=res.Record;

                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //判断组织是否过期
            selectOrg(orgphid){
                var ul=document.getElementsByClassName('OrgNameCon')[0];
                this.curOrgidShow=false;//关闭弹窗
                ul.style.zIndex='';  //恢复层级

                var data={
                    uid: this.uid,
                    orgid:orgphid
                }
                const loading=this.$loading();
                this.$axios.get('SysOrganize/GetCheckServerDate',{params:data})
                    .then(res=>{
                        loading.close();
                        if(res.Status=='success'){

                            if(res.Symbol){
                                this.saasMessage={
                                    message:'当前组织已过期,无法使用!',
                                    visible:true
                                }
                                return;
                            }else{
                                this.SearchOrg(orgphid);
                            }
                        }else{
                            this.saasMessage={
                                message:res.Msg,
                                visible:true
                            }
                        }
                    })
                    .catch(err=>{
                        loading.close();
                        _$this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    })

            },
            //组织切换方法
            SearchOrg(orgphid){
                this.curOrgidShow=false;
                var _$this=this;

                //登录参数
                var logpara={
                    uid: this.uid,
                    orgid: orgphid
                };

                //获取配置信息
                var configPara={
                    userid:'',
                    orgid:orgphid,
                    year:''
                };

                const loading = _$this.$loading({
                    lock: true,
                    text: '正在切换组织.....',
                    spinner: 'el-icon-loading'
                });
                var route={};

                //清除缓存
                this.turnOrgClearInfo().then(() => {
                    //用户 -组织- 角色 信息更新
                    //权限菜单 信息更新
                    //账务的基础
                    httpajax.all([_$this.relogin(logpara), _$this.businessConfig(configPara)])
                        .then(httpajax.spread(function (res, perms) {

                            //两个请求现已完成
                            if(res.Status==="success"){
                                //加载菜单信息
                                var param={
                                    userid:res.Data.userInfo.PhId,
                                    orgid:res.Data.orgInfo.PhId
                                };
                                _$this.GetAllRoleauthorize(param);  //按钮权限
                                _$this.$store.dispatch('user/getNavList', param).then((navList) => {
                                    loading.close();
                                    var data = {
                                        orgId: _$this.orgid,
                                        userId: _$this.uid
                                    };
                                    _$this.$axios
                                        .get("SysRole/GetDefaultPageByRoles", { params: data })
                                        .then(res => {
                                            if (res.UrlAddress == null || res.UrlAddress == '') {
                                                _$this.$message.error("当前用户还未赋予有页面的菜单权限，请联系管理员!");
                                            } else {
                                                route.title=res.Name;
                                                route.name=res.Name;
                                                route.path=res.UrlAddress;
                                                route.fullPath=res.UrlAddress;
                                                _$this.$store.commit("tagNav/addTagNav", route);
                                                 _$this.$router.push(res.UrlAddress);

                                                
                                               
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            _$this.saasMessage = {
                                                message: "获取默认页面失败了!",
                                                visible: true
                                            };
                                        });
                                    /*var roleFlam;


                                    if(_$this.roleInfo.length>0){
                                        for(let i =0; i< _$this.roleInfo.length; i++){
                                            if(_$this.roleInfo[i].EnCode == '004'){
                                                roleFlam = 2;
                                            }
                                            if(_$this.roleInfo[i].EnCode == 'admin'){
                                                roleFlam = 3;
                                            }
                                            if(_$this.roleInfo[i].EnCode == '001'){
                                                roleFlam = 1;
                                                break;
                                            }
                                        }
                                    }

                                    if(roleFlam == 1){
                                        _$this.$router.push('/home') //跳转主页
                                        //跳转主页
                                    }else if(roleFlam == 2){
                                        _$this.$router.push('/system/account') //跳转系统管理
                                    }else {
                                        _$this.$router.push('/admin/orgin') //跳转组织管理
                                    }*/

                                })
                            } else {
                                loading.close();
                                _$this.$message({ showClose: true, message: res.Msg, type: 'error' })
                            }
                        })).catch(error => {
                        loading.close();
                        console.log(error);
                    });
                });
            }
        }
    };
</script>
<style scoped>
    * {
        box-sizing: border-box;
    }
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
    }
    .sys-header {
        box-shadow: 0 1px 8px #b3acac73;
        border-color: #f5f5f5;
    }
    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 60px;
        width: 180px;
        height: 59px;
    }
    .sys-header .logo {
        padding-left: 0;
        margin-left: 20px;
    }
    .header .logo {
        float: left;
        width: 250px;
        line-height: 60px;
    }
    .header-right {
        float: right;
        margin-right: 50px;
    }
    .header-user-con {
        display: flex;
        height: 60px;
        align-items: center;
    }
    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell,
    .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    /* .btn-bell-badge {
      position: absolute;
      right: -15px;
      top: 3px;
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: #f56c6c;
    } */
    .el-icon-menu {
        font-size: 20px;
    }
    .btn-bell .el-icon-bell {
        font-size: 20px;
    }
    .user-name {
        margin-left: 10px;
    }
    .user-avator {
        margin-left: 20px;
    }
    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .el-dropdown-link {
        cursor: pointer;
    }
    .el-dropdown-menu__item {
        text-align: center;
    }
    .header-title {
        font-size: 30px;
        font-weight: 600;
    }
    .header-user {
        border-bottom: 1px solid #ebeef5;
        line-height: 18px;
        font-weight: 600;
        margin-bottom: 6px;
        padding-bottom: 6px;
    }
    .telPhone {
        color: #88b927;
        font-size: 15px;
        height:30px;
        display: flex;
        align-items: center;
        position:relative;
        width:190px;
    }
    .telPhone > img {

        width: 30px;
    }
    .telPhone>ul{
        width: 160px;
        display: inline-block;
        height:30px;
        cursor:pointer;
        position:relative;
        background: #fff;
    }
    .telPhone>ul>li{
        height:30px;
        line-height: 30px;
        color:#666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding:0 5px;
    }
    .telPhone>ul>li>img{
        width:30px;
    }
    .telPhone>ul>li>ul{
        position:absolute;
        top:30px;
        left:0px;
        z-index: 9;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        background: #fff;
        box-shadow: 0 2px 5px #ccc;
    }
    .telPhone>ul>li>ul>li{
        height:30px;
        line-height: 30px;
        width:160px;
        color:#666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding:0 5px;
    }
    .telPhone>ul>li>ul>li:hover{
        color:#88b927;
    }
    .telPhone>ul>li:first-of-type{
        padding-right:20px;
        position:relative;
    }
    .telPhone>ul>li:first-of-type:after{
        content:"";
        position:absolute;
        right: 0px;
        top: 8px;
        width: 18px;
        height: 15px;
        background: url("../../assets/images/x1.png") no-repeat;

    }
    .telPhone>ul>li:first-of-type:hover{
        color:#666;
    }

    .message > img {
        width: 100%;
    }
    .user-avator > img {
        width: 35px;
        height: 30px;
    }
    .sys-header .header-user-con .el-dropdown {
        color: #333;
    }
    .topMsgCon {
        float: left;
        height: 100%;
        overflow: hidden;
        margin-left:70px;
        position:relative;
    }
    .topMsgCon > div {
        white-space: nowrap;
        line-height: 60px;
        padding-left: 35px;
        position: relative;
    }
    .topMsg {
        display: inline-block;
        font-size: 16px;
        color: #999;
        letter-spacing: 2px;
    }
     .topMsgInfoCon{
         position: absolute;
         box-shadow: 0 2px 1px #ccc;
         background: #fff;
         z-index: 999;
         top: 50px;
         padding: 10px;
         font-size: 20px;
         border-radius: 4px;
         left: 390px;
    }
    .topMsgCon > div > img {
        position: absolute;
        left: 0;
        top: 17px;
        width: 30px;
        vertical-align: middle;
        background: #fff;
    }
</style>
<style>

    .topMsg strong {
        color: red;
        font-style: normal;
        font-size: 18px;
    }
    .topMsgInfoCon strong{
        color: red;
        font-style: normal;
        font-size: 22px;
    }

</style>
