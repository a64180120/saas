<template>
    <div class="sys-login">
        <div class="login-area">
            <div class="logo">
                <img src="@/assets/images/logo.png" alt="">
            </div>
            <div class="form-group">
                <div class="title">注册</div>
                <div class="form-box">
                    <div :class="{active_showarea:showArea!='selectArea'}">
                                <div class="el-message-box__title">请选择注册方式</div>
                                <div class="card_content">
                                    <div @click="changeshowArea('firstStep','0')">
                                        <img src="@/assets/images/register/register_ordinary.png">
                                        <p>普通注册</p>
                                    </div>
                                    <div @click="changeshowArea('firstStep','1')">
                                        <img src="@/assets/images/register/register_code.png">
                                        <p>邀请码注册</p>
                                    </div>
                                </div>
                        </div>
                    <el-form :model="registerForm1" :rules="registerRules1"  ref="validForm1" label-position="left" label-width="0px">
                        <div :class="{active_showarea:showArea!='firstStep'}" >
                        <div style="height: 65px;line-height: 30px">
                            <div  class="el-message-box__title">请选择注册方式</div>
                            <el-radio label="0" v-model="checkType">普通注册</el-radio>
                            <el-radio label="1" v-model="checkType">邀请码注册</el-radio>
                        </div>
                        <template v-if="checkType==0">
                            <el-form-item prop="name">
                                <el-input v-model="registerForm1.name" type="text" placeholder="请输入联系人姓名（必填）"></el-input>
                            </el-form-item>
                        </template>
                        <template v-else>
                            <el-form-item prop="code">
                                <el-input v-model="registerForm1.code" type="text" placeholder="请输入邀请码（必填）"></el-input>
                            </el-form-item>
                        </template>

                        <el-form-item prop="phone">
                            <el-input v-model="registerForm1.phone" type="text" placeholder="请输入手机号（必填）"></el-input>
                        </el-form-item>
                        <el-form-item prop="phonecode" >
                            <el-input class="verifyCode" v-model="registerForm1.phonecode" type="password"  placeholder="请输入手机验证码（必填）"></el-input>
                            <button :disabled="disabled" class="selfBtn blueBtn_verify"
                                    :style="{'background-color':disabled?'#CCCCCC':'#2473EB','color':disabled?'grey':'white'}" @click="sendCode">{{timertitle}}</button>
                        </el-form-item>
                        <div>
                            <button class="selfBtn blueBtn" @click="changeshowArea('secondStep')">下一步</button>
                            <router-link to="/index"><button class="selfBtn whiteBtn">取消</button></router-link>
                        </div>
                    </div>
                    </el-form>
                    <el-form :model="registerForm2" :rules="registerRules2" ref="validForm2" label-position="left" label-width="0px">
                            <div :class="{active_showarea:showArea!='secondStep'}">
                            <el-form-item prop="company">
                                <el-input v-model="registerForm2.company" type="text" placeholder="请输入企业/单位名称（必填）"></el-input>
                            </el-form-item>
                            <el-form-item prop="streetvalue">
                                <el-select v-model="registerForm2.provincevalue" placeholder="请选择"  @change="searchArea(registerForm2.provincevalue,1)">
                                    <el-option
                                        v-for="item in province"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value" >
                                    </el-option>
                                </el-select>省
                                <el-select v-model="registerForm2.cityvalue" placeholder="请选择" @change="searchArea(registerForm2.cityvalue,2)">
                                    <el-option
                                        v-for="item in city"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>市
                                <el-select v-model="registerForm2.countyvalue" placeholder="请选择" @change="searchArea(registerForm2.countyvalue,3)">
                                    <el-option
                                        v-for="item in county"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>县
                                <el-select v-model="registerForm2.streetvalue" placeholder="请选择">
                                    <el-option
                                        v-for="item in street"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>街道

                            </el-form-item>
                            <el-form-item prop="addressDetail">
                                <el-input v-model="registerForm2.addressDetail" type="text" placeholder="请输入详细地址、门牌号（必填）"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
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
                                <el-input v-model="registerForm2.confirmpassword" type="password" placeholder="请输入确认密码（必填）"></el-input>
                            </el-form-item>
                            <div>
                                <button class="default selfBtn blueBtn" @click="changeshowArea('firstStep')">上一步</button>
                                <button class="selfBtn whiteBtn" @click="changeshowArea('formSubmit')">注册</button>
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
                <div style="margin: auto auto;width: 70%;text-align: left;color:#999">
                    <h6>说明：</h6>
                    <p>1、注册方式选择“普通注册”的，提交注册信息后，待管理人员审核通过后，可正常使用平台功能，申请结果将以短信方式通知。</p>
                    <p>2、注册方式选择“邀请码注册”的，核对相关信息无误并提交成功后，即表示注册成功，可正常使用平台功能。</p>
                    <p>3、注册成功后，15日内您可免费试用本平台。若相关信息在此期间未完善上传或者审核不通过的，您将无法继续正常使用本平台功能。</p>
                </div>
            </div>
        </div>
        <div style="display: none;">
            <countdownpop></countdownpop>
        </div>
    </div>

</template>

<script>
    import countdownpop from "../../components/countDownPop/index";
    // import TimeSelectBar from "../../components/TimeSelectBar/index";
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
            let validPwd=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let oldLength=value.length;
                    let newLength=value.replace(/\s*/g,"").length;
                    console.log(value.replace(/\s*/g,""));
                    console.log('oldLength:'+oldLength+";newLength:"+newLength);
                    if(oldLength<6||oldLength>12){
                        callback(new Error('密码长度应在6-12位之间'))
                    }else {
                        if (oldLength > newLength) {
                            callback(new Error('密码不得包含空格'))
                        }
                    }
                }
            };
            let validPwdR=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                   if (value!=this.registerForm2.password){
                       callback(new Error('两次密码输入不一致'))
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
                        {validator:validMobile,trigger:'blur'}
                    ],
                    phonecode:[
                        {required:true,message:'请输入验证码',trigger:'blur'}
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
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator:validPwd,trigger:'blur'}
                    ],
                    confirmpassword :[
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {validator:validPwdR,trigger:'blur'}
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
            console.log(111)
            this.searchArea(0,0);
            console.log(2222)
        },
        methods:{
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
                    this.$refs.validForm1.validate((valid) => {
                        if(valid){
                            this.showArea=val;
                        }
                    })
                }
                if(val=='formSubmit'){
                    this.$refs.validForm2.validate((valid) => {
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
                                'Address':this.registerForm2.addressDetail,
                            };
                            // this.$axios.post(
                            //     'SysUser/PostRegister',
                            //
                            // )
                            this.$axios({
                                method: 'post',
                                url: '/SysUser/PostRegister',
                                data: {
                                    'userInfo':userInfo,
                                    'orgInfo':orgInfo
                                }
                            }).then(res => {
                                console.log(res);
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
                this.disabled=true;
                this.timer(59);
                this.timertitle='59S后重新发送';
            },
            timer:function(t){
                    let that=this;
                    t--;
                    setTimeout(function(){
                        if(t>0){

                            that.timertitle=t+'S后重新发送';
                            that.timer(t);
                        }else{
                            that.disabled=false;
                            that.timertitle='重新发送验证码';
                        }
                    },1000)
            },
        //    查询省市县街道
            searchArea:function(val,level){
               
                let that=this;
                console.log('======='+val);
                this.$axios.get( '/SysArea/GetAreaList',
                    {params: {'id': val}}
                ).then(
                    
                    function(res){
                        console.log(res);
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
                .catch(err=>{
                    console.log(err)
                })
            }
        },
        watch:{
            provincevalue(){
                this.searchArea(this.registerForm2.provincevalue,1)
            },
            cityvalue(){
                this.searchArea(this.registerForm2.cityvalue,2)
            },
            countyvalue(){
                this.searchArea(this.registerForm2.countyvalue,3)
            }
        }
    }

</script>

<style scoped>
    .title{
        height: 40px;
        border-bottom: 2px solid #FF9900;
        color: #FF9900;
        font-size: 14pt;
        line-height: 40px;
        font-weight: 600;
    }
    .selficon_bac{
        border-top: 10px solid transparent;
        border-right: 10px solid #cccccc;
        border-bottom: 10px solid transparent;
        position: absolute;
        right: -16px;
        top: 11px;
    }
    .selficon_frot{
        border-top: 10px solid transparent;
        border-right: 10px solid white;
        border-bottom: 10px solid transparent;
        position: absolute;
        right: -18px;
        top: 11px;
        z-index: 2;
    }
    .msgBox{
        position: absolute;
        right: -270px;
        top: 0;
        line-height: 20px;
        border: 2px solid #CCCCCC;
        color: grey;
        padding: 10px 25px;
        font-size: 10pt;
    }
    .msgBox>li:nth-of-type(2n-1){
        width: 5px;
        height: 5px;
        background-color: #67c23a;
        border-radius: 5px;
        box-shadow: 0 0 3px 2px #67c23a;
        position: absolute;
        left: 7px;
        top: 16px;
    }
    .msgBox>li:nth-of-type(3) {
        top: 36px;
    }
    .msgBox>li:nth-of-type(5){
        top:56px;
    }
    .el-select{
        width: 80px;
        height: 30px;
    }
    .sys-login{
        height: 100%;
        overflow-y:scroll ;
    }
    .login-area{
        width: 100%;
        margin-bottom: 20px;
        min-width: 969px;
    }
    .form-group{
        width:80% ;
        margin-left: 10%;
        min-width: 969px;
        height: auto;
        background-color: #FFFFFF;
        background-image: none;
        border: 2px solid  #FFFFFF;
        box-shadow: 0px 0px 10px 5px #CCCCCC;
        line-height: 18px;
        font-size: 10.0pt;
        font-family: Arial,Arial;
        text-align: center;
    }
    .form-box{
        text-align: left;
        width: 407px;
        margin: 30px auto;
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
        width: 172px;
        height: 207px;
        background-color: transparent;
        margin:10px 20px;
    }
    .card_content>div:hover{
        border-color: #ff9900;
    }
    .card_content>div>img{
        width: 113px;
        height: 113px;
        cursor: pointer;
        margin-top: 40px;
    }
    .card_content>div>p{
        color: #333333;
        text-align: center;
        text-decoration: none;
        font-size: 14.0pt;
        font-style: normal;
        font-weight: 700;
        line-height: 0px;
        margin-top: 30px;
    }
    .active_showarea{
        display:none
    }
    .selfBtn{
        width: 177px;
        height: 38px;
        border-radius: 7px 7px;
        line-height: 27px;
        font-size: 14pt;
        font-weight: 700;
        text-align: center;
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
        width: 250px;
    }
    .sys-login .form-group .el-input__inner{
        background-color: white;
    }
</style>
