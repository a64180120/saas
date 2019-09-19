<template>
    <div class="timeSelect detail">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px;min-width: 1260px;">

                        <div style="width:100%;float: right" id="elSelf" >
                            <div  class="flexUl handle" style="float: left;line-height: 30px">
                                <el-select placeholder="剔除条件" value="剔除条件" style="width: 100px;">
                                    <el-option value="0">
                                        <el-checkbox v-model="proofType">剔除未审核凭证</el-checkbox>
                                    </el-option>
                                </el-select>
                            </div>

                            <ul class="flexUl handle">
                                <li @click="showSubSelect(0)">导出</li >
                                <li @click="showSubSelect(1)">打印</li >
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                            <ul  class="flexUl handle" style="line-height: 30px">
                                <div class="flexPublic handle">
                                    <div class="searcherValue">
                                        <input type="text" placeholder="凭证字号/摘要" v-model="inputKvalue">
                                        <span class="el-icon-circle-close" :style="{ 'display':inputKvalue!=''?'inline-block':'none' }" @click="inputKvalue=''"></span>
                                    </div>
                                    <div  class="searcherBtn" style="margin-left: -1px;" @click="selectBtn">搜索</div>
                                    <div   class="searcherBtn" @click="showType='block'" style="margin-left: 10px">高级</div>
                                    <div class="searchPanel" :style="{'display':showType}">
                                        <div class="searchPanel_title">
                                            <h1>高级查询</h1>
                                            <i class="el-icon-close" @click="showType='none'"></i>
                                        </div>
                                        <div class="searchPanel_content">
                                            <div>
                                                <span>凭证日期</span>
                                                <div class="searchContentArea" >
                                                    <el-date-picker size="small"
                                                                    v-model="zwTime"
                                                                    type="daterange"
                                                                    range-separator="至"
                                                                    start-placeholder="开始日期"
                                                                    end-placeholder="结束日期"
                                                                    value-format="yyyy-MM-dd"
                                                                    style="width: 270px;border:none;padding-right: 0;"
                                                                    popper-class="popper"
                                                    >
                                                    </el-date-picker>
                                                </div>
                                            </div>
                                            <div>
                                                <span>凭证号码</span>
                                                <div class="flexPublic searchContentArea" style="padding-left:14px;margin-right: 6px;">
                                                    <input v-model="startCode"/>至<input v-model="endCode"/>
                                                </div>

                                            </div>
                                            <div>
                                                <span>发生金额</span>
                                                <div class="flexPublic searchContentArea"  style="padding-left:14px;margin-right: 6px;">
                                                    <input v-model="startMoney"/>至<input v-model="endMoney"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flexPublic searchPanel_bottom">
                                            <div class="searchPanel_btn greybtn" @click="clearPorp">重置</div>
                                            <div class="searchPanel_btn bluebtn" @click="searchDetail">搜索</div>
                                        </div>

                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div class="flexPublic  formData">
                        <div class="unionLists" >
                            <div class="unionListsTitle">

                                <div class="el-input el-input--prefix" style="text-align: center; padding: 3px 10px;height: 35px;overflow: hidden">
                                    <div style="width: 235px;height: 26px;line-height: 26px;margin: auto">
                                        <el-select style="width: 100%;height: 26px;line-height: 26px;font-size: 10pt;" v-model="choosedType">
                                            <el-option v-for="(item,index) in typeList" v-if="item.EnabledMark!=0&&TYFZ||item.EnabledMark==0"
                                                       :key="item.PhId"
                                                       :label="item.BaseName"
                                                       :value="item.PhId">
                                            </el-option>
                                            <el-checkbox v-model="TYFZ" style="width: 100%;border-top: 1px solid #ccc;padding-left: 15px;">显示停用辅助类别</el-checkbox>
                                        </el-select>
                                        <!--<input type="text" autocomplete="off" placeholder="搜索科目编码/名称" class="el-input__inner"  @keyup.enter.up="searchCode" >
                                        <i class="el-input__icon el-icon-lx-search" style="position: relative; left: -60px;z-index: 14; height: 26px;top: -28px;color: #dcdfe6;"></i>-->

                                    </div>

                                </div>
                            </div>
                            <div class="unionListsContent">
                                <el-tree
                                    class="filter-tree"
                                    :data="subjectLists"
                                    :props="defaultProps"
                                    :highlight-current="true"
                                    node-key="PhId"
                                    :filter-node-method="filterNode"
                                    @node-click="handleNodeClick"
                                    ref="subjectTree">
                                </el-tree>
                            </div>
                            <div style="position: absolute;bottom: 0;left: 0;width: 100%;text-align: center;box-shadow: 0 0 10px #45c0f7;height: 35px;line-height: 35px;">
                                <el-checkbox v-model="showStop" @change="getResiduePro">显示停用辅助项目</el-checkbox>
                            </div>
                        </div>
                        <div class="formData" style="left: 270px;top: 0px;right: 0px;bottom: 0;width: auto;margin-top: 0;">
                            <div class="tbHeader">
                                <table>
                                    <colgroup>
                                        <col width="12%"/>
                                        <col width="12%"/>
                                        <col width="15%"/>
                                        <col width="15%"/>
                                        <col width="15%"/>
                                        <col width="12%"/>
                                        <col width="15%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <td>凭证日期</td>
                                        <td>凭证字号</td>
                                        <td>摘要</td>
                                        <td>借方金额(元)</td>
                                        <td>贷方金额(元)</td>
                                        <td>借/贷</td>
                                        <td>余额（元）</td>
                                    </tr>
                                    </thead>

                                </table>
                            </div>
                            <div class="tbBody" id="ts">
                                <table  ref="printFrom">
                                    <colgroup>
                                        <col width="12%"/>
                                        <col width="12%"/>
                                        <col width="15%"/>
                                        <col width="15%"/>
                                        <col width="15%"/>
                                        <col width="12%"/>
                                        <col width="15%"/>
                                    </colgroup>
                                    <tbody>
                                    <template v-for="(item,index) of dataInfo" v-if="dataInfo.length>0">
                                        <tr v-if="item.Abstract=='科目初始化'" :key="item.uid">
                                            <td class="center">{{item.Pdate.slice(0,10).split(' ')[0]}}</td>
                                            <td></td>
                                            <td class="bolder">年初余额</td>
                                            <td class="right"><!--{{item.JSum |NumFormat}}--></td>
                                            <td class="right"><!--{{item.DSum |NumFormat}}--></td>
                                            <td class="center">{{JD[item.DType]}}</td>
                                            <td class="right">
                                                {{ KBalanceType=='1' ? (Number(item.JSum)-Number(item.DSum)) : (Number(item.DSum)-Number(item.JSum))  | NumFormat}}
                                            </td>
                                        </tr>
                                        <tr v-else>
                                            <td class="center">{{item.Abstract=='本月合计'||item.Abstract=='本年累计'?item.Pdate.split('-')[0]+'-'+item.Pdate.split('-')[1]:item.Pdate.slice(0,10).split(' ')[0]}}</td>
                                            <td class="center"><a @click="showvoucher" :data-title="item.PhIdMst">{{item.Pno!='本月合计'&&item.Pno!='本年累计'?'记   -'+item.Pno:''}}</a></td><!--item.PType+-->
                                            <td :class="{'bolder':item.Abstract=='本月合计'||item.Abstract=='本年累计','align-center':true}">{{item.Abstract}}</td>

                                            <td class="right">{{item.JSum |NumFormat}}</td>
                                            <td class="right">{{item.DSum |NumFormat}}</td>
                                            <td class="center">{{JD[item.DType]}}</td>
                                            <template v-if="item.Pno!='本月合计'&&item.Pno!='本年累计'">
                                                <td></td>
                                            </template>
                                            <template v-else>
                                                <!--<template v-if="item.Pno=='本月合计'">
                                                    <td class="right">
                                                        {{dataInfo[index+1].Balance | NumFormat}}
                                                    </td>
                                                </template>
                                                <template v-else>
                                                    <td class="right">
                                                        {{ item.Balance  | NumFormat}}
                                                    </td>
                                                </template>-->
                                                <td class="right">
                                                    {{ item.Balance  | NumFormat}}
                                                </td>
                                            </template>

                                        </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td class="center bolder" colspan="8">未查询到数据</td>
                                        </tr>

                                    </template>
                                    <tr v-if="!busy">
                                        <td class="center bolder" colspan="7" @click="getData(true)">加载更多</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="timeSelectBox" style="z-index: 998">
                    <time-select-bar @item-click="dateChoose"
                                     :showtype="'doubleTime'"
                    ></time-select-bar>
                </div>
                <!--凭证组件弹窗-->
                <div class="voucherCover" v-if="voucherDataList.bool" style="z-index:999" >
                    <div class="voucherContent">
                        <div class="voucherCover_title">凭证查看 <i @click="closeVoucher" class="el-icon-close"></i></div>
                        <div class="voucherHandle">
                            <span v-if="Roleauthorize.expenseAccount_edit!=0" v-show="!voucherAdd" class="btn" @click.stop="handle('keep')">保存</span>
                            <span v-if="Roleauthorize.expenseAccount_edit!=0" v-show="!voucherAdd" class="btn" @click.stop="handle('cancle')">取消</span>
                            <span v-if="Roleauthorize.expenseAccount_edit!=0" v-show="voucherAdd" @click.stop="handle('update')"  class="btn">修改</span>
                            <span v-if="Roleauthorize.expenseAccount_delete!=0" v-show="voucherAdd"  @click.stop="handle('delete')" class="btn">删除</span>
                            <span v-if="Roleauthorize.expenseAccount_audit!=0" v-show="voucherAdd" @click.stop="handle('audit')" class="btn">审核</span>
                            <span v-if="Roleauthorize.expenseAccount_review!=0" v-show="voucherAdd" @click.stop="handle('unaudit')" class="btn">反审核</span>
                        </div>
                        <voucherdetail :dataList="voucherDataList" v-if="voucherAdd" ref="voucher"></voucherdetail>
                        <div v-else  >
                            <!--<div :class="{voucherDisabled:voucherAdd}"></div>-->

                            <voucher :vouSubjectlist="vouSubjectlist"  :AbstractList="AbstractList"  :dataList="voucherDataList"  @Msg-click="voucherMsg" ref="voucher"></voucher>
                        </div>

                    </div>
                    <!--<div class="voucherCoverInner"> </div>-->
                </div>
                <!--确认框-->
                <saasconfirm
                    :message="confirm.message"
                    :btn1="confirm.btn1"
                    :btn2="confirm.btn2"
                    :type="confirm.type"
                    :visible.sync="confirm.visible"
                    @ok-click="confirmOk"
                    @no-click="confirmNo" >
                </saasconfirm>
                <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
                <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
                <!--Excel导出，科目选择-->
                <div v-if="showExcelSelect" class="cover" :style="{'display':(showExcelSelect?'block':'none'),'z-index':'999'}">
                    <div class="coverContent" style="width: auto;height: auto;top: 20%;overflow-y: hidden">
                        <div class="flexPublic">
                            <p>辅助项目选择</p>
                            <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showExcelSelect=false"></i>
                        </div>
                        <div style="height:400px;overflow-y: scroll;border-bottom: 1px solid #eee">
                            <el-tree
                                class="filter-tree"
                                :data="subjectListsCheck"
                                :props="defaultProps"
                                show-checkbox
                                node-key="PhId"
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                ref="vuetree">
                            </el-tree>
                        </div>
                        <div style="margin: 0px 0px 10px 35px;text-align: left">
                            <el-checkbox v-model="checked" @change="checkedAll">全选</el-checkbox>

                        </div>
                        <div v-if="postOrPrint==0" style="margin: 0px 0px 10px 35px;text-align: left">
                            <el-checkbox v-model="bnfs" @change="dispart">只显示本年有发生或有余额的科目</el-checkbox>
                        </div>
                        <div v-if="postOrPrint==0" style="margin: 0px 0px 10px 35px;text-align: left">
                            <el-checkbox v-model="postType">分表导出(是否分多个Excel导出)</el-checkbox>
                        </div>
                        <div style="margin: 0px 0px 10px 35px;text-align: left">
                            <el-checkbox v-model="showStopOrSupportType" @change="dispart">显示停用核算类型、辅助项目</el-checkbox>
                        </div>
                        <ul class="flexPublic handle" style="margin-bottom: 20px">
                            <li style='margin:0 0 0px 20px;cursor: pointer' @click="showExcelSelect=false">取消</li>
                            <template v-if="postOrPrint==0">
                                <li style='margin:0 0 0px 20px;cursor: pointer' @click="postBalanceSheetExcel">确定</li>
                            </template>
                            <template v-else>
                                <li style='margin:0 0 0px 20px;cursor: pointer' @click="getDetailAccountAll">打印</li>
                            </template>

                        </ul>
                    </div>
                </div>
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

                            <div class="timeSelect" style="padding: 40px 40px 30px 30px">
                                <template v-for="print in printDetailList">
                                    <table style="margin-top:30px;page-break-before: always">
                                        <col width="12%"/>
                                        <col width="12%"/>
                                        <col width="15%"/>
                                        <col width="15%"/>
                                        <col width="15%"/>
                                        <col width="12%"/>
                                        <col width="15%"/>
                                        <thead >
                                        <tr>
                                            <td :colspan="fz?8:7" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">[{{selectSubject.BaseCode+'——'+print.subName }}] 核算项目明细账</td>
                                        </tr>
                                        <tr>
                                            <td :colspan="fz?8:7" style="background-color: #fff;font-size: 14px;border: 0">
                                                {{date1.choosedYear}}年{{date1.choosedMonth<10?'0'+date1.choosedMonth:date1.choosedMonth}}月
                                                -
                                                {{date1.choosedYearEnd}}年{{date1.choosedMonthEnd<10?'0'+date1.choosedMonthEnd:date1.choosedMonthEnd}}月
                                                {{ date1.choosedYearEnd < jyear ?'':((date1.choosedYearEnd==jyear && date1.choosedMonthEnd <= jmonth)?'':'(未结账)') }}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="5" class="left" style="background-color: #fff;border: none;">编制单位：{{orgName}}</td>
                                            <td :colspan="fz?3:2" class="right" style="background-color: #fff;border: none;">单位：元</td>
                                        </tr>
                                        <tr>
                                            <td>凭证日期</td>
                                            <td>凭证字号</td>
                                            <td>摘要</td>
                                            <td>借方金额(元)</td>
                                            <td>贷方金额(元)</td>
                                            <td>借/贷</td>
                                            <td>余额（元）</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-if="dataInfoMonth.Pdate!=undefined">
                                            <td class="center">{{dataInfoMonth.Pdate.slice(0,10).split(' ')[0]}}</td>
                                            <td></td>
                                            <td :class="{'bolder':true}">{{date1.choosedMonth==1?'年初余额':'月初余额'}}</td>
                                            <td class="right"><!--{{dataInfoMonth.JSum| NumFormat}}--></td>
                                            <td class="right" :title="dataInfoMonth.DSum"><!--{{dataInfoMonth.DSum| NumFormat}}--></td>
                                            <td class="center">{{JD[dataInfoMonth.DType]}}</td>
                                            <td class="right">
                                                {{ KBalanceType=='1' ? (Number(dataInfoMonth.JSum)-Number(dataInfoMonth.DSum)) : (Number(dataInfoMonth.DSum)-Number(dataInfoMonth.JSum))  | NumFormat}}
                                            </td>
                                        </tr>
                                        <template v-for="(item,index) of print">
                                            <tr v-if="item.Abstract=='科目初始化'" :key="item.uid">
                                                <td class="center">{{item.Pdate.slice(0,10).split(' ')[0]}}</td>
                                                <td></td>
                                                <td class="bolder">年初余额</td>
                                                <td class="right"></td>
                                                <td class="right"></td>
                                                <td class="center">{{JD[item.DType]}}</td>
                                                <td class="right">
                                                    {{ KBalanceType=='1' ? (Number(item.JSum)-Number(item.DSum)) : (Number(item.DSum)-Number(item.JSum))  | NumFormat}}
                                                </td>
                                            </tr>
                                            <tr v-else>
                                                <td class="center">{{item.Abstract=='本月合计'||item.Abstract=='本年累计'?item.Pdate.split('-')[0]+'-'+item.Pdate.split('-')[1]:item.Pdate.slice(0,10).split(' ')[0]}}</td>
                                                <td class="center"><a @click="showvoucher" :data-title="item.PhIdMst">{{item.Pno!='本月合计'&&item.Pno!='本年累计'?item.PType+'-'+item.Pno:''}}</a></td>
                                                <td :class="{'bolder':item.Abstract=='本月合计'||item.Abstract=='本年累计','align-center':true}">{{item.Abstract}}</td>

                                                <td class="right">{{item.JSum |NumFormat}}</td>
                                                <td class="right">{{item.DSum |NumFormat}}</td>
                                                <td class="center">{{JD[item.DType]}}</td>
                                                <template v-if="item.Pno!='本月合计'&&item.Pno!='本年累计'">
                                                    <td></td>
                                                </template>
                                                <template v-else>
                                                    <td class="right">
                                                        {{ item.Balance  | NumFormat}}
                                                    </td>
                                                </template>
                                            </tr>
                                        </template>
                                        <tr>
                                            <td :colspan="7">
                                                注：
                                                <input disabled type="checkbox" :checked="proofType" > 剔除未审核凭证
                                                <!--<el-checkbox v-model="proofType" @change="dispart">剔除未审核凭证</el-checkbox>-->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" style="border: 0;">
                                                财务主管：{{curOrg.Treasurer}}
                                            </td>
                                            <td :colspan="2" style="border: 0;">审核：</td>
                                            <td colspan="2" style="border: 0;">制表：{{username}}</td>
                                        </tr>
                                        </tbody>

                                    </table>
                                </template>
                            </div>


                        </div>
                        <ul class=" handle" style="margin-bottom: 20px;margin-top: 20px"></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {delList} from '@/api/detailaccount/details.js'
    import { mapState, mapActions } from 'vuex'
    import { SubjectList } from '@/api/subject/subjectInfo'
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import voucherdetail from '../accountbooks/detailaccount/voucherDetail'
    import voucher from '@/page/finance/voucher'
    import axios from "axios";
    import qs from 'qs';
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import saasMsg from '@/components/message/message'
    /**
     * 辅助项明细表
     */
    export default {
        name: "assist",
        data() {
            return {

                typeList:[],//选择框可选的列表
                choosedType:'',//选中的类型
                choosedTypeGls:'',
                confirm:{
                },
                TYFZ:true,//显示停用辅助
                oldVoucher:{},//修改前凭证信息
                vouSubjectlist:[],//科目列表
                AbstractList:[],//摘要模板
                voucherAdd:true,//不能修改凭证
                postType:true,
                showStopOrSupportType:false,//显示停用核算类型、辅助项目
                sideDate:'',
                voucherDataList:{bool:false,data:{Mst:'',Attachements:[]}},
                JD:{'3':'平',"5":'借','6':'贷'},
                downloadLoading: false,
                filterText:'',
                subjectLists: [],
                subjectListsCheck:[],//导出的筛选科目
                selectItem:'',
                defaultProps: {
                    children: 'children',
                    label: 'KNameC'
                },
                zwTime:'', //账期 开始时间 结束时间  [ "2018-12-07", "2019-01-11" ]
                auxiliary:0,  //显示辅助项
                pageSize: 20, //pageSize
                pageIndex: 0, //pageIndex
                testIndex:0,
                searchYear:'',
                totalCount: 0, //总页数
                busy:true,    //是否正在加载过程中  最初是用于滚动加载，后修改为页面未全部加载时，报表底部出现加载更多的提示栏，可点击
                dataInfo: [],
                dataInfoMonth: {},//月初数据
                selectSubject:'',  //选择科目

                date1:{choosedYear:'',
                    choosedYearEnd:'',
                    choosedMonth:'',
                    choosedMonthEnd:''},

                focus:false,
                proofType:false,
                showStop:false ,//是否显示停用的辅助项目
                fz:true,//显示辅助项
                inputKvalue:'',//顶部搜索框输入凭证字号或摘要Kno Abstract
                /*高级搜索框参数   */
                showType:'none',
                startCode:'',
                endCode:'',
                startMoney:'',
                endMoney:'',
                que:'',
                KBalanceType:'',//用于判断本月累计和本年累计计算方式
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                showExcelSelect:false,//显示科目选择列表，点击打印按钮时修改，显示
                checked:false,//全选，反选
                showPrint:false,//打印预览界面 显示隐藏
                bnfs:false,//科目本年发生余额筛选选择框
                jyear:0,//结账年
                jmonth:0,//结账月
                postOrPrint:0,//科目列表用于excel导出还是打印（excel导出0，打印1）
                printDetailList:[],//多科目打印，详细数据
            }
        },
        mounted() {
            /*this.getCheckeds();
            //this.getSubjectData();
            this.getAbstract();
            this.getSubject();*/
            this.getResidueType();
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        watch: {
            filterText(val) {
                this.$refs.subjectTree.filter(val);
            },
            proofType:function(){
                this.getData(false);
            },
            choosedType(val1,val2) {
                console.log(val1,val2)
                for(var i in this.typeList){
                    if(val1 == this.typeList[i].PhId ){
                        this.choosedTypeGls= this.typeList[i].GLS;
                    }
                }
                if( val1!=val2 ){
                    this.getResiduePro();
                }
            }
        },
        components: {TimeSelectBar,voucherdetail,saasMsg,voucher},
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
        methods: {
            /*
            * 新接口
            * */

            //获取类型列表
            getResidueType: function() {
                let url='/PVoucherMst/GetAuxSubjectTypeList';
                let param={
                    orgid: this.orgid, //组织Id，(必填)
                    EnabledMark: this.showStop?0:1,  //辅助类型显示停用传0, 不显示停用传1(必填)
                    //uname:this.choosedType
                };
                this.$axios.get(url,{params:param}).then( res=> {
                    if(res.Status=='success'){
                        console.log(res)
                        this.typeList=res.type;
                        this.choosedType=res.type[0].PhId;
                        this.choosedTypeGls=res.type[0].GLS;
                    }else{
                        this.saasMessage={
                            message:'未查询到匹配辅助类型，请检查您输入的关键字是否有误',
                            delay:3000,
                            visible:true
                        };
                    }
                }).catch( err=>{
                    console.log(err)
                })
            },
            //获取类型对应的项目
            getResiduePro: function() {
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    typeId:this.choosedType,
                    CodeOrName:'',
                    deletemark:this.showStop?1:0
                };
                const loading=this.$loading();
                this.$axios.get('/PVoucherAuxiliaryType/GetAuxiliaryQueryList',{params:data})
                    .then(res=>{
                        loading.close();
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        res=res.list;
                        this.pingjie(res);
                        this.subjectLists=res;
                        this.subjectListsCheck=res;
                        console.log(res);
                        if(res.length>0){
                            this.selectItem=res[0];
                            this.$nextTick(()=>{
                                if(this.selectSubject==null||this.selectSubject==''){
                                    this.selectSubject=res[0];
                                    this.$refs.subjectTree.setCurrentKey(this.subjectLists[0].PhId);
                                    this.dataInfo=[];;
                                    //加载第一个科目的明细
                                    this.getData(false);
                                    this.KBalanceType=res[0].KBalanceType
                                }else{
                                    let count=0;
                                    for(var i in res){
                                        if(this.selectSubject.PhId==res[i].PhId){
                                            this.$refs.subjectTree.setCurrentKey(this.selectSubject.PhId);
                                            this.dataInfo=[];
                                            console.log(this.selectSubject);
                                            //加载第一个科目的明细
                                            this.getData(false);
                                            this.KBalanceType=this.selectSubject.KBalanceType
                                            return;
                                        }else{
                                            count++
                                        }
                                    }
                                    if(count==res.length){
                                        this.$refs.subjectTree.setCurrentKey(res[0].PhId);
                                        this.selectSubject=res[0];
                                    }
                                    this.dataInfo=[];
                                    console.log(this.selectSubject);
                                    //加载第一个科目的明细
                                    this.getData(false);
                                    this.KBalanceType=this.selectSubject.KBalanceType
                                }

                            })

                        }else{
                            this.selectSubject=[];
                            this.dataInfo=[];
                        }

                    })
                    .catch(err=>{
                        loading.close();
                        this.$message({ showClose: true,message: "辅助项获取错误", type: "error"});
                    })
            },
            //查询详细数据
            getData(flag) {
                if(this.selectSubject==''){
                    return;
                }
                if(!flag){
                    this.dataInfo=[];
                    this.getDataByMonth();
                    //清除分页查询页面增长，避免数据查询出错
                    this.pageIndex=0;
                }
                let year='';
                let Pmonth='';
                year=this.searchYear;
                if(year==this.date1.choosedYear&&year==this.date1.choosedYearEnd){
                    Pmonth=this.date1.choosedMonth+','+this.date1.choosedMonthEnd;
                }

                if(year==this.date1.choosedYear&&year!=this.date1.choosedYearEnd){
                    Pmonth=this.date1.choosedMonth+','+12;
                }

                if(year>this.date1.choosedYear&&year<this.date1.choosedYearEnd){
                    Pmonth=1+','+12;
                }
                if(year!=this.date1.choosedYear&&year==this.date1.choosedYearEnd){
                    Pmonth=1+','+this.date1.choosedMonthEnd;
                }
                /*}*/
                var data = {
                    uid: this.userid,
                    orgid:this.orgid,
                    Kcode: this.selectSubject.BaseCode,
                    // Year: this.selectSubject.Uyear|| '',
                    Year: year,
                    OrgIds: this.orgid,
                    pageindex:this.pageIndex,
                    pagesize:this.pageSize,
                    Title:this.selectSubject.BaseName,
                    Verify:this.proofType?'1':'0,1',
                    Pmonth:Pmonth,
                    value:this.inputKvalue==''?'':this.que,
                    StartTime:this.zwTime[0],
                    EndTime:this.zwTime[1],
                    StartPNo:this.startCode,
                    EndPno:this.endCode,
                    StartAmount:this.startMoney,
                    EndAmount:this.endMoney,
                    GLS: this.choosedTypeGls,
                    auxiliaryPhid: this.selectSubject.PhId
                };
                const loading1=this.$loading();
                this.$axios.get("/PVoucherMst/GetAuxDetailAccount",{params:data})
                    .then(res=>{
                        loading1.close();
                        if(res.Status==='error'){
                            this.saasMessage={
                                message:res.Msg,
                                delay:3000,
                                visible:true
                            };
                            //this.$message.error(res.Msg);
                            this.dataInfo=[]
                            return
                        }
                        //this.dataInfo=res.Record;
                        this.totalCount=res.totalRows;
                        this.pageIndex++;  //滚动之后加载第二页
                        if(flag){//如果flag为true则表示分页
                            if(res.Record.length<this.pageSize&&year==this.date1.choosedYearEnd){
                                for(var i in res.Record){
                                    this.dataInfo.push(res.Record[i]);  //concat数组串联进行合并
                                }
                                this.busy=true;//禁用滚动加载
                            }else{
                                if(res.Record.length<this.pageSize&&year<this.date1.choosedYearEnd){
                                    this.searchYear++;
                                    this.pageIndex=0;
                                }
                                for(var i in res.Record){
                                    this.dataInfo.push(res.Record[i]);  //concat数组串联进行合并
                                }
                                this.busy=false;//启用滚动加载
                            }
                        }else{
                            //第一次进入页面 完全不需要数据拼接的
                            this.dataInfo=[];
                            for(var i in res.Record){
                                this.dataInfo.push(res.Record[i]);  //concat数组串联进行合并
                            }
                            if(res.Record.length<this.pageSize){
                                this.busy=true;//禁用滚动加载
                            }else{
                                this.busy=false;//启用滚动加载
                            }

                        }
                        console.log( this.dataInfo);
                    })
                    .catch(err=>{
                        console.log(err)
                        loading1.close();
                        this.saasMessage={
                            message:'获取科目明细错误',
                            delay:3000,
                            visible:true
                        };
                        //this.$message({ showClose: true, message:'获取科目明细错误',type: 'error' })
                    })
            },


            closeVocuher:function(){
                this.voucherDataList.bool=false;
                this.getData(false);
            },
            /*获取结账年*/
            getCheckeds(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        console.log(res);
                        if(res.Record.length>0){
                            this.jyear=res.Record[0].JYear;
                            this.jmonth=res.Record[0].JAccountPeriod;
                        }else{
                            let currentYear = new Date();
                            this.jyear=currentYear.getFullYear();
                            this.jmonth=0;
                        }
                    })
                    .catch(err=>console.log(err))
            },
            //滚动事件
            handleScroll: function () {
                let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                // 设备/屏幕高度
                /*let scrollObj = document.getElementById('ts'); // 滚动区域
                if(scrollObj==undefined){
                    window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件

                }else{
                    let scrollTop = scrollObj.scrollTop; // div 到头部的距离
                    let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
                    //滚动条到底部的条件
                    if(scrollTop>=100){
                        // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
                        if(!this.busy){
                            this.loadMore();
                        }
                    }
                }
*/
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
            //显示凭证
            showvoucher:function(val){
                this.getVoucherData(val.target.dataset.title);
            },
            //清除高级查询数据
            clearPorp:function(){
                this.zwTime='';
                this.startCode='';
                this.endCode='';
                this.startMoney='';
                this.endMoney=''
            },
            /*高级查询*/
            searchDetail:function(){
                if(this.startCode>this.endCode){
                    this.saasMessage={
                        message:'开始凭证号不应大于结束凭证号码',
                        delay:3000,
                        visible:true
                    };
                    //this.$message.error('开始凭证号码不应大于结束凭证号码');
                }else if(this.startMoney>this.endMoney){
                    this.saasMessage={
                        message:'开始发生金额不应大于结束发生金额',
                        delay:3000,
                        visible:true
                    };
                    //this.$message.error('开始发生金额不应大于结束发生金额');
                }
                else{
                    /*this.showType='none';*/
                    this.getData(false);
                }

            },
            /*科目搜索*/
            searchCode:function(val){
                //this.selectSubject.KCode=val.target.value;
                //let que='{"[or-dictionary0]*dictionary*or",{"KCode*str*like":"'+val.target.value+'" , "KName*str*like":"'+val.target.value+'"}}';
                this.dataInfo=[];
                this.getSubjectData(val.target.value);
            },
            /*搜索按钮点击事件*/
            selectBtn:function(){
                this.que=this.inputKvalue;
                this.getData(false);
            },
            /*时间选择*/
            dateChoose:function(val){
                let time=val;
                this.date1=time;
                this.searchYear=time.choosedYear;
                this.getResiduePro();
                //this.getData(false);
            },
            //手动刷新voucher组件**************************
            resetVoucher(){
                var vm=this;
                this.voucherDataList.bool=false;
                function delay(){
                    vm.voucherDataList.bool=true
                }
                setTimeout(delay,5);
            },
            //获取单个凭证**************
            getVoucherData(PhId){
                if(PhId==''){
                    this.saasMessage={
                        message:'当前凭证不支持查看',
                        delay:3000,
                        visible:true
                    };
                    //this.$message('当前凭证不支持查看','error')
                    return
                }
                var data={
                    uid:this.userid,
                    orgid:this.orgid,
                    id:PhId
                }
                const loading2=this.$loading();
                this.$axios.get('/PVoucherMst/GetVoucher',{params:data})
                    .then(res=>{
                        if(res.Status=='success'){
                            this.voucherDataList.data.Mst=res.Data;
                            this.voucherDataList.bool=true;
                            this.resetVoucher();
                        }else{
                            this.saasMessage={
                                message:res.Msg,
                                delay:3000,
                                visible:true
                            };
                            //this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }
                        loading2.close();
                    })
                    .catch(err=>{
                        this.saasMessage={
                            message:err,
                            delay:3000,
                            visible:true
                        };
                        //this.$message({ showClose: true,message: err, type: "error"});
                        loading2.close();
                    })
            },

            //查询月初数据
            getDataByMonth() {
                this.dataInfoMonth={};
                let year='';
                let Pmonth='';
                if(this.date1.choosedYear==''){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedYearEnd=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    this.searchYear=currentyear;
                    year=this.searchYear;
                    Pmonth=currentMonth+','+currentMonth;
                    if(currentMonth==1){
                        return
                    }
                }else{
                    if(this.date1.choosedMonth!=this.date1.choosedMonthEnd){
                        return
                    }
                    else{
                        year=this.date1.choosedYear;
                        Pmonth=this.date1.choosedMonth+','+this.date1.choosedMonthEnd;
                        if(this.date1.choosedMonth==1){
                            return
                        }
                    }
                }
            },
            //查询科目列表
            async getSubjectData(queryfil){
                const loading1=this.$loading();
                let vm=this;
                let queryfilter={
                    KCode:'',
                    KName:''
                };
                if(queryfil!=''||queryfil!=undefined){
                    queryfilter.KCode=queryfil,
                        queryfilter.KName=queryfil
                }
                //科目列表
                SubjectList(vm,{
                    uid: this.userid,
                    orgid: this.orgid,
                    Ryear:this.date1.choosedYear||(new Date()).getFullYear(),
                    infoData:queryfilter
                }).then(res => {

                    loading1.close();

                    this.pingjie(res);
                    this.subjectLists=res;
                    this.subjectListsCheck=res;
                    console.log(res);
                    if(res.length>0){
                        this.selectItem=res[0];
                        this.$nextTick(()=>{
                            if(this.selectSubject==null||this.selectSubject==''){
                                this.selectSubject=res[0];
                                this.$refs.subjectTree.setCurrentKey(this.subjectLists[0].PhId);
                                this.dataInfo=[];;
                                //加载第一个科目的明细
                                this.getData(false);
                                this.KBalanceType=res[0].KBalanceType
                            }else{
                                let count=0;
                                for(var i in res){
                                    if(this.selectSubject.PhId==res[i].PhId){
                                        this.$refs.subjectTree.setCurrentKey(this.selectSubject.PhId);
                                        this.dataInfo=[];
                                        console.log(this.selectSubject);
                                        //加载第一个科目的明细
                                        this.getData(false);
                                        this.KBalanceType=this.selectSubject.KBalanceType
                                        return;
                                    }else{
                                        count++
                                    }
                                }
                                if(count==res.length){
                                    this.$refs.subjectTree.setCurrentKey(res[0].PhId);
                                    this.selectSubject=res[0];
                                }
                                this.dataInfo=[];
                                console.log(this.selectSubject);
                                //加载第一个科目的明细
                                this.getData(false);
                                this.KBalanceType=this.selectSubject.KBalanceType
                            }

                        })

                    }else{
                        this.selectSubject=[];
                    }
                }).catch(error =>{
                    loading1.close();
                    this.saasMessage={
                        message:'科目列表获取错误',
                        delay:3000,
                        visible:true
                    };
                    /*this.$message({
                        showClose: true,
                        message: '科目列表获取错误',
                        type: 'error'
                    })*/
                })

            },
            //拼接科目编码和科目名称，用于组织树显示（eltree只能显示一个字段）
            pingjie:function(res){
                for(var i in res){
                    let KNameC=(res[i].BaseCode+' - '+res[i].BaseName)
                    res[i]['KNameC']=KNameC;
                    if(res[i].children!=[]){
                        this.pingjie(res[i].children)
                    }
                }
            },
            //数据格式化处理
            changeData:function(res){
                for(var i in res){
                    res[i].JSum=this.changeNum(res[i].JSum);
                    res[i].DSum=this.changeNum(res[i].DSum);
                    if(res[i].children!=[]){
                        this.changeData(res[i].children)
                    }
                }
                return res;
            },
            //数据格式化处理方法，上一个方法需要调用
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
            //科目过滤
            filterNode(value, data) {
                if (!value) return true;
                return data.KName.indexOf(value) !== -1;
            },
            //科目选择
            handleNodeClick(data){
                this.searchYear=this.date1.choosedYear;
                this.selectSubject=data;
                this.KBalanceType=data.KBalanceType;
                this.getData(false);
            },
            //当属性滚动的时候  加载  滚动加载
            loadMore(){
                if(!this.busy){
                    this.busy=true;
                    setTimeout(() => {  //发送请求有时间间隔第一个滚动时间结束后才发送第二个请求

                        this.getData(true);
                    }, 300);
                }else{

                }
            },
            /*excel导出*/
            postBalanceSheetExcel:function() {
                let checkedlist=this.$refs.vuetree.getCheckedNodes();
                let codelist=[];
                for(let i=0 ; i<checkedlist.length ; i++){
                    let ar={'Kcode':checkedlist[i].BaseCode,'GLS': this.choosedTypeGls, 'auxiliaryPhid': checkedlist[i].PhId}
                    codelist.push(ar);
                }
                if(codelist.length==0){
                    this.saasMessage={
                        message:'请选择导出科目',
                        delay:3000,
                        visible:true
                    };
                    return;
                }
                let loading=this.$loading();
                let param = {
                    uid: this.userid,
                    orgid:this.orgid,
                    OrgName:this.orgName,
                    Kcodeswith:codelist,
                    Year: this.date1.choosedYear,
                    OrgIds: this.orgid,
                    pageindex:0,
                    pagesize:this.totalCount,
                    Verify:this.proofType?'1':'0,1',
                    Pmonth:this.date1.choosedMonth+','+this.date1.choosedMonthEnd,
                    value:this.inputKvalue==''?'':this.que,
                    StartTime:this.zwTime[0],
                    EndTime:this.zwTime[1],
                    StartAmount:this.startMoney,
                    EndAmount:this.endMoney
                };
                let base=httpConfig.getAxiosBaseConfigUncontrol();
                //下载Excel
                this.downloadLoading = true;
                let url="/PVoucherMst/PostAuxDetailAccountExcel";
                if(!this.postType){
                    url="/PVoucherMst/PostAuxDetailAccountByOneExcel";
                }

                this.$axios.post(url,param)
                    .then(res=>{
                        // "{\"path\":\"zcfz\",\"filename\":\"20181229103028248.xls\"}"
                        //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        if(res.Status=="error"){
                            this.$message({ showClose: true, message: res.Msg, type: 'error' })
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
                    }).catch(err=>{
                    loading.close();
                    console.log(err);
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

            //科目弹窗，打开
            showSubSelect:function(type){
                this.showExcelSelect=true;
                this.dispart();
                this.postOrPrint=type;
            },

            //科目弹窗选择，去除未发生的科目
            dispart:function(){
                this.checked=false;
                let data={
                    orgid:this.orgid,
                    Year:this.date1.choosedYear,
                    BNFS_YE:this.bnfs?'0':'1',
                    IsShowStop:this.showStopOrSupportType?'0':'1'
                };
                this.$axios.get('PSubject/GetSubjectByVoucherNew',{params:data}).then(res=>{

                    this.pingjie(res);
                    this.subjectListsCheck=res;
                }).catch(err=>{
                    console.log(res);
                })
            },
            //刷新
            refresh:function(){
                this.getData(false);
            },
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            //科目弹窗选择，全选
            checkedAll(){
                if (this.checked) {
                    //全选
                    this.$refs.vuetree.setCheckedNodes(this.subjectListsCheck);
                }else{
                    //取消选中
                    this.$refs.vuetree.setCheckedKeys([]);
                }

            },

            /*查询多科目明细*/
            getDetailAccountAll:function() {
                let checkedlist=this.$refs.vuetree.getCheckedNodes();
                let codelist=[];
                for(let i=0 ; i<checkedlist.length ; i++){
                    let ar={'Kcode':checkedlist[i].BaseCode,'GLS': this.choosedTypeGls, 'auxiliaryPhid': checkedlist[i].PhId}
                    codelist.push(ar);
                }
                if(codelist.length==0){
                    this.saasMessage={
                        message:'请选择打印科目',
                        delay:3000,
                        visible:true
                    };
                    return;
                }

                let param = {
                    uid: this.userid,
                    orgid:this.orgid,
                    OrgName:this.orgName,
                    Kcodeswith:codelist,
                    Year: this.date1.choosedYear,
                    OrgIds: this.orgid,
                    pageindex:0,
                    pagesize:this.totalCount,
                    Verify:this.proofType?'1':'0,1',
                    Pmonth:this.date1.choosedMonth+','+this.date1.choosedMonthEnd,
                    value:this.inputKvalue==''?'':this.que,
                    StartTime:this.zwTime[0],
                    EndTime:this.zwTime[1],
                    StartAmount:this.startMoney,
                    EndAmount:this.endMoney
                };
                let loading=this.$loading();
                loading.setText('正在查询科目详细数据...');
                let textList=[
                    '查询科目明细中，请耐心等待..',
                    '感谢您使用政云软件',
                    '使用过程中，如遇问题，可联系政云数据',
                    '当前操作需要等待很长时间，可以眺望远方，让眼睛休息一下'
                ];
                function timer() {
                    setTimeout(function () {
                        var num = Math.floor(Math.random() * textList.length);
                        loading.setText(textList[num]);
                        timer();
                    }, 5500);
                }
                timer();
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();
                //Content-Type: application/json; charset=utf-8
                // let config_header = { "Content-Type": "multipart/form-data" };
                var new_header = Object.assign({}, baseheader);
                let url="PVoucherMst/PostAuxDetailAccountList";
                axios.create(base).post(url, qs.stringify(param), { headers:new_header }).then(res=>{
                    console.log(res);
                    let data=JSON.parse(res.data);
                    console.log(data)
                    if(res.status!=200){
                        this.$message({ showClose: true, message:'数据查询失败', type: 'error' })
                    }else{
                        for(var i in data.Record){
                            data.Record[i]['subName']=checkedlist[i].BaseCode+' '+checkedlist[i].BaseName;
                        }

                        this.printDetailList=data.Record;
                        this.showPrintArea();
                    }
                    loading.close();
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //显示打印预览
            showPrintArea:function(){
                this.showPrint=true;
                /*//获取打印内容，渲染于弹窗
                let print = document.createElement("div");
                print.setAttribute('class','timeSelect');
                print.style.padding='30px 40px 30px 30px';
                //获取页面显示的打印表格的表头
                let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                //获取隐藏的工会组织科目名称的表头
                let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                //获取隐藏的表格内容--表尾
                let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
                //表头拼接
                for(let i=thchilds.length-1;i>=0;i--){
                    dm.insertBefore(thchilds[i],dm.firstChild);
                }
                //获取页面的表格内容
                let cop = this.$refs.printFrom.cloneNode(true);
                //表格内容拼接表尾
                for(let i=0;i<tbchilds.length;i++){
                    cop.lastChild.appendChild(tbchilds[i]);
                }
                //表格内容拼接表头
                cop.insertBefore(dm,cop.childNodes[2]);
                print.appendChild(cop);
                //内容全部放入打印预览
                document.getElementById('printContentArea').appendChild(print);*/
            },
            //关闭打印预览
            closePrintArea:function(){
                this.showPrint=false;
                //document.getElementById('printContentArea').innerHTML='';
            },
            // 打印
            printContent(e){
                let print =document.getElementById('printContentArea');
                this.$print(print) // 使用
            },
            //接收凭证消息
            voucherMsg(){

            },
            //
            handle(str){
                var data=this.voucherDataList.data.Mst;

                switch(str){
                    case 'update':
                        if(!(data.PMonth>this.jmonth&&data.Uyear>=this.jyear)){
                            this.saasMessage={
                                visible:true,
                                message:'凭证已结账,无法修改!'
                            }
                            return;
                        }
                        if(data.Verify){
                            this.saasMessage={
                                visible:true,
                                message:'凭证已审核,无法修改!'
                            }
                            return;
                        }
                        this.oldVoucher=JSON.parse(JSON.stringify(data));
                        this.voucherAdd=false;
                        break;
                    case 'audit'://审核**********
                        console.log(this.voucherDataList)
                        if(!(data.PMonth>this.jmonth&&data.Uyear>=this.jyear)){
                            this.saasMessage={
                                visible:true,
                                message:'凭证已结账,无法审核!'
                            }
                            return;
                        }
                        if(data.Verify){
                            this.saasMessage={
                                visible:true,
                                message:'凭证已审核,无法审核!'
                            }
                            return;
                        }
                        this.audit(true,data.PhId);
                        break;
                    case 'unaudit'://反审核************

                        if(!(data.PMonth>this.jmonth&&data.Uyear>=this.jyear)){
                            this.saasMessage={
                                visible:true,
                                message:'凭证已结账,无法反审核!'
                            }
                            return;
                        }
                        if(!data.Verify){
                            this.saasMessage={
                                visible:true,
                                message:'凭证未审核,无需反审核!'
                            }
                            return;
                        }
                        this.audit(false,data.PhId);
                        break;
                    case 'delete' :
                        if(!(data.PMonth>this.jmonth&&data.Uyear>=this.jyear)){
                            this.saasMessage={
                                visible:true,
                                message:'凭证已结账,无法删除!'
                            }
                            return;
                        }
                        if(data.Verify){
                            this.saasMessage={
                                visible:true,
                                message:'凭证已审核,无法删除!'
                            }
                            return;
                        }

                        this.confirm={
                            visible:true,
                            message:'此操作将永久删除凭证,是否继续!',
                            type:'delete'
                        }
                        break;
                    case 'keep':
                        this.voucherDataList.data=this.$refs.voucher.voucherData();//接收voucher组件传值************
                        this.keepVoucher();
                        break;
                    case 'cancle':
                        this.voucherDataList.data.Mst=JSON.parse(JSON.stringify(this.oldVoucher));
                        this.voucherAdd=true;
                        break;
                }
                this.getData(false);
            },
            //保存凭证***********************
            keepVoucher(str){
                var url='Add';
                var Vdata=this.voucherDataList.data;
                if(str=='gengz'){
                    this.clearPhId(Vdata.Mst);
                    //Vdata.Mst.Dtls=Vdata.Mst.Dtls.splice(0,Vdata.Mst.Dtls.length/2);
                }
                if(Vdata.Mst.Dtls.length<=0){
                    this.$message('请输入内容!')
                    return;
                }
                //判断科目金额摘要不能为空
                for(var dtl of Vdata.Mst.Dtls){
                    if(!(dtl.SubjectCode&&dtl.Abstract&&(dtl.JSum||dtl.DSum))){
                        this.saasMessage={
                            message:'科目/金额/摘要不能为空!',
                            visible:true,
                            delay:4000
                        }
                        return;
                    }

                }

                if(!this.dataCheck()){
                    this.saasMessage={
                        visible:true,
                        delay:4000,
                        message:'借贷不平衡,请查看!'
                    }
                    return;
                }
                if(Vdata.Mst.PDate){
                    if(typeof(Vdata.Mst.PDate)=='object'){
                        Vdata.Mst.Uyear=Vdata.Mst.PDate.getFullYear();
                        Vdata.Mst.PMonth=Vdata.Mst.PDate.getMonth()+1;
                        var date=Vdata.Mst.PDate.getDate();
                        Vdata.Mst.PDate=(Vdata.Mst.Uyear+'-')+(Vdata.Mst.PMonth<10?('0'+Vdata.Mst.PMonth):Vdata.Mst.PMonth)+'-'+((date)<10?('0'+date):date);
                    }else {
                        Vdata.Mst.PDate=Vdata.Mst.PDate.substring(0,10)
                    }
                }else{
                    this.$message('请输入凭证会计期!')
                    return;
                }

                if((Vdata.Mst.Uyear>=this.jyear)&&(Vdata.Mst.PMonth>this.jmonth)){

                    var data = {
                        uid: this.uid,
                        Ryear:'',
                        Uname:'',
                        orgid: this.orgid,
                        orgcode: this.orgcode,
                        infoData: Vdata
                    }
                    if(Vdata.Mst.PhId) {
                        url = 'Update';

                    }
                    const loading=this.$loading();

                    this.$axios.post('/PVoucherMst/Post' + url, data)
                        .then(res => {
                            loading.close();
                            if (res.Status == 'success') {
                                this.saasMessage={
                                    visible:true,
                                    delay:3000,
                                    message:res.Msg
                                };
                                //    if(str=='print'){
                                //        this.printContent();
                                //    }
                                // this.voucherMask=false;
                                this.getVoucherData(Vdata.Mst.PhId);
                                this.voucherAdd=true;
                            } else {
                                this.saasMessage={
                                    visible:true,
                                    delay:3000,
                                    message:res.Msg
                                }
                            }
                        },err => {
                            // console.log(err);
                            loading.close();
                        })
                        .catch(err =>{
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'保存出错了!'
                            }
                            loading.close()
                        } )
                }else{
                    this.$message('当前月份已结账,无法修改凭证!')
                }
            },
            // //获取摘要模板
            getAbstract(){
                this.$axios.get('/PAbstractTem/GetAbstractTem')
                    .then(res=>{
                        if(res.Status=='success'){
                            this.AbstractList=res.Data;
                        }else{
                            this.saasMessage={
                                message:res.Msg,
                                visible:true
                            }
                        }
                    })
                    .catch(err=>{

                        this.$message({ showClose: true,message: '获取摘要模板失败了!', type: "error"});
                    })
            },
            ////获取凭证科目选择列表******************
            getSubject(){
                var data={
                    orgid:this.orgid,
                    Ryear:this.date1.choosedYear||(new Date()).getFullYear()
                }
                this.$axios.get('/PSubject/GetPSubjectListByOrgId',{params:data})
                    .then(res=>{
                        if(res.Status=='error'){
                            this.saasMessage={
                                visible:true,
                                message:res.Msg
                            }
                        }
                        this.vouSubjectlist=res;

                        // for(var i in this.voucherInfo){
                        //     this.itemlists[i]={
                        //         id:i,
                        //         kemu:this.subjectlist  //凭证组件中总的科目列表
                        //     }
                        // }
                        this.$forceUpdate();
                    },err => {


                    })
                    .catch(err=>{this.$message({ showClose: true,message: '获取科目列表失败了!', type: "error"});})
            },
            //判断借贷平衡***********
            dataCheck(){
                var data=this.voucherDataList.data.Mst.Dtls;
                var Jcount=0;
                var Dcount=0;
                for(var dtl of data){
                    if(dtl.PersistentState!=3){
                        Jcount=parseFloat(Jcount)+parseFloat(dtl.JSum?dtl.JSum:0);
                        Dcount=parseFloat(Dcount)+parseFloat(dtl.DSum?dtl.DSum:0);
                    }

                }
                if(Jcount.toFixed(2)==Dcount.toFixed(2)){
                    return true;
                }else{
                    return false;
                }
            },
            //删除***********************
            delete(data){
                const loading=this.$loading();
                this.$axios.post('PVoucherMst/PostDeleteBatch',data)
                    .then(res=>{
                        loading.close();
                        if(res.Status=='success'){
                            this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}},
                                this.refresh();
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:res.Msg
                            };

                        }else{
                            this.refresh();
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:res.Msg
                            };
                        }
                    },err => {
                        // console.log(err);
                        loading.close();
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"}),loading.close();})
            },
            //[反]审核*****************
            audit(bool,PhId){
                var data={
                    orgid:this.orgid,
                    uid:this.userid,
                    uname:this.username,
                    infoData:PhId
                }
                var url='PVoucherMst/PostAudit';
                if(!bool){
                    url='PVoucherMst/PostUnAudit'
                }
                const loading=this.$loading();
                this.$axios.post(url,data)
                    .then(res=>{
                        loading.close();
                        if(res.Status=='success'){
                            if(bool){
                                this.saasMessage={
                                    visible:true,
                                    message:'审核成功!'
                                };
                            }else{
                                this.saasMessage={
                                    visible:true,
                                    message:'反审核成功!'
                                };
                            }
                            this.getVoucherData(PhId);
                        }else{
                            if(bool){
                                this.saasMessage={
                                    visible:true,
                                    message:'审核失败!'
                                };
                            }else{
                                this.saasMessage={
                                    visible:true,
                                    message:'反审核失败!'
                                };
                            }
                        }
                    },err => {

                        // console.log(err);
                        loading.close();
                    })
                    .catch(err=>{this.$message({ showClose: true,message: '审核出错了!', type: "error"}),loading.close();})
            },

            confirmOk(type,data2){
                this.confirm.visible = false;
                switch(type){
                    case 'delete':
                        var data={
                            uid:this.uid,
                            orgid:this.orgid,
                            infoData:this.voucherDataList.data.Mst.PhId
                        }
                        this.delete(data);
                        break;
                }
            },
            confirmNo(type) {
                this.confirm.visible = false;
            },
            //关闭凭证弹窗
            closeVoucher:function(){
                this.voucherDataList.bool=false;
                this.getData(false)
            }
        }
    }
</script>

<style scoped>
    .tableContent{
        position: relative;
        top: 10px;
        width: 100%;
    }
    .voucherCover{
        position:fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        padding: 0 30px;
        overflow-y: auto;
    }



    .voucherCover .el-icon-close{
        float: right;
        color: #ccc;
        font-size: 24px;
        padding:0px 7px;
        cursor: pointer;
    }
    .voucherCover .voucherCover_title{
        font-size: 17px;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        height: 45px;
    }
    .voucherContent{
        margin-top: 8%;
        background-color: white;
        width: 80%;
        margin-left: 10%;
        padding: 5px 15px;
        border-radius: 5px;
    }
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
    }
    .searcherValue {
        height: 30px;
        display: inline-block;
        vertical-align: bottom;
        position: relative;
        padding-right: 16px;
    }
    .searcherValue span{
        position: absolute;
        right: 1px;
        top: 8px;
        color: #C0C4CC;
        display: none;
        cursor: pointer;
    }
    .unionState>ul>li{
        width:100%;
    }
    .unionLists{
        width: 260px;
        min-width: 260px;
        margin-right: 10px;
        border: 1px solid #dadada;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    .unionLists~.formData{
        width:100%;
        align-self: flex-start;
    }
    .unionLists>div.unionListsTitle{
        text-align: center;
        background: #45c0f7;
        height:50px;
        color:#fff;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        z-index: 9;
        margin-left:-1px;
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
    .unionListsContent{
        position: absolute;
        overflow-y: scroll;
        overflow-x: hidden;
        bottom: 35px;
        left: 0;
        top: 52px;
        width: 275px;
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
    div.moreList{
        position:relative;
    }
    div.moreList:before{
        content:"-";
        display: block;
        width:10px;
        height:10px;
        line-height: 10px;
        text-align: center;
        border:1px solid #333;
        background: #d5f3fe;
        position:absolute;
        left:-12px;
        top:3px;
        color:#333;
        z-index: 2;
    }
    div.moreListOpen:before{
        content:"+";
        line-height: 8px;
    }
    .searchPanel{
        position: absolute;
        top: 42px;
        right: -103px;
        z-index: 99;
        background-color: #fff;
        width: 360px;
        height: auto;
        box-shadow: 0 0 6px 2px #c9ccce;
        border-radius: 10px 10px;
    }
    .searchPanel input{
        height: 100%;
        background-color: #fff;
    }

    .searchPanel .searchPanel_title{
        height: 40px;
        background-color: #00b7ee;
        color: #fff;
        border-radius: 10px 10px 0 0;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
    }
    .searchPanel .searchPanel_title i{
        float: right;
        position: relative;
        top: -30px;
        right: 10px;
        padding: 2px;
        background: #fff;
        color: #00b7ee;
        border-radius: 15px;
        font-size: 13px;
        -webkit-box-shadow: 1px 1px 2px 1px #909090;
        -moz-box-shadow: 1px 1px 2px 1px #909090;
        box-shadow: 1px 1px 2px 1px #909090;
        cursor: pointer;
    }
    .searchPanel  .searchPanel_content{
        padding: 10px;
    }
    .searchPanel_content>div{
        margin-bottom: 10px;
    }
    .searchPanel .searchContentArea{
        border: 1px solid #dcdcdc;
        border-radius: 3px;
        width: 270px;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        float: right;
    }
    .searchPanel input{
        width: 116px;
        display: inline;
        font-size: 14px;
        color: #606266;
        border: none;
        padding-left: 5px;
    }
    .searchPanel .searchPanel_bottom{
        height: 65px;
        border-top: 1px solid #dddfe4;
        padding: 0 40px;
        background-color: #fff;
    }
    .searchPanel .searchPanel_btn{
        height: 33px;
        color: #fff;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #00B8EE;
        background: #00B8EE;
        padding: 0 15px;
        width: 100px;
        border-radius: 3px;
        -webkit-box-shadow: 1px 1px 2px 1px #909090;
        -moz-box-shadow: 1px 1px 2px 1px #909090;
        box-shadow: 1px 1px 2px 1px #909090;
    }
    .searchPanel .searchPanel_btn:hover{
        color: #00B8EE;
        background: #fff;
    }
    /* .searchPanel .searchPanel_btn:active{
         color: #88b927;
         border-color: #88b927;
     }*/
    #printContentArea a{
        color: #000;
        text-decoration: none;
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
    .coverContent ul{
        padding: 0px 50px;
        margin-bottom: 20px;
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

    /*兼容IE11样式  测试后才可确定是否可用*/
    @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
        .voucherCover{
            position:-ms-page;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            height: 100%;
            width: 100%;
            padding: 0 30px;
            overflow-y: auto;
        }
        .cover{
            position: -ms-page;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(66,66,66,0.45);
            z-index: 99;
            text-align: center;
            overflow-y: auto;
        }
    }
    .voucherDisabledCon{
        position:relative;
        width:100%;
        z-index: 99;
        background:#fff;
    }
    .voucherDisabledCon> .voucherDisabled{
        position:absolute;
        background: none;
        z-index: 99;
        width:74%;
        height:100%;
        top:74px;
        right:0;
    }
    .voucherDisabledCon> .voucherDisabled >div{
        position:relative;
        z-index:89;
    }
    .voucherHandle{
        overflow: hidden;
        margin-top:10px;
    }
    .voucherHandle>span{
        float:right;
        margin-right:20px;
    }
</style>
<style>
    .timeSelect .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        color: #00b8ee;
    }
    .flexUl .el-input--suffix .el-input__inner{
        line-height: 30px;
    }
</style>
