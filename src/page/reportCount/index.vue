<template>
    <div class="timeSelect">
        <div class="checkReport">
            <div style="text-align: left;margin:20px;color: #00B8EE;"><i class="el-icon-s-order"></i>请选择要汇总的报表</div>
            <select   v-model="chooseOp" placeholder="点击选择">
                <option
                    v-for="item in chooseList"
                    :value="item.value"
                >{{item.label}}
                </option>
            </select>
        </div>
        <div class="orgBox container" style="padding: 10px;width: 240px;right: auto">
            <!--工会选择栏-->
            <div style="position: absolute;top: 10px;bottom: 60px;margin: auto;width: 210px;border: 1px solid #eee;overflow: hidden">
                <div style="position: fixed;background-color: #fff;width: 208px;border-bottom: 1px solid #eee">
                    <div class="el-input el-input--prefix" style="text-align: center;height: 35px;overflow: hidden">
                        <div style="width: 200px;height: 26px;line-height: 26px;margin: auto;margin-top: 5px;">
                            <input type="text" autocomplete="off" placeholder="请输入工会名称"
                                   class="el-input__inner"
                                   style="width: 200px;height: 26px;line-height: 26px;font-size: 10pt;padding: 0 5px;"
                                   v-model="orgSearchValue" @keyup.enter="orgSearch" @blur="orgSearch" >
                            <i class="el-input__icon el-icon-lx-search" style="position: relative; left: -85px;z-index: 14; height: 26px;top: -28px;color: #dcdfe6;"></i>
                        </div>

                    </div>

                    <!--<el-input size="small" placeholder="请输入工会名称或编码" v-model="orgSearchValue" @keyup.enter="orgSearch" @blur="orgSearch">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>-->
                </div>
                <div style="margin-top: 45px;position: absolute;bottom: 0;top: 0px;width: 225px;overflow: auto">
                    <el-tree
                        class="filter-tree"
                        :lazy="false"
                        :default-expand-all="true"
                        :data="orgLists"
                        :props="defaultProps"
                        :highlight-current="true"
                        node-key="PhId"
                        :filter-node-method="filterNode"
                        :render-content="renderContent"
                        @node-click="handleNodeClick"
                        ref="orgTree">
                    </el-tree>
                    <!-- @node-contextmenu="rightClick"-->
                </div>
            </div>
            <!--已上报工会及未上报工会-->
            <div style="position: absolute;bottom: 10px;width: 210px;box-shadow: 0px -3px 7px -3px #45c0f7;width: 230px;margin-left: -10px;">
                <div style="float: left;width: 50%;text-align: center;cursor: pointer;color:#ff7f00;" @click="showVerifyOrNo(1)">
                    <div style="font-size: 20px;cursor: pointer;font-weight: bolder">{{orgListNew.Num}}</div>
                    <div style="cursor: pointer;font-weight: bolder">已月结</div>
                </div>
                <div style="float: right;width: 50%;text-align: center;cursor: pointer"  @click="showVerifyOrNo(2)">
                    <div style="font-size: 20px;cursor: pointer;font-weight: bolder">{{orgListNew.NoNum}}</div>
                    <div  style="cursor: pointer;font-weight: bolder">未月结</div>
                </div>
            </div>
        </div>
        <div class="container" style="left:250px">
            <assets v-if="chooseOp==0" :org="selectOrg" @dateChoose="dateChoose"></assets>
            <expenses v-if="chooseOp==1"  :org="selectOrg"></expenses>
            <intercourse v-if="chooseOp==2"  :org="selectOrg"></intercourse>
        </div>
        <!-- 右键显示 -->
        <div v-show="menuVisible">
            <ul id="menu" class="menu">
                <li class="menu__item" @click="reportBackUp(1)">退回</li>
                <li class="menu__item" @click="showOrgInfo">工会信息</li>
            </ul>
        </div>
        <!--组织账套弹窗-->
        <el-dialog :title="'工会信息'" :visible.sync="showOrg" width="900px" >
            <div style="width: auto; margin: 0 auto;">
                <div class="container" style="position:static;margin-top: -20px">
                    <ul>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">工会名称：</span></div>
                            <div class="orgedit-value">{{orgForm.OrgName}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">工会编码：</span></div>
                            <div class="orgedit-value">{{orgForm.UserAccount}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">统一社会信用代码：</span></div>
                            <div class="orgedit-value">
                                {{orgForm.EnterpriseCode}}
                            </div>
                            <div>
                                <el-popover trigger="hover" v-if="orgForm.EnterpriseAttachment">
                                    <img :src="picUrl+orgForm.EnterpriseAttachment" style="height: 300px;width: auto" />
                                    <img slot="reference" :src="picUrl+orgForm.EnterpriseAttachment" style="height: 30px;width: auto;margin-top: 5px" />
                                </el-popover>
                            </div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">单位地址：</span></div>
                            <input class="orgedit-value" style="border: 0 ;" :value="orgForm.Address" disabled />
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">联系电话：</span></div>
                            <div class="orgedit-value">{{orgForm.TelePhone}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">隶属工会：</span></div>
                            <div class="orgedit-value">{{orgForm.ParentName}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">财务账户账号：</span></div>
                            <div class="orgedit-value">{{orgForm.FinanceAccount}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">开户行名称：</span></div>
                            <div class="orgedit-value">{{orgForm.BankName}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">开户行号：</span></div>
                            <div class="orgedit-value">{{orgForm.BankAccount}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">会计制度：</span></div>
                            <div class="orgedit-value">{{orgForm.AccountSystem}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">启用日期：</span></div>
                            <div class="orgedit-value">{{orgForm.EnableTime}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">工会主席：</span></div>
                            <div class="orgedit-value">{{orgForm.Chairman}}</div>
                            <div>
                                <el-popover trigger="hover" v-if="orgForm.ChairmanAttachment">
                                    <img :src="picUrl+orgForm.ChairmanAttachment" style="height: 300px;width: auto" />
                                    <img slot="reference" :src="picUrl+orgForm.ChairmanAttachment" style="height: 30px;width: auto;margin-top: 5px" />
                                </el-popover>
                            </div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">经审主任：</span></div>
                            <div class="orgedit-value">{{orgForm.Director}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">财务主管：</span></div>
                            <div class="orgedit-value">{{orgForm.Treasurer}}</div>
                        </li>
                        <li class="orgedit-linehight">
                            <div class="orgedit-title"><span class="orgtitle-ringt">使用期限：</span></div>
                            <div class="orgedit-value">{{orgForm.ServiceStartTime}}-{{orgForm.ServiceEndTime}}</div>
                        </li>
                    </ul>

                </div>
            </div>
        </el-dialog>
        <!--上报、未上报组织弹窗-->
       <!-- <el-dialog :title="showReportOrgType==1?'已月结工会':'未月结工会'" :visible.sync="showReportOrg" width="750px" >
            <div style="height: 35px;margin-top: -35px;">
                <ul class="flexUl" >
                    <li @click="postOrgSheetExcel">导出</li >
                    <li @click="printContent(1)">打印</li >
                    &lt;!&ndash;<li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>&ndash;&gt;
                </ul>
                <ul  class="flexUl" style="line-height: 30px">
                    <div class="searcherValue" style="width: 250px;"><input type="text" placeholder="请输入工会名称" style="height: 30px;text-align: left;line-height: 30px" v-model="inputKvalue"></div>
                    <div  class="searcherBtn" style="margin-left: -8px" @click="searchCode">搜索</div>
                </ul>
            </div>
            <div>共
                <span style="color: #00B8EE;">{{showReportOrgType==1?SysOrgVerifyList.length:SysOrgNoVerifyList.length}}</span>
                条记录
                <el-checkbox style="margin-left: 10px;" v-model="checked" @change="checkedAll">全选</el-checkbox>
            </div>
            <div style="width: auto; margin: 0 auto;margin-top: 30px">
                <div class="container" style="position:static;margin-top: -20px;height:450px;overflow-y: auto">
                    &lt;!&ndash;<ul>
                        <template v-for="item in (showReportOrgType==1?SysOrgVerifyList:SysOrgNoVerifyList)">
                            <li style="height: 30px;line-height: 30px">{{item.OrgName}}</li>
                        </template>
                    </ul>&ndash;&gt;

                    <el-tree
                        class="filter-tree"
                        :data="showReportOrgType==1?SysOrgVerifyList:SysOrgNoVerifyList"
                        :props="defaultProps"
                        show-checkbox
                        node-key="PhId"
                        :filter-node-method="filterNode"
                        @check-change="handleCheckChange"
                        ref="vuetree">
                    </el-tree>
                    <div v-if="showReportOrgType==1" style="display: none;">
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="10%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td rowspan="2">序号</td>
                                    <td  colspan="4">已上报工会</td>
                                    <td  rowspan="2">隶属工会</td>
                                    <td rowspan="2">上报人</td>
                                    <td rowspan="2">上报时间</td>
                                </tr>
                                <tr>
                                    <td>名称</td>
                                    <td>工会主席</td>
                                    <td>财务主管</td>
                                    <td>联系电话</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tbBody ">
                            <table  ref="printFromOrg">
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="10%"/>
                                </colgroup>
                                <tbody >

                                <template v-for="(item,index) in checkedOrgList">
                                    <tr>
                                        <td class="center">{{index+1}}</td>
                                        <td class="center">{{item.OrgName}}</td>
                                        <td class="center">{{item.Director}}</td>
                                        <td class="center">{{item.Treasurer}}</td>
                                        <td class="center">{{item.TelePhone}}</td>
                                        <td class="center">{{item.ParentName}}</td>
                                        <td class="center">
                                            <template v-if="checkedBudget==0">
                                                {{item.StartReportMan}}
                                            </template>
                                            <template v-if="checkedBudget==1">
                                                {{item.MiddleReportMan}}
                                            </template>
                                            <template v-if="checkedBudget==2">
                                                {{item.EndReportMan}}
                                            </template>
                                        </td>
                                        <td>
                                            <template v-if="checkedBudget==0">
                                                {{item.StartReportDate.substring(0,10)}}
                                            </template>
                                            <template v-if="checkedBudget==1">
                                                {{item.MiddleReportDate.substring(0,10)}}
                                            </template>
                                            <template v-if="checkedBudget==2">
                                                {{item.EndReportDate.substring(0,10)}}
                                            </template>

                                        </td>
                                    </tr>

                                </template>

                                </tbody>
                            </table>
                        </div>
                        &lt;!&ndash;表头和表尾隐藏&ndash;&gt;
                        <table style="display: none">
                            <colgroup>
                                <col width="10%"/>
                                <col width="20%"/>
                                <col width="10%"/>
                                <col width="10%"/>
                                <col width="10%"/>
                                <col width="10%"/>
                                <col width="20%"/>
                                <col width="10%"/>
                            </colgroup>
                            <div id="theadAreaOrg">
                                <tr>
                                    <td colspan="8" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">已上报{{checkedBudget==0?'年初预算':(checkedBudget==1?'年初预算（调整）':'年末决算')}}基层工会名单</td>
                                </tr>

                                <tr>
                                    <td class="left" colspan="4" style="background-color: #fff;border: 0;">制表人：{{username}}</td>
                                    <td class="right" colspan="4" style="background-color: #fff;border: 0;">编报日期：{{date2}}</td>
                                </tr>
                            </div>

                            <div id="tbodyAreaOrg">
                                <tr>
                                    <td colspan="5" style="border: 0;">
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
                    <div v-if="showReportOrgType!=1" style="display: none;">
                        <div class="tbHeader">
                            <table>
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td rowspan="2">序号</td>
                                    <td  colspan="4">未上报工会</td>
                                    <td  rowspan="2">隶属工会</td>
                                </tr>
                                <tr>
                                    <td>名称</td>
                                    <td>工会主席</td>
                                    <td>财务主管</td>
                                    <td>联系电话</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tbBody ">
                            <table  ref="printFromOrg">
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                </colgroup>
                                <tbody >

                                <template v-for="(item,index) in checkedOrgList">
                                    <tr>
                                        <td class="center">{{index+1}}</td>
                                        <td class="center">{{item.OrgName}}</td>
                                        <td class="center">{{item.Director}}</td>
                                        <td class="center">{{item.Treasurer}}</td>
                                        <td class="center">{{item.TelePhone}}</td>
                                        <td class="center">{{item.ParentName}}</td>
                                    </tr>

                                </template>

                                </tbody>
                            </table>
                        </div>
                        &lt;!&ndash;表头和表尾隐藏&ndash;&gt;
                        <table style="display: none">
                            <colgroup>
                                <col width="10%"/>
                                <col width="20%"/>
                                <col width="20%"/>
                                <col width="20%"/>
                                <col width="20%"/>
                                <col width="20%"/>
                            </colgroup>
                            <div id="theadAreaOrg">
                                <tr>
                                    <td colspan="6" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">未上报{{checkedBudget==0?'年初预算':(checkedBudget==1?'年初预算（调整）':'年末决算')}}基层工会名单</td>
                                </tr>

                                <tr>
                                    <td class="left" colspan="3" style="background-color: #fff;border: 0;">制表人：{{username}}</td>
                                    <td class="right" colspan="3" style="background-color: #fff;border: 0;">编报日期：{{date2}}</td>
                                </tr>
                            </div>

                            <div id="tbodyAreaOrg">
                                <tr>
                                    <td colspan="5" style="border: 0;">
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
                    </div >
                </div>
            </div>
        </el-dialog>-->
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    import assets from './tableReport/assets'//资产负债表
    import expenses from './tableReport/expenses'//收入支出表
    import intercourse from './tableReport/assets'//往来明细款项表
    import { mapState, mapGetters } from "vuex";
    import saasMsg from '@/components/message/message'
    import axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import {SysOrgModel, SysOrgUpdate, SysOrgUploadFile, SysOrgDelete, AllAreaSysOrgModel, SysOrgUpdateAndRecord} from '@/api/organize/orgInfo'
    import qs from 'qs';
    export default {
        name: "index",
        data(){
            return {
                orgSearchValue:'',
                orgLists:[],
                defaultProps: {
                    children: 'children',
                    label: 'OrgName'
                },
                orgListNew:{Num:0,NoNum:0},

                menuVisible:false,//右键面板显示隐藏
                showOrg:false,//显示组织信息面板
                showReportOrg:false,//显示上报组织
                showReportOrgType:1,
                orgForm: {
                    // PhId: 0,
                    OrgName: '',
                    Category:'',
                    Layers:'',
                    UserAccount:'',
                    EnterpriseCode: '',
                    EnterpriseAttachment: '',
                    Address: '',
                    TelePhone: '',
                    FinanceAccount:'',
                    Province:'',
                    City:'',
                    County:'',
                    Street:'',
                    Parent:'',
                    ParentId:'',
                    ParentName:'',
                    ParentEnCode:'',
                    BankName:'',
                    BankAccount:'',
                    AccountSystem: '',
                    EnableTime: '',
                    Chairman: '',
                    ChairmanAttachment: '',
                    Director: '',
                    Treasurer:'',
                    ServiceStartTime: '',
                    ServiceEndTime: '',
                    Integrity: '',

                },//组织信息
                chooseOp:0,
                chooseList:[{value:0,label:'资产负债表'},{value:1,label:'收入支出表'},{value:2,label:'往来款项明细表'}],
                date:'',
                inputKvalue:'',
                showNextMsg:false,
                showReport:false,
                showReportMsg:{
                    type:0,//0表示打印,1表示导出
                    flag:false,
                    printChoice:[false,false,true]
                },
                showAreaReport:'stepOne',
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
                jyear:'',
                jmonth:0,
                byear:'',
                tableFace:{
                    phid:'',
                    Content:''
                },
                nextYearFlag:true,
                date2:'',
                checkedBudget:0,
                dataInfo:[{zhixing:30}],
                infoStyle:[`#ff9900`],
                selectOrg:{},//选中的组织
                selectOrgRight:{},//右键选中的组织
                dbTime:false,
                menuForm:{//右键菜单
                    menuVisible:false,//显示隐藏
                },
                SysOrgNoVerifyList:[],//未上报的组织数组
                SysOrgVerifyList:[],//上报的组织数组
                orgListsNew:{},
                checked:false,//上报、未上报，组织全选
                checkedOrgList:[],//上报、未上报，选中的组织
            }
        },
        components:{ assets,expenses,intercourse,saasMsg},
        activated(){
            if(this.$route.query){
                this.chooseOp=this.$route.query.checkedBudget==undefined?0:this.$route.query.checkedBudget;
            }
        },
        mounted(){
            this.date=new Date();
            this.orgSearch(this.date);
        },
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
                dbname:state => state.user.dbname,
            }),
        },
        methods:{
            //根据子组件返回的时间查询组织上报状态
            dateChoose:function(val){
                console.log(val);return
                this.orgSearch(val.date)
            },
            //侧边组织数查询方法---传入时间
            orgSearch:function(val){
                // SysOrganize/GetOrgListByOrgIdAndName([FromUri]string orgId, string year, string name)
                /*if(this.orgSearchValue==''){
                    this.orgLists=this.orgListsNew;
                }else{*/
                    const loadings=this.$loading();

                    let data={
                        orgid:this.orgid,
                        accountPeriod :val,
                        name:this.orgSearchValue
                    };
                    this.$axios.get('/SysOrganize/GetAllOrgListForMonth',{params:data}).then(res=>{

                        if(res.Status=='success'){
                            this.orgLists=JSON.parse(res.Data);
                            this.selectOrg=this.orgLists[0];
                            this.orgListNew={Num:res.Num,NoNum:res.NoNum};
                        }else{
                            this.saasMessage={
                                message:'组织查询失败，请刷新页面后请重试',
                                delay:3000,
                                visible:true
                            };
                        }
                        loadings.close();
                    }).catch(err=>{
                        this.saasMessage={
                            message:'组织查询失败，请刷新页面后请重试',
                            delay:3000,
                            visible:true
                        };
                        loadings.close();
                        console.log(err);
                    })
               /* }*/

            },
            /*显示上报组织弹窗*/
            showVerifyOrNo:function(type){
                this.showReportOrgType=type;
                this.showReportOrg=true;
                this.inputKvalue='';
                this.checked=false;
            },
            //科目过滤
            filterNode(value, data) {
                if (!value) return true;
                return data.OrgName.indexOf(value) !== -1;
            },
            //科目选择
            handleNodeClick(data){
                this.foo();
                this.selectOrg=data;
            },
            foo() { // 取消鼠标监听事件 菜单栏
                this.menuForm.menuVisible = false
                document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
            },
            //组织树右键点击事件
            rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
                this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
                this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
                var menu = document.querySelector('#menu');
                menu.style.left = MouseEvent.clientX+15+ 'px';
                menu.style.top = MouseEvent.clientY-80  + 'px';

                document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法

                this.selectOrgRight=Node.data;
            },
            //查询显示组织信息
            showOrgInfo:function(){
                this.showOrg=true;
                this.getOrgDataS();
            },
            //获取组织信息
            getOrgDataS() {
                var vm = this;
                AllAreaSysOrgModel(vm, {
                    id: this.selectOrgRight.PhId==undefined?this.orgid:this.selectOrgRight.PhId,
                    uid: this.userid,
                    orgid:this.selectOrgRight.PhId==undefined?this.orgid:this.selectOrgRight.PhId
                }).then(res => {
                    this.loading = false;
                    if (res.Status === "error") {
                        this.$message({showClose: true, message: res.Msg, type: 'error'});
                        return;
                    }
                    this.orgForm = res;
                    if(this.orgForm.EnableTime != null && this.orgForm.EnableTime != ''){
                        this.orgForm.EnableTime = this.orgForm.EnableTime.substr(0,10);
                    }
                    if(this.orgForm.ServiceStartTime != null && this.orgForm.ServiceStartTime != ''){
                        this.orgForm.ServiceStartTime = this.orgForm.ServiceStartTime.substr(0,16);
                    }
                    if(this.orgForm.ServiceEndTime != null && this.orgForm.ServiceEndTime != ''){
                        this.orgForm.ServiceEndTime = this.orgForm.ServiceEndTime.substr(0,16);
                    }
                    this.changePhid = res.PhId;
                }).catch(error => {
                    console.log(error);
                    this.loading = false;
                    this.$message({
                        showClose: true,
                        message: '组织信息获取错误',
                        type: 'error'
                    })
                })
            },
            //组织树渲染，添加样式区分
            renderContent: function () {
                var createElement = arguments[0];
                var IsSystem = arguments[1].data.IsSystem;
                var IsDisable = arguments[1].data.EnabledMark;
                var budgetType=0;
                //VerifyEnd: "0"
                //VerifyMiddle: "0"
                //VerifyStart: "0"
                if(this.checkedBudget==0){
                    budgetType=arguments[1].data.VerifyStart;
                }else if(this.checkedBudget==1){
                    budgetType=arguments[1].data.VerifyMiddle;
                }else{
                    budgetType=arguments[1].data.VerifyEnd;
                }
                if(IsDisable==0){
                    if(IsSystem==1){//内置
                        return createElement('span',{attrs: {class: 'bolderFont'}},  [
                            createElement('span', arguments[1].node.label)
                        ]);
                    }else{
                        if (budgetType == 0) {//是否上报
                            return createElement('span',[
                                createElement('span', arguments[1].node.label)
                            ]);
                        } else {
                            return createElement('span',{attrs: {class: 'orangeFont'}},  [
                                createElement('span', arguments[1].node.label)
                            ]);
                        }
                    }
                }else{
                    return createElement('span',{attrs: {class: 'greyFont'}},  [
                        createElement('span', arguments[1].node.label)
                    ]);
                }


            },
            searchCode:function(){
                let key=this.inputKvalue;
                this.checked=false;
                console.log(key);
                if(key==undefined||key==''||key==null){
                    //return;
                    this.showReportOrgType==1?(this.SysOrgVerifyList=this.orgListNew.SysOrgVerifyList):(this.SysOrgNoVerifyList=this.orgListNew.SysOrgNoVerifyList);
                    //this.getOrgDataS();
                }else{
                    let orgList=this.showReportOrgType==1?this.orgListNew.SysOrgVerifyList:this.orgListNew.SysOrgNoVerifyList;
                    let orgListNews=new Array();
                    for(var i=0; i<orgList.length; i++){
                        //||orgList[i].PhId.indexOf(key)>-1 用于查询编码
                        if(orgList[i].OrgName.indexOf(key)>-1){
                            orgListNews.push(orgList[i])
                        }
                    }
                    console.log(this.orgListNew.SysOrgNoVerifyList.length);
                    this.showReportOrgType==1?(this.SysOrgVerifyList=orgListNews):(this.SysOrgNoVerifyList=orgListNews);
                }

            },
            postOrgSheetExcel:function() {
                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfigUncontrol();
                let url=null;
                let orgIdList=[];

                //根据组织树的选中来获取需要导出的组织
                let orgList=this.checkedOrgList;
                console.log(orgList);
                if(orgList.length<=0){
                    this.saasMessage={
                        message:'请选择要导出的组织',
                        delay:3000,
                        visible:true
                    };
                    return;
                }else{
                    if(this.showReportOrgType==1){
                        url='PSubjectBudgetMst/PostExportReportOrganize';
                    }else{
                        url='PSubjectBudgetMst/PostExportUnReportOrganize';
                    }
                    for(let i=0; i<orgList.length; i++){
                        orgIdList.push(orgList[i].PhId)
                    }
                }
                let param = {
                    uid:this.userid,
                    orgid:this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId,
                    Ryear:this.date1.choosedYear,
                    value:this.checkedBudget==0?1:(this.checkedBudget==1?2:3),
                    infoData:orgIdList
                };
                let loading=this.$loading();
                //下载Excel
                this.$axios({
                    method: 'post',
                    url: url,
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
                        /* let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
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
            },
        }
    }
</script>

<style lang="scss" scoped>
    .checkReport{
        position: absolute;
        width: 100%;
        top: -30px;
        div{
            display: inline-block;
        }
        select{
            display: inline-block;
            width: 100%;
            position: absolute;
            height: 35px;
            padding: 0;
            margin: 0;
            border-width: 0 0 1px 0;
            text-align: center;
            vertical-align: sub;
            top: 10px;
            box-sizing: border-box;
            padding-left: 50%;
            left: 0;
            border-color: #00b8ee;
        }
    }
    .container{
        top: 20px;
    }
.container /deep/.container{
    border: 0;
    box-shadow: none;
}
</style>
