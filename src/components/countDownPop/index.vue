<template>
    <div class="pop_cover" :style="{'display':showType?'block':'none'}">
        <div class="pop_content">
            <div class="pop_title">
                <img src="../../assets/images/register/register_company.png">
                <div class="time" @click="showType=false">跳过（{{showMsg}}S）</div>
            </div>
            <div class="pop_middle">
                <img src="../../assets/images/register/register_backimg.png">
                <div>试用15天</div>
                <div class="pop_red">
                    <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
            <div class="pop_bottom">
                <img src="../../assets/images/register/register_backimg_Bottom.png">
                <div>
                    <ul>
                        <li>说明：</li>
                        <li>注册成功后，15日内您可免费试用本平台。若在此期间，您未继续完善系统要求的相关信息，则只能浏览系统功能，不能正常建账使用；若您提交的信息未审核通过或存在虚假情况，到期后账号将被停用。</li>
                        <li>谢谢您的配合！</li>
                    </ul>

                </div>
                <div @click="toUser">立即完善信息</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "countdownpop",
        data(){
            return{
                showType:true,
                showMsg:10
            }
        },
        mounted(){
            this.timer(10);
        },
        methods:{
            toUser:function(){
                this.$router.push('system/organization');
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
            }
        }
    }
</script>

<style scoped>
    .pop_cover{
        position: fixed;
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
        color: red;
        font-size: 13pt;
        float: right;margin-right: 20px;
        margin-top: 15px;
        cursor: pointer;
    }
    .pop_middle{
        height:345px;
    }
    .pop_middle img{
        width: 100%;
    }
    .pop_middle div:nth-of-type(1){
        position: relative;
        top: -342px;
        background-color: #FFBA01;
        border-radius: 10px 10px;
        height: 98px;
        width: 442px;
        left: 248px;
        opacity: 0.88;
        box-shadow: 6px 7px 5px 0px #EFEFEF;
        text-align: center;
        vertical-align: middle;
        color: white;
        font-size: 49pt;
        font-weight: 600;
        cursor: pointer;
    }
    .pop_bottom{
        position: relative;
        height:220px;
    }
    .pop_bottom img{
        width: 975px;
        opacity: 0.91;
    }
    .pop_bottom div{
        width: 705px;
        margin: auto;
        position: relative;
        bottom: 140px;
        text-align: left;
        font-size: 18px;
        color: black;
        opacity: 1;
    }
    .pop_bottom div:last-child{
        cursor: pointer;
        right: 20px;
        bottom: 78px;
        float: right;
        width: 162px;
        height: 38px;
        position: absolute;
        border: 2px solid #FFFFFF;
        text-align: center;
        line-height: 38px;
        background-color: #87EC00;
        color: #fff;
        border-radius: 8px 8px;
    }
    .pop_bottom div ul>li:nth-of-type(1){
        font-size: 19pt;
        margin-left: -45px;
        color: blue;
        font-weight: 600;
    }
    .pop_red{
        position: relative;
        bottom: 31px;
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
        background-color: #df3250;
        margin-left: 10px;
    }
</style>
