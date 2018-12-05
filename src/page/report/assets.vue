<template>
    <div class="manageContent">
        <div class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic">
                    <!--<div>年度:</div>
                    <div class="selectContainer">
                        <select  v-model="userState">
                            <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.uname}}</option>
                        </select>
                    </div>
                    <div>至</div>
                    <div class="selectContainer">
                        <select  v-model="userState">
                            <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.uname}}</option>
                        </select>
                    </div>-->
                        <div>账期:</div>
                        <div class="block selectContainer">
                            <el-date-picker
                                v-model="date1"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="pinzheng">凭证：</div>
                        <div  class="block selectContainer">
                            <select class="el-input__inner" v-model="proofType">
                                <option value="0">包含未审核凭证</option>
                                <option value="1">不包含未审核凭证</option>
                            </select>
                        </div>
                </li>
            </ul>
            <ul class="flexPublic handle">
                <a href=""><li>打印</li></a>
                <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="postBalanceSheetExcel" :loading="downloadLoading"><li>导出</li></el-button >
            </ul>
        </div>
        <div class="formData">
            <ul>
                <li></li>
                <li>资产</li>
                <li>年初数</li>
                <li>期末数</li>
                <li></li>
                <li>资产与净资产</li>
                <li>年初数</li>
                <li>期末数</li>
            </ul>

            <ul class="formDataItems flexPublic">
                <li></li>
                <li class="align-center">一、资产</li>
                <li></li>
                <li></li>
                <li></li>
                <li class="align-center">二、负债</li>
                <li></li>
                <li></li>
            </ul>
            <template v-if="cashInData.length >= cashOutData.length+cashData.length+2">
                <template v-for="(item,index) in cashInData">
                    <ul class="formDataItems flexPublic">
                        <li>{{item.KCode}}</li>
                        <li>{{item.KName}}</li>
                        <li>{{item.StartSum}}</li>
                        <li>{{item.EndSum}}</li>
                        <template v-if="index<=cashOutData.length">
                            <li>{{cashOutData[index-1].KCode}}</li>
                            <li>{{cashOutData[index-1].KName}}</li>
                            <li>{{cashOutData[index-1].StartSum}}</li>
                            <li>{{cashOutData[index-1].EndSum}}</li>
                        </template>
                        <template v-else-if="index==cashOutData.length+1">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </template>
                        <template v-else-if="index==cashOutData.length+2">
                            <li></li>
                            <li class="align-center">三、净资产类</li>
                            <li></li>
                            <li></li>
                        </template>
                        <template v-else>
                            <li>{{cashData[index-cashOutData.length-3].KCode}}</li>
                            <li>{{cashData[index-cashOutData.length-3].KName}}</li>
                            <li>{{cashData[index-cashOutData.length-3].StartSum}}</li>
                            <li>{{cashData[index-cashOutData.length-3].EndSum}}</li>
                        </template>
                    </ul>
                </template>
            </template>
            <template v-else>
                <template v-for="index in (cashOutData.length+cashData.length+2)">
                    <ul class="formDataItems flexPublic">
                        <template v-if="index<=cashInData.length">
                            <li>{{cashInData[index-1].KCode}}</li>
                            <li>{{cashInData[index-1].KName}}</li>
                            <li>{{cashInData[index-1].StartSum}}</li>
                            <li>{{cashInData[index-1].EndSum}}</li>
                        </template>
                        <template v-else>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </template>

                        <template v-if="index<=cashOutData.length">
                            <li>{{cashOutData[index-1].KCode}}</li>
                            <li>{{cashOutData[index-1].KName}}</li>
                            <li>{{cashOutData[index-1].StratSum}}</li>
                            <li>{{cashOutData[index-1].EndSum}}</li>
                        </template>
                        <template v-else-if="index==cashOutData.length+1">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </template>
                        <template v-else-if="index==cashOutData.length+2">
                            <li></li>
                            <li class="align-center">三、净资产类</li>
                            <li></li>
                            <li></li>
                        </template>
                        <template v-else>
                            <li>{{cashData[index-cashOutData.length-3].KCode}}</li>
                            <li>{{cashData[index-cashOutData.length-3].KName}}</li>
                            <li>{{cashData[index-cashOutData.length-3].StartSum}}</li>
                            <li>{{cashData[index-cashOutData.length-3].EndSum}}</li>
                        </template>
                    </ul>
                </template>
            </template>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic">
                <li></li>
                <li class="align-center">资产总计</li>
                <li>{{cashInCounts}}</li>
                <li></li>
                <li></li>
                <li class="align-center">负债与净资产总计</li>
                <li>{{cashOutCounts+cashCounts}}</li>
                <li></li>
            </ul>
            <ul class="formDataItems flexPublic bottomForm">
                <li>工会主席：</li>
                <li></li>
                <li>财务负责人：</li>
                <li></li>
                <li>复核：</li>
                <li></li>
                <li>制表：</li>
                <li></li>
            </ul>

        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import ajaxhttp from '@/util/ajaxConfig' //自定义ajax头部配置*****

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

                cashInData:[         ],
                cashOutData:[         ],
                cashData:[         ],
                cashInCounts:0,
                cashOutCounts:0,
                cashCounts:0,
                date1:'',
                proofType:'0',
                balanceData:[]
            }
        },
        mounted(){
            this.getData(this.date1,this.proofType);
        },
        watch:{
            /*
            *监听日期选择，根据所选的日期以及凭证调用资产负债数据查询方法
            * */
            date1:function(){
                this.getData(this.date1,this.proofType);
            },
            proofType:function(){
                this.getData(this.date1,this.proofType);
            }
        },
        methods:{
            /*
            *author:hyz
            *获取资产负债表数据
            * 接口：PVoucherMst/GetBalanceSheet
            * 参数：param--日期，未选择自动使用当前时间
            * proofType--资产凭证类型，包含未审核凭证（0），不包含未审核凭证（1）
            * */
            getData(param,proofType){
                console.log(proofType);
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
                param=year+'-'+month+'-'+day;

                let data={
                    accountPeriod:param,
                    isContainUncheck:proofType
                };
                this.$axios.get('/PVoucherMst/GetBalanceSheet',{params:data})
                    .then(res => {
                       let cashIn=[],cashOut=[],cash=[],cashInCount=0,cashOutCount=0,cashCount=0;
                       for(let i in res.Data){
                           if(res.Data[i].KType==="1"){
                               cashIn.push(res.Data[i]);
                           }else if(res.Data[i].KType==="2"){
                               cashOut.push(res.Data[i]);
                           }else{
                               cash.push(res.Data[i]);
                           }
                       }
                       for(let j in cashIn){
                           cashInCount+=cashIn[j].StartSum;
                       }
                       for(let k in cashOut){
                           cashOutCount+=cashOut[k].StartSum;
                       }
                       for(let l in cash){
                           cashCount+=cash[l].StartSum;
                        }
                       this.balanceData=res.Data;
                       this.cashInData=cashIn;
                       this.cashOutData=cashOut;
                       this.cashData=cash;
                       this.cashInCounts=cashInCount;
                       this.cashOutCounts=cashOutCount;
                       this.cashCounts=cashCount;
                    })
                    .catch(err => console.log(err))
            },

            /*
            *author:hyz
            *导出资产负债表Excel表格
            * 接口：PVoucherMst/PostBalanceSheetExcel
            * 参数：Data--资产负债表数据的整个data
            * */
            postBalanceSheetExcel:function(){
                let param = {'infoData':this.balanceData};

                let baseheader=ajaxhttp.header;
                let base=ajaxhttp.base;

                // this.downloadLoading = true
                // import('@/vendor/Export2Excel').then(excel => {
                //     const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
                //     const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
                //     const list = this.list
                //     const data = this.formatJson(filterVal, list)
                //     excel.export_json_to_excel({
                //     header: tHeader,
                //     data,
                //     filename: this.filename,
                //     autoWidth: this.autoWidth
                //     })
                //     this.downloadLoading = false
                // })

                //下载Excel
				this.$axios({
                    method:'get',
                    url:'/PVoucherMst/GetBalanceSheetExcel',
                    params:{
                        accountPeriod:'2018-12-01',
                        isContainUncheck:1
                    }
                }) .then(res => {
                    window.location.href = base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;

                }).catch(err => {
                    console.log(err)
                })



            },
            //下载文件
            downloadFile(data){
                if (!data) {
                    return
                }
                // let url = window.URL.createObjectURL(new Blob([data]))
                // let link = document.createElement('a')
                // link.style.display = 'none'
                // link.href = url
                // link.setAttribute('download', 'excel.xls')
                
                // document.body.appendChild(link)
                // link.click()

                // let fileName = res.headers['content-disposition'].split('=')[1];
                // let fileName2 = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0];
                let fileName = '123.txt';
                let blob = new Blob([data],{type:'application/ms-excel'});
                let objectUrl = window.URL.createObjectURL(blob);
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href=objectUrl;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();

                URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            }

        }
    }
</script>

<style scoped>
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
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:10%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2){
        width:20%;
    }
    .formData>ul>li:nth-of-type(6){
        width:20%;
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
        text-align: center;
        padding:0;
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
    .formData>ul.bottomForm>li:nth-of-type(2),
    .formData>ul.bottomForm>li:nth-of-type(4),
    .formData>ul.bottomForm>li:nth-of-type(6),
    .formData>ul.bottomForm>li:nth-of-type(8){
        width:15%;
        text-align: left;
    }
</style>
