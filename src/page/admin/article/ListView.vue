<template>
    <div class="sys-page">

    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'

    //文章新增、编辑
    export default {
        name: "Article_view",
        components: {},
        data() {
            return {
                typePhid: '',
                typeTab:[],
                typeActive:'',
                listInfo:[],      //列表信息
                pageSize: 10, //pageSize
                pageIndex: 1, //pageIndex
                total:0
            }
            
        },
        created() {},
        //加载数据
        mounted: function () {
            this.typePhid = this.$route.query.typePhid;
            //this.getNewsList(this.typePhid)
        },
        //计算
        computed: {
            ...mapState({
                userid: state => state.user.userid,
                username: state => state.user.username,
                orgid: state => state.user.orgid
            }),
            picUrl: function () {
                return httpConfig.baseurl;
            }
        },
        methods: {
            ...mapActions({
                GetNewsType: "news/GetNewsType",
                GetNewsList: "news/GetNewsList"
            }),
            getNewsList(phid){
                var parames={
                    value:phid,
                    pageindex:this.pageIndex-1,
                    pagesize:this.pageSize,
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
            }
        }
    }
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
    .auxiliaryNav{
        padding-top: 20px;
    }
    .auxiliaryNav>ul{
        padding:10px 20px;
        border:1px solid #d3e9f9;
    }
    .auxiliaryNav>ul>li{
        width:90%;
        margin:auto;
        margin-bottom:10px;
        min-width: 100px;
        height:30px;
        line-height: 30px;
        text-align: center;
        border:1px solid #00b8ee;
        border-radius: 5px;
    }
    .auxiliaryNav>ul>li:hover{
        background: #00b8ee;
        color:#fff;
        cursor:pointer;
    }
    .auxiliaryNav>ul>li.active{
        background: #00b8ee;
        color:#fff;
    }
</style>
