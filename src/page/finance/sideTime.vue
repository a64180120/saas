<template>
<!--17-->
    <div class="asideNav"><!--右侧时间选择组件-->
            <div @click.stop="yearSelShow"><span>会计期</span></div>
            <p>{{sideDate.split('-')[0]}}</p>
            <div style="overflow:hidden;height:91%">
                <div class="monthsContainer">
                    <ul style="top:0" @mouseleave.stop="dragLeave" @mousemove.stop="dragMove" @mouseup.stop="dragDown(false)" @mousedown.prevent.stop="dragDown(true,$event)"   id="scrollMonth" class="months">
                        <li v-for="item of nowYear-2000"  :key="item">
                            <ul>
                                <li>{{nowYear-item+1}}</li>
                                <li :class="{active:sideDate.split('-')[1]==i&&nowYear-item+1==sideDate.split('-')[0],unchecked:i>checkedTime&&nowYear-item+1||nowYear-item+1>checkedYear,futureM:nowYear-item+1==nowYear&&i>nowYear+1}" @click="sideMonth(i,nowYear-item+1)" v-for="i of 12" :key="i">{{i}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <!--会计期弹窗*************************************-->
            <div v-show="yearSelCss" class="yearsContainer">
                <div class="yearsTitle">
                    <span @click="checkOutSel('kuaiji')" :class="{active:monthsSelCss=='kuaiji'}">会计期</span>
                    <span @click="checkOutSel('jiezhang')" :class="{active:monthsSelCss=='jiezhang'}">结账</span>
                    <span @click="checkOutSel('fanjiezhang')" :class="{active:monthsSelCss=='fanjiezhang'}">反结账</span>
                </div>
                <div v-show="monthsSelCss=='kuaiji'" class="yearsContent">
                    <div class="flexPublic">
                        <div>{{year}}</div>
                        <div class="flexPublic">
                            <img @click="nextYear(false)" src="../../assets/icon/leftArr.svg" alt="">
                            <img @click="nextYear(true)" src="../../assets/icon/leftArr.svg" alt="">
                        </div>
                        <div style="clear:both"></div>
                    </div>
                    <ul @click="yearMonthClick"  class="year-month">
                        <li :class="{active:month==index}" v-for="index of 12" :key="index">{{index}}月</li>
                    </ul>
                </div>
                <div v-show="monthsSelCss=='jiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>结账至</span>
                        <i @click="nextMonth('pre',checkVal,'checkVal')"></i>
                        <div class="inputContainer"><input v-model="checkVal" type="text"></div>
                        <i @click="nextMonth('next',checkVal,'checkVal')"></i>
                        <span>月</span>
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('check',checkVal)">确认</span>
                    </p>
                </div>
                <div v-show="monthsSelCss=='fanjiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>反结账至</span>
                        <i @click="nextMonth('pre',unCheckVal,'unCheckVal')"></i>
                        <div class="inputContainer"><input  v-model="unCheckVal" type="text"></div>
                        <i @click="nextMonth('next',unCheckVal,'unCheckVal')"></i>
                        <span>月</span>
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('uncheck',unCheckVal)">确认</span>
                    </p>
                </div>

            </div>
        </div>
        
</template>

<script>
  import {mapState, mapActions} from 'vuex'
export default { 
    mounted(){
         this.getChecked();
        //  if (window.addEventListener){
        //         //var month= document.getElementById('scrollMonth');
        //         window.addEventListener('DOMMouseScroll',this.wheel,false);
        //         window.onmousewheel=document.onmousewheel=this.wheel;
        //     }
    },
    data(){
        return {
            checkVal:'',
            unCheckVal:'',
            sideDate:'',
            year:'',
            month:'',
            checkedTime:'',
            checkedYear:'',
            nowTime:new Date,
            nowYear:(new Date).getFullYear(),
            monthsSelCss:'kuaiji',
            mouseDown:false,
            mouseStartY:'',
            yearSelCss:false
        }
    },
    methods:{
        //获取当前结账的最新月份************
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{ 
                        if(!res.CheckRes){
                            this.$message({ showClose: true,message: '当前组织未初始化,请开始初始化!', type: "error"});
                            return;
                        }                        
                        this.checkedTime=res.Record[0].JAccountPeriod+1;
                        this.checkedYear=res.Record[0].JYear;
                        this.sideDate=res.Record[0].JYear+'-'+this.checkedTime;
                        this.year=this.sideDate.split('-')[0];
                        this.month=this.sideDate.split('-')[1];
                        this.checkVal=this.checkedTime;
                        this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                        //this.getvoucherList('reset');
                        this.$emit("time-click",{sideDate:this.sideDate,checkedTime:this.checkedTime,checkedYear:this.checkedYear})
                        this.$forceUpdate();
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>this.$message({ showClose: true,message: err, type: "error"}))
            },
       
         //选择会计期***************
            sideMonth(i,year){
                this.month=i;
                this.year=year;
                this.sideDate=year+'-'+i;
                //this.getvoucherList('reset');
                this.$emit("time-click",{sideDate:this.sideDate})
            },
            
            //鼠标按下***************
            dragDown(bool,$event){
                if(bool){
                    this.mouseDown=true;
                    this.mouseStartY=$event.clientY;
                }else{
                    this.mouseDown=false;
                    this.mouseStartY='';
                }
            },
            //鼠标离开*********************
            dragLeave(){
                this.mouseDown=false;
                this.mouseStartY='';
            },
            //鼠标移动拖拽*********************
            dragMove($event){
                if(this.mouseDown){
                    var Y=$event.clientY-this.mouseStartY;
                    var month= document.getElementById('scrollMonth');
                    var H=window.getComputedStyle(month).height;
                    var top=parseInt(month.style.top);
                     console.log(month,Y,top);
                    if(top==0&&Y<0){             
                        return;
                    }else if(top>0){
                        month.style.top='0px';
                        return;
                    }else if(top<parseInt(H)*-1){
                        month.style.top=parseInt(H)*-1+'px';
                        return;
                    }  
                    month.style.top=top-Y*2+'px';
                    this.mouseStartY=$event.clientY;
                }

            },
            //会计期[反]结账确认选择*****************************
            yearsTrue(str,val){
               if(str=='check'||str=='uncheck'){
                    this.checkOut(str,val);
               }else{
                    this.yearSelCss=false;
               }
            },
            //结账功能 //反结账功能*****************************************
            checkOut(str,val){
                var t;
                var url;
                if(str=='check'){
                    url='/PBusinessConfig/UpdateBusinessConfig';
                }else if(str=='uncheck'){
                    if(this.unCheckVal>this.checkedTime-1){
                        this.$message('当前月份还未结账,无法反结账!');
                        return;
                    }
                    url='/PBusinessConfig/GetUnUpdateBusinessConfig';
                }
                t=this.nowTime.getFullYear()+'-'+val
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
                            this.getChecked();
                        }else{
                            this.$message(res.Msg);
                        }
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //会计期年份上下切换******
            nextYear(bool){
                var year=this.year;
                if(bool){
                    this.year=year>=this.sideDate.split('-')[0]?year:parseInt(year)+1;
                }else{
                   this.year=year<=2000?year:--year;
                }
            },
            //结账月份加减********************
            nextMonth(str,val,name){
                if(str=='pre'&&val>1){
                    val--;
                }else if(str=='next'&&val<12){
                    val++;
                }
                this[name]=val;
            },
            //会计期弹窗年月份选择*****************
            yearMonthClick($event){
                this.month=parseInt($event.target.innerHTML)
                this.sideDate=this.year+'-'+this.month;
                //this.getvoucherList('reset');
                this.$emit("time-click",{sideDate:this.sideDate})
            },
            //会计期内容切换************************************
            checkOutSel(val){
                this.monthsSelCss=val;
            },
            //会计期窗口弹出**************************
            yearSelShow(){
                console.log( this.yearSelCss)
                this.yearSelCss=!this.yearSelCss;
            },
            //会计期年份上下切换******
            nextYear(bool){
                var year=this.year;
                if(bool){
                    this.year=year>=this.sideDate.split('-')[0]?year:parseInt(year)+1;
                }else{
                   this.year=year<=2000?year:--year;
                }
            },
            //结账月份加减********************
            nextMonth(str,val,name){
                if(str=='pre'&&val>1){
                    val--;
                }else if(str=='next'&&val<12){
                    val++;
                }
                this[name]=val;
            },
            //ref调用会计期*************
            refSideDate(){
                return this.sideDate;
            }
    },
    computed:{
         ...mapState({
                orgid: state => state.user.orgid,
                orgcode: state => state.user.orgcode,
                uid:state=>state.user.userid
            })
    }
}
</script>

<style lang="scss" scoped>
   .asideNav{
        width:55px;
        position: fixed;
        z-index:99;
        right:10px;
        top:110px;
        height: 83%;
        min-height:490px;
        background: #fff;  
        box-shadow:0 0 20px 2px #ccc;
        >div:first-of-type{
            height:34px;
            line-height: 34px;
            text-align: center;
            background: #45c0f7;
            color:#fff;
            cursor: pointer;
            &:hover{
               background:  #00b7ee;
            }
        }
        p{
            text-align: center;
            height:30px;
            line-height: 30px;
            font-size: 18px;
            background: #fff;
            color:#04a9f4;
        }
        .monthsContainer{
            height:100%;
            overflow-y:scroll;
            overflow-x: hidden;     
            position: relative;
            left:7px;     
            width:70px;
            >ul.months{
                position: relative;
                left:-5px;
                
                // transition: all 0.1s linear;
               >li{
                   >ul> li{
                       &:nth-of-type(2):after,&:nth-of-type(1):after{
                           background: none;
                       }
                       &:after{
                           content:"";
                           position: absolute;
                           width:3px;
                           height:10px;
                           background: #02a7e7;
                           left:45%;
                           top:-12px;

                       }
                       &:first-of-type{
                           margin-top:0;
                       }
                       &:first-of-type:after{
                           content:"";
                           height:0;
                       } 
                       position: relative;
                       width:40px;
                       height:40px;
                       line-height: 40px;
                       font-size: 15px;
                       text-align: center;
                       margin:0 auto;
                       margin-top: 12px;
                       color: #45c0f7;
                       border: #c7e8f7 1px solid;
                       border-radius: 50%;
                       cursor:pointer;
                       &.active.unchecked{
                           color:#fff;
                           background: rgb(3, 169, 244);
                       }
                       &.active{
                           background: rgb(3, 169, 244);
                           box-shadow: 0px 2px 2px #dbf4ff;
                           border: #c7e8f7 1px solid;
                           color:#fff;
                       }
                       &.unchecked{
                           background: #fff;
                           border-color:transparent;
                           color: #CCC !important;
                           border: #ececec 1px solid !important;
                           box-shadow: 0px 2px 2px #e0e0e0 !important;
                           &:after{
                               background: #ccc;
                           }
                        //    &:hover{
                        //        border-color:#aaa;
                        //        background: #ccc;
                        //        color:#333;
                        //    }
                       }
                    //    &.futureM.unchecked{
                    //        
                    //        background: #ccc;
                    //        cursor:default;
                    //    }
                    //    &:hover{
                    //        background: #02a7e7;
                    //        color:#fff;
                    //    }
                       &:first-of-type{
                           border:0;
                           font-size: 15px;
                           font-weight: bold;
                           cursor:default;
                        //    &:hover{
                        //        background: none;
                        //        color:#333;
                        //    }
                       }
                       &:nth-of-type(2){
                           margin-top: 0;
                       }
                   }
               }
            }
        }
        .yearsContainer{
            &:before{
                position:absolute;
                content:"";
                right:-7px;
                top:30px;
                width:15px;
                height:15px;
                background: #fff;
                transform: rotate(-45deg);
                box-shadow: 0px 7px 5px 0px #D9D9D9;
            }
            position:absolute;
            top:0;
            z-index:9;
            left:-320px;
            width:300px;
            height:310px;
            background: #fff;
            padding:30px 10px 10px 10px;
            box-shadow: 7px 7px 5px 0px #D9D9D9;
            p{
                background: #fff;
            }
            .yearsTitle{
                border-bottom:1px solid #ccc;
                color:#aaa;
                padding-bottom: 10px;
                &:after{
                    content:"";
                    display:block;
                    clear: both;
                }
                >span{
                    float:left;
                    width:33.33%;
                    text-align: center;
                    border-right:1px solid #aaa;
                    font-weight: bold;
                    font-size:18px;
                    cursor:pointer;
                    &:hover{
                        color:#00b7ee ;
                    }
                    &.active{
                        color:#00b7ee ;
                    }
                    &:last-of-type{
                        border:0;
                    }
                }
            }
            .yearsContent{
                font-size: 15px;
                >div:first-of-type{
                    font-size: 18px;
                    font-weight: bold;
                    padding:10px 10px 0 10px ;
                    margin-left: 10px;
                    >div:nth-of-type(2){
                        float:right;
                        width:70px;
                        margin-right: 30px;
                        >img{
                            width:20px;
                            height:20px;
                            transform: rotate(-90deg);
                            position:relative;
                            top:-8px;
                            cursor:pointer;
                            &:first-of-type{
                                transform: rotate(90deg);
                                top:0px;
                            }
                            &:nth-of-type(2){
                                float:right;
                            }
                        }
                    }
                }

                >ul{          
                    padding:5px 20px;
                    width:100%;
                    &:after{
                        content:"";
                        display:list-item;
                        clear:both;
                    }
                    >li{
                        float:left;
                        width:60px;
                        height:60px;
                        line-height: 60px;
                        text-align: center;
                        cursor:pointer;
                        &:hover{
                            background:#00b7ee ;
                            color:#fff;
                        }
                        &.active{
                            background:#00b7ee;
                            color:#fff;
                        }
                    }
                }
                >p{
                 
                    font-size: 15px;
                    >span{
                        width:80px;
                        height:30px;
                        line-height: 30px;
                        text-align: center;
                        margin-left: 40px;
                        color:#00b7ee ;
                        border:1px solid #00b7ee ;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #00b7ee ;
                        }
                    }
                }
            }
            .jiezhang{
                >div:first-of-type{
                    width:230px;
                    height:100px;
                    line-height:40px;
                    margin: 40px auto ;
                    padding:30px 0px;
                    >span{
                        float:left;
                    }
                    >div{
                        width:50px;
                        float:left;
                    }
                    >i{
                        float:left;
                        display: block;
                        width:24px;
                        height:24px;
                        border:1px solid #00b7ee ;
                        border-radius: 50%;
                        margin:0 5px;
                        margin-top:8px;
                        background: #00b7ee ;
                        position: relative;
                        cursor: pointer;
                        &:first-of-type{
                            background: none;
                            border-color:#ff9900;
                        }
                        &:before{
                            content:"";
                            width:14px;
                            height:1px;
                            background: #ff9900;
                            position: absolute;
                            top:11px;
                            left:4px;
                        }
                        &:nth-of-type(2):before{
                            background: #fff;
                        }
                        &:nth-of-type(2):after{
                            background: #fff;
                            content:"";
                            width:1px;
                            height:14px;
                            position: absolute;
                            top:4.5px;
                            left:11px;
                        }
                    }
                }
                >p{
                    >span{
                        float:left;
                    }
                }
            }
        }

    }

</style>
