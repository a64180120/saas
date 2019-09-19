<template>
    <div class="sys-page" style="font-size:18px">
        <div class="container">
            <div class="unionState flexPublic2">

                <ul class="flexPublic handle">
                    <div class="searcherValue" style="border-radius:4px 0 0 4px">
                        <input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="标题">
                    </div>
                    <div @click="unionSearch" class="searcherBtn" style="border-radius:0;width: 60px">搜索</div>
                    <a @click.prevent="handlePage('add')"><li>新增</li></a>
                    <a @click.prevent="handlePage('edit')"><li>修改</li></a>
                    <a @click.prevent="handlePage('delete')"><li>删除</li></a>
                    <a @click.prevent="handlePage('publish')"><li>发布</li></a>
                    <a @click.prevent="handlePage('nopublish')"><li>取消发布</li></a>
                    <a @click.prevent="handlePage('type')"><li>分类管理</li></a>
                    <a>
                        <li class="el-icon-refresh" @click="freshPage" style='margin:0 0 0px 10px;background: #FFFFFF;min-width:30px;padding:0;border:0'></li>
                    </a>
                </ul>
                <div class="flexPublic" style="margin-right:10px; float: left">
                    <div>
                        发布状态：
                    </div>
                    <div>
                        <el-select v-model="publishState" style="width: 100px;">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已发布" value="1"></el-option>
                            <el-option label="未发布" value="0"></el-option>
                        </el-select>
                    </div>
                    <div style="margin-left: 10px;">
                        创建时间：
                    </div>
                    <div>
                        <el-date-picker
                            v-model="creatTime"
                            type="date"
                            size='small'
                            value-format='yyyy-MM-dd'
                            placeholder="选择日期" style="width: 180px;">
                        </el-date-picker>
                    </div>
                </div>

            </div>
            <div class="auxiliary manageContent" style="font-size:18px">
                <div class="auxiliaryNav">
                    <p class="auxiliaryNavTitle">信息类别</p>
                    <ul>
                        <li :title="item.Name" @click.stop="navTabTurn(item)" :class="{active:navActive.Name==item.Name}" v-for="(item,index) of navTab" :key="index">{{item.Name}}</li>
                    </ul>
                </div>
                <div class="formData listContent">
                    <el-table
                        ref="newsTable"
                        :data="listInfo"
                        border
                        :header-cell-style="getRowClassNews"
                        @row-click="clickRowNews"
                        highlight-current-row
                        style="width: 100%;font-size:18px">
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
                            prop="NgInsertDt"
                            label="创建时间"
                            width="180">
                        </el-table-column>
                         <el-table-column
                            prop="Publish"
                            label="发布状态"
                            width="120">
                            <template slot-scope="scope">
                                <i :class="{ newsPublishStateTrue:scope.row.Publish,newsPublishStateFalse:!scope.row.Publish }"></i>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="Publisher"
                            label="发布人"
                            width="120">
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
                </div>
            </div>

            <!--类型页面-->
            <article-type datalists="" @type-click="addTypeFinish" v-if="handleNav=='type'"></article-type>
        </div>
        <message :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></message>
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
                publishState:'',
                creatTime:'',
                selectedItem:'',
                listInfoCssList:[],
                listInfo:[],      //列表信息
                handleNav:'',    //类型 add update
                navActive:'',
                navTab:[],
                pageSize: 10, //pageSize
                pageIndex: 1, //pageIndex
                total:0,
                activated:false,
                saasMessage:{

                },
                PhTypeId:'',
                /*判断是否有置顶信息*/
                isHaveTop:false
            }
        },
        created(){
            this.initInfoCss();
        },
        mounted(){
            //加载辅助项类型
            this.getTypeData();
            console.log(this.navActive.PhId)
        },
        activated: function(){
            console.log('activated_1');
            if( this.activated){
                console.log('activated_2');
                this.getData('');
            }
            
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
        watch:{
            PhTypeId(val,oldval){
                console.log(val)
            }
        },
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

                        console.log(res.List)

                        this.listInfo=res.List;
                        this.navTab=res.Type;
                        this.total=Number(res.Total);
                        this.PhTypeId = res.Type[0].PhId
                        if(this.navTab.length>0){
                            this.navActive=this.navTab[0];
                        }
                        
                        for(var i=0;i<this.listInfo.length;i++){
                            this.listInfoCssList[i]={checked:false};
                        }
                        this.isHaveTop = this.listInfo.some(item =>{
                            if (item.Ontop == '1'){
                                return true
                            }
                        })
                        console.log( this.isHaveTop)
                        this.activated=true;

                    })
                    .catch(err=>{
                        console.log(err)
                        this.$message({ showClose: true,message: "新闻列表获取错误", type: "error"});
                    })
            },
            //刷新当前页面
            freshPage(){
                this.getData('');
            },
            //切换分类触发方法
            navTabTurn(item){
                console.log(item.PhId)
                this.navActive=item;
                this.selectedItem='';
                //加载数据
                this.getData('');
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
                    pageindex:this.pageIndex-1,
                    queryfilter:query
                };

                // 
                this.$axios.get('/SysNews/GetSysNewsListByTypeId',{params:data})
                    .then(res=>{
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.listInfo=res.List;
                        this.total=Number(res.Total);
                        this.isHaveTop = this.listInfo.some(item =>{
                            if (item.Ontop == '1'){
                                return true
                            }
                        })
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
                        //this.$router.push({path: '/admin/article/add', query: { type:this.handleNav, phid:0 }});
                        this.$router.push({name:'article_add',params:{activeNav:this.navActive,type:this.handleNav, phid:0,isHaveTop:this.isHaveTop,isAdd:true}})
                        break;
                    case 'edit':
                        //编辑按钮
                        if(!this.selectedItem){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要修改的新闻!'
                            }
                            return ;
                        }
                        this.handleNav='edit';
                        this.$router.push({name:'article_add',params: {activeNav:this.navActive, type:this.handleNav, phid:this.selectedItem.PhId,isHaveTop:this.isHaveTop,isAdd:false}});
                        break;
                    case 'delete':

                        if(!this.selectedItem){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要修改的新闻!'
                            }
                            return ;
                        }
                        this.deleteBase();
                        break;
                    case 'publish':
                        if(!this.selectedItem){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要修改的新闻!'
                            }
                            return ;
                        }
                        this.PublishNews(1);
                        break;
                    case 'nopublish':
                        if(!this.selectedItem){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要修改的新闻!'
                            }
                            return ;
                        }
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

                var query={
                    "Publish*num*eq":this.publishState,   //发布状态
                    "NgInsertDt*str*eq":this.creatTime,   //创建时间
                    "Title*str*eq":this.unionSearchValue,   //标题
                }

                this.getData(query);
            },
            /** 
             * 删除方法
            */
            deleteBase(){

                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData:this.selectedItem
                }

                this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/SysNews/PostDeleteSysNews',data)
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

                var title=state===0?'取消发布':'发布';
                this.$confirm(title+'该文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var pubmodel=this.selectedItem;
                    pubmodel.Publish=state;
                    pubmodel.Publisher=this.username;
                    //pubmodel.PublishTime=state;

                    var data={
                        uid:this.uid,
                        orgid:this.orgid,
                        infoData:pubmodel
                    }

                    this.$axios.post('/SysNews/PostPutSysNews',data)
                        .then(res=>{
                            if(res.Status==='error'){
                                this.$message.error(res.Msg);
                                return
                            }
                            this.getData('');
                            this.initInfoCss();
                            this.$message.success(title+'成功!');
                            this.selectedItem = ""
                        })
                        .catch(err=>{
                            console.log(err)
                            this.selectedItem = ""
                            this.$message({ showClose: true,message: "发布错误", type: "error"});
                        })
                }).catch((err) => {
                    //console.log(err)
                    this.getData('');
                });
            },
            //分类管理弹窗完成*************
            addTypeFinish(val){
                this.handleNav=false;
                this.getTypeData();

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
                this.selectedItem=row;
            }
        }

    }

</script>

<style scoped>
    .el-icon-refresh:before {
        /* content: "\E6D0"; */
        font-size: 25px;
        color: #00B8EE;
    }
    .container{
        height:100%;
        overflow-y: auto;
    }
    .manageContent{
        padding-bottom: 0;
        height:auto;
    }
    .unionState{
        padding:0 10px;
        min-width: 1190px;
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
        overflow: hidden;
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
    .newsPublishStateTrue:before,.newsPublishStateTrue:after{
        content:"";
        position:absolute;
        width:8px;
        height:18px;
        border:1px solid #02a7e7;
        border-width: 0 1px 1px 0;
        transform: rotate(45deg);
        top:12px;
        left:48%;
    }
    .newsPublishStateFalse:before,.newsPublishStateFalse:after{
        content:"";
        position: absolute;
        width:18px;
        height:1px;
        background: #d8281d;
        transform: rotate(45deg);
        top:22px;
        left:44%;
    }
    .newsPublishStateFalse:before{
        transform: rotate(-45deg);
    }
    .flexPublic2>ul,
    .flexPublic2>li,
    .flexPublic2>span,
    .flexPublic2>div{
        float:right;
    }
</style>
<style>
    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, 
    .el-table__body tr.current-row>td {
        background-color: #ddd;
    }

    .el-table--enable-row-hover .el-table__body tr:hover>td{
	    background-color: #ddd;
    }
    .el-input__inner{
        line-height:30px;
    }
</style>


