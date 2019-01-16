<template>
    <div class="sys-page">
        <div class="container">
            <div class="unionState flexPublic">
                <div class="flexPublic">
                    <div class="searcherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="标题"></div>
                    <div @click="unionSearch" class="searcherBtn btn" style="width: 60px">搜索</div>
                </div>
                <ul class="flexPublic handle">
                    <a @click.prevent="handlePage('add')"><li>新增</li></a>
                    <a @click.prevent="handlePage('edit')"><li>修改</li></a>
                    <a @click.prevent="handlePage('delete')"><li>删除</li></a>
                    <a @click.prevent="handlePage('publish')"><li>发布</li></a>
                    <a @click.prevent="handlePage('nopublish')"><li>取消发布</li></a>
                    <a @click.prevent="handlePage('type')"><li>分类管理</li></a>
                    <a>
                        <li class="el-icon-refresh" @click="freshPage" style='margin:0 0 0px 10px;background: #FFFFFF;border-color: #ffffff;'></li>
                    </a>
                </ul>
            </div>
            <div class="auxiliary manageContent">
                <div class="auxiliaryNav">
                    <p class="auxiliaryNavTitle">信息类别</p>
                    <ul>
                        <li @click.stop="navTabTurn(item)" :class="{active:navActive.Name==item.Name}" v-for="(item,index) of navTab" :key="index">{{item.Name}}</li>
                    </ul>
                </div>
                <div class="formData listContent">
                    <ul>
                        <li>序号</li>
                        <li>标题</li>
                        <li>创建人</li>
                        <li>创建时间</li>
                        <li>发布状态</li>
                        <li>发布人</li>
                        <li>发布时间</li>
                    </ul>
                    <ul class="formDataItems flexPublic" :class="{listInfoCss:listInfoCssList[index].checked}" @click="chooseOn(index,item)" v-for="(item,index) of listInfo" :key="index">
                        <li>{{index+1}}</li>
                        <li>{{item.Title}}</li>
                        <li>{{item.Author}}</li>
                        <li>{{item.NgInsertDt}}</li>
                        <li><i :class="{newAddStateTrue:item.Publish,newAddStateFalse:!item.Publish}"></i></li>
                        <li>{{item.Publisher}}</li>
                        <li>{{item.PublishTime}}</li>
                    </ul>
                    <div v-if="listInfo.length==0" class="NoDataflex">
                         当前页没有数据
                    </div>
                    <ul>
                        <li>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageIndex"
                            :page-sizes="[20, 40, 60, 80]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                        </li>
                    </ul>
                </div>
            </div>

            <!--辅助项类型页面-->
            <article-type datalists="" @type-click="addTypeFinish" v-if="handleNav=='type'"></article-type>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import articleType from './Type'

    export default {
        name: "article_list",
        data(){
            return {
                unionSearchValue:'',
                selectedItem:'',
                listInfoCssList:[],
                listInfo:[],      //列表信息
                handleNav:'',    //类型 add update
                navActive:'',
                navTab:[],
                pageSize: 20, //pageSize
                pageIndex: 1, //pageIndex
                total:0
            }
        },
        created(){
            this.initInfoCss();
        },
        mounted(){
            //加载辅助项类型
            this.getTypeData();
        },
        //计算
        computed:{
            addupdate(){
                return {name:'', data:this.selectedItem}
            },
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                username: state => state.user.username
            })
        },
        //组件
        components:{ articleType },
        methods:{
            initInfoCss(){
                for(var i in this.listInfo){
                    this.listInfoCssList[i]={checked:false};
                }
            },
             /**
             * 加载左侧的新闻分类，以及第一个分类的右侧的新闻列表
             */
            getTypeData(){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    pagesize:this.pageSize,
                    pageindex:this.pageIndex-1
                };

                this.$axios.get('/SysNews/GetSysNewsListFirst',{ params:data })
                    .then(res=>{

                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }

                        this.listInfo=res.List;
                        this.navTab=res.Type;
                        this.total=Number(res.Total);

                        if(this.navTab.length>0){
                            this.navActive=this.navTab[0];
                        }
                        
                        for(var i=0;i<this.listInfo.length;i++){
                            this.listInfoCssList[i]={checked:false};
                        }

                    })
                    .catch(err=>{
                        console.log(err)
                        this.$message({ showClose: true,message: "新闻列表获取错误", type: "error"});
                    })
            },
            //刷新当前页面
            freshPage(){
                alert("1");
                this.getData('');
            },
            //切换分类触发方法
            navTabTurn(item){
                this.navActive=item;
                //加载数据
                this.getData('');

            },
            //列表选择内容
            chooseOn(index,item){
                this.listInfoCssList.map((value) => {return value.checked=false})
                this.listInfoCssList[index].checked=true;
                this.$forceUpdate();
                this.selectedItem=item;
            },
            /**
             * pageSize 改变时会触发
             * 分页控件
             */
            handleSizeChange(val){
                //console.log(`每页 ${val} 条`);
                this.pageSize=Number(val);
                this.getData('')
            },
            /**
             * currentPage 改变时会触发
             * 分页控件
             */
            handleCurrentChange(val){
                //console.log(`当前页: ${val}`);
                this.pageIndex=Number(val);
                this.getData('')
            },
             /**
             * 获取新闻信息
             * query:查询参数
             *  */
            getData(query){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    value:this.navActive.PhId,
                    pagesize:this.pageSize,
                    pageindex:this.pageIndex-1
                };

                //debugger

                this.$axios.get('/SysNews/GetSysNewsListByTypeId',{params:data})
                    .then(res=>{
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }

                        this.listInfo=res.List;
                        this.total=Number(res.Total);
                        for(var i=0;i<this.listInfo.length;i++){
                            this.listInfoCssList[i]={checked:false};
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                        this.$message({ showClose: true,message: "辅助项获取错误", type: "error"});
                    })
            },
            /**
             * 按钮事件
             */
            handlePage(val){
                switch(val){
                    case 'add':
                        //新增的按钮
                        this.handleNav='add';
                        this.$router.push({path: '/admin/article/add', query: { type:this.handleNav, phid:0 }});
                        break;
                    case 'edit':
                        //编辑按钮
                        this.handleNav='edit';
                        this.$router.push({path: '/admin/article/add', query: { type:this.handleNav, phid:this.selectedItem.PhId }});
                        break;
                    case 'delete':
                        this.deleteBase();
                        break;
                    case 'publish':
                        this.PublishNews(1);
                        break;
                    case 'nopublish':
                        this.PublishNews(0);
                        break;
                    case 'type':
                        this.handleNav='type';
                        break;
                }
            },
            /**
             * 搜索按钮
             */
            unionSearch(){
                this.getData('');
            },
            /** 
             * 删除方法
            */
            deleteBase(){

                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    id:this.selectedItem.PhId
                }

                this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/SysNews/PostDelete',data)
                        .then(res=>{
                            if(res.Status==='error'){
                                this.$message.error(res.Msg);
                                return
                            }
                            this.getData('');
                            this.initInfoCss();
                            this.$message.success('删除成功!');  
                        })
                        .catch(err=>{
                            console.log(err)
                            this.$message({ showClose: true,message: "删除错误", type: "error"});
                        })
                }).catch((err) => {
                    console.log(err)   
                });
            },
            /**
             * 取消发布
             */
            PublishNews(state){

                var pubmodel=this.selectedItem;
                pubmodel.Publish=state;
                pubmodel.Publisher=this.username;
                //pubmodel.PublishTime=state;

                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData:pubmodel
                }

                this.$confirm('取消发布该文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/SysNews/PostPutSysNews',data)
                        .then(res=>{
                            if(res.Status==='error'){
                                this.$message.error(res.Msg);
                                return
                            }
                            this.getData('');
                            this.initInfoCss();
                            this.$message.success('发布成功!');  
                        })
                        .catch(err=>{
                            console.log(err)
                            this.$message({ showClose: true,message: "发布错误", type: "error"});
                        })
                }).catch((err) => {
                    console.log(err)   
                });
            },
            //分类管理弹窗完成*************
            addTypeFinish(val){
                this.handleNav=false;
                if(val){
                    this.getTypeData();
                }
            },
        }

    }

</script>

<style scoped>
    .el-icon-refresh:before {
        content: "\E633";
        font-size: 20px;
        color: #00B8EE;
    }
    .container{
        height:90%;
        overflow-y: auto;
    }
    .manageContent{
        padding-bottom: 0;
        height:auto;
    }
    .unionState{
        padding:0 10px;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:40px;
        line-height:40px;
        text-align: center;
    }
    .formData>ul>li:nth-of-type(2){
        width:30%
    }
    .formData>ul>li:nth-of-type(3){
        width:10%;
    }
    .formData>ul>li:nth-of-type(4){
        width:10%;
    }
    .formData>ul>li:nth-of-type(5){
        width:10%;
    }
    .formData>ul>li:nth-of-type(6){
        width:10%;
    }
    .formData>ul:first-child>li:last-of-type{
        width:10%;
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 31px;
        padding:0 2px;
    }

    .formData>ul.formDataItems:hover{
        background: #ddd;
    }
    .formDataItems{

        border-bottom:1px solid #ddd;
    }
    .formData>ul.formDataItems>li{
        border-right:1px solid #ddd;
        border-left:0;
        border-bottom:0;
        text-align: center;
        line-height: 40px;
        height:40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
    }
    .formData>ul.formDataItems>li>i.newAddStateTrue:after{
        top:5px;
    }
    .formData>ul.formDataItems>li>.newAddStateFalse:before,
    .formData>ul.formDataItems>li>.newAddStateFalse:after{
        top:20px;
    }
    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .auxiliary{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .auxiliaryNav{
        width:15%;
        min-width:138px;
        margin-top: 10px;
        padding-right:5px;
        margin-right:15px;
    }
    .auxiliaryNavTitle{
        background:#d3e9f9;
        color:#333;
        height:40px;
        line-height: 40px;
        text-align: center;
        font-size: 15px;
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
    .listContent{
        width:85%;
    }
    .NoDataflex{
        height: 40px;
        border: 1px solid #d3e9f9;
        display: block;
        text-align: center;
        padding-top: 10px;
    }

</style>
