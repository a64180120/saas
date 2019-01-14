<template>
    <div class="box">
        <div class="box1">
            <div class="Time" @click="showTogg">
                {{showtype=='doubleTime'?'会计期':'年度'}}
            </div>
            <div class="Time_name">{{choosedYear}}</div>
            <!--侧边时间选择器  月-->
            <div class="vertical dragscroll"  v-bind:style="{'display':(showtype=='doubleTime'||showtype=='singleTime'?'block':'none')}" >
                <div id="List" class="list">
                    <template v-for="n in (jiezhangYear-startyear+ (jiezhangMonth==12?2:1))">
                        <template v-if="n+startyear<=jiezhangYear+(jiezhangMonth==12?2:1)">
                            <div id="">
                                <ul>
                                    <p class="name">{{startyear+n-1}}</p>
                                    <template v-for="m in month">
                                        <li :date="(startyear+n-1)+'-'+m"
                                            :class="{'Font_color':(startyear+n-1==jiezhangYear&& m>jiezhangMonth||startyear+n-1>jiezhangYear),'selectMonth':(startyear+n-1==choosedYear&&m==choosedMonth)}"
                                            @click="chosedata">{{m}}</li>
                                        <i :class="{'colour':(startyear+n-1==jiezhangYear&& m>=jiezhangMonth||startyear+n-1>jiezhangYear)?true:(m==12?true:false)}"></i>
                                    </template>
                                </ul>
                            </div>
                        </template>
                        <template v-else></template>
                    </template>
                </div>
            </div>
            <!--侧边时间选择器 年-->
            <div class="vertical dragscroll" v-bind:style="{'display':(showtype=='yearTime'?'block':'none'),top:'60px'}">
                <div class="list">
                    <div>
                        <ul>
                            <template v-for="n in (jiezhangYear-startyear+ (jiezhangMonth==12?2:1))">
                                <template v-if="n+startyear<=jiezhangYear+ (jiezhangMonth==12?2:1)">
                                    <li :date="(startyear+n-1)+'-'+1"
                                        :class="{'selectMonth':(startyear+n-1==choosedYear)}"
                                        @click="chosedata"
                                        >{{startyear+n-1}}</li>
                                    <i :class="{'colour':(startyear+n-1>=jiezhangYear)?true:false}" style="margin: 12px 25px;"></i>
                                </template>
                                <template v-else></template>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!--明细账样式-->
        <div v-bind:style="{'display':(showtype=='doubleTime'?'block':'none')}">
            <div class="Popup" v-bind:style="{'display':showTog}">
                <div style="height: 160px;">
                    <div class="Content_area date" :style="{'display':monthsSelCss=='kuaiji'?'block':'none'}">
                        <div class="Current_year" >
                            <i class="el-icon-minus" @click="((choosedYear>startyear)?choosedYear--:choosedYear=startyear)"></i>
                            <p style="display:none;"></p>
                            <span style="width:13px;display:none;">-</span>
                            <p>{{choosedYear}}</p>
                            <i class="el-icon-plus" @click="((choosedYear<(Math.floor(jiezhangYear) + (jiezhangMonth==='12'?1:0)))?choosedYear++:choosedYear=(Math.floor(jiezhangYear) + (jiezhangMonth==='12'?1:0)))"></i>
                        </div>
                        <ul>
                            <template v-for="n in 12">
                                <li :class="{'selectMonth':n==choosedMonth,'uncatchMont':n>jiezhangMonth&&choosedYear>=jiezhangYear}"
                                    @click="chosedataS(n,1)"
                                >{{n}}月</li>
                            </template>
                        </ul>
                    </div>
                    <div id="box" class="Content_area date" :style="{'display':monthsSelCss=='kuaiji'?'block':'none'}">
                        <div id="Current_year1" class="Current_year" >
                            <i class="el-icon-minus" @click="((choosedYear>startyear)?choosedYear--:choosedYear=startyear)"></i>
                            <p style="display:none;"></p>
                            <span style="width:13px;display:none;">-</span>
                            <p>{{choosedYear}}</p>
                            <i class="el-icon-plus" @click="((choosedYear<(Math.floor(jiezhangYear) + (jiezhangMonth==='12'?1:0)))?choosedYear++:choosedYear=(Math.floor(jiezhangYear) + (jiezhangMonth==='12'?1:0)))"></i>
                        </div>
                        <ul id="Month"  style="border-left: 1px solid #eee;">
                            <template v-for="n in 12">
                                <li :class="{'selectMonth':n==choosedMonthEnd,'uncatchMont':n>jiezhangMonth&&choosedYear>=jiezhangYear||n<choosedMonth}"
                                    @click="(n>=choosedMonth)?chosedataS(n,2):''"
                                >{{n}}月</li>
                            </template>
                        </ul>
                    </div>
                    <div style="float: none"></div>
                </div>

                <div style="border-top: 1px solid #eee;color: #02a7e7;text-align: center;line-height: 30px">可以同时选择起始时间和终止时间</div>
            </div>
        </div>

        <!--报表样式-->
      <div v-bind:style="{'display':(showtype=='singleTime'?'block':'none')}">
           <div class="Popup" v-bind:style="{'display':showTog,'left':'-225px'}">
                <div class="Content_area date" :style="{'display':monthsSelCss=='kuaiji'?'block':'none'}">
                    <div class="Current_year" >
                        <i class="el-icon-minus" @click="((choosedYear>startyear)?choosedYear--:choosedYear=startyear)"></i>
                        <p style="display:none;"></p>
                        <span style="width:13px;display:none;">-</span>
                        <p>{{choosedYear}}</p>
                        <i class="el-icon-plus" @click="((choosedYear<(Math.floor(jiezhangYear) + (jiezhangMonth==='12'?1:0)))?choosedYear++:choosedYear=(Math.floor(jiezhangYear) + (jiezhangMonth==='12'?1:0)))"></i>
                    </div>
                    <ul >
                        <template v-for="n in 12">
                            <li :class="{'uncatchMont':n>jiezhangMonth&&choosedYear==jiezhangYear||choosedYear>jiezhangYear,'selectMonth':n==choosedMonth}"
                                @click="chosedataS(n,1)"
                            >{{n}}月</li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        name: "timeSelectBar",
        data(){
          return{
              startyear:'',//开始年份
              //startmonth:'',//开始月份

              currentyear:'',//当前年份
              currentmonth:'',//当前月

              choosedYear:'',//选择的年份
              choosedMonth:'',//选择的开始月份
              choosedMonthEnd:'',//选择的结束月份

              jiezhangMonth:'',//结账的月份
              jiezhangYear:'',//反结账的月份

              month:12,//一共12个月
              showTog:'none',//显示隐藏
              monthsSelCss:'kuaiji',
              nowTime:new Date,
              //checkedTime:'',//下一个结账月*******
          }
        },
        props:{
            showtype:String
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                orgcode: state => state.user.orgcode,
                uid:state=>state.user.userid,
                startYear:state=>state.user
            })
        },
        mounted(){
            console.log(this.startYear);
                let currentYear = new Date();
                let currentyear=currentYear.getFullYear(currentYear);
                let currentMonth=currentYear.getMonth()+1;
                this.currentyear=currentyear;
                // this.currentmonth=currentMonth;
                this.currentmonth=currentMonth;
                this.choosedYear=currentyear;
                this.choosedMonth=currentMonth;
                this.choosedMonthEnd=currentMonth;
                this.startyear=this.startYear==0?currentyear:this.startYear;
                this.getChecked();

            let data={
                'choosedYear':this.jiezhangYear,
                'choosedMonth':this.jiezhangMonth,
                'choosedMonthEnd':this.jiezhangMonth
            }
            this.$emit('item-click',data)
        },
        methods:{

            lower:function(){
                this.year = this.year++;
            },
            showTogg:function () {
                this.showTog=(this.showTog=='none')?'block':'none';
            },
            //会计期内容切换************************************
            checkOutSel(val){
                this.monthsSelCss=val;
            },
            /*侧边月份点击事件*/
            chosedata:function(res){
                let time=res.target.attributes.date.value;
                let timeLis=time.split('-');
                /*if(timeLis[0]==this.currentyear&&timeLis[1]>this.currentmonth){
                    return
                };*/
                this.choosedYear=timeLis[0];
                this.choosedMonth = timeLis[1];
                this.choosedMonthEnd = timeLis[1];

                let data={
                    'choosedYear':this.choosedYear,
                    'choosedMonth':this.choosedMonth,
                    'choosedMonthEnd':this.choosedMonth
                }
                this.$emit('item-click',data)
            },
            /*弹窗月份点击事件*/
            chosedataS:function(n,level){
                if(level==1){
                        this.choosedMonth = n ;
                        this.choosedMonthEnd = this.choosedMonthEnd>=n?this.choosedMonthEnd:n;
                }else{
                        this.choosedMonthEnd = n;

                }
                let data={
                    'choosedYear':this.choosedYear,
                    'choosedMonth':this.choosedMonth,
                    'choosedMonthEnd':this.choosedMonthEnd
                }
                this.$emit('item-click',data)
            },
//获取当前结账的最新月份************
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        console.log('=====结账日期===');
                        console.log(res);
                        if(res.Record.length>0){
                            this.jiezhangMonth=(res.Record[0].JAccountPeriod==0?12:res.Record[0].JAccountPeriod);//结账的月份
                            this.jiezhangYear=(res.Record[0].JAccountPeriod==0?res.Record[0].JYear-1:res.Record[0].JYear);//结账年
                            //this.jiezhangYear=2019;
                            console.log(this.jiezhangMonth);
                            console.log(this.jiezhangYear);
                        }else{
                            this.jiezhangMonth=this.currentmonth;//结账的月份
                            this.jiezhangYear=this.currentyear;//结账年
                        }

                        console.log(this.jiezhangYear);
                        //this.sideDate=this.nowTime.getFullYear()+'-'+this.checkedTime;
                        //this.year=this.sideDate.split('-')[0];
                        //this.choosedMonth=this.checkedTime;
                    })
                    .catch(err=>console.log(err))
            },
            //会计期[反]结账确认选择*****************************
           /* yearsTrue(str,val){
                if(str=='check'||str=='uncheck'){
                    this.checkOut(str,val);
                }else{
                    this.showTog='none';
                }
            },
            //结账功能 //反结账功能*****************************************
            checkOut(str,val){
                var t;
                var url;
                if(str=='check'){
                    url='/PBusinessConfig/UpdateBusinessConfig';
                }else if(str=='uncheck'){
                    console.log(this.fanjiezhangMonth+'=='+(this.checkedTime-1));
                    if(this.fanjiezhangMonth>this.checkedTime-1){
                        this.$message('当前月份还未结账,无法反结账!');
                        return;
                    }
                    url='/PBusinessConfig/UnUpdateBusinessConfig';
                }
                t=this.currentyear+'-'+val
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    dateTime:t
                }
                const loading1=this.$loading();
                this.$axios.get(url,{params:data})
                    .then(res=>{
                        loading1.close();
                        if(res.Status=='success'){
                            this.$message('结账成功!');
                        }else{
                            this.$message('结账失败!');
                        }
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },*/
        }
    }


</script>

<style scoped>

    .iconCone{
        border-left: 10px solid red;
        border-bottom: 10px solid white;
    }
    .selectMonth{
        background:#03a9f4 !important;
        color:#fff !important;
    }
    .uncatchMont {
        background: #ffffff;
        color: #ccd4dc;
    }
    .date ul li.uncatchMont:hover{
        background: #ddd;
        color: #fff;
    }
    .box{
        width: 55px;
        background: #FFF;
        position: absolute;
        box-shadow: 0px 1px 10px #d6d6d6;
        top: 10px;
        bottom: 20px;
        right: 10px;
    }

    .box1{
        width: 55px;
        position: absolute;
        overflow: hidden;
        top: 0;
        bottom: 20px;
    }
    .box1 ul{
        width: 100%;
        position: absolute;
        margin-top: 0;
    }
    .box1 ul li{
        width: 55px;
        height: 900px;
        /* border: #000 1px solid; */
        list-style: none;
        margin-left: -40px;

    }
    .list{
        width:100%;
        position:relative;
    }
    .list div{
        width: 55px;
        height: 796px;
        /* margin-left: -40px; */
        color: #fff;
        text-align: center;
    }
    .list div ul{
        width:100%;
    }
    .list div ul li{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #FFF;
        margin-top: 5px;
        margin-left: 5px;
        border: #c7e8f7 1px solid;
        box-shadow:0px 2px 2px #dbf4ff;
        text-align: center;
        line-height: 40px;
        color: #45c0f7;
        cursor: pointer;
    }
    /*.list div ul .Font_color{
        cursor: not-allowed;
    }*/
    .list div ul li:hover{
        background:#00B8EE;
        color:#fff;
    }
    .list div ul .Font_color:hover{
        background:#00B8EE;
        color:#CCC !important;
        border:#ececec 1px solid !important;
        box-shadow: 0px 2px 2px #e0e0e0 !important;
    }
    .list div ul li.selectMonth{
        background:#00B8EE;
        color:#fff;
    }

    .Time_name{
        position: absolute;
        top: 30px;
        width: 55px;
        height: 25px;
        background:#FFF;
        left: 0;
        z-index: 100;
        text-align:center;
        color:#04a9f4;
        line-height:25px;
    }
    .name{
        width: 40px !important;
        height: 25px !important;
        text-align: center !important;
        line-height: 25px !important;
        font-size: 14px !important;
        color: #000 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: 0px 0px 0px #fff!important;
        margin-left: 5px;
        margin-top: 4px;

    }
    .Time{
        width:55px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #ffffff;
        background:#45c0f7;
        cursor: pointer;
    }
    .Popup{
        width: auto;
        height: 190px;
        /*background-image: url(../../assets/images/ds.png);
        background-size: 498px 190px;
        background-repeat: no-repeat;*/
        background-color: white;
        box-shadow: 0 0 10px 3px lightblue ;
        border-radius: 3px 3px;
        overflow: hidden;
        position: absolute;
        top:0px;
        left: -440px;
        z-index: 999;
    }
    @keyframes Popup
    {
        0%{
            opacity:0;
        }
        100%{
            opacity:1;
        }
    }
    @keyframes Popup1
    {
        0%{
            opacity:1;
        }
        100%{
            opacity:0;
        }
    }
    .Popup ul{
        width: 83.5%;
        float: left;
        height: 25px;
        margin-left: 14px;
        overflow: hidden;
        position: relative;
        padding: 0;
        top: 10px;
    }
    .Popup ul li{
        text-align:center;
        line-height:25px;
        width:33%;
        height:25px;
        float:left;
        border-right:#CCC 1px solid;
    }
    .Content_area{
        width: 218px;
        height: 155px;
        float: left;
        margin-top: -10px;
        display: inline-block;
        float: left;
    }
    .date ul{
        width: 100%;
        height: 125px;
        overflow: hidden;
        padding: 0;
        left: -14px;
        top:-9px;
    }
    .date ul li{
        border: none !important;
        width: 21% !important;
        height: 25px !important;
        float: left !important;
        margin-left: 3%;
        margin-top: 6.5%;
        cursor: pointer;
    }
    .date ul li:hover{
        background:#09F;
        color:#fff;
    }
    .Current_year {
        width: 100%;
        height: 35px;
        background: #00b7ee;
        color: #fff;
        line-height: 35px;
        padding-left: 16px;
        margin-top: 10px;
        border-bottom: #f3f3f3 1px solid;
    }
    .Current_year *{
        float: left;
        width: 40px;
        height: 100%;
        margin-top: 0;
        text-align: center;
        color: #fff;
        margin-left: 20px;
    }
    .Current_year i{
        float: left;
        width: 27px;
        margin-top: 10px;
    }

    .list div ul i{
        display: block;
        width: 3px;
        height: 15px;
        margin-left: 25px;
        background: #45c0f7;
        margin-top: 5px;
    }
    .colour{
        background:none !important;
    }
    .Font_color{
        color:#CCC !important;
        border:#ececec 1px solid !important;
        box-shadow: 0px 2px 2px #e0e0e0 !important;
        cursor: pointer;
    }
    .anniu{
        width: 216px;
        margin-top: 31px;
        height: 25px;
    }
    .anniu ul{
        width:100%;
        height:100%;
        margin-top:-10px;
    }
    .anniu ul li{
        width: 55px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        color: #FFF;
        float: left;
        margin-left: 55px;
        background: #45c0f7;
        border-radius: 3px;
    }
    .dragscroll{
        position: absolute;
        top: 30px;
        bottom: 0;
        overflow-y: scroll;
    }
</style>
