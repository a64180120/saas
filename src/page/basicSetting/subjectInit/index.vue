<template>
  <div class="container subjectInit">
    <time-select :setCheckedYear="checkedYear"
                 :setYear="setYear"
                 @time-click="yearSelect"
                 ref="yearTime"></time-select>
    <div class="subjectNav">
      <ul>
        <li @click="navActive(item)"
            :class="{active:activeNav==item.code}"
            v-for="(item,index) of navList"
            :key="index"><span>{{item.name}}</span></li>
      </ul>
    </div>
    <div class="subjectContent">
      <div>

        <ul class="subjectHanle">
          <li class="searcherCon">
            <div class="searcherValue"><input @keyup.13="getSubjectQueryList()"
                     v-model="searchVal"
                     type="text"
                     placeholder="科目编码/名称"></div>
            <div @click="getSubjectQueryList()"
                 class="searcherBtn btn">搜索</div>
          </li>
          <li style="width:auto"
              v-if="!jbuildDate">
            <span>做账启用日期:</span>
            <div style="display: inline-block">
              <el-date-picker v-model="buildYear"
                              :clearable="false"
                              type="year"
                              @change="changeStartY"
                              placeholder="选择年">
              </el-date-picker>
            </div>

            <span>年1月</span>
          </li>
          <li style="width:auto"
              v-else><span>做账启用日期:</span><span>{{startYear+'年'+'1月'}}</span></li>
          <li v-show="Roleauthorize.subjectBegin_start!=0&&(!updatePage)&&(year==startYear)||((!jbuildDate)&&(!updatePage))"
              :class="{btnDisabled:CheckRes}"
              @click.stop="CheckRes?0:updatePage=true"
              class="btn">开始初始化</li>
          <li v-show="Roleauthorize.subjectBegin_start!=0&&updatePage&&(year==startYear)||((!jbuildDate)&&(updatePage))"
              @click.stop="endInit()"
              class="btn">结束初始化</li>
          <li v-show="Roleauthorize.subjectBegin_reverse!=0&&(!jbuildDate||year==startYear)"
              :class="{btnDisabled:!CheckRes}"
              @click.stop="uninitCheck()"
              class="btn">反初始化</li>
          <li v-if="Roleauthorize.subjectBegin_set!=0"
              class="subjectSet">
            <div>
              <ul>
                <li>科目设置</li>
                <li @click.stop="addPage">新增</li>
                <li @click.stop="updateSubject">修改</li>
                <li @click.stop="confirmDelete">删除</li>
              </ul>
            </div>
          </li>
          <li @click.stop="fresh"
              style="width:30px;font-size:27px;color:#00b7ee;cursor:pointer;"
              class="el-icon-refresh"></li>
        </ul>
      </div>
      <section class="listContainer listFont">
        <ul class="listTitle">
          <li>科目编码</li>
          <li>科目名称</li>
          <li>余额方向</li>
          <li>辅助核算</li>
          <li>停用/启用</li>
          <li>年初余额(元)</li>
        </ul>

        <div class="listOver">
          <ul @click.stop="chooseOn(item,index)"
              :class="{clickActive:choosedCss[index]}"
              class="listTitle listContent"
              v-for="(item,index) of dataList"
              :key="index">
            <li :title="item.KCode">{{item.KCode}}</li>
            <li :title="item.KName">
              <el-tooltip v-if="item.KName.length > 7"
                          :content="item.KName"
                          placement="bottom-end">
                <span>{{item.KName}}</span>
              </el-tooltip>
              <span v-else>{{item.KName}} </span>
            </li>
            <li><span v-if="item.KBalanceType==1">借</span><span v-if="item.KBalanceType==2">贷</span><span v-if="item.KBalanceType==3">借/贷</span></li>
            <li>
              <div class="assistCss"
                   v-for="(aux,index) of item.AuxiliaryTypes"
                   :key=index>
                <img src="@/assets/images/finance/e43d0d92-28a3-4b66-8ef8-26681e276d6b.svg"
                     alt="">
                <span>{{aux.BaseName}} &nbsp;</span>
              </div>
              <i @click.stop="showAddAuxi(item)"
                 v-show="item.AuxiliaryTypes.length>0&&updatePage"
                 class="el-icon-plus auxiAddIcon"></i>
            </li>
            <li>
              <div><i :class="{newAddStateTrue:!item.EnabledMark,newAddStateFalse:item.EnabledMark}"></i> </div>
              <!-- <div v-show="updatePage">
                                <label>启用 <input type="radio"></label>
                                <label>停用 <input type="radio"></label>
                            </div> -->
            </li>
            <li>
              <div :title="item.NCAccount | Num"
                   v-show="(!updatePage)">{{item.NCAccount | Num}}</div>
              <div class="inputContainer"
                   v-show="updatePage&&item.IsLast==1">
                <input type="text"
                       @click.stop="balanceFocus(item,$event)"
                       @blur="balanceBlur(item)"
                       @keyup="clearNoNum($event)"
                       onafterpaste="this.value=this.value.replace(/e/g,'')"
                       v-model="item.NCAccount">
              </div>
            </li>
            <li v-if="item.children.length>0||item.AuxSubjectchildren"
                class="child">
              <saas-subList v-if="item.children.length>0"
                            :year="year.toString()"
                            :updatePage="updatePage"
                            :dataList="item" />
              <saas-subList v-if="item.AuxSubjectchildren"
                            :year="year.toString()"
                            :updatePage="updatePage"
                            :dataList="item" />

            </li>
          </ul>
        </div>

      </section>
    </div>
    <div style="clear:both"></div>
    <div v-if="addPageShow"
         class="addPageCon">
      <div class="addPage">
        <div class="title"><span v-if="addPageShow=='add'">科目新增</span><span v-if="addPageShow=='update'">科目修改</span><i @click.stop="addPageShow=false"></i>
          <div style="clear:both"></div>
        </div>
        <ul>
          <li>
            <div>上级科目</div>
            <div class="inputContainer">
              &nbsp;{{subjectInfo.preSubject?subjectInfo.preSubject.KCode:''}}&nbsp;{{subjectInfo.preSubject?subjectInfo.preSubject.KName:''}}

              <!-- <select :disabled="addPageShow=='update'?true:false" v-model="subjectInfo.preSubject">
                                <option v-show="addData.PSubject.length>1" value="0">必填</option>
                                <option :value="item" v-for="(item,index) of addData.PSubject" :key=index>{{item.KName}}</option>
                            </select> -->
            </div>
            <div style="clear:both"></div>
          </li>
          <li style="overflow: hidden;">
            <div>科目编码</div>
            <div class="subCodeCss">

              <span v-show="addPageShow=='add'">{{subjectInfo.preSubject?subjectInfo.preSubject.KCode:''}}</span>
              <div class="inputContainer">

                <input :disabled="addPageShow=='update'?true:false"
                       type="text"
                       v-model="subjectInfo.KCode">
              </div>

            </div>
            <div style="clear:both"></div>
          </li>
          <li>
            <div>科目名称</div>
            <div>
              <div class="inputContainer">
                <input :disabled="(choosedData[0].child.IsSystem?true:false)&&(addPageShow=='update')"
                       placeholder="必填"
                       type="text"
                       v-model="subjectInfo.KName">
              </div>
            </div>
            <div style="clear:both"></div>
          </li>
          <li>
            <div>科目类别</div>
            <div style="padding-left:10px;border:1px solid #ccc">
              {{navList[subjectInfo.preSubject.KType-1].name}}
            </div>

            <div style="clear:both"></div>
          </li>
          <li>
            <div>余额方向</div>
            <div>
              <label v-show="(subjectInfo.KBalanceType==1&&addPageShow)">
                <input v-model="subjectInfo.KBalanceType"
                       value="1"
                       type="radio"
                       name="balance">
                &nbsp;借方&nbsp;&nbsp;&nbsp;
              </label>
              <label v-show="(subjectInfo.KBalanceType==2&&addPageShow)">
                <input v-model="subjectInfo.KBalanceType"
                       value="2"
                       type="radio"
                       name="balance">
                &nbsp;贷方&nbsp;&nbsp;&nbsp;
              </label>
              <label v-show="(subjectInfo.KBalanceType==3&&addPageShow)">
                <input v-model="subjectInfo.KBalanceType"
                       value="3"
                       type="radio"
                       name="balance">
                &nbsp;借/贷&nbsp;&nbsp;&nbsp;
              </label>
            </div>
            <div style="clear:both"></div>
          </li>
          <li>
            <div style="padding-left:0;font-size:14px;">启用/停用</div>
            <div style="border:0">
              <label v-show="(addPageShow=='add')||(subjectInfo.EnabledMark==0&&addPageShow=='update')||(subjectInfo.IsSystem==0&&addPageShow=='update')">
                <input v-model="subjectInfo.EnabledMark"
                       value="0"
                       type="radio"
                       name="enable">
                &nbsp;启用&nbsp;&nbsp;&nbsp;
              </label>
              <label v-show="(addPageShow=='add')||(subjectInfo.EnabledMark==1&&addPageShow=='update')||(subjectInfo.IsSystem==0&&addPageShow=='update')">
                <input v-model="subjectInfo.EnabledMark"
                       value="1"
                       type="radio"
                       name="enable">
                &nbsp;停用&nbsp;&nbsp;&nbsp;
              </label>
            </div>
            <div style="clear:both"></div>

          </li>
          <li>
            <div>辅助核算</div>
            <div style="overflow:hidden auto;padding:0 5px;">
              <label style="margin-right:10px;"
                     v-for="(assist,index2) of addData.Type"
                     :key=index2>
                <input style="vertical-align:middle"
                       type="checkbox"
                       v-model="subjectInfo.AuxiliaryTypes[index2]">
                {{assist.BaseName}}
              </label>
            </div>
            <div style="clear:both"></div>
          </li>
        </ul>
        <div class="finishBtn">
          <span @click.stop="addPageShow=false"
                class="btngrey">取消</span>
          <span @click.stop="addFinish()"
                class="btn">保存</span>
          <div style="clear:both"></div>
        </div>
      </div>
      <div></div>
    </div>
    <message :visible.sync="message.visible"
             :delay="message.delay"
             :message='message.message'></message>

    <!-- 未初始化禁止跳转操作遮罩层 -->
    <div @click="unCheckResMsg"
         style="z-index:99;"
         :class="{unCheckResTop:!CheckRes}"></div>
    <div @click="unCheckResMsg"
         style="z-index:99;"
         :class="{unCheckResBottom:!CheckRes}"></div>
    <div v-if="addAuxiShow">
      <addAuxiDtl :subject="addAuxiOfSubjec"
                  :year="year"
                  @finish="addAuxiFinish" />
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
    <!-- btn1默认确定,btn2默认取消 -->
    <saasconfirm :message="confirm.message"
                 :btn1="confirm.btn1"
                 :btn2="confirm.btn2"
                 :type="confirm.type"
                 :visible.sync="confirm.visible"
                 @ok-click="confirmOk"
                 @no-click="confirmNo">
    </saasconfirm>
  </div>
</template>

<script>
import { GetOrganizeBackupList } from '@/api/copyandreset'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import qs from 'qs'
import overMsg from '@/page/admin/copyandreset/overMsg'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import userInfo from '@/util/auth'
import saasSubList from './subList.vue'
import { SubjectAdd, SubjectUpdate, SubjectDelete } from '@/api/subject/subjectInfo'
import timeSelect from './yearTime'
import addAuxiDtl from './addAuxiDtl'

//科目期初
export default {
  name: "subjectInit",
  data () {
    return {
      confirm: {
        message: '',
        btn1: '',
        btn2: '',
        visible: false
      },
      searchVal: '',
      dataList: [],
      setYear: '',//调整年度时间开始日期setCheckedYear

      buildYear: '',
      startYear: '',  //建账日期;
      year: '', //选择的年份
      asset: [],  //资产
      liabilities: [],  //负债
      netAsset: [],//净资产
      income: [],//收入
      pay: [],//支出
      Mst: {},//凭证信息
      addInfo: {}, //获取的新增科目的返回结果
      addData: {},//json转换的addInfo
      subjectInfo: {  //新增科目的值
        preSubject: '',
        KCode: '',
        KName: '',
        KType: '',
        EnabledMark: '',
        KBalanceType: '',
        AuxiliaryTypes: []
      },
      choosedData: [],//选中的item
      choosedCss: [],//选中的item的样式
      navList: [
        { code: 'asset', name: '资产类' }, { code: 'liabilities', name: '负债类' }, { code: 'netAsset', name: '净资产类' }, { code: 'income', name: '收入类' }, { code: 'pay', name: '支出类' }
      ],
      checkedYear: '', //年份
      activeNav: 'asset',  //激活的类别

      updatePage: false,  //是否编辑状态
      CheckRes: '',  //是否初始化
      addPageShow: false,  //新增修改页面
      message: {
        message: '',
        delay: 0,
        visible: false
      },
      addAuxiShow: false,//显示辅助核算初始明细
      batchAddShow: false,//显示批量设置辅助项
      orgInfo: '',
      addAuxiOfSubjec: {},//设置辅助项的科目
      //  timeRefresh:true,//刷新时间选择
      ssss: false,

    }
  },
  provide () {
    return {
      update: { updatePage: this.updatePage },
      childChoose: this.childChoose,
      fresh: this.fresh,
    }
  },
  created () {

  },
  //加载数据
  activated: function () {
    if (this.jbuildDate) {
      this.startYear = this.jbuildDate.slice(0, 4);
    }
    this.getChecked();
  },
  //计算
  computed: {
    ...mapState({
      uid: state => state.user.userid,
      username: state => state.user.username,
      orgcode: state => state.user.orgcode,
      orgname: state => state.user.orgName,
      orgid: state => state.user.orgid,
      jbuildDate: state => state.Pconfig.jbuildDate,
      Roleauthorize: state => state.user.Roleauthorize,//按钮权限
      autoS: state => state.user.autoSetting,//自动备份
    })
  },
  methods: {
    showAddAuxi (item) {  //增加辅助项
      this.addAuxiOfSubjec = item;
      this.addAuxiShow = true;
    },
    addAuxiFinish (data) {
      this.addAuxiShow = false;
      if (data) {
        this.fresh();
      }

    },
    //刷新时间选择
    // refreshTime(){
    //     var vm=this;
    //   vm.timeRefresh=false;
    //   setTimeout(function(){
    //       vm.timeRefresh=true;
    //   },100)
    // },
    //确认框btn1方法**********
    confirmOk (type, data) {
      this.confirm.visible = false;
      // var item =JSON.parse(JSON.stringify(this.chooseItem));
      switch (type) {
        case 'delete':
          this.subDelete();
          break;
      }
    },
    //确认框btn2方法**********
    confirmNo (type, data) {
      this.confirm.visible = false;

    },
    //删除方法
    subDelete () {
      let vm = this;
      var data3 = {
        orgid: this.orgid,
        uid: this.uid,
        id: this.choosedData[0].child.PhId
      }
      const loading2 = this.$loading();
      SubjectDelete(vm, data3)
        .then(res => {
          loading2.close();
          if (res.Status == 'success') {
            this.message = {
              message: res.Msg,
              delay: 4000,
              visible: true
            }
            this.getSubjectList();
          } else {
            this.message = {
              message: res.Msg,
              delay: 4000,
              visible: true
            }
          }

        })
        .catch(err => {
          loading2.close();
          this.message = {
            message: err,
            delay: 4000,
            visible: true
          }
        })
    },
    //改变建账日期
    changeStartY () {

      this.year = this.startYear = this.buildYear.getFullYear();
      this.setYear = this.year;
      if (this.startYear < (new Date().getFullYear())) {
        var data = {
          orgid: this.orgid,
          Ryear: this.startYear,
          value: new Date().getFullYear()
        }
        const loading = this.$loading();
        this.$axios.post('PSubject/PostInitPSubject', data)
          .then(res => {
            loading.close();
            if (res.Status == 'error') {
              this.saasMessage = {
                message: res.Msg,
                visible: true
              }
            }
            this.getSubjectList();
          })
          .catch(err => {
            loading.close();
            this.saasMessage = {
              message: '初始化科目出错了!',
              visible: true
            }
          })
      } else {
        this.getSubjectList();
      }

    },
    //导航切换**************
    navActive (item) {
      var vm = this;
      this.activeNav = item.code;
      this.dataList = vm[this.activeNav];
    },
    //样式初始化
    initCss () {
      for (var da in this.dataList) {
        this.choosedCss[da] = false;
      }
    },
    //判断初始化状态************
    getChecked (str) {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        queryfilter: { "OrgId*num*eq*1": this.orgid }
      }
      const loading = this.$loading();
      this.$axios.get('/PBusinessConfig/GetPBusinessConfigList', { params: data })
        .then(res => {
          loading.close();
          if (res.Status == 'error') {
            this.message = {
              delay: 4000,
              message: res.Msg,
              visible: true
            }
          }
          // if(!res.CheckRes){
          //     this.message={
          //         delay:4000,
          //         message:'组织未初始化,请先初始化!',
          //         visible:true
          //     }
          // }
          this.CheckRes = res.CheckRes;
          this.startInitCss = !res.CheckRes;
          // this.checkedTime=res.Record[0].JAccountPeriod+1;
          // if(res.CheckRes){

          this.checkedYear = res.Record.length != 0 ? res.Record[0].JYear : '';
          //     this.year=this.checkedYear;
          // }
          if (str == 'getlist')
            this.getSubjectList();
          // this.sideDate=res.Record[0].JYear+'-'+this.checkedTime;
          // this.year=this.sideDate.split('-')[0];
          // this.month=this.sideDate.split('-')[1];
          // this.checkVal=this.checkedTime;
          // this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
          // //this.getvoucherList('reset');
          // this.$emit("time-click",{sideDate:this.sideDate,checkedTime:this.checkedTime,checkedYear:this.checkedYear})
          // this.$forceUpdate();
        })
        .catch(err => { loading.close(); this.$message({ showClose: true, message: '获取初始化状态出错了!', type: "error" }) })
    },
    //获取页面数据*********************
    getSubjectList () {
      this.choosedData = [];//清空选择
      for (var ch in this.choosedCss) {
        this.choosedCss[ch] = '';
      }
      var uls = document.querySelectorAll(".child>ul");
      for (var ul of uls) {
        ul.className = '';
      }
      var vm = this;
      var data = {
        orgid: this.orgid,
        Ryear: this.year
      }
      this.asset = [];
      this.liabilities = [];
      this.netAsset = [];
      this.income = [];
      this.pay = [];
      const loading = this.$loading();
      this.$axios.get('PSubject/GetPSubjectList', { params: data })
        .then(res => {
          loading.close();
          this.infinite(res.Data);
          console.log(res)
          if (res.Status == "success") {
            for (var sub of res.Data) {  //数据分成5类
              switch (sub.KType) {
                case '1':
                  this.asset.push(sub);
                  break;
                case '2':
                  this.liabilities.push(sub);
                  break;
                case '3':
                  this.netAsset.push(sub);
                  break;
                case '4':
                  this.income.push(sub);
                  break;
                case '5':
                  this.pay.push(sub);
                  break;
              }
            }
            this.Mst = res.Mst;
            this.dataList = vm[vm.activeNav];
            this.initCss();
            var data1 = {
              orgid: this.orgid,
              uid: this.uid,
              Ryear: this.year
            }

            const loading = this.$loading();
            this.$axios.get('PSubject/GetPSubjectLastList', { params: data1 })   //获取所有科目,和辅助项
              .then(res => {
                loading.close();
                if (res.Status == 'success') {
                  this.addInfo = res;

                }
              }, err => {
                console.log(err);
                loading.close();
              })
          }
          else {
            loading.close();
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
          }
        }, err => {
          loading.close();

          console.log(err);

        })
        .catch(err => {
          loading.close();
          console.log(err)
          this.$message({ showClose: true, message: '获取数据出错了!', type: "error" })
        })
    },
    //jine
    infinite (data) {
      function jine (data) {
        var NCAccount = data.NCAccount;
        if (data.children.length > 0) {
          for (var i = 0; i < data.children.length; i++) {
            data.children[i].NCAccount = jine(data.children[i]);
            NCAccount = parseFloat(NCAccount) + parseFloat(data.children[i].NCAccount)//jine(vm,data.children[i]);

            /*if (data.children[i].children.length == 0 && data.children[i].AuxSubjectchildren != null) {
              for (var x = 0; x < data.children[i].AuxSubjectchildren.length; x++) {
                NCAccount = parseFloat(NCAccount) + parseFloat(data.children[i].AuxSubjectchildren[x].NCAccount);
                data.children[i].NCAccount = parseFloat(data.children[i].NCAccount) + parseFloat(data.children[i].AuxSubjectchildren[x].NCAccount);
              }
            }*/
          }
          data.NCAccount = NCAccount;

        } else if (data.AuxSubjectchildren != null) {
          for (var x = 0; x < data.AuxSubjectchildren.length; x++) {
            NCAccount = parseFloat(NCAccount) + parseFloat(data.AuxSubjectchildren[x].NCAccount);
            data.NCAccount = parseFloat(data.NCAccount) + parseFloat(data.AuxSubjectchildren[x].NCAccount);
          }
        }

        return NCAccount;
      }
      for (var j = 0; j < data.length; j++) {
        data[j].NCAccount = jine(data[j]);
      }
    },

    //递归查询*****末级科目
    infi (vm, arr, obj) {
      if (obj.children.length > 0) {
        for (var i = 0; i < obj.children.length; i++) {
          if (obj.children[i].children.length == 0) {
            if (obj.children[i].AuxSubjectchildren && obj.children[i].AuxSubjectchildren.length) {
              obj.children[i].AuxSubjectchildren.map(ob => {
                arr.push(ob)
              })
            } else {
              arr.push(obj.children[i]);
            }
          } else if (obj.children[i].children.length > 0) {
            vm.infi(vm, arr, obj.children[i]);
          }
        }
      } else if (obj.children.length == 0) {
        if (obj.AuxSubjectchildren && obj.AuxSubjectchildren.length) {
          obj.AuxSubjectchildren.map(ob => {
            arr.push(ob)
          })
        } else {
          arr.push(obj);
        }

      }

      return arr;
    },
    // ///input光标位置
    // insertText(obj,str) {
    //     if (document.selection) {
    //         var sel = document.selection.createRange();
    //         sel.text = str;
    //     } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    //         var startPos = obj.selectionStart,
    //             endPos = obj.selectionEnd,
    //             cursorPos = startPos,
    //             tmpStr = obj.value;
    //         obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    //         cursorPos += str.length;
    //         obj.selectionStart = obj.selectionEnd = cursorPos;
    //     } else {
    //         obj.value += str;
    //     }
    // },
    // moveStart(obj){
    //     obj.focus();
    //     var len = 0;
    //     if (document.selection) {
    //         var sel = obj.createTextRange();
    //         sel.moveStart('character',len);
    //         sel.collapse();
    //         sel.select();
    //     } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
    //         obj.selectionStart = obj.selectionEnd = len;
    //     }
    // } ,
    balanceFocus (item, event) {
      var elem = event.target;
      if (item.NCAccount == '0.00' || item.NCAccount == 0) {
        item.NCAccount = '';
      }

      // var index=0;
      // console.log(elem.setSelectionRange)
      // if (elem.setSelectionRange) { // 标准浏览器
      //     elem.setSelectionRange(index, index)   
      // } else { // IE9-

      //     var range = elem.createTextRange()
      //     console.log(range)
      //     range.moveStart("character", -len)
      //     range.moveEnd("character", -len)
      //     range.moveStart("character", index)
      //     range.moveEnd("character", 0)
      //     range.select()
      // }
    },
    //输入余额框blur
    balanceBlur (item) {
      console.log(item);
      if (item.NCAccount) {
        item.NCAccount = parseFloat(item.NCAccount);
        item.NCAccount = item.NCAccount.toFixed(2);
      } else {
        item.NCAccount = '0.00';

      }
    },
    ...mapActions({
      Pconfig: 'Pconfig/getBusinessConfig'
    }),
    //初始化按钮***********
    endInit () {

      var vm = this;
      var subjects = [];
      var Dtls = [];
      var url = 'Update2';
      //加入末级科目到subject***

      for (var ass of this.asset) {
        subjects = vm.infi(vm, subjects, ass);
      }
      for (var lia of this.liabilities) {
        subjects = vm.infi(vm, subjects, lia);
      }

      for (var ne of this.netAsset) {
        subjects = vm.infi(vm, subjects, ne);
      }
      for (var inc of this.income) {
        subjects = vm.infi(vm, subjects, inc);
      }
      for (var p of this.pay) {
        subjects = vm.infi(vm, subjects, p);
      }

      if (!this.Mst) {
        url = 'Add2';
        for (var s in subjects) {
          Dtls[s] = {
            SubjectCode: subjects[s].KCode,
            SubjectName: subjects[s].KName,
            PersistentState: 1
          }
          if (subjects[s].KBalanceType == 1) {
            Dtls[s].JSum = subjects[s].NCAccount;
            Dtls[s].DSum = 0;

          } else if (subjects[s].KBalanceType == 2) {
            Dtls[s].DSum = subjects[s].NCAccount;
            Dtls[s].JSum = 0;
          }
          // if(subjects[s].AuxiliaryTypes.length>0){  //添加Dtls的辅助项
          //         Dtls[s].DtlAccounts={
          //             SubjectCode: Dtls[s].SubjectCode,
          //             SubjectName: Dtls[s].SubjectName,
          //             JSum: Dtls[s].JSum,
          //             DSum:0,
          //             PersistentState:1
          //         }
          //     for(var i of subjects[s].AuxiliaryTypes){
          //         Dtls[s].DtlAccounts[i.GLS]=i.PhId;
          //     }
          // }

        }
      } else {
        //修改
        for (var s in subjects) {
          if (subjects[s].IsAuxSubject == 1) {

            Dtls[s] = subjects[s]
            Dtls[s].SubjectCode = subjects[s].KCode
            Dtls[s].SubjectName = subjects[s].KName
            Dtls[s].PhidVouchermst = this.Mst.PhId

          } else if (!subjects[s].PVoucherDel) {
            Dtls[s] = {
              SubjectCode: subjects[s].KCode,
              SubjectName: subjects[s].KName,
              PersistentState: 1
            }

          } else {
            Dtls[s] = subjects[s].PVoucherDel;
            Dtls[s].PersistentState = 2;
            Dtls[s].SubjectCode = subjects[s].KCode;
            Dtls[s].SubjectName = subjects[s].KName;

          }
          if (subjects[s].KBalanceType == 1) {
            Dtls[s].JSum = subjects[s].NCAccount;
            Dtls[s].DSum = 0;

          } else if (subjects[s].KBalanceType == 2) {
            Dtls[s].DSum = subjects[s].NCAccount;
            Dtls[s].JSum = 0;
          }
        }
        this.Mst.Dtls = Dtls;
        this.Mst.PersistentState = 2;
        this.Mst.PType = '记';
      }
      //试算平衡*****************
      var J = 0;
      var D = 0;

      for (var dt of Dtls) {
        J = (parseFloat(J) + parseFloat(dt.JSum));
        D = (parseFloat(D) + parseFloat(dt.DSum));

      }
      if (J.toFixed(2) != D.toFixed(2)) {
        var c = J - D;  //差额**
        this.message = {
          message: '借贷试算平衡不通过,借贷差额为' + c.toFixed(2) + '元,请检查余额!',
          delay: 4000,
          visible: true
        }
        return;
      }
      if (!this.Mst) {
        // var  pDate= new Date;
        // var year=pDate.getFullYear();
        // var month=pDate.getMonth()+1;
        // var date=pDate.getDate();
        // var VerifyDate=year+'-'+((month<10)?('0'+month):month)+'-'+((date<10?('0'+date):date))
        var VerifyDate = this.startYear + '-01-01';
        var data1 = {
          uid: this.uid,
          orgid: this.orgid,
          orgcode: this.orgcode,
          infoData: {
            Mst: {
              PMakePerson: this.username,
              PType: '记',
              OrgId: this.orgid,
              OrgCode: this.orgcode,
              PersistentState: 1,
              PMonth: 0,
              Uyear: this.startYear,
              Dtls: Dtls,
              Verify: 1,
              VerifyDate: VerifyDate,
              PDate: VerifyDate,
              PAccper: this.year + '-' + 0
            }
          }
        }
      } else {
        var data1 = {
          uid: this.uid,
          orgid: this.orgid,
          orgcode: this.orgcode,
          infoData: {
            Mst: this.Mst
          }
        }
      }

      const loading1 = this.$loading();
      this.$axios.post('/PVoucherMst/Post' + url, data1)
        .then(res => {
          loading1.close();
          if (res.Status == "success") {
            this.message = {
              delay: 4000,
              message: '恭喜您，借贷试算平衡，初始化完成 。',
              visible: true
            }
            this.updatePage = false;
            if (url == 'Add2') {
              this.Pconfig({ orgid: this.orgid }).then(res => {
                this.startYear = res.Data.JBuildDate.slice(0, 4);
              });

            }
            // this.getSubjectList();
            this.getChecked('getlist');
            // this.refreshTime();
          } else {
            this.message = {
              delay: 4000,
              message: res.Msg,
              visible: true
            }
            // this.getSubjectList();
            this.getChecked('getlist');
            // this.refreshTime();
          }
        })
        .catch(err => {
          loading1.close();
          console.log(err)
        })

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
        Backfrom: 3,//反初始化备份
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('系统正在反初始化前备份,请耐心等待....')
      axios.create(base).get('/OrganizeBackup/GetAddBackUp', { params: data, headers: new_header })
        .then(response => {

          loading.close()
          let res = JSON.parse(response.data)
          if (res.Status == 'success') {
            // this.$msgBox.show(res.Msg)
            this.unInit();
          } else {
            this.$msgBox.error(res.Msg)
          }
        }).catch(err => {
          console.log(err)
          loading.close()
          this.$msgBox.error('备份失败!')
        })
    },
    uninitCheck () {

      if (!this.CheckRes) {
        return;
      }
      if (this.autoS.BackInitSave != 0) {
        this.unInit();
      } else {
        this.copyCheck();
      }
    },
    //反初始化
    unInit () {

      var data2 = {
        orgid: this.orgid
      }
      const loading1 = this.$loading();
      this.$axios.post('PBusinessConfig/PostUnCompleteInit', data2)
        .then(res => {
          loading1.close();
          if (res.Status == 'success') {
            this.message = {
              delay: 4000,
              message: '反初始化成功!',
              visible: true
            }
          }
          //  this.getSubjectList();
          this.getChecked('getlist');
        }, err => {
          console.log(err);

        })
        .catch(err => {
          loading1.close();
          this.$message({ showClose: true, message: err, type: "error" });
        })
    },
    //搜索功能*************
    getSubjectQueryList () {
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        Ryear: this.startYear,
        infoData: {
          KType: '',
          KCode: this.searchVal,
          KName: this.searchVal
        }

      }
      for (var nav in this.navList) {
        if (this.navList[nav].code == this.activeNav) {
          data.infoData.KType = parseInt(nav) + 1;
          console.log(nav, parseInt(nav) + 1)
        }
        console.log(this.navList[nav].code, this.activeNav, parseInt(nav) + 1)
      }

      const loading = this.$loading();
      this.$axios.post('PSubject/PostPSubjectQueryList', data)
        .then(res => {
          loading.close();
          if (res.Status == 'success') {
            var str = this.navList[data.infoData.KType - 1].code;
            var vm = this;
            vm[str] = res.Data;
            this.dataList = res.Data;
            if (res.Data.length == 0) {
              this.message = {
                message: '未搜索到匹配的科目',
                delay: 3000,
                visible: true
              }
            }
          } else {
            this.message = {
              message: res.Msg,
              delay: 3000,
              visible: true
            }
          }
        }, err => {
          console.log(err);

        })
        .catch(err => {
          loading.close();
          this.$message(err);
        })
    },
    //选择行****
    chooseOn (item, index) {
      for (var ch in this.choosedCss) {
        this.choosedCss[ch] = '';
      }
      var uls = document.querySelectorAll(".saasSubList>ul");
      for (var ul of uls) {
        ul.className = '';
      }
      this.choosedData = [];
      this.choosedData.push({ child: item });
      this.$set(this.choosedCss, index, true);
      // this.choosedCss[index]=true;
      // this.$forceUpdate();
    },
    //子代选择
    childChoose ($event, item, child, index2) {
      if (child.IsAuxSubject) {
        return;
      }
      for (var ch in this.choosedCss) {
        this.choosedCss[ch] = '';
      }
      var e = $event.currentTarget;
      var uls = document.querySelectorAll(".saasSubList>ul");
      for (var ul of uls) {
        ul.className = '';
      }
      e.className = "clickActive";
      this.choosedData = [];
      this.choosedData.push({ child: child, parent: item });
      this.$forceUpdate();
    },
    //新增*****
    addPage () {
      if (this.year < this.checkedYear) {
        this.message = {
          message: '当前年份已结账,无法新增科目!',
          visible: true,
          delay: 4000
        }
        return;
      }
      if (this.choosedData.length <= 0) {
        this.message = {
          message: '请选择科目!',
          visible: true,
          delay: 4000
        }
        return;
      }

      this.addData = {};
      this.addPageShow = 'add';
      this.addData = this.choosedData[0].child;
      this.addData.Type = this.addInfo.Type;
      this.subjectInfo = {
        preSubject: this.addData,
        KCode: this.addData.ChildCode,
        KName: '',
        EnabledMark: this.addData.EnabledMark,
        KType: this.addData.KType,
        KBalanceType: this.addData.KBalanceType,
        AuxiliaryTypes: []
      }

      for (var t = 0; t < this.addData.Type.length; t++) {
        this.subjectInfo.AuxiliaryTypes[t] = false;
      }

    },
    //修改*****
    updateSubject () {
      if (this.year < this.checkedYear) {
        this.message = {
          message: '当前年份已结账,无法修改科目!',
          visible: true,
          delay: 4000
        }
        return;
      }
      if (this.choosedData.length <= 0) {
        this.message = {
          message: '请选择修改的科目!',
          visible: true,
          delay: 4000
        }
        return;
      }
      if (!this.choosedData[0].child.IsLast) {
        this.message = {
          message: '只能修改末级科目!',
          delay: 4000,
          visible: true
        }
        return;
      }
      this.addPageShow = 'update';
      this.addData = {};
      this.addData.PSubject = this.choosedData.parent ? this.choosedData.parent : [];  //上级科目信息
      this.addData.Type = this.addInfo.Type;  //所有辅助项值

      this.subjectInfo = {
        IsSystem: this.choosedData[0].child.IsSystem,
        PhId: this.choosedData[0].child.PhId,
        preSubject: this.choosedData[0].parent,
        KName: this.choosedData[0].child.KName,
        KCode: this.choosedData[0].child.KCode,
        EnabledMark: this.choosedData[0].child.EnabledMark,
        KType: this.choosedData[0].child.KType,
        KBalanceType: this.choosedData[0].child.KBalanceType,
        AuxiliaryTypes: []
      }

      if (!this.subjectInfo.preSubject) {
        this.subjectInfo.preSubject = JSON.parse(JSON.stringify(this.choosedData[0].child));
        this.subjectInfo.preSubject.KCode = '';
        this.subjectInfo.preSubject.KName = '';
      }
      //默认选中的辅助项

      for (var t = 0; t < this.addData.Type.length; t++) {
        this.subjectInfo.AuxiliaryTypes[t] = false;
        for (var auxi of this.choosedData[0].child.AuxiliaryTypes) {

          if (auxi.PhId == this.addData.Type[t].PhId) {
            this.subjectInfo.AuxiliaryTypes[t] = true;
          }
        }

      }

    },
    //科目新增修改保存按钮
    addFinish () {
      var auxi = [];
      var vm = this;
      var auxiBreak = false;//判断往来个人和单位不能一起添加

      for (var t in this.addData.Type) {
        if (this.subjectInfo.AuxiliaryTypes[t]) {
          if (auxiBreak && (this.addData.Type[t].BaseName == '往来个人' || this.addData.Type[t].BaseName == '往来单位')) {
            this.message = {
              visible: true,
              message: '辅助项"往来个人"与"往来单位"不能同时选择!'
            }
            return;
          }
          if (this.addData.Type[t].BaseName == '往来个人' || this.addData.Type[t].BaseName == '往来单位') {
            auxiBreak = true;
          }
          auxi.push(this.addData.Type[t]);
        }

      }
      this.subjectInfo.OrgId = this.orgid;
      this.subjectInfo.Layers = parseInt(this.subjectInfo.preSubject.Layers) + 1;
      this.subjectInfo.KType = this.subjectInfo.preSubject.KType;
      this.subjectInfo.Uyear = this.subjectInfo.preSubject.Uyear;
      this.subjectInfo.OrgCode = this.orgcode;
      this.subjectInfo.ParentId = this.subjectInfo.preSubject.PhId;
      if (this.addPageShow == "add") {
        //新增***************
        if (!this.subjectInfo.KName) {
          this.message = {
            message: '请输入科目名!',
            visible: true,
            delay: 4000
          }
          return;
        }
        var reg = new RegExp("^[0-9][0-9]$", "ig");
        var bool = reg.test(this.subjectInfo.KCode)
        if (!bool) {
          this.messageCallback('新增科目编码只能为两位数字!');
          return;
        }
        var info = JSON.parse(JSON.stringify(this.subjectInfo));//防止页面瞬间变化***
        info.KCode = this.subjectInfo.preSubject.KCode + this.subjectInfo.KCode;
        // if(this.subjectInfo.KCode){
        //     info.KCode=this.subjectInfo.preSubject.KCode+this.subjectInfo.KCode;
        // }else{
        //     info.KCode=this.subjectInfo.preSubject.KCode+(this.subjectInfo.preSubject.children?'0'+(parseInt(this.subjectInfo.preSubject.children.length)+1):'01');
        // }

        // if(this.subjectInfo.preSubject.children){
        //     this.subjectInfo.KCode=parseInt(this.subjectInfo.preSubject.KCode)+'0'+(parseInt(this.subjectInfo.preSubject.children.length)+1);
        // }else{
        //     this.subjectInfo.KCode=parseInt(this.subjectInfo.preSubject.KCode)+'01';
        // }
        var data1 = {
          uid: this.uid,
          orgid: this.orgid,
          ParentSubject: this.addData,
          Subject: info,
          AuxiliaryTypeList: auxi
        }
        const loading = this.$loading();
        SubjectAdd(vm, data1)
          .then(res => {
            loading.close();
            if (res.Status == 'success') {
              this.message = {
                message: res.Msg,
                visible: true,
                delay: 4000
              }
            } else {
              this.message = {
                message: res.Msg,
                visible: true,
                delay: 4000
              }
            }
            this.addPageShow = false;
            this.fresh();
          }, err => {
            loading.close();
            console.log(err);

          })
          .catch(err => {
            loading.close();
            this.message = {
              message: err ? err : '出错了!',
              visible: true,
              delay: 4000
            }
          })
      } else {
        //修改***************
        if (this.choosedData[0].child.NgRecordVer) {  //版本号***
          this.subjectInfo.NgRecordVer = this.choosedData[0].child.NgRecordVer
        }
        var data2 = {
          uid: this.uid,
          orgid: this.orgid,
          Subject: this.subjectInfo,
          AuxiliaryTypeList: auxi
        }
        const loading2 = this.$loading();
        SubjectUpdate(vm, data2)
          .then(res => {
            loading2.close();
            if (res.Status == 'success') {
              this.message = {
                message: res.Msg,
                visible: true,
                delay: 4000
              }
              this.addPageShow = false;
              this.fresh();
            } else {
              this.message = {
                message: res.Msg,
                visible: true,
                delay: 4000
              }
            }

          }, err => {
            loading2.close();
            console.log(err);

          })
          .catch(err => {
            loading2.close();
            this.message = {
              message: err ? err : '出错了!',
              visible: true,
              delay: 4000
            }
          })
      }
    },
    //删除*****
    confirmDelete () {
      if (this.year < this.checkedYear) {
        this.message = {
          message: '当前年份已结账,无法删除科目!',
          visible: true,
          delay: 4000
        }
        return;
      }
      var vm = this;
      if (this.CheckRes && (this.choosedData[0].child.NCAccount > 0 || this.choosedData[0].child.NCAccount < 0)) {
        this.message = {
          message: '当前科目有余额无法删除,请先反初始化!',
          visible: true,
          delay: 4000
        }
        return;
      }
      if (this.choosedData.length <= 0) {
        this.message = {
          message: '请选择要删除的科目!',
          visible: true,
          delay: 4000
        }
        return;
      }
      this.confirm = {
        btn1: '确定',
        btn2: '取消',
        message: '此操作将永久删除科目,是否继续!',
        type: 'delete',
        visible: true
      }
    },
    //接收年份选择****
    yearSelect (data) {
      this.year = data.year;
      if (!this.jbuildDate) {
        this.buildYear = new Date(this.year);
        this.changeStartY();
      } else {
        this.getSubjectList();
      }

    },
    //输入框限定***
    clearNoNum (event) {
      var obj = event.target;
      // obj.value = obj.value.replace(/[^\-]/g,"");return;
      //清除“数字”和“.”以外的字符  
      obj.value = obj.value.replace(/[^\-\d.]/g, "");  //清除“数字”和“.”以外的字符  
      obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的 
      obj.value = obj.value.replace("-", "$#$#").replace(/\-/g, "").replace("$#$#", "-");
      obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
      //         if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
      //             obj.value= parseFloat(obj.value); 
      //         } 
    },
    //未初始化弹出信息
    unCheckResMsg () {
      this.message = {
        message: '该组织未初始化,请先完成初始化!',
        visible: true
      }
    },
    //刷新
    fresh () {
      this.searchVal = '';
      this.choosedData = [];
      this.updatePage = false;
      for (var ch in this.choosedCss) {
        this.choosedCss[ch] = '';
      }
      var uls = document.querySelectorAll(".clickActive");
      for (var ul of uls) {
        ul.className = '';
      }
      //this.getSubjectList();
      this.getChecked('getlist');

    }
  },
  components: {
    timeSelect,
    saasSubList,
    addAuxiDtl,
    overMsg
  },
  filters: {
    Num (value) {
      if (!value) return '0.00';
      if (value == '0.00') return value;
      /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
      var intPart = Number(value) | 0; //获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
      var floatPart = ".00"; //预定义小数部分
      var value2Array = value.toString().split(".");
      //=2表示数据有小数位
      var res;
      if (value2Array.length == 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分

        if (floatPart.length == 1) { //补0,实际上用不着
          res = intPartFormat + "." + floatPart + '0';
          res = (res == 0.00 ? '' : res);
          return res;
        } else {
          res = intPartFormat + "." + floatPart;
          res = (res == 0.00 ? '' : res);
          return res;
        }

      } else {
        res = intPartFormat + floatPart;
        res = (res == 0.00 ? '' : res);
        return res;
      }

    }
  }

}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang='scss' scoped>
.container {
  height: 100%;
  width: 100%;
  min-width: 1000px;
  margin-bottom: 0;
  font-size: 18px;
  //position:relative;  会使fixed有问题
  overflow: hidden;
  padding: 0 55px 0 0;
}
.subjectNav {
  width: 45px;
  height: 95%;
  overflow: auto;
  float: left;
  text-align: center;
  /* padding-left: 10px; */
  margin-top: 20px;

  > ul {
    height: 100%;
    > li {
      text-align: center;
      height: 20%;
      width: 28px;
      margin: 0 auto;
      font-size: 18px;
      display: flex; //垂直居中
      align-items: center; //垂直居中
      min-height: 90px;
      cursor: pointer;
      &.active {
        background: #00b7ee;
        color: #fff;
      }
      > span {
        position: relative;

        overflow: hidden;
        margin-left: 2px;
      }
      &:nth-of-type(3) {
        min-height: 100px;
      }
    }
  }
}
.subjectContent {
  //float:left;
  margin-left: 65px;
  width: 100%;
  height: 100%;
  padding-right: 70px;
  margin-top: 20px;
  > div:first-of-type {
    height: 30px;
    width: 100%;
    min-width: 810px;
    position: relative;
    font-size: 15px;
  }
}
.listContainer {
  min-width: 810px;
  height: 90%;
  margin-top: 10px;
  position: relative;
  padding-top: 40px;
  padding-bottom: 20px;
  .listOver {
    height: 100%;
    overflow-y: scroll;
    ul > li:nth-of-type(6) {
      padding-right: 3px;
      > div {
        text-align: right;
        padding: 0;
      }
    }
  }
}
.listContainer > ul.listTitle:first-of-type {
  // width:100%;
  background: #d3e8f9;
  color: #333;
  position: absolute;
  top: 0;
  right: 17px;
  left: 0;
  // margin-right:5px;
  // overflow-y: scroll;
  > li {
    border: 1px solid #bcbdbd;
    border-left: 0;
    &:first-of-type {
      border-left: 1px solid #bcbdbd;
    }
  }
}
.listContainer ul.listTitle {
  height: auto;
  background: #fff;
  color: #333;
  // &:first-of-type{
  //     >li{
  //         background: #d3e9f9 ;
  //     }
  // }
  > li > div {
    height: 100%;
    width: 100%;
    position: relative;
  }
}
.listContainer ul.listTitle > li {
  float: left;
  text-align: center;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  position: relative;
}
.listContainer ul.listTitle > li:first-of-type {
  width: 20%;
}
.listContainer ul.listTitle > li:nth-of-type(2) {
  width: 13%;
}
.listContainer ul.listTitle > li:nth-of-type(3) {
  text-align: center;
  width: 10%;
}
.listContainer ul.listTitle > li:nth-of-type(4) {
  width: 32%;
  padding-right: 30px;
}
.listContainer ul.listTitle > li:nth-of-type(5) {
  width: 15%;
}
.listContainer ul.listTitle > li:nth-of-type(6) {
  width: 10%;
}
.listContainer ul.listContent {
  background: #fff;
  &.clickActive > li {
    background: #aaa;
    &.child {
      background: #fff;
    }
  }
  li {
    padding: 0 0 0 5px;
  }
  > li {
    border: 1px solid #bcbdbd;
    border-width: 0 1px 1px 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 0 0 5px;

    &:first-of-type {
      border-left: 1px solid #bcbdbd;
    }
    .inputContainer > input {
      border: 0;
    }
    .assistCss {
      display: inline-block;
      width: auto;
      margin-right: 5px;

      > img {
        height: 70%;
        vertical-align: middle;
        position: relative;
        top: -2px;
      }
    }
  }
  > li.child {
    clear: both;
    height: auto;
    width: 100%;
    padding: 0;
    border: 0;
    > ul {
      &.clickActive > li {
        background: #aaa;
      }

      > li {
        float: left;
        height: 40px;
        position: relative;
        border: 1px solid #bcbdbd;
        border-width: 0 1px 1px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:first-of-type {
          width: 20%;
          border-width: 0 1px 1px 1px;
        }
        &:nth-of-type(2) {
          width: 13%;
        }
        &:nth-of-type(3) {
          text-align: center;
          width: 10%;
        }
        &:nth-of-type(4) {
          width: 32%;
        }
        &:nth-of-type(5) {
          width: 15%;
        }
        &:nth-of-type(6) {
          width: 10%;
        }
        > div {
          height: 100%;
        }
      }
    }
  }
}
li.child {
  clear: both;
  height: auto !important;
  width: 100%;
  padding: 0 !important;
  border: 0 !important;
  .child {
    background: #fff !important;
  }
  > ul {
    &.clickActive > li {
      background: #aaa;
    }

    > li {
      float: left;
      height: 40px;
      position: relative;
      border: 1px solid #bcbdbd;
      border-width: 0 1px 1px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:first-of-type {
        width: 20%;
        border-width: 0 1px 1px 1px;
      }
      &:nth-of-type(2) {
        width: 13%;
      }
      &:nth-of-type(3) {
        text-align: center;
        width: 10%;
      }
      &:nth-of-type(4) {
        width: 32%;
      }
      &:nth-of-type(5) {
        width: 15%;
      }
      &:nth-of-type(6) {
        width: 10%;
      }
      > div {
        height: 100%;
      }
    }
  }
}
.searcherCon {
  > div {
    float: left;
    height: 100%;
    &.searcherValue {
      border-radius: 4px 0 0 4px;
    }
  }
}
.subjectHanle {
  right: 0;
  position: absolute;
  z-index: 9;
  margin-right: 10px;
  /*width:585px;*/
  > li {
    float: left;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    margin-left: 10px;
    width: 90px;
    text-align: center;
    border-radius: 3px;
    > img {
      width: 100%;
      height: 100%;
    }
    &:first-of-type {
      background: none;
      color: #aaa;
      width: 252px;
    }
    &.subjectSet {
      transition: all 0.2s linear;
      position: relative;
      border: 1px solid #00b7ee;
      cursor: pointer;
      &:hover {
        height: 120px;
        border: 1px solid #00b7ee;
      }
      > div {
        float: left;
        width: 100%;
        height: 100%;
        z-index: 9;
        > ul {
          li {
            width: 100%;
            background: #fff;
            color: #aaa;
            &:hover {
              background: #ccc;
              color: #fff;
            }
          }
          > li:first-of-type {
            position: relative;
            text-align: left;
            padding-left: 10px;
            background: #00b7ee;
            color: #fff;
            &:after {
              content: "";
              position: absolute;
              right: 6px;
              top: 12px;
              border: 5px solid transparent;
              border-top: 5px solid #fff;
            }
          }
        }
      }
    }
    &:last-of-type {
      margin-right: 5px;
    }
    > ul > li {
      height: 30px;
    }
  }
}
i.newAddStateTrue:after {
  top: 5px;
}
.newAddStateFalse:before,
.newAddStateFalse:after {
  top: 20px;
}
.searcherBtn {
  height: 30px;
  width: 70px;
  text-align: center;
  line-height: 30px;
  border-radius: 0 4px 4px 0;
}
.addPageCon {
  position: fixed;
  position: -ms-page;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
  font-size: 16px;
  text-align: center;
  color: #666;
  background: rgba(0, 0, 0, 0.5);
  > div:last-of-type {
    display: inline-block;
    height: 100%;
    width: 0px;
    vertical-align: middle;
  }
  > .addPage {
    width: 556px;
    height: 410px;
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    padding: 5px 10px;
    > ul {
      padding: 10px 50px 0px;
      > li {
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;

        .inputContainer > input {
          border: 0;
          height: 80%;
          position: relative;
        }

        .subCodeCss {
          overflow: hidden;
          > span {
            float: left;
            height: 30px;
            line-height: 30px;
            width: 30%;
            background: #ccc;
            color: #fff;
            text-align: right;
            padding-right: 5px;
          }
          > div {
            float: left;
            width: 70%;
            > input {
              border: 0;
            }
          }
        }
        > div {
          height: 100%;
        }
        > div:last-of-type {
          width: 0;
          height: 0;
        }
        > div:first-of-type {
          float: left;
          width: 75px;
          text-align: right;
          padding-right: 10px;
        }
        > div:nth-of-type(2) {
          float: left;
          width: 359px;
          border: 1px solid #ccc;
          text-align: left;
        }
        &:nth-of-type(4) > div:nth-of-type(2) {
          border: 0;
        }
        &:nth-of-type(5) > div:nth-of-type(2) {
          border: 0;
        }
      }
      & > li:last-of-type {
        overflow-y: auto;
        margin-top: 10px;
        height: 65px;
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
  > span {
    float: left;
  }
  i {
    float: right;
    background: url("../../../assets/icon/close.svg");
    background-size: cover;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
}
.finishBtn {
  width: 230px;
  margin: auto;
  > :nth-of-type(2) {
    float: right;
  }
}
// .hideScroll{
//     position: absolute;
//     top:0;
//     right:0;
//     width: 16px;
//     height:100%;
//     background: #fff;
// }
.timeCss {
  float: right;
  height: 100%;
  position: relative;
  bottom: 100%;
  left: 55px;
  .box {
    top: -20px;
    right: 0;

    box-shadow: 0 0 20px 2px #ccc;
  }
}
.unCheckResBottom,
.unCheckResTop {
  position: fixed;
  position: -ms-page;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 99;
  background: transparent;
}
.unCheckResTop {
  top: 60px;
}
.unCheckResBottom {
  bottom: 0;
  height: 70px;
}
.auxiAddIcon {
  position: absolute;
  top: 6px;
  right: 5px;
  color: #aaa;
  cursor: pointer;
  font-size: 28px;
}
.clickActive .auxiAddIcon {
  color: #fff;
}
</style>
<style>
.subjectHanle .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 70px;
}
</style>

