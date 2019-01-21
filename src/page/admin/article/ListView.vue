<template>
    <div class="sys-page">
        <el-container>
            <el-header style="text-align: center;">
                <h2>新闻</h2>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <div class="auxiliaryNav">
                        <ul>
                            <li :class="{active:item.Active}" v-for="(item,index) of typeTab" :key="index" @click.stop="typeTabclick(item)" >{{item.Name}}</li>
                        </ul>
                    </div>
                </el-aside>
                <el-main>
                    <el-table
                        ref="newsList"
                        :data="listInfo"
                        border
                        :header-cell-style="getRowClassNews"
                        @row-click="clickRowNews"
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column
                            type="index"
                            label="序号"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="Title"
                            label="标题">
                        </el-table-column>
                        <el-table-column
                            prop="Author"
                            label="创建人"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="PublishTime"
                            label="发布时间"
                            width="180">
                        </el-table-column>
                    </el-table>
                    <ul>
                        <li>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageIndex"
                            :page-sizes="[10, 20, 40, 80]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                        </li>
                    </ul>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    //文章新增、编辑
    export default {
        name: "Article_view",
        components: { },
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
        created() {
            
        },
        //加载数据
        mounted: function () {
            this.typePhid = this.$route.query.typePhid;
            this.getTypeData(this.typePhid)
            this.getNewsList(this.typePhid)
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
            getTypeData(Phid){
                var parames={
                    uid: this.uid,
                    orgid: this.orgid,
                };

			    this.GetNewsType(parames).then(res => {

                    if(res){
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }

                        for(var item of res){
                            if(item.PhId===Phid){
                                item.Active=true;
                            }else{
                                item.Active=false;
                            }
                        }
                        this.typeTab=res;
                    }
                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '新闻获取失败', type: 'error'})
                })
            },
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
            },
            //点击类别
            typeTabclick(item){
                this.getNewsList(item.PhId)
            },
            // 给表单的表头添加背景颜色
            getRowClassNews({row, column, rowIndex, columnIndex}){
                if (rowIndex === 0) {
                    return 'background: #d3e9f9;border-right:1px solid #fff;text-align: center;color: #000;'
                } else {
                    return ''
                }
            },
            //el-table 被点击时会触发该事件
            clickRowNews(row){
                //this.selectedItem=row;

                //console.log(row);
                this.$router.push({path: '/news/view', query: { phid:row.PhId }});
            },
             /**
             * pageSize 改变时会触发
             * 分页控件
             */
            handleSizeChange(val){
                //console.log(`每页 ${val} 条`);
                this.pageSize=Number(val);
                this.getNewsList(this.typePhid)
            },
            /**
             * currentPage 改变时会触发
             * 分页控件
             */
            handleCurrentChange(val){
                //console.log(`当前页: ${val}`);
                this.pageIndex=Number(val);
                this.getNewsList(this.typePhid)
            },
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
