<template>
  <div class="home homeFinance">
    <div class="cardPanelArea"
         :class="{ 'helfPanel': homeAreaList.length==4 }">
      <template v-for="item in homeAreaList">
        <!--凭证-->
        <div class="cardPanel"
             v-if="item.ModularCode=='001'&&item.EnabledMark=='0'&&Roleauthorize.homePage_voucherEntry!=0">
          <el-card shadow="always"
                   style="height:350px;color:#fff;border-radius:8px;background:#05b5f1">
            <el-row style="margin:-10px 0 0;height:30px;line-height:30px;font-size:18px">
              {{ item.ModularName }}
            </el-row>
            <el-row class="voucherProgress">
              <el-col :span="12"
                      style="text-align: center;">
                <div class="orogressCon">
                  <div class="orogressInfo orogressInfoNum">
                    {{parseInt(voucherCount[0].Count)+parseInt(voucherCount[1].Count)}}
                  </div>

                  <div class="orogressInfo">
                    已录凭证总数
                  </div>

                </div>
                <!-- <el-progress :width="120" color="#fff" type="circle"  :percentage="((parseInt(voucherCount[0].Count)+parseInt(voucherCount[1].Count))==0)?0:parseInt(voucherCount[0].Count/(parseInt(voucherCount[0].Count)+parseInt(voucherCount[1].Count))*100)" status="text">

                                              <div class="orogressInfo">
                                                  未审核总数
                                              </div>
                                               <div :class="{NumRed:voucherCount[0].Count>0}" class="orogressInfo orogressInfoNum">
                                                  {{voucherCount[0].Count}}
                                              </div>
                                          </el-progress> -->
              </el-col>
              <el-col :span="12"
                      style="text-align: center;">
                <div class="orogressCon"
                     @click.stop="auditList"
                     style=" cursor:pointer;">
                  <div :class="{NumRed:voucherCount[0].Count>0}"
                       class="orogressInfo orogressInfoNum">
                    {{voucherCount[0].Count}}
                  </div>
                  <div class="orogressInfo">
                    未审核总数
                  </div>

                </div>
                <!-- <el-progress :width="120" color="#fff" type="circle" :percentage="100" status="text">
                                              <div class="orogressInfo">
                                                  凭证总数
                                              </div>
                                               <div class="orogressInfo orogressInfoNum">
                                                 {{parseInt(voucherCount[0].Count)+parseInt(voucherCount[1].Count)}}
                                              </div>
                                          </el-progress> -->
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"
                      style="text-align: center">
                <div @click.stop="routerToUrl('/finance/voucherAdd')"
                     class="voucherBtn">
                  凭证录入
                </div>
              </el-col>
              <el-col :span="12"
                      style="text-align: center;">
                <div @click.stop="routerToUrl('/finance/voucherList')"
                     class="voucherBtn">
                  凭证查询
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <!--月末快速结账样式面板-->
        <div class="cardPanel"
             v-if="item.ModularCode=='002'&&item.EnabledMark=='0'&&Roleauthorize.homePage_checkOut!=0">
          <el-card shadow="always">
            <div class="grid-content"
                 style="padding-top:0">
              <div class="checkTimeTitle">
                <span>{{ item.ModularName }} ：</span>

                <div class="checkYear">

                  <i @click.stop="checkYear(false)"
                     class="el-icon-minus"
                     :class="{disabled:check.year==jbuildDate.slice(0,4)}"></i>
                  <span>{{check.year}}</span>
                  <i @click.stop="checkYear(true)"
                     class="el-icon-lx-add"
                     :class="{disabled:check.year==checkedYear}"></i>
                </div>
                <div class="checkTimeModel">
                  <i></i>
                  <span>已结账</span>
                  <i></i>
                  <span>待结账</span>
                  <!--<i></i>-->
                  <!--<span>待做账</span>-->
                </div>
              </div>
              <div class="checkYearCon">
                <!--会计期弹窗*************************************-->
                <!-- <div v-if="Roleauthorize.homePage_account!=0||Roleauthorize.homePage_noAccount!=0"
                                  v-show="yearSelCss"
                                  class="yearsContainer">
                                 <div class="yearsTitle">
                             <span v-if="Roleauthorize.homePage_account!=0"
                                   @click.stop="monthsSelCss='jiezhang'"
                                   :class="{active:monthsSelCss=='jiezhang'}">结账</span>
                                     <span v-if="Roleauthorize.homePage_noAccount!=0"
                                           @click.stop="monthsSelCss='fanjiezhang'"
                                           :class="{active:monthsSelCss=='fanjiezhang'}">反结账</span>
                                 </div>
                                 <div v-if="Roleauthorize.homePage_account!=0"
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
                                     @click.stop="yearsTrue(false)">取消</span>
                                         <span class="btn"
                                               @click.stop="yearsTrue('check',checkVal)">确认</span>
                                     </p>
                                 </div>
                                 <div v-if="Roleauthorize.homePage_noAccount!=0"
                                      v-show="monthsSelCss=='fanjiezhang'"
                                      class="yearsContent jiezhang">
                                     <div class="fanjiezhang">
                                         <div>反结账至</div>
                                         <div class="checkYear">
                                             <i @click.stop="unCheckYearFN(false)"
                                                class="el-icon-minus"
                                                :class="{disabled:unCheckYear==jbuildDate.slice(0,4)}"></i>
                                             <span>{{unCheckYear}}</span>
                                             <i @click.stop="unCheckYearFN(true)"
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
                                 </div>
                             </div>-->
                <div class="jzArea">
                  <div>
                    <el-checkbox v-model="checkedStr[0]"
                                 @change="checkedStr[1]=!checkedStr[0]">结账至</el-checkbox>
                  </div>
                  <div class="inputContainer">
                    <i class="el-icon-minus"
                       @click="nextMonth('pre',checkVal,'checkVal')"></i>
                    <input v-model="checkVal"
                           style="display: inline-block;width: 42px;"
                           type="text" />
                    <i class="el-icon-lx-add"
                       @click="nextMonth('next',checkVal,'checkVal')"></i>
                    <span>月</span>
                  </div>
                </div>
                <div class="fjzArea">
                  <div>
                    <el-checkbox v-model="checkedStr[1]"
                                 @change="checkedStr[0]=!checkedStr[1]">反结账至</el-checkbox>
                  </div>
                  <div class="checkArea">
                    <div class="checkYear">
                      <i class="el-icon-minus"
                         @click.stop="unCheckYearFN(false)"
                         :class="{disabled:unCheckYear==jbuildDate.slice(0,4),'el-icon-minus':true}"></i>
                      <span>{{unCheckYear}}</span>
                      <i @click.stop="unCheckYearFN(true)"
                         :class="{disabled:unCheckYear==checkedYear,'el-icon-lx-add':true }"></i>
                      <span>年</span>
                    </div>
                    <div class="checkMonth">
                      <i class="el-icon-minus"
                         @click="nextMonth('pre',unCheckVal,'unCheckVal')"></i>
                      <div class="inputContainer"
                           style="display: inline-block;width: 42px;"><input v-model="unCheckVal"
                               type="text"></div>
                      <i class="el-icon-lx-add"
                         @click="nextMonth('next',unCheckVal,'unCheckVal')"></i>
                      <span>月</span>
                    </div>
                  </div>
                </div>
                <div style="position: absolute;right: 0;top: 0;">
                  <span style="display: block;margin-bottom: 10px"
                        class="btn"
                        @click="yearsTrue('uncheck',unCheckVal,unCheckYear)">确认</span>
                  <span style="display: block"
                        class="btngrey"
                        @click="yearsTrue(false)">重置</span>
                </div>
                <!--<div @click.stop="showyearSel"
                                 style="text-align:center;cursor:pointer">
                                <img src="../../assets/icon/rq.png"
                                     alt="">
                            </div>-->
                <!--<div style="cursor:pointer">
                                <span @click.stop="showyearSel">结账</span>
                            </div>-->
              </div>
              <div class="checkTimeCon">
                <!--<ul>
                                <li @click.stop="checkMonthClick(ind)"
                                    :class="{
                                                    checkingMonth:(ind>=checkedTime)&&(check.year>=checkedYear),
                                                    //futureMonth:(ind>nowTime.getMonth()+1)&&(check.year==nowTime.getFullYear()),
                                                    checkedMonth:(ind<checkedTime)&&(check.year==checkedYear)||check.year<checkedYear,

                                                    }"
                                    v-for="ind of 12"
                                    :key=ind>
                                    &lt;!&ndash; <span v-if="(ind==nowTime.getMonth()+1)&&(check.year==checkedYear)">最新会计期</span> &ndash;&gt;
                                    {{ind}}
                                </li>
                            </ul>-->
                <table>
                  <tr>
                    <td :class="{ checkingMonth:(item>=checkedTime)&&(check.year>=checkedYear), checkedMonth:(item<checkedTime)&&(check.year==checkedYear)||check.year<checkedYear }"
                        v-for="item in 6"
                        :key=item
                        @click.stop="checkMonthClick(item)">{{item}}</td>
                  </tr>
                  <tr>
                    <td :class="{ checkingMonth:(item+6>=checkedTime)&&(check.year>=checkedYear),checkedMonth:(item+6<checkedTime)&&(check.year==checkedYear)||check.year<checkedYear }"
                        v-for="item in 6"
                        :key=item
                        @click.stop="checkMonthClick(item+6)">{{item+6}}</td>
                  </tr>
                </table>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 工作通知 -->
        <template v-if="item.ModularCode=='003'&&Roleauthorize.homePage_regulation!=0||item.ModularCode=='004'&&Roleauthorize.homePage_workNotice!=0||item.ModularCode=='005'&&Roleauthorize.homePage_sysMessage!=0">
          <div class="cardPanel"
               v-if="'003004005'.indexOf(item.ModularCode)!=-1&&item.EnabledMark=='0'">
            <el-card shadow="always">

              <p class="myText">
                <span>{{ item.ModularName }}</span>
              </p>
              <ul class="myMsgContent">
                <li v-for="news in (item.ModularCode=='003'?fgNewsList:(item.ModularCode=='004'?gzNewsList:xtNewsList))"
                    @click="openNewsList(news,item.ModularName)">
                  <!--{{ news.ContentText }}-->{{ news.Title }}
                  <span class="time">{{ news.PublishTime.substring(0,10) }}</span>
                </li>
              </ul>
              <span class="moreNews"
                    @click.stop="openNewsList(item.ModularCode=='003'?fgNewsList[0]:(item.ModularCode=='004'?gzNewsList[0]:xtNewsList[0]),item.ModularName)">更多</span>
            </el-card>
          </div>
        </template>
        <!-- 备忘录 -->
        <div class="cardPanel"
             v-if="item.ModularCode=='006'&&item.EnabledMark=='0'&&Roleauthorize.homePage_memorial!=0">
          <el-card shadow="always">
            <div class="">
              <p class="myText">
                <span>{{ item.ModularName }}</span>
                <i @click="myTextUpdate"
                   :class="{updateIcon:TextUpdate}"
                   style="float:right;"></i>
              </p>
              <div class="myTextContent"
                   :class="{myTextContentDisabled:TextUpdate}">
                <textarea maxlength="250"
                          :disabled="TextUpdate"
                          v-model="myTextInfo"></textarea>
              </div>
            </div>
          </el-card>
        </div>
        <!--工会信息-->
        <div class="cardPanel"
             v-if="item.ModularCode=='007'&&item.EnabledMark=='0'&&Roleauthorize.homePage_unitNews!=0">
          <el-card shadow="always">
            <div :title="curOrg.OrgName"
                 class="orgnameLogo"
                 style="padding:0 0 0 65px;font-size: 18px">
              <div style="-webkit-box-orient: vertical;">{{curOrg.OrgName}}</div>
              <img height="50px"
                   src="@/assets/images/gs_logo.png"
                   alt="">
            </div>
            <ul class="formCenter noShadow">
              <li>工会主席:{{curOrg.Chairman}}</li>
              <li>经审主任:{{curOrg.Director}}</li>
              <li>财务主管:{{curOrg.Treasurer}}</li>
              <li>财务会计: <span v-for="(Account,index) of Accounts"
                      :key="index">{{Account}}&nbsp;</span> </li>
              <li>出纳:{{curOrg.Cashier}}</li>
            </ul>
          </el-card>
        </div>
        <!--报表-->
        <div class="cardPanel"
             v-if="item.ModularCode=='008'&&item.EnabledMark=='0'&&Roleauthorize.homePage_reportCenter!=0">
          <el-card shadow="always">
            <p class="myText">{{ item.ModularName }}</P>
            <ul class="formCenter">
              <li v-if="Roleauthorize.homePage_subjectBalance!=0"
                  @click="routerToUrl('/accountbooks/balance')"><a>科目余额表</a></li>
              <li v-if="Roleauthorize.homePage_Assetliability!=0"
                  @click="routerToUrl('/report/assets')"><a>资产负债表</a></li>
              <li v-if="Roleauthorize.homePage_inOut!=0"
                  @click="routerToUrl('/report/expenses')"><a>收入支出表</a></li>
              <li v-if="Roleauthorize.homePage_detailed!=0"
                  @click="routerToUrl('/accountbooks/detailaccount')"><a>明细账</a></li>
              <li v-if="Roleauthorize.homePage_classify!=0"
                  @click="routerToUrl('/accountbooks/classify')"><a>总分类账</a></li>
              <li v-if="Roleauthorize.homePage_budget!=0"
                  @click="routerToUrl('/budget/budget')"><a>预算申报表</a></li>
              <li v-if="Roleauthorize.homePage_final!=0"
                  @click="routerToUrl('/budget/actualbudget')"><a>决算申报表</a></li>
            </ul>
          </el-card>
        </div>
        <!--账户余额-->
        <div class="cardPanel"
             v-if="item.ModularCode=='009'&&item.EnabledMark=='0'&&Roleauthorize.homePage_accountBalance!=0">
          <el-card shadow="always">
            <chart1 ref="chart1"
                    :chartData="chartData"></chart1>
          </el-card>
        </div>
        <!--上级收入-->
        <div class="cardPanel"
             v-if="item.ModularCode=='010'&&item.EnabledMark=='0'&&Roleauthorize.homePage_subsidy!=0">
          <el-card shadow="always">
            <chart2 ref='chart2'
                    :titleText="titleText2"
                    :opinion="opinion2"
                    :opinionData="opinionData2"></chart2>
          </el-card>
        </div>
        <!--支出情况-->
        <div class="cardPanel"
             v-if="item.ModularCode=='011'&&item.EnabledMark=='0'&&Roleauthorize.homePage_payment!=0">
          <el-card shadow="always">
            <chart3 ref='chart3'
                    :titleText="titleText3"
                    :opinion="opinion3"
                    :opinionData="opinionData3"></chart3>
          </el-card>
        </div>
        <!-- 站内信息发布 -->
        <div class="cardPanel"
             v-if="item.ModularCode=='012'&&item.EnabledMark=='0'&&Roleauthorize.homePage_delivery!=0">
          <el-card shadow="always">

            <p class="myText">
              <span>{{ item.ModularName }}</span>
            </p>
            <i class="el-icon-s-promotion"
               @click="newsAreaEdit=true"></i>
            <p style="width: 100%; text-align: center">点击进工作通知、系统消息、规章制度、政策法规等内容发布</p>
          </el-card>
        </div>
      </template>

    </div>

    <!--个性化设置-->
    <div class="personalSty"><i class="hyzIcon_eye"></i><span @click="homeAreaEdit=true">桌面个性化设置</span></div>
    <!-- 个性化设置弹窗 -->
    <el-dialog :visible.sync="homeAreaEdit"
               width="1000px">
      <position-panel v-if="homeAreaEdit"
                      :homeAreaList="homeAreaListAll"
                      @close="homeAreaEdit=false"
                      @getData="getPaneList"></position-panel>
    </el-dialog>
    <!-- 新闻发布 -->
    <el-dialog :visible.sync="newsAreaEdit"
               class="newsDialog">
      <news-edit v-if="newsAreaEdit"></news-edit>
    </el-dialog>

    <div v-if="auditShow"
         class="auditBG">
      <div class="auditContainer">
        <p class="title">
          <span>审核凭证</span>
          <i @click="audithide"></i>
        </p>
        <p v-if="voucherList.length>0&&Roleauthorize.homePage_audit!=0"
           class="auditCheck">
          <span class="btn"
                style="float:right;"
                @click="listHandle">审核</span>
        </p>
        <section class="listContainer">
          <ul class="listTitle">
            <li>序号</li>
            <li>摘要</li>
            <li>科目</li>
            <li>借方金额(元)</li>
            <li>贷方金额(元)</li>
          </ul>
          <div style="color:#999"
               v-if="voucherList.length==0">没有未审核凭证!</div>
          <ul :class="{choosed:item.PhId==chooseItem.PhId}"
              class="listContent"
              v-for="(item,index) of voucherList"
              :key="index">
            <li>
              <ul class="listIndex">
                <li>{{index+1+(pageindex-1)*pagesize}}</li>
              </ul>

              <ul>
                <li>
                  <span>凭证日期 : {{item.PDate?item.PDate.substring(0,10):''}}</span>
                  <span>凭证字号 : {{item.PType}}-{{item.PNo}}</span>
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
        <div style="float:right">
          <el-pagination background
                         @size-change="getvoucherList('audit')"
                         @current-change="getvoucherList('audit')"
                         :current-page.sync="pageindex"
                         :page-sizes="[10,20, 30, 50, 70,100,500]"
                         :page-size.sync="pagesize"
                         layout="sizes, prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <message :message="saasMessage.message"
             :delay="saasMessage.delay"
             :visible.sync="saasMessage.visible"
             :callback="saasMessage.callback">
    </message>
    <next-month :checkVal="checkVal.toString()"
                v-if="nextMonthCss"
                @child-click="nextMonthHandle"></next-month>
    <!-- 备份满20次提示 -->
    <el-dialog :visible.sync="ssss"
               append-to-body
               width="550px"
               title="提示"
               custom-class="eldialogClass">
      <over-msg @still-go="stillGo"
                @cancle="cancle" />
    </el-dialog>
  </div>
</template>

<script>
import { GetOrganizeBackupList } from '@/api/copyandreset'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import qs from 'qs'
import overMsg from '@/page/admin/copyandreset/overMsg'
import axios from 'axios'
import Chart1 from './charts/category'
import Chart2 from './charts/pie'
import Chart3 from './charts/pie_1'
import { mapState, mapActions } from 'vuex'
import Auth from "@/util/auth";
import nextMonth from '../finance/nextMonthCheck'
import reportinfo from '../../api/voucher/voucherHandle'
import positionPanel from './positionPanel/index'
import newsEdit from './article/List'
export default {
  name: 'home',
  data () {
    return {
      active: false,//执行activated钩子
      check: {
        month: '',
        year: ''
      },
      nowTime: new Date(),
      unCheckYear: '',//反结账年份
      checkedTime: '',  //当前最新结账月
      checkedYear: '',  //当前结账年份
      voucherCount: [{ Count: 0 }, { Count: 0 }],//返回的凭证数
      myTextInfo: "", //备忘录实际信息
      oldTextInfo: "", //备忘录编辑前信息
      chartData: [],
      titleText2: '上级补助收入（元）',
      opinion2: [],  //上级补助收入颜色标题
      opinionData2: [], //上级补助收入数据
      //opinion2: ['回拨补助','专项补助','超收补助','帮扶补助','送温暖补助','救灾补助','其他补助'],
      // opinionData2:[  // 没有默认值不会触发刷新*******
      //     {value:111, name:'回拨补助'},
      //     // {value:222, name:'专项补助'},
      //     // {value:111, name:'超收补助'},
      //     // {value:22, name:'帮扶补助'},
      //     // {value:33, name:'送温暖补助'},
      //     // {value:0, name:'救灾补助'},
      //     // {value:0, name:'其他补助'}
      // ],
      titleText3: '支出情况（元）',
      opinion3: [],  //上级补助支出颜色标题
      opinionData3: [], //上级补助支出数据
      saasMessage: {
        message: '',
        visible: false,
      },
      iconUpdate: '#bbb',
      TextUpdate: true,//备忘录是否编辑
      yearSelCss: false,//会计期隐藏
      nextMonthCss: false, //结账检查隐藏
      checkVal: '',//结账日期
      unCheckVal: '',//反结账日期
      monthsSelCss: 'jiezhang',
      jbuildDate: '2000',
      chooseItem: '',
      Accounts: [],//该组织下会计员
      auditShow: false,//显示未审核列表
      pageindex: 0,
      pagesize: 100,
      total: 0,
      voucherList: [],
      homeAreaListAll: [],//所有面板
      homeAreaList: [],//显示的面板
      homeAreaEdit: false,
      checkedStr: [true, false],//结账、反结账选择
      newsAreaEdit: false,//新闻发布弹窗
      fgNewsList: [],//法规政策制度
      gzNewsList: [],//工作通知
      xtNewsList: [],//系统消息
      ssss: false,
    }
  },
  //组件
  components: { Chart1, Chart2, Chart3, nextMonth, positionPanel, newsEdit, overMsg },
  //计算属性
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      curOrg: state => state.user.curOrg,   //当前的组织信息
      orgcode: state => state.user.orgcode,
      orgname: state => state.user.orgName,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      Roleauthorize: state => state.user.Roleauthorize,//按钮权限
      startYear: state => state.Pconfig.jbuildDate,//建账日期
      autoS: state => state.user.autoSetting,//自动备份
      // roleInfo: state => state.user.roleInfo,
    })
  },
  watch: {
    orgid () {
      this.getChecked();
    }
  },
  //初始化
  created () {
    this.getPaneList();
    //this.s.height = '300px';
    if (!this.startYear) {
      this.jbuildDate = (new Date()).getFullYear().toString();
    } else {
      this.jbuildDate = this.startYear;
    }
  },
  activated () {
    if (this.active) {
      this.getChecked();
      this.$nextTick(() => {
        this.orgNameWid()
      })
      var vm = this;
      window.addEventListener('resize', vm.orgNameWid);
    }
    this.relize();

  },
  //初始化加载数据
  mounted () {
    if (!this.active) {
      this.getChecked();
      this.active = true;
    }
  },

  destroyed () {

  },
  deactivated () {


  },
  methods: {
    /*首页改造新增接口*/
    //获取布局列表
    getPaneList: function () {
      let uinfo = Auth.getUserInfoData();
      let param = {
        uid: this.uid,
        uAccount: uinfo.userInfo.Account
      }
      this.$axios.get('/SysShowbypeople/GetShowByPeoList', { params: param }).then(res => {
        console.log(res)
        if (res.Status == 'success') {
          this.homeAreaList = res.Data2;
          this.homeAreaListAll = res.Data1;
          this.$nextTick(this.relize());
        } else {
          this.saasMessage = {
            visible: true,
            message: res.Msg
          }
        }

      }).catch(err => {
        console.log(err)
      })
    },
    //新闻获取
    getNews () {
      let param = {
        orgid: this.orgid,
        uid: this.uid
      }
      this.$axios.get('/SysNews/GetAllSysNewsListByTypeIdByOrg', { params: param }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    //新闻 更多页面
    openNewsList (object, title) {
      let path = '';
      if (title == '法规政策制度') {
        path = '/home/newsList_zc'
      } else if (title == '工作通知') {
        path = '/home/newsList_gz'
      } else {
        path = '/home/newsList_xt'
      }
      this.$router.push({ path: path, query: { phid: object.PhId, type: 'listview', typePhid: object.PhIdType, title: title } });
    },
    //获取新闻列表
    getAllNewsLists: function () {
      let data = {
        orgid: this.orgid,
        uid: this.uid
      }
      this.$axios.get('/SysNews/GetAllSysNewsListByTypeIdByOrg', { params: data }).then(res => {
        console.log('========新闻列表========')
        console.log(res)
        if (res.Status == 'success') {
          this.fgNewsList = res.List1;//法规政策制度
          this.gzNewsList = res.List2//工作通知
          this.xtNewsList = res.List3//系统消息
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //图表重新渲染
    relize () {
      let vm = this;
      setTimeout(() => {
        for (var item in this.homeAreaList) {
          if (this.homeAreaList[item].ModularCode == '009' && this.homeAreaList[item].EnabledMark == '0' && vm.$refs.chart1.chart.target) {
            vm.$refs.chart1.chart.target.resize();
          }
          if (this.homeAreaList[item].ModularCode == '010' && this.homeAreaList[item].EnabledMark == '0' && vm.$refs.chart2.chart2.target) {
            vm.$refs.chart2.chart2.target.resize();
          }
          if (this.homeAreaList[item].ModularCode == '011' && this.homeAreaList[item].EnabledMark == '0' && vm.$refs.chart3.chart2.target) {
            vm.$refs.chart3.chart2.target.resize();
          }
        }
        /*if (vm.$refs.chart2.chart2.target) {
            vm.$refs.chart2.chart2.target.resize();
        }
        if (vm.$refs.chart3.chart2.target) {
            vm.$refs.chart3.chart2.target.resize();
        }*/
      }, 1000)

    },
    //显示隐藏会计期
    showyearSel () {
      this.yearSelCss = !this.yearSelCss;

      if (this.Roleauthorize.homePage_account == 0) {
        this.monthsSelCss = 'fanjiezhang'
      }
    },
    //获取组织下会计员
    GetAllAccountName () {
      var data = {
        orgid: this.orgid
      }
      this.$axios.get('sysorganize/GetAllAccountNameByOrg', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.Accounts = res.Data;
          } else {
            this.closeEchart();
            this.saasMessage = {
              visible: true,
              message: res.Msg,
              callback: this.openEchart
            }
          }

        })
        .catch(err => {
          this.closeEchart();
          this.saasMessage = {
            visible: true,
            message: '拉取组织下会计员出错了!',
            callback: this.openEchart
          }
        })
    },
    //组织名称换行否
    orgNameWid () {
      var name = document.querySelector('.orgnameLogo>div');
      if (name) {
        var wid = window.getComputedStyle(name).width;
        if (parseFloat(wid) < this.curOrg.OrgName.length * 19) {
          name.className = 'overflow2';
        } else {
          name.className = '';
        }
      }

    },
    // 初始化图表
    getChartData (data) {
      this.chartData = [];
      if (this.opinionData2.length > 0) {
        this.opinion2 = []; //上级补助收入颜色标题
        this.opinionData2 = [];
      }
      if (this.opinionData3.length > 0) {
        this.opinion3 = []; //上级补助收入颜色标题
        this.opinionData3 = [];
      }
      var res1 = [], res2 = [], sum = 0, sum501 = 0, sum502 = 0, sum503 = 0, sum504 = 0, sum505 = 0, sum506 = 0, sum507 = 0, sum508 = 0;
      // this.opinionData2=[];
      // this.opinion2=[];
      // for(var i = 0; i < 4; i++){
      //     res1.push(parseInt(Math.random()*100)+1)
      //     res2.push(parseInt(Math.random()*100)+1)
      // }
      for (var da of data) {
        if (da.subject_code == "101" && da.k_name == "库存现金") {
          if (da.k_balanceType == 1) {
            res1[0] = (da.ys_j_sum - da.ys_d_sum).toFixed(2);
            res2[0] = (da.ye_j_sum - da.ye_d_sum).toFixed(2);
          } else {
            res1[0] = (da.ys_d_sum - da.ys_j_sum).toFixed(2);
            res2[0] = (da.ye_d_sum - da.ye_j_sum).toFixed(2);
          }
        } else if (da.subject_code == "102" && da.k_name == "银行存款") {
          if (da.k_balanceType == 1) {
            res1[1] = (da.ys_j_sum - da.ys_d_sum).toFixed(2);
            res2[1] = (da.ye_j_sum - da.ye_d_sum).toFixed(2);
          } else {
            res1[1] = (da.ys_d_sum - da.ys_j_sum).toFixed(2);
            res2[1] = (da.ye_d_sum - da.ye_j_sum).toFixed(2);
          }
        } else if (da.subject_code == "111" && da.k_name == "零余额账户用款额度") {
          if (da.k_balanceType == 1) {
            res1[2] = (da.ys_j_sum - da.ys_d_sum).toFixed(2);
            res2[2] = (da.ye_j_sum - da.ye_d_sum).toFixed(2);
          } else {
            res1[2] = (da.ys_d_sum - da.ys_j_sum).toFixed(2);
            res2[2] = (da.ye_d_sum - da.ye_j_sum).toFixed(2);
          }
        }
        else if (da.subject_code == '40301' && da.k_name == "回拨补助") {
          sum = this.balanceEnd(da, sum);
          this.opinion2.push("回拨补助");
          this.opinionData2.push({ value: sum.toFixed(2), name: "回拨补助" });
        } else if (da.subject_code == '40302' && da.k_name == "专项补助") {
          sum = this.balanceEnd(da, sum);
          this.opinion2.push("专项补助");
          this.opinionData2.push({ value: sum.toFixed(2), name: "专项补助" });

        } else if (da.subject_code == '40303' && da.k_name == "超收补助") {
          sum = this.balanceEnd(da, sum);
          this.opinion2.push("超收补助");
          this.opinionData2.push({ value: sum.toFixed(2), name: "超收补助" });

        } else if (da.subject_code == '40304' && da.k_name == "帮扶补助") {
          sum = this.balanceEnd(da, sum);
          this.opinion2.push("帮扶补助");
          this.opinionData2.push({ value: sum.toFixed(2), name: "帮扶补助" });

        } else if (da.subject_code == '40305' && da.k_name == "送温暖补助") {
          sum = this.balanceEnd(da, sum);
          this.opinion2.push("送温暖补助");
          this.opinionData2.push({ value: sum.toFixed(2), name: "送温暖补助" });

        } else if (da.subject_code == '40306' && da.k_name == "救灾补助") {
          sum = this.balanceEnd(da, sum);
          this.opinion2.push("救灾补助");
          this.opinionData2.push({ value: sum.toFixed(2), name: "救灾补助" });

        } else if (da.subject_code == '40307' && da.k_name == "其他补助") {
          sum = this.balanceEnd(da, sum);
          this.opinion2.push("其他补助");
          this.opinionData2.push({ value: sum.toFixed(2), name: "其他补助" });

        }

        else if (da.subject_code == '50101' || da.subject_code == '50102' || da.subject_code == '50103'
          || da.subject_code == '50104'
        ) {
          sum501 = parseFloat(sum501) + this.balanceEnd(da, sum501);
        } else if (da.subject_code == '50201' || da.subject_code == '50202' || da.subject_code == '50203'
          || da.subject_code == '50204' || da.subject_code == '50205' || da.subject_code == '50206'
        ) {
          sum502 = parseFloat(sum502) + this.balanceEnd(da, sum502);
        } else if (da.subject_code == '50301' || da.subject_code == '50302' || da.subject_code == '50303'
          || da.subject_code == '50304' || da.subject_code == '50305'
        ) {
          sum503 = parseFloat(sum503) + this.balanceEnd(da, sum503);
        } else if (da.subject_code == '50401' || da.subject_code == '50402' || da.subject_code == '50403'
          || da.subject_code == '50404'
        ) {
          sum504 = parseFloat(sum504) + this.balanceEnd(da, sum504);
        } else if (da.subject_code == '50501' || da.subject_code == '50502' || da.subject_code == '50503'
          || da.subject_code == '50504' || da.subject_code == '50505' || da.subject_code == '50506' || da.subject_code == '50507'
        ) {
          sum505 = parseFloat(sum505) + this.balanceEnd(da, sum505);
        } else if (da.subject_code == '50601' || da.subject_code == '50602' || da.subject_code == '50603'
          || da.subject_code == '50604' || da.subject_code == '50605' || da.subject_code == '50606' || da.subject_code == '50607'
        ) {
          sum506 = parseFloat(sum506) + this.balanceEnd(da, sum506);
        } else if (da.subject_code == '507'
        ) {
          sum507 = parseFloat(sum507) + this.balanceEnd(da, sum507);
        } else if (da.subject_code == '508'
        ) {
          sum508 = parseFloat(sum508) + this.balanceEnd(da, sum508);
        }

      }
      this.opinion3.push("职工活动支出");
      this.opinion3.push("维权支出");
      this.opinion3.push("业务支出");
      this.opinion3.push("行政支出");
      this.opinion3.push("资本性支出");
      this.opinion3.push("补助下级支出");
      this.opinion3.push("事业支出");
      this.opinion3.push("其他支出");
      this.opinionData3.push({ value: sum501.toFixed(2), name: "职工活动支出" });
      this.opinionData3.push({ value: sum502.toFixed(2), name: "维权支出" });
      this.opinionData3.push({ value: sum503.toFixed(2), name: "业务支出" });
      this.opinionData3.push({ value: sum504.toFixed(2), name: "行政支出" });
      this.opinionData3.push({ value: sum505.toFixed(2), name: "资本性支出" });
      this.opinionData3.push({ value: sum506.toFixed(2), name: "补助下级支出" });
      this.opinionData3.push({ value: sum507.toFixed(2), name: "事业支出" });
      this.opinionData3.push({ value: sum508.toFixed(2), name: "其他支出" });

      this.chartData.push({
        name: '期初余额',
        data: res1
      })
      this.chartData.push({
        name: '期末余额',
        data: res2
      })
    },
    //期末余额计算
    balanceEnd (da, sum) {
      if (da.k_balanceType == 1) {
        sum = (da.ye_j_sum - da.ye_d_sum).toFixed(2);
      } else {
        sum = (da.ye_d_sum - da.ye_j_sum).toFixed(2);
      }
      if (sum < 0) {
        sum = sum * -1;
      }
      return parseFloat(sum);
    },
    //获取图表科目余额的数据
    getBalance () {
      var data = {
        Orgids: this.orgid,
        uid: this.uid,
        Year: this.check.year,
        "StartTime": this.check.year + '-1-1',
        "EndTime": this.check.year + '-12-31',
      }
      this.$axios.get('PVoucherMst/GetSubjectBalanceReport', { params: data })
        .then(res => {

          if (res.Status == 'error') {
            this.closeEchart();
            this.saasMessage = {
              visible: true,
              message: res.Msg,
              callback: this.openEchart
            }
            return;
          }
          this.getChartData(res.Record);
        })
        .catch(err => {

          this.$message({ showClose: true, message: '获取图表科目余额出错了!', type: "error" });
        })
    },
    //获取凭证数
    getVoucherCount () {
      var data = {
        orgid: this.orgid,
        userid: this.uid,
        year: this.check.year,
        // month:this.check.month>9?this.check.month:('0'+this.check.month)
      }
      this.$axios.get('/PVoucherMst/GetVoucherCount', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.voucherCount = res.Data;

          } else {
            this.closeEchart();
            this.saasMessage = {
              visible: true,
              message: res.Msg,
              callback: this.openEchart
            }
          }
        })
        .catch(err => {
          this.$message({ showClose: true, message: '获取凭证数出错了!', type: "error" });
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
            this.$router.push({ path: '/setting/subjectstart' })
            return;
          }
          this.checkedTime = res.Record[0].JAccountPeriod + 1;
          this.checkVal = this.checkedTime;
          this.unCheckVal = this.checkedTime > 1 ? this.checkedTime - 1 : 1;
          this.unCheckYear = this.checkedYear = res.Record[0].JYear;
          this.check.month = res.Record[0].JAccountPeriod + 1;
          this.check.year = res.Record[0].JYear;
          this.getVoucherCount();  //获取凭证数
          this.getMyTextInfo();  //获取备忘录
          this.getBalance();  //获取科目余额
          this.GetAllAccountName(); //获取会计员
          this.getAllNewsLists();      // 获取新闻列表
        },
          err => {

            loading.close();
          })
        .catch(error => { this.$message({ showClose: true, message: '获取结账期失败!', type: "error" }); loading.close(); })
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
    //会计期[反]结账确认选择*****************************
    yearsTrue (val) {

      if (!val) {
        this.getChecked();
        return;
      }

      if (this.checkedStr[1]) {
        if ((this.unCheckVal > this.checkedTime - 1) && (this.unCheckYear >= this.checkedYear)) {
          this.$msgBox.show('当前月份还未结账,无法反结账!');
          return;
        }
        if (this.autoS.BackBuySave != 0) {
          this.checkOut();
        } else {
          this.copyCheck();
        }
      } else if (this.checkedStr[0]) {
        this.yearSelCss = false;
        this.nextMonthCss = true;
          if(this.$refs.chart3)this.$refs.chart3.stopInfinite();
          if(this.$refs.chart2)this.$refs.chart2.stopInfinite();
      } else {
        this.yearSelCss = false;
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
        Backfrom: 2,//反结账备份
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('系统正在反结账前备份,请耐心等待....')
      axios.create(base).get('/OrganizeBackup/GetAddBackUp', { params: data, headers: new_header })
        .then(response => {

          loading.close()
          let res = JSON.parse(response.data)
          if (res.Status == 'success') {
            // this.$msgBox.show(res.Msg)
            this.checkOut();
          } else {
            this.$msgBox.error(res.Msg)
          }
        }).catch(err => {
          console.log(err)
          loading.close()
          this.$msgBox.error('备份失败!')
        })
    },
    //反结账功能*****************************************
    checkOut () {
      let url = '/PBusinessConfig/GetUnUpdateBusinessConfig';
      let t = this.unCheckYear + '-' + this.unCheckVal
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        dateTime: t
      }
      const loading1 = this.$loading();
      this.$axios.get(url, { params: data })
        .then(res => {
          loading1.close();
          if (res.Status == 'success') {
            this.closeEchart();
            this.saasMessage = {
              visible: true,
              message: '反结账成功!',
              callback: this.getChecked
            }
          } else {
            this.closeEchart();
            this.saasMessage = {
              visible: true,
              message: res.Msg,
              callback: this.openEchart
            }
          }
        }, err => {

          loading1.close();
        })
        .catch(err => {
          this.closeEchart();
          this.saasMessage = {
            visible: true,
            message: '反结账失败!',
            callback: this.openEchart
          }
          loading1.close();
        })
    },
    //结账显示***
    // monthCheckShow(){
    //     if(this.checkVal<this.checkedTime){
    //         this.saasMessage={
    //             visible:true,
    //             message:'当前月份已结账!'
    //         }
    //     }else{
    //          this.nextMonthCss=true;
    //     }
    // },
    //接收结账传值******************
    nextMonthHandle (data) {

      if (data === false) {

      } else if (data == 'success') {

        this.saasMessage = {
          visible: true,
          message: '结账成功!',
          callback: this.getChecked
        }

      }
      this.nextMonthCss = false;

      //this.getChecked();
    },
    //会计期年份加减
    checkYear (bool) {
      if (bool && this.check.year < this.checkedYear) {
        this.check.year++;
        this.getVoucherCount();
        this.getBalance();
      } else if (!bool && this.check.year > this.jbuildDate.slice(0, 4)) {
        this.check.year--;
        this.getVoucherCount();
        this.getBalance();
      }

    },
    //反结账年份加减
    unCheckYearFN (bool) {
      if (bool && this.unCheckYear < this.checkedYear) {
        this.unCheckYear++;
      } else if (!bool && this.unCheckYear > this.jbuildDate.slice(0, 4)) {
        this.unCheckYear--;
      }

    },
    //月份选择
    checkMonthClick (ind) {
      if ((ind <= this.nowTime.getMonth() + 1) && this.check.year == this.checkedYear || this.check.year < this.checkedYear) {
        this.check.month = ind;
        this.getVoucherCount();
      }
    },
    //获取备忘录信息
    getMyTextInfo () {
      var data = {
        uid: this.uid,
        orgid: this.orgid
      }
      this.$axios.get('/SysUser/GetMemorandum', { params: data })
        .then(res => {

          if (res.Status == 'success') {
            this.myTextInfo = res.Data;
          } else {
            this.closeEchart();
            this.saasMessage = {
              visible: true,
              message: res.Msg,
              callback: this.openEchart
            }

          }
        })
        .catch(err => {
          this.$message({ showClose: true, message: '获取备忘录出错了!', type: "error" });
        })
    },
    //备忘录更新*****
    myTextUpdate () {
      if (this.TextUpdate) {
        this.TextUpdate = false;
        this.oldTextInfo = this.myTextInfo;  //保存编辑之前的备忘录信息
      } else {
        this.TextUpdate = true;
        if (this.oldTextInfo === this.myTextInfo) {
          return;  //备忘录信息没有变化，跳出
        }
        var data = {
          uid: this.uid,
          orgid: this.orgid,
          value: this.myTextInfo
        }
        const loading = this.$loading();
        this.$axios.post('/SysUser/PostSaveMemorandum', data)
          .then(res => {
            loading.close();
            if (res.Status == 'success') {
              this.getMyTextInfo();
            } else {
              this.closeEchart();
              this.saasMessage = {
                visible: true,
                message: res.Msg,
                callback: this.openEchart
              }

            }
          })
          .catch(err => {
            loading.close();
            this.$message({ showClose: true, message: '保存备忘录出错了!', type: "error" });
          })
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
          "Verify*byte*eq*1": 0,  //未审核****
          //已审核****    "PAuditor*num*ge*1":0,
          "PAccper*str*ge*1": this.check.year.toString() + '01',
          "PAccper*str*le*1": this.check.year.toString() + '12'
        }
      }
      this.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.closeEchart();
            this.saasMessage = {
              visible: true,
              message: res.Msg,
              callback: this.openEchart
            }

            return;
          }

          if (res.Record.length <= 0) {
            //this.$message('无法找到凭证!');
            this.voucherList = [];
            this.total = 0;
          } else {
            this.voucherList = res.Record;
            this.total = res.totalRows;
            this.$forceUpdate();
          }


        }, err => {
          console.log(err);

        })
        .catch(err => { this.$message({ showClose: true, message: '获取列表失败!', type: "error" }); })
    },
    //审核
    listHandle () {
      var vm = this;
      var phids = [];
      for (var vou of this.voucherList) {
        phids.push(vou.PhId);
      }
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        uname: this.uname,
        infoData: phids
      }

      reportinfo.api.voucherAudit(vm, data)
        .then(res => {
          if (res.Status == 'success') {
            this.getvoucherList();
          }
          this.closeEchart();
          this.saasMessage = {
            visible: true,
            message: res.Msg,
            callback: this.openEchart
          }
        })
        .catch(err => {
          this.closeEchart();
          this.saasMessage = {
            visible: true,
            message: '审核失败了!',
            callback: this.openEchart
          }
        })
    },
    //关闭echart循环
    closeEchart () {
        if(this.$refs.chart3)this.$refs.chart3.stopInfinite();
        if(this.$refs.chart2)this.$refs.chart2.stopInfinite();
    },
    //开启echart循环
    openEchart () {
      this.$refs.chart3.delay = false;
      this.$refs.chart2.delay = false;
      this.$refs.chart3.delayInfinite();
      this.$refs.chart2.delayInfinite();
    },
    //关闭审核列表
    audithide () {
      this.auditShow = false;
      this.$refs.chart3.delay = false;
      this.$refs.chart2.delay = false;
      this.$refs.chart3.delayInfinite();
      this.$refs.chart2.delayInfinite();
      this.getVoucherCount();
      this.getBalance();
    },
    //打开未审核凭证列表
    auditList () {
      this.auditShow = true;
      if(this.$refs.chart3)this.$refs.chart3.stopInfinite();
        if(this.$refs.chart2)this.$refs.chart2.stopInfinite();
      this.getvoucherList();
    },
    //路由跳转
    routerToUrl (url) {
      let check = false;
      if (url == '/finance/voucherAdd' && this.Roleauthorize.homePage_voucherAdd == 0) {
        check = true;
      } else if (url == '/finance/voucherList' && this.Roleauthorize.homePage_moreVoucher == 0) {
        check = true;
      } else if (url == '/accountbooks/balance' && this.Roleauthorize.homePage_subjectBalance == 0) {
        check = true;
      } else if (url == '/report/assets' && this.Roleauthorize.homePage_Assetliability == 0) {
        check = true;
      } else if (url == '/report/expenses' && this.Roleauthorize.homePage_inOut == 0) {
        check = true;
      } else if (url == '/accountbooks/detailaccount' && this.Roleauthorize.homePage_detailed == 0) {
        check = true;
      } else if (url == '/accountbooks/classify' && this.Roleauthorize.homePage_classify == 0) {
        check = true;
      } else if (url == '/budget/budget' && this.Roleauthorize.homePage_budget == 0) {
        check = true;
      } else if (url == '/budget/actualbudget' && this.Roleauthorize.homePage_final == 0) {
        check = true;
      }
      if (check) {
        this.closeEchart();
        this.saasMessage = {
          visible: true,
          message: '您还没有该页面的权限,请联系管理员开通!',
          callback: this.openEchart
        }
        return;
      }

      this.$router.push({ path: url });
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
}

</script>

<style>
.home .el-card.is-always-shadow {
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.08);
}
</style>

<style  scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  padding: 10px;
}
.grid-content textarea {
  width: 100%;
  height: 60px;
  overflow-y: auto;
  text-indent: 15px;
  padding: 5px;
}
.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 18px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 18px;
  color: #fff;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 18px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.chart-area {
  width: 100%;
  height: 300px;
}
.orogressInfo {
  color: #fff;
  margin-bottom: 10px;
  font-weight: 800;
  font-size: 16px;
  /* transform:rotate(180deg); */
}
.orogressInfoNum {
  font-size: 25px;
  letter-spacing: 2px;
}
.voucherProgress {
  /* transform:rotate(180deg); */
  margin-bottom: 30px;
  margin-top: 20px;
}
.NumRed {
  color: red;
}
.voucherProgress .el-progress >>> path:first-child {
  stroke: #05b5f1;
}
.voucherBtn {
  color: #05b5f1;
  width: 160px;
  height: 60px;
  line-height: 60px;
  border-radius: 5px;
  background: #fff;
  cursor: pointer;
  margin: auto;
  margin-top: -15px;
  box-shadow: 0 1px 3px 1px #88b927;
  font-size: 20px;
}
.myText {
  margin: 2px 0 0 10px;
  padding: 0;
  font-size: 18px;
  font-weight: 400;
}
.myText > i {
  cursor: pointer;
  font-size: 20px;
  float: right;
  width: 20px;
  height: 20px;
  background: url("../../assets/icon/bc_06.png") no-repeat;
  background-size: 100% 100%;
}
.myText > i.updateIcon {
  background: url("../../assets/icon/bwl.png") no-repeat;
  background-size: 100% 100%;
}
.myTextContent {
  border: 1px solid #ccc;
  margin-top: 5px;
  height: 200px;
  margin: 20px;
}
.myTextContentDisabled {
  border: 0;
  margin: 20px;
}
.myTextContent > textarea {
  border: 0;
  height: 100%;
}
.checkTimeTitle {
  padding: 0px;
  height: 30px;
}
.checkTimeTitle > span {
  float: left;
  font-size: 18px;
  height: 20px;
  line-height: 20px;
}
.checkYear,
.checkTimeModel {
  font-size: 18px;
  float: right;
  height: 20px;
  line-height: 20px;
  position: relative;
}
.checkYearCon {
  font-size: 18px;
  position: relative;
}
.checkTimeTitle .el-icon-minus,
.checkYearCon .el-icon-minus {
  border: 2px solid #ccc;
  border-radius: 50%;
  color: #ccc;
}
.checkTimeTitle .el-icon-lx-add,
.checkYearCon .el-icon-lx-add {
  border: 2px solid #88b927;
  background-color: #88b927;
  border-radius: 50%;
  color: #fff;
}
.checkTimeModel > span {
  line-height: 20px;
}
.checkTimeModel > i {
  width: 14px;
  height: 14px;
  display: inline-block;
  margin-right: 0px;
  margin-left: 12px;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
.checkTimeModel > i:first-of-type {
  background: #05b5f1;
}
.checkTimeModel > i:nth-of-type(2) {
  background: #fff;
  border: 2px solid #05b5f1;
}
.checkTimeModel > i:nth-of-type(3) {
  background: #ccc;
}
.checkYear {
  float: left;
  width: 100px;
  line-height: 20px;
  font-size: 18px;
  margin-left: 0px;
  position: relative;
}
.checkYear > span:first-of-type {
  color: #05b5f1;
}
.checkYear > i {
  color: #05b5f1;
  cursor: pointer;
}
.checkYear > i.disabled {
  background-color: #bbb;
  border-color: #bbb;
  color: #fff;
  cursor: default;
}
.checkYearCon {
  margin-right: 0;
  color: #00b7ee;
  position: relative;
  top: 0px;
  font-size: 18px;
  text-align: center;
}
.checkYearCon img {
  width: 60px;
  margin-bottom: 5px;
}
.checkTimeCon {
  padding-right: 0px;
}
.checkTimeCon > ul {
  height: 40px;
  width: 800px;
  margin: 0 auto;
  margin-bottom: 10px;
  padding-top: 5px;
}
.checkTimeCon > ul > li {
  cursor: default;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 35px;
  text-align: center;
  float: left;
  font-size: 18px;
  margin-right: 25px;
  position: relative;
  border: 2px solid transparent;
}

.checkTimeCon > ul > li.checkingMonth {
  background: #fff;
  border: 2px solid #05b5f1;
}
.checkTimeCon > ul > li.futureMonth {
  background: #ccc;
  border: 2px solid #ccc;
  color: #fff;
  cursor: default;
}
.checkTimeCon > ul > li.checkedMonth {
  background: #05b5f1;
  color: #fff;
  border: 0;
}

/* .checkTimeCon>ul>li.nowMonth{
        border:2px solid #31cc7e;
    }
    .checkTimeCon>ul>li.nowMonth>span{
        position:absolute;
        top:-30px;
        left:-30px;
        width:80px;
        height:20px;
        line-height:20px;
        font-size:13px;
        background:#31cc7e;
        color:#fff;
        border-radius:3px;
        text-align: center;
    } */
.checkTimeCon > ul > li.nowMonth > span:before {
  content: "";
  position: absolute;
  border: 8px solid transparent;
  border-top-color: #31cc7e;
  top: 100%;
  left: 31px;
}
.checkTimeCon > ul > li:after {
  content: "";
  display: block;
  position: absolute;
  right: -24px;
  top: 14px;
  width: 20px;
  height: 2px;
  background: #ccc;
}
.checkTimeCon > ul > li:last-of-type:after {
  width: 0;
}

.checkTimeCon,
.checkTimeCon table {
  width: 100%;
}
.checkTimeCon table td {
  width: 16.6%;
  height: 40px;
  text-align: center;
  color: #05b5f1;
}
.checkTimeCon table td.checkingMonth {
  background: #fff;
  border: 2px solid #05b5f1;
}
.checkTimeCon table td.futureMonth {
  background: #ccc;
  border: 2px solid #ccc;
  color: #fff;
  cursor: default;
}
.checkTimeCon table td.checkedMonth {
  background: #05b5f1;
  border: 2px solid #91e0f8;
  color: #fff;
}

.formCenter {
  height: 250px;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}
.formCenter > li {
  padding: 5px 0 5px 30px;
  cursor: pointer;
  height: 28px;
  line-height: 18px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.formCenter > li:before {
  content: "";
  display: block;
  width: 25px;
  height: 25px;

  position: absolute;
  left: 10px;
  top: 7px;
  background: url(../../assets/icon/bb.png) no-repeat;
}
.formCenter > li:hover {
  box-shadow: 0px 0px 5px #88b927;
  font-size: 15px;
}
.noShadow > li {
  cursor: default;
  height: 35px;
  line-height: 15px;
  font-size: 18px;
}
.noShadow > li:before {
  top: 5px;
}
.noShadow > li:hover {
  box-shadow: none;
}
.checkContainer {
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.orogressCon {
  height: 150px;
  width: 150px;
  margin: 0 auto;
  padding-top: 40px;
  background: url("../../assets/images/quan.png");
}
.home {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px 2px #d3e9f9;
  overflow: hidden;
  padding: 20px 10px;
  background: #fff;
  border: 1px solid #fff;
  border-radius: 5px;
  .cardPanelArea {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    &.helfPanel .cardPanel {
      width: 50%;
      height: 50% !important;
      min-height: 310px !important;
    }
    .cardPanel {
      padding: 5px;
      box-sizing: border-box;
      float: left;
      overflow: hidden;
      height: 310px;
      /deep/.el-card {
        height: 100% !important;
        .el-card__body {
          padding: 20px 10px;
          .myMsgContent {
            height: 215px;
            overflow: hidden;
            box-sizing: border-box;
            padding: 10px 5px;
            li {
              position: relative;
              padding: 5px 100px 5px 10px;
              height: 28px;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 100%;
              box-sizing: border-box;
              white-space: nowrap;
              cursor: pointer;
              &:hover {
                box-shadow: 0px 0px 5px #88b927;
                font-size: 15px;
              }
              .time {
                position: absolute;
                right: 5px;
              }
            }
          }
          .moreNews {
            color: #00b7ee;
            cursor: pointer;
            float: right;
            font-size: 15px;
          }

          .el-icon-s-promotion {
            width: 100%;
            font-size: 200px;
            text-align: center;
            color: #2494f5;
            cursor: pointer;
            &:hover {
              color: #00b7ee;
            }
          }
        }
        /deep/.grid-content > div {
          margin-bottom: 30px;
        }
      }
    }
  }
}
.chart-area {
  height: 230px;
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
  top: -30px;
  z-index: 9;
  left: -320px;
  width: 300px;
  height: 200px;
  background: #fff;
  padding: 20px 10px 10px 10px;
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
      width: 50%;
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
      text-align: left;
      width: 230px;
      height: 110px;
      line-height: 40px;
      margin: 0px auto;
      padding: 0px;
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
      margin: 0 auto;
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
@media screen and(min-width:1477px) {
  .cardPanel {
    width: 33.3333%;
  }
}
@media screen and(max-width:1476px) {
  .checkTimeCon > ul {
    width: 660px;
  }
  .checkTimeCon > ul > li {
    width: 30px;
    height: 30px;
    line-height: 28px;
  }
  .cardPanel {
    width: 50%;
  }
}
.orgnameLogo {
  width: 100%;
  height: 50px;
  padding-left: 60px;
  position: relative;
  > img {
    position: absolute;
    left: 0;
    top: 0;
  }
  > div {
    width: 100%;
    height: 50px;
    overflow: hidden;
    margin-top: 10px;
    line-height: 50px;
    font-size: 19px;
    font-weight: bold;
    color: #444;
  }
  > div.overflow2 {
    line-height: 25px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
.auditBG {
  position: fixed;
  position: -ms-page;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  text-align: center;
  > .auditContainer {
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    height: 80%;
    width: 85%;
    min-width: 868px;
    padding: 5px 15px;
    .listContainer {
      max-height: 70%;
      overflow-y: auto;
      padding: 5px;
      padding-bottom: 20px;
    }
    .listContainer ul.listTitle {
      display: flex;
      background: #d3e9f9;
      color: #333;
      border: 1px solid #ccc;
      border-bottom: 0;
    }
    .listContainer ul.listTitle li {
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-right: 1px solid #ccc;
    }
    .listContainer ul.listTitle li:first-of-type {
      width: 4.9%;
    }
    .listContainer ul.listTitle li:nth-of-type(2) {
      width: 30.5%;
    }
    .listContainer ul.listTitle li:nth-of-type(3) {
      width: 26.5%;
    }
    .listContainer ul.listTitle li:nth-of-type(4) {
      width: 19%;
    }
    .listContainer ul.listTitle li:nth-of-type(5) {
      width: 19%;
      border-right: none;
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
  width: 100%;
  height: 40px;
  line-height: 30px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  text-align: left;
  > span {
    float: left;
  }
  > i {
    float: right;
    margin-top: 5px;
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
.auditCheck {
  height: 50px;
  line-height: 50px;
  overflow: hidden;
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
.jiezhang .inputContainer input {
  text-align: center;
}
.jzArea {
  position: relative;
  margin-right: 130px;
  margin-bottom: 10px;
}
.jzArea > div:nth-of-type(1) {
  position: absolute;
  width: 100px;
  text-align: left;
}
.jzArea > div:nth-of-type(2) {
  padding-left: 100px;
  text-align: left;
}
.jzArea .inputContainer {
  width: 100%;
  padding-left: 100px;
  display: inline-block;
  min-width: 225px;
  height: 30px;
}
.jzArea .inputContainer input {
  border-width: 0 0 1px 0;
  text-align: center;
}
.fjzArea {
  position: relative;
  margin-right: 130px;
  margin-bottom: 10px;
}
.fjzArea > div:nth-of-type(1) {
  position: absolute;
  width: 100px;
  text-align: left;
}
.fjzArea > div:nth-of-type(2) {
  padding-left: 100px;
  text-align: left;
}
.fjzArea .checkYear,
.fjzArea .checkMonth {
  width: 50%;
  display: inline-block;
  min-width: 125px;
  height: 30px;
}
.fjzArea .inputContainer input {
  border-width: 0 0 1px 0;
  text-align: center;
}
.personalSty {
  text-align: right;
  color: orangered;
  text-decoration: underline;
}

.home > /deep/.el-row > .el-col {
  margin-bottom: 10px;
}
.newsDialog {
  /deep/.el-dialog {
    width: 90%;
    min-width: 1366px;
    /deep/.container {
      padding: 0;
      box-shadow: none;
    }
  }
}
</style>
