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
                    <div class="unionListsTitle">科目列表 &nbsp;
                        <div >
                            <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
                        </div>
                    </div>
                    <div class="unionListsContent">
                        <el-tree
                            class="filter-tree"
                            :data="subjectLists"
                            :props="defaultProps"
                            default-expand-all
                            node-key="PhId"
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"
                            ref="subjectTree">
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
    import {delList} from '../../../api/detailaccount/details.js'
    import { mapState, mapActions } from 'vuex'
    import { SubjectList } from '@/api/subject/subjectInfo'

    /**
     * 明细表
     */
    export default {
        name: "detailsAc",
        data() {
            return {
                loading: false,
                JD: ['平', '借', '贷'],
                filterText:'',
                subjectLists: [],
                selectItem:'',
                defaultProps: {
                    children: 'children',
                    label: 'KName'
                },
                zwTime:'', //账期 开始时间 结束时间  [ "2018-12-07", "2019-01-11" ]
                auxiliary:0,  //显示辅助项
                pageSize: 40, //pageSize
                pageIndex: 1, //pageIndex
                totalCount: 0, //总页数
                dataInfo: []
            }
        },
        created() {
            
            //获取科目属性列表
            this.getSubjectData();
        },
        mounted() {

        },
        watch: {
            filterText(val) {
                this.$refs.subjectTree.filter(val);
            }
        },
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
        methods: {
            getData(param) {
                var data = {
                    uid: this.uid,
                    OrgIds: this.orgid,
                    Kcode: param.KCode||'',
                    Year: param.Uyear|| '',
                    pagesize:this.pageSize,
                    pageindex:this.pageIndex- 1
                };

                this.loading = true;
                 this.$axios.get("/PVoucherMst/GetDetailAccount",{params:data})
                    .then(res=>{
                        this.loading = false;
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.dataInfo=res.Record;
                        this.totalCount=res.totalRows;
                    })
                    .catch(err=>{
                        console.log(err)
                        this.loading = false;
                        this.$message({ showClose: true, message:'获取科目明细错误',type: 'error' })
                    })


            },
            async getSubjectData(){
                var vm=this;
                this.loading = true;

                //科目列表
                SubjectList(vm,{
                    uid: this.uid,
                    orgid: this.orgid
                }).then(res => {
                    this.loading = false;
                    //console.log(res);
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    this.subjectLists=res;

                    if(res.length>0){
                        this.selectItem=res[0];
                        //加载第一个科目的明细
                        this.getData(res[0]);
                    }

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({
                        showClose: true,
                        message: '科目列表获取错误',
                        type: 'error'
                    })
                })

            },
            unionListOpen($event) {
                var e = $event.target;
                if (e.className == "moreList") {
                    e.className = "moreList moreListOpen";
                    e.nextElementSibling.style.display = 'none';
                }
                else if (e.className == "moreList moreListOpen") {
                    e.className = "moreList"
                    e.nextElementSibling.style.display = 'block';
                }
            },
            //科目过滤
            filterNode(value, data) {
                if (!value) return true;
                return data.KName.indexOf(value) !== -1;
            },
            //科目选择
            handleNodeClick(data){
                //console.log(data);
                //this.selectItem=data;
                this.getData(data);
            }
        },
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
    .unionLists>p{
        text-align: center;
        background: #83c350;
        height:50px;
        line-height: 50px;
        color:#fff;
        font-size: 15px;
        margin-bottom: 5px;

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
        cursor: pointer;
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
