<template>
    <div class="manageContent">
        <div class="unionState flexPublic">
            <div class="flexPublic">
                <div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="组织编码/名称"></div>
                <div @click="unionSearch" class="seacherBtn">搜索</div>
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
                    <li @click.stop="navTabTurn(item.BaseName)" :class="{active:navActive==item.BaseName}" v-for="(item,index) of navTab" :key="index">{{item.BaseName}}</li>
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
                    <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                    <li>{{item.BaseCode}}</li>
                    <li>{{item.BaseName}}</li>
                    <li><i :class="{newAddStateTrue:item.EnabledMark,newAddStateFalse:!item.EnabledMark}"></i></li>
                </ul>
            </div>
        </div>
        <auxiliary-type :datalists="JSON.stringify(navTab)" @type-click="addFinish" v-if="handleNav=='type'"></auxiliary-type>
        <handle-update :PhIdList="{name:handleNav,data:PhIdList}" v-if="handleNav=='add'||handleNav=='update'" @add-click="addFinish"></handle-update>
    </div>
</template>

<script>
    import handleUpdate from './handleUpdate'
    import auxiliaryType from './auxiliaryType'
    export default {
        data(){
            return {
                unionSearchValue:'',
                PhIdList:'',
                pageIndex:1,
                pageSize:'15',
                pageCount:[],
                userInfoCssList:[],
                pageCssActive:'',
                pagePreDisabled:'',
                pageNextDisabled:'',
                userInfo:[
                    {PhId:'111',BaseCode:'01',BaseName:'办公室',EnabledMark:0},
                    {PhId:'222',BaseCode:'03',BaseName:'财务科',EnabledMark:1},
                ],
                handleNav:'',
                navActive:'部门',
                navTab:[{PhId:11,BaseCode:'01',EnabledMark:1,BaseName:'部门'},
                    {PhId:112,BaseCode:'02',EnabledMark:1,BaseName:'往来单位'},
                    {PhId:113,BaseCode:'03',EnabledMark:0,BaseName:'往来个人'},
                    {PhId:114,BaseCode:'04',EnabledMark:0,BaseName:'项目'}]
            }
        },
        methods:{
            unionSearch(){
                alert('输入的是:'+this.unionSearchValue)
            },
            newPage(val){//分页展示****************************************
                console.log()
                if(val=='next'){
                    if(this.pageIndex%this.pageCount!=0&&this.pageIndex!=this.pageCount){
                        this.pageIndex++;
                    }
                }else if(val=='pre'){
                    if(this.pageIndex%this.pageCount!=1){
                        this.pageIndex--;console.log(this.pageIndex)
                    }
                }else{
                    this.pageIndex=val+1;
                }
                this.pageCssActive=this.pageIndex-1;
                this.ajaxMode();
            },
            pageSizeSelect(){
                this.ajaxMode();
            },
            initInfoCss(){
                for(var i in this.userInfo){
                    this.userInfoCssList[i]={checked:false};
                }
                this.navActive=this.navTab[0].BaseName
            },
            handlePage(val){
                switch(val){
                    case 'add':
                        this.handleNav='add';
                        break;
                    case 'update':
                        if(this.PhIdList.PhId){
                            this.handleNav='update';
                        }else{
                            alert('请选择编码!')
                        }
                        break;
                    case 'delete':
                        alert('删除成功');
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
            ajaxMode(){
                let {data,config}=this.$ajax();
                data.infoData=null;
                data = {
                    uid: "0",
                    orgid: "0",
                    pagesize:this.pageSize,
                    pageindex:this.pageIndex-1
                };
                this.$axios.get('http://10.0.45.51:7758/api/GCW/SysOrganize/GetSysOrganizeList',{params:data,headers:config.headers})
                    .then(res=>{
                        var data=JSON.parse(res.data);
                        this.userInfo=data.Record;
                        for(var i=0;i<this.userInfo.length;i++){
                            this.userInfoCssList[i]={checked:false};
                        }
                        this.pageIndex=data.index+1;
                        this.pageSize=data.size;
                        var newArr=[];
                        var maxP=Math.ceil(data.totalRows/data.size)>10?10:Math.ceil(data.totalRows/data.size);
                        for(var i=0;i<maxP;i++){
                            newArr=i+1;
                        }
                        this.pageCount=newArr;
                    })
            },
            navTabTurn(item){
                this.navActive=item;
            },
            addFinish(val){
                this.handleNav=val;
            }
        },
        created(){
            this.initInfoCss();
        },
        mounted(){
            //this.ajaxMode();
        },
        computed:{
            addupdate(){
                return {name:'',data:this.PhIdList}
            }
        },
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
