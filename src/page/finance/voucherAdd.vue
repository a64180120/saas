<template>
  <!--17-->
  <div class="addVoucher">

    <!--凭证组件*******************-->
    <div style="overflow-y:auto;overflow-x:hidden;width:100%;height:100%;padding-bottom:40px"
         :class="{voucherMask:voucherMask}"
         ref="print">
      <div class="voucherContainer"
           :class="{subaddcss:subaddcss}">
        <p v-if="voucherMask"
           class="title">
          <span v-if="voucherMask=='copy'">复制凭证</span>
          <span v-if="voucherMask=='cut'">剪切凭证</span>
          <span v-if="voucherMask=='chongh'">冲红凭证</span>
          <span v-if="voucherMask=='gengz'">更正凭证</span>
          <span v-if="voucherMask=='update'">修改凭证</span>
          <i @click="keepChoose(false)"></i>
        </p>
        <div style="height:40px;"
             v-if="voucherMask">

          <span style="float:right"
                class="btn"
                @click.stop="keepChoose(voucherMask)">保存</span>
          <span style="float:right"
                class="btngrey"
                @click.stop="keepChoose(false)">取消</span>
        </div>
        <div v-show="(!voucherMask)&&voucherDataList.bool"
             class="voucherBG"><img src="../../assets/images/d.png"> </div>
        <div class="voucherDisabledCon"
             :class="{subaddcss:subaddcss,addZindex:addZindexCss}">
          <div :class="{voucherDisabled:voucherAdd}"></div>
          <voucher @subAddClick="subAddClick"
                   @addZindex="addZindex"
                   @getBalance="voucherBalance"
                   :balanceBool="getBalanceBool"
                   :vouSubjectlist="vouSubjectlist"
                   :disabled2="voucherCut"
                   :disabled="voucherAdd"
                   :AbstractList="AbstractList"
                   :sideDate='sideDate'
                   :dataList="voucherDataList"
                   v-if="voucherDataList.bool"
                   @Msg-click="voucherMsg"
                   ref="voucher">

          </voucher>
        </div>

      </div>
      <div></div>
    </div>
    <!-- 按钮 -->
    <div class="unionState flexPublic">
      <div class="searcherCon">
        <div class="searcherValue"
             style="width:180px;border-radius: 4px 0 0 4px;"><input @keyup.13.stop="getvoucherList('searcher')"
                 type="text"
                 v-model="superSearchVal.keyword"
                 placeholder="科目/摘要/凭证号"></div>
        <div @click.stop="getvoucherList('searcher')"
             class="searcherBtn btn">凭证定位</div>
        <ul class="fastGps">
          <li :class="{btnDisabled:newAddList.length<=1||count=='0'}"
              class="btn"
              @click.stop="getvoucher('pre')"></li>
          <li :class="{btnDisabled:newAddList.length<=1||count==newAddList.length-1}"
              class="btn"
              @click.stop="getvoucher('next')"></li>
          <li style="border-radius:3px"
              class="btn"
              v-if="Roleauthorize.voucherEntry_moreVoucher!=0"
              @click.prevent.stop="addVoucher('moreVoucher')">凭证查询</li>
          <li style="border-radius:3px;width:70px"
              class="btn"
              @click.stop="nextMonthShow"
              v-if="!voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_account!=0">做下月账</li>
        </ul>
      </div>
      <ul class="handle">
        <li @click.stop="addVoucher('fresh')"
            style='float:right;margin:0 0 0 10px;cursor:pointer;font-size:27px;width:30px !important;background:none;color:#00b7ee;border:0'
            class="el-icon-refresh"></li>
        <a style="position:relative;display:block;width:80px;height:30px;margin-left:10px">
          <li class="more"
              style="width:80px">
            <ul>
              <li>更多</li>
              <li v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_next!=0"
                  @click.prevent.stop="addVoucher('copy')">复制</li>
              <li v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_cut!=0"
                  @click.prevent.stop="addVoucher('cut')">剪切</li>
              <li v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_red!=0"
                  @click.prevent.stop="addVoucher('chongh')">冲红</li>
              <li v-if="Roleauthorize.voucherEntry_rearrange!=0"
                  @click.prevent.stop="addVoucher('reset')">凭证号重排</li>
              <li v-if="Roleauthorize.voucherEntry_account!=0"
                  @click="checkDate='check'">
                结账</li>
              <li v-if="Roleauthorize.voucherEntry_noAccount!=0"
                  @click="checkDate='uncheck'">反结账

              </li>
            </ul>
          </li>
        </a>
        <!-- <a @click.prevent="addVoucher('print')"><li style="width:80px">保存并打印</li></a>  -->
        <a v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_delete!=0"
           @click.prevent.stop="addVoucher('delete')">
          <li style="width:70px;">删除</li>
        </a>
        <a v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_audit!=0"
           @click.prevent.stop="addVoucher('unAudit')">
          <li style="width:70px;">反审核</li>
        </a>
        <a v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_review!=0"
           @click.prevent.stop="addVoucher('audit')">
          <li style="width:70px;">审核</li>
        </a>
        <!-- <a v-if="!voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('keepAdd')"><li style="width:80px">保存并新增</li></a> -->
        <a v-if="Roleauthorize.voucherEntry_bTemplate!=0"
           @click.prevent.stop="addVoucher('keepModel')">
          <li style="width:70px;">存为模板</li>
        </a>
        <a v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_edit!=0"
           @click.prevent.stop="addVoucher('update')">
          <li style="width:70px;">修改</li>
        </a>
        <a v-if="!voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_save!=0"
           @click.prevent.stop="addVoucher('keep')">
          <li style="width:70px;">保存</li>
        </a>
        <a v-if="!voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_next!=0"
           @click.prevent.stop="addVoucher('keepNext')">
          <li style="width:70px">录下一张</li>
        </a>
        <!-- <a style="width:80px;">
                    <li class="mode" style="width:70px;">
                        <div >模板</div>
                        <div @click.prevent.stop="addVoucher('modelList')" >普通类</div>
                        <div @click.prevent.stop="addVoucher('jieModel')" >结转类</div>
                        <div @click.prevent.stop="addVoucher('keepModel')">存为模板</div>
                    </li>
                </a> -->
        <!-- <a @click.prevent.stop="addVoucher('fresh')"><li style="padding:0 5px;width:70px">录下一张</li></a>                   -->
      </ul>
    </div>
    <!--右侧时间选择组件-->
    <div class="asideNav"
         :class="{sideNavCss:yearSelCss}">
      <div @click.stop="yearSelShow">
        <div><span>会计期</span></div>
        <div><span>选择</span></div>
      </div>
      <p>{{sideDate.split('-')[0]}}</p>
      <div style="overflow:hidden;position:absolute;bottom:0;top:65px;width:55px">
        <div class="monthsContainer">
          <ul style="top:0"
              @mouseleave.stop="dragLeave"
              @mousemove.stop="dragMove"
              @mouseup.stop="dragDown(false,$event)"
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
      <div v-show="yearSelCss"
           class="yearsContainer">
        <div class="yearsTitle">
          <span @click="checkOutSel('kuaiji')"
                :class="{active:monthsSelCss=='kuaiji'}">会计期</span>
          <!-- <span v-if="Roleauthorize.voucherEntry_account!=0"
                @click="checkOutSel('jiezhang')"
                :class="{active:monthsSelCss=='jiezhang'}">结账</span>
          <span v-if="Roleauthorize.voucherEntry_noAccount!=0"
                @click="checkOutSel('fanjiezhang')"
                :class="{active:monthsSelCss=='fanjiezhang'}">反结账</span> -->

        </div>
        <div v-show="monthsSelCss=='kuaiji'"
             class="yearsContent">
          <div class="flexPublic">
            <div>{{year}}</div>
            <div class="flexPublic">
              <img @click="nextYear(true)"
                   src="../../assets/icon/leftArr.svg"
                   alt="">
              <img @click="nextYear(false)"
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
        <!-- <div v-if="Roleauthorize.voucherEntry_account!=0"
             v-show="monthsSelCss=='jiezhang'"
             class="yearsContent jiezhang">
          <div>
            <span>结账至</span>
            <i @click="nextMonth('pre',checkVal,'checkVal')"></i>
            <div class="inputContainer"><input v-model="checkVal"
                     type="text"></div>
            <i @click="nextMonth('next',checkVal,'checkVal')"></i>
            <span>月</span>
          </div>
          <p>
            <span class="btngrey"
                  @click="yearsTrue(false)">取消</span>
            <span class="btn"
                  @click="yearsTrue('check',checkVal)">确认</span>
          </p>
        </div>
        <div v-if="Roleauthorize.voucherEntry_noAccount!=0"
             v-show="monthsSelCss=='fanjiezhang'"
             class="yearsContent jiezhang">
          <div class="fanjiezhang">
            <div>反结账至</div>
            <div class="checkYear">
              <i @click.stop="checkYear(false)"
                 class="el-icon-minus"
                 :class="{disabled:unCheckYear==jbuildDate.slice(0,4)}"></i>
              <span>{{unCheckYear}}</span>
              <i @click.stop="checkYear(true)"
                 class="el-icon-plus"
                 :class="{disabled:unCheckYear==checkedYear}"></i>
            </div>
            <i @click="nextMonth('pre',unCheckVal,'unCheckVal')"></i>
            <div class="inputContainer"><input v-model="unCheckVal"
                     type="text"></div>
            <i @click="nextMonth('next',unCheckVal,'unCheckVal')"></i>
            <span>月</span>
          </div>
          <p>
            <span class="btngrey"
                  @click="yearsTrue(false)">取消</span>
            <span class="btn"
                  @click="yearsTrue('uncheck',unCheckVal,unCheckYear)">确认</span>
          </p>
        </div> -->

      </div>
    </div>
    <!--凭证手动重排****************************-->
    <num-reset :visible.sync="resetShow"
               @msg-click="numResetMsg"></num-reset>

    <!-- 凭证模板****************** -->
    <voucher-temp v-if="modelListCss"
                  :temptype="temptype"
                  @temp-click="tempClick"></voucher-temp>
    <!-- 下月账******************* -->
    <next-month :checkVal="checkVal.toString()"
                v-if="nextMonthCss"
                @child-click="nextMonthHandle"></next-month>
    <!-- <div class="footInfo " >
            <router-link to="">服务协议</router-link>
            <router-link to="">运营规范</router-link>
            <router-link to="">关于政云</router-link>
        </div> -->
    <!-- 存为模板******************** -->
    <div v-if="temp.tempMask"
         class="tempMask">
      <div>
        <p class="title">
          <span>存为模板</span><i @click="tempMaskShow(false)"></i></p>
        <ul>
          <li class="flexPublic">
            <div>模板名称</div>
            <div class="inputContainer"><input maxlength="150"
                     placeholder="必填"
                     type="text"
                     v-model="temp.TemName"></div>
          </li>
          <li class="flexPublic">
            <div>备注</div>
            <div class="inputContainer"><input maxlength="150"
                     placeholder="必填"
                     type="text"
                     v-model="temp.RMark"></div>
          </li>
          <li style="margin-bottom: 30px;"
              class="flexPublic">
            <div>模板类型</div>
            <div style="width:100%;"
                 class="selectContainer">
              <select v-model="temp.tempDescription">
                <option value="0">通用类</option>
                <option value="1">收入类</option>
                <option value="2">支出类</option>
              </select>
            </div>
          </li>
          <li class="flexPublic">
            <div>保存金额</div>
            <div><label> <input type="radio"
                       name="tempM"
                       v-model="temp.TemMoney"
                       value='1'> 是 </label><label> <input type="radio"
                       name="tempM"
                       v-model="temp.TemMoney"
                       value='0'> 否</label></div>
          </li>
        </ul>
        <div class="flexPublic">
          <span class="btn"
                @click="tempMaskShow(false)">取消</span><span class="btn"
                @click="tempMaskShow(true)">保存</span>
        </div>
      </div>
    </div>
    <!-- 结账 -->
    <quick-check :visible.sync="checkDate"
                 @finish-check="finishUncheck"
                 @child-click="nextMonthHandle"
                 :title="checkDate" />
    <!-- 弹窗*****message:信息******delay:延迟毫秒  默认4000 -->
    <message :message="saasMessage.message"
             :delay="saasMessage.delay"
             :visible.sync="saasMessage.visible">
    </message>
    <!-- confirm -->
    <saasconfirm :type="confirm.type"
                 :message="confirm.message"
                 :data="confirm.data"
                 v-show="confirm.visible"
                 :btn1="confirm.btn1"
                 :btn2="confirm.btn2"
                 @ok-click="confirmOk"
                 @no-click="confirmNo">
    </saasconfirm>
    <!-- <p v-if="voucherDataList.data.Mst.PhId&&Roleauthorize.voucherEntry_vTemplate!=0" -->
    <p @click.prevent.stop="addVoucher('modelList')"
       style="z-index:99"
       class="modelBtn">
      <img src="@/assets/images/model.png">
    </p>
  </div>
</template>

<script>
import quickCheck from './quicklyCheck'
import numReset from './voucherNoReset'
import userInfo from '@/util/auth'
import nextMonth from './nextMonthCheck'
import voucher from './voucher'
import { mapState, mapActions } from 'vuex'
import voucherTemp from './vouchertemp'
//import { getLodop } from '@/plugins/Lodop/LodopFuncs';
export default {
  name: 'voucherAdd',
  data () {    return {
      checkedDate: { checkedTime: '', checkedYear: '' },//给子代传值
      checkDate: '',
      active: false,//执行activated钩子
      getBalanceBool: false,//凭证中科目拉取科目余额*****模板*******
      val1: '',
      sideDate: '',
      year: '',
      month: '',
      searchVal: '',
      AbstractList: [],//摘要模板
      temp: {
        RMark: '',//备注
        TemName: '',//名称
        TemMoney: 0,
        tempMask: false,
        tempDescription: 0
      },
      getListParams: false,//获取列表传值
      temptype: '',//模板类型
      superSearchVal: {//高级搜索参数******************
        assistItemList: { type: '', list: '' },
        assistItem: '',
        sum1: '',
        sum2: '',
        date1: '',
        date2: '',
        keyword: '',
        placeholder: '选择辅助项',
        nodatatext: '',
        show: true
      },
      userState: 0,
      checkVal: '',
      unCheckVal: '',
      unCheckYear: '2018',//反结账年份
      checkedTime: '1',//下一个结账月*******
      checkedYear: '2018',//已经结账的年份
      startYear: '2018',//建账日期
      pagesize: 100,
      pageindex: 0,
      ascOrDesc: 'ASC',
      totalRows: '',
      voucherDataList: { bool: false, data: { Mst: '', Attachements: [] } },//凭证数据***
      oldVoucherData: '',   //凭证传参时的中间值JSON
      newAddList: [],
      yearSelCss: false,
      nowTime: new Date,
      nowYear: (new Date).getFullYear(),
      monthsSelCss: 'kuaiji',
      mouseDown: false,
      mouseStartY: '',
      count: 0,
      modelListCss: false,
      nextMonthCss: false,
      allReset: '',
      resetShow: false,
      voucherMask: false,  //凭证状态遮罩层******************
      voucherAdd: false, //凭证不能修改的遮罩层******************
      voucherCut: true,//凭证剪切日期选择器禁用***
      saasMessage: {
        visible: false,  //消息弹出框*******
        message: '', //消息主体内容**************
        delay: 0
      },
      confirm: {
        message: '',
        visible: false,
        type: '',
      },
      uInfo: '',

      vouSubjectlist: [],//传递给组件的科目
      subaddcss: false, //凭证新增科目全屏去position
      addZindexCss: false   //增加层级
    }  },
  // created(){
  //     if(this.$route.query.list){
  //         this.voucherDataList.data.Mst=this.$route.query.list,
  //         this.resetVoucher();
  //         this.voucherAdd=true;
  //     }else if(this.$route.query.reset=='reset'){
  //         this.getChecked();
  //     }
  // },
  provide () {
    return { 'checkedDate': this.checkedDate }
  },
  activated () {
    if (!this.active || this.voucherDataList.data.Mst.PType == '结') {  //mounted执行了就不执行activated
      return;
    }
    if (this.jbuildDate) {
      this.startYear = this.jbuildDate.slice(0, 4);
    } else {
      this.startYear = this.jbuildDate = new Date().getFullYear();
    }

    if (this.$route.params.list) {
      this.voucherDataList.data.Mst = this.$route.params.list;
      this.newAddList = this.$route.params.voucherList;
      this.count = this.$route.params.index;
      this.resetVoucher();
      this.voucherAdd = true;
    }
    if (this.$route.params.reset) {
      this.addVoucher('fresh');
    }
    this.getChecked();
    this.getAbstract();
    // else if(this.$route.params.reset=='reset'){
    //     this.addVoucher('fresh');
    //     // this.getChecked();
    //     // this.uInfo= userInfo.getUserInfoData().userInfo;
    //     // this.startYear=userInfo.getUserInfoData().orgInfo.StartYear;
    // }

  },
  mounted () {
    this.uInfo = userInfo.getUserInfoData().userInfo;
    if (!this.active) {
      if (this.jbuildDate) {
        this.startYear = this.jbuildDate.slice(0, 4);
      } else {
        this.startYear = this.jbuildDate = new Date().getFullYear();
      }

      if (this.$route.params.list) {
        this.voucherDataList.data.Mst = this.$route.params.list;
        this.newAddList = this.$route.params.voucherList;
        this.count = this.$route.params.index;
        this.resetVoucher();
        this.voucherAdd = true;
      }
      if (this.$route.params.reset) {
        this.addVoucher('fresh');
      }
      this.getChecked();
      this.getAbstract();
      this.active = true;
    }
    //this.moveNavTop();
  },
  methods: {
    //操作列表按钮********
    addVoucher (str) {
      var Mst;
      switch (str) {
        case 'update':
          this.voucherData();
          var item = this.voucherDataList.data.Mst;
          if (!(item.PMonth >= this.checkedTime && item.Uyear == this.checkedYear || item.Uyear > this.checkedYear)) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该月已结账,无法修改!'
            }
            return;
          }
          if (this.voucherDataList.data.Mst.Verify) {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: '该凭证已审核,无法修改!'
            }
            return;
          }
          this.getBalanceBool = true;
          this.resetVoucher();
          this.oldVoucherData = JSON.stringify(this.voucherDataList.data);
          this.voucherMaskShow('update');
          this.voucherAdd = false;
          break;
        case 'keep':
          this.voucherData();
          this.balanceType('Add');
          // this.keepVoucher('Add');
          break;
        // case 'keepAdd':
        //     this.voucherData();
        //     this.keepVoucher('keepAdd');
        //     this.resetVoucher();
        //     break;
        case 'keepNext':
          this.voucherData();
          var mst = this.voucherDataList.data.Mst;
          if (mst.PhId) {
            this.addVoucher('fresh');
          } else {
            var hasInfo = false;
            for (var dtl of mst.Dtls) {
              if (dtl.Abstract || dtl.SubjectCode || dtl.JSum || dtl.DSum) {
                hasInfo = true
              }
            }
            if (hasInfo) {
              this.balanceType('keepAdd');
              // this.confirm = {
              //   message: '是否需要保存当前凭证!',
              //   btn1: '是',
              //   btn2: '否',
              //   type: 'keepNext',
              //   visible: true
              // }
            } else {
              this.addVoucher('fresh');
            }
          }
          break;
        case 'modelList':
          this.temptype = 'normal';
          this.modelListCss = true;
          break;
        case 'keepModel':
          this.temp.tempMask = true;
          this.temp.TemName = '';
          this.temp.RMark = '';
          this.temp.tempDescription = 0;
          break;
        case 'moreVoucher':

          this.$router.push({ name: 'voucherList', params: { reset: 'reset' } })

          break;
        case 'audit'://审核
          this.voucherData();

          var item = this.voucherDataList.data.Mst;
          if (!(item.PMonth >= this.checkedTime && item.Uyear == this.checkedYear || item.Uyear > this.checkedYear)) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该月已结账,无法修改!'
            }
            return;
          }
          if (this.voucherDataList.data.Mst.Verify) {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: '该凭证已审核!'
            }
            return;
          }
          this.audit(true, this.voucherDataList.data.Mst.PhId);
          break;
        case 'unAudit':
          this.voucherData();
          var item = this.voucherDataList.data.Mst;
          if (!(item.PMonth >= this.checkedTime && item.Uyear == this.checkedYear || item.Uyear > this.checkedYear)) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该月已结账,无法修改!'
            }
            return;
          }
          if (!this.voucherDataList.data.Mst.Verify) {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: '该凭证还未审核!'
            }
            return;
          }
          this.audit(false, this.voucherDataList.data.Mst.PhId);
          break;
        case 'copy'://复制
          this.oldVoucherData = JSON.stringify(this.voucherDataList.data);
          this.voucherDataList.data.Mst.PMakePerson = '';
          //this.voucherDataList.data.Mst.PFinancePerson='';
          this.voucherDataList.data.Mst.PKeepingPerson = '';
          //this.voucherDataList.data.Mst.PCashier='';
          this.voucherDataList.data.Mst.PAuditorName = '';
          this.voucherDataList.data.Mst.PNo = '';
          this.voucherDataList.data.Mst.Verify = '';
          this.getBalanceBool = true;
          this.voucherMaskShow('copy');
          this.resetVoucher();
          this.voucherAdd = false;
          break;
        case 'cut':  //剪切
          var item = this.voucherDataList.data.Mst;
          if (!(item.PMonth >= this.checkedTime && item.Uyear == this.checkedYear || item.Uyear > this.checkedYear)) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该月已结账,无法修改!'
            }
            return;
          }
          this.oldVoucherData = JSON.stringify(this.voucherDataList.data);
          this.voucherMaskShow('cut');
          this.voucherCut = false;
          break;
        case 'chongh':   //冲红
          var item = this.voucherDataList.data.Mst;
          // if(!(item.PMonth>=this.checkedTime&&item.Uyear>=this.checkedYear)){
          //     this.saasMessage={
          //         visible:true,
          //         delay:3000,
          //         message:'该月已结账,无法修改!'
          //     }
          //     return;
          // }
          this.oldVoucherData = JSON.stringify(this.voucherDataList.data);
          if (this.voucherDataList.data.Mst.WriteOff_PhIds && this.voucherDataList.data.Mst.WriteOff_PhIds.length > 0) {
            this.saasMessage = {
              message: '该凭证已经冲红,无法冲红!',
              delay: 4000,
              visible: true
            }
            return;
            // if(confirm("该凭证已经冲红,需要重新冲红吗?")){
            //     return;
            // }else{
            //     this.voucherMaskShow(false);
            //     return;
            // }
          }
          if (!this.voucherDataList.data.Mst.Verify) {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: '该凭证未审核,不支持冲红操作!'
            }
            return;
          }
          this.voucherDataList.data.Mst.Verify = 0;
          this.voucherMaskShow('chongh');
          this.voucherAdd = true;
          this.chongh();

          break;
        case 'delete':  //删除
          this.voucherData();
          var item = this.voucherDataList.data.Mst;
          if (!(item.PMonth >= this.checkedTime && item.Uyear == this.checkedYear || item.Uyear > this.checkedYear)) {
            this.saasMessage = {
              visible: true,
              message: '该月已结账,无法修改!'
            }
            return;
          }
          if (this.voucherDataList.data.Mst.Verify) {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: '该凭证已审核,无法删除!'
            }
            return;
          }

          if (this.voucherDataList.data.Mst.Dtls.length <= 0) {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: '请输入内容!'
            }
            return;
          }
          this.confirm = {
            message: '此操作将永久删除凭证,是否继续?',
            type: 'delete',
            visible: true
          }
          // if(confirm('确定删除记录!')){
          //     var data1={
          //         uid:this.uid,
          //         orgid:this.orgid,
          //         id:this.voucherDataList.data.Mst.PhId
          //     }
          //     this.delete(data1);
          //     this.voucherDataList.data={
          //         Mst:{},
          //         Attachements:[]
          //     }
          //     this.resetVoucher();
          //  }

          break;

        // case 'print':
        //     // this.voucherData();
        //     // this.balanceType();
        //     // this.keepVoucher('print');
        //     break;
        case 'fresh':   //刷新
          this.newAddList = [];
          this.voucherDataList.data = {
            Mst: '',
            Attachements: []
          }
          this.superSearchVal.keyword = '';
          this.getSubject();
          this.resetVoucher();
          //this.getChecked();
          this.voucherAdd = false;

          break;
        case 'reset':
          this.resetShow = true;
          break;

      }
    },
    //confirm确认框方法*******
    confirmOk (type, data) {
      this.confirm.visible = false;
      switch (type) {
        case 'delete':
          var data1 = {
            uid: this.uid,
            orgid: this.orgid,
            id: this.voucherDataList.data.Mst.PhId
          }
          this.delete(data1);
          break;

        case 'gengz':
          var vm = this;
          vm.voucherAdd = false;
          vm.voucherDataList.data.Mst.PDate = '';
          vm.voucherDataList.data.Mst.PSource = '更正';
          for (var dtl of vm.voucherDataList.data.Mst.Dtls) {
            if (dtl.Abstract) {
              dtl.Abstract = dtl.Abstract.replace("注销", '更正错账');
              dtl.JSum = dtl.JSum ? dtl.JSum * -1 : '';
              dtl.DSum = dtl.DSum ? dtl.DSum * -1 : '';
              if (dtl.DtlAccounts) {
                dtl.DtlAccounts[0].JSum = dtl.DtlAccounts[0].JSum ? dtl.DtlAccounts[0].JSum * -1 : '';
                dtl.DtlAccounts[0].DSum = dtl.DtlAccounts[0].DSum ? dtl.DtlAccounts[0].DSum * -1 : '';
              }
            }
          }

          vm.voucherMask = 'gengz';
          this.resetVoucher();
          break;
        // case 'keepNext':
        //   this.balanceType('keepAdd');
        //   //this.keepVoucher();
        //   break;
        case 'balance':
          this.keepVoucher(data);
          break;

      }
    },
    confirmNo (type) {
      this.confirm.visible = false;
      switch (type) {
        case 'gengz':
          this.getvoucherList('add');
          break;
        case 'keepNext':
          this.addVoucher('fresh');
          break;
        case 'balance':
          return false;

      }

    },
    // //导航栏位置上移************
    // moveNavTop(){
    //    var footer= document.getElementsByClassName("sys-footer")[0];
    //   var  navtitle= document.getElementsByClassName("navtitle")[0];
    //    console.log(footer,navtitle);
    //    footer.style.bottom="65px";
    //    navtitle.style.bottom="65px";
    // },
    //接收voucher信息***
    voucherMsg (data) {
      this.saasMessage = {
        visible: true,
        message: data
      }
    },
    //保存凭证*******************
    keepVoucher (str) {
      var url = 'Add';
      var Vdata = this.voucherDataList.data;
      //判断科目金额摘要不能为空
      for (var dtl of Vdata.Mst.Dtls) {
        if (!(dtl.SubjectCode && dtl.Abstract && (dtl.JSum || dtl.DSum))) {
          this.saasMessage = {
            message: '科目/金额/摘要不能为空!',
            visible: true,
            delay: 4000
          }
          if (str == 'update') {
            this.voucherData();
            this.voucherMask = true;
          }

          return;
        }
      }
      var dCheck = this.dataCheck();
      if (dCheck == '2' || dCheck == '0' || dCheck == '3') {
        this.saasMessage = {
          visible: true,
          delay: 4000,
          message: dCheck == '2' ? '借贷不平衡,请查看!' : '请录入凭证内容!'
        }
        if (str == 'update') {
          this.voucherDataList.data = JSON.parse(this.oldVoucherData);
          this.voucherMask = true;
        }
        //this.getvoucherList('update');
        return;
      }

      if (str == 'gengz') {
        this.clearPhId(Vdata.Mst);
        // Vdata.Mst.Dtls=Vdata.Mst.Dtls.splice(0,Vdata.Mst.Dtls.length/2);
      }
      if (Vdata.Mst.PDate) {
        if (typeof (Vdata.Mst.PDate) == 'object') {
          Vdata.Mst.Uyear = Vdata.Mst.PDate.getFullYear();
          Vdata.Mst.PMonth = Vdata.Mst.PDate.getMonth() + 1;
          var date = Vdata.Mst.PDate.getDate();
          Vdata.Mst.PDate = (Vdata.Mst.Uyear + '-') + (Vdata.Mst.PMonth < 10 ? ('0' + Vdata.Mst.PMonth) : Vdata.Mst.PMonth) + '-' + ((date) < 10 ? ('0' + date) : date);
        } else {
          Vdata.Mst.PDate = Vdata.Mst.PDate.substring(0, 10);
          Vdata.Mst.Uyear = Vdata.Mst.PDate.substring(0, 4);
          Vdata.Mst.PMonth = Vdata.Mst.PDate.substring(5, 7);
        }
      } else {
        this.message = {
          message: '请输入凭证会计期!',
          visible: true
        }
        return;
      }
      //判断是否在结账月,不是要提示
      if ((Vdata.Mst.Uyear == this.checkedYear) && (Vdata.Mst.PMonth > this.checkedTime) || Vdata.Mst.Uyear > this.checkedYear) {
        let vm = this;
        const h = vm.$createElement;
        vm.$msgbox({
          customClass: 'confirmCon',
          title: '提示',
          type: 'success',
          iconClass: 'confirmImg',
          message: h('div', { style: "width:331px;height:65px;font-size:15px;transform: translateY(10px);    margin-left: 25px; text-indent:28px", }, [
            h('span', null, '上月账期未月结,是否继续本次操作?'),

          ]),
          // message: h('div', { style: 'width:386px;height:120px', class: 'confirm' }, [
          //   h('div', { style: "width:55px;height:55px;float:left;    margin: 35px 5px 0 -5px;", class: 'confirmImg' }, ),
          //   h('div', { style: "width:331px;font-size:15px;float:left;    margin-top: 40px; text-indent:28px", }, [
          //     h('span', null, '为保证备份数据的完整性,'),
          //     h('span', { style: 'color:red' }, '请确保账套里其他用户已经退出系统'),
          //     h('span', null, ',确定执行备份?')
          //   ])

          // ]),
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              console.log('备份')
              done();
            } else {
              done();
            }
          }
        }).then(() => {

          if ((Vdata.Mst.Uyear == this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime - 1) || Vdata.Mst.Uyear > this.checkedYear) {
            var data = {
              uid: this.uid,
              orgid: this.orgid,
              orgcode: this.orgcode,
              infoData: this.voucherDataList.data
            }
            if (this.voucherDataList.data.Mst.PhId) {
              url = 'Update';
            }
            data.infoData.Mst.PFinancePerson = this.curOrg.Treasurer;
            data.infoData.Mst.PCashier = this.curOrg.Cashier;
            const loading1 = this.$loading();
            this.$axios.post('/PVoucherMst/Post' + url, data)
              .then(res => {
                loading1.close();
                if (res.Status == 'success') {
                  this.voucherMask = false;
                  this.voucherAdd = true;
                  if (url == 'Add') {
                    this.ascOrDesc = 'DESC';

                  }

                  this.saasMessage = {
                    visible: true,
                    delay: 4000,
                    message: res.Msg
                  };

                  if (str == 'keepAdd') {
                    this.addVoucher('fresh');
                    return;
                  }
                  if (str == 'print') {
                    this.printContent();
                  }

                  this.getvoucherList(str, this.voucherDataList.data.Mst.PType);

                } else {
                  this.saasMessage = {
                    visible: true,
                    delay: 4000,
                    message: res.Msg
                  }
                }

              },
                err => {
                  console.log(err);
                  loading1.close();
                }
              )
              .catch(err => {
                loading1.close();
                this.$message({ showClose: true, message: '保存出错了!', type: "error" });

              })
          } else if (url == 'update') {
            this.$msgBox.show('当前月份已结账,无法修改凭证!')
          } else {
            this.$msgBox.show('当前月份已结账,无法新增凭证!')
          }
        }).catch(err => {
          console.log(err)
        });
      } else {

        if ((Vdata.Mst.Uyear == this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime - 1) || Vdata.Mst.Uyear > this.checkedYear) {
          var data = {
            uid: this.uid,
            orgid: this.orgid,
            orgcode: this.orgcode,
            infoData: this.voucherDataList.data
          }
          if (this.voucherDataList.data.Mst.PhId) {
            url = 'Update';
          }
          data.infoData.Mst.PFinancePerson = this.curOrg.Treasurer;
          data.infoData.Mst.PCashier = this.curOrg.Cashier;
          const loading1 = this.$loading();
          this.$axios.post('/PVoucherMst/Post' + url, data)
            .then(res => {
              loading1.close();
              if (res.Status == 'success') {
                this.voucherMask = false;
                this.voucherAdd = true;
                if (url == 'Add') {
                  this.ascOrDesc = 'DESC';

                }

                this.saasMessage = {
                  visible: true,
                  delay: 4000,
                  message: res.Msg
                };

                if (str == 'keepAdd') {
                  this.addVoucher('fresh');
                  return;
                }
                if (str == 'print') {
                  this.printContent();
                }

                this.getvoucherList(str, this.voucherDataList.data.Mst.PType);

              } else {
                this.saasMessage = {
                  visible: true,
                  delay: 4000,
                  message: res.Msg
                }
              }

            },
              err => {
                console.log(err);
                loading1.close();
              }
            )
            .catch(err => {
              loading1.close();
              this.$message({ showClose: true, message: '保存出错了!', type: "error" });

            })
        } else if (url == 'update') {
          this.$msgBox.show('当前月份已结账,无法修改凭证!')
        } else {
          this.$msgBox.show('当前月份已结账,无法新增凭证!')
        }
      }

    },
    //手动刷新voucher组件**************************
    resetVoucher () {
      var vm = this;
      this.voucherDataList.bool = false;
      function delay () {
        vm.voucherDataList.bool = true
      }
      setTimeout(delay, 5);
    },
    //保存为模板弹窗确认******************
    tempMaskShow (bool) {
      if (!bool) {
        this.temp.tempMask = false;
      } else {
        if (!this.temp.TemName) {
          this.saasMessage = {
            message: '请输入模板名称!',
            delay: 4000,
            visible: true
          }
        } else {
          this.voucherData();
          var data = JSON.parse(JSON.stringify(this.voucherDataList.data));
          var dtls = data.Mst.Dtls;
          if (data.Mst.PType == '结') {
            this.saasMessage = {
              message: '结转凭证无法存为模板!',
              visible: true
            }
            this.temp.tempMask = false;
            return;
          }
          if (this.temp.TemMoney == 0) {
            for (var dtl of dtls) {
              dtl.JSum = '';
              dtl.DSum = '';
              if (dtl.DtlAccounts) {
                dtl.DtlAccounts[0].JSum = '';
                dtl.DtlAccounts[0].DSum = '';
              }
            }
          }
          this.keepModel(this.temp.TemName, data, this.temp.RMark);
          this.temp.tempMask = false;
        }
      }
    },
    //保存模板**********************
    keepModel (name, data, rmark) {
      if (data.Mst.PhId) {
        this.clearPhId(data.Mst);
      }
      if (data.Mst.Dtls.length <= 0) {
        this.$message('请输入内容!')
        return;
      }
      data.Mst.TemName = name;
      data.Mst.RMark = rmark;
      data.Mst.Description = this.temp.tempDescription;
      data.Mst.Userid = this.uid;
      data.Mst.UseCount = this.uInfo.Account;
      data.Mst.PAttachment = 0;
      data.Attachements = [];
      console.log(data)
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        infoData: data
      }
      const loading = this.$loading();
      this.$axios.post('/PVoucherTemplateMst/PostAdd', data)
        .then(res => {
          loading.close();
          if (res.Status == 'success') {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: res.Msg
            };
            // this.getvoucherList();
          } else {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: res.Msg
            };
          }
        },
          err => {
            console.log(err);
            loading.close();
          })
        .catch(err => { this.$message({ showClose: true, message: '保存模板出错了!', type: "error" }); loading.close(); })
    },
    //审核*****************
    audit (bool, PhId) {
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        uname: this.uname,
        infoData: [PhId]
      }
      var url = 'PVoucherMst/PostAudit';
      if (!bool) {
        url = 'PVoucherMst/PostUnAudit'
      }
      const loading = this.$loading();
      this.$axios.post(url, data)
        .then(res => {
          if (res.Status == 'success') {
            if (bool) {
              this.saasMessage = {
                visible: true,
                delay: 4000,
                message: '审核成功!'
              };
            } else {
              this.saasMessage = {
                visible: true,
                delay: 4000,
                message: '反审核成功!'
              };
            }
            this.getVoucherData(PhId);
          } else {
            this.$message({ showClose: true, message: res.Msg, type: "error" });
          }
          loading.close();
        }, err => {
          console.log(err);
          loading.close();
        })
        .catch(err => { loading.close(); this.$message({ showClose: true, message: '审核出错了!', type: "error" }); })
    },
    //删除***********************
    delete (data) {
      const loading = this.$loading();
      this.$axios.post('PVoucherMst/PostDelete', data)
        .then(res => {
          loading.close();
          if (res.Status == 'success') {
            this.ascOrDesc == 'DESC';
            this.getvoucherList();
            if (this.voucherMask == 'cut') {
              this.saasMessage = {
                visible: true,
                delay: 4000,
                message: '剪切成功!'
              }
              this.voucherMask = false;
              return;
            }
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: res.Msg
            };
          } else {
            this.$message({ showClose: true, message: res.Msg, type: "error" });
          }

        }, err => {
          console.log(err);
          loading.close();
        })
        .catch(err => { loading.close(); this.$message({ showClose: true, message: "删除失败了!", type: "error" }); })
    },
    voucherData () {//接收voucher组件传值************
      this.voucherDataList.data = this.$refs.voucher.voucherData();
    },
    ////获取科目列表******************
    getSubject () {
      var data = {
        orgid: this.orgid,
        Ryear: this.sideDate.slice(0, 4)
      }
      this.$axios.get('/PSubject/GetPSubjectListByOrgId', { params: data })
        .then(res => {
          if (res.Status == 'error') {
            this.saasMessage = {
              visible: true,
              message: res.Msg
            }
          }
          this.vouSubjectlist = res;
          this.resetVoucher();
          // for(var i in this.voucherInfo){
          //     this.itemlists[i]={
          //         id:i,
          //         kemu:this.subjectlist  //凭证组件中总的科目列表
          //     }
          // }
          //this.$forceUpdate();
        }, err => {


        })
        .catch(err => { this.$message({ showClose: true, message: '获取科目列表失败了!', type: "error" }); })
    },
    //判断科目方向
    balanceType (val) {
      //辅助项选择判断
      if (this.voucherDataList.data.assistItemMask) {
        this.saasMessage = {
          visible: true,
          delay: 3000,
          message: '请完成辅助项选择!'
        }
        return;
      }
      var data = this.voucherDataList.data.Mst.Dtls;
      var type = this.voucherDataList.data.Mst.PType;
      var jSub = [], dSub = [];
      var msg = '';
      if (type == '记') {
        for (var dtl of data) {
          if (dtl.SubjectCode[0] == 4) {//方向为贷
            if (dtl.JSum) {  //存了借方金额,
              dSub.push(dtl);
            }
          } else if (dtl.SubjectCode[0] == 5) {//方向为借
            if (dtl.DSum) {  //存了贷方金额,
              jSub.push(dtl);
            }
          }
        }
        if (dSub.length > 0) {
          for (var ds of dSub) {
            msg = msg + ds.SubjectCode + '、'
          }
          msg = msg.replace(/、$/, '');
          msg = msg + '科目建议记“贷方”，'

        }
        if (jSub.length > 0) {
          for (var js of jSub) {
            msg = msg + js.SubjectCode + '、'
          }
          msg = msg.replace(/、$/, '');
          msg = msg + '科目建议记“借方”，'

        }
        if (msg) {
          msg = msg + '请检查分录情况。是否继续保存？';
          this.confirm = {
            visible: true,
            type: 'balance',
            btn1: '是',
            btn2: '否',
            message: msg,
            data: val
          }
        } else {  //没有收入或者支出填错的
          this.keepVoucher(val);
        }
      }
      else if (type == '结') { //结转凭证金额方向应与科目方向相反
        var zSub = [];
        var des = this.voucherDataList.data.Mst.Description;
        for (var dtl of data) {
          if (dtl.SubjectCode[0] == 4) {//方向为贷
            if (dtl.DSum) {  //存了贷方金额,应该是存借方
              dSub.push(dtl);
            }
          } else if (dtl.SubjectCode[0] == 5) {//方向为借
            if (dtl.JSum) {  //存了借方金额,
              jSub.push(dtl);
            }
          } else if (dtl.SubjectCode[0] == 3) {  //33101....

            if (des == 1 && dtl.JSum) {//收入结转  33101应记贷方
              zSub.push(dtl);
            } else if (des == 2 && dtl.DSum) { //支出结转
              zSub.push(dtl);
            }
          }
        }
        if (dSub.length > 0) {
          for (var ds of dSub) {
            msg = msg + ds.SubjectCode + '、'
          }
          msg = msg.replace(/、$/, '');
          msg = msg + '科目应记“借方”，'

        }
        if (jSub.length > 0) {
          for (var js of jSub) {
            msg = msg + js.SubjectCode + '、'
          }
          msg = msg.replace(/、$/, '');
          msg = msg + '科目应记“贷方”，'

        }
        if (zSub.length > 0) {
          for (var zs of zSub) {
            msg = msg + zs.SubjectCode + '、'
          }
          msg = msg.replace(/、$/, '');
          if (des == 1) {
            msg = msg + '科目应记“贷方”，'
          } else if (des == 2) {
            msg = msg + '科目应记“借方”，'
          }
        }
        if (msg) {
          msg = msg + '请检查分录情况后继续操作!';
          this.saasMessage = {
            visible: true,
            message: msg,
          }
        } else {  //没有收入或者支出填错的
          this.keepVoucher(val);
        }

      }
    },
    //判断借贷平衡***********
    dataCheck () {
      var data = this.voucherDataList.data.Mst.Dtls;
      var Jcount = 0;
      var Dcount = 0;
      if (data.length == 0) {
        return 0;  //内容为空
      }
      for (var dtl of data) {
        if (dtl.PersistentState != 3) {
          Jcount = parseFloat(Jcount) + parseFloat(dtl.JSum ? dtl.JSum : 0);
          Dcount = parseFloat(Dcount) + parseFloat(dtl.DSum ? dtl.DSum : 0);
        }

      }

      if (Jcount.toFixed(2) == Dcount.toFixed(2)) {
        return 1;   //借贷平衡
      } else {
        return 2;
      }
    },
    //获取最新一个凭证的时间放入引用的模板
    getFreshVouchsideDate (str, Mst) {

      const loading1 = this.$loading();
      if (!this.sideDate) {
        this.sideDate = this.nowTime.getFullYear() + '-' + this.nowTime.getMonth()
      }

      var data = {
        uid: this.uid,
        orgid: this.orgid,
        sum1: '',
        sum2: '',
        keyword: '',
        pagesize: 1,
        pageindex: 0,
        sort: ['PDate DESC', 'PNo DESC'],
        // itemValuePhid:649181122000008,
        itemValuePhid: '',
        queryfilter: {          "PAccper*str*ge*1": this.sideDate.split('-')[1] > 9 ? this.sideDate.replace("-", '') : (this.sideDate.split('-')[0] + '0' + this.sideDate.split('-')[1]),
          "PAccper*str*le*1": this.sideDate.split('-')[1] > 9 ? this.sideDate.replace("-", '') : (this.sideDate.split('-')[0] + '0' + this.sideDate.split('-')[1])        }
      }

      this.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          loading1.close();
          debugger
          if (res.Record.length <= 0) {
            Mst.PNo = '';
            Mst.PDate = this.sideDate;


          } else {
            Mst.PNo = '';
            Mst.PDate = res.Record[0].PDate.slice(0,10);
            Mst.PMonth = res.Record[0].PMonth;
            Mst.Uyear = res.Record[0].Uyear;
          }
          this.voucherDataList.data.Mst = Mst;
          this.resetVoucher();
          this.voucherAdd = false;
          this.getBalanceBool = true;
        }, err => {
          loading1.close();
          console.log(err);

        })
        .catch(err => {
          loading1.close();
          this.$message({ showClose: true, message: '获取凭证时间失败了!', type: "error" });
        })
    },
    //新增科目辅助项改变定位**************************
    subAddClick (bool) {
      this.subaddcss = bool;
    },
    //附件弹窗
    addZindex (bool) {
      console.log(bool)
      this.addZindexCss = bool;
    },
    //voucher组件模板余额
    voucherBalance (data) {
      this.getBalanceBool = data;
    },
    //接收temp组件传值***********************
    tempClick (data) {
      if (data) {
        data.PersistentState = 1;
        for (var dtl of data.Dtls) {
          dtl.PersistentState = 1;
          if (dtl.DtlAccounts) {
            dtl.DtlAccounts[0].PersistentState = 1;
          }
        }

        // if(data.PType=='结'){
        //     var list=[];
        //     for(var sub  of  this.subjectlist){
        //         var reg=/^3310+/;
        //         if(reg.test(sub.KCode)){
        //             list.push(sub);
        //         }
        //         if(sub.KCode[0]==4&&data.Description==1){//收入结转,收入科目
        //             list.push(sub);
        //         }
        //         if(sub.KCode[0]==5&&data.Description==2){
        //             list.push(sub);
        //         }
        //     }
        //     this.vouSubjectlist=list;
        // }
        this.getFreshVouchsideDate('temp', data);

        //data.PDate=new Date;
        //data.PNo='';
        // this.voucherDataList.data.Mst=data;
        // this.resetVoucher();
        // this.voucherAdd=false;
      }
      this.modelListCss = false;
    },
    //接收下月账传值******************
    nextMonthHandle (data) {
      this.checkDate = '';
      this.addVoucher('fresh');
      this.getChecked();
    },
    //获取单个凭证**************
    getVoucherData (PhId) {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        id: PhId
      }
      const loading2 = this.$loading();
      this.$axios.get('/PVoucherMst/GetVoucher', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.voucherDataList.data.Mst = res.Data;
            this.resetVoucher();
          } else {
            this.$message({ showClose: true, message: res.Msg, type: "error" });
          }
          loading2.close();
        }, err => {
          console.log(err);
          loading2.close();
        })
        .catch(err => {
          this.$message({ showClose: true, message: '获取凭证失败了!', type: "error" }); loading2.close();
        })
    },
    //获取当前结账的最新月份************
    getChecked () {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        queryfilter: { "OrgId*num*eq*1": this.orgid }
      }
      const loading = this.$loading();
      this.$axios.get('/PBusinessConfig/GetPBusinessConfigList', { params: data })
        .then(res => {

          loading.close();
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
          this.checkedDate.checkedTime = this.checkedTime;
          this.checkedDate.checkedYear = this.unCheckYear;
          this.sideDate = res.Record[0].JYear + '-' + this.checkedTime;
          this.year = this.sideDate.split('-')[0];
          this.month = this.sideDate.split('-')[1];
          this.checkVal = this.checkedTime;
          this.unCheckVal = this.checkedTime > 1 ? this.checkedTime - 1 : 1;
          this.superSearchVal.date2 = this.superSearchVal.date1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month));

          this.getSubject();
          // this.$forceUpdate();
          this.$nextTick(this.toTop);
        },
          err => {
            console.log(err);
            loading.close();
          })
        .catch(error => { this.$message({ showClose: true, message: '获取结账期失败!', type: "error" }); loading.close(); })
    },
    //时间选择
    toTop: function () {  //当前月在顶部
      var li = document.querySelector('#scrollMonth>li>ul> li.active');
      var ul = document.querySelector('.monthsContainer');
      ul.scrollTop = li.offsetTop;
    },
    //获取摘要模板***
    getAbstract () {
      this.$axios.get('/PAbstractTem/GetAbstractTem')
        .then(res => {

          if (res.Status == 'success') {
            this.AbstractList = res.Data;
            this.AbstractList.unshift({ AContent: '' });
          } else {
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
          }
        })
        .catch(err => {
          this.$message({ showClose: true, message: '获取摘要模板失败了!', type: "error" });
        })
    },
    //前后快速翻页定位凭证****************
    getvoucher (str) {

      if (str == 'pre') {
        if (this.count > 0) {
          this.count--;
          this.voucherDataList.data = {
            Mst: this.newAddList[this.count]
          };
          this.resetVoucher();
        } else {
          if (this.pageindex > 0) {
            this.pageindex--;
            this.getvoucherList('pre');
          } else {
            // this.$message("已到当前月份第一张!")
          }
        }
      } else if (str == 'next') {
        if (this.count < this.newAddList.length - 1) {
          this.count++;
          this.voucherDataList.data = {
            Mst: this.newAddList[this.count]
          };
          this.resetVoucher();
        } else {
          if (this.totalRows - this.pageindex * this.pagesize <= this.count + 1) {
            // this.$message("已到当前月份最后一张!")
          } else {
            this.pageindex++;
            this.getvoucherList();
          }
        }
      }
    },
    //凭证列表***************高级搜索***********************
    getvoucherList (val, type) {
      var vm = this;
      var data = {
        uid: vm.uid,
        orgid: vm.orgid,
        sum1: vm.superSearchVal.sum1,
        sum2: vm.superSearchVal.sum2,
        keyword: vm.superSearchVal.keyword,
        pagesize: vm.pagesize,
        pageindex: vm.pageindex,
        sort: ['PType', 'PNo ASC', 'PDate ASC'],
        itemValuePhid: vm.superSearchVal.assistItem.PhId,
        queryfilter: { "PAccper*str*ge*1": vm.superSearchVal.date1.replace('-', ''), "PAccper*str*le*1": vm.superSearchVal.date2.replace('-', '') }
      }
      const loading1 = this.$loading();
      vm.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          loading1.close();
          this.getSubject();
          if (res.Status == 'success') {
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
            vm.voucherDataList.data = {
              Mst: {},
              Attachements: []
            }

            vm.resetVoucher();
            return;
          } else if (res.Status == 'error') {

            this.saasMessage = {
              visible: true,  //消息弹出框*******
              message: res.Msg, //消息主体内容**************
            }
            vm.voucherDataList.data = {
              Mst: {},
              Attachements: []
            }

            vm.resetVoucher();
            return;
          }
          else {
            if (val == 'searcher' && res.Record.length > 1) {
              //vm.$store.commit("tagNav/upexcludeArr", ['voucherList']);
              vm.$router.push({ name: 'voucherList', params: { voucherList: res.Record } })
              return;
            } else if (res.Record.length == 0) {
              vm.voucherDataList.data = {
                Mst: {},
                Attachements: []
              }
              vm.resetVoucher();
              this.saasMessage = {
                message: '无法找到凭证,请录入凭证!',
                visible: true
              }
              this.voucherAdd = false;
              vm.newAddList = [];
              return;
            }

            vm.newAddList = res.Record;
            var oldCount = vm.count;
            vm.count = (val == 'pre') ? vm.newAddList.length - 1 : 0;
            if (vm.ascOrDesc == 'DESC') {
              vm.count = vm.newAddList.length - 1;
            }
            if (val == 'update') {
              vm.count = oldCount;
            }
            if (val == 'Add') {
              var count = this.typeCount(vm.newAddList);
              if (type == '记') {
                vm.count = count.ji - 1;
              } else if (type == 'jie') {
                vm.count = count.jie - 1;
              }
            }
            vm.totalRows = res.totalRows;
            vm.pagesize = res.size;
            vm.pageindex = res.index;

            vm.voucherDataList.data = {
              Mst: vm.newAddList[vm.count]
            };
            vm.resetVoucher();
          }
        },
          err => {
            loading1.close();
            console.log(err);

          })
        .catch(err => { loading1.close(); console.log(err); vm.$message({ showClose: true, message: '获取凭证列表失败了!', type: "error" }); })
    },
    //区分记和结的凭证,返回个数
    typeCount (data) {
      var ji = 0, jie = 0;
      for (var d of data) {
        if (d.PType == '记') {
          ji++;
        } else if (d.PType == '结') {
          jie++;
        }
      }
      return { ji: ji, jie: jie }
    },
    //选择会计期***************
    sideMonth (i, year) {
      this.month = i;
      this.year = year;
      this.sideDate = year + '-' + i;
      this.superSearchVal.date2 = this.superSearchVal.date1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month));
      this.ascOrDesc = 'ASC';
      this.getvoucherList();
      this.voucherAdd = true;
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
        month.scrollTop = Y + top;
        this.mouseStartY = $event.clientY;
      }

    },
    //会计期[反]结账确认选择*****************************
    yearsTrue (str, val, year) {
      if (val > 12 || val < 1) {
        this.saasMessage = {
          message: '请输入正确的月份',
          visible: true
        }
        return;
      }
      if (str == 'uncheck') {
        this.checkOut(str, val, year);
      } else if (str == 'check') {
        this.nextMonthCss = true
      }
      this.yearSelCss = false;

    },
    //结账功能 //反结账功能*****************************************
    checkOut (str, val, year) {
      var t;
      var url;
      if (str == 'check') {
        url = '/PBusinessConfig/UpdateBusinessConfig';
      } else if (str == 'uncheck') {
        if ((this.unCheckVal > this.checkedTime - 1) && (year >= this.checkedYear)) {
          this.saasMessage = {
            message: '当前月份还未结账,无法反结账!',
            visible: true
          }

          return;
        }
        url = '/PBusinessConfig/GetUnUpdateBusinessConfig';
      }

      t = year + '-' + val;
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        dateTime: t
      }
      const loading1 = this.$loading();
      this.$axios.get(url, { params: data })
        .then(res => {
          loading1.close();
          console.log(res)
          if (res.Status == 'success') {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: str == 'check' ? '结账成功!' : '反结账成功!'
            };
            this.addVoucher('fresh');
            this.getChecked();
          } else {
            this.$message({ showClose: true, message: res.Msg, type: "error" });
          }
        },
          err => {
            console.log(err);
            loading1.close();
          })
        .catch(err => { this.$message({ showClose: true, message: str == 'check' ? '结账失败!' : '反结账失败!', type: "error" }); loading1.close(); })
    },
    //反结账完成
    finishUncheck () {
      this.addVoucher('fresh');
      this.getChecked();
      this.checkDate = '';
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
    //反结账年份加减
    checkYear (bool) {
      if (bool && this.unCheckYear < this.checkedYear) {
        this.unCheckYear++;
      } else if (!bool && this.unCheckYear > this.jbuildDate.slice(0, 4)) {
        this.unCheckYear--;
      }

    },
    //结账月份加减********************
    nextMonth (str, val, name) {
      if (str == 'pre' && val > 1) {
        val--;
      } else if (str == 'next' && val < 12) {

        val++;
      }
      this[name] = val;
    },
    //会计期弹窗年月份选择*****************
    yearMonthClick ($event) {
      this.month = parseInt($event.target.innerHTML)
      this.sideDate = this.year + '-' + this.month;
      this.superSearchVal.date2 = this.superSearchVal.date1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month));
      this.ascOrDesc = 'ASC';
      this.getvoucherList();
      this.voucherAdd = true;
      this.yearSelCss = false;
    },

    //重排返回的数据
    numResetMsg (msg) {
      this.resetShow = false;
      this.saasMessage = {
        message: msg,
        visible: true
      }
      this.getvoucherList();
    },
    //凭证重排月份选择******************
    // resetCodeMonth($event){
    //   this.month= this.month=parseInt($event.target.innerHTML);
    // },
    // //凭证号重排确认***************
    // resetCode(val){
    //     if(val){
    //         const loading5=this.$loading();
    //         var data={
    //             orgid:this.orgid,
    //             Year:this.sideDate.split('-')[0],
    //             Pmonth:this.sideDate.split('-')[1]
    //         }
    //         var url='/PVoucherMst/GetRebuilder';
    //         if(this.allReset){
    //             url='PVoucherMst/GetRebuilderForAllYear';
    //             data={
    //                 orgid:this.orgid,
    //                 Year:this.sideDate.split('-')[0],
    //             }
    //         }
    //         this.$axios.get(url,{params:data})
    //             .then(res=>{

    //                 if(res.Status=='error'){
    //                     this.$message(res.Msg);
    //                 }else if(res.Status=='success'){
    //                     this.$message('重排成功!');
    //                     this.resetShow=false;
    //                 }
    //                 loading5.close();
    //             },
    //             err => {
    //                 console.log(err);
    //                     loading5.close();
    //              })
    //             .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading5.close();})
    //     }else{
    //         this.resetShow=false;
    //     }
    // },
    //会计期内容切换************************************
    checkOutSel (val) {
      this.monthsSelCss = val;
    },
    //会计期窗口弹出**************************
    yearSelShow () {
      this.checkVal = this.checkedTime;
      this.unCheckVal = this.checkedTime > 1 ? this.checkedTime - 1 : 1;
      this.yearSelCss = !this.yearSelCss;
    },
    //做下月账****************
    nextMonthShow () {
      if (this.checkedTime > 12) {
        this.saasMessage = {
          message: '本年都已结账!'
        }
        return;
      }
      this.nextMonthCss = true;
      this.checkVal = this.checkedTime;
    },
    //冲红***********************
    chongh () {

      var vm = this;
      this.voucherData();

      var Mst = this.voucherDataList.data.Mst;
      if (Mst.WriteOff_PhIds && Mst.WriteOff_PhIds.length > 0) {
        this.saasMessage = {
          message: '该凭证已经冲红,无法冲红!',
          delay: 4000,
          visible: true
        }
        this.voucherMaskShow(false);
        return;
        // if(confirm("该凭证已经冲红,需要重新冲红吗?")){
        //     return;
        // }else{
        //     this.voucherMaskShow(false);
        //     return;
        // }
      }
      var year;
      var month;
      var date1;
      var oldPhId = this.voucherDataList.data.Mst.PhId;
      year = Mst.PDate.slice(0, 4);
      month = Mst.PDate.slice(5, 7);
      date1 = Mst.PDate.slice(8, 10);
      for (var dtl of Mst.Dtls) {
        dtl.Abstract = `注销${year}年${month}月${date1}号${Mst.PNo}号凭证`;
        dtl.JSum = dtl.JSum ? dtl.JSum * -1 : '';
        dtl.DSum = dtl.DSum ? dtl.DSum * -1 : '';
        if (dtl.DtlAccounts) {
          dtl.DtlAccounts[0].JSum = dtl.DtlAccounts[0].JSum ? dtl.DtlAccounts[0].JSum * -1 : '';
          dtl.DtlAccounts[0].DSum = dtl.DtlAccounts[0].DSum ? dtl.DtlAccounts[0].DSum * -1 : '';
        }
      }
      this.voucherDataList.data.Mst.PhidTransaction = oldPhId;
      this.voucherDataList.data.Mst.PAuditorName = '';
      this.voucherDataList.data.Mst.PSource = '冲红';
      this.voucherDataList.data.Mst.PDate = '';//默认时间为空,冲红可选时间
      this.resetVoucher();

    },
    //清空凭证phid*****************
    clearPhId (item) {

      item.PhId = '';
      if (item.PNo) {
        item.PNo = '';
      }
      item.PersistentState = 1;
      for (var dtl of item.Dtls) {
        dtl.PhId = '';
        dtl.PhidTransaction = '';
        dtl.PhidVouchermst = '';
        dtl.PersistentState = 1;
        if (dtl.DtlAccounts) {
          dtl.DtlAccounts[0].PhId = '';
          dtl.DtlAccounts[0].PhidTransaction = '';
          dtl.DtlAccounts[0].PhidVouchermst = '';
          dtl.DtlAccounts[0].PhidVoucherDel = '';
          dtl.DtlAccounts[0].PersistentState = 1;
        }
      }
    },
    //打印******************
    // printLodop() {
    //     const me = this
    //     var html=this.$refs.print.innerHTML;
    //     console.log(html)
    //     let  LODOP = getLodop();
    //     LODOP.PRINT_INIT("凭证信息");      //首先一个初始化语句
    //     LODOP.SET_PRINT_STYLE("FontSize", 18);  //字体
    //     LODOP.SET_PRINT_STYLE("Bold", 1);
    //     //LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
    //     LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "凭证信息");
    //     LODOP.ADD_PRINT_HTM(88, 200, 350, 600,html);
    //     //LODOP.PRINT();
    //     LODOP.PREVIEW();
    // },
    // 打印
    printContent (e) {
      this.$print(this.$refs.print) // 使用
    },
    //复制剪切******************************
    voucherMaskShow (val) {
      this.voucherMask = val;
    },
    keepChoose (val) {
      var vm = this;
      if (val) {
        this.voucherData();
        var id = this.voucherDataList.data.Mst.PhId;
        if (val == 'cut') {
          if (this.voucherDataList.data.Mst.Verify) {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: '该凭证已审核,无法剪切!'
            }
            this.voucherCut = true;
            return;
          }
          var data1 = {
            uid: this.uid,
            orgid: this.orgid,
            id: id
          }
          console.log(this.voucherDataList.data.Mst)
          this.cut(vm, data1);
        } else if (val == 'chongh') {  //冲红
          debugger
          console.log(this.voucherDataList.data.Mst.PDate)
          var Vdata = JSON.parse(JSON.stringify(this.voucherDataList.data));
          console.log(Vdata.Mst.PDate)
          debugger
          if (Vdata.Mst.Dtls.length <= 0) {
            this.$message('请输入内容!')
            return;
          }
          if (Vdata.Mst.PDate) {
            if (typeof (Vdata.Mst.PDate) == 'object') {
              Vdata.Mst.Uyear = Vdata.Mst.PDate.getFullYear();
              Vdata.Mst.PMonth = Vdata.Mst.PDate.getMonth() + 1;
              var date = Vdata.Mst.PDate.getDate();
              Vdata.Mst.PDate = (Vdata.Mst.Uyear + '-') + (Vdata.Mst.PMonth < 10 ? ('0' + Vdata.Mst.PMonth) : Vdata.Mst.PMonth) + '-' + ((date) < 10 ? ('0' + date) : date);
            } else {
              Vdata.Mst.PDate = Vdata.Mst.PDate.substring(0, 10);
              Vdata.Mst.Uyear = Vdata.Mst.PDate.substring(0, 4);
              Vdata.Mst.PMonth = Vdata.Mst.PDate.substring(5, 7);
            }
          } else {
            this.$message('请输入凭证会计期!')
            return;
          }

          this.clearPhId(Vdata.Mst);
          if ((Vdata.Mst.Uyear == this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime) || Vdata.Mst.Uyear > this.checkedYear) {
            var data = {
              uid: this.uid,
              orgid: this.orgid,
              orgcode: this.orgcode,
              infoData: Vdata
            }
            var oldPhId = this.voucherDataList.data.Mst.PhidTransaction;
            var oldData = this.voucherDataList.data.Mst;
            const loading = this.$loading();
            //this.voucherMask=false;
            this.$axios.post('/PVoucherMst/PostAdd', data)
              .then(res => {
                loading.close();
                if (res.Status == 'success') {
                  vm.voucherMask = false;
                  vm.voucherAdd = true;
                  this.confirm = {
                    visible: true,
                    message: '保存成功，是否生成【更正凭证】？',
                    type: 'gengz'
                  }

                  // if(confirm('保存成功，是否生成【更正凭证】？')){
                  //     vm.voucherDataList.bool=true;
                  //     vm.voucherDataList.data.Mst=oldData
                  //     vm.voucherDataList.data.Mst.PhId=oldData.PhidTransaction;
                  //     vm.voucherDataList.data.Mst.PSource='更正';
                  //     for(var dtl of  vm.voucherDataList.data.Mst.Dtls ){
                  //         if(dtl.SubjectCode){
                  //             dtl.Abstract=dtl.Abstract.replace("注销",'更正错账');
                  //             dtl.JSum=dtl.JSum?dtl.JSum*-1:'';
                  //             dtl.DSum=dtl.DSum?dtl.DSum*-1:'';
                  //             if(dtl.DtlAccounts){
                  //                 dtl.DtlAccounts[0].JSum=dtl.DtlAccounts[0].JSum?dtl.DtlAccounts[0].JSum*-1:'';
                  //                 dtl.DtlAccounts[0].DSum=dtl.DtlAccounts[0].DSum?dtl.DtlAccounts[0].DSum*-1:'';
                  //             }
                  //         }
                  //     }
                  //     vm.voucherMask='gengz';
                  // }else{
                  //     vm.voucherMask=false;
                  //     vm.getvoucherList();
                  // }
                } else {
                  this.saasMessage = {
                    visible: true,
                    message: res.Msg
                  };
                }

              }, err => {
                console.log(err);
                loading.close();
              })
              .catch(err => {
                this.$message({ showClose: true, message: '复制/剪切/冲红保存失败了!', type: "error" });
                loading.close();
              })
          } else {
            this.$message('当前月份已结账,无法新增凭证!')
          }

        }
        else {
          if (val == 'copy' || val == 'gengz') {
            this.clearPhId(this.voucherDataList.data.Mst);
            if (val == 'copy') {
              this.voucherDataList.data.Mst.PMakePerson = this.uname;
              val = 'Add'
            }
          }
          this.balanceType(val);
          //this.keepVoucher(val);


        }
      } else {
        this.voucherMask = false;
        this.voucherAdd = true;
        this.voucherCut = true;
        this.voucherDataList.data = JSON.parse(this.oldVoucherData);
        this.resetVoucher();
      }

    },
    //剪切*****************
    cut (vm, data1) {
      var url = 'Add';
      var Vdata = vm.voucherDataList.data;
      if (Vdata.Mst.Dtls.length <= 0) {
        this.$message('请输入内容!')
        return;
      }
      if (Vdata.Mst.PDate) {
        if (typeof (Vdata.Mst.PDate) == 'object') {
          Vdata.Mst.Uyear = Vdata.Mst.PDate.getFullYear();
          Vdata.Mst.PMonth = Vdata.Mst.PDate.getMonth() + 1;
          var date = Vdata.Mst.PDate.getDate();
          Vdata.Mst.PDate = (Vdata.Mst.Uyear + '-') + (Vdata.Mst.PMonth < 10 ? ('0' + Vdata.Mst.PMonth) : Vdata.Mst.PMonth) + '-' + ((date) < 10 ? ('0' + date) : date);
        } else {
          Vdata.Mst.PDate = Vdata.Mst.PDate.substring(0, 10)
        }
      } else {
        vm.$message('请输入凭证会计期!')
        return;
      }
      vm.clearPhId(Vdata.Mst);
      if ((Vdata.Mst.Uyear >= this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime)) {
        var data = {
          uid: vm.uid,
          orgid: vm.orgid,
          orgcode: vm.orgcode,
          infoData: vm.voucherDataList.data
        }
        if (vm.voucherDataList.data.Mst.PhId) {
          url = 'Update';
        }
        console.log(vm.voucherDataList.data.Mst)
        const loading = vm.$loading();
        vm.$axios.post('/PVoucherMst/Post' + url, data)
          .then(res => {
            loading.close();
            if (res.Status == 'success') {
              vm.saasMessage = {
                visible: true,
                delay: 4000,
                message: res.Msg
              };
              this.voucherCut = true;
              vm.delete(data1);
            } else {
              vm.$message('保存失败,请重试!')
            }
          },
            err => {
              console.log(err);
              loading.close();
            })
          .catch(err => { loading.close(); this.$message({ showClose: true, message: '剪切新增保存失败了!', type: "error" }); })
      } else {
        vm.$message('当前月份已结账,无法修改凭证!')
      }
    },


  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgcode: state => state.user.orgcode,
      curOrg: state => state.user.curOrg,   //当前的组织信息
      Roleauthorize: state => state.user.Roleauthorize,
      usercount: state => state.user,
      jbuildDate: state => state.Pconfig.jbuildDate,//建账日期
      cachePage: state => state.tagNav.cachePage  //是否利用路由缓存
    }),
  },
  components: {
    voucher,
    voucherTemp,
    nextMonth,
    numReset,
    quickCheck
  }
}
</script>

<style lang="scss" scoped>
.addVoucher {
  width: 100%;
  // min-width: 1200px;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  text-align: left;
  font-size: 14px;
  //position:relative;   //子组件fixed无法全屏
  padding: 10px 35px 0px 20px;
  background: #fff;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px 2px #d3e9f9;
}
.unionState {
  position: absolute;
  z-index: 99;
  top: 70px;
  left: 30px;
  background: #fff;
  right: 30px;
  padding: 0 80px 10px 30px;
  // margin-bottom: 30px;
  > ul {
    > a:hover {
      z-index: 999;
    }
    > a:nth-last-of-type(2) {
      position: relative;
      width: 80px;
      height: 30px;
    }
    > a > li.mode {
      width: 60px;
      height: 30px;
      overflow: hidden;
      position: absolute;

      transition: all 0.2s linear;
      border: 1px solid #00b7ee;
      > div {
        width: 100%;
        margin-right: 10px;
        background: #fff;
        opacity: 1;
        &:first-of-type {
          color: #fff;
        }
        &:hover {
          background: #ccc;
          color: #fff;
        }
        &:first-of-type {
          background: #00b7ee;
          border: 0;
        }
      }
      &:hover {
        height: auto;
        border: 1px solid #00b7ee;
        background: #fff;
        opacity: 1;
        z-index: 999;
        > span {
          &:first-of-type {
            color: #fff;
          }
        }
      }
    }
    .more {
      height: 30px;
      overflow: hidden;
      position: absolute;
      width: 100%;
      margin: 0;
      opacity: 1;
      > ul {
        width: 100%;
        > li {
          width: 100%;
          background: #fff;
          &:hover {
            background: #ccc;
            color: #fff;
          }
          &:first-of-type {
            background: #00b7ee;
            border-radius: 3px;
            color: #fff;
          }
        }
      }
    }
    > a > li.more:hover {
      height: auto;
      background: #00b7ee;
      border-top: 0;
      z-index: 99;
    }
  }
}
.searcherCon {
  > div {
    float: left;
  }
  /*min-width: 480px;*/
  .searcherBtn {
    border-radius: 0 4px 4px 0;
  }
}
.fastGps {
  float: right;
  .btnDisabled {
    background: #ccc;
    cursor: default;
  }
  > li {
    float: left;
    margin-left: 5px;
    padding: 0 5px;
    border-radius: 4px;
    height: 30px;
    width: 80px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;

    &:first-of-type,
    &:nth-of-type(2) {
      width: 30px;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        top: 8px;
        left: 10px;
        border: 2px solid #ddd;
        border-width: 0 0 2px 2px;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }
    &:nth-of-type(2):before {
      border-width: 2px 2px 0 0;
      left: 7px;
    }
    &:nth-of-type(3) {
      width: 70px;
      padding: 0;
    }
    // &:nth-of-type(4){
    //     background: #6acccb;
    // }
  }
}
.searcherValue {
  border: 1px solid #ddd;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  padding-left: 10px;
}
.searcherValue {
  width: 30%;
}
.searcherValue > input {
  width: 100%;
  height: 28px;
  outline: none;
  margin: 0;
  font-size: 14px;
  border: 0;
}
.searcherBtn {
  height: 30px;
  width: 60px;
  min-width: 70px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
/*.unionState .handle{*/
/*min-width: 570px;*/
/*}*/
.unionState .handle > a {
  float: right;
  min-width: 50px;
}
.unionState .handle > a > li.more:hover {
  opacity: 1;
}
.unionState .handle > a > li {
  border: 0;
  padding: 0;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
  background: #00b7ee;
  width: 100%;
  font-size: 14px;
  width: 50px;
  height: 30px;
  line-height: 30px;
  margin-right: 0;
  &:hover {
    background: #fff;
    color: #00b7ee;
    border: 1px solid #00b7ee;
  }
  &.fresh {
    width: 30px;
    min-width: 30px;
    border-radius: 50%;
    background: none;
    position: relative;
    left: -10px;
    > img {
      height: 100%;
    }
    &:hover {
      background: none;
      border: 0;
      opacity: 0.8;
    }
  }
}
.unionState .handle > a:nth-of-type(4) > li {
  min-width: 60px;
}

.asideNav {
  width: 55px;
  position: absolute;
  z-index: 99;
  right: 31px;
  top: 59px;
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
    border-radius: 0 5px 0px 0;
    cursor: pointer;
    > div {
      height: 50%;
      line-height: 17px;
      font-size: 14px;
    }
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
.sideNavCss {
  z-index: 999;
}
.codeResetContainer {
  background: rgba(0, 0, 0, 0.5);

  position: fixed;
  position: -ms-page;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  > div {
    width: 300px;
    height: 410px;
    margin: 150px auto 0;
    border-radius: 10px;
    background: #fff;
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
.voucherMaskActive {
  position: fixed;
  position: -ms-page;
  bottom: 0;
  z-index: -1;
}
.footInfo {
  position: fixed;
  position: -ms-page;
  z-index: 9;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b3245;
  text-align: center;
  color: #fff;
  font-size: 20px;
  > a {
    color: #fff;
    padding: 0 20px;
    border-right: 1px solid #fff;
    &:last-of-type {
      border: 0;
    }
  }
}
.voucherContainer {
  position: relative;
  width: 100%;
  padding: 50px 20px 50px 10px;
  //overflow-x: hidden;
  //overflow-y: auto;
  margin-right: 10px;
}
.voucherMask {
  position: fixed;
  position: -ms-page;
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
  z-index: 999;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);

  .voucherContainer {
    width: 80%;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    //   position:absolute;
    background: #fff;
    //   top:100px;
    //   left:10%;
    //overflow-y: auto;
    padding: 10px;
    > div:first-of-type {
      //float:right;
      padding: 5px 10px;
      position: relative;
      z-index: 1;
      > span {
        margin-left: 20px;
      }
    }
    > p {
      position: relative;
      z-index: 1;
    }
    .subaddcss {
      position: static;
    }
  }
  > div:last-of-type {
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    width: 0;
  }
}
.voucherBG {
  position: absolute;
  z-index: 0;
  left: -40px;
  right: -20px;
  top: 35px;
  bottom: 0;
  > img {
    width: 100%;
    height: 100%;
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

.voucherDisabledCon {
  position: relative;
  // min-height:516px;
  width: 100%;
  z-index: 99;
  background: #fff;
  .voucherDisabled {
    position: absolute;
    background: none;
    z-index: 99;
    width: 74%;
    height: 100%;
    top: 74px;
    right: 0;
    > div {
      position: relative;
      z-index: 89;
    }
  }
}
.subaddcss {
  position: static;
}
.addZindex {
  z-index: 999;
}
.tempMask {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  position: -ms-page;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
  &:after {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
  }
  > div {
    display: inline-block;
    vertical-align: middle;
    width: 552px;
    height: 360px;
    background: #fff;
    border-radius: 5px;
    padding: 5px 15px;
    > ul {
      padding: 30px 50px;
      font-size: 16px;
      > li {
        height: 100%;
        line-height: 100%;
        margin-bottom: 30px;
        &:last-of-type {
          margin-bottom: 0;
        }

        > div:first-of-type {
          width: 100px;
        }
        > div {
          > label {
            margin-right: 20px;
          }
        }
      }
    }
    > div {
      justify-content: center;
      > span {
        margin-left: 60px;
        width: 110px;
        height: 35px;
        line-height: 35px;
      }
    }
  }
}
.modelBtn {
  text-align: center;
  height: 260px;
  width: 50px;
  position: absolute;

  top: 30%;
  left: 0px;
  color: #fff;
  font-size: 17px;
  cursor: pointer;
}
.jiezhang .inputContainer input {
  text-align: center;
}
</style>
