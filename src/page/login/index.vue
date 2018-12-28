<template>
    <div class="sys-login">
        <div class="register_head">
            <img src="../../assets/images/register/register_company_log.png">
            <div class="telPhone"><img src="../../assets/images/finance/SAAS-03.png"><span>0571-88270588</span></div>
        </div>
        <div class="login-area">
            <div class="form-area">
                <div class="form-group">
                    <div class="form-box">
                        <!--账号登录界面-->
                        <div :style="{'display':selectArea=='ordinaryLogin'?'block':'none'}">
                            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
                                <el-form-item prop="name">
                                    <img src="@/assets/images/register/1.png">
                                    <el-input v-model="loginForm.name" type="text" placeholder="用户名"></el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <img src="@/assets/images/register/2.png">
                                    <el-input v-model="loginForm.password" type="password"  placeholder="密码"></el-input>
                                </el-form-item>
                                <el-form-item v-if="isOrganize" prop="orgid"><!--v-if="isOrganize" -->
                                    <img src="@/assets/images/register/3.png">
                                    <el-select v-model="loginForm.orgid" filterable placeholder="请选择组织">
                                        <el-option v-for="item in options"
                                                   :key="item.PhId"
                                                   :label="item.OrgName"
                                                   :value="item.PhId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item >
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="loginForm.captcha" type="text"  placeholder="请输入验证码（必填）"></el-input>
                                    <div :disabled="disabled" class="selfBtn verifyCode"
                                         :style="{'background-color':'#fff','color':'blue'}">
                                         <img @click="VCodeChange" style="bottom: 1px;width: 90px;right: 3px;height: 25px;line-height: 25px;" :src="Verifycode" alt="">
                                    </div>
                                </el-form-item>
                                <div class="flexPublic">
                                    <p @click="selectArea='phoneLogin'">短信快捷登录</p>
                                    <div  class="flexPublic">
                                        <p  @click="selectArea='fixPassword'">忘记密码</p>
                                        <router-link to="/register"><p>注册账号</p></router-link>
                                    </div>

                                </div>
                                <div style="text-align: center">
                                    <div class="selfBtn blueBtn" @click="submitForm('loginForm')">登录</div>
                                    <router-link to="/index"><div class="selfBtn whiteBtn">取消</div></router-link>
                                </div>
                            </el-form>
                        </div>

                       <!--手机登录界面-->
                      <div :style="{'display':selectArea=='phoneLogin'?'block':'none'}">
                            <el-form :model="loginFormPhone" :rules="loginFormPhoneRules" ref="loginFormPhone" label-position="left" label-width="0px">
                                <el-form-item prop="phoneNum">
                                    <img src="@/assets/images/register/sj.png">
                                    <el-input v-model="loginFormPhone.phoneNum" type="text" placeholder="请输入手机号"></el-input>
                                    <div :disabled="disabled" class="selfBtn verifyCode"
                                         :style="{'background-color':disabled?'#CCCCCC':'#2473EB',
                                                    'color':disabled?'grey':'white',
                                                    'border-color':disabled?'#CCCCCC':'#2473EBe'}"
                                         @click="sendCode(1)">{{timertitle}}</div>
                                </el-form-item>
                                <el-form-item prop="phoneCode">
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="loginFormPhone.phoneCode" type="text"  placeholder="请输入短信验证码"></el-input>
                                </el-form-item>
                                <!--v-if="isOrganize" -->
                                <el-form-item prop="orgid">
                                    <img src="@/assets/images/register/3.png">
                                    <el-select v-model="loginFormPhone.orgid" filterable placeholder="请选择组织">
                                        <el-option v-for="item in options"
                                                   :key="item.PhId"
                                                   :label="item.OrgName"
                                                   :value="item.PhId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <div style="text-align: center">
                                    <div class="selfBtn blueBtn" @click="submitForm('loginFormPhone')">登录</div>
                                    <div class="selfBtn whiteBtn"  @click="selectArea='ordinaryLogin'">取消</div>
                                </div>
                            </el-form>
                        </div>
                        <!--忘记密码，修改密码界面-->
                        <div :style="{'display':selectArea=='fixPassword'?'block':'none'}">
                            <el-form :model="fixPwdForm" :rules="fixPwdFormRules" ref="fixPwdForm" label-position="left" label-width="0px">
                                <el-form-item prop="phoneNum">
                                    <img src="@/assets/images/register/sj.png">
                                    <el-input v-model="fixPwdForm.phoneNum" type="text" placeholder="请输入手机号"></el-input>
                                    <div :disabled="disabled" class="selfBtn verifyCode"
                                         :style="{'background-color':disabled?'#CCCCCC':'#2473EB','color':disabled?'grey':'white'}" @click="sendCode(2)">{{timertitle}}</div>
                                </el-form-item>
                                <el-form-item prop="phoneCode">
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="fixPwdForm.phoneCode" type="text" placeholder="请输入校验码"></el-input>
                                </el-form-item>
                                <!--<el-form-item prop="password">-->
                                    <!--<img src="@/assets/images/register/2-2.png">-->
                                    <!--<el-input v-model="fixPwdForm.password" type="password"  placeholder="请输入密码"></el-input>-->
                                <!--</el-form-item>-->
                                <el-form-item prop="newPassword">
                                    <img src="@/assets/images/register/2.png">
                                    <el-input v-model="fixPwdForm.newPassword" type="password"  placeholder="请输入新密码"></el-input>
                                </el-form-item>
                                <el-form-item prop="confirmPassword" >
                                    <img src="@/assets/images/register/2-1.png">
                                    <el-input v-model="fixPwdForm.confirmPassword" type="text"  placeholder="请确认新密码"></el-input>
                                </el-form-item>

                                <div style="text-align: center">
                                    <div class="selfBtn blueBtn" @click="submitForm('fixPwdForm')">修改</div>
                                    <div class="selfBtn whiteBtn" @click="selectArea='ordinaryLogin'">取消</div>
                                </div>
                            </el-form>
                        </div>

                        <div v-if="sysMsg" class="err-msg">{{sysMsg}}</div>
                    </div>
            </div>
            </div>
        </div>
        <div class="register_foot">
            <a>服务协议</a> | <a>运营范围</a> | <a>关于政云</a>
        </div>
        <div style="display: none;">
            <countdownpop></countdownpop>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import lodash from 'lodash';
import countdownpop from "../../components/countDownPop/index";
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****

export default {
    data() {
        let validMobile=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback()
            }else{
                let reg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if(!reg.test(value)){callback(new Error('手机号格式不对'))}else{
                    callback()
                }
            }
        };
        let validPwd=(rule,value,callback)=>{
            console.log(rule);
            if(value==''||value==undefined){
                callback()
            }else{
                let oldLength=value.length;
                let newLength=value.replace(/\s*/g,"").length;
                if(oldLength<6||oldLength>12){
                    callback(new Error('密码长度应在6-12位之间'))
                }else {
                    if (oldLength > newLength) {
                        callback(new Error('密码不得包含空格'))
                    }else{
                        callback()
                    }
                }
            }
        };
        let validPwdR=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback()
            }else{
                if (value!=this.fixPwdForm.newPassword){
                    callback(new Error('两次密码输入不一致'))
                }else{
                    callback()
                }
            }
        };
        let validCaptcha=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback()
            }else{
                if (value!=this.changeCaptcha){
                    this.sendCode(0)
                    callback(new Error('验证码错误'))
                }else{
                    callback()
                }
            }
        };
        let validPhoneCaptcha=(rule,value,callback)=>{
            console.log(value);
            console.log(this.phoneCaptcha);
            if(value==''||value==undefined){
                callback()
            }else{
                if (value!=this.phoneCaptcha){
                    callback(new Error('验证码错误'))
                }else{
                    callback()
                }
            }
        };
        let validPasswordCaptcha=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback()
            }else{
                if (value!=this.passwordCaptcha){
                    callback(new Error('验证码错误'))
                }else{
                    callback()
                }
            }
        };
        return {
            disabled:false,//用于禁用button
            selectArea:'ordinaryLogin',//显示界面 ordinaryLogin--普通账号密码登录  phoneLogin--手机验证码登录  fixPassword--修改密码
            loginForm: {
                name: '',
                password: '',
                orgid: '',
                captcha: ''
            },
            options: [],
            getDatas:'',
            loginRules: {
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password :[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {required:true,validator:validPwd,trigger:'blur'}
                ],
                orgid :[
                    {required: true, message: '请选择当前用户组织', trigger: 'blur'}
                ],
                captcha: [
                    {required: true, message: '请输入验证码', trigger: 'blur'},
                    {required:true, validator:validCaptcha, trigger: 'blur'}
                ]
            },
            captcha: {
                show: false,
                src: ''
            },

            //手机登录表单
            loginFormPhone: {
                phoneNum: '',
                phoneCode: '',
                orgid: ''
            },
            //手机登录表单验证方法
            loginFormPhoneRules:{
                phoneNum:[
                    {required:true, message: '请输入手机号', trigger: 'blur'},
                    {required:true,validator:validMobile,trigger:'blur'}
                ],
                phoneCode: [
                    {required:true, message: '请输入验证码', trigger: 'blur'},
                    {required:true,validator:validPhoneCaptcha,trigger: 'blur'}
                ],
                orgid:{required:true, message: '请输入值', trigger: 'blur'}
            },
            //密码修改表单
            fixPwdForm: {
                phoneNum:'',
                phoneCode: '',
                password: '',
                newPassword: '',
                confirmPassword: ''
            },
            //密码修改表单验证方法
            fixPwdFormRules:{
                phoneNum:[
                    {required:true, message: '请输入手机号', trigger: 'blur'},
                    {required: true,validator:validMobile,trigger:'blur'}
                ],
                phoneCode:[
                    {required:true, message: '请输入验证码', trigger: 'blur'},
                    {required: true,validator:validPasswordCaptcha,trigger:'blur'}
                ],
                newPassword:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {required: true,validator:validPwd,trigger:'blur'},
                ],
                confirmPassword: [
                    {required: true, message: '请再次输入密码', trigger: 'blur'},
                    {required: true,validator:validPwdR,trigger:'blur'}
                ]
            },
            changeCaptcha:'67912',//存储切换的验证码--普通登录验证码
            phoneCaptcha:'',// --手机号登录验证码
            passwordCaptcha:'',//--更改密码的验证码
            timertitle:'发送短信',
            sysMsg: '',
            loading: false,
            isOrganize:false,
            Verifycode:''
        }
    },
     //计算属性
    computed: {
        ...mapState({
            lang: state => state.lang,
            theme: state => state.theme
        }),
        loginid:function(){
            return Math.random()
        }
    },
    created() {
        this.Verifycode=httpConfig.getAxiosBaseConfig().baseURL+'/SysToken/GetSecurityCode?v='+ Math.random()+'&loginid='+this.loginid;
        //this.getImg();
    },
    watch: {
        //监听password变化 ，(debounce)停留0.5s获取组织信息
        'loginForm.password': lodash.debounce(function(val){

                const loading = this.$loading({
                    lock: true,
                    text: '正在加载数据.....',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.orgByUser({
                    uname_login:this.loginForm.name,
                    password:this.loginForm.password
                }).then(res => {
                    loading.close();
                    if(res){
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return;
                        }
                        //获取组织信息，当前组织只有一个时，直接登录
                        let orgData=res.Record;
                        if(orgData.length===1){
                            this.loginForm.orgid=orgData[0].PhId;
                            this.isOrganize=true;
                            this.options=orgData;
                            //this.submitForm('loginForm');
                        } else if(orgData.length===0){
                             this.$message.error("当前用户组织不存在!");
                        }
                        else{
                            this.isOrganize=true;
                            this.options=orgData;
                        }
                    }
                }).catch(err => {
                     loading.close();
                     console.log(err)
                })

        },500)
    },
    beforeMount(){
        // 初始化错误信息。保证单独点击input时可以弹出正确的错误提示
    },
    mounted(){

    },
    methods: {
        ...mapActions({
            login: 'user/loginByPhone',
            getToken:'user/getToken',
            orgByUser:'user/GetOrgByUser',
            GetVerifycode:'user/GetVerifycode'
        }),
        /*
        * 发送短信，用于短信验证或者登录
        * type  用于判断发送的验证码是哪种
        *   0--获取普通账号登录验证码
        *   1--获取手机验证码登录
        *   2--获取修改密码的手机验证码
        * */
        sendCode:function(type){
            if(type==0){
               let code= String(Math.floor(Math.random()*10))+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
               this.changeCaptcha=code;
            }else if(type==1){
                //发送验证码前，先进行手机验证，确保手机号正确
                this.$refs.loginFormPhone.validateField('phoneNum',(validMessage)=>{
                    if(validMessage){
                        this.$message(validMessage);
                    }else{
                        if(!this.disabled){
                            this.disabled=true;
                            let code= String(Math.floor(Math.random()*10))+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
                            this.phoneCaptcha=code;
                            console.log('========'+code);
                            this.timer(59,'phoneCaptcha');
                            this.timertitle='59S后重新发送';
                        }
                    }

                })
            }else{
                //发送验证码前，先进行手机验证，确保手机号正确
                this.$refs.fixPwdForm.validateField('phoneNum',(validMessage)=>{
                    if(validMessage){
                        this.$message(validMessage);
                    }else {
                        if (!this.disabled) {
                            let code = String(Math.floor(Math.random() * 10)) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
                            this.passwordCaptcha = code;
                            console.log(code);
                            this.disabled = true;
                            this.timer(59,'passwordCaptcha');
                            this.timertitle = '59S后重新发送';
                        }
                    }
                })
            }
        },
        /*
        * 验证码发送按钮倒计时
        * */
        timer:function(t,type){
            let that=this;
            t--;
            setTimeout(function(){
                if(t>0){
                    that.timertitle=t+'S后重新发送';
                    that.timer(t,type);
                }else{
                    that.disabled=false;
                    that.timertitle='重新发送验证码';
                    if(type=='phoneCaptcha'){
                        this.phoneCaptcha='';
                    }else{
                        this.passwordCaptcha=''
                    }
                }
            },1000)
        },
        submitForm(formName){

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const loading = this.$loading({
                        lock: true,
                        text: '正在登录.....',
                        spinner: 'el-icon-loading'
                    });




                    this.login({
                        name: this.loginForm.name,
                        password: this.loginForm.password,
                        orgid: this.loginForm.orgid
                    }).then(res => {
                        loading.close();
                        if(res.Status==="success"){
                            this.$router.push('home') //跳转主页


                            var para={
                                userid:'',
                                orgid:this.loginForm.orgid,
                                year:''
                            }
                            this.$store.dispatch('Pconfig/getBusinessConfig',para).then((res)=>{
                                console.log(res);
                            })

                        } else {
                            this.$message({ showClose: true, message: res.Msg, type: 'error' })
                        }
                    }).catch(error => {
                        loading.close();
                        console.log(error);
                    })
                } else {
                    return false
                }
            });
        },
        VCodeChange(){
            this.Verifycode=httpConfig.getAxiosBaseConfig().baseURL+'/SysToken/GetSecurityCode?v='+ Math.random()+'&loginid='+this.loginid;
        },
        getImg(){

            this.GetVerifycode({
                v:Math.random(),
                loginid:this.loginid
            }).then((res)=>{
                debugger
                //this.Verifycode=window.URL.createObjectURL(res.data);

                var binaryData = [];
                binaryData.push(res.data);
                this.Verifycode=window.URL.createObjectURL(new Blob(binaryData, {type: "image/png"}))
            })

        }
    },
    components: {countdownpop},
}
</script>
<style scoped>
    .flexPublic p{
        color: #000;
        font-size: 18px;
        padding: 0 10px 20px 10px;
    }
    i{
        width: 25px;
        height: 25px;
        background-color: #0183FD;
        color: white;
        font-size: 11pt;
        font-weight: 900;
        text-align: center;
        line-height: 25px;
        border-radius: 25px 25px;
        position: relative;
        left: 500px;
    }
    .register_head{
        height:61px;
        line-height: 61px;
        width: 100%;
        background-color: #211f20;
        overflow: hidden;
        position: fixed;
        top: 0;
        z-index: 99;
    }
    .register_head img{
        height: 51px;
        margin-left: 206px;
        margin-top: 5px;
    }
    .telPhone{
        color:#88b927;
        font-size: 20px;
        align-items: center;
        margin-right: 206px;
        float: right;
    }
    .telPhone>img{
        height: 40px;
        margin-top: 10px;
    }
    .register_foot{
        height:61px;
        line-height: 61px;
        width: 100%;
        background-color: #211f20;
        overflow: hidden;
        position: fixed;
        bottom: 0;
        z-index: 99;
        text-align: center;
        color: #fff;
    }
    .register_foot a{
        color: #fff;
        cursor: pointer;
    }
    .selficon_bac{
        border-top: 10px solid transparent;
        border-right: 10px solid #63b1fb;
        border-bottom: 10px solid transparent;
        position: absolute;
        right: -6px;
        top: 11px;
    }
    .selficon_frot{
        border-top: 10px solid transparent;
        border-right: 10px solid white;
        border-bottom: 10px solid transparent;
        position: absolute;
        right: -8px;
        top: 11px;
        z-index: 2;
    }
    .msgBox{
        position: absolute;
        right: -140px;
        top: 0;
        line-height: 20px;
        border: 1px solid #63b1fb;
        color: grey;
        padding: 10px 5px 10px 23px;
        font-size: 12px;
        width: 135px;
    }
    .msgBox>li:nth-of-type(2n-1){
        width: 3px;
        height: 3px;
        background-color: #63b1fb;
        border-radius: 5px;
        box-shadow: 0 0 3px 2px #63b1fb;
        position: absolute;
        left: 7px;
        top: 18px;
    }
    .msgBox>li:nth-of-type(3) {
        top: 38px;
    }
    .msgBox>li:nth-of-type(5){
        top:78px;
    }
    .el-select{
        width: 80px;
        height: 30px;
    }
    .sys-login{
        height: 100%;
        background-image: none;
        background-color: #f5f5f5;
    }
    .sys-login .login-area{
        width: 100%;
        min-width: 969px;
        height: 398px;
        margin: auto;
        position: absolute;
        top: 50%;
        margin-top: -199px;
        padding: 0;
        background: #0183fd;
        text-align: center;
    }
    .form-area{
        text-align: center;
        width: 100%;
        position: relative;
        top: -20px;

    }
    .form-group{
        margin: auto;
        width:725px ;
        height: 437px;
        background-color: #FFFFFF;
        background-image: none;
        border: 2px solid  #FFFFFF;
        box-shadow: 0px 50px 50px -25px #211F20;
        line-height: 18px;
        font-size: 10.0pt;
        font-family: Arial,Arial;
    }
    .form-group .msg{
        font-size:15px;
        color: #000;
        margin: auto auto;
        width: 70%;
        text-align: left;
    }
    .form-group .msg>p{
        font-size: 12px;
        padding-left: 30px;
    }
    .form-box{
        text-align: left;
        width: 407px;
        margin: 40px auto;
    }
    .card_content{
        display: flex;
        flex-direction: row;
    }
    .card_content>div{
        vertical-align: middle;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(217, 217, 217);
        border-radius: 0px;
        width: 170px;
        height: 170px;
        background-color: transparent;
        margin: 10px 5px;
    }
    .card_content>div:hover{
        border-color: #0183FD;
    }
    .card_content>div>img{
        width: 89px;
        height: 89px;
        cursor: pointer;
        margin-top: 20px;
    }
    .card_content>div>p{
        color: #0183FD;
        text-align: center;
        text-decoration: none;
        font-size: 20px;
        font-style: normal;
        line-height: 0px;
        margin-top: 30px;
    }
    .active_showarea{
        display:none
    }
    .selfBtn{
        cursor: pointer;
        width: 127px;
        height: 33px;
        border-radius: 5px 5px;
        line-height: 33px;
        font-size: 15px;
        text-align: center;
        display: inline-block;
    }
    .whiteBtn{
        margin-left:45px;
        background-color: transparent;
        border: 1px solid #2473EB;
        color:#2473EB
    }
    .blueBtn{
        background-color: #0183fd;
        border: 1px solid #0183fd;
        color:white
    }
    .verifyCode{
        display: inline-block;
        background-color: #fff;
        color: rgb(36, 115, 235);
        position: absolute;
        bottom: 5px;
        width: 100px;
        right: 3px;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        border: 1px solid rgb(36, 115,235);
    }
</style>
<style>
    .sys-login .form-group .el-form-item{
        border-width: 0px 0px 1px 0px;
        border-style: solid;
        border-color: #63b1fb;
        border-radius: 0 0;
    }
    .sys-login .form-group .el-form-item.is-error{
        border-color: #d45b5b;
    }
    .sys-login .form-group .el-form-item .el-form-item__content img{
        position: absolute;
        width: 30px;
        bottom:5px
    }
    .sys-login .form-group .el-input{
        background:none;

    }
    .sys-login .form-group .el-select .el-input .el-input__inner{
        padding: 0px;
        margin: 10px;
        width: 100px;
    }
    .sys-login .form-group .el-select .el-input .el-input__inner:first-child{
        margin-left: 40px;
        padding-left: 10px;
    }
    .sys-login .form-group .el-input__inner{
        background-color: white;
        border: none;
        margin-left: 40px;
        width: 345px;
    }
    .sys-login .form-group .el-input__suffix{
        display: none;
    }
    .sys-login .form-group .el-form-item.is-error .el-input__inner {
        border-color:transparent;
        background-color: transparent;
    }
    .el-select{
        text-align: center;
    }
</style>
