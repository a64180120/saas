<template>
<!--17-->
    <div class="asideNav"><!--右侧时间选择组件-->
            <div @click.stop="yearSelShow"><span>会计期</span></div>
            <p>{{sideDate.split('-')[0]}}</p>
            <div class="monthsContainer">
                <ul @mouseleave.stop="dragLeave" @mousemove.stop="dragMove" @mouseup.stop="dragDown(false)" @mousedown.prevent.stop="dragDown(true,$event)" style="bottom:0px;"  id="scrollMonth" class="months">
                    <li v-for="item of nowTime.getFullYear()-2000"  :key="item">
                        <ul>
                            <li>{{2000+item}}</li>
                            <li :class="{active:sideDate.split('-')[1]==i&&2000+item==sideDate.split('-')[0],unchecked:i>checkedTime&&2000+item==nowTime.getFullYear(),futureM:2000+item==nowTime.getFullYear()&&i>nowTime.getMonth()+1}" @click="sideMonth(i,item+2000)" v-for="i of 12" :key="i">{{i}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!--会计期弹窗*************************************-->
            <div v-show="yearSelCss" class="yearsContainer">
                <p class="yearsTitle">
                    <span @click="checkOutSel('kuaiji')" :class="{active:monthsSelCss=='kuaiji'}">会计期</span>
                    <span @click="checkOutSel('jiezhang')" :class="{active:monthsSelCss=='jiezhang'}">结账</span>
                    <span @click="checkOutSel('fanjiezhang')" :class="{active:monthsSelCss=='fanjiezhang'}">反结账</span>
                </p>
                <div v-show="monthsSelCss=='kuaiji'" class="yearsContent">
                    <div class="flexPublic">
                        <div>{{year}}</div>
                        <div class="flexPublic">
                            <img @click="nextYear(false)" src="../../assets/icon/leftArr.svg" alt="">
                            <img @click="nextYear(true)" src="../../assets/icon/leftArr.svg" alt="">
                        </div>
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
         if (window.addEventListener){
                //var month= document.getElementById('scrollMonth');
                window.addEventListener('DOMMouseScroll',this.wheel,false);
                window.onmousewheel=document.onmousewheel=this.wheel;
            }
    },
    data(){
        return {
            checkVal:'',
            unCheckVal:'',
            sideDate:'',
            year:'',
            month:'',
            checkedTime:'',
            nowTime:new Date,
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
                    queryfilter:{"JYear*str*eq*1":this.nowTime.getFullYear().toString(),"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{                     
                        this.checkedTime=res.Record[0].JAccountPeriod+1;
                        this.sideDate=this.nowTime.getFullYear()+'-'+this.checkedTime;
                        this.year=this.sideDate.split('-')[0];
                        this.month=this.sideDate.split('-')[1];
                        this.checkVal=this.checkedTime;
                        this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                        //this.getvoucherList('reset');
                        this.$emit("time-click",{sideDate:this.sideDate})
                        this.$forceUpdate();
                    })
                    .catch(err=>console.log(err))
            },
        //获取会计期凭证列表****************
        // //  getvoucherList(val){
        //         if(val=='reset'){
        //             this.pageindex=0;
        //         }
        //         const loading1=this.$loading();
        //         var data={
        //             uid:this.uid,
        //             orgid:this.orgid,
        //             pagesize:this.pagesize,
        //             pageindex:this.pageindex,
        //             queryfilter:{"Uyear*str*eq*1":this.sideDate.split('-')[0],"PMonth*byte*eq*1":parseInt(this.sideDate.split('-')[1]),"OrgId*num*eq*1":this.orgid}
        //         }
        //         this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
        //             .then(res=>{
                                  
        //                 if(res.Record.length<=0){
        //                     this.$message('暂无新凭证');
        //                 } else{
        //                     this.newAddList=res.Record;
        //                     this.count=val=='pre'?this.newAddList.length-1:0;
        //                     this.totalRows=res.totalRows;
        //                     this.pagesize=res.size;
        //                     this.pageindex=res.index;
        //                     // this.voucherDataList.data={
        //                     //     Mst:this.newAddList[this.count]
        //                     // };
        //                     // this.resetVoucher();
        //                 }
        //                 loading1.close();
        //             })
        //             .catch(err=>{this.$message.error(err);loading1.close();})
            //},
         //选择会计期***************
            sideMonth(i,year){
                this.month=i;
                this.year=year;
                this.sideDate=year+'-'+i;
                //this.getvoucherList('reset');
                this.$emit("time-click",{sideDate:this.sideDate})
            },
            //滚轮监听********************
            wheel(event){
                var delta = 0;
                if(!event){
                  event = window.event;
                  if(event.whellDelta){
                      delta=event.wheelDelta/120;
                      if(window.opera){
                          delta=-delta;
                      }else if(event.detal){
                          delta=-event.detail/3;
                      }
                      if(delta){
                          this.monthsSel(delta);
                      }
                  }  
                }
            },
            //鼠标滚轮移动月份选择****************
            monthsSel(delta){
                var month= document.getElementById('scrollMonth');
                var bot=parseInt(month.style.bottom);
                if(delta<0){
                    if(parseInt(bot)>0){
                        return;
                    }else{
                        month.style.bottom=bot-100+'px';
                    }
                }else{
                    if(bot>-100){
                        month.style.bottom='0px';
                    }else{
                        month.style.bottom=bot+100+'px';
                    }
                }
            },
            //火狐浏览鼠标滚轮移动****************
            // foxMonthSel($event){
            //     var month= document.getElementById('scrollMonth');
            //     var bot=parseInt(month.style.bottom);

            //     if($event.detail=='-3'){
            //         if(parseInt(bot)>0){
            //             return;
            //         }else{
            //             month.style.bottom=bot-100+'px';
            //         }
            //     }else if($event.detail=='3'){
            //         if(bot>-100){
            //             month.style.bottom='0px';
            //         }else{
            //             month.style.bottom=bot+100+'px';
            //         }
            //     }
            // },
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
                    var bot=parseInt(month.style.bottom);
                    if(bot>0){
                        month.style.bottom='0px';
                        return;
                    }
                        month.style.bottom=bot-Y*2+'px';
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
                            this.$message('结账失败!');
                        }
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
        position:absolute;
        right:0px;
        top:0px;
        height: 700px;
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
               background:  #2780d1;
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
            height:620px;
            //overflow-y:scroll;
            overflow: hidden;
            position: relative;
            left:0px;
           // width:70px;
            >ul.months{
                position: absolute;
                left:6px;
                bottom:0px;
                transition: all 0.8s linear;
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
                display: flex;
                align-items: center;
                color:#aaa;
                padding-bottom: 10px;
                >span{
                    width:33.33%;
                    border-right:1px solid #aaa;
                    font-weight: bold;
                    cursor:pointer;
                    &:hover{
                        color:#3e8cbc;
                    }
                    &.active{
                        color:#3e8cbc;
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
                    padding:10px;
                    margin-left: 10px;
                    >div:nth-of-type(2){
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
                        }
                    }
                }

                >ul{
                    display: flex;
                    align-items: center;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    padding:5px 20px;
                    width:100%;
                    height:160px;
                    >li{
                        width:50px;
                        height:50px;
                        line-height: 50px;
                        text-align: center;
                        cursor:pointer;
                        &:hover{
                            background:#2780d1 ;
                            color:#fff;
                        }
                        &.active{
                            background:#2780d1 ;
                            color:#fff;
                        }
                    }
                }
                >p{
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    >span{
                        width:80px;
                        height:30px;
                        line-height: 30px;
                        text-align: center;
                        margin-left: 40px;
                        color:#3e8cbc;
                        border:1px solid #3e8cbc;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #3e8cbc;
                        }
                    }
                }
            }
            .jiezhang{
                >div{
                    width:230px;
                    margin: 50px auto ;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    >div{
                        width:50px;

                    }
                    >i{
                        display: block;
                        width:24px;
                        height:24px;
                        border:1px solid #3e8cbc;
                        border-radius: 50%;
                        margin: 5px;
                        background: #3e8cbc;
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
            }
        }

    }

</style>
