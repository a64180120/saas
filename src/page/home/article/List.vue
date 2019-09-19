<template>
    <div class="sys-page" style="font-size:18px">
        <div class="container">
            <div class="unionState flexPublic2">

                <ul class="flexPublic handle">
                    <div class="searcherValue" style="border-radius:4px 0 0 4px">
                        <input @keyup.enter="getData" v-model="unionSearchValue" type="text" placeholder="标题">
                    </div>
                    <div @click="getData" class="searcherBtn" style="border-radius:0;width: 60px">搜索</div>
                    <a @click.prevent="handlePage('add')"><li>新增</li></a>
                    <a @click.prevent="handlePage('edit')"><li>修改</li></a>
                    <a @click.prevent="handlePage('delete')"><li>删除</li></a>
                    <a @click.prevent="handlePage('publish')"><li>发布</li></a>
                    <a @click.prevent="handlePage('nopublish')"><li>取消发布</li></a>
                   <!-- <a @click.prevent="handlePage('type')"><li>分类管理</li></a>-->
                    <a>
                        <li class="el-icon-refresh" @click="freshPage" style='margin:0 0 0px 10px;background: #FFFFFF;min-width:30px;padding:0;border:0'></li>
                    </a>
                </ul>
                <div class="flexPublic" style="margin-right:10px; float: left">
                    <div>
                        <span>发布状态：</span>
                        <el-select v-model="publishState" @change="getData" style="width: 100px;">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已发布" value="1"></el-option>
                            <el-option label="未发布" value="0"></el-option>
                        </el-select>
                    </div>
                    <div style="margin-left: 10px;">
                        <!--<span>创建时间：</span>-->
                        <el-date-picker
                            v-model="creatTime"
                            type="date"
                            size='small'
                            @change="getData"
                            value-format='yyyy-MM-dd'
                            placeholder="创建时间" style="width: 150px;">
                        </el-date-picker>
                    </div>
                    <div style="margin-left: 10px;">
                        <!--<sapn>发布时间：</sapn>-->
                        <el-date-picker
                            v-model="postTime"
                            type="date"
                            size='small'
                            @change="getData"
                            value-format='yyyy-MM-dd'
                            placeholder="发布时间" style="width: 150px;">
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
                <div class="listContent">
                    <!--@row-click="clickRowNews"-->
                    <el-table
                        ref="newsTable"
                        :data="listInfo"
                        border
                        :header-cell-style="getRowClassNews"
                        @selection-change="handleSelectionChange"
                        highlight-current-row
                        style="width: 100%;font-size:18px;">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="序号"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            prop="Title"
                            label="标题">
                            <template slot-scope="scope">
                                <p class="title" style="text-align: left;" @click="showPreview(scope.row.PhId)">{{scope.row.Title}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="OrgList.length"
                            label="接收组织">
                            <template slot-scope="scope">
                                <p class="title" @click="getChekedOrgObj(scope.row)">{{scope.row.OrgList.length}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="Author"
                            label="创建人"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="NgInsertDt"
                            label="创建时间"
                            width="220">
                        </el-table-column>
                         <el-table-column
                            prop="Publish"
                            label="发布状态"
                            width="120">
                            <template slot-scope="scope">
                                <el-tooltip :content="scope.row.Publish?'已发布':'未发布'"
                                            placement="bottom-end">
                                    <i class="el-icon-s-promotion" :style="{ 'color':scope.row.Publish?'red':'#ccc','font-size': '28px' }"></i>
                                </el-tooltip>

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
                            width="220"
                        >
                            <template slot-scope="scope">
                                <p :style="{'text-align': 'center'}">
                                    {{ scope.row.Publish?scope.row.PublishTime:'——' }}
                                </p>

                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[10, 20, 40, 80]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>

                </div>
            </div>

            <!--类型页面-->
            <article-type datalists="" @type-click="addTypeFinish" v-if="handleNav=='type'"></article-type>
        </div>
        <message :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></message>

        <!--新增-->
        <el-dialog :append-to-body="true" :visible.sync="newsAddVisible" class="addArea" @close="closeAdd('newsAddVisible')">
            <add-news v-if="newsAddVisible" :newsProp="newsEditProps" @close="closeAdd('newsAddVisible')"></add-news>
        </el-dialog>
        <!-- 预览 -->
        <el-dialog :append-to-body="true" :visible.sync="newspreVisible" >
            <preview v-if="newspreVisible" :phid="newspreVisibleProp" @close="closeAdd('newspreVisible')"></preview>
        </el-dialog>
        <!-- 组织树 -->
        <!-- 组织树弹窗 -->
        <el-dialog :visible.sync="orgListsVisible" :append-to-body="true" width="350px" style="min-width: 350px;">
            <el-tree v-if="orgListsVisible"
                     :data="orgLists"
                     ref="tree"
                     show-checkbox
                     :check-strictly="true"
                     node-key="PhId"
                     :props="defaultProps"
                     default-expand-all
                     :default-checked-keys="checkedOrgListPhId"
            >

            </el-tree>
            <div slot="footer">
                <el-button @click="orgListsVisible=false">取消</el-button>
                <el-button @click="getCheckedOrg">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import articleType from './Type'
    import addNews from './Add'
    import preview from './Preview'
    import Auth from "@/util/auth"
    export default {
        name: "article_list",
        data(){
            return {
                unionSearchValue:'',
                publishState:'',
                creatTime: '',//创建时间
                postTime: '',//发布时间
                selectedItem:'',//
                selectedRows:[],//多选
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
                isHaveTop:false,
                newsAddVisible:false,//新闻新增弹窗
                newsEditProps:{},//修改新闻的参数
                newspreVisible:false,//新闻预览
                newspreVisibleProp:'',//新闻预览的phid
                orgCode:'',//组织code
                orgLists:[],//组织
                orgListsVisible: false,//组织树显示
                checkedOrgListPhId:[],//选中的组织PhId集合，用于组织树显示
                checkedNews:[],//选中修改的新闻，用于保存组织
                defaultProps: {
                    children: 'children',
                    label: 'OrgName'
                },
            }
        },
        created(){
            this.initInfoCss();
        },
        mounted(){
            //加载辅助项类型
            this.getTypeData();
            //得到缓存中的orgcode,备用，接口需要
            let cookiesUser = Auth.getUserInfoData();
            this.orgCode=cookiesUser.orgInfo.EnCode;
            this.getOrgData();
        },
        activated: function(){
            if( this.activated){
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
        components:{ articleType, addNews, preview },
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
             *组织查询，默认选中当前登录组织
             * */
            getOrgData:function(){
                let data={
                    orgId:this.orgid,
                }
                this.$axios.get('sysOrganize/GetAllOrgListByOrgId',{params:data}).then(res => {
                    if(res.Status=='success'){
                        this.orgLists=JSON.parse(res.Data);
                        //this.getChekedOrgObj()
                        console.log(this.orgLists)
                    }else{
                        this.saasMessage={
                            message:data.Msg,
                            delay:3000,
                            visible:true
                        };
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
           /**
            * 点击新闻发布组织时，弹出组织树，可对组织树进行修改
            * */
            getChekedOrgObj:function( val ) {
               this.checkedNews=val;
               this.checkedOrgListPhId=val.OrgList;
               //如果已经发布，已选择组织不允许修改，未发布可以修改
               if( val.Publish ){
                   for( var i in this.orgLists){
                       this.orgLists[i]['disabled']=false;//去除禁用
                       for( var j in val.OrgList){
                           if( val.OrgList[j]==this.orgLists[i].PhId ){
                               this.orgLists[i]['disabled']=true;
                           }
                       }
                   }
               }else{
                   for( var i in this.orgLists) {
                       this.orgLists[i]['disabled'] = false;//去除禁用
                   }
               }
               this.orgListsVisible=true;
            },
            /**
             * 组织树修改保存
             * */
            //点击保存时，获取当前选中的组织
            getCheckedOrg:function(){
                this.checkedOrgList=this.$refs.tree.getCheckedNodes();
                this.checkedOrgListPhId=[];
                for( var i in this.checkedOrgList ){
                    this.checkedOrgListPhId.push( this.checkedOrgList[i].PhId )
                }

                /**
                 * 这里等待新闻组织修改保存接口
                 * this.checkedNews 可以获取对应新闻
                * */
                this.orgListsVisible=false;
                this.checkedNews.OrgList=this.checkedOrgListPhId;
                this.$axios.post('/SysNews/PostUpdateReleaseOrg',{
                    infoData:this.checkedNews
                }).then( res=>{
                    console.log(res)
                    if( res.Status == 'success'){
                        this.saasMessage={
                            message:res.Msg,
                            delay:3000,
                            visible:true
                        };
                    }
                }).catch( err=>{
                    console.log(err)
                })
            },
            /**
            * 关闭弹窗，刷新页面
            * */
            closeAdd(val){
              this[val]=false;
              this.getData();
            },
             /**
             * 加载左侧的新闻分类，以及第一个分类的右侧的新闻列表
             */
            getTypeData(){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    pagesize:this.pageSize,
                    pageindex:this.pageIndex-1,
                    IsOrg:1
                };

                this.$axios.get('/SysNews/GetSysNewsListFirst',{ params:data })
                    .then(res=>{
                        console.log(res)
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
                this.selectedRows=[];
                //加载数据
                this.getData('');
            },
            /**
             * 点击标题，显示预览界面
             * */
            showPreview: function( val ) {
              this.newspreVisible=true;
              this.newspreVisibleProp=val;
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
            getData(){
                let query={
                        "Publish*num*eq":this.publishState,   //发布状态
                        "NgInsertDt*str*eq":this.creatTime,   //创建时间
                        "PublishTime*str*eq":this.postTime,   //发布时间
                        "Title*str*eq":this.unionSearchValue,   //标题
                    };
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    value:this.navActive.PhId,
                    pagesize:this.pageSize,
                    pageindex:this.pageIndex-1,
                    queryfilter:query,
                    IsOrg:1
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
                        this.$message({ showClose: true,message: "获取新闻列表失败", type: "error"});
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
                        //this.$router.push({name:'article_add',params:{activeNav:this.navActive,type:this.handleNav, phid:0,isHaveTop:this.isHaveTop,isAdd:true}})
                        this.newsEditProps={activeNav:this.navActive,type:this.handleNav, phid:0,isHaveTop:this.isHaveTop,isAdd:true};
                        this.newsAddVisible=true;
                        break;
                    case 'edit':
                        //编辑按钮
                        if(this.selectedRows.length==0){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要修改的新闻!'
                            }
                            return ;
                        }else if( this.selectedRows.length>1){
                            this.saasMessage={
                                visible:true,
                                message:'一次只允许修改一条新闻!'
                            }
                            return ;
                        }else{
                            this.handleNav='edit';
                            this.newsEditProps={activeNav:this.navActive, type:this.handleNav, selectedItem:this.selectedRows[0],isHaveTop:this.isHaveTop,isAdd:false};
                            this.newsAddVisible=true;
                        }
                        //this.$router.push({name:'article_add',params: {activeNav:this.navActive, type:this.handleNav, phid:this.selectedItem.PhId,isHaveTop:this.isHaveTop,isAdd:false}});
                        break;
                    case 'delete':
                        if(this.selectedRows.length==0){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要删除的新闻!'
                            }
                            return ;
                        }else{
                            this.$confirm('此操作将永久删除已选中文章, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                let pflag=false;
                                for( var i in this.selectedRows){
                                    if( this.selectedRows[i].Publish ){
                                        pflag=true;
                                    }else{
                                        this.deleteBase(this.selectedRows[i])
                                    }
                                }
                                if( pflag ){
                                    this.saasMessage={
                                        visible:true,
                                        message:'已发布新闻不允许删除，已自动为您跳过，若需删除，请先取消发布!'
                                    }
                                }
                            }).catch((err) => {
                                console.log(err)
                            });

                        }
                        break;
                    case 'publish':
                        if(this.selectedRows.length==0){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要发布的新闻!'
                            }
                            return ;
                        }/*else if(this.selectedRows.length>1){
                            this.saasMessage={
                                visible:true,
                                message:'一次只允许发布一条新闻!'
                            }
                            return ;
                        }*/else {
                            this.PublishNews(1);
                        }
                        break;
                    case 'nopublish':
                        if(this.selectedRows.length==0){
                            this.saasMessage={
                                visible:true,
                                message:'请选择要取消发布的新闻!'
                            }
                            return ;
                        }/*else if(this.selectedRows.length>1){
                            this.saasMessage={
                                visible:true,
                                message:'一次只允许取消发布一条新闻!'
                            }
                            return ;
                        }*/else{
                            this.PublishNews(0);
                        }

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
            deleteBase( item ){

                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData: item,
                    IsOrg: 1
                }
                this.$axios.post('/SysNews/PostDeleteSysNews',data)
                    .then(res=>{
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.getData('');
                        //this.initInfoCss();
                        this.$message.success('删除成功!');
                    })
                    .catch(err=>{
                        console.log(err)
                        this.$message({ showClose: true,message: "删除错误", type: "error"});
                    })
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
                    for(var i in this.selectedRows){
                        var pubmodel=this.selectedRows[i];
                        pubmodel.Publish=state;
                        pubmodel.Publisher=this.username;

                    //pubmodel.PublishTime=state;

                    var data={
                        uid:this.uid,
                        orgid:this.orgid,
                        infoData:pubmodel,
                        IsOrg:1,
                        OrgCode: this.orgCode
                    }

                    this.$axios.post('/SysNews/PostPutSysNews',data)
                        .then(res=>{
                            if(res.Status==='error'){
                                this.$message.error(res.Msg);
                                return
                            }
                            this.getData('');
                            //this.initInfoCss();
                            this.$message.success(title+'成功!');
                            this.selectedRows=[];
                        })
                        .catch(err=>{
                            console.log(err)
                            //this.selectedItem = ""
                            this.selectedRows=[];
                            this.$message({ showClose: true,message: "发布错误", type: "error"});
                        })
                    }
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
            /*clickRowNews(row){
                this.selectedItem=row;
            },*/
            handleSelectionChange( rows ){
               this.selectedRows=rows;
            }
        }

    }

</script>

<style scoped lang="scss">
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
        margin-right:15px;
        border: 1px solid #d3e9f9;
        margin-bottom: 32px;
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
    /deep/.el-pagination{
        text-align: right;
    }
    .addArea{
        /deep/ .el-dialog{
            width: 90%;
            min-width: 1000px;
            /deep/.container{
                padding: 0;
                box-shadow: none;
            }
        }
    }

    /deep/ .el-dialog{
        /deep/.container{
            padding: 0;
            box-shadow: none;
        }
    }
    /deep/.el-table{
        .cell{
            text-align: center;
            .title{
                color: #00b7ee;
                text-decoration: underline;
                cursor: pointer;
            }
        }
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


