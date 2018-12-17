<template>
    <div class="sys-login">
        <div class="login-area">
            <div class="logo">
                <img src="@/assets/images/logo.png" alt="">
            </div>
            <div class="form-group">
                <div class="form-box">
                    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
                        <div :class="{active_showarea:showArea!='selectArea'}">
                            <el-form-item>
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
                            </el-form-item>
                        </div>
                        <div :class="{active_showarea:showArea!='firstStep'}">
                            <div style="height: 65px;line-height: 30px">
                                <div  class="el-message-box__title">请选择注册方式</div>
                                <el-radio label="0" v-model="loginForm.checkType">普通注册</el-radio>
                                <el-radio label="1" v-model="loginForm.checkType">邀请码注册</el-radio>
                            </div>

                            <template v-if="loginForm.checkType==0">
                                <el-form-item prop="name">
                                    <el-input v-model="loginForm.name" type="text" placeholder="请输入联系人姓名（必填）"></el-input>
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item prop="code">
                                    <el-input v-model="loginForm.code" type="text" placeholder="请输入邀请码（必填）"></el-input>
                                </el-form-item>
                            </template>

                            <el-form-item prop="phone">
                                <el-input v-model="loginForm.phone" type="text" placeholder="请输入手机号（必填）"></el-input>
                            </el-form-item>
                            <el-form-item prop="phonecode" >
                                <el-input class="verifyCode" v-model="loginForm.phonecode" type="password"  placeholder="请输入手机验证码（必填）"></el-input>
                                <button :disabled="disabled" class="selfBtn blueBtn_verify" @click="sendCode">{{timertitle}}</button>
                            </el-form-item>
                            <div>
                                <button class="selfBtn blueBtn" @click="changeshowArea('secondStep')">下一步</button>
                                <button class="selfBtn whiteBtn">取消</button>
                            </div>
                        </div>
                        <div :class="{active_showarea:showArea!='secondStep'}">
                            <el-form-item prop="company">
                                <el-input v-model="loginForm.company" type="text" placeholder="请输入企业/单位名称（必填）"></el-input>
                            </el-form-item>
                            <el-form-item prop="address">
                                <el-select v-model="loginForm.provincevalue" placeholder="请选择"  @change="searchArea(loginForm.provincevalue,1)">
                                    <el-option
                                        v-for="item in province"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value" >
                                    </el-option>
                                </el-select>省
                                <el-select v-model="loginForm.cityvalue" placeholder="请选择" @change="searchArea(loginForm.cityvalue,2)">
                                    <el-option
                                        v-for="item in city"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>市
                                <el-select v-model="loginForm.countyvalue" placeholder="请选择" @change="searchArea(loginForm.countyvalue,3)">
                                    <el-option
                                        v-for="item in county"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>县
                                <el-select v-model="loginForm.streetvalue" placeholder="请选择">
                                    <el-option
                                        v-for="item in street"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>街道

                            </el-form-item>
                            <el-form-item prop="addressDetail">
                                <el-input v-model="loginForm.addressDetail" type="text" placeholder="请输入详细地址、门牌号（必填）"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input v-model="loginForm.password" type="text" placeholder="请输入密码（必填）"></el-input>
                            </el-form-item>
                            <el-form-item prop="confirmpassword">
                                <el-input v-model="loginForm.confirmpassword" type="password"  placeholder="请输入确认密码（必填）"></el-input>
                            </el-form-item>
                            <div>
                                <button class="default selfBtn blueBtn" @click="changeshowArea('firstStep')">上一步</button>
                                <button class="selfBtn whiteBtn">注册</button>
                            </div>
                        </div>
                        <!--<el-form-item v-if="isOrganize" prop="orgid">
                            <el-select v-model="loginForm.orgid" filterable placeholder="请选择组织">
                                <el-option v-for="item in options"
                                           :key="item.PhId"
                                           :label="item.OrgName"
                                           :value="item.PhId">
                                </el-option>
                            </el-select>
                        </el-form-item>-->

                    </el-form>
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
    </div>
</template>

<script>
    export default {
        name: "index",

        data(){
            return{
                sysMsg:'',
                timertitle:'发送验证码',
                disabled:false,
                loginForm: {
                    checkType:'1',
                    name: '',
                    code:'',
                    phone:'',
                    phonecode:'',
                    company:'',
                    provincevalue: '',
                    cityvalue: '',
                    countyvalue: '',
                    streetvalue: '',

                    addressDetail:'',
                    password: '',
                    confirmpassword:'',
                },
                loginRules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    code:[
                        {required:true,message:'请输入邀请码',trigger:'blur'}
                    ],
                    phone:[
                        {required:true,message:'请输入手机号',trigger:'blur'}
                    ],
                    phonecode:[
                        {required:true,message:'请输入验证码',trigger:'blur'}
                    ],
                    company:[
                        {required:true,message:'请输入企业/单位名称',trigger:'blur'}
                    ],
                    address:[
                        {required:true,message:'请选择地址',trigger:'blur'}
                    ],
                    addressDetail:[
                        {required:true,message:'请输入详细地址',trigger:'blur'}
                    ],
                    password :[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    confirmpassword :[
                        {required: true, message: '请再次输入密码', trigger: 'blur'}
                    ]
                    // captcha: [
                    //     {required: false, message: '请输入验证码', trigger: 'blur'}
                    // ]
                },
                province: [],
                city: [],
                county: [],
                street: [],
                showArea:'selectArea'
            }
        },
        mounted(){
            this.searchArea(0,0);
        },
        methods:{
            changeshowArea:function(val,type){

                if(type!=undefined){
                    this.loginForm.checkType=type;
                    console.log(this.loginForm.checkType);
                }
                this.showArea=val;
            },
            check:function(val){
                console.log(val);
                this.loginForm.checkType=val;
            },
            sendCode:function(){
                this.disabled=true;
                this.timer(59);
                this.timertitle='59 S';
            },
            timer:function(t){
                    let that=this;
                    t--;
                    setTimeout(function(){
                        if(t>0){

                            that.timertitle=t+' S';
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
                this.$axios.get('/SysArea/GetAreaList',{params:{'id':val}}).then(
                    function(res){
                        console.log(res);
                        if(level==0){
                            that.province=res;
                            that.loginForm.provincevalue=res[0].label;
                        }else if(level==1){
                            that.city=res;
                            that.loginForm.cityvalue=res[0].label;
                        }else if(level==2){
                            that.county=res;
                            that.loginForm.countyvalue=res[0].label;
                        }else if(level==3){
                            that.street=res;
                            that.loginForm.streetvalue=res[0].label;
                        }else{
                            that.loginForm.streetvalue=val;
                        }
                    }
                )
            }
        }
    }

</script>

<style scoped>
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
        border: 1px solid #2473EB;
        color:white;
        display: inline-block;
        margin-left: 20px;
        font-weight: 100;
        font-size: 12pt;
        width: 130px;
    }
    .verifyCode{
        display: inline-block;
        width: 250px;
    }

</style>
