<template style="background: #f2f2f2;">
	<div class="home" >
		<div class="Top_navigation">
  			<div class="logo_box">
				<img src="@/assets/images/logo2.png" />
			</div>
  			<div id="div" class="search_box">
  				<img src="@/assets/img/fdj.png" style="margin:0;"/>
  				<div id="sou" class="sousuo" style="display:none;"></div>
  			</div>
			<div class="Sign_box">
				<img src="@/assets/images/finance/SAAS-01.png" />
				<div @click.stop="userDropDown=!userDropDown" class="userInfo" v-if="userinfo">
				<div>{{username}}<div></div></div>
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
				<img src="@/assets/images/finance/SAAS-03.png" />
    			<p>0571-88270588</p>
  			</div>
		</div>
  		
  		
		
		<div class="decorate"></div>
		<div class="Broadcast_box" style="animation-delay:0.5s;">
			<el-carousel height="629px">
				<el-carousel-item v-for="item in carouselImgs.length" :key="item.index">
					<div class="carouselImgs">
						
						<img src="../../static/img/t1.jpg" alt="">
						<img src="../../static/img/t2.jpg" alt="">
						<img src="../../static/img/t3.jpg" alt="">
						<img src="../../static/img/t4.jpg" alt="">
					</div>
				</el-carousel-item>
			</el-carousel>
		</div>
		<div class="Central_navigation" >
  			<div @click.stop="NavTo('/home')" class="Finance"> <img src="@/assets/img/cai.png" />
    			<h1>工会财务管理</h1>
  			</div>
  			<div @click.stop="NavTo('/home')" class="data"> <img src="@/assets/img/shu.png" />
    			<h1>数据直报平台</h1>
  			</div>
		</div>
		<div id="Journalism" class="Journalism">
			<div class="biao">
  				<img src="@/assets/img/b1-1.png" style="width:100%; margin-top:12px;" />
    			<p class="g"><a href="xwgg.html">更多</a></p>
  			</div>
			<div class="Journalism_left">
  				<a href="xqy.html">
    				<div class="img_box">
						<img src="@/assets/img/img1.png"/>
					</div>
    				<div class="txt_box">
      					<h1 style="float:left;">新版企业所得税申报表启用</h1>
      					<p>	
            				陈大光于1956年出生于越南北部宁平省，拥
        					有博士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当选国会代表进
        					入越南第十三届国会。陈大光长期在越南内
            			</p>
    				</div>
    				<div class="txt_box1">
      					<p>
            				陈大光于1956年出生于越南北部宁平省，拥
        					有博士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当选国会代表进
        					入越南第十三届国会。陈大光长期和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当选国和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当士学位和教授职称。他于2006年越共十
        					大进入越共中央委员会，2011年越共十一大
        					进入越共中央政治局，同年当选国在越南内
           				</p>
    				</div>
    			</a>
  			</div>
			<div class="Journalism_right">
    			<ul>
      				<li>
      					<a href="xqy.html">
      						<i class="glyphicon glyphicon-option-horizontal k"></i>
        					<p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
        					<span class="r">2018-07-21</span>
        				</a>
      				</li>
					<li>
					  <a href="xqy.html">
						  <i class="glyphicon glyphicon-option-horizontal k"></i>
						  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
						  <span class="r">2018-07-21</span> 
					  </a>
					</li>
					<li>
					  <a href="xqy.html">
						  <i class="glyphicon glyphicon-option-horizontal k"></i>
						  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
						  <span class="r">2018-07-21</span> 
					  </a>
					</li>
					<li>
					  <a href="xqy.html">
						  <i class="glyphicon glyphicon-option-horizontal k"></i>
						  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
						  <span class="r">2018-07-21</span>
					  </a>
					</li>
					<li>
					  <a href="xqy.html">
						  <i class="glyphicon glyphicon-option-horizontal k"></i>
						  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
						  <span class="r">2018-07-21</span> 
					  </a>
					</li>
					<li>
					  <a href="xqy.html">
						  <i class="glyphicon glyphicon-option-horizontal k"></i>
						  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
						  <span class="r">2018-07-21</span>
					  </a>
					</li>
    			</ul>
  			</div>
		</div>
		<div id="Broadcast" class="Broadcast">
			<img src="@/assets/img/c1.png" class="img_box1"  />
  			<div id="div1">
			  <ul>
				<li><img src="@/assets/img/s1.png" /></li>
				<li><img src="@/assets/img/s2.png" /></li>
				<li><img src="@/assets/img/s3.png" /></li>
				<li><img src="@/assets/img/s4.png" /></li>
				<li><img src="@/assets/img/s1.png" /></li>
			  </ul>
  			</div>
		</div>
		<div id="policy" class="policy">
			<div class="b">
			  <ul style="margin-left: 260px;">
				  <li>
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p>全部</p>
				  </li>
				  <li>
					  <i class="glyphicon glyphicon-option-horizontal k" style="display:none;"></i>
					  <p>国家</p>
				  </li>
				  <li>
					  <i class="glyphicon glyphicon-option-horizontal k" style="display:none;"></i>
					  <p>省级</p>
				  </li>
				  <li>
					  <i class="glyphicon glyphicon-option-horizontal k" style="display:none;"></i>
					  <p>市级</p>
				  </li>
			  </ul>
			</div>
			<div class="policy_left" style="position:relative;">
				<div class="chuang">
					
				</div>
				<img :src="orgWindow.imgUrl" alt="">
			</div>
			<div class="policy_right">
			  <ul>
				<li>
				  <a href="xqy.html">
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
					  <span class="r">2018-07-21</span>
				  </a>
				</li>
				<li>
				  <a href="xqy.html">
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
					  <span class="r">2018-07-21</span>
				  </a>
				</li>
				<li>
				  <a href="xqy.html">
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
					  <span class="r">2018-07-21</span>
				  </a>
				</li>
				<li>
				  <a href="xqy.html">
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
					  <span class="r">2018-07-21</span>
				  </a>
				</li>
				<li>
				  <a href="xqy.html">
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
					  <span class="r">2018-07-21</span>
				  </a>
				</li>
				<li>
				  <a href="xqy.html">
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
					  <span class="r">2018-07-21</span>
				  </a>
				</li>
				<li>
				  <a href="xqy.html">
					  <i class="glyphicon glyphicon-option-horizontal k"></i>
					  <p class="txt">陈大光于1956年出生于越南北部宁平省，拥有博士学位和教授职授职授职授职授职称</p>
					  <span class="r">2018-07-21</span>
				  </a>
			   </li>
			  </ul>
			</div>
			<div class="switch">
				  <img src="@/assets/img/j1.png" style="margin-left: 402px;margin-top: 14px;" />
				  <p style="margin-left: 8px;">换一批</p>
				  <p style="margin-left: 8px;">更多</p>
			</div>
  		</div>
		<div id="bottom_box" class="bottom_box">
			<div class="bottom_box_left">
				<ul>
					<li>
						<h1 style="font-size: 24px;">联系方式</h1>
						<img src="@/assets/img/t1.png" class="t1" />
					</li>
					<li>
						<img src="@/assets/img/d1.png" />
						<p>0571-88270588</p>
					</li>
					<li>
						<img src="@/assets/img/d2.png"  />
						<p>2749634478</p>
					</li>
					<li>
						<img src="@/assets/img/d3.png"  />
						<p>0571-88290562</p>
					</li>
					<li>
						<img src="@/assets/img/d4.png"  />
						<p>www.gadta.com.cn</p>
					</li>
					<li>
						<img src="@/assets/img/d5.png"  />
						<p>www.gadta.com.cn</p>
					</li>
					<li>
						<img  src="@/assets/img/d6.png" />
						<p style="line-height: normal;margin-left: 28px;margin-top: -27px;">杭州市拱墅区祥园路88号中国
		（杭州）智慧信息产业园N座6F</p>
					</li>
				</ul>
			</div>
			<div class="bottom_box_right">
				<ul>
					<li>
						<h1 style="font-size: 24px;">在线留言</h1>
						<img src="@/assets/img/t1.png" class="t1" />
					</li>
					<li>
						<p>姓名/单位</p>
						<input type="text" class="input_box" />
					</li>
					<li>
						<p>联系方式</p>
						 <input type="text" class="input_box" style="margin-left: 14px;" />
					</li>
					<li>
						<p>需求描述</p>
						<textarea class="cha"></textarea>
					</li>
					<div class="btn1">提交</div>
				</ul>
			</div>
		</div>
		<div class="bottom_box1">
			<div style="width:1132px; height:295px; margin:auto auto 0;">
				<div style="width:566px; height:220px; float:left;">
					<div class="zi" style="margin-top:70px;">
						<h1 style="margin-left: 29px;">服务协议</h1>
						<p>|</p>
						<h1>运营范围</h1>
					</div>
					<div class="zi" style="margin-top: -2px;">
						<h1>关于新中大科技</h1>
					  <h1 style="margin-left: 25px;">关于政云数据</h1>
					</div>
				</div>
				<div style=" width:566px; height:220px; float:right;">
					<img src="@/assets/img/r1.png" class="g1" />
					<img src="@/assets/img/r2.png" class="g1" />
				</div>
				<div class="cc" >
					<p>Copyrighe@ 1993-2018NEWGRADN.AII Rights Reserved</p>
					<p>新中大科技有限公司  |  杭州政云数据技术有限公司  |  版权所有</p>
					<p>浙ICP证05021872   浙公网安备   33010502000837号</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

  import { mapState, mapActions } from 'vuex'
  import config from '@/util/ajaxConfig'
  import Auth from "@/util/auth";
  import md5 from 'js-md5'
  import desHelper from "@/util/desHelper"

  export default {
    name: "home",
    data(){
		let validPaw=(rule,value,callback)=>{
          if(value==''||value==undefined){
              callback()
          }else{
              let reg=/^([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
              if(!reg.test(value)){
                callback(new Error('不符合输入规则:6-12位'))
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
		message: 2,
		userInfoHead:{},
		carouselImgs:[   //轮播图片
			  {url:'../../static/img/t1.jpg',index:1},
			   {url:'../../static/img/t2.jpg',index:2},
				{url:'../../static/img/t3.jpg',index:3},
				 {url:'../../static/img/t4.jpg',index:4}
		  ],
		  orgWindow:{
			  imgUrl:'../../static/img/n1.png'
		  }
      }
    },
    computed:{
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
    mounted(){
		console.log(this.carouselImgs)
    },
    methods:{
		//跳转工会****
		NavTo(str){
			this.$router.push({path:str});
		}

      
    }
  }
  

</script>

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
	background: url(../assets/img/q6.png);
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
    background: url(../assets/img/g1.png);
    z-index:10;
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
.Broadcast_box {
	position: absolute;
	top: 70px;
	width: 1200px;
	height: 629px;
	left: 50%;
	margin-left: -600px;
	background:url(../assets/img/q1.png);
	animation: flipInX 1s ease;
	animation-fill-mode: backwards;
}
.policy_left {
	width: 545px;
	height: 400px;
	float: right;
}
.bottom_box1 {
	background: #282828;
	width: 100%;
	margin: 15px auto 0;
	height: 300px;
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
.Journalism {
	width: 1132px;
	height: 335px;
	background: url(../assets/img/q6.png);
	margin: 50px auto 0;
	background-size: 100% 100%;
	padding-left: 16px;
	padding-right: 13px;
	padding-top: 19px;
	padding-bottom:10px;
}
.Central_navigation {
	width: 1130px;
	height: 160px;
	margin: auto auto 0;
	margin-top: 117px;
}
.Finance {
	float: left;
	width: 550px;
	height: 192px;
	background: url(../assets/img/q6.png);
	background-size: 100% 100%;
	cursor:pointer;
}
.data * {
	float: left;
	cursor:pointer;
}
.data img {
	width: 20%;
    margin-top: 53px;
    margin-left: 77px;
}
.data h1 {
	line-height: 192px;
	margin-left: 20px;
	font-weight: 400;
	font-size: 40px;
	color: #7fa409;
}
.Finance * {
	float: left;
}
.Finance img {
	width: 20%;
    margin-top: 53px;
    margin-left: 77px;
}
.Finance:hover img{
	animation: a1 .5s;
	animation-fill-mode:forwards;
}

.Finance:hover h1{
	animation: a2 .5s;
	animation-fill-mode:forwards;
}
.Finance h1 {
	line-height: 192px;
	margin-left: 20px;
	font-weight: 400;
	font-size: 40px;
	color: #7fa409;
	transition:opacity .2s;
}
.data {
	float: right;
	width: 550px;
	height: 192px;
	background: url(../assets/img/q6.png);
	background-size: 100% 100%;
}
.data:hover img{
	animation: a1 .5s;
	animation-fill-mode:forwards;
}

.data:hover h1{
	animation: a2 .5s;
	animation-fill-mode:forwards;
}
@keyframes a1{
	0%{
		margin-left: 77px;
	}
	100%{
		margin-left: 223px;
	}
}

@keyframes a2{
	0%{
		margin-left: 20px;
		opacity:1;
	}
	100%{
		margin-left: -170px;
		opacity:0;
	}
}
@keyframes a {
 0%{
	 margin-left:-2000px;
	}
 100%{
	 margin-left:0px;
	//  background:
	}
}
@keyframes flipInX {
 0% {
	 -webkit-transform: perspective(400px) rotateX(90deg);
 	transform: perspective(400px) rotateX(90deg);
 	opacity: 0;
	}
 40%{
	 -webkit-transform: perspective(400px) rotateX(-10deg);
 	transform: perspective(400px) rotateX(-10deg);
	}
 70%{
	 -webkit-transform: perspective(400px) rotateX(10deg);
	transform: perspective(400px) rotateX(10deg);
	}
 100%{
	 -webkit-transform: perspective(400px) rotateX(0deg);
	transform: perspective(400px) rotateX(0deg);
	opacity: 1;
	}
}
.Journalism_left {
	width: 545px;
	height: 266px;
	float: left;
}
.Journalism_right {
	width: 545px;
	height: 266px;
	float: right;
}
.img_box {
	width: 270px;
	height: 175px;
	float: left;
}
.img_box img {
	width: 100%;
	height: 100%;
}
.txt_box {
	float: right;
	width: 266px;
	height: 175px;
	overflow: hidden;
}
.Broadcast {
	width: 1132px;
	margin: 15px auto 0;
	background: url(../assets/img/q6.png);
	height: 200px;
	background-size: 100% 100%;
}
.txt_box h1 {
	float: left;
	font-size: 20px;
	display: block;
	max-height: 45px;
	overflow: hidden;
	color: #3ea0af;
}
.txt_box p {
	float:left;
	font-size:13px;
	margin-top:2px;
	color: #a0a0a0;
	height:150px;
	line-height:25px;
}
.txt_box1 {
	width:545px;
	float:left;
	height:79px;
	overflow:hidden;
}
.txt_box1 p {
	float:left;
	font-size:13px;
	color:#a0a0a0;
	height:78px;
	line-height:25px;
}
.Journalism_right ul {
	width:100%;
	height:100%;
	overflow:hidden;
}
.Journalism_right ul li {
	width:545px;
	height:40px;
	margin-top:3px;
	float:left;
	color:#505050;
}
.k {
	width:9px;
	overflow:hidden;
	font-size:25px;
	line-height:40px;
	float:left;
}
.txt {
	width:430px;
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
	float:left;
	margin-left:8px;
	line-height:40px;
	padding-left:6px;
	transition:box-shadow 0.4s;
	color: #737373;
}
.r {
	float: right;
	line-height:40px;
}
.Journalism_right ul li:hover p {
	color: #3ea0af;
	box-shadow: 0px 3px 10px #888888;
}
.biao {
	width:1103px;
	height:50px;
	float:left;
	position:relative;
}
.g {
	position: absolute;
	right:0;
	top:15px;
	font-size:15px;
	color:#2196f3;
}
.img_box1 {
	float:left;
	height:90%;
	margin-top:9px;
	margin-left:7px;
}
#div1 {
	float:left;
	width:950px;
	height:130px;
	position:relative;
	border:#d6d6d6 1px solid;
	top: 39px;
	overflow: hidden;
	left:45px;
}
#div1 ul {
	position: absolute;
	left:0;
	top:0;
}
#div1 ul li {
	width:178px;
	height:128px;
	float:left;
	list-style:none;
	margin-left:26px;
}
#div1 ul li img {
	width:100%;
	height:87%;
	margin-top:8px;
}
.y {
	position:absolute;
	top:3px;
	/* display: none; */
	left:11px;
	z-index:1;
	width:98.2%;
	height:88%;
	z-index:1;
}
.policy_right {
	width: 545px;
	height: 315px;
	float: left;
}
.policy_right ul {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.policy_right ul li {
	width: 545px;
	height: 40px;
	margin-top: 3px;
	float: left;
	color: #505050;
}
.policy_right ul li:hover p {
	color: #3ea0af;
	box-shadow: 0px 3px 10px #888888;
}
.b {
	width:545px;
	height:33px;
	float:left;
	background: url(../assets/img/b2.png);
}
.niu{
    width:100% !important;
    height:35px !important;
    position:absolute !important;
    right:0 !important;
    bottom:0px !important;
    left:0 !important;
    z-index:10 !important;
    padding-top:0 !important;
    padding-bottom:0 !important;
    color:#fff !important;
    text-align:center !important;
    text-shadow:0 1px 2px rgba(0,0,0,.6) !important;
	line-height:35px;
	font-size:14px !important;
	background:rgba(0,0,0,0.5);
}
.chuang{
	position:absolute;
    right:-9px;
    top:-9px;
    width:136px;
    height:118px;
    background: url(../assets/img/g1.png);
    z-index:10;
}
.yindao{
	width:100%;
	height:100%;
	position:fixed;
	top:0;
	left:0;
	z-index:100;
	background: #fff;
}
.b ul li{
	float:left;
	width:70px;
	height:33px;
	line-height:35px;
	color:#fff;
}
.switch{
	width:545px;
	height:52px;
	float:left;
}
.switch *{
	float:left;
	margin-top:11px;
	color:#2196f3;
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
.t1{
	margin-top:35px !important;
    margin-left:-95px !important;
    width:30% !important;
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
	background: #fff;
}
.cha{
	margin-left:15px;
    border: none;
    width: 200px;
    margin-top:6px;
	outline:none;
	color: #505050;
	line-height:none!important;
	background: #fff;
	height: 80px;
}
.btn1{
	width:100px;
    height:31px;
    background:#8ba42f;
    border-radius:5px;
    color:#fff;
    font-size:12px;
    text-align:center;
    line-height:30px;
    margin: 221px 242px 0;
}
.zi{
	width:330px;
    height:50px;
    float: left;
    margin-left:104px;
    margin-top:30px;
}
.zi h1{
	font-size:20px;
    float: left;
    line-height:50px;
	color:#fff;
}
.zi p{
	font-size:20px;
    float: left;
    margin-left:30px;
    margin-right:30px;
    line-height:50px;
	color:#fff;
}
.g1{
	float:left;
    width:25%;
    margin-top:55px;
    margin-left:80px;
}
.cc{
	width:100%;
    position:relative;
    height: 77px;
    overflow:hidden;
}
.cc p{
	text-align:center;
	color:#fff;
	margin-top:3px;
}
/* 轮播图 */
.carouselImgs{
	width:100%;
	height:100%;
}
.carouselImgs>img{
	width:100%;
	height:100%;
}
.policy_left>img{
	width:100%;
	height:100%;
}
.userInfo{
	width:75%;
	text-align: center;
	position:relative;
	height:100%;
}
.userInfo>div{
	height:100%;
	line-height: 100%;
}
.userInfo>ul{
	position:absolute;
	top:100%;
	left:0;
	background:#fff;
	z-index:9;
}
.userInfo>div,
.userInfo>ul>li,
.userInfo>ul>li>div{
	text-align: center;
	width:100%;
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


</style>
