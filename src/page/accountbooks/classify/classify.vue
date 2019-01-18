<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px">
                        <div style="width:100%;float: right">
                            <ul class="flexUl handle">
                                <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel">导出</li ></a>
                                <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                                <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                            </ul>
                        </div>

                    </div>

                    <div>
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="25%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>科目编码</td>
                                    <td>科目名称</td>
                                    <td>期间</td>
                                    <td>摘要</td>
                                    <td>借方金额（元）</td>
                                    <td>贷方金额（元）</td>
                                    <td>余额（元）</td>
                                </tr>
                                </thead>

                            </table>
                        </div>
                        <div class="tbBody" >
                            <table>
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="25%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                </colgroup>
                                <tbody>
                                <template v-for="(item,index) in dataList">
                                    <tr v-if="index==0">
                                        <td :rowspan="dataList.length">{{dataList[0].subject_code}}</td>
                                        <td>{{dataList[0].k_name}}</td>
                                        <td>{{dataList[0].ye_j_sum}}</td>
                                        <td>{{dataList[0].ye_d_sum}}</td>
                                        <td>{{dataList[0].yh_j_sum}}</td>
                                        <td>{{dataList[0].yh_d_sum}}</td>
                                        <td>{{dataList[0].yl_j_sum}}</td>
                                    </tr>
                                    <tr v-else>
                                        <td>{{item.k_name}}</td>
                                        <td>{{item.ye_j_sum}}</td>
                                        <td>{{item.ye_d_sum}}</td>
                                        <td>{{item.yh_j_sum}}</td>
                                        <td>{{item.yh_d_sum}}</td>
                                        <td>{{item.yl_j_sum}}</td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose"
                                     :showtype="'doubleTime'"
                    ></time-select-bar>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import httpConfig from '@/util/ajaxConfig';
    import { mapState, mapGetters } from "vuex";
    import Countdownpop from "../../../components/countDownPop/index";  //自定义ajax头部配置*****
    import qs from 'qs'

    export default {
        name: "balance",
        data (){
            return{
                date1:'',
                dataList:'',
            }
        },
        components: {Countdownpop, TimeSelectBar},
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgcode:state => state.user.orgcode
            }),
        },
        mounted(){
            this.getData();
        },
        methods:{
            //数据查询
            getData:function(){
                let data={
                    "Year":  2019,
                    "OrgIds": this.orgid,
                };
                this.$axios.get(
                    'PVoucherMst/GetSubjectBalanceReport',
                    {params:data}
                ).then(res=>{
                    this.dataList=qs.parse(res).Record;
                    console.log(qs.parse(res));
                }).catch(err=>{
                    console.log(err);
                })
            },
            //时间选择器选择时间返回值
            dateChoose:function(val){
                this.date1=val;
                this.getData();
            },
            //刷新
            refresh:function(){
                this.getData();
            },
            /*
             *author:hyz
             *导出Excel表格
             *
             * */
            postBalanceSheetExcel:function() {
                let param = {'uid':this.userid,
                    'orgid':this.orgid,
                    'Year': this.date1.choosedYear};

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios.get('DealingsMst/GetDealingsExcel',{params:param}).then(res => {
                    window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            // 打印
            printContent(e){
                let dm = this.$refs.printFrom.parentNode.firstChild.cloneNode(true);
                dm.classList.add('first_child');
                let cop = this.$refs.printFrom.cloneNode(true);
                cop.insertBefore(dm,cop.firstChild);
                cop.classList.remove('formData_content');
                this.$print(cop) // 使用
            },
        }
    }
</script>

<style scoped>
    .flexUl{
        float: right;
    }
    .flexUl>a>li{
        display: inline-block;
        float: left;
        vertical-align: top;
    }

    .tbHeader{
        width: 100%;
        text-align: center;
    }
    .tbBody{
        position: absolute;
        bottom: 0;
        top: 88px;
        right: -17px;
        left: 0;
        overflow-y: scroll;
    }
    .tbBody table{
        width: 100%;
    }
    .tbHeader table{
        height: 100%;
        width: 100%;
    }
    thead td{
        border-width: 0px 0px 1px 1px;
        border-color:white;
        border-style: solid;
        text-align:center ;
        height: 48px;
        line-height: 48px;
        background: #d3e9f9;
        color: #000;
    }
    thead td:nth-of-type(1),thead td:last-of-type{
        border-right: 1px;
    }

    tbody td{
        height: 48px;
        line-height: 48px;
        background: transparent;
        color: #000;
        border-width: 1px 0px 0px 1px;
        border-color:#ebeef5;
        border-style: solid;
        padding:0 10px;
    }
    tbody tr td:last-child{
        border-right: 1px solid #ebeef5;
    }
    tbody tr:hover{
        background-color: #fafafa;
        transition: background-color .25s ease;
    }
    tbody tr:last-child td{
        border-bottom: 1px solid #ebeef5;
    }
</style>
