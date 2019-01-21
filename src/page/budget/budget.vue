<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent" v-loading="loading">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px">
                        <div style="width:100%;float: right">
                            <ul class="flexUl handle" :style="{'display': changeBtn.disable?'block':'none'}">
                                <a ><li style='margin:0 0 0px 20px;' :class="{'disableBtn':!verify}" @click="!verify?'':changeBtn.disable=false">编辑</li ></a>
                                <a><li style='margin:0 0 0px 20px;' :class="{'disableBtn':!verify||date1.choosedYear>jyear}" @click="showCountMsg=(verify&&date1.choosedYear<=jyear)">上报年初预算</li></a>

                                <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li ></a>
                                <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                                <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                            </ul>
                            <ul class="flexUl handle" :style="{'display': !changeBtn.disable?'block':'none'}">
                                <a ><li style='margin:0 0 0px 20px;' @click="changeBtn.disable=true">取消</li ></a>
                                <a><li style='margin:0 0 0px 20px;' @click="saveChange">保存</li></a>
                                <a><li style='margin:0 0 0px 20px;' :class="{'disableBtn':!verify||date1.choosedYear>jyear}" @click="showCountMsg=(verify&&date1.choosedYear<=jyear)">保存并上报</li></a>

                            </ul>
                        </div>

                    </div>

                    <div class="formData" id="form1">
                        <ul class="no-print">
                            <li>科目编码</li>
                            <li>科目名称</li>
                            <li>上年决算数(元)</li>
                            <li>本年预算数(元)</li>
                            <li>说明</li>
                        </ul>
                            <div class="formData formData_content"  ref="printFrom">
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
                                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" @blur="inputDicription">
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
                                                <input type="text" v-bind:disabled="changeBtn.disable" v-bind:placeholder="item.Description"  v-bind:index="index" @blur="inputDicription">
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
                                                其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" @blur="inputDicription">
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
                                                其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" @blur="inputDicription">
                                            </li>
                                        </ul>
                                    </template>

                                    <template v-else-if="item.SubjectCode=='BNSHTZ'">
                                        <ul class="formDataItems flexPublic">
                                            <li></li>
                                            <li class="align-center">{{item.k_name}}</li>
                                            <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                            <li class="align-right">
                                                <input v-bind:disabled="changeBtn.disable"  v-bind:value="item.BudgetTotal| NumFormat"  v-bind:index="index" v-bind:code="item.SubjectCode"  @blur="inputLis">
                                            </li>
                                            <li>
                                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" @blur="inputDicription">
                                            </li>
                                        </ul>
                                    </template>

                                    <template v-else-if="item.SubjectCode=='BNTZ'">
                                        <ul class="formDataItems flexPublic">
                                            <li></li>
                                            <li class="align-center">{{item.k_name}}</li>
                                            <li class="align-right">{{item.FinalaccountsTotal | NumFormat}}</li>
                                            <li class="align-right">
                                                <input  v-bind:disabled="changeBtn.disable"  v-bind:value="item.BudgetTotal| NumFormat"  v-bind:index="index" v-bind:code="item.SubjectCode"  @blur="inputLis">
                                            </li>
                                            <li>
                                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" @blur="inputDicription">
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
                                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" @blur="inputDicription">
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
                                                其中：政府补助结余：<input  v-bind:disabled="changeBtn.disable"class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" @blur="inputDicription">
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
                    <div class="verifyPanel" :style="{display:!verify?'block':'none'}">
                        <div>已上报</div>
                        <div style="font-size: 14px">{{verifyTime.substring(0,10)}}</div>
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
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showCountMsg=false"></i>
                </div>
                <div>
                    <p>年初预算上报后不允许更改，确定上报？</p>
                </div>
                <ul class="flexPublic handle">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="showCountMsg=false">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="hedin">确定</li>
                </ul>
            </div>
        </div>

        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState, mapGetters } from "vuex";
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import TimeSelectBar from "@/components/TimeSelectBar/index"
    import saasMsg from '@/components/message/message'
    export default {
        name: "user",
        data(){
            return{
                showCountMsg:false,//上报显示false隐藏 true显示
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
                currentyear:'',//当前年份
                proofType:'0',
                loading: false,
                verify:true,//判断页面是否可以修改，true默认可修改--未上报，若为false不可修改--已上报
                verifyTime:'',
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                jyear:''
            }
        },
        components: {TimeSelectBar,
            saasMsg},

        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgcode:state => state.user.orgcode
            }),

        },
        mounted(){
            this.getBeginYear();
            this.getChecked();
        },
        methods:{
            /*获取结账年*/
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        if(res.Record.length>0){
                            this.jyear=res.Record[0].JYear;
                        }else{
                            let currentYear = new Date();
                            this.jyear=currentYear.getFullYear();
                        }
                    })
                    .catch(err=>console.log(err))
            },
            /*
            *上报
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
                this.changeBtn.title='编辑';
                this.changeBtn.disable=true;
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
                   /* this.$message({ showClose: true, message:'已经进行过预算上报，不可进行修改',type: 'error' })*/
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
                    this.currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear= this.currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    year=this.currentyear;
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
                    this.loading=false;
                    let  code_firstCount={},//存放一级科目对应预算数
                        specialSubIndex={};//存放特殊的科目
                    //循环遍历，得到一级子目录一级对应的预算数
                    //计算上年决算数对应的本年合计收入，以及本年支出合计
                    // 得到  本年收入合计,本年支出合计，本年结余，上年结余，收回投资，本年投资，本年提取后备金，期末滚存结余  对应数组用于计算
                    console.log(res.Record[0]);
                    if( res.Record[0].VerifyStart==1){
                        this.verify=false;
                        this.verifyTime=res.Record[0].VerifyStart_time;
                    }else{
                        this.verify=true;
                    }
                    for(var i in res.Record){
                        res.Record[i].OrgId=this.orgid;
                        res.Record[i].OrgCod=this.orgcode;
                        res.Record[i].Uyear=year;

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

                  this.saasMessage={
                      message:res.Msg,
                      delay:3000,
                      visible:true
                  };
                  that.getBeginYear();
                  that.changeBtn.disable=true
              }).catch(function(err){
                  that.loading=false;
                  that.changeBtn.disable=true;
                  this.saasMessage={
                      message:'保存异常，请刷新页面后重试',
                      delay:3000,
                      visible:true
                  };
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
                    let time=this.timeFor(new Date());

                    for (let i in this.budgetList) {
                        this.budgetList[i].VerifyStart = 1;
                        this.budgetList[i].VerifyStart_time=time;
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
                        that.saasMessage={
                            message:"年初预算上报成功!",
                            delay:3000,
                            visible:true
                        };
                        that.showCountMsg = false;
                        that.getBeginYear();

                    }).catch(function (err) {
                        that.loading = false;
                        console.log(err);
                    })
                }else{
                    this.saasMessage={
                        message:"已经上报年初预算!",
                        delay:3000,
                        visible:true
                    };
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
                /*this.getPdf(this.$refs.printFrom);*/
                let dm = this.$refs.printFrom.parentNode.firstChild.cloneNode(true);

                dm.classList.add('first_child');

                let cop = this.$refs.printFrom.cloneNode(true);
                cop.classList.remove('formData_content');
                cop.insertBefore(dm,cop.firstChild);
                //获取打印内容的子节点 ;
                let childList=cop.childNodes;

               let len=13;
                let level=Math.ceil(childList.length/len);
                for(var i=1; i<level ; i++){
                    childList[i*len].setAttribute('style','page-break-after:always');
                    childList[i*len+1].setAttribute('style','border-top:1px solid #ebeef5;margin-top:20px');
                }
                this.$print(cop);
            },
            //刷新
            refresh:function(){
                this.getBeginYear();
            },
            /*
            * 当前时间格式化
            *
            * */
            timeFor:function(ti){
                let time=new Date(ti);
                let year = time.getFullYear(),
                    month = time.getMonth()+1<10?'0'+(time.getMonth()+1):time.getMonth()+1,
                    day = time.getDate()<10?"0"+time.getDate():time.getDate() ,
                    hours=time.getHours()<10?"0"+time.getHours():time.getHours(),
                    minutes=time.getMinutes()<10?"0"+time.getMinutes():time.getMinutes(),
                    second=time.getSeconds()<10?"0"+time.getSeconds():time.getSeconds();

                return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+second
            }
        }
    }
</script>

<style scoped>
    @media print{
        html,body{
            height: inherit;
        }
        body{
            height: inherit !important;
        }
        #printForm{
            height: inherit !important;
        }
    }
    .disableBtn{
        color: #cccccc !important;
        background: #fff !important;
        border-color: #ccc !important;
        cursor: not-allowed !important;
    }
    .flexUl{
        float: right;
    }
    .flexUl>a>li{
        display: inline-block;
        float: left;
        vertical-align: top;
    }
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
    .formData_content{
        margin-top: 0;
        position: absolute;
        overflow-y: scroll;
        bottom: -50px;
        top: 100px;
        left: 0;
        right: -17px;
    }
    .formData_content>ul:first-child{
        background: transparent;
        margin-top: 0;
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
        border-right:1px solid #ebeef5;
        border-left:0;
        border-bottom:0;
        text-align: left;
        line-height: 48px;
        height:48px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 15px;
    }
    .formData>ul.formDataItems>li.bolder{
       font-weight: bold;
    }

    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ebeef5;
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
    .formData>ul.formDataItems>li.align-center{
        padding:0;
        text-indent: 40px;
    }
    .formData>ul.formDataItems>li.align-centers{
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
        border-right:1px solid #ebeef5;
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
        box-shadow: 0 0 5px 1px #d3e9f9;
    }
    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 30px 20px;
    }
    .coverContent ul{
        padding: 30px 50px;
    }
    .coverContent ul li:nth-of-type(1){
        border: 1px solid #ccc;
        color: #fff;
        background-color: #ccc;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(1):hover{
        color: #ccc;
        background-color: #fff;
    }
    .coverContent ul li:nth-of-type(2){
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(2):hover{
        color: #00B8EE;
        background: #fff;
    }
</style>

