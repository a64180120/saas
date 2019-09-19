<template>
    <div class="timeSelect">
        <div class="orgBox container" style="padding: 10px;">
            <!--顶部切换栏-->
            <div class="orgHead">
                <ul>
                    <li :class="{'choose':checkedBudget==0}" @click="checkBudget(0)">年初预算</li>
                    <li :class="{'choose':checkedBudget==1}" @click="checkBudget(1)">年中调整</li>
                    <li :class="{'choose':checkedBudget==2}" @click="checkBudget(2)">年末决算</li>
                </ul>
            </div>
            <!--工会选择栏-->
            <div style="position: absolute;top: 50px;bottom: 60px;width: 210px;border: 1px solid #eee;overflow: hidden">
                <div style="position: fixed;background-color: #fff;width: 208px;border-bottom: 1px solid #eee">
                    <div class="el-input el-input--prefix" style="text-align: center;height: 35px;overflow: hidden">
                        <div style="width: 158px;height: 26px;line-height: 26px;margin: auto;margin-top: 5px;">
                            <input type="text" autocomplete="off" placeholder="请输入工会名称"
                                   class="el-input__inner"
                                   style="width: 158px;height: 26px;line-height: 26px;font-size: 10pt;padding: 0 5px;"
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
                        @node-contextmenu="rightClick"
                        ref="orgTree">
                    </el-tree>
                </div>
            </div>
            <!--已上报工会及未上报工会-->
            <div style="position: absolute;bottom: 10px;width: 210px;box-shadow: 0px -3px 7px -3px #45c0f7;width: 230px;margin-left: -10px;">
                <div style="float: left;width: 50%;text-align: center;cursor: pointer;color:#ff7f00;" @click="showVerifyOrNo(1)">
                    <div style="font-size: 20px;cursor: pointer;font-weight: bolder">{{orgListNew.VerifyNum}}</div>
                    <div style="cursor: pointer;font-weight: bolder">已上报</div>
                </div>
                <div style="float: right;width: 50%;text-align: center;cursor: pointer"  @click="showVerifyOrNo(2)">
                    <div style="font-size: 20px;cursor: pointer;font-weight: bolder">{{orgListNew.NoVerifyNum}}</div>
                    <div  style="cursor: pointer;font-weight: bolder">未上报</div>
                </div>
            </div>
        </div>
        <div class="container" style="left:250px">

            <div class="manageContent" v-loading="loading">

                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 30px;text-align: center">
                        <div v-if="selectOrg.IsSystem!=1" class="biaoqian" @click="getText">{{checkedBudget==0?'预算':(checkedBudget==1?'预算（调整）':'决算')}}说明书</div>
                        <div style="width:100%;float: right">
                            <span v-if="selectOrg.EnabledMark==1" class="orangeFont">当前组织已被停用</span>
                            <ul class="flexUl handle" >
                                <li v-if="Roleauthorize.budgetSummary_return!=0&&selectOrg.IsSystem!=1&&selectOrg.EnabledMark!=1" :class="{'disableBtn':(this.budgetList.length==0||this.budgetList.length==undefined)}"  @click="reportBackUp(0)">退回</li>
                                <li v-if="Roleauthorize.budgetSummary_export!=0"  :class="{'disableBtn':(this.budgetList.length<=0||this.budgetList.length==undefined)}" @click="openReport(1)">导出</li >
                                <li v-if="Roleauthorize.budgetSummary_print!=0" :class="{'disableBtn':(this.budgetList.length<=0||this.budgetList.length==undefined)}" @click="openReport(0)">打印</li >
                            </ul>
                        </div>
                    </div>

                    <div class="formData" id="form1">
                        <!--预算表-->
                        <template v-if="checkedBudget==0">
                            <div class="tbHeader">
                                <table>
                                    <colgroup>
                                        <col width="10%"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                        <col width="40%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <td>科目编码</td>
                                        <td>科目名称</td>
                                        <td>上年决算数(元)</td>
                                        <td>本年预算数(元)</td>
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
                                        <col width="20%"/>
                                        <col width="20%"/>
                                        <col width="40%"/>
                                    </colgroup>
                                    <tbody >
                                    <template v-if="budgetList.length>0">
                                    <template v-for="(item,index) in budgetList">
                                        <template v-if="item.SubjectCode=='BNSRHJ'">
                                            <tr>
                                                <td></td>
                                                <td class=" bolder center">{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal| NumFormat}}</td>
                                                <td class="right">{{item.BudgetTotal| NumFormat}}</td>
                                                <td>{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNZCHJ'">
                                            <tr>
                                                <td></td>
                                                <td class=" bolder center">{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal| NumFormat}}</td>
                                                <td class="right">{{item.BudgetTotal| NumFormat}}</td>
                                                <td>{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNJY'">
                                            <tr>
                                                <td></td>
                                                <td  class="center bolder">{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal | NumFormat}}</td>
                                                <td class="right">{{item.BudgetTotal| NumFormat}}</td>
                                                <td>其中：政府补助结余：{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='SNJY'">
                                            <tr>
                                                <td></td>
                                                <td class="">{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal | NumFormat}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td>其中：政府补助结余：{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNSHTZ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal | NumFormat}}</td>
                                                <td class="right">{{item.BudgetTotal| NumFormat}}</td>
                                                <td>{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNTZ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal | NumFormat}}</td>
                                                <td class="right" >{{item.BudgetTotal| NumFormat}}</td>
                                                <td>{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNTQHBJ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal | NumFormat}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td >{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='QMGCJY'">
                                            <tr>
                                                <td ></td>
                                                <td class="center bolder">{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal | NumFormat}}</td>
                                                <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                <td>其中：政府补助结余：{{item.Description}}</td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.k_name!='未找到该科目编码对应的科目'">
                                            <tr>
                                                <td :style="{'text-indent':item.Layers==1?'20px':''}">{{item.SubjectCode}}</td>
                                                <td :style="{'text-indent':item.Layers==1?'40px':''}">{{item.k_name}}</td>
                                                <td class="right">{{item.FinalaccountsTotal | NumFormat}}</td>

                                                <template v-if="item.Layers==0">

                                                    <!--判断有没有子级科目，有则禁用，没有则添加输入方法-->
                                                    <template v-if="budgetList[index+1].SubjectCode.substring(0,item.SubjectCode.length)!=item.SubjectCode">
                                                        <td class="right" >{{item.BudgetTotal | NumFormat}}</td>
                                                    </template>
                                                    <template v-else>
                                                        <td class="right">{{code_firstCount[item.SubjectCode] | NumFormat}}</td>
                                                    </template>

                                                </template>
                                                <template v-else>
                                                    <td class="right" >{{item.BudgetTotal | NumFormat}}</td>
                                                </template>
                                                <td>
                                                    {{item.Description}}
                                                </td>
                                            </tr>
                                        </template>
                                    </template>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="5" class="center">
                                                当前组织未上报年初预算
                                            </td>
                                        </tr>
                                    </template>
                                    </tbody>
                                </table>
                            </div>
                            <!--表头和表尾隐藏-->
                            <table style="display: none">
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="40%"/>
                                </colgroup>
                                <div id="theadArea">
                                    <tr>
                                        <td colspan="5" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">工会收支预算表</td>
                                    </tr>

                                    <tr>
                                        <td class="left" colspan="2" style="border:none;background-color: #fff;">编制单位：{{orgName}}</td>
                                        <td class="left" style="background-color: #fff;border: none;">年度：{{date1.choosedYear}}</td>
                                        <td class="left" style="background-color: #fff;border: none;">编报日期：{{date2}}</td>
                                        <td class="right" style="background-color: #fff;border: none;">单位：元</td>
                                    </tr>
                                </div>

                                <div id="tbodyArea">
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
                        </template>
                        <!--调整表-->
                        <template v-if="checkedBudget==1">
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
                                    <template v-if="budgetList.length>0">
                                        <template v-for="(item,index) in budgetList">
                                            <template v-if="item.SubjectCode=='BNSRHJ'">
                                                <tr>
                                                    <td></td>
                                                    <td class="bolder center">{{item.k_name}}</td>
                                                    <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                    <td class="right">
                                                        <input disabled  :value="item.ApprovedBudgetTotal-item.BudgetTotal | NumFormat">
                                                    </td>
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td  >
                                                        <input maxlength="250" :disabled="true" :style="{'text-align':'left'}" type="text" :value="item.DescriptionMiddle"  :index="index">
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
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td >
                                                        <input maxlength="250" type="text" :disabled="true" :style="{'text-align':'left'}" :value="item.DescriptionMiddle"  :index="index">
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
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td  >
                                                        其中：政府补助结余：<input maxlength="250" :disabled="true" :style="{'text-align':'left'}" class="other" type="text"  :index="index" :value="item.DescriptionMiddle">
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
                                                    <td  >
                                                        其中：政府补助结余：<input maxlength="250" :disabled="true" :style="{'text-align':'left'}" class="other" type="text" :value="item.DescriptionMiddle"  :index="index">
                                                    </td>
                                                </tr>
                                            </template>

                                            <template v-else-if="item.SubjectCode=='BNSHTZ'">
                                                <tr >
                                                    <td></td>
                                                    <td>{{item.k_name}}</td>
                                                    <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                    <td class="right" >
                                                        <input :disabled="true" :value="item.ApprovedBudgetTotal-item.BudgetTotal| NumFormat"  :index="index" :code="item.SubjectCode"  >
                                                    </td>
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td   >
                                                        <input maxlength="250" :disabled="true" type="text" :style="{'text-align':'left'}" :value="item.DescriptionMiddle"  :index="index">
                                                    </td>
                                                </tr>
                                            </template>

                                            <template v-else-if="item.SubjectCode=='BNTZ'">
                                                <tr>
                                                    <td></td>
                                                    <td>{{item.k_name}}</td>
                                                    <td class="right">{{item.BudgetTotal | NumFormat}}</td>
                                                    <td class="right" >
                                                        <input  :disabled="true"  :value="item.ApprovedBudgetTotal-item.BudgetTotal| NumFormat"  :index="index" :code="item.SubjectCode"  >
                                                    </td>
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td  >
                                                        <input maxlength="250" :disabled="true" :style="{'text-align':'left'}" type="text" :value="item.DescriptionMiddle"  :index="index">
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
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td  >
                                                        <input maxlength="250" :disabled="true" :style="{'text-align':'left'}"  type="text" :value="item.DescriptionMiddle"  :index="index">
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
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td>
                                                        其中：政府补助结余：<input maxlength="250"  :disabled="true" :style="{'text-align':'left'}" class="other" type="text" :value="item.DescriptionMiddle"  :index="index">
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
                                                            <td class="right"  >
                                                                <input  :disabled="true"   :index="index" :code="item.SubjectCode" :layer="item.Layers"   :value="(item.ApprovedBudgetTotal-item.BudgetTotal )| NumFormat">
                                                            </td>
                                                        </template>
                                                        <template v-else>
                                                            <td class="right">
                                                                <input disabled  :code="item.SubjectCode" :value="(item.ApprovedBudgetTotal-item.BudgetTotal)| NumFormat">
                                                            </td>
                                                        </template>
                                                    </template>
                                                    <template v-else>
                                                        <td class="right"  >
                                                            <input  :disabled="true" :index="index" :code="item.SubjectCode" :layer="item.Layers" :value="(item.ApprovedBudgetTotal-item.BudgetTotal )| NumFormat">
                                                        </td>
                                                    </template>
                                                    <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                    <td  >
                                                        <input maxlength="250" :disabled="true" :style="{'text-align':'left'}" type="text" :value="item.DescriptionMiddle" :index="index">
                                                    </td>
                                                </tr>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="6" class="center">
                                                当前组织未上报年中预算调整
                                            </td>
                                        </tr>
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
                                        <td class="left" style="background-color: #fff;border: none;">年度：{{date1.choosedYear}}</td>
                                        <td class="left" colspan="2" style="background-color: #fff;border: none;">编报日期：{{date2}}</td>
                                        <td class="right" style="background-color: #fff;border: none;">单位：元</td>
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
                        </template>
                        <!--决算表-->
                        <template v-if="checkedBudget==2">
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
                                        <td>核定预算数（元）</td>
                                        <td>决算数（元）</td>
                                        <td>完成预算（%）</td>
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
                                    <template v-if="budgetList.length>0">
                                    <template v-for="(item,index) in budgetList">
                                        <template v-if="item.SubjectCode=='BNSRHJ'">
                                            <tr>
                                                <td></td>
                                                <td class="bolder center">{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    {{item.ThisaccountsTotal | NumFormat}}
                                                </td>
                                                <td>
                                                    <div class="progressContainer" >
                                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%','color':'#fff'}">{{dataInfo[index].zhixing < 60 ?'':dataInfo[index].zhixing+' %'}}</div>
                                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<40?40:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=40?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input maxlength="250" :disabled="true" type="text" :style="{'text-align':'left'}" :value="item.DescriptionEnd"  :index="index" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNZCHJ'">
                                            <tr>
                                                <td></td>
                                                <td class=" bolder center">{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    {{item.ThisaccountsTotal | NumFormat}}
                                                </td>
                                                <td>
                                                    <div class="progressContainer" >
                                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%','color':'#fff'}">{{dataInfo[index].zhixing < 60 ?'':dataInfo[index].zhixing+' %'}}</div>
                                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<40?40:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=40?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input maxlength="250" type="text" :disabled="true" :style="{'text-align':'left'}" :value="item.DescriptionEnd"  :index="index" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNJY'">
                                            <tr>
                                                <td></td>
                                                <td class="center bolder">{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">{{item.ThisaccountsTotal | NumFormat}}</td>
                                                <td></td>
                                                <td>
                                                    其中：政府补助结余：<input maxlength="250" :disabled="true" :style="{'text-align':'left'}" class="other" type="text"  :index="index" :value="item.DescriptionEnd" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='SNJY'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">{{item.ThisaccountsTotal | NumFormat}}</td>
                                                <td></td>
                                                <td>
                                                    其中：政府补助结余：<input maxlength="250" :disabled="true" :style="{'text-align':'left'}" class="other" type="text" :value="item.DescriptionEnd"  :index="index" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNSHTZ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">{{item.ThisaccountsTotal | NumFormat}}</td>
                                                <td></td>
                                                <td>
                                                    <input maxlength="250" :disabled="true" type="text" :style="{'text-align':'left'}" :value="item.DescriptionEnd"  :index="index" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNTZ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">{{item.ThisaccountsTotal | NumFormat}}</td>
                                                <td></td>
                                                <td>
                                                    <input maxlength="250" :disabled="true" type="text" :style="{'text-align':'left'}" :value="item.DescriptionEnd"  :index="index" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='BNTQHBJ'">
                                            <tr>
                                                <td></td>
                                                <td>{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">{{item.ThisaccountsTotal | NumFormat}}</td>
                                                <td></td>
                                                <td>
                                                    <input maxlength="250" :disabled="true" type="text" :style="{'text-align':'left'}" :value="item.DescriptionEnd"  :index="index" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.SubjectCode=='QMGCJY'">
                                            <tr>
                                                <td></td>
                                                <td class="center bolder">{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">{{item.ThisaccountsTotal | NumFormat}}</td>
                                                <td>
                                                    <!--<div class="progressContainer" >
                                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                                    </div>-->
                                                </td>
                                                <td>
                                                    其中：政府补助结余：<input  maxlength="250" :disabled="true":style="{'text-align':'left'}" class="other" type="text" :value="item.DescriptionEnd"  :index="index" >
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-else-if="item.k_name!='未找到该科目编码对应的科目'">
                                            <tr>
                                                <td :style="{'text-indent':item.Layers==1?'20px':''}">{{item.SubjectCode}}</td>
                                                <td :style="{'text-indent':item.Layers==1?'40px':''}">{{item.k_name}}</td>
                                                <td class="right">{{item.ApprovedBudgetTotal | NumFormat}}</td>
                                                <td class="right">
                                                    {{item.ThisaccountsTotal | NumFormat}}
                                                </td>
                                                <td>
                                                    <div class="progressContainer" >
                                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%','color':'#fff'}">{{dataInfo[index].zhixing < 60 ?'':dataInfo[index].zhixing+' %'}}</div>
                                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<40?40:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=40?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input maxlength="250" :disabled="true" type="text" :style="{'text-align':'left'}" :value="item.DescriptionEnd" :index="index" >
                                                </td>
                                            </tr>
                                        </template>
                                    </template>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="6" class="center">
                                                当前组织未上报年末决算
                                            </td>
                                        </tr>
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
                                        <td colspan="6" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">工会收支决算表</td>
                                    </tr>

                                    <tr>
                                        <td class="left" colspan="2" style="border:none;background-color: #fff;">编制单位：{{orgName}}</td>
                                        <td class="left" style="background-color: #fff;border: none;">年度：{{date1.choosedYear}}</td>
                                        <td class="left" colspan="2" style="background-color: #fff;border: none;">编报日期：{{date2}}</td>
                                        <td class="right" style="background-color: #fff;border: none;">单位：元</td>
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

                        </template>


                    </div>
                    <div class="verifyPanel" :style="{display:!verify?'block':'none'}">
                        <div>已上报</div>
                        <div style="font-size: 14px">{{verifyTime.substring(0,10)}}</div>
                    </div>
                </div>

                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose" :showtype="'yearTime'" :budgetAll="true" ref="aa"></time-select-bar>
                </div>
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
                    <el-checkbox v-if="selectOrg.IsSystem!=1"  v-model="showReportMsg.printChoice[1]">说明</el-checkbox>
                    <el-checkbox v-model="showReportMsg.printChoice[2]">报表</el-checkbox>
                </div>
                <ul class="flexPublic handle">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="showReportMsg.flag=false">取消</li>
                    <template v-if="showReportMsg.type==0">
                        <li style='margin:0 0 0px 20px;cursor: pointer' @click="printContent(0)">打印</li>
                    </template>
                    <template v-else>
                        <li style='margin:0 0 0px 20px;cursor: pointer' @click="postBalanceSheetExcel">导出</li>
                    </template>
                </ul>
            </div>
        </div>
        <!--打印封面弹窗-->
        <div class="cover" :style="{'display':(showReport?'block':'none'),'z-index':'1000'}">
            <i class="el-icon-close" @click="showReport=false" style="margin-top: 6%;right: 6%;"></i>
            <div style="width: 90%;height: auto;margin: 5%;box-shadow: 0 0 10px 1px #0000005e;">
                <div class="coverContentFace" id="faceArea">
                    <template v-if="checkedBudget==0">
                        <div  id="stepOne" :style="{'display':showAreaReport=='stepOne'?'':'none'}">
                            <div>
                                <div class="face_title">
                                    <input type="text" disabled/>总工会
                                </div>
                                <div class="face_year">
                                    <input type="text" disabled/>年度
                                </div>
                                <div class="face_name">
                                    工会经费收支预算表
                                </div>
                                <div class="face_manu">
                                    <div>目录</div>
                                    <ul>
                                        <li>1. 本级预算说明书</li>
                                        <li>2. 本级经费收支预算表</li>
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
                                            经费审查委员会主任：<input disabled/>
                                        </p>
                                    </div>
                                </div>
                                <div class="face_reportTime">
                                    报出日期：<input disabled/>年<input disabled/>月<input disabled/>日
                                </div>
                            </div>
                        </div>
                        <div id="stepThird" :style="{'display':showAreaReport=='stepThird'?'':'none'}">
                            <h2 style="margin-bottom: 25px">预算说明书</h2>
                            <div id="third" style="text-align:left"></div>
                        </div>
                    </template>
                    <template v-if="checkedBudget==1">
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
                        <div id="stepThird" :style="{'display':showAreaReport=='stepThird'?'':'none'}">
                            <h2 style="margin-bottom: 25px">预算说明书</h2>
                            <div id="third" style="text-align:left"></div>
                        </div>
                    </template>
                    <template v-if="checkedBudget==2">
                        <div  id="stepOne" :style="{'display':showAreaReport=='stepOne'?'':'none'}">
                            <div>
                                <div class="face_title">
                                    <input disabled type="text"/>总工会
                                </div>
                                <div class="face_year">
                                    <input disabled type="text"/>年度
                                </div>
                                <div class="face_name">
                                    工会经费收支决算表
                                </div>
                                <div class="face_manu">
                                    <div>目录</div>
                                    <ul>
                                        <li>1. 本级决算说明书</li>
                                        <li>2. 本级经费收支决算表</li>
                                    </ul>
                                </div>
                                <div class="face_sign">
                                    <div>
                                        <!--<p>
                                            本决算业经<input />年<input />月<input />日
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
                                             本决算业经<input />年<input />月<input />日</p>
                                         <p>
                                             第<input />届<input />次经费审查委员会审查
                                         </p>-->
                                        <p>
                                            经费审查委员会主任：<input disabled :value="curOrg.Director"/>
                                        </p>
                                    </div>
                                </div>
                                <div class="face_reportTime">
                                    报出日期：<input disabled />年<input disabled />月<input disabled />日
                                </div>
                            </div>
                        </div>
                        <div id="stepThird" :style="{'display':showAreaReport=='stepThird'?'':'none'}">
                            <h2 style="margin-bottom: 25px">决算说明书</h2>
                            <div id="third" style="text-align:left"></div>
                        </div>
                    </template>
                </div>
                <div style="background-color: white;box-shadow: 0px 4px 6px -1px;padding-bottom: 10px">
                    <el-button :style="{'display':showAreaReport!='stepThird'?'none':''}" @click="showAreaReport=showAreaReport=='stepThird'?'stepOne':'stepThird'">上一步</el-button>
                    <el-button @click="showArea" :style="{'display':showAreaReport=='stepThird'?'none':''}">下一步</el-button>
                    <el-button :style="{'display':showAreaReport!='stepThird'?'none':''}" @click="closeText">关闭</el-button>
                </div>
            </div>


        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
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
        <el-dialog :title="showReportOrgType==1?'已上报工会':'未上报工会'" :visible.sync="showReportOrg" width="750px" >
            <div style="height: 35px;margin-top: -35px;">
                <ul class="flexUl" >
                    <li v-if="showReportOrgType==1" @click="backOrgList">退回</li >
                    <li @click="postOrgSheetExcel">导出</li >
                    <li @click="printContent(1)">打印</li >
                    <!--<li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>-->
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
                  <!--<ul>
                      <template v-for="item in (showReportOrgType==1?SysOrgVerifyList:SysOrgNoVerifyList)">
                          <li style="height: 30px;line-height: 30px">{{item.OrgName}}</li>
                      </template>
                  </ul>-->

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
                        <!--表头和表尾隐藏-->
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
                       <!--表头和表尾隐藏-->
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
        </el-dialog>

        <div v-show="menuForm.menuVisible">
            <ul id="menu" class="menu">
                <li class="menu__item" @click="reportBackUp(1)">退回</li>
                <li class="menu__item" @click="showOrgInfo">工会信息</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from "vuex";
    import TimeSelectBar from "@/components/TimeSelectBar/index"
    import saasMsg from '@/components/message/message'
    import axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import {SysOrgModel, SysOrgUpdate, SysOrgUploadFile, SysOrgDelete, AllAreaSysOrgModel, SysOrgUpdateAndRecord} from '@/api/organize/orgInfo'
    import qs from 'qs';
  export default {
      name: "plan",
      data(){
          return{
              showNextMsg:false,
              showReport:false,
              showReportOrg:false,
              showReportOrgType:1,
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
              orgSearchValue:'',//组织查询值

              defaultProps: {
                  children: 'children',
                  label: 'OrgName'
              },
              selectOrg:{},//选中的组织
              selectOrgRight:{},//右键选中的组织
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

              },
              showOrg:false,
              dbTime:false,
              inputKvalue:'',//搜索框数据
              menuForm:{//右键菜单
                  menuVisible:false,//显示隐藏
              },
              SysOrgNoVerifyList:[],//未上报的组织数组
              SysOrgVerifyList:[],//上报的组织数组
              orgLists: [],//组织数组
              orgListsNew:{},
              orgListNew:{},//上报。未上报完整数组
              checked:false,//上报、未上报，组织全选
              checkedOrgList:[],//上报、未上报，选中的组织
          }
      },
      components: {TimeSelectBar,saasMsg},
      activated(){
          if(this.$route.query){
              this.checkedBudget=this.$route.query.checkedBudget==undefined?0:this.$route.query.checkedBudget;
          }

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
      watch:{},
      mounted() {
          let currentYear = new Date();
          //获取当前编报时间
          this.date2=currentYear.getFullYear()+'年'+(currentYear.getMonth()+1<10?'0'+(currentYear.getMonth()+1):currentYear.getMonth()+1)+'月'+(currentYear.getDate()<10?'0'+currentYear.getDate():currentYear.getDate())+'日';

      },
      methods:{
          //组织树右键点击事件
          rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
              this.menuForm.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
              this.menuForm.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
              var menu = document.querySelector('#menu');
              menu.style.left = MouseEvent.clientX+15+ 'px';
              menu.style.top = MouseEvent.clientY-80  + 'px';

              document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法

              this.selectOrgRight=Node.data;
          },
          foo() { // 取消鼠标监听事件 菜单栏
              this.menuForm.menuVisible = false
              document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
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
          /*显示上报组织弹窗*/
          showVerifyOrNo:function(type){
              this.showReportOrgType=type;
              this.showReportOrg=true;
              this.inputKvalue='';
              this.checked=false;
          },
          /*切换年初，年中，年末*/
          checkBudget:function(type){
              this.checkedBudget=type;
              this.getBeginYear();
              this.getReportOrg();
          },
          //科目过滤
          filterNode(value, data) {
              if (!value) return true;
              return data.OrgName.indexOf(value) !== -1;
          },
            //上报、未上报工会选择点击事件
          handleCheckChange(data, checked, indeterminate) {
              console.log(data, checked, indeterminate);
              //根据组织树的选中来获取需要导出的组织
              this.checkedOrgList=this.$refs.vuetree.getCheckedNodes();
          },
          checkedAll(){
              if (this.checked) {
                  //全选
                  this.$refs.vuetree.setCheckedNodes(this.showReportOrgType==1?this.SysOrgVerifyList:this.SysOrgNoVerifyList);
              }else{
                  //取消选中
                  this.$refs.vuetree.setCheckedKeys([]);
              }

          },
          //科目选择
          handleNodeClick(data){
              this.foo();
              this.selectOrg=data;
              console.log(this.selectOrg);
              this.getBeginYear();
          },
          //查询显示组织信息
          showOrgInfo:function(){
              this.showOrg=true;
              this.getOrgDataS();
          },
          //关闭说明书，初始化打开显示页面
          closeText:function(){
              this.showReport=false;
              this.showAreaReport='stepOne';
          },
          //显示说明书
          showArea:function(){
              this.showAreaReport=(this.showAreaReport=='stepOne'? 'stepThird':'stepOne')
          },
          //渲染进度条颜色
          getInfoStyle(){
              var infos=this.dataInfo;
              var val=[];
              for(var i in infos){
                  infos[i].zhixing=infos[i].zhixing.toFixed(2);
                  val[i]=infos[i].zhixing;
                  if(val[i]<30){
                      val[i]=`#ff0000`;
                  }else if(val[i]>=30&&val[i]<60){
                      val[i]=`#ff9900`;
                  }else if(val[i]>=60&&val[i]<90){
                      val[i]=`#2473eb`;
                  }else{
                      val[i]=`#83c350`;
                  }
              }
              this.infoStyle=val;
          },
          /*
            * 页面数据查询方法
            * */
          getBeginYear:function(){
              this.budgetList={};
              this.verify=true;
              let year=this.date1.choosedYear;
              console.log(this.selectOrg);
              let url='';
              if(this.checkedBudget==0){
                  url='PSubjectBudget/GetAllBeginYear';
                  // if(this.selectOrg.VerifyStart==0){
                  //     return;
                  // }
              }else if(this.checkedBudget==1){
                  url='PSubjectBudget/GetAllMiddleYear';
                  // if(this.selectOrg.VerifyMiddle==0){
                  //     return;
                  // }
              }else{
                  url='PSubjectBudget/GetAllEndYear';
                  // if(this.selectOrg.VerifyEnd==0){
                  //     return;
                  // }
              }
              let data={
                  "uid": this.userid,
                  "orgid":this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId,
                  "Year":  year,
                  "OrgIds": this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId,
                  'IsStart':1
              };
              const loadings=this.$loading();
              this.$axios.get(
                  url,
                  {params:data}
              ).then(res=>{
                  loadings.close();
                  let dataInfo=[];
                  let  code_firstCount={},//存放一级科目对应预算数
                      specialSubIndex={};//存放特殊的科目
                  //循环遍历，得到一级子目录一级对应的预算数
                  //计算上年决算数对应的本年合计收入，以及本年支出合计
                  // 得到  本年收入合计,本年支出合计，本年结余，上年结余，收回投资，本年投资，本年提取后备金，期末滚存结余  对应数组用于计算
                  let verifyValue='';
                  if(this.checkedBudget==0){
                      verifyValue=res.Record[0].VerifyStart;
                      this.verifyTime=res.Record[0].VerifyStart_time;
                  }else if(this.checkedBudget==1){
                      verifyValue=res.Record[0].VerifyMiddle;
                      this.verifyTime=res.Record[0].VerifyMiddle_time;
                  }else{
                      verifyValue=res.Record[0].VerifyEnd;
                      this.verifyTime=res.Record[0].VerifyEnd_time;
                  }

                  if( verifyValue==1){
                      this.verify=false;
                  }else{
                      this.verify=true;
                      if(this.selectOrg.IsSystem!=1){
                          this.budgetList={};
                          return;
                      }

                  }
                  for(var i in res.Record){
                      res.Record[i].OrgId=this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId;
                      res.Record[i].OrgCod=this.selectOrg.EnCode==undefined?this.orgcode:this.selectOrg.EnCode;
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
                      if(res.Record[i].ApprovedBudgetTotal==0||res.Record[i].ApprovedBudgetTotal==''||res.Record[i].ApprovedBudgetTotal==null){
                          let anwser=0;
                          dataInfo.push({zhixing:anwser})
                      }else{
                          let anwser=res.Record[i].ThisaccountsTotal/res.Record[i].ApprovedBudgetTotal*100;
                          dataInfo.push({zhixing:anwser});
                      }
                  }
                  this.budgetList=res.Record;
                  this.code_firstCount = code_firstCount;
                  this.specialSubIndex = specialSubIndex;
                  this.dataInfo=dataInfo;
                  this.getInfoStyle();
              }).catch(res=>{
                  loadings.close();
                  console.log(res);
              })
          },
          /*
           * 时间选择器
           * */
          dateChoose:function(val){
              this.date1=val;
              this.getReportOrg();
              this.getOrgData();
              //this.getBeginYear();


              this.changeBtn.title='编辑';
          },


          /*
            *author:hyz
            *导出报表Excel表格
            *
            * */
          postBalanceSheetExcel:function() {
              let base = httpConfig.getAxiosBaseConfigUncontrol();
              if(this.budgetList.length<=0||this.budgetList.length==undefined){
                  return;
              }
              let loading=this.$loading();
              //下载封面
              if(this.showReportMsg.printChoice[0]){
                  let param = {
                      'uid':this.userid,
                      'orgid':this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId,
                      'Ryear':this.date1.choosedYear,
                      'value': this.checkedBudget==0?1:(this.checkedBudget==1?2:3)
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
                      'orgid':this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId,
                      'Ryear':this.date1.choosedYear,
                      'value': this.checkedBudget==0?1:(this.checkedBudget==1?2:3)
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
                         /* setTimeout(
                              function(){
                                  let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                                  myWindow=null;
                              },50
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
              if(this.showReportMsg.printChoice[2]){
                  let param = {
                      'uid':this.userid,
                      'orgid':this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId,
                      'infoData': this.budgetList};
                  //let baseheader = httpConfig.header;

                  let url=null;
                  if(this.checkedBudget==0){
                      url='/PsubjectBudget/PostExportBeginYear';
                  }else if(this.checkedBudget==1){
                      url='/PsubjectBudget/PostExportMiddleYear';
                  }else{
                      url='/PsubjectBudget/PostExportEndYear';
                  }

                  //下载Excel
                  this.downloadLoading = true
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
          /*
            *author:hyz
            *导出组织Excel表格
            *
            * */
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
          //打开打印导出选择弹窗
          openReport:function(type){
              this.showReportMsg.flag=true;
              this.showReportMsg.type=type;
          },
          // 打印
          printContent(type){
              /*this.getPdf(this.$refs.printFrom);*/
              let print = document.createElement("div");
              print.setAttribute('class','timeSelect');
              print.style.padding='30px 40px 30px 30px';
              if(type==0){
                  if(!this.showReportMsg.printChoice[0]&&!this.showReportMsg.printChoice[1]&&!this.showReportMsg.printChoice[2]){
                      this.saasMessage={
                          message:'请选择打印内容',
                          delay:3000,
                          visible:true
                      };
                      return;
                  }
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


                      //打印表头
                      let dm = this.$refs.printFrom.parentNode.parentNode.cloneNode(true).childNodes;
                      let dmc=null;
                      for(let i=0 ; i<dm.length ; i++){
                          if(dm[i].nodeType==1){
                              dmc=dm[i].firstChild.childNodes[2];
                              break;
                          }
                      }
                      //获取隐藏的工会组织科目名称的表头
                      let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                      //获取隐藏的表格内容--表尾
                      let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
                      //表头拼接
                      for(let i=thchilds.length-1;i>=0;i--){
                          dmc.insertBefore(thchilds[i],dmc.firstChild);
                      }
                     // let cop = this.$refs.printFrom.cloneNode(true);
                      //获取打印表格的内容调整，修改input数据打印无法正常显示
                      let printArea=this.$refs.printFrom.cloneNode(true);
                      console.log(printArea);
                      let inputList=printArea.getElementsByTagName('input');
                      for(let inNum=0; inNum<inputList.length; inNum++){
                          let text=inputList[0].value==undefined?'':inputList[0].value;//获取打印区域input的值

                          let text1=inputList[0].parentNode.text==undefined?'':inputList[0].parentNode.text;//获取打印区域，除input以外的文本，’其中政府补助‘
                          inputList[0].parentNode.innerHTML=''+text1+text;

                      }
                      console.log(printArea);
                      //表格内容拼接表尾
                      for(let i=0;i<tbchilds.length;i++){
                          printArea.lastChild.appendChild(tbchilds[i]);
                      }
                      printArea.insertBefore(dmc,printArea.childNodes[2]);
                      print.appendChild(printArea);
                      dmc=null;
                      dm=null;
                      printArea=null;
                  }
              }else{
                  if(this.checkedOrgList.length<=0){
                      this.saasMessage={
                          message:'请选择要打印的工会',
                          delay:3000,
                          visible:true
                      };
                      return;
                  }
                  //获取打印表格的表头
                  let dm = this.$refs.printFromOrg.parentNode.parentNode.cloneNode(true).childNodes;
                  let dmc=null;
                  for(let i=0 ; i<dm.length ; i++){
                      if(dm[i].nodeType==1){
                          dmc=dm[i].firstChild.childNodes[2];
                          break;
                      }
                  }
                  //获取隐藏的工会组织科目名称的表头
                  let thchilds=document.getElementById('theadAreaOrg').cloneNode(true).childNodes;
                  //获取隐藏的表格内容--表尾
                  //let tbchilds=document.getElementById('tbodyAreaOrg').cloneNode(true).childNodes;
                  //表头拼接
                  for(let i=thchilds.length-1;i>=0;i--){
                      dmc.insertBefore(thchilds[i],dmc.firstChild);
                  }
                  let cop = this.$refs.printFromOrg.cloneNode(true);
                  //表格内容拼接表尾
                 /* for(let i=0;i<tbchilds.length;i++){
                      cop.lastChild.appendChild(tbchilds[i]);
                  }*/
                  cop.insertBefore(dmc,cop.childNodes[2]);
                  print.appendChild(cop);
                  dmc=null;
                  dm=null;
                  cop=null;
              }
              console.log(print);
              this.$nextTick(this.$print(print))

              print=null;
          },

          /*
        * 预算说明书查询
        * */
          getText:function(){
              let data={
                  orgid: this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId,
                  Uyear:this.date1.choosedYear
              };
              if(this.checkedBudget==0){
                  data['DescriptionStart']=1;
              }else if(this.checkedBudget==1){
                  data['DescriptionMiddle']=1;
              }else{
                  data['DescriptionEnd']=1;
              }

              this.$axios.get(
                  'PSubjectBudgetMst/GetDescriptionByOrgId',
                  {params:data}
              ).then(res=>{
                  if(res.Status=='success'){
                      this.tableFace.phid=res.PhId;
                      document.getElementById('third').innerHTML=res.Description;
                      this.showReport=true;
                  }else{
                      this.saasMessage={
                          message:'获取说明书失败，请刷新页面后重试',
                          delay:3000,
                          visible:true
                      };
                  }

              }).catch(function(err){
                  this.saasMessage={
                      message:'获取说明书失败，请刷新页面后请重试',
                      delay:3000,
                      visible:true
                  };
                  console.log(err);
              })
          },
          /*
          组织查询，默认选中当前登录组织
          * */
          getOrgData:function(){
              const loadinga=this.$loading();
              let data={
                  orgId:this.orgid,
                  year:this.date1.choosedYear,
                  //加时间戳，防止IE缓存
                  timeCode:(new Date()).getTime().toString()
              }

              let baseheader=httpConfig.getHeaderConfig(this.dbname);
              let base=httpConfig.getAxiosBaseConfigUncontrol();

              axios.create(base).get('sysOrganize/GetOrgListByOrgId',{params:data, headers:baseheader }).then(res => {

                  //res=qs.parse(res);
                  let datas=JSON.stringify(res.data);
                  datas.replace('\\n','');
                  datas.replace('\\r','');
                  datas.replace(' ','');
                  let data=JSON.parse(JSON.parse(datas));
                  if(data.Status=='error'){
                      this.saasMessage={
                          message:data.Msg,
                          delay:3000,
                          visible:true
                      };
                      loadinga.close();
                      return;
                  }
                  //let Data=JSON.parse(data);
                  //console.log(Data);
                  this.orgLists=data;
                  this.orgListsNew=data;

                  this.$nextTick(()=>{
                      if(this.selectOrg.PhId==''||this.selectOrg.PhId==undefined||this.selectOrg.PhId==null){
                          this.selectOrg=this.orgLists[0];
                          this.$refs.orgTree.setCurrentKey(this.orgLists[0].PhId);
                      }else{
                          this.$refs.orgTree.setCurrentKey(this.selectOrg.PhId);
                      }

                      // for(let i=0; i<this.orgLists.length)
                      this.getBeginYear();
                  })
                  setTimeout(function(){
                      loadinga.close()
                  },1000)
                  //loading.close();
              }).catch(err=>{
                  loadinga.close();
                  console.log(err);
              })
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
          /*获取上报、未上报组织列表及数目*/
          getReportOrg:function(){
              //SysOrganize/GetAllOrgSubjectStateNum
              let data={
                  orgId:this.orgid,
                  year:this.date1.choosedYear,
                  judge:this.checkedBudget==0?1:(this.checkedBudget==1?2:3)
              };
              this.$axios.get(
                  'SysOrganize/GetAllOrgSubjectStateNum',
                  {params:data}
              ).then(res=>{
                  console.log(res);
                  this.orgListNew=res.Data;
                  this.SysOrgNoVerifyList=res.Data.SysOrgNoVerifyList;
                  this.SysOrgVerifyList=res.Data.SysOrgVerifyList;
              }).catch(err=>{
                  console.log(err);
              })
          },
          //退回
          reportBackUp:function(type){

              let orgid='';
              console.log(this.selectOrgRight);
              if(type==0){
                  if(this.budgetList.length<=0||this.budgetList.length==undefined){
                      return;
                  }
                  orgid=this.selectOrg.PhId==undefined?this.orgid:this.selectOrg.PhId
              }else{

                  if(this.checkedBudget==0){
                      if(this.selectOrgRight.VerifyStart==0){
                          this.saasMessage={
                              message:'当前组织未上报年初预算',
                              delay:3000,
                              visible:true
                          };
                          return;
                      }
                  }else if(this.checkedBudget==1){
                      if(this.selectOrgRight.VerifyMiddle==0){
                          this.saasMessage={
                              message:'当前组织未上报年初预算(调整)',
                              delay:3000,
                              visible:true
                          };
                          return;
                      }
                  }else{
                      if(this.selectOrgRight.VerifyEnd==0){
                          this.saasMessage={
                              message:'当前组织未上报年底结算',
                              delay:3000,
                              visible:true
                          };
                          return;
                      }
                  }
                  orgid=this.selectOrgRight.PhId==undefined?this.orgid:this.selectOrgRight.PhId
              }
              let data={
                  orgid:orgid,
                  uid:this.userid,
                  Ryear:this.date1.choosedYear,
                  value:this.checkedBudget==0?1:(this.checkedBudget==1?2:3)/*（1=年初，2=年中，3=年末）*/
              };
              this.$axios.post(
                  'PSubjectBudgetMst/PostUnVerify',
                  data
              ).then(res=>{
                  console.log(res);
                  this.saasMessage={
                      message:res.Msg,
                      delay:3000,
                      visible:true
                  };
                  if(res.Status=='success'){
                      this.getReportOrg();
                      this.getOrgData();
                      this.getBeginYear();
                  };

              }).catch(err=>{
                  console.log(err);
              })
          },
          //批量退回
          backOrgList:function(){

              let orgList=this.checkedOrgList,orgIdList=[];
              if(orgList.length<=0){
                  this.saasMessage={
                      message:'请选择要退回的组织(可多选)',
                      delay:3000,
                      visible:true
                  };
                  return;
              }else{
                  for(let i=0; i<orgList.length; i++){
                      orgIdList.push(orgList[i].PhId)
                  }
              }
              let data={
                  infoData:orgIdList,
                  uid:this.userid,
                  Ryear:this.date1.choosedYear,
                  value:this.checkedBudget==0?1:(this.checkedBudget==1?2:3)/*（1=年初，2=年中，3=年末）*/
              };
              this.$axios.post(
                  'PSubjectBudgetMst/PostBatchUnVerify',
                  data
              ).then(res=>{
                  console.log(res);
                  this.saasMessage={
                      message:res.Msg,
                      delay:3000,
                      visible:true
                  };
                  if(res.Status=='success'){
                      this.getReportOrg();
                      this.getOrgData();
                      this.getBeginYear();
                  };

              }).catch(err=>{
                  console.log(err);
              })
          },
          //侧边组织数查询方法
          orgSearch:function(){
            // SysOrganize/GetOrgListByOrgIdAndName([FromUri]string orgId, string year, string name)
              if(this.orgSearchValue==''){
                  this.orgLists=this.orgListsNew;
              }else{
                  const loadings=this.$loading();

                  let data={
                      orgId:this.orgid,
                      year:this.date1.choosedYear,
                      name:this.orgSearchValue
                  };
                  this.$axios.get('SysOrganize/GetOrgListByOrgIdAndName',{params:data}).then(res=>{
                      console.log('查询');
                      console.log(res);
                      if(res.Status=='success'){
                          this.orgLists=res.Data;
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
      }
  }
</script>

<style scoped>
    .menu .menu__item {
        display: block;
        line-height: 20px;
        text-align: center;
        padding: 10px;
    }
    .menu {
        height: auto;
        width: 100px;
        position: absolute;
        box-shadow: 0 0 4px 0px #b1ddf0;
        background-color: #f4f4f4;
        z-index: 99;
    }
    .menu li:hover {
        background-color: #00b7ee;
        color: white;
    }
    .orgedit-linehight {
        height: 40px;
        border-bottom: 1px solid #b1def1;
        line-height: 40px;
        font-size: 14px;
    }

    .orgedit-title {
        height: 100%;
        width: 30%;
        float: left;
        color: #fff;
        background: #00B8EE;
    }

    .orgtitle-ringt {
        float: right;
    }

    .orgedit-value {
        height: 100%;
        width: 60%;
        float: left;
        overflow:hidden;
        white-space: nowrap;
        margin-left: 10px;
    }
    .orgBox{
        width: 230px;
        z-index:2;

    }
    .orgHead{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #00B8EE;
    }
    .orgHead ul{
        width: 100%;
    }
    .orgHead ul li{
        width: 30%;
        display: inline-block;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
    }
    .orgHead ul li:hover{
        background-color: #88b927;
        opacity: 0.5;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
    }
    .orgHead ul .choose{
        background-color: #88b927;
        opacity: 1!important;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
    }
    input{
        border: none;
        line-height: 40px;
        height: 40px;
        width: 100%;
        text-align: left;
    }
    input.other{
        width:55%;
    }
    td input{
        text-align: right;
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
        height: 200px;
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
    .coverContentFace{
        width: 100%;
        background-color: #fff;
        overflow-x: hidden;
        font-size: 16px;
        text-align: center;
        page-break-after: always;
        padding: 15px;
        height: 100%;
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
    .progressContainer{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        height:15px;
        width:100%;
        border:1px solid #ebeef5;
        border-radius: 15px;
        background: #ebeef5;
        margin-top:3px;
        overflow: hidden;
    }
    .progressContainer>div{
        text-align: left;
        padding-left:3px;
    }
    .progressContainer>div.progress{
        border-radius: 15px;
        height:100%;
        text-align: center;
        line-height: 15px;
    }
    .disableBtn{
        color: #cccccc !important;
        background: #fff !important;
        border-color: #ccc !important;
        cursor: not-allowed !important;
    }
</style>
<style>
    .timeSelect .bolderFont{
        font-weight: bolder;
    }
    .timeSelect .orangeFont{
        color: #ff7f00;
        /*cursor: default;*/
    }
    .timeSelect .greyFont{
        color: #ccc;
        /*cursor: default;*/
    }
    .timeSelect .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        color: #00b8ee;
    }
    .timeSelect is-red-node{
        color: red;
    }
</style>
