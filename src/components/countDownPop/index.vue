<template>
    <div class="pop_cover" :style="{'display':showType?'block':'none','z-index':'9999999999999'}"><!--:style="{'display':showType?'block':'none'}"-->
        <div class="pop_content">
            <div class="pop_title">
                <img src="../../assets/images/logo2.png">
                <div class="time" @click="showType=false">跳过（{{showMsg}}S）</div>
            </div>
            <div class="pop_middle">
                <div>试用期剩余：<span :style="{'color':lastTime<=3?'red':'','font-size':lastTime<=3?'95px':'','vertical-align':'center'}">{{isNaN(lastTime)?testTime:(lastTime<0?0:lastTime)}}</span> 天</div>
                <div @click="toUser">立即完善信息</div>
            </div>
            <div class="pop_bottom">

                <div>
                    <ul>
                        <li>说明：</li>
                        <li>注册成功后，<span style="color: red;">{{testTime}}</span>日内您可免费试用本平台。若在此期间，您未继续完善系统要求的相关信息，则只能浏览系统功能，不能正常建账使用；若您提交的信息未审核通过或存在虚假情况，到期后账号将被停用。谢谢您的配合！</li>
                    </ul>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "countdownpop",
        data(){
            return{
                showType:true,
                showMsg:10,
                testTime:15,
                lastTime:0,
            }
        },
        computed:{
            ...mapState({
                user:state => state.user,
                endTime: state => state.user.curOrg.EndTime,
            }),
        },
        mounted(){
            this.timer(10);
            this.getdata();
            console.log(this.endTime);
            let current=new Date();
            let etime=new Date(this.endTime)
            this.lastTime=Math.floor((etime.getTime()-current.getTime())/(3600000*24))+1;
        },
        methods:{
            toUser:function(){
                this.$router.push('/system/organization');
                this.showType=false;
            },
            timer:function(t){
                t--;
                let that=this;
                setTimeout(function(){
                    if(t>0){
                        that.showMsg=t
                        that.timer(t);
                    }else{
                        that.showType=false;
                    }
                },1000)
            },
            getdata:function(){
                this.$axios.get('SysConfig/GetSysConfigList').then(res=>{
                    if(res.Status=='error'){
                        this.saasMessage={
                            message:res.Msg,
                            visible:true
                        }
                        return;
                    }
                    console.log(res);
                    this.userInfo=res.Record;
                    //this.lastTime=res.Record[1].Value-this.lastTime;
                    this.testTime=res.Record[1].Value;
                    this.versionTest =res.Record[2].Value;
                    this.SQLSetting=res.Record[3].Value;
                }).catch(err=>{
                    this.saasMessage={
                        message:'获取参数设置数据失败了!',
                        visible:true
                    }
                })

        },
        }
    }
</script>

<style scoped>
    .pop_cover{
        position: fixed;
        position:-ms-page;
        z-index: 9999999999;
        top: 0;
        bottom: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.43);
    }
    .pop_content{
        width: 975px;
        height: 573px;
        background-color: white;
        padding: 15px 0px;
        overflow: hidden;
        margin: auto auto;
        margin-top: 100px;
        vertical-align: middle;
        text-align: center;

    }
    .pop_title{
        height: 60px;
    }
    .pop_title img{
        height: 55px;
        margin-left: 20px;
        float: left;
    }
    .pop_title .time{
        color: #bbb;
        font-size: 13pt;
        float: right;margin-right: 20px;
        margin-top: 15px;
        cursor: pointer;
    }
    .pop_middle{
        height:475px;
    }
    .pop_middle div:first-child{
        position: relative;
        top: 20px;
        border-radius: 10px 10px;
        height: 298px;
        width: 90%;
        opacity: 0.88;
        box-shadow: 0px 0px 10px 1px #00b7ee;
        color: #00b7ee;
        font-size:45px;
        padding-top: 30px;
        letter-spacing: 12px;
        margin: auto;

    }
    .pop_middle div:last-child{
        position: relative;
        top: -80px;
        cursor: pointer;
        font-size: 18px;
        background-color: #00b7ee;
        padding: 10px 20px;
        width: 200px;
        color: #fff;
        margin: auto;
        border-radius: 7px;
    }
    .pop_bottom{
        position: relative;
        height:220px;
    }
    .pop_bottom div{
        width: 705px;
        margin: auto;
        position: relative;
        bottom: 120px;
        text-align: left;
        font-size: 16px;
        color: #bbb;
        opacity: 1;
    }

    .pop_bottom div ul>li:nth-of-type(1){
        font-size: 19px;
        margin-left: -45px;
    }

    .pop_red ul{
        display: flex;
        flex-direction: row;
    }
    .pop_red ul li{
        text-indent: 35px;
        position: relative;
        bottom: 220px;
        width: 44px;
        height: 22px;
        border-radius: 22px 22px 0 0;
        background-color: darkgrey;
        margin-left: 10px;
    }
</style>
