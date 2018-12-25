<template>
  <div class="home">
    <header>
      <div class="loginContainer flexPublic">
        <img src="../assets/images/logo2.png" alt="">
        <div class="login">
          <div><img src="@/assets/img/ren.png" alt=""><span> &nbsp;0571-88270588</span></div>
          <div><img src="@/assets/img/d1.png" alt=""><router-link to="/login">登录</router-link><router-link to="/register">注册</router-link></div>
          <div><img src="@/assets/img/fdj.png" alt=""></div>
        </div>
      </div>
      <div class="carrouselContainer">
        <el-carousel height="560px">
          <el-carousel-item v-for="img in imgList" :key="img">
            <img :src="img">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="headerBG"></div>
    </header>
    <nav>
      <div @mouseleave.stop="navLeave" @mouseenter.stop="navEnter('finance')"><router-link to="/home"><img src="@/assets/img/cai.png" alt=""><span :class="{moveHide:nav=='finance'}">工会财务管理</span></router-link></div>
      <div @mouseleave.stop="navLeave" @mouseenter.stop="navEnter('info')"><a href=""><img src="@/assets/img/shu.png" alt=""><span :class="{moveHide:nav=='info'}">数据直报平台</span></a></div>
    </nav>
    <section>
      <div class="proInfoContainer">
        <div class="proInfoTitle">
          <span>更多</span>
        </div>
        <div class="flexPublic proInfoContent">
          <div>
            <div class="flexPublic">
              <img src="@/assets/img/img1.png" alt="">
              <div>
                <h4>新版企业所得税</h4>
                <p>根据《浙江省人民政府办公厅关于“无违建县（市、区）”创建标准及验收办法（试行）的通知》（浙政办发〔2015〕72号）和《浙江省“三改一拆”行动领导小组关于“无违建县（市、区）”创建标准及考评办法的通知》（浙改拆〔2016〕9号）要求，经各设区市政</p>
              </div>
            </div>
            <p>府审核，省“无违建县（市、区）”创建工作领导小组办公室组织考核验收，拟推荐淳安县等6个县（市、区）为第一批“无违建县（市、区）”，杭州市富阳区等19个县（市、区）为第二批“基本无违建县（市、区）”，杭州市上城区等27县（市、区）为第三批“无违建创建先进县（市、区）”，现予公示，接受社会公众监督。
　　公示时间：2017年4月14日—4月19日（8:30—17:30）。在公示期内，任何单位和个人均可通过来信、来电等形式，反映公示对象在“无违建县（市、区）”创建工作中存在的问题。反映问题必须实事求是，以单位名义反映问题的应加盖公章，以个人名义反映问题的提倡署报本人真实姓名。逾期不予受理。</p>
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
                <li><a href="#"><img src="@/assets/img/s1.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s2.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s3.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s4.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s1.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s1.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s2.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s3.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s4.png" alt=""></a></li>
                <li><a href="#"><img src="@/assets/img/s1.png" alt=""></a></li>
            </ul>
        </div>
      </div>
      <div class="rolesContainer">
        <div class="roles">
          <div>
            <ul>
              <li class="roleActive" @click.stop="typeclick('all')">全部</li>
              <li class="roleActive" @click.stop="typeclick('country')"><a href="javascript:void(0);">国家</a></li>
              <li @click.stop="typeclick('province')"><a href="javascript:void(0);">省级</a></li>
              <li @click.stop="typeclick('city')"><a href="javascript:void(0);">市级</a></li>
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
            <el-carousel-item v-for="item in 4" :key="item">
                <a href="#"><img src="@/assets/img/n1.png" alt=""></a>
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
              <p>www.newgrand.cn</p>
            </li>
            <li>
              <img src="@/assets/img/d5.png"  />
              <p>www.gdata.cn</p>
            </li>
            <li>
              <img  src="@/assets/img/d6.png" />
              <p>杭州市拱墅区祥园路88号中国（杭州）智慧信息产业园N座9F</p>
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
              <div class="inputContainer"><input type="text" class="input_box" /></div>
            </li>
            <li>
              <p>联系方式</p>
              <div class="inputContainer"><input type="text" class="input_box" /></div>
            </li>
            <li>
              <p>需求描述</p>
              <div class="inputContainer"><textarea  cols="30" rows="4"></textarea></div>
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
        </div>
        <div class="pictrue">
          <img src="@/assets/img/r1.png" class="g1" />
          <img src="@/assets/img/r2.png" class="g1" />
        </div>
      </div>
      <div class="footInfo">
        <p>Copyright  @ 1993-2018NEWGRAND.All Rights Reserved</p>
        <p>新中大科技股份有限公司     杭州政云数据技术有限公司    版权所有</p>
        <p>浙ICP证05021872    浙公网安备    33010502000837号</p>
      </div>
    </footer>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import config from '@/util/ajaxConfig'
  export default {
    name: "home",
    data(){
      return {
        nav:'',
        proInfoList:[
          {info:'杭州市总启动2019平安返乡活动 万个车票补贴名额等你领',date:'2018-03-05',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-21/29167368656243964.html'},
          {info:'杭州市总工会推出工间操公益培训',date:'2018-05-12',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-21/29168762730849606.html'},
          {info:'郑荣胜赴萧山区开展“五个一”蹲点调研',date:'2018-06-15',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-21/29169282380215988.html'},
          {info:'宁波市工会系统第一批“爱心托管班”出炉 每家给予3000元的经费补助',date:'2018-06-15',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-21/29169286514242548.html'},
          {info:'丽水与对口帮扶合作地区分享改革成果 “最多跑一次” 跨省传真经',date:'2018-08-20',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-21/29167357212420899.html'},
          {info:'台州市域铁路巨晓林工作室“五小”成果丰硕 27项创新成果节约成本100万元',date:'2018-08-20',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-21/29167363932484398.html'},
          {info:'线上线下齐发力，宁波市总工会“圈粉”有招',date:'2018-10-20',url:'ttps://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-20/29080941579871468.html'},
          {info:'龙游县龙天红木小镇工会：从单一“小工会”走向多元“大工会”',date:'2018-10-21',url:'https://www.zjftu.org/page/zj_zgh/zj_xwzx/zj_xwzx_jcdt/2018-12-20/29080945165230067.html'}
        ],
        newsInfo:[
          {info:'国务院印发《关于做好当前和今后一个时期促进就业工作的若干意见》',date:'2018-05-02',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=97478'},
          {info:'人社部、财政部印发《关于全面推行企业新型学徒制的意见》',date:'2018-05-21',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=97276'},
          {info:'中办国办印发《关于提高技术工人待遇的意见》',date:'2018-06-12',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=95935'},
          {info:'国办印发《保障农民工工资支付工作考核办法》',date:'2018-06-12',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=95418'},
          {info:'中共中央国务院关于全面振兴东北地区等老工业基地的若干意见',date:'2018-06-15',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=92570'},
          {info:'中共中央国务院关于打赢脱贫攻坚战的决定',date:'2018-08-03',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=92089'},
          {info:'中共中央印发《关于深化人才发展体制机制改革的意见》',date:'2018-10-10',url:'http://www.acftu.org/template/10041/file.jsp?cid=1078&aid=92438'}
        ],
        imgList:[]
      }
    },
    computed:{
        picUrl:function(){
            return config.baseurl;
        }
    },
    mounted(){
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t1.jpg')
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t2.jpg')
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t3.jpg')
      this.imgList.push(this.picUrl+'/UpLoadFiles/Title/t4.jpg')
    },
    methods:{
      navEnter(val){
        console.log(111,this.nav)
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
        alert(object);
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
    .headerBG{
      position:absolute;
      z-index: -1;
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
      100% {margin-left:-970px}
  }
  .loginContainer{
  margin:0 auto;
  width:1200px;
  height:70px;
  >img{
    height:50px;
  }
  .login{
    display: flex;
    align-items: center;
    color:#7fa409;
    >div{
      margin-left: 10px;
      display: flex;
      align-items: center;
      &:first-of-type{
        width:200px;
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
      }
    }
  }
}
  .carrouselContainer{
    position: relative;
    width:1200px;
    height:626px;
    margin:0 auto;
    margin-top: 10px;
    opcity:0;
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
    display: flex;
    align-items: center;
    >div{
      width:50%;
      height:192px;
      display: flex;
      align-items: center;
      justify-content: center;
        >a{
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all .3s;
            >span{
                margin-left: 20px;
                font-weight: 400;
                font-size: 40px;
                color: #7fa409;
                transition: all .3s;
                &.moveHide{
                    opacity: 0;
                    margin: -170px;
                }
            }
        }

    }
  }
  section{
    position:relative;
    width:1200px;
    margin: 0 auto;
    padding:0 0 0 70px;
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
          width:49%;
          font-size: 13px;
          color:#a0a0a0;
          >div{
            overflow: hidden;
            height:185px;
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
          width:49%;
          font-size: 14px;
          margin-left:10px;
          >li{
            height:40px;
            line-height: 40px;
            padding:0 3px;
            position:relative;
              cursor:pointer;
            &:after{
              position: absolute;
              content:"";
              left:-3px;
              top:17px;
              width:6px;
              height:6px;
              background: #333;
              border-radius: 50%;
            }
            span:first-of-type{
              width:460px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              float: left;
                padding:0 5px;
            }
            span:nth-of-type(2){
              width:72px;
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
      display: flex;
      align-items: center;
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
              display: flex;
              width:1800px;
              height:100%;
              align-items: center;
              animation:proBanner 10s linear infinite;
              >li{
                  margin-right: 30px;
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
      display: flex;
      justify-content: space-between;
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
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color:#fff;
            li{
              margin-right:40px;
              font-size: 13px;
              position:relative;
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
            line-height: 40px;
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
        >i{
          content:"";
          position:absolute;
          right:-9px;
          top:-9px;
          width:136px;
          height:118px;
          background: url("../assets/img/g1.png");
          z-index: 9;
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
      display: flex;
      >div{
        width:50%;
        padding:5px;
        >ul{
          margin:0 auto;

          li{
            width:300px;
            height:40px;
            color:#fff;
            margin-left: 145px;
            display: flex;
            align-items: center;
            >img{
              width:7%;
              margin:0 9px 0 0;
            }
            >p{
              margin:0;
              text-align: left;
              color:#fff;
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
            background: #8ba42f;
            border-radius: 5px;
            color: #fff;
            font-size: 12px;
            display: flex;
            justify-content: center;
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
      display: flex;
      justify-content: center;
      align-items: center;
      padding:50px 0 10px;
      &.aboutContainer>div{
        width:50%;
        &.words>div{
            margin:0 auto 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            >p,>h1{
                color:#fff;
                margin-right:20px;
                font-size: 20px;
          }
        }
        &.pictrue{
             display: flex;
            justify-content: center;
            >img{
                width:141px;
                height:125px;
                margin-left: 80px;
            }
        }
      }
      &.footInfo{
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          color:#fff;
      }
    }
  }
</style>
