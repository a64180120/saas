<template>
    <div id="Journalism" class="Journalism">
        <div class="biao">
            <span>工会新闻</span>
            <img src="@/assets/img/b1-1.png" style="width:100%; margin-top:12px;" />
            <p class="g" style="cursor: pointer;"  @click.stop="openNewsList('291190117000001')">更多</p>
        </div>
        <div class="Journalism_left">
            <a href="http://www.zjtax.gov.cn/" target="_blank">
                <div class="img_box">
                    <img :src="picUrl + trendPic.Picpath" v-if="trendPic.Picpath" style="width: 100%;height: 100%">
                    <!--<img src="@/assets/img/img1.png"/>-->
                </div>
                <div class="txt_box">
                    <h1 style="float:left;">新版企业所得税</h1>
                    <p>为进一步落实企业所得税优惠政策，统一规范企业所得税优惠事项的办理，根据《国家税务总局关于发布修订后的&lt;企业所得税优惠政策事项办理办法&gt;的公告》（国家税务总局公告2018年第23号，以下简称23号公告）的规定，结合我省实际，现就企业所得税优惠事项办理有关问题公告如下：</p>
                </div>
                <div class="txt_box1">
                    <p>一、凡享受企业所得税优惠政策的企业，均应按照23号公告执行。
                        　　           				二、享受集成电路生产企业、集成电路设计企业、软件企业、国家规划布局内的重点软件企业和集成电路设计企业等优惠事项的企业，应当在完成年度汇算清缴后，按照《企业所得税优惠事项管理目录》（2017年版）“后续管理要求”项目中列示的清单，通过省经信委的浙江省软件和信息服务业公共服务平台（网址：www.zjiip.org.cn）上传相关资料。相关资料不再单独报送税务机关。
                        　　            			三、本公告适用于2017年度汇算清缴及以后年度企业所得税优惠事项办理工作。《浙江省国家税务局 浙江省地方税务局关于企业所得税优惠事项办理问题的公告》（浙江省国家税务局 浙江省地方税务局公告2015年第10号）以及《浙江省国家税务局关于加强企业所得税优惠备案管理工作的通知》（浙国税发〔2017〕60号）同时废止。</p>
                </div>
            </a>
        </div>
        <div class="Journalism_right">
            <ul>
                <li v-for="(item,index) of proInfoList" :key="index" @click.stop="openUrl(item)">
                    <div>
                        <i class="list-dot"></i>
                        <p class="txt" style='cursor: pointer;'>{{item.Title}}</p>
                        <span class="r">{{item.PublishTime | formatDate('YYYY-MM-DD')}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "industryInfo",
        props:{
            industryInfo:{
                type:Object,
                default:{}
            }

        }
    }
</script>

<style scoped>
    .Journalism {
        width: 1132px;
        height: 335px;
        background: url(../../assets/img/q6.png);
        margin: 50px auto 0;
        background-size: 100% 100%;
        padding-left: 16px;
        padding-right: 13px;
        padding-top: 19px;
        padding-bottom:10px;
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
</style>
