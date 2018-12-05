<template>
    <div class="manageContent">
        <div class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic">
                    <div>账期:</div>
                    <div>
                        <el-date-picker
                            v-model="zwTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </li>
                 <li class="flexPublic">
                     <div>其他过滤:</div>
                     <div>
                        <el-select v-model="otherState" placeholder="请选择">
                            <el-option
                                v-for="item in otherStateList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                     </div>
                 </li>
            </ul>
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input type="text" placeholder="组织编码/名称"></div>
                <div  class="searcherBtn">搜索</div>
            </div>
            <ul class="flexPublic handle">
                <a href=""><li>打印</li></a>
                <a href=""><li>导出</li></a>
            </ul>
        </div>
        <div class="flexPublic manageContent p0">
            <div class="unionLists">
                <div class="unionListsTitle">辅助类型 &nbsp;
                    <div class="selectContainer">
                        <el-select v-model="department" >
                            <el-option v-for="item of auxiliaryType" :key="item.PhId" :label="item.BaseName"  :value="item.PhId"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="unionListsContent">
                    <!-- <ul>
                        <li v-for="(item,index) of auxiliaryLists" :key="index">
                            <div @click="unionListOpen(item,$event)" :class="{moreList:auxiliaryLists.length>1}">{{item.BaseName}}</div>
                        </li>
                    </ul> -->
                    <el-tree
                        class="tree"
                        :data="auxiliaryLists"
                        :props="defaultProps"
                        default-expand-all
                        node-key="PhId"
                        @node-click="handleNodeClick"
                        ref="auxiliaryTree">
                    </el-tree>
                </div>
            </div>
            <div class="formData" > <!--v-loading.fullscreen.lock="loading"-->
                <ul>
                    <li>凭证日期</li>
                    <li>凭证字号</li>
                    <li>摘要</li>
                    <li>借方金额(元)</li>
                    <li>贷方金额(元)</li>
                    <li>方向</li>
                    <li>余额(元)</li>
                </ul>
                <ul class="formDataItems flexPublic" v-for="item of dataInfo" :key="item.uid">
                    <li>{{item.Pdate.slice(0,10)}}</li>
                    <li :title="item.Pno">{{item.Pno}}</li>
                    <li>{{item.Abstract}}</li>
                    <li>{{item.JSum}}</li>
                    <li :title="item.DSum">{{item.DSum}}</li>
                    <li >{{JD[item.DType]}}</li>
                    <li>{{item.Balance}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import { AuxiliaryTypeListNo } from '@/api/Auxiliary/typeInfo'
    import { AuxiliaryList } from '@/api/Auxiliary/auxInfo'
    /**
     * 辅助项科目明细表
     */
    export default {
        name: "auxiliaryAc",
        data(){
            return{
                loading: false,
                department:'',
                JD:['平','借','贷'],
                auxiliaryType:[],
                auxiliaryLists:[

                ],
                defaultProps: {
                    children: 'children',
                    label: 'BaseName'
                },
                zwTime:0,
                otherState:0,
                otherStateList:[
                    {id:0,name:'全部'},
                    {id:1,name:'启用'},
                    {id:2,name:'停用'},
                    {id:3,name:'临时停用'}
                ],
                dataInfo:[]
            }
        },
        //计算属性
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
        watch: {
            department(val) {
                this.getAuxiliaryLists(val);
            }
        },
        created(){
            //获取辅助项类型
            this.getAuxiliaryTypeLists();
        },
        mounted(){

        },
        methods:{
            getData(param) {
                var typeSelect=this.auxiliaryType.filter(item => item.PhId===this.department);

                var data = {
                    OrgIds: this.orgid,
                    Year: '2018',
                    Del: param.PhId,
                    Type:typeSelect[0].GLS
                }
                this.$axios.get("/PVoucherMst/GetDetailAccountTAV",{ params:data })
                    .then(res=>{
                        this.loading = false;
                        if(res.Status==='error'){
                            this.$message({ showClose: true, message: res.Msg,type: 'error' })
                            return
                        }
                        this.dataInfo=res.Record;
                    })
                    .catch(err=>{
                        console.log(err)
                        this.loading = false;
                        this.$message({ showClose: true, message: '获取辅助项科目明细表错误!',type: 'error' })
                    })

            },
            //获取辅助项类型
            getAuxiliaryTypeLists(){
                var vm=this;
                this.loading = true;
                //辅助项类别
                AuxiliaryTypeListNo(vm,{
                    uid: this.uid,
                    orgid: this.orgid
                }).then(res => {
                    this.loading = false;
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    
                    let types=res.type;
                    
                    if(types.length>0){
                        this.auxiliaryType=types;
                        this.department=types[0].PhId
                        this.getAuxiliaryLists(types[0].PhId);
                    }

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({ showClose: true, message: '辅助项类型获取错误',type: 'error' })
                })
            },
            /**
             * 获取 辅助项详细明细
             * typeid:辅助项类型主键
             */
            getAuxiliaryLists(typeid){
                var vm=this;
                this.loading = true;
                //辅助项详细明细
                AuxiliaryList(vm,{
                    uid: this.uid,
                    orgid: this.orgid,
                    typeId:typeid
                }).then(res => {
                     this.loading = false;
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    this.auxiliaryLists=res.list;
                    //加载数据
                    if(res.list.length>0){
                        this.getData(res.list[0])
                    }

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({ showClose: true, message: '辅助项详细获取错误',type: 'error' })
                })
            },
            unionListOpen(data,$event){
                var e=$event.target;
                if(e.className=="moreList"){
                    e.className="moreList moreListOpen";
                    e.nextElementSibling.style.display='none';
                }
                else if(e.className=="moreList moreListOpen"){
                    e.className="moreList"
                    e.nextElementSibling.style.display='block';
                }
                console.log(data);
            },
            //辅助项选择
            handleNodeClick(data){
                //console.log(data);
                this.getData(data);
            }
        }
    }
</script>

<style scoped>
    .unionState>ul>li{
        width:100%;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2){
        width:15%;
    }
    .formData>ul>li:nth-of-type(3){
        width:24%;
    }
    .formData>ul>li:nth-of-type(4){
        width:18%;
    }
    .formData>ul>li:nth-of-type(5){
        width:18%;
    }
    .formData>ul>li:nth-of-type(6){
        width:5%;
    }
    .formData>ul>li:nth-of-type(7){
        width:10%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #2780d1;
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 70px;
        padding:0 2px;
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
    }
    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .unionLists{
        width:20%;
        align-self: flex-start;
        margin-right: 10px;
        margin-top: 10px;
    }
    .manageContent:before{
        content:"";
        display: inline-block;
    }
    .unionLists~.formData{
        width:80%;
        align-self: flex-start;
    }
    .unionLists>div.unionListsTitle{
        text-align: center;
        background: #83c350;
        height:50px;
        color:#fff;
        font-size: 15px;
        margin-bottom: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .unionListsContent ul{
        padding-left: 15px;
        position: relative;
    }
    .unionListsContent ul:before{
        content:"";
        height:100%;
        width:1px;
        border-left:1px dotted #aaa;
        position: absolute;
        left:7.5px;
    }
    .unionListsContent ul>li{
        position: relative;
    }
    .unionListsContent ul>li:before{
        content:"";
        position: absolute;
        width:7.5px;
        left:-7.5px;
        top:9px;
        border-top: 1px dotted #aaa;
    }
    .unionListsContent ul>li:last-child:after{
        content:"";
        height:100%;
        width:7.5px;
        position: absolute;
        left:-7.5px;
        top:10px;
        background: #fff;
    }
    div.moreList{
        position:relative;
    }
    div.moreList:before{
        content:"-";
        display: block;
        width:10px;
        height:10px;
        line-height: 10px;
        text-align: center;
        border:1px solid #333;
        background: #d5f3fe;
        position:absolute;
        left:-12px;
        top:3px;
        color:#333;
        z-index: 2;
    }
    div.moreListOpen:before{
        content:"+";
        line-height: 8px;
    }

</style>
