<template>
  <div class="home">
    <header>
      <div class="loginContainer flexPublic">
        <img src="../assets/images/logo2.png" alt="">
        <div class="login">
          <div><img src="@/assets/img/d1.png" alt=""><span> &nbsp;0571-88270588</span></div>
          <div >
            <img src="@/assets/img/ren.png" alt=""> 
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
            <router-link v-if="!userinfo" to="/login">登录</router-link><router-link v-if="!userinfo" to="/register">注册</router-link>
          </div>
          <div><img src="@/assets/img/fdj.png" alt=""></div>
        </div>
      </div>
      <div class="carrouselContainer">
        <el-carousel height="560px">
          <!-- <el-carousel-item v-for="img in imgList" :key="img">
            <img :src="img">
          </el-carousel-item> -->
          <el-carousel-item>
            <img src="@/assets/img/t1.jpg">
          </el-carousel-item>
          <el-carousel-item>
            <img src="@/assets/img/t2.jpg">
          </el-carousel-item>
          <el-carousel-item>
            <img src="@/assets/img/t3.jpg">
          </el-carousel-item>
          <el-carousel-item>
            <img src="@/assets/img/t4.jpg">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="headerBGindex"></div>
    </header>
    <nav>
      <div @mouseleave.stop="navLeave" @mouseenter.stop="navEnter('finance')"><router-link to="/home"><img :class="{moveShow:nav=='finance'}" src="@/assets/img/cai.png" alt=""><span :class="{moveHide:nav=='finance'}">工会财务管理</span></router-link></div>
      <div @mouseleave.stop="navLeave" @mouseenter.stop="navEnter('info')"><a href=""><img :class="{moveShow:nav=='info'}" src="@/assets/img/shu.png" alt=""><span :class="{moveHide:nav=='info'}">数据直报平台</span></a></div>
    </nav>
    <section>
      <div class="proInfoContainer">
        <div class="proInfoTitle">
          <span>更多</span>
        </div>
        <div class="flexPublic proInfoContent" >
          <div  style="position:relative;top:-10px">
            <div class="flexPublic">
              <img style="width:40%" src="@/assets/img/img1.jpg" alt="">
              <div style="width:60%">
                <h4>新版企业所得税</h4>
                <p>为进一步落实企业所得税优惠政策，统一规范企业所得税优惠事项的办理，根据《国家税务总局关于发布修订后的&lt;企业所得税优惠政策事项办理办法&gt;的公告》（国家税务总局公告2018年第23号，以下简称23号公告）的规定，结合我省实际，现就企业所得税优惠事项办理有关问题公告如下：</p>
              </div>
            </div>
            <p>一、凡享受企业所得税优惠政策的企业，均应按照23号公告执行。
　　            二、享受集成电路生产企业、集成电路设计企业、软件企业、国家规划布局内的重点软件企业和集成电路设计企业等优惠事项的企业，应当在完成年度汇算清缴后，按照《企业所得税优惠事项管理目录》（2017年版）“后续管理要求”项目中列示的清单，通过省经信委的浙江省软件和信息服务业公共服务平台（网址：www.zjiip.org.cn）上传相关资料。相关资料不再单独报送税务机关。
　　            三、本公告适用于2017年度汇算清缴及以后年度企业所得税优惠事项办理工作。《浙江省国家税务局 浙江省地方税务局关于企业所得税优惠事项办理问题的公告》（浙江省国家税务局 浙江省地方税务局公告2015年第10号）以及《浙江省国家税务局关于加强企业所得税优惠备案管理工作的通知》（浙国税发〔2017〕60号）同时废止。</p>
          </div>
          <ul>
            <li v-for="(item,index) of proInfoList" :key="index" @click.stop="openUrl(item)">
              <span>{{item.info}}</span>
              <span>{{item.date}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="proIdeas">
        <img src="@/assets/img/c1.png" alt="">
        <div class="proBannerCon">
            <ul>
                <li><a href="#"><img src="@/assets/images/s1.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s2.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s3.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s4.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s1.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s2.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s3.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s4.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/images/s1.png" alt=""></a></li>
            </ul>
        </div>
      </div>
      <div class="rolesContainer">
        <div class="roles">
          <div>
            <ul>
              <li :class="active==='all'? 'roleActive' : ''"  @click.stop="typeclick('all')"><a href="javascript:void(0);">全部</a></li>
              <li :class="active==='country'? 'roleActive' : ''" @click.stop="typeclick('country')"><a href="javascript:void(0);">国家</a></li>
              <li :class="active==='province'? 'roleActive' : ''" @click.stop="typeclick('province')"><a href="javascript:void(0);">省级</a></li>
              <li :class="active==='city'? 'roleActive' : ''" @click.stop="typeclick('city')"><a href="javascript:void(0);">市级</a></li>
            </ul>
          </div>
          <ul>
            <li v-for="(item,index ) of newsInfo" :key="index" @click.stop="openUrl(item)">
              <span>{{item.info}}</span>
              <span>{{item.date}}</span>
            </li>
          </ul>
          <p class="flexPublic"><img src="@/assets/img/j1.png" alt=""><span>换一批</span><span>更多</span></p>
        </div>
        <div class="unionHome">
          <i></i>
          <el-carousel indicator-position="none" height="400px" arrow="never">
            <el-carousel-item>
                <a href="#"><img src="@/assets/img/n1.png" alt=""></a>
            </el-carousel-item>
            <el-carousel-item >
                <a href="#"><img src="@/assets/img/n2.jpg" alt=""></a>
            </el-carousel-item>
            <el-carousel-item >
                <a href="#"><img src="@/assets/img/n3.jpg" alt=""></a>
            </el-carousel-item>
            <el-carousel-item>
                <a href="#"><img src="@/assets/img/n4.jpg" alt=""></a>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="ourInfo">
        <div>
          <ul>
            <li>
              <h1 style="font-size: 24px;">联系方式</h1>
              <img src="@/assets/img/t1.png" class="t1" />
            </li>
            <li>
                <img src="@/assets/img/d1.png" />
                <p>联系电话：</p>
                <p>0571-88270588</p>
            </li>
            <li>
              <img src="@/assets/img/d2.png"  />
                <p>客服QQ：</p>
              <p>2749634478</p>
            </li>
            <li>
              <img src="@/assets/img/d3.png"  />
                <p>公司传真：</p>
              <p>0571-88290562</p>
            </li>
            <li>
              <img src="@/assets/img/d4.png"  />
                <p>联系邮箱：</p>
              <p>wanggang@newgrand.cn</p>
            </li>
            <li>
              <img src="@/assets/img/d5.png"  />
                <p>公司网址：</p>
              <p>www.gdataware.com</p>
            </li>
            <li>
              <img  src="@/assets/img/d6.png" />
              <span>公司地址：</span>
              <p style="white-space: pre-wrap"><span>杭州市拱墅区祥园路88号中国（杭州）智慧信息产业园N座9F</span></p>
              
            </li>
          </ul>
        </div>
        <div>
          <ul class="onlineMsg">
            <li>
              <h1 style="font-size: 24px;">在线留言</h1>
              <img src="@/assets/img/t1.png" class="t1" />
            </li>
            <li>
              <p>姓名/单位</p>
              <div class="inputContainer" style="width: 200px;"><input type="text" class="input_box" /></div>
            </li>
            <li>
              <p>联系方式</p>
              <div class="inputContainer" style="width: 200px;"><input type="text" class="input_box" /></div>
            </li>
            <li>
              <p>需求描述</p>
              <div class="inputContainer" style="width: 200px;"><textarea style="width: 200px;"  cols="30" rows="4"></textarea></div>
            </li>
            <li class="onlineBtn" >提交</li>
          </ul>
        </div>
      </div>
    </section>
    <footer>
      <div class="aboutContainer">
        <div class="words">
          <div >
            <h1 >服务协议</h1>
            <p>|</p>
            <h1>运营范围</h1>
          </div>
          <div >
            <h1>关于新中大科技</h1>

            <h1>关于政云数据</h1>
          </div>

            <div class="footInfo">
                <p>Copyright  @ 1993-2018NEWGRAND.All Rights Reserved</p>
                <p>新中大科技股份有限公司     杭州政云数据技术有限公司    版权所有</p>
                <p>浙ICP证05021872    浙公网安备    33010502000837号</p>
            </div>
        </div>
        <div class="pictrue">
            <div>
                <img src="@/assets/img/r1.png" class="g1" />
                <div>新中大</div>
            </div>
            <div>
                <img src="@/assets/img/r2.jpg" class="g1" />
                <div>政云</div>

            </div>

        </div>
      </div>
    </footer>
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

  export default {
    name: "home",
    data(){
      return {
        userDropDown:false,
        //修改密码弹窗***********
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
      userInfoHead:{},

        //页面数据
        nav:'',
        active:'all',
        proInfoList:[ 
          {info:'余杭区总工会调研崇贤工会工作',date:'2018-12-25',url:'http://www.hzgh.org/newsview60670.htm'},
          {info:'崇贤街道人大工委联合街道总工会开展执法检查',date:'2018-11-27',url:'http://www.yhrd.gov.cn/detail.aspx?artid=8131&classid=293'},
          {info:'崇贤街道总工会召开村(社区)联合工会工资集体协商交流会',date:'2018-03-20',url:'http://www.hzgh.org/newsview51442.htm'},
          {info:'崇贤街道总工会召开职工医疗互助保障工作动员大会',date:'2017-11-21',url:'http://www.hzgh.org/newsview47266.htm'},
          {info:'余杭工会信息-杭州余杭区总工会',date:'2017-09-07',url:'http://www.docin.com/p-2099512458.html '},
          {info:'浙江杭州市余杭区总工会网上服务大厅正式开通上线”',date:'2017-09-21',url:'http://acftu.workercn.cn/28961/201709/21/170921220648933.shtml'},
          {info:'崇贤街道总工会“十佳好职工”结果出炉，会是你支持的那个人吗',date:'2016-10-19',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-21/29167357212420899.html'},
        ],
        newsInfo:[
          {info:'李玉赋在全国总工会机关传达学习中央经济工作会议精神会议上强调认真学习贯彻中央经济工作会议精神 团结动员广大职工为保持经济持续健康发展和社会大局稳定作出新贡献',date:'2018-12-25',url:'http://www.acftu.org/template/10041/file.jsp?cid=222&aid=97580'},
          {info:'全国总工会党组召开会议传达学习习近平总书记在庆祝改革开放40周年大会上重要讲话精神',date:'2018-12-21',url:'http://www.acftu.org/template/10041/file.jsp?cid=222&aid=97563'},
          {info:'全国工会劳动和技能竞赛工作理论研讨现场会在山东潍坊召开',date:'2018-11-13',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97323'},
          {info:'全总召开全国工会社会组织工作研讨会',date:'2018-10-17',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97132'},
          {info:'全国总工会权益保障部 中国劳动和社会保障科学研究院战略合作框架协议签约仪式在京举行 ',date:'2018-10-17',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97131'},
          {info:'全总女职工部赴云南省调研指导工会女职工工作',date:'2018-08-23',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=96879'},
          {info:'《全国工会干部培训基础教材》（2018版）出版',date:'2018-08-30',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=96918'},
        ],
        imgList:[]
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
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t1.jpg')
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t2.jpg')
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t3.jpg')
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t4.jpg')
    },
    methods:{
      ...mapActions({
        sysLogout: "user/logout"
      }),
      navEnter(val){
        this.nav=val;
      },
      navLeave(){
        this.nav='';
      },
      //打开网址
      openUrl(object){
        window.open(object.url);
      },
      typeclick(object){
        //alert(object);
        this.active=object;

        let countryInfo=[
          {info:'李玉赋在全国总工会机关传达学习中央经济工作会议精神会议上强调认真学习贯彻中央经济工作会议精神 团结动员广大职工为保持经济持续健康发展和社会大局稳定作出新贡献',date:'2018-12-25',url:'http://www.acftu.org/template/10041/file.jsp?cid=222&aid=97580'},
          {info:'全国总工会党组召开会议传达学习习近平总书记在庆祝改革开放40周年大会上重要讲话精神',date:'2018-12-21',url:'http://www.acftu.org/template/10041/file.jsp?cid=222&aid=97563'},
          {info:'全国工会劳动和技能竞赛工作理论研讨现场会在山东潍坊召开',date:'2018-11-13',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97323'},
          {info:'全总召开全国工会社会组织工作研讨会',date:'2018-10-17',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97132'},
          {info:'全国总工会权益保障部 中国劳动和社会保障科学研究院战略合作框架协议签约仪式在京举行 ',date:'2018-10-17',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97131'},
          {info:'全总女职工部赴云南省调研指导工会女职工工作',date:'2018-08-23',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=96879'},
          {info:'《全国工会干部培训基础教材》（2018版）出版',date:'2018-08-30',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=96918'},
        ];

        let provinceInfo=[
          {info:'关于评选推荐全国模范职工之家、全国模范职工小家、全国优秀工会工作者和全国优秀工会积极分子、全国优秀工会之友的通知 ',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-05-08/9581253785651033.html'},
          {info:'关于印发《浙江省总工会2018年工作要点》的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-02-26/3422131293878883.html'},
          {info:'浙江省总工会关于印发《加强和规范基层工会经费收支管理的实施细则》的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-02-08/1877044506553794.html'},
          {info:'中华全国总工会办公厅关于印发《基层工会经费收支管理办法》的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-02-08/1877049644557550.html'},
          {info:'浙江省财政厅 浙江省总工会关于提前下达2018年度职工帮扶专项资金的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2017-12-05/13752942087233041.html'},
          {info:'关于印发《浙江省总工会本级基本建设项目管理办法（试行）》的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-03-07/4200524602960515.html'},
          {info:'关于下拨“尊法守法·携手筑梦”服务农民工法治宣传行动专项补助资金的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-03-07/4200612334907516.html'},
        ];

        let cityInfo=[
          {info:'机关工会工作暂行条例',date:'2018-05-02',url:'http://www.hzgh.org/newsview33982.htm'},
          {info:'浙江省总工会关于加强和规范基层工会经费收支管理的实施细则',date:'2018-05-02',url:'http://www.hzgh.org/newsview33654.htm'},
          {info:'关于印发《杭州市总工会内部审计工作办法》的通知 ',date:'2018-05-02',url:'http://www.hzgh.org/newsview33916.htm'},
          {info:'中华全国总工会办公厅关于加强基层工会经费收支管理的通知',date:'2018-05-02',url:'http://www.hzgh.org/newsview32021.htm'},
          {info:'杭州市人民政府办公厅关于贯彻落实《工会法》支持工会工作的通知',date:'2018-05-02',url:'http://www.hzgh.org/newsview10855.htm'},
          {info:'中共杭州市委关于加强和改善党对新时期工会、共青团、妇联工作领导的意见 ',date:'2018-05-02',url:'http://www.hzgh.org/newsview10854.htm'},
          {info:'国务院办公厅关于深入贯彻工会法支持工会工作的通知',date:'2018-05-02',url:'http://www.hzgh.org/newsview10849.htm'},
          {info:'国务院印发《关于做好当前和今后一个时期促进就业工作的若干意见》',date:'2018-05-02',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=97478'},
        ];

        let allInfo=[
          {info:'全国工会劳动和技能竞赛工作理论研讨现场会在山东潍坊召开',date:'2018-11-13',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97323'},
          {info:'全总召开全国工会社会组织工作研讨会',date:'2018-10-17',url:'http://www.acftu.org/template/10041/file.jsp?cid=721&aid=97132'},
          {info:'关于印发《浙江省总工会2018年工作要点》的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-02-26/3422131293878883.html'},
          {info:'浙江省总工会关于印发《加强和规范基层工会经费收支管理的实施细则》的通知',date:'2018-05-02',url:'http://www.zjftu.org/page/zj_zgh/zj_xxgk/zj_xxgk_zcwj/2018-02-08/1877044506553794.html'},
          {info:'中华全国总工会办公厅关于加强基层工会经费收支管理的通知',date:'2018-05-02',url:'http://www.hzgh.org/newsview32021.htm'},
          {info:'杭州市人民政府办公厅关于贯彻落实《工会法》支持工会工作的通知',date:'2018-05-02',url:'http://www.hzgh.org/newsview10855.htm'},
          {info:'中共杭州市委关于加强和改善党对新时期工会、共青团、妇联工作领导的意见 ',date:'2018-05-02',url:'http://www.hzgh.org/newsview10854.htm'},
        ]

        if(object==='country') {
          this.newsInfo=countryInfo;
        }else if(object==='province'){
          this.newsInfo=provinceInfo;
        }else if(object==='city'){
          this.newsInfo=cityInfo;
        }else if(object==='all'){
          this.newsInfo=allInfo;
        }

      },
      logoutClick() {
          //退出事件
        this.sysLogout().then(() => {
          this.$router.push("/login");
        });
      },
      //修改密码
      editPawClick(){
        this.dialog.editPaw.show=true
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
      }
    }
  }
</script>

<style lang="scss" scoped>
    .home{
        overflow-y: auto;
        height:100%;
    }
  header{
    padding:0 70px;
    position:relative;
    .headerBGindex{
      position:absolute;
      z-index: 0;
      height:499px;
      width:100%;
      left:0;
      top:105px;
      background: #0183fd;
      animation: headPG 1s linear;
      animation-delay: 0.5s;
    }
  }
  @keyframes headPG {
      0% {width:0%}
      100% {width:100%}
  }
  @keyframes head-z {
        0% {
            /* -webkit-transform: perspective(400px) rotateX(90deg); */
            /* transform: perspective(400px) rotateX(90deg); */
             opacity: 0;
        }

        40% {
            -webkit-transform: perspective(400px) rotateX(-10deg);
            transform: perspective(400px) rotateX(-10deg);
        }
        70% {
            -webkit-transform: perspective(400px) rotateX(10deg);
            transform: perspective(400px) rotateX(10deg);
        }
        100% {
            -webkit-transform: perspective(400px) rotateX(0deg);
            transform: perspective(400px) rotateX(0deg);
            opacity: 1;
        }
    }
  @keyframes proBanner {
      0% {margin-left:0}
      100% {margin-left:-780px}
  }
  .loginContainer{
  margin:0 auto;
  width:1200px;
  height:70px;
  line-height: 70px;
  >img{
    height:50px;
    margin-top: 10px;
  }
  .login{
    float:right;

    color:#7fa409;
    // ********弹性布局***************************
    >div,>span,>img{
      float:left;
    }
    >div{
      margin-left: 10px;

      height:70px;
      line-height: 70px;
      >img{
        margin-top:10px;
      }
      &:first-of-type{
        width:200px;
        font-size: 18px;
        >img{
          margin-top:20px;
        }
      }
      &:nth-of-type(2){
        width:140px;
        >a{
          padding:0 8px;
            color:#7fa409;
          &:first-of-type{
            border-right:1px solid #7fa409;
          }
        }
      }
      &:nth-of-type(3){
        width:70px;
        >img{
          margin-top:0;
        }
      }
    }
  }
}
  .carrouselContainer{
    position: relative;
    width:1200px;
    height:626px;
    margin:0 auto;
    z-index:1;
    margin-top: 5px;
    background: url("../assets/img/q1.png");
      animation: head-z 1s ease;
      animation-delay: 0.5s;
      animation-fill-mode: backwards;
    .carrouselTitle{
      position: absolute;
      top:0;
      width:100%;
      height:85px;
      z-index: 10;
      background: rgba(0,0,0,0.5);
      color: #FFF;
      font-size: 50px;
      text-align: center;
      line-height: 85px;
    }
    .el-carousel__item img {
      opacity: 0.75;
      width:100%;
      height:100%;
      margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
  }
  nav{
    padding:0 70px;
    position:relative;
    margin:0 auto;
    width:1200px;
    height:160px;
    line-height: 160px;
    // ********弹性布局***************************
    >div,>span,>img{
      float:left;
    }
    >div{
      width:50%;
      height:160px;
      // ********弹性布局***************************
      >div,>span,>img{
        float:left;
      }
        >a{
            text-align: center;
            transition: all .3s;
            >img{
              margin-top:35px;
              transition: all .5s;
              &.moveShow{
                transform: translateX(200%);
                transform: translateX(0)\9\0;
                transition: all .5s;
              }
            }
            >span{
                margin-left: 20px;
                font-weight: 400;
                font-size: 40px;
                color: #7fa409;
                transition: all .3s;
                &.moveHide{
                    opacity: 0;
                    opacity: 1\9\0;
                    margin: -170px;
                    margin: 0\9\0;
                }
            }
        }

    }
  }
  section{
    position:relative;
    width:1200px;
    margin: 0 auto;
    padding:0 0 0 0px;
    .proInfoContainer{
        width: 1132px;
        height: 335px;
        background: url(../assets/img/q6.png);
        margin: 50px auto 0;
        background-size: 100%;
        padding-left: 16px;
        padding-right: 13px;
        padding-top: 19px;
        padding-bottom: 10px;
      .proInfoTitle{
        height:40px;
        margin-top: 10px;
        color:#2196f3;
        text-align: right;
        background: url("../assets/img/b1-1.png") no-repeat;
      }
      .proInfoContent{
        >div{
          overflow: hidden;
          width:49%;
          font-size: 13px;
          color:#a0a0a0;
          >div{
            overflow: hidden;
            height:185px;
            >img{
              
            }
            >div{
              >p{
                height:150px;
                overflow: hidden;
                text-align: left;
                line-height: 25px;
                margin: 0 5px;
              }
            }

          }
          >p{
            height:80px;
            overflow: hidden;
            text-align: left;
            line-height: 25px;
          }
          h4{
           color: #3ea0af;
            font-size: 20px;
            height:25px;
            padding-top:3px;
            margin: 10px 0px 3px 10px;
          }
        }
        >ul{
          overflow: hidden;
          width:49%;
          font-size: 14px;
          margin-left:10px;
          >li{
            height:40px;
            
            padding:0 5px;
            position:relative;
              cursor:pointer;
            &:after{
              position: absolute;
              content:"";
              left:0;
              top:17px;
              width:6px;
              height:6px;
              background: #333;
              border-radius: 50%;
            }
            span:first-of-type{
              width:450px;
              line-height: 40px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              float: left;
                padding:0 5px;
            }
            span:nth-of-type(2){
              width:72px;
               line-height: 40px;
              float:right;
            }
              &:hover>span:first-of-type{
                  box-shadow: 0 3px 8px #888;
                  color:#3ea0af;
                  border-radius: 3px;

              }
          }
        }
      }
    }
    .proIdeas{
      height:200px;
      width:100%;
      margin-top:30px;
      // ********弹性布局***************************
      >div,>span,>img{
        float:left;
      }
      background: url(../assets/img/q6.png) -10px -8px;
      >div{
        width:950px;
        height:130px;
        margin-left:50px;
        border:1px solid #CCC;
      }
    }
    .proBannerCon{
          overflow: hidden;
          >ul{
              width:1800px;
              height:100%;
              // ********弹性布局***************************
              >li{
                float:left;
              }
             // margin-left:-780px;
               animation:proBanner 10s linear infinite;
              >li{
                  margin-right: 30px;
                  margin-top: 10px;
                  height:110px;
                  >a{
                      display: block;
                      width:165px;
                      height:100%;
                      img{
                          width:100%;
                          height:100%;
                      }
                  }
              }
          }
      }
    .rolesContainer{
      width:100%;
      height:443px;
      margin-top:20px;
      border:1px solid #dde;
      border-radius: 3px;
      padding:8px;
      // ********弹性布局***************************
      >div,>span,>img{
        float:left;
      }
      >div{
        width:49%;
      }
      .roles{
        padding-left:5px;
        >div{
          background: url(../assets/img/b2.png) ;
          height:33px;
          line-height: 33px;
          ul{
            color:#fff;
            li{
              margin-right:40px;
              font-size: 13px;
              position:relative;
              
              float:right;
              >a{
                color:#fff;
              }
              &.roleActive{
                  color: #fff;
                  >a:after{
                    position:absolute;
                    content:"";
                    width:6px;
                    height:6px;
                    top:13px;
                    left:-8px;
                    background: #fff;
                    border-radius: 50%;
                  }
              }
            }
          }
        }
        >ul{
          width:100%;

          font-size: 14px;
          margin-left:10px;
          >li{
            height:40px;
            width:98%;
           
            padding:0 8px 0 3px;
            position:relative;
              cursor:pointer;
            &:after{
              position: absolute;
              content:"";
              left:-6px;
              top:17px;
              width:6px;
              height:6px;
              background: #333;
              border-radius: 50%;
              clear: both;
            }
            span:first-of-type{
              width:450px;
               line-height: 40px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              float: left;
                padding:0 3px;
            }
            &:hover>span:first-of-type{
              box-shadow: 0 3px 8px #888;
              color:#3ea0af;
              border-radius: 3px;

            }
            span:nth-of-type(2){
               line-height: 40px;
              width:73px;
              float:right;
            }
          }
        }
        >p{
          float: right;
          color:#2196f3;
          width:130px;
          margin:30px 20px 0 0 ;
          >span{
            position:relative;
            padding:0 5px
          }
        }
      }
      .unionHome{
        height:400px;
        position:relative;
        float:right;
        >i{
          content:"";
          position:absolute;
          right:-9px;
          top:-9px;
          width:136px;
          height:118px;
          background: url("../assets/img/g1.png");
          z-index: 99;
        }
        .el-carousel__item img {
          width:100%;
          height:100%;
          opacity: 0.75;

        }
        .el-carousel__item:nth-child(2n) {
          background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n+1) {
          background-color: #d3dce6;
        }
      }
    }
    .ourInfo{
      width:100%;
      height:360px;
      background: #282828;
      padding:19px 7px 10px 10px;

      >div{
        width:50%;
        padding:5px;
        float:left;
        >ul{
          margin:0 auto;

          li{
            width:300px;
            height:40px;
            color:#fff;
            margin-left: 145px;
            padding:10px 0 0 0 ;
            white-space: nowrap;
            >img{
              width:7%;
              margin:0 9px 0 0;
              float:left;
            }
            >p{
              margin:0;
              text-align: left;
              color:#fff;
              float:left;
              &:nth-of-type(2){
                padding:2px;
              }
            }
            &:first-of-type{
              margin-bottom: 10px;
              >img{
                width:32%;
                margin-top:5px;
              }
            }
            &:last-of-type{
              width:400px;
              >img{    
                margin:0;
                width:21px;
              }
              >span{
                width:18%;
                margin-left: 9px;
                float:left;
              }
              >p{
                width:60%;
                
              }
            }
          }
        }
        .onlineMsg{
          >li{
            p{
              width:80px;
            }
            div{
              width:150px;
              color:#333;
              input{
                height:30px;
                  background: #fff;
              }
                textarea{
                    background: #fff;
                }
            }
          }
          li.onlineBtn{
            width: 100px;
            height: 31px;
            line-height:31px;
            padding:0;
            background: #8ba42f;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            text-align: center;
            margin-top:70px;
            margin-left:250px;
              cursor:pointer;
          }
        }
      }
    }
  }
  footer{
    padding:0 70px;
    background: #000;
    height:300px;
    margin-top:15px;
    >div{
      width:1200px;
      margin:0 auto;
      padding:50px 0 10px;
      &.aboutContainer>div{
        width:50%;
        float:left;
        &.words>div{
            margin:0 auto 20px;
            text-align: center;
            >p,>h1{
                display: inline-block;
                color:#fff;
                margin-right:20px;
                font-size: 20px;
            }
        }
          &.words>.footInfo{

          color:#fff;
          >p{
              font-size: 13px;
              line-height: 25px;
          }
      }
        &.pictrue{

            >div{
                width:180px;
                height:180px;
                margin-left: 80px;
                float:left;
                >img{
                    width:180px;
                    height:180px;
                }
                >div{    
                    color: white;
                    text-align: center;
                    margin-top: 5px;
                    font-size: 17px;
                    font-weight: 900;

                }
            }

        }
      }

    }
  }
  .userInfo{
    display: inline-block;
    position:relative;
    color:#333;
    >div{
      padding:0 20px 10px;
      position:relative;
      cursor:pointer;
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
      bottom:-110px;
      right:0;
      z-index: 99;
      background: #fff;
      transition:all 0.3s linear;
      opacity:0;
      >li{
        height:45px;
        line-height:45px;
        text-align:center;
        cursor:pointer;
        padding:0 5px;
        &:hover{
          background:#e6f8fd;
          color:#33c6f1;
        }
      }
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
  }
</style>
