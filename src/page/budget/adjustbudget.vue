<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent" v-loading="loading">
                <div class="reportBox">

                    <div class="unionState" style="width: 100%;height: 30px">
                        <div class="biaoqian" @click="showReport=true">预算说明书（年中调整）</div>
                        <div style="width:100%;float: right">
                            <ul class="flexUl handle" :style="{'display': changeBtn.disable?'block':'none'}">
                                <li  v-if="Roleauthorize.midyearAdjust_edit!=0" :class="{'disableBtn':!verify}" @click="!verify?'':changeBtn.disable=false">编辑</li >
                                <li  v-if="Roleauthorize.midyearAdjust_before!=0" :class="{'disableBtn':!verify||date1.choosedYear>jyear}" @click="showCountMsg=(verify&&date1.choosedYear<=jyear)">上报调整</li>
                                <li  v-if="Roleauthorize.midyearAdjust_export!=0" @click="openReport(1)">导出</li >
                                <li  v-if="Roleauthorize.midyearAdjust_print!=0" @click="openReport(0)">打印</li >
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                            <ul class="flexUl handle" :style="{'display': !changeBtn.disable?'block':'none'}">
                                <li @click="quxiao">取消</li >
                                <li @click="saveChange">保存</li>
                                <li style="width: 72px;" :class="{'disableBtn':!verify||date1.choosedYear>jyear}" @click="showCountMsg=(verify&&date1.choosedYear<=jyear)">保存并上报</li>
                            </ul>

                        </div>

                    </div>

                    <div class="formData" id="form1">
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="25%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>科目编码</td>
                                    <td>科目名称</td>
                                    <td>年初核定预算数（元）</td>
                                    <td>预算调整数（元）</td>
                                    <td>调整后预算数（元）</td>
                                    <td>说明</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tbBody ">
                            <table  ref="printFrom">
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="15%"/>
                                    <col width="25%"/>
                                </colgroup>
                                <tbody >
                                    <template v-for="(item,index) in budgetList">
                                        <template v-if="item.SubjectCode=='BNSRHJ'">
                                            <tr>
                                                <td></td>
                                                <td class="bolder center">{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    <input disabled  :value="item.ApprovedBudgetTotal-item.BudgetTotal | NumFormat">
                                                </td>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                </td>
                                                <td  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input maxlength="250" :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" type="text" :value="item.DescriptionMiddle"  :index="index" @input="inputDicription">
                                                </td>
                                            </tr>

                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNZCHJ'">
                                            <tr>
                                                <td></td>
                                                <td class="bolder center">{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    <input disabled  :value="item.ApprovedBudgetTotal-item.BudgetTotal | NumFormat">
                                                </td>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                </td>
                                                <td :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input maxlength="250" type="text" :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" :value="item.DescriptionMiddle"  :index="index" @input="inputDicription">
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNJY'">
                                            <tr>
                                                <td ></td>
                                                <td class="center bolder">{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    <input disabled  :value="item.ApprovedBudgetTotal-item.BudgetTotal | NumFormat">
                                                </td>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                </td>
                                                <td  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    其中：政府补助结余：<input maxlength="250" :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" class="other" type="text"  :index="index" :value="item.DescriptionMiddle" @input="inputDicription">
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='SNJY'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal| NumFormat}}</td>
                                                <td class="right">
                                                    <input disabled :value="item.ApprovedBudgetTotal-item.BudgetTotal| NumFormat">
                                                </td>
                                                <td class="right">{{item.ApprovedBudgetTotal| NumFormat}}</td>
                                                <td  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    其中：政府补助结余：<input maxlength="250" :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" class="other" type="text" :value="item.DescriptionMiddle"  :index="index" @input="inputDicription">
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNSHTZ'">
                                            <tr >
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td class="right"   :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red'}" :value="item.ApprovedBudgetTotal-item.BudgetTotal| NumFormat"  :index="index" :code="item.SubjectCode"  @blur="inputLis"  @focus="clearZero" @keyup="clearNum" >
                                                </td>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                </td>
                                                <td   :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input maxlength="250" :disabled="changeBtn.disable" type="text" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" :value="item.DescriptionMiddle"  :index="index" @blur="inputDicription">
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNTZ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td class="right" :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input  :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red'}" :value="item.ApprovedBudgetTotal-item.BudgetTotal| NumFormat"  :index="index" :code="item.SubjectCode"  @blur="inputLis"  @focus="clearZero" @keyup="clearNum" >
                                                </td>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                </td>
                                                <td  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input maxlength="250" :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" type="text" :value="item.DescriptionMiddle"  :index="index" @blur="inputDicription">
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNTQHBJ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    <input disabled  :value="item.ApprovedBudgetTotal-item.BudgetTotal| NumFormat">
                                                </td>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                </td>
                                                <td  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input maxlength="250" :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}"  type="text" :value="item.DescriptionMiddle"  :index="index" @blur="inputDicription">
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='QMGCJY'">
                                            <tr>
                                                <td></td>
                                                <td class="center bolder">{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    <input disabled  :value="item.ApprovedBudgetTotal-item.BudgetTotal| NumFormat" >
                                                </td>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                </td>
                                                <td>
                                                    其中：政府补助结余：<input maxlength="250"  :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" class="other" type="text" :value="item.DescriptionMiddle"  :index="index" @blur="inputDicription">
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.k_name!='未找到该科目编码对应的科目'">
                                            <tr>
                                                <td :style="{'text-indent':item.Layers==1?'20px':''}">{{item.SubjectCode}}</td>
                                                <td :style="{'text-indent':item.Layers==1?'40px':''}">{{item.k_name}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>

                                                <template v-if="item.Layers==0">
                                                    <!--判断有没有子级科目，有则禁用，没有则添加输入方法-->
                                                    <template v-if="budgetList[index+1].SubjectCode.substring(0,item.SubjectCode.length)!=item.SubjectCode">
                                                        <td class="right"  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                        <input  :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red'}"  :index="index" :code="item.SubjectCode" :layer="item.Layers"  @focus="clearZero" @keyup="clearNum"   @blur="inputLis" :value="(item.ApprovedBudgetTotal-item.BudgetTotal )| NumFormat">
                                                        </td>
                                                    </template>
                                                    <template v-else>
                                                        <td class="right">
                                                        <input disabled  :code="item.SubjectCode" :value="(item.ApprovedBudgetTotal-item.BudgetTotal)| NumFormat">
                                                        </td>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <td class="right"  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input  :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red'}" :index="index" :code="item.SubjectCode" :layer="item.Layers"  @blur="inputLis"  @focus="clearZero" @keyup="clearNum" :value="(item.ApprovedBudgetTotal-item.BudgetTotal )| NumFormat">
                                                    </td>
                                                </template>
                                                <td class="right">
                                                    <p>{{item.ApprovedBudgetTotal | NumFormat}}</p>
                                                    <p>已发生金额<span>{{item.ThisaccountsTotal | NumFormat}}</span></p>
                                                </td>
                                                <td  :style="{'background-color': changeBtn.disable?'':'#fafafa'}">
                                                    <input maxlength="250" :disabled="changeBtn.disable" :style="{'color': changeBtn.disable?'':'red','text-align':'left'}" type="text" :value="item.DescriptionMiddle" :index="index" @blur="inputDicription">
                                                </td>
                                            </tr>
                                        </template>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <!--表头和表尾隐藏-->
                        <table style="display: none">
                            <colgroup>
                                <col width="10%"/>
                                <col width="20%"/>
                                <col width="15%"/>
                                <col width="15%"/>
                                <col width="15%"/>
                                <col width="25%"/>
                            </colgroup>
                            <div id="theadArea">
                                <tr>
                                    <td colspan="6" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">工会收支预算表（调整）</td>
                                </tr>

                                <tr>
                                    <td class="left" colspan="2" style="border:none;background-color: #fff;">编制单位：{{orgName}}</td>
                                    <td class="left" style="border:none;background-color: #fff;">年度：{{date1.choosedYear}}</td>
                                    <td class="left" colspan="2" style="border:none;background-color: #fff;">编报日期：{{date2}}</td>
                                    <td class="right" style="border:none;background-color: #fff;">单位：元</td>
                                </tr>
                            </div>

                            <div id="tbodyArea">
                                <tr>
                                    <td colspan="6" style="border: 0;">
                                    <span  style="width: 25%;display: inline-block;float: left">
                                        工会主席：{{curOrg.Chairman}}
                                    </span>
                                        <span style="width: 35%;display: inline-block">
                                        经费审查委员会主任：{{curOrg.Director}}
                                    </span>
                                        <span style="width: 25%;display: inline-block">
                                        财务负责人：{{curOrg.Treasurer}}
                                    </span>
                                        <span style="width: 15%">
                                        制表：{{username}}
                                    </span>
                                    </td>
                                </tr>
                            </div>

                        </table>
                </div>
                </div>
                <div class="verifyPanel" :style="{display:!verify?'block':'none'}">
                    <div>已上报</div>
                    <div style="font-size: 14px">{{verifyTime.substring(0,10)}}</div>
                </div>
                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose" :showtype="'yearTime'" :nextYear="true" ref="aa"></time-select-bar>
                </div>
            </div>

        </div>
        <!--核定弹窗提示-->
        <div class="cover" :style="{'display':(showCountMsg?'block':'none'),'z-index':'999'}">
            <div class="coverContent">
                <div class="flexPublic">
                    <p>提示</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showCountMsg=false"></i>
                </div>
                <div>
                    <p>年中调整上报后不允许更改，确定上报？</p>
                </div>
                <ul class="flexPublic handle">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="showCountMsg=false">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="hedin">确定</li>
                </ul>
            </div>
        </div>
        <!--打印选择-->
        <div class="cover" :style="{'display':(showReportMsg.flag?'block':'none'),'z-index':'999'}">
            <div class="coverContent">
                <div class="flexPublic">
                    <p>
                        <template v-if="showReportMsg.type==0">
                            选择要打印的内容
                        </template>
                        <template v-else>
                            选择要导出的内容
                        </template>
                    </p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.flag=false"></i>
                </div>
                <div>
                    <el-checkbox v-model="showReportMsg.printChoice[0]">封面</el-checkbox>
                    <el-checkbox v-model="showReportMsg.printChoice[1]">说明</el-checkbox>
                    <el-checkbox v-model="showReportMsg.printChoice[2]">报表</el-checkbox>
                </div>
                <ul class="flexPublic handle">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="showReportMsg.flag=false">取消</li>
                    <template v-if="showReportMsg.type==0">
                        <li style='margin:0 0 0px 20px;cursor: pointer' @click="printContent">打印</li>
                    </template>
                    <template v-else>
                        <li style='margin:0 0 0px 20px;cursor: pointer' @click="postBalanceSheetExcel">导出</li>
                    </template>

                </ul>
            </div>
        </div>
        <!--打印封面弹窗-->
        <div class="cover" :style="{'display':(showReport?'block':'none'),'z-index':'998'}">
            <i class="el-icon-close" @click="showReport=false" style="margin-top: 6%;right: 6%;"></i>
            <div style="width: 90%;height: auto;margin: 5%;box-shadow: 0 0 10px 1px #0000005e;">
                <div class="coverContentFace" id="face">
                    <div  id="stepOne" :style="{'display':showAreaReport=='stepOne'?'':'none'}">
                        <div>
                            <div class="face_title">
                                <input disabled type="text"/>总工会
                            </div>
                            <div class="face_year">
                                <input disabled type="text"/>年度
                            </div>
                            <div class="face_name">
                                工会经费收支预算表（年中调整）
                            </div>
                            <div class="face_manu">
                                <div>目录</div>
                                <ul>
                                    <li>1. 本级预算说明书（年中调整）</li>
                                    <li>2. 本级经费收支预算表（年中调整）</li>
                                    <!--<li>3. 本级机关支出预算表（县以上）</li>-->
                                </ul>
                            </div>
                            <div class="face_sign">
                                <div>
                                    <!-- <p>
                                         本预算业经<input />年<input />月<input />日
                                     </p>
                                     <p>
                                         第<input />届<input />次<input />工会委员会（常委会）讨论通过
                                     </p>-->
                                    <p>
                                        工会主席：<input disabled :value="curOrg.Chairman"/>
                                        财务部长：<input disabled :value="curOrg.Treasurer"/>
                                        制表：<input disabled :value="username"/>
                                    </p>
                                </div>
                                <div>
                                    <!-- <p>
                                         本预算业经<input />年<input />月<input />日</p>
                                     <p>
                                         第<input />届<input />次经费审查委员会审查
                                     </p>-->
                                    <p>
                                        经费审查委员会主任：<input disabled :value="curOrg.Director"/>
                                    </p>
                                </div>
                            </div>
                            <div class="face_reportTime">
                                报出日期：<input disabled/>年<input disabled />月<input disabled/>日
                            </div>
                        </div>
                    </div>
                    <div id="stepTwo" :style="{'display':showAreaReport=='stepSecond'?'':'none'}">
                        <h2>预算说明书（年中调整）编辑</h2>
                        <tinymce-editor
                            ref="editor"
                            id="adjustbudget-editor"
                            v-model="tableFace.Content"
                            :initvalue="tableFace.Content"
                            :disabled='false'
                            :style="{'margin-top': '15px'}"
                        >
                        </tinymce-editor>
                    </div>
                    <div id="stepThird" :style="{'display':showAreaReport=='stepThird'?'':'none'}">
                        <h2 style="margin-bottom: 25px">预算说明书</h2>
                        <div id="third" style="text-align:left"></div>
                    </div>
                    <div style="margin-top: 40px;margin-bottom: 20px">
                        <el-button @click="showAreaReport=showAreaReport=='stepThird'?'stepSecond':'stepOne'">上一步</el-button>
                        <el-button @click="showArea" :style="{'display':showAreaReport=='stepThird'?'none':''}">下一步</el-button>
                        <el-button :style="{'display':showAreaReport!='stepThird'?'none':''}" @click="saveText">保存</el-button>
                    </div>
                </div>
            </div>


        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import { mapState, mapGetters } from "vuex";
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import saasMsg from '@/components/message/message'
    import tinymceEditor from '@/components/tinymce/tinymce-editor.vue'
    let balanceData=[];
    export default {
        name: "user",
        data(){
            return{
                showReport:false,
                showReportMsg:{
                    type:0,//0表示打印,1表示导出
                    flag:false,
                    printChoice:[false,false,true]
                },
                showAreaReport:'stepOne',
                showCountMsg:false,//核定显示
                downloadLoading: false,
                changeBtn:{
                    flag:true,
                    title:'编辑',
                    disable:true,
                },
                budgetList:[],//数据库查询的全部数据
                code_first:[],//一级科目数据
                code_firstCount:[],//一级科目数据对应的合计数
                specialSubIndex:[],//特殊科目对应的下标数组，用于计算
                date1:[],
                date2:'',
                currentyear:'',//当前年份
                proofType:'0',
                loading:false,
                verify:true,//判断页面是否可以修改，true默认可修改，若为false不可修改
                verifyTime:'',
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                jyear:'',
                tableFace:{
                    phid:'',
                    Content:''
                },
            }
        },
        components: {TimeSelectBar,saasMsg,tinymceEditor},
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgcode:state => state.user.orgcode,
                orgName:state=>state.user.orgName,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
            }),
        },
        mounted(){
            this.getChecked();

            let currentYear = new Date();
            //获取编报日期
            this.date2=currentYear.getFullYear()+'年'+(currentYear.getMonth()+1<10?'0'+(currentYear.getMonth()+1):currentYear.getMonth()+1)+'月'+(currentYear.getDate()<10?'0'+currentYear.getDate():currentYear.getDate())+'日';
        },
        methods:{
            //打开打印导出选择弹窗
            openReport:function(type){
                this.showReportMsg.flag=true;
                this.showReportMsg.type=type;
            },
            clearZero:function(val){
                // 
                /*let k='';
                if(val.target.value[0]=='-'){
                    k='-';
                }*/
                val.target.value=val.target.value.replace(/\,/g,"");

                if(val.target.value=='0.00'){
                    val.target.value='';
                }
            },
            /*清空为0的input框*/
            clearNum:function(val){
                let obj =val.target;
                let index=obj.value;//当前修改数据
                let k='';
                if(obj.value[0]=='-'){
                    k='-';
                }
                obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
                obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
                if(obj.value.indexOf(".")< 0 && obj.value !="" && obj.value!='-'){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                    obj.value= parseFloat(obj.value);
                }
                obj.value= k+obj.value;
                if(index=='0.00'){
                    val.target.value='';
                }
            },
            /*获取结账年*/
            getChecked(){
                var data={
                    uid:this.userid,
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
           *核定
           *
           * */
            hedin:function(){
                this.verifyMiddle();
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
                    this.saasMessage={
                        message:'已进行过年中调整上报，不可进行修改',
                        delay:3000,
                        visible:true
                    };
                    /*this.$message({ showClose: true, message:'已经进行过年中调整核定，不可进行修改',type: 'error' })*/
                }
            },
            /*
            * 修改保存
            * */
            saveChange:function(){
                const loadings=this.$loading();
                let that=this;
                this.$axios.post(
                    'PSubjectBudget/PostSave',
                    {
                        "uid": this.userid,
                        "orgid": this.orgid,
                        'value':2,
                        'Ryear':this.date1.choosedYear,
                        "infodata": this.budgetList
                    }
                ).then(function(res){
                    loadings.close();
                    that.saasMessage={
                        message:res.Msg,
                        delay:3000,
                        visible:true
                    };
                    //that.$message({ showClose: true, message:res.Msg,type: 'success' });
                    that.getMiddleYear();
                    that.changeBtn.disable=true
                }).catch(function(err){
                    loadings.close();
                    that.changeBtn.disable=true;
                    that.saasMessage={
                        message:'保存异常，请刷新页面后重试',
                        delay:3000,
                        visible:true
                    };
                    //that.$message({showClose:true, message:'保存异常，请刷新页面后重试'});
                    console.log(err);
                })

            },
            /*
            * 核定
            * */
            verifyMiddle:function(){
                if(this.verify){
                    let that=this;
                    let time=this.timeFor(new Date());
                    const loadings=this.$loading();
                    for(let i in this.budgetList){
                        this.budgetList[i].VerifyMiddle=1;
                        this.budgetList[i].VerifyMiddle_time=time;
                    }
                    this.$axios.post(
                        'PSubjectBudget/PostSave',
                        {
                            "uid": this.userid,
                            "orgid": this.orgid,
                            'value':2,
                            'Ryear':this.date1.choosedYear,
                            "infodata": this.budgetList
                        }
                    ).then(function(res){
                        loadings.close();
                        that.showCountMsg=false;
                        that.saasMessage={
                            message:'年中调整上报成功',
                            delay:3000,
                            visible:true
                        };
                        that.getMiddleYear();
                    }).catch(function(err){
                        loadings.close();
                        that.changeBtn.disable=true
                        console.log(err);
                    })
                }else{
                    this.saasMessage={
                        message:'已经上报年中调整',
                        delay:3000,
                        visible:true
                    };
                    /*this.$message({ showClose: true, message:'已经核定年中调整',type: 'error' })*/
                }
            },
            /*
            * 监听数据输入
            * */
            inputLis:function(val){
                let code = val.target.attributes.code.value;//当前修改数据的code
                let index=val.target.attributes.index.value;//当前修改数据在列表中的下标
               /* let in_value = parseFloat(val.target.value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g));//input数据转数字*/
                let in_value = '';
                val.target.value=val.target.value.replace(/[^\d.,-]/g,"");  //清除“汉字”和“.”以外的字符
                let numList=val.target.value.split(',');
                for(var i in numList){
                    in_value+=numList[i];
                }
                // input数据转数字
                in_value=Number(in_value);
                if(in_value==0){
                    val.target.value='0.00';
                }
                let code_first=this.code_first;//一级科目数据列表
                if(!isNaN(in_value)){
                    if(in_value+this.budgetList[index].BudgetTotal<this.budgetList[index].ThisaccountsTotal){
                        this.saasMessage={
                            message:'调整后预算数不应小于已发生金额，请检查输入的调整数是否有误',
                            delay:3000,
                            visible:true
                        };
                        let k =this.budgetList[index].ApprovedBudgetTotal;
                    }else{
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
                                if(codeSub==this.budgetList[i].SubjectCode){
                                    let layer=val.target.attributes.layer.value;//当前修改数据时父级菜单还是子集菜单
                                    //判断是父级科目还是子级科目
                                    //如果是子级科目，则先修改数组中父级科目的值，计算之后再修改本身的值；父级科目则先计算其他值，再修改自身

                                    if(layer!='0'){
                                        this.budgetList[i].ApprovedBudgetTotal=parseFloat(this.budgetList[i].ApprovedBudgetTotal)- (this.budgetList[index].ApprovedBudgetTotal-this.budgetList[index].BudgetTotal)+in_value;
                                    }

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
                                    this.code_firstCount[codeSub]=parseFloat(this.budgetList[i].ApprovedBudgetTotal)-parseFloat(this.budgetList[i].BudgetTotal);
                                    //计算本年结余
                                    this.budgetList[this.specialSubIndex['BNJY']].ApprovedBudgetTotal=this.budgetList[this.specialSubIndex['BNSRHJ']].ApprovedBudgetTotal-this.budgetList[this.specialSubIndex['BNZCHJ']].ApprovedBudgetTotal;
                                    if(layer=='0'){
                                        this.budgetList[i].ApprovedBudgetTotal=parseFloat(this.budgetList[i].ApprovedBudgetTotal)- (this.budgetList[index].ApprovedBudgetTotal-this.budgetList[index].BudgetTotal)+in_value;
                                    }
                                    break;
                                }
                            }
                        }
                        //修改该科目在总list中的数据
                        this.budgetList[index].ApprovedBudgetTotal=in_value+this.budgetList[index].BudgetTotal;
                    }

                }
                else{
                    this.budgetList[index].ApprovedBudgetTotal=this.budgetList[index].ApprovedBudgetTotal;
                }
            },
            /*
            * 监听说明的input输入
            * */
            inputDicription:function(val){
                //let code = val.target.attributes.code.value;//当前修改数据的code
                let index=val.target.attributes.index.value;//当前修改数据在列表中的下标
                let in_value = val.target.value;//input数据转数字
                this.budgetList[index].DescriptionMiddle=in_value;
            },
            //时间选择器
            dateChoose:function(val){
                this.date1=val;
                this.getMiddleYear();
                this.changeBtn.title='编辑';
                this.changeBtn.disable=true;
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
                let year='';
                year=this.date1.choosedYear;
                let data={
                    "uid": this.userid,
                    "orgid":this.orgid,
                    "Year":  year,
                    "OrgIds": this.orgid,
                    'IsStart':1
                }
                const loadings=this.$loading();
                this.$axios.get(
                    'PSubjectBudget/GetMiddleYear',
                    {params:data}
                ).then(res=>{
                    loadings.close();
                    let code_first=[],//存放一级科目
                        code_firstCount={},//存放一级科目对应预算数
                        specialSubIndex={};//存放特殊的科目

                    //循环遍历，得到一级子目录一级对应的预算数
                    //计算上年决算数对应的本年合计收入，以及本年支出合计
                    // 得到  本年收入合计,本年支出合计，本年结余，上年结余，收回投资，本年投资，本年提取后备金，期末滚存结余  对应数组用于计算

                    //判断是否已经核算
                    if( res.Record[0].VerifyMiddle==1){
                        this.verify=false;
                        this.verifyTime=res.Record[0].VerifyMiddle_time;
                    }else{
                        this.verify=true;
                    }
                    for(var i in res.Record){
                        res.Record[i].OrgId=this.orgid;
                        res.Record[i].OrgCod=this.orgcode;
                        res.Record[i].Uyear=year;

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
                    this.getText();
                }).catch(res=>{
                    loadings.close();
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
                let loading=this.$loading();
                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfigUncontrol();
                //下载封面
                if(this.showReportMsg.printChoice[0]){
                    let param = {
                        'uid':this.userid,
                        'orgid':this.orgid,
                        'Ryear':this.date1.choosedYear,
                        'value': 2
                    };
                    this.$axios.get('PSubjectBudgetMst/GetYearStartCover',{params:param}).then(res => {
                        //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        if(res.Status=="error"){
                            this.saasMessage={
                                message:res.Msg,
                                delay:3000,
                                visible:true
                            };
                        }else{
                            // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                            /*let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                            myWindow=null;*/
                            setTimeout(function(){
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
                            },50)
                        }
                        this.downloadLoading = false;
                        loading.close();
                    }).catch(err => {
                        loading.close();
                        console.log(err)
                    })
                }
                //下载说明书
                if(this.showReportMsg.printChoice[1]){
                    let param = {
                        'uid':this.userid,
                        'orgid':this.orgid,
                        'Ryear':this.date1.choosedYear,
                        'value': 2
                    };
                    this.$axios.get('PSubjectBudgetMst/GetDescriptionDocx',{params: param}).then(res => {
                        //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        if(res.Status=="error"){
                            this.saasMessage={
                                message:res.Msg,
                                delay:3000,
                                visible:true
                            };
                        }else{
                            // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                            /*setTimeout(
                                function(){
                                    let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                                    myWindow=null;
                                },100
                            )*/
                            setTimeout(function(){
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
                            },100)
                        }
                        this.downloadLoading = false;
                        loading.close();
                    }).catch(err => {
                        loading.close();
                        console.log(err)
                    })
                }
                //下载Excel
                if(this.showReportMsg.printChoice[2]){
                    let param = {
                        'uid':this.userid,
                        'orgid':this.orgid,
                        'infoData': this.budgetList
                    };
                    this.$axios({
                        method: 'post',
                        url: '/PsubjectBudget/PostExportMiddleYear',
                        data: param
                    }).then(res => {
                        //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        if(res.Status=="error"){
                            this.saasMessage={
                                message:res.Msg,
                                delay:3000,
                                visible:true
                            };
                        }else{
                            // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                            /*let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                            myWindow=null;*/
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
                }

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
            quxiao:function(){
                this.changeBtn.disable=true;
                this.getMiddleYear();
            },
            // 打印
            printContent(e){
                if(!this.showReportMsg.printChoice[0]&&!this.showReportMsg.printChoice[1]&&!this.showReportMsg.printChoice[2]){
                    this.saasMessage={
                        message:'请选择打印内容',
                        delay:3000,
                        visible:true
                    };
                    return;
                }

                let print = document.createElement("div");
                print.setAttribute('class','timeSelect');
                print.style.padding='30px 40px 30px 30px';
                if(this.showReportMsg.printChoice[0]){
                    let sto=document.getElementById('stepOne').cloneNode(true);
                    sto.setAttribute('class','coverContentFace');
                    sto.style.display='block';
                    sto.setAttribute('style','page-break-after:always');
                    print.appendChild(sto);
                    sto=null;
                }
                if(this.showReportMsg.printChoice[1]){
                    let stt=document.getElementById('stepThird').cloneNode(true);
                    stt.setAttribute('class','coverContentFace');
                    stt.style.display='block';
                    stt.setAttribute('style','page-break-after:always');
                    print.appendChild(stt);
                    stt=null;
                }
                if(this.showReportMsg.printChoice[2]){
                    //获取打印表格的内容调整，修改input数据打印无法正常显示
                    let printArea=this.$refs.printFrom.cloneNode(true);
                    let inputList=printArea.getElementsByTagName('input');
                    for(let inNum=0; inNum<inputList.length; inNum++){
                        let text=inputList[0].value==undefined?'':inputList[0].value;//获取打印区域input的值
                        let text1=inputList[0].parentNode.text==undefined?'':inputList[0].parentNode.text;//获取打印区域，除input以外的文本，’其中政府补助‘
                        inputList[0].parentNode.innerHTML=''+text1+text;
                    }
                    //获取打印表格的表头
                    let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                    //获取隐藏的工会组织科目名称的表头
                    let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                    //获取隐藏的表格内容--表尾
                    let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
                    //表头拼接
                    for(let i=thchilds.length-1;i>=0;i--){
                        dm.insertBefore(thchilds[i],dm.firstChild);
                    }

                    //表格内容拼接表尾
                    for(let i=0;i<tbchilds.length;i++){
                        printArea.lastChild.appendChild(tbchilds[i]);
                    }
                    printArea.insertBefore(dm,printArea.childNodes[2]);
                    print.appendChild(printArea);
                    dm=null;
                    printArea=null;
                }
                this.$print(print);
                print=null;
            },
            //刷新
            refresh:function(){
                this.$refs.aa.getNextYear();
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
            },
            showArea:function(){
                if(this.showAreaReport=='stepSecond'&&this.tableFace.Content!=''){
                    document.getElementById('third').innerHTML=this.tableFace.Content;
                    this.showAreaReport=(this.showAreaReport=='stepSecond'?'stepThird':'stepSecond')
                }else{
                    if(this.showAreaReport=='stepOne'){
                        this.showAreaReport='stepSecond';
                    }else{
                        this.$message('请填写说明')
                    }
                }

            },
            /*
          * 预算说明书查询
          * */
            getText:function(){
                let data={
                    orgid: this.orgid,
                    Uyear:this.date1.choosedYear,
                    DescriptionMiddle:1
                };
                this.$axios.get(
                    'PSubjectBudgetMst/GetDescriptionByOrgId',
                    {params:data}
                ).then(res=>{
                    console.log(res);
                    if(res.Status=='success'){
                        this.tableFace.phid=res.PhId;
                        this.tableFace.Content=res.Description;
                        document.getElementById('third').innerHTML=res.Description;
                    }else{
                        this.saasMessage={
                            message:res.Msg,
                            delay:3000,
                            visible:true
                        };
                    }

                }).catch(function(err){
                    this.saasMessage={
                        message:'保存异常，请刷新页面后重试',
                        delay:3000,
                        visible:true
                    };
                    console.log(err);
                })
            },
            /*
           * 预算说明书保存
           * */
            saveText:function(){
                let that=this;
                const loadings=this.$loading();
                this.$axios.post(
                    'PSubjectBudgetMst/PostSaveSubjectBudget',
                    {
                        "uid": this.userid,
                        "orgid": this.orgid,
                        'Phid':this.tableFace.phid,
                        "orgcode":this.orgcode,
                        'Uyear':this.date1.choosedYear,
                        'DescriptionMiddle':this.tableFace.Content
                    }
                ).then(res=>{
                    loadings.close();
                    this.saasMessage={
                        message:res.Msg,
                        delay:3000,
                        visible:true
                    };
                    that.changeBtn.disable=true;
                    this.showReport=false;
                    this.showAreaReport='stepOne';
                }).catch(function(err){
                    loadings.close();
                    that.changeBtn.disable=true;
                    this.showReport=false;
                    this.saasMessage={
                        message:'保存异常，请刷新页面后重试',
                        delay:3000,
                        visible:true
                    };
                    this.showAreaReport='stepOne';
                    console.log(err);
                })
            },

        }
    }
</script>

<style scoped>
    td p:nth-of-type(2){
        font-size: 12px;
        color: #9a9a9a;
        text-align: left;
    }
    td p span{
        margin-left: 5px;
        color: #00b7ee;
    }
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
    }
   /* .reportBox{
        margin-right: 0px;
    }
    .timeSelectBox{
        position: fixed;
        right: 0;
        top: 110px;
        bottom:0;
        width: 60px;
    }*/
    .pinzheng{
        margin-left: 120px;
    }
    .unionState>ul>li{
        width:100%;
    }
    .formData_content{
        position: absolute;
        overflow-y: scroll;
        bottom: 0px;
        top: 90px;
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
        width:15%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #ebeef5;
    }

    .formData>ul>li:first-child{
        width:11%;
        min-width: 70px;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(2){
        width:19%;
        min-width: 200px;
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
        border-right:1px solid #ebeef5;
        border-left:0;
        border-bottom:0;
        text-align: left;
        line-height: 48px;
        height:48px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding:0 15px;
    }
    .formData>ul.formDataItems>li.bolder{
        font-weight: bold;
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
        width:45%;
    }
/*弹窗样式*/
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
        border: 1px solid #00B8EE;
        color: #00B8EE;
        background:#FFF ;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(1){
        border: 1px solid #00B8EE;
        color: #00B8EE;
        background:#FFF ;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li{
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:hover{
        color: #00B8EE;
        background: #fff;
    }

    .disableBtn{
        color: #cccccc !important;
        background: #fff !important;
        border-color: #ccc !important;
        cursor: not-allowed !important;
    }
    .coverContentFace{
        width: 100%;
        background-color: #fff;
        border-radius: 3px 3px;
        overflow-x: hidden;
        font-size: 16px;
        text-align: center;
        page-break-after: always;
        padding: 15px;
    }

    .coverContentFace input{
        border-bottom: 1px solid #ccc;
        text-align: center;
        display: inline-block;
        width: 50px;
        padding-bottom: 0;
        letter-spacing: 0;
    }
    .face_title{
        margin-top: 20px;
        font-size: 30px;
    }
    .face_title input{
        width: 300px;
    }
    .face_year{
        margin-top: 20px;
        font-size: 28px;
    }
    .face_year input{
        width: 100px;
    }
    .face_name{
        margin: 30px;
        font-size: 40px;
        font-weight: 600;
        letter-spacing: 20px;
    }
    .face_manu{
        margin-top: 20px;
        font-size: 15px;
    }
    .face_manu div{
        display: inline-block;
        width: 20px;
        margin-left: 15px;
        margin-top: 3px;
    }
    .face_manu ul{
        width: 20%;
        display: inline-block;
        text-align: left;
    }
    .face_manu ul li {
        border-width: 0 0 1px 1px;
        border-style: solid;
    }
    .face_sign{
        margin-top: 70px;

    }
    .face_sign div{
        width: 45%;
        display: inline-block;
    }
    .face_sign div:first-child{
        text-align: right;
    }
    .face_sign div p:last-child{
        margin-top: 15px;
    }
    .face_reportTime{
        margin-top: 50px;
        font-size: 18px;
    }
    .el-icon-close{
        float: right;
        font-size: 24px;
        padding: 3px;
        cursor: pointer;
        position: relative;
        color: #cccccc
    }
</style>

