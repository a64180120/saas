<template>
    <div class="sys-page">
        <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <el-select v-model="state_mark" placeholder="请选择用户状态" class="handle-select mr10">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="启用" value="0"></el-option>
                            <el-option label="临时停用" value="1"></el-option>
                            <el-option label="永久停用" value="2"></el-option>
                        </el-select>
                        <el-input v-model="select_word" placeholder="用户编码/名称/手机号" prefix-icon="el-icon-search" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" @click="PageAdd">添加</el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10" @click="PageEdit">修改</el-button>
                        <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10" @click="PageDelete">删除</el-button>
                        <el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10" @click="PageReset">密码重置</el-button>
                        <el-button type="info" icon="el-icon-lx-message" size="small" class="handle-del mr10" @click="SendCode">发送邀请码</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table 
                :data="tableData" 
                border 
                class="table"
                v-loading="loading"
                ref="multipleTable"
                highlight-current-row
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                @row-click="handleClickRow">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="Account" label="用户编码" sortable width="120"></el-table-column>
                <el-table-column prop="RealName" label="用户名称" width="120"></el-table-column>
                <el-table-column prop="MobilePhone" label="手机号码"></el-table-column>
                <el-table-column prop="OrgName" label="所属工会"></el-table-column>
                <el-table-column prop="EnabledMark" label="用户状态"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total,prev, pager, next" :total="totalCount">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogState=='add'?'新增':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                <el-form-item label="用户姓名：" prop="realName">
                    <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" prop="mobilePhone">
                    <el-input v-model="form.mobilePhone"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="roles">
                    <el-checkbox-group v-model="form.roles">
                        <el-checkbox label="1" class="el-checkbox-role">主席 <span>  权限详情</span></el-checkbox>
                        <el-checkbox label="2" class="el-checkbox-role">财务主管</el-checkbox>
                        <el-checkbox label="3" class="el-checkbox-role">会计</el-checkbox>
                        <el-checkbox label="4" class="el-checkbox-role">统计员</el-checkbox>
                        <el-checkbox label="5" class="el-checkbox-role">单位管理员</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="账号状态：" prop="enabledMark">
                        <el-radio-group v-model="form.enabledMark">
                            <el-radio label="0">启用</el-radio>
                            <el-radio label="1">临时停用</el-radio>
                            <el-radio label="2">永久停用</el-radio>
                        </el-radio-group>
                </el-form-item>
                <el-form-item label="历史关联账号：" v-if="dialogState=='add'?false:true">
                    <el-table
                        :data="form.historyAccount"
                        border
                        style="width: 100%">
                        <el-table-column label="序号" type="index" width="50"></el-table-column>
                        <el-table-column prop="RealName" label="用户姓名" ></el-table-column>
                        <el-table-column prop="MobilePhone" label="手机号码" ></el-table-column>
                        <el-table-column prop="Roles" label="角色"></el-table-column>
                        <el-table-column prop="EnabledMark" label="账号状态"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: "AdminUserList",
  data() {
    return {
      loading: false,
      tableData: [], //table数据
      pageSize: 10, //pageSize
      pageIndex: 1, //pageIndex
      totalCount: 0, //总页数
      singleSelection: [], //选中行
      state_mark: "", //用户状态
      select_word: "", //搜索字段
      //dialogtitle: "新增",
      dialogState: "add",
      editVisible: false,
      is_search: false,
      form: {
        realName: "",
        mobilePhone: "",
        roles: [],
        enabledMark: "0",
        historyAccount:[
            {RealName:'11',MobilePhone:'aa',Roles:'ss',EnabledMark:1},
            {RealName:'22',MobilePhone:'bb',Roles:'bb',EnabledMark:0},
            {RealName:'22',MobilePhone:'cc',Roles:'cc',EnabledMark:0}
        ]
      },
      rules: {
        realName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" }
        ],
        mobilePhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ],
        roles: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个角色",
            trigger: "change"
          }
        ],
        enabledMark: [
          { required: true, message: "请选择账号状态", trigger: "change" }
        ]
      }
    };
  },
  created() {
    
  },
  mounted:function(){
    this.getData();
  },
  //计算
  computed: {

  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getData();
    },
    // 获取数据
    getData() {
      this.loading = true;
      this.$axios.get("/SysUser/GetSysUserList", {
          params: {
            PageIndex: this.pageIndex - 1,
            PageSize: this.pageSize,
            uid: "",
            orgid: ""
          }
        }).then(
          res => {
            this.loading = false;

            this.tableData = res.Record;
            this.totalCount = Number(res.totalRows);
          },
          error => {
            console.log(error);
            this.loading = false;
          }
        );
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        name: item.name,
        date: item.date,
        address: item.address
      };
      this.editVisible = true;
    },
    //新增按钮
    PageAdd() {
      this.dialogState = "add";
      this.editVisible = true;
    },
    //编辑按钮
    PageEdit() {
      let object = this.singleSelection;

      let id = object.length > 0 ? object[0].PhId : 0;
      if (id != 0) {
        //this.loading=true
        // this.$axios.get("http://10.0.20.46:8028/api/GCW/SysUser/GetUser", {
        //     params: {
        //       id: id
        //     }
        //   }).then(res => {
        //     //this.loading=false;

        //     this.dialogState = "edit";
        //     this.editVisible = true;

        //     this.singleSelection = [];
        //   });

            this.dialogState = "edit";
            this.editVisible = true;
            this.singleSelection = [];

      } else {
        this.$message({
          message: "请选中列表的其中一行",
          type: "warning"
        });
      }
    },
    //删除按钮
    PageDelete() {
      let length = this.singleSelection.length;
      if (length > 0) {
        this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .get("http://10.0.20.46:8028/api/GCW/SysUser/PostDelete", {
                params: {
                  id: id
                }
              })
              .then(res => {

                this.tableData.splice(this.idx, 1);

                this.$message.success("删除成功");
                this.singleSelection = [];
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          message: "请选中列表的其中一行",
          type: "warning"
        });
      }
    },
    //密码重置
    PageReset() {},
    //发送邀请吗
    SendCode() {},
    //选择行
    handleClickRow(row) {
      this.singleSelection.push(row);

      console.log(row);
      console.log(this.singleSelection);
    },
    // 保存编辑
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //this.$set(this.tableData, this.idx, this.form);
          //this.$message.success(`修改第 ${this.idx+1} 行成功`);
          this.editVisible = false;

          console.log(this.form);
          this.$message.success(`修改成功`);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
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