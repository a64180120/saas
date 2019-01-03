<template>
    <div class="timeSelect">
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
                            <a ><li style='margin:0 0 0px 20px;' :disabled="verify" @click="changeBtnC">{{changeBtn.title}}</li ></a>
                            <a><li style='margin:0 0 0px 20px;' @click="showCountMsg=true">核定年初预算</li></a>
                            <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                            <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li ></a>
                            <a><li style='margin:0 0 0px 20px;' class="el-icon-refresh" @click="refresh"></li></a>
                        </ul>
                    </div>

                    <div class="formData" id="form1" ref="printFrom">
                    <ul>
                        <li>科目编码</li>
                        <li>科目名称</li>
                        <li>上年决算数(元)</li>
                        <li>本年预算数(元)</li>
                        <li>说明</li>
                    </ul>
                    <template v-for="(item,index) in budgetList">
                        <template v-if="item.SubjectCode=='BNSRHJ'">
                            <ul class="formDataItems flexPublic">
                                <li class=" bolder" style="width: 30%;text-align: center">{{item.k_name}}</li>
                                <li style="display: none"></li>
                                <li class="align-right">{{item.FinalaccountsTotal| NumFormat}}</li>
                                <li class="align-right">
                                    <input disabled v-bind:value="item.BudgetTotal| NumFormat">
                                </li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNZCHJ'">
                            <ul class="formDataItems flexPublic">
                                <li class=" bolder" style="width: 30%;text-align: center">{{item.k_name}}</li>
                                <li style="display: none"></li>
                                <li class="align-right">{{item.FinalaccountsTotal| NumFormat}}</li>
                                <li class="align-right">
                                    <input disabled v-bind:value="item.BudgetTotal| NumFormat">
                                </li>
                                <li>
                                    <input type="text" v-bind:disabled="changeBtn.disable" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNJY'">
                            <ul class="formDataItems flexPublic">
                                <li class=" bolder">{{item.k_name}}</li>
                                <li></li>

                                <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                <li class="align-right">
                                    <input disabled v-bind:value="item.BudgetTotal| NumFormat">
                                </li>
                                <li>
                                    其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='SNJY'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li class="align-center">{{item.k_name}}</li>
                                <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                <li class="align-right">
                                    <input disabled  v-bind:value="item.BudgetTotal | NumFormat">
                                </li>
                                <li>
                                    其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNSHTZ'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li class="align-center">{{item.k_name}}</li>
                                <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                <li class="align-right">
                                    <input v-bind:disabled="changeBtn.disable"  v-bind:value="item.BudgetTotal| NumFormat"  v-bind:index="index" v-bind:code="item.SubjectCode"  v-on:input="inputLis">
                                </li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNTZ'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li class="align-center">{{item.k_name}}</li>
                                <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                <li class="align-right">
                                    <input  v-bind:disabled="changeBtn.disable"  v-bind:value="item.BudgetTotal| NumFormat"  v-bind:index="index" v-bind:code="item.SubjectCode"  v-on:input="inputLis">
                                </li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNTQHBJ'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li class="align-center ">{{item.k_name}}</li>
                                <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                <li class="align-right">
                                    <input disabled  v-bind:value="item.BudgetTotal | NumFormat">
                                </li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='QMGCJY'">
                            <ul class="formDataItems flexPublic">
                                <li class=" bolder">{{item.k_name}}</li>
                                <li></li>
                                <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                <li class="align-right">
                                    <input disabled  v-bind:value="item.BudgetTotal | NumFormat" >
                                </li>
                                <li>
                                    其中：政府补助结余：<input  v-bind:disabled="changeBtn.disable"class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.k_name!='未找到该科目编码对应的科目'">
                            <ul class="formDataItems flexPublic">
                                <li v-bind:class="{'align-centers':item.Layers==1}">{{item.SubjectCode}}</li>
                                <li v-bind:class="{'align-center':item.Layers==1}">{{item.k_name}}</li>
                                <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                <li class="align-right">
                                    <template v-if="item.Layers==0">
                                        <!--判断有没有子级科目，有则禁用，没有则添加输入方法-->
                                        <template v-if="budgetList[index+1].SubjectCode.substring(0,item.SubjectCode.length)!=item.SubjectCode">
                                            <input  v-bind:disabled="changeBtn.disable"  v-bind:index="index" v-bind:code="item.SubjectCode" v-bind:layer="item.Layers"  v-on:blur="inputLis" v-bind:value="item.BudgetTotal | NumFormat">
                                        </template>
                                        <template v-else>
                                            <input disabled  v-bind:code="item.SubjectCode" v-bind:value="code_firstCount[item.SubjectCode] | NumFormat">
                                        </template>

                                    </template>
                                    <template v-else>
                                        <input  v-bind:disabled="changeBtn.disable"  v-bind:index="index" v-bind:code="item.SubjectCode" v-bind:layer="item.Layers"   v-on:blur="inputLis" v-bind:value="item.BudgetTotal | NumFormat">
                                    </template>
                                </li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description" v-bind:index="index" v-on:blur="inputDicription">
                                </li>
                            </ul>
                        </template>
                    </template>
                </div>
                </div>

                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose" :showtype="'yearTime'"></time-select-bar>
                </div>
            </div>
        </div>
        <div class="cover" :style="{'display':(showCountMsg?'block':'none')}">
            <div class="coverContent">
                <div class="flexPublic">
                    <p>提示</p>
                    <i class="el-icon-close" @click="showCountMsg=false"></i>
                </div>
                <div>
                    <p>年初预算核定后不允许更改，确定核定？</p>
                </div>
                <ul class="flexPublic handle">
                    <li style='margin:0 0 0px 20px;' @click="showCountMsg=false">取消</li>
                    <li style='margin:0 0 0px 20px;' @click="hedin">确定</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState, mapGetters } from "vuex";
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import TimeSelectBar from "../../components/TimeSelectBar/index";

    export default {
        name: "user",
        data(){
            return{
                showCountMsg:false,//核定显示false隐藏 true显示
                downloadLoading: false,
                changeBtn:{
                    flag:true,
                    title:'编辑',
                    disable:true,
                },
                budgetList:[],//数据库查询的全部数据
                code_firstCount:[],//一级科目数据对应的合计数
                specialSubIndex:[],//特殊科目对应的下标数组，用于计算
                date1:[],
                proofType:'0',
                loading: false,
                verify:true//判断页面是否可以修改，true默认可修改，若为false不可修改
            }
        },
        components: {TimeSelectBar},

        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgcode:state => state.user.orgcode
            }),
        },
        mounted(){
            this.getBeginYear()
        },
        methods:{
            /*
            *核定
            *
            * */
            hedin:function(){
                this.verifyStart();
            },

            /*
            * 时间选择器
            * */
            dateChoose:function(val){
                this.date1=val;
                this.getBeginYear();
            },
            /*
            * 监听编辑按钮事件
            * */
            changeBtnC:function(){
                if(this.verify){
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
                }else{
                    this.$message({ showClose: true, message:'已经进行过预算核定，不可进行修改',type: 'error' })
                }

            },
            /*
            * 监听数据输入
            * */
            inputLis:function(val){
                let code = val.target.attributes.code.value;//当前修改数据的code
                let index=val.target.attributes.index.value;//当前修改数据在列表中的下标

                let in_value = '';
                let numList=val.target.value.split(',');
                for(var i in numList){
                    in_value+=numList[i];
                }
                // input数据转数字
                in_value=Number(in_value);
                if(!isNaN(in_value)){
                    if(code=='BNSHTZ'){
                        this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal)+in_value
                        this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal;
                    }else if(code=='BNTZ'){
                        this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)+parseFloat(this.budgetList[index].BudgetTotal)-in_value
                        this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal;
                    }
                    else{
                        let layer=val.target.attributes.layer.value;//当前修改数据时父级菜单还是子集菜单
                        //判断是父级科目还是子级科目
                        if(layer=='0'){

                            //判断修改的数据是在收入合计之前还是在支出合计之前
                            if(parseFloat(index) < parseFloat(this.specialSubIndex['BNSRHJ'])){
                                //收入合计更改
                                this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal)+in_value;
                                this.budgetList[this.specialSubIndex['BNSRHJ']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal;
                                this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal)+in_value;
                                this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal;
                            }else{
                                //支出合计更改
                                this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal)+in_value;
                                this.budgetList[this.specialSubIndex['BNZCHJ']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal;
                                this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)+parseFloat(this.budgetList[index].BudgetTotal)-in_value;
                                this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal;
                            }
                            //计算本年结余
                            this.budgetList[this.specialSubIndex['BNJY']].BudgetTotal=this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal-this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal;
                            this.budgetList[this.specialSubIndex['BNJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNJY']].BudgetTotal;
                            //直接修改数组中的一级科目，因为没有子级
                            this.code_firstCount[code]=in_value;
                            this.budgetList[index].BudgetTotal=in_value;
                            this.budgetList[index].ApprovedBudgetTotal=in_value;
                        }else{
                        //本年投资输入
                            for(let i in this.budgetList){
                                //通过截取code确定对应的一级科目
                                let len = this.budgetList[i].SubjectCode.length;
                                let codeSub = code.substring(0,len);
                                if(codeSub==this.budgetList[i].SubjectCode&&code.length!=len){
                                    //确定修改的对应一级科目，进行计算，先减去该科目的原数据，在加上修改后的数据，得到对应一级科目的总和
                                    this.code_firstCount[codeSub]=parseFloat(this.code_firstCount[codeSub])-parseFloat(this.budgetList[index].BudgetTotal)+in_value;
                                    this.budgetList[i].BudgetTotal=this.code_firstCount[codeSub];
                                    this.budgetList[i].ApprovedBudgetTotal=this.budgetList[i].BudgetTotal;
                                    //判断修改的数据是在收入合计之前还是在支出合计之前
                                    if(parseFloat(index) < parseFloat(this.specialSubIndex['BNSRHJ'])){
                                        //收入合计更改
                                        this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal)+in_value;
                                        this.budgetList[this.specialSubIndex['BNSRHJ']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal;
                                        this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal)+in_value;
                                        this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal;
                                    }else{
                                        //支出合计更改
                                        this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal)-parseFloat(this.budgetList[index].BudgetTotal)+in_value;
                                        this.budgetList[this.specialSubIndex['BNZCHJ']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal;
                                        this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal=parseFloat(this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal)+parseFloat(this.budgetList[index].BudgetTotal)-in_value;
                                        this.budgetList[this.specialSubIndex['QMGCJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['QMGCJY']].BudgetTotal;
                                    }
                                    //计算本年结余
                                    this.budgetList[this.specialSubIndex['BNJY']].BudgetTotal=this.budgetList[this.specialSubIndex['BNSRHJ']].BudgetTotal-this.budgetList[this.specialSubIndex['BNZCHJ']].BudgetTotal;
                                    this.budgetList[this.specialSubIndex['BNJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNJY']].BudgetTotal;
                                }
                            }

                        }
                    }
                    //修改该科目在总list中的数据
                    console.log(this.budgetList[index].BudgetTotal);
                    this.budgetList[index].BudgetTotal=in_value;
                    this.budgetList[index].ApprovedBudgetTotal=this.budgetList[index].BudgetTotal
                }
            },
            /*
            * 监听说明的input输入
            * */
            inputDicription:function(val){
                //let code = val.target.attributes.code.value;//当前修改数据的code
                let index=val.target.attributes.index.value;//当前修改数据在列表中的下标
                let in_value = val.target.value;//input数据转数字
                this.budgetList[index].Description=in_value;
            },

            /*
            * 页面数据查询方法
            * */
            getBeginYear:function(){
                let year='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    year=currentyear;
                }else{
                    year=this.date1.choosedYear
                }
                let data={
                    "uid": this.userid,
                    "orgid":this.orgid,
                    "Year":  year,
                    "OrgIds": this.orgid,
                    'IsStart':1
                };
                this.loading=true;
                this.$axios.get(
                    'PSubjectBudget/GetBeginYear',
                    {params:data}
                ).then(res=>{
                    console.log(res);

                    this.loading=false;
                    let  code_firstCount={},//存放一级科目对应预算数
                        specialSubIndex={};//存放特殊的科目
                    //循环遍历，得到一级子目录一级对应的预算数
                    //计算上年决算数对应的本年合计收入，以及本年支出合计
                    // 得到  本年收入合计,本年支出合计，本年结余，上年结余，收回投资，本年投资，本年提取后备金，期末滚存结余  对应数组用于计算

                    for(var i in res.Record){
                        res.Record[i].OrgId=this.orgid;
                        res.Record[i].OrgCod=this.orgcode;
                        res.Record[i].Uyear=year;
                        if( res.Record[i].VerifyStart==1){
                            this.verify=false;
                        }else{
                            this.verify=true;
                        }
                        if(res.Record[i].Layers=='0'){
                            code_firstCount[res.Record[i].SubjectCode]=res.Record[i].BudgetTotal;//本年一级科目预算数
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
                    this.code_firstCount = code_firstCount;
                    this.specialSubIndex = specialSubIndex;
                }).catch(res=>{
                    this.loading=false;
                    console.log(res);
                })
            },
            /*
            * 修改保存
            * */
            saveChange:function(){
                let that=this;
                this.loading=true;
              this.$axios.post(
                  'PSubjectBudget/PostSave',
                  {
                      "uid": this.userid,
                      "orgid": this.orgid,
                      "infodata": this.budgetList
                  }
              ).then(function(res){
                  that.loading=false;
                  that.$message({ showClose: true, message:res.Msg,type: 'success' })
              }).catch(function(err){
                  that.loading=false;
                  console.log(err);
              })
            },
            /*
            * 核定
            * */
            verifyStart:function(){
                if(this.verify) {
                    let that = this;
                    this.loading = true;
                    for (let i in this.budgetList) {
                        this.budgetList[i].VerifyStart = 1;
                    }
                    this.$axios.post(
                        'PSubjectBudget/PostSave',
                        {
                            "uid": this.userid,
                            "orgid": this.orgid,
                            "infodata": this.budgetList
                        }
                    ).then(function (res) {
                        that.loading = false;
                        that.$message({showClose: true, message: '年初预算核定成功', type: 'success'});
                        that.showCountMsg = false;
                        that.getBeginYear();

                    }).catch(function (err) {
                        that.loading = false;
                        console.log(err);
                    })
                }else{
                    this.$message({ showClose: true, message:'已经核定年初预算',type: 'error' })
                }
            },

            /*
            *author:hyz
            *导出Excel表格
            *
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
                    url: '/PsubjectBudget/PostExportBeginYear',
                    data: param
                }).then(res => {
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
                // const me = this
                // var html=this.$refs.printFrom.innerHTML;
                // let  LODOP = getLodop();
                // LODOP.PRINT_INIT("资产负债表");      //首先一个初始化语句
                // LODOP.SET_PRINT_STYLE("FontSize", 18);  //字体
                // LODOP.SET_PRINT_STYLE("Bold", 1);
                // //LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
                // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "资产负债表");
                // LODOP.ADD_PRINT_HTM(88, 200, 350, 600,html);
                // //LODOP.PRINT();
                // LODOP.PREVIEW();
            },
            // 打印
            printContent(e){
                this.getPdf(this.$refs.printFrom);
                //this.$print(this.$refs.printFrom) // 使用
            },
            //刷新
            refresh:function(){
                this.getBeginYear();
            }

        }
    }
</script>

<style scoped>
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
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
        width:17%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #ebeef5;
    }

    .formData>ul>li:first-child{
        width:11%;
        padding:0 2px;
    }
    .formData>ul>li:last-child{
        width:30%;
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
    .formData>ul.formDataItems>li.align-centers{
        padding:0;
        text-indent: 30px;
    }
    .formData>ul.formDataItems>li.align-right{
        text-align: right;
    }
    .formData>ul.formDataItems>li:last-child >input{
        text-align: left;
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
        width:55%;
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
    }
    .coverContent{
        background-color: #fff;
        width: 362px;
        height: 195px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -87.5px -181px;

    }
    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid grey;
        padding:10px 20px;
    }
    .coverContent div:nth-of-type(2){
        padding: 30px 20px;
    }
    .coverContent ul{
        padding: 30px 20px;
    }
    .coverContent ul li:nth-of-type(1){
        border: 1px solid #3e8cbc;
        color: #3e8cbc;
        padding: 5px 15px;
    }
    .coverContent ul li:nth-of-type(2){
        border: 1px solid #3e8cbc;
        color: #FFF;
        background: #3e8cbc;
        padding: 5px 15px;
    }
</style>

