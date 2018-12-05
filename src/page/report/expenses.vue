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
            <ul class="flexPublic handle">
                <a href=""><li>打印</li></a>
                <el-button style='margin:0 0 20px 20px;' icon="document" @click="download" plain>导出</el-button>
            </ul>
        </div>
        <div class="formData">
            <tree-table 
                :data="inMoney" 
                :expand-all="expandAll" 
                :columns="columns" 
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                v-loading="loading"
                highlight-current-row
                border>
            </tree-table>
        </div>
    </div>
</template>

<script>
    /**
     * 收入支出表
     */
    import { IncomList,IncomListToExcel } from '@/api/voucher/reportInfo'
    import { mapState, mapActions } from 'vuex'
    import treeTable from "@/components/tree-table";
    import treeSum from './totalAmount'

    export default {
        name: "expensesRe",
        data(){
            return{
                downloadLoading:false,
                loading: false,
                expandAll: true,
                zwTime:'',
                columns: [
                    {
                        text: "编码",
                        value: "KCode",
                        width: 200
                    },
                    {
                        text: "名称",
                        value: "KName"
                    },
                    {
                        text: "本月数",
                        value: "StartSum"
                    },
                    {
                        text: "本年累计数",
                        value: "EndSum"
                    }
                ],
                //收入
                inMoney:[],
                userState:0,
                userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}]
            }
        },
        components: { treeTable },
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
        created(){

        },
        mounted(){

            this.getData();
        },
        methods:{
            getData(){
                //收入科目的数据
                var data = {
                    accountPeriod: '2018-11-03', //账期
                    isContainUncheck: '1',      //是否包含未审核的凭证(1=包含，0=不包含)
                };
                var vm=this;
                IncomList(vm,data).then(res => {
                    this.loading = false;
                    console.log(res);
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }

                    var data=res.Data;
                    var indata=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="4"
                    })

                    // indata[2].StartSum=12
                    // indata[2].EndSum=21

                    // indata[2].children[0].StartSum=22
                    // indata[2].children[0].EndSum=33

                    var indata_StartSum=0;
                    var indata_EndSum=0;
                    //var listArry=treeSum(indata);
                    treeSum(indata).forEach(item =>{
                        indata_StartSum +=item.StartSum;
                        indata_EndSum +=item.EndSum
                    })

                    var outdata=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="5"
                    })

                    var outdata_StartSum=0;
                    var outdata_EndSum=0;
                    //var listArry2=treeSum(outdata);
                    treeSum(outdata).forEach(item =>{
                        outdata_StartSum +=item.StartSum;
                        outdata_EndSum +=item.EndSum
                    })

                    var newdata=new Array();

                    this.inMoney=newdata.concat([{
                        KCode:'一、收入',
                        KName:'',
                        StartSum:'',
                        EndSum:''
                    }],indata,[{
                        KCode:'',
                        KName:'本期合计收入',
                        StartSum:indata_StartSum,
                        EndSum:indata_EndSum
                    }],[{
                        KCode:'二、支出',
                        KName:'',
                        StartSum:'',
                        EndSum:''
                    }],outdata,[{
                        KCode:'',
                        KName:'本期合计支出',
                        StartSum:outdata_StartSum,
                        EndSum:outdata_EndSum
                    }])

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({ showClose: true,  message: '收入科目获取错误',  type: 'error' })
                })

            },
            download(){

                //var data=this.inMoney
                // let param = {'infoData':this.inMoney};

                // this.$axios({
                //     method:'post',
                //     url:'/PVoucherMst/PostIncomAndExpenditureExcel',
                //     data:param,
                //     responseType:'blob'
                // }) .then(res => {
                //     console.log(res);
                // }).catch(err => {
                //     console.log(err)
                // })

                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
                    const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
                    const list = this.list
                    const data = this.formatJson(filterVal, list)
                    excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.filename,
                    autoWidth: this.autoWidth
                    })
                    this.downloadLoading = false
                })

            },
            // 下载文件
            downloadFile (data) {
                if (!data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', 'excel.xlsx')
                
                document.body.appendChild(link)
                link.click()
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
        width:25%;
    }
    .formData>ul>li:nth-of-type(3){
        width:25%;
    }

    .formData>ul:first-child>li:last-of-type{
        /* border-right:1px solid #2780d1; */
    }

    .formData>ul>li:first-child{
        width:50%;
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
    .formData>ul.formDataItems>li:first-of-type{
        text-align: left;
    }
    .manageContent>.formData>ul.formDataItems>li:first-of-type{
        width:50%;
        padding-left: 10px;
    }
    .manageContent>.formData>ul.formDataList>li{
        padding-left: 15px;
        width:25%;
    }
    .manageContent>.formData>ul.formDataList>li:first-of-type{
        width:25%;
    }
    .align-center{
        text-align: center!important;
    }

</style>
