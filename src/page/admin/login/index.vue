<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">基础工会后台管理系统</div>
            <el-form 
            :model="loginForm" 
            :rules="loginRules" 
            ref="loginForm" 
            label-width="0px" 
            class="ms-content">
                <el-form-item prop="UserID">
                    <el-input v-model="loginForm.UserID" placeholder="账户/手机号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="UserPwd">
                    <el-input type="password" placeholder="密码" v-model="loginForm.UserPwd" @keyup.enter.native="submitForm('loginForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div>
                    <div class="width50">
                        <router-link to="register" style="padding-left: 10px;">注册</router-link>
                    </div>
                    <div class="width50">
                        <router-link to="notice" style="padding-right: 10px;float: right;">忘记密码？</router-link>
                    </div>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                </div>
                
            </el-form>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'

    export default {
        data: function(){
            return {
                loginForm: {
                    UserID: '',
                    UserPwd: ''
                },
                loginRules: {
                    UserID: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    UserPwd: [
                        //{ required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                sysMsg: ''
            }
        },
        methods: {
            ...mapActions({
                login: 'auth/adminloginByPhone'
            }),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login({
                            UserID: this.loginForm.UserID,
                            UserPwd: this.loginForm.UserPwd
                        }).then(res => {
                            this.$router.push('home') //跳转主页
                            // if(res.login){
                            //     this.$router.push('home') //跳转主页
                            // } else {
                            //     this.sysMsg = res.message
                            // }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>
<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url('~sysStatic/images/default/login.jpg');
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:400px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 50px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .width50{
        width: 50%;
        float:left;
        margin: 0px 0 15px;
    }
</style>