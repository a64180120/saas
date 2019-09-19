<template>
  <div class="nextMonthCheck"
       style="z-index:999">
    <div v-show="checkNav=='month'"
         class="container">
      <p class="flexPublic">
        <span>规范性检查</span>
        <i @click.stop="handle(false)"></i>
      </p>
      <ul>
        <li>
          <div><img src="@/assets/icon/shuju.svg"
                 alt=""></div>
          <span>期初余额检查</span>
        </li>
        <li v-if="checkCss">
          <ul>
            <li :class="{checkFaile:checkFaile[0]}">期初余额试算{{checkFaile[0]?'不':''}}平衡</li>
          </ul>
        </li>
        <li>
          <div><img src="@/assets/icon/share.svg"
                 alt=""></div>
          <span>凭证数及审核情况检查</span>
          <span @click="handle('audit')"
                v-show="CkeckAudioRes.all-CkeckAudioRes.already>0"
                class="checkRight">凭证审批</span>
        </li>
        <li v-if="checkCss">
          <ul>
            <li :class="{checkFaile:checkFaile[1]}">本期存在未审核凭证 {{CkeckAudioRes.all-CkeckAudioRes.already}} 张{{CkeckAudioRes.res==0?'':',请处理'}}</li>
            <li>本期凭证数 : {{CkeckAudioRes.all}}</li>
            <li>本期已审核凭证数 : {{CkeckAudioRes.already}}</li>
          </ul>
        </li>
        <li>
          <div><img src="@/assets/icon/share.svg"
                 alt=""></div>
          <span>凭证断号及序时检查</span>
          <span @click="handle('codeReset')"
                v-show="(checkFaile[2]||checkFaile[3])&&checkCss"
                class="checkRight">凭证重排</span>
        </li>
        <li v-if="checkCss">
          <ul>
            <li :class="{checkFaile:checkFaile[2]}">本期凭证{{checkFaile[2]?'':'不'}}存在断号</li>
            <li :class="{checkFaile:checkFaile[3]}">本期凭证号{{checkFaile[3]?'未':'已'}}按凭证日期排序</li>
          </ul>
        </li>
        <li v-if="checkVal==12||(!checkVal&&checkedTime==12)">
          <div style="background: #00b7ee"><img src="@/assets/icon/share.svg"
                 alt=""></div>
          <span>年末结转检查</span>
        </li>
        <li v-if="(checkVal==12||(!checkVal&&checkedTime==12))&&checkCss">
          <ul style="width:100%;">
            <li style="width:100%;"
                :class="{checkFaile:checkFaile[5]}">
              <span>年末支出科目{{checkFaile[5]?'存在余额,请进行支出结转处理':'为零检查通过'}}</span>
              <span style="height: 25px;line-height: 22px;padding: 0 10px;"
                    @click="voucherMaskShow('out_jie')"
                    v-show="checkFaile[5]"
                    class="checkRight">支出结转</span>
            </li>
            <li style="width:100%;"
                :class="{checkFaile:checkFaile[4]}">
              <span>年末收入科目{{checkFaile[4]?'存在余额,请进行收入结转处理':'为零检查通过'}}</span>
              <span style="height: 25px;line-height: 22px;padding: 0 10px;"
                    @click="voucherMaskShow('in_jie')"
                    v-show="checkFaile[4]"
                    class="checkRight">收入结转</span>

            </li>
          </ul>
        </li>
      </ul>
      <div>
        <span @click.stop="handle(false)"
              class="btn">取消</span>
        <span v-if="!checkCss"
              @click.stop="handle('begin')"
              class="btn">开始检查</span>
        <span v-if="checkCss&&!checkOutCss"
              @click.stop="handle('begin')"
              class="btn">重新检查</span>
        <span v-if="checkCss&&checkOutCss"
              @click.stop="handle('check')"
              class="btn">结账</span>
      </div>
    </div>
    <div v-show="(checkNav=='audit')||(checkNav=='codeReset')"
         class="audit">
      <!-- 审核 -->
      <p v-show="checkNav=='audit'"
         class="title">
        <span>审核凭证</span><i @click="checkNavShow('month')"></i>
      </p>
      <p v-if="voucherList.length>0&&Roleauthorize.homePage_audit!=0"
         v-show="checkNav=='audit'"
         class="auditCheck"><span @click="listHandle('audit')">审核</span></p>
      <!-- 重排 -->
      <p v-show="checkNav=='codeReset'"
         class="title">
        <span>凭证号重排</span><i @click="checkNavShow('month')"></i></p>
      <p v-show="checkNav=='codeReset'"
         class="auditCheck"><span @click="listHandle('codeReset')">开始重排</span></p>
      <section class="listContainer">
        <ul class="listTitle">
          <li>序号</li>
          <li>摘要</li>
          <li>科目</li>
          <li>借方金额(元)</li>
          <li>贷方金额(元)</li>
        </ul>
        <ul @click="choose(item)"
            :class="{choosed:item.PhId==chooseItem.PhId}"
            class="listContent"
            v-for="(item,index) of voucherList"
            :key="index">
          <li @dblclick="voucherDel(item)">
            <ul class="listIndex">
              <li>{{index+1+(checkNav=='codeReset'?(pageindex-1)*pagesize:(pageindex2-1)*pagesize2)}}</li>
            </ul>
            <ul>
              <li>
                <span>凭证日期 : {{item.PDate?item.PDate.substring(0,10):''}}</span>
                <span>凭证字号 : 记-{{item.PNo}}</span>
                <span>附件数 : {{item.PAttachment}}</span>
                <span>制单人 : {{item.PMakePerson}}</span>
                <span>审核人 : {{item.PAuditorName}}</span>
              </li>
              <li v-for="(dtl,ind) of item.Dtls"
                  :key="ind">
                <div class="wrapKemu">
                  <div>{{dtl.Abstract}}</div>
                </div>
                <div class="wrapKemu">
                  <div>
                    {{dtl.SubjectCode}}&nbsp;{{dtl.SubjectName}}
                    <span v-for="(item,index) of dtl.DtlAccounts?dtl.DtlAccounts[0].NameValueDtls:0"
                          :key="index">
                      .{{item.AuxiliaryName}}
                    </span>
                  </div>
                </div>
                <div>{{(dtl.JSum==0?'':dtl.JSum) | NUmTurn}}</div>
                <div>{{(dtl.DSum==0?'':dtl.DSum) | NUmTurn}}</div>
              </li>
              <li>
                <div>合计:{{'sum' | sum(item.Dtls)}}</div>
                <div>{{'jie'|sum(item.Dtls)}}</div>
                <div>{{'dai'|sum(item.Dtls)}}</div>
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <div v-show="checkNav=='audit'"
           style="float:right">
        <el-pagination background
                       @size-change="getvoucherList('audit')"
                       @current-change="getvoucherList('audit')"
                       :current-page.sync="pageindex2"
                       :page-sizes="[10,20, 30, 50, 70,100,500]"
                       :page-size.sync="pagesize2"
                       layout="sizes, prev, pager, next"
                       :total="total2">
        </el-pagination>
      </div>
      <div v-show="checkNav=='codeReset'"
           style="float:right">
        <el-pagination background
                       @size-change="getvoucherList"
                       @current-change="getvoucherList"
                       :current-page.sync="pageindex"
                       :page-sizes="[10,20, 30, 50, 70,100,500]"
                       :page-size.sync="pagesize"
                       layout="sizes, prev, pager, next"
                       :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="voucherMask"
         v-if="voucherMask=='in_jie'||voucherMask=='out_jie'">
      <div>
        <p class="title">
          {{voucherMask=='in_jie'?'收入':'支出'}}结转
          <i class="el-icon-close"
             @click.stop="voucherMask=''"></i>
        </p>
        <div style="overflow: hidden">
          <span style="float:right;margin:10px 0 0 10px"
                class="btn"
                @click.stop="addVoucher">保存</span>
          <span style="float:right;margin:10px 0 0 10px "
                class="btn"
                @click.stop="voucherMask=''">取消</span>
        </div>

        <!--@subAddClick="subAddClick"-->
        <!--@addZindex="addZindex"-->
        <!--:disabled2="voucherCut"-->
        <!--:disabled="voucherAdd"-->
        <!--:sideDate='sideDate'-->

        <!--   @Msg-click="voucherMsg"-->

        <voucher :balanceBool="getBalanceBool"
                 :vouSubjectlist="vouSubjectlist"
                 :AbstractList="AbstractList"
                 :dataList="voucherDataList"
                 v-if="voucherDataList.bool"
                 :sideDate="year+'-12'"
                 ref="voucher">

        </voucher>
      </div>

    </div>
    <!-- 备份满20次提示 -->
    <el-dialog :visible.sync="ssss"
               append-to-body
               width="550px"
               title="提示"
               custom-class="eldialogClass">
      <over-msg @still-go="stillGo"
                @cancle="cancle" />
    </el-dialog>
    <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
    <message :message="saasMessage.message"
             :delay="saasMessage.delay"
             :visible.sync="saasMessage.visible"></message>
    <div></div>
  </div>
</template>

<script>
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import qs from 'qs'
import overMsg from '@/page/admin/copyandreset/overMsg'
import axios from 'axios'
import voucher from '@/page/finance/jiezhuan_voucher'
import { GetOrganizeBackupList } from '@/api/copyandreset'
import { mapState, mapActions } from 'vuex'
export default {
  name: "next-month-check",
  data () {
    return {
      month: '',
      year: '',
      sideDate: '',
      nowTime: new Date,
      pagesize: 100,//重排
      pageindex: 1,
      total: 0,
      pagesize2: 100, //审核
      pageindex2: 1,
      total2: 0,
      checkedTime: '',
      voucherList: [],
      chooseItem: '',
      checkNav: 'month',
      saasMessage: {
        message: '',
        visible: false,
        delay: 0
      },
      checkFaile: [
        true, true, true, true, true, true
      ],
      CkeckAudioRes: '',
      checkOutCss: false,
      checkCss: false,
      voucherDataList: { bool: true, data: {} },
      voucherMask: '',//显示凭证录入
      getBalanceBool: true,//默认获取余额
      vouSubjectlist: [],//科目列表
      AbstractList: [],//摘要模板
      ssss: false,//显示备份数量
    }
  },
  props: {
    checkVal: String
  },
  mounted () {
    this.getChecked();


  },
  methods: {
    //检查页面操作****************
    handle (val) {
      switch (val) {
        case false:
          this.$emit('child-click', false)
          break;
        case 'begin':
          this.matchBegin();

          break;
        case 'check': //结账*********
          if (this.autoSetting.BuySave != 0) {
            this.checkOut('check', this.checkVal ? this.checkVal : this.checkedTime);
          } else {
            this.copyCheck();
          }


          break;
        case 'audit': //凭证审核页面****
          this.checkNavShow('audit')
          break;
        case 'codeReset'://凭证号重排****
          this.checkNavShow('codeReset')
          break;

      }
    },
    cancle () {
      this.ssss = false;
    },
    copyCheck () {  //检查备份数量
      let data = {
        OrgId: this.orgid
      }
      const loading = this.$loading()
      GetOrganizeBackupList(data).then(res => {
        loading.close();
        if (res.Status == 'success') {
          console.log(res)
          if (res.list.length >= 20) {
            this.ssss = true;
          } else {
            this.copy();
          }

        } else {
          this.$msgBox.error(res.Msg);
        }
      }).catch(err => {
        loading.close();
        console.log(err)
        this.$msgBox.error('获取备份数量失败!')
      })
    },
    stillGo () {//继续执行(满了20次备份)
      this.ssss = false;
      this.copy();

    },
    //备份
    copy () {
      var data = {
        OrgId: this.orgid,
        OrgCode: this.orgcode,
        OrgName: this.orgname,
        Backfrom: 1,//结账备份
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('数据正在备份,大约需要5分钟....')
      axios.create(base).get('/OrganizeBackup/GetAddBackUp', { params: data, headers: new_header })
        .then(response => {

          loading.close()
          let res = JSON.parse(response.data)
          if (res.Status == 'success') {
            // this.$msgBox.show(res.Msg)
            this.checkOut('check', this.checkVal ? this.checkVal : this.checkedTime);
          } else {
            this.$msgBox.error(res.Msg)
          }
        }).catch(err => {
          console.log(err)
          loading.close()
          this.$msgBox.error('备份失败!')
        })
    },
    //审核重排页面**************
    listHandle (val) {
      var PhIds = [];
      if (val == 'audit') {
        for (var vou of this.voucherList) {
          PhIds.push(vou.PhId);
        }
        this.audit(true, PhIds);
      } else if (val == 'codeReset') {
        this.resetCode(val);
      }
    },
    //保存结转凭证
    addVoucher () {
      var Vdata = this.$refs.voucher.voucherData();
      var url = 'Add';
      //判断科目金额摘要不能为空
      for (var dtl of Vdata.Mst.Dtls) {
        if (!(dtl.SubjectCode && dtl.Abstract && (dtl.JSum || dtl.DSum))) {
          this.saasMessage = {
            message: '科目/金额/摘要不能为空!',
            visible: true,
            delay: 4000
          }
          return;
        }
      }

      var dCheck = this.dataCheck(Vdata.Mst.Dtls);

      if (dCheck == '2' || dCheck == '0' || dCheck == '3') {
        this.saasMessage = {
          visible: true,
          delay: 4000,
          message: dCheck == '2' ? '借贷不平衡,请查看!' : '请录入凭证内容!'
        }
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
        this.message = {
          message: '请输入凭证会计期!',
          visible: true
        }
        return;
      }

      if ((Vdata.Mst.Uyear >= this.year) && (Vdata.Mst.PMonth >= this.checkedTime)) {
        var data = {
          uid: this.uid,
          orgid: this.orgid,
          orgcode: this.orgcode,
          infoData: Vdata
        }
        // if (this.voucherDataList.data.Mst.PhId) {
        //     url = 'Update';
        // }

        this.voucherAdd = true;
        const loading1 = this.$loading();
        this.$axios.post('/PVoucherMst/Post' + url, data)
          .then(res => {
            loading1.close();
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: res.Msg
            };
            if (res.Status == 'success') {
              this.voucherMask = '';
              this.checkFaile = [
                true, true, true, true, true, true
              ];
              this.matchBegin();
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
        this.$message('当前月份已结账,无法修改凭证!')
      } else {
        this.$message('当前月份已结账,无法新增凭证!')
      }
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
    //判断借贷平衡***********
    dataCheck (data) {
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
    //打开凭证
    voucherMaskShow (val) {
      var vm = this;
      var data1 = {
        uid: this.uid,
        orgid: this.orgid,
        pagesize: 100,
        pageindex: 0,
        queryfilter: { "TemName*str*llike*1": this.searchVal, "PType*str*eq": "结" }
      }
      var data2 = {
        orgid: this.orgid,
        Ryear: this.year
      }
      const loading = this.$loading();
      axios.all([
        this.$axios.get('/PAbstractTem/GetAbstractTem'),
        this.$axios.get('PVoucherTemplateMst/GetVoucherTemplateList', { params: data1 }),
        this.$axios.get('/PSubject/GetPSubjectListByOrgId', { params: data2 })
      ]).then(axios.spread(function (abs, temp, sub) {
        loading.close();
        vm.voucherMask = val;
        //凭证列表
        for (let vou of temp.Record) {
          if (val == 'in_jie' && vou.Description == 1 && vou.PSource == 2) {
            vm.voucherDataList.data.Mst = vou;
          }
          if (val == 'out_jie' && vou.Description == 2 && vou.PSource == 2) {
            vm.voucherDataList.data.Mst = vou;
          }
        }
        vm.clearPhId(vm.voucherDataList.data.Mst);
        //凭证摘要
        if (abs.Status == 'success') {
          vm.AbstractList = abs.Data;
          vm.AbstractList.unshift({ AContent: '' });
        } else {
          vm.saasMessage = {
            message: abs.Msg,
            visible: true
          }
        }
        //凭证科目
        if (sub.Status == 'error') {
          vm.saasMessage = {
            visible: true,
            message: sub.Msg
          }
        }
        vm.vouSubjectlist = sub;
        console.log(vm.voucherDataList.data.Mst)
        // vm.resetVoucher();
      })).catch(err => {
        loading.close();
        console.log(err)
      })
      // this.getAbstract();
      // this.getSubject();
    },
    ////手动刷新voucher组件**************************
    resetVoucher () {
      var vm = this;
      this.voucherDataList.bool = false;
      function delay () {
        vm.voucherDataList.bool = true
      }
      setTimeout(delay, 5);
    },

    matchBegin () {
      var data = {
        OrgIds: this.orgid,
        orgid: this.orgid,
        Year: this.year,
        Pmonth: this.checkVal ? this.checkVal : this.checkedTime
      }
      const loading = this.$loading();
      this.$axios.get('/PVoucherMst/GetCheck', { params: data })
        .then(res => {
          loading.close();
          if (res.Status == 'error') {
            this.saasMessage = {
              message: '当前组织未初始化!',
              delay: 4000,
              visible: true
            }
            return;
          }
          //期初检查
          if (JSON.parse(res.StartBalance).Status == 'success') {
            this.checkFaile[0] = false;
          }
          //审核检查
          this.CkeckAudioRes = JSON.parse(res.CkeckAudio);
          if (this.CkeckAudioRes.res == 0) {
            this.checkFaile[1] = false;
          }
          //断号检查
          if (JSON.parse(res.CkeckBreakNo).Status == 'success') {
            this.checkFaile[2] = false;
          }
          this.checkFaile[3] = false; //时序检查不需要

          //年末结转检查
          if (res.CarryOverCheck) {
            if (JSON.parse(res.CarryOverCheck).incomeCheck == 0) {
              this.checkFaile[4] = false;
            }
            if (JSON.parse(res.CarryOverCheck).outlayCheck == 0) {
              this.checkFaile[5] = false;
            }
          } else {
            this.checkFaile[4] = false;
            this.checkFaile[5] = false;
          }

          this.checkOutCss = true;
          for (var che of this.checkFaile) {
            if (che) {
              this.checkOutCss = false;
            }
          }
          this.checkCss = true;
        })
        .catch(err => { this.$message({ showClose: true, message: '检查出错了！', type: "error" }); loading.close() })

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
          if (res.Record.length == 0) {
            this.saasMessage = {
              message: '当前组织未初始化!',
              delay: 4000,
              visible: true
            }

            return;
          }
          this.checkedTime = res.Record[0].JAccountPeriod + 1;
          this.year = res.Record[0].JYear;
          if (!this.checkVal) {
            this.month = this.checkedTime;
          } else {
            this.month = this.checkVal;
          }

        }, err => {
          loading.close()
          console.log(err);

        })
        .catch(err => { this.$message({ showClose: true, message: err, type: "error" }); loading.close() })
    },
    //结账功能**********************
    checkOut (str, val) {
      var t;
      var url;
      var vm = this;
      if (str == 'check') {
        url = '/PBusinessConfig/UpdateBusinessConfig';
      } else if (str == 'uncheck') {
        if (this.unCheckVal > this.checkedTime - 1) {
          this.saasMessage = {
            message: '当前月份还未结账,无法反结账!',
            visible: true
          }
          return;
        }
        url = '/PBusinessConfig/UnUpdateBusinessConfig';
      }
      t = this.year + '-' + val
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

            this.$emit('child-click', 'success');
          } else {
            this.$message({ showClose: true, message: res.Msg, type: "error" });
          }
        }, err => {
          loading1.close();
          console.log(err);

        })
        .catch(err => { loading1.close(); this.$message({ showClose: true, message: err, type: "error" }); })
    },

    checkNavShow (str) {//切换页面功能*************
      this.checkNav = str;
      if (str == 'audit') {
        this.getvoucherList('audit');
      } else if (str == 'codeReset') {
        this.getvoucherList();
      }
    },
    //审核*****************
    audit (bool, PhIds) {
      // var chooseItem=JSON.stringify(this.chooseItem);
      // var item=JSON.parse(chooseItem); 
      // console.log(222)             
      // if(item.PhId<=0){
      //     this.$message("请先选择凭证!");
      //     return;
      // }
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        uname: this.uname,
        infoData: PhIds
      }
      var url = 'PVoucherMst/PostAudit';
      if (!bool) {
        url = 'PVoucherMst/PostUnAudit'
      }
      const loading = this.$loading();
      this.$axios.post(url, data)
        .then(res => {
          loading.close();
          if (res.Status == 'success') {
            if (bool) {
              this.saasMessage = {
                visible: true,
                delay: 3000,
                message: '审核成功!'
              };
              this.checkNav = 'month';
              this.matchBegin();
              //this.getvoucherList('audit');
            } else {
              this.saasMessage = {
                visible: true,
                delay: 3000,
                message: '反审核成功!'
              };
              this.getvoucherList('audit');
            }
          } else {
            if (bool) {
              this.saasMessage = {
                visible: true,
                delay: 3000,
                message: '审核失败!'
              };
            } else {
              this.saasMessage = {
                visible: true,
                delay: 3000,
                message: '反审核失败!'
              };
            }
          }
        }, err => {
          loading.close();
          console.log(err);

        })
        .catch(err => { this.$message({ showClose: true, message: err, type: "error" }), loading.close(); })
    },
    //凭证号重排确认***************
    resetCode (val) {
      if (val) {
        const loading5 = this.$loading();
        var data = {
          orgid: this.orgid,
          Year: this.year,
          Pmonth: this.month
        }
        var url = '/PVoucherMst/GetRebuilder';
        if (this.checkVal) {
          url = 'PVoucherMst/GetRebuilderForAllYear';
        }
        this.$axios.get(url, { params: data })
          .then(res => {
            loading5.close();
            if (res.Status == 'error') {
              this.saasMessage = {
                message: res.Msg,
                visible: true,
                delay: 4000
              };
            } else if (res.Status == 'success') {
              this.checkNav = 'month';
              this.saasMessage = {
                message: '重排成功!',
                visible: true,
                delay: 4000
              };
              this.matchBegin();
            }

          }, err => {
            loading5.close();
            console.log(err);

          })
          .catch(err => { this.$message({ showClose: true, message: err, type: "error" }); loading5.close(); })
      } else {
        this.resetShow = false;
      }
    },
    //凭证列表***************高级搜索***********************
    getvoucherList (str) {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        pageindex: this.pageindex - 1,
        pagesize: this.pagesize,
        sum1: '',
        sum2: '',
        keyword: '',
        export2excel: str,
        sort: ['PDate ASC', 'PType', 'PNo ASC'],
        // itemValuePhid:649181122000008,
        itemValuePhid: '',
        queryfilter: {
          //未审核****   "PAuditor*num*eq*1":0,
          //已审核****    "PAuditor*num*ge*1":0, 
          "PAccper*str*ge*1": this.year.toString() + (this.month > 9 ? this.month : ('0' + this.month)).toString(),
          "PAccper*str*le*1": this.year.toString() + (this.month > 9 ? this.month : ('0' + this.month)).toString()
        }
      }
      if (str == 'audit') {
        data.pagesize = this.pagesize2;
        data.pageindex = this.pageindex2 - 1;
        data.queryfilter = {
          "Verify*byte*eq*1": 0,  //未审核****
          //已审核****    "Verify*byte*eq*1":1,
          "PAccper*str*ge*1": this.year.toString() + (this.month > 9 ? this.month : ('0' + this.month)).toString(),
          "PAccper*str*le*1": this.year.toString() + (this.month > 9 ? this.month : ('0' + this.month)).toString()
        };
      }
      if (this.checkVal) {
        data.queryfilter["PAccper*str*ge*1"] = this.year.toString() + '01';
      }
      this.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.saasMessage = {
              visible: true,
              message: res.Msg,
            }
            return;
          }

          if (res.Record.length <= 0) {
            //this.$message('无法找到凭证!');
            this.voucherList = [];

            if (str == 'audit') {
              this.total2 = 0;
            } else {
              this.total = 0;
            }
          } else {
            this.voucherList = res.Record;
            if (str == 'audit') {
              this.total2 = res.totalRows;
            } else {
              this.total = res.totalRows;
            }
          }


        }, err => {
          console.log(err);

        })
        .catch(err => { this.$message({ showClose: true, message: '获取列表失败!', type: "error" }); })
    },
  },
  filters: {
    sum (val, dtl) {
      var sum = 0;
      var fu = '';
      if (!dtl) {
        dtl = []
      }
      function Num (value) {
        if (!value || (value == 0)) return '';
        /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
        var intPart = Number(value) | 0; //获取整数部分
        var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
        var floatPart = ".00"; //预定义小数部分
        var value2Array = value.toString().split(".");
        //=2表示数据有小数位
        if (value2Array.length == 2) {
          floatPart = value2Array[1].toString(); //拿到小数部分

          if (floatPart.length == 1) { //补0,实际上用不着
            return intPartFormat + "." + floatPart + '0';
          } else {
            return intPartFormat + "." + floatPart;
          }

        } else {
          return intPartFormat + floatPart;
        }

      }
      switch (val) {
        case 'jie':
          for (var d of dtl) {
            if (d.JSum) {
              sum = (sum * 100 + parseFloat(d.JSum) * 100) / 100;
            }
          }
          sum = Num(sum);
          break;
        case 'dai':
          for (var d of dtl) {
            if (d.DSum) {
              sum = (sum * 100 + parseFloat(d.DSum) * 100) / 100;
            }
          }
          sum = Num(sum);
          break;
        case 'sum':
          for (var d of dtl) {
            if (d.JSum) {
              sum = (sum * 100 + parseFloat(d.JSum) * 100) / 100;
            }
          }
          if (sum < 0) {
            sum = -1 * sum;
            fu = '(负数)'
          }
          sum = sum.toFixed(2);
          var arr1 = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];
          var arr2 = ['', '拾', '佰', '仟', '万', '亿'];
          var str = sum.toString().split('.');
          var dot = '元';
          var INTstr = str[0];
          var INT = '';
          var bool = false;
          var zero = '';
          if (parseInt(str[0]) == 0) {
            dot = ""
          }
          if (parseInt(str[1]) != 0) {
            dot += arr1[str[1][0]] + '角';
            if (str[1][1] != 0) {
              dot += arr1[str[1][1]] + '分'
            }
          } else {
            dot += '整'
          }
          for (var i = INTstr.length - 1, j = 0; i >= 0; i-- , j++) {
            if (INTstr[i] != 0) {
              bool = true;
            }
            if (j == 4) {
              INT = arr2[j] + INT;
            } else if (j == 8) {
              INT = arr2[5] + INT;
            }
            if (bool) {
              if (INTstr[i] != 0) {
                if (zero == '零') {
                  zero = '';
                }
                if (j == 4) {
                  INT = arr1[INTstr[i]] + INT;
                  bool = false;
                } else if (j == 8) {
                  INT = arr1[INTstr[i]] + INT;
                } else {
                  INT = arr1[INTstr[i]] + arr2[j % 4] + INT;
                  bool = false;
                }
              } else {
                if (zero == '') {
                  INT = '零' + INT;
                  zero = '零';
                }
                if (j == 4) {
                  INT = arr2[j] + INT;
                  bool = false;
                } else if (j == 8) {
                  INT = arr2[5] + INT;
                  bool = false;
                }
              }
            }
          }
          sum = fu + INT + dot;
          break;
      }

      return sum;


    },

    //数字转换******************
    NUmTurn (value) {
      if (!value) return '';
      /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
      var intPart = Number(value) | 0; //获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断


      var floatPart = ".00"; //预定义小数部分
      var value2Array = value.toString().split(".");

      //=2表示数据有小数位
      if (value2Array.length == 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分

        if (floatPart.length == 1) { //补0,实际上用不着
          return intPartFormat + "." + floatPart + '0';
        } else {
          return intPartFormat + "." + floatPart;
        }

      } else {
        return intPartFormat + floatPart;
      }
    },
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgcode: state => state.user.orgcode,
      orgname: state => state.user.orgName,
      Roleauthorize: state => state.user.Roleauthorize,//按钮权限
      autoSetting: state => state.user.autoSetting,//自动备份设置
    })
  },
  components: {
    voucher,
    overMsg
  }
}
</script>

<style lang="scss" scoped>
.nextMonthCheck {
  background: rgba(0, 0, 0, 0.5);

  position: fixed;
  position: -ms-page;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  overflow-y: auto;
  > div:last-of-type {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
  }
  > .container {
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    padding: 10px 30px;
    width: 850px;
    min-height: 380px;
    border-radius: 10px;
    box-shadow: 0 0 10px 2px #444;
    text-align: left;
    > p {
      font-size: 20px;
      font-weight: 800;
      padding: 5px 5px 10px 5px;
      border-bottom: 1px solid #ccc;
      > i {
        cursor: pointer;
        width: 25px;
        height: 25px;
        background: url("../../assets/icon/close.svg");
        background-size: cover;
      }
    }
    > ul {
      padding: 25px 30px;
      border-bottom: 1px solid #ccc;
      > li {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        font-size: 18px;
        font-weight: 600;
        position: relative;
        > div {
          width: 46px;
          height: 46px;
          background: #fc9f8b;
          line-height: 46px;
          text-align: center;
          margin-right: 20px;
          > img {
            width: 28px;
            height: 28px;
            vertical-align: middle;
          }
        }
        &:nth-of-type(2) {
          > div {
            background: #4faed2;
          }
        }
        &:nth-of-type(3) {
          > div {
            background: #fb7798;
          }
        }
        > ul {
          list-style: circle;
          padding-left: 70px;
          margin: -10px 0;
          font-weight: normal;
          font-size: 17px;
          > li {
            margin-bottom: 5px;
            &.checkFaile {
              color: red;
            }
          }
        }
      }
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      > span {
        margin-left: 40px;
        margin-top: 8px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }
}
.checkRight {
  position: absolute;
  right: 40px;
  color: #00b7ee;
  border: 2px solid #00b7ee;
  font-weight: 400;
  font-size: 16px;
  padding: 3px 10px;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: #00b7ee;
  }
}
.audit {
  height: 80%;
  width: 85%;
  min-width: 868px;
  background: #fff;
  position: absolute;
  left: 5%;
  top: 100px;
  padding: 5px 15px;
  > .title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #ccc;
    > span {
      float: left;
    }
    > i {
      float: right;
      margin-top: 10px;
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
  > p.auditCheck {
    height: 50px;
    line-height: 50px;
    > span {
      float: right;
      width: 80px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      margin-top: 10px;
      margin-right: 30px;
      color: #fff;
      border-radius: 4px;
      background: #00b7ee;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:after {
        content: "";
        clear: both;
        display: block;
      }
    }
  }
}

.listContainer {
  max-height: 70%;
  overflow-y: auto;
  padding: 5px;
  margin-top: 10px;
  padding-bottom: 20px;
}
.listContainer ul.listTitle {
  display: flex;
  background: #d3e9f9;
  color: #333;
}
.listContainer ul.listTitle li {
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.listContainer ul.listTitle li:first-of-type {
  width: 5%;
}
.listContainer ul.listTitle li:nth-of-type(2) {
  width: 31%;
}
.listContainer ul.listTitle li:nth-of-type(3) {
  width: 26%;
}
.listContainer ul.listTitle li:nth-of-type(4) {
  width: 19%;
}
.listContainer ul.listTitle li:nth-of-type(5) {
  width: 19%;
}
ul.listContent {
  border-top: 1px solid #ccc;
  margin-bottom: 20px;
  background: #fff;
}
ul.listContent.choosed > li > ul.listIndex {
  background: #d3e9f9;
  color: #333;
}

ul.listContent > li {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  align-items: center;
  position: relative;
}
ul.listContent > li > ul.listIndex {
  margin: 0;
  border: 1px solid #ccc;
  border-top: 0;
  height: 100%;
  width: 5%;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
}
ul.listContent > li > ul.listIndex > li:first-of-type {
  border: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
ul.listContent > li > ul {
  height: 100%;
  width: 95%;
  margin-left: 5%;
}
ul.listContent > li > ul > li {
  display: flex;
  justify-content: flex-start;
  height: 30px;
  line-height: 30px;
}
ul.listContent > li > ul > li:first-of-type {
  padding: 0 10px;
  border: 1px solid #ccc;
  border-top: 0;
  border-left: 0;
}
ul.listContent > li > ul > li:first-of-type > span {
  margin-right: 50px;
}
ul.listContent > li > ul > li > div {
  text-align: left;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-top: 0;
  border-left: 0;
}
ul.listContent > li > ul > li div:first-of-type {
  width: 32%;
}
ul.listContent > li > ul > li div:nth-of-type(2) {
  width: 28%;
}
ul.listContent > li > ul > li div:nth-of-type(3) {
  width: 20%;
}
ul.listContent > li > ul > li div:nth-of-type(4) {
  width: 20%;
}

ul.listContent > li > ul > li:last-of-type > div {
  text-align: left;
  border: 1px solid #ccc;
  border-top: 0;
  border-left: 0;
  width: 20%;
}
ul.listContent > li > ul > li:last-of-type > div:first-of-type {
  width: 60%;
}
ul.listContent > li > ul:nth-of-type(2) > li > div:nth-last-of-type(1),
ul.listContent > li > ul:nth-of-type(2) > li > div:nth-last-of-type(2) {
  text-align: right;
}

ul.listContent > li > ul:nth-of-type(2) > li:last-of-type > div {
  padding-left: 10%;
}
.wrapKemu {
  height: 30px;
  font-size: 14px;
}
ul.listContent > li > ul > li div.wrapKemu > div {
  width: 100%;
  height: 30px;
  overflow-y: auto;
}

.ul.listContent > li > ul > li > div {
  text-align: left;
  overflow-y: auto;
}
.voucherMask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden auto;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  > div {
    display: inline-block;
    vertical-align: middle;
    width: 80%;
    overflow: hidden;
    text-align: left;
    border-radius: 4px;
    padding: 10px;
    background: #fff;
  }
  &:after {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 0;
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
</style>
