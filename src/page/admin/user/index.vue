<template>
    <div class="sys-page AdminUserList" style="background-color: #ffffff">
        <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <!--<el-select v-model="state_mark" placeholder="请选择用户状态" class="handle-select mr10">-->
                        <!--<el-option label="全部" value=""></el-option>-->
                        <!--<el-option label="启用" value="0"></el-option>-->
                        <!--<el-option label="临时停用" value="1"></el-option>-->
                        <!--<el-option label="永久停用" value="2"></el-option>-->
                        <!--</el-select>-->


                        <!-- <el-button type="info" icon="el-icon-lx-message" size="small" class="handle-del mr10" style="float: right"
                                   >更多
                        </el-button> -->

                        <div class="moreBtnCon">
                            <ul class="moreBtn" >
                                <li>更多</li>
                                <!--<li @click="handleSelectionChange(tableData)">全选</li>-->
                                <!--<li @click="toggleSelection(qPhIdList)">反选</li>-->
                                <li  @click="onloadOrg">导入</li>
                                <li @click="downloadOrg">导出</li>
                            </ul>
                        </div>

                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right;margin-left:10px;"
                                   @click="SendInvite">发送邀请码
                        </el-button>
                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="Transfer">账号移交
                        </el-button>
                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="PageReset">密码重置
                        </el-button>
                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="PageDelete">删除
                        </el-button>

                        <!--<el-button type="info" icon="el-icon-lx-message" size="small" class="handle-del mr10"-->
                        <!--@click="SendCode">发送邀请码-->
                        <!--</el-button>-->
                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="PageEdit">修改
                        </el-button>
                        <el-button type="info"  size="small" class="handle-del mr10" style="float: right"
                                   @click="PageAdd">添加
                        </el-button>
                        <el-button type="primary"  class="box-seach" size="small" style="float: right;margin-left: 0" @click="search">搜索</el-button>
                        <el-input v-model="select_word" placeholder="组织名称/组织编码" style="float: right" prefix-icon="el-icon-search"
                                  class="handle-input borderRadius mr10 box-input" size="small"></el-input>

                    </el-col>
                </el-row>
            </div>
            <div style="width: 100%;">
                <div style="float: left; width: 16%; height: 100%;border: 1px solid #eaeaea;">
                    <div  class="block" style="margin-bottom:10px;background-color: #00B8EE;height: 50px;">
                        <!--<span class="demonstration">请选择要查看的组织所在区域</span>-->
                        <el-input v-model="areaAddressName" placeholder="请先点击此处选择地区" clearable @focus="getAreaAddress" @clear ='clearAreaAddress'
                                  style="text-align: center; width: 90%;align-content: center; left: 5%; top:15%;height: 80%" class="handle-input mr10">
                        </el-input>
                        <!--<el-cascader-->
                        <!--placeholder="选择组织所在区域"-->
                        <!--:options="options"-->
                        <!--:clearable="true"-->
                        <!--class="wggcascader"-->
                        <!--@active-item-change="handleItemChange"-->
                        <!--@change ="changeArea"-->
                        <!--@visibleChange="visOnChange"-->
                        <!--change-on-select-->
                        <!--style="position: relative;top: 9px;width: 90%;left:5%"-->
                        <!--size="small"-->
                        <!--&gt;</el-cascader>-->
                    </div>
                    <div align="left" style="margin-bottom: 5px">
                        工会组织列表：
                    </div>
                    <div style="overflow-x: hidden; overflow-y:auto; height: 500px">
                        <el-tree
                            :data="data2"
                            :props="defaultProps"
                            @current-change="changeTable"
                            node-key="OrgId"
                            :expand-on-click-node="expandOnClickNode"
                            default-expand-all
                            :highlight-current="true"
                            :default-checked-keys="CheckedList"
                            ref="tree">
                        </el-tree>
                    </div>
                </div>
                <div style="float: right; width: 82%; height: 100%;border: 1px solid #eaeaea;">
                    <el-table
                        :data="tableData"
                        border
                        style="font-size:18px;"
                        :row-class-name="tableRowClassName"
                        class="table"
                        v-loading="loading"
                        ref="multipleTable"
                        highlight-current-row
                        :header-cell-style="{background:'#d3e9f9',color:'#000',textAlign:'center'}"
                        @row-click="handleClickRow"
                        @selection-change="handleSelectionChangeTwo"
                    >
                        <template :class="{userInfoCss:userInfoCssList[scope.row.index].checked}">
                            <el-table-column type="selection" width="60" align="center"></el-table-column>
                            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                            <!--<el-table-column prop="Account" label="用户编码" width="120"></el-table-column>-->
                            <el-table-column prop="OperatorCode" label="操作员编码" v-if="showColumn"></el-table-column>
                            <el-table-column prop="RealName" label="操作员名称"></el-table-column>
                            <el-table-column prop="MobilePhone" label="手机号码"></el-table-column>
                            <el-table-column label="角色" v-if="showColumn">
                                <template slot-scope="scope">
                                  <span v-for="(v,index) in scope.row.Roles" :key="v.PhId">
                                    <span v-if="index<(scope.row.Roles.length-1)">{{v.Name}},</span>
                                    <span v-else>{{v.Name}}</span>
                                  </span>
                                </template>
                            </el-table-column>
                            <!--<el-table-column prop="OrgName" label="所属工会" v-if="showColumn"></el-table-column>-->
                            <el-table-column label="用户状态">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.EnabledMark==0" type="success" icon="el-icon-check" size="mini" circle></el-button>
                                    <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background @current-change="handleCurrentChange" layout="total,prev, pager, next"
                                       :total="totalCount" :page-size="pageSize" >
                        </el-pagination>
                    </div>
                </div>
                <div style="clear:both"></div>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogState=='add'?'新增':'编辑'" :visible.sync="editVisible" width="40%" :close="dialogClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                <el-form-item label="用户姓名：" prop="realName">
                    <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" prop="mobilePhone">
                    <el-input v-model="form.mobilePhone"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="rolesid">
                    <el-checkbox-group v-model="form.rolesid">
                        <el-checkbox v-for="item of roledata" :key="item.PhId" :label="item.PhId" class="el-checkbox-role">{{item.Name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="账号状态：" prop="enabledMark">
                    <el-radio-group v-model="form.enabledMark">
                        <el-radio label="0">启用</el-radio>
                        <el-radio label="1">临时停用</el-radio>
                        <el-radio label="2">永久停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="dialogState=='add'?false:true">
                    <el-table
                        :data="form.historyAccount"
                        border
                        style="width: 100%">
                        <el-table-column label="序号" type="index" width="50"></el-table-column>
                        <el-table-column prop="RealName" label="用户姓名" ></el-table-column>
                        <el-table-column prop="MobilePhone" label="手机号码" ></el-table-column>
                        <el-table-column prop="RoleName" label="角色"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false" style="color: #00B8EE; border-color: #00B8EE;">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
            </span>
        </el-dialog>

        <!--地址选择器-->
        <el-dialog :title="'地址选择'" :visible.sync="addressVisible" width="40%" :close="dialogClose">
            <template>
                <el-select v-model="Province" placeholder="" filterable style="width: 20%" @change="changeProvince">
                    <el-option
                        v-for="item in ProvinceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
                <span>省</span>
                <el-select v-model="City" placeholder="" filterable style="width: 20%" @change="changeCity">
                    <el-option
                        v-for="item in CityList"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
                <span>市</span>
                <el-select v-model="County" placeholder="" filterable style="width: 20%" @change="changeCounty">
                    <el-option
                        v-for="item in CountyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
                <span>区</span>
                <el-select v-model="Street" placeholder="" filterable style="width: 20%" @change="changeStreet">
                    <el-option
                        v-for="item in StreetList"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
                <span>街道</span>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="areaCancel" style="color: #00B8EE; border-color: #00B8EE;">取 消</el-button>
                <el-button type="primary" @click="areaClear">清 空</el-button>
                <el-button type="primary" @click="areaDefine">确 定</el-button>
            </span>
        </el-dialog>

        <!--模板下载选择-->
        <div class="cover" :style="{'display':(showReportMsg.flag?'block':'none'),'z-index':'999'}">
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
        </div>
        <!--文件上传-->
        <div class="cover" :style="{'display':(showReportMsg.loadFlag?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30%;">
                <div class="flexPublic">
                    <p>选择文件</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showReportMsg.loadFlag=false"></i>
                </div>
                <div>
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
                        <div class="el-upload__tip" slot="tip">只能上传Excel文件</div>
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

    </div>
</template>
<script>
    import axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState, mapActions } from 'vuex'
    import Auth from "@/util/auth";
    import { SysUserAdd,SysUserUpdate,SysUserList,SysUserDelete,SysUserTransferList,SysUserUpdatePassword,SysUserSendInvitationCode } from '@/api/user/userInfo'
    import { SysRoleList, SysRoleListNoAdmin } from '@/api/role/roleInfo'
    import { isvalidatemobile } from '@/util/validate'
    import qs from 'qs';

    export default {
        name: "AdminUserList",
        data() {
            const validatePhone = (rule, value, callback) => {
                if (isvalidatemobile(value)[0]) {
                    callback(new Error(isvalidatemobile(value)[1]))
                } else {
                    callback()
                }
            }
            return {
                PhIdList:[],
                showColumn: true,
                qIndex:'',
                userInfoCssList: [],
                qPhIdList:[],//用来记录当前展示的所有的phid数组
                qInvitationCode:'',//记录所选组织的邀请码
                CheckedList:[],
                roledata:'',
                defaultProps:'',
                areaAddress:'',
                areaAddressName:'',
                areaLayers:'',
                Province:'',
                ProvinceList:[],
                City:'',
                CityList:[],
                County:'',
                CountyList:[],
                Street:'',
                StreetList:[],
                addressVisible:false,
                areaOne:'',
                areaTwo:'',
                areaThree:'',
                areaFour:'',
                areaValues:[],
                clearable:true,
                aresId: [],
                options:[],
                loading: false,
                data2: [],
                qOrgId: "",
                qOrgCode:'',
                flam: 0,
                highlightCurrent: true,
                expandOnClickNode: false,
                tableData: [], //table数据
                pageSize: 10, //pageSize
                pageIndex: 1, //pageIndex
                totalCount: 0, //总页数
                singleSelection: [], //选中行
                state_mark: "", //用户状态
                select_word: "", //搜索字段
                jsonFlam:'',//用来账号移交
                //dialogtitle: "新增",
                dialogState: "add",
                queryF:'',
                editVisible: false,
                is_search: false,
                defaultProps: {
                    children: 'children',
                    label: 'OrgName'
                },
                form: {
                    // phid: 0,
                    realName: "",
                    mobilePhone: "",
                    rolesid: [],
                    enabledMark: "0",
                    historyAccount:[]
                },
                rules: {
                    realName: [
                        { required: true, message: "请输入用户姓名", trigger: "blur" }
                    ],
                    mobilePhone: [
                        { required: true, message: "请输入手机号码", trigger: "blur",validator: validatePhone }
                    ],
                    rolesid: [
                        {
                            type: "array",
                            required: true,
                            message: "请至少选择一个角色",
                            trigger: "change"
                        }
                    ],
                    enabledMark: [
                        { required: true, message: "请选择账号状态", trigger: "change" }
                    ]
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
                }
            };
        },
        created() {
            this.getRoleData();
        },
        activated(){
            this.getRoleData();
            this.getData('');
            this.PhIdList =[];
        },
        mounted: function () {
            this.getData('');
            //this.getAreaData();
            //this.getNodes();
        },
        //监听事件
        watch:{
            // PhIdList: function(val){
            //     if(val.length == 1){
            //         console.log(val[0]);
            //         this.$axios.get("/SysUser/GetOrgListByUser", {
            //             params: {
            //                 userPhId: val[0].PhId
            //             }
            //         }).then(
            //             res => {
            //                 this.data2 = res;
            //                 console.log(this.data2[0].OrgId);
            //                 if(this.data2.length > 0){
            //                     this.$refs.tree.setCurrentKey(this.data2[0].OrgId);
            //                     console.log(this.$refs.tree.setCurrentKey(this.data2[0].OrgId));
            //                 }
            //             },
            //             error => {
            //                 console.log(error);
            //             }
            //         );
            //     }else{
            //         //this.data2 = [];
            //         this.qOrgId ='';
            //     }
            // },
        },
        //计算
        computed: {
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                username:state=> state.user.username,
                invitationCode: state=> state.user.invitationCode,
                dbname:state=>state.user.dbname,
            })
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.pageIndex = val;
                console.log(val);
                if(this.qOrgId != ''){
                    this.getData('');
                }else{
                    this.getAllUserList(this.queryF);
                }
            },
            //选中用户后进行的操作
            chooseUser(){
                console.log(this.PhIdList);
                if(this.PhIdList.length == 1){
                }
            },
            //将行的索引放进row中
            tableRowClassName ({row, rowIndex}) {
                //把每一行的索引放进row
                row.index = rowIndex;
            },
            //反选
            toggleSelection(rows) {
                if (rows) {
                    let newPhIdList = [];
                    for(let i = 0;i < rows.length;i++){
                        let flam = true;
                        for(let j =0;j<this.PhIdList.length ;j++){
                            if(rows[i].PhId == this.PhIdList[j].PhId){
                                flam = false;
                            }
                        }
                        if(flam){
                            newPhIdList.push(rows[i]);
                        }
                    }
                    this.PhIdList = [];
                    this.PhIdList = newPhIdList;
                    console.log(this.PhIdList);
                    rows.forEach(row => {
                        //console.log(this.$refs.multipleTable.toggleRowSelection(row));
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            //点击行改变checkbox状态
            toggleSelectionTwo(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            //选择用户
            handleSelectionChangeTwo(val){
                console.log(val);
                this.PhIdList =[];
                this.PhIdList = val;
                //console.log(val.checked)
            },
            //选择多行及全选
            handleSelectionChange(val) {
                console.log(1111111111111)
                console.log(val);
                console.log(1111111112);
                this.PhIdList =[];
                this.PhIdList = val;
                val.forEach(row => {
                    //console.log(this.$refs.multipleTable.toggleRowSelection(row));
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            },
            //发送邀请码
            SendInvite(){
                if(this.qOrgId != "") {
                    let object = this.singleSelection;
                    var vm = this;
                    console.log(vm);
                    let id = object.length > 0 ? object[0].PhId : 0;
                    if(this.PhIdList.length == 1){
                        if(this.PhIdList[0].Account == 'admin'){
                            this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
                            return;
                        }
                        if(this.PhIdList[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (this.PhIdList.length == 1) {
                        let base = httpConfig.baseurl;
                        console.log(base);
                        let url = base + "/ghc/saas/index#/register";
                        //console.log(vm.invitationCode);
                        this.$confirm('确定要向该账户发送邀请?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            SysUserSendInvitationCode(vm, {
                                Uname: vm.username,
                                Url: url,
                                Phone:this.PhIdList[0].MobilePhone,
                                InvitationCode:vm.qInvitationCode
                            }).then(res => {
                                console.log(res);
                                if (res.Status === 'success') {
                                    vm.$message.success('发送邀请成功!');
                                }
                            }).catch(error => {
                                console.log(error);
                                vm.$message({showClose: true, message: "发送邀请错误", type: "error"});
                            })
                        }).catch(() => {
                            this.$message({type: 'info', message: '已取消邀请！'});
                        });
                    } else {
                        this.$message({showClose: true, message: "请选中列表的其中一行", type: "warning"});
                    }
                }else{
                    this.$message({
                        message: "请先在左侧选取组织！",
                        type: "warning"
                    });
                }
            },
            //获取移交记录信息
            getTransData(userid){
                var vm=this;
                //获取200角色信息
                SysUserTransferList(vm,{
                    uid: userid,
                    orgid: this.qOrgId,
                    pagesize: 200,
                    pageindex: 0
                }).then(res => {
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    this.form.historyAccount = res.Record;
                }).catch(error => {
                    console.log(error);
                    this.$message({ showClose: true, message: '移交记录获取错误', type: 'error'});
                });
            },
            //用于交互，弹出地址选择页面
            getAreaAddress(){
                this.addressVisible = true;
                this.selectArea(0,0);
            },
            //查询地区
            selectArea(Area,i){
                var data = {
                    uid: "0",
                    orgid: "0",
                    id: Area
                }
                this.$axios.get('/SysArea/GetAreaList', {params: data})
                    .then(res => {
                        console.log(res);
                        if(i == 0){
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
            changeProvince(){
                this.City = '';
                this.County = '';
                this.Street = '';
                this.CityList =[];
                this.CountyList = [];
                this.StreetList = [];
                this.selectArea(this.Province.value, 1);
                // this.areaAddressName = this.Province.label;
                // this.areaAddress = this.Province.value;
                // this.areaLayers = '1';
            },
            changeCity(){
                this.County = '';
                this.Street = '';
                this.CountyList = [];
                this.StreetList = [];
                this.selectArea(this.City.value, 2);
                // this.areaAddress = this.City.value;
                // this.areaLayers = '2';
                // this.areaAddressName =this.Province.label+ "/"+ this.City.label;
            },
            changeCounty(){
                this.Street = '';
                this.StreetList = [];
                this.selectArea(this.County.value, 3);
                // this.areaAddress = this.County.value;
                // this.areaLayers = '3';
                // this.areaAddressName = this.Province.label+ "/"+ this.City.label+ '/'+ this.County.label;
            },
            changeStreet(){
                // this.areaAddress = this.Street.value;
                // this.areaLayers = '4';
                // this.areaAddressName = this.Province.label+ "/"+ this.City.label+ '/'+ this.County.label+ '/'+ this.Street.label;
            },
            //地址选择器点击确定事件
            areaDefine(){
                if(this.Province != null && this.Province != ''){
                    this.areaAddressName = this.Province.label;
                    this.areaAddress = this.Province.value;
                    this.areaLayers = '1';
                }
                if(this.City != null && this.City != ''){
                    this.areaAddressName = this.Province.label + "/"+ this.City.label;
                    this.areaAddress = this.City.value;
                    this.areaLayers = '2';
                }
                if(this.County != null && this.County != ''){
                    this.areaAddressName = this.Province.label+ "/"+ this.City.label + '/'+ this.County.label;
                    this.areaAddress = this.County.value;
                    this.areaLayers = '3';
                }
                if(this.Street != null && this.Street != ''){
                    this.areaAddressName = this.Province.label+ "/"+ this.City.label + '/'+ this.County.label + '/'+ this.Street.label;
                    this.areaAddress = this.Street.value;
                    this.areaLayers = '4';
                }
                if(this.areaAddress!='' && this.areaLayers !=''){
                    this.getAllOrgListByName(this.select_word);
                }
                this.tableData =[];
                //this.data2 =[];
                this.addressVisible = false;
            },
            //地址选择器清空事件
            areaClear(){
                this.areaAddress = '';
                this.areaLayers = '';
                this.areaAddressName ='';
                this.Province ='';
                this.City = '';
                this.County = '';
                this.Street = '';
                this.CityList =[];
                this.CountyList = [];
                this.StreetList = [];
                this.tableData =[];
                this.data2 =[];
            },
            //地址选择器点击取消事件
            areaCancel(){
                this.addressVisible = false;
            },
            //清空地址输入框是触发的事件
            clearAreaAddress(){
                this.data2 =[];
                this.tableData = [];
            },
            getNodes (val) {
                //this.aresId = val;
                let idArea = '';
                let sizeArea;
                if (!val) {
                    idArea = "0";
                    sizeArea = 0
                } else if (val.length === 1) {
                    idArea = val[0];
                    sizeArea = val.length // 3:一级 4:二级 6:三级
                } else if (val.length === 2) {
                    idArea = val[1];
                    sizeArea = val.length // 3:一级 4:二级 6:三级
                }else if (val.length === 3) {
                    idArea = val[2];
                    sizeArea = val.length;// 3:一级 4:二级 6:三级
                }
                // console.log(idArea);
                this.$axios.get("/SysArea/GetAreaList", {
                    params: {
                        uid: "0",
                        orgid: this.qOrgId,
                        id: idArea
                    }
                }).then(response => {
                    if (response) {
                        let Items = response;
                        // console.log(Items.length);
                        if (sizeArea === 0) { // 初始化 加载一级 省
                            this.options = Items.map((value, i) => {
                                return {
                                    value: value.value,
                                    label: value.label,
                                    children: []
                                }
                            })
                        } else if (sizeArea === 1) { // 点击一级 加载二级 市
                            this.options.map((value, i) => {
                                if (value.value === val[0]) {
                                    if (!value.children.length) {
                                        value.children = Items.map((value, i) => {
                                            return {
                                                value: value.value,
                                                label: value.label,
                                                children: []
                                            }
                                        })
                                    }
                                }
                            })
                        } else if (sizeArea === 2) { // 点击二级 加载三级 区
                            this.options.map((value, i) => {
                                if (value.value === val[0]) {
                                    value.children.map((value, i) => {
                                        if (value.value === val[1]) {
                                            if (!value.children.length) {
                                                value.children = Items.map((value, i) => {
                                                    return {
                                                        value: value.value,
                                                        label: value.label,
                                                        children: []
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }else if(sizeArea === 3){
                            this.options.map((value, i) => {
                                if (value.value === val[0]) {
                                    value.children.map((value, i) => {
                                        if(value.value === val[1]){
                                            value.children.map((value, i) => {
                                                if (value.value === val[2]) {
                                                    if (!value.children.length) {
                                                        value.children = Items.map((value, i) => {
                                                            return {
                                                                value: value.value,
                                                                label: value.label
                                                            }

                                                        })
                                                    }
                                                }
                                            })
                                        }

                                    })
                                }
                            })

                        }
                    } else {
                        console.log(response);
                    }
                }, error => {
                    console.log(error);
                })
            },
            handleItemChange (val) {
                this.getNodes(val);
                //this.getOrgtree(val);
            },
            visOnChange(val){
                if(val == true){
                }else{
                }
            },
            // changeArea(val){
            //     this.data2 = [];
            //     this.tableData = [];
            //     let j = 0;
            //     this.getNodes(val);
            //     let area = JSON.parse(JSON.stringify(this.aresId));
            //     if(val.length == 4){
            //         this.getOrgtree(this.aresId);
            //     }else{
            //         if(area.length == val.length){
            //             for(let i = 0; i< val.length; i++){
            //                 if(area[i] == val[i]){
            //                     j++;
            //                 }
            //             }
            //         }
            //         console.log(area);
            //         if(j == val.length){
            //             this.getOrgtree(this.aresId);
            //         }
            //     }
            //     this.aresId = val;
            //     let l = val.length;
            //     l=-l *160;
            //     // console.log(l);
            //     //document.getElementById('.wggcascader .el-cascader-menu').style.left= "-160px";
            //     // console.log(document.getElementsByClassName('el-cascader-menu')[0].style);
            //     // if(val.length != 4){
            //     //     document.getElementsByClassName('el-cascader-menu')[0].style.marginLeft= l+"px";
            //     // }
            //     // document.getElementsByClassName('el-cascader-menus')[0].style.marginTop= "50px";
            // },
            //获取角色数据
            async getRoleData(){
                this.showColumn = true;
                var vm=this;
                //获取200角色信息
                SysRoleListNoAdmin(vm,{
                    PageIndex: 0,
                    PageSize: 200
                }).then(res => {
                    console.log(res);
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    this.roledata = res.Record;

                }).catch(error => {
                    console.log(error);
                    this.$message({ showClose: true, message: '角色信息获取错误',type: 'error'});
                });
            },
            //判断当前是否有选中的节点
            pdChecked(){
                let i = this.$refs.tree.getCheckedKeys();
                console.log(i);
                if(i.length > 0) {
                    this.flam = 1;
                }else {
                    this.flam = 0;
                }
            },
            //获取选中节点的主键
            changeTable(CheckedKeys, CheckedNodes){
                let key = CheckedKeys;
                this.qOrgId = key.OrgId;
                this.qOrgCode = key.EnCode;
                this.qInvitationCode = key.InvitationCode;
                this.getData('');
                console.log(key);
            },
            //获取组织树
            getOrgtree(area, i){
                this.$axios.get("/SysOrganize/GetAllOrgForUser", {
                    params: {
                        addressId: area,
                        rank: i
                    }
                }).then(
                    res => {
                        console.log(res);
                        this.data2 = res;

                        console.log(this.data2);
                    },
                    error => {
                        console.log(error);
                    }
                );
                // this.$axios.get("/SysOrganize/GetOrgListForUser", {
                //     params: {
                //         PageIndex: this.pageIndex - 1,
                //         PageSize: this.pageSize,
                //         uid: this.uid,
                //         orgid: this.qOrgId,
                //         value: array[0] + ","+ array[1]+"," + array[2]+","+ array[3]
                //     }
                // }).then(
                //     res => {
                //         console.log(res);
                //         this.loading = false;
                //         this.data2 = res;
                //
                //         console.log(this.data2);
                //     },
                //     error => {
                //         console.log(error);
                //         this.loading = false;
                //     }
                // );
            },
            /**
             * 用户列表获取数据
             * query:查询参数
             *  */
            async getData(query) {
                var vm=this;
                console.log(this.qOrgId);
                this.loading = true;
                this.qPhIdList =[],
                    SysUserList(vm,{
                        pageindex: this.pageIndex - 1,
                        pagesize: this.pageSize,
                        Type:'R', //获取角色信息
                        uid: this.userid,
                        orgid: this.qOrgId,
                        queryfilter:query
                    }).then(res => {
                        this.loading = false;
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        console.log(res.Record);
                        this.tableData = res.Record;
                        this.qPhIdList = res.Record;
                        this.totalCount = Number(res.totalRows);
                    }).catch(error =>{
                        console.log(error);
                        this.loading = false;
                        this.$message({ showClose: true, message: '用户列表获取错误', type: 'error' })
                    })
            },
            // // 获取数据
            // getData(query) {
            //     this.loading = true;
            //     this.$axios.get("/SysUser/GetSysUserList", {
            //         params: {
            //             PageIndex: this.pageIndex - 1,
            //             PageSize: this.pageSize,
            //             uid: this.uid,
            //             orgid: this.orgid
            //         }
            //     }).then(
            //         res => {
            //             this.loading = false;
            //
            //             this.tableData = res.Record;
            //             this.totalCount = Number(res.totalRows);
            //         },
            //         error => {
            //             console.log(error);
            //             this.loading = false;
            //         }
            //     );
            // },

            //获取所有组织列表
            getAllOrgListByName(queryfilter){
                this.qPhIdList =[],
                    this.loading = true;
                this.showColumn = true;
                this.$axios.get("/SysOrganize/GetAllOrgListByNameForUser", {
                    params: {
                        pageindex: this.pageIndex - 1,
                        pagesize: this.pageSize,
                        uid: "",
                        orgid: "",
                        orgName: queryfilter,
                        addressId: this.areaAddress,
                        rank: this.areaLayers
                    }
                }).then(
                    res => {
                        this.loading = false;
                        console.log(res);
                        this.data2 = res;
                    },
                    error => {
                        this.loading = false;
                        console.log(error);
                    }
                );
            },
            //获取所有人员信息
            getAllUserList(queryfilter){
                this.qPhIdList =[],
                    this.loading = true;
                this.showColumn = false;
                this.$axios.get("/SysUser/GetSysUserList", {
                    params: {
                        pageindex: this.pageIndex - 1,
                        pagesize: this.pageSize,
                        uid: "",
                        orgid: "",
                        queryfilter: queryfilter
                    }
                }).then(
                    res => {
                        this.loading = false;
                        console.log(res);
                        this.tableData = res.Record;
                        this.qPhIdList = res.Record;
                        this.totalCount = Number(res.totalRows);

                    },
                    error => {
                        this.loading = false;
                        console.log(error);
                    }
                );
            },
            //搜索按钮
            search() {
                this.is_search = true;
                var queryfilter = this.select_word;
                this.getAllOrgListByName(queryfilter);
                this.qOrgId = '';
                this.qOrgCode ="";
                this.is_search = false;
                // if(this.select_word!=''){
                //     var queryfilter = this.select_word;
                //     //var queryfilter='{"[or-dictionary0]*dictionary*or": { "OrgName*str*like": "'+this.select_word+'", "EnCode*str*like": "'+this.select_word+'" }}';
                //     this.queryF = queryfilter;
                //     this.getAllOrgListByName(queryfilter);
                //     this.qOrgId = '';
                //     // if(this.qOrgId !=''){
                //     //     console.log(queryfilter);
                //     //     this.getData(queryfilter);
                //     // }else{
                //     //     this.getAllUserList(queryfilter);
                //     // }
                //     this.is_search = false;
                // }else{
                //     //this.getData('');
                //     this.is_search = false;
                // }
                this.tableData =[];
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                };
                this.editVisible = true;
            },
            //新增按钮
            PageAdd() {
                //this.pdChecked();
                if(this.qOrgId != ""){
                    this.dialogState = "add";
                    this.form = { realName: "",
                        mobilePhone: "",
                        rolesid: [],
                        enabledMark: "0",};
                    this.editVisible = true;
                }else{
                    this.$message({
                        message: "请先在左侧选取组织！",
                        type: "warning"
                    });
                }
            },
            //编辑按钮
            PageEdit() {
                if(this.qOrgId != ""){
                    let object = this.singleSelection;
                    var me=this;
                    // ;
                    let id = object.length > 0 ? object[0].PhId : 0;
                    if(this.PhIdList.length ==1){
                        if(this.PhIdList[0].Account == 'admin'){
                            this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
                            return;
                        }
                        if(this.PhIdList[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (this.PhIdList.length ==1) {
                        //this.form=object[0];

                        var roles=[];
                        console.log(this.PhIdList[0]);
                        if(this.PhIdList[0].Roles.length>0){
                            this.PhIdList[0].Roles.forEach(el =>{
                                roles.push(el.PhId);
                            })
                        }
                        this.form.phid=this.PhIdList[0].PhId;
                        this.form.realName=this.PhIdList[0].RealName;
                        this.form.mobilePhone=this.PhIdList[0].MobilePhone;
                        this.form.rolesid=roles;
                        this.form.enabledMark= String(this.PhIdList[0].EnabledMark);
                        //改变更新状态
                        this.dialogState = "edit";
                        this.dialogTitle = "编辑";
                        this.editVisible = true;
                        //获取移交记录
                        this.getTransData(id);

                    } else {
                        this.$message({ showClose: true,message: "请选中列表的其中一行", type: "warning"});
                    }
                }else{
                    this.$message({
                        message: "请先在左侧选取组织！",
                        type: "warning"
                    });
                }
                // let object = this.singleSelection;
                //
                // let id = object.length > 0 ? object[0].PhId : 0;
                // if (id != 0) {
                //     this.dialogState = "edit";
                //     this.editVisible = true;
                //     this.singleSelection = [];
                //
                // } else {
                //     this.$message({
                //         message: "请选中列表的其中一行",
                //         type: "warning"
                //     });
                // }
            },
            //关闭Dialog事件
            dialogClose(){
                console.log('123')
                this.$nextTick(()=>{
                    this.$refs['forms'].resetFields();
                })
            },
            //取消表单
            callof(formName){
                //隐藏弹出框
                this.editVisible = false;
                this.$nextTick(()=>{
                    this.$refs[formName].resetFields();
                })
            },
            //永久停用账号的提示
            messageTs(){
                this.$message.success("用户已被停用，无法正常登录，请联系系统管理员处理后再试！");
            },
            //删除按钮
            PageDelete() {
                if(this.qOrgId != ""){
                    let object = this.singleSelection;
                    let length = object.length;
                    if(this.PhIdList.length == 1){
                        if(this.PhIdList[0].Account == 'admin'){
                            this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
                            return;
                        }
                        if(this.PhIdList[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (this.PhIdList.length == 1) {
                        this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {

                            var vm=this;
                            this.loading = true;

                            //提交asiox
                            SysUserDelete(vm,{
                                id:this.PhIdList[0].PhId,
                                uid:this.userid,
                                orgid:this.qOrgId
                            }).then(res => {
                                this.loading = false;
                                if(res.Status=='success'){
                                    //设置状态，隐藏新增页面
                                    this.$message.success("删除成功");
                                    this.singleSelection = [];

                                    //刷新列表
                                    this.getData('');
                                }else{
                                    this.$message.error('删除失败,请重试!');
                                }
                            }).catch(error =>{
                                console.log(error);
                                this.loading = false;
                                this.$message.error('删除错误');
                            })

                        }).catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                    } else {
                        this.$message({
                            message: "请选中列表的其中一行",
                            type: "warning"
                        });
                    }
                }else{
                    this.$message({
                        message: "请先在左侧选取组织！",
                        type: "warning"
                    });
                }

            },
            //密码重置
            PageReset() {
                if(this.qOrgId != ""){
                    let object = this.singleSelection;
                    var vm=this;

                    let id = object.length > 0 ? object[0].PhId : 0;
                    if(this.PhIdList.length == 1 ){
                        if(this.PhIdList[0].Account == 'admin'){
                            this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
                            return;
                        }
                        if(this.PhIdList[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (this.PhIdList.length == 1) {
                        this.$confirm('确定对账号进行密码重置?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            SysUserUpdatePassword(vm,{
                                uid:this.PhIdList[0].PhId,
                                orgid:vm.qOrgId
                            }).then(res => {
                                if(res.Status==='error'){
                                    vm.$message.error(res.Msg);
                                    return
                                }
                                vm.$message.success('密码重置成功!  重置后密码为：123456');
                            }).catch(error =>{
                                console.log(error);
                                vm.$message({ showClose: true,message: "密码重置错误", type: "error"});
                            })
                        }).catch(() => {
                            this.$message({ type: 'info',message: '已取消密码重置！' });
                        });
                        this.singleSelection = [];
                    } else {
                        this.$message({ showClose: true,message: "请选中列表的其中一行", type: "warning"});
                    }
                }else{
                    this.$message({
                        message: "请先在左侧选取组织！",
                        type: "warning"
                    });
                }
            },
            //账号移交
            Transfer() {
                if(this.qOrgId != ""){
                    //账号移交
                    let object = this.singleSelection;
                    console.log(this.orgid);
                    let id = object.length > 0 ? object[0].PhId : 0;
                    if(this.PhIdList.length == 1){
                        if(this.PhIdList[0].Account == 'admin'){
                            this.$message.error("该用户为超级管理员，不能对其进行任何操作！");
                            return;
                        }
                        if(this.PhIdList[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (this.PhIdList.length == 1) {
                        var roles=[];
                        if(this.PhIdList[0].Roles.length>0){
                            this.PhIdList[0].Roles.forEach(el =>{
                                roles.push(el.PhId);
                            })
                        }

                        this.form.phid=this.PhIdList[0].PhId;
                        this.form.realName='';
                        this.form.mobilePhone='';
                        this.form.rolesid=roles;
                        this.form.enabledMark= String(this.PhIdList[0].EnabledMark);

                        this.jsonFlam = JSON.stringify(this.PhIdList[0]);
                        //改变更新状态
                        this.dialogState = "trans";
                        this.dialogTitle = "账号移交";
                        this.editVisible = true;

                        //获取移交记录
                        this.getTransData(this.PhIdList[0].PhId);

                    } else {
                        this.$message({ showClose: true,message: "请选中列表的其中一行", type: "warning"});
                    }
                }else{
                    this.$message({
                        message: "请先在左侧选取组织！",
                        type: "warning"
                    });
                }
            },
            // //删除按钮
            // PageDelete() {
            //     let length = this.singleSelection.length;
            //     if (length > 0) {
            //         this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
            //             confirmButtonText: "确定",
            //             cancelButtonText: "取消",
            //             type: "warning"
            //         })
            //             .then(() => {
            //                 this.$axios
            //                     .get("http://10.0.20.46:8028/api/GCW/SysUser/PostDelete", {
            //                         params: {
            //                             id: id
            //                         }
            //                     })
            //                     .then(res => {
            //
            //                         this.tableData.splice(this.idx, 1);
            //
            //                         this.$message.success("删除成功");
            //                         this.singleSelection = [];
            //                     });
            //             })
            //             .catch(() => {
            //                 this.$message({
            //                     type: "info",
            //                     message: "已取消删除"
            //                 });
            //             });
            //     } else {
            //         this.$message({
            //             message: "请选中列表的其中一行",
            //             type: "warning"
            //         });
            //     }
            // },
            // //密码重置
            // PageReset() {
            // },
            // //发送邀请吗
            // SendCode() {
            // },
            //选择行
            handleClickRow(row) {
                var list = JSON.parse(JSON.stringify(this.PhIdList));
                // this.singleSelection = [];
                // this.singleSelection.push(row);
                this.$refs.multipleTable.toggleRowSelection(row);
                // console.log(102,JSON.stringify(row));
                // console.log(103,JSON.stringify(this.PhIdList));
                // if(list == [] || list.length <1){
                //     this.PhIdList.push(row);
                //     console.log(JSON.stringify(row));
                //     console.log(111,JSON.stringify(this.PhIdList));
                // }else{
                //     console.log(222,JSON.stringify(this.PhIdList));
                //     var index = this.PhIdList.indexOf(row);
                //     console.log(index);
                //     if(index > -1){
                //         this.PhIdList.splice(index, 1);
                //     }else{
                //         this.PhIdList.push(row);
                //     }
                //     console.log(this.PhIdList);
                // }
                console.log(this.PhIdList);

            },
            // 保存 新增保存
            saveEdit(formName) {
                var data = {
                    uid: "0",
                    orgid: "0",
                    value: this.form.mobilePhone,
                }
                this.$axios.get('/SysUser/GetUserByPhone', {params: data})
                    .then(res => {
                        console.log(res);
                        console.log(this.dialogState);
                        if(res.Status == 'success'){
                            if(res.Data != null && res.Data.RealName != this.form.realName){
                                this.$confirm("此操作将改变该用户在所有组织下的称呼,其原有的称呼为  "+res.Data.RealName+"  ！是否继续?", "提示", {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                }).then(() => {
                                    this.$refs[formName].validate(valid => {
                                        if (valid) {

                                            if (this.dialogState === 'add') {
                                                this.addUser();
                                            } else if (this.dialogState === 'edit') {
                                                this.editUser();
                                            } else if (this.dialogState === 'trans') {
                                                this.transUser();
                                            }
                                        }
                                    });
                                }).catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消保存"
                                    });
                                });
                            }else{
                                this.$refs[formName].validate(valid => {
                                    if (valid) {

                                        if (this.dialogState === 'add') {
                                            this.addUser();
                                        } else if (this.dialogState === 'edit') {
                                            this.editUser();
                                        } else if (this.dialogState === 'trans') {
                                            this.transUser();
                                        }
                                    }
                                });
                            }
                        }else{
                            this.$message.error(res.Msg);
                            return
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                // this.$refs[formName].validate(valid => {
                //     if (valid) {
                //
                //         if(this.dialogState==='add'){
                //             this.addUser();
                //         }else if(this.dialogState==='edit'){
                //             this.editUser();
                //         }else if(this.dialogState==='trans'){
                //             this.transUser();
                //         }
                //     }
                // });
            },
            //新增
            addUser(){
                //获取缓存 的用户 组织，角色基本信息
                let cookiesUser = Auth.getUserInfoData();
                var vm=this;
                /**
                 * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
                 * 新增数据信息 编辑
                 *  */
                var userinfo={
                    PhId:this.form.phid,
                    PersistentState:1,
                    Account:this.form.mobilePhone,
                    Password:'123456',
                    RealName:this.form.realName,
                    NickName:this.form.realName,
                    MobilePhone:this.form.mobilePhone,
                    Type:1,
                    InvitationCode:'',
                    Description:'组织管理员新增'
                };


                //角色-组织-用户信息 实体信息组合
                var relations=[];
                var roles=this.form.rolesid;
                for(let i=0; i<roles.length;i++){
                    var roleItem=vm.roledata.filter(item =>{
                        return item.PhId===roles[i];
                    })

                    relations.push({
                        PersistentState:1,
                        UserId:'',
                        UserAccount:vm.form.mobilePhone,
                        OrgId:this.qOrgId,
                        OrgCode: this.qOrgCode,
                        //OrgCode:cookiesUser.orgInfo.EnCode,
                        RoleId:roles[i],
                        RoleCode:roleItem[0].EnCode,
                        EnabledMark: '0',
                        NickName: this.form.realName,
                        Verify:'1',
                        VerifyTime: new Date
                    })
                }


                this.loading = true;
                //提交asiox
                SysUserAdd(vm,{
                    otype:this.dialogState,
                    uid:'',
                    orgid:this.qOrgId,
                    infoData: { Mst:userinfo,Relation:relations}
                }).then(res => {
                    this.loading = false;

                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }

                    this.$message.success('保存成功!');
                    //设置状态，隐藏新增页面
                    this.dialogState = "";
                    this.editVisible = false;
                    //刷新列表
                    this.getData('');


                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({ showClose: true,message: "用户列表获取错误", type: "error"});

                })
            },
            //修改
            editUser(){

                //获取缓存 的用户 组织，角色基本信息
                let cookiesUser = Auth.getUserInfoData();
                var vm=this;
                /**
                 * 数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
                 *  编辑数据信息
                 * */
                    //var userinfo=this.singleSelection[0];
                var userinfo = this.PhIdList[0];
                userinfo.PersistentState=2;
                userinfo.Account=this.form.mobilePhone;
                userinfo.RealName=this.form.realName;
                userinfo.NickName=this.form.realName;
                userinfo.MobilePhone=this.form.mobilePhone;
                userinfo.EnabledMark = this.form.enabledMark;


                //角色-组织-用户信息 实体信息组合
                var relations=[];
                var roles=this.form.rolesid;
                for(let i=0; i<roles.length;i++){
                    var roleItem=vm.roledata.filter(item =>{
                        return item.PhId===roles[i];
                    })

                    relations.push({
                        PersistentState:1,
                        UserId:userinfo.PhId,
                        UserAccount:userinfo.MobilePhone,
                        OrgId:vm.qOrgId,
                        OrgCode: vm.qOrgCode,
                        //OrgCode:cookiesUser.orgInfo.EnCode,
                        RoleId:roles[i],
                        RoleCode:roleItem[0].EnCode,
                        EnabledMark: this.form.enabledMark,
                        NickName: this.form.realName,
                        Verify:'1',
                        VerifyTime: new Date,
                        OperatorCode: userinfo.OperatorCode
                    })
                }

                this.loading = true;
                //提交asiox
                SysUserUpdate(vm,{
                    otype:this.dialogState,
                    uid:this.userid,
                    orgid:this.qOrgId,
                    infoData: { Mst:userinfo,Relation:relations}
                }).then(res => {
                    this.loading = false;

                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }

                    this.$message.success('修改成功!');
                    //设置状态，隐藏新增页面
                    this.dialogState = "";
                    this.editVisible = false;
                    //清空选中项
                    this.singleSelection = [];
                    //刷新列表
                    this.getData('');

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({ showClose: true,message: "用户列表获取错误", type: "error"});

                })
            },
            //账号移交
            transUser(){
                //获取缓存 的用户 组织，角色基本信息
                let cookiesUser = Auth.getUserInfoData();
                var vm=this;
                //选中用户
                let selectUser = JSON.parse(this.jsonFlam);

                //var userinfo=this.singleSelection[0];
                var userinfo = this.PhIdList[0];
                userinfo.PersistentState=2;
                userinfo.Account=this.form.mobilePhone;
                userinfo.RealName=this.form.realName;
                userinfo.NickName=this.form.realName;
                userinfo.MobilePhone=this.form.mobilePhone;


                //角色-组织-用户信息 实体信息组合
                var relations=[];
                var roles=this.form.rolesid;
                for(let i=0; i<roles.length;i++){
                    var roleItem=vm.roledata.filter(item =>{
                        return item.PhId===roles[i];
                    })

                    relations.push({
                        PersistentState:1,
                        UserId:userinfo.PhId,
                        UserAccount:userinfo.MobilePhone,
                        OrgId:vm.qOrgId,
                        OrgCode: vm.qOrgCode,
                        //OrgCode:cookiesUser.orgInfo.EnCode,
                        RoleId:roles[i],
                        RoleCode:roleItem[0].EnCode,
                        EnabledMark: this.form.enabledMark,
                        NickName: this.form.realName,
                        Verify:'1',
                        VerifyTime: new Date,
                        OperatorCode: userinfo.OperatorCode
                    })
                }

                var rolesname=[];
                var rolesid=[];

                if(selectUser.Roles.length>0){
                    selectUser.Roles.forEach(el =>{
                        rolesname.push(el.Name);
                        rolesid.push(el.PhId);

                    })
                }

                var transrecord={
                    UserId:selectUser.PhId,
                    UserAccount:selectUser.Account,
                    RealName:selectUser.RealName,
                    MobilePhone:selectUser.MobilePhone,
                    RoleName:String(rolesname),
                    RoleId:String(rolesid)
                };


                this.loading = true;
                //提交asiox
                SysUserUpdate(vm,{
                    otype:this.dialogState,
                    uid:this.userid,
                    orgid:this.qOrgId,
                    infoData: { Mst:userinfo,Relation:relations,sysUserTransferRecord:transrecord}
                }).then(res => {
                    console.log(res);
                    this.loading = false;
                    if(res =='1'){
                        this.$message.error('不允许将账号移交给系统中已存在的用户，请更换用户信息后重试!');
                        return;
                    }
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }

                    this.$message.success('修改成功!');
                    //设置状态，隐藏新增页面
                    this.dialogState = "";
                    this.editVisible = false;
                    //清空选中项
                    this.singleSelection = [];
                    //刷新列表
                    this.getData('');

                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.$message({ showClose: true,message: "用户列表获取错误", type: "error"});

                })
            },
            // 保存编辑
            // saveEdit(formName) {
            //     this.$refs[formName].validate(valid => {
            //         if (valid) {
            //             //this.$set(this.tableData, this.idx, this.form);
            //             //this.$message.success(`修改第 ${this.idx+1} 行成功`);
            //             this.editVisible = false;
            //
            //             console.log(this.form);
            //             this.$message.success(`修改成功`);
            //         } else {
            //             console.log("error submit!!");
            //             return false;
            //         }
            //     });
            // }


            //模板下载
            onloadOrg:function(){
                /*if(!this.showReportMsg.show){
                    this.showReportMsg.flag=true;
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
                const isRightType = (file.type === 'application/vnd.ms-excel');

                if (!isRightType) {
                    this.$message.error('请选择Excel文档!');
                    return false
                }
            },
            //图片上传
            uploadFileMethod(param) {
                var _$this=this;
                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);
                //加时间戳，防止IE缓存
                formData.append('timeCode',(new Date()).getTime().toString());
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();

                let config_header = { "Content-Type": "multipart/form-data" };
                var new_header = Object.assign({},config_header, baseheader);
                //console.log(formData)
                let loading=this.$loading();
                loading.setText('文件正在上传...')
                let timer = setTimeout(function(){
                    loading.setText('数据比对中，请耐心等待..')
                },1500);
                axios.create(base).post('/SysUser/PostInportUser', formData, { headers:new_header }).then(res => {
                    loading.close();
                    var response=JSON.parse(res.data);
                    console.log(response);
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
                window.location.href = base.baseURL + "/File/GetExportFile?filePath=template&fileName=工会用户导入模板.xls";
            },
            showLoad:function(){
                this.showReportMsg.flag=false;
                this.showReportMsg.loadFlag=true;

            },
            downloadOrg:function(){
                var list =[];
                console.log(this.PhIdList);
                if(this.PhIdList.length < 1){
                    this.$message.warning(`请选择要导出的数据！`);
                    return;
                }else {
                    for(var i=0;i<this.PhIdList.length;i++){
                        if(this.PhIdList[i].OperatorCode !='' && this.PhIdList[i].OperatorCode !=null){
                            list.push(this.PhIdList[i].OperatorCode);
                        }
                    }
                }
                if(list.length != this.PhIdList.length){
                    this.$message.warning(`所选择的导出数据中存在错误数据（缺少操作员编码），请重新勾选！`);
                    return;
                }
                console.log(list);
                let param = {
                    'infoData': list
                };
                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfigUncontrol();

                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method: 'post',
                    url: '/SysUser/PostExportUserExcel',
                    data: param
                }).then(res => {
                    //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        /*let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                        myWindow.close();
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
            updateFile:function(){
                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();
                let loading=this.$loading();

                let timer = setTimeout(function(){
                    loading.setText('导入时间过长，请耐心等待，勿关闭浏览器')
                },3000);

                let param={
                    'IsIgnore':this.showReportMsg.loadFile.type,
                    'UploadPath':this.showReportMsg.loadFile.name,
                    //加时间戳，防止IE缓存
                    'timeCode':(new Date()).getTime().toString()
                };
                axios.create(base).post('/SysUser/PostSaveUser',qs.stringify(param), { headers:baseheader }).then(res => {
                    loading.close();

                    clearTimeout(timer);
                    res = qs.parse(res);
                    res = JSON.parse(res.data);
                    if (res.Status == 'success') {
                        this.showReportMsg.loadFlagSecond = false;
                        this.$message({showClose: true, message: '批量导入成功', type: 'success'});
                        this.$refs.piclist.clearFiles();
                    } else {
                        this.showReportMsg.loadFlagSecond = false;
                        this.$message({showClose: true, message: res.Msg, type: 'error'});
                        this.$refs.piclist.clearFiles();
                    }
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            }

        }
    };</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
    /*统一样式风格*/
    .handle-del{
        font-size: 14px;
        padding: 7px 15px;
    }
    .handle-del:hover{
        border-color: #00b7ee;
    }
    .box-input >>> .el-input__inner{
        border-radius: 4px 0 0 4px;
        height: 30px;
        line-height: 30px;
    }
    .box-input >>> .el-input__inner:focus{
        border-color: #ccc;
    }
    .box-seach{
        float:right;
        border-radius:0 4px 4px 0;
        margin:0;
        font-size: 18px;
        padding-top: 5px;
        padding-bottom:5px ;
        position:relative;
    }
    .box-seach:hover{
        background: #FFFFFF;
        color: #00b7ee;
    }
</style>
<style lang="scss" scoped>

    .el-checkbox-role {
        width: 100%;
        float: left;
        margin-left: 0px;
    }

    /* .el-checkbox-role >.el-checkbox__label{
            width: 80%;
        } */
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .moreBtnCon{
        float:right;
        height:32px;
        margin-left:10px;
        width:73px;
        border-radius: 3px;
        position: relative;
    }
    .moreBtn{
        position: absolute;
        height:30px;
        color:#fff;
        border-radius: 3px;
        overflow: hidden;
        cursor:pointer;
        z-index: 9;
        &:hover{
            height:auto;
        }
        >li{
            height:30px;
            line-height:30px;
            width:70px;
            text-align: center;
            background:#fff;
            color:#00B8EE;
            &:first-of-type{
                background:#00B8EE;
                color:#fff;
                &:hover{
                    background:#00B8EE;
                }
            }
            &:hover{
                background:#ddd;
            }
        }
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

</style>
<style>
    .AdminUserList .el-input--suffix .el-input__inner {
        margin: 0;
        padding-right: 0;
        height: 40px;
        line-height: 40px;
    }
    .block .el-input--suffix .el-input__inner {
        margin: 0;
        padding-right: 0;
        height: 32px;
        cursor:pointer;
        line-height: 32px;
    }
    .wggcascader .el-cascader-menu{
        display: inline-block;
        vertical-align: top;
        height: 204px;
        overflow: auto;
        border-right: solid 1px #e4e7ed;
        background-color: #fff;
        box-sizing: border-box;
        margin: 0;
        padding: 6px 0;
        min-width: 160px;
        width: 210px;
    }
    .borderRadius > input {
        border-radius: 4px 0 0 4px;
    }
</style>
