<template>
    <div class="sys-header">
         <!-- 折叠按钮 -->
        <div class="collapse-btn" >
            <i class="el-icon-menu" @click="collapseChage">政云数据</i>
        </div>
        <div class="logo">
            <slot name="logo"></slot>
        </div>
        <div class="header-right">
            
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div> -->
                <!-- 消息中心 -->
                <div class="telPhone"><img src="../../assets/images/finance/SAAS-03.png"><span>0571-88270588</span></div>
                <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/notice">
                            <div class="message"><img src="../../assets/images/finance/SAAS-02.png"></div>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img src="../../assets/images/finance/SAAS-01.png"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="userOperation">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="header-user">
                            <div>{{userInfoHead.RealName}}</div>
                            <div>({{userInfoHead.MobilePhone}})</div>
                        </el-dropdown-item>
                        <el-dropdown-item command="editPaw">修改密码</el-dropdown-item>
                        <el-dropdown-item divided  command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- el-dialog 弹出修改密码页面-->
        <el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" :modal-append-to-body="false" custom-class="editPawDialog">
            <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px" >
                <el-form-item label="旧密码" prop="oldPaw">
                    <el-input type="password" v-model="editPaw.oldPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPaw" id="newPaw">
                    <el-input type="password" key="inpNewPaw" v-model="editPaw.newPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmNewPaw" >
                    <el-input type="password" key="inpConfirmNewPaw" v-model="editPaw.confirmNewPaw" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="textC">
                <el-button type="primary" @click="editPawSubmit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import md5 from 'js-md5'
import desHelper from "@/util/desHelper"
import auth from "@/util/auth.js"
export default {
  data() {
    return {
      dialog: {
        editPaw: {
          show: false
        }
      },
      editPaw: {
        oldPaw: "",
        newPaw: "",
        confirmNewPaw: ""
      },
      editPawRules: {
        oldPaw: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newPaw: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 个字符",
            trigger: "blur"
          },
          {
            // eslint-disable-next-line
            validator(rule, value, callback, source, options) {
              var errors = [];
              if (!/^[a-z0-9]+$/.test(value)) {
                console.log("不符合输入规则");
                errors.push("请输入字母或特殊字符");
              }
              callback(errors);
            }
          }
        ],
        confirmNewPaw: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 个字符",
            trigger: "blur"
          },
          {
            // eslint-disable-next-line
            validator(rule, value, callback, source, options) {
              var errors = [];

              if (!/^[a-z0-9]+$/.test(value)) {
                console.log("不符合输入规则");
                errors.push("请输入字母或特殊字符");
              }
              callback(errors);
            }
          }
        ]
      },
       message: 2,
        userInfoHead:{}
    };
  },
    mounted(){
        this.userinfoget()
    },
  computed: {
    ...mapState({
        username: state => state.user.username,
        lang: state => state.lang,
        orgid:state=>state.user.orgid,
        orgcode:state=>state.user.orgcode,
        uid:state=>state.user.userid,
        phone:state=>state.user.username
    }),
    collapse() {
      return this.$store.state.isCollapse;
    }
  },
  methods: {
    ...mapActions({
      sysLogout: "user/logout"
    }),
      userinfoget:function(){
          this.userInfoHead=auth.getUserInfoData().userInfo;
      },
    userOperation(command) {
        // 用户名下拉菜单选择事件
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "editPaw":
          this.dialog.editPaw.show = true;
          console.log("编辑密码");
          console.log(this.uphone);
          break;
      }
    },
    logout() {
        //退出事件
      this.sysLogout().then(() => {
        this.$router.push("/login");
      });
    },
    collapseChage() {
      // 侧边栏折叠
      this.collapseprop = !this.collapseprop;
      // childByValue是在父组件on监听的方法
      // 第二个参数this.childValue是需要传的值
      this.$emit("collapseByValue", this.collapseprop);
    },
    editPawSubmit() {
      this.$refs.editPaw.validate(valid => {
        if (valid) {
          if (this.editPaw.newPaw!= this.editPaw.confirmNewPaw) {
            console.log("新密码与确认新密码不一致!");
            this.$message.error("新密码与确认新密码不一致!");
            return;
          }

          var oldPwd = md5(this.editPaw.oldPaw);
          var newPwd = desHelper.Encrypt(this.editPaw.newPaw,oldPwd);

          //接口要包含3个参数： uid、 oldPwd、 newPwd
          let data={
              uid:this.uid,
              orgid:this.orgid,
              OldPwd: oldPwd,
              NewPwd: newPwd
          };
          this.$axios.post('/SysUser/PostUpdatePassword',data)
            .then(res=>{
                if (res.Status=='success'){
                    this.$message.success("密码修改成功!");
                    this.dialog.editPaw.show = false;
                    this.editPaw.oldPaw="";
                    this.editPaw.newPaw="";
                    this.editPaw.confirmNewPaw="";
                    return true;
                }

                if (res.Status=="error"){
                    this.$message.error(res.Msg);
                    return false;
                }
            })
            .catch(err=>console.log(err));

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;

}
.sys-header{
  border-color:#ccc;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 60px;
  width: 180px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 60px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
/* .btn-bell-badge {
  position: absolute;
  right: -15px;
  top: 3px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
} */
.el-icon-menu{
  font-size: 20px;
}
.btn-bell .el-icon-bell {
  font-size: 20px;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.header-title{
    font-size: 30px;
    font-weight: 600;
}
.header-user{
    border-bottom: 1px solid #ebeef5;
    line-height: 18px;
    font-weight: 600;
    margin-bottom: 6px;
    padding-bottom: 6px;
}
.telPhone{
  color:#88b927;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-right: 30px;
}
.telPhone>img{
  width:30px;
}
.message>img{
  width:100%;
}
.user-avator>img{
  width:35px;
  height:30px;
}
.sys-header .header-user-con .el-dropdown{
  color:#333;
}
</style>
