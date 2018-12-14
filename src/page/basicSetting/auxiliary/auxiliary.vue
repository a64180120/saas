<template>
    <div class="sys-page">
        <div class="container">
            <div class="unionState flexPublic">
                <div class="flexPublic" style="margin-left: 15%;">
                    <div class="searcherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="组织编码/名称"></div>
                    <div @click="unionSearch" class="searcherBtn">搜索</div>
                </div>
                <ul class="flexPublic handle">
                    <a @click.prevent="handlePage('add')"><li>新增</li></a>
                    <a @click.prevent="handlePage('update')"><li>修改</li></a>
                    <a @click.prevent="handlePage('delete')"><li>删除</li></a>
                    <a @click.prevent="handlePage('type')"><li>分类管理</li></a>
                </ul>
            </div>
            <div class="auxiliary manageContent">
                <div class="auxiliaryNav">
                    <p class="auxiliaryNavTitle">辅助类型</p>
                    <ul>
                        <li @click.stop="navTabTurn(item)" :class="{active:navActive.BaseName==item.BaseName}" v-for="(item,index) of navTab" :key="index">{{item.BaseName}}</li>
                    </ul>
                </div>
                <div class="formData auxiliaryContent">
                    <ul>
                        <li>序号</li>
                        <li>编码</li>
                        <li>名称</li>
                        <li>启用/停用</li>
                    </ul>
                    <ul class="formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}" @click="chooseOn(index,item)" v-for="(item,index) of userInfo" :key="index">
                        <li>{{index+1}}</li>
                        <li>{{item.BaseCode}}</li>
                        <li>{{item.BaseName}}</li>
                        <li><i :class="{newAddStateTrue:!item.EnabledMark,newAddStateFalse:item.EnabledMark}"></i></li>
                    </ul>
                </div>
            </div>
             <!--辅助项类型页面-->
            <auxiliary-type datalists="" @type-click="addTypeFinish" v-if="handleNav=='type'"></auxiliary-type>
            <!--辅助项新增编辑页面-->
            <handle-update :PhIdList="{name:handleNav,data:PhIdList,type:navActive}" v-if="handleNav=='add'||handleNav=='update'" @add-click="addFinish"></handle-update>
        </div>
    </div>
</template>

<script>
    import handleUpdate from './handleUpdate'
    import auxiliaryType from './auxiliaryType'
    import { mapState, mapActions } from 'vuex'
    import { dealAddString } from "@/util/validate";

    export default {
        data(){
            return {
                unionSearchValue:'',
                PhIdList:'',
                userInfoCssList:[],
                userInfo:[
                    {PhId:'111',BaseCode:'01',BaseName:'办公室',EnabledMark:0},
                    {PhId:'222',BaseCode:'03',BaseName:'财务科',EnabledMark:1},
                ],
                handleNav:'',    //类型 add update
                
                navActive:{id:'',BaseName:'部门'},
                navTab:[]
            }
        },
        methods:{
            unionSearch(){
                //alert('输入的是:'+this.unionSearchValue)
                // var queryfilter={
                //     BaseCode:this.unionSearchValue,
                //     BaseName:this.unionSearchValue
                // }

                this.getData('');
            },
            initInfoCss(){
                for(var i in this.userInfo){
                    this.userInfoCssList[i]={checked:false};
                }
            },
            handlePage(val){
                switch(val){
                    case 'add':
                        this.handleNav='add';

                        //倒序排，获取第一项的 BaseCode
                        var firstObject=this.userInfo[0]||{BaseCode:'000'};

                        this.PhIdList={
                            PhId:'',
                            BaseCode:dealAddString(firstObject.BaseCode),
                            BaseName:'',
                            EnabledMark:0
                        }
                        break;
                    case 'update':
                        if(this.PhIdList.PhId){
                            this.handleNav='update';
                        }else{
                            alert('请选择编码!')
                        }
                        break;
                    case 'delete':
                        this.deleteBase();
                        break;
                    case 'type':
                        this.handleNav='type';
                        break;
                }
            },
            chooseOn(index,item){
                this.userInfoCssList.map((value) => {return value.checked=false})
                this.userInfoCssList[index].checked=true;
                this.$forceUpdate();
                this.PhIdList=item;
            },
            /**
             * 获取辅助项类别信息
             */
            ajaxMode(){
                let data = {
                    uid: this.uid,//this.uid获取到store中的uid************
                    orgid: this.orgid,//this.orgid获取到store中的orgid************
                    infoData:null
                };
                var vm=this;
                this.$axios.get('/PVoucherAuxiliaryType/GetVoucherAuxiliaryTypeList',{params:data})
                    .then(res=>{

                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }

                        this.userInfo=res.list;
                        this.navTab=res.type;

                        if(!this.navTab.id){
                            this.navActive=this.navTab[0];
                        }
                        for(var i=0;i<this.userInfo.length;i++){
                            this.userInfoCssList[i]={checked:false};
                        }

                    })
                    .catch(err=>{
                        console.log(err)
                        this.$message({ showClose: true,message: "辅助项获取错误", type: "error"});
                    })
            },
    
            //切换辅助项分类**************************
            navTabTurn(item){
                this.navActive=item;
                //加载数据
                this.getData('');

            },
             /**
             * 获取辅助项信息
             * query:查询参数
             *  */
            getData(query){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    typeId:this.navActive.PhId,
                    CodeOrName:this.unionSearchValue
                };
                this.$axios.get('/PVoucherAuxiliaryType/GetAuxiliaryQueryList',{params:data})
                    .then(res=>{
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.userInfo=res.list;
                        for(var i=0;i<this.userInfo.length;i++){
                            this.userInfoCssList[i]={checked:false};
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                        this.$message({ showClose: true,message: "辅助项获取错误", type: "error"});
                    })
            },
            addTypeFinish(val){
                this.handleNav=false;
                if(val){
                    this.ajaxMode();
                }
            },
            addFinish(val){
                this.handleNav=val;
                this.navTabTurn(this.navActive);
                this.getData('');
                //this.initInfoCss();
            },
            //删除
            deleteBase(){

                this.PhIdList.DeleteMark=1;
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData:this.PhIdList
                }

                this.$confirm('此操作将永久删除该辅助项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/PVoucherAuxiliaryType/PostAddAuxiliary',data)
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
                    this.$message({ showClose: true,message: "删除错误", type: "error"});      
                });
            }
        },
        created(){
            this.initInfoCss();
        },
        mounted(){
            //加载辅助项类型
            this.ajaxMode();
        },
        //计算
        computed:{
            addupdate(){
                return {name:'',data:this.PhIdList}
            },
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
        //组件
        components:{
            handleUpdate,
            auxiliaryType
        }
    }

</script>

<style scoped>


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
        width:45%;
    }
    .formData>ul>li:nth-of-type(4){
        width:15%;
    }
    .formData>ul:first-child>li:last-of-type{
        width:15%;
        border-right:1px solid #2780d1;
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
    }
    .auxiliaryNavTitle{
        background:#83c350;
        color:#fff;
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
        border:1px solid #ff9900;
        border-radius: 5px;
    }
    .auxiliaryNav>ul>li:hover{
        background: #ff9900;
        color:#fff;
        cursor:pointer;
    }
    .auxiliaryNav>ul>li.active{
        background: #ff9900;
        color:#fff;
    }
    .auxiliaryContent{
        width:85%;
    }


</style>
