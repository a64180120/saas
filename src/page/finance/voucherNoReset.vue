<template>
  <div class="voucherNoReset"
       style="z-index:999"
       v-show="visible">
    <!--凭证手动重排会计期选择****************************-->
    <div v-if="resetType=='person'"
         class="codeResetContainer">
      <div>
        <p class="flexPublic">
          <span>凭证重排</span>
          <i @click="resetCode(false)"></i>
        </p>
        <div class="yearsContent">
          <p>请选择会计期</p>
          <div class="flexPublic">
            <div>{{year}}</div>
            <div class="flexPublic">
              <img @click="nextYear(false)"
                   src="../../assets/icon/leftArr.svg"
                   alt="">
              <img @click="nextYear(true)"
                   src="../../assets/icon/leftArr.svg"
                   alt="">
            </div>
          </div>
          <ul @click="resetCodeMonth"
              :class="{allActive:allReset}"
              class="year-month">
            <li :class="{active:month==index}"
                v-for="index of 12"
                :key="index">{{index}}月</li>
          </ul>
          <div>
            <div style="text-align:center">

              <span @click="resetType=false"
                    class="btngrey">取消</span>
              <span @click="dragShow"
                    class="btn">确认</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="resetType=='drag'"
         class="NoContainer">
      <!-- <side-time @time-click="getSideDate"></side-time> -->

      <div class="voucherlist">
        <drag @drag-click="closeDrag"
              :list="voucherList"
              :headerText="headerTitle"></drag>
      </div>
      <div style="position:absolute;bottom:55px;right:0;">
        <el-pagination background
                       @size-change="getVoucherList"
                       @current-change="getVoucherList"
                       :current-page.sync="pageindex"
                       :page-sizes="[10,20, 30, 50, 70,100,500]"
                       :page-size.sync="pagesize"
                       layout="sizes, prev, pager, next"
                       :total="total">
        </el-pagination>
      </div>
      <div style="text-align:center;position:absolute;bottom:10px;width:100%;">

        <span @click.stop="resetType='person'"
              class="btngrey">取消</span>
        <span style="margin-left:20px"
              @click.stop="resetFinish(true)"
              class="btn">调整完成</span>
      </div>

    </div>
    <!--凭证自动重排****************************-->
    <div v-if="resetType=='auto'"
         class="codeResetContainer">
      <div>
        <p class="flexPublic">
          <span>凭证重排</span>
          <i @click="resetCode(false)"></i>
        </p>
        <div class="yearsContent">
          <p>请选择会计期</p>
          <div class="flexPublic">
            <div>{{year}}</div>
            <div class="flexPublic">
              <img @click="nextYear(false)"
                   src="../../assets/icon/leftArr.svg"
                   alt="">
              <img @click="nextYear(true)"
                   src="../../assets/icon/leftArr.svg"
                   alt="">
            </div>
          </div>
          <ul @click="resetCodeMonth"
              :class="{allActive:allReset}"
              class="year-month">
            <li :class="{active:month==index}"
                v-for="index of 12"
                :key="index">{{index}}月</li>
          </ul>
          <div>
            <p>
              <label><input type="checkbox"
                       v-model="allReset">对所有会计期进行凭证号重排</label>
            </p>
            <div style="text-align:center">

              <span @click="resetCode(false)"
                    class="btngrey">取消</span>
              <span @click="resetCode(true)"
                    class="btn">确认</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!resetType"
         class="resetType">
      <div class="title">选择重排方式<i @click.stop="chooseType(false)"></i></div>
      <div>
        <label><input name="auto"
                 v-model="autoType"
                 value="auto"
                 type="radio">自动重排凭证号</label>
      </div>
      <div>
        <label><input name="auto"
                 v-model="autoType"
                 value="person"
                 type="radio">手动调整凭证号</label>
      </div>
      <p>
        <span @click.stop="chooseType(false)"
              class="btngrey">取消</span>
        <span @click.stop="chooseType(true)"
              style="margin-left:20px"
              class="btn">确定</span>
      </p>
    </div>
    <message :visible.sync="message.visible"
             :message="message.message"></message>
    <div></div>
  </div>
</template>
<script>

import { mapState, mapActions } from 'vuex'
import sideTime from './sideTime'
import drag from '@/components/drag/index'
export default {
  name: 'dragKanban-demo',
  components: {
    sideTime,
    drag
  },
  data () {
    return {
      voucherList: [],
      headerTitle: '凭证重排',
      pageindex: 1,
      pagesize: 100,
      total: 0,
      checkedTime: '',
      checkedYear: '',
      sideDate: '',
      year: '',
      month: '',
      resetType: false, //显示的类型页面
      autoType: 'auto', //选择的类型
      allReset: false,  //全选月份
      message: {
        message: '',
        visible: false
      }
    }
  },
  props: {
    visible: Boolean
  },
  methods: {
    chooseType (bool) {
      if (bool) {
        this.resetType = this.autoType;
        this.getChecked();
      } else {
        this.$emit('update:visible', false);
      }
    },
    //drag拖拽关闭
    closeDrag () {
      this.resetType = 'person';
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
          if (!res.CheckRes) {
            this.$message({ showClose: true, message: '当前组织未初始化,请开始初始化!', type: "error" });
            var route = this.$route;
            //移除TagNav
            this.$store.commit("tagNav/removeTagNav", route);
            this.$router.push({ path: '/setting/subjectstart' })
            return;
          }
          this.checkedTime = res.Record[0].JAccountPeriod + 1;
          this.checkedYear = res.Record[0].JYear;
          this.sideDate = res.Record[0].JYear + '-' + this.checkedTime;
          this.year = this.sideDate.split('-')[0];
          this.month = this.sideDate.split('-')[1];
          this.checkVal = this.checkedTime;
          this.unCheckVal = this.checkedTime > 1 ? this.checkedTime - 1 : 1;
          //this.getvoucherList('reset');
          this.$emit("time-click", { sideDate: this.sideDate, checkedTime: this.checkedTime, checkedYear: this.checkedYear })
          this.$forceUpdate();
        }, err => {
          console.log(err);

        })
        .catch(err => this.$message({ showClose: true, message: '获取结账期失败!', type: "error" }))
    },
    //凭证重排月份选择******************
    resetCodeMonth ($event) {
      this.month = this.month = parseInt($event.target.innerHTML);
    },

    //凭证号重排确认***************
    resetCode (val) {
      if (val) {
        const loading5 = this.$loading();
        var data = {
          orgid: this.orgid,
          Year: this.sideDate.split('-')[0],
          Pmonth: this.sideDate.split('-')[1]
        }
        var url = '/PVoucherMst/GetRebuilder';
        if (this.allReset) {
          url = 'PVoucherMst/GetRebuilderForAllYear';
          data = {
            orgid: this.orgid,
            Year: this.sideDate.split('-')[0],
            Pmonth: 12
          }
        }
        this.$axios.get(url, { params: data })
          .then(res => {
            if (res.Status == 'error') {
              this.message = {
                message: res.Msg,
                visible: true
              };
            } else if (res.Status == 'success') {
              this.resetType = false;
              this.allReset = false;
              this.$emit('msg-click', '重排成功!');
            }
            loading5.close();
          }, err => {
            console.log(err);
            loading5.close();
          })
          .catch(err => { this.$message({ showClose: true, message: '重排失败了!', type: "error" }); loading5.close(); })
      } else {
        this.resetType = false;
      }
    },
    //显示手动重排凭证页面***
    dragShow () {
      this.resetType = 'drag';
      this.getVoucherList();
    },
    getVoucherList () {
      var year = this.year;
      var month = this.month;
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        pageindex: this.pageindex - 1,
        pagesize: this.pagesize,
        sum1: '',
        sum2: '',
        keyword: '',
        export2excel: '',
        sort: ['PType', 'PNo ASC', 'PDate ASC'],
        // itemValuePhid:649181122000008,
        itemValuePhid: '',
        queryfilter: { "PAccper*str*ge*1": year + (month > 9 ? month : ('0' + month)), "PAccper*str*le*1": year + (month > 9 ? month : ('0' + month)) }
      }
      this.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          if (res.Status == 'success' || res.Status == 'error') {
            this.message = {
              message: res.Msg,
              delay: 4000,
              visible: true
            };
            return;
          } else if (res.Record.length == 0) {
            this.message = {
              message: '未搜索到该月的凭证!',
              delay: 4000,
              visible: true
            }
            this.total = 0;
          } else {
            this.voucherList = res.Record;
            this.total = res.totalRows;
          }
        })
        .catch(err => {
          this.$message({ showClose: true, message: '获取列表失败了!', type: "error" });
        })
    },
    //完成手动重排*****
    resetFinish (bool) {
      if (bool) {
        var phids = [];
        for (var vou of this.voucherList) {
          phids.push(vou.PhId);
        }
        var data = {
          orgid: this.orgid,
          uid: this.uid,
          Year: this.year,
          Month: this.month,
          Phids: phids
        }
        const loading = this.$loading();
        this.$axios.post('/PVoucherMst/PostCustomizeRebuilder', data)
          .then(res => {
            loading.close();
            if (res.Status == 'success') {
              this.resetType = false;
              this.$emit('msg-click', '重排成功!');
            } else {
              this.message = {
                visible: true,
                message: res.Msg
              }
            }

          })
          .catch(err => {
            loading.close();
            this.$message({ showClose: true, message: '手动重排失败了!', type: "error" })
          })
      } else {
        this.resetType = false;
      }

    }
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgcode: state => state.user.orgcode,
      cachePage: state => state.tagNav.cachePage  //是否利用路由缓存
    }),

  },
  watch: {

  }
}
</script>
<style lang="scss">
.voucherNoReset {
  position: -ms-page;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  > .NoContainer {
    width: 90%;
    height: 90%;
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 2px #d3e9f9;
    position: relative;
    text-align: left;
    > .voucherlist {
      // padding:0 50px 0 10px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 50px;
    }
    > .asideNav {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      min-height: 100%;
      > .monthsOver {
        height: 85%;
      }
    }
  }
  > .resetType {
    width: 350px;
    height: 190px;
    mix-height: 190px;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 2px #d3e9f9;
    > div {
      margin-bottom: 20px;
      text-align: left;
      padding-left: 20px;
    }
  }
  > div:last-of-type {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
  }
}

.codeResetContainer {
  width: 100%;
  height: 100%;
  text-align: left;
  > div {
    width: 300px;
    height: 410px;
    margin: 150px auto 0;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 10px 2px #d3e9f9;
    padding: 10px;
    > p:first-of-type {
      height: 35px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding: 5px;
      > i {
        width: 25px;
        height: 25px;
        background: url("../../assets/icon/close.svg");
        background-size: cover;
        cursor: pointer;
      }
    }
    .yearsContent {
      font-size: 15px;
      > p:first-of-type {
        margin: 10px 15px 5px;
        padding: 5px 0;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 1px solid #ccc;
      }
      > div:first-of-type {
        font-size: 18px;
        font-weight: bold;
        padding: 5px 0 0 15px;
        > div:nth-of-type(2) {
          width: 70px;
          margin-right: 20px;
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
          }
        }
      }
      > div:nth-of-type(2) {
        margin: 0 15px;
        > p {
          > label {
            color: #000;
            font-weight: 400;
            font-size: 16px;
            input {
              margin-right: 10px;
            }
          }
          margin-bottom: 20px;
        }
        > div {
          padding: 0 15px;
          > span {
            height: 40px;
            line-height: 40px;
          }
        }
      }
      .year-month {
        > li {
          float: left;
        }
      }
      > ul {
        padding: 5px 20px;
        width: 100%;
        > li {
          width: 60px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          cursor: pointer;
          font-size: 16px;
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
          color: #00b7ee;
          border: 1px solid #00b7ee;
          border-radius: 3px;
          cursor: pointer;
          &:hover {
            color: #fff;
            background: #00b7ee;
          }
        }
      }
      .allActive > li {
        background: #00b7ee;
        color: #fff;
      }
    }
  }
}
.title {
  border-bottom: 1px solid #ccc;
  padding: 8px 3px;
  width: 100%;
  font-size: 14pt;
  font-style: normal;
  font-weight: 700;
  i {
    float: right;
    background: url("../../assets/icon/close.svg");
    background-size: cover;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
