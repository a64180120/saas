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
                    <el-input v-model="s_word" placeholder="科目编码/名称" prefix-icon="el-icon-search" class="handle-input mr10"></el-input>
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
        border>
            <el-table-column label="科目类别" align="center">
                <template slot-scope="scope">
                     <span v-if="scope.row.KType==='1'">现金</span>
                    <span v-else-if="scope.row.KType==='2'">银行</span>
                    <span v-else-if="scope.row.KType==='3'">个人往来</span>
                    <span v-else-if="scope.row.KType==='4'">单位往来</span>
                    <span v-else-if="scope.row.KType==='5'">一般</span>
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
                    {{ scope.row.AuxiliaryType}}
                </template>
            </el-table-column>
            <el-table-column label="停用/启用" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.EnabledMark===1" type="success" icon="el-icon-check" size="mini" circle></el-button>
                    <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                </template>
            </el-table-column>
        </tree-table>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogState=='add'?'新增':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                <el-form-item label="科目编码：" prop="KCodeRule">
                    <el-input v-model="form.KCode"></el-input>
                </el-form-item>
                <el-form-item label="科目名称：" prop="KNameRule">
                    <el-input v-model="form.KName"></el-input>
                </el-form-item>
                <el-form-item label="科目类别：" prop="KTypeRule">
                    <el-select v-model="form.KType" placeholder="请选择">
                        <el-option v-for="item in subjectType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="余额方向：" prop="KBalanceTypeRule">
                        <el-radio-group v-model="form.KBalanceType">
                            <el-radio v-for="item in balanceType" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                        </el-radio-group>
                </el-form-item>
                <el-form-item label="辅助核算：">
                    <el-checkbox-group v-model="form.AuxiliaryType">
                        <el-checkbox v-for="item in auxiliaryTypes" :label="item.PhId" :key="item.PhId">{{item.BaseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
                <el-button @click="callof('form')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import treeTable from "@/components/tree-table";

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
      data: [
        {
          PhId: 0,
          KCode: "401",
          KName: "会费收入",
          KType: "1",
          KBalanceType: "2",
          AuxiliaryType: "往来单位，部门",
          IsLast: 1,
          EnabledMark: 1
        },
        {
          PhId: 1,
          KCode: "402",
          KName: "拨缴经费收入",
          KType: "1",
          KBalanceType: "1",
          AuxiliaryType: "",
          IsLast: 1,
          EnabledMark: 0
        },
        {
          PhId: 2,
          KCode: "403",
          KName: "上级补助收入",
          KType: "1",
          KBalanceType: "3",
          AuxiliaryType: "",
          IsLast: 1,
          EnabledMark: 1,
          children: [
            {
              PhId: 3,
              KCode: "40301",
              KName: "回拨补助",
              KType: "1",
              KBalanceType: "1",
              AuxiliaryType: "",
              IsLast: 1,
              EnabledMark: 1
            },
            {
              PhId: 4,
              KCode: "40302",
              KName: "专项补助",
              KType: "1",
              KBalanceType: "1",
              AuxiliaryType: "",
              IsLast: 1,
              EnabledMark: 1,
              children: [
                {
                  PhId: 5,
                  KCode: "4030201",
                  KName: "帮扶补助",
                  KType: "1",
                  KBalanceType: "1",
                  AuxiliaryType: "",
                  IsLast: 1,
                  EnabledMark: 1
                },
                {
                  PhId: 6,
                  KCode: "4030202",
                  KName: "送温暖补助",
                  KType: "1",
                  KBalanceType: "1",
                  AuxiliaryType: "",
                  IsLast: 1,
                  EnabledMark: 1
                }
              ]
            }
          ]
        }
      ],
      expandAll: true,
      loading: false,
      s_type: "",
      s_word: "",
      dialogState: "add",
      editVisible: false,
      singleSelection:[],
      subjectType:[
          {code:'1',name:'资产'},
          {code:'2',name:'负债'},
          {code:'3',name:'所有者权益'},
          {code:'4',name:'成本费用'},
          {code:'5',name:'损益'},
      ],
      balanceType:[
           {code:'1',name:'借方'},
           {code:'2',name:'贷方'},
           {code:'3',name:'两性'},
      ],
      auxiliaryTypes:[
          {PhId:'1',BaseCode:'001',BaseName:'部门'},
          {PhId:'2',BaseCode:'002',BaseName:'项目'},
          {PhId:'3',BaseCode:'003',BaseName:'往来个人'},
          {PhId:'4',BaseCode:'004',BaseName:'往来单位'}
      ],
      form: {
        KCode: "",
        KName: "",
        KType:"",
        KBalanceType: "0",
        AuxiliaryType: []
      },
      rules: {
        KCodeRule: [
          { required: true, message: "请输入科目编码", trigger: "blur" }
        ],
        KNameRule: [
          { required: true, message: "请输入科目名称", trigger: "blur" }
        ],
        KTypeRule: [
          { required: true, message: "请选择科目类别", trigger: "change" }
        ],
        KBalanceTypeRule: [
          { required: true, message: '请选择余额方向', trigger: 'change' }
        ]
      }
    };
  },
  created() {

  },
  methods: {
    message(row) {
      this.$message.info(row.event);
    },
    //列表点击事件
    handleClickRow(row) {
      //console.log(row);
      this.singleSelection.push(row);
    },
    //搜索按钮
    search() {},
    //新增页面
    Add() {
      this.dialogState = "add";
      this.editVisible = true;
    },
    //修改页面
    Edit() {
        let object = this.singleSelection;
        let id = object.length > 0 ? object[0].PhId : 0;
        if (id != 0) {

            this.dialogState = "edit";
            this.editVisible = true;
            this.singleSelection = [];
        }else{
            this.$message({
                message: "请选中列表的其中一行",
                type: "warning"
            });
        }
    },
    //删除按钮
    Delete() {
      let length = this.singleSelection.length;
      if (length > 0) {
        this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            this.$message.success("删除成功");
            this.singleSelection = [];
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

    },
    // 保存表单
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          console.log(this.form);

          //隐藏弹出框
          this.editVisible = false;
          //清除form数据
          this.$refs[formName].resetFields();

          this.$message.success(`修改成功`);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消表单
    callof(formName){
        //隐藏弹出框
        this.editVisible = false;
        this.$refs[formName].resetFields();
    }
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