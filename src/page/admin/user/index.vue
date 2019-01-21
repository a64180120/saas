<template>
    <div class="sys-page" style="background-color: #ffffff">
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
                        <el-input v-model="select_word" placeholder="用户名称/手机号码" prefix-icon="el-icon-search"
                                  class="handle-input mr10" size="small"></el-input>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>

                        <el-button type="info" icon="el-icon-lx-message" size="small" class="handle-del mr10" style="float: right"
                                   @click="Transfer">账号移交
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10" style="float: right"
                                   @click="PageReset">密码重置
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10" style="float: right"
                                   @click="PageDelete">删除
                        </el-button>

                        <!--<el-button type="info" icon="el-icon-lx-message" size="small" class="handle-del mr10"-->
                                   <!--@click="SendCode">发送邀请码-->
                        <!--</el-button>-->
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10" style="float: right"
                                   @click="PageEdit">修改
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" style="float: right"
                                   @click="PageAdd">添加
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <div style="width: 100%;">
                <div style="float: left; width: 16%; height: 100%;border: 1px solid #eaeaea;">
                    <div  class="block" style="margin-bottom:10px;background-color: #00B8EE;height: 50px;">
                        <!--<span class="demonstration">请选择要查看的组织所在区域</span>-->
                        <el-input v-model="areaAddressName" placeholder="请先选择地区" clearable @focus="getAreaAddress"
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
                    <div align="center">
                        工会组织列表
                    </div>
                    <div>
                        <el-tree
                            :data="data2"
                            :props="defaultProps"
                            @current-change="changeTable"
                            node-key="OrgId"
                            :expand-on-click-node="expandOnClickNode"
                            default-expand-all
                            :highlight-current="highlightCurrent"
                            :default-checked-keys="CheckedList"
                            ref="tree">
                        </el-tree>
                    </div>
                </div>
                <div style="float: right; width: 82%; height: 100%;border: 1px solid #eaeaea;">
                    <el-table
                        :data="tableData"
                        border
                        class="table"
                        v-loading="loading"
                        ref="multipleTable"
                        highlight-current-row
                        :header-cell-style="{background:'#d3e9f9',color:'#000',textAlign:'center'}"
                        @row-click="handleClickRow">
                        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                        <el-table-column label="序号" type="index" width="50"></el-table-column>
                        <!--<el-table-column prop="Account" label="用户编码" width="120"></el-table-column>-->
                        <el-table-column prop="RealName" label="用户名称" width="120"></el-table-column>
                        <el-table-column prop="MobilePhone" label="手机号码"></el-table-column>
                        <el-table-column label="角色">
                            <template slot-scope="scope">
                                  <span v-for="(v,index) in scope.row.Roles" :key="v.PhId">
                                    <span v-if="index<(scope.row.Roles.length-1)">{{v.Name}},</span>
                                    <span v-else>{{v.Name}}</span>
                                  </span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column prop="OrgName" label="所属工会"></el-table-column>-->
                        <el-table-column label="用户状态">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.EnabledMark===0" type="success" icon="el-icon-check" size="mini" circle></el-button>
                                <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                            </template>
                        </el-table-column>
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
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!--地址选择器-->
        <el-dialog :title="'地址选择'" :visible.sync="addressVisible" width="40%" :close="dialogClose">
            <template>
                <el-select v-model="Province" placeholder="" style="width: 20%" @change="changeProvince">
                    <el-option
                        v-for="item in ProvinceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
                <span>省</span>
                <el-select v-model="City" placeholder="" style="width: 20%" @change="changeCity">
                    <el-option
                        v-for="item in CityList"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
                <span>市</span>
                <el-select v-model="County" placeholder="" style="width: 20%" @change="changeCounty">
                    <el-option
                        v-for="item in CountyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
                <span>区</span>
                <el-select v-model="Street" placeholder="" style="width: 20%" @change="changeStreet">
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
                <el-button type="primary" @click="areaDefine">确 定</el-button>
                <el-button @click="addressVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    import Auth from "@/util/auth";
    import { SysUserAdd,SysUserUpdate,SysUserList,SysUserDelete,SysUserTransferList,SysUserUpdatePassword } from '@/api/user/userInfo'
    import { SysRoleList } from '@/api/role/roleInfo'
    import { isvalidatemobile } from '@/util/validate'

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
                }
            };
        },
        created() {
            this.getRoleData();
        },
        mounted: function () {
            this.getData('');
            //this.getAreaData();
            this.getNodes();
        },
        //计算
        computed: {
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid
                //orgid: this.qOrgId
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
                this.areaAddressName = this.Province.label;
                this.areaAddress = this.Province.value;
                this.areaLayers = '1';
                console.log(this.Province);
            },
            changeCity(){
                this.County = '';
                this.Street = '';
                this.CountyList = [];
                this.StreetList = [];
                this.selectArea(this.City.value, 2);
                this.areaAddress = this.City.value;
                this.areaLayers = '2';
                console.log(this.areaAddress)
                this.areaAddressName =this.Province.label+ "/"+ this.City.label;
            },
            changeCounty(){
                this.Street = '';
                this.StreetList = [];
                this.selectArea(this.County.value, 3);
                this.areaAddress = this.County.value;
                this.areaLayers = '3';
                this.areaAddressName = this.Province.label+ "/"+ this.City.label+ '/'+ this.County.label;
            },
            changeStreet(){
                this.areaAddress = this.Street.value;
                this.areaLayers = '4';
                this.areaAddressName = this.Province.label+ "/"+ this.City.label+ '/'+ this.County.label+ '/'+ this.Street.label;
            },
            areaDefine(){
                this.getOrgtree(this.areaLayers, this.areaAddress);
                this.addressVisible = false;
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
            // oneClick(){
            //     if(this.aresId.length > 1){
            //         let areaValues = this.aresId.splice(0, this.aresId.length);
            //         this.changeArea(areaValues);
            //     }
            // },
            // twoClick(){
            //     if(this.aresId.length > 1){
            //         let areaValues = this.aresId.splice(1, this.aresId.length-1);
            //         this.changeArea(areaValues);
            //     }
            //     console.log()
            // },
            // threeClick(){
            //     if(this.aresId.length > 2){
            //         let areaValues = this.aresId.splice(2, this.aresId.length-2);
            //         this.changeArea(areaValues);
            //     }
            // },
            // fourClick(){
            //     this.changeArea(this.aresId);
            // },
            handleItemChange (val) {
                this.getNodes(val);
                //this.getOrgtree(val);
            },
            visOnChange(val){
                alert("aaa");
                if(val == true){
                    alert("aaa");
                }else{
                    alert("bbb");
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
                var vm=this;
                //获取200角色信息
                SysRoleList(vm,{
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
                this.qOrgCode = key.ItemCode;
                this.getData('');
                console.log(key);
            },
            //获取组织树
            getOrgtree(i, area){
                this.$axios.get("/SysAdminOrganize/GetAllOrgForUser", {
                    params: {
                        rank: i,
                        areaCode: area
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
                this.loading = true;

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
            //获取所有人员信息
            getAllUserList(queryfilter){
                this.loading = true;
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
                if(this.select_word!=''){
                    var queryfilter='{"[or-dictionary0]*dictionary*or": { "RealName*str*like": "'+this.select_word+'", "MobilePhone*str*like": "'+this.select_word+'" }}';
                    this.queryF = queryfilter;
                    if(this.qOrgId !=''){
                        console.log(queryfilter);
                        this.getData(queryfilter);
                    }else{
                        this.getAllUserList(queryfilter);
                        // this.loading = true;
                        // console.log(this.pageIndex - 1);
                        // console.log(this.pageSize);
                        // this.$axios.get("/SysUser/GetSysUserList", {
                        //     params: {
                        //         pageindex: this.pageIndex - 1,
                        //         pagesize: this.pageSize,
                        //         uid: "",
                        //         orgid: "",
                        //         queryfilter: queryfilter
                        //     }
                        // }).then(
                        //     res => {
                        //         this.loading = false;
                        //         console.log(res);
                        //         this.tableData = res.Record;
                        //         this.totalCount = Number(res.totalRows);
                        //
                        //     },
                        //     error => {
                        //         this.loading = false;
                        //         console.log(error);
                        //     }
                        // );
                    }
                    this.is_search = false;
                }else{
                    this.getData('');
                    this.is_search = false;
                }
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
                    //debugger;
                    let id = object.length > 0 ? object[0].PhId : 0;
                    if(object.length > 0){
                        if(object[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (id != 0) {
                        //this.form=object[0];

                        var roles=[];
                        console.log(object[0]);
                        if(object[0].Roles.length>0){
                            object[0].Roles.forEach(el =>{
                                roles.push(el.PhId);
                            })
                        }
                        this.form.phid=object[0].PhId;
                        this.form.realName=object[0].RealName;
                        this.form.mobilePhone=object[0].MobilePhone;
                        this.form.rolesid=roles;
                        this.form.enabledMark= String(object[0].EnabledMark);
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
                    if(length> 0){
                        if(object[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (length > 0) {
                        this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {

                            var vm=this;
                            this.loading = true;

                            //提交asiox
                            SysUserDelete(vm,{
                                id:object[0].PhId,
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
                    if(object.length > 0){
                        if(object[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (id != 0) {
                        this.$confirm('确定对账号进行密码重置?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            SysUserUpdatePassword(vm,{
                                uid:object[0].PhId,
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
                    if(object.length > 0){
                        if(object[0].EnabledMark == '2'){
                            this.messageTs();
                            return;
                        }
                    }
                    if (id != 0) {
                        var roles=[];
                        if(object[0].Roles.length>0){
                            object[0].Roles.forEach(el =>{
                                roles.push(el.PhId);
                            })
                        }

                        this.form.phid=object[0].PhId;
                        this.form.realName='';
                        this.form.mobilePhone='';
                        this.form.rolesid=roles;
                        this.form.enabledMark= String(object[0].EnabledMark);

                        this.jsonFlam = JSON.stringify(object[0]);
                        //改变更新状态
                        this.dialogState = "trans";
                        this.dialogTitle = "账号移交";
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
                this.singleSelection = [];
                this.singleSelection.push(row);
                console.log(row);
                console.log(this.singleSelection);
            },
            // 保存 新增保存
            saveEdit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {

                        if(this.dialogState==='add'){
                            this.addUser();
                        }else if(this.dialogState==='edit'){
                            this.editUser();
                        }else if(this.dialogState==='trans'){
                            this.transUser();
                        }
                    }
                });
            },
            //新增
            addUser(){
                //获取缓存 的用户 组织，角色基本信息
                //let cookiesUser = Auth.getUserInfoData();
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
                        // OrgCode:cookiesUser.orgInfo.EnCode,
                        RoleId:roles[i],
                        RoleCode:roleItem[0].Name,
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
                var userinfo=this.singleSelection[0];
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
                        RoleCode:roleItem[0].Name,
                        EnabledMark: this.form.enabledMark,
                        NickName: this.form.realName,
                        Verify:'1',
                        VerifyTime: new Date
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

                var userinfo=this.singleSelection[0];
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
                        RoleCode:roleItem[0].Name,
                        EnabledMark: this.form.enabledMark,
                        NickName: this.form.realName,
                        Verify:'1',
                        VerifyTime: new Date
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
            }
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
        }
    };
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
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
</style>
<style>
    .block .el-input--suffix .el-input__inner {
        margin: 0;
        padding-right: 0;
        height: 80%;
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
</style>
