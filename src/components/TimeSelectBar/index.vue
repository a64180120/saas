<template>
    <div class="box">
        <div class="box1">
            <div class="Time" @click="showTogg">年度</div>
            <div id="Time_name" class="Time_name">{{choosedYear}}</div>
            <div id="Time_axis" class="vertical dragscroll" >
                <div id="List" class="list">

                    <template v-for="n in (currentyear-startyear)">
                        <template v-if="n+startyear<=currentyear+1">
                            <div id="">
                                <ul>
                                    <p class="name">{{currentyear-n+1}}</p>
                                    <template v-for="m in month">
                                        <li :date="(currentyear-n+1)+'-'+m"
                                            :class="{'Font_color':(currentyear-n+1==currentyear&& m>currentmonth),'selectMonth':(currentyear-n+1==choosedYear&&m==choosedMonth)}"
                                            @click="chosedata">{{m}}</li>
                                        <i :class="{'colour':(currentyear-n+1==currentyear&& m>=currentmonth)?true:(m==12?true:false)}"></i>
                                    </template>
                                </ul>
                            </div>
                        </template>
                        <template v-else></template>
                    </template>
                </div>
            </div>
        </div>
        <div id="Popup" class="Popup" v-bind:style="{'display':showTog}">
            <ul id="Popup1" >
                <li @click="checkOutSel('kuaiji')" :class="{active:monthsSelCss=='kuaiji'}">会计期</li>
                <li @click="checkOutSel('jiezhang')" :class="{active:monthsSelCss=='jiezhang'}">结账</li>
                <li style="border: none;" @click="checkOutSel('fanjiezhang')" :class="{active:monthsSelCss=='fanjiezhang'}">反结账</li>
            </ul>
            <div id="box" class="Content_area date" :style="{'display':monthsSelCss=='kuaiji'?'block':'none'}">
                <div id="Current_year1" class="Current_year" >
                    <i id="Upper"  class="el-icon-plus" @click="((choosedYear<currentyear)?choosedYear++:choosedYear=currentyear)"></i>
                    <p style="display:none;"></p>
                    <span style="width:13px;display:none;">-</span>
                    <p>{{choosedYear}}</p>

                    <i id="Lower"  class="el-icon-minus" @click="((choosedYear>startyear)?choosedYear--:choosedYear=startyear)"></i>
                </div>
                <ul id="Month">
                    <template v-for="n in 12">
                        <li :class="{'selectMonth':n==choosedMonth,'uncatchMont':n>currentmonth&&choosedYear==currentyear}"
                            @click="(n>currentmonth&&choosedYear==currentyear)?choosedMonth:choosedMonth=n"
                        >{{n}}月</li>
                    </template>
                </ul>
            </div>
            <div class="Content_area" :style="{'display':monthsSelCss=='jiezhang'?'block':'none'}">
                <div id="Current_year2" class="Current_year" >
                    <p style="width:222px; margin-left:-92px;">结账至<span style="float:right; width:50px; margin-right:-61px;">单位:月</span></p>
                </div>
                <input id="reduce" type="button" value="-" style="color:#FFF; width:24px; margin-top:30px; margin-left:51px; background:#45c0f7; border:none;" @click="jiezhangMonth>1?jiezhangMonth--:1"/>
                <input id="text" type="text" style="width:66px; " :value="jiezhangMonth"/>
                <input id="plus"type="button" value="+" style="color:#FFF; width:24px; background:#45c0f7; border:none;" @click="jiezhangMonth<12?jiezhangMonth++:12" />
                <div class="anniu">
                    <ul>
                        <li style="margin-left:26px;" @click="showTogg">确认</li>
                        <li @click="showTogg">取消</li>
                    </ul>
                </div>
            </div>
            <div class="Content_area" :style="{'display':monthsSelCss=='fanjiezhang'?'block':'none'}">
                <div id="Current_year3" class="Current_year" >
                    <p style="width:207px; margin-left:-77px;">返结账至<span style="float:right; width:50px; margin-right:-61px;">单位:月</span></p>
                </div>
                <input id="reduce1" type="button" value="-" style="color:#FFF; width:24px; margin-top:30px; margin-left:51px; background:#45c0f7; border:none;"  @click="fanjiezhangMonth>1?fanjiezhangMonth--:1"/>
                <input id="text1" type="text" style="width:66px; " :value="fanjiezhangMonth"/>
                <input id="plus1"type="button" value="+" style="color:#FFF; width:24px; background:#45c0f7; border:none;" @click="fanjiezhangMonth<12?fanjiezhangMonth++:12"/>
                <div class="anniu">
                    <ul>
                        <li style="margin-left:26px;" @click="showTogg">确认</li>
                        <li @click="showTogg">取消</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "timeSelectBar",
        data(){
          return{
              startyear:2013,
              currentyear:2018,
              currentmonth:0,
              choosedYear:2018,
              choosedMonth:8,
              jiezhangMonth:1,
              fanjiezhangMonth:1,
              month:12,
              showTog:'none',
              scrollTop:0,
              monthsSelCss:'kuaiji',
          }
        },
        mounted(){

                let currentYear = new Date();
                let currentyear=currentYear.getFullYear(currentYear);
                let currentMonth=currentYear.getMonth()+1;
                this.currentyear=currentyear;
                // this.currentmonth=currentMonth;
                this.currentmonth=10;
                this.choosedYear=currentyear;
                this.choosedMonth=10;

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
            /*月份点击事件*/
            chosedata:function(res){
                let time=res.target.attributes.date.value;
                let timeLis=time.split('-');
                this.choosedYear=timeLis[0];
                this.choosedMonth = timeLis[1];
                let data={
                    'choosedYear':this.choosedYear,
                    'choosedMonth':this.choosedMonth
                }
                this.$emit('item-click',data)
            }
        }
    }


</script>

<style scoped>
    .active{
        color: rgb(3, 169, 244);
    }
    .selectMonth{
        background:#03a9f4;
        color:#fff;
    }
    .uncatchMont {
        background: #ffffff;
        color: #ccd4dc;
    }
    .date ul li.uncatchMont:hover{
        background: #ffffff;
        color: #ccd4dc;
    }
    .box{
        width: 50px;
        background: #FFF;
        position: absolute;
        box-shadow: 0px 1px 10px #d6d6d6;
        top: 10px;
        bottom: 20px;
        right: 10px;
    }

    .box1{
        width: 50px;
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
        width: 50px;
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
        width: 50px;
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
    }
    .list div ul li.selectMonth{
        background:#03a9f4;
        color:#fff;
    }

    .Time_name{
        position: absolute;
        top: 30px;
        width: 50px;
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
        width:50px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #ffffff;
        background:#45c0f7;
    }
    .Popup{
        width: 263px;
        height: 214px;
        background: url(../../assets/images/ds.png) no-repeat;
        position: absolute;
        top: -10px;
        left: -261px;
        z-index: 100;
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
    .open{
        animation:Popup .5s;
        animation-fill-mode:forwards;
    }
    .Close{
        animation:Popup1 .5s;
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
        margin-left: 14px;
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
    }
    .date ul li:hover{
        background:#09F;
        color:#fff;
    }
    .Current_year {
        width: 100%;
        height: 30px;
        /* background: #000; */
        line-height: 30px;
        padding-left: 16px;
        margin-top: 19px;
        border-bottom: #f3f3f3 1px solid;
    }
    .Current_year *{
        float: left;
        width: 40px;
        height: 100%;
        margin-top: 0;
        text-align: center;
        color:#2196f3;
        margin-left: 20px;
    }
    .Current_year i{
        float: left;
        width: 27px;
        margin-top: 6px;
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
        width: 50px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        color: #FFF;
        float: left;
        margin-left: 50px;
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
