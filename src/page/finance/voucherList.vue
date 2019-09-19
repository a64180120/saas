<template>
  <div class="container">
    <div class="voucherList">

      <section class="listContainer listFont">
        <div style="height:40px;min-width:1130px;font-size:14px">
          <div style="float:left;">
            <span>合计金额(元):&nbsp;</span>
            <div style="height:32px;width:65px;display: inline-block"
                 class="inputContainer"><input @blur="sum1=(parseFloat(sum1)?parseFloat(sum1):'')"
                     @keyup="clearNoNum($event)"
                     @keyup.13="getvoucherList('search')"
                     onafterpaste="this.value=this.value.replace(/e/g,'')"
                     v-model="sum1"
                     type="text"></div>
            <span>至:&nbsp;</span>
            <div style="height:32px;width:65px;display: inline-block"
                 class="inputContainer"><input @blur="sum2=(parseFloat(sum2)?parseFloat(sum2):'')"
                     @keyup="clearNoNum($event)"
                     @keyup.13="getvoucherList('search')"
                     onafterpaste="this.value=this.value.replace(/e/g,'')"
                     v-model="sum2"
                     type="text"></div>
          </div>
          <div class="voucherNav">
            <ul>
              <a @click.prevent="handle('fresh')"
                 style="width:30px">
                <li style='font-size:27px;'
                    class="el-icon-refresh"></li>
              </a>
              <a style="display:block;width:100px;height:30px;margin-left:10px">
                <li class="more"
                    style="width:100px;">
                  <ul>
                    <li>更多</li>
                    <li v-if="Roleauthorize.voucherManage_copy!=0"
                        @click.stop="handle('copy')">复制</li>
                    <li v-if="Roleauthorize.voucherManage_cut!=0"
                        @click.stop="handle('cut')">剪切</li>
                    <li v-if="Roleauthorize.voucherManage_red!=0"
                        @click.stop="handle('chongh')">冲红</li>
                    <li v-if="Roleauthorize.voucherManage_push!=0"
                        @click.stop="handle('push')">
                      插入
                    </li>
                    <li v-if="Roleauthorize.voucherManage_export!=0"
                        @click.stop.prevent="modelExport('yes')">
                      <a class="downloadBtn">导出</a>
                    </li>
                    <li v-if="Roleauthorize.voucherManage_import!=0"
                        @click.prevent="handle('upload')">
                      <div>导入</div>
                    </li>
                    <li v-if="Roleauthorize.voucherManage_print!=0"
                        @click.stop="handle('print')">打印</li>
                    <li v-if="Roleauthorize.voucherEntry_account!=0"
                        @click="checkDate='check'">
                      结账</li>
                    <li v-if="Roleauthorize.voucherEntry_noAccount!=0"
                        @click="checkDate='uncheck'">反结账

                    </li>
                    <li v-if="Roleauthorize.voucherManage_rearrange!=0"
                        @click.stop="handle('reset')">凭证号重排</li>
                    <!-- <li v-if="Roleauthorize.voucherManage_model!=0" -->
                    <li @click.stop="modelExport('no')">按模板格式导出</li>
                  </ul>
                </li>
              </a>
              <a v-if="Roleauthorize.voucherManage_audit!=0"
                 class="btn"
                 @click.prevent="handle('unaudit')">
                <li>反审核</li>
              </a>
              <a v-if="Roleauthorize.voucherManage_review!=0"
                 class="btn"
                 @click.prevent="handle('audit')">
                <li>审核</li>
              </a>
              <a v-if="Roleauthorize.voucherManage_delete!=0"
                 class="btn"
                 @click.prevent="handle('delete')">
                <li>删除</li>
              </a>
              <a v-if="Roleauthorize.voucherManage_edit!=0"
                 class="btn"
                 @click.prevent="handle('update')">
                <li>修改</li>
              </a>
              <a v-if="Roleauthorize.voucherManage_add!=0"
                 class="btn"
                 @click.prevent="handle('add')">
                <li>新增</li>
              </a>
            </ul>
          </div>
          <div class="voucherSelect">

            <!-- <div>

                            <el-checkbox v-model="listInverse">反选</el-checkbox>
                        </div> -->
            <div class="searcherCon">
              <div @click.stop="highGradeToggle(!highGradeCss)">高级</div>
              <div @click="getvoucherList('search')"
                   class="searcherBtn">搜索</div>
              <div class="searcherValue"><input @keyup.13="getvoucherList('search')"
                       v-model="searchVal"
                       type="text"
                       placeholder="科目/摘要/凭证号"></div>

              <!-- 高级搜索 -->
              <div v-if="highGradeCss"
                   class="highGradeCss">
                <div><span>高级查询</span><i @click.stop="highGradeToggle(false)"
                     class="cancle"></i></div>
                <ul>
                  <li>
                    <div>科目名称</div>
                    <div @click.stop="subjectSearchShow"
                         style="background:none">
                      <div style="position:relative;background:#fff">
                        <span>{{superSearchVal.keyword.KCode}}&nbsp;{{superSearchVal.keyword.KName}}</span>
                        <sub-list @subadd-click="subjectData"
                                  v-if="subjectListShow"
                                  :placeholder='"搜索科目"'
                                  :itemlists="subjectList"></sub-list>
                        <i v-show="superSearchVal.keyword.KName"
                           @click.stop="clearSubject(superSearchVal)"
                           class="codeSearchClose"
                           title="清除"></i>
                      </div>

                    </div>
                  </li>
                  <li>
                    <div>辅助核算</div>
                    <div>
                      <div class="selectContainer">
                        <select v-model="superSearchValPhId">
                          <option value="0"></option>
                          <option :value="item.PhId"
                                  v-for="(item,index) of superSearchVal.assistItemList.type"
                                  :key="index">{{item.BaseName}}</option>
                        </select>
                      </div>
                      <div @click.stop="superSearchVal.show=!superSearchVal.show"
                           class="searchSelectCon">
                        <span>{{superSearchVal.assistItem.BaseName}}</span>
                        <searchSelect v-if="superSearchVal.show"
                                      :itemlists="assistItemList"
                                      :placeholder="superSearchVal.placeholder"
                                      :nodatatext="superSearchVal.nodatatext"
                                      @item-click="itemClick"></searchSelect>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>审核状态</div>
                    <div class="selectContainer">
                      <select v-model="verified">
                        <option value="0">全部</option>
                        <option value="1">未审核</option>
                        <option value="2">已审核</option>
                      </select>
                    </div>

                  </li>
                  <li>
                    <div>合计金额</div>
                    <div style="border:1px solid #ddd"
                         class="flexPublic">
                      <div class="inputContainer"><input @blur="superSearchVal.sum1=(parseFloat(superSearchVal.sum1)?parseFloat(superSearchVal.sum1):'')"
                               @keyup="clearNoNum($event)"
                               onafterpaste="this.value=this.value.replace(/e/g,'')"
                               type="text"
                               v-model="superSearchVal.sum1"></div>
                      <span>至</span>
                      <div class="inputContainer"><input @blur="superSearchVal.sum2=(parseFloat(superSearchVal.sum2)?parseFloat(superSearchVal.sum2):'')"
                               @keyup="clearNoNum($event)"
                               onafterpaste="this.value=this.value.replace(/e/g,'')"
                               type="text"
                               v-model="superSearchVal.sum2"></div>
                    </div>
                  </li>
                  <li>
                    <div>凭证日期</div>
                    <div>
                      <el-date-picker v-model="timeValue"
                                      type="daterange"
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                  </li>
                </ul>
                <div>
                  <div>
                    <div class="btngrey"
                         @click.stop="highGradeToggle('reset')">重置</div>
                    <div class="btn"
                         @click.stop="getvoucherList('highSearch')">搜索</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="listTitleCon">
          <div style="border:1px solid #bcbdbd;width:5%;left:0;top:0px;position:absolute;height:40px;line-height:40px;background:#d3e8f9;text-align:center">

            <div style="width:50%;height:100%;float:left;border-right:1px solid #bcbdbd;">
              <el-checkbox v-model="listAll"></el-checkbox>
            </div>
            <div style="width:50%;height:100%;font-size:16px;float:left;overflow:hidden;white-space:nowrap">序号</div>
          </div>
          <ul class="listTitle">
            <li>摘要</li>
            <li>科目</li>
            <li>借方金额(元)</li>
            <li>贷方金额(元)</li>
          </ul>

        </div>
        <div class="listOver">
          <div style="text-align:center;height:40px;line-height:40px;color:#aaa;"
               v-if="voucherList.length==0">暂无凭证信息！</div>
          <ul @click="chooseClick(item,index,$event)"
              :class="{choosed:item.checked}"
              class="listContent"
              v-for="(item,index) of voucherList"
              :key="index">
            <li @dblclick="voucherDel(item,index)">
              <ul class="listIndex">
                <li>
                  <el-checkbox @change="choose(item,index,$event)"
                               v-model="item.checked"></el-checkbox>
                </li>
                <li>{{index+1+(pageindex-1)*pagesize}}</li>
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
                  <div>{{'jie'| sum(item.Dtls)}}</div>
                  <div>{{'dai'| sum(item.Dtls)}}</div>
                </li>
              </ul>
            </li>
          </ul>
          <div style="float:right">
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

      </section>
      <!-- <div class="footInfo">
                <router-link to="">服务协议</router-link>
                <router-link to="">运营规范</router-link>
                <router-link to="">关于政云</router-link>
            </div> -->
      <!-- 年度选择 -->
      <div class="timeContainer">
        <side-time @time-click="getSideDate"
                   ref='sideDate'></side-time>
      </div>
      <!--凭证手动重排****************************-->
      <num-reset :visible.sync="numResetShow"
                 @msg-click="numResetMsg"></num-reset>

      <!-- 弹出凭证********************* -->
      <div v-if="voucherMask"
           :class="{voucherMask:voucherMask}">
        <div class="voucherContainer">
          <p v-if="voucherMask"
             class="title"><span v-if="voucherMask=='copy'">复制凭证</span>
            <span v-if="voucherMask=='cut'">剪切凭证</span><span v-if="voucherMask=='chongh'">冲红凭证</span>
            <span v-if="voucherMask=='gengz'">更正凭证</span><span v-if="voucherMask=='update'">修改凭证</span>
            <i @click="keepChoose(false)"></i>
          </p>
          <div style="height:40px"
               v-if="voucherMask">

            <span class="btn"
                  @click.stop="keepChoose(voucherMask)">保存</span>
            <span class="btngrey"
                  @click.stop="keepChoose(false)">取消</span>
          </div>
          <div class="voucherDisabledCon">
            <div :class="{voucherDisabled:voucherMask=='chongh'}"></div>
            <div :class="{voucherDisabledCut:voucherMask=='cut'}"></div>
            <voucher :AbstractList="AbstractList"
                     :disabled2="disabled2"
                     :disabled="disabled"
                     :vouSubjectlist="vouSubjectlist"
                     :sideDate='sideDate'
                     :dataList="voucherDataList"
                     v-if="voucherDataList.bool"
                     :balanceBool="getBalanceBool"
                     ref="voucher">

            </voucher>
          </div>
        </div>
      </div>
      <!-- 打印************ -->
      <div v-show="printCss"
           class="printCon">
        <div class="printTitle">
          <p>
            <span>打印预览</span>
            <span @click.stop="print">打印</span>
            <span @click.stop="printCss=false">取消 </span>

          </p>
        </div>

        <div class="container"
             ref="print">
          <div>
            <div class="sys-page printDataCss">

              <div class="manageContent"
                   v-for="(item, n) in tableData"
                   :key="n">
                <div class="title">
                  <strong>{{item.mst.voucherTitle}}</strong>
                  <div>附单据数：{{item.mst.billNum}}张</div>
                </div>
                <ul class="formDataItemsA flexPublic">
                  <li>单位：{{orgName}}</li>
                  <li>日期：{{ item.mst.billdate}}</li>
                  <li>凭证号：{{item.mst.voucherNum}} <span v-if="item.toltal>1">-{{item.page+'/'+item.toltal}}</span> </li>
                </ul>
                <div class="formData"
                     ref="printFrom">
                  <ul>
                    <li class="align-center bolder">摘要</li>
                    <li class="align-center bolder">科目</li>
                    <li class="align-center bolder">借方</li>
                    <li class="align-center bolder">贷方</li>
                  </ul>
                  <ul class="formDataItems flexPublic"
                      v-for="(del, k) in item.list"
                      :key="k">
                    <li>{{del.abstract}}</li>
                    <li>{{del.subject}}</li>
                    <li class="align-right">{{del.JSum}}</li>
                    <li class="align-right">{{del.DSum}}</li>
                  </ul>
                  <ul class="formDataItems flexPublic">
                    <li>
                      合计： <span class="bolder"> {{item.mst.lotal.replace(/,/ig,'') | NumtoCHN}}</span>
                    </li>
                    <li class="align-right">{{item.mst.lotal}}</li>
                    <li class="align-right">{{item.mst.lotal}}</li>
                  </ul>
                </div>
                <ul class="formDataItemsB flexPublic">
                  <li>主管：{{item.mst.chager}}</li>
                  <li>记账：{{item.mst.supervisor}}</li>
                  <li>审核：{{item.mst.auditor}}</li>
                  <li>出纳：{{item.mst.cashier}}</li>
                  <li>制单：{{item.mst.producer}}</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 附件弹出框 -->
      <el-dialog title="选择文件"
                 custom-class="fileDialog"
                 :modal=true
                 :visible.sync="fileVisible"
                 width="540px">
        <file-upload ref="fileupload"
                     @uploadimg="uploadfile"
                     :imgList="filelist"
                     :limit="1"
                     @removeimg="removefile"></file-upload>
        <div class="loadBtn"> <a :href="modelFileUrl"
             target="_blank"
             style="">下载模板</a></div>
        <div v-show="fileErrMsg.ErrMsg.length>0||fileErrMsg.IngoreMsg.length>0||fileErrMsg.AddMsg.length>0||fileSuccessMsg"
             class="fileCon">
          <ul class="fileErrMsg"
              v-show="fileErrMsg.ErrMsg.length>0">
            <li>不可跳过错误:</li>
            <li v-for="(item,index) of fileErrMsg.ErrMsg"
                :key="index">{{item}}</li>
          </ul>
          <ul class="fileAddMsg"
              v-show="fileErrMsg.AddMsg.length>0">
            <li>基础数据错误:</li>
            <li v-for="(item,index) of fileErrMsg.AddMsg"
                :key="index">{{item}}</li>
          </ul>
          <ul class="fileIngoreMsg"
              v-show="fileErrMsg.IngoreMsg.length>0">
            <li>可跳过错误:</li>
            <li v-for="(item2,index2) of fileErrMsg.IngoreMsg"
                :key="index2">{{item2}}</li>
          </ul>
          <ul class="fileSuccessMsg">
            <li>{{fileSuccessMsg}}</li>
          </ul>
        </div>
        <div v-show="fileErrMsg.IngoreMsg.length>0||fileErrMsg.AddMsg.length>0"
             class="fileBtn">
          <div class="btn"
               @click.stop="fileErrHandle()">跳过</div>
          <div class="btn"
               @click.stop="fileErrHandle('cover')">覆盖</div>
          <div class="btn"
               @click.stop="fileErrHandle('add')">添加</div>
        </div>

        <div style="clear:both"></div>
      </el-dialog>
      <!-- 导出时间选择 -->
      <el-dialog title="导出范围选择"
                 :modal=true
                 custom-class="modelExportDate"
                 :visible.sync="exportShow">
        <div class="block">
          <p>凭证日期区间选择：</p>
          <el-date-picker v-model="exportDate"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00']">
          </el-date-picker>
        </div>
        <p class="exportBtn">
          <span @click="exportShow=false"
                class="btngrey">取消</span>
          <span @click="modelDateConfirm"
                class="btn">确定</span>
        </p>
      </el-dialog>
      <!-- 凭证插入 -->
      <el-dialog :title="!pushMsgShow?'凭证插入':'提示'"
                 :modal=true
                 custom-class="pushVoucher"
                 :visible.sync="pushVoucherShow">
        <div v-if="!pushMsgShow"
             class="pushContent">
          <p>选择会计期:</p>
          <div class="pushDate">
            <p class="pushYear">
              <i @click="pushYear--"
                 class="el-icon-minus"></i>
              <span>{{pushYear}}</span>
              <i @click="pushYear++"
                 class="el-icon-plus"></i>
            </p>
            <div class="pushMonth">
              <ul>
                <li @click="pushMonth=index+1"
                    :class="{pushActive:pushMonth-1==index}"
                    v-for="(item,index) of month12">{{item}}</li>
              </ul>
            </div>
          </div>
          <div>
            将上述会计期的: 记-
            <div class="inputContainer">
              <input type="text"
                     v-model="pushNewPNo">
            </div>
            号移动到: 记-
            <div class="inputContainer">
              <input type="text"
                     v-model="pushOldPNo">
            </div>
            号之前
          </div>
        </div>
        <p v-if="!pushMsgShow"
           class="exportBtn">
          <span @click="pushVoucherShow=false"
                class="btngrey">取消</span>
          <span @click="pushMsg"
                class="btn">插入</span>
        </p>
        <div v-if="pushMsgShow"
             style="padding-bottom: 0;"
             class="pushMsg">

          <div>
            <div class="imgCon"><img src="../../assets/images/error.png"></div>

            <span style="float:right;width:100%">{{'原'+'“'+'记-'+pushNewPNo+'”的凭证号将被修改为“记-'+pushOldPNo+'”;其余凭证号将会重排,是否确认执行?' }}</span>
          </div>

          <p class="exportBtn">
            <span @click="pushMsgShow=false"
                  class="btngrey">取消</span>
            <span @click="pushVoucherConfirm"
                  class="btn">确认</span>
          </p>
        </div>
      </el-dialog>
      <!-- 结账 -->
      <quick-check :visible.sync="checkDate"
                   @finish-check="finishUncheck"
                   @child-click="nextMonthHandle"
                   :title="checkDate" />
      <!-- 弹窗*****message:信息******delay:延迟毫秒默认4000毫秒 -->
      <message :message="saasMessage.message"
               :delay="saasMessage.delay"
               :visible.sync="saasMessage.visible"></message>
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

  </div>

</template>

<script>
import quickCheck from './quicklyCheck'
import { modelExportByPhid, pushVoucher, modelExportByDate } from '@/api/voucher/voucherList'
import numReset from './voucherNoReset'
import subList from './addSublist'
import printTem from "@/page/finance/vprint/printTemPdf"
import { mapState, mapActions } from 'vuex'
import sideTime from './sideTime'
import voucher from './voucher'
import searchSelect from './searchList'
import { SysOrgModel, SysOrgUpdate, SysOrgUploadFile, SysOrgDelete } from '@/api/organize/orgInfo'
import fileUpload from "@/components/upload/fileUpload";
import axios from "axios";
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
export default {
  name: "voucherList",
  // created(){     
  //     if(this.$route.query.voucherList){
  //         this.routerQuery=true;
  //         this.voucherList= this.$route.query.voucherList;
  //         this.listInit(this.voucherList);
  //     }else if(this.$route.query.reset){
  //         this.handle('fresh');
  //         // if(!this.sideDate){
  //         //     this.getChecked();
  //         // }
  //     }
  //     console.log(111)    
  //     this.getAssist();        
  // },
  activated () {
    if (!this.active) {  //mounted执行了就不执行activated
      return;
    }
    if (this.$route.params.voucherList) {
      this.voucherList = this.$route.params.voucherList;
      this.listInit(this.voucherList);
    } else if (this.$route.params.reset) {
      if (this.sideDate) {
        this.handle('fresh');
      }

      // if(!this.sideDate){
      //     this.getChecked();
      // }
    }
    this.getAbstract();

  },
  mounted () {
    if (!this.active) {  //mounted执行了就不执行activated
      if (this.$route.params.voucherList) {
        this.voucherList = this.$route.params.voucherList;
        this.listInit(this.voucherList);
      } else if (this.$route.params.reset) {
        if (this.sideDate) {
          this.handle('fresh');
        }

        // if(!this.sideDate){
        //     this.getChecked();
        // }
      }
      this.getAbstract();
    }
  },
  data () {
    return {
      checkedDate: { checkedTime: '', checkedYear: '' },//给子代传值
      checkDate: '',//显示结账月份选择
      month12: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      getBalanceBool: false,//凭证中科目拉取科目余额*****模板*******
      active: false,//执行activated钩子
      disabled2: true,
      disabled: false,
      AbstractList: [],//凭证摘要模板****
      sum1: '',
      sum2: '',
      chooseItem: [],
      nowTime: new Date,
      checkedTime: '',   //结账月****
      checkedYear: '',   //结账年*****
      sideDate: '',   //侧边会计期年月
      month: '',    //当前选中年
      year: '',     //月
      searchVal: '', //一般搜索值
      superSearchValPhId: "0",   //高级搜索
      verified: 0,//审核状态
      subjectList: [], //科目列表
      subjectListShow: false,
      assistItemList: { id: 0, kemu: [] },
      superSearchVal: {
        assistItemList: { type: '', list: '' },
        assistItem: '',
        sum1: '',
        sum2: '',
        date1: '',
        date2: '',
        PDate1: '',
        PDate2: '',
        keyword: { KName: '', KCode: '' },
        placeholder: '选择辅助项',
        nodatatext: '',
        show: true
      },
      monthDays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      timeValue: '',
      voucherDataList: { bool: false, data: { Mst: '', Attachements: [] } },
      voucherList: [],
      highGradeCss: false,
      pagesize: 100,
      pageindex: 1,
      total: 0,
      allReset: '',
      resetShow: false,
      voucherMask: false,
      voucherDisabled: true,
      routerQuery: false,//路由是否传值************
      fileVisible: false,
      filelist: [], //文件上传的内容************
      fileErrMsg: {
        IngoreMsg: [],
        ErrMsg: [],
        AddMsg: []
      },
      fileSuccessMsg: '',
      saasMessage: {
        visible: false,  //消息弹出框*******
        message: '', //消息主体内容**************
        delay: 0
      },
      confirm: {
        message: '',
        btn1: '',
        btn2: '',
        visible: false
      },
      listAll: false,  //列表全选
      listInverse: false, //列表反xuan
      printCss: false,   //凭证打印显示***********
      printData: [],//打印数据
      tableData: [],   //打印的表格数据
      numResetShow: false,  //凭证重排窗口
      vouSubjectlist: [],//传递给voucher组件的科目
      modelFileUrl: '',//导入模板地址
      downFileUrl: '',//导出凭证地址
      exportShow: false,//模板导出显示
      modelExportDate: '',
      exportDate: [],//导出日期
      pushVoucherShow: false,//凭证插入弹窗
      pushYear: '',
      pushMonth: 1,
      pushMsgShow: false,//插入confirm
      pushOldPNo: '',
      pushNewPNo: ''
    }
  },
  provide () {
    return { 'checkedDate': this.checkedDate }
  },
  methods: {
    //操作导航******************
    handle (str) {
      var item = JSON.parse(JSON.stringify(this.chooseItem));
      switch (str) {
        case 'add':  //新增页面
          this.$router.push({ name: 'voucherAdd', params: { reset: 'reset' } });
          return;
        case 'update'://修改**********
          if (item.length != 1) {
            this.saasMessage = {
              message: "请选择且只选择一个凭证!",
              delay: 3000,
              visible: true
            };
            return;
          }
          if (!(item[0].PMonth >= this.checkedTime && item[0].Uyear == this.checkedYear || item[0].Uyear > this.checkedYear)) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该月已结账,无法修改!'
            }
            return;
          }
          if (item[0].Verify) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该凭证已审核,无法修改!'
            }
            return;
          }
          this.getBalanceBool = true;
          this.voucherDataList.data.Mst = JSON.parse(JSON.stringify(item[0]));

          this.voucherMaskShow('update');
          this.voucherDataList.bool = true;
          break;
        case 'audit'://审核**********  
          if (item.length <= 0) {
            this.saasMessage = {
              message: "请至少选择一个凭证!",
              delay: 3000,
              visible: true
            };
            return;
          }
          for (var au of item) {
            if (!(au.PMonth >= this.checkedTime && au.Uyear >= this.checkedYear)) {
              this.saasMessage = {
                visible: true,

                message: '存在已结账凭证,无法审核!'
              }
              return;
            }
            if (au.Verify) {
              this.confirm = {
                btn1: '继续',
                btn2: '取消',
                message: '存在已审核凭证,是否继续!',
                type: 'audit',
                visible: true
              }
              return;
            }
          }
          var PhIds = [];
          for (var id of item) {
            PhIds.push(id.PhId);
          }
          this.audit(true, PhIds);
          break;
        case 'unaudit'://反审核************
          if (item.length <= 0) {
            this.saasMessage = {
              message: "请至少选择一个凭证!",
              delay: 3000,
              visible: true
            };
            return;
          }
          for (var au of item) {
            if (!(au.PMonth >= this.checkedTime && au.Uyear >= this.checkedYear)) {
              this.saasMessage = {
                visible: true,
                message: '存在已结账凭证,无法反审核!'
              }
              return;
            }
            if (!au.Verify) {
              this.confirm = {
                btn1: '继续',
                btn2: '取消',
                message: '存在未审核凭证,是否继续!',
                type: 'unaudit',
                visible: true
              }
              return;
            }
          }
          var PhIds = [];
          for (var id of item) {
            PhIds.push(id.PhId);
          }
          this.audit(false, PhIds);
          break;
        case 'delete':
          if (item.length <= 0) {
            this.saasMessage = {
              message: "请至少选择一个凭证!",
              visible: true
            };
            return;
          }
          for (var au of item) {
            if (!(au.PMonth >= this.checkedTime && au.Uyear >= this.checkedYear)) {
              this.saasMessage = {
                visible: true,
                message: '存在已结账凭证,无法删除!'
              }
              return;
            }
            if (au.Verify) {
              this.saasMessage = {
                visible: true,
                message: '存在已审核凭证,无法删除!'
              }
              return;
            }
          }
          this.confirm = {
            visible: true,
            message: '此操作将永久删除凭证,是否继续!',
            type: 'delete'
          }
          break;
        case 'reset':
          // this.confirm={
          //     message:'凭证号重排过程中不允许取消、暂停操作。确定重排？',
          //     type:'reset',
          //     visible:true
          // }
          this.numResetShow = true;
          // this.confirm={
          //     message:'请选择手动重排还是自动重排!',
          //     visible:true,
          //     btn1:'手动重排',
          //     btn2:'自动重排',
          //     type:'reset'
          // }
          break;
        case 'print':
          this.printVoucher();
          break;
        case 'copy':
          if (item.length != 1) {
            this.saasMessage = {
              message: "请选择且只选择一个凭证!",
              delay: 3000,
              visible: true
            };
            return;
          }
          this.voucherDataList.data.Mst = JSON.parse(JSON.stringify(item[0]));
          this.clearPhId(this.voucherDataList.data.Mst);
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

          break;
        case 'cut':   //剪切**************
          if (item.length != 1) {
            this.saasMessage = {
              message: "请选择且只选择一个凭证!",
              delay: 3000,
              visible: true
            };
            return;
          }
          if (!(item[0].PMonth >= this.checkedTime && item[0].Uyear == this.checkedYear || item[0].Uyear > this.checkedYear)) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该月已结账,无法修改!'
            }
            return;
          }
          if (item[0].Verify) {
            this.saasMessage = {
              visible: true,
              delay: 3000,
              message: '该凭证已审核,无法修改!'
            }
            return;
          }
          this.voucherDataList.data.Mst = JSON.parse(JSON.stringify(item[0]));
          this.voucherMaskShow('cut');
          this.disabled = true;
          this.disabled2 = false;
          this.voucherDataList.bool = true;
          break;
        case 'chongh':  //冲红**************
          if (item.length != 1) {
            this.saasMessage = {
              message: "请选择且只选择一个凭证!",
              delay: 3000,
              visible: true
            };
            return;
          }
          // if(!(item[0].PMonth>=this.checkedTime&&item[0].Uyear>=this.checkedYear)){
          //     this.saasMessage={
          //         visible:true,
          //         message:'该月已结账,无法修改!'
          //     }
          //     return;
          // }
          if (!item[0].Verify) {
            this.saasMessage = {
              visible: true,
              message: '该凭证未审核,不支持冲红操作!'
            }
            return;
          }
          if (item[0].WriteOff_PhIds && item[0].WriteOff_PhIds.length > 0) {
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
          this.disabled = true;
          this.disabled2 = false;
          this.voucherDataList.data.Mst = JSON.parse(JSON.stringify(item[0]));
          this.voucherDataList.data.Mst.Verify = 0;
          this.chongh();
          this.voucherMaskShow('chongh');

          this.voucherDataList.bool = true;
          break;
        case 'push': //插入************
          this.pushYear = this.sideDate.slice(0, 4);
          this.pushMonth = this.sideDate.split('-')[1]
          this.pushVoucherShow = true;
          this.pushMsgShow = false;
          this.pushOldPNo = '';
          this.pushNewPNo = ''
          break;
        case 'upload': //导入************
          this.testFile();
          break;
        // case 'modelExport': //模板格式
        //   this.modelExport();
        //   break;
        case 'fresh':  //刷新**************
          //this.fresh=false;
          this.sum1 = '';
          this.sum2 = '';
          this.searchVal = '';
          this.superSearchVal = {
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
            this.superSearchVal.date2 = this.superSearchVal.date1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month));
          this.superSearchVal.PDate1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-01';
          // setTimeout(() => {
          //    this.fresh=true; 
          // }, 10);
          this.getvoucherList();
          break;
      }
    },
    //确认框btn1方法**********
    confirmOk (type, data) {
      this.confirm.visible = false;
      var item = JSON.parse(JSON.stringify(this.chooseItem));
      switch (type) {

        case 'audit':
          var PhIds = [];
          for (var id of item) {
            PhIds.push(id.PhId);
          }
          this.audit(true, PhIds);
          break;
        case 'unaudit':
          var PhIds = [];
          for (var id of item) {
            PhIds.push(id.PhId);
          }
          this.audit(false, PhIds);
          break;
        case 'delete':
          var PhIds = [];
          for (var id of item) {
            PhIds.push(id.PhId);
          }
          var data = {
            uid: this.uid,
            orgid: this.orgid,
            infoData: PhIds
          }

          this.delete(data);
          break;
        case 'gengZ':
          var vm = this;
          this.disabled = false;
          this.disabled2 = true;
          vm.voucherMask = 'gengz';
          vm.voucherDataList.bool = true;
          //console.log(vm.voucherDataList)
          vm.voucherDataList.data.Mst.PDate = "";
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

          break;
        case 'balance':
          this.keepVoucher(data);
          break;
      }
    },
    //确认框btn2方法**********
    confirmNo (type) {
      this.confirm.visible = false;
      switch (type) {
        case 'gengZ':
          this.voucherMask = false;
          this.getvoucherList();
          break;
      }
    },
    //反结账完成
    finishUncheck () {
      // this.handle('fresh');
      this.$refs.sideDate.getChecked();
      this.checkDate = '';
    },
    //接收下月账传值******************
    nextMonthHandle (data) {
      this.checkDate = '';
      // this.handle('fresh');
      this.$refs.sideDate.getChecked();
    },
    //插入的凭证号确认
    pushMsg () {
      let reg = /[0-9]{4}/;

      if (reg.test(this.pushOldPNo) && reg.test(this.pushNewPNo)) {
        this.pushMsgShow = true;
      } else {
        this.$msgBox.error('请输入正确的4位凭证号!')
      }

    },
    pushVoucherConfirm () {
      let vm = this
      let data = {
        orgid: this.orgid,
        Year: this.pushYear,
        Month: this.pushMonth,
        HPNo: this.pushNewPNo,
        QPNo: this.pushOldPNo
      }
      pushVoucher(vm, data).then(res => {
        if (res.Status == 'success') {
          this.$msgBox.show({            content: res.Msg, fn: () => {
              vm.pushVoucherShow = false;
              vm.getvoucherList()
            }          })
        } else {
          this.$msgBox.error(res.Msg)
        }
      }).catch(err => {
        console.log(err)
        this.$msgBox.error(err)
      })
    },
    //模板格式导出
    modelExport (val) {
      if (this.chooseItem.length > 0) {
        let phids = [];
        this.chooseItem.map(phid => {
          phids.push(phid.PhId)
        })
        let data = {
          uid: this.uid,
          orgid: this.orgid,
          export2excel: val,
          infoData: phids
        }
        this.modelExportUrl(modelExportByPhid, data)
      } else {
        this.modelExportDate = val;
        this.exportShow = true;
        let y = this.sideDate.split('-')[0]
        let m = this.sideDate.split('-')[1]
        this.exportDate = [y + '-' + (m > 9 ? m : ('0' + m)) + '-01', y + '-' + (m > 9 ? m : ('0' + m)) + '-' + this.monthDays[m - 1]];
      }

    },
    //导出时间选择完成
    modelDateConfirm () {
      let data = {
        uid: this.uid,
        orgid: this.orgid,
        pageindex: this.pageindex - 1,
        pagesize: 0,
        export2excel: this.modelExportDate,
        sort: ['PType', 'PNo ASC', 'PDate ASC'],
        // itemValuePhid:649181122000008,
        queryfilter: { "PDate*date*ge*1": this.exportDate[0], "PDate*date*le*1": this.exportDate[1] }
      }
      this.modelExportUrl(modelExportByDate, data)
    },
    //获取模板导出地址
    modelExportUrl (fn, data) {
      let vm = this;
      const loading = this.$loading();
      fn(vm, data).then(res => {
        loading.close();
        if (res.Status == 'error') {
          this.saasMessage = {
            message: res.Msg,
            visible: true
          }
          return;
        }
        this.modelExportDate = ''
        this.exportShow = false;
        let base = httpConfig.getAxiosBaseConfig();
        vm.downFileUrl = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
        window.open(vm.downFileUrl, "_blank")
      }, err => {
        // console.log(err);
        loading.close();
      })
        .catch(err => {
          console.log(err)
          loading.close(); this.$message({ showClose: true, message: '获取导出文件地址失败了!', type: "error" });        })

    },

    //重排返回的数据
    numResetMsg (msg) {
      this.numResetShow = false;
      this.saasMessage = {
        message: msg,
        visible: true
      }
      this.getvoucherList();
    },
    //高级搜索显示隐藏****************
    highGradeToggle (bool) {
      this.verified = 0;
      if (bool == 'reset') {
        this.superSearchValPhId = 0;
        this.assistItemList = { id: 0, kemu: [] };
        this.superSearchVal.sum1 = '';
        this.superSearchVal.sum2 = '';
        this.superSearchVal.PDate1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-01';
        if (this.month == 2 && (this.year % 4 == 0 && this.year % 100 != 0 || this.year % 400 == 0)) {
          this.superSearchVal.PDate2 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-' + '29';
        } else {
          this.superSearchVal.PDate2 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-' + this.monthDays[this.month - 1];
        }
        this.timeValue = [this.superSearchVal.PDate1, this.superSearchVal.PDate2];
        this.superSearchVal.keyword = { KName: '', KCode: '' };
      } else if (bool) {
        this.highGradeCss = bool;
        this.subjectListShow = false;
        if (!this.superSearchVal.assistItemList.type) {
          this.getAssist();
        }
        if (this.subjectList.length <= 0) {
          this.getSubjectList();
        }
      } else {
        this.highGradeCss = bool;
        this.superSearchValPhId = 0;
        this.assistItemList = { id: 0, kemu: [] };
        this.superSearchVal.sum1 = '';
        this.superSearchVal.sum2 = '';
        this.superSearchVal.PDate1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-01';
        if (this.month == 2 && (this.year % 4 == 0 && this.year % 100 != 0 || this.year % 400 == 0)) {
          this.superSearchVal.PDate2 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-' + '29';
        } else {
          this.superSearchVal.PDate2 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-' + this.monthDays[this.month - 1];
        }
        this.timeValue = [this.superSearchVal.PDate1, this.superSearchVal.PDate2];
        this.superSearchVal.keyword = { KName: '', KCode: '' };
      }

    },
    //
    subjectSearchShow () {
      this.subjectListShow = !this.subjectListShow;
    },
    //获取高级搜索的科目列表
    getSubjectList () {
      var data = {
        orgid: this.orgid,
        Ryear: this.sideDate.slice(0, 4)
      }
      this.$axios.get('/PSubject/GetPSubjectListByOrgId', { params: data })
        .then(res => {
          if (res.Status == 'error') {
            this.saasMessage = {
              delay: 4000,
              message: res.Msg,
              visible: true
            }
          }
          this.subjectList = res;
        }, err => {
          // console.log(err);

        })
        .catch(err => { this.$message({ showClose: true, message: '获取科目列表出错了!', type: "error" }); })
    },
    //科目选择传值
    subjectData (data) {
      this.subjectListShow = false;
      this.superSearchVal.keyword = { KName: data.data.KName, KCode: data.data.KCode };

    },
    //清除选择的科目
    clearSubject (superSearchVal) {
      superSearchVal.keyword = { KName: '', KCode: '' };
    },
    //会计期年份上下切换******
    nextYear (bool) {
      console.log(2222)
      var year = this.year;
      if (bool) {
        this.year = year >= this.sideDate.split('-')[0] ? year : parseInt(year) + 1;
      } else {
        this.year = year <= 2000 ? year : --year;
      }
    },
    // //获取摘要模板
    getAbstract () {
      this.$axios.get('/PAbstractTem/GetAbstractTem')
        .then(res => {
          if (res.Status == 'success') {
            this.AbstractList = res.Data;
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
    //凭证详情***************************
    voucherDel (item, index) {
      this.$router.push({ name: 'voucherAdd', params: { list: item, index: index, voucherList: this.voucherList } });
    },
    //凭证选择  单选**********************
    // choose(item){
    //     if(this.chooseItem.PhId==item.PhId){
    //        this.chooseItem=''; 
    //     }else{
    //         this.chooseItem=item;
    //     }
    // },
    //ul上的点击事件,和change顺序相反了
    chooseClick (item, index, $event) {
      if ($event.target.className == "el-checkbox__inner" || $event.target.className == "el-checkbox__original") {
        return;
      } else {
        item.checked = !item.checked;
        this.$forceUpdate();
        this.choose(item, index);
        var val;
        val = this.voucherList.every((val, index, arr) => {
          return val.checked == true
        })
        if (val) {
          this.listAll = true;
        } else {
          this.listAll = false;
        }
      }
    },
    //多选************* checkbox  @change事件
    choose (item, index, $event) {
      var val;
      if (!item.checked) {
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
      // this.$forceUpdate();
      val = this.voucherList.every((val, index, arr) => {
        return val.checked == true
      })
      if (val) {
        this.listAll = true;
      } else {
        this.listAll = false;
      }

    },
    //[反]审核*****************
    audit (bool, PhId) {
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        uname: this.uname,
        infoData: PhId
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
                message: '审核成功!'
              };
            } else {
              this.saasMessage = {
                visible: true,
                message: '反审核成功!'
              };
            }
            this.getvoucherList();
          } else {
            if (bool) {
              this.saasMessage = {
                visible: true,
                message: '审核失败!'
              };
            } else {
              this.saasMessage = {
                visible: true,
                message: '反审核失败!'
              };
            }
          }
        }, err => {

          // console.log(err);
          loading.close();
        })
        .catch(err => { this.$message({ showClose: true, message: '审核出错了!', type: "error" }), loading.close(); })
    },
    //单个凭证删除*****************
    singleDelete (data) {
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
    //删除***********************
    delete (data) {
      const loading = this.$loading();
      this.$axios.post('PVoucherMst/PostDeleteBatch', data)
        .then(res => {
          loading.close();
          if (res.Status == 'success') {
            this.getvoucherList();
            if (this.voucherMask == 'cut') {
              this.saasMessage = {
                visible: true,
                delay: 4000,
                message: '剪切成功!'
              }
              this.voucherMask = false;
            } else {
              this.saasMessage = {
                visible: true,
                delay: 4000,
                message: res.Msg
              };
            }
          } else {
            this.saasMessage = {
              visible: true,
              delay: 4000,
              message: res.Msg
            };
          }
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => { this.$message({ showClose: true, message: err, type: "error" }), loading.close(); })
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
    // printContent(e){

    //     this.$print(this.$refs.printList) // 使用
    // },
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
    //打印数据转换**************
    printDataTurn (vm, data) {
      // Correct_PhIds: (...)
      // Creator: (...)
      // CreatorName: (...)
      // CurOrgId: (...)
      // DealWithPNo: (...)
      // DeleteMark: (...)
      // Description: (...)
      // Dtls: (...)
      // Editor: (...)
      // EditorName: (...)
      // EnabledMark: (...)
      // ExcelLineNo: (...)
      // NgInsertDt: (...)
      // NgRecordVer: (...)
      // NgUpdateDt: (...)
      // OrgCode: (...)
      // OrgId: (...)
      // PAccper: (...)
      // PAttachment: (...)
      // PAuditor: (...)
      // PAuditorName: (...)
      // PCashier: (...)
      // PDate: (...)
      // PFinancePerson: (...)
      // PKeepingPerson: (...)
      // PMakePerson: (...)
      // PMonth: (...)
      // PNo: (...)
      // PSource: (...)
      // PType: (...)
      // PersistentState: (...)
      // PhId: (...)
      // PhidTransaction: (...)
      // Uyear: (...)
      // Verify: (...)
      // WriteOff_PhIds: (...)
      var mst = {
        voucherTitle: "记账凭证", //记账凭证
        billNum: data.PAttachment, //附件数
        orgName: vm.orgname, //核算单位

        voucherNum: '记' + '-' + data.PNo, //凭证号：记-0001
        lotal: 0, //合计
        supervisor: data.PKeepingPerson, //记账
        auditor: data.PAuditorName, //审核
        cashier: data.PCashier, //出纳
        producer: data.PMakePerson, //制单
        chager: data.PFinancePerson //财务主管
      };
      if (data.PDate)
        mst.billdate = data.PDate.split('T')[0];//日期

      var list = [
        //{ abstract: "代理收入",  subject: "112200050003 应收账款_3_宁波得志",  JSum: '5071.00', DSum: ''},
      ];
      for (var dtl of data.Dtls) {  //获取合计和list***
        mst.lotal = parseFloat(dtl.JSum) + parseFloat(mst.lotal);

        dtl.JSum = this.NUmTurn(dtl.JSum);
        dtl.DSum = this.NUmTurn(dtl.DSum);
        list.push({
          abstract: dtl.Abstract,
          subject: dtl.SubjectCode + ' ' + dtl.SubjectName,
          JSum: dtl.JSum ? dtl.JSum : '',
          DSum: dtl.DSum ? dtl.DSum : ''
        })
        if (dtl.DtlAccounts) {
          for (let d of dtl.DtlAccounts[0].NameValueDtls) {
            list[list.length - 1].subject = list[list.length - 1].subject + '.' + d.AuxiliaryName;
          }

        }
      }
      mst.lotal = this.NUmTurn(mst.lotal.toFixed(2));
      return {
        mst: mst,
        list: list
      };
    },
    //获取打印凭证数据***************
    printVoucher () {
      if (this.chooseItem.length <= 0) {
        this.saasMessage = {
          message: '请选择要打印的凭证!',
          visible: true,
        }
        return;
      }
      var vm = this;
      this.printData = [];
      this.printCss = true;
      var data = document.getElementsByClassName('printCon')[0].children[1].children[0].children[0];
      data.className = 'sys-page printDataCss';
      var list = JSON.parse(JSON.stringify(this.chooseItem));
      //拼凑数据供打印使用,凭证头，尾信息
      for (var vou of list) {
        this.printData.push(vm.printDataTurn(vm, vou));
      }
      vm.tableData = [];
      vm.voucher5tr(vm);

    },
    print () {
      var data = document.getElementsByClassName('printCon')[0].children[1].children[0].children[0];
      data.className = 'printDataCss';
      // console.log(data); 
      // var copyData=document.body.cloneNode(true);
      // copyData.innerHTML='';
      // copyData.appendChild(data);
      //console.log(copyData)
      this.$print(data);
      this.printCss = false;

    },
    //每5列切成一张凭证
    voucher5tr (vm) {
      let mst;
      let del;
      let tr5;
      let index;
      let page;
      let toltal;
      for (let data of this.printData) {
        tr5 = []; //[[{},{},{},{},{}]]一维变多维
        mst = data.mst;    //{}
        del = data.list;  //[]
        index = 0;
        page = 1;
        toltal = Math.ceil(del.length / 5);
        del.forEach((n, i) => {
          if (!tr5[index]) {
            tr5[index] = [];
          }
          tr5[index].push(n);
          if (tr5[index].length === 5) {
            index++;
          }
          if (index == 5) {
            page++
          }
        });

        //最后一个,不足5条数据的要补充完成
        let last = tr5[tr5.length - 1];
        for (let i = 0, l = 5 - last.length; i < l; i++) {
          last.push({
            abstract: "", //摘要
            subject: "", //科目是否有辅助核算，有辅助核算，拼接上辅助核算
            Jsum: "", //借方金额
            Dsum: "" //贷方金额
          })
        }
        //this.tableData的赋值
        tr5.forEach(n => {
          this.tableData.push({
            mst: mst,
            list: n,
            toltal: toltal,
            page: page
          })
        })
      }

    },
    //冲红***********************
    chongh () {
      var vm = this;
      //this.voucherData(); 
      var Mst = this.voucherDataList.data.Mst;
      if (Mst.WriteOff_PhIds && Mst.WriteOff_PhIds.length > 0) {
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
      this.voucherDataList.data.Mst.PDate = ""
      //this.resetVoucher();        




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
    //手动刷新voucher组件**************************
    resetVoucher () {
      var vm = this;
      this.voucherDataList.bool = false;

      function delay () {
        vm.voucherDataList.bool = true
      }
      setTimeout(delay, 5);
    },
    //保存凭证***********************
    keepVoucher (str) {
      var url = 'Add';
      var Vdata = this.voucherDataList.data;
      if (str == 'gengz') {
        this.clearPhId(Vdata.Mst);
        //Vdata.Mst.Dtls=Vdata.Mst.Dtls.splice(0,Vdata.Mst.Dtls.length/2);
      }
      if (Vdata.Mst.Dtls.length <= 0) {
        this.$message('请输入内容!')
        return;
      }
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

      if (!this.dataCheck()) {
        this.saasMessage = {
          visible: true,
          delay: 4000,
          message: '借贷不平衡,请查看!'
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
        this.$message('请输入凭证会计期!')
        return;
      }
      debugger
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
              console.log('保存')
              done();
            } else {
              done();
            }
          }
        }).then(() => {
          if ((Vdata.Mst.Uyear == this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime) || Vdata.Mst.Uyear > this.checkedYear) {

            var data = {
              uid: this.uid,
              Ryear: '',
              Uname: '',
              orgid: this.orgid,
              orgcode: this.orgcode,
              infoData: Vdata
            }
            if (Vdata.Mst.PhId) {
              url = 'Update';

            }
            const loading = this.$loading();

            this.$axios.post('/PVoucherMst/Post' + url, data)
              .then(res => {
                loading.close();
                if (res.Status == 'success') {
                  this.saasMessage = {
                    visible: true,
                    delay: 3000,
                    message: res.Msg
                  };
                  //    if(str=='print'){
                  //        this.printContent();
                  //    }
                  this.voucherMask = false;
                  this.getvoucherList();
                } else {
                  this.saasMessage = {
                    visible: true,
                    delay: 3000,
                    message: res.Msg
                  }
                }
              }, err => {
                // console.log(err);
                loading.close();
              })
              .catch(err => {
                this.saasMessage = {
                  visible: true,
                  delay: 3000,
                  message: '保存出错了!'
                }
                loading.close()
              })
          } else {
            this.$msgBox.show('当前月份已结账,无法修改凭证!')
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        if ((Vdata.Mst.Uyear == this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime) || Vdata.Mst.Uyear > this.checkedYear) {

          var data = {
            uid: this.uid,
            Ryear: '',
            Uname: '',
            orgid: this.orgid,
            orgcode: this.orgcode,
            infoData: Vdata
          }
          if (Vdata.Mst.PhId) {
            url = 'Update';

          }
          const loading = this.$loading();

          this.$axios.post('/PVoucherMst/Post' + url, data)
            .then(res => {
              loading.close();
              if (res.Status == 'success') {
                this.saasMessage = {
                  visible: true,
                  delay: 3000,
                  message: res.Msg
                };
                //    if(str=='print'){
                //        this.printContent();
                //    }
                this.voucherMask = false;
                this.getvoucherList();
              } else {
                this.saasMessage = {
                  visible: true,
                  delay: 3000,
                  message: res.Msg
                }
              }
            }, err => {
              // console.log(err);
              loading.close();
            })
            .catch(err => {
              this.saasMessage = {
                visible: true,
                delay: 3000,
                message: '保存出错了!'
              }
              loading.close()
            })
        } else {
          this.$msgBox.show('当前月份已结账,无法修改凭证!')
        }
      }
    },
    ////获取凭证科目选择列表******************
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
          this.$forceUpdate();
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
          console.log(dtl)
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
      for (var dtl of data) {
        if (dtl.PersistentState != 3) {
          Jcount = parseFloat(Jcount) + parseFloat(dtl.JSum ? dtl.JSum : 0);
          Dcount = parseFloat(Dcount) + parseFloat(dtl.DSum ? dtl.DSum : 0);
        }

      }
      if (Jcount.toFixed(2) == Dcount.toFixed(2)) {
        return true;
      } else {
        return false;
      }
    },
    //复制剪切冲红******************************
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
              delay: 3000,
              message: '该凭证已审核,无法剪切!'
            }
            return;
          }
          var data1 = {
            uid: this.uid,
            orgid: this.orgid,
            id: id
          }
          this.cut(vm, data1);
        }
        else if (val == 'chongh') {
          var Vdata = JSON.parse(JSON.stringify(this.voucherDataList.data));
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
          // if(val=='chongh'){
          //     console.log(Vdata.Mst.Uyear,this.chooseItem)
          // }
          if ((Vdata.Mst.Uyear >= this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime)) {
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
            // this.voucherDataList.bool=false; 

            this.$axios.post('/PVoucherMst/PostAdd', data)
              .then(res => {
                loading.close();
                if (res.Status == 'success') {
                  vm.voucherMask = false;
                  this.confirm = {
                    visible: true,
                    message: '保存成功，是否生成【更正凭证】？',
                    type: 'gengZ'
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
                    delay: 3000,
                    message: res.Msg
                  };
                }

              }, err => {
                // console.log(err);
                loading.close();
              })
              .catch(err => {
                this.$message({ showClose: true, message: err, type: "error" });
                loading.close();
              })
          } else {
            this.$message('当前月份已结账,无法新增凭证!')
          }

        }
        else {
          //this.clearPhId(this.voucherDataList.data.Mst);
          if (val == 'copy') {
            this.voucherDataList.data.Mst.PMakePerson = this.uname;
            val = 'Add'
          }
          this.balanceType(val);
          //  this.keepVoucher(val);

          //this.voucherDataList.bool=false; 
          //this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}};    
        }
      } else {
        this.voucherMask = false;
        this.disabled = false;
        this.disabled2 = true;
      }
    },
    //剪切*****************
    cut (vm, data1) {
      var url = 'Add';
      var Vdata = vm.voucherDataList.data;
      if (Vdata.Mst.Dtls.length <= 0) {
        vm.$message('请输入内容!')
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
      vm.clearPhId(Vdata.Mst)
      if ((Vdata.Mst.Uyear >= this.checkedYear) && (Vdata.Mst.PMonth >= this.checkedTime)) {
        var data = {
          uid: vm.uid,
          orgid: vm.orgid,
          orgcode: vm.orgcode,
          infoData: vm.voucherDataList.data
        }
        const loading = this.$loading();
        vm.$axios.post('/PVoucherMst/Post' + url, data)
          .then(res => {
            loading.close();
            if (res.Status == 'success') {
              vm.saasMessage = {
                visible: true,
                delay: 3000,
                message: res.Msg
              };
              vm.disabled = false;
              vm.disabled2 = true;
              vm.singleDelete(data1);
            } else {
              vm.$message('保存失败,请重试!')
            }
          }, err => {
            // console.log(err);
            loading.close();
          })

          .catch(err => {
            //    console.log(err);
            loading.close()          })
      } else {
        vm.$message('当前月份已结账,无法修改凭证!')
      }

    },
    //接收voucher组件传值************
    voucherData () {
      this.voucherDataList.data = this.$refs.voucher.voucherData();
    },

    //搜索日期转换*************
    dateTurn (val) {
      var str;
      if (typeof (val) == 'object') {
        str = val.getMonth() + 1;
        val = val.getFullYear();
        val = val.toString() + '-' + (str > 9 ? str : ('0' + str))
      }
      return val;
    },
    //凭证列表***************高级搜索***********************
    getvoucherList (str) {
      if (str == 'search' || str == 'highSearch') {
        this.pageindex = 1;
      }
      let base = httpConfig.getAxiosBaseConfig();
      this.superSearchVal.date1 = this.dateTurn(this.superSearchVal.date1)
      this.superSearchVal.date2 = this.dateTurn(this.superSearchVal.date2)
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        pageindex: this.pageindex - 1,
        pagesize: this.pagesize,
        sum1: this.superSearchVal.sum1,
        sum2: this.superSearchVal.sum2,
        keyword: this.superSearchVal.keyword.KName,
        export2excel: str,
        sort: ['PType', 'PNo ASC', 'PDate ASC'],
        // itemValuePhid:649181122000008,
        itemValuePhid: this.superSearchVal.assistItem.PhId,
        queryfilter: { "PAccper*str*ge*1": this.superSearchVal.date1.replace('-', ''), "PAccper*str*le*1": this.superSearchVal.date2.replace('-', '') }
      }
      if (str == 'highSearch') {
        data.export2excel = '';
        if (typeof (this.timeValue[0]) == 'object') {
          var month;
          var date;
          for (var t in this.timeValue) {
            month = this.timeValue[t].getMonth() + 1;
            date = this.timeValue[t].getDate();
            this.timeValue[t] = this.timeValue[t].getFullYear() + '-' + (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);

          }
        }
        this.superSearchVal.PDate1 = this.timeValue[0].slice(0, 10);
        this.superSearchVal.PDate2 = this.timeValue[1].slice(0, 10);
        data.queryfilter = {
          "PDate*date*ge*1": this.superSearchVal.PDate1,
          "PDate*date*le*1": this.superSearchVal.PDate2,
          "PAccper*str*ge*1": this.superSearchVal.PDate1.slice(0, 7).replace('-', ''),
          "PAccper*str*le*1": this.superSearchVal.PDate2.slice(0, 7).replace('-', '')
        }
        if (this.verified == 1) {
          //未审核****
          data.queryfilter['Verify*byte*eq*1'] = 0;

        } else if (this.verified == 2) {
          //已审核****
          data.queryfilter['Verify*byte*eq*1'] = 1;
        }

      }
      if (str == 'search') {
        data.sum1 = this.sum1,
          data.sum2 = this.sum2,
          data.keyword = this.searchVal
      }
      const loading = this.$loading();
      this.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          loading.close();
          if (res.Status == 'success') {
            this.saasMessage = {
              message: res.Msg,
              delay: 4000,
              visible: true
            };
            this.voucherList = [];
            return;
          }
          // if(str=='yes'){
          //     this.modelFileUrl=base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;
          //     // let mywindow= window.open(base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename) ;
          //     // mywindow=null;
          //     return;
          // }
          if (res.Record.length <= 0) {
            this.voucherList = [];
            this.total = res.totalRows;
            //this.$message('无法找到凭证!')
          } else {
            this.voucherList = res.Record;
            this.total = res.totalRows;
            this.pagesize = res.size;
            this.pageindex = res.index + 1;
          }
          this.listInit(this.voucherList);
          this.listAll = false;
          this.chooseItem = [];
          this.$nextTick(this.toTop);
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => { loading.close(); this.$message({ showClose: true, message: '获取列表失败了!', type: "error" }); })
    },
    //滚动条置顶
    toTop () {
      var ulList = document.getElementsByClassName('listOver')[0];
      ulList.scrollTop = 0;
    },
    //初始化列表选中样式*********
    listInit (item) {
      for (var it of item) {
        it.checked = false;
      }
    },
    //获取time组件传参********************
    getSideDate (data) {
      this.checkedTime = data.checkedTime;
      this.checkedYear = data.checkedYear;

      this.checkedDate.checkedTime = this.checkedTime;
      this.checkedDate.checkedYear = this.checkedYear;

      this.sideDate = data.sideDate;
      this.year = this.sideDate.split('-')[0];
      this.month = this.sideDate.split('-')[1];
      this.superSearchVal.date2 = this.superSearchVal.date1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month));
      this.superSearchVal.PDate1 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-01';
      if (this.month == 2 && (this.year % 4 == 0 && this.year % 100 != 0 || this.year % 400 == 0)) {
        this.superSearchVal.PDate2 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-' + '29';
      } else {
        this.superSearchVal.PDate2 = this.year + '-' + (this.month > 9 ? this.month : ('0' + this.month)) + '-' + this.monthDays[this.month - 1];
      }
      this.timeValue = [this.superSearchVal.PDate1, this.superSearchVal.PDate2];
      if (this.$route.params.voucherList) {

      } else {
        this.getvoucherList();
      }
      this.getSubject();
      if (!this.modelFileUrl) {
        this.downloadModel();
      }


    },

    //  * 获取辅助项信息
    //  * query:查询参数
    //  *  */
    getData (query) {
      let data = {
        uid: this.uid,
        orgid: this.orgid,
        typeId: query,
        CodeOrName: ''
      };
      const loading = this.$loading();
      this.$axios.get('/PVoucherAuxiliaryType/GetAuxiliaryQueryList', { params: data })
        .then(res => {
          loading.close();
          if (res.Status === 'error') {
            this.$message.error(res.Msg);
            return
          }
          this.assistItemList.kemu = res.list;
          this.superSearchVal.show = true;

        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => {
          loading.close();
          this.$message({ showClose: true, message: "辅助项获取错误", type: "error" });
        })
    },
    //获取辅助项***************
    getAssist () {
      let data = {
        uid: this.uid,//this.uid获取到store中的uid************
        orgid: this.orgid,//this.orgid获取到store中的orgid************
        infoData: null
      };
      const loading = this.$loading();
      var vm = this;
      this.$axios.get('/PVoucherAuxiliaryType/GetVoucherAuxiliaryTypeList', { params: data })
        .then(res => {
          loading.close();
          if (res.Status === 'error') {
            this.$message.error(res.Msg);
            return
          }
          this.superSearchVal.assistItemList.type = res.type;
          //this.assistItemList.kemu=res.list;
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => {
          this.$message({ showClose: true, message: err, type: "error" }); loading.close();
        })
    },
    //获取searchSelect辅助项搜索值******************
    itemClick (childData) {
      this.superSearchVal.assistItem = childData.data;
      this.superSearchVal.show = false;
    },

    //导入凭证***********************
    testFile () {
      // this.$message('功能开发中!!')
      this.fileVisible = true;
      if (this.$refs.fileupload) {
        this.$refs.fileupload.clearFiles();
      }

      this.fileErrMsg = {
        IngoreMsg: [],
        ErrMsg: [],
        AddMsg: []
      }
      this.fileSuccessMsg = ''
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
      var param = {
        PhId: deleValue.phid,
        BTable: 'gcw3_voucher_mst',
        BUrlPath: deleValue.imgPath
      };
      this.$axios({
        url: '/PVoucherAttachment/PostDeleteFile',
        method: "post",
        data: param,
      }).then(res => {
        if (res.Status === "error") {
          this.$message({ showClose: true, message: res.Msg, type: 'error' });
          return;
        }
      }, err => {
        // console.log(err);

      }).catch(error => {
        this.$message({ showClose: true, message: '附件删除错误', type: 'error' });
      });
    },
    uploadfile (item) {
      //this.imglist.push(item);
      //console.log(this.filelist,item);
      this.filelist = item;
      if (item) {
        this.ExcelValidMsg(item);
      }
      //console.log(item,this.filelist)
    },
    //校验excel文件中凭证信息***********
    ExcelValidMsg (param) {
      var data = {
        fileName: param[0].BUrlPath,
        orgid: this.orgid,
        orgcode: this.orgcode,
        uyear: this.year,
        makePerson: this.uname,
        dealwithPNo: 0 //重复凭证字号处理方式: 0 禁止, 1 跳过, 2 覆盖
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('文件正在校验,大约需要5分钟....')
      axios.create(base).get('/PVoucherMst/GetImportVoucherListFromExcelValidMsg', { params: data, headers: new_header })
        .then(res => {
          loading.close();
          console.log(JSON.parse(res.data))
          let dataJ = JSON.parse(res.data);
          if (dataJ.Status == 'error') {
            this.$message({ showClose: true, message: dataJ.Msg, type: 'error' });
            if (dataJ.Data) {
              this.fileErrMsg = {
                ErrMsg: dataJ.Data.ErrMsg,
                IngoreMsg: dataJ.Data.IngoreMsg,
                AddMsg: dataJ.Data.AddMsg
              }
            } else {
              this.fileErrMsg = {
                ErrMsg: [dataJ.Msg],
                IngoreMsg: [],
                AddMsg: []
              }
            }

          } else {
            this.GetImportVoucherListFromExcel(data);
          }
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => {
          loading.close();
          this.$message({ showClose: true, message: err, type: 'error' });
        })
    },

    //忽略 或者 覆盖选项****************
    fileErrHandle (str) {
      if (this.fileErrMsg.ErrMsg.length > 0) {
        this.$msgBox.show('请先处理不可跳过的错误,并重新上传文件!')
        return;
      }
      if (this.fileErrMsg.AddMsg.length > 0 && str != 'add') {
        this.$msgBox.show('有基础数据错误,请查看!点击添加按钮可以自动添加并导入!')
        return;
      }
      //console.log(this.filelist)
      var data = {
        fileName: this.filelist[0].BUrlPath,
        orgid: this.orgid,
        orgcode: this.orgcode,
        makePerson: this.uname,
        uyear: this.year,
        dealwithPNo: 0 //重复凭证字号处理方式: 0 禁止, 1 跳过, 2 覆盖
      }
      if (str == 'add') {
        data.dealwithPNo = 3;
      } else if (str == 'cover') {
        data.dealwithPNo = 2;
      } else {
        data.dealwithPNo = 1;
      }
      this.GetImportVoucherListFromExcel(data);
    },
    //获取导出地址
    downvoucherList () {
      var vm = this;
      let base = httpConfig.getAxiosBaseConfig();
      this.superSearchVal.date1 = this.dateTurn(this.superSearchVal.date1)
      this.superSearchVal.date2 = this.dateTurn(this.superSearchVal.date2)
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        pageindex: this.pageindex - 1,
        pagesize: this.pagesize,
        sum1: this.superSearchVal.sum1,
        sum2: this.superSearchVal.sum2,
        keyword: this.superSearchVal.keyword.KName,
        export2excel: 'yes',
        sort: ['PType', 'PNo ASC', 'PDate ASC'],
        // itemValuePhid:649181122000008,
        itemValuePhid: this.superSearchVal.assistItem.PhId,
        queryfilter: { "PAccper*str*ge*1": this.superSearchVal.date1.replace('-', ''), "PAccper*str*le*1": this.superSearchVal.date2.replace('-', '') }
      }
      const loading = this.$loading();
      this.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          loading.close();
          if (res.Status == 'error') {
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
            return;
          }
          vm.downFileUrl = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
          window.open(vm.downFileUrl, "_blank")
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => {
          console.log(err)
          loading.close(); this.$message({ showClose: true, message: '获取导出文件地址失败了!', type: "error" });        })
    },
    //获取导入模板地址
    downloadModel () {
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      this.modelFileUrl = base.baseURL + "/File/GetExportFile?filePath=template&fileName=凭证导入模板.xls";
      // let myWindow= window.open(base.baseURL+"/File/GetExportFile?filePath=template&fileName=凭证导入模板.xls");
      // myWindow=null;
    },
    //excel文件导入**************
    GetImportVoucherListFromExcel (data) {
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      //let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('文件正在上传,大约需要5分钟....')
      axios.create(base).get('PVoucherMst/GetImportVoucherListFromExcel', { params: data, headers: new_header })
        .then(res => {
          loading.close();
          console.log(res)
          if (JSON.parse(res.data).Status == 'success') {
            this.saasMessage = {
              message: JSON.parse(res.data).Msg,
              delay: 4000,
              visible: true
            }

            this.fileErrMsg = {
              IngoreMsg: [],
              ErrMsg: [],
              AddMsg: []
            }
            this.fileSuccessMsg = JSON.parse(res.data).Msg;
            this.getvoucherList();
          } else {
            this.saasMessage = {
              message: JSON.parse(res.data).Msg,
              delay: 4000,
              visible: true
            }
          }
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => {
          loading.close();
          this.$message({ showClose: true, message: '文件导入失败了!', type: 'error' });
        })
    },
    // ...mapActions({
    //     uploadFile: 'uploadFile/Voucherupload'
    // }),
    //输入框限定***
    clearNoNum (event) {

      var obj = event.target;
      console.log(event, obj)
      obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
      obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
      if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value = parseFloat(obj.value);
      }
    },
  },
  computed: {
    // listAll:{
    //     get(val){
    //         val=this.voucherList.every((val,index,arr)=>{
    //             return val.checked==true
    //         })
    //         console.log(val)
    //     },
    //     set(){

    //     }
    // },

    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgName: state => state.user.orgName,
      dbname: state => state.user.dbname,
      orgcode: state => state.user.orgcode,
      Roleauthorize: state => state.user.Roleauthorize,//按钮权限
      cachePage: state => state.tagNav.cachePage  //是否利用路由缓存
    }),
    picUrl: function () {
      return httpConfig.baseurl;
    },
  },
  watch: {
    superSearchValPhId (val) {
      if (val == 0) {
        this.superSearchVal.show = false;
        this.assistItemList.kemu = [];
        this.superSearchVal.assistItem = '';
      } else {
        this.superSearchVal.show = false;
        this.superSearchVal.assistItem = ''
        this.getData(val);
      }

    },
    listAll (bool) {  //全选
      if (bool) {
        for (var vou of this.voucherList) {
          vou.checked = bool;
        }
        this.chooseItem = JSON.parse(JSON.stringify(this.voucherList));
      } else if (this.voucherList.every((val, index, arr) => {
        return val.checked == true;
      })) {
        this.chooseItem = [];
        for (var vou of this.voucherList) {
          vou.checked = bool;
        }
      }


    },

    // listInverse(bool){  //反选

    //     var newList=[];
    //     for(var vou of this.voucherList){
    //         vou.checked=!vou.checked;
    //         if(vou.checked){
    //             newList.push(vou);
    //         }  
    //     }
    //     this.chooseItem=newList; 
    //     // if(newList.length==this.voucherList.length&&!this.listAll){
    //     //     this.chooseItem=[];
    //     //     for(var vou of this.voucherList){
    //     //         vou.checked=false;  
    //     //     }
    //     // }

    // }
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
  components: {
    fileUpload,
    searchSelect,
    sideTime,
    voucher,
    printTem,
    subList,
    numReset,
    quickCheck
  }
}

</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  overflow: hidden;
  height: 100%;
  // position:relative;
}
.searcherCon {
  float: right;
  width: 40%;
  min-width: 170px;
  position: relative;
  .highGradeCss {
    position: absolute;
    width: 400px !important;
    background: #fff;
    z-index: 9;
    top: 40px;
    right: 0px;
    border: 1px solid #ccc;
    box-shadow: 0 1px 8px #b3acac;
    border-radius: 7px 7px 0 0;
    i.codeSearchClose {
      float: right;
      //position:absolute;
      position: relative;
      top: 5px;
      right: 5px;
      background: url("../../assets/icon/close.svg");
      background-size: cover;
      width: 20px;
      height: 20px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
    > div {
      width: 100%;
      &:first-of-type {
        height: 33px;
        background: #00b7ee;
        border-radius: 7px 7px 0 0;
        color: #fff;
        padding: 0 10px;
      }
      &:last-of-type {
        //gaile***************************
        // border-top:1px solid #ccc;
        height: 40px;
        width: 100%;
        padding: 0 10px;
        > div {
          width: 160px;
          height: 100%;
          margin: 0 auto;
          > div {
            float: left;
            width: 70px;
            margin-top: 5px;

            &:last-of-type {
              margin-left: 20px;
            }
          }
        }
      }
      i.cancle {
        float: right;
        margin-top: 6px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        position: relative;
        cursor: pointer;
        box-shadow: 0 2px 1px 1px #999999c4;
        &::after,
        &::before {
          content: "";
          position: absolute;
          width: 15px;
          height: 1px;
          background: #3e8cbc;
          top: 10px;
          left: 3px;
        }
        &::after {
          transform: rotate(45deg);
        }
        &::before {
          transform: rotate(-45deg);
        }
      }
    }
    > ul {
      input,
      select {
        background: #fff;
      }
      .inputContainer {
        border: 0;
        > input {
          border: 0;
        }
      }
      background: #fff;
      padding: 5px 10px;
      li {
        height: 30px;

        margin-bottom: 5px;
        &:first-of-type {
          > div:nth-of-type(2) {
            height: 100%;
            position: relative;
            background: #fff;
            > div {
              border: 1px solid #dcdfe6;
              position: relative;
              width: 100%;
              height: 100%;
              border-radius: 3px;
              > span {
                padding-left: 10px;
              }
              > div {
                top: 100%;
              }
            }
          }
        }
        > div {
          float: left;
          padding: 0;
        }
        > div:first-of-type {
          padding: 0 5px;
          text-align: right;
          width: 20%;
        }
        > div:last-of-type {
          > div {
            float: left;
          }
          border-radius: 3px;
          width: 78%;
          .el-date-editor.el-input {
            width: 90px;
          }
        }
        &:nth-of-type(2) {
          .selectContainer {
            float: left;
            width: 43%;
            height: 30px;
            margin-right: 1%;
            background: #fff;
          }
          > div:nth-of-type(2) > div:nth-of-type(2) {
            float: right;
            border-radius: 3px;
          }
        }

        &:nth-of-type(4) > div:last-of-type {
          > div {
            width: 45%;
            > div {
              width: 100%;
            }
          }
          > span {
            float: left;
            width: 10%;
            text-align: center;
          }
        }
        &:nth-of-type(5) > div:last-of-type {
          width: 78%;
          > div {
            width: 100%;
            height: 32px;
            padding-top: 0;
            padding-bottom: 0;
            margin: 0;
          }
        }
      }
    }
  }
}
.searcherCon .highGradeCss > ul li > div:last-of-type .el-date-editor.el-input {
  width: 100%;
}
.searcherValue {
  border: 1px solid #ddd;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  padding-left: 10px;
}
.voucherList .voucherSelect > div.searcherCon > div.searcherValue {
  width: 150px;
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
  position: relative;
  min-width: 920px;
  height: 100%;
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
    > a {
      float: right;

      &.btn {
        color: #fff;
        &:hover {
          color: #00b7ee;
        }
      }
      border-radius: 3px;
      height: 32px;
      line-height: 32px;
      margin-left: 10px;
      cursor: pointer;
      width: 70px;

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

      min-width: 307px;
    }
    > div.searcherCon {
      .searcherValue {
        border-radius: 4px 0 0 4px;
      }
      > div {
        float: right;
        width: auto;
        margin: 0;
        font-size: 14px;
        &:first-of-type {
          margin-left: 10px;
          cursor: pointer;
          background: #00b7ee;
          height: 32px;
          line-height: 32px;
          width: 70px;
          color: #fff;
          text-align: center;
          border-radius: 3px;
        }
        &:nth-of-type(2) {
          width: 70px;
        }
        // &:nth-of-type(3){
        //     //min-width: 300px;
        // }
      }
    }
  }
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
            font-size: 18px;
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
          font-size: 18px;
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
        font-size: 18px;
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
.voucherMask {
  position: fixed;
  position: -ms-page;
  z-index: 99;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden auto;
  background: rgba(0, 0, 0, 0.5);
  .voucherContainer {
    background: #fff;
    width: 80%;
    position: absolute;
    top: 100px;
    left: 10%;
    padding: 10px;
    > div:first-of-type {
      padding: 5px 10px;
      > span {
        float: right;
        margin-left: 20px;
      }
    }
  }
}
.title {
  border-bottom: 1px solid #ccc;
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
.voucherMaskActive {
  position: absolute;
  bottom: 0;
  z-index: -1;
}
.listContainer {
  margin: 10px 0;
  position: absolute;
  z-index: 0;
  overflow: hidden;
  left: 20px;
  right: 50px;
  top: 0px;
  bottom: 0px;
  padding-bottom: 20px;
  .listOver {
    //height:100%;

    overflow-y: scroll;
    position: absolute;
    left: 0;
    right: 0;
    top: 90px;
    bottom: 0;
  }
  .listTitleCon {
    position: absolute;
    left: 0;
    right: 17px;
    top: 50px;
    height: 40px;
  }
}
.listContainer > .listTitleCon > ul.listTitle {
  > li {
    border: 1px solid #bcbdbd;
    border-width: 1px 1px 1px 0;
    &:last-of-type {
      border-right: 1px solid #bcbdbd;
    }
  }
}
.listContainer ul.listTitle {
  height: 40px;
  width: 95%;
  background: #d3e8f9;
  color: #333;
  position: absolute;
  top: 0px;
  left: 0;
  margin-left: 5%;
}
.listContainer ul.listTitle li {
  float: left;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.listContainer ul.listTitle li:first-of-type {
  width: 32%;
}
.listContainer ul.listTitle li:nth-of-type(2) {
  width: 28%;
}
.listContainer ul.listTitle li:nth-of-type(3) {
  width: 20%;
}
.listContainer ul.listTitle li:nth-of-type(4) {
  width: 20%;
}
// .listContainer ul.listTitle li:nth-of-type(5){
//     width:20%;
// }
ul.listContent {
  border: 0px solid #bcbdbd;
  border-top: 1px solid #bcbdbd;
  margin-bottom: 20px;
  width: 100%;
  background: #fff;
  &:first-of-type {
    border-top: 0;
  }
}
ul.listContent.choosed > li > ul.listIndex {
  background: #00b7ee;
  color: #fff;
}

ul.listContent > li {
  width: 100%;
  height: 100%;

  overflow: hidden;

  position: relative;
}
ul.listContent > li > ul.listIndex {
  margin: 0;
  border: 1px solid #bcbdbd;
  border-top: 0;
  height: 100%;
  width: 5%;
  font-size: 18px;
  top: 0;
  left: 0;
  position: absolute;
}
ul.listContent > li > ul.listIndex > li {
  width: 50%;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
  padding: 0;
  justify-content: center;
}
ul.listContent > li > ul.listIndex > li:first-of-type {
  border: 0;
  width: 50%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border-right: 1px solid #bcbdbd;
  padding: 0;
}
ul.listContent > li > ul {
  height: 100%;
  width: 95%;
  margin-left: 5%;
}
ul.listContent > li > ul > li {
  height: 30px;
  line-height: 30px;
}
ul.listContent > li > ul > li:first-of-type {
  padding: 0 10px;
  border: 1px solid #bcbdbd;
  border-top: 0;
  border-left: 0;
  overflow: hidden;
}
ul.listContent > li > ul > li:first-of-type > span {
  margin-right: 50px;
}
ul.listContent > li > ul > li > div {
  float: left;
  height: 100%;
  text-align: left;
  padding: 0 10px;
  border: 1px solid #bcbdbd;
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
  border: 1px solid #bcbdbd;
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
  //  padding-left:10%;
}
.searchSelectCon {
  position: relative;
  float: left;
  width: 56%;
  height: 30px;
  line-height: 25px;
  background: #fff;
  border: 1px solid #ddd;
  padding: 3px;
}
.voucherDisabledCon {
  position: relative;
  .voucherDisabled {
    position: absolute;
    background: none;
    z-index: 99;
    width: 100%;
    height: 100%;
    top: 45px;
    bottom: 0;
    > div {
      position: relative;
      z-index: 89;
    }
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
.wrapKemu {
  height: 30px;
  font-size: 18px;
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
.footInfo {
  position: fixed;
  position: -ms-page;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 30px 0 10px 0;
  height: 70px;
  line-height: 70px;
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
.uploaderTitle {
  position: relative;
  width: 40px;
  height: 30px;
  cursor: pointer;
  background: url("../../assets/icon/f90c871a-13a3-4900-9b6f-ff9edc5c98c5.svg")
    no-repeat;
  background-size: 40px 30px;
}

.avatar-uploader {
  position: absolute;
  z-index: 1;
  right: 61px;
  top: -20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader .el-upload--text {
  width: 80px;
  height: 80px;
}

.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.orgform .el-form-item__label {
  background: #00b8ee;
}

.orgform .el-form-item {
  margin-bottom: 2px;
}
.more {
  height: 32px;
  overflow: hidden;
  position: absolute;
  font-size: 14px;
  //z-index: 5;
  width: 100%;
  margin: 0;
  opacity: 1;
  > ul {
    width: 100%;
    > li {
      width: 100%;
      background: #fff;
      color: #999;
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
.printCon {
  position: fixed;
  position: -ms-page;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: scroll;
  left: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  > .container {
    width: 980px;
    height: auto;
    padding: 0;
    margin: 40px auto 0;
    border: 0;
    overflow: visible;
    > div {
      background: #fff;
      width: 100%;
    }
    > .sys-page {
      padding: 0;
    }
  }
  > span {
    position: absolute;
    border: 1px solid #fff;
    background-size: cover;
    left: 55%;
    margin-top: 50px;
    cursor: pointer;
    &:first-of-type {
      left: 45%;
    }
  }
}

.fileCon {
  float: left;
  width: 360px;
  height: 120px;
  overflow-y: auto;
  border: 1px dotted #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-left: 65px;
  > .fileIngoreMsg {
    color: rgb(45, 142, 221);
  }
  > .fileErrMsg {
    color: rgb(255, 0, 0);
  }
}
.fileBtn {
  float: left;
  margin-left: 5px;
  > div {
    width: 70px;
    margin-bottom: 13px;
    display: block;
  }
}
.fileAddMsg {
  color: #f59d14;
}
.fileSuccessMsg {
  color: #6aca25;
}
.sys-page {
  overflow-y: auto;
}
.printDataCss,
.sys-page {
  text-align: center;
  .manageContent {
    display: inline-block;
    width: 980px;
    margin-top: 100px;
    padding-top: 150px;
    &:nth-of-type(2n + 1) {
      border: 0;
      padding: 20px;
      margin: 50px 0 0px 0;
    }
    &:nth-of-type(2n) {
      height: 750px;
    }
    &:nth-of-type(2n):before {
      display: inline-block;
      content: "";
    }
    height: 600px;
    font-size: 17px;

    .title {
      border-bottom: 0;
      font-size: 35px;
      text-align: center;
      padding-bottom: 20px;
      font-weight: 600;
    }
    .title div {
      font-size: 17px;
      text-align: right;
      font-weight: 100;
      position: relative;
      right: 10px;
      top: -20px;
    }
    .formData {
      margin-bottom: 5px;
      > ul:last-of-type {
        > li:first-of-type {
          width: 60%;
        }
        > li:nth-of-type(2) {
          width: 20%;
        }
        > li:nth-of-type(3) {
          width: 20%;
        }
      }
    }
    .formData > ul > li {
      border-right: 1px solid #aaa;
      height: 59px;
      line-height: 59px;
      text-align: center;
    }
    .formData > ul:first-child {
      font-size: 17px;
      border: 1px solid #aaa;
      border-width: 1px 0;
    }
    .formData > ul:first-child > li:last-of-type {
      border-right: 1px solid #aaa;
    }
    .formData > ul:first-child > li:first-of-type {
      border-left: 1px solid #aaa;
    }
    .formData > ul > li:nth-of-type(1) {
      width: 30%;
      padding: 0 2px;
    }
    .formData > ul > li:nth-of-type(2) {
      width: 30%;
      padding: 0 2px;
    }
    .formData > ul > li:nth-of-type(3),
    .formData > ul > li:nth-of-type(4) {
      width: 20%;
      padding: 0 2px;
    }

    .formDataItems {
      border-bottom: 1px solid #aaa;
      background: white;
    }
    .formDataItemsA {
      border-bottom: 0;
    }
    .formDataItemsB > li {
      border-bottom: 0;
      text-align: left;
    }
    .formData > ul.formDataItems > li {
      border-right: 1px solid #aaa;
      border-left: 0;
      border-bottom: 0;
      text-align: center;
      //height:49px;
      white-space: normal;
    }
    .bolder {
      font-weight: bold;
    }

    .formData > ul.formDataItems > li:first-child {
      border-left: 1px solid #aaa;
      line-height: 1;
    }
    .formData > ul.formDataItems > li:nth-of-type(2) {
      line-height: 1;
    }
    .formData > ul.formDataItems:last-of-type > li {
      line-height: 59px;
    }
    .formData > ul.formDataItems > li {
      text-align: left;
      padding: 7px 10px;
    }
    .formData > ul.formDataItems > li.align-center {
      text-align: center;
      padding: 0;
      text-indent: 40px;
    }
    .formData > ul.formDataItems > li.align-right {
      text-align: right;
    }
    .formData > ul.bottomForm > li {
      border: none;
      text-align: right;
      height: 100px;
      line-height: 100px;
    }
    .formData > ul.bottomForm > li:last-child {
      border-right: 1px solid #aaa;
    }
  }
}
//  .hideScroll{
//     position: absolute;
//     top:50px;
//     right:0;
//     width: 16px;
//     height:100%;
//     background: #fff;
// }
.timeContainer {
  position: absolute;
  right: 0px;
  top: -50px;
  bottom: -70px;
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
    width: 980px;
    height: 40px;
    line-height: 40px;
    background: #fff;
    position: relative;
    left: -8px;
    display: inline-block;
    padding: 0 20px;
    font-size: 16px;
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
a.downloadBtn {
  color: #999;
}
a.downloadBtn:hover {
  color: #fff;
}
.loadBtn {
  text-align: center;
  > a {
    border: 1px solid #00b8ee;
    border-radius: 3px;
    display: inline-block;
    width: 110px;
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
  }
}
.exportBtn {
  text-align: center;
  > span {
    margin-right: 30px;
  }
}
.pushDate {
  width: 100%;
  margin: 20px 0;
  > p {
    background: #00b7ee;
    color: #fff;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  > div {
    padding: 10px;
    height: 150px;
    border: 1px solid #00b7ee;

    > ul {
      height: 100%;
      overflow: hidden;
      > li {
        float: left;
        width: 16.66%;
        height: 50%;
        line-height: 65px;
        cursor: pointer;
        text-align: center;
      }
    }
  }
}
.pushYear {
  i {
    margin: 10px;
    font-size: 20px;
    cursor: pointer;
  }
}
.pushActive {
  background: #00b7ee;
  color: #fff;
}
.imgCon {
  float: left;
  width: 60px;
  height: 55px;
  margin-left: -60px;
  > img {
    width: 100%;
    height: 100%;
  }
}
.pushMsg {
  > div {
    overflow: hidden;
    padding-left: 60px;
    > span {
      width: 100%;
    }
  }
  > p {
    text-align: right;
    margin-top: 20px;
  }
}
</style>



<style lang="scss">
.voucherList .more:hover {
  height: auto;
  background: #00b7ee;
  z-index: 9;
}
.highGradeCss .el-input--prefix .el-input__inner {
  padding-left: 24px;
  font-size: 12px;
  line-height: 30px;
}
.fileDialog .el-dialog__header {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}
.fileDialog .el-dialog__headerbtn {
  top: 12px;
}
/* .voucherList   .el-dialog{
            z-index:2008;
        }
     */
.voucherList .listIndex > li:first-of-type .el-checkbox__label {
  padding-left: 5px;
}
.modelExportDate {
  .el-dialog__body {
    padding-top: 0;
    > div {
      border-top: 1px solid #ccc;
      padding: 20px 10px;
      > p {
        font-size: 18px;
      }
      > div {
        width: 300px;
        margin: 10px 0 0 10px;
      }
    }
  }
}
.pushVoucher {
  .el-dialog__body {
    padding-top: 0;
    font-size: 18px;
    > div {
      border-top: 1px solid #ccc;
      padding: 20px 10px;
    }
    .inputContainer {
      display: inline-block;
      width: 70px;
    }
  }
}
</style>
