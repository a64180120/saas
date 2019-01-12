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
                        <i class="el-icon-close" :style="{display:((showArea=='selectArea'||showArea=='firstStep')?'block':'none')}" @click="backToLogin" style="cursor: pointer"></i>
                        <div :class="{active_showarea:showArea!='selectArea'}">
                            <div class="el-message-box__title" style="color: rgb(1,131,253)">请选择注册方式</div>
                            <div class="card_content">
                                <div @click="changeshowArea('firstStep','0')" style="cursor: pointer">
                                    <img src="@/assets/images/register/register_ordinary.png">
                                    <p>普通注册</p>
                                </div>
                                <div @click="changeshowArea('firstStep','1')" style="cursor: pointer">
                                    <img src="@/assets/images/register/register_code.png">
                                    <p>邀请码注册</p>
                                </div>
                            </div>
                        </div>
                        <el-form :model="registerForm1" :rules="registerRules1"  ref="validFormF" label-position="left" label-width="0px">
                            <div :class="{active_showarea:showArea!='firstStep'}" >
                                <div style="height: 65px;line-height: 30px">
                                    <div  class="el-message-box__title">当前注册方式: {{checkType==0?'普通注册':'邀请码注册'}}</div>
                                    <!--<el-radio label="0" v-model="checkType">普通注册</el-radio>-->
                                    <!--<el-radio label="1" v-model="checkType">邀请码注册</el-radio>-->
                                </div>
                                <template v-if="checkType==0">
                                    <el-form-item prop="name">
                                        <img src="@/assets/images/register/1.png">
                                        <el-input v-model="registerForm1.name" type="text"
                                                  placeholder="请输入联系人姓名（必填）"></el-input>
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <el-form-item prop="code">
                                        <img src="@/assets/images/register/1.png">
                                        <el-input v-model="registerForm1.code" type="text" placeholder="请输入邀请码（必填）"></el-input>
                                    </el-form-item>
                                </template>

                                <el-form-item prop="phone">
                                    <img src="@/assets/images/register/sj.png">
                                    <el-input v-model="registerForm1.phone" type="text" placeholder="请输入手机号（必填）"></el-input>
                                </el-form-item>
                                <el-form-item prop="phonecode" >
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="registerForm1.phonecode" type="text"  placeholder="请输入手机验证码（必填）"></el-input>
                                    <div :disabled="disabled" class="selfBtn verifyCode"
                                         :style="{'background-color':disabled?'#CCCCCC':'#2473EB','color':disabled?'grey':'white'}" @click="sendCode" id="timerArea">{{timertitle}}</div>
                                </el-form-item>
                                <div style="text-align: center">
                                    <template v-if="checkType==0">
                                        <div class="selfBtn blueBtn" @click="changeshowArea('secondStep')">下一步</div>
                                        <router-link to="/index"><button class="selfBtn whiteBtn">取消</button></router-link>
                                    </template>
                                    <template v-else>
                                        <div class="selfBtn blueBtn" @click="codeRegister">完成</div>
                                    </template>

                                </div>
                            </div>
                        </el-form>
                        <el-form style=" margin-top:45px;" :model="registerForm2" :rules="registerRules2" ref="validFormS" label-position="left" label-width="0px">
                            <div :class="{active_showarea:showArea!='secondStep'}">
                                <el-form-item prop="company">
                                    <img src="@/assets/images/register/1.png">
                                    <el-input v-model="registerForm2.company" type="text" placeholder="请输入企业/单位名称（必填）"></el-input>
                                </el-form-item>
                                <el-form-item prop="addressDetail">
                                    <img src="@/assets/images/register/dz.png" style="bottom: 35px;">
                                    <el-select v-model="registerForm2.provincevalue" placeholder="请选择"  @change="searchArea(registerForm2.provincevalue,1)">
                                        <el-option
                                            v-for="item in province"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value" >
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="registerForm2.cityvalue" placeholder="请选择" @change="searchArea(registerForm2.cityvalue,2)">
                                        <el-option
                                            v-for="item in city"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="registerForm2.countyvalue" placeholder="请选择" @change="searchArea(registerForm2.countyvalue,3)">
                                        <el-option
                                            v-for="item in county"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="registerForm2.streetvalue" placeholder="请选择">
                                        <el-option
                                            v-for="item in street"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="registerForm2.addressDetail" type="text" placeholder="请输入详细地址、门牌号（必填）"></el-input>
                                </el-form-item>
                                <!--<el-form-item prop="addressDetail">
                                    <img src="@/assets/images/register/register_ordinary.png">

                                </el-form-item>-->
                                <el-form-item prop="password">
                                    <img src="@/assets/images/register/2.png">
                                    <el-input v-model="registerForm2.password" type="password" placeholder="请输入密码（必填）" @focus="showMsg" @blur="hideMsg"></el-input>
                                    <div :style="{'display': showMsgFlag?'block':'none'}" >
                                        <div class="selficon_bac"></div>
                                        <div class="selficon_frot"></div>
                                        <ol class="msgBox">
                                            <li></li>
                                            <li>长度为6-12个字符</li>
                                            <li></li>
                                            <li>支持数字、大小写字母和标点符号</li>
                                            <li></li>
                                            <li>不允许有空格</li>
                                        </ol>
                                    </div>
                                </el-form-item>

                                <el-form-item prop="confirmpassword">
                                    <img src="@/assets/images/register/2-1.png">
                                    <el-input v-model="registerForm2.confirmpassword" type="password" placeholder="请输入确认密码（必填）"></el-input>
                                </el-form-item>
                                <div style="text-align: center">
                                    <div class="default selfBtn blueBtn" @click="changeshowArea('firstStep')">上一步</div>
                                    <div class="selfBtn whiteBtn" @click="changeshowArea('sub')">注册</div>
                                </div>
                            </div>
                        </el-form>
                        <!--<el-form-item v-if="isOrganize" prop="orgid">
                        <el-select v-model="loginForm.orgid" filterable placeholder="请选择组织">
                            <el-option v-for="item in options"
                                       :key="item.PhId"
                                       :label="item.OrgName"
                                       :value="item.PhId">
                            </el-option>
                        </el-select>
                    </el-form-item>-->


                        <div v-if="sysMsg" class="err-msg">{{sysMsg}}</div>
                    </div>
                    <div class="msg" :style="{'display':showArea=='selectArea'?'block':'none'}">
                        <h1>说明：</h1>
                        <p>1、注册方式选择“普通注册”的，提交注册信息后，待管理人员审核通过后，可正常使用平台功能，申请结果将以短信方式通知。</p>
                        <p>2、注册方式选择“邀请码注册”的，核对相关信息无误并提交成功后，即表示注册成功，可正常使用平台功能。</p>
                        <p>3、注册成功后，15日内您可免费试用本平台。若相关信息在此期间未完善上传或者审核不通过的，您将无法继续正常使用本平台功能。</p>
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
    import countdownpop from "../../components/countDownPop/index";
    import httpConfig from "../../util/ajaxConfig";
    import httpajax from "axios";
    // import TimeSelectBar from "../../components/TimeSelectBar/index";
    import qs from 'qs'
    export default {
        name: "index",
        data(){
            let validMobile=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let reg=/[0-9]{11}/
                    if(!reg.test(value)){callback(new Error('手机号格式不对'))}else{
                        callback()
                    }
                }
            };
            let validCode=(rule,value,callback)=>{
              if(value==''||value==undefined){
                  callback();
              }else{
                  let that=this;
                  let base = httpConfig.getAxiosBaseConfig();
                  let headconfig = httpConfig.getTestHeaderConfig();
                  httpajax.create(base)({
                      method: 'get',
                      url: '/SysUser/GetCheckMsgCode?phone='+that.registerForm1.phone+'&type=register&code='+value,
                      headers: headconfig
                  }).then(res => {
                      console.log(JSON.parse(res.data).Status);
                      if(JSON.parse(res.data).Status=='error'){
                          callback(new Error(JSON.parse(res.data).Msg))
                      }else{
                          callback();
                      }
                  }).catch(err=>{
                      console.log(err);
                      callback(new Error('验证码错误'))
                  })
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
                console.log(2);
                if(value==''||value==undefined){
                    callback()
                }else{
                   if (value!=this.registerForm2.password){
                       callback(new Error('两次密码输入不一致'))
                   }else{
                       callback()
                   }
                }
            };


            return{
                showMsgFlag:false,
                sysMsg:'',
                timertitle:'发送验证码',
                disabled:false,

                checkType:'1',
                registerForm1:{
                    name: '',
                    code:'',
                    phone:'',
                    phonecode:'',
                },
                registerRules1:{
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    code:[
                        {required:true,message:'请输入邀请码',trigger:'blur'}
                    ],
                    phone:[
                        {required:true,message:'请输入手机号',trigger:'blur'},
                        {required:true,validator:validMobile,trigger:'blur'}
                    ],
                    phonecode:[
                        {required:true,message:'请输入验证码',trigger:'blur'},
                        // {required:true,validator:validCode,trigger:'blur'}
                    ],
                },
                registerForm2:{
                    company:'',
                    provincevalue: '',
                    cityvalue: '',
                    countyvalue: '',
                    streetvalue: '',

                    addressDetail:'',
                    password: '',
                    confirmpassword:'',
                },
                registerRules2:{
                    company:[
                        {required:true,message:'请输入企业/单位名称',trigger:'blur'}
                    ],
                    streetvalue:[
                        {required:true,message:'请选择地址',trigger:'blur'}
                    ],
                    addressDetail:[
                        {required:true,message:'请输入详细地址',trigger:'blur'}
                    ],
                    password :[
                        {required: true,validator:validPwd,trigger:'blur'},
                        {required: true, message: '请输入密码', trigger: 'blur'},

                    ],
                    confirmpassword :[
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {required: true,validator:validPwdR,trigger:'blur'}
                    ]
                },

                province: [],
                city: [],
                county: [],
                street: [],
                showArea:'selectArea'
            }
        },
        components: {countdownpop},
        mounted(){
            this.searchArea(0,0);
        },
        methods:{
            backToLogin:function(val){
                if(this.showArea=='selectArea'){
                    this.$router.push({name: 'login'});
                }else{
                    this.showArea="selectArea";
                }

            },
            showMsg:function(){
              this.showMsgFlag=true;
            },
            hideMsg:function(){
                this.showMsgFlag=false;
            },
            changeshowArea:function(val,type){

                if(type!=undefined){
                    this.checkType=type;
                }
                if(val=='firstStep'){
                    this.showArea=val;
                }
                if(val=='secondStep'){
                    if(this.checkType==0){
                        this.registerRules1.code[0].required=false;
                        this.registerRules1.name[0].required=true;
                    }else{
                        this.registerRules1.code[0].required=true;
                        this.registerRules1.name[0].required=false;
                    }
                    this.$refs.validFormF.validate((valid) => {
                        console.log(valid);
                        if(valid){
                            this.showArea=val;
                        }
                    })
                }
                if(val=='sub'){
                    console.log('===========1=========')

                    this.$refs.validFormS.validate((valid) => {
                        console.log('valid'+valid);

                        if(valid){
                            this.showArea=val;
                            let userInfo={
                                'RealName':this.registerForm1.name,
                                'Account':this.registerForm1.phone,
                                'MobilePhone':this.registerForm1.phone,
                                'Password':this.registerForm2.password
                            }, orgInfo={
                                'OrgName':this.registerForm2.company,
                                'Province': this.registerForm2.provincevalue,
                                'City': this.registerForm2.cityvalue,
                                'County':this.registerForm2.countyvalue,
                                'Street':this.registerForm2.streetvalue,
                                'Address':this.registerForm2.addressDetail
                            };
                            // )
                            let base=httpConfig.getAxiosBaseConfig();
                            //测试的Header
                            let headconfig=httpConfig.getTestHeaderConfig();
                            httpajax.create(base)({
                                method: 'post',
                                url: '/SysUser/PostRegister',
                                data: qs.stringify({
                                    'userInfo':userInfo,
                                    'orgInfo':orgInfo
                                }),
                                headers:headconfig
                            }).then(res => {
                                res=JSON.parse(res.data);
                                console.log(res);
                                if(res.Status=='success'){
                                    this.$message('注册成功!');
                                    this.$router.push({ path: "/login"})
                                }else{
                                    this.$message(res.Msg);
                                    this.showArea='selectArea';
                                    this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                                    this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                                    this.searchArea(0,0);
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    })
                }

            },
            check:function(val){
                console.log(val);
                this.checkType=val;
            },
            sendCode:function(){
                this.$refs.validFormF.validateField('phone',(validMessage)=> {
                    if (validMessage) {
                        this.$message(validMessage);
                    } else {
                        if (!this.disabled) {
                            this.disabled = true;
                            this.getPhoneCode('register', this.registerForm1.phone);
                            this.timer(59);
                            document.getElementById('timerArea').innerText = '59S后重新发送';
                        }
                    }
                })
            },
            /*
       * 手机验证码获取接口
       * type:类型
       * phone:手机号
       * */
            getPhoneCode:function(type,phone) {
                let base = httpConfig.getAxiosBaseConfig();
                let headconfig = httpConfig.getTestHeaderConfig();
                httpajax.create(base)({
                    method: 'get',
                    url: '/SysUser/GetMsgCode?phone='+phone+'&type='+type,
                    headers: headconfig
                }).then(res => {
                    console.log(res);
                }).catch(err=>{
                    console.log(err);
                })
            },
            //邀请码注册
            codeRegister:function(){

                this.$refs.validFormF.validate((valid) => {
                    console.log(valid);
                    if(valid){
                        console.log(this.registerForm1.phone);
                        console.log(this.registerForm1.code);
                        console.log(this.registerForm1.phonecode);
                        //alert('待开发');
                        let base = httpConfig.getAxiosBaseConfig();
                        let headconfig = httpConfig.getTestHeaderConfig();
                        httpajax.create(base)({
                            method: 'get',
                            url: '/SysUser/GetCheckInvitationCode?Phone='+this.registerForm1.phone+'&InvitationCode='+this.registerForm1.code,
                            headers: headconfig
                        }).then(res => {
                            console.log(res);
                            //data: "{"Status":"error","Msg":"邀请不存在，请联系邀请人"}";
                            if(JSON.parse(res.data).Status=='error'){
                                this.$message(JSON.parse(res.data).Msg);
                                this.registerForm1.code='';
                            }else{
                                this.$message('验证成功!');
                                this.$router.push({ path: "/login"})
                            }
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                })
            },
            timer:function(t){
                    let that=this;
                    t--;
                    setTimeout(function(){
                        if(t>0){

                            document.getElementById('timerArea').innerText =t+'S后重新发送';
                            that.timer(t);
                        }else{
                            that.disabled=false;
                            document.getElementById('timerArea').innerText ='重新发送验证码';
                        }
                    },1000)
            },
        //    查询省市县街道
            searchArea:function(val,level){
                let that=this;
                let base=httpConfig.getAxiosBaseConfig();
                //测试的Header
                let headconfig=httpConfig.getTestHeaderConfig();
                httpajax.create(base)({
                    url: "/SysArea/GetAreaList?id="+val,
                    method: "get",
                    headers:headconfig
                }).then(
                    function(res){
                        let time=JSON.parse(res.data);
                        res=time;
                        if(level==0){
                            that.province=res;
                            that.registerForm2.provincevalue=res[0].label;
                            that.searchArea(res[0].value,1)
                        }else if(level==1){
                            that.city=res;
                            that.registerForm2.cityvalue=res[0].label;
                            that.searchArea(res[0].value,2)
                        }else if(level==2){
                            that.county=res;
                            that.registerForm2.countyvalue=res[0].label;
                            that.searchArea(res[0].value,3)
                        }else if(level==3){
                            that.street=res;
                            that.registerForm2.streetvalue=res[0].label;
                        }else{
                            that.registerForm2.streetvalue=val;
                        }
                    }
                )
            }
        },
        // watch:{
        //     provincevalue(){
        //         this.searchArea(this.registerForm2.provincevalue,1)
        //     },
        //     cityvalue(){
        //         this.searchArea(this.registerForm2.cityvalue,2)
        //     },
        //     countyvalue(){
        //         this.searchArea(this.registerForm2.countyvalue,3)
        //     }
        // }
    }

</script>

<style scoped>
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
        background-color: #f5f5f5;
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
        margin: 20px auto;
    }
    .card_content{
        text-align: center;
        margin: auto;
    }
    .card_content>div{
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(217, 217, 217);
        border-radius: 0px;
        width: 170px;
        height: 170px;
        background-color: transparent;
        margin: 10px;
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
        width: 120px;
        height: 33px;
        border-radius: 5px 5px;
        line-height: 33px;
        font-size: 16px;
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
        background-color: #2473EB;
        border: 1px solid #2473EB;
        color:white
    }
    .blueBtn_verify{
        background-color: #2473EB;
        border:0;
        color:white;
        display: inline-block;
        margin-left: 20px;
        font-weight: 100;
        font-size: 10pt;
        width: 130px;
    }
    .verifyCode{
        display: inline-block;
        background-color: rgb(36, 115, 235);
        color: white;
        position: absolute;
        bottom: 5px;
        width: 100px;
        right: 3px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
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
