<template>
  <div class="sys-page demo organize">
    <div class="container">
      <el-container>
        <el-header>
          <div class="unionState flexPublic">
            <ul class="flexPublic">
              <li class="flexPublic">
              </li>
            </ul>
            <ul class="flexPublic handle"
                style="float: right">
              <!--<a>-->
              <!--<li @click="changeRecord">测试</li>-->
              <!--</a>-->
              <a>
                <li v-show="!isedit"
                    @click="edit"
                    v-if="Roleauthorize.organizeAccount_edit!=0">修改</li>
              </a>
              <a>
                <li v-show="isedit"
                    v-if="isDisabled"
                    @click="save"
                    style='margin:0 0 0px 10px;'>保存</li>
                <li v-show="isedit"
                    v-else
                    style='margin:0 0 0px 10px;'>保存</li>
              </a>
              <a>
                <li v-show="isedit"
                    @click="freshPage"
                    style='margin:0 0 0px 10px;'>返回</li>
              </a>
              <!-- <a>
                                <li v-show="!isedit" @click="Backups" style='margin:0 0 0px 10px;'>备份</li>
                            </a>
                            <a>
                                <li v-show="!isedit" @click="Recover" style='margin:0 0 0px 10px;'>恢复</li>
                            </a> -->
              <!--<a>-->
              <!--<li  @click="testFile" style='margin:0 0 0px 10px;'>附件</li>-->
              <!--</a>-->
              <a style="width:30px;">
                <li v-show="!isedit"
                    class="el-icon-refresh"
                    @click="freshPage"
                    style='min-width:30px;margin:0 0 0px 10px;padding:0;width:30px;background: #FFFFFF;border-color: #ffffff;'></li>
              </a>
              <!--<a @click="freshPage"><li class="fresh"><img src="@/assets/icon/fresh2.svg" alt=""> </li></a>-->
            </ul>
          </div>
        </el-header>
        <el-main style="width: 900px; margin: 0 auto;">
          <h4 class="addTitle"
              style="font-size: 30px;font-weight: bold">基层组织账套管理</h4>
          <div class="container addressStyle"
               style="padding-right:20px"
               v-if='isedit'>
            <!--<el-dialog :title="'账套信息维护'" :visible.sync="editVisible" width="40%" style="height: 800px">-->
            <el-form :model="orgForm"
                     :rules="rules"
                     ref="orgForm"
                     class="orgform"
                     label-width="30%"
                     label-position="right"
                     v-loading.fullscreen.lock="loading">
              <el-form-item label="工会名称(必填)："
                            prop="OrgName">
                <el-input v-model="orgForm.OrgName"
                          class="pic-input"
                          maxlength="80"></el-input>
              </el-form-item>
              <el-form-item label="单位所属行业(必填)："
                            prop="OrgName">
                <div @click="openTrade"
                     style="padding-left:15px;color:#000;cursor:pointer;border-bottom: 1px solid #dcdfe6;width: 100%;height: 40px;color: #00B8EE">{{orgForm.IndustryName}}</div>
              </el-form-item>
              <el-form-item label="工会编码规则类型(必填)："
                            prop="Category">
                <div class="addressStyle"
                     style="width: 100%">
                  <el-select v-model="orgForm.Category"
                             placeholder=""
                             class="pic-input-area">
                    <el-option v-for="item in CategoryList"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                      {{item.name}}
                    </el-option>
                  </el-select>
                </div>
                <!--<el-select v-model="orgForm.Category">-->
                <!--<option v-for="item of CategoryList" :key="item.id" :value="item.id">{{item.name}}-->
                <!--</option>-->
                <!--</el-select>-->
              </el-form-item>
              <el-form-item label="工会编码："
                            prop="UserAccount">
                <el-input v-model="orgForm.UserAccount"
                          class="pic-input"
                          maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="统一社会信用代码："
                            prop="EnterpriseCode">
                <div class="uploadCon">
                  <el-input v-model="orgForm.EnterpriseCode"
                            class="pic-input"
                            maxlength="18"
                            placeholder="18位,只能为数字和大写字母"
                            style="::-webkit-input-placeholder{color: #00ff00;}"></el-input>
                  <el-upload ref="uploadEnterprise"
                             class="avatar-uploader upload"
                             action=""
                             :show-file-list="false"
                             :before-upload="beforeAvatarUpload"
                             :http-request='uploadFileMethodEnterprise'>
                    <img v-if="orgForm.EnterpriseAttachment"
                         :src="picUrl+orgForm.EnterpriseAttachment"
                         class="avatar">
                    <img v-else
                         src="@/assets/icon/add.svg"
                         class="avatar-uploader-icon">
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                  </el-upload>
                </div>

              </el-form-item>
              <el-form-item label="单位地址(必填)："
                            prop="Address">
                <div style="width: 14%;float: left"
                     class="addressStyle">
                  <el-select v-model="orgForm.Province"
                             placeholder=""
                             class="pic-input-area"
                             @change="changeProvince()">
                    <el-option v-for="item in Provinces"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                      {{item.label}}
                    </el-option>
                  </el-select>
                  <!-- <span style="float: right;text-align: center">省&nbsp;&nbsp;&nbsp;&nbsp;</span> -->
                </div>
                <div style="width: 14%;float: left"
                     class="addressStyle">
                  <el-select v-model="orgForm.City"
                             placeholder=""
                             class="pic-input-area"
                             @change="changeCity">
                    <el-option v-for="item in Citys"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                      {{item.label}}
                    </el-option>
                  </el-select>
                  <!-- <span style="float: right">市&nbsp;&nbsp;&nbsp;&nbsp;</span> -->
                </div>
                <div style="width: 14%;float: left"
                     class="addressStyle">
                  <el-select v-model="orgForm.County"
                             placeholder=""
                             class="pic-input-area"
                             @change="changeCounty">
                    <el-option v-for="item in Countys"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                      {{item.label}}
                    </el-option>
                  </el-select>
                  <!-- <span style="float: right">区(县)&nbsp;</span> -->
                </div>
                <div style="width: 16%;float: left"
                     class="addressStyle">
                  <el-select v-model="orgForm.Street"
                             placeholder=""
                             class="pic-input-area"
                             @change="changeStreet">
                    <el-option v-for="item in Streets"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                      {{item.label}}
                    </el-option>
                  </el-select>
                  <!-- <span style="float: right">街道&nbsp;&nbsp;</span> -->
                </div>
                <el-input v-model="orgForm.Address"
                          class="pic-input"
                          style="width:42%"
                          placeholder="请输入详细地址"></el-input>
                <!--<el-input v-model="orgForm.Address" class="pic-input"></el-input>-->
              </el-form-item>

              <el-form-item label="联系电话：">
                <el-input v-model="orgForm.TelePhone"
                          class="pic-input"
                          maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="隶属工会(必填)："
                            prop="ParentName">
                <div @click="getParentOrg"
                     style="padding-left:15px;color:#000;cursor:pointer;border-bottom: 1px solid #dcdfe6;width: 100%;height: 40px;color: #00B8EE">{{orgForm.ParentName}}</div>
                <!--<div @click="getParentOrg">-->
                <!--<el-input v-model="orgForm.ParentName" class="pic-input" disabled></el-input>-->
                <!--</div>-->
                <!--<div style="width: 100%; height: 100%" class="addressStyle">-->
                <!--<el-select v-model="orgForm.Parent" placeholder="" class="pic-input" @change="changeParentOrg" @focus="getParentOrg">-->
                <!--<el-option-->
                <!--v-for="item in ParentLists"-->
                <!--:key="item.PhId"-->
                <!--:label="item.OrgName"-->
                <!--:value="item">-->
                <!--{{item.OrgName}}-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--&lt;!&ndash;<el-input v-model="orgForm.ParentName" class="pic-input"></el-input>&ndash;&gt;-->
                <!--</div>-->

              </el-form-item>
              <el-form-item label="财务账户账号："
                            prop="FinanceAccount">
                <el-input v-model="orgForm.FinanceAccount"
                          class="pic-input"
                          maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="开户行名称："
                            prop="BankName">
                <el-input v-model="orgForm.BankName"
                          maxlength="20"
                          class="pic-input"></el-input>
              </el-form-item>
              <el-form-item label="开户行号："
                            prop="BankAccount">
                <el-input v-model="orgForm.BankAccount"
                          maxlength="20"
                          class="pic-input"></el-input>
              </el-form-item>
              <!--<el-form-item label="会计制度：">-->
              <!--<el-input v-model="orgForm.AccountSystem" class="pic-input"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="启用日期：">-->
              <!--<el-date-picker-->
              <!--v-model="orgForm.EnableTime"-->
              <!--type="date"-->
              <!--placeholder="选择日期">-->
              <!--</el-date-picker>-->
              <!--</el-form-item>-->
              <el-form-item label="工会主席(必填)："
                            prop="Chairman">
                <div class="uploadCon">
                  <el-input v-model="orgForm.Chairman"
                            class="pic-input"
                            maxlength="20"></el-input>
                  <el-upload ref="uploadChairman"
                             class="avatar-uploader upload"
                             action=""
                             :show-file-list="false"
                             :before-upload="beforeAvatarUpload"
                             :http-request='uploadFileMethodChairman'>
                    <img v-if="orgForm.ChairmanAttachment"
                         :src="picUrl+orgForm.ChairmanAttachment"
                         class="avatar">
                    <img v-else
                         src="@/assets/icon/add.svg"
                         class="avatar-uploader-icon">
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                  </el-upload>
                </div>
              </el-form-item>
              <el-form-item label="经审主任(必填)："
                            prop="Director">
                <el-input v-model="orgForm.Director"
                          class="pic-input"
                          maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="财务主管(必填)："
                            prop="Treasurer">
                <el-input v-model="orgForm.Treasurer"
                          class="pic-input"
                          maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="出纳："
                            prop="Cashier">
                <el-input v-model="orgForm.Cashier"
                          class="pic-input"
                          maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="记账："
                            prop="Cashier">
                <el-input v-model="orgForm.AccountPeople"
                          class="pic-input"
                          maxlength="20"></el-input>
              </el-form-item>
              <!--<el-form-item label="使用期限：">-->
              <!--<el-date-picker-->
              <!--v-model="orgForm.ServiceStartTime"-->
              <!--type="date"-->
              <!--placeholder="选择开始日期">-->
              <!--</el-date-picker>-->
              <!--&#45;&#45;-->
              <!--<el-date-picker-->
              <!--v-model="orgForm.ServiceEndTime"-->
              <!--type="date"-->
              <!--placeholder="选择结束日期">-->
              <!--</el-date-picker>-->
              <!--</el-form-item>-->
            </el-form>
            <!--</el-dialog>-->

          </div>

          <div class="container"
               v-else
               style="position: relative;margin-right: 50px">
            <ul>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">工会名称：</span></div>
                <div class="orgedit-value">{{orgForm.OrgName}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">单位所属行业：</span></div>
                <div class="orgedit-value">{{orgForm.IndustryName}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">工会编码：</span></div>
                <div class="orgedit-value">{{orgForm.UserAccount}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">统一社会信用代码：</span></div>
                <div class="orgedit-value">
                  {{orgForm.EnterpriseCode}}
                </div>
                <div>
                  <el-popover trigger="hover"
                              v-if="orgForm.EnterpriseAttachment">
                    <img :src="picUrl+orgForm.EnterpriseAttachment"
                         style="height: 300px;width: auto" />
                    <img slot="reference"
                         :src="picUrl+orgForm.EnterpriseAttachment"
                         style="height: 30px;width: auto;margin-top: 5px" />
                  </el-popover>
                </div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">单位地址：</span></div>
                <input class="orgedit-value"
                       style="border: 0 ;"
                       :value="orgForm.Address"
                       disabled />
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">联系电话：</span></div>
                <div class="orgedit-value">{{orgForm.TelePhone}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">隶属工会：</span></div>
                <div class="orgedit-value">{{orgForm.ParentName}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">财务账户账号：</span></div>
                <div class="orgedit-value">{{orgForm.FinanceAccount}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">开户行名称：</span></div>
                <div class="orgedit-value">{{orgForm.BankName}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">开户行号：</span></div>
                <div class="orgedit-value">{{orgForm.BankAccount}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">会计制度：</span></div>
                <div class="orgedit-value">{{orgForm.AccountSystem}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">启用日期：</span></div>
                <div class="orgedit-value">{{orgForm.EnableTime}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">工会主席：</span></div>
                <div class="orgedit-value">{{orgForm.Chairman}}</div>
                <div>
                  <el-popover trigger="hover"
                              v-if="orgForm.ChairmanAttachment">
                    <img :src="picUrl+orgForm.ChairmanAttachment"
                         style="height: 300px;width: auto" />
                    <img slot="reference"
                         :src="picUrl+orgForm.ChairmanAttachment"
                         style="height: 30px;width: auto;margin-top: 5px" />
                  </el-popover>
                </div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">经审主任：</span></div>
                <div class="orgedit-value">{{orgForm.Director}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">财务主管：</span></div>
                <div class="orgedit-value">{{orgForm.Treasurer}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">出纳：</span></div>
                <div class="orgedit-value">{{orgForm.Cashier}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">记账：</span></div>
                <div class="orgedit-value">{{orgForm.AccountPeople}}</div>
              </li>
              <li class="orgedit-linehight">
                <div class="orgedit-title"><span class="orgtitle-ringt">使用期限：</span></div>
                <div class="orgedit-value">{{orgForm.ServiceStartTime}}-{{orgForm.ServiceEndTime}}</div>
              </li>
            </ul>
            <div v-if='!isedit'
                 class="inf-change-rec">
              <div class="inf-change-record"
                   @click="changeRecord"
                   style="cursor:pointer;">
                <span class="inf-change-recordz">信息变更记录</span>
              </div>
            </div>
          </div>
          <!--<div v-if='!isedit' class="inf-change-rec">-->
          <!--<div class="inf-change-record" @click="changeRecord" style="cursor:pointer;">-->
          <!--<span class="inf-change-recordz" >信息变更记录</span>-->
          <!--</div>-->
          <!--</div>-->

        </el-main>

      </el-container>
      <!-- 附件弹出框 -->
      <el-dialog title="选择附件"
                 :visible.sync="fileVisible"
                 width="40%">
        <picture-upload class="pictrueUpload"
                        @uploadimg="uploadimg"
                        :imgList="imglist"
                        :limit="3"
                        @removeimg="removeimg"></picture-upload>
      </el-dialog>

    </div>

    <el-dialog :title="'变更记录'"
               :visible.sync="record"
               width="50%"
               style="height: 1200px">
      <el-table :data="tableData"
                border
                height="400"
                :extraheight='extraheight'
                class="table"
                ref="roleListTable"
                highlight-current-row
                :header-cell-style="{background:'#d3e9f9',color:'#000',textAlign:'center'}">
        <el-table-column label="序号"
                         type="index"
                         width="50"></el-table-column>
        <el-table-column prop="changeContents"
                         label="变更事项"
                         width="120"></el-table-column>
        <el-table-column prop="beforeContents"
                         label="变更前内容"
                         align="center"></el-table-column>
        <el-table-column prop="afterContents"
                         label="变更后内容"
                         align="center"></el-table-column>
        <el-table-column prop="changeTime"
                         label="变更日期"
                         align="center"></el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="record = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'隶属工会选择'"
               class="organizeParent"
               :visible.sync="choosePerantOrg"
               width="550px"
               style="height: 800px">
      <div class="organizeParentNow"
           v-if="showDialog">
        <div>
          <span>当前选择：</span>
          <el-input v-model="momentOrg"
                    :disabled="true"
                    style="width: 150px"></el-input>
        </div>
        <div style=" margin-top: 10px;height: 230px">
          <!-- <div class="promptW" style="border-bottom: 1px solid #909399; text-align: center">
                        <el-input v-model="prompt"  :disabled="true" style="width: 100%;color:#FFFFFF; text-align: center"></el-input>
                    </div> -->
          <!-- <div style="width: 100%; height: 10px;">
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">省</div>
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">市</div>
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">区</div>
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">街道</div>
                    </div> -->
          <div style="margin-top: 10px; height: 100%;"
               class="addressStyle">
            <div style="width: 25%; float: left">
              <el-select v-model="ProvinceTwo"
                         placeholder="请选择"
                         filterable
                         style="width: 95%"
                         @change="changeProvinceTwo">
                <el-option v-for="item in ProvinceList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                  {{item.label}}
                </el-option>
              </el-select>
            </div>
            <div style="width: 25%; float: left;">
              <!--<span>省</span>-->
              <el-select v-model="CityTwo"
                         placeholder="请选择"
                         filterable
                         style="width: 95%"
                         @change="changeCityTwo">
                <el-option v-for="item in CityList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                  {{item.label}}
                </el-option>
              </el-select>
            </div>
            <div style="width: 25%; float: left;">
              <!--<span>市</span>-->
              <el-select v-model="CountyTwo"
                         placeholder="请选择"
                         filterable
                         style="width: 95%"
                         @change="changeCountyTwo">
                <el-option v-for="item in CountyList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                  {{item.label}}
                </el-option>
              </el-select>
            </div>
            <div style="width: 25%; float: left;">
              <!--<span>区</span>-->
              <el-select v-model="StreetTwo"
                         placeholder="请选择"
                         filterable
                         style="width: 95%"
                         @change="changeStreetTwo">
                <el-option v-for="item in StreetList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                  {{item.label}}
                </el-option>
              </el-select>
            </div>

            <!--<span>街道</span>-->
          </div>
        </div>
      </div>
      <div v-if="!showDialog"
           style="overflow: hidden">
        <div class="organizeSearch">
          <span>当前选择：</span>
          <el-input v-model="momentOrg"
                    :disabled="true"
                    style="width: 120px"></el-input>
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="searchParentOrg"
                     style="float: right">搜索</el-button>
          <el-input v-model="select_word"
                    placeholder="隶属工会名称"
                    prefix-icon="el-icon-search"
                    style="width: 200px;float: right"
                    class="handle-input mr10"></el-input>
        </div>
        <div style="border: 1px solid #909399; margin-top: 10px;height: 230px">
          <!-- <div class="promptW" style="border-bottom: 1px solid #909399; text-align: center">
                        <el-input v-model="prompt"  :disabled="true" style="width: 100%;color:#FFFFFF"></el-input>
                    </div> -->
          <div class="promptW promptWhite">
            <el-input v-model="allAddressName"
                      :disabled="true"
                      style="width: 100%;color:#FFFFFF"></el-input>
          </div>
          <div style="margin-top: 10px;height: 170px;overflow-y: scroll;text-align: center;width: 105%;"
               class="addressStyle">
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
              <li class="ParantOrgListW"
                  v-for="item in ParantOrgList"
                  style="height: 25px;line-height: 25px;font-size: 15px;cursor: pointer;text-align: left;padding-left:40px"
                  @click.stop="changeParentOrgTwo(item,$event)">{{item.OrgName}}</li>
            </ul>
            <ul v-if="!showNoSearch">
              <li class="ParantOrgListW"
                  v-for="item in ParantOrgListS"
                  style="height: 25px;line-height: 25px;font-size: 15px;cursor: pointer;text-align: left;padding-left:40px"
                  @click.stop="changeParentOrgTwo(item,$event)">{{item.OrgName}}</li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer"
            v-if="showDialog">
        <el-button @click="choosePerantOrg = false"
                   style="color: #00B8EE; border-color: #00B8EE;">取 消</el-button>
        <el-button type="primary"
                   @click="nextStep()"
                   style="background:#00b7ee">下一步</el-button>
      </span>
      <span slot="footer"
            class="dialog-footer"
            v-if="!showDialog">
        <el-button @click="backStep()">上一步</el-button>
        <el-button type="primary"
                   @click="choosePerantOrg = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'单位所属行业选择'"
               class="organizeParent"
               :visible.sync="chooseTrade"
               width="450px">
      <div style="height: 500px;padding: 0 20px">
        <trade @getTrade="getTrade"
               @closeBtn="closeTrade"
               :data="tradeData"
               :default-value="tradeId"></trade>
      </div>
    </el-dialog>
    <!--<div class="footInfo " >-->
    <!--<router-link to="">服务协议</router-link>-->
    <!--<router-link to="">运营规范</router-link>-->
    <!--<router-link to="">关于政云</router-link>-->
    <!--</div>-->
    <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
    <message :visible.sync="message.visible"
             :delay="message.delay"
             :message='message.message'></message>
  </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
import UserInfo from "@/util/auth";
import { SysOrgModel, SysOrgUpdate, SysOrgUploadFile, SysOrgDelete, AllAreaSysOrgModel, SysOrgUpdateAndRecord } from '@/api/organize/orgInfo'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import pictureUpload from "@/components/upload";
import Trade from "../../../components/trade/trade";

export default {
  name: 'demo',
  data () {
    let validMobile = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback()
      } else {
        let reg = /[0-9,A-Z]{18}/
        if (!reg.test(value)) { callback(new Error('编码格式不对')) } else {
          callback()
        }
      }
    };
    return {
      message: {
        message: '',
        delay: 0,
        visible: false
      },
      qLayer: '',
      showNoSearch: true,
      qAdressName: '',
      ParantOrgList: [],
      ParantOrgListS: [],
      select_word: '',
      ParentOrg: '',//隶属公会
      ParentOrgList: [],//隶属工会列表
      allAddressName: '',//所选地址
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
      showDialog: true,
      record: false,
      changePhid: '',
      beforeChange: {},
      extraheight: 300,
      routerTz: false,
      afterChange: {},
      isedit: false,
      fileVisible: false,
      editVisible: false,
      imglist: [
        {
          PhId: 0,
          BTable: 'gcw3_voucher_mst',
          BName: 'aa.jpg',
          BType: '.jpg',
          BSize: '203',
          BFilebody: '',
          BUrlPath: '/UpLoadFiles/Voucher/2018-12-07/62ad64e635a3435d82b6cc1c770124f7.jpg',
          BRemark: '',
          RelPhid: ''
        }
      ],

      tableData: [],
      Provinces: [],
      Citys: [],
      Countys: [],
      Streets: [],
      ParentLists: [],
      orgForm: {
        // PhId: 0,
        OrgName: '',
        Category: '',
        Layers: '',
        UserAccount: '',
        EnterpriseCode: '',
        EnterpriseAttachment: '',
        Address: '',
        TelePhone: '',
        FinanceAccount: '',
        Province: '',
        City: '',
        County: '',
        Street: '',
        Parent: '',
        ParentId: '',
        ParentName: '',
        ParentEnCode: '',
        BankName: '',
        BankAccount: '',
        AccountSystem: '',
        EnableTime: '',
        Chairman: '',
        ChairmanAttachment: '',
        Director: '',
        Treasurer: '',
        Cashier: '',
        AccountPeople: '',
        ServiceStartTime: '',
        ServiceEndTime: '',
        Integrity: '',
        Value: "",//所属行业
        IndustryType: "",//所属编码
        IndustryName: "",//所属编码
      },
      CategoryList: [{ id: 'basic', name: '一般工会' }, { id: 'industry', name: '产业工会' }],
      rules: {
        Category: [
          { required: true, message: '请选择组织编码类型！', trigger: 'blur' },
        ],
        Address: [
          { required: true, message: '请输入详细地址信息！', trigger: 'blur' },
        ],

        // UserAccount: [
        //     {required: true, message: '请输入工会编码！', trigger: 'blur'},
        //
        // ],
        OrgName: [
          { required: true, message: '请输入工会名称！', trigger: 'blur' },
        ],
        //EnterpriseCode: [
        //{required: true, message: '请输入统一社会信用代码！', trigger: 'blur'},
        //{required:true,validator:validMobile,trigger:'blur'}
        //],
        ParentName: [
          { required: true, message: '请输入隶属工会！', trigger: 'blur' },
        ],
        Chairman: [
          { required: true, message: '请输入工会主席！', trigger: 'blur' },
        ],
        Director: [
          { required: true, message: '请输入经审主任！', trigger: 'blur' },
        ],
        Treasurer: [
          { required: true, message: '请输入财务主管！', trigger: 'blur' },
        ]
      },
      chooseTrade: false,//控制行业选择弹框的开启或关闭
      trade: '',//所属行业信息
      tradeId: '',
      tradeData: [],
      isDisabled: true
    }
  },
  //组件
  components: {
    Trade,
    pictureUpload,
  },
  created () {

  },
  activated () {

  },
  mounted () {
    let infoData = UserInfo.getUserInfoData();
    console.log(infoData);
    if (infoData.orgInfo.EnCode == '' || infoData.orgInfo.EnCode == null) {
      this.isedit = true;
      this.selectArea(0, 0);
      this.selectAreaTwo(0, 0);
      this.getData();
      this.routerTz = true;
      this.message = {
        message: '请尽快填写组织账套信息，以便更好地使用其他功能！',
        delay: 4000,
        visible: true
      }
    } else {
      this.isedit = false;
      this.routerTz = false;
      this.getData();
    };
    this.loadTrade()
    // this.selectArea(0, 0);
    // this.selectArea(this.orgForm.Province, 1);
    // this.selectArea(this.orgForm.City, 2);
    // this.selectArea(this.orgForm.County, 3);
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      orgid: state => state.user.orgid,
      Roleauthorize: state => state.user.Roleauthorize,//获取按钮权限
    }),
    picUrl: function () {
      return httpConfig.baseurl;
    }
  },
  watch: {
    "orgForm.ServiceTime" (val) {
      this.orgForm.ServiceStartTime = ''
      this.orgForm.ServiceEndTime = ''
    },
    orgForm: {
      handler (val) {
        console.log(val)
        for (let key in this.tradeData) {
          if (this.tradeData[key].Code == val.IndustryType) {
            this.orgForm.IndustryName = this.tradeData[key].Value
          }
        }
      },
      deep: true
    },
    tradeId (val) {
      console.log('+++++++++++++++', val)
    }
  },
  methods: {
    ...mapActions({
      uploadFile: 'uploadFile/Orgupload'
    }),
    //新的改变隶属工会信息
    changeParentOrgTwo (item, event) {
      console.log(item);
      var lis = document.getElementsByClassName('ParantOrgListW');
      for (var li of lis) {
        li.style.background = "#fff";
      }
      event.target.style.background = "#ccc";
      this.orgForm.Parent = item;
      this.orgForm.ParentId = item.PhId;
      this.orgForm.ParentEnCode = item.EnCode;
      this.orgForm.ParentName = item.OrgName;
      this.orgForm.Layers = item.Layers + 1;
      console.log(this.orgForm.ParentEnCode);
      console.log(this.orgForm.ParentId);
      this.$forceUpdate();
    },
    //搜索隶属工会名
    searchParentOrg () {
      if (this.select_word == '' || this.select_word == null) {
        this.showNoSearch = true;
      } else {
        this.ParantOrgListS = [];
        this.showNoSearch = false;
        for (let i = 0; i < this.ParantOrgList.length; i++) {
          console.log(this.ParantOrgList[i].OrgName);
          if (this.ParantOrgList[i].OrgName.indexOf(this.select_word) > -1) {
            this.ParantOrgListS.push(this.ParantOrgList[i]);
          }
        }
      }
    },
    //根据所选地址信息获取隶属工会列表
    getParentByAreaTwo (i, area, phid) {
      var data = {
        layer: i,
        areaCode: area,
        organizeId: phid,
      }
      this.$axios.get('/SysOrganize/GetParentOrganizeByArea', { params: data })
        .then(res => {
          console.log(res);
          this.ParantOrgList = res;
        })
        .catch(err => {
          console.log(err);
        })
    },
    //查询地区
    selectAreaTwo (Area, i) {
      var data = {
        uid: "0",
        orgid: "0",
        id: Area
      }
      this.$axios.get('/SysArea/GetAreaList', { params: data })
        .then(res => {
          console.log(res);
          if (i == 0) {
            this.ProvinceList = res;
          } else if (i == 1) {
            this.CityList = res;
          } else if (i == 2) {
            this.CountyList = res;
          } else if (i == 3) {
            this.StreetList = res;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    //改变省级
    changeProvinceTwo () {
      this.CityTwo = '';
      this.CountyTwo = '';
      this.StreetTwo = '';
      this.CityList = [];
      this.CountyList = [];
      this.StreetList = [];
      this.selectAreaTwo(this.ProvinceTwo, 1);
      this.momentOrg = '省级工会';
      //this.allAddressName = item.label;
      //this.getParentByAreaTwo(1, this.ProvinceTwo.value, this.orgForm.PhId);
      this.qLayer = 1;
    },
    //改变市级
    changeCityTwo () {
      this.CountyTwo = '';
      this.StreetTwo = '';
      this.CountyList = [];
      this.StreetList = [];
      this.selectAreaTwo(this.CityTwo, 2);
      this.momentOrg = '市级工会';
      //this.allAddressName = this.ProvinceTwo.label + ">" + this.CityTwo.label;
      //this.getParentByAreaTwo(2, this.CityTwo.value, this.orgForm.PhId);
      this.qLayer = 2;
    },
    //改变区级
    changeCountyTwo () {
      this.StreetTwo = '';
      this.StreetList = [];
      this.selectAreaTwo(this.CountyTwo, 3);
      this.momentOrg = '区级工会';
      //this.allAddressName = this.ProvinceTwo.label + ">" + this.CityTwo.label + ">" + this.CountyTwo.label;
      //this.getParentByAreaTwo(3, this.CountyTwo.value, this.orgForm.PhId);
      this.qLayer = 3;
    },
    //改变街道
    changeStreetTwo () {
      this.momentOrg = '街道工会';
      //this.allAddressName = this.ProvinceTwo.label + ">" + this.CityTwo.label + ">" + this.CountyTwo.label + ">" + this.StreetTwo.label;
      //this.getParentByAreaTwo(4, this.StreetTwo.value, this.orgForm.PhId);
      this.qLayer = 4;
    },
    //上一步
    backStep () {
      this.prompt = '工会所属地区选择';
      this.showDialog = true;
    },
    //下一步
    nextStep () {
      if (this.ProvinceTwo != '') {
        this.qLayer = 1;
      }
      if (this.CityTwo != '') {
        this.qLayer = 2;
      }
      if (this.CountyTwo != '') {
        this.qLayer = 3;
      }
      if (this.StreetTwo != '') {
        this.qLayer = 4;
      }
      if (this.qLayer == 1) {
        this.momentOrg = '省级工会';
        this.getallAddressName(this.ProvinceTwo);
        this.getParentByAreaTwo(this.qLayer, this.ProvinceTwo, this.orgForm.PhId);
      } else if (this.qLayer == 2) {
        this.momentOrg = '市级工会';
        this.getallAddressName(this.CityTwo);
        this.getParentByAreaTwo(this.qLayer, this.CityTwo, this.orgForm.PhId);
      } else if (this.qLayer == 3) {
        this.momentOrg = '区级工会';
        this.getallAddressName(this.CountyTwo);
        this.getParentByAreaTwo(this.qLayer, this.CountyTwo, this.orgForm.PhId);
      } else if (this.qLayer == 4) {
        this.momentOrg = '街道工会';
        this.getallAddressName(this.StreetTwo);
        this.getParentByAreaTwo(this.qLayer, this.StreetTwo, this.orgForm.PhId);
      }
      this.prompt = '工会选择';
      this.showDialog = false;
    },
    //获取地址名全称
    getallAddressName (area) {
      var data = {
        areaId: area,
      }
      this.$axios.get('/SysArea/GetAllAreaName', { params: data })
        .then(res => {
          if (res.Status == 'success') {
            this.allAddressName = res.Data;
          }
          //this.allAddressName = JSON.parse(res);
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    },
    //选取父级工会
    getParentOrg () {
      if (this.ProvinceTwo != '') {
        this.momentOrg = '省级工会';
      }
      if (this.CityTwo != '') {
        this.momentOrg = '市级工会';
      }
      if (this.CountyTwo != '') {
        this.momentOrg = '区级工会';
      }
      if (this.StreetTwo != '') {
        this.momentOrg = '街道工会';
      }
      this.showDialog = true;
      this.choosePerantOrg = true;
    },
    //显示组织信息更改记录
    changeRecord () {
      this.record = true;
      console.log(this.record);
      var data = {
        id: this.changePhid,
      }
      this.$axios.get('/SysOrganize/GetOrgChangeRecord', { params: data })
        .then(res => {
          console.log(res);
          this.tableData = res;
        })
        .catch(err => {
          console.log(err);
        })
    },
    //修改编辑页显示
    edit () {
      this.editVisible = true;
      this.isedit = true;
      this.getData();
      this.selectArea(0, 0);
      this.selectAreaTwo(0, 0);
      // this.selectArea(this.orgForm.Province, 1);
      // this.selectArea(this.orgForm.City, 2);
      // this.selectArea(this.orgForm.County, 3);
      // this.getAdminOrganize(this.orgForm.ParentId);
      // this.getParentByArea(4, this.orgForm.Street);
    },
    //改变省后的点击事件
    changeProvince () {
      console.log(this.orgForm.Province);
      this.orgForm.City = '';
      this.orgForm.County = '';
      this.orgForm.Street = '';
      this.Streets = [];
      this.Countys = [];
      this.Citys = [];
      this.selectArea(this.orgForm.Province, 1);
      this.ProvinceTwo = this.orgForm.Province;
      this.ProvinceList = this.Provinces;
      this.CityTwo = '';
      this.CountyTwo = '';
      this.StreetTwo = '';
      this.CityList = [];
      this.CountyList = [];
      this.StreetList = [];
      this.selectAreaTwo(this.orgForm.Province, 1);
      //this.ProvinceTwo.value = this.orgForm.Province;
      //this.qAdressName = this.orgForm.Province.label;
    },
    //改变城市后的点击事件
    changeCity () {
      this.orgForm.County = '';
      this.orgForm.Street = '';
      this.Streets = [];
      this.Countys = [];
      this.selectArea(this.orgForm.City, 2);
      this.CityTwo = this.orgForm.City;
      this.CityList = this.Citys;
      this.CountyTwo = '';
      this.StreetTwo = '';
      this.CountyList = [];
      this.StreetList = [];
      this.selectAreaTwo(this.orgForm.City, 2);
      //this.qAdressName = this.orgForm.Province.label + this.orgForm.City.label;
    },
    //改变区后的点击事件
    changeCounty () {
      this.orgForm.Street = '';
      this.Streets = [];
      this.selectArea(this.orgForm.County, 3);
      this.CountyTwo = this.orgForm.County;
      this.CountyList = this.Countys;
      this.StreetTwo = '';
      this.StreetList = [];
      this.selectAreaTwo(this.orgForm.County, 3);
      //this.qAdressName = this.orgForm.Province.label + this.orgForm.City.label + this.orgForm.County.label;
    },
    //改变街道后的点击事件
    changeStreet () {
      //this.qAdressName = this.orgForm.Province.label + this.orgForm.City.label + this.orgForm.County.label + this.orgForm.Street.label;
      //this.getParentByArea(4, this.orgForm.Street);
      // this.orgForm.Parent = '';
      this.StreetTwo = this.orgForm.Street;
      this.StreetList = this.Streets;
    },
    //查询地区
    selectArea (Area, i) {
      var data = {
        uid: "0",
        orgid: "0",
        id: Area
      }
      this.$axios.get('/SysArea/GetAreaList', { params: data })
        .then(res => {
          console.log(res);
          if (i == 0) {
            this.Provinces = res;
          } else if (i == 1) {
            this.Citys = res;
          } else if (i == 2) {
            this.Countys = res;
          } else if (i == 3) {
            this.Streets = res;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    //修改隶属工会的点击事件
    changeParentOrg () {
      this.orgForm.ParentId = this.orgForm.Parent.PhId;
      this.orgForm.ParentEnCode = this.orgForm.Parent.EnCode;
      this.orgForm.ParentName = this.orgForm.Parent.OrgName;
      console.log(this.orgForm.Parent);
      console.log(this.orgForm.ParentEnCode);
      console.log(this.orgForm.ParentId);
      this.$forceUpdate();
    },
    //根据地址信息获取父级机关工会
    getParentByArea (i, area) {
      var data = {
        rank: i,
        areaCode: area
      }
      this.$axios.get('/SysAdminOrganize/GetParentAdminOrganizeByArea', { params: data })
        .then(res => {
          console.log(res);
          this.ParentLists = res;
          // if(res.length > 0){
          //     this.orgForm.Parent = res[0];
          //     this.orgForm.ParentId = res[0].PhId;
          //     this.orgForm.ParentEnCode = res[0].EnCode;
          //     this.orgForm.ParentName = res[0].OrgName;
          // }else{
          //     this.orgForm.Parent = '';
          //     this.orgForm.ParentId = '';
          //     this.orgForm.ParentEnCode = '';
          //     this.orgForm.ParentName = '';
          // }
        })
        .catch(err => {
          console.log(err);
        })
    },
    //根据组层组织中的父级Id获取相关机关组织
    //getAdminOrganize(phid){
    //var data = {
    //id: phid
    //};
    //this.$axios.get('/SysAdminOrganize/GetSysAdminOrganize', {params: data})
    //.then(res => {
    //this.orgForm.Parent = res;
    //this.orgForm.ParentId = res.PhId;
    //this.orgForm.ParentEnCode = res.EnCode;
    //this.orgForm.ParentName = res.OrgName;
    //})
    //.catch(err => {
    //console.log(err);
    //})
    //},
    //根据组织中的父级Id获取相应组织
    getOrg (phid) {
      var data = {
        id: phid
      };
      this.$axios.get('/SysOrganize/GetSysOrganize', { params: data })
        .then(res => {
          console.log('++++++++++++++++++')
          console.log(res)
          this.orgForm.Parent = res;
          this.orgForm.ParentId = res.PhId;
          this.orgForm.ParentEnCode = res.EnCode;
          this.orgForm.ParentName = res.OrgName;
          // this.orgForm.IndustryName = res.IndustryName
        })
        .catch(err => {
          console.log(err);
        })
    },
    //刷新页面
    freshPage () {
      this.editVisible = false;
      this.isedit = false;
      this.getData();
    },
    //修改保存
    save () {
      var route = this.$route;
      var vm = this;
      this.loading = true;
      let reg = /[0-9,A-Z,a-z]{18}/;
      console.log(this.orgForm.Director);

      if (this.orgForm.OrgName == null || this.orgForm.ParentEnCode == null || this.orgForm.Chairman == null || this.orgForm.Director == null || this.orgForm.Treasurer == null
        || this.orgForm.OrgName == '' || this.orgForm.ParentEnCode == '' || this.orgForm.Chairman == '' || this.orgForm.Director == '' || this.orgForm.Treasurer == ''
        || this.orgForm.Province == null || this.orgForm.City == null || this.orgForm.County == null || this.orgForm.Street == null || this.orgForm.Address == null || this.orgForm.Category == ''
        || this.orgForm.Category == null || this.orgForm.Province == '' || this.orgForm.City == '' || this.orgForm.County == '' || this.orgForm.Street == '' || this.orgForm.Address == '' || this.orgForm.IndustryType == '' || this.orgForm.IndustryName == '') {
        this.$message.error('保存失败,请将必填信息填写完整!');
        //this.getData();
        this.loading = false;
        return;
      }
      if (!reg.test(this.orgForm.EnterpriseCode) && !(this.orgForm.EnterpriseCode == null || this.orgForm.EnterpriseCode == '')) {
        this.$message.error('统一社会信用代码格式不正确,请输入18位数字或字母!');
        this.loading = false;
        return;
      }

      //控制产业工会与一般工会的添加
      if (this.orgForm.Layers >= 5) {
        if (this.orgForm.Category == 'industry') {
          this.$message.error('保存失败,街道及区级产业工会下无法新增产业工会!');
          this.loading = false;
          return;
        }
      } else {
        if (this.orgForm.Category == 'basic') {
          this.$message.error('保存失败,一般工会只能新增在街道工会下!');
          this.loading = false;
          return;
        }
      }
      if (this.orgForm.IndustryType == null || this.orgForm.IndustryName == null) {
        this.$message.error('保存失败,请将必填信息填写完整!');
        //this.getData();
        this.loading = false;
        return;
      }

      //console.log('22222');
      //if(this.orgForm.Layers >= 5 && this.orgForm.Category =='industry'){
      //this.$message.error('保存失败,街道及区级产业工会下无法新增产业工会!');
      //this.loading = false;
      //return;
      // }

      this.orgForm.Integrity = '80';
      if (this.orgForm.EnterpriseAttachment != null && this.orgForm.EnterpriseAttachment != '') {
        this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 5;
      }
      // if(this.orgForm.Address != null && this.orgForm.Address != ''){
      //     this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 20;
      // }
      if (this.orgForm.TelePhone != null && this.orgForm.TelePhone != '') {
        let reg2 = /^[0-9]{11}$/;
        if (!reg2.test(this.orgForm.TelePhone)) {
          this.$message.error("手机号输入错误，请重试！");
          this.loading = false;
          return;
        }
        this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 10;
      }
      if (this.orgForm.ChairmanAttachment != null && this.orgForm.ChairmanAttachment != '') {
        this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 5;
      }
      console.log(this.orgForm.Integrity);
      this.afterChange = JSON.stringify(this.orgForm);
      //提交asiox
      this.isDisabled = false
      SysOrgUpdateAndRecord(vm, {
        otype: 'edit',
        uid: this.userid,
        orgid: this.orgid,
        infoData: { BeforeOrg: JSON.parse(this.beforeChange), AfterOrg: JSON.parse(this.afterChange) },
      }).then(res => {
        this.isDisabled = true
        console.log(this.routerTz);
        this.loading = false;
        if (res.Status == 'success') {
          // if(this.routerTz){
          //     this.message={
          //         message:'请尽快添加其他角色用户！',
          //         delay:4000,
          //         visible:true
          //     }
          //     var vm=this;
          //     setTimeout(function(){
          //         vm.$router.push('/system/account');
          //     },3500)
          //     return;
          //     //this.$router.push('/system/account');
          // }
          this.message = {
            message: '保存成功！',
            delay: 5000,
            visible: true
          };
          let info = UserInfo.getUserInfoData();
          var data = {
            id: this.orgForm.PhId
          };
          this.$axios.get('/SysOrganize/GetSysOrganize', { params: data })
            .then(res => {
              console.log(res);
              info.orgInfo.OrgName = res.OrgName;
              info.orgInfo.EnCode = res.EnCode;
              info.orgInfo.Chairman = res.Chairman;
              info.orgInfo.Director = res.Director;
              info.orgInfo.Treasurer = res.Treasurer;
              info.orgInfo.Cashier = res.Cashier;
              info.orgInfo.AccountPeople = res.AccountPeople;

              this.$store.commit("user/setUserInfo", info);
              let info2 = UserInfo.getUserInfoData();
              console.log(info2);
            })
            .catch(err => {
              console.log(err);
            });
          //this.$message.success("保存成功！");
          this.editVisible = false;
          this.isedit = false;
          this.getData();
          if (this.routerTz) {
            this.message = {
              message: '请尽快添加其他角色用户！',
              delay: 4000,
              visible: true
            }
            var vm = this;
            setTimeout(function () {
              vm.$router.push('/system/account');
            }, 3500)
            this.routerTz = false;
            return;
            //this.$router.push('/system/account');
          }
          //移除TagNav
          //this.$store.commit("tagNav/removeTagNav", route);
          //跳转路由
          //this.$router.push('/system/organization');
        } else {
          this.$message.error('保存失败,请重试!');
        }
      }).catch(error => {
        this.isDisabled = true
        console.log(error);
        this.loading = false;
        this.$message.error('保存组织错误');
      })
      // var data = {
      //     beforeOrg: JSON.parse(this.beforeChange),
      //     afterOrg: JSON.parse(this.afterChange),
      // };
      // var data = {
      //     infoData: {BeforeOrg: JSON.parse(this.beforeChange), AfterOrg: JSON.parse(this.afterChange)},
      // };
      // this.$axios
      //     .post("/SysOrganize/PostOrgChangeRecord", data)
      //     .then(res => {
      //     });
    },
    //获取组织信息
    getData () {
      var vm = this;
      this.loading = true;
      if (this.isedit) {
        SysOrgModel(vm, {
          id: this.orgid,
          uid: this.userid,
          orgid: this.orgid
        }).then(res => {
          this.loading = false;
          if (res.Status === "error") {
            this.$message({ showClose: true, message: res.Msg, type: 'error' });
            return;
          }
          this.orgForm = res;
          //console.log(this.orgForm);
          this.changePhid = res.PhId;
          this.beforeChange = JSON.stringify(res);
          this.selectArea(this.orgForm.Province, 1);
          this.selectArea(this.orgForm.City, 2);
          this.selectArea(this.orgForm.County, 3);
          this.selectAreaTwo(this.orgForm.Province, 1);
          this.selectAreaTwo(this.orgForm.City, 2);
          this.selectAreaTwo(this.orgForm.County, 3);
          this.ProvinceTwo = this.orgForm.Province;
          this.CityTwo = this.orgForm.City;
          this.CountyTwo = this.orgForm.County;
          this.StreetTwo = this.orgForm.Street;

          if (res.IndustryType) {
            if (this.tradeData !== 1 && this.tradeData[0].Code !== '9999') {
              this.tradeId = res.IndustryType
            } else {
              this.tradeId = '9999'
            }
          }
          //this.orgForm.IndustryName = res.IndustryName
          //this.orgForm.Address = "222";
          //this.getParentByArea(4, this.orgForm.Street);
          if (this.orgForm.ParentId != '' && this.orgForm.ParentId != null && this.orgForm.ParentId > 0) {
            this.getOrg(this.orgForm.ParentId);
          }
          this.orgForm.IndustryName = res.IndustryName
          console.log(this.orgForm.Address);
        }).catch(error => {
          console.log(error);
          this.loading = false;
          this.$message({
            showClose: true,
            message: '组织信息获取错误',
            type: 'error'
          })
        })

      } else {
        //console.log("22222222222");
        AllAreaSysOrgModel(vm, {
          id: this.orgid,
          uid: this.userid,
          orgid: this.orgid
        }).then(res => {
          console.log(res)
          this.loading = false;
          if (res.Status === "error") {
            this.$message({ showClose: true, message: res.Msg, type: 'error' });
            return;
          }
          this.orgForm = res;
          if (this.orgForm.EnableTime != null && this.orgForm.EnableTime != '') {
            this.orgForm.EnableTime = this.orgForm.EnableTime.substr(0, 10);
          }
          if (this.orgForm.ServiceStartTime != null && this.orgForm.ServiceStartTime != '') {
            this.orgForm.ServiceStartTime = this.orgForm.ServiceStartTime.substr(0, 16);
          }
          if (this.orgForm.ServiceEndTime != null && this.orgForm.ServiceEndTime != '') {
            this.orgForm.ServiceEndTime = this.orgForm.ServiceEndTime.substr(0, 16);
          }
          this.changePhid = res.PhId;
        }).catch(error => {
          console.log(error);
          this.loading = false;
          this.$message({
            showClose: true,
            message: '组织信息获取错误',
            type: 'error'
          })
        })
      }
    },
    //备份
    Backups () {
      this.$message.error('正在开发中！');
    },
    Recover () {
      this.$message.error('正在开发中！');
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeAvatarUpload (file) {
      const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif') || (file.type === 'image/jpg');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error('上传图片只能是 JPG,png,gif,jpeg 格式!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return false
      }
    },
    uploadFileMethodEnterprise (param) {
      let fileObject = param.file;
      let formData = new FormData();
      formData.append('id', this.orgForm.PhId)
      formData.append("file", fileObject);

      this.uploadFile(formData).then(res => {
        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }
        //回传的上传临时文件
        if (res.Data[0]) {
          this.orgForm.EnterpriseAttachment = res.Data[0];
          this.$message.success("上传成功");
          // console.log(this.orgForm.EnterpriseAttachment);
        }

      }).catch(error => {
        console.log(error);
        this.$message({ showClose: true, message: '上传附件失败', type: 'error' })
      })
    },
    uploadFileMethodChairman (param) {
      let fileObject = param.file;
      let formData = new FormData();
      formData.append('id', this.orgForm.PhId)
      formData.append("file", fileObject);

      this.uploadFile(formData).then(res => {
        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }

        //回传的上传临时文件
        if (res.Data[0]) {
          this.orgForm.ChairmanAttachment = res.Data[0];
          this.$message.success("上传成功");
        }

      }).catch(error => {
        console.log(error);
        this.$message({ showClose: true, message: '上传附件失败', type: 'error' })
      })
    },

    testFile () {
      //this.fileVisible=true;

    },
    removeimg (item, deleValue) {
      this.imglist = item;
      console.log(item)

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

      }).catch(error => {
        console.log(error);
        this.$message({ showClose: true, message: '附件删除错误', type: 'error' });
      });
    },
    uploadimg (item) {
      //console.log(item)
      this.imglist.push(item);
    },
    //打开单位归属行业弹框
    openTrade () {
      this.chooseTrade = true
    },
    //获取所有启用的行业
    loadTrade () {
      this.$axios.get('/SysConfig/GetIndustryConfigList').then(res => {
        if (res.Record.length === 1 && res.Record[0].Code === '9999') {
          this.tradeId = res.Record[0].Code
        }

        if (res.Record) {
          this.tradeData = res.Record
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //获取单位归属行业
    getTrade (trade) {
      console.log(trade);
      this.orgForm.IndustryName = trade.Value;
      this.orgForm.IndustryType = trade.Code;
      this.trade = trade;
      this.chooseTrade = false
    },
    //关闭单位归属行业选择
    closeTrade () {
      this.chooseTrade = false
    }
  }
}
</script>
<style lang="scss" scoped>
.demo .el-input--suffix .el-input__inner {
  margin: 0;
  padding-right: 0;
  height: 40px;
  line-height: 40px;
}
.demo .el-input__inner {
  background-color: #00b8ee;
  text-align: center;
  color: #ffffff;
}
.el-icon-refresh:before {
  /* content: "\E6D0";*/
  font-size: 25px;
  color: #00b8ee;
}
.inf-change-recordz {
  /* width: 100%; */
  height: 100%;
  padding: 0;
  margin: 0;
  display: block;
  /* margin-top: -210px; */
  line-height: 23px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  //font-weight: bold;
  /* box-shadow: 0 0; */
  text-shadow: 0 1px 1px #012631;
}
.inf-change-record {
  width: 30px;
  height: 100%;
  position: absolute;
  left: -45px;
  /* background: #000; */
  /* margin: auto auto 0; */
  /* display: block; */
  margin-left: 9px;
  /* background: #6F6F6F; */
}
.inf-change-rec {
  position: absolute;
  /* bottom: 200px; */
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  //border-right: 60px solid #00B8EE;
  border-left: 40px solid #00b8ee;
  height: 210px;
  width: 50px;
  line-height: 500px;
  right: -52px;
  top: 55%;
  margin-top: -150px;
  /* box-shadow: 0 1px 1px #012631; */
}
.choose {
  background: #fff;
  padding: 5px;
  font-size: 15px;
}

.choose > ul {
  justify-content: flex-end;
}

.choose > ul > li {
  margin-left: 15px;
  padding: 2px 8px;
  border: 1px solid #ff9900;
  border-radius: 3px;
  cursor: pointer;
}
.footInfo {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
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

.choose > ul > li:hover {
  background: #ff9900;
  color: #fff;
}

.addTitle {
  font-size: 18px;
  font-size: 18px;
  text-align: center;
  padding-bottom: 10px;
}
.el-input--suffix .el-input__inner {
  height: auto;
  margin: 0;
  padding-right: 0;
}
.pic-input {
  width: 100%;
  float: left;
  border-width: 0 0 1px 0;
}
.pic-input-area {
  width: 100%;
  float: left;
  height: 100%;
}
.orgedit-linehight {
  height: 40px;
  border-bottom: 1px solid #b1def1;
  line-height: 40px;
  font-size: 14px;
}

.orgedit-title {
  height: 100%;
  width: 30%;
  float: left;
  color: #fff;
  background: #00b8ee;
}

.orgtitle-ringt {
  float: right;
}

.orgedit-value {
  height: 100%;
  width: 60%;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 10px;
}
</style>
<style lang="scss">
.addressStyle .el-input__inner {
  border-width: 0 0 1px 0 !important;
  border-radius: 0 !important;
  color: #00b8ee;
}
.addressStyle .el-form-item__error {
  top: 30%;
  left: 50%;
}
.addressStyle .el-input__inner:hover {
  border-bottom-color: #00b7ee;
}
.addressStyle > ul > li:hover {
  background: #cccccc;
}
.promptW .el-input.is-disabled .el-input__inner {
  background: #00b8ee;
  border-radius: 0;
  color: #ffffff;
  text-align: center;
  border: 0;
}
.promptWhite .el-input.is-disabled .el-input__inner {
  background: #fff;
  color: #888;
  text-align: left;
  padding-left: 20px;
}
.avatar-uploader {
  position: absolute;
  z-index: 1;
  right: 25px;
  top: -20px;
}
.addressStyle .el-input--suffix .el-input__inner {
  line-height: 40px;
  height: 40px;
  margin: 0;
  padding-right: 0;
  width: 100%;
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
  height: 40.5px;
  color: #fff;
}

.orgform .el-form-item {
  margin-bottom: 1px;
}
.pictrueUpload {
  width: 100%;
  height: 100%;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-right: 4px;
  font-size: 15px;
}
.organize {
  .uploadCon {
    width: 100%;
    height: 40px;
    position: relative;
    .upload {
      position: absolute;
      right: 5px;
      top: 7px;
    }
  }
  .avatar-uploader .el-upload--text {
    width: 25px;
    height: 25px;
    line-height: 25px;
    border: 1px dashed #aaa;
  }
  .avatar-uploader-icon {
    width: 25px;
    height: 25px;
    line-height: 25px;
    font-size: 16px;
  }
  .el-dialog__body {
    padding: 20px 20px 0;
  }
  .organizeParent {
    .organizeParentNow {
      > div:first-of-type {
        > div {
          border: 0;
          > input {
            border: 0;
            color: #666;
          }
        }
      }
    }
    .organizeSearch {
      > div:first-of-type {
        border: 0;
        > input {
          border: 0;
          color: #666;
        }
      }
    }
  }
}
.el-popper {
  min-width: 80px !important;
}
.addressStyle .el-input__inner::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #c0c4cc;
}
.addressStyle .el-input__inner:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c0c4cc;
}
.addressStyle .el-input__inner::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c0c4cc;
}
.addressStyle .el-input__inner:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #c0c4cc;
}
</style>
