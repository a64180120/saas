<template>
    <section class="page">
        <div>
            {{article.Content}}
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "Article_Detail",
  components: { },
  data() {
    return {
        article: {
            PhId: 0,         //主键
            PhIdType: '',   //信息类别
            Title: '',       //标题
            Content: '',     //文本
            Name: '',        //信息来源
            LevelType: '',    //制度级别
            Ontop: 0,        //是否置顶
            Picpath: '',     //封面图片
            AttachmentName: '',     //图片原始名称
            AttachmentSize: '',     //图片大小
            Attachment: []   //附件
        }
    };
  },
  created() {

  },
  mounted:function(){
        var phid = this.$route.query.phid;
        if(phid){
            this.getData(phid);
        }
  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          orgid: state => state.user.orgid
      })
  },
  methods: {
        getData(phid) {
            let data = {
                id: phid,
                uid: this.userid,
                orgid: this.orgid
            };

            this.$axios.get('/SysNews/GetSysNews', {params: data})
                .then(res => {
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    this.article = res;
                })
                .catch(err => {
                    console.log(err)
                    this.$message({showClose: true, message: "文章获取错误", type: "error"});
                })
        }
  }
};
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
  }

  .article {
    width: 90%;
    margin-top: 24px;
    padding: 48px;
  }

  .markdown {
    width: 100%;
  }
</style>