<template>
  <div class="timeSelect sl">
    <div class="container manageAdd manage-update">
      <!--<div class="choose">
            <ul class="flexPublic">
                <li @click="addFinished(true)">保存</li>
                <li @click="addFinished(false)">取消</li>
                <li @click="fresh()">刷新</li>
            </ul>
      </div>-->

      <div class="addFormContainer">
        <!--<div style="text-align: center">
                <h6 class="addTitle" v-model="titleName" v-show="showFlam">工会组织账套管理</h6>
                <h6 class="addTitle" v-show="!showFlam">机关组织账套管理</h6>
        </div>-->
        <div style="width:1024px;margin: auto;">
          <div>
            <ul class="addFormItems ul-flexChild" style="width: 50%;float: left">
              <li>
                <div class="addFormItemTitle">
                  <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                  <span>工会名称(必填)</span>
                </div>
                <div class="inputContainer">
                  <input
                    @blur="unionInput(true)"
                    type="text"
                    v-model="OrgName"
                    maxlength="80"
                  >
                </div>
              </li>
                <li v-show="showFlam">
                    <div class="addFormItemTitle">
                        <!--   <span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                        <span>组织编码类型(必填)</span>
                    </div>
                    <div class="selectContainer">
                        <select v-model="Category">
                            <option
                                v-for="item of CategoryList"
                                :key="item.id"
                                :value="item.id"
                            >{{item.name}}</option>
                        </select>
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                        <span>统一社会信用代码</span>
                    </div>
                    <div class="inputContainer">
                        <div class="inputContainer" style="height: 100%">
                            <input
                                @blur="unionInput(false)"
                                type="text"
                                placeholder="统一社会信用代码"
                                style="width: 90%"
                                v-model="EnterpriseCode"
                                maxlength="18"
                            >
                        </div>
                        <!--<div v-show="unionCss.id">请输入信用代码</div>-->
                        <div style="position: relative; top:-20px">
                            <el-upload
                                ref="uploadEnterprise"
                                class="avatar-uploader"
                                action
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :http-request="uploadFileMethodEnterprise"
                            >
                                <img
                                    v-if="EnterpriseAttachment"
                                    :src="picUrl+EnterpriseAttachment"
                                    class="avatar"
                                >
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d" v-show="!showFlam2">*</span>-->
                        <span>隶属工会(必填)</span>
                    </div>
                    <div>
                        <div class="inputContainer" style="height: 100%" @click="changeParentOrg">
                            <input disabled type="text" v-model="ParentName" placeholder>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                        <span>工会主席(必填)</span>
                    </div>
                    <div class="inputContainer">
                        <div class="inputContainer" style="height: 100%">
                            <input
                                style="width: 90%"
                                type="text"
                                v-model="Chairman"
                                maxlength="20"
                            >
                        </div>
                        <!--<div @click="testFile">附件</div>-->
                        <!--<el-button type="primary" round @click="testFile">附件</el-button>-->
                        <!--<input @change="getFile($event)" type="file">-->
                        <div style="position: relative; top: -20px">
                            <el-upload
                                ref="uploadChairman"
                                class="avatar-uploader"
                                action
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :http-request="uploadFileMethodChairman"
                            >
                                <img
                                    v-if="ChairmanAttachment"
                                    :src="picUrl+ChairmanAttachment"
                                    class="avatar"
                                >
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <span>财务主管(必填)</span>
                    </div>
                    <div class="inputContainer">
                        <input type="text" v-model="Treasurer" maxlength="20">
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <span>记账</span>
                    </div>
                    <div class="inputContainer">
                        <input type="text" v-model="AccountPeople" maxlength="20">
                    </div>
                </li>
                <li v-show="showFlam">
                    <div class="addFormItemTitle">银行账户号</div>
                    <div class="inputContainer">
                        <input type="text" v-model="FinanceAccount" maxlength="20">
                    </div>
                </li>

            </ul>
            <ul class="addFormItems ul-flexChild" style="width: 50%;float: left">
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d" v-show="!showFlam2">*</span>-->
                        <span>单位所属行业(必填)</span>
                    </div>
                    <div>
                        <div class="inputContainer" style="height: 100%" @click="openTrade()">
                            <input disabled type="text" v-model="IndustryName" placeholder>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                        <span>工会编码</span>
                    </div>
                    <div class="inputContainer">
                        <input @blur="unionInput(true)" type="text" v-model="UserAccount" maxlength="20">
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">联系电话</div>
                    <div>
                        <!--<div class="selectContainer">-->
                        <!--<select name="phoneHead" v-model="phoneHead" style="background: transparent">-->
                        <!--<option v-for="item in phoneHeadValues" :key="item.id" :value="item.id">{{item.name}}-->
                        <!--</option>-->
                        <!--</select>-->
                        <!--</div>-->
                        <!--<div>-</div>-->
                        <div class="inputContainer" style="height: 100%">
                            <input type="text" v-model="Telephone" placeholder="请输入联系电话" maxlength="20">
                        </div>
                    </div>
                </li>
                <li v-show="showFlam">
                    <div class="addFormItemTitle">会计制度</div>
                    <div class="inputContainer">
                        <input
                            type="text"
                            v-model="AccountSystem"
                            maxlength="20"
                            disabled
                            style="color:darkgray"
                        >
                        <!--<select name="unionOwner" v-model="AccountSystem">
                      <option v-for="item of AccountSystemValues" :key="item.id" :value="item.id">{{item.name}}
                      </option>
                        </select>-->
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                        <span>经审主任(必填)</span>
                    </div>
                    <div class="inputContainer">
                        <input type="text" v-model="Director" maxlength="20">
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                        <span>出纳</span>
                    </div>
                    <div class="inputContainer">
                        <input type="text" v-model="Cashier" maxlength="20">
                    </div>
                </li>
                <li v-show="showFlam">
                    <div class="addFormItemTitle">开户行名称</div>
                    <div class="inputContainer">
                        <input type="text" v-model="BankName" maxlength="20">
                    </div>
                </li>
                <li v-show="showFlam">
                    <div class="addFormItemTitle">开户行号</div>
                    <div class="inputContainer">
                        <input type="text" v-model="BankAccount" maxlength="20">
                    </div>
                </li>
            </ul>


          </div>

          <div class="longUl" style="clear: both;width: 100%;padding-top: 1px">
            <ul class="addFormItems ul-flexChild" style="float:none;width: 100%;">
              <li v-show="!showFlam">
                <div class="addFormItemTitle">
                  <!-- <span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                  <span>工会层级(必填)</span>
                </div>
                <div class="inputContainer" style="height: 100%">
                  <el-select
                    v-model="Layers"
                    placeholder="请选择"
                    style="height: 41px;line-height: 41px"
                  >
                    <el-option
                      v-for="item in layerList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <!--<div v-show="unionCss.name">请输入工会编码</div>-->
              </li>

              <li>
                <div class="addFormItemTitle">
                  <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                  <span>单位地址(必填)</span>
                </div>
                <div class="block flexPublic">
                  <div class style="height: 30px;width: 200px;">
                    <el-select
                      v-model="Province"
                      filterable
                      placeholder="请选择省"
                      @change="changeProvince"
                    >
                      <el-option
                        v-for="item in ProvinceValue"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>-</div>
                  <div class style="height: 30px;width: 200px;">
                    <el-select v-model="City" filterable placeholder="请选择市" @change="changeCity">
                      <el-option
                        v-for="item in CityValue"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>-</div>
                  <div class style="height: 30px;width: 200px;">
                    <el-select
                      v-model="County"
                      filterable
                      placeholder="请选择县"
                      @change="changeCounty"
                    >
                      <el-option
                        v-for="item in CountyValue"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>-</div>
                  <div class style="height: 30px;width: 200px;">
                    <el-select
                      v-model="Street"
                      filterable
                      placeholder="请选择街道"
                      @change="changeStreet"
                    >
                      <el-option
                        v-for="item in StreetValue"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </li>
              <li>
                <div class="addFormItemTitle"></div>
                <div class="inputContainer">
                  <input
                    style="width: 100%;margin: 0px;border-width: 0 0 1px 0;"
                    class="addressDetail"
                    type="text"
                    v-model="Address"
                    placeholder="请输入详细地址"
                  >
                </div>
              </li>
                <li v-show="showFlam">
                    <div class="addFormItemTitle">创建日期</div>
                    <div>
                        <el-date-picker v-model="EnableTime" disabled type="date" placeholder="选择日期"></el-date-picker>
                    </div>
                </li>
              <li>
                <div class="addFormItemTitle">服务期限</div>
                <div>
                  <el-date-picker
                    v-model="ServiceStartTime"
                    type="date"
                    disabled
                    placeholder="开始日期"
                  ></el-date-picker>
                  <div>-</div>
                  <el-date-picker v-model="ServiceEndTime" type="date" disabled placeholder="结束日期"></el-date-picker>
                </div>
              </li>
            </ul>
          </div>

          <div class="choose">
            <ul class>
              <li @click="addFinished(false)">取消</li>
              <li @click="fresh()">刷新</li>
              <li @click="addFinished(true)">保存</li>
              <!--<li><a href="">附件?</a></li>-->
            </ul>
          </div>
        </div>
      </div>

      <!-- 隶属工会选择 -->
      <el-dialog
        :title="'隶属工会选择'"
        class="organizeParent"
        :visible.sync="choosePerantOrg"
        width="550px"
        style="height: 800px"
      >
        <div class="organizeParentNow" v-if="showDialog">
          <div>
            <span>当前选择：</span>
            <el-input v-model="momentOrg" :disabled="true" style="width: 150px"></el-input>
          </div>
          <div style="border: 1px solid #909399; margin-top: 10px;height: 270px">
            <div class="promptW" style="border-bottom: 1px solid #909399; text-align: center">
              <el-input
                v-model="prompt"
                :disabled="true"
                style="width: 100%;color:#FFFFFF; text-align: center"
              ></el-input>
            </div>
            <div style="width: 100%; height: 10px;">
              <div
                style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;"
              >省</div>
              <div
                style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;"
              >市</div>
              <div
                style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;"
              >区</div>
              <div
                style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;"
              >街道</div>
            </div>
            <div style="margin-top: 10px; height: 100%;" class="addressStyle">
              <div style="width: 25%; float: left">
                <el-select
                  v-model="ProvinceTwo"
                  placeholder="请选择"
                  filterable
                  style="width: 95%"
                  @change="changeProvinceTwo"
                >
                  <el-option
                    v-for="item in ProvinceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >{{item.label}}</el-option>
                </el-select>
              </div>
              <div style="width: 25%; float: left;">
                <!--<span>省</span>-->
                <el-select
                  v-model="CityTwo"
                  placeholder="请选择"
                  filterable
                  style="width: 95%"
                  @change="changeCityTwo"
                >
                  <el-option
                    v-for="item in CityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >{{item.label}}</el-option>
                </el-select>
              </div>
              <div style="width: 25%; float: left;">
                <!--<span>市</span>-->
                <el-select
                  v-model="CountyTwo"
                  placeholder="请选择"
                  filterable
                  style="width: 95%"
                  @change="changeCountyTwo"
                >
                  <el-option
                    v-for="item in CountyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >{{item.label}}</el-option>
                </el-select>
              </div>
              <div style="width: 25%; float: left;">
                <!--<span>区</span>-->
                <el-select
                  v-model="StreetTwo"
                  placeholder="请选择"
                  filterable
                  style="width: 95%"
                  @change="changeStreetTwo"
                >
                  <el-option
                    v-for="item in StreetList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >{{item.label}}</el-option>
                </el-select>
              </div>

              <!--<span>街道</span>-->
            </div>
          </div>
        </div>
        <div v-if="!showDialog" style="overflow: hidden">
          <div class="organizeSearch">
            <span>当前选择：</span>
            <el-input v-model="momentOrg" :disabled="true" style="width: 120px"></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchParentOrg"
              style="float: right"
            >搜索</el-button>
            <el-input
              v-model="select_word"
              placeholder="隶属工会名称"
              prefix-icon="el-icon-search"
              style="width: 200px;float: right"
              class="handle-input mr10"
            ></el-input>
          </div>
          <div style="border: 1px solid #909399; margin-top: 10px;height: 270px">
            <div class="promptW" style="border-bottom: 1px solid #909399; text-align: center">
              <el-input v-model="prompt" :disabled="true" style="width: 100%;color:#FFFFFF"></el-input>
            </div>
            <div class="promptW promptWhite">
              <el-input v-model="allAddressName" :disabled="true" style="width: 100%;color:#FFFFFF"></el-input>
            </div>
            <div
              style="margin-top: 10px;height: 170px;overflow-y: scroll;text-align: center;width: 105%;"
              class="addressStyle"
            >
              <!--<template>-->
              <!--<el-select v-model="ParentOrg" filterable placeholder="请选择">-->
              <!--<el-option-->
              <!--v-for="item in ParantOrgList"-->
              <!--:key="item.PhId"-->
              <!--:label="item.OrgName"-->
              <!--:value="item">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <!--</template>-->
              <ul v-if="showNoSearch">
                <li
                  class="ParantOrgListW"
                  v-for="item in ParantOrgList"
                  style="height: 25px;line-height: 25px;font-size: 15px;cursor: pointer;text-align: left;padding-left:40px"
                  @click.stop="changeParentOrgTwo(item,$event)"
                >{{item.OrgName}}</li>
              </ul>
              <ul v-if="!showNoSearch">
                <li
                  class="ParantOrgListW"
                  v-for="item in ParantOrgListS"
                  style="height: 25px;line-height: 25px;font-size: 15px;cursor: pointer;text-align: left;padding-left:40px"
                  @click.stop="changeParentOrgTwo(item,$event)"
                >{{item.OrgName}}</li>
              </ul>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" v-if="showDialog">
          <el-button
            @click="choosePerantOrg = false"
            style="color: #00B8EE; border-color: #00B8EE;"
          >取 消</el-button>
          <el-button type="primary" @click="nextStep()">下一步</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="!showDialog">
          <el-button @click="backStep()">上一步</el-button>
          <el-button type="primary" @click="choosePerantOrg = false">确 定</el-button>
        </span>
      </el-dialog>
        <!--单位所属行业选择-->
        <el-dialog :title="'单位所属行业选择'" class="organizeParent" :visible.sync="chooseTrade" width="450px">
            <div style="height: 500px;padding: 0 20px">
                <trade @getTrade="getTrade" @closeBtn="closeTrade" :data="tradeData" :default-value="defaultTradeValue" ></trade>
            </div>
        </el-dialog>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <message :visible.sync="message.visible"  :message='message.message' @close="closeTip()"></message>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import qs from 'qs'
import { mapState, mapActions } from 'vuex'
import UserInfo from '@/util/auth'
import pictureUpload from '@/components/upload'
import httpConfig from '@/util/ajaxConfig'
import Trade from "../../../components/trade/trade"; //自定义ajax头部配置*****

export default {
  name: 'manage-update',
  data() {
    return {
      EmpowerInfo: "",
      OrgNature:'',//临时组织
      qLayer: '', //父级工会的层级
      showDialog: true,
      showNoSearch: true,
      qAdressName: '',
      ParantOrgList: [],
      ParantOrgListS: [],
      select_word: '',
      ParentOrg: '', //隶属公会
      ParentOrgList: [], //隶属工会列表
      allAddressName: '', //所选地址
      prompt: '工会所属地区选择',
      ProvinceTwo: '',
      ProvinceList: [],
      CityTwo: '',
      CityList: [],
      CountyTwo: '',
      CountyList: [],
      StreetTwo: '',
      StreetList: [],
      momentOrg: '',
      choosePerantOrg: false,
      PhId: '',
      file: '1',
      OrgName: '',
      Layers: '',
      EnCode: '', //组织编码
      UserAccount: '', //工会编码
      EnterpriseCode: '',
      Address: '',
      phoneHead: '1',
      MobilePhone: '',
      Telephone: '',
      Chairman: '工会主席',
      EnableTime: '',
      EnterpriseAttachment: '',
      Verify: '0',
      VerifyDt: '',
      VerifyOpinion: '',
      ChairmanAttachment: '',
      showFlam: this.$route.query.showFlam,
      ServiceStartTime: '',
      ServiceEndTime: '',
      ParentId: '',
      ParentCode: '',
      Parent: '',
      ParentName: '',
      AccountSystem: '工会会计制度2009版',
      Director: '',
      Treasurer: '', //财务主管
      Cashier: '', //出纳
      ParentNameValues: [],
      Province: '',
      City: '',
      County: '',
      Street: '',
      Integrity: '',
      NgRecordVer: '',
      UserAccount: '',
      FinanceAccount: '',
      BankName: '',
        AccountPeople:'',
      BankAccount: '',
      InvitationCode: '',
      ProvinceValue: [],
      CityValue: [],
      CountyValue: [],
      StreetValue: [],
      layerList: [
        {
          value: '1',
          label: '省级'
        },
        {
          value: '2',
          label: '市级'
        },
        {
          value: '3',
          label: '区级'
        },
        {
          value: '4',
          label: '街道'
        }
      ],
      Category: '',
      CategoryList: [
        { id: 'basic', name: '一般工会' },
        { id: 'industry', name: '产业工会' }
      ],
      AccountSystemValues: [
        { id: '0', name: '工会会计制度2009版' },
        { id: '1', name: '工会会计制度2008版' }
      ],
      phoneHeadValues: [
        { id: '0', name: '手机号' },
        { id: '1', name: '0571' },
        { id: '2', name: '010' },
        {
          id: '3',
          name: '021'
        }
      ],
      unionCss: { name: false, id: false },
      //日期选择器data******************************
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
        // 单位所属行业
        chooseTrade:false,
        trade:{
          Code:'',
            Value:""
        },
        tradeData:[],
        defaultTradeValue:'',
        IndustryType:'',
        IndustryName:'',
        message:{
            visible:false,
            message:'修改成功'
        }
    }
  },
  components: {
      Trade,
    pictureUpload
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      orgid: state => state.user.orgid
    }),
    picUrl: function() {
      return httpConfig.baseurl
    }
  },
  // mounted: function () {
  //     //this.getNodes();
  //     this.selectParentName();
  //     this.selectArea("0", 0);
  // },
  created() {
    if (this.$route.query.showFlam) {
      this.$store.commit('tagNav/upexcludeArr', [])
      this.showFlam = this.$route.query.showFlam
    }
    this.loadTrade()
  },
    watch:{

    },
  methods: {
    ...mapActions({
      uploadFile: 'uploadFile/Orgupload'
    }),
    //刷新页面
    fresh() {
      //this.selectParentName();
      this.selectArea('0', 0)
      this.init()
    },
    //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isRightType) {
        this.$message.error('上传图片只能是 JPG,png,gif,jpeg 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    uploadFileMethodEnterprise(param) {
      let fileObject = param.file
      let formData = new FormData()
      //formData.append('id', this.PhId)
      formData.append('file', fileObject)

      this.uploadFile(formData)
        .then(res => {
          if (res.Status === 'error') {
            this.$message.error(res.Msg)
            return
          }
          //回传的上传临时文件
          if (res.Data[0]) {
            this.EnterpriseAttachment = res.Data[0]
            this.$message.success('上传成功')
          }
        })
        .catch(error => {
          console.log(error)
          this.$message({
            showClose: true,
            message: '上传附件失败',
            type: 'error'
          })
        })
    },
    uploadFileMethodChairman(param) {
      let fileObject = param.file
      let formData = new FormData()
      //formData.append('id', this.orgForm.PhId)
      formData.append('file', fileObject)

      this.uploadFile(formData)
        .then(res => {
          if (res.Status === 'error') {
            this.$message.error(res.Msg)
            return
          }

          //回传的上传临时文件
          if (res.Data[0]) {
            this.ChairmanAttachment = res.Data[0]
            this.$message.success('上传成功')
          }
        })
        .catch(error => {
          console.log(error)
          this.$message({
            showClose: true,
            message: '上传附件失败',
            type: 'error'
          })
        })
    },
    handleChange(value) {
      //地址选择器的值******************
    },
    unionInput(bool) {
      if (bool) {
        if (!this.unionName) {
          this.unionCss.name = true
        } else {
          this.unionCss.name = false
        }
      } else {
        if (!this.unionId) {
          this.unionCss.id = true
        } else {
          this.unionCss.id = false
        }
      }
    },
    //新的改变隶属工会信息
    changeParentOrgTwo(item, event) {
      console.log(item)
      var lis = document.getElementsByClassName('ParantOrgListW')
      for (var li of lis) {
        li.style.background = '#fff'
      }
      event.target.style.background = '#ccc'
      this.Parent = item
      this.ParentId = item.PhId
      this.ParentCode = item.EnCode
      this.ParentName = item.OrgName
      this.Layers = item.Layers + 1
      this.$forceUpdate()
    },
    //搜索隶属工会名
    searchParentOrg() {
      if (this.select_word == '' || this.select_word == null) {
        this.showNoSearch = true
      } else {
        this.ParantOrgListS = []
        this.showNoSearch = false
        for (let i = 0; i < this.ParantOrgList.length; i++) {
          console.log(this.ParantOrgList[i].OrgName)
          if (this.ParantOrgList[i].OrgName.indexOf(this.select_word) > -1) {
            this.ParantOrgListS.push(this.ParantOrgList[i])
          }
        }
      }
    },
    //根据所选地址信息获取隶属工会列表
    getParentByAreaTwo(i, area, phid) {
      var data = {
        layer: i,
        areaCode: area,
        organizeId: phid
      }
      this.$axios
        .get('/SysOrganize/GetParentOrganizeByArea', { params: data })
        .then(res => {
          console.log(res)
          this.ParantOrgList = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    //查询地区
    selectAreaTwo(Area, i) {
      var data = {
        uid: '0',
        orgid: '0',
        id: Area
      }
      this.$axios
        .get('/SysArea/GetAreaList', { params: data })
        .then(res => {
          console.log(res)
          if (i == 0) {
            this.ProvinceList = res
          } else if (i == 1) {
            this.CityList = res
          } else if (i == 2) {
            this.CountyList = res
          } else if (i == 3) {
            this.StreetList = res
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //改变省级
    changeProvinceTwo() {
      this.CityTwo = ''
      this.CountyTwo = ''
      this.StreetTwo = ''
      this.CityList = []
      this.CountyList = []
      this.StreetList = []
      this.selectAreaTwo(this.ProvinceTwo, 1)
      this.momentOrg = '省级工会'
      this.qLayer = 1
      //this.allAddressName = this.ProvinceTwo.label;
      //this.getParentByAreaTwo(1, this.ProvinceTwo.value, 0);
    },
    //改变市级
    changeCityTwo() {
      this.CountyTwo = ''
      this.StreetTwo = ''
      this.CountyList = []
      this.StreetList = []
      this.selectAreaTwo(this.CityTwo, 2)
      this.momentOrg = '市级工会'
      this.qLayer = 2
      //this.allAddressName = this.ProvinceTwo.label + ">" + this.CityTwo.label;
      //this.getParentByAreaTwo(2, this.CityTwo.value, 0);
    },
    //改变区级
    changeCountyTwo() {
      this.StreetTwo = ''
      this.StreetList = []
      this.selectAreaTwo(this.CountyTwo, 3)
      this.momentOrg = '区级工会'
      this.qLayer = 3
      //this.allAddressName = this.ProvinceTwo.label + ">" + this.CityTwo.label + ">" + this.CountyTwo.label;
      //this.getParentByAreaTwo(3, this.CountyTwo.value, 0);
    },
    //改变街道
    changeStreetTwo() {
      this.momentOrg = '街道工会'
      this.qLayer = 4
      //this.allAddressName = this.ProvinceTwo.label + ">" + this.CityTwo.label + ">" + this.CountyTwo.label + ">" + this.StreetTwo.label;
      //this.getParentByAreaTwo(4, this.StreetTwo.value, 0);
    },
    //上一步
    backStep() {
      this.prompt = '工会所属地区选择'
      this.showDialog = true
    },
    //下一步
    nextStep() {
      //this.ParantOrgList=[];
      if (this.ProvinceTwo != '') {
        this.qLayer = 1
      }
      if (this.CityTwo != '') {
        this.qLayer = 2
      }
      if (this.CountyTwo != '') {
        this.qLayer = 3
      }
      if (this.StreetTwo != '') {
        this.qLayer = 4
      }
      if (this.qLayer == 1) {
        this.momentOrg = '省级工会'
        this.getallAddressName(this.ProvinceTwo)
        this.getParentByAreaTwo(this.qLayer, this.ProvinceTwo, this.PhId)
      } else if (this.qLayer == 2) {
        this.momentOrg = '市级工会'
        this.getallAddressName(this.CityTwo)
        this.getParentByAreaTwo(this.qLayer, this.CityTwo, this.PhId)
      } else if (this.qLayer == 3) {
        this.momentOrg = '区级工会'
        this.getallAddressName(this.CountyTwo)
        this.getParentByAreaTwo(this.qLayer, this.CountyTwo, this.PhId)
      } else if (this.qLayer == 4) {
        this.momentOrg = '街道工会'
        this.getallAddressName(this.StreetTwo)
        this.getParentByAreaTwo(this.qLayer, this.StreetTwo, this.PhId)
      }
      this.prompt = '工会选择'
      this.showDialog = false
    },
    //获取地址名全称
    getallAddressName(area) {
      var data = {
        areaId: area
      }
      this.$axios
        .get('/SysArea/GetAllAreaName', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.allAddressName = res.Data
          }
          //this.allAddressName = JSON.parse(res);
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    //改变机关工会层级
    changeLayer() {
      //this.selectArea()
    },
    //改变隶属工会
    changeParentOrg() {
      this.showDialog = true
      this.choosePerantOrg = true
      // console.log(this.Parent);
      // this.ParentId = this.Parent.PhId;
      // this.ParentName = this.Parent.OrgName;
      // this.ParentCode = this.Parent.EnCode;
    },
    //改变省级地址
    changeProvince() {
      console.log(this.Province)
      this.StreetValue = []
      this.CountyValue = []
      this.CityValue = []
      this.selectArea(this.Province, 1)
    },
    //改变市级地址
    changeCity() {
      this.StreetValue = []
      this.CountyValue = []
      this.selectArea(this.City, 2)
      // if(!this.showFlam){
      //     if(this.Layers == '2'){
      //         this.getParentByArea(1, this.Province);
      //     }
      // }
    },
    //改变区级地址
    changeCounty() {
      this.StreetValue = []
      this.selectArea(this.County, 3)
      // if(!this.showFlam){
      //     if(this.Layers == '3'){
      //         this.getParentByArea(2, this.City);
      //     }
      // }
    },
    //改变街道后的点击事件
    changeStreet() {
      // if(!this.showFlam){
      //     if(this.Layers == '4'){
      //         this.getParentByArea(3, this.County);
      //     }
      // }else{
      //     this.getParentByArea(4, this.Street);
      // }
    },
    //根据选择的地址获取父级机关工会
    // getParentByArea(i, area){
    //     var data = {
    //         rank: i,
    //         areaCode: area
    //     }
    //     this.$axios.get('/SysAdminOrganize/GetParentAdminOrganizeByArea', {params: data})
    //         .then(res => {
    //             console.log(res);
    //             this.ParentNameValues = res;
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // },
    selectArea(Area, i) {
      var data = {
        uid: '0',
        orgid: '0',
        id: Area
      }
      console.log('data:',data)
      this.$axios
        .get('/SysArea/GetAreaList', { params: data })
        .then(res => {
          console.log(res)
          if (i == 0) {
            this.ProvinceValue = res
          } else if (i == 1) {
            this.CityValue = res
          } else if (i == 2) {
            this.CountyValue = res
          } else if (i == 3) {
            this.StreetValue = res
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectParentName() {
      var data = {
        uid: '0',
        orgid: '0',
        pagesize: this.pageSize,
        pageindex: this.pageIndex - 1
      }
      this.$axios
        .get('/SysAdminOrganize/GetSysAdminOrganizeList', { params: data })
        .then(res => {
          console.log(res.Record)
          this.ParentNameValues = res.Record
          let item
          console.log(this.ParentNameValues)
          for (item of this.ParentNameValues) {
            if (this.ParentId == item.PhId) {
              this.Parent = item
            }
          }
          console.log(this.Parent)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAdminOrganize(phid) {
      var data = {
        id: phid
      }
      this.$axios
        .get('/SysAdminOrganize/GetSysAdminOrganize', { params: data })
        .then(res => {
          this.Parent = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    addFinished(bool) {
      if (!bool) {
        //this.$router.go(-1);
        this.$store.commit('tagNav/removeTagNav', this.$route)
        this.$router.push({ path: '/admin/orgin' })
      } else {
        let formData = new FormData()
        //文件上传预留****************************
        /* let config = {
                       headers: {
                         'content-Type': 'multipart/form-data'
                       }
                     }
                     formData.append('unionId',this.unionId);
                     formData.append('file',this.file);*/
        if (this.$route.query.showFlam) {
          this.Integrity = '80'
          let reg = /[0-9,A-Z,a-z]{18}/
          if (
            !reg.test(this.EnterpriseCode) &&
            !(this.EnterpriseCode == null || this.EnterpriseCode == '')
          ) {
            this.$message.error(
              '统一社会信用代码格式不正确,请输入18位数字或字母!'
            )
            return
          }
          //控制产业工会与一般工会的添加
          if (this.Layers >= 5) {
            if (this.Category == 'industry') {
              this.$message.error('保存失败,街道级工会下无法新增产业工会!')
              return
            }
          } else {
            if (this.Category == 'basic') {
              this.$message.error('保存失败,一般工会只能新增在街道工会下!')
              return
            }
          }
          var page = {
            PhId: this.PhId,
            Province: this.Province,
            City: this.City,
            County: this.County,
            Street: this.Street,
            file: this.file,
            OrgName: this.OrgName,
            EnCode: this.EnCode,
            UserAccount: this.UserAccount,
              AccountPeople:this.AccountPeople,
            EnterpriseCode: this.EnterpriseCode,
            Category: this.Category,
            Address: this.Address,
            //'phoneHead': this.phoneHead,
            //'MobilePhone': this.MobilePhone,
            Telephone: this.Telephone,
            Chairman: this.Chairman,
            EnableTime: this.EnableTime,
            ServiceStartTime: this.ServiceStartTime,
            ServiceEndTime: this.ServiceEndTime,
            ParentName: this.ParentName,
            ParentId: this.ParentId,
            ParentEnCode: this.ParentCode,
            AccountSystem: this.AccountSystem,
            Verify: this.Verify,
            Integrity: this.Integrity,
            Director: this.Director,
            Treasurer: this.Treasurer,
            Cashier: this.Cashier,
            EnterpriseAttachment: this.EnterpriseAttachment,
            ChairmanAttachment: this.ChairmanAttachment,
            FinanceAccount: this.FinanceAccount,
            BankName: this.BankName,
            Layers: this.Layers,
            UserAccount: this.UserAccount,
              AccountPeople:this.AccountPeople,
            BankAccount: this.BankAccount,
            InvitationCode: this.InvitationCode,
            NgRecordVer: this.NgRecordVer,
            OrgNature: this.OrgNature,
              IndustryType:this.IndustryType,
              EmpowerInfo:this.EmpowerInfo
          }
          console.log(page)
          if (
            this.Province != '' &&
            this.City != '' &&
            this.County != '' &&
            this.Street != '' &&
            this.OrgName != '' &&
            this.Chairman != '' &&
            this.Address != '' &&
            this.Category != '' &&
            this.Treasurer != '' &&
            this.ParentCode != '' &&
            this.Director != '' &&
            this.Province != null &&
            this.City != null &&
            this.County != null &&
            this.Street != null &&
            this.OrgName != null &&
            this.Chairman != null &&
            this.Category != null &&
            this.Address != null &&
            this.ParentCode != null &&
            this.Director != null &&
            this.Treasurer != null &&
              this.IndustryType !=null
          ) {
            if (
              this.EnterpriseAttachment != null &&
              this.EnterpriseAttachment != ''
            ) {
              this.Integrity = parseInt(this.Integrity) + 5
            }
            if (
              this.ChairmanAttachment != null &&
              this.ChairmanAttachment != ''
            ) {
              this.Integrity = parseInt(this.Integrity) + 5
            }
            if (this.Telephone != null && this.Telephone != '') {
              let reg2 = /^[0-9]{11}$/
              if (!reg2.test(this.Telephone)) {
                this.$message.error('手机号输入错误，请重试！')
                return
              }
              this.Integrity = parseInt(this.Integrity) + 10
            }
            page.Integrity = this.Integrity
            var data = {
              uid: '0',
              orgid: '0',
              infoData: page
            }
            const loading = this.$loading()
            this.$axios.post('/SysOrganize/PostUpdate', data).then(res => {
              loading.close()
              console.log(res)
              if (res.Status == 'success') {
                // this.$message.success('修改成功')
                  this.message.visible =true
                // this.$store.commit("tagNav/upexcludeArr", ['basicUnion']);
                this.$store.commit('tagNav/removeTagNav', this.$route)
                // this.$router.push({ path: '/admin/orgin' })
              } else {
                if (res.Status == 'error') {
                  this.$message.error(res.Msg)
                } else {
                  this.$message.error('修改失败,请重试!')
                }
                //this.$message.error('修改失败,请重试!')
              }
            })
          } else {
            this.$message.error('请将必填信息填写完整再保存,请重试!')
          }
        } else {
          var page = {
            PhId: this.PhId,
            Province: this.Province,
            City: this.City,
            County: this.County,
            Street: this.Street,
            file: this.file,
            OrgName: this.OrgName,
            EnCode: this.EnCode,
            EnterpriseCode: this.EnterpriseCode,
            Address: this.Address,
            //'phoneHead': this.phoneHead,
            Telephone: this.Telephone,
            //'Telephone': this.Telephone,
            Chairman: this.Chairman,
            ServiceStartTime: this.ServiceStartTime,
            ServiceEndTime: this.ServiceEndTime,
            ParentName: this.ParentName,
            ParentId: this.ParentId,
            ParentEnCode: this.ParentCode,
            Director: this.Director,
            Treasurer: this.Treasurer,
            Cashier: this.Cashier,
            Verify: this.Verify,
            Layers: this.Layers,
            UserAccount: this.UserAccount,
              AccountPeople:this.AccountPeople,
            EnterpriseAttachment: this.EnterpriseAttachment,
            ChairmanAttachment: this.ChairmanAttachment,
            NgRecordVer: this.NgRecordVer,
              EmpowerInfo:this.EmpowerInfo
          }
          if (
            this.Province != '' &&
            this.City != '' &&
            this.County != '' &&
            this.Street != '' &&
            this.OrgName != '' &&
            this.EnterpriseCode != '' &&
            this.Chairman != '' &&
            this.Director != '' &&
            this.EnCode != '' &&
            this.Address != '' &&
            this.Treasurer != '' &&
            this.Province != null &&
            this.City != null &&
            this.County != null &&
            this.Treasurer != null &&
            this.Street != null &&
            this.OrgName != null &&
            this.EnterpriseCode != null &&
            this.Chairman != null &&
            this.Director != null &&
            this.EnCode != null &&
            this.Address != null
          ) {
            var data = {
              uid: '0',
              orgid: '0',
              infoData: page
            }
            this.$axios.post('/SysAdminOrganize/PostUpdate', data).then(res => {
              console.log(res)
              if (res.Status == 'success') {
                this.$message.success('修改成功')
                this.$store.commit('tagNav/removeTagNav', this.$route)
                // this.$store.commit("tagNav/upexcludeArr", ['union']);
                this.$router.push({ path: '/admin/orgin' })
              } else {
                if (res.Status == 'error') {
                  this.$message.error(res.Msg)
                } else {
                  this.$message.error('修改失败,请重试!')
                }
              }
            })
          } else {
            this.$message.error('请将必填信息填写完整再保存,请重试!')
          }
        }

        // var data = {
        //     uid: "0",
        //     orgid: "0",
        //     infoData: page
        // };
        // this.$axios.post("/SysOrganize/PostUpdate", data)
        //     .then(res => {
        //         if (res.Status == 'success') {
        //             this.$router.push({path: '/'})
        //         }
        //     })
      }
    },
    getFile($event) {
      this.file = $event.target.files[0]
    },
    init() {
      var PhIdList = this.$route.query.PhId
      var data = {
        id: PhIdList
      }
      console.log(PhIdList)
      //data.id=JSON.parse(data.infoData).PhId;
      if (this.$route.query.showFlam) {
        this.$axios
          .get('/SysOrganize/GetSysOrganize', { params: data })
          .then(res => {
            console.log(res)
            this.PhId = res.PhId
            this.OrgName = res.OrgName
            this.EnCode = res.EnCode
            this.UserAccount = res.UserAccount
              this.AccountPeople = res.AccountPeople
            this.EnterpriseCode = res.EnterpriseCode
            this.Address = res.Address
            this.Category = res.Category
            //this.Telephone = res.Telephone;
            this.Telephone = res.TelePhone
            this.Chairman = res.Chairman
            this.Director = res.Director
            this.Treasurer = res.Treasurer
            this.Cashier = res.Cashier
            this.EnableTime = res.EnableTime
            this.ServiceStartTime = res.ServiceStartTime
            this.ServiceEndTime = res.ServiceEndTime
            this.Parent = res.ParentId
            this.ParentId = res.ParentId
            this.ParentCode = res.ParentEnCode
            this.ParentName = res.ParentName
            if (res.AccountSystem == '' || res.AccountSystem == null) {
              this.AccountSystem = '工会会计制度2009版'
            } else {
              this.AccountSystem = res.AccountSystem
            }
            this.Province = res.Province
            this.City = res.City
            this.County = res.County
            this.Street = res.Street
            this.EnterpriseAttachment = res.EnterpriseAttachment
            this.ChairmanAttachment = res.ChairmanAttachment
            this.NgRecordVer = res.NgRecordVer
            this.FinanceAccount = res.FinanceAccount
            this.BankName = res.BankName
            this.BankAccount = res.BankAccount
            this.Verify = res.Verify
            this.Integrity = res.Integrity
            this.Layers = res.Layers
            this.UserAccount = res.UserAccount
              this.AccountPeople=res.AccountPeople
            this.InvitationCode = res.InvitationCode
            this.OrgNature = res.OrgNature;
              this.IndustryType = res.IndustryType
              this.IndustryName = res.IndustryName
            this.defaultTradeValue =res.IndustryType

              this.EmpowerInfo = res.EMPOWERINFO
            console.log(this.County)
            this.selectArea(this.Province, 1)
            this.selectArea(this.City, 2)
            this.selectArea(this.County, 3)
            //this.getParentByArea(4, res.Street);
            this.getAdminOrganize(res.ParentId)
          })
      } else {
        this.$axios
          .get('/SysAdminOrganize/GetSysAdminOrganize', { params: data })
          .then(res => {
            console.log(res)
            this.PhId = res.PhId
            this.OrgName = res.OrgName
            this.EnCode = res.EnCode
            this.EnterpriseCode = res.EnterpriseCode
            this.Address = res.Address
            //this.MobilePhone = res.MobilePhone;
            this.Telephone = res.TelePhone
            this.Chairman = res.Chairman
            this.Director = res.Director
            this.Treasurer = res.Treasurer
            this.Cashier = res.Cashier
            this.ServiceStartTime = res.ServiceStartTime
            this.ServiceEndTime = res.ServiceEndTime
            //this.Parent = res.ParentId;
            this.ParentId = res.ParentId
            this.Parent = res.ParentName
            this.ParentCode = res.ParentEnCode
            this.ParentName = res.ParentName
            this.Province = res.Province
            this.City = res.City
            this.County = res.County
            this.Street = res.Street
            this.NgRecordVer = res.NgRecordVer
            this.UserAccount = res.UserAccount
              this.AccountPeople = res.AccountPeople
            this.Layers = String(res.Layers)

              this.EmpowerInfo = res.EMPOWERINFO
            // if(res.Layers <= 4 && res.Layers >= 1) {
            //     this.layerList[res.Layers -1]
            // }
            this.Verify = res.Verify
            console.log(this.County)
            this.selectArea(this.Province, 1)
            this.selectArea(this.City, 2)
            this.selectArea(this.County, 3)
            // if(res.Layers == '2'){
            //     this.getParentByArea(1, res.Province);
            // }
            // if(res.Layers == '3'){
            //     this.getParentByArea(2, res.City);
            // }
            // if(res.Layers == '4'){
            //     this.getParentByArea(3, res.County);
            // }
            // if(res.Street != null && res.Street != ""){
            //     this.getParentByArea(3, res.County);
            // }else{
            //     if(res.County != null && res.County != ""){
            //         this.getParentByArea(2, res.City);
            //     }else{
            //         if(res.City != null && res.City != ""){
            //             this.getParentByArea(1, res.Province);
            //         }
            //     }
            // }
            if (res.ParentId != '0') {
              this.getAdminOrganize(res.ParentId)
            }
            this.$forceUpdate()
          })
      }
    },
      //打开单位所属行业
      openTrade(){
          this.chooseTrade = true
      },
      //获取所有启用的行业
      loadTrade(){
          this.$axios.get('/SysConfig/GetIndustryConfigList').then(res =>{
              console.log(res)
              if (res.Record) {
                  this.tradeData = res.Record
              }
          }).catch(err=>{
              console.log(err)
          })
      },
      getTrade(val){
          console.log(val)
          this.trade = val
          this.IndustryType = val.Code;
          this.IndustryName =val.Value;
          this.chooseTrade = false
      },
      closeTrade(){
          this.chooseTrade = false;
      },
      closeTip(){
          this.$router.push({ path: '/admin/orgin' })
      }
  },
  mounted() {
    //this.selectParentName();
    this.selectArea('0', 0)
    this.init()
    this.selectAreaTwo(0, 0)
  },
  activated() {
    this.selectArea('0', 0)
    this.init()
    this.selectAreaTwo(0, 0)
  }
}
</script>
<style scoped>
.addTitle {
  font-size: 30px;
  border-bottom: 2px solid #00b8ee;
}
.container {
  padding-right: 20px;
}
.manageAdd {
  font-size: 15px;
}

.choose {
  /*position: absolute;*/
  background: #fff;
  padding: 5px;
  font-size: 15px;
  /*bottom: 15px;
        left: 20px;
        right: 20px;*/
  width: 100%;
  margin-top: 20px;
}

.choose > ul {
  text-align: center;
}

.choose > ul > li {
  margin-left: 25px;
  padding: 0px 15px;
  border-radius: 3px;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  border: 1px solid #00b8ee;
  background: #00b8ee;
  color: #ffffff;
}
.choose > ul > li:nth-of-type(1) {
  border: 1px solid #00b8ee;
  background: #ffffff;
  color: #00b8ee;
}
.choose > ul > li:hover {
  background: #ffffff;
  color: #00b8ee;
}
.choose > ul > li:nth-of-type(1):hover {
  background: #ffffff;
  color: #ccc;
}

.ul-flexChild > li {
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: center;
}

.addFormContainer {
  /*overflow: hidden;*/
  overflow-y: auto;
  position: absolute;
  top: 20px;
  bottom: 20px;
  right: 20px;
  left: 20px;
}

.addFormItems > li {
  margin-top: 15px;
}

.addFormItems > li > div {
  line-height: 30px;
  height: 30px;
}

.addFormItems > li > .addFormItemTitle {
  text-align: right;
  width: 30%;
  padding: 0 10px;
}
.longUl > .addFormItems > li > .addFormItemTitle {
  text-align: right;
  width: 15%;
  padding: 0 10px;
}
.longUl > .addFormItems > li > div:nth-child(2) {
  width: 80%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.addFormItems > li > div:nth-child(1) {
  font-size: 14px;
  font-weight: 300;
}

.addFormItems > li > div:nth-child(2) {
  width: 60%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.addFormItems > li > div:nth-child(3) {
  width: 10%;
  text-align: left;
  color: red;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.block {
  text-align: left;
}

.block > span {
  width: 40%;
}

.addressDetail {
  width: 98%;
  margin: 0 0 0 10px;
}

input {
  margin: 0;
  color: #565656;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

input[type='file'] {
  margin-left: 10px;
}
</style>
<style>
.sl .promptW .el-input.is-disabled .el-input__inner {
  background: #00b8ee;
  border-radius: 0;
  color: #ffffff;
  text-align: center;
  border: 0;
}
.sl .manage-update .el-input--suffix .el-input__inner {
  margin: 0;
  padding-right: 0;
  height: 30px;
  line-height: 30px;
}
.sl .avatar-uploader {
  position: absolute;
  z-index: 1;
  right: 0px;
  top: 5px;
}
.sl .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.sl .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.sl .avatar-uploader .el-upload--text {
  width: 30px;
  height: 30px;
}

.sl .avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.sl .avatar {
  width: 30px;
  height: 30px;
  display: block;
}
.sl .orgform .el-form-item__label {
  background: #00b8ee;
}

.sl .orgform .el-form-item {
  margin-bottom: 2px;
}
.sl .pictrueUpload {
  width: 100%;
  height: 100%;
}
.sl .el-select {
  width: 100%;
}
</style>
<!--<style scoped>
    .addTitle {
        font-size: 30px;
        border-bottom: 2px solid #00B8EE;
    }
    .container{
        padding-right: 20px;
    }
    .manageAdd {
        font-size: 15px;
    }

    .choose {
        /*position: absolute;*/
        background: #fff;
        padding: 5px;
        font-size: 15px;
        /*bottom: 15px;
        left: 20px;
        right: 20px;*/
        width: 100%;
        margin-top: 20px;

    }

    .choose > ul {
        text-align: center;
    }

    .choose > ul > li {
        margin-left: 25px;
        padding: 0px 15px;
        border-radius: 3px;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        border: 1px solid #00B8EE;
        background: #00B8EE;
        color: #FFFFFF;
    }
    .choose>ul>li:nth-of-type(3){
        border: 1px solid #ccc;
        background: #ccc;
        color: #FFFFFF;
    }
    .choose > ul > li:hover {
        background: #FFFFFF;
        color: #00B8EE;
    }
    .choose>ul>li:nth-of-type(3):hover{
        background: #FFFFFF;
        color: #ccc ;
    }

    .ul-flexChild > li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: start;
        align-items: center;
    }

    .addFormContainer {
        /*overflow: hidden;*/
        overflow-y: auto;
        position: absolute;
        top: 20px;
        bottom: 20px;
        right: 20px;
        left: 20px;
    }

    .addFormItems > li {
        margin-top: 15px;
    }

    .addFormItems > li > div {
        line-height: 30px;
        height: 30px;
    }

    .addFormItems > li > .addFormItemTitle {
        text-align: right;
        width: 30%;
        padding: 0 10px;
    }
    .longUl >  .addFormItems > li > .addFormItemTitle {
        text-align: right;
        width: 15%;
        padding: 0 10px;
    }
    .longUl >  .addFormItems > li > div:nth-child(2) {
        width: 75%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .addFormItems > li > div:nth-child(1) {
        font-size: 14px;
        font-weight: 300;
    }

    .addFormItems > li > div:nth-child(2) {
        width: 50%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .addFormItems > li > div:nth-child(3) {
        width: 10%;
        text-align: left;
        color: red;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .block {
        text-align: left;
    }

    .block > span {
        width: 40%;
    }

    .addressDetail {
        width: 98%;
        margin: 0 0 0 10px;
    }

    input {
        margin: 0;
        color: #565656;
    }

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }

    input[type=file] {
        margin-left: 10px;
    }

</style>
<style>
    .promptW .el-input.is-disabled .el-input__inner{
        background: #00B8EE;
        border-radius: 0;
        color: #FFFFFF;
        text-align: center;
        border: 0;
    }
    .manage-add .el-input&#45;&#45;suffix .el-input__inner {
        margin: 0;
        padding-right: 0;
        height: 30px;
        line-height: 30px;
    }
    .avatar-uploader{
        position: absolute;
        z-index: 1;
        right: 0px;
        top: 5px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader .el-upload&#45;&#45;text{
        width: 30px;
        height: 30px;
    }

    .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
    }
    .avatar {
        width: 30px;
        height: 30px;
        display: block;
    }
    .orgform .el-form-item__label{
        background: #00B8EE;
    }

    .orgform .el-form-item{
        margin-bottom: 2px;
    }
    .pictrueUpload{
        width:100%;
        height:100%;
    }
</style>-->

