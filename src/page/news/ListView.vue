<template>
  <div class="sys-page">
      <top-nav></top-nav>
      <div style="width:100%; height:370px; margin-top:3px;">
        <img src="@/assets/images/banner5.jpg" style="width:100%; height:100%;">
      </div>
          <div class="journalism_box">
      <div class="journalism">
        <div class="journalism1">
          <ul>
            <li v-for="(item,index) of listInfo" :key="index" @click.stop="openDetil(item,title)">
              <div style="overflow:hidden;">
                <div style="float:left; overflow:hidden; padding-right:20px;">
                  <a ><img :src="item.Picpath==null? require('../../assets/images/newsdefault.jpg'): picUrl+item.Picpath" style="width:160px;"/></a>
                </div>
                <div style=" overflow:hidden;">
                  <div class="newstitle"><h4>{{item.Title}}</h4></div>
                  <p class="tct" style="-webkit-box-orient: vertical;">
                    {{item.ContentText }}
                  </p>
                  <p style="margin-top:5px;">
                    {{item.PublishTime | formatDate('YYYY-MM-DD')}}
                    <span style="margin-right:15px">
                        <i class="hyzIcon_eye" style="color:#999;"></i>
                      <!--<i class="glyphicon glyphicon-eye-open" style="color:#999;"></i>-->&nbsp;
                        <span >{{item.Hitrate}}</span>
                    </span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="journalism2">
          <div class="hyzTitleContent">
            <div id="hyzTitle" class="hyzTitle">{{title}}最新动态</div>
            <h3 class="fh"><router-link to="/index">返回首页</router-link></h3>
          </div>
          <ul id="yichu">
            <li v-for="(item,index) of listInfo" :key="index">
              <a @click.stop="openDetil(item,title)" style='cursor: pointer;'><h5>{{item.Title}}</h5></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
      	<!-- el-dialog 弹出修改密码页面-->
		<el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" custom-class="editPawDialog">
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
  import { mapState, mapActions } from 'vuex'
  import config from '@/util/ajaxConfig'
  import Auth from "@/util/auth";
  import md5 from 'js-md5'
  import desHelper from "@/util/desHelper"
  import topNav from '@/components/home/topNav'
//文章新增、编辑
export default {
  name: "Article_listview",
  components: {topNav},
  data() {
    let validPaw=(rule,value,callback)=>{
          if(value==''||value==undefined){
              callback()
          }else{
              //let reg=/^([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
              let reg=/^(?=.*[A-Za-z!@#\$%\^&\*\(\)])([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
              if(!reg.test(value)){
                callback(new Error('不符合输入规则:6-12位且至少包含一个字母或其他字符'))
              }else{
                  callback()
              }
          }
    };
    return {
		userDropDown:false, //修改密码弹窗
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
			{ required:true, validator:validPaw,trigger:'blur'}
			],
			confirmNewPaw: [
			{ required: true, message: "请再次输入新密码", trigger: "blur" },
			{ required:true, validator:validPaw,trigger:'blur'}
			]
        },
        listInfo:[],      //列表信息
        pageSize: 10, //pageSize
        pageIndex: 1, //pageIndex
        total:0,
        title:'',
    };
  },
  created() {},
  //加载数据
  mounted: function() {
    this.typePhid = this.$route.query.typePhid;
      this.title=this.$route.query.title
    this.getNewsList(this.typePhid)
  },
  //计算
  computed: {
    picUrl:function(){
        return config.baseurl;
    },
    ...mapState({
        uid: state => state.user.userid,
        username: state => state.user.username,
        orgcode: state => state.user.orgcode,
        orgid: state => state.user.orgid
    }),
    userinfo:function(){
        var user=Auth.getUserInfoData();

        if(user){
        return user.userInfo
        }
    }
  },
  methods: {
    ...mapActions({
        sysLogout: "user/logout",
        GetNewsList: "news/GetNewsList"
    }),
    //获取新闻列表
    getNewsList(phid){
        var parames={
            value:phid,
            pageindex:this.pageIndex-1,
            pagesize:this.pageSize,
            queryfilter:{
				"Publish*num*eq":1,  //发布状态
			},
            defultdbname:true
        };

        this.GetNewsList(parames).then(res => {
            if (res.Status === 'error') {
                this.$message.error(res.Msg);
                return
            }

            this.listInfo=res.List;
            this.total=Number(res.Total);
        }).catch(error => {
            console.log(error);
            this.$message({showClose: true, message: '新闻列表失败', type: 'error'})
        })
    },
    //修改密码
    editPawClick(){
        this.editPaw.oldPaw="";
        this.editPaw.newPaw="";
        this.editPaw.confirmNewPaw="";
        this.dialog.editPaw.show=true
    },
    //修改密码提交
    editPawSubmit() {
        this.$refs.editPaw.validate(valid => {
        if (valid) {
            if (this.editPaw.newPaw!= this.editPaw.confirmNewPaw) {
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
                    this.$router.push("/login");
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
    },
    //打开详细页面
    openDetil(object,title){
        this.$router.push({path: '/news/view', query: { phid:object.PhId,type:'listview',typePhid:object.PhIdType, title:title }});
    },
    logoutClick() {
        //退出事件
        this.sysLogout().then(() => {
        this.$router.push("/login");
        });
    },
      //跳转工会****
      NavTo(str){
          if(!this.userinfo){
              this.$router.push({path:'/login'});
          }else{
              // if(str=='finance'){  //工会财务****************暂时没有数据直报
              //
              // }else{  //数据直报
              //
              // }
              var data = {
                  orgId: this.orgid,
                  userId: this.uid
              };
              this.$axios
                  .get("SysRole/GetDefaultPageByRoles", { params: data })
                  .then(res => {
                      if (res.UrlAddress == null || res.UrlAddress == '') {
                          this.$message.error("当前用户还未赋予有页面的菜单权限，请联系管理员!");
                      } else {
                          //this.defaultPage = res.UrlAddress;
                          this.$router.push({path:res.UrlAddress});
                      }
                  })
                  .catch(err => {
                      this.saasMessage = {
                          message: "获取默认页面失败了!",
                          visible: true
                      };
                  });
          }
      },
  }
};
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang="scss" scoped>
    .sys-page{
        background: rgb(244, 244, 244);
    }
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
	position:relative;
	float: right;
	z-index:50;
	width: 70px;
	height: 70px;
	background: rgba(0,0,0,0.5);
}
.sousuo{
	width: 245px;
    height: 40px;
    border-radius: 8px;
    position: absolute;
    background: #fff;
    right: 2px;
    bottom: -48px;
	z-index:50;
}
.nm{
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
.input_box{
	width:200px;
    height:30px;
    border: none;
    margin-top:4px;
    margin-left:9px;
	outline:none;
	color: #505050;
	line-height:none;
}
.search_box img {
	display: block;
	margin: 14px auto 0;
}.Sign_box {
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
.chuang{
	position:absolute;
    right:-9px;
    top:-9px;
    width:136px;
    height:118px;
    background: url(/assets/img/g1.png);
    z-index:999;
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
.bottom_box_left{
	width:545px;
	height:330px;
	float:left;
}
.bottom_box_right{
	width:545px;
	height:330px;
	float:right;
}
.bottom_box_right ul{
	width:100%;
	height:100%;
	overflow:hidden;
}
.bottom_box_right ul li{
	width:300px;
    height:40px;
    color:#fff;
    float:left;
    line-height:37px;
    padding-left:0px;
	margin-left:145px;
}
.bottom_box_right ul li *{
	float:left;
}
.bottom_box_left ul li img{
	width:7%;
    margin-top:8px;
    margin-right:9px;
}
.bottom_box_left ul{
	width:100%;
	height:100%;
	overflow:hidden;

}
.bottom_box_left ul li{
	width:300px;
    height:40px;
    color:#fff;
    float:left;
    line-height:37px;
    padding-left:0px;
	margin-left:145px;
}
.bottom_box_left ul li *{
	float:left;
}
.bottom_box_left ul li img{
	width:7%;
    margin-top:8px;
    margin-right:9px;
}
.bottom_box_right ul{
	width:100%;
	height:100%;
	overflow:hidden;
}
.bottom_box_right ul li{
	width:300px;
    height:40px;
    color:#fff;
    float:left;
    line-height:37px;
    padding-left:0px;
	margin-left:145px;
}
.bottom_box_right ul li *{
	float:left;
}
.bottom_box_left ul li img{
	width:7%;
    margin-top:8px;
    margin-right:9px;
}

>ul.userDropDown{
      height:auto;
      opacity:1;
      border: 1px solid #E6E6FA;
      >li:first-of-type{
        margin-top:10px;
        >div{
          height:50%;
          line-height:100%;
        }
      }
    }
 .userInfo{
    display: inline-block;
    position:relative;
    color:#333;
     width:75%;
    >div{
      padding:0 20px 10px;
	  height:70px;
	  line-height:70px;
      position:relative;
      cursor:pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

      >div{
        position:absolute;
        border:5px solid transparent;
        border-top-color:#333;
        top:30px;
        right:0px;
      }
    }
    >ul{
      position: absolute;
      height:0;
      overflow: hidden;
      top:70px;
      right:-37px;
      z-index: 99;
      background: #fff;
      transition:all 0.3s linear;
      opacity:0;
	  border-radius:  0 0 3px 3px;
      >li{
		width:135px;
        height:45px;
        line-height:45px;
        text-align:center;
        cursor:pointer;
        padding:0 5px;
		>div{
			width:100%;
			text-align: center;
		}
        &:hover{
          background:#e6f8fd;
          color:#33c6f1;
        }
      }
    }
    >ul.userDropDown{
      height:auto;
      opacity:1;
    //   border: 1px solid #E6E6FA;
      >li:first-of-type{
		border-bottom: 1px solid #ebeef5;
		font-weight: 600;
		margin-bottom: 6px;
		padding-bottom: 6px;
        margin-top:10px;
        >div{
          height:50%;
          line-height:100%;
        }
      }
    }

}
/* */

.journalism_box{
	width:100%;
	overflow:hidden;
}
.img_box{
	width:100%;
	height:40%;
}

.journalism{
	overflow: hidden;
    width: 1000px;
    margin: auto auto 0;
    margin-top: 20px;
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

    margin-left: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
}
.journalism1 ul li{
	border-bottom: 1px solid #f0f2f5;
    padding-bottom: 30px;
    margin-bottom: 30px;
    cursor: pointer;
}
.tct{
	margin-top:10px;
	word-break: break-all;
    text-overflow: ellipsis;
	display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    font-size: 16px;
    height: 72px;

}
.x5{
	margin-top:10px !important;
	word-break: break-all !important;
    text-overflow: ellipsis !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 2 !important;

	-ms-box-orient: vertical !important;
	-ms-line-clamp: 2 !important;

    overflow: hidden !important;
	white-space: nowrap !important;
	display:block !important;
}

.ie .tct{
	margin-top:10px;
	word-break: break-all;
    text-overflow: ellipsis;
	display: -webkit-box;
	-ms-box-orient: vertical;
	-ms-line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
	white-space: nowrap;
    font-size: 16px;
}
.newstitle{
    font-size: 18px;
    font-weight: 600;
    line-height: 1.1;
    color: inherit;
    >h4:hover{
	    color: #7fa409;
    }
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
}
.journalism2 ul li a h5{
	color: #7fa409;
    line-height: 20px;
}

.fh{
	position: absolute !important;
    right: 15px !important;
    font-size: 15px !important;
    color: #7fa409 !important;
    >a, a:link, a:active, a:visited{
	    color: #7fa409;
    }
}
.sou1{
	width: 84%;
    height: 100%;
    border: none;
    margin-left: 6px;
}

.hyzTitleContent{
    height:40px;
    padding: 0 0 10px 0;
    position: relative;
    overflow:hidden;
    border-bottom: #7fa409 2px solid;
    line-height: 40px;
}
.hyzTitle{
    padding: 0px 15px;
    color: #ffffff;
    height: 40px;
    position: absolute;
    z-index: 133;
}
#hyzTitle:after{
    content: '';
    display: inline-block;
    float: left;
    -webkit-transform: scale(1.1, 1.3) perspective(0.5em) rotateX(2.2deg);
    transform: scale(1.1, 1.3) perspective(0.5em) rotateX(2.2deg);
    -webkit-transform-origin: bottom left;
    -ms-transform-origin: bottom left;
    transform-origin: bottom left;
    background: #7fa409;
    border-top-right-radius: 2px;
    border-top-left-radius: 2px;
    position: absolute;
    top: 0px;
    bottom: -1px;
    left: -15px;
    right: 0px;
    z-index: -1;
}
</style>
