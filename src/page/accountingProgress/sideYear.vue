<template>
  <!--17-->
  <div class="asideNav">
    <!--右侧时间选择组件-->
    <div @click.stop="yearSelShow">
      <div><span>{{title}}</span></div>
      <!-- <div style="height:50%;font-size:14px"><span>选择</span></div> -->
    </div>
    <p>{{year}}</p>
    <div class="monthsOver">
      <div class="monthsContainer">
        <ul style="top:0"
            @mouseleave.stop="dragLeave"
            @mousemove.stop="dragMove"
            @mouseup.stop="dragDown(false)"
            @mousedown.prevent.stop="dragDown(true,$event)"
            id="scrollMonth"
            class="months">
          <li @click.stop="selectYear(parseFloat(startYear)+item-1)"
              :class="{active:year==parseFloat(startYear)+item-1}"
              v-for="item of nowYear-startYear+2"
              :key="item">

            {{parseFloat(startYear)+item-1}}
            <!-- <ul>
              <li>{{parseInt(startYear)+parseInt(item)-1}}</li>
              <li :class="{active:sideDate.split('-')[0]==i,unchecked:(i>checkedTime)&&((parseInt(startYear)+parseInt(item)-1)>=checkedYear)||((parseInt(startYear)+parseInt(item)-1)>checkedYear),futureM:((parseInt(startYear)+parseInt(item)-1)>=nowYear)&&(i>(nowTime.getMonth()+1))}"
                  @click="sideMonth(i,parseInt(startYear)+parseInt(item)-1)"
                  v-for="i of 12"
                  :key="i">{{i}}</li>
            </ul> -->
          </li>
        </ul>
      </div>
    </div>
    <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
    <message :message="saasMessage.message"
             :delay="saasMessage.delay"
             :visible.sync="saasMessage.visible"></message>

  </div>

</template>

<script>

import { GetminiYearByOrgId } from '@/api/accountProgress'
import userInfo from '@/util/auth'
import { mapState, mapActions } from 'vuex'
export default {
  activated () {
    this.getChecked();
    // this.startYear='2018';
    // this.startYear = this.jbuildDate.slice(0, 4);
    //  if (window.addEventListener){
    //         //var month= document.getElementById('scrollMonth');
    //         window.addEventListener('DOMMouseScroll',this.wheel,false);
    //         window.onmousewheel=document.onmousewheel=this.wheel;
    //     }


  },
  props: {
    title: {
      type: String,
      default: '会计期'
    },
    timeType: {
      type: String,
      default () {
        return '';
      }
    }
  },
  data () {
    return {
      sideDate: '',//时间选择器值
      year: '',
      month: '',
      startYear: '2018',
      checkedTime: '',
      checkedYear: '',
      nowTime: new Date,
      nowYear: (new Date).getFullYear(),
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
    selectYear (data) {
      this.year = data;
      this.$emit('year-click', data);
    },
    //获取当前结账的最新月份************
    getChecked () {
      var data = {
        uid: this.uid,
        OrgId: this.orgid,

      }
      // debugger
      // this.$axios.get('PSubjectBudget/GetMaxBudgetYear', { params: data })
      //   .then(res => {
      //     console.log(res);
      // return;
      this.$axios.get('/PBusinessConfig/GetPBusinessConfigList', { params: data })
      GetminiYearByOrgId(data)
        .then(res => {

          if (res.Status == 'success') {
            this.year = this.startYear = res.Msg;
            this.selectYear(this.year)
            this.$forceUpdate();
            this.$nextTick(function () {  //当前年在顶部
              var li = document.querySelector('#scrollMonth>li.active');
              var ul = document.querySelector('#scrollMonth');
              ul.scrollTop = li.offsetTop;
            })
          } else {
            this.$msgBox.error(res.Msg)
          }

        })
        .catch(err => this.$message({ showClose: true, message: err, type: "error" }))
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

}
</script>

<style lang="scss" scoped>
.asideNav {
  width: 55px;
  position: relative;
  height: 100%;
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
        &:nth-of-type(2):after,
        &:nth-of-type(1):after {
          background: none;
        }
        // &:after {
        //   content: "";
        //   position: absolute;
        //   width: 3px;
        //   height: 15px;
        //   background: #02a7e7;
        //   left: 45%;
        //   top: -20px;
        // }
        &:first-of-type {
          margin-top: 15px;
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
        margin-top: 15px;
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
}
</style>
