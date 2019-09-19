<template>
    <div class="timeSelect">
        <div class="container">
        <div class="manageContent">
            <div class="flexUl" style="width: 100%;">
                <span style="display: inline-block;line-height: 30px;float: left;margin-right: 10px">科目类别:</span>
                <el-select v-model="s_type" placeholder="请选择科目类别" @change="getDataNew" class="handle-select mr10" style="margin-top: 0px;float: left">
                    <el-option v-for="item in subjectType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
                <ul class="flexUl">
                    <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;float: right;" class="el-icon-refresh" @click="refresh"></li>
                    <li type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10" @click="loadSub" style="float: right;margin-left: 10px">导出</li>
                    <li type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10" @click="showReportMsg.loadFlag=true" style="float: right;margin-left: 10px">导入</li>
                    <li type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10" @click="Delete" style="float: right">删除</li>
                    <li type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10" @click="Edit" style="float: right">修改</li>
                    <li type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" @click="Add" style="float: right">新增</li>

                </ul>
                <ul  class="flexUl handle" style="line-height: 30px">
                    <div class="searcherValue"><input type="text" placeholder="科目编码/名称" v-model.trim="s_word"></div>
                    <div  class="searcherBtn" @click="search">搜索</div>
                </ul>
            </div>
            <div class="formData" >
                <div class="tbHeader">
                    <table>
                        <colgroup>
                            <col width="12%"/>
                            <col width="20%"/>
                            <col width="20%"/>
                            <col width="12%"/>
                            <col width="12%"/>
                            <col width="12%"/>
                            <col width="12%"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <td><input type="checkbox" v-model="checkAll">序号</td>
                            <td>科目编码</td>
                            <td>科目名称</td>
                            <td>科目类别</td>
                            <td>余额方向</td>
                            <td>是否预算</td>
                            <td>停用/启用</td>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="tbBody ">
                    <table  ref="printFrom">
                        <colgroup>
                            <col width="12%"/>
                            <col width="20%"/>
                            <col width="20%"/>
                            <col width="12%"/>
                            <col width="12%"/>
                            <col width="12%"/>
                            <col width="12%"/>
                        </colgroup>
                        <tbody>
                            <template v-for="(item,index) in data">
                                <tr @click.stop="clickRow(index)">
                                    <td class="center"><input type="checkbox" v-model="checkList[index]">{{index+1}}</td>
                                    <td :style="{'text-indent': (item.Layers)*20+'px'}">{{item.KCode}}</td>
                                    <td>{{item.KName}}</td>
                                    <td class="center">
                                        <span v-if="item.KType==='1'">资产类</span>
                                        <span v-else-if="item.KType==='2'">负债类</span>
                                        <span v-else-if="item.KType==='3'">净资产类</span>
                                        <span v-else-if="item.KType==='4'">收入类</span>
                                        <span v-else-if="item.KType==='5'">支出类</span>
                                        <span v-else>{{item.KType}}</span>
                                    </td>
                                    <td class="center">
                                        {{balanceTypeList[item.KBalanceType]||item.KBalanceType}}
                                        <!--<span v-if="item.KBalanceType==='1'">借方</span>
                                        <span v-else-if="item.KBalanceType==='2'">贷方</span>
                                        <span v-else-if="item.KBalanceType==='3'">两性</span>
                                        <span v-else>{{item.KBalanceType}}</span>-->
                                    </td>
                                    <td class="center"  @click.stop="abdis(0,index)">
                                        <span :class="{'rightIcon':item.IsBudget===0,'falseIcon':item.IsBudget===1,'el-icon-close':item.IsBudget===1}"></span>
                                    </td>
                                    <td class="center"  @click.stop="abdis(1,index)">
                                        <div :class="{'rightIcon':item.EnabledMark===0,'falseIcon':item.EnabledMark===1,'el-icon-close':item.EnabledMark===1}"></div>
                                        <!--<template  v-if="item.EnabledMark===0">
                                            <div class="rightIcon" :data-value="item.PhId+'-'+item.EnabledMark" @click="abdis(1)"></div>
                                        </template>
                                        <template v-else>
                                            <div class="falseIcon el-icon-close" :data-value="item.PhId+'-'+item.EnabledMark" @click="abdis(1)"></div>
                                        </template>-->
                                    </td>
                                </tr>
                            </template>
                            <template v-if="data.length == 0">
                                <tr>
                                    <td colspan="7" class="center">未查询到符合条件的科目</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 编辑弹出框 -->
           <el-dialog v-if="editVisible" :title="dialogState=='add'?'科目新增':'科目修改'" :visible.sync="editVisible" width="40%">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                    <el-form-item label="科目编码：" prop="KCode">
                        <el-input v-model="form.KCode">
                            <template v-if="parentKCode!==''&&dialogState=='add'" slot="prepend">{{parentKCode}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="科目名称：" prop="KName">
                        <el-input v-model="form.KName"></el-input>
                    </el-form-item>
                    <el-form-item label="科目类别：" prop="KTypeRule">
                        <el-select :disabled="parentKCode!==''" v-model="form.KType" placeholder="请选择">
                                <el-option v-for="item in subjectType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="余额方向：" prop="KBalanceType">
                        <el-radio-group v-model="form.KBalanceType" :disabled="parentKCode!==''">
                            <template v-if="singleSelection.length>0">
                                <el-radio v-for="item in singleSelection[0].KBalanceType" :key="item" :label="item">{{balanceType[item-1].name}}</el-radio>
                            </template>
                            <template v-else>
                                <el-radio v-for="item in balanceType" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                            </template>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否预算：" prop="KBalanceType">
                        <el-radio-group v-model="form.KBudget">
                                <el-radio :key="0" :label="0">是</el-radio>

                                <el-radio :key="1" :label="1">否</el-radio>

                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="科目状态：">
                        <el-radio-group v-model="form.KEnable">
                            <el-radio :key="0" :label="0">启用</el-radio>

                            <el-radio :key="1" :label="1">停用</el-radio>

                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <button class="disBtn" @click="callof('form')">取 消</button>
                    <button class="conBtn" @click="Save('form')">保 存</button>

                </span>
            </el-dialog>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>

        <!--文件上传-->
        <div class="cover" :style="{'display':(showReportMsg.loadFlag?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30%;">
                <div class="flexPublic">
                    <p>选择文件</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.loadFlag=false"></i>
                </div>
                <div>
                    <el-upload
                        ref="piclist"
                        drag
                        action=""
                        :limit="1"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUploadPic"
                        :http-request='uploadFileMethod'>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传Excel文件</div>
                    </el-upload>
                    <div class="button" style='cursor: pointer;width: 110px;padding: 0;margin-top:10px' @click="loadExcel">下载导入模板</div>
                </div>
            </div>
        </div>
        <!--文件上传成功，数据库导入-->
        <div class="cover" :style="{'display':(showReportMsg.loadFlagSecond?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30%;">
                <div class="flexPublic">
                    <p>批量导入</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.loadFlagSecond=false"></i>
                </div>
                <div>
                    <div style="color: #02a7e7;border: none;">
                        {{showReportMsg.loadFlagSecondMsg}}
                    </div>
                   <!-- <div style="margin-top: 15px;padding:0 ">是否跳过重复数据，继续批量导入？</div>-->
                </div>
                <!--<ul class="flexPublic handle" style="margin-bottom: 20px">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="clearFile">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="updateFile">导入</li>
                </ul>-->
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import treeTable from "@/components/tree-table/indexHeight";
import { SubjectAdd,SubjectUpdate,SubjectList,SubjectDelete } from '@/api/subject/subjectInfo'
import { AuxiliaryTypeList } from '@/api/Auxiliary/typeInfo'
import Auth from "@/util/auth";
import saasMsg from '@/components/message/message';
import axios from "axios";
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import qs from "qs";

export default {
  name: "subjectList",
  components: { treeTable ,saasMsg},
  data() {
    return {
      columns: [
        {
          text: "科目编码",
          value: "KCode",
          width: 200
        },
        {
          text: "科目名称",
          value: "KName"
        }
      ],
        current:(new Date()).getFullYear(),//获取系统当前时间
      data: [],
      checkList:[],
        checkCount:0,//选中框技术，用于后续判断
        checkAll:false,
      extraheight:300,
      expandAll: true,
      loading: false,
      s_type: "0",//选择科目类别
      s_word: "",
      dialogState: "add",
      editVisible: false,
      parentKCode:'',
      singleSelection:[],
      subjectType:[
          {code:'0',name:'全部'},
          {code:'1',name:'资产类'},
          {code:'2',name:'负债类'},
          {code:'3',name:'净资产类'},
          {code:'4',name:'收入类'},
          {code:'5',name:'支出类'},
      ],
        subjectTypeList:['全部','资产类','负债类','净资产类','收入类','支出类'],
      balanceType:[
           {code:'1',name:'借方'},
           {code:'2',name:'贷方'},
           {code:'3',name:'借/贷'},
      ],
        balanceTypeList:{1:'借方',2:'贷方',3:'两性'},
      auxiliaryTypes:[],
      form: {
        PhId:0,
        KCode: "",//科目编码
        KName: "",//科目名称
        KType:"",//科目类型
        KBalanceType: 1,//余额方向
        KBudget: 0,//是否预算
        KEnable:0//科目状态
      },
      rules: {
        KCode: [
          { required: true, message: "请输入科目编码", trigger: "blur" }
        ],
        KName: [
          { required: true, message: "请输入科目名称", trigger: "blur" }
        ],
        KType: [
          { required: true, message: "请选择科目类别", trigger: "change" }
        ],
        KBalanceType: [
          { required: true, message: '请选择余额方向', trigger: 'change' }
        ]
      },
    saasMessage:{
        visible:false,  //消息弹出框*******
        message:'', //消息主体内容**************
        delay:0
    },
    showReportMsg: {   //显示导入弹窗
      loadFlag:false,//显示文件选择弹窗
      loadFlagSecond:false,//显示导入弹窗
      loadFlagSecondMsg:'',//导入弹窗提示消息（后台返回，是否有重复）
      loadFile:{
        name:'',//上传文件名
        type:''//上传文件类型
      }
  }
    }
  },
  created() {

  },
    watch:{
        checkAll:function(){
            this.singleSelection=[];
            for(var i in this.checkList){
                if(this.checkAll){
                this.checkList[i]=true;
                }else{this.checkList[i]=false;}
            }
        }
    },
  mounted:function(){
      this.getDataNew();
    //获取科目列表数据
  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          orgid: state => state.user.orgid
      })
  },
  methods: {
      //数据查询
      async getDataNew(){
          let data={
              Uyear:this.current,
              KType:this.s_type,
              KCode:this.s_word,
              KName:this.s_word
          }
          this.singleSelection=[];
          this.$axios.get('PSubject/GetSystemSubject',{params:data}).then(res=>{
              if(res.Status== "success"){
                  this.checkList=[];
                  this.data=res.Data;
                  for(var i in res.Data){
                      this.checkList[i]=false;
                  }
              }
          }).catch(err=>{
              console.log(err);
          })
      },
      //新增页面，数据清除
      Add() {
          this.handleClickRow();
          if(this.checkCount>1){
              this.saasMessage={
                  message:'该操作只对单条记录有效，请重新选择',
                  delay:3000,
                  visible:true
              };
              return;
          }else{
              let object = this.singleSelection;
              let id =  object.PhId || 0;
              this.dialogState = "add";
              this.editVisible = true;
              this.$nextTick(() => {
                  //this.$refs.form.resetFields();  //新增页面数据清空
                  this.form.PhId=0;
                  this.form.KCode='';
                  this.form.KName='';
                  this.form.KType=object.KType||'';
                  this.form.KBalanceType=object.KBalanceType|| 0;;
                  this.form.KBudget=(object.KCode.substring(0,1)==4||object.KCode.substring(0,1)==5)?0:1;
                  this.form.KEnable=0;
              })
              this.parentKCode=object.KCode||'';
          }

      },
      //新增保存
      async saveAdd(){
          let selectSub = this.singleSelection;
          //获取缓存 的用户 组织，角色基本信息
          let cookiesUser = Auth.getUserInfoData();
          let data={
              Layers:selectSub.Layers+1,//层级
              KCode:this.parentKCode + this.form.KCode,//KCode科目编码
              KName:this.form.KName,//KName科目名称
              KBalanceType:this.form.KBalanceType,//KBalanceType余额方向（1-借，2-贷）
              KType:this.form.KType,//KType科目类型（1-资产，2-负债，3-净资产，4-收入，5-支出）
              IsLast:1,//IsLast是否末级（0-否，1-是）
              IsSystem:1,//IsSystem是否系统内置（0-否，1-是）
              IsBudget:this.form.KBudget,//IsBudget是否预算（暂时当做0-是，1-否）
              Uyear:this.current,//Uyear年度
              ParentId:selectSub.PhId//ParentId父级id
          }
          this.$axios.post('PSubject/PostAddSystemSubject',data).then(res=>{
              this.getDataNew();
              this.saasMessage={
                  message:res.Msg,
                  delay:3000,
                  visible:true
              };
              if(res.Status=='success'){
                  this.editVisible = false;
                  this.$nextTick(() => {
                      //this.$refs.form.resetFields();  //新增页面数据清空
                      this.form.PhId=0;
                      this.form.KCode='';
                      this.form.KName='';
                      this.form.KType='';
                      this.form.KBalanceType=0;
                      this.form.KBudget=0;
                      this.form.KEnable=0;
                  })
                  this.parentKCode='';
              }
          }).catch(err=>{
              console.log(err);
          })
      },
      //修改页面数据渲染
      Edit() {
          this.handleClickRow();
          if(this.checkCount>1){
              this.saasMessage={
                  message:'该操作只对单条记录有效，请重新选择',
                  delay:3000,
                  visible:true
              };
              return;
          }else if(this.checkCount==0){
              this.saasMessage={
                  message:'请选中列表的其中一行',
                  delay:3000,
                  visible:true
              };
              return;
          }else {
              let object = this.singleSelection;
              if (object != '') {
                  let id = object.PhId;
                  this.parentKCode = '';
                  this.form.PhId = object.PhId;
                  this.form.KCode = object.KCode;
                  this.form.KName = object.KName;
                  this.form.KType = object.KType;
                  this.form.KBalanceType = object.KBalanceType;
                  this.form.KBudget = object.IsBudget;
                  this.form.KEnable = object.EnabledMark;
                  this.dialogState = "edit";
                  this.editVisible = true;
              } else {
                  this.saasMessage = {
                      message: '请选中列表的其中一行',
                      delay: 3000,
                      visible: true
                  };
              }
              this.parentKCode=object.KCode||'';
          }
      },
      //修改保存：0修改预算，1修改停用，2，修改
      async saveEdit(type,index){
          let selectSub = [];
          if(type==0){
              selectSub = this.data[index];
              selectSub.IsBudget=selectSub.IsBudget==0?1:0;
          }
          else if(type==1){
              selectSub = this.data[index];
              selectSub.EnabledMark=selectSub.EnabledMark==0?1:0;
          }else{
              selectSub = this.singleSelection;
              selectSub.KCode= this.form.KCode;//KCode科目编码
              selectSub.KName=this.form.KName;//KName科目名称
              selectSub.KBalanceType=this.form.KBalanceType;//KBalanceType余额方向（1-借，2-贷）
              selectSub.KType=this.form.KType;//KType科目类型（1-资产，2-负债，3-净资产，4-收入，5-支出）
              selectSub.IsBudget=this.form.KBudget;//IsBudget是否预算（暂时当做0-是，1-否）
              selectSub.EnabledMark=this.form.KEnable;//IsBudget是否启用（暂时当做0-是，1-否)
              selectSub.Uyear=this.current//Uyear年度
          }
          this.$axios.post('PSubject/PostUpdateSystemSubject',selectSub).then(res=>{
              if(res.Status=='error'){
                  this.singleSelection=[];
                  this.getDataNew();
                  this.saasMessage={
                      message:res.Msg,
                      delay:3000,
                      visible:true
                  };
                  return;
              }
              this.saasMessage={
                  message:res.Msg,
                  delay:3000,
                  visible:true
              };
              this.editVisible = false;
              this.singleSelection=[];
              this.getDataNew();
          }).catch(err=>{
              console.log(err);
          })
      },
      clickRow:function(index){
          if(this.checkList[index]){
              this.checkList[index]=false;
          }else{
              this.checkList[index]=true;
          }
          this.$forceUpdate();
      },
      //选中列表处理
      handleClickRow:function(){
        this.checkCount=0;
        let k=0;
        for(var i in this.checkList){
            if(this.checkList[i]){
                this.checkCount++;
                k=i;
            }
        }

        if(this.checkCount===1){
            this.singleSelection=this.data[k];
        }else{
            this.singleSelection=[];
        }
      },
      //删除按钮
      Delete() {
          this.handleClickRow();
          let object = this.singleSelection;
          if (object != '') {
              this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
              }).then(res => {

                  let data={
                      KCode:object.KCode,
                      Uyear:this.current
                  }
                  this.$axios.post('PSubject/PostDeleteSystemSubject',data).then(res=>{
                      this.saasMessage={
                          message:res.Msg,
                          delay:3000,
                          visible:true
                      };
                      if(res.Status=='success'){
                          this.singleSelection=[];
                          this.getDataNew()
                      }
                  }).catch(err=>{
                      console.log(err);
                  })
              });
          } else {
              this.saasMessage={
                  message:'请选择列表中的一行',
                  delay:3000,
                  visible:true
              };
          }
      },
    //搜索按钮
    search() {
        this.getDataNew();

    },
      //停用启用EnabledMark,是否作为预算科目，方法共用
      abdis(type,index) {
          let msg='';
          if(type==0){
              msg='此操作将修改该数据是否作为预算科目, 是否继续?'
          }else{
              msg='此操作将修改该数据启用状态, 是否继续?'
          }
          this.$confirm(msg, "修改提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          }).then(res => {

              if(res=='confirm'){
                  this.saveEdit(type,index);
              }
          }).catch(er=>{
              this.loading = false;
              /*this.saasMessage={
                  message:'操作异常，请刷新页面后重试',
                  delay:3000,
                  visible:true
              };*/
          })
      },


    // 保存表单 (新增，修改)
    Save(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.dialogState==='edit'){
              this.saveEdit(2)
          }else{
              this.saveAdd()
          }

        } else {
          return false;
        }
      });
    },

    //取消表单
    callof(formName){
        //隐藏弹出框
        this.editVisible = false;
        this.$refs[formName].resetFields();
    },
      //只能选择一个文件
      handleExceed(files, fileList) {
          this.$message.warning(`一次只能导入一个文件！`);
      },

      //文件类型判断
      beforeUploadPic(file) {
          const isRightType = (file.type === 'application/vnd.ms-excel');

          if (!isRightType) {
              this.$message.error('请选择Excel文档!');
              return false
          }
      },
      //文件上传
      uploadFileMethod(param) {
          var _$this=this;
          let fileObject = param.file;
          let formData = new FormData();
          formData.append("file", fileObject);
          let baseheader=httpConfig.getHeaderConfig(this.dbname);
          let base=httpConfig.getAxiosBaseConfigUncontrol();

          let config_header = { "Content-Type": "multipart/form-data" };
          var new_header = Object.assign({},config_header, baseheader);
          let loading=this.$loading();
          loading.setText('文件正在上传...')
          let timer = setTimeout(function(){
              loading.setText('数据比对中，请耐心等待..')
          },1500);
          axios.create(base).post('PSubject/PostImportPSubject', formData, { headers:new_header }).then(res => {
              loading.close();
              var response=JSON.parse(res.data);
              if(response.Status=='success'){
                  //this.showReportMsg.loadFlagSecondMsg=response.Msg;
                  //this.showReportMsg.loadFlagSecond=true;
                  this.showReportMsg.loadFlag=false;//UploadPath IsRepeat
                  //this.showReportMsg.loadFile.name=response.UploadPath;
                  //this.showReportMsg.loadFile.type=response.IsRepeat;
                  this.saasMessage={
                      message:response.Msg,
                      delay:3000,
                      visible:true
                  };
                  this.getDataNew()
              }else{
                  _$this.$refs.piclist.clearFiles();
                  _$this.$message({showClose: true, message: response.Msg, type: 'error'});
              }

          }).catch((error) =>{
              loading.close();
              //错误
              this.showReportMsg.loadFlag=false;
              _$this.$refs.piclist.clearFiles();
              _$this.$message({showClose: true, message: error, type: 'error'});
          });

      },

      ///科目导入模板下载
      loadExcel:function(){
          let base=httpConfig.getAxiosBaseConfig();
          window.location.href = base.baseURL + "/File/GetExportFile?filePath=template&fileName=内置科目导入模板.xls";
      },
      //科目导出
      loadSub:function(){
          let codeList=[];
          for(let i in this.checkList){
              if(this.checkList[i]){
                  codeList.push(this.data[i].KCode)
              }
          }
          if(codeList.length==0){
              this.saasMessage={
                  message:'请选择要导出的科目',
                  delay:3000,
                  visible:true
              };
              return;
          }
          let data={
              Uyear:this.current,
              KCodes:codeList,
          }
          this.$axios.get('PSubject/GetSubjectExcel',{params:data}).then(res=>{
              if(res.Status=="error"){
                  this.$message({ showClose: true, message: res.Msg, type: 'error' })
              }else{
                  let base = httpConfig.getAxiosBaseConfigUncontrol();
                  let tempLink = document.createElement("a");
                  let downloadUrl=base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
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
          }).catch(err=>{
              console.log(err);
          })
      },
      //显示弹窗
      showLoad:function(){
          this.showReportMsg.loadFlag=true;
      },
      //清除文件上传弹窗信息
      clearFile:function(){
          this.showReportMsg.loadFlagSecondMsg='';
          this.showReportMsg.loadFlagSecond=false;
          this.showReportMsg.loadFile.name='';
          this.showReportMsg.loadFile.type='';
          this.$refs.piclist.clearFiles();
      },
      //科目文件导入数据库
      updateFile:function(){
          let baseheader=httpConfig.getHeaderConfig(this.dbname);
          let base=httpConfig.getAxiosBaseConfigUncontrol();
          let loading=this.$loading();

          let timer = setTimeout(function(){
              loading.setText('导入时间过长，请耐心等待，勿关闭浏览器')
          },3000);
/*
          let param={
              'IsIgnore':this.showReportMsg.loadFile.type,
              'UploadPath':this.showReportMsg.loadFile.name
          };*/
          axios.create(base).post('PSubject/PostImportPSubject', { headers:baseheader }).then(res => {
              loading.close();
              clearTimeout(timer);
              res = qs.parse(res);
              res = JSON.parse(res.data);
              if (res.Status == 'success') {
                  this.showReportMsg.loadFlagSecond = false;
                  this.$message({showClose: true, message: '批量导入成功', type: 'success'});
                  this.$refs.piclist.clearFiles();
              } else {
                  this.showReportMsg.loadFlagSecond = false;
                  this.$message({showClose: true, message: res.Msg, type: 'error'});
                  this.$refs.piclist.clearFiles();
              }
          }).catch(err=>{
              loading.close();
              console.log(err);
          })
      },
      refresh:function(){
          this.getDataNew();
      }

  }
};
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
    td input{
        position: absolute;
        left: 10px;
        margin-top: 3px;
    }
    .container{
        padding-right: 20px;
    }
.el-checkbox-role {
  width: 100%;
  float: left;
  margin-left: 0px;
}
/* .el-checkbox-role >.el-checkbox__label{
        width: 80%;
    } */
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
    height: 32px;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.rightIcon{
    height: 10px;
    width: 23px;
    border-width: 0px 0px 2px 2px;
    border-style: solid;
    border-color: #00d1b2;
    transform: rotate(-40deg);
    cursor: pointer;
    display: inline-block;
}
.falseIcon{
    color: red;
    font-size: 25px;
    cursor: pointer;
    width: 100%;
    text-align: center;
    margin-left: -10px;
}
    .el-checkbox{
        float: left;
    }
.cover{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(66,66,66,0.45);
    z-index: 99;
    text-align: center;
    overflow-y: auto;
}
.coverContent{
    background-color: #fff;
    width: 362px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -87.5px -181px;
    box-shadow: 0 0 5px 1px #d3e9f9;
}
.coverContent .button{
    height: 30px;
    width: auto;
    color:#00B8EE;
    background-color: #fff ;
    border: 1px solid #00B8EE;
    border-radius: 3px;
    line-height: 30px;
    margin: auto;
}
.coverContent .button:hover{
    color: #00B8EE;
    background-color: #fff;
}
.coverContent div:nth-of-type(1){
    border-bottom: 1px solid #eee;
    padding:10px 20px;

}
.coverContent div:nth-of-type(2){
    padding: 10px 20px;
}
.coverContent ul{
    padding: 0px 50px;
    margin-bottom: 20px;
}
.coverContent ul li:nth-of-type(1){
    border: 1px solid #00B8EE;
    color: #00B8EE;
    background:#FFF ;
    padding: 5px 15px;
    width: 100px;
    border-radius: 3px;
}
.coverContent ul li:nth-of-type(2){
    border: 1px solid #00B8EE;
    color: #FFF;
    background: #00B8EE;
    padding: 5px 15px;
    width: 100px;
    border-radius: 3px;
}
.coverContent ul li:nth-of-type(2):hover{
    color: #00B8EE;
    background: #fff;
}
    .disBtn{
         border: 1px solid #00b8ee;
         color: #00b8ee;
         border-radius: 3px;
         height: 28px;
         line-height: 28px;
         width: 70px;
     }
    .conBtn{
        border: 1px solid #00b8ee;
        color: #fff;
        background-color: #00b8ee;
        border-radius: 3px;
        height: 28px;
        line-height: 28px;
        width: 70px;
        margin-left: 10px;
    }
    .conBtn:hover{
        background-color: #fff;
        color: #00b8ee;
    }
</style>
