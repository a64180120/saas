<template>
  <div class="sys-page">
    <div class="container">
        <div class="handle-box">
            <el-row>
                <el-col :span="24">
                    <el-select v-model="s_type" placeholder="请选择科目类别" class="handle-select mr10">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in subjectType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                    <el-input v-model.trim="s_word" placeholder="科目编码/名称" prefix-icon="el-icon-search" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

                    <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" @click="Add">新增</el-button>
                    <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10" @click="Edit">修改</el-button>
                    <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10" @click="Delete">删除</el-button>
                    <el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10" @click="DownLoad">导入</el-button>
                </el-col>
            </el-row>
        </div>
        <tree-table 
        :data="data" 
        :expand-all="expandAll" 
        :columns="columns" 
        :header-cell-style="{background:'#2780d1',color:'#fff'}"
        v-loading="loading"
        highlight-current-row
        @onRowClick="handleClickRow"
        :extraheight='extraheight'
        border>
            <el-table-column label="科目类别" align="center">
                <template slot-scope="scope">
                     <span v-if="scope.row.KType==='1'">资产</span>
                    <span v-else-if="scope.row.KType==='2'">负债</span>
                    <span v-else-if="scope.row.KType==='3'">净资产</span>
                    <span v-else-if="scope.row.KType==='4'">收入</span>
                    <span v-else-if="scope.row.KType==='5'">支出</span>
                    <span v-else>{{scope.row.KType}}</span>
                </template>
            </el-table-column>
            <el-table-column label="余额方向" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.KBalanceType==='1'">借方</span>
                    <span v-else-if="scope.row.KBalanceType==='2'">贷方</span>
                    <span v-else-if="scope.row.KBalanceType==='3'">两性</span>
                    <span v-else>{{scope.row.KBalanceType}}</span>
                </template>
            </el-table-column>
            <el-table-column label="辅助核算">
                <template slot-scope="scope">
                    <span v-for="(v,index) in scope.row.AuxiliaryTypes" :key="v.PhId">       
                        <span v-if="index<( scope.row.AuxiliaryTypes.length-1)">{{v.BaseName}},</span>
                        <span v-else>{{v.BaseName}}</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="停用/启用" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.EnabledMark===0" type="success" icon="el-icon-check" size="mini" circle></el-button>
                    <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                </template>
            </el-table-column>
        </tree-table>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogState=='add'?'新增':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                <el-form-item label="科目编码：" prop="KCode">               
                    <el-input v-model="form.KCode">
                        <template v-if="parentKCode!==''" slot="prepend">{{parentKCode}}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="科目名称：" prop="KName">
                    <el-input v-model="form.KName"></el-input>
                </el-form-item>
                <el-form-item label="科目类别：" prop="KTypeRule">
                    <el-select v-model="form.KType" placeholder="请选择">
                        <el-option v-for="item in subjectType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="余额方向：" prop="KBalanceType">
                    <el-radio-group v-model="form.KBalanceType">
                        <el-radio v-for="item in balanceType" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="辅助核算：">
                    <el-checkbox-group v-model="form.AuxiliaryType">
                        <el-checkbox v-for="item in  auxiliaryTypes" :label="item.PhId" :key="item.PhId">{{item.BaseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="Save('form')">保 存</el-button>
                <el-button @click="callof('form')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import treeTable from "@/components/tree-table/indexHeight";
import { SubjectAdd,SubjectUpdate,SubjectList,SubjectDelete } from '@/api/subject/subjectInfo'
import { AuxiliaryTypeList } from '@/api/Auxiliary/typeInfo'
import Auth from "@/util/auth";

export default {
  name: "subjectList",
  components: { treeTable },
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
      data: [],
      extraheight:100,
      expandAll: true,
      loading: false,
      is_search: false,
      s_type: "",
      s_word: "",
      dialogState: "add",
      editVisible: false,
      parentKCode:'',
      singleSelection:[],
      subjectType:[
          {code:'1',name:'资产'},
          {code:'2',name:'负债'},
          {code:'3',name:'净资产'},
          {code:'4',name:'收入'},
          {code:'5',name:'支出'},
      ],
      balanceType:[
           {code:'1',name:'借方'},
           {code:'2',name:'贷方'},
           {code:'3',name:'两性'},
      ],
      auxiliaryTypes:[],
      form: {
        PhId:0,
        KCode: "",
        KName: "",
        KType:"",
        KBalanceType: "0",
        AuxiliaryType: []
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
      }
    };
  },
  created() {

  },
  mounted:function(){
    //获取科目列表数据
    this.getData('');
    this.getAuxiliaryType('');
  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          orgid: state => state.user.orgid
      })
  },
  methods: {
    async getData(query){
      var vm=this;
      this.loading = true;

      //科目列表
      SubjectList(vm,{
          uid: this.userid,
          orgid: this.orgid,
          infoData:query
      }).then(res => {
          this.loading = false;
          //console.log(res);

          if(res.Status==='error'){
            this.$message.error(res.Msg);
            return
          }
          this.data=res;

      }).catch(error =>{
        console.log(error);
        this.loading = false;
        this.$message({
            showClose: true,
            message: '科目列表获取错误',
            type: 'error'
        })
      })

    },
    async getAuxiliaryType(query){
        var vm=this;
        //辅助项类别
        AuxiliaryTypeList(vm,{
            uid: this.userid,
            orgid: this.orgid,
            infoData:query
        }).then(res => {
            //console.log(res);

            if(res.Status==='error'){
                this.$message.error("获取辅助项类别错误");
                return
            }
            this.auxiliaryTypes=res.type;

        }).catch(error =>{
            console.log(error);
            this.$message({
                showClose: true,
                message: '辅助项类别获取错误',
                type: 'error'
            })
        })
    },
    //列表点击事件
    handleClickRow(row, event, Column) {
      //console.log(row);
      this.singleSelection=[];
      this.singleSelection.push(row);
    },
    //搜索按钮
    search() {
        this.is_search = true;
        if(this.s_word =='' && this.s_type =='' ){
            this.getData('');
            this.is_search = false;
        }else{
            var queryfilter={
                KCode:this.s_word,
                KName:this.s_word,
                KType:this.s_type
            }

            this.getData(queryfilter);
            this.is_search = false;
        }
    },
    //新增页面
    Add() {
        let object = this.singleSelection;
        let id = object.length > 0 ? object[0].PhId : 0;
        if (id != 0) {

            this.dialogState = "add";
            this.editVisible = true;
            this.$nextTick(() => {
                //this.$refs.form.resetFields();  //新增页面数据清空
                this.form.PhId=0;
                this.form.KCode='';
                this.form.KName='';
                this.form.KType='';
                this.form.KBalanceType='0';
                this.form.AuxiliaryType=[];
            })
            this.parentKCode=object[0].KCode

        }else{
            this.$message({
                message: "请选中列表的其中一行",
                type: "warning"
            });
        }
    },
    //修改页面
    Edit() {
        let object = this.singleSelection;
        let id = object.length > 0 ? object[0].PhId : 0;
        if (id != 0) {
            this.parentKCode='';

            this.form.PhId=object[0].PhId;
            this.form.KCode=object[0].KCode;
            this.form.KName=object[0].KName;
            this.form.KType=object[0].KType;
            this.form.KBalanceType=object[0].KBalanceType;

            //辅助项类型信息
            var typePhId=[];
            for(let i=0;i<object[0].AuxiliaryTypes.length;i++) {
                typePhId.push(object[0].AuxiliaryTypes[i].PhId);
            }
            this.form.AuxiliaryType=typePhId;

            this.dialogState = "edit";
            this.editVisible = true;

        }else{
            this.$message({
                message: "请选中列表的其中一行",
                type: "warning"
            });
        }
    },
    //删除按钮
    Delete() {
      let object = this.singleSelection;
      if (object.length > 0) {
        this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          var vm=this;
          this.loading = true;
         
          //提交asiox
          SubjectDelete(vm,{
              id:object[0].PhId,
              uid:this.userid,
              orgid:this.orgid
          }).then(res => {
              this.loading = false;
              if(res.Status=='success'){              
                  //设置状态，隐藏新增页面
                  this.$message.success("删除成功");
                  this.singleSelection = [];  
                  //刷新列表
                  this.getData('');
              }else{
                  this.$message.error(res.Msg);
              }
          }).catch(error =>{
            console.log(error);
            this.loading = false;
            this.$message.error('删除错误');
          })
        });
      } else {
        this.$message({
          message: "请选中列表的其中一行",
          type: "warning"
        });
      }
    },
    //导入按钮
    DownLoad() {
        alert('正在开发中....')
    },
    // 保存表单 (新增，修改)
    Save(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          if(this.dialogState==='edit'){
              this.saveEdit(formName)
          }else{
              this.saveAdd(formName)
          }

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改保存   
    async saveEdit(formName) {
           let selectSub = this.singleSelection;
          //获取缓存 的用户 组织，角色基本信息
          let cookiesUser = Auth.getUserInfoData();

           /**
           * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
           * 新增科目
           *  */ 
          var subjectinfo={
            PhId:this.form.PhId,
            PersistentState:2,
            KCode:this.form.KCode,
            KName:this.form.KName,
            KType:this.form.KType,
            KBalanceType:this.form.KBalanceType
            //IsSystem:selectSub[0].IsSystem,
            //ParentId:selectSub[0].PhId
          };

          //辅助项类别 实体信息组合
          var auxiliarytypeInfo=[];
          var types=this.form.AuxiliaryType;
          for(let i=0; i<types.length;i++){
            
            var typeModel=this.auxiliaryTypes.filter(v =>{
                return v.PhId==types[i];
            })
            if(typeModel.length==1){
                typeModel[0].PersistentState=1;
                auxiliarytypeInfo.push(typeModel[0]);
            }
          };

          var vm=this;
          this.loading = true;
          //提交asiox
          SubjectUpdate(vm,{
              otype:this.dialogState,
              uid:this.userid,
              orgid:this.orgid,
              Subject: subjectinfo,
              AuxiliaryTypeList:auxiliarytypeInfo
          }).then(res => {
                this.loading = false;
                if(res.Status==='error'){
                    this.$message.error(res.Msg);
                    return
                }
                this.$message.success('保存成功!');
                  
                //设置状态，隐藏新增页面
                this.dialogState = "";
                //隐藏弹出框
                this.editVisible = false;
                //清除form数据
                //this.$refs[formName].resetFields();
                this.form.PhId=0
                this.form.KCode=''
                this.form.KName=''
                this.form.KType=''
                this.form.KBalanceType='0'
                this.form.AuxiliaryType=[]
                
                //清空选中项
                this.singleSelection=[];
                //清空父级code值
                this.parentKCode=''

                var queryfilter={
                    KCode:this.s_word
                }
                //刷新列表
                this.getData(queryfilter);

          }).catch(error =>{
            console.log(error);
            this.loading = false;
            this.$message.error('保存科目错误');
          })
    },
    //新增保存
    async saveAdd(formName){
          let selectSub = this.singleSelection;
          //获取缓存 的用户 组织，角色基本信息
          let cookiesUser = Auth.getUserInfoData();

           /**
           * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
           * 新增科目
           *  */ 
          var subjectinfo={
            PhId:this.form.PhId,
            PersistentState:1,
            KCode:this.parentKCode + this.form.KCode,
            KName:this.form.KName,
            KType:this.form.KType,
            KBalanceType:this.form.KBalanceType,
            Layers:selectSub[0].Layers+1,
            OrgId:this.orgid,
            OrgCode:cookiesUser.orgInfo.EnCode,
            ParentId:selectSub[0].PhId
          };

          //辅助项类别 实体信息组合
          var auxiliarytypeInfo=[];
          var types=this.form.AuxiliaryType;
          for(let i=0; i<types.length;i++){
            var typeModel=this.auxiliaryTypes.filter(v =>{
                return v.PhId==types[i];
            })
            if(typeModel.length==1){
                typeModel[0].PersistentState=1;
                auxiliarytypeInfo.push(typeModel[0]);
            }
          };

          var vm=this;
          this.loading = true;
          //提交asiox
          SubjectAdd(vm,{
              otype:this.dialogState,
              uid:this.userid,
              orgid:this.orgid,
              Subject: subjectinfo,
              AuxiliaryTypeList:auxiliarytypeInfo
          }).then(res => {
                this.loading = false;

                if(res.Status==='error'){
                    this.$message.error(res.Msg);
                    return
                }

                this.$message.success('保存成功!');
                  
                //设置状态，隐藏新增页面
                this.dialogState = "";
                //隐藏弹出框
                this.editVisible = false;
                //清除form数据
                //this.$refs[formName].resetFields();
                this.form.PhId=0
                this.form.KCode=''
                this.form.KName=''
                this.form.KType=''
                this.form.KBalanceType='0'
                this.form.AuxiliaryType=[]
                //清空选中项
                this.singleSelection=[];
                //清空父级code值
                this.parentKCode=''

                var queryfilter={
                    KCode:this.s_word
                }
                //刷新列表
                this.getData(queryfilter);

          }).catch(error =>{
            console.log(error);
            this.loading = false;
            this.$message.error('保存科目错误');
          })
    },

    //取消表单
    callof(formName){
        //隐藏弹出框
        this.editVisible = false;
        this.$refs[formName].resetFields();
    },

  }
};
</script>
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
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
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>