<template>
    <section id="article-preview">
        <div class="article-preview-wrap">
           <!-- <div class="article-header">
                <div class="handle-box">
                    <el-row>
                        <el-col :span="24">
                            <el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10"
                                    @click="cancel">关闭预览
                            </el-button>
                        </el-col>
                    </el-row>

                </div>
            </div>-->
            <div v-if="article.PhId">
                <div class="article-warp">
                    <div class="article-message">
                        <p class="article-title">
                            {{ article.Title }}
                        </p>
                        <div class="article-info">
                            <span class="info">
                                <i class="iconfont icon-calendar"></i>
                                <span class="info-item">发表于 {{ article.PublishTime}} | {{ article.Publisher }}</span>
                            </span>
                        </div>
                    </div>
                    <art-preview :contents="article.Content" />
                </div>
                <div class="attachement" v-if='AttachmentList.length>0'>
                    <p>附件</p>
                    <ul class="attlist">
                        <li @click.stop="AttachmentDownLoad(item)" v-for="(item,index) of AttachmentList" :key="index">{{item.BName}}</li>
                    </ul>
                </div>
            </div>
            <no-data v-if="!article.PhId" text="没有找到该文章~"/>
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import artPreview from '@/components/ArticlePreview'
import noData from '@/components/ArticlePreview/noData'
import httpConfig from '@/util/ajaxConfig'

export default {
  name: "Article_preview",
  components: { artPreview,noData },
    props:{
        phid:{
            type:String,
            default(){
                return ''
            }
        }
    },
  data() {
    return {
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
  created() {

  },
  mounted:function(){
        var phid = this.phid;
        if(phid){
            this.getData(phid);
        }
  },
  //计算
  computed: {
        ...mapState({
            userid: state => state.user.userid,
            orgid: state => state.user.orgid
        }),
        picUrl: function () {
                return httpConfig.baseurl;
        },
        /*viewType:function(){
            if(this.$route.query.type==='index'){
                return true;
            }else{
                return false;
            }
        }*/
  },
  methods: {
        getData(phid) {
            let data = {
                id: phid,
                uid: this.userid,
                orgid: this.orgid
            };

            this.$axios.get('/SysNews/GetNewsAndAttachmentByNid', {params: data})
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
        cancel(){
           /* var phid = this.$route.query.phid;
            //关闭移除当前的TagNav
            this.$store.commit("tagNav/removeTagNav", this.$route);
            //跳转列表的首页
            this.$router.push({path: "/admin/article/add",query: { type:'edit',phid:phid }});*/
           this.$emit('close')
        },
        //下载附件
        AttachmentDownLoad(item){
            //console.log(item);
            //window.location.href = this.picUrl+item.BUrlPath
            let base=httpConfig.getAxiosBaseConfig();
            window.location.href = base.baseURL+"/File/GetDownLoadFile?filePath="+item.BUrlPath+"&fileName="+item.BName;
        }
  }
};
</script>

<style lang="scss" scoped>

#article-preview{
  position: relative;
  > p{
    position: fixed;
    width: 100%;
    top: 0;
    padding: 18px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;
    box-shadow: 1px 1px 10px 1px rgba(38, 42, 48, .1);
    z-index: 1000;
  }
  .article-header{
      height: 60px;
  }
  .article-preview-wrap{
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    padding: 0px 0px 30px;
    .article-warp{
        position: relative;
        animation: show .8s;
        padding: 10px 30px;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px 0px 5px 0px rgba(38, 42, 48, .1);
         .article-message{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .article-title{
                font-size: 26px;
                font-weight: bold;
            }
            .article-info{
                font-size: 14px;
                margin: 10px 0px;
                color: #999999;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-end;
                flex-wrap: wrap;
            }
            .line{
                margin-bottom: 4px;
            }
            .info{
                margin-bottom: 4px;
                margin-left: 4px;
                margin-right: 4px;
                .info-item .classify{
                    color: #666666;
                    border-bottom: 1px solid #262a30;
                    cursor: pointer;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
                .iconfont{
                    font-size: 14px;
                    margin-right: 5px;
                }
            }
            .article-sub-message{
                font-size: 14px;
                color: #999999;
                margin-bottom: 20px;
            }
         }
    }
    .attachement{
        margin-top: 50px;
        > p{
            color: #79CA63;
            text-align: left;
            text-decoration: none;
            font-size: 14.0pt;
            font-style: normal;
            font-weight: 700;
            line-height: 0px;
        }
        .attlist{
            margin-top: 20px;
            > li{
                cursor: pointer;
                line-height: 30px;
            }
        }
    }
  }
}
</style>
