<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px;overflow: hidden">

                        <div style="width:100%;float: right" id="elSelf" >
                            <ul  class="flexUl handle" style="float: left;line-height: 30px">

                                <el-select placeholder="剔除条件" value="剔除条件" style="width: 100px;">
                                    <el-option value="0">
                                        <el-checkbox v-model="enabledMark" @change="getAccountAllData">剔除禁用账户</el-checkbox>
                                    </el-option>
                                </el-select>
                            </ul>
                            <ul class="flexUl handle">
                                <li @click="postBalanceSheetExcel">导出</li >
                                <li @click="showPrintArea">打印</li >
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                            <ul  class="flexUl handle" style="line-height: 30px;width: 200px;">
                                <el-input placeholder="请输入要搜索的项目" v-model="inputKvalue" :clearable="true"></el-input>
                                <!--<div class="searcherValue"><input type="text" placeholder="项目" v-model="inputKvalue"></div>
                                <div  class="searcherBtn" @click="searchCode">搜索</div>-->
                            </ul>
                        </div>
                    </div>

                    <div class="formData">
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>项目</td>
                                    <td>期初</td>
                                    <td>借方发生(收入)</td>
                                    <td>贷方发生(支出)</td>
                                    <td>期末余额</td>
                                </tr>
                                </thead>

                            </table>
                        </div>
                        <div class="tbBody"  id="ts">
                            <table ref="printFrom">
                                <colgroup>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                </colgroup>
                                <tbody>
                                <template v-if="accountAllData.length>0">
                                    <!--数据是两层数组，所以要两个循环-->
                                    <template v-for="item in accountAllData">
                                        <template v-for="detail in item">
                                            <tr :class="{'blueTd':detail.name=='差额','checkTd':detail.name.indexOf(inputKvalue)>=0&&inputKvalue!=''}">
                                                <td :style="{'font-weight':(detail.k_name!=''||detail.name=='差额'?'900':'300'),'text-indent':(detail.k_name!=''||detail.name=='差额'?'10px':'25px')}">{{(detail.k_name!=''?(detail.k_code+'-'):'')+detail.name}}</td>
                                                <td class="right">{{detail.qc_sum | NumFormat}}</td>
                                                <td class="right">{{detail.ye_j_sum | NumFormat}}</td>
                                                <td class="right">{{detail.ye_d_sum | NumFormat}}</td>
                                                <td class="right">{{detail.qm_sum | NumFormat}}</td>
                                            </tr>
                                        </template>

                                    </template>
                                </template>
                                <template v-else>
                                    <tr style="border-top: #00b7ee;">
                                        <td colspan="5" class="center" style="border-bottom-color: #00B8EE">当前搜索数据为空</td>
                                    </tr>
                                </template>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose" :showtype="'doubleTime'"></time-select-bar>
                </div>
            </div>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <message :message="saasMessage.message" :visible.sync="saasMessage.visible"></message>
        <!--打印预览界面-->
        <div id="covCon" class="cover" :style="{'display':(showPrint?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30px;left:40px;right: 40px;margin-top: 0;margin-left:0;">
                <div id="covTil" class="" style="text-align: left">
                    <span>打印预览界面</span>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right;float: right;padding-top: 4px;margin-left: 50px;" @click="closePrintArea"></i>
                    <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right' @click="printContent">打印</a>
                    <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right;color: #333333' @click="closePrintArea">取消</a>
                </div>
                <div id="printContentArea" style="margin-bottom: 20px">

                </div>
                <ul class=" handle" style="margin-bottom: 20px;margin-top: 20px">
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import httpConfig from '@/util/ajaxConfig';

    export default {
        name: "accountAll",
        data(){
            return{
                inputKvalue:'',//搜索框输入内容
                showPrint:false,//显示打印预览页面
                enabledMark:true,//是否剔除禁用账户
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'' //消息主体内容**************
                },
                date1:{choosedYear:'',
                    choosedYearEnd:'',
                    choosedMonth:'',
                    choosedMonthEnd:''},
                accountAllData:[],//存放页面表格渲染数据
            }
        },
        components: {TimeSelectBar},
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                orgName:state=>state.user.orgName,
                userid:state=>state.user.userid,
                user:state=>state,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
                dbname:state=>state.user.dbname,
            })
        },
        mounted(){
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
            this.getAccountAllData();
        },
        methods:{
            //滚动事件
            handleScroll: function () {
                let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                // 设备/屏幕高度
                let scObj = document.getElementById('covCon');//打印区域滚动
                if(scObj==undefined){
                    window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件
                }else{
                    if(scObj.scrollTop>35){
                        document.getElementById('covTil').classList.add('fixTitle');
                    }else{
                        document.getElementById('covTil').classList.remove('fixTitle');
                    }
                }
            },
            getAccountAllData:function(){
                let loading=this.$loading();
                let data={
                    orgid:this.orgid,
                    year:this.date1.choosedYear,
                    month:this.date1.choosedMonth,
                    enabledMark:this.enabledMark?0:1,//0启用，1禁用，剔除禁用，表示只查询启用
                    parameter:'',
                };
                this.$axios.get('Cashier/GetCashierReport',{params:data}).then(res=>{
                    if(res.length>0){
                        let data=res;
                        let cutIndex=[0];//差额计算的区间，除第一位外，其他位置为需要插入差额的位置，z最后一条差额为特殊列，需要直接在最后加上，这边不会保存数据
                        let popLists=[];

                        //根据科目分组，并加入差额列,当前列跟下一列的k_code不相等，说明所有当前科目到底
                        for(let i=0 ; i<data.length ; i++){
                            if(i!=0&&data[i].k_code!=data[i-1].k_code){
                                cutIndex.push(i);
                            }
                        }

                        //用差额区间进行数据分组，并加入差额列
                        for(let j=0 ; j<cutIndex.length-1 ; j++){
                            let popList=[];
                            popList.push(data[cutIndex[j]]);

                            let countObj = {
                                k_code: "",
                                k_name: "",
                                name: "差额",
                                qc_sum: data[cutIndex[j]].qc_sum,
                                qm_sum:  data[cutIndex[j]].qm_sum,
                                ye_d_sum:  data[cutIndex[j]].ye_d_sum,
                                ye_j_sum:  data[cutIndex[j]].ye_j_sum
                            };
                            //进行差额数据计算
                            for(let k=cutIndex[j]+1 ; k<cutIndex[j+1] ; k++ ){
                                popList.push(data[k]);
                                countObj.qc_sum-=data[k].qc_sum;
                                countObj.ye_j_sum-=data[k].ye_j_sum;
                                countObj.ye_d_sum -=data[k].ye_d_sum ;
                                countObj.qm_sum-=data[k].qm_sum;
                            }

                            popLists.push(popList);
                            popList.push(countObj);
                        }

                        //最后一个 到data结束，特殊
                        let lastPopLists=[];
                        let lastcountObj = {
                            k_code: "",
                            k_name: "",
                            name: "差额",
                            qc_sum: data[cutIndex[cutIndex.length-1]].qc_sum,
                            qm_sum:  data[cutIndex[cutIndex.length-1]].qm_sum,
                            ye_d_sum:  data[cutIndex[cutIndex.length-1]].ye_d_sum,
                            ye_j_sum:  data[cutIndex[cutIndex.length-1]].ye_j_sum
                        };
                        lastPopLists.push(data[cutIndex[cutIndex.length-1]]);
                        for(let l=cutIndex[cutIndex.length-1]+1 ; l<data.length ; l++){
                            lastPopLists.push(data[l]);
                            lastcountObj.qc_sum-=data[l].qc_sum;
                            lastcountObj.ye_j_sum-=data[l].ye_j_sum;
                            lastcountObj.ye_d_sum -=data[l].ye_d_sum ;
                            lastcountObj.qm_sum-=data[l].qm_sum;
                        }


                        lastPopLists.push(lastcountObj);
                        popLists.push(lastPopLists);
                        this.accountAllData=popLists;

                    }
                    loading.close()
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },

            //时间选择器，时间选择
            dateChoose:function(val){
                let time=val;
                this.date1=time;
                //this.searchYear=time.choosedYear;
                this.getAccountAllData();
            },
            //搜索
            searchCode:function(){
                console.log('搜索');
            },
            //excel导出
            postBalanceSheetExcel:function() {
                let loading=this.$loading();

                let param = {
                    'uid': this.userid,
                    'orgid':this.orgid,
                    'year':this.date1.choosedYear,
                    'month':this.date1.choosedMonth,
                    'enabledMark':this.enabledMark?0:1,//0启用，1禁用，剔除禁用，表示只查询启用
                    'parameter':'',
                };

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfigUncontrol();

                //下载Excel
                this.downloadLoading = true
                this.$axios.get('/Cashier/GetCashierReportExcel',{params:param}).then(res => {
                    //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        let tempLink = document.createElement("a");
                        let downloadUrl=base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        tempLink.style.display = "none";
                        tempLink.href = downloadUrl;
                        tempLink.setAttribute("download", res.filename);
                        if (typeof tempLink.download === "undefined") {
                            tempLink.setAttribute("target", "_blank");
                        }
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        document.body.removeChild(tempLink);
                    }
                    this.downloadLoading = false;
                    loading.close();
                }).catch(err => {
                    loading.close();
                    console.log(err)
                })
            },
            //显示打印预览打印
            showPrintArea:function(){
                let that=this;
                that.showPrint=true;
                    //获取打印内容，渲染于弹窗
                    let print = document.createElement("div");
                    print.setAttribute('class','timeSelect printArea');
                    print.style.padding='30px 40px 30px 30px';
                    let cop=null;

                    //获取页面显示的打印表格的表头
                    let dm = that.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                   /* //获取隐藏的工会组织科目名称的表头
                    let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                    //获取隐藏的表格内容--表尾
                    let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;*/
                   /* //表头拼接
                    for(let i=thchilds.length-1;i>=0;i--){
                        dm.insertBefore(thchilds[i],dm.firstChild);
                    }*/
                    //获取页面的表格内容
                    cop = that.$refs.printFrom.cloneNode(true);
                    /*//表格内容拼接表尾
                    for(let i=0;i<tbchilds.length;i++){
                        cop.lastChild.appendChild(tbchilds[i]);
                    }*/
                    //表格内容拼接表头
                    cop.insertBefore(dm,cop.childNodes[2]);

                    print.appendChild(cop);
                    //内容全部放入打印预览
                    document.getElementById('printContentArea').appendChild(print);
            },
            //关闭打印预览
            closePrintArea:function(){
                this.showPrint=false;
                document.getElementById('printContentArea').innerHTML='';
            },
            //调用打印
            printContent:function(){
                let print =document.getElementById('printContentArea');
                this.$print(print) // 使用
            },
            //页面刷新
            refresh:function(){
                this.getAccountAllData()
            },
        }
    }
</script>

<style scoped>
    .checkTd td{
        background-color: #f1a2a2;
        color: #fff;
    }
    .blueTd td{
        background-color: #64BAC6;
        color: #fff;
    }
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
        text-align: center;
        overflow-y: auto;
    }

    .coverContent{
        background-color: #fff;
        width: 362px;
        height: auto;
        position: absolute;
        top: 15%;
        left: 50%;
        margin-left:-181px;
        margin-bottom: 50px;
        box-shadow: 0 0 5px 1px #d3e9f9;
    }

    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 0px 20px;
    }
</style>
