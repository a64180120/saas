<template>
    <div class="Top_navigation">
        <router-link to="/index">
            <div class="logo_box">
                <img :src="picUrl+settingInfo.platform.logo" />
            </div>
            <div :title="settingInfo.platform.platformname" class="logo_box platformname">
                {{settingInfo.platform.platformname}}
            </div>
        </router-link>
        <!--<div id="div" class="search_box">-->
        <!--<img src="@/assets/img/fdj.png" style="margin:0;"/>-->
        <!--<div id="sou" class="sousuo" style="display:none;"></div>-->
        <!--</div>-->
        <div class="Sign_box">
            <img src="@/assets/images/finance/SAAS-01.png" />
            <div @click.stop="userDropDown=!userDropDown" class="userInfo" v-if="userinfo">
                <div>{{username}}<div></div></div>
                <ul :class="{userDropDown:userDropDown}">
                    <li>
                        <div>{{userinfo.RealName}}</div>
                        <!--<div>({{userinfo.MobilePhone}})</div>-->
                        <div>{{setting.phone}}</div>
                    </li>
                    <li @click.stop="NavTo('finance')">进入平台</li>
                    <li @click.stop="editPawClick">修改密码</li>
                    <li @click.stop="logoutClick">退出登录</li>
                </ul>
            </div>
            <p v-if="!userinfo">
                <router-link style="color:#7fa409" to="/login">登录</router-link>
            </p>
            <p v-if="menuMeesage.register&&menuMeesage.register.isshow" ><span v-if="!userinfo">|</span></p>
            <p v-if="menuMeesage.register&&menuMeesage.register.isshow" >
                <router-link v-if="!userinfo" style="color:#7fa409" to="/register">注册</router-link>
            </p>
        </div>
        <div class="contact_box">
            <img src="@/assets/images/finance/SAAS-03.png" />
            <p>{{setting.phone}}</p>
        </div>

        <!-- el-dialog 弹出修改密码页面-->
        <el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" custom-class="editPawDialog">
            <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px" >
                <el-form-item label="旧密码" prop="oldPaw">
                    <el-input type="password" v-model="editPaw.oldPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPaw" id="newPaw">
                    <el-input type="password" key="inpNewPaw" v-model="editPaw.newPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmNewPaw" >
                    <el-input type="password" key="inpConfirmNewPaw" v-model="editPaw.confirmNewPaw" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="textC">
                <el-button type="primary" @click="editPawSubmit">保存</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import Auth from "@/util/auth";
    import {getOtherSetting} from '@/api/home'
    import { mapState, mapActions } from 'vuex'
    import config from '@/util/ajaxConfig'
    export default {
        name: "topNav",
        data(){
            let validPaw=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    //let reg=/^([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    let reg=/^(?=.*[A-Za-z!@#\$%\^&\*\(\)])([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    if(!reg.test(value)){
                        callback(new Error('不符合输入规则:6-12位且至少包含一个字母或其他字符'))
                    }else{
                        callback()
                    }
                }
            };
            return {
                userDropDown:false,
                settingInfo:{  //获取的设置信息
                    copyright:'',
                    linkus:'',
                    linkus2:'',
                    platform:''
                },
                setting:{
                    phone:''
                },
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
                        { required:true, validator:validPaw,trigger:'blur'}
                    ],
                    confirmNewPaw: [
                        { required: true, message: "请再次输入新密码", trigger: "blur" },
                        { required:true, validator:validPaw,trigger:'blur'}
                    ]
                },
                menuMeesage:{},
            }
        },
        computed:{
            picUrl:function(){
                return config.baseurl;
            },
            ...mapState({
                uid: state => state.user.userid,
                username: state => state.user.username,
                orgcode: state => state.user.orgcode,
                orgid: state => state.user.orgid,
                roleInfo:state=>state.user.roleInfo
            }),
            userinfo:function(){
                var user=Auth.getUserInfoData();
                if(user){
                    return user.userInfo
                }
            },

        },
        created(){
          this.otherSetting();
        },
        mounted(){
            this.getSysWebMenuMessage()
        },
        methods:{
            ...mapActions({
                sysLogout: "user/logout",
            }),
            //获取其他设置数据
            otherSetting(){
                var vm=this;
                var params={
                    value:"linkus,linkus2,copyright,platform"
                }
                getOtherSetting(vm,params).then(
                    (res)=>{
                        if(res.Status=='error'){
                            this.$message({showClose: true, message: "设置信息获取错误", type: "error"});
                        }else{
                            this.settingInfo=res;
                            this.setting.phone=res.linkus.linkphone;
                            // this.setting.qq=res.linkus.customservice;
                            // this.setting.fax=res.linkus.fax;
                            // this.setting.email=res.linkus.email;
                            // this.setting.weburl=res.linkus.weburl;
                            // this.setting.address=res.linkus.address;
                        }
                    }

                )
            },
            //修改密码
            editPawClick(){
                this.editPaw.oldPaw="";
                this.editPaw.newPaw="";
                this.editPaw.confirmNewPaw="";
                this.dialog.editPaw.show=true
            },
            //修改密码提交
            editPawSubmit() {
                this.$refs.editPaw.validate(valid => {
                    if (valid) {
                        if (this.editPaw.newPaw!= this.editPaw.confirmNewPaw) {
                            console.log("新密码与确认新密码不一致!");
                            this.$message.error("新密码与确认新密码不一致!");
                            return;
                        }

                        var oldPwd = md5(this.editPaw.oldPaw);
                        var newPwd = desHelper.Encrypt(this.editPaw.newPaw,oldPwd);

                        //接口要包含3个参数： uid、 oldPwd、 newPwd
                        let data={
                            uid:this.uid,
                            orgid:this.orgid,
                            OldPwd: oldPwd,
                            NewPwd: newPwd
                        };
                        this.$axios.post('/SysUser/PostUpdatePassword',data)
                            .then(res=>{
                                if (res.Status=='success'){
                                    this.$message.success("密码修改成功!");
                                    this.dialog.editPaw.show = false;
                                    this.editPaw.oldPaw="";
                                    this.editPaw.newPaw="";
                                    this.editPaw.confirmNewPaw="";
                                    this.$router.push("/login");
                                }

                                if (res.Status=="error"){
                                    this.$message.error(res.Msg);
                                    return false;
                                }
                            })
                            .catch(err=>console.log(err));

                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            logoutClick() {
                //退出事件
                this.sysLogout().then(() => {
                    this.$router.push("/login");
                });
            },
            //跳转工会****
            NavTo(str){
                if(!this.userinfo){
                    this.$router.push({path:'/login'});
                }else{
                    // if(str=='finance'){  //工会财务****************暂时没有数据直报
                    //
                    // }else{  //数据直报
                    //
                    // }
                    var data = {
                        orgId: this.orgid,
                        userId: this.uid
                    };
                    this.$axios
                        .get("SysRole/GetDefaultPageByRoles", { params: data })
                        .then(res => {
                            if (res.UrlAddress == null || res.UrlAddress == '') {
                                this.$message.error("当前用户还未赋予有页面的菜单权限，请联系管理员!");
                            } else {
                                //this.defaultPage = res.UrlAddress;
                                this.$router.push({path:res.UrlAddress});
                            }
                        })
                        .catch(err => {
                            this.saasMessage = {
                                message: "获取默认页面失败了!",
                                visible: true
                            };
                        });
                }
            },
            //获取网页菜单权限设置
            getSysWebMenuMessage() {
                let data = {
                    value: "signin,signin2,signin3"
                }
                this.$axios.get('/SysMessage/GetSysWebMenuMessage', {params: data}).then(res => {
                    if (res.Status ) {
                        this.$message.error(res.Msg);
                        return
                    }
                    for( var i in res ){
                        res[i].isshow = res[i].isshow==1?true:false;
                        // res[i].isshow=true;
                        if(res[i].title=='轮播图'){
                            this.getPic('轮播图','top')
                            //this.getTopPicList();//获取动态轮播图
                        }
                        if(res[i].title=='公会之窗'){
                            this.getBottomPicList();//工会之窗
                        }
                        /* if(res[i].title=='行业动态'){
                             this.getPic('行业动态','bottom')
                             this.getproInfoList();//获取行业动态信息
                             //this.getTrendPic();//行业动态
                         }*/
                        if(res[i].phid=='291190117000002'){
                            this.getnewsInfo();//获取政策制度信息
                        }
                        if(res[i].sign=='3'){
                            //this.getPic(res[i].title,'bottom');
                            this.getNewsList(res[i].title,res[i].phid);//获取行业动态信息
                        }

                        /*if(res[i].title=='行业动态'){

                            //this.menuMeesage = res
                        }*/
                    }
                    this.menuMeesage=res
                    console.log(this.menuMeesage)

                }).catch(err => {
                    console.log(err)
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
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

    height:65px;

}
.logo_box,.platformname{
    height:65px;
    line-height: 65px;
    font-weight: 800;
    font-size: 35px;
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
    line-height:none;
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
.userInfo{
    display: inline-block;
    position:relative;
    color:#333;
    >div{
        padding:0 20px 10px;
        height:70px;
        line-height:70px;
        position:relative;
        cursor:pointer;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width:100%;
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
</style>
