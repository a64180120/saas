<template>
  <div class="timeSelect ridusCheck">
    <div class="container">
      <div class="manageContent"
           v-loading="loading">
        <div class="reportBox">
          <div class="">
            <div class="flexUl"
                 style="float: left;margin-right:10px">
              <el-select placeholder="剔除条件"
                         value="剔除条件"
                         style="width: 100px;">
                <el-option value="0">
                  <el-checkbox v-model="proofType">剔除未审核凭证</el-checkbox>
                </el-option>
              </el-select>
            </div>
            <el-date-picker v-model="dateSelect"
                            @change="dateChange"
                            value-format="yyyy-MM"
                            type="month"
                            placeholder="选择月">
            </el-date-picker>
            <ul class="flexUl">
              <li style='width: 72px;'
                  icon="el-icon-lx-down"
                  @click="getAndShowBill">银行对账单</li>
              <li v-if="Roleauthorize.assetLiability_export!=0"
                  icon="el-icon-lx-down"
                  @click="postBalanceSheetExcel">导出</li>
              <li v-if="Roleauthorize.assetLiability_print!=0"
                  icon="el-icon-lx-mail"
                  @click="showPrintArea(printType=0)">打印</li>

              <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;"
                  class="el-icon-refresh"
                  @click="refresh"></li>
            </ul>
          </div>

          <div class="formData">
            <div class="tbHeader">
              <table>
                <colgroup>
                  <col width="8%" />
                  <col width="14%" />
                  <col width="14%" />
                  <col width="14%" />
                  <col width="1%" />
                  <col width="8%" />
                  <col width="14%" />
                  <col width="14%" />
                  <col width="14%" />
                </colgroup>
                <thead>
                  <tr>
                    <td>科目编码</td>
                    <td>资产</td>
                    <td>年初数(元)</td>
                    <td>期末数(元)</td>
                    <td></td>
                    <td>科目编码</td>
                    <td>负债与净资产</td>
                    <td>年初数(元)</td>
                    <td>期末数(元)</td>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="tbBody ">
              <table ref="printFrom">
                <colgroup>
                  <col width="8%" />
                  <col width="14%" />
                  <col width="14%" />
                  <col width="14%" />
                  <col width="1%" />
                  <col width="8%" />
                  <col width="14%" />
                  <col width="14%" />
                  <col width="14%" />
                </colgroup>
                <tbody>
                  <tr>
                    <td></td>
                    <td class="center bolder">一、资产</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="center bolder">二、负债</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <template v-if="cashInData.length >= cashOutData.length+cashData.length+5">
                    <template v-for="(item,index) in cashInData">
                      <tr>
                        <template v-if="item.KCode=='102'">
                          <td @click="hideMoney">
                            {{item.KCode}}
                            <i :class="{'hyzIcon_eye':!hideMoneyType,'hyzIcon_eyeclose':hideMoneyType}"
                               style="margin-top:3px;float: right"></i>
                          </td>
                          <td>{{item.KName}}</td>
                          <td class="right">
                            <template v-if="hideMoneyType">
                              ********
                            </template>
                            <template v-else>
                              {{item.StartSum}}
                            </template>
                          </td>
                          <td class="right">
                            <template v-if="hideMoneyType">
                              ********
                            </template>
                            <template v-else>
                              {{item.EndSum}}
                            </template>
                          </td>
                          <td></td>
                          <template v-if="index<cashOutData.length">
                            <td>{{cashOutData[index].KCode}}</td>
                            <td>{{cashOutData[index].KName}}</td>
                            <td class="right">{{cashOutData[index].StartSum}}</td>
                            <td class="right">{{cashOutData[index].EndSum}}</td>
                          </template>
                          <template v-else-if="index==cashOutData.length">
                            <td></td>
                            <td class="center bolder">负债合计</td>
                            <td class="right">{{cashCounts}}</td>
                            <td class="right">{{cashCountsQ}}</td>
                          </template>
                          <template v-else-if="index==cashOutData.length+1">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </template>
                          <template v-else-if="index==cashOutData.length+2">
                            <td></td>
                            <td class="center bolder">三、净资产类</td>
                            <td></td>
                            <td></td>
                          </template>
                          <template v-else-if="index==cashOutData.length+cashData.length+3">
                            <td></td>
                            <td class="center bolder">净资产合计</td>
                            <td class="right">{{cashCounts}}</td>
                            <td class="right">{{cashCountsQ}}</td>
                          </template>
                          <template v-else-if="index>cashOutData.length+cashData.length+3">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </template>
                          <template v-else>
                            <td>{{cashData[index-cashOutData.length-3].KCode}}</td>
                            <td>{{cashData[index-cashOutData.length-3].KName}}</td>
                            <td class="right">{{cashData[index-cashOutData.length-3].StartSum}}</td>
                            <td class="right">{{cashData[index-cashOutData.length-3].EndSum}}</td>
                          </template>
                        </template>
                        <template v-else>
                          <td>
                            {{item.KCode}}
                          </td>
                          <td>{{item.KName}}</td>
                          <td class="right">{{item.StartSum}}</td>
                          <td class="right">{{item.EndSum}}</td>
                          <td></td>
                          <template v-if="index<cashOutData.length">
                            <td>{{cashOutData[index].KCode}}</td>
                            <td>{{cashOutData[index].KName}}</td>
                            <td class="right">{{cashOutData[index].StartSum}}</td>
                            <td class="right">{{cashOutData[index].EndSum}}</td>
                          </template>
                          <template v-else-if="index==cashOutData.length">
                            <td></td>
                            <td class="center bolder">负债合计</td>
                            <td class="right">{{cashCounts}}</td>
                            <td class="right">{{cashCountsQ}}</td>
                          </template>
                          <template v-else-if="index==cashOutData.length+1">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </template>
                          <template v-else-if="index==cashOutData.length+2">
                            <td></td>
                            <td class="center bolder">三、净资产类</td>
                            <td></td>
                            <td></td>
                          </template>
                          <template v-else-if="index==cashOutData.length+cashData.length+3">
                            <td></td>
                            <td class="center bolder">净资产合计</td>
                            <td class="right">{{cashCounts}}</td>
                            <td class="right">{{cashCountsQ}}</td>
                          </template>
                          <template v-else-if="index>cashOutData.length+cashData.length+3">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </template>
                          <template v-else>
                            <td>{{cashData[index-cashOutData.length-3].KCode}}</td>
                            <td>{{cashData[index-cashOutData.length-3].KName}}</td>
                            <td class="right">{{cashData[index-cashOutData.length-3].StartSum}}</td>
                            <td class="right">{{cashData[index-cashOutData.length-3].EndSum}}</td>
                          </template>
                        </template>

                      </tr>
                    </template>
                  </template>
                  <template v-else>
                    <template v-for="index in (cashOutData.length+cashData.length+4)">
                      <tr>
                        <template v-if="index<=cashInData.length">
                          <template v-if="cashInData[index-1].KCode=='102'">
                            <td class="align-center"
                                @click="hideMoney">
                              {{cashInData[index-1].KCode}}
                              <i :class="{'hyzIcon_eye':!hideMoneyType,'hyzIcon_eyeclose':hideMoneyType}"
                                 style="margin-top: 3px;float: right"></i>
                            </td>
                            <td>{{cashInData[index-1].KName}}</td>
                            <td class="right">
                              <template v-if="hideMoneyType">
                                ********
                              </template>
                              <template v-else>
                                {{cashInData[index-1].StartSum | NumFormat}}
                              </template>
                            </td>
                            <td class="right">
                              <template v-if="hideMoneyType">
                                ********
                              </template>
                              <template v-else>
                                {{cashInData[index-1].EndSum | NumFormat}}
                              </template>
                            </td>
                          </template>
                          <template v-else>
                            <td class="align-center">{{cashInData[index-1].KCode}}</td>
                            <td>{{cashInData[index-1].KName}}</td>
                            <td class="right">{{cashInData[index-1].StartSum | NumFormat}}</td>
                            <td class="right">{{cashInData[index-1].EndSum | NumFormat}}</td>
                          </template>

                        </template>
                        <template v-else>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </template>
                        <td></td>
                        <template v-if="index<=cashOutData.length">
                          <td class="center">{{cashOutData[index-1].KCode}}</td>
                          <td>{{cashOutData[index-1].KName}}</td>
                          <td class="right">{{cashOutData[index-1].StartSum | NumFormat}}</td>
                          <td class="right">{{cashOutData[index-1].EndSum | NumFormat}}</td>
                        </template>
                        <template v-else-if="index==cashOutData.length+1">
                          <td></td>
                          <td class="center bolder">负债合计</td>
                          <td class="right">{{cashOutCounts | NumFormat}}</td>
                          <td class="right">{{cashOutCountsQ | NumFormat}}</td>
                        </template>
                        <template v-else-if="index==cashOutData.length+2">
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </template>
                        <template v-else-if="index==cashOutData.length+3">
                          <td></td>
                          <td class="center bolder">三、净资产类</td>
                          <td></td>
                          <td></td>
                        </template>
                        <template v-else-if="index <= cashOutData.length+cashData.length+3">
                          <td class="center">{{cashData[index-cashOutData.length-4].KCode}}</td>
                          <td>{{cashData[index-cashOutData.length-4].KName}}</td>
                          <td class="right">{{cashData[index-cashOutData.length-4].StartSum | NumFormat}}</td>
                          <td class="right">{{cashData[index-cashOutData.length-4].EndSum | NumFormat}}</td>
                        </template>
                        <template v-if="index == cashOutData.length+cashData.length+4">
                          <td></td>
                          <td class="center bolder">净资产合计</td>
                          <td class="right">{{cashCounts | NumFormat}}</td>
                          <td class="right">{{cashCountsQ | NumFormat}}</td>
                        </template>
                      </tr>
                    </template>
                  </template>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td class="center bolder">资产总计</td>
                    <td class="right">{{cashInCounts | NumFormat}}</td>
                    <td class="right">{{cashInCountsQ | NumFormat}}</td>
                    <td></td>
                    <td></td>
                    <td class="center bolder">负债与净资产总计</td>
                    <td class="right">{{(Number(cashOutCounts)+Number(cashCounts)).toFixed(2) | NumFormat}}</td>
                    <td class="right">{{(Number(cashOutCountsQ)+Number(cashCountsQ)).toFixed(2) | NumFormat}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--表头和表尾隐藏-->
            <table style="display: none">
              <colgroup>
                <col width="5%" />
                <col width="14%" />
                <col width="15%" />
                <col width="15%" />
                <col width="1%" />
                <col width="5%" />
                <col width="14%" />
                <col width="15%" />
                <col width="15%" />
              </colgroup>
              <div id="theadArea">
                <tr>
                  <td colspan="9"
                      style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">资产负债表</td>
                </tr>
                <tr>
                  <td colspan="9"
                      style="background-color: #fff;font-size: 14px;border: 0">
                    {{date1.choosedYear}}年
                    {{date1.choosedMonth<10?'0'+date1.choosedMonth:date1.choosedMonth}}月 {{ (((date1.choosedYear)%4==0&&(date1.choosedYear%100)!=0)||((date1.choosedYear)%400==0))?monthDayR[this.date1.choosedMonth-1]:monthDay[this.date1.choosedMonth-1]}}
                                                                     日
                                                                     {{ date1.choosedYear < jyear ?'':((date1.choosedYear==jyear && date1.choosedMonth <= jmonth)?'':'(未结账)') }}
                                                                     </td>
                                                                     </tr>
                                                                     <tr>
                  <td colspan="3"
                      class="left"
                      style="background-color: #fff;border: none">编制单位：{{orgName}}</td>
                  <td colspan="6"
                      class="right"
                      style="background-color: #fff;border: none;">单位：元</td>
                </tr>
              </div>

              <div id="tbodyArea">
                <tr>
                  <td colspan="9">
                    注：
                    <input disabled
                           type="checkbox"
                           :checked="proofType"> 剔除未审核凭证
                    <!--<el-checkbox v-model="proofType" @change="dispart">剔除未审核凭证</el-checkbox>-->
                  </td>
                </tr>
                <tr>
                  <td colspan="2"
                      style="border: 0;">
                    工会主席：{{curOrg.Chairman}}
                  </td>
                  <td colspan="3"
                      style="border: 0;">审核：</td>
                  <td colspan="3"
                      style="border: 0;">复核：</td>
                  <td colspan="1"
                      style="border: 0;">制表：{{username}}</td>
                </tr>
              </div>

            </table>
          </div>
        </div>
        <div class="timeSelectBox">
          <time-select-bar @item-click="dateChoose"
                           ref="dateDtl"
                           :showtype="'singleTime'"></time-select-bar>
        </div>

        <!--银行对账单界面-->
        <div class="cover"
             :style="{'display':(showBill?'block':'none'),'z-index':'999'}">
          <div class="coverdiv">
            <div class="head">
              <p>上传银行对账单</p>
              <i class="el-icon-close"
                 style="cursor: pointer;"
                 @click="showBill=false"></i>
            </div>
            <div class="selectarea">
              <span>{{date1.choosedYear}}年度</span>
              <span class="tip">*PDF文件不能打印，只能下载。</span>
              <div class="btnArea">
                <div class=""
                     @click="downloadImg">下载</div>
                <div class=""
                     @click="showPrintArea(printType=1)">打印</div>
              </div>
            </div>
            <div class="formData"
                 style="overflow-y: auto;height: 420px;overflow-x: hidden;top: 90px;left: 30px;right: 30px; padding:10px">
              <template v-for="(item,index) in BillList">

                <div class="selsectArea upload-demo">
                  <template v-if="item.img.length>0">
                    <div class="select-top">
                      <div class="top-left">
                        <p class="hyzIcon_book">{{item.img.length}}</p>
                      </div>
                      <div class="top-right">
                        <el-checkbox class="checkLabel"
                                     v-model="checkMonth[index]"></el-checkbox>
                      </div>
                    </div>
                    <div class="pdf">
                      <div v-if="item.voucherBanks[0].BType === '.pdf'">
                        <img src="../../assets/images/pdf.jpg">
                      </div>
                    </div>

                  </template>
                  <el-upload class="upload-item"
                             multiple
                             :ref="'upload'+(index)"
                             :action="'month'+(index+1)"
                             :on-preview="handlePreviewN"
                             :on-remove="handleRemoveN"
                             :before-upload="beforeUploadPic"
                             :http-request='uploadFileMethod'
                             :file-list="item.img"
                             list-type="picture-card">
                    <i class="el-icon-lx-add"></i>
                    <div slot="tip"
                         class="el-upload__tip">{{index+1}}月</div>
                  </el-upload>

                </div>

              </template>
            </div>
          </div>
        </div>
        <!--图片预览界面-->
        <div id="imgContentArea"
             class="cover"
             :style="{'display':(showImg?'block':'none'),'z-index':'999'}">
          <div v-if="fileType === 'application/pdf'">
            <div class="imgContent"
                 style="">
              <template id="embed">
                <embed :src="chooseImg.url"
                       style="width: auto;width: 50%;height: 100%" />
              </template>
              <i class="el-icon-close"
                 style="cursor: pointer;position:absolute;text-align:right;margin-top: -20px;margin-left: 10px;color: white;font-size: 35px"
                 @click="closePrintArea(1)"></i>
            </div>
          </div>
          <div v-else>
            <div class="imgContent"
                 style="">
              <img :src="chooseImg.url"
                   style="width: auto;height: 100%">
              <i class="el-icon-close"
                 style="cursor: pointer;position:absolute;text-align:right;margin-top: -20px;margin-left: 10px;color: white;font-size: 35px"
                 @click="closePrintArea(1)"></i>

            </div>
            <div class="imgList"
                 style="">
              <ul>
                <template v-for="item in imgList">
                  <li :class="{'choose':(chooseImg.url==item.url)}"
                      @click="checkImg(item)">
                    <img :src="item.url">
                  </li>
                </template>
              </ul>

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
                 @click="closePrintArea(0)"></i>
              <a v-if="Roleauthorize.assetLiability_export!=0"
                 style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right'
                 @click="printContent">打印</a>
              <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right;color: #333333'
                 @click="closePrintArea(0)">取消</a>
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
    </div>
    <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
    <saas-msg :message="saasMessage.message"
              :delay="saasMessage.delay"
              :visible.sync="saasMessage.visible"></saas-msg>
  </div>
</template>

<script>
import * as axios from "axios";
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
//import { getLodop } from '@/plugins/Lodop/LodopFuncs';
import TimeSelectBar from "@/components/TimeSelectBar/index";
import { mapState, mapGetters } from "vuex";
import saasMsg from '@/components/message/message'
import Cookies from 'js-cookie'
let balanceData = [];
export default {
  name: "assets",
  data () {
    return {
      downloadLoading: false,
      cashInData: [],
      cashOutData: [],
      cashData: [],
      cashInCounts: 0,
      cashOutCounts: 0,
      cashCounts: 0,
      cashInCountsQ: 0,
      cashOutCountsQ: 0,
      cashCountsQ: 0,
      date1: [],
      proofType: false,
      loading: false,
      saasMessage: {
        visible: false,  //消息弹出框*******
        message: '', //消息主体内容**************
        delay: 0
      },
      showPrint: false,//打印预览界面 显示隐藏
      showBill: false,//银行对账单界面，显示true/隐藏false
      monthDay: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],//月份天数-非闰年
      monthDayR: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],//月份天数-闰年  year%4=0&&year%100!=0
      jyear: 0,
      jmonth: 0,
      hideMoneyType: false,//102银行存款是否显示,true显示,false隐藏
      hideMoneyList: {},//存储102银行存款格式化的金额
      hideMoneyTypePrint: false,//102银行存款是否显示,true显示,false隐藏,用于存放打印时修改hideMoneyType
      BillList: [{ voucherBanks: [], img: [] }],
      imgList: [],//图片弹窗显示的图片列表
      showImg: false,//显示图片弹窗
      chooseImg: {},//选中查看的图片
      checkMonth: [false, false, false, false, false, false, false, false, false, false, false, false],
      printType: 0,//0表示打印表单，1表示打印银行对账单图片

      fileType: '',//判断是不是PDF文件
      dateSelect: '',//时间选择
    }
  },
  components: { TimeSelectBar, saasMsg },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      orgid: state => state.user.orgid,
      OrgIds: state => state.user.OrgIds,
      orgName: state => state.user.orgName,
      orgCode: state => state.user.orgCode,
      curOrg: state => state.user.curOrg,   //当前的组织信息
      username: state => state.user.username,
      Roleauthorize: state => state.user.Roleauthorize,
      dbname: state => state.user.dbname
    }),
  },
  mounted () {
    this.getCheckeds();
    this.checkCookieN();
    window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件},
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
  watch: {
    // /*
    // *监听日期选择，根据所选的日期以及凭证调用资产负债数据查询方法
    // * */
    // date1:function(){
    //     this.getData(this.date1,this.proofType);
    // },
    proofType: function () {
      this.getData();
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
    /*时间选择器点击事件*/
    dateChoose: function (val) {

      this.date1 = val;
      this.dateSelect = this.dateSelect ? this.dateSelect : (val.choosedYear + '-' + val.choosedMonth);
      this.getData();
    },
    dateChange (val) {  //选择月份
      if (val.slice(0, 4) > this.jyear) {
        this.$msgBox.show('该年度还未结账,请选择正确的年度!')
        return;
      }
      this.date1.choosedMonth = parseInt(val.slice(5));
      this.date1.choosedMonthEnd = parseInt(val.slice(5));
      this.date1.choosedYear = parseInt(val.slice(0, 4));
      this.date1.choosedYearEnd = parseInt(val.slice(0, 4));
      this.$refs.dateDtl.dateChooseFn(this.date1);
    },
    /*
    *author:hyz
    *获取资产负债表数据
    * 接口：PVoucherMst/GetBalanceSheet
    * 参数：param--日期，未选择自动使用当前时间
    * proofType--资产凭证类型，包含未审核凭证（0），不包含未审核凭证（1）
    * */
    getData () {
      let param = '';
      if (this.date1.choosedYear == undefined || this.date1.choosedYear == '') {
        let currentYear = new Date();
        let currentyear = currentYear.getFullYear(currentYear);
        let currentMonth = currentYear.getMonth() + 1;
        this.date1.choosedYear = currentyear;
        this.date1.choosedMonth = currentMonth;
        this.date1.choosedMonthEnd = currentMonth;
        param = currentyear + '-' + currentMonth;
      } else {
        param = this.date1.choosedYear + '-' + this.date1.choosedMonth;
      }
      const loadings = this.$loading();
      let data = {
        accountPeriod: param,
        isContainUncheck: this.proofType ? '1' : '0',
        orgid: this.orgid
      };
      this.$axios.get('/PVoucherMst/GetBalanceSheet', { params: data })
        .then(res => {
          loadings.close();
          let cashIn = [], cashOut = [], cash = [], cashInCount = 0, cashInCountQ = 0, cashOutCount = 0, cashOutCountQ = 0, cashCount = 0, cashCountQ = 0;
          for (let i in res.Data) {
            if (res.Data[i].KType === "1") {
              cashIn.push(res.Data[i]);
            } else if (res.Data[i].KType === "2") {
              cashOut.push(res.Data[i]);
            } else {
              cash.push(res.Data[i]);
            }
          }
          for (let j in cashIn) {
            cashInCount += cashIn[j].StartSum;
            cashInCountQ += cashIn[j].EndSum;
          }
          for (let k in cashOut) {
            cashOutCount += cashOut[k].StartSum;
            cashOutCountQ += cashOut[k].EndSum;
          }
          for (let l in cash) {
            cashCount += cash[l].StartSum;
            cashCountQ += cash[l].EndSum;
          }
          balanceData = res.Data;
          this.cashInData = cashIn;
          this.cashOutData = cashOut;
          this.cashData = cash;

          this.cashInCounts = cashInCount.toFixed(2);
          this.cashOutCounts = cashOutCount.toFixed(2);
          this.cashCounts = cashCount.toFixed(2);

          this.cashInCountsQ = cashInCountQ.toFixed(2);
          this.cashOutCountsQ = cashOutCountQ.toFixed(2);
          this.cashCountsQ = cashCountQ.toFixed(2);

        })
        .catch(err => { loadings.close(); console.log(err) })
    },
    /*
     *时间处理方法
     *  */
    getParamTime (param) {
      let nowtime = '';
      if (param == null || param == undefined || param == '') {
        nowtime = new Date();
      } else {
        nowtime = new Date(param);
      }
      let year = nowtime.getFullYear();
      let month = nowtime.getMonth() + 1;
      month < 10 ? month = '0' + month : month;
      let day = nowtime.getDate();
      day < 10 ? day = '0' + day : day;
      return param = year + '-' + month + '-' + day;
    },
    /*
    *author:hyz
    *导出资产负债表Excel表格
    * 接口：PVoucherMst/PostBalanceSheetExcel
    * 参数：Data--资产负债表数据的整个data
    * */
    postBalanceSheetExcel: function () {
      let loading = this.$loading();
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      //下载Excel
      this.downloadLoading = true
      this.$axios({
        method: 'get',
        url: '/PVoucherMst/GetBalanceSheetExcel',
        params: {
          accountPeriod: this.date1.choosedYear + '-' + this.date1.choosedMonth,
          isContainUncheck: this.proofType ? '1' : '0',
          orgid: this.orgid,
          uid: this.userid
        }
      }).then(res => {
        //window.location.href = base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;
        if (res.Status == "error") {
          this.$message({ showClose: true, message: res.Msg, type: 'error' })
        } else {
          // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
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

      //axios下载

      // this.$axios({
      //     method:'post',
      //     url:'/File/PostBalanceSheetExcelTo',
      //     data:param,
      //     responseType: 'blob'
      // }) .then(res => {
      //     let filename = "poiImport.xlsx";
      //     this.fileDownload(res.data, filename);
      // })
      // .catch(err => {
      //     console.log(err)
      // });


    },
    //下载文件
    fileDownload (data, fileName) {
      if (!data) {
        return
      }
      // let fileName = res.headers['content-disposition'].split('=')[1];
      // let fileName2 = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0];

      let blob = new Blob([data], { type: 'application/octet-stream' });
      let filename = fileName || "filename.xls";

      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var blobURL = window.URL.createObjectURL(blob);
        var tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename);
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
      }
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
    //    刷新
    refresh: function () {
      this.getData();
    },
    //显示打印预览
    showPrintArea: function (type) {
      if (type == 1) {
        let printFlag = false
        for (var i in this.checkMonth) {
          if (this.checkMonth[i]) {
            printFlag = true;
          }
        }
        if (!printFlag) {
          this.saasMessage = {
            message: '请选择要打印的对账单',
            delay: 3000,
            visible: true
          };
          return;
        }
      }
      this.hideMoneyTypePrint = this.hideMoneyType;
      this.hideMoneyType = false;
      let that = this;
      that.showPrint = true;
      setTimeout(function () {

        //获取打印内容，渲染于弹窗
        let print = document.createElement("div");
        print.setAttribute('class', 'timeSelect printArea');
        print.style.padding = '30px 40px 30px 30px';
        let cop = '';
        if (type == 0) {
          //获取页面显示的打印表格的表头
          let dm = that.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
          //获取隐藏的工会组织科目名称的表头
          let thchilds = document.getElementById('theadArea').cloneNode(true).childNodes;
          //获取隐藏的表格内容--表尾
          let tbchilds = document.getElementById('tbodyArea').cloneNode(true).childNodes;
          //表头拼接
          for (let i = thchilds.length - 1; i >= 0; i--) {
            dm.insertBefore(thchilds[i], dm.firstChild);
          }
          //获取页面的表格内容
          cop = that.$refs.printFrom.cloneNode(true);
          //表格内容拼接表尾
          for (let i = 0; i < tbchilds.length; i++) {
            cop.lastChild.appendChild(tbchilds[i]);
          }
          //表格内容拼接表头
          cop.insertBefore(dm, cop.childNodes[2]);
        } else {
          cop = document.createElement("div");
          for (let i = 0; i < that.BillList.length; i++) {
            if (that.checkMonth[i]) {
              let billImgList = that.BillList[i].img;
              let fileURL = billImgList[0].url;
              console.log(fileURL.width, fileURL.height)
              let fileName = billImgList[0].url.split('.');
              let fileType = fileName[fileName.length - 1]; //获取文件类型
              if (fileType === 'pdf') { //pdf展示
                // let tab=document.createElement("div");
                // tab.style.padding = '10px';
                // tab.style.height = '100%';
                // let title=document.createElement("h1");
                // title.innerText=i+1+'月';
                // title.style.height = '45px';
                // title.style.lineHeight = '45px';
                // title.style.fontSize = '18px';
                // title.style.textAlign = 'left';
                // tab.appendChild(title);
                // for(let j=0 ; j<billImgList.length ; j++){
                //     let embed = document.createElement("embed");
                //     embed.src = billImgList[j].url;
                //     embed.style.width="100%";
                //     tab.appendChild(embed);
                //     embed = null
                // }
                // cop.appendChild(tab);
                // title = null;
                // tab = null;
              } else {
                let tab = document.createElement("table");
                tab.style.borderWidth = '0px';
                tab.style.pageBreakAfter = 'always';

                let tabHead = document.createElement("header");
                let tr0 = document.createElement("tr");
                let td0 = document.createElement("td");
                td0.style.padding = '10px';
                td0.style.borderWidth = '0px';
                let title = document.createElement("h1");
                title.innerText = i + 1 + '月'
                td0.appendChild(title);
                tr0.appendChild(td0);

                tabHead.appendChild(tr0);
                tab.appendChild(tabHead);
                td0 = null;
                tr0 = null;
                tabHead = null;

                let tabBody = document.createElement("tbody");
                let billImgList = that.BillList[i].img;
                console.log(billImgList[0].url)
                for (let j = 0; j < billImgList.length; j++) {
                  let tr1 = document.createElement("tr");
                  let td1 = document.createElement("td");
                  td1.style.padding = '10px';
                  td1.style.borderWidth = '0px';
                  let aImg = document.createElement('img');
                  aImg.src = billImgList[j].url;
                  aImg.style.width = "100%";
                  td1.appendChild(aImg);
                  tr1.appendChild(td1);
                  tabBody.appendChild(tr1);
                  aImg = null;
                  td1 = null;
                  tr1 = null;
                }
                tab.appendChild(tabBody);
                if (fileType === 'pdf') {

                } else {
                  cop.appendChild(tab);
                }
                tab = null;
                tabBody = null;
              }
            }

          }

        }
        print.appendChild(cop);
        //内容全部放入打印预览
        document.getElementById('printContentArea').appendChild(print);
      }, 30);
    },
    //关闭打印预览
    closePrintArea: function (type) {
      if (type == 0) {
        this.showPrint = false;
        this.hideMoneyType = this.hideMoneyTypePrint;
        document.getElementById('printContentArea').innerHTML = '';
      } else {
        this.showImg = false;
      }

    },
    // 打印
    printContent () {
      this.hideMoneyType = this.hideMoneyTypePrint;
      let print = document.getElementById('printContentArea');
      print.style.margin = '0px'; console.log(print)
      this.$print(print) // 使用
    },
    //图片删除
    handleRemoveN (file, fileList) {
      if (!file.phid) {
        return;
      }
      this.$axios.post('PVoucherMst/PostDeleteVoucherBankBill', { PhId: file.phid }).then(res => {
        this.$message.success(res.Msg);
        this.getBankBill();
      }).catch(err => {
        console.log(err);
      })
    },
    //图片预览
    handlePreviewN (file, fileList) {
      this.showImg = true;
      this.chooseImg = file;
      let format = file.name.split('.')


      if (format[format.length - 1] === 'pdf') {

        this.fileType = 'application/pdf';
        this.imgList = this.BillList[file.listIndex].img;
        this.$nextTick(() => {
          let a = document.getElementById('embed')
          a.innerHTML("<embed src=" + this.chooseImg.url + " style=\"width: auto;width: 50%;height: 100%\" />")
        })

      } else {
        this.fileType = ''
        this.imgList = this.BillList[file.listIndex].img;

      }
    },
    //文件类型判断
    beforeUploadPic (file) {
      let isRightType = (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'application/pdf');
      if (!isRightType) {
        this.$message.error('请上传图片格式文件!');
        return false
      }
    },
    //excel上传
    uploadFileMethod (param) {
      var _$this = this;
      var url = 'PVoucherMst/PostAddVoucherBankBill';
      let month = param.action.substring(5);
      let fileObject = param.file;
      console.log(fileObject);
      let formData = new FormData();
      formData.append("Year", this.date1.choosedYear);
      formData.append("Month", month);
      formData.append("OrgId", this.orgid);
      formData.append("OrgCode", this.orgCode);
      formData.append("file", fileObject);
      formData.append('timeCode', (new Date()).getTime().toString());
      let loading = this.$loading();
      loading.setText('正在上传...')

      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, config_header, baseheader);

      axios.create(base).post(url, formData, { headers: new_header }).then(res => {
        loading.close();
        var response = JSON.parse(res.data);
        if (response.Status == 'success') {

        } else {
          _$this.$refs.piclist.clearFiles();
          _$this.$message({ showClose: true, message: response.Msg, type: 'error' });
        }
        this.getBankBill();
      }).catch((error) => {
        loading.close();
        //错误
        _$this.$refs.piclist.clearFiles();
        _$this.$message({ showClose: true, message: error, type: 'error' });
      });

    },
    //银行对账单查询
    getBankBill: function () {
      let data = {
        orgid: this.orgid,
        Ryear: this.date1.choosedYear,
      };
      this.$axios.get('PVoucherMst/GetVoucherBankBill', { params: data }).then(res => {
        console.log(res);
        let data = res.Data;
        for (let i = 0; i < data.length; i++) {
          let attachments = data[i].voucherBanks;
          let imgList = [];
          if (attachments.length > 0) {
            for (let j = 0; j < attachments.length; j++) {
              let img = {
                listIndex: i,
                name: attachments[j].BName || '',
                url: httpConfig.baseurl + attachments[j].BUrlPath || '',
                phid: attachments[j].PhId
              }
              imgList.push(img);
            }
          }
          data[i]['img'] = imgList;
        }
        this.BillList = data;
      }).catch(err => {
        console.log(err);
      })
    },
    //点击显示银行对账单列表
    getAndShowBill: function () {
      this.getBankBill();
      this.showBill = true;
    },
    //下载银行对账单
    downloadImg: function () {
      let loading = this.$loading();
      let data = {
        'orgid': this.orgid,
        'Ryear': this.date1.choosedYear,
        'monthList': this.checkMonth
      }
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      //下载Excel
      this.downloadLoading = true
      this.$axios.get('PVoucherMst/GetVoucherBankBillZip', { params: data }).then(res => {
        if (res.Status == "error") {
          this.$message({ showClose: true, message: res.Msg, type: 'error' })
        } else {
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
    //查询cookie选择是否调用隐藏金额的方法
    checkCookieN: function () {
      let type = Cookies.get('hideMoney');
      if (type == 'true') {
        this.hideMoneyType = true;//显示金额
      } else {
        this.hideMoneyType = false;//隐藏金额
      }
    },
    //隐藏金额
    hideMoney: function () {
      let maxAge = new Date(new Date().getTime() + 60 * 60 * 1000);
      let type = this.hideMoneyType;
      if (type) {
        Cookies.set('hideMoney', false, { expires: maxAge });
        this.hideMoneyType = false;//隐藏金额
      } else {
        Cookies.set('hideMoney', true, { expires: maxAge });
        this.hideMoneyType = true;
      }
    },
    //切换显示图片
    checkImg: function (file) {
      this.chooseImg = {};
      this.chooseImg = file;
    }
  }
}
</script>

<style scoped>
.printArea td,
.printArea th {
  height: 30px;
}
.upload-demo {
  position: relative;
  width: 16%;
  min-width: 175px;
  height: 200px;
  overflow: hidden;
  display: inline-block;
  float: left;
  padding-top: 10px;
}
.checkLabel {
  color: limegreen;
}

.pinzheng {
  margin-left: 120px;
}
.container {
  overflow-y: hidden;
}
.formData_content {
  position: absolute;
  overflow-y: scroll;
  bottom: 0px;
  top: 80px;
  left: 0;
  right: -17px;
}

.formData_content > ul:first-child {
  background: transparent;
  margin-top: 0;
}

.unionLists > p {
  text-align: center;
  background: #83c350;
  height: 50px;
  line-height: 50px;
  color: #fff;
  font-size: 15px;
  margin-bottom: 5px;
}
.unionListsContent ul {
  padding-left: 15px;
  position: relative;
}
.unionListsContent ul:before {
  content: "";
  height: 100%;
  width: 1px;
  border-left: 1px dotted #aaa;
  position: absolute;
  left: 7.5px;
}
.unionListsContent ul > li {
  position: relative;
  cursor: pointer;
}
.unionListsContent ul > li:before {
  content: "";
  position: absolute;
  width: 7.5px;
  left: -7.5px;
  top: 9px;
  border-top: 1px dotted #aaa;
}
.unionListsContent ul > li:last-child:after {
  content: "";
  height: 100%;
  width: 7.5px;
  position: absolute;
  left: -7.5px;
  top: 10px;
  background: #fff;
}
.formData > ul.formDataItems > li.bolder {
  font-weight: bold;
}
.formData > ul.formDataItems > li.align-center {
  text-align: center;
}
.formData > ul.formDataItems > li.align-right {
  text-align: right;
}
.formData > ul.bottomForm > li {
  border: none;
  text-align: right;
  height: 55px;
  line-height: 55px;
}
.formData > ul.bottomForm > li:last-child {
  border-right: 1px solid #ebeef5;
}
.selectContainer > select {
  background-color: transparent;
  line-height: 30px;
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
.imgContent {
  width: 100%;
  height: auto;
  position: absolute;
  top: 50px;
  bottom: 150px;
}
.imgList {
  position: absolute;
  bottom: 0;
  height: 100px;
  overflow-x: auto;
  overflow-y: hidden;
  vertical-align: center;
  width: 100%;
  text-align: center;
  vertical-align: center;
}
.imgList ul li {
  display: inline-block;
  height: 100px;
  width: auto;
  padding: 3px;
  background-color: white;
  overflow: hidden;
  margin-left: 10px;
}
.imgList ul .choose {
  background-color: #00b7ee;
}
.imgList ul li img {
  height: 100%;
  width: auto;
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
  color: #fff;
  background: #00b8ee;
  padding: 5px 15px;
  width: 100px;
  border-radius: 3px;
}
.coverContent ul li:nth-of-type(1):hover {
  color: #00b8ee;
  background: #fff;
}
.coverContent ul li:nth-of-type(2) {
  border: 1px solid #ccc;
  color: #fff;
  background-color: #ccc;

  padding: 5px 15px;
  width: 100px;
  border-radius: 3px;
}
.coverContent ul li:nth-of-type(2):hover {
  color: #ccc;
  background-color: #fff;
}
.coverdiv {
  margin: auto;
  width: 1140px;
  height: 549px;
  background-color: #fff;
  position: relative;
  top: 50%;
  margin-top: -274px;
  padding: 10px 30px;
}
.coverdiv .head:first-child {
  border-bottom: 1px solid #cecece;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  font-weight: 900;
}
.coverdiv .head:first-child p {
  display: inline-block;
  float: left;
}
.coverdiv .head:first-child i {
  float: right;
  margin-top: 10px;
  color: #cccccc;
}
.selectarea span {
  color: #00b8ee;
  font-size: 18px;
  font-weight: bolder;
  float: left;
}
.selectarea .tip {
  color: #ff0000;
  font-size: 12px;
  font-weight: bolder;
  float: left;
  height: 25px;
  line-height: 32px;
}
.cover .selectarea {
  height: 45px;
  padding-top: 10px;
  font-size: 16px;
}
.cover .selectarea .btnArea {
  display: inline-block;
  font-size: 14px;
  float: right;
}

.cover .selectarea .btnArea div {
  margin-top: 10px;
  width: 90px;
  height: 30px;
  border: 1px solid #00b8ee;
  color: #fff;
  background: #00b8ee;
  display: inline-block;
  margin-left: 10px;
  margin-top: -5px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  border-radius: 3px;
}
.cover .selectarea .btnArea div:hover {
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
/*改变upload组件内部样式*/
.upload-item
  >>> .el-upload-list
  .el-upload-list__item
  .el-upload-list__item-actions {
  z-index: 2;
}
/*顶部选中标识的层叠度*/
.select-top {
  position: absolute;
  z-index: 9;
}
.select-top .top-left {
  position: absolute;
  z-index: 99;
  color: #ffffff;
  margin-left: 15px;
  margin-top: 0px;
}
.select-top .top-right {
  position: absolute;
  z-index: 99;
  color: #ffffff;
  margin-top: -3px;
  margin-left: 142px;
}
/*pdf图片的层叠度*/
.pdf {
  position: absolute;
  z-index: 2;
  animation: downmove 800ms;
}
@keyframes downmove {
  from {
    margin-top: -18px;
    opacity: 0;
  }
  to {
    margin-top: 0px;
    opacity: 1;
  }
}
.pdf div {
  position: absolute;
  z-index: 4;
  padding: 0 15px;
}
.pdf div img {
  width: 146px;
  height: 146px;
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
.flexUl .el-input--suffix .el-input__inner {
  line-height: 30px;
}

.ridusCheck .el-upload-list--picture-card .el-upload-list__item {
  position: absolute;
  margin: 0px;
}
.ridusCheck .el-upload__tip {
  z-index: 3;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 148px;
  margin-top: -16px;
  margin-left: 14px;
  border-radius: 0 0 5px 5px;
}
.ridusCheck .select {
  box-shadow: 0 0 10px 2px #00b7ee;
}
.ridusCheck
  .el-upload-list__item.is-success
  .el-upload-list__item-status-label {
  display: none !important;
}
.ridusCheck .el-checkbox__inner {
  border-radius: 0px 4px 0px 30px;
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.ridusCheck .el-checkbox__inner::after {
  height: 8px;
  left: 8px;
  border-width: 2px;
}
</style>
