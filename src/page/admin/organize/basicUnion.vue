<template>
    <div class="manageContent">
        <div style="overflow: hidden;height:100%;">
            <div class="unionStateCon">
                <i @click.stop="unionMove(false)" class="el-icon-d-arrow-left" ></i>
                <div class="unionState " style="height: 30px;">
                    <ul class=" handle" style="float:right">
                        <li style="float:left;margin-right:0" >
                            <div class="searcherValue" style="border-radius:4px 0 0 4px;width: 160px;display: inline-block;height: 30px; float: left">
                                <input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="组织编码/名称">
                            </div>
                            <div @click="unionSearch(isSearch)" class="searcherBtn" style="width: 60px;display: inline-block;float: left">搜索</div>

                        </li>
                        <a @click.prevent="routerTo('/admin/orgin/edit')" style="float: right">
                            <li>修改</li>
                        </a>
                        <a @click.prevent="routerTo('/admin/orgin/add')" style="float: right">
                            <li>新增</li>
                        </a>



                        <a style="float: right">
                            <li class="mode" style="width:60px;">
                                <div>更多</div>
                                <div @click="deleteClick">删除</div>
                                <div @click="useClick">启用</div>
                                <div @click="noUseClick">停用</div>
                                <!--<div @click="chooseAllList">全选</div>-->
                                <!--<div @click="noChooseAllList">反选</div>-->
                                <div @click="onloadOrg">导入</div>
                                <div @click="downloadOrg">导出</div>
                                <div @click="belongTrade">所属行业</div>
                                <div @click="extractOrg">提取工会</div>
                            </li>
                            <!--<li>更多</li>-->
                        </a>
                    </ul>
                    <ul class="selectHandle" >
                        <li style="float:left;min-width: 130px;position: relative;z-index: 0">
                            <div style="min-width: 130px" class="selectContainer">
                                <select v-model="searchUnion" @change="unionSearch">
                                    <!--<option v-for="item in searchUnionValues" :key="item.id" :value="item.id">{{item.name}}-->
                                    <!--</option>-->
                                    <option value="">剔除条件</option>
                                    <option value="1">剔除系统内置工会</option>
                                    <option value="2">剔除新增工会</option>
                                </select>
                            </div>
                        </li>
                        <li style="float:left;min-width: 200px">
                            <div class="areaIn" @click="getAddress">
                                <div style="width: 15%;float:left;text-align: right;">地区：</div>
                                <div :title="unionName" style="padding-right:15px;float:right;width:85%;border-bottom: 1px solid rgb(136, 185, 39);min-width: 160px;overflow: hidden;white-space:nowrap;text-overflow: ellipsis;">&nbsp{{unionName}}</div>
                                <span v-if="unionName.length>0" @click.stop="clearArea" class="el-icon-circle-close" ></span>
                            </div>

                            <!--<div class="selectContainer">-->
                            <!--<select v-model="unionName">-->
                            <!--<option value="">全部</option>-->
                            <!--<option v-for="item in unionNameValues" :key="item.PhId" :value="item.PhId">{{item.OrgName}}-->
                            <!--</option>-->
                            <!--</select>-->
                            <!--</div>                        -->

                        </li>
                        <li class="flexPublic datepick" style="float:left;min-width:295px;">
                            <div style="width: 60px;">服务期限:</div>
                            <!--<div class="block">-->
                            <!--<el-date-picker-->
                            <!--v-model="date1"-->
                            <!--type="date"-->
                            <!--placeholder="选择日期"-->
                            <!--value-format="yyyy-MM-dd">-->
                            <!--</el-date-picker>-->
                            <!--</div>-->

                            <el-date-picker
                                v-model="state_time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                size="small"
                                style="width: 250px;height: 30px;"
                                @change="unionSearch">
                            </el-date-picker>


                        </li>
                        <li  style="float:left;min-width: 95px">
                            <div style="float:left;line-height: 30px;width:40px">状态:</div>
                            <div style="float:left" class="" >
                                <el-select name="phoneHead" v-model="unionState" @change="unionSearch" style="width: 90px">
                                    <el-option v-for="item in unionStateValues" :value="item.id" :key="item.id" :label="item.name">{{item.name}}
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li  style="float:left;min-width: 95px">
                            <div style="float:left;line-height: 30px;width:65px">所属行业:</div>
                            <div style="float:left" class="" >
                                <el-select v-model="IndustryType" multiple collapse-tags style="width:230px" class="select-trade" @change="changeTrade()" @clear="clearTrade()">
                                    <el-option  v-for="item in tradeData" :value="item.Code" :key="item.Code" :label="item.Value"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li style="float:left;min-width: 170px">
                            <div style="float:left;line-height: 30px">距离到期</div>
                            <div style="float:left">
                                <i @click="endDatenext(false)" style="color:#ff0000;font-size: 18px;cursor: pointer;" class="el-icon-remove"></i>
                                <div style="display: inline-block;width:60px" class="inputContainer">
                                    <input type="text" v-model="endDate" @blur="ajaxMode">
                                </div>
                                <i @click="endDatenext(true)" style="color:#88b927;font-size: 18px;cursor: pointer;" class="el-icon-circle-plus"></i>
                            </div>
                        </li>

                    </ul>
                </div>
                <i @click.stop="unionMove(true)" class="el-icon-d-arrow-right" ></i>
            </div>

            <div class="formData" style="font-size:18px">
                <ul>
                    <li style="margin-right: -2px"><el-checkbox  v-model="listAll"></el-checkbox></li>
                    <li style="margin-right: 1px">序号</li>
                    <li>组织编码</li>
                    <li>组织名称</li>
                    <li>工会编码</li>
                    <li>单位所属行业</li>
                    <li class="zhangtao">
                        <div>账套</div>
                        <div class="flexPublic">
                            <span>启账日期</span>
                            <span>管理员</span>
                            <span>联系电话</span>
                        </div>
                    </li>
                    <li>启用/停用</li>
                    <li>服务期限</li>
                </ul>
                <div class="hideScroll">

                </div>

                <ul class="formDataItems" style="overflow-y: scroll;position: absolute;left: 20px;right: 4px;bottom: 50px;top: 140px;">
                    <li :class="{userInfoCss:userInfoCssList[index].checked}" @click="chooseOn(index,item, $event)"
                        v-for="(item,index) of userInfo" :key="index">
                        <ul class="formDataItem flexPublic">
                            <li><el-checkbox @change="changeOn(index,item)"  v-model="item.checked"></el-checkbox></li>
                            <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                            <li :style="{'text-align': 'left','text-indent':item.Layers+'em'}" :title="item.EnCode">{{item.EnCode}}</li>
                            <li :title="item.OrgName">{{item.OrgName}}</li>
                            <li>{{item.UserAccount}}</li>
                            <li>{{item.IndustryName}}</li>
<!--                            <li>{{item.ParentName}}</li>-->
                            <li>{{item.JBuildDate}}</li>
                                                        <li>{{item.AdminName}}</li>
                            <li>{{item.TelePhone}}</li>
                            <li class="stateControl flexPublic">
                                <label><input :name="item.uid" type="radio" value="0" v-model="item.EnabledMark"
                                              @click="changeEnable(item.PhId, item.EnabledMark)">启用</label>
                                <label><input :name="item.uid" type="radio" value="1" v-model="item.EnabledMark"
                                              @click="changeEnable(item.PhId, item.EnabledMark)">停用</label>
                            </li>
                            <li :title="item.ServiceStartTime.substr(0, 10)+'-'+item.ServiceEndTime.substr(0,10)">{{item.ServiceStartTime.substr(0, 10)}}-{{item.ServiceEndTime.substr(0,10)}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div style="position: absolute;bottom:10px;right:30px">
                <el-pagination
                    background
                    @size-change="ajaxMode"
                    @current-change="ajaxMode"
                    :current-page.sync="pageIndex"
                    :page-sizes="[10,20, 30, 50, 70,100]"
                    :page-size.sync="pageSize"
                    layout="sizes, prev, pager, next"
                    :total="totalRows">
                </el-pagination>
            </div>
            <!--        <div class="formDataPages" style="position: absolute;right: 0;bottom: 10px;">
                        <div class="flexPublic">
                            <div>每页显示</div>
                            <div class="selectContainer flexPublic">
                                <select name="" @change="pageSizeSelect" v-model="pageSize">
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                            <div>条</div>
                            <div class="pagesContainer">
                                <ul class="flexPublic">
                                    <li :class="{pageDisabled:!(this.pageIndex!=1)}" @click.stop="newPage('pre')">
                                        上一页
                                    </li>
                                    <li :class="{pageActive:pageCssActive==index}" @click.stop="newPage(index)" :key="index"
                                        v-for="(item,index) of pageCount">{{item}}
                                    </li>
                                    <li :class="{pageDisabled:!(this.pageIndex%this.pageCount!=0&&this.pageIndex!=this.pageCount)}"
                                        @click.stop="newPage('next')">下一页
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>-->
        </div>
        <!--eldialog渲染很卡-->
        <div class="organizeParentCon" v-if="chooseUnionOrg"  style="z-index:99">
            <div class="organizeParent2" >
                <div class="organizeParentNow">
                    <p style="padding-left:40px;height:50px;line-height: 50px;font-size: 20px;border-bottom:1px solid #ccc;text-align:center;background:#00B8EE;border-radius: 10px 10px 0 0;color:#fff">提取工会选择 <i @click.stop="chooseUnionOrg = false" style="float:right;cursor:pointer;margin: 15px 20px 0 0;font-size: 20px" class="el-icon-close"></i></p>
                    <div style=" margin-top: -2px;height: 300px;overflow: hidden">
                        <!--<div class="promptW" style="border: 1px solid #909399;margin:20px 20px 0 20px; text-align: center; height: 40px;line-height: 40px">
                            <span>选取您要提取的组织所对应的地区</span>
                        </div>-->
                        <template>
                            <el-tabs v-model="activeName" @tab-click="handleClick" :tab-position="tabPosition">
                                <el-tab-pane label="省级" name="first">
                                    <div style="float: left; width: 107%; height: 100%;">
                                        <el-table :data="tableData"
                                                  border
                                                  :extraheight='extraheight'
                                                  :height="tableHeight"
                                                  class="table"
                                                  v-loading="loading1"
                                                  ref="multipleTable"
                                                  highlight-current-row
                                                  :header-cell-style="{background:'#d3e9f9',color:'#000'}"
                                                  @row-click="handleClickRow"
                                                  @selection-change="handleSelectionChange">
                                            <template :class="{userInfoCss:userInfoCssList[scope.row.index].checked}">
                                                <el-table-column type="selection" width="80" align="center"></el-table-column>
                                                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                                                <el-table-column prop="label" label="全选" class="allChooseSty"></el-table-column>
                                            </template>
                                        </el-table>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="市级" name="second">
                                    <div style="float: left; width: 107%; height: 100%;">
                                        <el-table :data="tableData2"
                                                  border
                                                  :extraheight='extraheight'
                                                  :height="tableHeight"
                                                  class="table"
                                                  v-loading="loading2"
                                                  ref="multipleTable2"
                                                  highlight-current-row
                                                  :header-cell-style="{background:'#d3e9f9',color:'#000'}"
                                                  @row-click="handleClickRow2"
                                                  @selection-change="handleSelectionChange2">
                                            <template :class="{userInfoCss:userInfoCssList[scope.row.index].checked}">
                                                <el-table-column type="selection" width="80" align="center"></el-table-column>
                                                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                                                <el-table-column prop="label" label="全选" class="allChooseSty"></el-table-column>
                                            </template>
                                        </el-table>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="区级" name="third">
                                    <div style="float: left; width: 107%; height: 100%;">
                                        <el-table :data="tableData3"
                                                  border
                                                  :extraheight='extraheight'
                                                  :height="tableHeight"
                                                  class="table"
                                                  v-loading="loading3"
                                                  ref="multipleTable3"
                                                  highlight-current-row
                                                  :header-cell-style="{background:'#d3e9f9',color:'#000'}"
                                                  @row-click="handleClickRow3"
                                                  @selection-change="handleSelectionChange3">
                                            <template :class="{userInfoCss:userInfoCssList[scope.row.index].checked}">
                                                <el-table-column type="selection" width="80" align="center"></el-table-column>
                                                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                                                <el-table-column prop="label" label="全选" class="allChooseSty"></el-table-column>
                                            </template>
                                        </el-table>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="街道" name="fourth">
                                    <div style="float: left; width: 107%; height: 100%;">
                                        <el-table :data="tableData4"
                                                  border
                                                  :extraheight='extraheight'
                                                  :height="tableHeight"
                                                  class="table"
                                                  v-loading="loading4"
                                                  ref="multipleTable4"
                                                  highlight-current-row
                                                  :header-cell-style="{background:'#d3e9f9',color:'#000'}"
                                                  @row-click="handleClickRow4"
                                                  @selection-change="handleSelectionChange4">
                                            <template :class="{userInfoCss:userInfoCssList[scope.row.index].checked}">
                                                <el-table-column type="selection" width="80" align="center"></el-table-column>
                                                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                                                <el-table-column prop="label" label="全选" class="allChooseSty"></el-table-column>
                                            </template>
                                        </el-table>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </template>
                        <!--<div style="width: 100%; height: 10px;">-->
                        <!--<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">省</div>-->
                        <!--<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">市</div>-->
                        <!--<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">区</div>-->
                        <!--<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">街道</div>-->
                        <!--</div>-->
                        <!--<div>
                            <div style="width: 100%; height: 10px;">
                                <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px; ">
                                    <div style="float:left;width:50%">
                                        <el-checkbox style="" @change="getAllList(1)" >
                                            全选
                                        </el-checkbox>
                                    </div>
                                    <div style="cursor:pointer;width: 50%;float:right;background:#00B8EE;">
                                        省级
                                    </div>
                                </div>
                                <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">
                                    <div style="float:left;width:50%">
                                        <el-checkbox style="" @change="getAllList(2)">
                                            全选
                                        </el-checkbox>
                                    </div>
                                    <div style="cursor:pointer;width: 50%;float:right;background:#00B8EE;" @click="getOrgCityList(1)">
                                        市级
                                    </div>
                                </div>
                                <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">
                                    <div style="float:left;width:50%">
                                        <el-checkbox style="" @change="getAllList(3)">
                                            全选
                                        </el-checkbox>
                                    </div>
                                    <div style="cursor:pointer;width: 50%;float:right;background:#00B8EE;" @click="getOrgCityList(2)">
                                        区级
                                    </div>
                                </div>
                                <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">
                                    <div style="float:left;width:50%">
                                        <el-checkbox style="" @change="getAllList(4)">
                                            全选
                                        </el-checkbox>
                                    </div>
                                    <div style="cursor:pointer;width: 50%;float:right;background:#00B8EE;" @click="getOrgCityList(3)">
                                        街道
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style="width:20%;margin:0 20px 20px;border:1px solid #ccc;border-top:0;height: 200px;overflow-y: scroll;text-align: center;float:left;" class="addressStyle">
                                    <ul>
                                        <li class="ParantOrgListW" :class="{ParantOrgListFontColor:item.giveFlam =='0',AllProStyle:allPro}" v-for="item in ParantOrgList" style="height: 25px;line-height: 25px;font-size: 15px;text-align: left;padding-left:40px;overflow-x:auto" @click.stop="changeParentOrgTwo(item,$event,1)">{{item.label}}</li>
                                    </ul>
                                </div>
                                <div style="width:19%;margin:0 20px 20px;border:1px solid #ccc;border-top:0;height: 200px;overflow-y: scroll;text-align: center;float:left;" class="addressStyle">
                                    <ul>
                                        <li class="ParantOrgListW" :class="{ParantOrgListFontColor:item.giveFlam =='0',AllProStyle:allCity}" v-for="item in ParantOrgCityList" style="height: 25px;line-height: 25px;font-size: 15px;text-align: left;padding-left:40px;overflow-x:auto" @click.stop="changeParentOrgTwo(item,$event,2)">{{item.label}}</li>
                                    </ul>
                                </div>
                                <div style="width:19%;margin:0 20px 20px;border:1px solid #ccc;border-top:0;height: 200px;overflow-y: scroll;text-align: center;float:left;" class="addressStyle">
                                    <ul>
                                        <li class="ParantOrgListW" :class="{ParantOrgListFontColor:item.giveFlam =='0',AllProStyle:allCou}" v-for="item in ParantOrgCountList" style="height: 25px;line-height: 25px;font-size: 15px;text-align: left;padding-left:40px;overflow-x:auto" @click.stop="changeParentOrgTwo(item,$event,3)">{{item.label}}</li>
                                    </ul>
                                </div>
                                <div style="width:19%;margin:0 20px 20px;border:1px solid #ccc;border-top:0;height: 200px;overflow-y: scroll;text-align: center;float:left;" class="addressStyle">
                                    <ul>
                                        <li class="ParantOrgListW" :class="{ParantOrgListFontColor:item.giveFlam =='0',AllProStyle:allStr}" v-for="item in ParantOrgStreetList" style="height: 25px;line-height: 25px;font-size: 15px;text-align: left;padding-left:40px;overflow-x:auto" @click.stop="changeParentOrgTwo(item,$event,4)">{{item.label}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>-->
                    </div>
                </div>
                <div style="margin:0px auto;width:280px; height:35px;">
                    <!--<el-button @click.stop="chooseUnionOrg = false" style="color: #00B8EE; border-color: #00B8EE;height:35px;">取 消</el-button>-->
                    <el-button  style="color: #00B8EE; border-color: #00B8EE;height:35px;border: none" :disabled="lastStep"  @click.stop="lastStepOrg">上一步</el-button>
                    <el-button  style="color: #00B8EE; border-color: #00B8EE;height:35px;border: none" :disabled="nextStep" @click.stop="nextStepOrg">下一步</el-button>
                    <el-button style="color: #00B8EE; border-color: #00B8EE;height:35px;border: none" @click.stop="saveExtractOrg">提 取</el-button>
                </div>
            </div>
        </div>

        <!--初始化时提取某地区下的所有系统组织-->
        <!--<el-dialog :title="'提取工会选择'" class="organizeParent" :visible.sync="chooseUnionOrg" width="550px" style="height: 800px">
            <div class="organizeParentNow">
                <div style="border: 1px solid #909399; margin-top: 10px;height: 270px;overflow: hidden">
                    <div class="promptW" style="border-bottom: 1px solid #909399; text-align: center; height: 40px;line-height: 40px">
                        <span>选取您要提取的组织所对应的省份</span>
                    </div>
                    &lt;!&ndash;<div style="width: 100%; height: 10px;">&ndash;&gt;
                        &lt;!&ndash;<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">省</div>&ndash;&gt;
                        &lt;!&ndash;<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">市</div>&ndash;&gt;
                        &lt;!&ndash;<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">区</div>&ndash;&gt;
                        &lt;!&ndash;<div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">街道</div>&ndash;&gt;
                    &lt;!&ndash;</div>&ndash;&gt;
                    <div  style="margin-top: 10px;height: 200px;overflow-y: scroll;text-align: center;width: 110%; " class="addressStyle">
                        <ul>
                            <li class="ParantOrgListW" :class="{ParantOrgListFontColor:item.giveFlam =='0'}"  v-for="item in ParantOrgList" style="height: 25px;line-height: 25px;font-size: 15px;text-align: left;padding-left:40px" @click.stop="changeParentOrgTwo(item,$event)">{{item.label}}</li>
                        </ul>
                        &lt;!&ndash;<div style="width: 25%; float: left">&ndash;&gt;
                            &lt;!&ndash;<el-select v-model="ProvinceTwo" placeholder="请选择" filterable style="width: 95%" @change="changeProvinceTwo">&ndash;&gt;
                                &lt;!&ndash;<el-option&ndash;&gt;
                                    &lt;!&ndash;v-for="item in ProvinceList"&ndash;&gt;
                                    &lt;!&ndash;:key="item.value"&ndash;&gt;
                                    &lt;!&ndash;:label="item.label"&ndash;&gt;
                                    &lt;!&ndash;:value="item">&ndash;&gt;
                                &lt;!&ndash;</el-option>&ndash;&gt;
                            &lt;!&ndash;</el-select>&ndash;&gt;
                        &lt;!&ndash;</div>&ndash;&gt;
                        &lt;!&ndash;<div style="width: 25%; float: left;">&ndash;&gt;
                            &lt;!&ndash;&lt;!&ndash;<span>省</span>&ndash;&gt;&ndash;&gt;
                            &lt;!&ndash;<el-select v-model="CityTwo" placeholder="请选择" filterable style="width: 95%" @change="changeCityTwo">&ndash;&gt;
                                &lt;!&ndash;<el-option&ndash;&gt;
                                    &lt;!&ndash;v-for="item in CityList"&ndash;&gt;
                                    &lt;!&ndash;:key="item.value"&ndash;&gt;
                                    &lt;!&ndash;:label="item.label"&ndash;&gt;
                                    &lt;!&ndash;:value="item">&ndash;&gt;
                                &lt;!&ndash;</el-option>&ndash;&gt;
                            &lt;!&ndash;</el-select>&ndash;&gt;
                        &lt;!&ndash;</div>&ndash;&gt;
                        &lt;!&ndash;<div style="width: 25%; float: left;">&ndash;&gt;
                            &lt;!&ndash;&lt;!&ndash;<span>市</span>&ndash;&gt;&ndash;&gt;
                            &lt;!&ndash;<el-select v-model="CountyTwo" placeholder="请选择" filterable style="width: 95%" @change="changeCountyTwo">&ndash;&gt;
                                &lt;!&ndash;<el-option&ndash;&gt;
                                    &lt;!&ndash;v-for="item in CountyList"&ndash;&gt;
                                    &lt;!&ndash;:key="item.value"&ndash;&gt;
                                    &lt;!&ndash;:label="item.label"&ndash;&gt;
                                    &lt;!&ndash;:value="item">&ndash;&gt;
                                &lt;!&ndash;</el-option>&ndash;&gt;
                            &lt;!&ndash;</el-select>&ndash;&gt;
                        &lt;!&ndash;</div>&ndash;&gt;
                        &lt;!&ndash;<div style="width: 25%; float: left;">&ndash;&gt;
                            &lt;!&ndash;&lt;!&ndash;<span>区</span>&ndash;&gt;&ndash;&gt;
                            &lt;!&ndash;<el-select v-model="StreetTwo" placeholder="请选择" filterable style="width: 95%" @change="changeStreetTwo">&ndash;&gt;
                                &lt;!&ndash;<el-option&ndash;&gt;
                                    &lt;!&ndash;v-for="item in StreetList"&ndash;&gt;
                                    &lt;!&ndash;:key="item.value"&ndash;&gt;
                                    &lt;!&ndash;:label="item.label"&ndash;&gt;
                                    &lt;!&ndash;:value="item">&ndash;&gt;
                                &lt;!&ndash;</el-option>&ndash;&gt;
                            &lt;!&ndash;</el-select>&ndash;&gt;
                        &lt;!&ndash;</div>&ndash;&gt;
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="chooseUnionOrg = false">取 消</el-button>
                <el-button type="primary" @click.stop="saveExtractOrg">提 取</el-button>
            </span>
        </el-dialog>
        地区选择-->
        <el-dialog :title="'地区选择'" class="organizeParent" :visible.sync="chooseAddress" width="550px" style="height: 800px">
            <div class="organizeParentNow">
                <div style="border: 1px solid #909399; margin-top: 10px;height: 270px;overflow: hidden">
                    <div class="promptW" style="border-bottom: 1px solid #909399; text-align: center; height: 40px;line-height: 40px">
                        <span>选取您要搜索的地区</span>
                    </div>
                    <div style="width: 100%; height: 10px;">
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">省</div>
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">市</div>
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">区</div>
                        <div style="float: left; width: 25%; height: 40px; text-align: center; line-height: 40px; font-size: 14px;">街道</div>
                    </div>
                    <div  style="margin-top: 10px;height: 200px;overflow-y: scroll;text-align: center;width: 110%; " class="addressStyle">
                        <div style="width: 23%; float: left">
                            <el-select v-model="ProvinceTwo" placeholder="请选择" filterable style="width: 95%" @change="changeProvinceTwo">
                                <el-option
                                    v-for="item in ProvinceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="width: 23%; float: left;">
                            <!--<span>省</span>-->
                            <el-select v-model="CityTwo" placeholder="请选择" filterable style="width: 95%" @change="changeCityTwo">
                                <el-option
                                    v-for="item in CityList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="width: 23%; float: left;">
                            <!--<span>市</span>-->
                            <el-select v-model="CountyTwo" placeholder="请选择" filterable style="width: 95%" @change="changeCountyTwo">
                                <el-option
                                    v-for="item in CountyList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="width: 23%; float: left;">
                            <!--<span>区</span>-->
                            <el-select v-model="StreetTwo" placeholder="请选择" filterable style="width: 95%" @change="changeStreetTwo">
                                <el-option
                                    v-for="item in StreetList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="chooseAddress = false" style="color: #00B8EE; border-color: #00B8EE;">取 消</el-button>
                <el-button type="primary" @click="clearAddress">清 空</el-button>
                <el-button type="primary" @click="saveAddress">确 定</el-button>
            </span>
        </el-dialog>
        <!--模板下载选择-->
        <!-- <div class="cover" :style="{'display':(showReportMsg.flag?'block':'none'),'z-index':'999'}">
             <div class="coverContent">
                 <div class="flexPublic">
                     <p>模板下载</p>
                     <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.flag=false"></i>
                 </div>
                 <div>
                     是否下载组织导入模板？<p style="color: red">(除添加组织外，请勿随意操作表格提示内容以及表格布局)</p>
                     <el-checkbox v-model="showReportMsg.show" style="margin-top: 25px">本次登录不再显示该弹窗</el-checkbox>
                 </div>
                 <ul class="flexPublic handle">
                     <li style='margin:0 0 0px 20px;cursor: pointer' @click="loadExcel">下载</li>
                     <li style='margin:0 0 0px 20px;cursor: pointer' @click="showLoad">跳过</li>
                 </ul>
             </div>
         </div>-->
        <!--文件上传-->
        <div class="cover" :style="{'display':(showReportMsg.loadFlag?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30%;">
                <div class="flexPublic">
                    <p>选择文件</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.loadFlag=false;"></i>
                </div>
                <div style="text-align: center">
                    <el-upload
                        ref="piclist"
                        drag
                        action=""
                        :limit="1"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUploadPic"
                        :http-request='uploadFileMethod'>
                        <i class="el-icon-upload"></i>

                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传{{'Excel'}}文件</div>

                    </el-upload>
                    <div class="button" style='cursor: pointer;width: 110px;padding: 0;margin-top:10px' @click="loadExcel">下载导入模板</div>
                </div>
            </div>
        </div>
        <!--文件上传成功，数据库导入-->
        <div class="cover" :style="{'display':(showReportMsg.loadFlagSecond?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30%;">
                <div class="flexPublic">
                    <p>批量导入</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.loadFlagSecond=false"></i>
                </div>
                <div>
                    <div style="color: #02a7e7;border: none;">
                        {{showReportMsg.loadFlagSecondMsg}}
                    </div>
                    <div style="margin-top: 15px;padding:0 ">是否跳过重复数据，继续批量导入？</div>
                </div>
                <ul class="flexPublic handle" style="margin-bottom: 20px">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="clearFile">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="updateFile">导入</li>
                </ul>
            </div>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒  默认4000 -->
        <message
            :message="message.message"
            :visible.sync="message.visible"
            @close="closeMsg()">
        </message>
        <!--单位所属行业选择-->
        <el-dialog :title="'单位所属行业选择'" class="organizeParent" :visible.sync="chooseTrade" width="450px">
            <div style="height: 500px;padding: 0 20px">
                <trade @getTrade="getTrade" @closeBtn="closeTrade" :data="tradeData" :default-value="defaultTradeValue" ></trade>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    import { mapState, mapActions } from "vuex";
    import axios from "axios";
    import qs from 'qs';
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import treeTable from "@/components/tree-table/indexHeight";
    import Trade from "../../../components/trade/trade";
    export default {
        name: "basicUnion",
        components: {Trade, treeTable },
        data() {
            return {
                loading1: false,
                loading2: false,
                loading3: false,
                loading4: false,
                lastStep:true,
                nextStep:false,
                tableHeight:290,
                extraheight:290,
                tabPosition: 'left',
                activeName: 'first',
                allPro:false,//省份全选
                allCity:false,//市级全选
                allCou: false,//区级全选
                allStr: false,//街道全选
                provinceGiveList:[],//提取工会时选取多个省
                cityGiveList:[],//提取工会时选取多个市
                countGiveList:[],//提取工会时选取多个区
                streetGiveList:[],//提取工会时选取多个街道
                qIsSystem: 0,//判断所选数据是否是内置
                isSearch:true,//是否点击搜索按钮
                endDate:'',//距离到期
                searchUnion:'',//剔除条 件
                tqProvince:[],//提取省份时，用来记录
                listAll:false,  //列表全选
                addressId:'',
                rank:'0',
                chooseAddress:false,
                ParantOrgList:[],
                qAddress:[],
                qLayerList:[],
                qLayer:'',
                ProvinceTwo:'',
                ProvinceList:[],
                CityTwo:'',
                CityList:[],
                CountyTwo:'',
                CountyList:[],
                StreetTwo:'',
                StreetList:[],
                chooseUnionOrg:false,
                allOrgList:[],
                moreShow:false,
                date1: '',
                state_time:[],
                unionSearchValue: '',
                unionState: '',
                unionName: '',
                PhIdList: [],
                PhIdLists:[],
                pageIndex: 1,
                pageSize: 20,
                pageCount: [],
                totalRows:0,
                showArrowLeft:false,//显示箭头
                showArrowRight:false,//显示箭头
                password:false,//加密上传
                unionNameValues: [
                    //{PhId: 0, OrgName: '全部'},
                    // {id: 1, name: '政云工会'},
                    // {id: 2, name: '相符工会'}
                ],
                searchUnionValues:[
                    {id: "", name: '剔除条件'},
                    {id: "1", name: '剔除系统内置工会'},
                    {id: "2", name: '剔除新增工会'}
                ],
                unionStateValues: [
                    {id: "", name: '全部'},
                    {id: "0", name: '启用'},
                    {id: "1", name: '停用'}
                ],
                userInfoCssList: [],
                userInfo: [],
                pageCssActive: '',
                pagePreDisabled: '',
                pageNextDisabled: '',
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                showReportMsg: {
                    flag: false,
                    show:false,
                    loadFlag:false,
                    loadFlagSecond:false,
                    loadFlagSecondMsg:'',
                    loadFile:{
                        name:'',
                        type:''
                    }
                },
                message:{
                    visible:false,
                    message:'修改成功',
                    delay:4000

                },
                tableData2:[],
                tableData3:[],
                tableData4:[],

                //单位所属行业
                tradeData:[],
                IndustryType:[],//所属行业编码,
                defaultTradeValue:"",
                chooseTrade:false
            }
        },
        watch:{
            listAll(bool){
                if(bool){
                    for(var vou of this.userInfo){
                        vou.checked=bool;
                    }
                    this.PhIdList =[];
                    for(var i =0;i<this.userInfo.length ;i++){
                        this.PhIdList.push(this.userInfo[i].PhId);
                    }
                    if(this.PhIdList.length == 1){
                        this.qIsSystem = this.userInfo[0].IsSystem;
                    }
                    //this.PhIdList=JSON.parse(JSON.stringify(this.userInfo));
                }else if(this.userInfo.every((val,index,arr)=>{
                    return val.checked==true;
                })){
                    this.PhIdList=[];
                    for(var vou of this.userInfo){
                        vou.checked=bool;
                    }
                }


            },
            chooseUnionOrg(val){
                console.log(val)
            }
        },
        methods: {
            ...mapActions({
                uploadFile: 'uploadFile/Excelupload'
            }),
            //
            endDatenext(bool){
                if(bool){
                    this.endDate++;
                }else if(!bool&&this.endDate>0){
                    this.endDate--;
                }
            },
            //移动导航按钮
            unionMove(bool){
                var union=document.getElementsByClassName('unionState')[0];
                var unionStateCon=document.getElementsByClassName('unionStateCon')[0];
                var pWidth=parseInt(window.getComputedStyle(unionStateCon).width);//父级宽度
                if(!parseInt(union.style.marginRight)) {
                    union.style.marginRight='0px';
                }
                if(bool){
                    if(parseInt(union.style.marginRight)>0){
                        return;
                    }else{
                        union.style.marginRight=parseInt(union.style.marginRight)+100+'px';
                    }
                }else{
                    if((1460+parseInt(union.style.marginRight)+100)<=pWidth){
                        return;
                    }else{
                        union.style.marginRight=parseInt(union.style.marginRight)-100+'px';
                    }
                }
            },
            //加密导出
            // passwordDownload(){
            //     var param={
            //         date:'',
            //         type:'',
            //         isbasic:'',
            //
            //     }
            //     let base = httpConfig.getAxiosBaseConfig();
            //     this.$axios({
            //         method: 'get',
            //         url: '/SysOrganize/GetOrganizeTxt',
            //         data: param
            //     }).then(res => {
            //         //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
            //         console.log(res);
            //         if(res.Status=="error"){
            //             this.$message({ showClose: true, message: res.Msg, type: 'error' })
            //         }else{
            //             window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
            //         }
            //         this.downloadLoading = false
            //     }).catch(err => {
            //         console.log(err)
            //     })
            // },
            //加密导入
            // passwordUpload(){
            //     this.showReportMsg.loadFlag=true;
            //     this.password=true;
            // },

            //提取工会时点击上一步
            lastStepOrg(){
                if(this.activeName == 'second'){
                    this.activeName = 'first';
                    this.lastStep = true;
                    this.nextStep = false;
                    //this.getOrgCityList(1);
                }else if(this.activeName == 'third'){
                    this.activeName = 'second';
                    this.lastStep = false;
                    this.nextStep = false;
                    //this.getOrgCityList(1);
                    //this.cityGiveList =[];
                    this.countGiveList =[];
                    this.streetGiveList =[];
                }else if(this.activeName == 'fourth'){
                    this.activeName = 'third';
                    this.lastStep = false;
                    this.nextStep = false;
                    //this.getOrgCityList(2);
                    //this.countGiveList =[];
                    this.streetGiveList =[];
                }
                this.$forceUpdate();
            },
            //提取工会时点击下一步
            nextStepOrg(){
                if(this.activeName == 'first'){
                    this.activeName = 'second';
                    this.lastStep = false;
                    this.nextStep = false;
                    this.getOrgCityList(1);
                    this.cityGiveList =[];
                    this.countGiveList =[];
                    this.streetGiveList =[];
                }else if(this.activeName == 'second'){
                    this.activeName = 'third';
                    this.lastStep = false;
                    this.nextStep = false;
                    this.getOrgCityList(2);
                    this.countGiveList =[];
                    this.streetGiveList =[];
                }else if(this.activeName == 'third'){
                    this.activeName = 'fourth';
                    this.lastStep = false;
                    this.nextStep = true;
                    this.getOrgCityList(3);
                    this.streetGiveList =[];
                }
                this.$forceUpdate();
            },
            //选择tab页
            handleClick(tab, event){
                if(tab.name == 'first'){
                    this.lastStep = true;
                    this.nextStep = false;
                }else if(tab.name == 'second'){
                    this.lastStep = false;
                    this.nextStep = false;
                    this.getOrgCityList(1);
                    this.cityGiveList =[];
                    this.countGiveList =[];
                    this.streetGiveList =[];
                }else if(tab.name == 'third'){
                    this.lastStep = false;
                    this.nextStep = false;
                    this.getOrgCityList(2);
                    this.countGiveList =[];
                    this.streetGiveList =[];
                }else if(tab.name == 'fourth'){
                    this.lastStep = false;
                    this.nextStep = true;
                    this.getOrgCityList(3);
                    this.streetGiveList =[];
                };
                console.log(tab, event);
            },
            //省级列表选择行
            handleClickRow(row){
                this.$refs.multipleTable.toggleRowSelection(row);
            },
            //选择省份
            handleSelectionChange(val){
                this.provinceGiveList =[];
                //console.log(val);
                for(var i =0; i <val.length; i++){
                    console.log(val[i]);
                    this.provinceGiveList.push(val[i].value);
                }
                //this.provinceGiveList = val;
            },
            //市级列表选择行
            handleClickRow2(row){
                this.$refs.multipleTable2.toggleRowSelection(row);
            },
            //选择市级
            handleSelectionChange2(val){
                this.cityGiveList =[];
                for(var i =0; i <val.length; i++){
                    console.log(val[i]);
                    this.cityGiveList.push(val[i].value);
                }
                //this.cityGiveList = val;
            },
            //区级列表选择行
            handleClickRow3(row){
                this.$refs.multipleTable3.toggleRowSelection(row);
            },
            //选择区级
            handleSelectionChange3(val){
                this.countGiveList =[];
                for(var i =0; i <val.length; i++){
                    console.log(val[i]);
                    this.countGiveList.push(val[i].value);
                }
                //this.countGiveList = val;
            },
            //街道列表选择行
            handleClickRow4(row){
                this.$refs.multipleTable4.toggleRowSelection(row);
            },
            //选择区级
            handleSelectionChange4(val){
                this.streetGiveList =[];
                for(var i =0; i <val.length; i++){
                    console.log(val[i]);
                    this.streetGiveList.push(val[i].value);
                }
                //this.streetGiveList = val;
            },

            //提取工会点击全选按钮
            getAllList(level){

                console.log(this.allPro);
                if(level ==1){
                    if(!this.allPro){
                        this.allPro = true;
                        for(var vou in this.ParantOrgList){
                            var index1 = this.provinceGiveList.indexOf(vou.value);
                            if(index1 > -1){
                                //this.provinceGiveList.splice(index1, 1);
                            }else{
                                this.provinceGiveList.push(vou.value);
                            }
                            var indexFlam = this.qAddress.indexOf(vou.value);
                            if(indexFlam > -1){
                            }else{
                                this.qLayerList.push(level);
                                this.qAddress.push(vou.value);
                            }
                        }
                        console.log(this.provinceGiveList);
                        console.log(this.qAddress);
                    }else{
                        this.allPro = false;
                        for(var vou in this.ParantOrgList){
                            var index1 = this.provinceGiveList.indexOf(vou.value);
                            if(index1 > -1){
                                this.provinceGiveList.splice(index1, 1);
                            }else{
                                //this.provinceGiveList.push(vou.value);
                            }
                            var indexFlam = this.qAddress.indexOf(vou.value);
                            if(indexFlam > -1){
                                this.qAddress.splice(index1, 1);
                                this.qLayerList.splice(index1, 1);
                            }else{
                                //this.qLayerList.push(level);
                                //this.qAddress.push(item.value);
                            }
                        }
                    }

                    this.$forceUpdate();
                }
            },
            //提取工会时选择地区获取列表
            getOrgCityList(i){
                var area = [];
                console.log(this.provinceGiveList);
                if(i == 1){
                    area = this.provinceGiveList;
                    this.loading2 = true;
                }else if(i == 2){
                    area = this.cityGiveList;
                    this.loading3 = true;
                }else{
                    area = this.countGiveList;
                    this.loading4 = true;
                }

                var data = {
                    uid: "0",
                    orgid: "0",
                    parames: area
                }
                this.$axios.post('/SysArea/PostAreasForGive', data)
                    .then(res => {
                        console.log(res);
                        console.log(i);
                        if(i == 0){
                            //this.ParantOrgList = res;
                            //this.ProvinceList = res;
                        }else if(i == 1){
                            this.loading2 = false;
                            this.tableData2 =[];
                            this.tableData2 = res;
                            //this.ParantOrgCityList = res;
                            //this.cityGiveList =[];
                            //this.ParantOrgCountList =[];
                            //this.countGiveList=[];
                            //this.ParantOrgStreetList =[];
                            //this.streetGiveList =[];
                        }else if(i == 2){
                            this.loading3 = false;
                            this.tableData3 =[];
                            this.tableData3= res;
                            //this.ParantOrgCountList = res;
                            //this.countGiveList=[];
                            //this.ParantOrgStreetList =[];
                            //this.streetGiveList =[];
                        }else if(i == 3){
                            this.loading4 = false;
                            this.tableData4 =[];
                            this.tableData4= res;
                            //this.ParantOrgStreetList = res;
                            //this.streetGiveList =[];
                        }
                        this.$forceUpdate();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //清空地址选择器
            clearAddress(){
                this.ProvinceTwo = '',
                    this.CityTwo = '';
                this.CountyTwo = '';
                this.StreetTwo= '';
                this.CityList =[];
                this.CountyList = [];
                this.StreetList = [];
                this.unionName = '';
                this.addressId = '';
            },
            //确定地址的选择
            saveAddress(){
                //console.log(this.StreetTwo);
                if(this.ProvinceTwo != ''){
                    this.unionName = this.ProvinceTwo.label;
                    this.addressId = this.ProvinceTwo.value;
                    this.rank = '1';
                }
                if(this.CityTwo != ''){
                    this.unionName = this.ProvinceTwo.label + "/"+ this.CityTwo.label;
                    this.addressId = this.CityTwo.value;
                    this.rank = '2';
                }
                if(this.CountyTwo != ''){
                    this.unionName = this.ProvinceTwo.label + "/"+ this.CityTwo.label + "/"+ this.CountyTwo.label;
                    this.addressId = this.CountyTwo.value;
                    this.rank = '3';
                }
                if(this.StreetTwo != ''){
                    this.unionName = this.ProvinceTwo.label + "/"+ this.CityTwo.label + "/"+ this.CountyTwo.label + "/"+this.StreetTwo.label;
                    this.addressId = this.StreetTwo.value;
                    this.rank = '4';
                }
                //this.unionName = this.ProvinceTwo.label + "/"+ this.CityTwo.label + "/"+ this.CountyTwo.label + "/"+this.StreetTwo.label;
                //console.log(this.unionName);
                this.chooseAddress = false;
                this.unionSearch(this.isSearch);
            },
            //搜索组织时的地区的选择
            getAddress(){
                this.chooseAddress = true;
            },
            //搜索下级地区信息
            selectAreaTwo(Area,i){
                var data = {
                    uid: "0",
                    orgid: "0",
                    id: Area
                }
                this.$axios.get('/SysArea/GetAreaList', {params: data})
                    .then(res => {
                        if(i == 0){
                            //this.ParantOrgList = res;
                            this.ProvinceList = res;
                        }else if(i == 1){
                            this.CityList = res;
                        }else if(i == 2){
                            this.CountyList = res;
                        }else if(i == 3){
                            this.StreetList = res;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //搜索下级地区信息
            selectAreaThree(Area,i){
                var data = {
                    uid: "0",
                    orgid: "0",
                    id: Area
                }
                this.$axios.get('/SysArea/GetAreaListForGive', {params: data})
                    .then(res => {
                        //console.log(res);
                        //this.ParantOrgList = res;
                        this.tableData = res;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //提取工会选择省份
            changeParentOrgTwo(item,event, level){
                /*if(item.giveFlam == '0'){
                    return;
                }*/

                if(level == 1){
                    var index1 = this.provinceGiveList.indexOf(item.value);
                    if(index1 > -1){
                        this.provinceGiveList.splice(index1, 1);
                    }else{
                        this.provinceGiveList.push(item.value);
                    }
                }
                if(level == 2){
                    var index2 = this.cityGiveList.indexOf(item.value);
                    if(index2 > -1){
                        this.cityGiveList.splice(index2, 1);
                    }else{
                        this.cityGiveList.push(item.value);
                    }
                }
                if(level == 3){
                    var index3 = this.countGiveList.indexOf(item.value);
                    if(index3 > -1){
                        this.countGiveList.splice(index3, 1);
                    }else{
                        this.countGiveList.push(item.value);
                    }
                }
                if(level == 4){
                    var index4 = this.streetGiveList.indexOf(item.value);
                    if(index4 > -1){
                        this.streetGiveList.splice(index4, 1);
                    }else{
                        this.streetGiveList.push(item.value);
                    }
                }
                var indexFlam = this.qAddress.indexOf(item.value);
                if(indexFlam > -1){
                    this.qAddress.splice(indexFlam, 1);
                    this.qLayerList.splice(indexFlam, 1);
                    this.qLayer = 1;
                    event.target.style.background="#fff";
                }else{
                    event.target.style.background="#ccc";
                    this.qLayer = 1;
                    this.qLayerList.push(level);
                    this.qAddress.push(item.value);
                }
                this.$forceUpdate();
                console.log(item);
            },
            //改变省级
            changeProvinceTwo(){
                this.CityTwo = '';
                this.CountyTwo = '';
                this.StreetTwo= '';
                this.CityList =[];
                this.CountyList = [];
                this.StreetList = [];
                this.selectAreaTwo(this.ProvinceTwo.value, 1);
                // this.qAddress=this.ProvinceTwo.value;
                // this.qLayer=1;
                //this.addressId = this.ProvinceTwo.value;
                // this.unionName = this.ProvinceTwo.label;
            },
            //改变市级
            changeCityTwo(){
                this.CountyTwo = '';
                this.StreetTwo = '';
                this.CountyList = [];
                this.StreetList = [];
                this.selectAreaTwo(this.CityTwo.value, 2);
                // this.qAddress=this.CityTwo.value;
                // this.qLayer=2;
                // this.addressId = this.CityTwo.value;
                // this.unionName = this.ProvinceTwo.label + "/"+ this.CityTwo.label;
            },
            //改变区级
            changeCountyTwo(){
                this.StreetTwo = '';
                this.StreetList = [];
                this.selectAreaTwo(this.CountyTwo.value, 3);
                // this.qAddress=this.CountyTwo.value;
                // this.qLayer=3;
                // this.addressId = this.CountyTwo.value;
                //this.unionName = this.ProvinceTwo.label + "/"+ this.CityTwo.label + "/"+ this.CountyTwo.label;
            },
            //改变街道
            changeStreetTwo(){
                // this.qAddress=this.StreetTwo.value;
                // this.qLayer=4;
                // this.addressId = this.StreetTwo.value;
                //this.unionName = this.ProvinceTwo.label + "/"+ this.CityTwo.label + "/"+ this.CountyTwo.label + "/"+this.StreetTwo.label;
            },
            //提取地区下的机关工会
            extractOrg(){
                this.activeName = 'first';
                this.lastStep = true;
                this.nextStep = false;
                this.provinceGiveList=[];
                this.ParantOrgCityList=[];
                this.cityGiveList=[];
                this.ParantOrgCountList =[];
                this.countGiveList=[];
                this.ParantOrgStreetList=[];
                this.streetGiveList=[];
                this.qAddress=[];
                this.qLayerList =[];
                this.chooseUnionOrg = true;

            },
            //保存提取的组织
            saveExtractOrg(){
                var page =[];
                var i =0;
                for(i = 0; i < this.provinceGiveList.length; i++){
                    page.push({encode:this.provinceGiveList[i],layers: 1})
                }
                for(i = 0; i < this.cityGiveList.length; i++){
                    page.push({encode:this.cityGiveList[i],layers: 2})
                }
                for(i = 0; i < this.countGiveList.length; i++){
                    page.push({encode:this.countGiveList[i],layers: 3})
                }
                for(i = 0; i < this.streetGiveList.length; i++){
                    page.push({encode:this.streetGiveList[i],layers: 4})
                }
                //console.log(page);
                var data={
                    uid: '',
                    orgid: '',
                    infoData: page,
                    value:this.dbname
                };
                this.$axios
                    .post("/SysOrganize/PostOrganizeRecordInsert", data)
                    .then(res => {
                        // console.log(this.form);
                        // let resultData = res;
                        // this.tableData.splice(this.idx, 1);
                        if (res.Status == 'success') {
                            this.$message.success("提取成功");
                            this.selectAreaThree(0,0);
                            this.chooseUnionOrg = false;
                        } else if(res.Status == 'error') {
                            this.$message.error(res.Msg);
                        }
                        //this.singleSelection = [];
                        this.ajaxMode();
                    });
            },
            //点击更多按钮
            theMore(){
                if(this.moreShow){
                    this.moreShow = false;
                }else{
                    this.moreShow = true;
                }
            },
            //获取隶属工会列表
            selectUnionName(){
                var data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                }
                this.$axios.get('/SysAdminOrganize/GetAllAdminOrganizeByStreet', {params: data})
                    .then(res => {
                        this.unionNameValues = res;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //删除按钮
            deleteClick(){
                if(this.PhIdList == [] || this.PhIdList.length <1){
                    this.$message.error('请选择要删除的组织!');
                    return;
                }
                var data = {
                    parames: this.PhIdList,
                    value:'0'
                };
                this.$confirm("此操作将删除该组织，以及该组织相关的所有信息，一经删除无法恢复数据, 是否继续?", "删除提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$axios
                            .post("/SysOrganize/PostDeleteOrganizeList", data)
                            .then(res => {
                                console.log(res);
                                // let resultData = res;
                                // this.tableData.splice(this.idx, 1);
                                if (res.Status == 'success') {
                                    this.$message.success("删除成功");
                                } else {
                                    this.$message.error(res.Msg);
                                }
                                //this.singleSelection = [];
                                this.ajaxMode();
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
                this.ajaxMode();
            },
            //启用按钮
            useClick(){
                if(this.PhIdList == [] || this.PhIdList.length <1){
                    this.$message.error('请选择要启用的组织!');
                    return;
                }
                var data = {
                    parames: this.PhIdList,
                    value:'0'
                };
                //console.log(this.PhIdList);
                this.$axios
                    .post("/SysOrganize/UpdateEnabledList", data)
                    .then(res => {
                        // console.log(this.form);
                        // let resultData = res;
                        // this.tableData.splice(this.idx, 1);
                        if (res.Status == 'success') {
                            this.$message.success("启用成功");
                        } else {
                            this.$message.error('启用失败,请重试!');
                        }
                        //this.singleSelection = [];
                        this.ajaxMode();
                    });
            },
            //停用按钮
            noUseClick(){
                if(this.PhIdList == [] || this.PhIdList.length <1){
                    this.$message.error('请选择要停用的组织!');
                    return;
                }
                var data = {
                    parames: this.PhIdList,
                    value:'1'
                };
                //console.log(this.PhIdList);
                this.$axios
                    .post("/SysOrganize/UpdateEnabledList", data)
                    .then(res => {
                        // console.log(this.form);
                        // let resultData = res;
                        // this.tableData.splice(this.idx, 1);
                        if (res.Status == 'success') {
                            this.$message.success("停用成功");
                        } else {
                            this.$message.error('停用失败,请重试!');
                        }
                        //this.singleSelection = [];
                        this.ajaxMode();
                    });
            },
            //全选按钮
            chooseAllList(){
                if(this.PhIdList.length==this.userInfo.length){
                    this.PhIdList = [];
                    this.userInfoCssList.map((value) => {
                        return value.checked = false;
                    })
                    this.$forceUpdate();
                }else{
                    this.PhIdList = [];
                    this.userInfoCssList.map((value) => {
                        return value.checked = true;
                    })
                    this.$forceUpdate();
                    for(let i =0;i<this.userInfo.length;i++){
                        this.PhIdList.push(this.userInfo[i].PhId);
                    }
                    if(this.PhIdList.length == 1){
                        this.qIsSystem = this.userInfo[0].IsSystem;
                    }
                }

            },
            //反选按钮
            noChooseAllList(){
                let list = this.PhIdList;
                this.PhIdList = [];
                let flam;
                for(let i=0;i< this.userInfo.length;i++){
                    flam = true;
                    if(this.userInfoCssList[i].checked){
                        this.userInfoCssList[i].checked = false;
                    }else{
                        this.userInfoCssList[i].checked = true;
                    }
                    for(let j =0;j<list.length;j++){
                        if(list[j] == this.userInfo[i].PhId){
                            flam = false;
                        }
                    }
                    if(flam){
                        this.PhIdList.push(this.userInfo[i].PhId);
                    }
                }
                if(this.PhIdList.length == 1){
                    this.qIsSystem = this.userInfo[0].IsSystem;
                }
                this.$forceUpdate();
                //console.log(this.PhIdList);
            },
            //数据置顶
            // dataTop(){
            //     var ulList=document.getElementsByClassName('formDataItems')[0];
            //     ulList.scrollTop=0;
            // },
            //搜索按钮
            unionSearch(isSearch) {
                if(isSearch){
                    this.pageIndex = 1;
                }
                //console.log(22222,this.pageSize)
                //console.log(this.state_time);
                let startT ='', endT ='';
                if(this.state_time == null || this.state_time == [] || this.state_time.length < 1){
                    this.state_time = [];
                }else{
                    startT = this.state_time[0];
                    endT = this.state_time[1];
                }
                //console.log(this.searchUnion);
                let system = '';
                if(this.searchUnion == '1'){
                    system = 0;
                }else if(this.searchUnion == '2'){
                    system = 1;
                }else{
                    system = '';
                }
                var data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                    SearchValue:this.unionSearchValue,
                    AddressId:this.addressId,
                    ServiceStartTime:startT,
                    ServiceEndTime:endT,
                    EnabledMark:this.unionState,
                    IsSystem:system,
                    Rank: this.rank,
                    Days: this.endDate,
                    IndustryType: this.IndustryType
                }
                this.$axios.get('/SysOrganize/GetOrganizesBy', {params: data})
                    .then(res => {
                        console.log(res)
                        this.listAll=false;
                        this.userInfo = res.Record;
                        // for(var vou of this.userInfo){
                        //     vou.checked=false;
                        // }
                        for (var i = 0; i < this.userInfo.length; i++) {
                            this.userInfo[i].checked = false;
                            this.userInfoCssList[i] = {checked: false};
                            if(this.userInfo[i].ServiceStartTime == null){
                                this.userInfo[i].ServiceStartTime ='';
                            }
                            if(this.userInfo[i].ServiceEndTime == null){
                                this.userInfo[i].ServiceEndTime ='';
                            }
                            if(this.userInfo[i].JBuildDate == null || this.userInfo[i].JBuildDate == ''){
                                this.userInfo[i].JBuildDate = '';
                            }else{
                                this.userInfo[i].JBuildDate =this.userInfo[i].JBuildDate.replace('T',' ');
                            }
                            // if(this.userInfo[i].Layers == 2 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                            //     this.userInfo[i].EnCode = "-"+ this.userInfo[i].EnCode;
                            // }
                            // if(this.userInfo[i].Layers == 3 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                            //     this.userInfo[i].EnCode = "--"+ this.userInfo[i].EnCode;
                            // }
                            // if(this.userInfo[i].Layers == 4 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                            //     this.userInfo[i].EnCode = "---"+ this.userInfo[i].EnCode;
                            // }
                            // if(this.userInfo[i].Layers == 5 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                            //     this.userInfo[i].EnCode = "----"+ this.userInfo[i].EnCode;
                            // }
                        }
                        this.pageIndex = res.index + 1;
                        this.pageSize = res.size;
                        this.totalRows=res.totalRows;
                        //this.$nextTick(this.dataTop());
                        var ulList=document.getElementsByClassName('formDataItems')[0];
                        //ulList.scrollTop=0;
                        if(ulList == null){
                            return;
                        }else{
                            console.log(ulList);
                            ulList.scrollTop=0;
                        }
                        // var newArr = [];
                        // var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                        // // maxP = Math.ceil(res.totalRows / daresta.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                        // for (var i = 0; i < maxP; i++) {
                        //     newArr = i + 1;
                        // }
                        // this.pageCount = newArr;
                    })
            },
            //修改启用停用状态
            changeEnable(PhId, EnabledMark) {
                //this.PhIdList.push(PhId);
                if (EnabledMark == '0') {
                    EnabledMark = '1'
                } else {
                    EnabledMark = '0'
                }
                //console.log(PhId.toString() + "," + EnabledMark.toString());
                var data = {
                    uid: "0",
                    orgid: "0",
                    value: PhId.toString() + "," + EnabledMark.toString()
                };
                this.$axios
                    .post("/SysOrganize/UpdateEnable", data)
                    .then(res => {
                        // console.log(this.form);
                        // let resultData = res;
                        // this.tableData.splice(this.idx, 1);
                        if (res.Status == 'success') {
                            this.$message.success("修改成功");
                        } else {
                            this.$message.error('修改失败,请重试!');
                        }
                        //this.singleSelection = [];
                        this.ajaxMode();
                    });
            },
            newPage(val) {//分页展示****************************************
                if (val == 'next') {
                    if (this.pageIndex % this.pageCount != 0 && this.pageIndex != this.pageCount) {
                        this.pageIndex++;
                    }
                } else if (val == 'pre') {
                    if (this.pageIndex % this.pageCount != 1) {
                        this.pageIndex--;
                        //console.log(this.pageIndex)
                    }
                } else {
                    this.pageIndex = val + 1;
                }
                this.pageCssActive = this.pageIndex - 1;
                this.ajaxMode();
            },
            pageSizeSelect() {
                this.pageIndex=1;
                this.pageCssActive = this.pageIndex - 1;
                this.ajaxMode();
            },
            //点击选择框
            changeOn(index, item){
                let list = this.PhIdList;
                if(!item.checked){
                    this.PhIdList.forEach((val,i,arr)=>{
                        if(val ==item.PhId){
                            this.PhIdList.splice(i,1);
                            //console.log(this.PhIdList);
                        }
                    });
                    this.$forceUpdate();
                }else{
                    this.PhIdList.push(item.PhId);
                    /*return;*/
                    this.$forceUpdate();
                }
                let val;
                val=this.userInfo.every((val,index,arr)=>{
                    return val.checked==true
                })
                if(val){
                    this.listAll=true;
                }else{
                    this.listAll=false;
                }
                this.$forceUpdate();
                //console.log(this.PhIdList);
            },
            //选择行
            chooseOn(index, item, $event) {
                if($event.target.className=="el-checkbox__inner" || $event.target.className=="el-checkbox__original"){
                    return;
                }
                let list = this.PhIdList;
                if(item.checked){
                    item.checked = false;
                    this.PhIdList.forEach((val,i,arr)=>{
                        if(val ==item.PhId){
                            this.PhIdList.splice(i,1);
                            //console.log(this.PhIdList);
                        }
                    });
                    this.$forceUpdate();
                }else{
                    item.checked = true;
                    this.PhIdList.push(item.PhId);
                    /*return;*/
                    this.$forceUpdate();
                }
                // if(this.userInfoCssList[index].checked){
                //     this.userInfoCssList[index].checked = false;
                //     this.PhIdList.forEach((val,i,arr)=>{
                //         if(val ==item.PhId){
                //             this.PhIdList.splice(i,1);
                //             //console.log(this.PhIdList);
                //         }
                //     });
                //     this.$forceUpdate();
                // }else{
                //     this.userInfoCssList[index].checked = true;
                //     this.PhIdList.push(item.PhId);
                //     this.$forceUpdate();
                // }
                let val;
                val=this.userInfo.every((val,index,arr)=>{
                    return val.checked==true
                })
                if(val){
                    this.listAll=true;
                }else{
                    this.listAll=false;
                }
                this.$forceUpdate();
                //console.log(this.PhIdList);
                // this.PhIdList = PhId;

            },
            routerTo(url) {
                //console.log(this.PhIdList);
                var route=this.$route;
                if(url == '/admin/orgin/add'){
                    //移除TagNav
                    //this.$store.commit("tagNav/removeTagNav", route);
                    //this.$store.commit("tagNav/upexcludeArr", ['basicUnion']);
                    this.$router.push({path: url, query: {showFlam:true}});
                    this.ajaxMode();
                }else{
                    if(this.PhIdList.length == 0){
                        this.$message({ showClose: true,message: "请选中列表的其中一行", type: "warning"});
                        return;
                    }else if(this.PhIdList.length == 1){
                        var data = {
                            id: this.PhIdList[0]
                        };
                        this.$axios.get('/SysOrganize/GetSysOrganize', {params: data})
                            .then(res => {
                                console.log(res);
                                this.qIsSystem = res.IsSystem;
                                if(this.qIsSystem == 1){
                                    this.$message({ showClose: true,message: "内置工会无法进行修改！", type: "warning"});
                                    return;
                                }
                                this.$router.push({path: url, query: {PhId: this.PhIdList, showFlam:true}});
                                this.ajaxMode();
                                this.PhIdList = '';
                            })
                        //移除TagNav
                        //this.$store.commit("tagNav/removeTagNav", route);
                        // this.$store.commit("tagNav/upexcludeArr", []);
                        //this.$store.commit("tagNav/upexcludeArr", ['basicUnion']);
                    }else{
                        this.$message({ showClose: true,message: "多选时无法进行修改操作！", type: "warning"});
                        return;
                    }
                }

                // if (url != '/admin/orgin/add' && this.PhIdList.length == 0) {
                //     alert('请点击你要修改的组织')
                //     return;
                // } else {
                //     this.$router.push({path: url, query: {PhId: this.PhIdList}});
                // }
            },
            ajaxMode() {
                //console.log(this.pageSize);
                this.PhIdList =[];
                this.unionSearch();
                // const loading1 = this.$loading();
                // let data = {
                //     uid: "0",
                //     orgid: "0",
                //     pagesize: this.pageSize,
                //     pageindex: this.pageIndex - 1,
                //     queryfilter:{"IsSystem*Byte*eq*1":0},
                // };
                // this.$axios.get('/SysOrganize/GetSysOrganizeList', {params: data})
                //     .then(res => {
                //         this.listAll=false;
                //         this.userInfo = res.Record;
                //         loading1.close();
                //         for(var vou of this.userInfo){
                //             vou.checked=false;
                //         }
                //         for (var i = 0; i < this.userInfo.length; i++) {
                //             this.userInfoCssList[i] = {checked: false};
                //             if(this.userInfo[i].ServiceStartTime == null){
                //                 this.userInfo[i].ServiceStartTime ='';
                //             }
                //             if(this.userInfo[i].ServiceEndTime == null){
                //                 this.userInfo[i].ServiceEndTime ='';
                //             }
                //             if(this.userInfo[i].JBuildDate == null || this.userInfo[i].JBuildDate == ''){
                //                 this.userInfo[i].JBuildDate = '';
                //             }else{
                //                 this.userInfo[i].JBuildDate =this.userInfo[i].JBuildDate.replace('T',' ');
                //             }
                //             if(this.userInfo[i].Layers == 2 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                //                 this.userInfo[i].EnCode = "  "+ this.userInfo[i].EnCode;
                //             }
                //             if(this.userInfo[i].Layers == 3 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                //                 this.userInfo[i].EnCode = "    "+ this.userInfo[i].EnCode;
                //             }
                //             if(this.userInfo[i].Layers == 4 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                //                 this.userInfo[i].EnCode = "      "+ this.userInfo[i].EnCode;
                //             }
                //             if(this.userInfo[i].Layers == 5 && (this.userInfo[i].EnCode !=null && this.userInfo[i].EnCode !="")) {
                //                 this.userInfo[i].EnCode = "        "+ this.userInfo[i].EnCode;
                //             }
                //         }
                //         this.pageIndex = res.index + 1;
                //         this.pageSize = res.size;
                //         var newArr = [];
                //         var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                //         for (var i = 0; i < maxP; i++) {
                //             newArr = i + 1;
                //         }
                //         this.pageCount = newArr;
                //         var ulList=document.getElementsByClassName('formDataItems')[0];
                //         ulList.scrollTop=0;
                //     })
                //     .catch(err => {
                //         console.log(err);
                //         loading1.close();
                //     })
            },
            //模板下载
            onloadOrg:function(val){
                /*if(!this.showReportMsg.show){
                    this.showReportMsg.loadFlag=true;
                }else{*/
                this.showReportMsg.loadFlag=true;
                //}
            },
            //只能选择一个文件
            handleExceed(files, fileList) {
                this.$message.warning(`一次只能导入一个文件！`);
            },
            //文件类型判断
            beforeUploadPic(file) {

                var isRightType = (file.type === 'application/vnd.ms-excel');
                if (!isRightType) {
                    this.$message.error('请选择Excel文档!');
                    return false
                }
            },
            //excel上传
            uploadFileMethod(param) {
                var _$this=this;
                var url='/SysUser/PostInportOrganize';
                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);
//加时间戳，防止IE缓存
                formData.append('timeCode',(new Date()).getTime().toString());
                let loading=this.$loading();
                loading.setText('文件正在上传...')
                let timer = setTimeout(function(){
                    loading.setText('数据比对中，请耐心等待..')
                },1500);
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();

                let config_header = { "Content-Type": "multipart/form-data" };
                var new_header = Object.assign({},config_header, baseheader);

                axios.create(base).post(url, formData, { headers:new_header }).then(res => {
                    loading.close();
                    var response=JSON.parse(res.data);

                    if(response.Status=='success'){
                        this.showReportMsg.loadFlagSecondMsg=response.Msg;
                        this.showReportMsg.loadFlagSecond=true;
                        this.showReportMsg.loadFlag=false;//UploadPath IsRepeat
                        this.showReportMsg.loadFile.name=response.UploadPath;
                        this.showReportMsg.loadFile.type=response.IsRepeat;
                    }else{
                        _$this.$refs.piclist.clearFiles();
                        _$this.$message({showClose: true, message: response.Msg, type: 'error'});
                    }

                }).catch((error) =>{
                    loading.close();
                    //错误
                    this.showReportMsg.loadFlag=false;
                    _$this.$refs.piclist.clearFiles();
                    _$this.$message({showClose: true, message: error, type: 'error'});
                });

            },

            ///组织导入模板下载
            loadExcel:function(){
                let base=httpConfig.getAxiosBaseConfig();
                window.location.href = base.baseURL + "/File/GetExportFile?filePath=template&fileName=工会组织导入模板.xls";
            },
            showLoad:function(){
                this.showReportMsg.flag=false;
                this.showReportMsg.loadFlag=true;

            },
            downloadOrg:function(){
                let param = {
                    'infoData': this.PhIdList
                };
                if(this.PhIdList.length < 1) {
                    this.$message.warning(`请选择要导出的组织！`);
                    return;
                }
                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method: 'post',
                    url: '/SysOrganize/PostExportOrganizeExcel',
                    data: param
                }).then(res => {
                    //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    //console.log(res);
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
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
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            clearFile:function(){
                this.showReportMsg.loadFlagSecondMsg='';
                this.showReportMsg.loadFlagSecond=false;
                this.showReportMsg.loadFile.name='';
                this.showReportMsg.loadFile.type='';
                this.$refs.piclist.clearFiles();
            },
            //组织批量导入接口
            updateFile:function(){
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();
                let loading=this.$loading();

                let timer = setTimeout(function(){
                    loading.setText('导入时间过长，请耐心等待，勿关闭浏览器')
                },3000);

                let param={
                    IsIgnore:this.showReportMsg.loadFile.type,
                    UploadPath:this.showReportMsg.loadFile.name,
                    //加时间戳，防止IE缓存
                    timeCode:(new Date()).getTime().toString()
                };
                axios.create(base).post('/SysUser/PostSaveOrganize',qs.stringify(param), { headers:baseheader }).then(res => {
                    loading.close();
                    //这里去clear
                    clearTimeout(timer);
                    res=qs.parse(res);
                    res=JSON.parse(res.data);
                    if(res.Status=='success'){
                        this.showReportMsg.loadFlagSecond=false;
                        this.$message({showClose: true, message: '批量导入成功', type: 'success'});
                        this.$refs.piclist.clearFiles();
                    }else{
                        this.showReportMsg.loadFlagSecond=false;
                        this.$message({showClose: true, message: res.Msg, type: 'error'});
                        this.$refs.piclist.clearFiles();
                    }
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //获取单位所属行业下拉选项
            loadTradeData(){
                this.$axios.get('/SysConfig/GetIndustryConfigList').then(res =>{
                    if (res.Record) {
                        this.tradeData = res.Record
                        if (res.Record.length ===1 && res.Record[0].Code === '9999'){
                            this.defaultTradeValue = res.Record[0].Code
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            //所属行业下拉框值改变触发事件
            changeTrade(){

                this.unionSearch(true)
            },
            clearTrade(){
                this.IndustryType = []
                this.unionSearch()
            },
            //批量赋值
            belongTrade(){
                if(this.PhIdList == [] || this.PhIdList.length <1){
                    this.$message.warning('请选择要赋值所属行业的组织!');
                    return;
                }
                this.chooseTrade = true
            },
            //所属弹框中的确认事件
            getTrade(val){
                console.log(val)
                var data = {
                    orgIdList: this.PhIdList,
                    industryType:val.Code
                };
                this.$axios.post('/SysOrganize/UpdateIndustryList',data).then(res=>{

                    this.message.visible = true

                }).catch(err=>{
                    console.log(err)
                })
            },
            //所属弹框中的取消事件
            closeTrade(){
                this.chooseTrade = false
            },
            closeMsg(){
                this.chooseTrade = false
                this.unionSearch()
            },
//清除地区
            clearArea:function(){
                this.clearAddress();
                this.$nextTick(()=>{
                    this.unionSearch()
                })
            },
        },
        activated(){
            this.selectUnionName();
            this.ajaxMode();
            this.selectAreaTwo(0, 0);
            this.selectAreaThree(0,0);
            this.PhIdList =[];
        },
        created() {
            //this.$store.commit("tagNav/upexcludeArr", []);
            this.selectAreaTwo(0, 0);
            this.ajaxMode();
        },
        mounted() {
            this.loadTradeData()
            // this.selectUnionName();
            // this.ajaxMode();
            // this.selectAreaTwo(0, 0);
            this.selectAreaThree(0,0);
        },
        computed:{
            ...mapState({
                uid: state => state.user.userid,
                uname: state => state.user.username,
                orgid: state => state.user.orgid,
                orgcode:state => state.user.orgcode,
                orgName:state=>state.user.orgName,
                dbname:state=>state.user.dbname

            }),
        },
    }</script>

<style lang="scss" scoped>
    .areaIn{
        position:relative;
        display:inline-block;
        padding-left:0px;
        width:100% !important;
        color:#000;
        cursor:pointer;
        height: 32px;
        line-height: 32px;
        white-space: nowrap;
        overflow-x: visible;
        text-align: left;
        >span{
            position: absolute;
            right: 0;
            top: 10px;
            color: #C0C4CC;
            display: none
        }
    }
    .areaIn:hover span{
        display: inline-block;
    }
    .organizeParentNow .el-tabs--left .el-tabs__header.is-left {
        float: left;
        margin-bottom: 0;
        margin-right: 10px;
        position: absolute;
        left: -41px;
        width: 52px;
        height: 170px;
        background: #fff;
        border-radius: 7px;
        /* text-align: center; */
        z-index: -1;
    }
    .addressStyle > ul > li:hover {
        background: #cccccc;
    }
    .addressStyle .el-input--suffix .el-input__inner {
        line-height: 40px;
        height: 40px;
        margin: 0;
        padding-right: 0;
        width: 100%;
    }
    .unionState>ul>li{
        margin-right:10px;
        width:auto;
        min-width:212px;
    }
    .unionState {
        width:100%;
        float:right;
        -webkit-transition: margin 0.2s linear;
        -moz-transition: margin 0.2s linear;
        -ms-transition: margin 0.2s linear;
        transition: margin 0.2s linear;
        ul.handle{
            padding-right:70px;
            position:relative;
        }
        > ul {
            > a:hover {
                z-index: 999;
            }
            >a  .mode {
                width: 60px;
                height: 30px;
                overflow: hidden;
                position: absolute;
                top:0;
                right:0;
                padding:0;
                transition: all 0.2s linear;
                border: 1px solid #00b7ee;
                > div {
                    width: 100%;
                    margin-right: 10px;
                    background: #fff;
                    opacity: 1;
                    &:first-of-type {
                        color: #fff;
                    }
                    &:hover {
                        background: #ccc;
                        color: #fff;
                    }
                    &:first-of-type {
                        background: #00b7ee;
                        border: 0;
                    }
                }
                &:hover {
                    height: auto;
                    border: 1px solid #00b7ee;
                    background: #fff;
                    opacity: 1;
                    z-index: 99;
                    > span {
                        &:first-of-type {
                            color: #fff;
                        }
                    }

                }
            }
            > a:nth-last-of-type(2) {
                position: relative;
                width: 70px;
                height: 30px;


            }
        }
        .selectHandle{
            float:left;
        }
    }
    .searcherValue>input{
        width:100%;
        min-width: auto;
    }
    .hideScroll{
        position: absolute;
        top:85px;
        bottom: 0;
        right:4px;
        width: 16px;
        height:100%;
        background: #fff;
        z-index: 99;
    }

    .formData > ul:first-child > li {
        border-right: 1px solid #fff;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 15%;
        font-size: 18px;
    }
    .formData > ul:first-child > li:nth-of-type(6) {
        line-height: 50px;
        width: 11%;
    }
    .formData > ul:first-child > li:nth-of-type(7) {
        line-height: 25px;
        width: 27%;
    }

    .formData > ul:first-child > li:nth-of-type(8) {
        width: 10%;
    }
    /*.formData > ul:first-child > li:nth-of-type(7) {*/
    /*line-height: 25px;*/
    /*width: 27%;*/
    /*}*/

    /*.formData > ul:first-child > li:nth-of-type(8) {*/
    /*width: 10%;*/
    /*}*/
    .formData > ul:first-child > li:nth-of-type(2) {
        width: 5%;
    }
    .formData > ul:first-child > li:last-of-type {
        /*border-right: 1px solid #2780d1;*/
    }

    .formDataItem > li:first-child, .formData > ul:first-child > li:first-child {
        width: 3%;
        min-width: 31px;
        padding: 0 2px;
    }

    .zhangtao > div:first-child {
        border-bottom: 1px solid #fff;
    }

    .zhangtao > div:last-child > span {
        width: 33.33%;
        border-right: 1px solid #fff;
    }

    .zhangtao > div:last-child > span:last-child {
        border: 0;
    }

    .formDataItems > li {
        width: 100%;
    }

    .formDataItems > li > ul > li:first-of-type {
        border-left: 1px solid #ddd;
    }

    .formDataItem:hover {
        background-color: #fafafa;
        transition: background-color .25s ease;
    }
    .userInfoCss .formDataItem:hover {
        background-color: transparent;
        transition: background-color .25s ease;
    }
    .formDataItems {

        border-bottom: 1px solid #ddd;
    }

    .formDataItem > li {
        border: 1px solid #ddd;
        border-left: 0;
        border-bottom: 0;
        width: 15%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 10px;
    }

    .formDataItem > li:nth-of-type(8),
    .formDataItem > li:nth-of-type(9),
    .formDataItem > li:nth-of-type(7) {
        width: 9%;
    }
    .formDataItem > li:nth-of-type(6) {
        width: 11%;
    }

    .formDataItem > li:nth-of-type(10) {
        width: 10%;
        padding: 0 8px;
    }
    .formDataItem > li:nth-of-type(2) {
        width: 5%;
        padding: 0 8px;
    }
    .cover{
        position:-ms-page;
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
    .coverContent .button{
        height: 30px;
        width: auto;
        color:#00B8EE;
        background-color: #fff ;
        border: 1px solid #00B8EE;
        border-radius: 3px;
        line-height: 30px;
        margin: auto;
    }
    .coverContent .button:hover{
        color: #00B8EE;
        background-color: #fff;
    }
    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 10px 20px;
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

    .unionStateCon{
        width:100%;
        height:60px;
        margin-bottom:0px;
        position:relative;
        padding:0;
    }
    .unionStateCon>i{
        height:100%;
        background: #fff;
        position: absolute;
        z-index:9;
        font-size: 30px;
        color:#00b7ee;
        cursor:pointer;
        top:0px;
        display: none;
        animation:i_arrow 2.5s infinite;
    }
    .unionStateCon>i:first-of-type{
        left:0px;
    }
    .unionStateCon>i:last-of-type{
        right:0px;
    }
    .ParantOrgListW{
        cursor: pointer;
    }
    .ParantOrgListFontColor {
        color: rgba(0,0,0,0.3);
        /*cursor: default;*/
    }
    .addressStyle > ul > li.ParantOrgListFontColor:hover {
        /*background: #fff;*/
    }
    .AllProStyle {
        background: #ccc !important;
    }

    .organizeParentCon {
        position: fixed;
        position: -ms-page;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        background-color: rgba(66, 66, 66, 0.45);
        z-index: 99;
        text-align: center;
        overflow-y: auto;
    }
    .organizeParentCon:after{
        content:"";
        display: inline-block;
        height:100%;
        width:0px;
        vertical-align: middle;
    }
    .organizeParent2 {
        box-shadow: 0 0 5px 1px #d3e9f9;
        text-align: left;
        display: inline-block;
        vertical-align: middle;
        background: #fff;
        width: 280px;
        height: 395px;
        border-radius: 10px;
        /* overflow: hidden; */
        position: relative;
    }
    @media screen and (max-width: 1840px){
        .unionStateCon>i{
            display: block;
        }
        .unionStateCon{
            padding:0 30px;
        }
        .unionState>ul.selectHandle{
            float:right;
        }
        .unionState{
            width:1800px;
        }
    }
    @media screen and (min-width: 1841px) {
        .unionState[style] {
            margin-right: 0 !important;
        }
    }
    @keyframes i_arrow {
        0% {opacity:1;}
        50% {opacity:0.4;}
        100% {opacity:1;}
    }
</style>
<style scoped>
    .select-trade >>> .el-input--suffix .el-input__inner{
        padding-right: 30px;
    }
    .select-trade >>> .el-select__tags span span:first-of-type span{
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
    }
    .select-trade >>> .el-select__tags span span i{
        top: -6px;
    }
</style>
<style>
    .addressStyle .el-input--suffix .el-input__inner {
        line-height: 40px;
        height: 40px;
        margin: 0;
        padding-right: 0;
        width: 100%;
    }
    .datepick .el-input__inner{
        border-color: #dcdfe6;
    }
    .organizeParentNow .el-tabs--left .el-tabs__header.is-left {
        float: left;
        margin-bottom: 0;
        margin-right: 10px;
        position: absolute;
        left: -41px;
        width: 52px;
        height: 170px;
        background: #fff;
        border-radius: 7px;
        /* text-align: center; */
        z-index: -1;
    }
    .organizeParentNow .el-tabs--left .el-tabs__header.is-left .el-tabs__nav-wrap.is-left .el-tabs__nav-scroll {
        margin-left: -12px;
    }

    .allChooseSty .el-table th > .cell {
        text-align:left;
    }
</style>
