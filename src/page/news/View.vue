<template>
  <div class="sys-page">
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
    </div>
    <div class="journalism_box">
      <div class="journalism">
        <div class="journalism1">
          <div style="overflow:hidden; padding:30px;">
            <h4 class="artTitle"> {{ article.Title }}</h4>
            <div class="info">
              <p style="margin-top:10px;">{{ article.PublishTime}}
                <span style="margin-left:15px">
                  <i class="glyphicon glyphicon-eye-open" style="color:#999;"></i> &nbsp;{{ article.Hitrate}}
                </span>
              </p>
            </div>
          </div>
          <div style="overflow:hidden; padding-left:30px; padding-right:30px; padding-bottom:30px;">
              <art-preview :contents="article.Content" />
          </div>
            <div class="attachement" v-if='AttachmentList.length>0'>
                <p>附件</p>
                <ul class="attlist">
                    <li @click.stop="AttachmentDownLoad(item)" v-for="(item,index) of AttachmentList" :key="index">{{item.BName}}</li>
                </ul>
            </div>
        </div>
        <div class="journalism2">
          <div style="overflow:hidden; padding:15px; border-bottom: #7fa409 2px solid; position:relative;" >
            <h3>行业动态</h3>
            <h3 class="fh">
              <a href="/index">返回首页</a>
            </h3>
          </div>
          <!-- <div class="kuang1">
      	<input type="text"  placeholder='&nbsp;请输入标题'  />
        <i><img src="img/sou.png" /></i>
          </div>-->
          <ul>
            <li>
              <a href="xqy.html">
                <h5>财政部部长肖捷表示：农民工随迁子女入学</h5>
                <p>2018-02-09</p>
              </a>
            </li>
            <li>
              <a href="xqy.html">
                <h5>济南：又是一年春耕时 喜看三农新变化</h5>
                <p>2018-02-09</p>
              </a>
            </li>
            <li>
              <a href="xqy.html">
                <h5>农业3·15，农资打假在行动！</h5>
                <p>2018-02-09</p>
              </a>
            </li>
            <li>
              <a href="xqy.html">
                <h5>柯桥区部署文化礼堂建设工作 打造农村基层文化地标</h5>
                <p>2018-02-09</p>
              </a>
            </li>
            <li>
              <a href="xqy.html">
                <h5>农业部部署加快推动农村承包地确权工作</h5>
                <p>2018-02-09</p>
              </a>
            </li>
            <li style="border:none;">
              <a href="xwgg.html">
                <i
                  class="glyphicon glyphicon-link"
                  style=" position:absolute; top:5px; color:#7fa409"
                ></i>
                <h5 style="margin-left:18px; border-bottom:#7fa409 2px solid;width: 56px;">所有新闻</h5>
              </a>
            </li>
          </ul>
        </div>
      </div>
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
import config from "@/util/ajaxConfig";
import Auth from "@/util/auth";
import md5 from "js-md5";
import desHelper from "@/util/desHelper";
import artPreview from '@/components/ArticlePreview'

//文章新增、编辑
export default {
  name: "Article_view",
  components: { artPreview },
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
      },
        article: {
            PhId: '',         //主键
            PhIdType: '',   //信息类别
            Title: '',       //标题
            Content: '',     //文本
            Name: '',        //信息来源
            LevelType: '',    //制度级别
            Ontop: 0,        //是否置顶
            Picpath: '',     //封面图片
            AttachmentName: '',     //图片原始名称
            AttachmentSize: '',     //图片大小
            Publisher: '',   //发布人
            PublishTime:''
        },
        AttachmentList: [],   //附件
    };
  },
  created() {},
  //加载数据
  mounted: function() {
        var phid = this.$route.query.phid;
        if(phid){
            this.getData(phid);
        }
  },
  //计算
  computed: {
    picUrl: function() {
      return config.baseurl;
    },
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
    //获取新闻数据
    getData(phid) {
        let data = {
            id: phid,
            uid: this.userid,
            orgid: this.orgid
        };

        this.$axios.get('/SysNews/GetNewsAndAttachmentByNid', {params: {phid:phid}})
            .then(res => {
                if (res.Status === 'error') {
                    this.$message.error(res.Msg);
                    return
                }
                this.article = res.NewsModel;
                this.AttachmentList=res.AttachmentModels;
            })
            .catch(err => {
                console.log(err)
                this.$message({showClose: true, message: "新闻获取错误", type: "error"});
            })
    },
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
  width: 250px;
  float: left;
  height: 70px;
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

/* */
.journalism_box{
	width:100%;
	overflow:hidden;
    background-color: rgb(242, 242, 242);
}
.img_box{
	width:100%;
	height:40%;
}
.journalism{
	overflow: hidden;
    width: 1000px;
    margin: auto auto 0;
    margin-top: 56px;
}
.journalism1{
    overflow: hidden;
    width: 730px;
    background: #FFF;
    float: left;
    margin-bottom: 20px;
}
.journalism2{
	width:250px;
	background:#FFF;
	float:right;
	padding-bottom:10px;
}
.journalism1 ul{
	width: 700px;
    height: 1000px;
    margin-left: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
}
.journalism1 ul li{
	border-bottom: 1px solid #f0f2f5;
    padding-bottom: 30px;
    margin-bottom: 30px;
}
.tct{
	margin-top:10px;
	word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
h4:hover{
	color: #7fa409;
}
.artTitle{
    font-size: 18px;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
}

.journalism2 ul{
	overflow: hidden;
    width: 220px;
    margin-top: 15px;
    margin-left: 15px;
	margin-bottom:15px;

}
.journalism2 ul li{
	width:100%;
	margin-top:10px;
	line-height:30px;
	border-bottom: 1px solid #f0f2f5;

}
.journalism2 ul li a{
	display:block;
	width:100%;
	height: 100%;
	position:relative;
}
.journalism2 ul li a h5{
	color: #7fa409;
	line-height: 20px;
	overflow:hidden; 
	text-overflow:ellipsis; 
	white-space:nowrap;
	width:100%;
	
}
.journalism2 ul li a p{
    color:#b7b7b7;
    line-height: 20px;
    width: 100%;
    padding-bottom: 6px;
    text-align: right;
    margin-top: -10px;
}
.info {
    color: #a3afb7;
    font-size: 16px;
    font-weight: 300;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f2f5;
}
.fh{
	position: absolute !important;
    top: 23px !important;
    right: 15px !important;
    font-size: 15px !important;
    color: #7fa409 !important;
}
.sou1{
	width: 84%;
    height: 100%;
    border: none;
    margin-left: 6px;
}

</style>
