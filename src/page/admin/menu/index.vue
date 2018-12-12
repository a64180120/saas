<template>
    <div class="sys-page">
        <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <!--<el-select v-model="state_mark" placeholder="请选择菜单状态" class="handle-select mr10">-->
                        <!--<el-option label="全部" value=""></el-option>-->
                        <!--<el-option label="无效" value="0"></el-option>-->
                        <!--<el-option label="有效" value="1"></el-option>-->
                        <!--</el-select>-->
                        <el-input v-model="select_word" placeholder="菜单名称" prefix-icon="el-icon-search" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" @click="PageAdd">添加菜单</el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10" @click="PageEdit">修改菜单</el-button>
                        <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10" @click="PageDelete">删除菜单</el-button>
                        <!--<el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10" @click="PageReset">查看菜单</el-button>-->
                        <el-button type="info" icon="el-icon-lx-message" size="small" class="handle-del mr10" @click="ButtonManagement">按钮管理</el-button>
                    </el-col>
                </el-row>
            </div>
            <tree-table
                :data="tableData"
                :columns="columns"
                border
                ref="multipleTable"
                :expand-all="expandAll"
                v-loading="loading"
                highlight-current-row
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                @onRowClick="handleClickRow">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <!--<el-table-column label="序号" type="index" width="50"></el-table-column>-->
                <!--<el-table-column prop="Name" label="菜单名称" width="120"></el-table-column>-->
                <el-table-column label="连接" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.UrlAddress}}
                    </template>
                </el-table-column>
                <el-table-column label="目标" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.Type==='1'">无页面</span>
                        <span v-else-if="scope.row.Type==='2'">框架页</span>
                        <span v-else-if="scope.row.Type==='3'">弹出页</span>
                        <span v-else-if="scope.row.Type==='4'">新窗口</span>
                        <span v-else>{{scope.row.Type}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="菜单" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.IsMenu==='1'" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="展开"  align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.IsExpand==='1'" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="公共" align="center" >
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.IsPublic==='1'" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="有效" align="center" >
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.EnabledMark==='1'" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="介绍" align="center" >
                    <template slot-scope="scope">
                        {{ scope.row.Description}}
                    </template>
                </el-table-column>
            </tree-table>
            <!--<div class="pagination">-->
            <!--<el-pagination background @current-change="handleCurrentChange" layout="total,prev, pager, next" :total="totalCount">-->
            <!--</el-pagination>-->
            <!--</div>-->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogState=='add'?'新增':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                <el-form-item label="上级：" prop="ParentName">
                    <el-input v-model="form.ParentName" disabled></el-input>
                    <!--<el-option label="父节点" value="0"></el-option>-->
                    <!--<el-option-->
                    <!--v-for="item in form.ParentIds"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--<el-option label="全部" value=""></el-option>-->
                    <!--<el-option label="启用" value="0"></el-option>-->
                    <!--<el-option label="临时停用" value="1"></el-option>-->
                    <!--<el-option label="永久停用" value="2"></el-option>-->
                </el-form-item>
                <el-form-item label="菜单姓名：" prop="Name">
                    <el-input v-model="form.Name"></el-input>
                </el-form-item>
                <el-form-item label="连接：" prop="UrlAddress">
                    <el-input v-model="form.UrlAddress"></el-input>
                </el-form-item>
                <el-form-item label="图标：" prop="Icon">
                    <el-input v-model="form.Icon"></el-input>
                </el-form-item>
                <el-form-item label="目标：" prop="Type">
                    <el-select v-model="form.Type" placeholder="==请选择==" class="handle-select mr10">
                        <el-option label="无页面" value="1"></el-option>
                        <el-option label="框架页" value="2"></el-option>
                        <el-option label="弹出页" value="3"></el-option>
                        <el-option label="新窗口" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="SortCode">
                    <el-input v-model="form.SortCode"></el-input>
                </el-form-item>
                <el-form-item label="选项：">
                    <el-checkbox v-model="form.IsMenu">菜单 </el-checkbox>
                    <el-checkbox v-model="form.IsPublic">公共</el-checkbox>
                    <el-checkbox v-model="form.IsExpand">展开</el-checkbox>
                    <el-checkbox v-model="form.EnabledMark">有效</el-checkbox>
                    <el-checkbox v-model="form.AllowEdit">允许编辑</el-checkbox>
                    <el-checkbox v-model="form.AlowDelete">允许删除</el-checkbox>
                </el-form-item>
                <el-form-item label="介绍：" prop="Description">
                    <el-input v-model="form.Description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--按钮管理弹出页-->
        <el-dialog title="按钮管理" :visible.sync="buttonManage" width="60%">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <el-input v-model="select_Button" placeholder="按钮编码/名称" prefix-icon="el-icon-search" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="searchBntton">搜索</el-button>

                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" @click="PageAddButton">添加按钮</el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10" @click="PageEditButton">修改按钮</el-button>
                        <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10" @click="PageDeleteButton">删除按钮</el-button>
                        <!--<el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10" @click="PageReset">查看菜单</el-button>-->
                        <!--<el-button type="info" icon="el-icon-lx-message" size="small" class="handle-del mr10" @click="SendCode">按钮管理</el-button>-->
                    </el-col>
                </el-row>
            </div>
            <tree-table
                :data="tableDataButton"
                :columns="columnsButton"
                border
                ref="multipleTableButton"
                :expand-all="expandAllButton"
                v-loading="loadingButton"
                highlight-current-row
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                @onRowClick="handleClickRow">
                <el-table-column label="位置"  align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.Location==='1'">初始</span>
                        <span v-else-if="scope.row.Location==='2'">选中</span>
                        <span v-else>{{scope.row.Location}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="事件"   align="center">
                    <template slot-scope="scope">
                        {{ scope.row.JsEvent}}
                    </template>
                </el-table-column>
                <el-table-column label="连接" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.UrlAddress}}
                    </template>
                </el-table-column>
                <el-table-column label="公共" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.IsPublic==='1'" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="有效" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.EnabledMark==='1'" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
            </tree-table>
            <!--<div class="pagination">-->
            <!--<el-pagination background @current-change="handleCurrentChange" layout="total,prev, pager, next" :total="totalCount">-->
            <!--</el-pagination>-->
            <!--</div>-->
        </el-dialog>
        <!--按钮编辑页-->
        <el-dialog :title="dialogButton=='add'?'新增按钮':'修改按钮'" :visible.sync="editButton" width="40%">
            <el-form ref="formButton" :model="formButton" :rules="rulesButton" label-width="100px" label-position="right">
                <el-form-item label="名称：" prop="Name">
                    <el-input v-model="formButton.Name"></el-input>
                </el-form-item>
                <el-form-item label="编号：" prop="EnCode">
                    <el-input v-model="formButton.EnCode"></el-input>
                </el-form-item>
                <!--<el-form-item label="图标：" prop="Icon">-->
                    <!--<el-input v-model="formButton.Icon"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="上级按钮：" prop="ParentName">
                    <el-input v-model="formButton.ParentName" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="位置：" prop="Location">
                    <el-select v-model="formButton.Location" placeholder="==请选择==" class="handle-select mr10">
                        <el-option label="初始" value="1"></el-option>
                        <el-option label="选中" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件：" prop="JsEvent">
                    <el-input v-model="formButton.JsEvent"></el-input>
                </el-form-item>
                <el-form-item label="连接：" prop="UrlAddress">
                    <el-input v-model="formButton.UrlAddress"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="SortCode">
                    <el-input v-model="formButton.SortCode"></el-input>
                </el-form-item>
                <el-form-item label="选项：">
                    <el-checkbox v-model="formButton.IsPublic">公共</el-checkbox>
                    <el-checkbox v-model="formButton.EnabledMark">有效</el-checkbox>
                    <el-checkbox v-model="formButton.AllowEdit">允许编辑</el-checkbox>
                    <el-checkbox v-model="formButton.AlowDelete">允许删除</el-checkbox>
                </el-form-item>
                <el-form-item label="描述：" prop="Description">
                    <el-input v-model="formButton.Description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveButton('formButton')">保 存</el-button>
                <el-button @click="editButton = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import treeTable from "@/components/tree-table";
    export default {
        name: "MenuList",
        components: { treeTable },
        data() {
            return {
                columns: [
                    {
                        text: "菜单名称",
                        value: "Name",
                        width: 200,
                        //align:"center"
                    }
                ],
                columnsButton: [
                    {
                        text: "按钮名称",
                        value: "Name",
                        width: 200,
                        //align:"center"
                    }
                ],
                loading: false,
                tableData: [], //table数据
                tableDataButton:[],
                qData: [],
                // pageSize: 10, //pageSize
                // pageIndex: 1, //pageIndex
                // totalCount: 0, //总页数
                singleSelection: [], //选中行
                //state_mark: "", //菜单状态
                select_word: "", //搜索字段
                select_Button: "",//菜单按钮搜索字段
                expandAll: true,
                expandAllButton: true,
                loadingButton: false,
                dialogState: "add",
                editVisible: false,
                buttonManage: false,
                dialogButton: "add",
                editButton : false,
                is_search: false,
                qMenuId:"",
                qParentId: "",
                qParentName: "",
                qParentButtonId: "",
                qParentButtonName:"",
                form: {
                    Name: "",
                    UrlAddress: "",
                    Icon: "",
                    Type: "",
                    EnCode:"",
                    SortCode: "",
                    ParentId: "",
                    ParentName:"",
                    Description: "",
                    IsMenu: false,
                    IsPublic: false,
                    IsExpand: false,
                    EnabledMark: true,
                    AllowEdit: false,
                    AlowDelete: false
                },
                rules: {
                    Name: [
                        { required: true, message: "请输入菜单姓名", trigger: "blur" }
                    ],
                    UrlAddress: [
                        { required: true, message: "请输入相应连接", trigger: "blur" }
                    ],
                    Type: [
                        { required: true, message: "请选择目标状态", trigger: "change" }
                    ]
                },
                formButton:{
                    Name: "",
                    EnCode: "",
                    Icon: "",
                    MenuId: "",
                    ParentId: "",
                    ParentName: "",
                    Location: "",
                    JsEvent: "",
                    UrlAddress:"",
                    SortCode: "",
                    Description: "",
                    IsPublic: false,
                    EnabledMark: true,
                    AllowEdit: false,
                    AlowDelete: false
                },
                rulesButton: {
                    // ParentId: [
                    //     { required: true, message: "请选择父级按钮", trigger: "change" }
                    // ],
                    Name: [
                        { required: true, message: "请输入按钮姓名", trigger: "blur" }
                    ],
                    EnCode: [
                        { required: true, message: "请输入按钮编码", trigger: "blur" }
                    ],
                    SortCode: [
                        { required: true, message: "请输入按钮排序", trigger: "blur" }
                    ],
                    Location: [
                        { required: true, message: "请选择位置状态", trigger: "change" }
                    ]
                }
            };
        },
        created() {
            this.getData();
        },
        computed: {},
        //components: {},

        methods: {
            // 分页导航
            // handleCurrentChange(val) {
            //     this.pageIndex = val;
            //     this.getData();
            // },
            // 获取数据
            //选择行
            message(row) {
                this.$message.info(row.event);
            },
            handleCurrentChange(row) {
                console.log(row);
            },
            handleClickRow(row) {
                console.log(row);
                this.singleSelection.push(row);

                console.log(this.singleSelection);
                //alert(this.singleSelection);
                console.log(this.singleSelection);
            },
            getData() {
                this.loading = true;
                this.$axios.get("/SysMenu/GetSysMenuList", {
                    params: {
                        PageIndex: "0",
                        PageSize: "20",
                        uid: "8",
                        orgid: "0"
                    }
                }).then(
                    res => {
                        this.loading = false;
                        console.log(res);
                        this.tableData = res;
                        //let resultData = JSON.parse(res);

                        console.log(this.tableData);

                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                    }
                );
            },
            // 获取相应菜单下按钮的数据
            getDataButton(menuId) {
                console.log(menuId);
                this.loadingButton = true;
                this.$axios.get("/SysMenu/GetSysMenuButtonList", {
                    params: {
                        // PageIndex: this.pageIndex - 1,
                        // PageSize: this.pageSize,
                        uid: "8",
                        orgid: "0",
                        // menuId : "323181120000003",
                        menuId : menuId
                    }
                }).then(
                    res => {
                        console.log(res);
                        this.loadingButton = false;
                        this.tableDataButton = res;
                        console.log(this.tableDataButton);
                        //this.totalCount = Number(resultData.totalRows);

                    },
                    error => {
                        console.log(error);
                        this.loadingButton = false;
                    }
                );
            },
            search() {
                this.loading = true;
                if(this.select_word == "")
                {
                    this.getData();
                } else{
                    this.$axios.get("/SysMenu/GetMenuNameList", {
                        params: {
                            PageIndex: "0",
                            PageSize: "20",
                            uid: "8",
                            orgid: "0",
                            value: this.select_word
                        }
                    }).then(
                        res => {
                            this.loading = false;
                            console.log(res);
                            //let resultData = JSON.parse(res);
                            this.tableData = res;
                            console.log(this.tableData);

                        },
                        error => {
                            console.log(error);
                            this.loading = false;
                        }
                    );
                }
                this.is_search = true;
            },
            searchBntton() {
                this.loadingButton = true;
                if(this.select_Button == "")
                {
                    this.getDataButton(this.qMenuId);
                } else{
                    this.$axios.get("/SysMenu/GetMenuButtonNameList", {
                        params: {
                            uid: "8",
                            orgid: "0",
                            value: this.select_Button,
                            menuId : this.qMenuId
                        }
                    }).then(
                        res => {
                            this.loadingButton = false;
                            console.log(res);
                            //let resultData = JSON.parse(res);
                            this.tableDataButton = res;
                            console.log(this.tableDataButton);
                        },
                        error => {
                            console.log(error);
                            this.loadingButton = false;
                        }
                    );
                }
                this.is_search = true;
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
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                if(id != 0)
                {
                    this.qParentId = id;
                    this.qParentName = object[0].Name;
                } else {
                    this.qParentId = "0";
                    this.qParentName = "父级菜单";
                }
                this.form ={};
                this.form.ParentName = this.qParentName;
                this.form.EnabledMark = true;
                this.dialogState = "add";
                this.editVisible = true;
            },
            //修改按钮
            PageEdit() {
                let object = this.singleSelection;

                let id = object.length > 0 ? object[0].PhId : 0;
                if (id != 0) {
                    this.qParentId = object[0].ParentId;
                    // this.loading=true
                    this.$axios.get("/SysMenu/GetSysMenu", {
                        params: {
                            uid: "0",
                            orgid: "0",
                            id: id
                        }
                    }).then(res => {
                        //this.loading=false;
                        console.log(res);
                        this.form = res;
                        this.qParentName = this.form.EnCode;
                        this.form.ParentName = this.qParentName;
                        if(this.form.IsMenu == "1"){
                            this.form.IsMenu = true;
                        } else {
                            this.form.IsMenu = false;
                        }
                        if(this.form.IsExpand == "1"){
                            this.form.IsExpand = true;
                        } else {
                            this.form.IsExpand = false;
                        }
                        if(this.form.IsPublic== "1"){
                            this.form.IsPublic = true;
                        } else {
                            this.form.IsPublic = false;
                        }
                        if(this.form.EnabledMark == "1"){
                            this.form.EnabledMark = true;
                        } else {
                            this.form.EnabledMark = false;
                        }
                        if(this.form.AllowEdit == "1"){
                            this.form.AllowEdit = true;
                        } else {
                            this.form.AllowEdit = false;
                        }
                        if(this.form.AlowDelete == "1"){
                            this.form.AlowDelete = true;
                        } else {
                            this.form.AlowDelete = false;
                        }
                        console.log(this.form);
                        this.dialogState = "edit";
                        this.editVisible = true;

                        this.singleSelection = [];
                        this.$forceUpdate();
                    });
                    this.dialogState = "edit";
                    this.editVisible = true;
                    this.singleSelection = [];

                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //删除按钮
            PageDelete() {
                //let length = this.singleSelection.length;
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                if (id != 0) {
                    var data = {
                        uid: "0",
                        orgid: "0",
                        id: id
                    };
                    this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$axios
                                .post("/SysMenu/PostDelete", data)
                                .then(res => {
                                    let resultData = res;
                                    console.log(res);
                                    this.tableData.splice(this.idx, 1);
                                    if(res.Status=='success'){
                                        this.$message.success("删除成功");
                                    }else{
                                        this.$message.error('删除失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getData();
                                });
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                    this.getData();
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //按钮管理
            ButtonManagement()
            {
                let object = this.singleSelection;
                let menuId = object.length > 0 ? object[0].PhId : 0;
                console.log(object);
                if (menuId != 0) {
                    this.buttonManage = true;
                    this.qMenuId = menuId;
                    this.getDataButton(menuId);
                    //this.$router.push({path: '/admin/menu/buttonManage', query: {PhId: id}});
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
                this.singleSelection = [];
            },
            //新增按钮
            PageAddButton() {
                //dialogButton=='add'?'新增按钮':'修改按钮'" :visible.sync="editButton"
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                if(id != 0)
                {
                    this.qParentButtonId = id;
                    this.qParentButtonName = object[0].Name;
                } else {
                    this.qParentButtonId = "0";
                    this.qParentButtonName = "父级按钮";
                }
                this.fromButton ={};
                this.fromButton.EnabledMark = true;
                this.formButton.ParentName = this.qParentButtonName;
                this.dialogButton = "add";
                this.editButton = true;
                console.log(this.qMenuId);
            },
            //修改按钮
            PageEditButton() {
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                if (id != 0) {
                    this.qParentButtonId = object[0].ParentId;
                    this.$axios.get("/SysMenu/GetSysMenuButton", {
                        params: {
                            uid: "0",
                            orgid: "0",
                            id: id
                        }
                    }).then(res => {
                        console.log(res);
                        this.formButton = res;
                        if(this.formButton.IsPublic== "1"){
                            this.formButton.IsPublic = true;
                        } else {
                            this.formButton.IsPublic = false;
                        }
                        if(this.formButton.EnabledMark == "1"){
                            this.formButton.EnabledMark = true;
                        } else {
                            this.formButton.EnabledMark = false;
                        }
                        if(this.formButton.AllowEdit == "1"){
                            this.formButton.AllowEdit = true;
                        } else {
                            this.formButton.AllowEdit = false;
                        }
                        if(this.formButton.AlowDelete == "1"){
                            this.formButton.AlowDelete = true;
                        } else {
                            this.formButton.AlowDelete = false;
                        }
                        this.qParentButtonName = this.formButton.Icon;
                        this.formButton.ParentName = this.qParentButtonName;
                        console.log(this.formButton);
                        this.dialogButton = "edit";
                        this.editButton = true;
                        this.singleSelection = [];
                        this.$forceUpdate();
                    });
                    this.dialogButton = "edit";
                    this.editButton = true;
                    this.singleSelection = [];

                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //删除按钮
            PageDeleteButton() {
                //let length = this.singleSelection.length;
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                if (id != 0) {
                    var data = {
                        uid: "0",
                        orgid: "0",
                        id: id
                    };
                    this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$axios
                                .post("/SysMenu/PostDeleteMenuButton", data)
                                .then(res => {
                                    let resultData = res;
                                    //this.tableData.splice(this.idx, 1);
                                    if(res.Status=='success'){
                                        this.$message.success("删除成功");
                                    }else{
                                        this.$message.error('删除失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getDataButton(this.qMenuId);
                                });
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                    this.getDataButton(this.qMenuId);
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //密码重置
            //PageReset() {},
            //发送邀请吗
            //SendCode() {},
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate(valid => {
                    console.log(this.$refs[formName]);
                    if (valid) {
                        if(this.form.IsMenu){
                            this.form.IsMenu = "1";
                        } else {
                            this.form.IsMenu = "0";
                        }
                        if(this.form.IsExpand){
                            this.form.IsExpand = "1";
                        } else {
                            this.form.IsExpand = "0";
                        }
                        if(this.form.IsPublic){
                            this.form.IsPublic = "1";
                        } else {
                            this.form.IsPublic = "0";
                        }
                        if(this.form.EnabledMark){
                            this.form.EnabledMark = "1";
                        } else {
                            this.form.EnabledMark = "0";
                        }
                        if(this.form.AllowEdit){
                            this.form.AllowEdit = "1";
                        } else {
                            this.form.AllowEdit = "0";
                        }
                        if(this.form.AlowDelete){
                            this.form.AlowDelete = "1";
                        } else {
                            this.form.AlowDelete = "0";
                        }
                        this.form.ParentId = this.qParentId;
                        //this.$set(this.tableData, this.idx, this.form);
                        //this.$message.success(`修改第 ${this.idx+1} 行成功`);
                        this.editVisible = false;
                        //console.log(formName);
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: this.form
                        };
                        console.log(this.form);
                        if(this.dialogState == "add")
                        {
                            this.$axios
                                .post("/SysMenu/PostAdd", data)
                                .then(res => {
                                    console.log(this.form);
                                    let resultData = res;
                                    this.tableData.splice(this.idx, 1);
                                    //清除form数据
                                    this.$refs[formName].resetFields();
                                    if(res.Status=='success'){
                                        this.$message.success("新增成功");
                                    }else{
                                        this.$message.error('新增失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getData();
                                });
                        }else {
                            this.$axios
                                .post("/SysMenu/PostUpdate", data)
                                .then(res => {
                                    console.log(this.form);
                                    let resultData = res;
                                    this.tableData.splice(this.idx, 1);
                                    //清除form数据
                                    this.$refs[formName].resetFields();
                                    if(res.Status=='success'){
                                        this.$message.success("修改成功");
                                    }else{
                                        this.$message.error('修改失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getData();
                                });
                        }
                        this.getData();
                        this.singleSelection = [];
                        //this.$message.success(`修改成功`);
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            // 保存按钮编辑
            saveButton(formName) {
                this.$refs[formName].validate(valid => {
                    console.log(this.$refs[formName]);
                    if (valid) {
                        if(this.formButton.IsPublic){
                            this.formButton.IsPublic = "1";
                        } else {
                            this.formButton.IsPublic = "0";
                        }
                        if(this.formButton.EnabledMark){
                            this.formButton.EnabledMark = "1";
                        } else {
                            this.formButton.EnabledMark = "0";
                        }
                        if(this.formButton.AllowEdit){
                            this.formButton.AllowEdit = "1";
                        } else {
                            this.formButton.AllowEdit = "0";
                        }
                        if(this.formButton.AlowDelete){
                            this.formButton.AlowDelete = "1";
                        } else {
                            this.formButton.AlowDelete = "0";
                        }
                        //this.$set(this.tableData, this.idx, this.form);
                        //this.$message.success(`修改第 ${this.idx+1} 行成功`);
                        this.editButton = false;
                        this.formButton.MenuId = this.qMenuId;
                        this.formButton.ParentId = this.qParentButtonId;
                        console.log(this.qMenuId);
                        console.log(this.formButton.MenuId);
                        console.log(this.formButton);
                        //console.log(formName);
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: this.formButton
                        };
                        console.log(this.dialogButton);
                        console.log(data);
                        if(this.dialogButton == "add")
                        {
                            this.$axios
                                .post("/SysMenu/PostAddMenuButton", data)
                                .then(res => {
                                    console.log(this.formButton);
                                    //let resultData = res;
                                    // this.tableData.splice(this.idx, 1);
                                    //清除form数据
                                    this.$refs[formName].resetFields();
                                    if(res.Status=='success'){
                                        this.$message.success("新增成功");
                                    }else{
                                        this.$message.error('新增失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getDataButton(this.qMenuId);
                                });
                        }else {
                            this.$axios
                                .post("/SysMenu/PostUpdateMenuButton", data)
                                .then(res => {
                                    console.log(this.formButton);
                                    // let resultData = res;
                                    // this.tableData.splice(this.idx, 1);
                                    //清除form数据
                                    this.$refs[formName].resetFields();
                                    if(res.Status=='success'){
                                        this.$message.success("修改成功");
                                    }else{
                                        this.$message.error('修改失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getDataButton(this.qMenuId);
                                });
                        }
                        this.getDataButton(this.qMenuId);
                        //this.$message.success(`修改成功`);
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            }
        }
    };
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
    .el-checkbox-option {
        width: 100%;
        float: left;
        margin-left: 0px;
    }
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
