<template>
  <div class="sys-page"
       style="background-color: #ffffff">
    <div class="container sysUser">
      <div class="handle-box"
           style="float: right">
        <el-row>
          <el-col :span="24">
            <div class="inputContainer">
              <input type="text"
                     v-model="select_word"
                     placeholder="用户姓名/手机号码">
            </div>
            <!--<el-input v-model="select_word" placeholder="用户姓名/手机号码" prefix-icon="el-icon-search"-->
            <!--class="handle-input mr10" size="small"></el-input>-->
            <el-button type="primary"
                       size="small"
                       class="searchBtn"
                       @click="search"
                       style="margin-left: -4px;">搜索</el-button>
            <el-button type="info"
                       size="small"
                       class="handle-del mr10 btn-font"
                       @click="Add"
                       v-if="Roleauthorize.workAccount_add!=0">
              新增
            </el-button>
            <el-button type="info"
                       size="small"
                       class="handle-del mr10 btn-font"
                       v-if="Roleauthorize.workAccount_edit!=0"
                       @click="Edit">修改
            </el-button>
            <el-button type="info"
                       size="small"
                       class="handle-del mr10 btn-font"
                       v-if="Roleauthorize.workAccount_delete!=0"
                       @click="Delete">删除
            </el-button>
            <el-button type="info"
                       size="small"
                       class="handle-del mr10 btn-font"
                       v-if="Roleauthorize.workAccount_transfer!=0"
                       @click="Transfer">账号移交
            </el-button>
            <el-button type="info"
                       size="small"
                       class="handle-del mr10 btn-font"
                       v-if="Roleauthorize.workAccount_reset!=0"
                       @click="PageReset">密码重置
            </el-button>
            <el-button type="info"
                       size="small"
                       class="handle-del mr10 btn-font"
                       v-if="Roleauthorize.workAccount_invita!=0"
                       @click="SendInvite">发送邀请
            </el-button>
            <li type="info"
                class="el-icon-refresh"
                size="small"
                style="margin-left: 15px;position: relative;top: 5px;cursor: pointer"
                @click="refresh">
            </li>
            <!--<a><li class="el-icon-refresh" @click="refresh"></li></a>-->
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData"
                border
                class="table"
                v-loading="loading"
                ref="multipleTable"
                highlight-current-row
                :header-cell-style="{background:'#d3e9f9',color:'#000',textAlign:'center',borderColor:'#fff'}"
                @row-click="handleClickRow">
        <el-table-column label="序号"
                         type="index"
                         width="50"></el-table-column>
        <el-table-column prop="RealName"
                         label="用户名称"
                         width="120"></el-table-column>
        <el-table-column prop="MobilePhone"
                         label="手机号码"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span v-for="(v,index) in scope.row.Roles"
                  :key="v.PhId">
              <span v-if="index<(scope.row.Roles.length-1)">{{v.Name}},</span>
              <span v-else>{{v.Name}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="账号状态"
                         width="360px">
          <template slot-scope="scope">
            <label v-if="scope.row.EnabledMark===0">启用</label>
            <label v-if="scope.row.EnabledMark===1">临时启用</label>
            <label v-if="scope.row.EnabledMark===2">永久停用</label>
            <!--<label style="margin-right: 60px"><input :name="scope.row.realName" type="radio" value="0" v-model="scope.row.EnabledMark" style="margin-right: 3px;"-->
            <!--disabled>启用</label>-->
            <!--<label style="margin-right: 60px"><input :name="scope.row.realName" type="radio" value="1" v-model="scope.row.EnabledMark" style="margin-right: 3px;"-->
            <!--disabled>临时停用</label>-->
            <!--<label><input :name="scope.row.realName" type="radio" value="2" v-model="scope.row.EnabledMark" style="margin-right: 3px;"-->
            <!--disabled>永久停用</label>-->
            <!--<label style="margin-right: 60px"><input :name="scope.row.realName" type="radio" value="0" v-model="scope.row.EnabledMark" style="margin-right: 3px;"-->
            <!--disabled>启用</label>-->
            <!--<label style="margin-right: 60px"><input :name="scope.row.realName" type="radio" value="1" v-model="scope.row.EnabledMark" style="margin-right: 3px;"-->
            <!--disabled>临时停用</label>-->
            <!--<label><input :name="scope.row.realName" type="radio" value="2" v-model="scope.row.EnabledMark" style="margin-right: 3px;"-->
            <!--disabled>永久停用</label>-->
            <!--<el-button v-if="scope.row.EnabledMark===0" type="success" icon="el-icon-check" size="mini"-->
            <!--circle></el-button>-->
            <!--<el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>-->
          </template>
          <!--<template slot-scope="scope">-->
          <!--<el-radio disabled v-model="scope.row.EnabledMark" label=0 style="margin-right: 10px">启用</el-radio>-->
          <!--<el-radio disabled v-model="scope.row.EnabledMark" label=1 style="margin-right: 10px">临时停用</el-radio>-->
          <!--<el-radio disabled v-model="scope.row.EnabledMark" label=2>永久停用</el-radio>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.NgInsertDt.replace('T',' ') }}</template>
        </el-table-column>
        <el-table-column label="永久停用时间">
          <template slot-scope="scope">{{ scope.row.NgUpdateDt.replace('T',' ') }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       @current-change="handleCurrentChange"
                       layout="total,prev, pager, next"
                       :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <div style="margin-bottom: 20px;margin-top: 20px">
      <span style="color: #cf9236; font-size: 20px; font-weight: bold; margin-bottom: 20px;margin-top: 20px">
        工作账号管理规范说明：
      </span>
    </div>
    <div class="container"
         style="height: 100px">
      <div>
        <span>
          系统提供多种操作角色，各角色对应不同的操作权限，用户可按照实际业务需要进行设置，系统最多支持6名人员使用（含停用账户）。如果需要更多用户数量，需要支付额外费用。
        </span>
      </div>
      <!--<div>-->
      <!--<el-button type="danger" style="float: right">购买用户数</el-button>-->
      <!--</div>-->
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="dialogTitle"
               :visible.sync="editVisible"
               width="50%"
               :close="dialogClose">
      <el-form ref="forms"
               :model="form"
               :rules="rules"
               label-width="120px"
               label-position="right"
               v-loading.fullscreen.lock="loading">
        <el-form-item label="用户姓名："
                      prop="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码："
                      prop="mobilePhone">
          <el-input v-model="form.mobilePhone"></el-input>
        </el-form-item>
        <el-form-item label="角色："
                      prop="rolesid">
          <div style="width: 50%; float: left">
            <el-checkbox-group v-model="form.rolesid"
                               style="float: left">
              <el-checkbox v-for="item of roledata"
                           :key="item.PhId"
                           :label="item.PhId"
                           class="el-checkbox-role">{{item.Name}}
                <!--<el-tag class="el-checkbox-role2">权限详情</el-tag>-->
              </el-checkbox>

            </el-checkbox-group>
          </div>
          <div style="width: 50%; float: right">
            <span v-for="item of roledata"
                  class="el-checkbox-role2"
                  @click="premisList(item.PhId)">
              权限详情
            </span>
            <!--<el-button type="primary" v-for="item of roledata" class="el-checkbox-role2" @click="premissionList(item.PhId)">权限详情</el-button>-->
            <!--<el-tag v-for="item of roledata" class="el-checkbox-role2" @click="premissionList(item.PhId)">权限详情</el-tag>-->
          </div>
        </el-form-item>
        <el-form-item label="账号状态："
                      prop="enabledMark">
          <el-radio-group v-model="form.enabledMark">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">临时停用</el-radio>
            <el-radio label="2">永久停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="历史关联账号："
                      v-if="dialogState=='trans'?true:false">
          <el-table :data="form.historyAccount"
                    border
                    style="width: 100%">
            <el-table-column label="序号"
                             type="index"
                             width="50"></el-table-column>
            <el-table-column prop="RealName"
                             label="用户姓名"></el-table-column>
            <el-table-column prop="MobilePhone"
                             label="手机号码"></el-table-column>
            <el-table-column prop="RoleName"
                             label="角色"></el-table-column>
            <el-table-column prop="Enabled"
                             label="账号状态"></el-table-column>
            <el-table-column label="移交日期">
              <template slot-scope="scope">
                <div>
                  {{scope.row.HandTime?scope.row.HandTime.replace('T',' ').slice(0,16):''}}
                </div>
              </template>
            </el-table-column>
            <!--<el-table-column prop="RoleName" label="角色"></el-table-column>-->
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="callof('forms')"
                   style="color: #00B8EE; border-color: #00B8EE;">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit('forms')">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog :title="'权限详情'"
               :visible.sync="editVisible2"
               width="40%"
               style="height: 800px">
      <el-form ref="form2"
               :model="form2"
               :rules="rule2"
               label-width="100px"
               label-position="right"
               style="height: 400px; overflow-y: auto">
        <el-form-item label="角色权限：">
          <el-tree :data="form2.data2"
                   ref="tree"
                   show-checkbox
                   :check-strictly="form2.checkStrictly"
                   node-key="ItemId"
                   default-expand-all
                   :default-checked-keys="form2.CheckedList"
                   :render-content="renderContent"
                   @disabled="disAble()">
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible2 = false"
                   style="text-align: center">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import httpConfig from "../../../util/ajaxConfig";
import Auth from "@/util/auth";
import {
  SysUserAdd,
  SysUserUpdate,
  SysUserList,
  SysUserDelete,
  SysUserTransferList,
  SysUserUpdatePassword,
  SysUserSendInvitationCode
} from '@/api/user/userInfo'
import { SysRoleList, SysRoleListNoAdmin } from '@/api/role/roleInfo'
import { isvalidatemobile } from '@/util/validate'

export default {
  name: "AdminUserList",
  data () {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value.length > 12 || value.length < 1) {
        callback(new Error('用户名不得超过12位'))
      } else {
        callback()
      }
    }
    return {
      //data2: [],
      renderContent: '',
      loading: false,
      //table数据
      tableData: [],
      pageSize: 10, //pageSize
      pageIndex: 1, //pageIndex
      totalCount: 0, //总页数
      adminJudges: false,
      singleSelection: [], //选中行
      select_word: "", //搜索字段
      dialogState: "add",
      dialogTitle: '',
      jsonFlam: '',
      editVisible: false,
      editVisible2: false,
      is_search: false,
      roledata: [],
      form2: {
        //Disable: true,
        data2: [],
        CheckedList: [],
        checkStrictly: true
      },
      form: {
        phid: 0,
        realName: "",
        mobilePhone: "",
        rolesid: [],
        enabledMark: "0",
        historyAccount: []
      },
      rules: {
        realName: [

          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { required: true, validator: validateName, trigger: "blur" }
        ],
        mobilePhone: [

          { required: true, message: "请输入手机号码", trigger: "blur", validator: validatePhone }

        ],
        rolesid: [
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
      },

      rule2: {},
      idx: ''
    };
  },
  //
  created () {
    let infoData = Auth.getUserInfoData();
    console.log(infoData);
    if (infoData.orgInfo.EnCode == '' || infoData.orgInfo.EnCode == null) {
      this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({ path: "/system/organization" });
    }
    //获取角色信息
    this.getRoleData();
    this.getData2();

    // console.log(this.form2.data2);
    // this.tickMenuIdFilter().filter(this.form2.data2);
    // console.log(this.form2.data2);
  },
  activated () {
    let infoData = Auth.getUserInfoData();
    console.log(infoData);
    if (infoData.orgInfo.EnCode == '' || infoData.orgInfo.EnCode == null) {
      this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({ path: "/system/organization" });
    }
    //获取角色信息
    this.getRoleData();
    this.getData2();
    this.getData('');

  },
  mounted: function () {
    this.getData('');
    //this.getData2();
  },
  components: {},
  //计算
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      orgid: state => state.user.orgid,
      username: state => state.user.username,
      invitationCode: state => state.user.invitationCode,
      Roleauthorize: state => state.user.Roleauthorize,//获取按钮权限
    })
  },
  methods: {
    ...mapActions({
      GetAllRoleauthorize: 'user/GetAllRoleauthorize',
    }),
    // 分页导航
    handleCurrentChange (val) {
      this.pageIndex = val;
      this.getData('');
    },
    //tree的禁用状态设置
    tickMenuIdFilter: function () {
      var resultArr = new Array();
      var getTickMenuId = function (obj) {
        if (undefined == obj || null == obj || !obj instanceof Object) {
          return;
        }
        if (obj.ItemId > 0) {
          // console.log('obj',obj)
          obj.disabled = true;
          resultArr.push(obj.ItemId);
        }
        if (null != obj.children && obj.children instanceof Array) {
          for (let child of obj.children) {
            getTickMenuId(child);
          }
        }
      };


      return {
        filter: function (arr) {
          if (!arr instanceof Array) {
            return false;
          }
          resultArr = new Array();
          for (let rootMenu of arr) {
            getTickMenuId(rootMenu);
          }
          return resultArr;
        }
      };
    },
    // uid: this.userid,
    // orgid: this.orgid,
    // infoData: {Mst: userinfo, Relation: relations}
    //修改启用标志
    changeEnable (PhId, EnabledMark) {
      //this.PhIdList = PhId;
      let object = PhId;
      var me = this;
      if (object != null) {
        if (object.EnabledMark == '2') {
          this.messageTs();
          this.getData('');
          return;
        }
      }
      if (object != null) {
        this.$confirm("此操作将改变用户状态（注：一旦改为永久停用，则此用户将不能进行任何操作！）, 是否继续?", "状态修改提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log(object);
          object.EnabledMark = EnabledMark;
          var data = {
            uid: this.userid,
            orgid: this.orgid,
            infoData: object
          };
          this.$axios
            .post("/SysUser/PostUpdateEnabled", data)
            .then(res => {
              if (res.Status == 'success') {
                this.$message.success("修改成功");
              } else {
                this.$message.error('修改失败,请重试!');
              }
              this.getData('');
            });

        }).catch(() => {
          this.getData('');
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });

      } else {
        this.$message.error('请点击状态栏!');
      }

    },
    //刷新功能
    refresh () {
      this.getData('');
    },
    //获取权限详情列表
    premisList (id) {
      this.getData2();
      let vm = this;
      console.log(id);
      if (id != 0) {
        this.editVisible2 = true;
        this.$axios.get("/SysRole/GetAuthorizeListByRoleId", {
          params: {
            uid: "0",
            orgid: "0",
            id: id
          }
        }).then(res => {
          //vm.CheckedList = [403181206000002, 403181206000003];
          this.form2.CheckedList = res;
          // this.tickMenuIdFilter().filter(this.form2.data2);
        });
        //this.$refs.tree.setCheckedKeys(list);

      } else {
        this.$message({
          message: "请选中权限详情按钮",
          type: "warning"
        });
      }
    },
    //获取权限列表
    getData2 () {
      this.$axios.get("/SysMenu/GetMenuListAndButtonList", {
        params: {
          uid: "",
          orgid: ""
        }
      }).then(
        res => {
          this.form2.data2 = res;
          this.tickMenuIdFilter().filter(this.form2.data2);
        },
        error => {
          console.log(error);
        }
      );
    },
    /**
     * 用户列表获取数据
     * query:查询参数
     *  */
    async getData (query) {
      var vm = this;
      this.loading = true;

      SysUserList(vm, {
        pageindex: this.pageIndex - 1,
        pagesize: this.pageSize,
        Type: 'R', //获取角色信息
        uid: this.userid,
        orgid: this.orgid,
        queryfilter: query
      }).then(res => {
        this.loading = false;
        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }
        console.log(res.Record);
        this.tableData = res.Record;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].EnabledMark != '2') {
            this.tableData[i].NgUpdateDt = "——";
          }
        }
        this.totalCount = Number(res.totalRows);
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.$message({ showClose: true, message: '用户列表获取错误', type: 'error' })
      })
    },
    //获取角色数据
    async getRoleData () {
      var vm = this;
      //获取200角色信息
      SysRoleListNoAdmin(vm, {
        PageIndex: 0,
        PageSize: 200,
        value: "1"
      }).then(res => {

        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }
        this.roledata = res.Record;

      }).catch(error => {
        console.log(error);
        this.$message({ showClose: true, message: '角色信息获取错误', type: 'error' });
      });
    },
    //获取移交记录信息
    getTransData (userid) {
      var vm = this;
      let object = vm.singleSelection;
      //获取200角色信息
      SysUserTransferList(vm, {
        uid: userid,
        orgid: this.orgid,
        pagesize: 200,
        pageindex: 0
      }).then(res => {
        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }
        let js = JSON.stringify(res.Record)
        console.log(res.Record);
        this.form.historyAccount = JSON.parse(js);
        // if(this.form.historyAccount.length > res.Record.length){
        //     let len = this.form.historyAccount.length - res.Record.length;
        //     this.form.historyAccount.splice(res.Record.length,len);
        // }
        if (res.Record.length < 1) {
          this.form.historyAccount[this.form.historyAccount.length] = {};
        } else {
          for (let i = res.Record.length; i > 0; i--) {
            this.form.historyAccount[this.form.historyAccount.length] = {};
            this.form.historyAccount[i] = {              RealName: this.form.historyAccount[i - 1].RealName,
              MobilePhone: this.form.historyAccount[i - 1].MobilePhone,
              RoleName: this.form.historyAccount[i - 1].RoleName,
              Enabled: "已禁用"
            };
            // this.form.historyAccount[i].MobilePhone = this.form.historyAccount[i-1].MobilePhone;
            // this.form.historyAccount[i].RoleName = this.form.historyAccount[i-1].RoleName;
            // this.form.historyAccount[i].Enabled = "已禁用";
          }
        }
        if (object.length > 0) {
          var roles = [];
          if (object[0].Roles.length > 0) {
            object[0].Roles.forEach(el => {
              roles.push(el.Name);
            })
          }
          this.form.historyAccount[0].RealName = object[0].RealName;
          this.form.historyAccount[0].MobilePhone = object[0].MobilePhone;
          this.form.historyAccount[0].RoleName = roles;
          this.form.historyAccount[0].Enabled = "正常";
        }
        if (this.form.historyAccount.length > res.Record.length) {
          let len = this.form.historyAccount.length - res.Record.length - 1;
          this.form.historyAccount.splice(res.Record.length + 1, len);
        }
      }).catch(error => {
        console.log(error);
        this.$message({ showClose: true, message: '移交记录获取错误', type: 'error' });
      });
    },
    //搜索按钮
    search () {
      this.is_search = true;
      if (this.select_word != '') {
        var queryfilter = '{"[or-dictionary0]*dictionary*or": { "RealName*str*like": "' + this.select_word + '", "MobilePhone*str*like": "' + this.select_word + '" }}';

        console.log(queryfilter);
        this.getData(queryfilter);
        this.is_search = false;
      } else {
        this.getData('');
        this.is_search = false;
      }
    },
    //永久停用账号的提示
    messageTs () {
      this.$message.success("用户已被停用，无法正常登录，请联系系统管理员处理后再试！");
    },
    //新增
    Add () {
      // this.form.phid = 0;
      this.dialogState = "add";
      this.dialogTitle = "新增";
      this.editVisible = true;
      this.form.realName = '';
      this.form.mobilePhone = '';
      this.form.enabledMark = '0';
      this.singleSelection = [];


      this.$nextTick(() => {
        this.$refs['forms'].resetFields();
      })
    },
    //修改
    Edit () {
      let object = this.singleSelection;
      var me = this;
      //console.log(object[0]);
      // ;
      let id = object.length > 0 ? object[0].PhId : 0;
      if (object.length > 0) {
        if (object[0].Account == 'admin') {
          this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
          return;
        }
        if (object[0].EnabledMark == '2') {
          this.messageTs();
          return;
        }
      }
      if (id != 0) {
        //this.form=object[0];

        var roles = [];
        if (object[0].Roles.length > 0) {
          object[0].Roles.forEach(el => {
            roles.push(el.PhId);
          })
        }

        this.form.phid = object[0].PhId;
        this.form.realName = object[0].RealName;
        this.form.mobilePhone = object[0].MobilePhone;
        this.form.rolesid = roles;
        this.form.enabledMark = String(object[0].EnabledMark);


        //改变更新状态
        this.dialogState = "edit";
        this.dialogTitle = "编辑";
        this.editVisible = true;

        //判断是否是系统管理员
        this.adminJudge(object[0]);
        //获取移交记录
        //this.getTransData(id);
      } else {
        this.$message({ showClose: true, message: "请选中列表的其中一行", type: "warning" });
      }
    },
    //关闭Dialog事件
    dialogClose () {
      console.log('123')
      this.$nextTick(() => {
        this.$refs['forms'].resetFields();
      })
    },
    //取消表单
    callof (formName) {
      //隐藏弹出框
      this.editVisible = false;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
    },
    //删除按钮
    Delete () {
      let object = this.singleSelection;
      let length = object.length;
      if (length > 0) {
        if (object[0].Account == 'admin') {
          this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
          return;
        }
        if (object[0].EnabledMark == '2') {
          this.messageTs();
          return;
        }
      }
      this.adminJudge(object[0]);
      if (this.adminJudges) {
        this.$message.error("该用户为系统管理员，不能进行删除操作！");
        this.adminJudges = false;
        return;
      }
      if (length > 0) {
        this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {

          var vm = this;
          this.loading = true;

          //提交asiox
          SysUserDelete(vm, {
            id: object[0].PhId,
            uid: this.userid,
            orgid: this.orgid
          }).then(res => {
            this.loading = false;
            if (res.Status == 'success') {
              //设置状态，隐藏新增页面
              this.$message.success("删除成功");
              this.singleSelection = [];

              //刷新列表
              this.getData('');
            } else {
              this.$message.error('删除失败,请重试!');
            }
          }).catch(error => {
            console.log(error);
            this.loading = false;
            this.$message.error('删除错误');
          })

        }).catch(() => {
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
    PageReset () {
      let object = this.singleSelection;
      var vm = this;

      let id = object.length > 0 ? object[0].PhId : 0;
      if (object.length > 0) {
        if (object[0].Account == 'admin') {
          this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
          return;
        }
        if (object[0].EnabledMark == '2') {
          this.messageTs();
          return;
        }
      }
      if (id != 0) {
        this.$confirm('确定对账号进行密码重置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          SysUserUpdatePassword(vm, {
            uid: object[0].PhId,
            orgid: vm.orgid
          }).then(res => {
            if (res.Status === 'error') {
              vm.$message.error(res.Msg);
              return
            }
            vm.$message.success('密码重置成功! 重置后密码为：123456');

          }).catch(error => {
            console.log(error);
            vm.$message({ showClose: true, message: "密码重置错误", type: "error" });
          })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消密码重置！' });
        });
      } else {
        this.$message({ showClose: true, message: "请选中列表的其中一行", type: "warning" });
      }

    },
    //发送邀请码
    SendInvite () {
      // let basetttt = httpConfig.baseurl;
      // //let urlttt = basetttt.baseURL.substr(0,20) + "/ghc/saas/index#/register";
      // console.log(basetttt);
      let object = this.singleSelection;
      var vm = this;
      console.log(vm.invitationCode);
      let id = object.length > 0 ? object[0].PhId : 0;
      if (object.length > 0) {
        if (object[0].Account == 'admin') {
          this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
          return;
        }
        if (object[0].EnabledMark == '2') {
          this.messageTs();
          return;
        }
      }
      if (id != 0) {
        let base = httpConfig.baseurl;
        let url = base + "/ghc/saas/index#/register";
        console.log(vm.invitationCode);
        this.$confirm('确定要向该账户发送邀请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          SysUserSendInvitationCode(vm, {
            Uname: vm.username,
            Url: url,
            Phone: object[0].MobilePhone,
            InvitationCode: vm.invitationCode
          }).then(res => {
            console.log(res);
            if (res.Status === 'success') {
              vm.$message.success('发送邀请成功!');
            }
          }).catch(error => {
            console.log(error);
            vm.$message({ showClose: true, message: "发送邀请错误", type: "error" });
          })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消邀请！' });
        });
      } else {
        this.$message({ showClose: true, message: "请选中列表的其中一行", type: "warning" });
      }
    },
    //账号移交
    Transfer () {

      //账号移交
      let object = this.singleSelection;
      let id = object.length > 0 ? object[0].PhId : 0;
      if (object.length > 0) {
        if (object[0].Account == 'admin') {
          this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
          return;
        }
        if (object[0].EnabledMark == '2') {
          this.messageTs();
          return;
        }
      }
      if (id != 0) {
        var roles = [];
        if (object[0].Roles.length > 0) {
          object[0].Roles.forEach(el => {
            roles.push(el.PhId);
          })
        }

        this.form.phid = object[0].PhId;
        this.form.realName = "";
        this.form.mobilePhone = "";
        this.form.rolesid = roles;
        this.form.enabledMark = String(object[0].EnabledMark);

        this.jsonFlam = JSON.stringify(object[0]);
        console.log(object);
        //改变更新状态
        this.dialogState = "trans";
        this.dialogTitle = "账号移交";
        this.editVisible = true;

        //获取移交记录
        this.form.historyAccount = [];
        this.getTransData(id);

      } else {
        this.$message({ showClose: true, message: "请选中列表的其中一行", type: "warning" });
      }
    },
    //判断选中行是否有系统管理员权限
    adminJudge (val) {
      let hang = val.Roles;
      console.log(hang);
      if (hang.length > 0) {
        for (let i = 0; i < hang.length; i++) {
          if (hang[i].EnCode == '004') {
            this.adminJudges = true;
          }
        }
      }
    },
    //选择行
    handleClickRow (row) {
      this.adminJudges = false;
      this.singleSelection = [];
      this.singleSelection.push(row);
      console.log(this.singleSelection);
    },
    // 保存 新增保存
    saveEdit (formName) {
      // let reg=/[0-9]{11}/;
      // if(!reg.test(this.form.mobilePhone)){
      //     this.$message.error("手机号输入错误，请重试！");
      //     return;
      // }
      var data = {
        uid: "0",
        orgid: "0",
        value: this.form.mobilePhone,
      }
      this.$axios.get('/SysUser/GetUserByPhone', { params: data })
        .then(res => {
          console.log(res);
          if (res.Status == 'success') {
            if (res.Data != null && res.Data.RealName != this.form.realName) {
              this.$confirm("此操作将改变该用户在所有组织下的称呼,其原有的称呼为  " + res.Data.RealName + "  ！是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                this.$refs[formName].validate(valid => {
                  if (valid) {

                    if (this.dialogState === 'add') {
                      this.addUser();
                    } else if (this.dialogState === 'edit') {
                      this.editUser();
                    } else if (this.dialogState === 'trans') {
                      this.transUser();
                    }
                  }
                });
              }).catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消保存"
                });
              });
            } else {
              this.$refs[formName].validate(valid => {
                if (valid) {

                  if (this.dialogState === 'add') {
                    this.addUser();
                  } else if (this.dialogState === 'edit') {
                    this.editUser();
                  } else if (this.dialogState === 'trans') {
                    this.transUser();
                  }


                }
              });
            }
          } else {
            this.$message.error(res.Msg);
            return
          }
        })
        .catch(err => {
          console.log(err);
        })

      // this.$refs[formName].validate(valid => {
      //     if (valid) {
      //
      //         if (this.dialogState === 'add') {
      //             this.addUser();
      //         } else if (this.dialogState === 'edit') {
      //             this.editUser();
      //         } else if (this.dialogState === 'trans') {
      //             this.transUser();
      //         }
      //     }
      // });
    },
    //新增
    addUser () {
      //获取缓存 的用户 组织，角色基本信息
      let cookiesUser = Auth.getUserInfoData();
      var vm = this;
      /**
       * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
       * 新增数据信息 编辑
       *  */
      var userinfo = {
        PhId: this.form.phid,
        PersistentState: 1,
        Account: this.form.mobilePhone,
        Password: '123456',
        RealName: this.form.realName,
        NickName: this.form.realName,
        MobilePhone: this.form.mobilePhone,
        Type: 1,
        InvitationCode: '',
        Description: '组织管理员新增'
      };


      //角色-组织-用户信息 实体信息组合
      var relations = [];
      var roles = this.form.rolesid;
      for (let i = 0; i < roles.length; i++) {
        var roleItem = vm.roledata.filter(item => {
          return item.PhId === roles[i];
        })
        console.log(roleItem[0]);
        relations.push({
          PersistentState: 1,
          UserId: '',
          UserAccount: vm.form.mobilePhone,
          OrgId: vm.orgid,
          OrgCode: cookiesUser.orgInfo.EnCode,
          RoleId: roles[i],
          RoleCode: roleItem[0].EnCode,
          EnabledMark: '0',
          NickName: this.form.realName,
          Verify: '0',
          VerifyTime: new Date
        })
      }
      console.log(this.form.rolesid);

      this.loading = true;
      //提交asiox
      SysUserAdd(vm, {
        otype: this.dialogState,
        uid: '',
        orgid: this.orgid,
        infoData: { Mst: userinfo, Relation: relations }
      }).then(res => {
        this.loading = false;

        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }

        this.$message.success('保存成功!');
        //设置状态，隐藏新增页面
        this.dialogState = "";
        this.editVisible = false;
        //加载菜单信息
        var param = {
          userid: this.userid,
          orgid: this.orgid
        };

        this.$store.dispatch('user/getNavList', param).then((navList) => {

        })
        //刷新列表
        this.getData('');


      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.$message({ showClose: true, message: "用户列表获取错误", type: "error" });

      })
    },
    //修改
    editUser () {
      //如果是系统管理员就不允许永久停用
      if (this.form.enabledMark == '2' && this.adminJudges) {
        this.$message.error("系统管理员不允许永久停用！");
        return;
      }
      //获取缓存 的用户 组织，角色基本信息
      let cookiesUser = Auth.getUserInfoData();
      var vm = this;
      /**
       * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
       *  编辑数据信息
       * */
      var userinfo = this.singleSelection[0];
      userinfo.PersistentState = 2;
      userinfo.Account = this.form.mobilePhone;
      userinfo.RealName = this.form.realName;
      userinfo.NickName = this.form.realName;
      userinfo.MobilePhone = this.form.mobilePhone;
      userinfo.EnabledMark = this.form.enabledMark;


      //角色-组织-用户信息 实体信息组合
      var relations = [];
      var roles = this.form.rolesid;
      for (let i = 0; i < roles.length; i++) {
        var roleItem = vm.roledata.filter(item => {
          return item.PhId === roles[i];
        })
        relations.push({
          PersistentState: 1,
          UserId: userinfo.PhId,
          UserAccount: userinfo.MobilePhone,
          OrgId: vm.orgid,
          OrgCode: cookiesUser.orgInfo.EnCode,
          RoleId: roles[i],
          RoleCode: roleItem[0].EnCode,
          EnabledMark: this.form.enabledMark,
          NickName: this.form.realName,
          Verify: '1',
          VerifyTime: new Date,
          OperatorCode: userinfo.OperatorCode
        })
      }

      this.loading = true;
      //提交asiox
      SysUserUpdate(vm, {
        otype: this.dialogState,
        uid: this.userid,
        orgid: this.orgid,
        infoData: { Mst: userinfo, Relation: relations }
      }).then(res => {
        this.loading = false;

        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }

        this.$message.success('修改成功!');
        //设置状态，隐藏新增页面
        this.dialogState = "";
        this.editVisible = false;
        this.adminJudges = false;
        //清空选中项
        this.singleSelection = [];
        //加载菜单信息
        var param = {
          userid: this.userid,
          orgid: this.orgid
        };

        this.$store.dispatch('user/getNavList', param).then((navList) => {

        })
        //刷新列表
        this.getData('');

        //重新获取权限按钮
        var param2 = {
          userid: this.userid,
          orgid: this.orgid
        };
        this.GetAllRoleauthorize(param2);  //按钮权限

      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.$message({ showClose: true, message: "用户列表获取错误", type: "error" });

      })
    },
    //账号移交
    transUser () {
      //选中用户
      let select = this.singleSelection[0];
      console.log(select);
      //获取缓存 的用户 组织，角色基本信息
      let cookiesUser = Auth.getUserInfoData();
      var vm = this;
      //选中用户
      //let selectUser = this.singleSelection[0];
      let selectUser = JSON.parse(this.jsonFlam);
      var userinfo = this.singleSelection[0];
      userinfo.PersistentState = 2;
      userinfo.Account = this.form.mobilePhone;
      userinfo.RealName = this.form.realName;
      userinfo.NickName = this.form.realName;
      userinfo.MobilePhone = this.form.mobilePhone;


      //角色-组织-用户信息 实体信息组合
      var relations = [];
      var roles = this.form.rolesid;
      for (let i = 0; i < roles.length; i++) {
        var roleItem = vm.roledata.filter(item => {
          return item.PhId === roles[i];
        })

        relations.push({
          PersistentState: 1,
          UserId: userinfo.PhId,
          UserAccount: userinfo.MobilePhone,
          OrgId: vm.orgid,
          OrgCode: cookiesUser.orgInfo.EnCode,
          RoleId: roles[i],
          RoleCode: roleItem[0].EnCode,
          EnabledMark: this.form.enabledMark,
          NickName: this.form.realName,
          Verify: '1',
          VerifyTime: new Date,
          OperatorCode: userinfo.OperatorCode
        })
      }

      var rolesname = [];
      var rolesid = [];

      if (selectUser.Roles.length > 0) {
        selectUser.Roles.forEach(el => {
          rolesname.push(el.Name);
          rolesid.push(el.PhId);

        })
      }

      var transrecord = {
        UserId: selectUser.PhId,
        UserAccount: selectUser.Account,
        RealName: selectUser.RealName,
        MobilePhone: selectUser.MobilePhone,
        RoleName: String(rolesname),
        RoleId: String(rolesid)
      };
      console.log(transrecord);
      console.log(selectUser);

      this.loading = true;

      //提交asiox
      SysUserUpdate(vm, {
        otype: this.dialogState,
        uid: this.userid,
        orgid: this.orgid,
        infoData: { Mst: userinfo, Relation: relations, sysUserTransferRecord: transrecord }
      }).then(res => {
        console.log(res);
        this.loading = false;
        if (res == '1') {
          this.$message.error('不允许将账号移交给系统中已存在的用户，请更换用户信息后重试!');
          return;
        }
        if (res.Status === 'error') {
          this.$message.error(res.Msg);
          return
        }

        this.$message.success('修改成功!');
        //设置状态，隐藏新增页面
        this.dialogState = "";
        this.editVisible = false;
        //清空选中项
        this.singleSelection = [];
        //加载菜单信息
        var param = {
          userid: this.userid,
          orgid: this.orgid
        };

        this.$store.dispatch('user/getNavList', param).then((navList) => {


        })
        //刷新列表
        this.getData('');

      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.$message({ showClose: true, message: "用户列表获取错误", type: "error" });

      })
    }
  }
};
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #00b8ee;
}

.el-button--info:checked,
.el-button--info:focus {
  background: #00b8ee;
  color: #ffffff;
}
/*.el-button--info[data-v-397cedc7]:checked, .el-button--info[data-v-397cedc7]:focus {*/
/*!* background: #00B8EE; *!*/
/*color: #FFFFFF;*/
/*}*/
.el-icon-refresh:focus {
  background: #ffffff;
  border-color: #ffffff;
}

.el-icon-refresh:before {
  /* content: "\E6D0"; */
  font-size: 25px;
  color: #00b8ee;
  margin-left: -10px;
}
.el-icon-refresh {
  background: #ffffff;
  border-color: #ffffff;
}
.el-checkbox-role {
  width: 100%;
  float: left;
  margin-left: 0px;
}
.el-checkbox__label {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
  width: 80%;
}

.el-checkbox-role2 {
  cursor: pointer;
  width: 30%;
  float: right;
  margin-bottom: 0px;
  margin-right: 100px;
  color: #00b8ee;
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
  width: 230px;
  display: inline-block;
  heihgt: 30px;
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
.handle-box .inputContainer {
  height: 32px;
  position: relative;
  top: -1px;
  display: inline-block;
  width: 150px;
}
.handle-box .inputContainer > input {
  border-radius: 4px 0 0 4px;
}

.searchBtn {
  position: relative;
  height: 32px;
  border-radius: 0 4px 4px 0;
  font-size: 18px;
  padding: 0 10px;
}
.btn-font {
  font-size: 14px;
  padding: 8px 15px;
}
</style>
<style>
.el-table--border th,
.el-table--border td {
  /*// border: 0;*/
}

.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #00b8ee;
}
.el-button--info:hover {
  border-color: #00b8ee;
}
.sysUser .handle-input > input.el-input__inner {
  height: 32px;
  border-radius: 4px 0 0 4px;
  position: relative;
  /*top:1px;*/
}
</style>
