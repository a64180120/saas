<template>
  <div class="box">
    <div class="box1">
      <div class="Time">
        {{showtype=='doubleTime'?'会计期':'年度'}}
      </div>

      <div class="Time_name">{{choosedYear}}</div>
      <!--侧边时间选择器  月-->
      <div class="vertical dragscroll dragscrollMonth"
           v-bind:style="{'display':(showtype=='doubleTime'||showtype=='singleTime'?'block':'none')}">
        <div class="list monthTime"
             style="margin-top: 0px"
             @mouseleave.stop="dragLeave"
             @mousemove.stop="dragMove"
             @mouseup.stop="dragDown(false,$event)"
             @mousedown.prevent.stop="dragDown(true,$event)">
          <div id="sc">
            <template v-for="y in years">
              <template v-if="y+startYear<=years+jiezhangYear">
                <ul>
                  <p class="name">{{startYear+y-1}}</p>
                  <template v-for="m in month">
                    <li :date="(startYear+y-1)+'-'+m"
                        :class="{'Font_color':(startYear+y-1==jiezhangYear&& m>jiezhangMonth||startYear+y-1>jiezhangYear),'selectMonth':(startYear+y-1==choosedYear&&m==choosedMonth)}"
                        @click="chosedata">{{m}}</li>
                    <i :class="{'colour':(startYear+y-1==jiezhangYear&& m>=jiezhangMonth||startYear+y-1>jiezhangYear)?true:(m==12?true:false)}"></i>
                  </template>
                </ul>

              </template>
              <template v-else></template>
            </template>
          </div>
        </div>
      </div>
      <!--侧边时间选择器 年-->
      <div class="vertical dragscroll dragscrollYear"
           v-bind:style="{'display':(showtype=='yearTime'?'block':'none'),top:'60px'}">
        <div class="list yearTime">
          <div>
            <ul>
              <template v-for="n in years">
                <template v-if="n+startYear<=jiezhangYear+ (jiezhangMonth==12&&(jiezhangYear+1)!=startYear?2:1)">
                  <li :date="(startYear+n-1)+'-'+1"
                      :class="{'selectMonth':(startYear+n-1==choosedYear)}"
                      @click="chosedata">{{startYear+n-1}}</li>
                  <i :class="{'colour':(startYear+n-1>=jiezhangYear)?true:false}"
                     style="margin: 12px 24px;"></i>
                </template>
                <template v-else></template>
              </template>
            </ul>
          </div>
        </div>
      </div>-->
    </div>
    <!--明细账样式-->
    <div v-bind:style="{'display':(showtype=='doubleTime'?'block':'none')}">
      <div class="Popup"
           v-bind:style="{'display':showTog}">
        <div style="height: 160px;">
          <div class="Content_area date"
               :style="{'display':monthsSelCss=='kuaiji'?'block':'none'}">
            <div class="Current_year">
              <i class="el-icon-minus"
                 style="cursor: pointer"
                 @click="((choosedYear>startYear)?choosedYear--:choosedYear=startYear)"></i>
              <p style="display:none;"></p>
              <span style="width:13px;display:none;">-</span>
              <p>{{choosedYear}}</p>
              <i class="el-icon-plus"
                 style="cursor: pointer"
                 @click="((choosedYear<choosedYearEnd)?choosedYear++:choosedYear=choosedYearEnd)"></i>
            </div>
            <ul>
              <template v-for="n in 12">
                <li :class="{'uncatchMont':n>jiezhangMonth&&choosedYear==jiezhangYear||choosedYear>jiezhangYear,'selectMonth':n==choosedMonth}"
                    @click="chosedataS(n,1,1)">{{n}}月</li>
              </template>
            </ul>
          </div>
          <div id="box"
               class="Content_area date"
               :style="{'display':monthsSelCss=='kuaiji'?'block':'none'}">
            <div id="Current_year1"
                 class="Current_year">
              <i class="el-icon-minus"
                 style="cursor: pointer"
                 @click="((choosedYearEnd>choosedYear)?choosedYearEnd--:choosedYearEnd=choosedYear)"></i>
              <p style="display:none;"></p>
              <span style="width:13px;display:none;">-</span>
              <p>{{choosedYearEnd}}</p>
              <i class="el-icon-plus"
                 style="cursor: pointer"
                 @click="((choosedYearEnd<(Math.floor(jiezhangYear) + (jiezhangMonth=='12'&&(jiezhangYear+1)!=startYear?1:0)))?choosedYearEnd++:choosedYearEnd=(Math.floor(jiezhangYear) + (jiezhangMonth=='12'&&(jiezhangYear+1)!=startYear?1:0)))"></i>
            </div>
            <ul id="Month"
                style="border-left: 1px solid #eee;">
              <template v-for="n in 12">
                <li :class="{'uncatchMont':n>jiezhangMonth&&choosedYearEnd==jiezhangYear||choosedYearEnd>jiezhangYear||choosedYear==choosedYearEnd&&choosedMonth>n,'selectMonth':n==choosedMonthEnd}"
                    @click="(n>=choosedMonth)?chosedataS(n,2,1):''">{{n}}月</li>
              </template>
              <!--<template v-for="n in 12">
                                <li :class="{'selectMonth':n==choosedMonthEnd,'uncatchMont':n>jiezhangMonth&&choosedYear>=jiezhangYear||n<choosedMonth}"
                                    @click="(n>=choosedMonth)?chosedataS(n,2):''"
                                >{{n}}月</li>
                            </template>-->
            </ul>
          </div>
          <div style="float: none"></div>
        </div>

        <div style="border-top: 1px solid #eee;color: #02a7e7;text-align: center;line-height: 30px">可以同时选择起始时间和终止时间</div>
      </div>
    </div>

    <!--报表样式-->
    <div v-bind:style="{'display':(showtype=='singleTime'?'block':'none')}">
      <div class="Popup"
           v-bind:style="{'display':showTog,'left':'-225px'}">
        <div class="Content_area date"
             :style="{'display':monthsSelCss=='kuaiji'?'block':'none'}">
          <div class="Current_year">
            <i class="el-icon-minus"
               style="cursor: pointer"
               @click="((choosedYear>startYear)?choosedYear--:choosedYear=startYear)"></i>
            <p style="display:none;"></p>
            <span style="width:13px;display:none;">-</span>
            <p>{{choosedYear}}</p>
            <i class="el-icon-plus"
               style="cursor: pointer"
               @click="((choosedYear<(Math.floor(jiezhangYear) + (jiezhangMonth=='12'&&(jiezhangYear+1)!=startYear?1:0)))?choosedYear++:choosedYear=(Math.floor(jiezhangYear) + (jiezhangMonth=='12'&&(jiezhangYear+1)!=startYear?1:0)))"></i>
          </div>
          <ul>
            <template v-for="n in 12">
              <li :class="{'uncatchMont':n>jiezhangMonth&&choosedYear==jiezhangYear||choosedYear>jiezhangYear,'selectMonth':n==choosedMonth}"
                  @click="chosedataS(n,1,0)">{{n}}月</li>
            </template>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import saasMsg from '@/components/message/message'
import userInfo from '@/util/auth'
export default {
  name: "timeSelectBar",
  data () {
    return {
      years: 0,
      startYear: 0,
      //startmonth:'',//开始月份

      currentyear: 0,//当前年份
      currentmonth: 0,//当前月

      choosedYear: 0,//选择的年份
      choosedYearEnd: 0,//选择的结束年份

      choosedMonth: 0,//选择的开始月份
      choosedMonthEnd: 0,//选择的结束月份

      jiezhangMonth: 0,//结账的月份
      jiezhangYear: 0,//结账的年

      month: 12,//一共12个月
      showTog: 'none',//显示隐藏
      monthsSelCss: 'kuaiji',
      nowTime: new Date,
      //checkedTime:'',//下一个结账月*******
      mouseDown: false,
      mouseStartY: '',
    }
  },
  props: {
    showtype: String,
    nextYear: Boolean,
    budgetAll: Boolean,
    sw: Boolean//事物
  },
  components: { saasMsg },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      orgcode: state => state.user.orgcode,
      uid: state => state.user.userid,
      startYear2: state => state.Pconfig.jbuildDate
    })
  },
  activated () {
    this.$nextTick(this.toTop);
  },
  mounted () {
    //进行初始化判断
    this.csh();


    /*this.$emit('item-click',data)*/
  },
  methods: {

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
        var month = document.getElementsByClassName('monthTime')[0].parentElement;

        //var H=window.getComputedStyle(month).height;  //元素高度
        var top = parseInt(month.scrollTop);
        if (top == 0 && Y < 0) {
          return;
        }
        month.scrollTop = Y + top;
        this.mouseStartY = $event.clientY;
      }

    },

    lower: function () {
      this.year = this.year++;
    },
    showTogg: function () {
      this.showTog = (this.showTog == 'none') ? 'block' : 'none';
    },
    //会计期内容切换************************************
    checkOutSel (val) {
      this.monthsSelCss = val;
    },
    /*侧边月份点击事件*/
    chosedata: function (res) {
      let time = res.target.attributes.date.value;
      let timeLis = time.split('-');
      /*if(timeLis[0]==this.currentyear&&timeLis[1]>this.currentmonth){
          return
      };*/
      this.choosedYear = timeLis[0];
      this.choosedMonth = timeLis[1];
      this.choosedMonthEnd = timeLis[1];

      let data = {
        'choosedYear': this.choosedYear,
        'choosedYearEnd': this.choosedYear,
        'choosedMonth': this.choosedMonth,
        'choosedMonthEnd': this.choosedMonth,
        'lastYear': this.jiezhangYear
      }
      this.$emit('item-click', data)
    },

    //外部传值  替换原先的弹窗选择....
    dateChooseFn (data) {
      this.choosedYear = data.choosedYear
      this.choosedMonth = data.choosedMonth
      this.$emit('item-click', data)
    },
    /*弹窗月份点击事件*/
    chosedataS: function (n, level, type) {
      if (level == 1) {
        this.choosedMonth = n;
        this.choosedMonthEnd = this.choosedMonthEnd >= n ? this.choosedMonthEnd : n;
      } else {
        this.choosedMonthEnd = n;
      }
      let data = {
        'choosedYear': this.choosedYear,
        'choosedYearEnd': this.choosedYearEnd,
        'choosedMonth': this.choosedMonth,
        'choosedMonthEnd': this.choosedMonthEnd,
        'lastYear': this.jiezhangYear
      }
      if (type == 0 || (type == 1 && level != 1)) {
        this.showTog = 'none';
      }
      this.$emit('item-click', data)
    },
    /*判断组织是否初始化*/
    csh: function () {
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
            this.$router.push({ path: '/setting/subjectstart' })
          } else {
            if (this.budgetAll) {
              this.getNextYearAll();
            } else if (this.nextYear) {
              this.getNextYear();
            } else if (this.sw) {
              this.getSwYear()
            } else {
              this.getChecked();
            }
          }
        }).catch(err => {
          console.log(err)
        })
    },
    //获取当前结账的最新月份************
    getChecked () {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        queryfilter: { "OrgId*num*eq*1": this.orgid }
      }
      this.$axios.get('/PBusinessConfig/GetPBusinessConfigList', { params: data })
        .then(res => {
          /* if(!res.CheckRes){
               this.saasMessage={
                   message:'当前组织未初始化!',
                   delay:4000,
                   visible:true
               }
               this.$router.push({path:'/setting/subjectstart'})
               return;
           }*/

          if (this.startYear2 == '' || this.startYear2 == 0 || this.startYear2 == null) {
            this.startYear = new Date().getFullYear();
          } else {
            this.startYear = Number(this.startYear2.substring(0, 4));
          }
          if (res.Record.length > 0) {
            if (this.startYear == res.Record[0].JYear && res.Record[0].JAccountPeriod == 0) {
              this.jiezhangYear = Number(res.Record[0].JYear);
              this.jiezhangMonth = 1;
            } else {
              this.jiezhangMonth = (res.Record[0].JAccountPeriod == 12 ? 1 : res.Record[0].JAccountPeriod + 1);//结账的月份
              this.jiezhangYear = (res.Record[0].JAccountPeriod == 12 ? res.Record[0].JYear + 1 : res.Record[0].JYear);//结账年
            }

          } else {
            let currentYear = new Date();
            let currentyear = currentYear.getFullYear();
            let currentMonth = currentYear.getMonth() + 1;

            this.jiezhangMonth = currentMonth;//结账的月份
            this.jiezhangYear = currentyear;//结账年
          }
          this.years = (Number(this.jiezhangYear) - Number(this.startYear) + (this.jiezhangMonth == 12 && res.Record[0].JYear != this.startYear ? 2 : 1));
          this.choosedYear = this.jiezhangYear;
          this.choosedYearEnd = this.jiezhangYear;
          this.choosedMonth = this.jiezhangMonth;
          this.choosedMonthEnd = this.jiezhangMonth;
          let data = {
            'choosedYear': this.jiezhangYear,
            'choosedYearEnd': this.jiezhangYear,
            'choosedMonth': this.jiezhangMonth,
            'choosedMonthEnd': this.jiezhangMonth,
            'lastYear': this.jiezhangYear
          }
          this.$nextTick(this.toTop);
          this.$emit('item-click', data)
        })
        .catch(err => console.log(err))
    },
    //获取当前组织的预算年
    getNextYear: function () {
      var data = {
        orgid: this.orgid,
      }
      this.$axios.get('/PSubjectBudgetMst/GetBudgetYear', { params: data })
        .then(res => {
          if (this.startYear2 == '' || this.startYear2 == null || this.startYear2 == 0) {
            this.startYear = new Date().getFullYear();
          } else {
            this.startYear = Number(this.startYear2.substring(0, 4));
          }
          if (res.year != 0 && res.year != '' && res.year != null) {
            this.jiezhangMonth = 1;//结账的月份
            this.jiezhangYear = res.year;//结账年
            this.years = (Number(this.jiezhangYear) - Number(this.startYear)) + 1;
            this.choosedYear = this.jiezhangYear;
            this.choosedYearEnd = this.jiezhangYear;
            this.choosedMonth = this.jiezhangMonth;
            this.choosedMonthEnd = this.jiezhangMonth;
            let data = {
              'choosedYear': this.jiezhangYear,
              'choosedYearEnd': this.jiezhangYear,
              'choosedMonth': this.jiezhangMonth,
              'choosedMonthEnd': this.jiezhangMonth,
              'lastYear': this.jiezhangYear
            }
            this.$emit('item-click', data);
            console.log(data);
            this.$nextTick(this.toTop);
          } else {
            this.getChecked();
          }


        })
    },
    //预算汇总表获取预算年
    getNextYearAll: function () {
      var data = {
        orgid: this.orgid,
      }
      this.$axios.get('PSubjectBudget/GetMaxBudgetYear', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.startYear = Number(res.myear);
            this.jiezhangMonth = 1;//结账的月份
            this.jiezhangYear = Number(res.year);//结账年
            this.years = (Number(this.jiezhangYear) - Number(this.startYear)) + 1;
            this.choosedYear = this.jiezhangYear;
            this.choosedYearEnd = this.jiezhangYear;
            this.choosedMonth = this.jiezhangMonth;
            this.choosedMonthEnd = this.jiezhangMonth;
            let data = {
              'choosedYear': this.jiezhangYear,
              'choosedYearEnd': this.jiezhangYear,
              'choosedMonth': this.jiezhangMonth,
              'choosedMonthEnd': this.jiezhangMonth,
              'lastYear': this.jiezhangYear
            }
            this.$emit('item-click', data);
            this.$nextTick(this.toTop);
          } else {
            this.getChecked();
          }
        }).catch(err => {
          console.log(err)
        })
    },
    //获取事事务管理年
    getSwYear: function () {
      var data = {
        orgid: this.orgid,
      }
      this.$axios.get('/SysPerInormation/GetSysOrgPersYear', { params: data })
        .then(res => {
          console.log('===================')
          console.log(res);
          console.log('===================')
          if (res.Status == 'success') {
            this.startYear = res.MinYear;
            this.jiezhangYear = res.MaxYear;//结账年
            this.jiezhangMonth = 1;//结账的月份
            this.years = (Number(this.jiezhangYear) - Number(this.startYear)) + 1;
            this.choosedYear = this.jiezhangYear;
            this.choosedYearEnd = this.jiezhangYear;
            this.choosedMonth = this.jiezhangMonth;
            this.choosedMonthEnd = this.jiezhangMonth;
            let data = {
              'choosedYear': this.jiezhangYear,
              'choosedYearEnd': this.jiezhangYear,
              'choosedMonth': this.jiezhangMonth,
              'choosedMonthEnd': this.jiezhangMonth,
              'lastYear': this.jiezhangYear
            }
            console.log(data)
            this.$emit('item-click', data);
            this.$nextTick(this.toTop);
          } else {
            this.getChecked();
          }
        }).catch(err => {
          console.log(err)
        })
    },

    //时间选择
    toTop: function () {
      //当前月在顶部
      if (this.showtype == 'doubleTime' || this.showtype == 'singleTime') {
        let li = document.querySelector('.monthTime li.selectMonth');
        let ul = document.querySelector('.dragscrollMonth');
        if (!ul || !li) return;
        if (this.choosedYear - this.startYear >= 1) { ul.scrollTop = li.offsetTop - 30; }
      } else {
        let li = document.querySelector('.yearTime li.selectMonth');
        let ul = document.querySelector('.dragscrollYear');
        if (!ul || !li) return;
        if (this.choosedYear - this.startYear >= 5) { ul.scrollTop = li.offsetTop; }
      }
    },

  }
}


</script>

<style scoped>
.iconCone {
  border-left: 10px solid red;
  border-bottom: 10px solid white;
}
.selectMonth {
  background: #03a9f4 !important;
  color: #fff !important;
}
.uncatchMont {
  background: #ffffff;
  color: #ccd4dc;
}
.date ul li.uncatchMont:hover {
  background: #ddd;
  color: #fff;
}
.box {
  width: 55px;
  background: #fff;
  position: absolute;
  box-shadow: 0px 1px 10px #d6d6d6;
  top: 10px;
  bottom: 20px;
  right: 10px;
}

.box1 {
  width: 55px;
  position: absolute;
  overflow: hidden;
  top: 0;
  bottom: 20px;
}
.box1 ul {
  width: 100%;
  position: absolute;
  margin-top: 0;
}
#sc ul {
  position: static;
}
.box1 ul li {
  width: 55px;
  height: 900px;
  /* border: #000 1px solid; */
  list-style: none;
  margin-left: -40px;
}
.list {
  width: 100%;
  position: relative;
}
.list div {
  width: 55px;
  height: 796px;
  /* margin-left: -40px; */
  color: #fff;
  text-align: center;
}
.list div ul {
  width: 100%;
}
.list div ul li {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  margin-top: 5px;
  margin-left: 8px;
  border: #c7e8f7 1px solid;
  box-shadow: 0px 2px 2px #dbf4ff;
  text-align: center;
  line-height: 40px;
  color: #45c0f7;
  cursor: pointer;
}
/*.list div ul .Font_color{
        cursor: not-allowed;
    }*/
.list div ul li:hover {
  background: #00b8ee;
  color: #fff;
}
.list div ul .Font_color:hover {
  background: #00b8ee;
  color: #ccc !important;
  border: #ececec 1px solid !important;
  box-shadow: 0px 2px 2px #e0e0e0 !important;
}
.list div ul li.selectMonth {
  background: #00b8ee;
  color: #fff;
}

.Time_name {
  position: absolute;
  top: 30px;
  width: 55px;
  height: 25px;
  background: #fff;
  left: 0;
  text-align: center;
  color: #88b927;
  line-height: 25px;
  z-index: 1;
  box-shadow: 0px 1px 10px 0.1px #d3e9f9;
  font-size: 18px;
}
.name {
  width: 40px !important;
  height: 25px !important;
  text-align: center !important;
  line-height: 25px !important;
  font-size: 15px !important;
  color: #45c0f7 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: 0px 0px 0px #fff !important;
  font-weight: 600;
  margin-left: 5px;
  margin-top: 4px;
}
.Time {
  width: 55px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  background: #00b7ee;
  font-size: 14px;
  cursor: default;
}
.Popup {
  width: auto;
  height: 190px;
  /*background-image: url(../../assets/images/ds.png);
        background-size: 498px 190px;
        background-repeat: no-repeat;*/
  background-color: white;
  box-shadow: 0 0 10px 3px lightblue;
  border-radius: 3px 3px;
  overflow: hidden;
  position: absolute;
  top: 0px;
  left: -440px;
  z-index: 999;
}
@keyframes Popup {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes Popup1 {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.Popup ul {
  width: 83.5%;
  float: left;
  height: 25px;
  margin-left: 14px;
  overflow: hidden;
  position: relative;
  padding: 0;
  top: 10px;
}
.Popup ul li {
  text-align: center;
  line-height: 25px;
  width: 33%;
  height: 25px;
  float: left;
  border-right: #ccc 1px solid;
}
.Content_area {
  width: 218px;
  height: 155px;
  float: left;
  margin-top: -10px;
  display: inline-block;
  float: left;
}
.date ul {
  width: 100%;
  height: 125px;
  overflow: hidden;
  padding: 0;
  left: -14px;
  top: -9px;
}
.date ul li {
  border: none !important;
  width: 21% !important;
  height: 25px !important;
  float: left !important;
  margin-left: 3%;
  margin-top: 6.5%;
  cursor: pointer;
}
.date ul li:hover {
  background: #09f;
  color: #fff;
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
.Current_year * {
  float: left;
  width: 40px;
  height: 100%;
  margin-top: 0;
  text-align: center;
  color: #fff;
  margin-left: 20px;
}
.Current_year i {
  float: left;
  width: 27px;
  margin-top: 10px;
}

.list div ul i {
  display: block;
  width: 3px;
  height: 15px;
  margin-left: 26px;
  background: #45c0f7;
  margin-top: 5px;
}
.colour {
  background: none !important;
}
.Font_color {
  color: #ccc !important;
  border: #ececec 1px solid !important;
  box-shadow: 0px 2px 2px #e0e0e0 !important;
  cursor: pointer;
}
.anniu {
  width: 216px;
  margin-top: 31px;
  height: 25px;
}
.anniu ul {
  width: 100%;
  height: 100%;
  margin-top: -10px;
}
.anniu ul li {
  width: 55px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  color: #fff;
  float: left;
  margin-left: 55px;
  background: #45c0f7;
  border-radius: 3px;
}
.dragscroll {
  position: absolute;
  top: 30px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
