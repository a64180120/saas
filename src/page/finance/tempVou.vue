<template>

  <div class="voucher"
       style="z-index:1">
    <div class="voucherHead">
    </div>
    <div class="voucherContent voucherTempContent">
      <div @click.stop="moneyInputHide"
           v-show="moneyInputMask"
           class="moneyInputMask"></div>
      <div v-show="assistItemMask"
           class="assistItemMask"></div>
      <ul>
        <li>
          <ul class="flexPublic voucherContentItem">
            <li>摘要</li>
            <li>科目</li>
            <li>
              <div>借方金额</div>
              <div class="flexPublic money">
                <div>亿</div>
                <div>仟</div>
                <div>佰</div>
                <div>拾</div>
                <div>万</div>
                <div>仟</div>
                <div>佰</div>
                <div>拾</div>
                <div>圆</div>
                <div>角</div>
                <div>分</div>
              </div>
            </li>
            <li>
              <div>贷方金额</div>
              <div class="flexPublic money">
                <div>亿</div>
                <div>仟</div>
                <div>佰</div>
                <div>拾</div>
                <div>万</div>
                <div>仟</div>
                <div>佰</div>
                <div>拾</div>
                <div>圆</div>
                <div>角</div>
                <div>分</div>
              </div>
            </li>
          </ul>
        </li>
        <li v-for="(item,index) of voucherInfo"
            :key="index">
          <ul class="flexPublic voucherContentItem">
            <div v-show="addIcon[index].checked">
              <div @click="handleContent(true,index)"
                   class="addIcon"></div>
              <div @click="handleContent(false,index)"
                   class="deleteIcon"></div>
            </div>
            <li class="abstractContainer">
              <div class="inputContainer">
                <textarea :disabled="disabled"
                          :class="{chongHcss:AbstractCss=='冲红',gengZcss:AbstractCss=='更正'}"
                          v-model="item.Abstract"
                          @focus="showAddIcon(index,item,$event)"
                          @keyup="AbsSearch(item.Abstract)"
                          @blur="defaultHandle(item,index)"
                          maxlength="50"></textarea>
              </div>
              <div class="abstractSearch">
                <ul v-show="addIcon[index].checked&&AbstractAContents.length>0">
                  <li @click.stop="chooseAbstractOk(item,abs.AContent)"
                      :title="abs.AContent"
                      v-for="(abs,indAbstract) of AbstractAContents "
                      :key="indAbstract">{{abs.AContent}}</li>

                </ul>

                <div></div>
              </div>

            </li>
            <li @click.stop="handleKemuSel(index)"
                class="kemu">
              <div>
                <ul>
                  <li>
                    <div>
                      <span>{{item.SubjectCode}} &nbsp;{{item.SubjectName}}</span>
                      <span v-show="item.DtlAccounts.assistItem"
                            v-for="(assist,index) of item.DtlAccounts.assistItem"
                            :key="index">{{assist.AuxiliaryName?('.'+assist.AuxiliaryName):''}}{{assist.BaseName?('.'+assist.BaseName):''}}</span>
                    </div>
                  </li>
                  <li v-show="!item.PhId&&item.SubjectCode"><span>余额:</span><span>{{item.balance | Num}}</span></li>
                  <li v-show="kemuSel[index].checked"
                      class="kemuCancle"
                      @click.stop="kemuCancle($event,index,item)"><i></i></li>
                </ul>
              </div>
              <searchSelect style="z-index:10"
                            :itemlists="itemlists[index]"
                            :placeholder="itemlistText"
                            v-if="kemuSel[index].checked"
                            :nodatatext="itemText"
                            @add-subject="addNewSubject"
                            @item-click="itemClick"></searchSelect>
              <div @click.stop="1"
                   v-show="assistItem[index].checked"
                   class="assistContainer">
                <ul>
                  <li v-for="(assist,index2) of assistList"
                      :key="index2">
                    <div :title="assist.BaseName">{{assist.BaseName}}</div>
                    <div class="assistSelCon">
                      <div @click.stop="assistSelsShow(index2)">{{assistSels[index2].BaseName}}</div>
                      <ul v-show="assistSels[index2].checked">
                        <li @click.stop="AuxiliaryValOk(val,index)"
                            v-for="(val,ind3) of assist.Children"
                            :key="ind3"> {{val.BaseName}}</li>

                      </ul>
                      <div v-show="assistSels[index2].checked"
                           @click.stop="addAuxiliaryVal(assist,index)">增加选项</div>
                      <div></div>
                      <!-- <select  v-model="assistSels[index2]">
                                                <option :value="val" v-for="(val,index) of assist.Children" :key="index">{{val.BaseName}}</option>
                                            </select> -->

                    </div>
                    <div style="clear:both"></div>
                  </li>
                </ul>
                <p><span @click.stop="assistOk(true,item,index)">确认</span><span @click.stop="assistOk(false,item,index)">取消</span></p>
                <a @click.stop="addauxiliary(assistList)"
                   style="cursor:pointer">添加辅助项</a>
              </div>
            </li>
            <li @click.stop="moneyInputShow(item,'jiefang')"
                class="flexPublic money">
              <span :class="{moneyInputShow:item.moneyInput.jiefang}"
                    class="moneyValCon">
                <input type="text"
                       v-model="item.money.jiefang"
                       @focus="inputFocus(item)"
                       @blur="delayInputBlur($event,item,'jiefang',index)"
                       placeholder="请输入金额"
                       @keyup="clearNoNum($event)"
                       onafterpaste="this.value=this.value.replace(/e/g,'')">
                <i v-show="item.moneyInput.jiefang"
                   @click.stop="moneyCancle(item,'jiefang',$event)"
                   class="inputCancle">X</i>
              </span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
            <li @click="moneyInputShow(item,'daifang')"
                class="flexPublic money">
              <span :class="{moneyInputShow:item.moneyInput.daifang}"
                    class="moneyValCon">
                <input type="text"
                       v-model="item.money.daifang"
                       @focus="inputFocus(item)"
                       @blur="delayInputBlur($event,item,'daifang',index)"
                       placeholder="请输入金额"
                       @keyup="clearNoNum($event)"
                       onafterpaste="this.value=this.value.replace(/e/g,'')">
                <i v-show="item.moneyInput.daifang"
                   @click.stop="moneyCancle(item,'daifang',$event)"
                   class="inputCancle">X</i>
              </span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
          </ul>
        </li>
        <li>
          <ul class="flexPublic voucherContentItem count">
            <li>合计</li>
            <li class="flexPublic money">
              <span></span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
            <li class="flexPublic money">
              <span></span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 科目新增 -->
    <div v-if="addPageShow"
         class="addPageCon"
         style="z-index:999;">
      <div class="addPage">
        <div class="title"><span>科目新增</span><i @click.stop="addFinish(false) "></i>
          <div style="clear:both"></div>
        </div>
        <ul>
          <li>
            <div>上级科目</div>
            <div @click.stop=" addSubSel"
                 style="position:relative">
              <div style="padding-left:10px"><span v-show="!subjectInfo.preSubject.KCode">必选</span>{{subjectInfo.preSubject.KCode}}&nbsp;{{subjectInfo.preSubject.KName}}</div>
              <addSubList @subadd-click="subAddData"
                          v-if="addSubShow1"
                          :placeholder='"选择上级科目(必填)"'
                          :itemlists="addDataSub"></addSubList>
            </div>
            <div style="clear:both"></div>
          </li>
          <li style="overflow: hidden;">
            <div>科目编码</div>
            <div class="subCodeCss">
              <span>{{subjectInfo.preSubject?subjectInfo.preSubject.KCode:''}}</span>
              <div class="inputContainer">
                <input placeholder="必填"
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
                <input placeholder="必填"
                       type="text"
                       v-model="subjectInfo.KName">
              </div>
            </div>
            <div style="clear:both"></div>
          </li>
          <li>
            <div>科目类别</div>
            <div style="padding-left:10px;border:1px solid #ccc">
              {{navList[subjectInfo.preSubject.KType]}}
            </div>

            <div style="clear:both"></div>
          </li>
          <li>
            <div>余额方向</div>
            <div>
              <label v-show="subjectInfo.KBalanceType==1">
                <input v-model="subjectInfo.KBalanceType"
                       value="1"
                       type="radio"
                       name="balance">
                &nbsp;借方&nbsp;&nbsp;&nbsp;
              </label>
              <label v-show="subjectInfo.KBalanceType==2">
                <input v-model="subjectInfo.KBalanceType"
                       value="2"
                       type="radio"
                       name="balance">
                &nbsp;贷方&nbsp;&nbsp;&nbsp;
              </label>
              <label v-show="subjectInfo.KBalanceType==3">
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
            <div style="padding-left:0;font-size:15px;">启用/停用</div>
            <div style="border:0">
              <label>
                <input v-model="subjectInfo.EnabledMark"
                       value="0"
                       type="radio"
                       name="enable">
                &nbsp;启用&nbsp;&nbsp;&nbsp;
              </label>
              <label>
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
                     v-for="(assist,index2) of addDataAux"
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

          <span @click.stop="addFinish(false)"
                style="margin-left:30px"
                class="btngrey">取消</span>
          <span @click.stop="addFinish(true)"
                class="btn">保存</span>
          <div style="clear:both"></div>
        </div>
      </div>
      <div></div>
    </div>
    <!-- 辅助项新增 -->
    <div v-if="addauxiliaryShow"
         class="addAuxiliaryCon">
      <div class="addPage">
        <div class="title"><span>辅助项新增</span><i @click.stop="addauxiliaryFinish(false)"></i>
          <div style="clear:both"></div>
        </div>
        <ul>
          <li>
            <div>类型名称</div>
            <div style="width:240px;margin-right: 10px"
                 class="inputContainer">
              <input type="text"
                     placeholder="请输入辅助项名称"
                     v-model="addAuxiliaryForm.BaseName">
            </div>
            <div @click="addAuxiliaryType"
                 class="btn">立即创建</div>
          </li>
          <li>
            <div>是否启用</div>
            <div><label> <input v-model="addAuxiliaryForm.EnabledMark"
                       value='0'
                       name='auxiliaryAdd'
                       type="radio">&nbsp;是</label></div>
            <div style="margin-left:20px"><label> <input v-model="addAuxiliaryForm.EnabledMark"
                       value='1'
                       name='auxiliaryAdd'
                       type="radio">&nbsp;否</label></div>
          </li>
          <li style="margin-bottom:0;">
            <div>已关联辅助项</div>
          </li>
          <li>
            <div style="overflow-y:auto;padding:0 5px;">
              <label v-for="(assist,index2) of addDataAux"
                     :key=index2>
                <input type="checkbox"
                       v-model="addAuxiliaryForm.AuxiliaryTypes[index2]">
                &nbsp;{{assist.BaseName}}
              </label>
            </div>
          </li>
        </ul>
        <div>

          <span @click.stop="addauxiliaryFinish()"
                class="btn">保存</span>
          <span @click.stop="addauxiliaryFinish(false)"
                style="margin-left:30px"
                class="btn">取消</span>
          <div style="clear:both"></div>
        </div>
      </div>
      <div></div>
    </div>
    <!-- 辅助项值新增 -->
    <div v-if="addAuxiliaryValShow"
         class="addAuxiliaryVal">
      <div class="addPage">
        <div class="title"><span>辅助选项新增</span><i @click.stop="addAuxiliaryValFinish(false)"></i>
          <div style="clear:both"></div>
        </div>
        <ul>
          <li>
            <div>辅助项编码</div>
            <div class="inputContainer">
              <input disabled
                     style="background:#ddd"
                     type="text">
            </div>
          </li>
          <li>
            <div>辅助项名称</div>
            <div class="inputContainer">
              <input v-model="addAuxiliaryValForm.BaseName"
                     type="text">
            </div>
          </li>
          <li>
            <div>辅助项状态</div>
            <div>
              <label><input name="auxiliaryVal"
                       v-model="addAuxiliaryValForm.EnabledMark"
                       value="0"
                       type="radio">&nbsp;启用</label>
              <label style="margin-left:20px"><input v-model="addAuxiliaryValForm.EnabledMark"
                       name="auxiliaryVal"
                       value="1"
                       type="radio">&nbsp;停用</label>
            </div>
          </li>
        </ul>
        <div>

          <span @click.stop="addAuxiliaryValFinish"
                class="btn">保存</span>
          <span @click.stop="addAuxiliaryValFinish(false)"
                style="margin-left:30px"
                class="btn">取消</span>
          <div style="clear:both"></div>
        </div>
      </div>
      <div></div>
    </div>
    <!-- 附件弹出框 -->
    <el-dialog title="选择附件"
               :visible.sync="picVisible"
               :modal=false
               width="40%">
      <picture-upload @uploadimg="uploadimg"
                      :imgList="imglist"
                      :limit="3"
                      @removeimg="removeimg"></picture-upload>
    </el-dialog>
    <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
    <message :message="saasMessage.message"
             :delay="saasMessage.delay"
             :visible.sync="saasMessage.visible"></message>

  </div>
</template>

<script>

import { SubjectAdd, SubjectUpdate } from '@/api/subject/subjectInfo'
import addSubList from './addSubList'
import searchSelect from './searchSelect'
import { mapState, mapActions } from 'vuex'
import UserInfo from "@/util/auth";
import { SysOrgModel, SysOrgUpdate, SysOrgUploadFile, SysOrgDelete } from '@/api/organize/orgInfo'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import pictureUpload from "@/components/upload";
export default {
  name: "voucher",
  props: {
    'dataList': Object,
    'sideDate': String,
    'disabled': Boolean
  },
  data () {    return {
      fatherData: '',
      fileList: [],
      PhId: '',
      PDate: '',
      PNo: '',
      PAuditorName: '',
      PMakePerson: '',
      PFinancePerson: '',
      PKeepingPerson: '',
      PCashier: '',
      PAuditor: '',
      PType: '',
      Verify: '',
      jiefang: '',
      daifang: '',
      PersistentState: '1',
      //附件****************
      Attachements: [],
      loading: false,
      picVisible: false,     //图片上传显示
      imglist: [],//上传附件参数
      balance: '',//余额
      voucherInfo: [],//凭证内数据****************
      deleteDtls: [],//删除行的数据************************
      itemlists: [],//科目组件参数**************
      assistList: [],//科目下辅助项列表******************
      itemlistText: '搜索科目编码或名称',
      itemText: '添加科目',
      moneyInputMask: false,
      assistSels: [],//选中的辅助项列表************
      subjectlist: [],//所有科目列表*****************
      addIcon: [],//添加删除的按钮样式参数****************
      kemuSel: [],//科目选择框显示隐藏样式参数************
      assistItem: [],//辅助项显示隐藏样式参数********************
      assistItemMask: false,//辅助项遮罩********
      assistCheck: true,
      addPageShow: false,//科目新增*************
      addSubShow1: false,//科目选择****
      addDataSub: '',//上级科目****
      addDataAux: '',//科目的可选辅助项*****
      navList: [    //科目类别
        '资产类',
        '负债类',
        '净资产类',
        '收入类',
        '支出类'
      ],
      subjectInfo: {  //新增科目的值
        preSubject: '',
        KCode: '',
        KName: '',
        KType: '',
        EnabledMark: '',
        KBalanceType: '',
        AuxiliaryTypes: []
      },
      addauxiliaryShow: false,  //新增辅助项类型显示
      addauxiliarySub: '', //当前选中的科目
      addAuxiliaryForm: {   //新增辅助项页面的值
        EnabledMark: 0,
        BaseName: '',
        AuxiliaryTypes: []
      },
      allAuxiliarys: [],  //该组织所有的辅助项
      checkedAuxiliarys: [],//该科目选中的辅助项
      addAuxiliaryValShow: false, //新增辅助项值显示
      addAuxiliaryValForm: {   //页面上的值
        EnabledMark: 0,
        BaseName: ''
      },
      addAuxiliaryValData: {  //新增回传的值
        TypeId: '',
        UpdateList: []
      },
      AbstractList: [],  //ajax获取的摘要模板列表
      AbstractAContents: [],//展示的列表
      abstractListShow: false, //摘要模板搜索显示
      abstractSearch: '',//摘要模板搜索值
      sideDateNew: '',
      nowTime: new Date,
      AbstractCss: false,
      defaultData: { //摘要默认值
        Abstract: '',
        JSum: 0,
        DSum: 0
      },
      saasMessage: {
        message: '',
        delay: 0,
        visible: false
      }
    }  },
  created () {
    if ((!this.dataList.data.Mst) || typeof (this.dataList.data.Mst) == 'string') {//没有传参时初始化页面
      this.voucherInfo = [
        this.initVoucherInfo(),
        this.initVoucherInfo(),
        this.initVoucherInfo(),
        this.initVoucherInfo(),
        this.initVoucherInfo(),
      ]
      this.fatherData = {
        PhId: '',
        Dtls: []
      }
      this.PMakePerson = this.username;

      if (this.sideDate) {
        this.sideDateNew = this.sideDate;
      } else {
        this.sideDateNew = this.nowTime.getFullYear() + '-' + (parseInt(this.$store.state.Pconfig.jmonth) + 1);

      }
      this.getFreshVoucher();
    } else {
      this.getVoucherData(this.dataList.data.Mst);
      if (this.dataList.data.Mst.PhId) {
        this.getAttachements(this.dataList.data.Mst.PhId);
      }
    }

    this.initInfoCss();
  },
  mounted () {
    this.initMoneyCss();
    this.getSubject();
    this.getAbstract();

  },
  methods: {
    //voucher组件要返回数据的函数********************
    voucherData () {
      var dtls;
      if (!this.fatherData.PhId) {
        dtls = [];
      } else {
        dtls = this.fatherData.Dtls;
      }
      var account;
      var item;


      for (var info of this.voucherInfo) {

        if (info.PhId) {
          for (var dtl of dtls) {

            if (dtl.PhId == info.PhId) {
              dtl.SubjectCode = info.SubjectCode;
              dtl.SubjectName = info.SubjectName;
              dtl.Abstract = info.Abstract;
              dtl.JSum = info.money.jiefang;
              dtl.DSum = info.money.daifang;
              dtl.PersistentState = 2;

              if (dtl.DtlAccounts && info.DtlAccounts.assistItem.length > 0) {
                dtl.DtlAccounts[0].JSum = info.money.jiefang;
                dtl.DtlAccounts[0].DSum = info.money.daifang;
                dtl.DtlAccounts[0].SubjectCode = info.SubjectCode;
                dtl.DtlAccounts[0].SubjectName = info.SubjectName;
                dtl.DtlAccounts[0].Abstract = info.Abstract;
                item = info.DtlAccounts.assistItem;
                account = dtl.DtlAccounts[0];

                for (var it22 of item) {
                  account[it22.GLS] = it22.PhId ? it22.PhId : it22.PhidAuxiliary;
                }


                dtl.DtlAccounts[0].PersistentState = 2;
              } else if (dtl.DtlAccounts && info.DtlAccounts.assistItem.length <= 0) {
                dtl.DtlAccounts[0].PersistentState = 3;
              } else if ((!dtl.DtlAccounts) && info.DtlAccounts.assistItem.length > 0) {
                dtl.DtlAccounts = [{
                }];
                dtl.DtlAccounts[0].JSum = info.money.jiefang;
                dtl.DtlAccounts[0].DSum = info.money.daifang;
                dtl.DtlAccounts[0].SubjectCode = info.SubjectCode;
                dtl.DtlAccounts[0].SubjectName = info.SubjectName;
                dtl.DtlAccounts[0].Abstract = info.Abstract;
                dtl.DtlAccounts[0].PersistentState = 1;
                item = info.DtlAccounts.assistItem;
                account = dtl.DtlAccounts[0];
                for (var i of item) {
                  account[i.GLS] = i.PhId ? i.PhId : i.PhidAuxiliary;

                }
              }
            }
          }

        }
        else if (info.SubjectCode || info.money.jiefang || info.money.daifang || info.Abstract) {
          var newDtl = {
            Abstract: info.Abstract,
            SubjectCode: info.SubjectCode,
            SubjectName: info.SubjectName,
            JSum: info.money.jiefang,
            DSum: info.money.daifang,
            PersistentState: 1
          }
          if (info.DtlAccounts.assistItem.length > 0) {
            newDtl.DtlAccounts = [];
            var dt = {
              Abstract: info.Abstract,
              SubjectCode: info.SubjectCode,
              SubjectName: info.SubjectName,
              JSum: info.money.jiefang,
              DSum: info.money.daifang,
              PersistentState: 1
            }

            item = info.DtlAccounts.assistItem;
            for (var i of item) {
              dt[i.GLS] = i.PhId ? i.PhId : i.PhidAuxiliary;
              console.log(i)
            }

            newDtl.DtlAccounts[0] = dt;
          }

          dtls.push(newDtl);

        }
      }



      this.fatherData.Dtls = dtls;
      for (var del of this.deleteDtls) {
        if (del.PhId) {
          for (var dtl of dtls) {
            if (dtl.PhId == del.PhId) {
              dtl.PersistentState = 3;
              if (dtl.DtlAccounts) {
                dtl.DtlAccounts[0].PersistentState = 3;
              }
            }
          }
        }
      }
      if (!this.PhId) {

        if (this.fatherData.PType != '结') {
          this.fatherData.PType = '记';
        }
        this.fatherData.OrgId = this.orgid;
        this.fatherData.OrgCode = this.orgcode;
        this.fatherData.PersistentState = 1;
      } else {
        this.fatherData.PersistentState = 2;
        this.fatherData.PhId = this.PhId;
      }
      this.fatherData.PDate = this.PDate;
      this.fatherData.PAttachment = this.PAttachment;
      if (!this.PMakePerson) {
        this.PMakePerson = this.username;
      }
      this.fatherData.PMakePerson = this.PMakePerson;
      this.fatherData.PFinancePerson = this.PFinancePerson;
      this.fatherData.PKeepingPerson = this.PKeepingPerson;
      this.fatherData.PCashier = this.PCashier;
      this.fatherData.PAuditor = this.PAuditor;
      for (var img of this.imglist) {
        if (img.PhId == 0) {
          img.PersistentState = 1;
          img.BTable = 'gcw3_voucher_mst';
          img.BusinessPrimaryKeys = '';
          img.ForeignKeys = '';
        }
      }
      this.Attachements = this.imglist;


      return {
        Mst: this.fatherData,
        Attachements: this.Attachements
      }
    },
    //添加删除行信息********************************
    handleContent (bool, index) {
      if (bool) {
        this.voucherInfo.push(this.initVoucherInfo());
        this.addIcon[this.voucherInfo.length - 1] = { checked: false };
        this.kemuSel[this.voucherInfo.length - 1] = { checked: false };
        this.assistItem[this.voucherInfo.length - 1] = { checked: false };
        this.itemlists[this.voucherInfo.length - 1] = { id: this.voucherInfo.length - 1, kemu: this.subjectlist }
        /*
                            this.assistItems[this.voucherInfo.length-1]={id:this.voucherInfo.length-1,kemu:['1','2','3','4','5']}
        */
      } else {
        if (this.voucherInfo.length > 1) {
          if (this.voucherInfo[index].PhId) {
            this.deleteDtls.push(this.voucherInfo[index]);
          }
          this.voucherInfo.splice(index, 1);
          this.initMoneyCss();
        }
      }
    },
    initVoucherInfo () {
      return { moneyInput: { jiefang: false, daifang: false }, SubjectCode: '', SubjectName: '', DtlAccounts: { assistItem: [] }, Abstract: '', money: { jiefang: '', daifang: '' } }
    },
    //初始化信息样式***************
    initInfoCss () {
      for (var i in this.voucherInfo) {
        this.addIcon[i] = { checked: false }
        this.kemuSel[i] = { checked: false }
        this.assistItem[i] = { checked: false }
        this.itemlists[i] = {
          id: i,
          kemu: this.subjectlist  //总的科目列表
        }
      }
    },
    //输入框限定***
    clearNoNum (event) {
      var obj = event.target;
      if (obj.value > 999999999.99) {
        obj.value = 999999999.99;
        return;
      }
      obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
      obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
      obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
      if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        obj.value = parseFloat(obj.value);
      }
    },
    //获取最新一个凭证
    getFreshVoucher () {
      const loading1 = this.$loading();

      if (!this.sideDateNew) {
        this.sideDateNew = this.nowTime.getFullYear() + '-' + this.nowTime.getMonth()
      }
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        sum1: '',
        sum2: '',
        keyword: '',
        pagesize: 3,
        pageindex: 0,
        sort: ['PDate DESC', 'PNo DESC'],
        // itemValuePhid:649181122000008,
        itemValuePhid: '',
        queryfilter: {          "PAccper*str*ge*1": this.sideDateNew.split('-')[1] > 9 ? this.sideDateNew.replace("-", '') : (this.sideDateNew.split('-')[0] + '0' + this.sideDateNew.split('-')[1]),
          "PAccper*str*le*1": this.sideDateNew.split('-')[1] > 9 ? this.sideDateNew.replace("-", '') : (this.sideDateNew.split('-')[0] + '0' + this.sideDateNew.split('-')[1])        }
      }
      this.$axios.get('/PVoucherMst/GetVoucherList', { params: data })
        .then(res => {
          loading1.close();
          if (res.Record.length <= 0) {
            var year = this.sideDateNew.slice(0, 5);
            var month = this.sideDateNew.slice(5, 7);
            this.PDate = year + (month > 9 ? month : ('0' + month)) + '-01';
          } else {
            this.PDate = res.Record[0].PDate;
          }
          this.$forceUpdate();

        }, err => {
          console.log(err);
          loading1.close();
        })
        .catch(err => {
          loading1.close();
          this.$message({ showClose: true, message: '获取列表失败了!', type: "error" });
        })
    },
    //获取父组件传参*********************************
    getVoucherData (data) {
      this.fatherData = data;
      this.PhId = data.PhId;
      this.PType = data.PType;
      this.PNo = data.PNo;
      this.PAttachment = data.PAttachment;
      this.PMonth = data.PMonth;
      this.PMakePerson = data.PMakePerson;
      this.PFinancePerson = data.PFinancePerson;
      this.PKeepingPerson = data.PKeepingPerson;
      this.PCashier = data.PCashier;
      this.PAuditor = data.PAuditor;
      this.PAuditorName = data.PAuditorName;
      this.Verify = data.Verify;
      this.PDate = data.PDate;
      var dtls = data.Dtls;
      var reg = /^S[0-5][0-9]$/;
      for (var i in dtls) {
        this.voucherInfo[i] = this.initVoucherInfo();
        this.voucherInfo[i].PhId = dtls[i].PhId;
        this.voucherInfo[i].SubjectCode = dtls[i].SubjectCode;
        this.voucherInfo[i].SubjectName = dtls[i].SubjectName;
        this.voucherInfo[i].Abstract = dtls[i].Abstract;
        this.voucherInfo[i].money.jiefang = dtls[i].JSum == 0 ? '' : dtls[i].JSum;
        this.voucherInfo[i].money.daifang = dtls[i].DSum == 0 ? '' : dtls[i].DSum;

        if (dtls[i].DtlAccounts && dtls[i].DtlAccounts[0].NameValueDtls) {
          this.voucherInfo[i].DtlAccounts.assistItem = dtls[i].DtlAccounts[0].NameValueDtls;
        }
      }

      if (this.voucherInfo.length < 5) {
        var leng = 5 - this.voucherInfo.length;
        for (var k = 0; k < leng; k++) {
          this.voucherInfo.push(this.initVoucherInfo());
        }
      }
      this.AbstractCss = data.PSource ? data.PSource : '';//摘要样式******************
      console.log(this.voucherInfo)
    },
    //获取附件信息*******************
    getAttachements (PhId) {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        id: PhId
      }
      this.$axios.get('PVoucherMst/GetAttachmentListByID', { params: data })
        .then(res => {
          if (res.Status == 'error') {
            this.messageCallback(res.Msg)
          }
          this.imglist = res.Record;

        }, err => {
          console.log(err);

        })
        .catch(err => {
          this.$message({ showClose: true, message: err, type: "error" });
        }
        )
    },
    //获取摘要模板***
    getAbstract () {
      this.$axios.get('/PAbstractTem/GetAbstractTem')
        .then(res => {

          if (res.Status == 'success') {
            this.AbstractList = res.Data;
          } else {
            this.messageCallback(res.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //摘要搜索框
    AbsSearch (val) {
      if (!val) {
        this.AbstractAContents = this.AbstractList;
        return;
      }
      this.AbstractAContents = [];
      for (var abs of this.AbstractList) {
        if (abs.AContent.indexOf(val) != -1) {
          this.AbstractAContents.push(abs);
        }
      }
      // this.AbstractAContents=this.AbstractList.filter((val,ind,arr)=>{
      //     return val.AContent.indexOf(val)!=-1;
      // }) 
      this.$forceUpdate();
    },
    //获取科目列表******************
    getSubject () {

      var data = {
        orgid: this.orgid,
        Ryear: (new Date).getFullYear()
      }
      this.$axios.get('/PSubject/GetPSubjectListByOrgId', { params: data })
        .then(res => {
          if (res.Status == 'error') {
            this.messageCallback(res.Msg)
          }
          this.subjectlist = res;

          for (var i in this.voucherInfo) {
            this.itemlists[i] = {
              id: i,
              kemu: this.subjectlist  //总的科目列表
            }
          }
          this.$forceUpdate();
        }, err => {
          console.log(err);

        })
        .catch(err => { this.$message({ showClose: true, message: err, type: "error" }); })
    },
    //ajax获取科目下的辅助项***************************
    getAssist (val, index) {
      var data = {
        id: val.data.PhId,
        orgid: this.orgid,
      }
      console.log(2222, val, index, data)
      const loading1 = this.$loading();
      this.$axios.get("/PSubject/GetVoucherAuxiliaryBySubject", { params: data })
        .then(res => {

          loading1.close();
          if (res.length > 0) {
            console.log(1111, res)
            for (var a in res) {

              if (res[a].Children.length <= 0) {
                this.messageCallback('该科目下存在辅助项没有值,请先添加!')

                res[a].Children = [{ BaseName: '', BaseCode: '' }];
              }
              this.assistSels[a] = res[a].Children[0];
              this.assistSels[a].checked = false;
            }
            this.assistList = res;
            this.assistItem[val.id].checked = true;
            this.assistItemMask = true;
            this.assistCheck = true;

            this.$forceUpdate();
          } else {
            this.assistList = []
          }

          this.moneyInputMask = false;
        }, err => {
          console.log(err);

        })
        .catch(err => { this.$message({ showClose: true, message: err, type: "error" }); loading1.close(); this.moneyInputMask = false; })

    },
    //显示下拉
    assistSelsShow (index2) {

      this.assistSels[index2].checked = !this.assistSels[index2].checked;

      this.$forceUpdate();
    },
    //选择辅助项下拉值***
    AuxiliaryValOk (val, index2) {
      this.assistSels[index2] = val;
      this.assistSels[index2].checked = false;
      this.$forceUpdate();
    },
    //增加辅助项的值***
    addAuxiliaryVal (assist, index) {
      this.addAuxiliaryValShow = true;
      this.$emit('subAddClick', true);
      this.addAuxiliaryValData.TypeId = assist.PhId;
      this.addAuxiliaryValData.index = index;  //保存当前所在的行
    },
    //保存新增的辅助项值
    addAuxiliaryValFinish (bool) {
      if (!bool) {
        this.addAuxiliaryValShow = false;
        return;
      }
      this.addAuxiliaryValData.UpdateList = [this.addAuxiliaryValForm];
      var index = this.addAuxiliaryValData.index;
      const loading = this.$loading();
      this.$axios.post('/PVoucherAuxiliaryType/PostUpdateAuxiliary', this.addAuxiliaryValData)
        .then(res => {
          loading.close();

          if (res.Status == 'success') {
            this.addAuxiliaryValShow = false;
            this.$emit('subAddClick', false);
            this.messageCallback('保存成功!');
            // this.getAssist(this.addauxiliarySub.data,this.addauxiliarySub.id);
            this.assistItemMask = false;
            this.assistCheck = false;
            for (var kemu in this.kemuSel) {
              this.assistItem[kemu].checked = false;
              this.kemuSel[kemu].checked = false;
            }
            this.voucherInfo[index].DtlAccounts.assistItem = [];
            this.voucherInfo[index].SubjectCode = '';
            this.voucherInfo[index].SubjectName = '';

          } else {
            this.messageCallback(res.Msg)
          }
        })
        .catch(err => {
          loading.close()
        })
    },
    //增加科目下的辅助项
    addauxiliary (val) {
      this.addauxiliaryShow = true;
      this.$emit('subAddClick', true);
      this.checkedAuxiliarys = JSON.parse(JSON.stringify(val));
      this.addAuxiliaryForm.EnabledMark = 0;
      var data1 = {
        orgid: this.orgid,
        uid: this.uid,
        Ryear: this.sideDateNew.slice(0, 4)
      }
      const loading2 = this.$loading();
      this.$axios.get('PSubject/GetPSubjectLastList', { params: data1 })
        .then(res => {

          loading2.close();
          if (res.Status == 'success') {
            this.addDataSub = res.PSubject;
            this.addDataAux = res.Type;  //所有辅助项
            var types = this.addAuxiliaryForm.AuxiliaryTypes;//初始化所有辅助项选择为false
            for (var au in this.addDataAux) {
              types[au] = false;
              for (var che of this.checkedAuxiliarys) {

                if (this.addDataAux[au].PhId == che.PhId) {
                  types[au] = true;
                }
              }

            }


          } else {
            this.messageCallback(res.Msg)
          }
        })
        .catch(err => {
          loading2.close();
          console.log(err)
        })
      //this.addAuxiliaryForm.AuxiliaryTypes;

    },
    //新增辅助项类型**
    addAuxiliaryType () {
      if (!this.addAuxiliaryForm.BaseName) {
        this.messageCallback('请输入辅助项类型!')
        return;
      } else {
        var data = {
          orgid: this.orgid,
          uid: this.uid,
          infoData: this.addAuxiliaryForm
        }
        const loading = this.$loading();
        this.$axios.post('/PVoucherAuxiliaryType/PostAddAuxiliarySingleType', data)
          .then(res => {
            loading.close();
            if (res.Status == 'success') {
              this.addAuxiliaryForm.BaseName = '';
              this.addDataAux = res.Data;
              this.checkedAuxiliarys.push({ PhId: res.PhId });
              var types = this.addAuxiliaryForm.AuxiliaryTypes;//初始化所有辅助项选择为false
              for (var au in this.addDataAux) {
                types[au] = false;
                for (var che of this.checkedAuxiliarys) {
                  if (this.addDataAux[au].PhId == che.PhId) {
                    types[au] = true;
                  }
                }

              }

            } else {
              this.messageCallback(res.Msg)
            }
          })
          .catch(err => {
            loading.close();
            console.log(err)
          })
      }
    },
    //新增辅助项类型保存完成*****
    addauxiliaryFinish (bool) {
      if (!bool) {
        this.addauxiliaryShow = false;
        this.$emit('subAddClick', false);
        return;
      }
      var vm = this;
      var auxi = [];
      var types = this.addAuxiliaryForm.AuxiliaryTypes
      for (var ty in types) {
        if (ty) {
          auxi.push(this.addDataAux[ty])
        }
      }
      var data2 = {
        orgid: this.orgid,
        uid: this.uid,
        Subject: this.addauxiliarySub.data,
        AuxiliaryTypeList: auxi
      }
      const loading2 = this.$loading();
      SubjectUpdate(vm, data2)
        .then(res => {

          loading2.close();
          if (res.Status == 'success') {
            this.addauxiliaryShow = false;
            this.$emit('subAddClick', false);
            this.getAssist(this.addauxiliarySub.data, this.addauxiliarySub.id);
          } else {
            this.messageCallback(res.Msg)
          }
        })
        .catch(err => {

          loading2.close();
          console.log(err)
        })
    },
    //辅助项选择完成********************
    assistOk (bool, item, index) {
      if (bool) {
        for (var ass of this.assistSels) {
          if (!ass.PhId) {
            this.messageCallback('辅助项不能为空!')
            return;
          }
        }
        item.DtlAccounts.assistItem = JSON.parse(JSON.stringify(this.assistSels));
        //console.log(this.assistSels)
      } else {
        item.SubjectCode = '';
        item.SubjectName = '';
      }

      this.assistItemMask = false;
      this.assistCheck = false;
      this.moneyInputHide();
    },
    //科目下拉框选择的科目********************************
    itemClick (childMsg) {
      this.addauxiliarySub = childMsg;//缓存当前科目           
      this.voucherInfo[childMsg.id].SubjectCode = childMsg.data.KCode;
      this.voucherInfo[childMsg.id].SubjectName = childMsg.data.FullName;
      this.kemuSel[childMsg.id].checked = false;
      this.voucherInfo[childMsg.id].DtlAccounts.assistItem = [];
      this.getAssist(childMsg, childMsg.id);
      this.getBalance(childMsg);
      this.$forceUpdate();
    },
    //科目余额*******************
    getBalance (Msg) {
      var Kcode = Msg.data.KCode;
      var nowTime = this.nowTime;
      var data = {
        Year: nowTime.getFullYear(),
        OrgIds: this.orgid,
        Kcode: Kcode,
        IsStart: ''
      }
      const loading5 = this.$loading();
      this.$axios.get('/PVoucherMst/GetSubjectBalance', { params: data })
        .then(res => {

          if (res.Status == 'error') {
            this.$message(res.Msg);
            return;
          }
          if (res.Record.length == 0) {
            this.voucherInfo[Msg.id].balance = 0
          } else {
            this.voucherInfo[Msg.id].balance = res.Record[0].balance == 0 ? '0' : res.Record[0].balance;

          }
          this.$forceUpdate();
          loading5.close();
        }, err => {
          console.log(err);

        })
        .catch(err => {
          this.$message({ showClose: true, message: err, type: "error" })
          loading5.close();
        })
    },
    //选择框显示********************
    handleKemuSel (index) {
      for (var kemu in this.kemuSel) {
        this.assistItem[kemu].checked = false;
        this.kemuSel[kemu].checked = false;
      }
      this.kemuSel[index] = { checked: true };
      this.moneyInputMask = true;
      this.$forceUpdate();
    },
    //清除科目的值
    kemuCancle ($event, index, item) {
      for (var kemu in this.kemuSel) {
        this.assistItem[kemu].checked = false;
        this.kemuSel[kemu].checked = false;
      }
      this.voucherInfo[index].DtlAccounts.assistItem = [];
      this.voucherInfo[index].SubjectCode = '';
      this.voucherInfo[index].SubjectName = '';
      //清除科目同时清除金额
      // item.money={jiefang:'',daifang:''};
      // var input1=$event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling.children[0].children[0];
      // var input2=$event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling.nextElementSibling.children[0].children[0];
      // this.inputBlur(input1,item,'jiefang');
      // this.inputBlur(input2,item,'daifang');
      // this.moneyInputMask=false;
      // this.$forceUpdate();
    },
    //取消金额输入*****
    moneyCancle (item, val, event) {
      item.money[val] = '';
      var children = event.target.parentNode.parentNode.children;
      this.moneyTurn('', children);
      this.countJie++;
      this.countDai++;

    },
    //金额输入框键入***************
    inputFocus () {

    },
    //延迟blur防止和click删除按钮冲突*******************
    delayInputBlur ($event, item, value, index) {
      var vm = this;
      setTimeout(function () {
        vm.inputBlur($event, item, value, index);
      }, 100);
    },
    //金额输入框失去焦点*******************
    inputBlur ($event, item, value, index) {
      // if(!item.SubjectCode) {
      //     item.money[value]='';
      // }
      var input;
      var children;
      if ($event.target) {
        input = $event.target;
      } else {
        input = $event;
      }
      //清空另一个金额框的值*************
      if (value == 'jiefang' && item.money[value]) {
        item.money.daifang = '';
        children = input.parentNode.parentNode.nextElementSibling.children;
        this.moneyTurn(0, children);
      } else if (value == 'daifang' && item.money[value]) {
        item.money.jiefang = '';
        children = input.parentNode.parentNode.previousElementSibling.children;
        this.moneyTurn(0, children);
      }
      //数据监听不好判断数组,为了触发合计尝试加了countJIe中间值尝试******后续研究
      this.countJie++;
      this.countDai++;
      var nextTr = this.voucherInfo[index + 1];//下一行数据
      //************* */
      if (item.money[value]) {
        item.money[value] = parseFloat(item.money[value]);
      }

      var val = item.money[value];
      item.moneyInput[value] = false;
      children = input.parentNode.parentNode.children;
      this.moneyInputMask = false;
      this.$forceUpdate();
      this.moneyTurn(val, children);
      //下一行有摘要或者科目自动添加金额
      if ($event.target && nextTr && (nextTr.Abstract || nextTr.SubjectCode) && (!nextTr.money.jiefang) && (!nextTr.money.daifang)) {

        if (this.jiefang - this.daifang > 0) {  //自动添加下级金额
          nextTr.money.daifang = (this.jiefang - this.daifang).toFixed(2);
          var children1 = input.parentNode.parentNode.parentNode.parentNode.nextElementSibling.children[0].children[4].children;
          this.moneyTurn(nextTr.money.daifang, children1);
        } else if (this.jiefang - this.daifang < 0) {
          nextTr.money.jiefang = ((this.jiefang - this.daifang) * -1).toFixed(2);
          var children1 = input.parentNode.parentNode.parentNode.parentNode.nextElementSibling.children[0].children[3].children;
          this.moneyTurn(nextTr.money.jiefang, children1);
        }

      }
      //数据监听不好判断数组,为了触发合计尝试加了countJIe中间值尝试******后续研究
      this.countJie++;
      this.countDai++;
    },
    initMoneyCss () {  //金额输入框样式初始化***************
      for (var i in this.voucherInfo) {
        var li = document.querySelectorAll(".voucherTempContent>ul>li");
        var children1 = li[i - 0 + 1].children[0].children[3].children;
        this.moneyTurn(this.voucherInfo[i].money.jiefang, children1);
        var children2 = li[i - 0 + 1].children[0].children[4].children;
        this.moneyTurn(this.voucherInfo[i].money.daifang, children2);
        var sum = 0;
        for (var item of this.voucherInfo) {
          if (item.money.daifang) {
            sum += parseFloat(item.money.daifang);
          }
        }
        this.daifang = sum.toFixed(2);
        sum = 0;
        for (var item of this.voucherInfo) {
          if (item.money.jiefang) {
            sum += parseFloat(item.money.jiefang);
          }
        }
        this.jiefang = sum.toFixed(2);
        var jie = document.querySelector(".count>li:nth-child(2)");
        this.moneyTurn(this.jiefang, jie.children);
        var dai = document.querySelector(".count>li:nth-child(3)");
        this.moneyTurn(this.daifang, dai.children);
      }
      this.$forceUpdate();

    },
    moneyTurn (val, children) {  //金额输入框转文本样式***************

      if (val && val != 0) {
        val = parseFloat(val).toFixed(2).split('.');
        var num = val[0];
        var float = val[1];
        if (num === '0' || num === '-0') {
          num = [];
        }
        // if(num.length==0&&float[0]==='0'&&float[1]!=='0'){
        //     float[0]="¥";
        // }

        children[11].innerHTML = float[1];
        children[10].innerHTML = float[0];
        if (num.length > 0) {
          for (var i = num.length - 1, j = 9; j > 0; j--) {
            if (i >= 0) {
              children[j].innerHTML = num[i];
            } else {
              children[j].innerHTML = '';
              if (j == '1' && i == '-1') {
                children[j].innerHTML = "¥";
              }
            }
            if (i == '-2') {
              children[j + 1].innerHTML = "¥";
            }
            i--;
          }
        } else {
          //整数位没有值***********
          for (var i = 9; i > 0; i--) {
            children[i].innerHTML = '';
          }
          if (float[0] === '0') {//小数第一位为0;
            children[10].innerHTML = '¥';
          } else {
            children[9].innerHTML = '¥';
          }

        }
      } else {
        for (var i = 11; i > 0; i--) {
          children[i].innerHTML = '';
        }

      }
    },
    moneyInputShow (item, val) {//金额输入框展示**********************

      item.moneyInput[val] = true;
      this.moneyInputMask = true;

      for (var item of this.kemuSel) {   //隐藏科目选择****解决bug
        item.checked = false;
      }
      this.$forceUpdate();

    },
    moneyInputHide () {//输入框隐藏**********************
      for (var input of this.voucherInfo) {
        input.moneyInput.jiefang = false;
        input.moneyInput.daifang = false;
      }
      for (var item of this.kemuSel) {
        item.checked = false;
      }
      for (var assist of this.assistItem) {
        assist.checked = false;
      }
      this.moneyInputMask = false;
    },
    showAddIcon (index, item, $event) {//增删icon显示*************//添加默认摘要*****************显示摘要模板列表
      this.AbstractAContents = this.AbstractList;  //摘要模板
      for (var add of this.addIcon) {
        add.checked = false;
      }
      this.addIcon[index].checked = true;
      if (!item.Abstract) {
        item.Abstract = this.defaultData.Abstract; //摘要为空自动添加上一个摘要
      }
      if (!this.countJie || !this.countDai) {  //数据监听不好判断数组,为了触发合计尝试加了countJIe中间值尝试******后续研究
        this.countJie = 0;
        this.countDai = 0;
      } else {
        this.countJie++;
        this.countDai++;
      }
      var children1;
      if (!item.SubjectCode) {
        if (this.jiefang - this.daifang > 0) {  //自动添加本行金额
          item.money.daifang = (this.jiefang - this.daifang).toFixed(2);
          children1 = $event.currentTarget.parentNode.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.children;
          this.moneyTurn(item.money.daifang, children1);
        } else if (this.jiefang - this.daifang < 0) {
          item.money.jiefang = ((this.jiefang - this.daifang) * -1).toFixed(2);
          children1 = $event.currentTarget.parentNode.parentNode.nextElementSibling.nextElementSibling.children;
          this.moneyTurn(item.money.jiefang, children1);
        }
      }

      this.countJie++;  //触发合计更新
      this.countDai++;
      this.$forceUpdate();
    },
    //从摘要模板列表选择摘要
    chooseAbstractOk (item, val) {
      item.Abstract = val;
      this.defaultData.Abstract = val;
    },
    defaultHandle (val, index) {  //保存上一个摘要
      this.defaultData.Abstract = val.Abstract;
      this.addIcon[index].checked = false;
    },
    addSubSel () {
      this.addSubShow1 = true;
      this.$forceUpdate();

    },
    addNewSubject () {  //获取所有科目,和辅助项
      var data1 = {
        orgid: this.orgid,
        uid: this.uid,
        Ryear: this.sideDateNew.slice(0, 4)
      }
      const loading2 = this.$loading();
      this.$axios.get('PSubject/GetPSubjectLastList', { params: data1 })
        .then(res => {
          loading2.close();
          if (res.Status == 'success') {
            this.addDataSub = res.PSubject;
            this.addDataAux = res.Type;
            this.addPageShow = true;
            this.$emit('subAddClick', true);
            this.subjectInfo = {
              preSubject: '',
              KCode: '',
              KName: '',
              EnabledMark: '',
              KType: '',
              KBalanceType: '',
              AuxiliaryTypes: []
            }
          }

        }, err => {
          console.log(err);
        })
        .catch(err => {
          loading2.close();
        })
    },
    //接收addsub选中的值**
    subAddData (data) {
      console.log(data)
      this.subjectInfo = {
        preSubject: data.data,
        KCode: data.data.ChildCode,
        KName: '',
        EnabledMark: data.data.EnabledMark,
        KType: data.data.KType,
        KBalanceType: data.data.KBalanceType,
        AuxiliaryTypes: []
      }
      for (var t = 0; t < this.addDataAux.length; t++) {
        this.subjectInfo.AuxiliaryTypes[t] = false;
      }
      this.addSubShow1 = false;
      this.$forceUpdate();
    },
    //新增科目完成**
    addFinish (bool) {
      if (!bool) {
        this.addPageShow = false;
        this.$emit('subAddClick', false);
        return;
      }
      var auxi = [];
      var vm = this;
      for (var t in this.addDataAux) {
        if (this.subjectInfo.AuxiliaryTypes[t])
          auxi.push(this.addDataAux[t]);
      }
      this.subjectInfo.OrgId = this.orgid;
      this.subjectInfo.Layers = parseInt(this.subjectInfo.preSubject.Layers) + 1;
      this.subjectInfo.KType = this.subjectInfo.preSubject.KType;
      this.subjectInfo.Uyear = this.subjectInfo.preSubject.Uyear;
      this.subjectInfo.OrgCode = this.orgcode;
      this.subjectInfo.ParentId = this.subjectInfo.preSubject.PhId;

      if (this.addPageShow) {
        //新增***************
        if (!this.subjectInfo.preSubject) {
          this.messageCallback('请输入上级科目!')

          return;
        } else if (!this.subjectInfo.KName) {
          this.messageCallback('请输入科目名称!')

          return;
        } else if (!this.subjectInfo.KCode) {
          this.messageCallback('请输入科目代码!')

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
          ParentSubject: this.subjectInfo.preSubject,
          Subject: info,
          AuxiliaryTypeList: auxi
        }

        const loading = this.$loading();
        SubjectAdd(vm, data1)
          .then(res => {
            loading.close();
            this.messageCallback(res.Msg)
            this.getSubject();
            this.addPageShow = false;
            this.$emit('subAddClick', false);
            for (var kemu in this.kemuSel) {
              this.assistItem[kemu].checked = false;
              this.kemuSel[kemu].checked = false;
            }
            this.moneyInputMask = false;
          }, err => {
            loading.close();


          })
          .catch(err => {
            loading.close();
            this.messageCallback('新增科目出错了!')
          })
      }
    },


    //附件上传************************************
    //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    // beforeAvatarUpload(file) {
    //     console.log(111,file)
    //     const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif') || (file.type === 'image/jpg');
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //     if (!isRightType) {
    //         this.$message.error('上传图片只能是 JPG,png,gif,jpeg 格式!');
    //         return false
    //     }
    //     if (!isLt2M) {
    //         this.$message.error('上传图片大小不能超过 2MB!');
    //         return false
    //     }

    // },
    // uploadFileMethodEnterprise(param) {console.log(res,2);
    //     let fileObject = param.file;
    //     let formData = new FormData();
    //     formData.append('id', this.orgForm.PhId)
    //     formData.append("file", fileObject);
    //     this.uploadFile(formData).then(res => {
    //         console.log(res,2);
    //         if(res.Status==='error'){
    //             this.$message.error(res.Msg);
    //             return
    //         }

    //         //回传的上传临时文件
    //         if(res.Data[0]){
    //             this.orgForm.EnterpriseAttachment = res.Data[0];
    //             this.$message.success("上传成功");
    //         }

    //     }).catch(error => {      
    //         console.log(error);
    //         this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
    //     })
    // },
    // uploadFileMethodChairman(param){console.log(res,2);
    //     let fileObject = param.file;
    //     let formData = new FormData();
    //     formData.append('id', this.orgForm.PhId)
    //     formData.append("file", fileObject);

    //     this.uploadFile(formData).then(res => {
    //         console.log(res,1);
    //         if(res.Status==='error'){
    //             this.$message.error(res.Msg);
    //             return
    //         }

    //         //回传的上传临时文件
    //         if(res.Data[0]){
    //             this.orgForm.ChairmanAttachment = res.Data[0];
    //             this.$message.success("上传成功");
    //         }

    //     }).catch(error => {      
    //         console.log(error);
    //         this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
    //     })
    // },
    picUploadShow () {
      this.picVisible = true;
    },
    removeimg (item, deleValue) {//

      this.imglist = item;
      if (item.length < 1) {
        return;
      }

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
        console.log(err);

      }).catch(error => {
        this.$message({ showClose: true, message: '附件删除错误', type: 'error' });
      });
    },
    uploadimg (item) {
      this.imglist = item;
    },
    //voucher组件需要弹出的提示
    messageCallback (data) {
      this.$emit('Msg-click', data)
    }
    // ...mapActions({
    //     uploadFile: 'uploadFile/Voucherupload'
    // }),
  },
  computed: {
    countJie: {
      get () {
      },
      set () {
        var sum = 0;
        for (var item of this.voucherInfo) {
          if (item.money.jiefang) {
            sum += parseFloat(item.money.jiefang);
          }
        }
        this.jiefang = sum.toFixed(2);
        return;
      }
    },
    countDai: {
      get () {

      },
      set () {
        var sum = 0;
        for (var item of this.voucherInfo) {
          if (item.money.daifang) {
            sum += parseFloat(item.money.daifang);
          }
        }
        this.daifang = sum.toFixed(2);
        return;
      }
    },
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      username: state => state.user.username,
      orgcode: state => state.user.orgcode
    }),
    picUrl: function () {
      return httpConfig.baseurl;
    },
    PAttachment: {
      get () {
        return this.imglist.length;
      },
      set () {

      }
    }
  },
  watch: {
    jiefang () {
      var jie = document.querySelector(".count>li:nth-child(2)");
      this.moneyTurn(this.jiefang, jie.children);
    },
    daifang () {
      var dai = document.querySelector(".count>li:nth-child(3)");
      this.moneyTurn(this.daifang, dai.children);
    },
    "orgForm.ServiceTime" (val) {
      this.orgForm.ServiceStartTime = ''
      this.orgForm.ServiceEndTime = ''
    },


  },
  filters: {
    Num (value) {
      if (!value || value == '0') return '0.00';
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
  },
  components: {
    searchSelect,
    pictureUpload,
    addSubList,

  }
}
</script>

<style lang='scss' scoped>
.voucher {
  width: 100%;
  text-align: left;
  padding: 8px 15px 0 25px;
  margin-right: 10px;
  font-size: 18px;
  > .voucherHead {
    > ul {
      height: 36px;
      line-height: 36px;
    }
    > ul > li {
      display: block;
      width: 33.33%;
      &:nth-of-type(2) {
        > div {
          height: 100%;
          width: 400px;
          margin: 0 auto;
          > div {
            > input {
              margin-top: 6px;
            }
          }
          > span {
            line-height: 30px;
          }
        }
      }
      &:last-of-type {
        > div {
          float: right;
        }
      }
    }
  }
}

.assistItemMask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9;
}
.voucherContent {
  margin-top: 20px;
  border-top: 1px solid #aaa;
  position: relative;
}
.moneyInputMask {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}
.voucherContent > ul > li:first-child {
  height: 55px;
}
.voucherContentItem > div:first-of-type {
  width: 25px;
  height: 100%;
  position: absolute;
  left: -25px;
  top: 0;
}
.voucherContentItem .inputContainer {
  height: 100%;
}
.voucherContentItem .inputContainer > textarea {
  width: 100%;
  height: 100%;
  border: 0;
  padding: 2px 5px;
  font-size: 15px;
}
.voucherContentItem .abstractContainer {
  position: relative;

  > div.abstractSearch {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 9;
    > ul {
      width: 100%;
      max-height: 150px;
      overflow-y: auto;
      background: rgb(247, 234, 234);
      border: 1px solid #ccc;
      > li {
        height: 30px;
        line-height: 30px;
        padding: 0 3px;
        position: relative;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          background: #ccc;
        }
      }
    }
  }
}
.addIcon,
.deleteIcon {
  width: 25px;
  height: 25px;
  position: absolute;
  left: 0px;
  cursor: pointer;
}
.addIcon {
  top: 2px;
  background: url("../../assets/icon/addition_fill.svg");
  background-size: cover;
}
.addIcon:hover {
  background: url("../../assets/icon/addition.svg");
  background-size: cover;
}
.deleteIcon {
  bottom: 2px;
  background: url("../../assets/icon/delete_fill.svg");
  background-size: cover;
}
.deleteIcon:hover {
  background: url("../../assets/icon/delete.svg");
  background-size: cover;
}
.voucherContentItem,
.voucherContent > ul > li {
  height: 55px;
  position: relative;
}
.voucherContent > ul > li:first-child > ul {
  height: 55px;
  line-height: 55px;
  background: #fff;
}
.voucherContent > ul > li:first-child > ul > li:nth-of-type(3),
.voucherContent > ul > li:first-child > ul > li:nth-of-type(4) {
  line-height: 27.5px;
}
li:last-of-type > ul.voucherContentItem > li {
  width: 24%;
}
li:last-of-type > ul.voucherContentItem > li:first-of-type {
  width: 52%;
}
.voucherContentItem > li {
  width: 26%;
  height: 55px;
  line-height: 55px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  position: relative;
}
.voucherContentItem > li:first-of-type {
  border-left: 1px solid #dddddd;
}
.voucherContentItem > li:nth-of-type(3),
.voucherContentItem > li:nth-of-type(4) {
  width: 24%;
}
.voucherContentItem > li,
.voucherContentItem:nth-of-type(5) > li {
  border-right-color: #bbb;
  border-bottom-color: #bbb;
}
.voucherContentItem > li:first-of-type {
  border-left-color: #bbb;
}
.voucherContent > ul > li:first-of-type > ul > li > div ~ .money {
  border-top: 1px solid #aaa;
}
.money {
  position: relative;
  overflow: hidden;
}
.money > div {
  border-right: 1px solid #ddd;
  width: 9.09%;
  height: 100%;
  font-size: 14px;
  position: relative;
}
.money > div:nth-of-type(1) {
  border-color: #91d7f8;
}
.money > div:nth-of-type(2) {
  border-color: #83d0f3;
}
.money > div:nth-of-type(3) {
  border-color: #aee0c4;
}
.money > div:nth-of-type(4) {
  border-color: #90c9aa;
}
.money > div:nth-of-type(5) {
  border-color: #a2ceb6;
}
.money > div:nth-of-type(6) {
  border-color: #ffe8af;
}
.money > div:nth-of-type(7) {
  border-color: #f5e4b7;
}
.money > div:nth-of-type(8) {
  border-color: #f8e8bc;
}
.money > div:nth-of-type(10) {
  border-color: #f8e9be;
}
.money > div:nth-of-type(9) {
  border-color: #fca9a9;
}
.money > div:last-of-type {
  border: 0;
}
.money > .moneyInputActive {
  position: absolute;
  background: #fff;
  width: 100%;
  height: 100%;
}
.voucherFoot {
  margin: 20px 0;
}
.voucherFoot > ul > li {
  width: 20%;
  text-align: center;
}
/* .voucherFoot>ul>li>label{
        display: flex;
        justify-content: center;
        align-items: center;
    } */
.voucherFoot > ul > li > label > input {
  width: 100px;
  border: 1px solid #ccc;
}

.moneyValCon {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
  outline: 1px solid #fff;
  padding: 0 30px 0 5px;
  z-index: 5;
}
.moneyInputShow {
  opacity: 1;
}
.moneyValCon > input {
  width: 100%;
  height: 90%;
  border: 0;
  outline: 0;
  font-size: 20px;
}
.inputCancle {
  border: 1px solid red;
  width: 25px;
  height: 25px;
  line-height: 25px;
  color: red;
  cursor: pointer;
  border-radius: 50%;
  font-style: normal;
  position: absolute;
  right: 2.5px;
  top: 15px;
}
.kemu > .inputContainer > input {
  border: 0;
}
.kemu > div {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
}
.kemu > div:first-of-type > ul {
  padding: 5px 3px;
}
.kemu > div:first-of-type > ul > li:first-of-type {
  width: 100%;
  height: 30px;
  overflow-y: auto;
}
.kemu > div:first-of-type > ul > li:first-of-type > div:first-of-type {
  white-space: pre-wrap;
  width: 100%;
  text-align: left;
}
.kemu > div > ul {
  height: 100%;
}
.kemu > div > ul > li {
  float: left;
  padding: 0 3px;
  font-size: 15px;
  line-height: 15px;
}
.kemu > div {
  position: relative;
}
.kemu > div > ul > li.kemuCancle {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 10px;
  top: 15px;
  cursor: pointer;
}
.kemu > div > ul > li.kemuCancle > i {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid red;
  border-radius: 50%;
}
.kemu > div > ul > li.kemuCancle > i:before,
.kemu > div > ul > li.kemuCancle > i:after {
  width: 1px;
  height: 12px;
  content: "";
  position: absolute;
  left: 50%;
  top: 2.5px;
  background: red;
}
.kemu > div > ul > li.kemuCancle > i:before {
  transform: rotate(45deg);
}
.kemu > div > ul > li.kemuCancle > i:after {
  transform: rotate(-45deg);
}
.kemu > .assistContainer {
  background: #fff;
  position: absolute;
  height: auto;
  border-top: 1px solid #aaa;
  z-index: 99;
}
.kemu > .assistContainer > ul {
  padding: 5px;
}
.kemu > .assistContainer > ul > li {
  margin-bottom: 5px;
  float: none;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: relative;
  // padding-left:15%;
  > div {
    float: left;
    &.selectContainer {
      position: relative;
    }
  }
  .assistSelCon > ul {
    position: relative;
    z-index: 9;
  }
}
.kemu > .assistContainer > ul > li > div:nth-of-type(2) {
  width: 50%;
  position: absolute;
  height: 30px;
  right: 5px;
  top: 5px;
  > div:first-of-type {
    height: 100%;
    border: 1px solid #999;
  }
  > div:nth-of-type(2) {
    position: relative;
    z-index: 9;
    background: #00b7ee;
    color: #fff;
    font-size: 16px;
    width: 100%;
    cursor: pointer;
  }
  > ul {
    width: 100%;
    position: relative;
    background: #fff;
    border: 1px solid #999;
    border-top: 0;
    overflow: hidden;
    max-height: 150px;
    overflow-y: auto;
    > li {
      border-bottom: 1px solid #ccc;
      height: 30px;
      overflow: hidden;
      cursor: pointer;
      padding: 0 15px 0 10px;
      &:hover {
        background: #ddd;
      }
    }
  }
  > div:last-of-type {
    position: absolute;
    right: 5px;
    top: 10px;
    border: 5px solid transparent;
    border-top-color: #333;
  }
}
.kemu > .assistContainer > ul > li > div:first-of-type {
  width: 50%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.kemu > .assistContainer > a {
  display: block;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  width: 100%;
  background: #ccc;
  border-bottom: 1px solid #aaa;
}
.kemu > .assistContainer > p {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  width: 100%;
}
.kemu > .assistContainer > p > span {
  padding: 3px 10px;
  margin-left: 10px;
  border: 1px solid #02a7e7;
  border-radius: 3px;
  cursor: pointer;
}
.kemu > .assistContainer > p > span:hover {
  background: #02a7e7;
  color: #fff;
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
.chongHcss {
  color: red;
}
.gengZcss {
  color: blue;
}
.fileContainer > div {
  float: left;
  &.inputContainer {
    width: 50px;
  }
}
.addAuxiliaryVal,
.addAuxiliaryCon {
  position: -ms-page;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
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
    height: 300px;
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    padding: 5px 10px;
    > ul {
      padding: 20px 40px 0 40px;
      > li {
        height: 30px;
        line-height: 30px;
        text-align: left;
        margin-bottom: 10px;
        > div {
          display: inline-block;
          &:first-of-type {
            margin-right: 10px;
          }
        }
        &:last-of-type {
          overflow-y: auto;
          height: 67px;
          padding: 5px 20px;
        }
      }
    }
  }
}
.addAuxiliaryVal {
  .inputContainer {
    width: 320px;
  }
  > .addPage > ul > li:last-of-type {
    padding: 0;
    height: 30px;
  }
  > .addPage {
    height: 230px;
  }
}
.addPageCon {
  position: -ms-page;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
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
    height: 430px;
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    padding: 5px 10px;
    > ul {
      padding: 20px 50px 0px;
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
            width: 20%;
            background: #ccc;
            color: #fff;
            text-align: right;
            padding-right: 5px;
          }
          > div {
            float: left;
            width: 80%;
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
        height: 75px;
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
<style>
.voucherHead .el-input--suffix .el-input__inner {
  line-height: 30px;
}
</style>
