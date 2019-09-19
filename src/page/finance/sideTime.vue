<template>
  <!--17-->
  <div class="asideNav">
    <!--右侧时间选择组件-->
    <div @click.stop="yearSelShow">
      <div style="height:50%;line-height:17px;font-size:14px"><span>会计期</span></div>
      <div style="height:50%;line-height:17px;font-size:14px"><span>选择</span></div>
    </div>
    <p>{{sideDate.split('-')[0]}}</p>
    <div class="monthsOver">
      <div class="monthsContainer">
        <ul style="top:0"
            @mouseleave.stop="dragLeave"
            @mousemove.stop="dragMove"
            @mouseup.stop="dragDown(false)"
            @mousedown.prevent.stop="dragDown(true,$event)"
            id="scrollMonth"
            class="months">
          <li v-for="item of nowYear-startYear+2"
              :key="item">
            <ul>
              <li>{{parseInt(startYear)+parseInt(item)-1}}</li>
              <li :class="{active:sideDate.split('-')[1]==i&&(parseInt(startYear)+parseInt(item)-1)==sideDate.split('-')[0],unchecked:(i>checkedTime)&&((parseInt(startYear)+parseInt(item)-1)>=checkedYear)||((parseInt(startYear)+parseInt(item)-1)>checkedYear),futureM:((parseInt(startYear)+parseInt(item)-1)>=nowYear)&&(i>(nowTime.getMonth()+1))}"
                  @click="sideMonth(i,parseInt(startYear)+parseInt(item)-1)"
                  v-for="i of 12"
                  :key="i">{{i}}</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!--会计期弹窗*************************************-->
    <div v-if="!timeType"
         v-show="yearSelCss"
         class="yearsContainer">
      <div class="yearsTitle">
        <span @click="checkOutSel('kuaiji')"
              :class="{active:monthsSelCss=='kuaiji'}">会计期</span>

      </div>
      <div v-show="monthsSelCss=='kuaiji'"
           class="yearsContent">
        <div class="flexPublic">
          <div>{{year}}</div>
          <div class="flexPublic">
            <img @click.stop="nextYear(true)"
                 src="../../assets/icon/leftArr.svg"
                 alt="">
            <img @click.stop="nextYear(false)"
                 src="../../assets/icon/leftArr.svg"
                 alt="">
          </div>
          <div style="clear:both"></div>
        </div>
        <ul @click="yearMonthClick"
            class="year-month">
          <li :class="{active:month==index}"
              v-for="index of 12"
              :key="index">{{index}}月</li>
        </ul>
      </div>

    </div>
    <!-- 下月账///结账******************* -->
    <next-month :checkVal="checkVal.toString()"
                v-if="nextMonthCss"
                @child-click="nextMonthHandle"></next-month>
    <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
    <message :message="saasMessage.message"
             :delay="saasMessage.delay"
             :visible.sync="saasMessage.visible"></message>

  </div>

</template>

<script>
import nextMonth from './nextMonthCheck'
import userInfo from '@/util/auth'
import { mapState, mapActions } from 'vuex'
export default {
  activated () {
    this.getChecked();
    // this.startYear='2018';
    this.startYear = this.jbuildDate.slice(0, 4);
    //  if (window.addEventListener){
    //         //var month= document.getElementById('scrollMonth');
    //         window.addEventListener('DOMMouseScroll',this.wheel,false);
    //         window.onmousewheel=document.onmousewheel=this.wheel;
    //     }


  },
  props: {
    timeType: {
      type: String,
      default () {
        return '';
      }
    }
  },
  data () {
    return {
      unCheckYear: '',//反月结年份****
      checkVal: '',//月结月份
      unCheckVal: '',//反月结月份
      sideDate: '',//时间选择器值
      year: '',
      month: '',
      startYear: '2018',
      checkedTime: '',
      checkedYear: '',
      nextMonthCss: false, //结账显示
      nowTime: new Date,
      nowYear: (new Date).getFullYear(),
      monthsSelCss: 'kuaiji',
      mouseDown: false,
      mouseStartY: '',
      yearSelCss: false,
      saasMessage: {
        visible: false,
        message: ''
      }
    }
  },
  methods: {
    //获取当前结账的最新月份************
    getChecked () {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        queryfilter: { "OrgId*num*eq*1": this.orgid }
      }
      this.$axios.get('/PBusinessConfig/GetPBusinessConfigList', { params: data })
        .then(res => {
          if (!res.CheckRes) {
            this.saasMessage = {
              message: '当前组织未初始化!',
              delay: 4000,
              visible: true
            }
            var route = this.$route;

            //移除TagNav
            this.$store.commit("tagNav/removeTagNav", route);
            this.$router.push({ path: '/setting/subjectstart' })
            return;
          }
          this.checkedTime = res.Record[0].JAccountPeriod + 1;
          this.unCheckYear = this.checkedYear = res.Record[0].JYear;
          this.sideDate = res.Record[0].JYear + '-' + this.checkedTime;
          this.year = this.sideDate.split('-')[0];
          this.month = this.sideDate.split('-')[1];
          this.checkVal = this.checkedTime;
          this.unCheckVal = this.checkedTime > 1 ? this.checkedTime - 1 : 1;
          //this.getvoucherList('reset');
          this.$emit("time-click", { sideDate: this.sideDate, checkedTime: this.checkedTime, checkedYear: this.checkedYear })
          this.$forceUpdate();
          this.$nextTick(function () {  //当前月在顶部
            var li = document.querySelector('#scrollMonth>li>ul> li.active');
            var ul = document.querySelector('.monthsContainer');
            ul.scrollTop = li.offsetTop;
          })
        }, err => {
          console.log(err);

        })
        .catch(err => this.$message({ showClose: true, message: err, type: "error" }))
    },

    //选择会计期***************
    sideMonth (i, year) {
      this.month = i;
      this.year = year;
      this.sideDate = year + '-' + i;
      //this.getvoucherList('reset');
      this.$emit("time-click", { sideDate: this.sideDate, checkedTime: this.checkedTime, checkedYear: this.checkedYear })
    },

    //鼠标按下***************
    dragDown (bool, $event) {
      if (bool) {
        this.mouseDown = true;
        this.mouseStartY = $event.clientY;
      } else {
        this.mouseDown = false;
        this.mouseStartY = '';
      }
    },
    //鼠标离开*********************
    dragLeave () {
      this.mouseDown = false;
      this.mouseStartY = '';
    },
    //鼠标移动拖拽*********************
    dragMove ($event) {
      if (this.mouseDown) {
        var Y = this.mouseStartY - $event.clientY;  //鼠标移动距离
        var month = document.getElementsByClassName('monthsContainer')[0];

        //var H=window.getComputedStyle(month).height;  //元素高度
        var top = parseInt(month.scrollTop);
        if (top == 0 && Y < 0) {
          return;
        }
        // else if(top>0){
        //     month.scrollTop=0;
        //     return;
        // }
        // else if(top<0){
        //     month.scrollTop=parseInt(H)*-1+'px';
        //     return;
        // }
        console.log(Y, top)
        month.scrollTop = Y + top;
        this.mouseStartY = $event.clientY;
      }

    },
    // //反结账年份加减
    // checkYear (bool) {
    //   if (bool && this.unCheckYear < this.checkedYear) {
    //     this.unCheckYear++;
    //   } else if (!bool && this.unCheckYear > this.jbuildDate.slice(0, 4)) {
    //     this.unCheckYear--;
    //   }

    // },
    // //会计期[反]结账确认选择*****************************
    // yearsTrue (str, val, year) {
    //   if (val > 12 || val < 1) {
    //     this.saasMessage = {
    //       message: '请输入正确的月份',
    //       visible: true
    //     }
    //     return;
    //   }
    //   if (str == 'uncheck') {
    //     this.checkOut(str, val, year);
    //     this.yearSelCss = false;
    //   } else if (str == 'check') {
    //     this.yearSelCss = false;
    //     this.nextMonthCss = true;
    //   }
    //   this.yearSelCss = false;

    // },
    // //结账功能 //反结账功能*****************************************
    // checkOut (str, val, year) {
    //   var t;
    //   var url;
    //   if (str == 'check') {  //不进行结账了,暂留**
    //     url = '/PBusinessConfig/UpdateBusinessConfig';
    //   } else if (str == 'uncheck') {
    //     if ((this.unCheckVal > this.checkedTime - 1) && (year >= this.checkedYear)) {
    //       this.saasMessage = {
    //         message: '当前月份还未结账,无法反结账!',
    //         visible: true
    //       }
    //       return;
    //     }
    //     url = '/PBusinessConfig/GetUnUpdateBusinessConfig';
    //   }
    //   t = year + '-' + val
    //   var data = {
    //     orgid: this.orgid,
    //     uid: this.uid,
    //     dateTime: t
    //   }
    //   const loading1 = this.$loading();
    //   this.$axios.get(url, { params: data })
    //     .then(res => {
    //       loading1.close();
    //       if (res.Status == 'success') {
    //         this.saasMessage = {
    //           message: str == 'check' ? '结账成功!' : '反结账成功!',
    //           visible: true
    //         }
    //         this.getChecked();
    //       } else {
    //         this.$message(res.Msg);
    //       }
    //     }, err => {
    //       console.log(err);

    //     })
    //     .catch(err => { this.$message({ showClose: true, message: str == 'check' ? '结账失败!' : '反结账失败!', type: "error" }); loading1.close(); })
    // },
    // //结账显示***
    // monthCheckShow () {
    //   if (this.checkVal < this.checkedTime) {
    //     this.saasMessage = {
    //       visible: true,
    //       message: '当前月份已结账!'
    //     }
    //   } else {
    //     this.nextMonthCss = true;
    //   }
    // },
    // //接收结账传值******************
    // nextMonthHandle (data) {

    //   if (data === false) {

    //   } else if (data == 'success') {
    //     this.saasMessage = {
    //       visible: true,
    //       message: '结账成功!'
    //     }
    //   }
    //   this.nextMonthCss = false;
    //   this.getChecked();
    // },
    // //结账月份加减********************
    // nextMonth (str, val, name) {
    //   if (str == 'pre' && val > 1) {
    //     val--;
    //   } else if (str == 'next' && val < 12) {

    //     val++;
    //   }
    //   this[name] = val;
    // },
    //会计期弹窗年月份选择*****************
    yearMonthClick ($event) {
      this.month = parseInt($event.target.innerHTML)
      this.sideDate = this.year + '-' + this.month;
      this.yearSelCss = false;
      //this.getvoucherList('reset');
      this.$emit("time-click", { sideDate: this.sideDate })
    },
    //会计期内容切换************************************
    checkOutSel (val) {
      this.monthsSelCss = val;
    },
    //会计期窗口弹出**************************
    yearSelShow () {
      this.yearSelCss = !this.yearSelCss;
    },
    //会计期年份上下切换******
    nextYear (bool) {
      var year = this.year;
      if (bool) {
        this.year = year > this.sideDate.split('-')[0] ? year : parseInt(year) + 1;
      } else {
        this.year = year <= 2000 ? year : --year;
      }
    },
    //结账月份加减********************
    // nextMonth(str,val,name){
    //     if(str=='pre'&&val>1){
    //         val--;
    //     }else if(str=='next'&&val<12){
    //         val++;
    //     }
    //     this[name]=val;
    // },
    //ref调用会计期*************
    refSideDate () {
      return this.sideDate;
    }
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      orgcode: state => state.user.orgcode,
      uid: state => state.user.userid,
      Roleauthorize: state => state.user.Roleauthorize,
      jbuildDate: state => state.Pconfig.jbuildDate
    })
  },
  components: {
    nextMonth
  }
}
</script>

<style lang="scss" scoped>
.asideNav {
  width: 55px;
  position: absolute;
  z-index: 99;
  right: -10px;
  top: 50px;
  bottom: 70px;
  background: #fff;
  box-shadow: 0 0 20px 2px #ccc;
  border-radius: 0 5px 5px 0;
  > div:first-of-type {
    height: 34px;
    line-height: 34px;
    text-align: center;
    background: #45c0f7;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    border-radius: 0 5px 0px 0;
    &:hover {
      background: #00b7ee;
    }
  }

  > p {
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    /*background: #88b927;*/
    color: #88b927;
    box-shadow: 0px 1px 10px 0.1px #d3e9f9;
  }
  .monthsContainer {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    left: 7px;
    width: 70px;

    > ul.months {
      position: relative;
      left: -7px;
      > li {
        > ul > li {
          &:nth-of-type(2):after,
          &:nth-of-type(1):after {
            background: none;
          }
          &:after {
            content: "";
            position: absolute;
            width: 3px;
            height: 15px;
            background: #02a7e7;
            left: 45%;
            top: -20px;
          }
          &:first-of-type {
            margin-top: 5px;
          }
          &:first-of-type:after {
            content: "";
            height: 0;
          }
          position: relative;
          width: 40px;
          height: 40px;
          line-height: 40px;
          font-size: 15px;
          text-align: center;
          margin: 0 auto;
          margin-top: 25px;
          color: #00b7ee;
          border: #c7e8f7 1px solid;
          box-shadow: 0px 2px 2px #dbf4ff;
          border-radius: 50%;
          cursor: pointer;
          &.active.unchecked {
            color: #fff;
            background: #00b7ee;
          }
          &.active {
            background: #03a9f4;
            /*box-shadow: 0px 2px 2px #dbf4ff;
                           border: #00b7ee 1px solid;*/
            color: #fff;
          }
          &.unchecked {
            background: #fff;
            /*border-color:transparent;*/
            color: #ccc !important;
            border: #ececec 1px solid !important;
            box-shadow: 0px 2px 2px #e0e0e0 !important;
            &:after {
              background: transparent;
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
          &:first-of-type {
            border: 0;
            font-size: 15px;
            font-weight: bold;
            cursor: default;
            box-shadow: none;
            //    &:hover{
            //        background: none;
            //        color:#333;
            //    }
          }
          &:nth-of-type(2) {
            margin-top: 0;
          }
        }
      }
    }
  }
  .monthsOver {
    position: absolute;
    overflow: hidden;
    top: 65px;
    bottom: 0;
    left: 0;
    width: 55px;
  }
  /* .monthsContainer{

            overflow-y:scroll;
            overflow-x: hidden;
            position: absolute;
            left:7px;
            top:0px;
            bottom:0;
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
                       border: #00b7ee 2px solid;
                       border-radius: 50%;
                       cursor:pointer;
                       &.active.unchecked{
                           color:#fff;
                           background: #00b7ee;
                       }
                       &.active{
                           background: #00b7ee;
                           box-shadow: 0px 2px 2px #dbf4ff;
                           border: #00b7ee 1px solid;
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
        }*/
  .yearsContainer {
    &:before {
      position: absolute;
      content: "";
      right: -7px;
      top: 30px;
      width: 15px;
      height: 15px;
      background: #fff;
      transform: rotate(-45deg);
      box-shadow: 2px 7px 5px 0px #d9d9d9;
    }
    position: absolute;
    top: 0;
    z-index: 9;
    left: -320px;
    width: 300px;
    height: 310px;
    background: #fff;
    padding: 25px 10px 10px 10px;
    box-shadow: 7px 7px 5px 0px #d9d9d9;
    p {
      background: #fff;
    }
    .yearsTitle {
      border-bottom: 1px solid #ccc;
      color: #aaa;
      padding-bottom: 10px;
      &:after {
        content: "";
        display: block;
        clear: both;
      }
      > span {
        float: left;
        width: 100%;
        text-align: center;
        border-right: 1px solid #aaa;
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;
        &:hover {
          color: #00b7ee;
        }
        &.active {
          color: #00b7ee;
        }
        &:last-of-type {
          border: 0;
        }
      }
    }
    .yearsContent {
      font-size: 15px;
      > div:first-of-type {
        font-size: 18px;
        font-weight: bold;
        padding: 10px 10px 0 10px;
        margin-left: 10px;
        > div:nth-of-type(2) {
          float: right;
          width: 70px;
          margin-right: 30px;
          > img {
            width: 20px;
            height: 20px;
            transform: rotate(-90deg);
            position: relative;
            top: -8px;
            cursor: pointer;
            &:first-of-type {
              transform: rotate(90deg);
              top: 0px;
            }
            &:nth-of-type(2) {
              float: right;
            }
          }
        }
      }

      > ul {
        padding: 5px 20px;
        width: 100%;
        &:after {
          content: "";
          display: list-item;
          clear: both;
        }
        > li {
          float: left;
          width: 60px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          cursor: pointer;
          &:hover {
            background: #00b7ee;
            color: #fff;
          }
          &.active {
            background: #00b7ee;
            color: #fff;
          }
        }
      }
      > p {
        font-size: 15px;
        > span {
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-left: 40px;
          // color:#00b7ee ;
          // border:1px solid #00b7ee ;
          border-radius: 3px;
          cursor: pointer;
          // &:hover{
          //     color:#fff;
          //     background: #00b7ee ;
          // }
        }
      }
    }
    .jiezhang {
      .fanjiezhang:first-of-type {
        width: 230px;
        height: 180px;
        line-height: 40px;
        margin: 0px auto;
        padding: 30px 0px;
        > div:first-of-type,
        > div:nth-of-type(2) {
          float: none;
          width: 100%;
          padding-left: 20px;
        }
        > i:first-of-type {
          margin-left: 20px;
        }
        > div:first-of-type {
          padding-left: 0px;
        }
        .checkYear > span:first-of-type {
          color: #05b5f1;
        }
        .checkYear > i {
          color: #05b5f1;
          cursor: pointer;
        }
        .checkYear > i.disabled {
          color: #bbb;
          cursor: default;
        }
      }
      > div:first-of-type {
        width: 230px;
        height: 100px;
        line-height: 40px;
        margin: 40px auto;
        padding: 30px 0px;
        > span {
          float: left;
        }
        > div {
          width: 50px;
          float: left;
        }
        > i {
          float: left;
          display: block;
          width: 24px;
          height: 24px;
          border: 1px solid #00b7ee;
          border-radius: 50%;
          margin: 0 5px;
          margin-top: 8px;
          background: #00b7ee;
          position: relative;
          cursor: pointer;
          &:first-of-type {
            background: none;
            border-color: #ff9900;
          }
          &:before {
            content: "";
            width: 14px;
            height: 1px;
            background: #ff9900;
            position: absolute;
            top: 11px;
            left: 4px;
          }
          &:nth-of-type(2):before {
            background: #fff;
          }
          &:nth-of-type(2):after {
            background: #fff;
            content: "";
            width: 1px;
            height: 14px;
            position: absolute;
            top: 4.5px;
            left: 11px;
          }
        }
      }
      > p {
        > span {
          float: left;
        }
      }
    }
  }
}
.jiezhang .inputContainer input {
  text-align: center;
}
</style>
