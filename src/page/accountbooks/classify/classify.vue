<template>
  <div class="timeSelect">
    <div class="container">
      <div class="manageContent">
        <div class="reportBox">
          <div class="unionState"
               style="width: 100%;height: 40px;overflow: hidden">

            <div style="width:100%;float: right"
                 id="elSelf">
              <ul class="flexUl handle"
                  style="float: left;line-height: 30px">

                <el-select placeholder="剔除条件"
                           value="剔除条件"
                           style="width: 100px;">
                  <!--<el-option>
                                        <el-checkbox v-model="showFirst">只显示一级科目</el-checkbox>
                                    </el-option>-->
                  <el-option value="0">
                    <el-checkbox v-model="showBqList.showBenqi"
                                 @change="dispart('showBenqi')">剔除本期发生为0</el-checkbox>
                  </el-option>
                  <el-option value="1">
                    <el-checkbox v-model="showBqList.showQimo"
                                 @change="dispart('showQimo')">剔除期末余额为0</el-checkbox>
                  </el-option>
                  <el-option value="1">
                    <el-checkbox v-model="showBqList.showBaq"
                                 @change="dispart('showBaq')">剔除本期发生及期末余额均为0</el-checkbox>
                  </el-option>
                  <el-option value="1">
                    <el-checkbox v-model="showBqList.showBeq"
                                 @change="dispart('showBeq')">剔除本期发生为0且期末余额不为0</el-checkbox>
                  </el-option>
                  <el-option value="1">
                    <el-checkbox v-model="showBqList.showQeb"
                                 @change="dispart('showQeb')">剔除期末余额为0且本期发生不为0</el-checkbox>
                  </el-option>
                  <el-option value="2">
                    <el-checkbox v-model="proofType">剔除未审核凭证</el-checkbox>
                  </el-option>
                </el-select>
                <el-date-picker v-model="zwTime"
                                style="    height: 30px;    width: 225px;
                                position: relative;
                                top: 1px;"
                                type="monthrange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始月份"
                                end-placeholder="结束月份"
                                value-format="yyyy-MM"
                                @change="dateChange"
                                size="small"
                                :picker-options="pickerOptions">
                </el-date-picker>
                <!-- <el-date-picker v-model="zwTime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM"
                                style="width: 270px;padding-right: 0;"
                                size="small"
                                @change="getData">
                </el-date-picker> -->

                <el-select class="elselectSelf"
                           v-model="startCode"
                           placeholder="请选择"
                           @change="searchCodeStart"
                           filterable
                           style="margin-left: 15px">
                  <!--<el-input placeholder="快速搜索" style="border: 0;margin-bottom: 10px"></el-input>-->
                  <el-option v-for="item in subjectLists"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code"
                             :style="{'text-indent':item.layer*15+'px'}">
                  </el-option>
                </el-select>
                <span>至</span>
                <el-select v-model="endCode"
                           placeholder="请选择"
                           @change="searchCodeEnd"
                           filterable>
                  <el-option v-for="item in subjectLists"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code"
                             :style="{'text-indent':item.layer*10+'px'}"
                             :disabled="item.code<startCode">
                  </el-option>
                </el-select>
              </ul>
              <ul class="flexUl handle">
                <li v-if="Roleauthorize.generalLedger_export!=0"
                    @click="postBalanceSheetExcel">导出</li>
                <li v-if="Roleauthorize.generalLedger_print!=0"
                    @click="showPrintArea">打印</li>
                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;"
                    class="el-icon-refresh"
                    @click="refresh"></li>
              </ul>
              <ul class="flexUl handle"
                  style="line-height: 30px">
                <div class="searcherValue"><input type="text"
                         placeholder="科目编码/名称"
                         v-model="inputKvalue"></div>
                <div class="searcherBtn"
                     @click="searchCode">搜索</div>
              </ul>
            </div>
          </div>

          <div class="formData">
            <div class="tbHeader">
              <table>
                <colgroup>
                  <col width="8%" />
                  <col width="8%" />
                  <col width="10%" />
                  <col width="23%" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="4%">
                  <col width="15%" />
                </colgroup>
                <thead>
                  <tr>
                    <td>科目编码</td>
                    <td>科目名称</td>
                    <td>期间</td>
                    <td>摘要</td>
                    <td>借方金额（元）</td>
                    <td>贷方金额（元）</td>
                    <td>借/贷</td>
                    <td>余额（元）</td>
                  </tr>
                </thead>

              </table>
            </div>
            <div class="tbBody"
                 id="ts">
              <table ref="printFrom">
                <colgroup>
                  <col width="8%" />
                  <col width="8%" />
                  <col width="10%" />
                  <col width="23%" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="4%">
                  <col width="15%" />
                </colgroup>
                <tbody>
                  <template v-for="(item) in dataList">
                    <template v-if="item.Del.length>0">
                      <tr>
                        <td style="border-bottom: 0">
                          <span>{{item.Kcode}}</span>
                        </td>
                        <td style="border-bottom: 0">{{item.Kname}}</td>
                        <td class="center">{{item.Del[0].Pdate}}</td>
                        <td>{{item.Del[0].Abstract}}</td>
                        <td class="right">
                          <!--<template v-if="item.Del[0].Jsum!=0">
                                                    {{item.Del[0].Jsum | NumFormat}}
                                                </template>-->
                        </td>
                        <td class="right">
                          <!--<template v-if="item.Del[0].Dsum!=0">
                                                    {{item.Del[0].Dsum | NumFormat}}
                                                </template>-->
                        </td>
                        <td class="center">{{item.Del[0].K_balancetype}}</td>
                        <td class="right">
                          <!--<template v-if="item.Del[0].Jsum-item.Del[0].Dsum!=0">
                                                    {{(item.Del[0].K_balancetype=='借'?item.Del[0].Jsum-item.Del[0].Dsum:item.Del[0].Dsum-item.Del[0].Jsum)| NumFormat}}
                                                </template>-->
                          {{item.Del[0].Balance| NumFormat}}
                        </td>
                      </tr>
                      <template v-for="(del,index) in item.Del"
                                v-if="index>0">
                        <tr>
                          <td :style="{'border-width':index!=item.Del.length-1?'0 1px':'0px 1px 1px 1px'}"></td>
                          <td :style="{'border-width':index!=item.Del.length-1?'0 1px':'0px 1px 1px 1px'}"></td>
                          <td class="center">{{del.Pdate}}</td>
                          <td>{{del.Abstract}}</td>
                          <td class="right">
                            <template v-if="del.Jsum!=0">
                              {{del.Jsum | NumFormat}}
                            </template>
                          </td>
                          <td class="right">
                            <template v-if="del.Dsum!=0">
                              {{del.Dsum| NumFormat}}
                            </template>
                          </td>
                          <td class="center">{{del.K_balancetype}}</td>
                          <td class="right">
                            <!--<template v-if="del.Balance!=0">
                                                        {{del.Balance| NumFormat}}
                                                    </template>-->
                            {{del.Balance| NumFormat}}
                          </td>

                        </tr>
                      </template>

                    </template>
                    <!--<template v-else>
                                        <tr style="border-top: #00b7ee;page-break-after: always">
                                            <td :rowspan="item.Del.length+1" style="border-bottom-color: #00B8EE">{{item.Kcode}}</td>
                                            <td :rowspan="item.Del.length+1"  style="border-bottom-color: #00B8EE">{{item.Kname}}</td>
                                            <td colspan="6" class="center" style="border-bottom-color: #00B8EE">当前搜索数据为空</td>
                                        </tr>
                                    </template>-->
                  </template>
                  <template v-if="dataList.length<=0">
                    <tr>
                      <td colspan="8"
                          class="center"
                          style="border-bottom-color: #00B8EE">当前搜索数据为空</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <!--表头和表尾隐藏-->
            <table style="display: none">
              <colgroup>
                <col width="8%" />
                <col width="8%" />
                <col width="10%" />
                <col width="25%" />
                <col width="15%" />
                <col width="15%" />
                <col width="4%">
                <col width="15%" />
              </colgroup>
              <div id="theadArea">
                <tr>
                  <td colspan="8"
                      style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">总分类账</td>
                </tr>
                <tr>
                  <td colspan="8"
                      style="background-color: #fff;font-size: 14px;border: 0">
                    {{date1.choosedYear}}年{{date1.choosedMonth<10?'0'+date1.choosedMonth:date1.choosedMonth}}月 -
                                                                     {{date1.choosedYearEnd}}
                                                                     年{{date1.choosedMonthEnd<10?'0'+date1.choosedMonthEnd:date1.choosedMonthEnd}}月
                                                                     {{ date1.choosedYearEnd < jyear ?'':((date1.choosedYearEnd==jyear && date1.choosedMonthEnd <= jmonth)?'':'(未结账)') }}
                                                                     </td>
                                                                     </tr>
                                                                     <tr>
                  <td colspan="5"
                      class="left"
                      style="background-color: #fff;border: 0;">编制单位：{{orgName}}</td>
                  <td colspan="3"
                      class="right"
                      style="background-color: #fff;border: 0;">单位：元</td>
                </tr>
              </div>

              <div id="tbodyArea">
                <tr>
                  <td colspan="8">
                    注：
                    <input disabled
                           type="checkbox"
                           :checked="showBqList.showBenqi"
                           style="margin-left: 10px"> 剔除本期发生为0
                    <input disabled
                           type="checkbox"
                           :checked="showBqList.showQimo"
                           style="margin-left: 10px"> 剔除期末余额为0
                    <input disabled
                           type="checkbox"
                           :checked="showBqList.proofType"
                           style="margin-left: 10px"> 剔除未审核凭证
                    <input disabled
                           type="checkbox"
                           :checked="showBqList.showFirst"
                           style="margin-left: 10px"> 只显示1级科目

                    <!--<el-checkbox v-model="proofType" @change="dispart">剔除未审核凭证</el-checkbox>-->
                  </td>
                </tr>
                <tr>
                  <td colspan="3"
                      style="border: 0;">
                    财务主管：{{curOrg.Treasurer}}
                  </td>
                  <td colspan="3"
                      style="border: 0;">审核：</td>
                  <td colspan="2"
                      style="border: 0;">制表：{{username}}</td>
                </tr>
              </div>

            </table>
          </div>
        </div>

        <div class="timeSelectBox">
          <time-select-bar @item-click="dateChoose"
                           ref="dateDtl"
                           :showtype="'doubleTime'"></time-select-bar>
        </div>
      </div>
    </div>
    <!--打印预览界面-->
    <div id="covCon"
         class="cover"
         :style="{'display':(showPrint?'block':'none'),'z-index':'999'}">
      <div class="coverContent"
           style="width: auto;height: auto;top: 30px;left:40px;right: 40px;margin-top: 0;margin-left:0;">
        <div id="covTil"
             class=""
             style="text-align: left">
          <span>打印预览界面</span>
          <i class="el-icon-close"
             style="cursor: pointer;text-align:right;float: right;padding-top: 4px;margin-left: 50px;"
             @click="closePrintArea"></i>
          <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right'
             @click="printContent">打印</a>
          <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right;color: #333333'
             @click="closePrintArea">取消</a>
        </div>
        <div id="printContentArea"
             style="margin-bottom: 20px">

        </div>
        <ul class=" handle"
            style="margin-bottom: 20px;margin-top: 20px">
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TimeSelectBar from "@/components/TimeSelectBar/index";
import httpConfig from '@/util/ajaxConfig';
import { mapState, mapGetters } from "vuex";
import { SubjectList } from '@/api/subject/subjectInfo'
import Countdownpop from "../../../components/countDownPop/index";  //自定义ajax头部配置*****
import qs from 'qs'
import ScrollPane from "../../../components/ScrollBar/scrollPane";

export default {
  name: "balance",
  data () {
    return {
      date1: {
        choosedMonth: '',
        choosedMonthEnd: '',
        choosedYear: '',
        choosedYearEnd: '',
      },
      dataList: '',
      zwTime: [],
      StartPNo: '',
      EndPno: '',
      startMoney: '',
      endMoney: '',
      chooseYear: '',
      inputKvalue: '',//搜索框输入
      showBqList: {
        showFirst: false,//显示一级科目
        showBenqi: false,//隐藏本期发生金额为0
        showQimo: false,//隐藏期末发生金额为0
        showBaq: false,//剔除本期发生及期末余额均为0
        showBeq: false,//剔除本期发生为0且期末余额不为0
        showQeb: false//剔除期末余额为0且本期发生不为0
      },

      proofType: false,//未审核凭证
      showType: 0,//0全显示，1剔除本期发生金额为0,2剔除余额为0,3全部剔除
      subjectLists: [],//科目列表
      startCode: '',//查询开始科目
      endCode: '',//结束科目
      KcodeList: [],
      balance: {
        0: '借',
        1: '贷',
        2: '平'
      },
      lenList: {},
      showPrint: false,//打印预览界面 显示隐藏
      jyear: 0,
      jmonth: 0,
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick (picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick (picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  mounted () {
    this.getCheckeds();
    window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
  components: { ScrollPane, Countdownpop, TimeSelectBar },
  computed: {
    ...mapState({
      orgName: state => state.user.orgName,
      userid: state => state.user.userid,
      orgid: state => state.user.orgid,
      orgcode: state => state.user.orgcode,
      curOrg: state => state.user.curOrg,   //当前的组织信息
      username: state => state.user.username,
      Roleauthorize: state => state.user.Roleauthorize,
    }),
  },
  watch: {
    proofType: function () {
      this.getData(false);
    }
  },
  methods: {
    //滚动事件
    handleScroll: function () {
      let scObj = document.getElementById('covCon');//打印区域滚动
      if (scObj == undefined) {
        window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件
      } else {
        if (scObj.scrollTop > 35) {
          document.getElementById('covTil').classList.add('fixTitle');
        } else {
          document.getElementById('covTil').classList.remove('fixTitle');
        }
      }
    },
    /*获取结账年*/
    getCheckeds () {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        queryfilter: { "OrgId*num*eq*1": this.orgid }
      }
      this.$axios.get('/PBusinessConfig/GetPBusinessConfigList', { params: data })
        .then(res => {
          console.log(res);
          if (res.Record.length > 0) {
            this.jyear = res.Record[0].JYear;
            this.jmonth = res.Record[0].JAccountPeriod;
          } else {
            let currentYear = new Date();
            this.jyear = currentYear.getFullYear();
            this.jmonth = 0;
          }
        })
        .catch(err => console.log(err))
    },
    //滚动事件监听
    /* handleScroll: function () {
         let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
         // 设备/屏幕高度
         let scrollObj = document.getElementById('ts'); // 滚动区域

         if(scrollObj==undefined){
             window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件

         }else{
             let scrollTop = scrollObj.scrollTop; // div 到头部的距离
             let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
             console.log(this.lenList);
             /!*for(var i in this.lenList){
                 console.log(this.lenList[i]);
             }*!/

             console.log('scrollTop:'+scrollTop);
             console.log('scrollHeight:'+scrollHeight);
             //滚动条到底部的条件
             /!*if(scrollTop>=100){
                 // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
                 if(!this.busy){
                     this.loadMore();
                 }
             }*!/
         }

     },*/
    //显示剔除
    dispart: function (val) {
      console.log(val);
      let tof = this.showBqList[val];
      this.showBqList = {
        showFirst: false,//显示一级科目
        showBenqi: false,//隐藏本期发生金额为0
        showQimo: false,//隐藏期末发生金额为0
        showBaq: false,//剔除本期发生及期末余额均为0
        showBeq: false,//剔除本期发生为0且期末余额不为0
        showQeb: false//剔除期末余额为0且本期发生不为0
      };
      this.showBqList[val] = tof;

      switch (val) {
        case 'showBenqi':
          this.showType = this.showBqList[val] ? 1 : 0;
          break;
        case 'showQimo':
          this.showType = this.showBqList[val] ? 2 : 0;
          break;
        case 'showBaq':
          this.showType = this.showBqList[val] ? 3 : 0;
          break;
        case 'showBeq':
          this.showType = this.showBqList[val] ? 4 : 0;
          break;
        case 'showQeb':
          this.showType = this.showBqList[val] ? 5 : 0;
          break;
        default: break;
      }

      this.getData();
    },
    //数据查询
    getData: function () {
      let KcodeList = [];
      if (this.KcodeList.length > 0) {
        KcodeList = this.KcodeList;
      } else {
        for (var i in this.subjectLists) {
          if (this.subjectLists[i].code >= this.startCode && this.subjectLists[i].code <= this.endCode) {
            KcodeList.push(this.subjectLists[i].code)
          }
        }
      }
      let loading = this.$loading();
      let data = {
        "uid": this.userid,
        "Kcodes": KcodeList,
        "Year": this.date1.choosedYear,
        "OrgIds": this.orgid,
        "StartTime": this.date1.choosedMonth,
        "EndTime": this.date1.choosedMonthEnd,
        "ZeroType": this.showType,
        "Verify": this.proofType ? '1' : '0'
      };
      this.$axios.post(
        'PVoucherMst/PostDetailAccountALL',
        data
      ).then(res => {
        loading.close();

        this.dataList = qs.parse(res).Record;
        this.lenList = {};
        for (let k in this.dataList) {
          this.lenList[k] = (this.dataList[k].Del.length * 40);
        }
      }).catch(err => {
        loading.close();
        console.log(err);
      })
    },
    //输入框科目查询
    searchCode: function () {
      if (this.inputKvalue == '') {
        this.KcodeList = [];
        this.startCode = this.subjectLists[0].code;
        this.endCode = this.subjectLists[this.subjectLists.length - 1].code;
        this.getData();
      } else {
        this.KcodeList = [];
        for (let i in this.subjectLists) {
          if (this.subjectLists[i].code.indexOf(this.inputKvalue) != -1 || this.subjectLists[i].name.indexOf(this.inputKvalue) != -1) {
            this.KcodeList.push(this.subjectLists[i].code);
          }
        } if (this.KcodeList.length > 0) {
          this.startCode = this.KcodeList[0];
          this.endCode = this.KcodeList[this.KcodeList.length - 1];
          this.getData();
        } else {
          this.$message('当前搜索条件不存在对应科目');
        }
      }
    },
    //开始科目更换查询
    searchCodeStart: function () {
      this.inputKvalue = '';
      this.KcodeList = [];
      if (this.startCode > this.endCode) {
        this.endCode = this.startCode;
      }
      this.getData();
    },
    //结束科目查询
    searchCodeEnd: function () {
      this.inputKvalue = '';
      this.KcodeList = [];
      this.getData()
    },
    //时间选择
    dateChange: function (val) {


      this.date1.choosedMonth = parseInt(val[0].slice(5));
      this.date1.choosedMonthEnd = parseInt(val[1].slice(5));

      this.date1.choosedYear = parseInt(val[0].slice(0, 4));
      this.date1.choosedYearEnd = parseInt(val[1].slice(0, 4));
      this.$refs.dateDtl.dateChooseFn(this.date1);

    },
    //时间选择器选择时间返回值
    dateChoose: function (val) {


      this.date1 = val;
      // this.zwTime[0] = this.date1.choosedYear + '-' + this.date1.choosedMonth;
      // this.zwTime[1] = this.date1.choosedYearEnd + '-' + this.date1.choosedMonthEnd;
      let da1 = this.date1.choosedYear + '-' + (this.date1.choosedMonth > 9 ? this.date1.choosedMonth : ('0' + this.date1.choosedMonth));
      let da2 = this.date1.choosedYearEnd + '-' + (this.date1.choosedMonthEnd > 9 ? this.date1.choosedMonthEnd : ('0' + this.date1.choosedMonthEnd));
      this.$set(this.zwTime, 0, da1)
      this.$set(this.zwTime, 1, da2)
      this.getSubjectData();
    },
    getSubjectData: function () {
      let vm = this;
      this.subjectLists = [];
      let queryfilter = {
        KCode: '',
        KName: ''
      };
      SubjectList(vm, {
        uid: this.userid,
        orgid: this.orgid,
        Ryear: this.date1.choosedYear,
        infoData: queryfilter
      }).then(res => {
        this.fiyClassList(res);
        this.startCode = this.subjectLists[0].code;
        this.endCode = this.subjectLists[this.subjectLists.length - 1].code;
        if (res.length > 0) {
          //加载第一个科目的明细
          this.getData(false);
        }
      }).catch(error => {
        this.saasMessage = {
          message: '科目列表获取错误',
          delay: 3000,
          visible: true
        };
      })

    },
    //科目列表化，将所有子科目全部取出
    fiyClassList: function (listC) {
      for (var i in listC) {
        this.subjectLists.push({ 'code': listC[i].KCode, 'name': listC[i].KCode + "-" + listC[i].KName, 'layer': listC[i].Layers });
        if (listC[i].children.length > 0) {
          this.fiyClassList(listC[i].children);
        }
      }
    },

    //刷新
    refresh: function () {
      this.getData();
    },
    /*
     *author:hyz
     *导出Excel表格
     *
     * */
    postBalanceSheetExcel: function () {
      let loading = this.$loading();
      let KcodeList = [];
      if (this.KcodeList.length > 0) {
        KcodeList = this.KcodeList;
      } else {
        for (var i in this.subjectLists) {
          if (this.subjectLists[i].code >= this.startCode && this.subjectLists[i].code <= this.endCode) {
            KcodeList.push(this.subjectLists[i].code)
          }
        }
      }
      let param = {
        "uid": this.userid,
        "Kcodes": KcodeList,
        "Year": this.date1.choosedYear,
        "OrgIds": this.orgid,
        "StartTime": this.date1.choosedMonth,
        "EndTime": this.date1.choosedMonthEnd,
        "ZeroType": this.showType,
        "Verify": this.proofType ? '1' : '0'
      };

      //let baseheader = httpConfig.header;
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      //下载Excel
      this.downloadLoading = true
      this.$axios.post('PVoucherMst/PostDetailAccountAllExcel', param).then(res => {
        //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
        if (res.Status == "error") {
          this.$message({ showClose: true, message: res.Msg, type: 'error' })
        } else {
          //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
          /*let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
          myWindow=null;*/
          let tempLink = document.createElement("a");
          let downloadUrl = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
          tempLink.style.display = "none";
          tempLink.href = downloadUrl;
          tempLink.setAttribute("download", res.filename);
          if (typeof tempLink.download === "undefined") {
            tempLink.setAttribute("target", "_blank");
          }
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        }
        this.downloadLoading = false;
        loading.close();
      }).catch(err => {
        loading.close();
        console.log(err)
      })
    },
    /*// 打印
    printContent(e){
        let print = document.createElement("div");
        print.setAttribute('class','timeSelect');
        //获取打印表格的表头
        let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
        let cop = this.$refs.printFrom.cloneNode(true);
        cop.insertBefore(dm,cop.childNodes[2]);
        print.appendChild(cop)
        this.$print(print) // 使用
    },*/
    //显示打印预览
    showPrintArea: function () {
      this.showPrint = true;
      //获取打印内容，渲染于弹窗
      let print = document.createElement("div");
      print.setAttribute('class', 'timeSelect');
      print.style.padding = '30px 40px 30px 30px';
      //获取页面显示的打印表格的表头
      let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
      //获取隐藏的工会组织科目名称的表头
      let thchilds = document.getElementById('theadArea').cloneNode(true).childNodes;
      //获取隐藏的表格内容--表尾
      let tbchilds = document.getElementById('tbodyArea').cloneNode(true).childNodes;
      //表头拼接
      for (let i = thchilds.length - 1; i >= 0; i--) {
        dm.insertBefore(thchilds[i], dm.firstChild);
      }
      //获取页面的表格内容
      let cop = this.$refs.printFrom.cloneNode(true);
      //表格内容拼接表尾
      for (let i = 0; i < tbchilds.length; i++) {
        cop.lastChild.appendChild(tbchilds[i]);
      }
      //表格内容拼接表头
      cop.insertBefore(dm, cop.childNodes[2]);
      print.appendChild(cop);
      //内容全部放入打印预览
      document.getElementById('printContentArea').appendChild(print);
    },
    //关闭打印预览
    closePrintArea: function () {
      this.showPrint = false;
      document.getElementById('printContentArea').innerHTML = '';
    },
    // 打印
    printContent (e) {
      let print = document.getElementById('printContentArea');
      this.$print(print) // 使用
    },
  }
}
</script>
<style scoped>
.searchPanel {
  position: absolute;
  top: 42px;
  right: 130px;
  z-index: 99;
  background-color: #fff;
  width: 339px;
  height: 230px;
  box-shadow: 0 0 6px 2px #c9ccce;
  border-radius: 10px 10px;
}
.searchPanel .flexPublic {
  padding: 5px 10px;
  height: 45px;
}
.searchPanel .searchPanel_title {
  height: 29px;
  background-color: #00b7ee;
  color: #fff;
  border-radius: 10px 10px 0 0;
}
.searchPanel .searchPanel_title div:nth-of-type(2) {
  padding: 3px;
  border-radius: 15px;
  background: white;
  font-size: 15px;
  color: #00b7ee;
  cursor: pointer;
}
.searchPanel > .flexPublic:nth-of-type(3) > div:last-child,
.searchPanel > .flexPublic:nth-of-type(4) > div:last-child {
  width: 250px;
  padding-left: 10px;
}
.searchPanel > .flexPublic:nth-of-type(3) > div:last-child input,
.searchPanel > .flexPublic:nth-of-type(4) > div:last-child input {
  width: 116px;
  display: inline;
  font-size: 14px;
  color: #606266;
  border: none;
  padding-left: 5px;
}
.searchPanel input:focus {
  box-shadow: 0 0 3px 0.1px #00b8ee;
}
.searchPanel .searchPanel_bottom {
  height: 65px;
  border-top: 1px solid #dddfe4;
  padding: 0 40px;
}
.searchPanel .searchPanel_btn {
  width: 135px;
  height: 33px;
  color: #fff;
  line-height: 33px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
}

.searchPanel .greybtn {
  border: 1px solid #ccc;
  color: #fff;
  background-color: #ccc;
  padding: 0px 15px;
  width: 100px;
  border-radius: 3px;
}
.searchPanel .greybtn:hover {
  color: #ccc;
  background-color: #fff;
}
.searchPanel .bluebtn {
  border: 1px solid #00b8ee;
  color: #fff;
  background: #00b8ee;
  padding: 0px 15px;
  width: 100px;
  border-radius: 3px;
}
.searchPanel .bluebtn:hover {
  color: #00b8ee;
  background: #fff;
}
.cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(66, 66, 66, 0.45);
  z-index: 99;
  text-align: center;
  overflow-y: auto;
}
.coverContent {
  background-color: #fff;
  width: 362px;
  height: auto;
  position: absolute;
  top: 5%;
  left: 5%;
  right: 5%;
  margin-bottom: 50px;
  box-shadow: 0 0 5px 1px #d3e9f9;
}

.coverContent div:nth-of-type(1) {
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
}
.coverContent div:nth-of-type(2) {
  padding: 0px 20px;
}
.coverContent ul {
  padding: 0px 50px;
  margin-bottom: 20px;
}
.coverContent ul li:nth-of-type(1) {
  border: 1px solid #00b8ee;
  color: #00b8ee;
  background: #fff;
  padding: 5px 15px;
  width: 100px;
  border-radius: 3px;
}
.coverContent ul li {
  border: 1px solid #00b8ee;
  color: #fff;
  background: #00b8ee;
  padding: 5px 15px;
  width: 100px;
  border-radius: 3px;
}
.coverContent ul li:hover {
  color: #00b8ee;
  background: #fff;
}

/*兼容IE11样式  测试后才可确定是否可用*/
@media screen and(-ms-high-contrast:active), (-ms-high-contrast: none) {
  .cover {
    position: -ms-page;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(66, 66, 66, 0.45);
    z-index: 99;
    text-align: center;
    overflow-y: auto;
  }
}
.manageContent {
  padding-right: 30px;
}
.formData {
  right: 50px;
}
.timeSelect .timeSelectBox {
  right: -40px;
}
</style>
<style>
#elSelf .el-scrollbar .el-input {
  border: 0px;
  position: fixed;
  margin-top: -6px;
  z-index: 999;
}
#elSelf .el-scrollbar .el-input__inner {
  border-width: 0 0 1px 0;
  border-radius: 0;
  width: 195px;
  z-index: 268;
}
.flexUl .el-input--suffix .el-input__inner {
  line-height: 30px;
}
</style>
