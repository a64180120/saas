<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent" v-loading="loading">
            <div class="reportBox">
            <div class="unionState flexPublic">
                <ul class="flexPublic">
                    <li class="flexPublic">
                        <div>条件：</div>
                        <div  class="block selectContainer">
                            <select class="el-input__inner el-button--small" v-model="proofType">
                                <option value="1">包含未审核凭证</option>
                                <option value="0">不包含未审核凭证</option>
                            </select>
                        </div>
                    </li>
                </ul>
                <ul class="flexPublic handle">
                    <a><li style='margin:0 0 0px 10px;' icon="el-icon-lx-down" @click="download" size="small" plain>导出</li></a>
                    <a><li style='margin:0 0 0px 10px;' icon="el-icon-lx-mail" @click="printContent" size="small" plain>打印</li ></a>

                    <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                </ul>
            </div>
            <div class="formData" ref="printFrom">
                <tree-table
                    :isindex="false"
                    :data="inMoney"
                    :expand-all="expandAll"
                    node-key="KCode"
                    :columns="columns"
                    :header-cell-style="{background:'#d3e9f9',color:'#000','text-align':'center'}"
                    v-loading="loading"
                    highlight-current-row
                    :extraheight='extraheight'
                    border>
                </tree-table>
                <!--<ul>
                    <li v-for="item in columns">{{item.text}}</li>
                </ul>
                <ul v-for="">

                </ul>-->
            </div>
            </div>
            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose" :showtype="'singleTime'"></time-select-bar>
            </div>
        </div>
       </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    /**
     * 收入支出表
     */
    import { IncomList,IncomListToExcel } from '@/api/voucher/reportInfo'
    import { mapState, mapActions } from 'vuex'
    import treeTable from "@/components/tree-table/indexHeight";
    import treeSum from './totalAmount'
    import TimeSelectBar from "../../components/TimeSelectBar/index";
    import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import saasMsg from '../finance/message'
    export default {
        name: "expensesRe",
        data(){
            return{
                extraheight:300,
                downloadLoading:false,
                loading: false,
                expandAll: true,
                zwTime:'',
                columns: [
                    {
                        text: "编码",
                        value: "KCode",
                        width: 200,
                        'text-indent': '40px'
                    },
                    {
                        text: "名称",
                        value: "KName",
                        align:'center'
                    },
                    {
                        text: "本月数(元)",
                        value: "StartSum",
                        align:'right'
                    },
                    {
                        text: "本年累计数(元)",
                        value: "EndSum",
                        align:'right'
                    }
                ],
                //收入
                inMoney:[],
                userState:0,
                userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}],
                proofType:'1',
                date1:[],
                loading:false,
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
            }
        },
        components: { treeTable,TimeSelectBar,saasMsg },
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
        watch:{
            // /*
            // *监听日期选择，根据所选的日期以及凭证调用资产负债数据查询方法
            // * */
            // date1:function(){
            //     this.getData(this.date1,this.proofType);
            // },
            proofType:function(){
                this.getData(this.date1,this.proofType);
            }
        },
        methods:{
            changeData:function(res){
                for(var i in res){
                    res[i].StartSum=this.changeNum(res[i].StartSum);
                    res[i].EndSum=this.changeNum(res[i].EndSum);
                    if(res[i].children!=[]){
                        this.changeData(res[i].children)
                    }
                }
                return res;
            },
            dateChoose:function(val){
                console.log(val);
                this.date1=val;
                this.getData()
            },

            getData:function(){
                let param='';
                if(this.date1.choosedYear==undefined||this.date1.choosedYear==''){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    param=currentyear+'-'+currentMonth;
                }else{
                    param=this.date1.choosedYear+'-'+this.date1.choosedMonth;
                }
                this.loading=true;
                //收入科目的数据
                var data = {
                    accountPeriod: param, //账期
                    isContainUncheck: this.proofType,      //是否包含未审核的凭证(1=包含，0=不包含)
                    orgid:this.orgid
                };
                var vm=this;
                IncomList(vm,data).then(res => {
                    this.loading = false;
                    if(res.Status==='error'){
                        this.saasMessage={
                            message:res.Msg,
                            delay:3000,
                            visible:true
                        };
                        //this.$message.error(res.Msg);
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

                    var indata_StartSum=Math.floor(0);
                    var indata_EndSum=Math.floor(0);
                    treeSum(indata).forEach(item =>{
                        indata_StartSum +=Math.floor(item.StartSum);
                        indata_EndSum +=Math.floor(item.EndSum)
                    })
                    var outdata=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="5"
                    })

                    var outdata_StartSum=Math.floor(0);
                    var outdata_EndSum=Math.floor(0);
                    //var listArry2=treeSum(outdata);
                    treeSum(outdata).forEach(item =>{
                        outdata_StartSum +=Math.floor(item.StartSum);
                        outdata_EndSum +=Math.floor(item.EndSum)
                    })

                    var newdata=new Array();
                    indata=this.changeData(indata);
                    outdata=this.changeData(outdata);
                    this.inMoney=newdata.concat([{
                        KCode:'一、收入',
                        KName:'',
                        StartSum:'',
                        EndSum:''
                    }],indata,[{
                        KCode:'',
                        KName:'本期合计收入',
                        StartSum:this.changeNum(indata_StartSum),
                        EndSum:this.changeNum(indata_EndSum)
                    }],[{
                        KCode:'二、支出',
                        KName:'',
                        StartSum:'',
                        EndSum:''
                    }],outdata,[{
                        KCode:'',
                        KName:'本期合计支出',
                        StartSum:this.changeNum(outdata_StartSum),
                        EndSum:this.changeNum(outdata_EndSum)
                    }])

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.saasMessage={
                        message:'收入科目获取错误',
                        delay:3000,
                        visible:true
                    };
                    //this.$message({ showClose: true,  message: '收入科目获取错误',  type: 'error' })
                })

            },
            changeNum:function(value) {
                if(!value) return '0.00';

                /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
                var intPart =  Number(value)|0; //获取整数部分
                var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

                var floatPart = ".00"; //预定义小数部分
                var value2Array = value.toString().split(".");

                //=2表示数据有小数位
                if(value2Array.length == 2) {
                    floatPart = value2Array[1].toString(); //拿到小数部分

                    if(floatPart.length == 1) { //补0,实际上用不着
                        return intPartFormat + "." + floatPart + '0';
                    } else {
                        return intPartFormat + "." + floatPart;
                    }

                } else {
                    return intPartFormat + floatPart;
                }

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
                import('@/plugins/Excel/Export2Excel').then(excel => {
                    const tHeader = ['编码', '名称', '本月数', '本年累计数']
                    const filterVal = ['KCode', 'KName', 'StartSum', 'EndSum']
                    const list = treeSum(this.inMoney)
                    const data = this.formatJson(filterVal, list)
                    excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.filename,
                    autoWidth: true
                    })
                    this.downloadLoading = false
                })

            },
            //时间格式转换
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
            // 下载文件
            downloadFile (data) {
                if (!data) {
                    return
                }

                let blob = new Blob([data],{type:'application/octet-stream'});
                let filename = fileName || "filename.xls";

                if (typeof window.navigator.msSaveBlob !== "undefined") {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var blobURL = window.URL.createObjectURL(blob);
                    var tempLink = document.createElement("a");
                    tempLink.style.display = "none";
                    tempLink.href = blobURL;
                    tempLink.setAttribute("download", filename);
                    if (typeof tempLink.download === "undefined") {
                        tempLink.setAttribute("target", "_blank");
                    }
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    window.URL.revokeObjectURL(blobURL);
                }
            },
            //打印
            printContent(){
                this.$print(this.$refs.printFrom) // 使用
            },
            printLodop() {
                /**
                 * Lodop专有样式和属性有：
                   ●代码中若包含style="page-break-after:always"或style="page-break-before:always"，该元素称为“强制分页元素”，控件会在该元素处分页。
                   ●代码中的标签IMG如果有transcolor属性，则可以实现透明打印图片。例如属性格式为：transcolor="#FFFFFF"表示用白色作为透明底色，这里的颜色值可以是“#”加三色16进制值组合，也可以是英文颜色名。这个专有属性再配合IMG的position: absolute可以实现“先字后章”的公章打印效果。
                   ●代码中的元素如果包含borderthin属性，如果属性值等于true,则该元素的border在合并单元格时会采用单细线模式。
                 */
                const me = this
                var html=this.$refs.printFrom.innerHTML;
                //console.log(html);
                let LODOP = getLodop();
                LODOP.PRINT_INIT("收入支出表");      //打印初始化
                LODOP.SET_PRINT_PAGESIZE(3, 0, 0, "A4");  //设定纸张大小
                LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "收入支出表");
                LODOP.ADD_PRINT_HTM(30, "10mm", "RightMargin:10mm", "BottomMargin:10mm",html);
                LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);//横向时转换为正向不需要手动旋转
                LODOP.SET_SHOW_MODE("NP_NO_RESULT", true);
                //LODOP.PRINT();  //直接打印不进行预览
                LODOP.PREVIEW();  //先预览再打印
            },
            //刷新
            refresh:function(){
                this.getData();
            }
        }
    }
</script>
<!--<style>
   .reportBox>formData> .el-table>.el-table__body-wrapper>table>tbody>tr>td:nth-of-type(4) .cell{
        text-align: right;
    }
</style>-->
<style scoped>
   /* .reportBox{
        margin-right: 60px;
    }
    .timeSelectBox{
        position: fixed;
        right: 0;
        top: 110px;
        bottom:0;
        width: 60px;
        z-index: 2;
    }*/
    .unionState>ul>li{
        width:100%;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:35%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2){
        width:20%;
    }
    .formData>ul:first-child>li:last-of-type{
        /* border-right:1px solid #2780d1; */
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 70px;
        padding:0 2px;
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
    }.selectContainer>select {
         background-color: transparent;
         line-height: 30px;
     }
   .bolder{
       font-weight: bold;
   }
</style>
