<template>
  <div class="timeSelect sl">
    `
    <div class="container manageAdd manage-add">
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
                    maxlength="80"
                    v-model="OrgName"
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
                                maxlength="18"
                                v-model="EnterpriseCode"
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
                        <div class="inputContainer" style="height: 100%" @click="openTrade">
                            <input disabled type="text" v-model="trade.Value" placeholder>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">
                        <!--<span style="position: relative;left: 5px;color: #d8281d">*</span>-->
                        <span>工会编码</span>
                    </div>
                    <div class="inputContainer">
                        <input @blur="unionInput(true)" type="text" maxlength="20" v-model="UserAccount">
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
                    style="height: 41px;line-height: 41px;"
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

              <li v-show="!showFlam">
                <div class="addFormItemTitle">服务期限</div>
                <div>
                  <el-date-picker v-model="ServiceStartTime" type="date" placeholder="开始日期"></el-date-picker>
                  <div>-</div>
                  <el-date-picker v-model="ServiceEndTime" type="date" placeholder="结束日期"></el-date-picker>
                </div>
              </li>
            </ul>
          </div>

          <div class="choose">
            <ul class>
              <li @click="addFinished(false)">取消</li>
              <li @click="addFinished(true)">保存</li>
              <!--<li @click="addFinished(false)" style="color: #00B8EE; background: #fff; border-color: #00B8EE;">取消</li>-->
              <!--<li @click="addFinished(true)" style="color: #fff; background: #00B8EE; border-color: #00B8EE;">保存</li>-->
              <!--<li><a href="">附件?</a></li>-->
            </ul>
          </div>
        </div>
      </div>

      <!-- 附件弹出框 -->
      <el-dialog title="选择附件" :visible.sync="fileVisible" width="40%">
        <picture-upload
          class="pictrueUpload"
          @uploadimg="uploadimg"
          :imgList="imglist"
          :limit="3"
          @removeimg="removeimg"
        ></picture-upload>
      </el-dialog>

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
                <trade @getTrade="getTrade" @closeBtn="closeTrade" :data="tradeData" default-value="defaultTradeValue" ></trade>
            </div>
        </el-dialog>
        <!---->
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <message :visible.sync="message.visible" :delay="message.delay" :message='message.message' @close="closeTip()"></message>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, store } from 'vuex'
import pictureUpload from '@/components/upload'
import httpConfig from '@/util/ajaxConfig' //自定义ajax头部配置*****
import md5 from 'js-md5'
import qs from 'qs'
import Trade from "../../../components/trade/trade";

export default {
  name: 'manage-add',
  data() {
    return {
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
      //PhId: '1',
      file: '1',
      OrgName: '',
      EnCode: '',
      UserAccount: '',
      Layers: '1',
      EnterpriseCode: '',
      showFlam2: '',
      EnterpriseAttachment: '',
      ChairmanAttachment: '',
      Address: '',
      address: [],
      titleName: '基层组织账套管理',
      fileVisible: false,
      clearable: true,
      phoneHead: '1',
      MobilePhone: '',
      Telephone: '',
      showFlam: true,
      Chairman: '',
      Director: '',
      Treasurer: '', //财务主管
      Cashier: '', //出纳
      AccountPeople:'',//记账
      EnableTime: '',
      ServiceStartTime: '',
      ServiceEndTime: '',
      ParentId: '',
      ParentCode: '',
      Parent: '',
      ParentName: '',
      AccountSystem: '工会会计制度2009版',
      FinanceAccount: '',
      BankName: '',
      BankAccount: '',
      Integrity: '80',
      ParentNameValues: [],
      Province: '',
      City: '',
      County: '',
      Street: '',
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
      imglist: [
        // {
        //     PhId:0,
        //     BTable:'gcw3_voucher_mst',
        //     BName:'aa.jpg',
        //     BType:'.jpg',
        //     BSize:'203',
        //     BFilebody:'',
        //     BUrlPath:'/UpLoadFiles/Voucher/2018-12-07/62ad64e635a3435d82b6cc1c770124f7.jpg',
        //     BRemark:'',
        //     RelPhid:''
        // }
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

      //地址选择器data*********************************
      //options: []
        // 单位所属行业
        chooseTrade:false,
        trade:{
            Value:'',
            Code:''
        },
        IndustryType:'',
        tradeData:[],
        defaultTradeValue:"9999",

        message:{
            visible:false,
            message:''
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
  created() {
    if (this.$route.query.showFlam) {
      this.$store.commit('tagNav/upexcludeArr', [])
      this.showFlam = this.$route.query.showFlam
      if (this.showFlam) {
        this.showFlam2 = false
      } else {
        this.showFlam2 = true
      }
    } else {
      this.$store.commit('tagNav/upexcludeArr', [])
      this.showFlam = this.$route.query.showFlam
    }
    console.log(this.showFlam)
  },
  mounted: function() {
      this.loadTrade();
    //this.getNodes();
    //this.selectParentName();
    this.selectArea('0', 0)
    this.showFlam = this.$route.query.showFlam
    if (this.showFlam) {
      this.showFlam2 = false
    } else {
      this.showFlam2 = true
    }
    console.log(this.showFlam)
    this.selectAreaTwo(0, 0)
  },
  methods: {
    ...mapActions({
      uploadFile: 'uploadFile/Orgupload'
    }),
    handleChange(value) {
      //地址选择器的值******************
      this.address = value
    },
    unionInput(bool) {
      if (bool) {
        if (!this.OrgName) {
          this.unionCss.name = true
        } else {
          this.unionCss.name = false
        }
      } else {
        if (!this.EnterpriseCode) {
          this.unionCss.id = true
        } else {
          this.unionCss.id = false
        }
      }
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
    testFile() {
      this.fileVisible = true
    },
    removeimg(item, deleValue) {
      this.imglist = item
      console.log(item)

      var param = {
        PhId: deleValue.phid,
        BTable: 'gcw3_voucher_mst',
        BUrlPath: deleValue.imgPath
      }

      this.$axios({
        url: '/PVoucherAttachment/PostDeleteFile',
        method: 'post',
        data: param
      })
        .then(res => {
          if (res.Status === 'error') {
            this.$message({ showClose: true, message: res.Msg, type: 'error' })
            return
          }
        })
        .catch(error => {
          console.log(error)
          this.$message({
            showClose: true,
            message: '附件删除错误',
            type: 'error'
          })
        })
    },
    uploadimg(item) {
      //console.log(item)
      this.imglist.push(item)
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
      console.log(this.ParentCode)
      console.log(this.ParentId)
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
        this.getParentByAreaTwo(this.qLayer, this.ProvinceTwo, 0)
      } else if (this.qLayer == 2) {
        this.momentOrg = '市级工会'
        this.getallAddressName(this.CityTwo)
        this.getParentByAreaTwo(this.qLayer, this.CityTwo, 0)
      } else if (this.qLayer == 3) {
        this.momentOrg = '区级工会'
        this.getallAddressName(this.CountyTwo)
        this.getParentByAreaTwo(this.qLayer, this.CountyTwo, 0)
      } else if (this.qLayer == 4) {
        this.momentOrg = '街道工会'
        this.getallAddressName(this.StreetTwo)
        this.getParentByAreaTwo(this.qLayer, this.StreetTwo, 0)
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
    //改变父级组织后的点击事件
    changeParentOrg() {
      this.showDialog = true
      this.choosePerantOrg = true
      // console.log(this.Parent);
      // this.ParentId = this.Parent.PhId;
      // this.ParentName = this.Parent.OrgName;
      // this.ParentCode = this.Parent.EnCode;
      // console.log(this.ParentId);
      // console.log(this.ParentCode);
    },
    //改变省后的点击事件
    changeProvince() {
      this.StreetValue = []
      this.CountyValue = []
      this.CityValue = []
      this.selectArea(this.Province, 1)
    },
    //改变城市后的点击事件
    changeCity() {
      this.StreetValue = []
      this.CountyValue = []
      this.selectArea(this.City, 2)
      if (!this.showFlam) {
        if (this.Layers == '2') {
          this.getParentByArea(1, this.Province)
        }
      }
    },
    //改变区后的点击事件
    changeCounty() {
      this.StreetValue = []
      this.selectArea(this.County, 3)
      if (!this.showFlam) {
        if (this.Layers == '3') {
          this.getParentByArea(2, this.City)
        }
      }
    },
    //改变街道后的点击事件
    changeStreet() {
      if (!this.showFlam) {
        if (this.Layers == '4') {
          this.getParentByArea(3, this.County)
        }
      } else {
        this.getParentByArea(4, this.Street)
      }
    },
    //根据选择的地址获取父级机关工会
    getParentByArea(i, area) {
      var data = {
        rank: i,
        areaCode: area
      }
      this.$axios
        .get('/SysAdminOrganize/GetParentAdminOrganizeByArea', { params: data })
        .then(res => {
          console.log(res)
          this.ParentNameValues = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    //查询地区
    selectArea(Area, i) {
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
        })
        .catch(err => {
          console.log(err)
        })
    },
    addFinished(bool) {
      if (!bool) {
        //移除TagNav
        this.$store.commit('tagNav/removeTagNav', this.$route)
        this.$router.push({ path: '/admin/orgin' })
        //this.$router.go(-1);
      } else {
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
            Province: this.Province,
            City: this.City,
            County: this.County,
            Street: this.Street,
            file: this.file,
            OrgName: this.OrgName,
            UserAccount: this.UserAccount,
            EnterpriseCode: this.EnterpriseCode,
            Category: this.Category,
            Address: this.Address,
            Layers: this.Layers,
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
            FinanceAccount: this.FinanceAccount,
            BankName: this.BankName,
            BankAccount: this.BankAccount,
            AccountSystem: this.AccountSystem,
            EnterpriseAttachment: this.EnterpriseAttachment,
            ChairmanAttachment: this.ChairmanAttachment,
            Director: this.Director,
            Treasurer: this.Treasurer,
            Cashier: this.Cashier,
            Integrity: this.Integrity,
              AccountPeople:this.AccountPeople,
              IndustryType:this.IndustryType
          }
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
            this.ParentCode != null &&
            this.Director != null &&
            this.Address != null &&
            this.Treasurer != null &&
              this.IndustryType != ""
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
            this.$axios.post('/SysOrganize/PostAdd',data).then(res => {
              loading.close()
              console.log(res)
              if (res.Status == 'success') {
                  this.message.visible = true
                  this.message.message='新增成功'
                // this.$message.success('新增成功')
                //this.$store.commit("tagNav/upexcludeArr", ['basicUnion']);
                this.$store.commit('tagNav/removeTagNav', this.$route)

                this.Province = ''
                this.City = ''
                this.County = ''
                this.Street = ''
                this.OrgName = ''
                this.UserAccount = ''
                this.EnterpriseCode = ''
                this.Category = 'basic'
                this.Address = ''
                this.Layers = ''
                this.Telephone = ''
                this.Chairman = ''
                this.EnableTime = ''
                this.ServiceStartTime = ''
                this.ServiceEndTime = ''
                this.ParentName = ''
                this.ParentId = ''
                this.ParentCode = ''
                this.FinanceAccount = ''
                this.BankName = ''
                this.BankAccount = ''
                this.AccountSystem = ''
                this.EnterpriseAttachment = ''
                this.ChairmanAttachment = ''
                this.Director = ''
                this.Treasurer = ''
                this.Cashier = ''
                  this.AccountPeople=''
                this.$forceUpdate()
              } else {
                if (res.Msg != '') {
                  this.$message.error(res.Msg)
                } else {
                  this.$message.error('新增失败,请重试!')
                }
              }
            })
          } else {
            this.$message.error('请将必填信息填写完整再保存,请重试!')
          }
        } else {
          var page = {
            Province: this.Province,
            City: this.City,
            County: this.County,
            Street: this.Street,
            EnCode: this.EnCode,
            file: this.file,
            OrgName: this.OrgName,
            EnterpriseCode: this.EnterpriseCode,
            Address: this.Address,
            //'phoneHead': this.phoneHead,
            //'MobilePhone': this.MobilePhone,
            Telephone: this.Telephone,
            Layers: this.Layers,
            Chairman: this.Chairman,
            ServiceStartTime: this.ServiceStartTime,
            ServiceEndTime: this.ServiceEndTime,
            ParentName: this.ParentName,
            ParentId: this.ParentId,
            ParentEnCode: this.ParentCode,
            EnterpriseAttachment: this.EnterpriseAttachment,
            ChairmanAttachment: this.ChairmanAttachment,
            Director: this.Director,
            Cashier: this.Cashier,
            Treasurer: this.Treasurer,
              AccountPeople:this.AccountPeople
          }
          if (
            this.Province != '' &&
            this.OrgName != '' &&
            this.EnterpriseCode != '' &&
            this.Chairman != '' &&
            this.Director != '' &&
            this.EnCode != '' &&
            this.Treasurer != '' &&
            this.Province != null &&
            this.OrgName != null &&
            this.EnterpriseCode != null &&
            this.Chairman != null &&
            this.Director != null &&
            this.EnCode != null &&
            this.Treasurer != null &&
            this.trade.Code !== null
          ) {
            var data = {
              uid: '0',
              orgid: '0',
              infoData: page
            }
            this.$axios.post('/SysAdminOrganize/PostAdd', data).then(res => {
              if (res.Status == 'success') {
                this.$message.success('新增成功')
                this.$store.commit('tagNav/upexcludeArr', ['union'])
                //this.$store.commit("tagNav/removeTagNav", this.$route);
                this.$router.push({ path: '/admin/orgin' })
              } else {
                this.$message.error('新增失败,请重试!')
              }
            })
          } else {
            this.$message.error('请将必填信息填写完整再保存,请重试!')
          }
        }
      }
    },
    // getFile($event) {
    //     this.file = $event.target.files[0];
    // },
    // ajaxMode() {
    //     var page = {
    //         'Province': this.Province,
    //         'City': this.City,
    //         'County': this.County,
    //         'Street': this.Street,
    //         'file': this.file,
    //         'OrgName': this.OrgName,
    //         'EnterpriseCode': this.EnterpriseCode,
    //         'Address': this.Address,
    //         //'phoneHead': this.phoneHead,
    //         'MobilePhone': this.MobilePhone,
    //         //'Telephone': this.Telephone,
    //         'Chairman': this.Chairman,
    //         'EnableTime': this.EnableTime,
    //         'ServiceStartTime': this.ServiceStartTime,
    //         'ServiceEndTime': this.ServiceEndTime,
    //         'ParentName': this.ParentName,
    //         'ParentId': this.ParentId,
    //         'ParentEnCode': this.ParentCode,
    //         'AccountSystem': this.AccountSystem,
    //         'Director': this.Director
    //     };
    //     if(this.Province!=''&& this.City !=''&& this.County!='' && this.Street != '' && this.OrgName!=''
    //     && this.EnterpriseCode !='' && this.Chairman !='' && this.EnableTime != "" && this.ServiceStartTime !=''
    //     && this.ServiceEndTime !='' && this.ParentName != '' && this.AccountSystem !=''&& this.Director !=''){
    //         var data = {
    //             uid: "0",
    //             orgid: "0",
    //             infoData: page
    //         };
    //         this.$axios.post('/SysOrganize/PostAdd', data)
    //             .then(res => {
    //                 if (res.Status == 'success') {
    //                     this.$message.success("新增成功");
    //                     this.$router.push({path: '/'});
    //                 }else{
    //                     this.$message.error('新增失败,请重试!');
    //                 }
    //             })
    //     }else{
    //         this.$message.error('请将信息填写完整再保存,请重试!');
    //     }
    // }
      //打开选择单位所属行业弹框
      openTrade(){
          this.chooseTrade = true
      },
      getTrade(val){
        this.trade = val.name;
          this.chooseTrade = false
      },
      closeTrade(){
          this.chooseTrade = false
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
         this.IndustryType = val.Code
        this.chooseTrade = false
      },
      closeTip(){
        console.log("关闭弹框")
          this.$router.push({ path: '/admin/orgin' })
      }
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
}
.choose > ul > li:nth-of-type(2) {
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
.sl .manage-add .el-input--suffix .el-input__inner {
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
