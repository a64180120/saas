<template>
    <div class="sys-page">
        <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <el-select v-model="state_mark" placeholder="请选择菜单状态" class="handle-select mr10">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="无效" value="0"></el-option>
                            <el-option label="有效" value="1"></el-option>
                        </el-select>
                        <el-input v-model="select_word" placeholder="菜单编码/名称" prefix-icon="el-icon-search" class="handle-input mr10"></el-input>
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
                <el-table-column label="目标">
                    <template slot-scope="scope">
                        <span v-if="scope.row.Type==='1'">无页面</span>
                        <span v-else-if="scope.row.Type==='2'">框架页</span>
                        <span v-else-if="scope.row.Type==='3'">弹出页</span>
                        <span v-else-if="scope.row.Type==='4'">新窗口</span>
                        <span v-else>{{scope.row.KType}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="菜单">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.IsMenu===1" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="展开" >
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.IsExpand===1" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="公共" >
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.IsPublic===1" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="有效" >
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.EnabledMark===1" type="success" icon="el-icon-check" size="mini" circle></el-button>
                        <el-button v-else type="danger" icon="el-icon-close" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="介绍" >
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
                <el-form-item label="上级：" prop="parentId">
                    <el-select v-model="form.parentId" filterable placeholder="请选择父级菜单" class="handle-select mr10">
                        <el-option label="父节点" value="0"></el-option>
                        <el-option
                            v-for="item in form.parentIds"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                        <!--<el-option label="全部" value=""></el-option>-->
                        <!--<el-option label="启用" value="0"></el-option>-->
                        <!--<el-option label="临时停用" value="1"></el-option>-->
                        <!--<el-option label="永久停用" value="2"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单姓名：" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="连接：" prop="urlAddress">
                    <el-input v-model="form.urlAddress"></el-input>
                </el-form-item>
                <el-form-item label="目标：" prop="type">
                    <el-select v-model="form.type" placeholder="==请选择==" class="handle-select mr10">
                        <el-option label="无页面" value="1"></el-option>
                        <el-option label="框架页" value="2"></el-option>
                        <el-option label="弹出页" value="3"></el-option>
                        <el-option label="新窗口" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="sortCode">
                    <el-input v-model="form.sortCode"></el-input>
                </el-form-item>
                <el-form-item label="选项：" prop="option">
                    <el-checkbox-group v-model="form.option">
                        <el-checkbox label="isMenu" id="isMenu" name="isMenu" class="el-checkbox-option">菜单 </el-checkbox>
                        <el-checkbox label="isPublic" id="isPublic" name="isPublic" class="el-checkbox-option">公共</el-checkbox>
                        <el-checkbox label="isExpand" id="isExpand" name="isExpand" class="el-checkbox-option">展开</el-checkbox>
                        <el-checkbox label="enabledMark" id="enabledMark" name="enabledMark" class="el-checkbox-option">有效</el-checkbox>
                        <el-checkbox label="allowEdit" id="allowEdit" name="allowEdit" class="el-checkbox-option">允许编辑</el-checkbox>
                        <el-checkbox label="alowDelete" id="alowDelete" name="alowDelete" class="el-checkbox-option">允许删除</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="介绍：" prop="description">
                    <el-input v-model="form.description"></el-input>
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
            <el-table
                :data="tableDataButton"
                border
                class="table"
                v-loading="loading"
                ref="multipleTable2"
                highlight-current-row
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                @row-click="handleClickRow">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="Name" label="按钮名称" width="120"></el-table-column>
                <el-table-column prop="Location" label="位置"></el-table-column>
                <el-table-column prop="JsEvent" label="事件"></el-table-column>
                <el-table-column prop="UrlAddress" label="连接"></el-table-column>
                <el-table-column prop="IsPublic" label="公共" ></el-table-column>
                <el-table-column prop="EnabledMark" label="有效" ></el-table-column>
            </el-table>
            <!--<div class="pagination">-->
            <!--<el-pagination background @current-change="handleCurrentChange" layout="total,prev, pager, next" :total="totalCount">-->
            <!--</el-pagination>-->
            <!--</div>-->
        </el-dialog>
        <!--按钮编辑页-->
        <el-dialog :title="dialogButton=='add'?'新增按钮':'修改按钮'" :visible.sync="editButton" width="40%">
            <el-form ref="formButton" :model="formButton" :rules="rulesButton" label-width="100px" label-position="right">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="formButton.name"></el-input>
                </el-form-item>
                <el-form-item label="编号：" prop="enCode">
                    <el-input v-model="formButton.enCode"></el-input>
                </el-form-item>
                <el-form-item label="上级：" prop="parentName">
                    <el-select v-model="formButton.parentName" placeholder="请选择父级菜单" class="handle-select mr10">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="启用" value="0"></el-option>
                        <el-option label="临时停用" value="1"></el-option>
                        <el-option label="永久停用" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="位置：" prop="location">
                    <el-select v-model="formButton.location" placeholder="==请选择==" class="handle-select mr10">
                        <el-option label="初始" value="1"></el-option>
                        <el-option label="选中" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件：" prop="jsEvent">
                    <el-input v-model="formButton.urlAddress"></el-input>
                </el-form-item>
                <el-form-item label="连接：" prop="urlAddress">
                    <el-input v-model="formButton.urlAddress"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="sortCode">
                    <el-input v-model="formButton.sortCode"></el-input>
                </el-form-item>
                <el-form-item label="选项：" prop="option">
                    <el-checkbox-group v-model="formButton.option">
                        <el-checkbox label="1" id="isPublic" name="isPublic" class="el-checkbox-option">公共</el-checkbox>
                        <el-checkbox label="2" id="enabledMark" name="enabledMark" class="el-checkbox-option">有效</el-checkbox>
                        <el-checkbox label="3" id="allowEdit" name="allowEdit" class="el-checkbox-option">允许编辑</el-checkbox>
                        <el-checkbox label="4" id="alowDelete" name="alowDelete" class="el-checkbox-option">允许删除</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="描述：" prop="description">
                    <el-input v-model="formButton.description"></el-input>
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
                        width: 200
                    }
                ],
                loading: false,
                tableData: [], //table数据
                // pageSize: 10, //pageSize
                // pageIndex: 1, //pageIndex
                // totalCount: 0, //总页数
                singleSelection: [], //选中行
                state_mark: "", //菜单状态
                select_word: "", //搜索字段
                //dialogtitle: "新增",
                expandAll: true,
                dialogState: "add",
                editVisible: false,
                buttonManage: false,
                dialogButton: "add",
                editButton : false,
                is_search: false,
                form: {
                    name: "",
                    urlAddress: "",
                    type: "",
                    sortCode: "",
                    option: [],
                    parentIds: [{
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }, {
                        value: '选项4',
                        label: '龙须面'
                    }, {
                        value: '选项5',
                        label: '北京烤鸭'
                    }],
                    parentId: '',
                    description: "",
                    historyAccount:[
                        {name:'11',UrlAddress:'aa',Type:'ss',IsMenu:1,IsPublic:0,IsExpand:0,EnabledMark:1,Description:'xixi'},
                        {name:'22',UrlAddress:'aa',Type:'ss',IsMenu:1,IsPublic:0,IsExpand:0,EnabledMark:1,Description:'xixi'},
                        {name:'33',UrlAddress:'aa',Type:'ss',IsMenu:1,IsPublic:0,IsExpand:0,EnabledMark:1,Description:'xixi'},
                    ]
                },
                rules: {
                    parentId: [
                        { required: true, message: "请选择父级菜单", trigger: "change" }
                    ],
                    name: [
                        { required: true, message: "请输入菜单姓名", trigger: "blur" }
                    ],
                    urlAddress: [
                        { required: true, message: "请输入相应连接", trigger: "blur" }
                    ],
                    option: [
                        {
                            type: "array",
                            required: true,
                            message: "请至少选择一个目标",
                            trigger: "change"
                        }
                    ],
                    type: [
                        { required: true, message: "请选择目标状态", trigger: "change" }
                    ]
                },
                formButton:{
                    name: "",
                    enCode: "",
                    parentName: "",
                    location: "",
                    jsEvent: "",
                    urlAddress:"",
                    sortCode: "",
                    option: [],
                    description: "",
                    historyAccount:[
                        {name:'11',enCode:'aa',urlAddress:'ss',IsPublic:11,EnabledMark:1,Description:'xixi'},
                    ]
                },
                rulesButton: {
                    parentName: [
                        { required: true, message: "请选择父级按钮", trigger: "change" }
                    ],
                    name: [
                        { required: true, message: "请输入按钮姓名", trigger: "blur" }
                    ],
                    enCode: [
                        { required: true, message: "请输入按钮编码", trigger: "blur" }
                    ],
                    sortCode: [
                        { required: true, message: "请输入按钮排序", trigger: "blur" }
                    ],
                    option: [
                        {
                            type: "array",
                            required: true,
                            message: "请至少选择一个目标",
                            trigger: "change"
                        }
                    ],
                    location: [
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
                console.log(row.row);
                this.singleSelection.push(row.row);

                console.log(this.singleSelection);
                //alert(this.singleSelection);
                console.log(this.singleSelection);
            },
            getData() {
                this.loading = true;
                this.$axios.get("http://10.0.45.46:8884/api/GCW/SysMenu/GetSysMenuList", {
                    params: {
                        PageIndex: "0",
                        PageSize: "20",
                        uid: "8",
                        orgid: "0"
                    }
                }).then(
                    res => {
                        this.loading = false;
                        //let resultData = JSON.parse(res);
                        this.tableData = JSON.parse(res);
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
                this.loading = true;
                this.$axios.get("http://10.0.45.46:8884/api/GCW/SysMenu/GetSysMenuButtonList", {
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
                        this.loading = false;
                        let resultData = JSON.parse(res);
                        this.tableDataButton = resultData.Record;
                        //this.totalCount = Number(resultData.totalRows);
                        console.log(res);
                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                    }
                );
            },
            search() {
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
                this.dialogState = "add";
                this.editVisible = true;

            },
            //修改按钮
            PageEdit() {
                let object = this.singleSelection;

                let id = object.length > 0 ? object[0].PhId : 0;
                if (id != 0) {
                    //this.loading=true
                    // this.$axios.get("http://10.0.20.46:8028/api/GCW/SysUser/GetUser", {
                    //     params: {
                    //       id: id
                    //     }
                    //   }).then(res => {
                    //     //this.loading=false;
                    //     let resultData = JSON.parse(res);

                    //     this.dialogState = "edit";
                    //     this.editVisible = true;

                    //     this.singleSelection = [];
                    //   });

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
                    this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$axios
                                .post("http://10.0.45.46:8884/api/GCW/SysMenu/PostDelete", {
                                    params: {
                                        id: id

                                    }
                                })
                                .then(res => {
                                    let resultData = JSON.parse(res);
                                    this.tableData.splice(this.idx, 1);
                                    this.$message.success("删除成功");
                                    this.singleSelection = [];
                                });
                        })
                        .catch(() => {
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
            },
            //按钮管理
            ButtonManagement()
            {
                let object = this.singleSelection;
                let menuId = object.length > 0 ? object[0].PhId : 0;
                console.log(object);
                if (menuId != 0) {
                    this.buttonManage = true;
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
                this.dialogButton = "add";
                this.editButton = true;
            },
            //修改按钮
            PageEditButton() {
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                alert(id);
                if (id != 0) {
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
                    this.$confirm("此操作将删除该数据, 是否继续?", "删除提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$axios
                                .post("http://10.0.45.46:8884/api/GCW/SysMenu/PostDelete", {
                                    params: {
                                        id: id
                                    }
                                })
                                .then(res => {
                                    let resultData = JSON.parse(res);
                                    //this.tableData.splice(this.idx, 1);
                                    this.$message.success("删除成功");
                                    this.singleSelection = [];
                                });
                        })
                        .catch(() => {
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
            },
            //密码重置
            //PageReset() {},
            //发送邀请吗
            //SendCode() {},
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        //this.$set(this.tableData, this.idx, this.form);
                        //this.$message.success(`修改第 ${this.idx+1} 行成功`);
                        this.editVisible = false;
                        this.$axios
                            .post("http://10.0.45.46:8884/api/GCW/SysMenu/PostAdd", {
                                params: {
                                    uid: "8",
                                    orgid: "0",
                                    infoData: formName
                                }
                            })
                            .then(res => {
                                console.log(this.form);
                                let resultData = JSON.parse(res);
                                this.tableData.splice(this.idx, 1);
                                this.$message.success("修改成功");
                                this.singleSelection = [];
                            });

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
