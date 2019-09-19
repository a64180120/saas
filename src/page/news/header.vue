<template>
  <div class="Top_navigation">
    <div class="logo_box">
      <img src="@/assets/images/logo2.png">
    </div>
    <div id="div" class="search_box">
      <img src="@/assets/img/fdj.png" style="margin:0;">
      <div id="sou" class="sousuo" style="display:none;"></div>
    </div>
    <div class="Sign_box">
      <img src="@/assets/images/finance/SAAS-01.png">
      <div @click.stop="userDropDown=!userDropDown" class="userInfo" v-if="userinfo">
        <div>
          {{username}}
          <div></div>
        </div>
        <ul :class="{userDropDown:userDropDown}">
          <li>
            <div>{{userinfo.RealName}}</div>
            <div>({{userinfo.MobilePhone}})</div>
          </li>
          <li @click.stop="editPawClick">修改密码</li>
          <li @click.stop="logoutClick">退出登录</li>
        </ul>
      </div>
      <p v-if="!userinfo">
        <router-link style="color:#7fa409" to="/login">登录</router-link>
      </p>
      <p v-if="!userinfo">|</p>
      <p v-if="!userinfo">
        <router-link style="color:#7fa409" to="/register">注册</router-link>
      </p>
    </div>
    <div class="contact_box">
      <img src="@/assets/images/finance/SAAS-03.png">
      <p>0571-88270588</p>
    </div>
    <!-- el-dialog 弹出修改密码页面-->
    <el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" custom-class="editPawDialog">
      <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px">
        <el-form-item label="旧密码" prop="oldPaw">
          <el-input type="password" v-model="editPaw.oldPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPaw" id="newPaw">
          <el-input type="password" key="inpNewPaw" v-model="editPaw.newPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPaw">
          <el-input
            type="password"
            key="inpConfirmNewPaw"
            v-model="editPaw.confirmNewPaw"
            auto-complete="off"
          ></el-input>
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
import Auth from "@/util/auth";
import md5 from "js-md5";
import desHelper from "@/util/desHelper";

//文章新增、编辑
export default {
  data() {
    let validPaw = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
        if (!reg.test(value)) {
          callback(new Error("不符合输入规则:6-12位"));
        } else {
          callback();
        }
      }
    };
    return {
      userDropDown: false, //修改密码弹窗
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
          { required: true, validator: validPaw, trigger: "blur" }
        ],
        confirmNewPaw: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { required: true, validator: validPaw, trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  //加载数据
  mounted() {},
  //计算
  computed: {
    ...mapState({
      uid: state => state.user.userid,
      username: state => state.user.username,
      orgcode: state => state.user.orgcode,
      orgid: state => state.user.orgid
    }),
    userinfo: function() {
      var user = Auth.getUserInfoData();

      if (user) {
        return user.userInfo;
      }
    }
  },
  methods: {
    ...mapActions({
      sysLogout: "user/logout"
    }),
    //修改密码
    editPawClick() {
      this.dialog.editPaw.show = true;
    },
    //修改密码提交
    editPawSubmit() {
      this.$refs.editPaw.validate(valid => {
        if (valid) {
          if (this.editPaw.newPaw != this.editPaw.confirmNewPaw) {
            console.log("新密码与确认新密码不一致!");
            this.$message.error("新密码与确认新密码不一致!");
            return;
          }

          var oldPwd = md5(this.editPaw.oldPaw);
          var newPwd = desHelper.Encrypt(this.editPaw.newPaw, oldPwd);

          //接口要包含3个参数： uid、 oldPwd、 newPwd
          let data = {
            uid: this.uid,
            orgid: this.orgid,
            OldPwd: oldPwd,
            NewPwd: newPwd
          };
          this.$axios
            .post("/SysUser/PostUpdatePassword", data)
            .then(res => {
              if (res.Status == "success") {
                this.$message.success("密码修改成功!");
                this.dialog.editPaw.show = false;
                this.editPaw.oldPaw = "";
                this.editPaw.newPaw = "";
                this.editPaw.confirmNewPaw = "";
                this.$router.push("/login");
              }

              if (res.Status == "error") {
                this.$message.error(res.Msg);
                return false;
              }
            })
            .catch(err => console.log(err));
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
<style lang="scss" scoped>
.Top_navigation {
  width: 1177px;
  height: 70px;
  margin: auto auto 0;
}
.logo_box {
    max-width: 750px;
    float: left;
    height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.logo_box img {
  width: 100%;
  margin-top: 15px;
}
.search_box {
  position: relative;
  float: right;
  z-index: 50;
  width: 70px;
  height: 70px;
  background: rgba(0, 0, 0, 0.5);
}
.sousuo {
  width: 245px;
  height: 40px;
  border-radius: 8px;
  position: absolute;
  background: #fff;
  right: 2px;
  bottom: -48px;
  z-index: 50;
}
.nm {
  animation: flipInX 1s ease;
  animation-fill-mode: backwards;
}
.bottom_box {
  background: #282828;
  width: 1120px;
  margin: 15px auto 0;
  height: 360px;
  padding-left: 10px;
  padding-right: 7px;
  padding-top: 19px;
  padding-bottom: 10px;
}
.input_box {
  width: 200px;
  height: 30px;
  border: none;
  margin-top: 4px;
  margin-left: 9px;
  outline: none;
  color: #505050;
  line-height: none;
}
.search_box img {
  display: block;
  margin: 14px auto 0;
}
.Sign_box {
  float: right;
  width: 140px;
  height: 70px;
}
.Sign_box * {
  float: left;
}
.Sign_box p {
  font-size: 16px;
  line-height: 70px;
  color: #7fa409;
  margin-left: 5px;
}
.Sign_box img {
  width: 25%;
  margin-top: 17px;
}
.contact_box {
  width: 200px;
  float: right;
  height: 70px;
}
.contact_box * {
  float: left;
}
.policy {
  width: 1132px;
  height: 443px;
  margin: 15px auto 0;
  background: url(/assets/img/q6.png);
  background-size: 100%;
  padding-left: 16px;
  padding-right: 13px;
  padding-top: 19px;
  padding-bottom: 10px;
}
.chuang {
  position: absolute;
  right: -9px;
  top: -9px;
  width: 136px;
  height: 118px;
  background: url(/assets/img/g1.png);
  z-index: 999;
}
.contact_box p {
  font-size: 16px;
  line-height: 70px;
  color: #7fa409;
  margin-left: 5px;
}
.contact_box img {
  width: 17%;
  margin-top: 17px;
  margin-left: 23px;
}
.decorate {
  background: #0183fd;
  width: 100%;
  height: 490px;
  margin-top: 35px;
  position: relative;
  overflow: hidden;
  animation: a 0.5s;
}
.decorate img {
  position: absolute;
}
.bottom_box_left {
  width: 545px;
  height: 330px;
  float: left;
}
.bottom_box_right {
  width: 545px;
  height: 330px;
  float: right;
}
.bottom_box_right ul {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.bottom_box_right ul li {
  width: 300px;
  height: 40px;
  color: #fff;
  float: left;
  line-height: 37px;
  padding-left: 0px;
  margin-left: 145px;
}
.bottom_box_right ul li * {
  float: left;
}
.bottom_box_left ul li img {
  width: 7%;
  margin-top: 8px;
  margin-right: 9px;
}
.bottom_box_left ul {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.bottom_box_left ul li {
  width: 300px;
  height: 40px;
  color: #fff;
  float: left;
  line-height: 37px;
  padding-left: 0px;
  margin-left: 145px;
}
.bottom_box_left ul li * {
  float: left;
}
.bottom_box_left ul li img {
  width: 7%;
  margin-top: 8px;
  margin-right: 9px;
}
.bottom_box_right ul {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.bottom_box_right ul li {
  width: 300px;
  height: 40px;
  color: #fff;
  float: left;
  line-height: 37px;
  padding-left: 0px;
  margin-left: 145px;
}
.bottom_box_right ul li * {
  float: left;
}
.bottom_box_left ul li img {
  width: 7%;
  margin-top: 8px;
  margin-right: 9px;
}

> ul.userDropDown {
  height: auto;
  opacity: 1;
  border: 1px solid #e6e6fa;
  > li:first-of-type {
    margin-top: 10px;
    > div {
      height: 50%;
      line-height: 100%;
    }
  }
}
.userInfo {
  display: inline-block;
  position: relative;
  color: #333;
  > div {
    padding: 0 20px 10px;
    height: 70px;
    line-height: 70px;
    position: relative;
    cursor: pointer;
    > div {
      position: absolute;
      border: 5px solid transparent;
      border-top-color: #333;
      top: 30px;
      right: 0px;
    }
  }
  > ul {
    position: absolute;
    height: 0;
    overflow: hidden;
    top: 70px;
    right: -37px;
    z-index: 99;
    background: #fff;
    transition: all 0.3s linear;
    opacity: 0;
    border-radius: 0 0 3px 3px;
    > li {
      width: 135px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      cursor: pointer;
      padding: 0 5px;
      > div {
        width: 100%;
        text-align: center;
      }
      &:hover {
        background: #e6f8fd;
        color: #33c6f1;
      }
    }
  }
  > ul.userDropDown {
    height: auto;
    opacity: 1;
    //   border: 1px solid #E6E6FA;
    > li:first-of-type {
      border-bottom: 1px solid #ebeef5;
      font-weight: 600;
      margin-bottom: 6px;
      padding-bottom: 6px;
      margin-top: 10px;
      > div {
        height: 50%;
        line-height: 100%;
      }
    }
  }
}
</style>
