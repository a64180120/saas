<template>
    <div class="sys-login">
        <div class="login-area">
            <div class="logo">
                <img src="static/img/logo.png" alt="">
            </div>
            <div class="form-group">
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
                    <el-form-item prop="name">
                        <el-input v-model="loginForm.name" type="text" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password"  placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="orgid">
                        <el-select v-model="loginForm.orgid" filterable placeholder="请选择组织">
                            <el-option v-for="item in options"
                            :key="item.PhId"
                            :label="item.OrgName"
                            :value="item.PhId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item prop="captcha" v-if="captcha.show" class="captcha">
                        <img :src="captcha.src" alt="">
                        <el-input v-model="loginForm.captcha" type="text" placeholder="验证码"></el-input>
                    </el-form-item> -->

                    <p class="textL width50" style="float:left;">注册</p>
                    <p class="textR width50" style="float:left;">忘记密码？</p>

                    <a class="btn-login" type="primary" @click="submitForm('loginForm')">登录</a>
                </el-form>
                <div v-if="sysMsg" class="err-msg">{{sysMsg}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from '@/util/ajax'
import lodash from 'lodash'

export default {
    data() {
        return {
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
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                orgid :[
                    {required: true, message: '请选择当前用户组织', trigger: 'blur'}
                ]
                // captcha: [
                //     {required: false, message: '请输入验证码', trigger: 'blur'}
                // ]
            },
            captcha: {
                show: false,
                src: ''
            },
            sysMsg: ''
        }
    },
     //计算属性
    computed: {
       
        ...mapState({
            lang: state => state.lang,
            theme: state => state.theme
        })
    },
    watch: {
        // "captcha.show"(val){
        //     this.loginRules.captcha[0].required = val
        // },
        //监听password变化 ，(debounce)停留0.3s获取组织信息
        'loginForm.password': lodash.debounce(function(val){
                var params=new URLSearchParams();
                params.append('uname_login',this.loginForm.name);
                params.append('password',this.loginForm.password);

                axios({
                    url: '/SysUser/PostOrgByUNameOrUPhone',
                    method: 'post',
                    data: params
                }).then(res => {
                    let resultData = JSON.parse(res);
                    if(resultData){
                        if(resultData.Status==='Error'){
                            this.$message(resultData.Message);
                            return;
                        }
                        this.options=resultData.Record;
                    }
                })

        },500)
    },
    beforeMount(){
        // 初始化错误信息。保证单独点击input时可以弹出正确的错误提示
        //this.setErrMsg()
    },
    methods: {
        ...mapActions({
            login: 'user/loginByPhone'
        }),
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.login({
                        name: this.loginForm.name,
                        password: this.loginForm.password,
                        orgid: this.loginForm.orgid
                    }).then(res => {
                        if(res.Status==="Success"){
                            this.$router.push('home') //跳转主页
                        } else {
                            this.sysMsg = res.message
                            // this.captcha.show = true
                            // this.captcha.src = res.captcha
                        }
                    })
                } else {
                    return false
                }
            });
        }
    }
}
</script>