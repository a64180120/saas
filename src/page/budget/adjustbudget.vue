<template>
    <div class="container">
    <div class="manageContent" v-loading="loading">
        <div class="reportBox">
            <div class="unionState flexPublic">
                <ul class="flexPublic">
                    <li class="flexPublic">
                        <!--<div>账期:</div>-->
                        <!--<div class="block selectContainer">-->
                            <!--<el-date-picker-->
                                <!--v-model="date1"-->
                                <!--type="date"-->
                                <!--placeholder="选择日期">-->
                            <!--</el-date-picker>-->
                        <!--</div>-->
                    </li>
                </ul>
                <ul class="flexPublic handle">
                    <el-button style='margin:0 0 0px 20px;' class="el-button--small" icon="el-icon-lx-mail" @click="changeBtnC">{{changeBtn.title}}</el-button >
                    <el-button style='margin:0 0 0px 20px;' class="el-button--small" icon="el-icon-lx-mail" @click="printContent">打印</el-button >
                    <el-button style='margin:0 0 0px 20px;' class="el-button--small" icon="el-icon-lx-down" @click="postBalanceSheetExcel" :loading="downloadLoading">导出</el-button >
                </ul>
            </div>
            <div class="formData" id="form1" ref="printFrom">
            <ul>
                <li>编号</li>
                <li>名称</li>
                <li>年初核定预算数</li>
                <li>预算调整数</li>
                <li>调整后预算数</li>
                <li>说明</li>
            </ul>
            <template v-for="(item,index) in budgetList">
                <template v-if="item.SubjectCode=='BNSRHJ'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input disabled type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal">
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </template>

                <template v-else-if="item.SubjectCode=='BNZCHJ'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input disabled type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal">
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            <input type="text" v-bind:disabled="changeBtn.disable" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>

                <template v-else-if="item.SubjectCode=='BNJY'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input disabled type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal">
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text"  v-bind:index="index" v-bind:placeholder="item.Description" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>

                <template v-else-if="item.SubjectCode=='SNJY'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input disabled type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal">
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>

                <template v-else-if="item.SubjectCode=='BNSHTZ'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input v-bind:disabled="changeBtn.disable" type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal"  v-bind:index="index" v-bind:code="item.SubjectCode"  v-on:input="inputLis" >
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>

                <template v-else-if="item.SubjectCode=='BNTZ'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input  v-bind:disabled="changeBtn.disable" type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal"  v-bind:index="index" v-bind:code="item.SubjectCode"  v-on:input="inputLis" >
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>

                <template v-else-if="item.SubjectCode=='BNTQHBJ'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input disabled type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal">
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>

                <template v-else-if="item.SubjectCode=='QMGCJY'">
                    <ul class="formDataItems flexPublic">
                        <li></li>
                        <li class="align-center bolder">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <input disabled type="number" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal" >
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            其中：政府补助结余：<input  v-bind:disabled="changeBtn.disable"class="other" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>

                <template v-else-if="item.k_name!='未找到该科目编码对应的科目'">
                    <ul class="formDataItems flexPublic">
                        <li v-bind:class="{'align-center':item.Layers==1}">{{item.SubjectCode}}</li>
                        <li v-bind:class="{'align-center':item.Layers==1}">{{item.k_name}}</li>
                        <li>{{item.BudgetTotal}}</li>
                        <li>
                            <template v-if="item.Layers==0">
                                <input disabled type="number" v-bind:code="item.SubjectCode" v-bind:value="item.ApprovedBudgetTotal-item.BudgetTotal">
                            </template>
                            <template v-else>
                                <input  v-bind:disabled="changeBtn.disable" type="number" v-bind:index="index" v-bind:code="item.SubjectCode"  v-on:input="inputLis" :value="item.ApprovedBudgetTotal-item.BudgetTotal">
                            </template>
                        </li>
                        <li>{{item.ApprovedBudgetTotal}}</li>
                        <li>
                            <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description" v-bind:index="index" v-on:input="inputDicription">
                        </li>
                    </ul>
                </template>
            </template>
        </div>
        </div>
        <div class="timeSelectBox">
            <time-select-bar @item-click="dateChoose"></time-select-bar>
        </div>
    </div>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import { mapState, mapGetters } from "vuex";
    import TimeSelectBar from "../../components/TimeSelectBar/index";

    let balanceData=[];
    export default {
        name: "user",
        data(){
            return{
                userState:0,
                downloadLoading: false,
                userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}],
                dataInfo:[
                    {PhId:1,PDate:'2018-01-01',Abstract:'test1', PNo:'0001',JSum:'1111',DSum:'1111',JD:'1',money:'2222'},
                    {PhId:1,PDate:'2018-02-01',Abstract:'test2', PNo:'0001',JSum:'333',DSum:'',JD:'2',money:'3333'},
                    {PhId:1,PDate:'2018-03-01',Abstract:'test3', PNo:'0001',JSum:'',DSum:'333',JD:'0',money:'4444'}
                ],
                changeBtn:{
                    flag:true,
                    title:'编辑',
                    disable:true,
                },
                budgetList:[],//数据库查询的全部数据
                code_first:[],//一级科目数据
                code_firstCount:[],//一级科目数据对应的合计数
                specialSubIndex:[],//特殊科目对应的下标数组，用于计算
                date1:'',
                proofType:'0',
                loading:false
            }
        },
        components: {TimeSelectBar},
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds
            }),
        },
        mounted(){
            this.getMiddleYear();
        },
        methods:{

            /*
            * 监听编辑按钮事件
            * */
            changeBtnC:function(){
                if(this.changeBtn.flag){
                    if(this.changeBtn.disable){
                        this.changeBtn.title='保存';
                        this.changeBtn.disable=false;
                    }else{
                        this.saveChange();
                        this.changeBtn.title='编辑';
                        this.changeBtn.disable=true;
                    }
                }
            },
            /*
            * 修改保存
            * */
            saveChange:function(){
                this.loading=true;
                let that=this;
                this.$axios.post(
                    'PSubjectBudget/PostSave',
                    {
                        "uid": this.userid,
                        "orgid": this.orgid,
                        "infodata": this.budgetList
                    }
                ).then(function(res){
                    that.loading=false;
                    alert(res.Msg);
                }).catch(function(err){
                    console.log(err);
                })

            },
            /*
            * 监听数据输入
            * */
            inputLis:function(val){
                //alert(val);
                // console.log(val);
                let code = val.target.attributes.code.value;//当前修改数据的code
                let index=val.target.attributes.index.value;//当前修改数据在列表中的下标
                let in_value = parseFloat(val.target.value);//input数据转数字
                let code_first=this.code_first;//一级科目数据列表
                if(!isNaN(in_value)){
                    if(code=='BNSHTZ'){
                        this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal)-(parseFloat(this.budgetList[index].ApprovedBudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal))+in_value
                    }else if(code=='BNTZ'){
                        this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal)+(parseFloat(this.budgetList[index].ApprovedBudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal))-in_value
                    }
                    else{
                        //本年投资输入
                        for(let i in this.budgetList){
                            //通过截取code确定对应的一级科目
                            let len = this.budgetList[i].SubjectCode.length;
                            let codeSub = code.substring(0,len);
                            if(codeSub==this.budgetList[i].SubjectCode&&code.length!=len){

                                this.budgetList[i].ApprovedBudgetTotal=parseFloat(this.budgetList[i].ApprovedBudgetTotal)- (this.budgetList[index].ApprovedBudgetTotal-this.budgetList[index].BudgetTotal)+in_value;
                                console.log(this.budgetList[i].ApprovedBudgetTotal);
                                //console.log(this.code_firstCount);
                                //判断修改的数据是在收入合计之前还是在支出合计之前
                                if(parseFloat(index) < parseFloat(this.specialSubIndex['BNSRHJ'])){
                                    //收入合计更改
                                    this.budgetList[this.specialSubIndex['BNSRHJ']].ApprovedBudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['BNSRHJ']].ApprovedBudgetTotal)-(parseFloat(this.budgetList[index].ApprovedBudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal))+in_value

                                    //滚存结余更改
                                    this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal)-(parseFloat(this.budgetList[index].ApprovedBudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal))+in_value
                                    //修改输入列的合计
                                    this.budgetList[index].ApprovedBudgetTotal=this.budgetList[index].BudgetTotal+in_value;
                                    // this.code_firstCount['BNSRHJ']=parseFloat(this.budgetList[this.specialSubIndex['BNSRHJ']].FinalaccountsTotal)-parseFloat(this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal)+in_value;
                                    //修改输入列的滚存结余
                                    //this.code_firstCount['QMGCJY']=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].FinalaccountsTotal)-parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)+in_value;
                                }else{
                                    //支出合计更改
                                    this.budgetList[this.specialSubIndex['BNZCHJ']].ApprovedBudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['BNZCHJ']].ApprovedBudgetTotal)-(parseFloat(this.budgetList[index].ApprovedBudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal))+in_value
                                    this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal)+(parseFloat(this.budgetList[index].ApprovedBudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal))-in_value
                                    //修改输入列的支出合计
                                    this.budgetList[index].ApprovedBudgetTotal=this.budgetList[index].BudgetTotal+in_value;
                                    //this.code_firstCount['BNZCHJ']=parseFloat(this.budgetList[this.specialSubIndex['BNZCHJ']].ApprovedBudgetTotal)-parseFloat(this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal)+in_value;
                                    //修改输入列的滚存结余
                                    //this.code_firstCount['QMGCJY']=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal)-parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)-in_value;
                                }
//确定修改的对应一级科目，进行计算，先减去该科目的原数据，在加上修改后的数据，得到对应一级科目的总和
                                console.log(this.budgetList[i].ApprovedBudgetTotal);
                                this.code_firstCount[codeSub]=parseFloat(this.budgetList[i].ApprovedBudgetTotal)-parseFloat(this.budgetList[i].BudgetTotal);
                                console.log(this.code_firstCount[codeSub]);
                                //计算本年结余
                                this.budgetList[this.specialSubIndex['BNJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNSRHJ']].ApprovedBudgetTotal-this.budgetList[this.specialSubIndex['BNZCHJ']].ApprovedBudgetTotal;

                            }
                        }
                    }
                    //修改该科目在总list中的数据
                    this.budgetList[index].ApprovedBudgetTotal=in_value+this.budgetList[index].BudgetTotal;
                }
            },
            /*
            * 监听说明的input输入
            * */
            inputDicription:function(val){
                //alert(val);
                console.log(val);
                //let code = val.target.attributes.code.value;//当前修改数据的code
                let index=val.target.attributes.index.value;//当前修改数据在列表中的下标
                let in_value = val.target.value;//input数据转数字
                console.log(in_value);
                this.budgetList[index].Description=in_value;
                console.log(this.budgetList[index].Description);
            },
            dateChoose:function(val){
                let time=val.choosedYear+'-'+ val.choosedMonth;
                this.date1=time;
                this.getMiddleYear();
            },
            /*
             *时间处理方法
             *  */
            getParamTime(param){
                let nowtime ='';
                if(param==null||param==undefined||param==''){
                    nowtime = new Date();
                }else{
                    nowtime = new Date(param);
                }
                let year=nowtime.getFullYear();
                let month=nowtime.getMonth()+1;
                month<10?month='0'+month:month;
                let day=nowtime.getDate();
                day<10?day='0'+day:day;
                return param=year+'-'+month+'-'+day;
            },
            /*数据查询接口*/
            getMiddleYear:function(){
                let data={
                    "uid": this.userid,
                    "orgid":this.orgid,
                    "Year":  this.getParamTime(this.date1).substring(0,4),
                    "OrgIds": this.orgid,
                }
                this.loading=true;
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'PSubjectBudget/GetMiddleYear',
                    {params:data}
                ).then(res=>{
                    this.loading=false;
                    let code_first=[],//存放一级科目
                        code_firstCount={},//存放一级科目对应预算数
                        specialSubIndex={};//存放特殊的科目

                    //循环遍历，得到一级子目录一级对应的预算数
                    //计算上年决算数对应的本年合计收入，以及本年支出合计
                    // 得到  本年收入合计,本年支出合计，本年结余，上年结余，收回投资，本年投资，本年提取后备金，期末滚存结余  对应数组用于计算

                    for(var i in res.Record){
                        res.Record[i].OrgId=this.orgid;
                        res.Record[i].OrgCod=this.orgcode;
                        res.Record[i].Uyear=this.getParamTime(this.date1).substring(0,4);
                        if(res.Record[i].k_name == 'BNSRHJ'){
                            alert('BNSRHJ');
                        }
                        if(res.Record[i].Layers=='0'){
                            code_first.push(res.Record[i]);//一级科目
                            code_firstCount[res.Record[i].SubjectCode]=res.Record[i].ApprovedBudgetTotal-res.Record[i].BudgetTotal;//本年一级科目调整后预算数
                        }
                        //计算上年决算数对应的本年合计收入，以及本年支出合计
                        // 得到  本年收入合计,本年支出合计，本年结余，上年结余，收回投资，本年投资，本年提取后备金，期末滚存结余  对应下标用于计算
                        if( res.Record[i].SubjectCode == 'BNSRHJ'||     //本年收入合计
                            res.Record[i].SubjectCode == 'BNZCHJ'||    //本年支出合计
                            res.Record[i].SubjectCode == 'BNJY'||      //本年结余
                            res.Record[i].SubjectCode == 'SNJY'||      //上年结余
                            res.Record[i].SubjectCode == 'BNSHTZ'||    //收回投资
                            res.Record[i].SubjectCode == 'BNTZ'||      //本年投资
                            res.Record[i].SubjectCode == 'BNTQHBJ'||   //本年提取后备金
                            res.Record[i].SubjectCode == 'QMGCJY'){    //期末滚存结余
                            specialSubIndex[res.Record[i].SubjectCode]=i;
                        }
                    }
                    this.budgetList=res.Record;
                    this.code_first = code_first;
                    this.code_firstCount = code_firstCount;
                    this.specialSubIndex = specialSubIndex;
                }).catch(res=>{
                    console.log(res);
                })
            },

            /*
            *author:hyz
            *导出资产负债表Excel表格
            * 接口：PVoucherMst/PostBalanceSheetExcel
            * 参数：Data--资产负债表数据的整个data
            * */
            postBalanceSheetExcel:function() {
                let param = {'uid':this.uid,
                    'orgid':this.orgid,
                    'infoData': this.budgetList};

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method: 'post',
                    url: '/PsubjectBudget/PostExportEndYear',
                    data: param
                }).then(res => {
                    console.log(res);
                    window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            //下载文件
            fileDownload (data,fileName){
                if (!data) {
                    return
                }
                // let fileName = res.headers['content-disposition'].split('=')[1];
                // let fileName2 = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0];

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
            printLodop() {
                const me = this
                var html=this.$refs.printFrom.innerHTML;
                let  LODOP = getLodop();
                LODOP.PRINT_INIT("资产负债表");      //首先一个初始化语句
                LODOP.SET_PRINT_STYLE("FontSize", 18);  //字体
                LODOP.SET_PRINT_STYLE("Bold", 1);
                //LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
                LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "资产负债表");
                LODOP.ADD_PRINT_HTM(88, 200, 350, 600,html);
                //LODOP.PRINT();
                LODOP.PREVIEW();
            },
            // 打印
            printContent(e){
                // let subOutputRankPrint = this.$refs.printFrom;
                // console.log(subOutputRankPrint.innerHTML);
                // let newContent =subOutputRankPrint.innerHTML;
                // let oldContent = document.body.innerHTML;
                // document.body.innerHTML = newContent;
                // window.print();
                // window.location.reload();
                // document.body.innerHTML = oldContent;
                // return false;

                this.$print(this.$refs.printFrom) // 使用
            }

        }
    }
</script>

<style scoped>
    .reportBox{
        margin-right: 60px;
    }
    .timeSelectBox{
        position: fixed;
        right: 0;
        top: 110px;
        bottom:0;
        width: 60px;
    }
    .pinzheng{
        margin-left: 120px;
    }
    .unionState>ul>li{
        width:100%;
    }
    .formData{
        margin-bottom: 50px;
    }
    .formData>ul>li{
        border-right:1px solid #ebeef5;;
        height:50px;
        line-height:50px;
        text-align: center;
        width:15%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #2780d1;
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 70px;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(2){
        width:20%;
        min-width: 210px;
        padding:0 2px;
    }
    .formData>ul>li:last-child{
        width:25%;
        min-width: 210px;
        padding:0 2px;
    }

    .formDataItems{
        border-bottom:1px solid #ebeef5;
        background: white;
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
    .formData>ul.formDataItems>li.bolder{
        font-weight: bold;
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
    .formData>ul.formDataItems>li{
        text-align: left;
        padding:0 15px;
    }
    .formData>ul.formDataItems>li.align-center{
        padding:0;
        text-indent: 40px;
    }
    .formData>ul.bottomForm>li{
        border:none;
        text-align: right;
        height:55px;
        line-height: 55px;
    }
    .formData>ul.bottomForm>li:last-child{
        border-right:1px solid #ddd;
    }
    input{
        border: none;
        line-height: 40px;
        height: 40px;
        width: 100%;
        text-align: right;
    }
    input.other{
        width:45%;
    }
</style>

