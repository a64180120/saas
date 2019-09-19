<template>
  <div class="container dayAccount">
    <div class="voucherList">
      <section class="listContainer">
        <div style="height:40px;min-width:1160px;padding-left: 25px;font-size: 16px">
          <div style="float:left;">
            <div style="float:left;width:50px;text-align:center;font-size:18px;height: 30px;line-height: 30px">账户</div>
            <div class="selectContainer"
                 style="float:left;margin-right:5px;">
              <select name="type"
                      id="type"
                      v-model="account.type"
                      @change="getData()">
                <option v-for="type of accountTypeList"
                        :value="type"
                        :key="type.PhId">{{type.Name}}</option>
              </select>
            </div>
            <el-select placeholder="剔除条件"
                       value="剔除条件"
                       style="width: 100px;position: relative;">
              <el-option value="0">
                <el-checkbox @change="getData"
                             v-model="account.voucher.noP">未生成凭证</el-checkbox>
                <el-checkbox @change="getData"
                             v-model="account.voucher.yesP">已生成凭证</el-checkbox>
                <el-checkbox @change="getData"
                             v-model="account.enable">禁用账户</el-checkbox>
              </el-option>
            </el-select>
            <div style="position:relative;width:115px;height:30px;display: none">
              <ul class="colSelect"
                  :class="{colSelectActive:colSelectActive}">
                <li @click.stop="colSelectActive=!colSelectActive">显示列名</li>
                <li>
                  <el-checkbox @change="localStorageInfo"
                               v-model="accountshowCNo">流水号</el-checkbox>
                </li>
                <li>
                  <el-checkbox @change="localStorageInfo"
                               v-model="accountshowCAccountName">对方账户名称</el-checkbox>
                </li>
                <li>
                  <el-checkbox @change="localStorageInfo"
                               v-model="accountshowCAccount">对方账户</el-checkbox>
                </li>
                <li>
                  <el-checkbox @change="localStorageInfo"
                               v-model="accountshowCBank">对方银行</el-checkbox>
                </li>
              </ul>
            </div>

          </div>
          <div class="voucherNav">
            <ul>
              <li @click.stop="refresh"
                  class="el-icon-refresh"
                  style='font-size:27px;color:#00b7ee;width:30px'></li>
              <li @click.stop="printPageShow"
                  v-show="!update"
                  class="btn">打印</li>
              <li @click.stop="download"
                  v-show="!update"
                  class="btn">导出</li>
              <li @click.stop="fileVisible=true"
                  v-show="!update"
                  class="btn">导入</li>
              <li @click.stop="deleteRow"
                  v-show="!update"
                  class="btn">删除</li>
              <li @click.stop="updatePage"
                  v-show="!update"
                  class="btn">编辑</li>
              <li @click.stop="updateFinish(true)"
                  v-show="update"
                  class="btn">保存</li>
              <li @click.stop="updateFinish(false)"
                  v-show="update"
                  class="btn">取消</li>
            </ul>
          </div>
          <div class="voucherSelect">

            <!-- <div>

                            <el-checkbox v-model="listInverse">反选</el-checkbox>
                        </div> -->
            <div class="searcherCon">
              <div @click.stop="getData"
                   class="searcherBtn">搜索</div>
              <div class="searcherValue"><input @keyup.13="getData"
                       v-model="searchVal"
                       type="text"
                       placeholder="摘要/对方账户名称/对方账号"></div>
            </div>

          </div>
        </div>

        <div class="listOver listFont">

          <ul>
            <li>
              <ul>
                <li>
                  <el-checkbox v-model="listAll"
                               style="margin-right:5px"></el-checkbox>行号
                </li>
                <li :class="col.code"
                    v-for="(col,ind) of colList"
                    :key="ind">{{col.name}}</li>
              </ul>
            </li>
            <li style="position:relative"
                v-for="(item,index) of dataList"
                :key="index">
              <div v-if="update&&index!=0"
                   class="addIconCon">
                <span @click.stop="addrow()"
                      class="addIcon"></span>
                <span @click.stop="addrow(item,index)"
                      class="deleteIcon"></span>
              </div>
              <ul>
                <li>
                  <el-checkbox @change="listChoose($event,item)"
                               v-model="item.checked"
                               style="margin-right:5px"></el-checkbox>{{index+1}}
                </li>
                <li :class="col.code"
                    v-for="(col,ind) of colList"
                    :key="ind">
                  <div v-if="col.prop=='VoucherMark'&&index!=0"
                       style="text-align: center">
                    <div v-if="item[col.prop]==0&&item.PhId"
                         @click.stop="showVoucher('add',item)"
                         class="btn">生成凭证</div>
                    <div v-else-if="item[col.prop]==1">
                      <span @click.stop="showVoucher('update',item.VoucherPhid)"
                            style="cursor:pointer;text-decoration-line: underline;color:#00b7ee">{{item.VoucherNo}}</span>
                      <span @click.stop="deleteConfirm(item.VoucherPhid)"
                            style="font-size:18px;margin-left:20px;cursor:pointer;text-decoration-line: underline;color:red">删除</span>
                    </div>
                  </div>
                  <div v-else-if="col.prop=='CDate'&&index!=0&&update">
                    <el-date-picker v-model="item[col.prop]"
                                    type="date">
                    </el-date-picker>
                  </div>
                  <div v-else>
                    <div :title="item[col.prop]"
                         v-show="!update||(index==0&&col.prop=='CAbstract')||col.prop=='Balance'">{{col.prop=='CDate'?item[col.prop].slice(0,10):item[col.prop] | NUmTurn}}</div>
                    <div v-show="update&&index!=0&&col.prop!='Balance'"
                         class="inputContainer">
                      <input v-model="item[col.prop]"
                             type="text">
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            <li>

              <ul>
                <li></li>
                <li :class="col.code"
                    v-for="(col,index) of colList"
                    :key="index">
                  <span v-if="col.prop=='CAbstract'">合计</span>
                  <div v-if="col.prop=='JSum'">
                    {{inSum | NUmTurn}}
                  </div>
                  <div v-if="col.prop=='DSum'">
                    {{outSum | NUmTurn}}
                  </div>

                </li>
              </ul>
            </li>
          </ul>

        </div>

        <div class="hideScroll"></div>
      </section>
    </div>

    <!-- 年度选择 -->
    <div class="timeContainer">
      <side-time @time-click="getSideDate"
                 :timeType="'timeType'"
                 ref='sideDate'></side-time>
    </div>
    <!--打印预览-->
    <div v-if="printCss"
         class="printCssBG">
      <div class="printTitle">
        <p>
          <span>打印预览</span>
          <span @click.stop="print">打印</span>
          <span @click.stop="printCss=false">取消 </span>

        </p>
      </div>
      <div class="listOver printCss"
           ref="accountPrint">

        <ul>
          <li>
            <ul>
              <li style="padding-left:5px">行号</li>
              <li :class="col.code"
                  v-for="(col,ind) of colList"
                  :key="ind">{{col.name}}</li>
            </ul>
          </li>
          <li style="position:relative"
              v-for="(item,index) of dataList"
              :key="index">
            <div v-show="update&&index!=0"
                 class="addIconCon">
              <span @click.stop="addrow()"
                    class="addIcon"></span>
              <span @click.stop="addrow(item,index)"
                    class="deleteIcon"></span>
            </div>
            <ul>
              <li style="padding-left:5px">{{index+1}}</li>
              <li :class="col.code"
                  v-for="(col,ind) of colList"
                  :key="ind">
                <div v-if="col.prop=='VoucherMark'&&index!=0"
                     style="text-align: center">

                  <div>
                    <span style="cursor:pointer;text-decoration-line: underline;">{{item.VoucherNo}}</span>
                  </div>
                </div>
                <div v-else-if="col.prop=='CDate'&&index!=0&&update">
                  <el-date-picker v-model="item[col.prop]"
                                  type="date"
                                  @change="timeTurn($event,item)">
                  </el-date-picker>
                </div>
                <div v-else>
                  <div :title="item[col.prop]"
                       v-show="!update||(index==0&&col.prop=='CAbstract')||col.prop=='Balance'">{{col.prop=='CDate'?item[col.prop].slice(0,10):item[col.prop] | NUmTurn}}</div>
                  <div v-show="update&&index!=0&&col.prop!='Balance'"
                       class="inputContainer">
                    <input v-model="item[col.prop]"
                           type="text">
                  </div>
                </div>
              </li>
            </ul>
          </li>
          <li>

            <ul>
              <li>合计</li>
              <li :class="col.code"
                  v-for="(col,index) of colList"
                  :key="index">
                <div v-if="col.prop=='JSum'">
                  {{inSum | NUmTurn}}
                </div>
                <div v-if="col.prop=='DSum'">
                  {{outSum | NUmTurn}}
                </div>

              </li>
            </ul>
          </li>
        </ul>

      </div>
    </div>
    <!--凭证弹窗-->
    <!-- 弹出凭证********************* -->
    <div v-if="voucherMask"
         class="voucherMask">
      <div class="voucherContainer">
        <p v-if="voucherMask"
           class="title"><span>凭证查看</span>
          <span></span>
          <i @click="voucherMask=''"></i>
        </p>
        <div style="height:40px;text-align: right;padding:10px;">
          <span v-if="voucherMask=='update'"
                class="btn"
                @click.stop="deleteConfirm(voucherDataList.data.Mst.PhId)">删除</span>
          <span v-if="voucherMask=='add'"
                class="btn"
                @click.stop="keepVoucher(voucherMask)">保存</span>
        </div>
        <div v-if="voucherMask"
             class="voucherDisabledCon">
          <voucher :AbstractList="AbstractList"
                   :disabled2="disabled2"
                   :disabled="disabled"
                   :vouSubjectlist="vouSubjectlist"
                   :sideDate='sideDate'
                   :dataList="voucherDataList"
                   :balanceBool="getBalanceBool"
                   v-if="voucherDataList.bool"
                   ref="voucher">

          </voucher>
        </div>
      </div>
    </div>
    <!--附件-->
    <el-dialog title="选择附件"
               custom-class="fileDialog"
               :modal=true
               :visible.sync="fileVisible"
               width="540px">
      <file-upload @closeUpload="closeUpload"
                   @uploadimg="uploadfile"
                   :imgList="filelist"
                   :accountInfo="account.type"
                   :limit="1"
                   @removeimg="removefile"></file-upload>
      <a :href="modelFileUrl"
         target="_blank"
         style="position: absolute;top: 65px;right: 10px;"
         class="btn"
         @click="downloadModel">下载模板</a>
      <div style="clear:both"></div>
    </el-dialog>
    <message :message="saasMessage.message"
             :visible.sync="saasMessage.visible">
    </message>
    <saasconfirm :message="confirm.message"
                 :btn1="confirm.btn1"
                 :btn2="confirm.btn2"
                 :type="confirm.type"
                 :data="confirm.data"
                 :visible.sync="confirm.visible"
                 @ok-click="confirmOk"
                 @no-click="confirmNo">
    </saasconfirm>
  </div>
</template>

<script>
import voucher from '../finance/voucher'
import { cashierUpdate, getDataList, getCashierAccount, getSubject, getAbstract } from '@/api/cashier'
import sideTime from '../finance/sideTime'
import fileUpload from "@/components/upload/accountUPload";
import { mapState, mapActions } from 'vuex'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
export default {
  name: "dayAccount",
  data () {
    return {
      checkedTime: '',
      checkedYear: '',
      sideDate: '',
      year: '',
      month: '',
      searchVal: '',
      chooseItem: [],//选中行
      update: false,//修改编辑状态
      listAll: false, //全选
      accountTypeList: [],//账户列表
      colSelectActive: false,//显示列名激活
      account: {  //筛选条件
        type: {},
        voucher: {
          noP: false,
          yesP: false
        },
        enable: true

      },
      accountshowCNo: true,
      accountshowCAccountName: true,
      accountshowCAccount: true,
      accountshowCBank: true,
      colList: [    //列名
        { code: 'col_date', name: '日期', prop: 'CDate' },
        { code: 'col_liush', name: '流水号', prop: 'CNo' },
        { code: 'col_abs', name: '摘要', prop: 'CAbstract' },
        { code: 'col_duifzhmc', name: '对方账户名称', prop: 'CAccountName' },
        { code: 'col_duifzh', name: '对方账号', prop: 'CAccount' },
        { code: 'col_duifyh', name: '对方银行', prop: 'CBank' },
        { code: 'col_in', name: '收入(元)', prop: 'JSum' },
        { code: 'col_out', name: '支出(元)', prop: 'DSum' },
        { code: 'col_yue', name: '余额(元)', prop: 'Balance' },
        { code: 'col_voucher', name: '凭证', prop: 'VoucherMark' },
        { code: 'col_msg', name: '备注', prop: 'CRemark' }
      ],
      dataList: [
        // 账户主键:AccountPhid
        // 所属组织ID:OrgId
        // 所属组织编码:OrgCode
        // 日期:CDate
        // 流水号:CNo
        // 摘要:CAbstract
        // 对方账户名称:CAccountName
        // 对方账号:CAccount
        // 对方银行:CBank
        // 收入(借):JSum
        // 支出(贷):DSum
        // 是否生成凭证:VoucherMark
        // 凭证ID:VoucherPhid
        // 凭证号:VoucherNo
        // 备注:CRemark
        // 删除标识:DeleteMark
        // 有效标识:EnabledMark
        // 排序:SortCode

      ],
      inSum: '',
      outSum: '',
      deleteList: [],//编辑时删除的行
      saasMessage: {
      },
      confirm: {

      },
      voucherMask: false,//显示凭证
      cashierForVoucher: {},//新增凭证时选中的行
      voucherDataList: { bool: false, data: { Mst: '', Attachements: [] } },
      AbstractList: [],
      vouSubjectlist: [],
      disabled2: false,
      disabled: false,
      getBalanceBool: false,
      filelist: [],//附件
      fileVisible: false,
      modelFileUrl: '',
      printCss: false//打印
    }
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      orgcode: state => state.user.orgcode,
    })
  },

  activated () {
    this.getCashiers();
    // this.accountshowCNo=JSON.parse(localStorage.accountshowCNo)==false?false:true//取本地缓存
    //
    //
    // this.accountshowCAccountName=JSON.parse(localStorage.accountshowCAccountName)==false?false:true//取本地缓存
    //
    //
    // this.accountshowCAccount=JSON.parse(localStorage.accountshowCAccount)==false?false:true//取本地缓存
    //
    //
    // this.accountshowCBank=JSON.parse(localStorage.accountshowCBank)==false?false:true//取本地缓存

  },
  watch: {
    listAll (val) {

      if (val) {
        for (let che of this.dataList) {
          this.$set(che, 'checked', val);
        }
        this.chooseItem = JSON.parse(JSON.stringify(this.dataList));
      } else if (this.dataList.every((val, index, arr) => {
        return val.checked == true;
      })) {
        this.chooseItem = [];
        for (var vou of this.dataList) {
          vou.checked = val;
        }
      }
    },
    'account.enable' (val) {
      this.getCashiers();
    },


  },
  methods: {
    //确认框btn1方法**********
    confirmOk (type, data) {
      this.confirm.visible = false;
      let vm = this;
      var item = JSON.parse(JSON.stringify(this.chooseItem));
      switch (type) {
        case 'delete':
          this.singleDelete(JSON.parse(data));
          this.voucherMask = '';
          break;
        case 'balance':
          this.keepVoucher(data);
          break;
        case 'deleteRow':
          this.deleteRowConfirm(vm, JSON.parse(data));
          break;
      }
    },
    //确认框btn2方法**********
    confirmNo (type) {
      this.confirm.visible = false;
      switch (type) {
        case 'delete':

          break;
        case 'deleteRow':
          break;
      }
    },
    //刷新
    refresh () {
      this.account.voucher.noP = false;
      this.account.voucher.yseP = false;
      this.searchVal = '';
      this.getData();
      this.getCashiers();
    },
    //本地数据缓存\
    localStorageInfo () {
      // var  vm = this;
      // localStorage.setItem('accountshowCNo',JSON.stringify(vm.accountshowCNo));
      // localStorage.setItem('accountshowCAccountName',JSON.stringify(vm.accountshowCAccountName));
      // localStorage.setItem('accountshowCAccount',JSON.stringify(vm.accountshowCAccount));
      // localStorage.setItem('accountshowCBank',JSON.stringify(vm.accountshowCBank));
      // this.$nextTick(this.initCss);
    },
    //显示列
    initCss () {

      // this.accountshowCNo=JSON.parse(localStorage.accountshowCNo)==false?false:true//取本地缓存
      //
      //
      // this.accountshowCAccountName=JSON.parse(localStorage.accountshowCAccountName)==false?false:true//取本地缓存
      //
      //
      // this.accountshowCAccount=JSON.parse(localStorage.accountshowCAccount)==false?false:true//取本地缓存
      //
      //
      // this.accountshowCBank=JSON.parse(localStorage.accountshowCBank)==false?false:true//取本地缓存

      var Cno = document.getElementsByClassName('col_liush');
      var CAccount = document.getElementsByClassName('col_duifzh');
      var CAccountName = document.getElementsByClassName('col_duifzhmc');
      var CBank = document.getElementsByClassName('col_duifyh');
      if (this.accountshowCNo == false) {

        for (let li of Cno) {
          li.style.display = 'none';
        }
      } else {
        for (let li of Cno) {
          li.style.display = 'block';
        }
      }
      if (this.accountshowCAccount == false) {

        for (let li of CAccount) {
          li.style.display = 'none';
        }
      } else {
        for (let li of CAccount) {
          li.style.display = 'block';
        }
      }
      if (this.accountshowCAccountName == false) {

        for (let li of CAccountName) {
          li.style.display = 'none';
        }
      } else {
        for (let li of CAccountName) {
          li.style.display = 'block';
        }
      }
      if (this.accountshowCBank == false) {

        for (let li of CBank) {
          li.style.display = 'none';
        }
      } else {
        for (let li of CBank) {
          li.style.display = 'block';
        }
      }
      this.$forceUpdate();
    },
    //打印预览显示
    printPageShow () {
      this.printCss = true;
      this.$nextTick(this.printInitCss);
    },
    //
    updatePage () {
      this.update = true;
      if (this.dataList.length == 1) {
        let val = new Date();
        this.dataList.push(
          {
            AccountPhid: this.account.type.PhId,
            OrgId: this.orgid,
            OrgCode: '',
            CDate: val,
            CNo: '',
            CAbstract: '',
            CAccountName: '',
            CAccount: '',
            CBank: '',
            JSum: '',
            DSum: '',
            VoucherMark: '',
            VoucherPhid: '',
            VoucherNo: '',
            CRemark: '',
          }
        )
        this.$nextTick(this.initCss)
      } else {
        this.dataList.map((data, i) => {
          let date = data.CDate;
          let year = '', month = '', day = '';
          if (i > 0 && typeof date == 'string') {
            year = date.slice(0, 4);
            month = date.slice(5, 7);
            day = date.slice(8, 10);
            console.log(year, month, day)
            data.CDate = new Date(year, month - 1, day)

          }
        })
      }
    },
    //打印显示列
    printInitCss () {
      var Cno = document.querySelectorAll('.printCss .col_liush');
      var CAccount = document.querySelectorAll('.printCss .col_duifzh');
      var CAccountName = document.querySelectorAll('.printCss .col_duifzhmc');
      var CBank = document.querySelectorAll('.printCss .col_duifyh');
      for (let li of Cno) {
        li.style.display = 'none';
      }
      for (let li of CAccount) {
        li.style.display = 'none';
      }
      for (let li of CAccountName) {
        li.style.display = 'none';
      }
      for (let li of CBank) {
        li.style.display = 'none';
      }
      this.$forceUpdate();
    },
    //获取time组件传参********************
    getSideDate (data) {
      this.checkedTime = data.checkedTime;
      this.checkedYear = data.checkedYear;
      this.sideDate = data.sideDate;
      this.year = this.sideDate.split('-')[0];
      this.month = this.sideDate.split('-')[1];
      this.getData();
      this.getSubjectList();
      this.getAbstractList();
    },
    //获取页面数据***************
    getData () {
      var vm = this;
      let param = {
        orgid: this.orgid,
        CAbstract: vm.searchVal,
        year: this.year,
        month: this.month,

      }
      if (this.account.type) {
        param.AccountPhid = this.account.type.PhId;
      }
      if (this.account.voucher.noP && !this.account.voucher.yesP) {
        param.VoucherMark = 1;
      } else if (this.account.voucher.yesP && !this.account.voucher.noP) {
        param.VoucherMark = 0;
      } else {
        param.VoucherMark = 2;
      }
      getDataList(vm, param)
        .then(res => {

          if (res.Status == 'error') {
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
            return;
          }
          this.dataList = res;
          this.infoSum();
          this.update = false;
          for (let da of this.dataList) {
            da.checked = false;
          }
          // this.accountshowCNo=true;
          //
          //
          // this.accountshowCAccountName=JSON.parse(localStorage.accountshowCAccountName)==false?false:true//取本地缓存
          //
          //
          // this.accountshowCAccount=JSON.parse(localStorage.accountshowCAccount)==false?false:true//取本地缓存
          //
          //
          // this.accountshowCBank=JSON.parse(localStorage.accountshowCBank)==false?false:true//取本地缓存
          // this.$nextTick(this.initCss);
          this.deleteList = [];
        })
        .catch(err => {
          this.saasMessage = {
            message: '获取列表信息失败!',
            visible: true
          }
        })
    },
    //合计金额
    infoSum () {
      var vm = this;
      vm.outSum = vm.inSum = 0;
      for (let da of vm.dataList) {
        vm.inSum = parseFloat(da.JSum) + parseFloat(vm.inSum);
        vm.outSum = parseFloat(da.DSum) + parseFloat(vm.outSum);
      }
      vm.inSum = vm.inSum.toFixed(2);
      vm.outSum = vm.outSum.toFixed(2);
    },
    //获取账户列表
    getCashiers () {
      let vm = this;
      let param = {
        orgid: this.orgid,
        value: this.account.enable ? 1 : 0
      }
      getCashierAccount(vm, param)
        .then(res => {
          if (res.Status == 'error') {
            this.saasMessage = {
              visible: true,
              message: res.Msg
            }
            return;
          }
          this.accountTypeList = res;
          vm.$set(vm.account, 'type', res[0]);
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取科目
    getSubjectList () {
      let vm = this;
      let param = {
        orgid: this.orgid,
        Ryear: this.sideDate.slice(0, 4)
      }
      getSubject(vm, param)
        .then(res => {
          if (res.Status == 'error') {
            this.saasMessage = {
              visible: true,
              message: res.Msg
            }
            return;
          }
          this.vouSubjectlist = res;
        })
        .catch(err => {
          console.log(err);
          this.saasMessage = {
            message: '获取科目列表失败',
            visible: true
          };
        })

    },
    //获取摘要模板
    getAbstractList () {
      let vm = this;
      getAbstract(vm).then(res => {
        if (res.Status == 'success') {
          this.AbstractList = res.Data;
        } else {
          this.saasMessage = {
            message: res.Msg,
            visible: true
          };
        }
      }).catch(err => {
        console.log(err);
        this.saasMessage = {
          message: '获取摘要模板失败',
          visible: true
        };
      })
    },
    //打开凭证
    showVoucher (str, data) {
      if (str == 'add') {
        this.voucherDataList.data.Mst = {
          Dtls: [{
            SubjectCode: this.account.type.SubjectCode,
            Abstract: data.CAbstract,
            JSum: data.JSum,
            DSum: data.DSum
          }]
        }
        this.resetVoucher();
        this.cashierForVoucher = data;
        this.voucherMask = 'add';

      } else if (str == 'update') {
        this.voucherMask = 'update';

        this.getVoucherData(data);
      }
    },
    //保存凭证
    keepVoucher (val) {
      this.voucherDataList.data = this.$refs.voucher.voucherData();
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
          // if(str=='update'){
          //     this.voucherData();
          //     this.voucherMask=true;
          // }

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
        // if(str=='update'){
        //     this.voucherDataList.data=JSON.parse(this.oldVoucherData);
        //     this.voucherMask=true;
        // }
        //this.getvoucherList('update');
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
      if ((Vdata.Mst.Uyear >= this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime)) {
        var data = {
          uid: this.uid,
          orgid: this.orgid,
          orgcode: this.orgcode,
          infoData: this.voucherDataList.data
        }
        // if (this.voucherDataList.data.Mst.PhId) {
        //     url = 'Update';
        // }
        if (url == 'Add') {
          data.value = this.cashierForVoucher.PhId;
        }
        //this.voucherAdd=true;
        const loading1 = this.$loading();
        this.$axios.post('Cashier/PostSaveVoucher', data)
          .then(res => {
            loading1.close();
            if (res.Status == 'success') {
              // this.voucherMask=false;
              //this.voucherAdd=true;
              this.voucherMask = '';

              this.saasMessage = {
                visible: true,
                delay: 4000,
                message: res.Msg
              };
              this.getData();
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
        this.$message('当前月份已结账,无法修改凭证!')
      } else {
        this.$message('当前月份已结账,无法新增凭证!')
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
    //获取单个凭证**************
    getVoucherData (PhId) {
      if (PhId == '') {
        this.saasMessage = {
          message: '当前凭证不支持查看',
          visible: true
        };
        //this.$message('当前凭证不支持查看','error')
        return
      }
      var data = {
        uid: this.userid,
        orgid: this.orgid,
        id: PhId
      }

      const loading2 = this.$loading();
      this.$axios.get('/PVoucherMst/GetVoucher', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.voucherDataList.data.Mst = res.Data;
            console.log(res.Data);
            this.resetVoucher();
          } else {
            this.saasMessage = {
              message: res.Msg,
              delay: 3000,
              visible: true
            };
            //this.$message({ showClose: true,message: res.Msg, type: "error"});
          }
          loading2.close();
        })
        .catch(err => {
          this.saasMessage = {
            message: '获取凭证信息失败!',
            delay: 3000,
            visible: true
          };
          //this.$message({ showClose: true,message: err, type: "error"});
          loading2.close();
        })
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
    //选中行
    listChoose ($event, item) {
      var val;
      if (!$event) {
        this.chooseItem.forEach((val, i, arr) => {
          if (val.PhId == item.PhId) {
            arr.splice(i, 1);
          }
        });
        this.$forceUpdate();
      } else {
        this.chooseItem.push(item);
        this.$forceUpdate();
      }
      val = this.dataList.every((val, index, arr) => {
        return val.checked == true
      })
      if (val) {
        this.listAll = true;
      } else {
        this.listAll = false;
      }

    },
    //时间格式转换
    timeTurn (val, item) {
      console.log(val, item, typeof (new Date()), new Date());
      if (val && typeof (val) == 'Object') {
        item.CDate = (val.getFullYear() + '-' + (parseInt(val.getMonth()) + 1) + '-' + val.getDate());
      }
      console.log(val.getFullYear(), item);
    },
    //保存修改
    updateFinish (bool) {
      if (!bool) {
        this.update = false;
        this.getData();
      } else {
        let vm = this;
        this.dataList = this.dataList.concat(vm.deleteList);
        this.dataList.map(data => {
          let date = data.CDate;
          if (typeof date == 'object') {
            data.CDate = (date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate());

          }
        })
        let data = {
          infoData: this.dataList
        }
        cashierUpdate(vm, data).then(res => {
          if (res.Status == 'success') {
            this.getData();
          } else {
            this.deleteList = [];

          }
          this.saasMessage = {
            visible: true,
            message: res.Msg
          }
        }).catch(err => {
          this.saasMessage = {
            visible: true,
            message: '保存失败!'
          }
        })
      }
    },
    addrow (item, index) {
      if (!item) {
        let val = new Date();
        this.dataList.push(
          {
            AccountPhid: this.account.type.PhId,
            OrgId: this.orgid,
            OrgCode: '',
            CDate: this.year + '-' + this.month + '-' + val.getDate(),
            CNo: '',
            CAbstract: '',
            CAccountName: '',
            CAccount: '',
            CBank: '',
            JSum: '',
            DSum: '',
            VoucherMark: '',
            VoucherPhid: '',
            VoucherNo: '',
            CRemark: '',
          }
        );
      } else {
        if (item.AccountPhid) {
          if (item.VoucherMark == 1) {
            this.saasMessage = {
              message: '存在关联凭证,无法删除!',
              visible: true
            }
            return;
          }
          item.DeleteMark = 1;
          this.deleteList.push(item);
        }
        this.dataList.splice(index, 1);
      }
      //this.$nextTick(this.initCss);
    },
    //删除 行
    deleteRow () {
      let vm = this;
      if (vm.chooseItem.length <= 0) {
        vm.saasMessage = {
          visible: true,
          message: '请选择要删除的行!'
        }
      } else {
        for (let item of vm.chooseItem) {
          if (item.VoucherMark == 1) {
            this.saasMessage = {
              message: '存在关联凭证,无法删除!',
              visible: true
            }
            return;
          }
          item.DeleteMark = 1;
        }
      }
      let data = {
        infoData: vm.chooseItem
      }
      this.confirm = {
        visible: true,
        message: '此操作将永久删除数据,是否继续!',
        type: 'deleteRow',
        data: JSON.stringify(data)
      }

    },
    deleteRowConfirm (vm, data) {

      cashierUpdate(vm, data)
        .then(res => {
          console.log(res)
          if (res.Status == 'success') {
            this.saasMessage = {
              visible: true,
              message: '删除成功'
            }
            this.chooseItem = [];
            this.getData();
          } else {
            this.saasMessage = {
              visible: true,
              message: res.Msg
            }
          }
        })
        .catch(err => {
          console.log(err)
          this.saasMessage = {
            visible: true,
            message: '删除失败!'
          }
        })
    },
    //删除确认
    deleteConfirm (id) {
      this.confirm = {
        visible: true,
        message: '此操作将永久删除数据,是否继续!',
        type: 'delete',
        data: JSON.stringify(id)
      }
    },
    //单个凭证删除*****************
    singleDelete (id) {
      let data = {
        uid: this.uid,
        orgcode: this.orgcode,
        id: id
      }
      data.value = data.value = this.cashierForVoucher.PhId;
      const loading = this.$loading();
      this.$axios.post('Cashier/PostDeleteVoucher', data)
        .then(res => {
          loading.close();
          if (res.Status == 'success') {
            this.getData();
          }
          this.saasMessage = {
            visible: true,
            delay: 4000,
            message: res.Msg
          };


        }, err => {
          console.log(err);
          loading.close();
        })
        .catch(err => { loading.close(); this.$message({ showClose: true, message: "删除失败了!", type: "error" }); })
    },

    removefile (item, deleValue) {//移除文件的函数
      this.filelist = item;
      if (item.length < 1) {
        return;
      }
      // console.log(item,deleValue,this.filelist);
      // var urls=deleValue.imgPath.split('/');
      // console.log(this.imglist,item,urls,deleValue)
      // for(var i in item[0]){
      //     console.log(item[0][i].BName,urls[4])
      //     if(item[0][i].BName==urls[4]){
      //             console.log(item)
      //           item[0].splice(i,1);
      //     }
      // }
      // var param={
      //     PhId:deleValue.phid,
      //     BTable:'gcw3_voucher_mst',
      //     BUrlPath:deleValue.imgPath
      // };
      // this.$axios({
      //     url: '/PVoucherAttachment/PostDeleteFile',
      //     method: "post",
      //     data: param,
      // }).then(res => {
      //     if(res.Status==="error"){
      //         this.$message({ showClose: true, message: res.Msg, type: 'error'});
      //         return;
      //     }
      // },err => {
      //     // console.log(err);
      //
      // }).catch(error => {
      //     this.$message({ showClose: true, message: '附件删除错误', type: 'error'});
      // });
    },
    closeUpload () {
      this.fileVisible = false;
    },
    uploadfile (item) {
      //this.imglist.push(item);
      //console.log(this.filelist,item);
      console.log(item);
      this.filelist = item;
      if (item) {
        this.ExcelValidMsg(item);
      }
      //console.log(item,this.filelist)
    },
    //获取导入模板地址
    downloadModel () {
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      this.modelFileUrl = base.baseURL + "/File/GetExportFile?filePath=template&fileName=日记账导入模板.xls";
      // let myWindow= window.open(base.baseURL+"/File/GetExportFile?filePath=template&fileName=凭证导入模板.xls");
      // myWindow=null;
    },
    //导出
    download () {
      let param = {
        uid: this.uid,
        year: this.year,
        month: this.month,
        AccountPhid: this.account.type.PhId
      }
      if (this.account.voucher.noP && !this.account.voucher.yesP) {
        param.VoucherMark = 1;
      } else if (this.account.voucher.yesP && !this.account.voucher.noP) {
        param.VoucherMark = 0;
      } else {
        param.VoucherMark = 2;
      }
      this.$axios.get('Cashier/GetCashierExcel', { params: param })
        .then(res => {
          let base = httpConfig.getAxiosBaseConfigUncontrol()
          window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename);
        })
        .catch(err => {
          console.log(err);
        })
    },
    //打印
    print () {
      this.$refs.accountPrint.className = "listOver printCss"
      this.$print(this.$refs.accountPrint);
    }

  },
  filters: {
    //数字转换******************
    NUmTurn (value) {
      if (!value) return '';
      if (typeof (value) != 'number') {
        return value
      }
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
  components: {
    sideTime,
    voucher,
    fileUpload
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px 30px 0px 20px;
  overflow: hidden;
  height: 100%;
  font-size: 18px;
}
.timeContainer {
  position: absolute;
  right: 40px;
  top: 10px;
  bottom: 0;
}
.searcherCon {
  float: right;
  width: 40%;
  min-width: 170px;
  position: relative;
}

.searcherValue {
  border: 1px solid #ddd;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  padding-left: 10px;
}
.voucherList .voucherSelect > div.searcherCon > div.searcherValue {
  width: 210px;
}

.searcherValue > input {
  width: 100%;
  height: 30px;
  outline: none;
  margin: 0;
  font-size: 14px;
  border: 0;
}
.searcherBtn {
  height: 32px;
  width: 20%;
  text-align: center;
  line-height: 32px;
  background: #00b7ee;
  color: #fff;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
}
.voucherList {
  padding: 8px 20px 0 0px;
  margin-right: 10px;
  font-size: 18px;
  //position:relative;
  min-width: 920px;
  height: 100%;
  .listContainer {
    width: 100%;
    height: 100%;
    padding-bottom: 40px;
  }
  .voucherNav {
    float: right;
  }
  .voucherNav > ul {
    margin-bottom: 10px;
    position: relative;
    padding-right: 16px;
    //z-index:2;
    > a:nth-of-type(2):hover {
      opacity: 1;
    }
    &:last-of-type:after {
      clear: both;
      content: "";
      display: block;
    }
    > li {
      float: right;
      &.btn {
        color: #fff;
        &:hover {
          color: #00b7ee;
        }
      }
      border-radius: 3px;
      height: 30px;
      line-height: 30px;

      cursor: pointer;
      width: 70px;
      margin-left: 10px;
      text-align: center;

      &:hover {
        opacity: 0.8;
      }
      > li {
        > img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .voucherSelect {
    height: 30px;
    position: relative;
    float: right;
    // padding-right:16px;
    > div {
      float: left;

      min-width: 230px;
      line-height: 30px;
      > span,
      > div {
        float: left;
        margin-left: 5px;
      }
      > div {
        width: 50px;
        > input {
          padding: 0 0 0 5px;
        }
      }
    }
    > div:nth-of-type(2) {
      float: left;
      width: 180px;
      min-width: 180px;
      text-align: center;
      > label:nth-of-type(2) {
        margin-left: 20px;
      }
    }
    > div:last-of-type {
      float: right;

      min-width: 280px;
    }
    > div.searcherCon {
      .searcherValue {
        border-radius: 4px 0 0 4px;
        height: 30px;
      }
      > div {
        float: right;
        width: auto;
        margin: 0;
        &:first-of-type {
          cursor: pointer;
          background: #00b7ee;
          height: 30px;
          line-height: 30px;
          width: 70px;
          color: #fff;
          text-align: center;
        }

        // &:nth-of-type(3){
        //     //min-width: 300px;
        // }
      }
    }
  }
}
.title {
  border-bottom: 1px solid #bbb;
  padding: 8px 3px;
  width: 100%;
  font-size: 18px;
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
.listOver {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-left: 25px;
  > ul {
    width: 1720px;
    > li:hover .addIconCon {
      display: block;
    }
    > li {
      &:first-of-type > ul {
        > li {
          border-top: 1px solid #bbb;
          background: #d3e8f9;
          text-align: center;
        }
      }
      > ul {
        overflow: hidden;

        > li {
          height: 40px;
          line-height: 40px;
          padding: 0 5px;
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border: 1px solid #bbb;
          border-width: 0 1px 1px 0;
          &:first-of-type {
            border-left: 1px solid #bbb;
            width: 70px;
            text-align: left;
          }
          .inputContainer > input {
            border: 0;
          }
          > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .col_date {
    width: 130px;
    text-overflow: initial;
    > div {
      text-overflow: initial;
    }
  }
  .col_liush {
    width: 150px;
  }
  .col_abs {
    width: 200px;
  }
  .col_duifzhmc {
    width: 180px;
  }
  .col_duifzh {
    width: 150px;
  }
  .col_duifyh {
    width: 120px;
  }
  .col_in {
    width: 130px;
    text-align: right;
  }
  .col_out {
    width: 130px;
    text-align: right;
  }
  .col_yue {
    width: 130px;
    text-align: right;
  }
  .col_voucher {
    width: 150px;
  }
  .col_msg {
    width: 180px;
  }
  .voucherDisabledCut {
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
.voucherMask {
  position: fixed;
  position: -ms-page;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden auto;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  > div {
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    width: 80%;
    text-align: left;
    padding: 10px;
  }
  &:after {
    display: inline-block;
    content: "";
    width: 0;
    height: 100%;
    vertical-align: middle;
  }
}
.addIconCon {
  position: absolute;
  left: -25px;
  top: 0;
  width: 25px;
  height: 100%;
  display: none;
}
.addIcon,
.deleteIcon {
  width: 22px;
  height: 22px;
  position: absolute;
  left: 0;
  cursor: pointer;
}
.addIcon {
  top: 0px;
  background: url("../../assets/icon/addition_fill.svg");
  background-size: cover;
}
.addIcon:hover {
  background: url("../../assets/icon/addition.svg");
  background-size: cover;
}
.deleteIcon {
  bottom: 0px;
  background: url("../../assets/icon/delete_fill.svg");
  background-size: cover;
}
.deleteIcon:hover {
  background: url("../../assets/icon/delete.svg");
  background-size: cover;
}
.colSelect {
  width: 115px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  background: #fff;
  cursor: pointer;
  > li {
    text-align: left;
    padding-left: 3px;
    &:first-of-type {
      text-align: center;
    }
  }
  &:after {
    content: "";
    width: 7px;
    height: 7px;
    border: 1px solid #bbb;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg);
    position: absolute;
    right: 10px;
    top: 7px;
  }
}
.colSelectActive {
  height: auto;
  &:after {
    transform: rotate(-135deg);
    top: 10px;
  }
}

.printCssBG {
  position: fixed;
  position: -ms-page;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  .printCss {
    width: 1120px;
    padding: 0;
    display: inline-block;
    position: relative;
    top: 40px;
    > ul {
      width: 1120px;
      > li {
        &:first-of-type {
          > ul > li {
            background: #d3e8f9;
          }
        }
        > ul {
          > li {
            background: #fff;
          }
        }
      }
    }
  }
}
.printTitle {
  position: fixed;
  position: -ms-page;
  z-index: 999;
  height: 40px;
  left: 0;
  right: 0;
  text-align: center;
  > p {
    width: 1120px;
    height: 40px;
    line-height: 40px;
    background: #fff;
    position: relative;
    left: 0px;
    display: inline-block;
    padding: 0 20px;
    font-size: 18px;
    box-shadow: 0 0 10px 2px #c4d3dd;
    > span:first-of-type {
      float: left;
    }
    > span:nth-of-type(2) {
      float: right;
      margin-left: 40px;
      color: #00b7ee;
      cursor: pointer;
    }
    > span:nth-of-type(3) {
      float: right;
      cursor: pointer;
    }
  }
}
</style>
<style>
.dayAccount .el-date-editor.el-input {
  width: 120px;
}
</style>

