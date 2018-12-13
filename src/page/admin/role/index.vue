<template>
    <div class="sys-page">
        <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <el-select v-model="state_mark" placeholder="角色状态" class="handle-select mr10">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="激活" value="0"></el-option>
                            <el-option label="未激活" value="1"></el-option>
                        </el-select>
                        <el-input v-model="select_word" placeholder="角色编码/名称" prefix-icon="el-icon-search"
                                  class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10"
                                   @click="PageAdd">新增
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10"
                                   @click="PageEdit">修改
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10"
                                   @click="PageDelete">删除
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                v-loading="loading"
                ref="roleListTable"
                highlight-current-row
                :header-cell-style="{background:'#2780d1',color:'#fff'}"
                @row-click="handleClickRow">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="EnCode" label="角色编码" sortable width="120"></el-table-column>
                <el-table-column prop="Name" label="角色名称" width="120"></el-table-column>
                <el-table-column label="角色状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.EnabledMark===0">启用</span>
                        <span v-else-if="scope.row.EnabledMark===1">停用</span>
                        <span v-else>啦啦</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Description" label="备注"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total,prev, pager, next"
                               :page-size="pageSize" :total="totalCount">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogState=='add'?'新增':'编辑'" :visible.sync="editVisible" width="40%" style="height: 800px">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" v-if="showForm">
                <el-form-item label="角色名称：" prop="Name">
                    <el-input v-model="form.Name" placeholder="8位汉字以内"></el-input>
                </el-form-item>
                <el-form-item label="角色编码：" prop="EnCode">
                    <el-input v-model="form.EnCode"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="SortCode">
                    <el-input v-model="form.SortCode"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="Description">
                    <el-input v-model="form.Description" placeholder="15位汉字以内"></el-input>
                </el-form-item>
                <el-form-item label="账号状态：" prop="EnabledMark">
                    <el-radio-group v-model="form.EnabledMark">
                        <el-radio :label='0'>启用</el-radio>
                        <el-radio :label='1'>停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form ref="form2" :model="form2" :rules="rules2" label-width="100px" label-position="right" v-if="showForm2" style="height: 400px; overflow-y: auto">
                <el-form-item label="角色权限：">
                    <el-tree
                        :data="data2"
                        ref="tree"
                        show-checkbox
                        node-key="ItemId"
                        default-expand-all
                        :default-checked-keys="CheckedList"
                        :current-node-key="CheckedList2"
                        :render-content="renderContent">
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="showForm">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button @click="nextStep()">下一步</el-button>
            </span>
            <span slot="footer" class="dialog-footer" v-if="showForm2">
                <el-button @click="backStep()">上一步</el-button>
                <el-button type="primary" @click="saveEdit('form2')">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "AdminUserList",
        data() {
            return {
                data2: [],
                showForm : true,
                showForm2: false,
                form2: {},
                rules2: {},
                loading: false,
                loading2: false,
                loading3: false,
                tableData: [], //table数据
                pageSize: 20, //pageSize
                pageIndex: 1, //pageIndex
                totalCount: 0, //总页数
                singleSelection: [], //选中行
                state_mark: "", //用户状态
                select_word: "", //搜索字段
                //dialogtitle: "新增",
                dialogState: "add",
                editVisible: false,
                is_search: false,
                form: {
                    Name: "",
                    EnCode: "",
                    SortCode: "",
                    Description: "",
                    EnabledMark: '0'
                },
                rules: {
                    Name: [
                        {required: true, message: "请输入角色名称（8个汉字以内）", trigger: "blur"}
                    ],
                    EnCode: [
                        {required: true, message: "请输入角色编码", trigger: "blur"}
                    ],
                    Description: [
                        {required: true, message: "请输入该角色的备注（15个汉字以内）", trigger: "blur"}
                    ],
                    EnabledMark: [
                        {required: true, message: "请选择账号状态", trigger: "change"}
                    ]
                },
                form2:{
                    CheckedList: [],
                    CheckedList2: ""
                }
            };
        },
        created() {
            this.getData('');
            this.getData2();
        },
        computed: {},
        components: {},
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getData('');
            },
            setCheckedKeys() {
                this.$refs.tree.setCheckedKeys([3]);
            },
            getData2(){
                this.$axios.get("/SysMenu/GetMenuListAndButtonList", {
                    params: {
                        uid: "",
                        orgid: ""
                    }
                }).then(
                    res => {
                        this.checkStrictly = true;
                        this.data2 = res;
                    },
                    error => {
                        console.log(error);
                    }
                );
            },
            // 获取数据
            getData(query) {
                this.loading = true;
                this.$axios.get("/SysRole/GetSysRoleList", {
                    params: {
                        PageIndex: this.pageIndex - 1,
                        PageSize: this.pageSize,
                        uid: "",
                        orgid: "",
                        queryfilter:query
                    }
                }).then(
                    res => {
                        this.loading = false;

                        this.tableData = res.Record;
                        this.totalCount = Number(res.totalRows);
                        console.log(this.tableData);
                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                        this.$message({ showClose: true, message: '角色列表获取错误', type: 'error' });
                    }
                );
            },
            search() {
                // let queryfilter;
                // let shu;
                // if(this.state_mark == "") {
                //     if(this.select_word == "") {
                //         queryfilter = '';
                //     }else{
                //         queryfilter='{"[or-dictionary0]*dictionary*or": { "Name*str*like": "'+this.select_word+'", "EnCode*str*like": "'+this.select_word+'" }}';
                //     }
                // }else{
                //     // if(this.state_mark == '0'){
                //     //     shu = 0;
                //     // }else {
                //     //     shu = 1;
                //     // }
                //     if(this.select_word == ""){
                //         queryfilter = '{"AND":{"EnabledMark*byte*eq": "'+this.state_mark+'","Name*str*like": ""}}';
                //     }else{
                //         //queryfilter = '{"[or-dictionary0]*dictionary*or":{"AND":{"EnabledMark*byte*eq": "'+this.state_mark+'","Name*str*like": "'+this.select_word+'"},"AND":{"EnabledMark*byte*eq": "'+this.state_mark+'","EnCode*str*like": "'+this.select_word+'"}}}';
                //         queryfilter = '{"AND":{{"EnabledMark*byte*eq": '+this.state_mark+'},{"[or-dictionary0]*dictionary*or":{ "Name*str*like": "'+this.select_word+'", "EnCode*str*like": "'+this.select_word+'" }}}}'
                //     }
                // }
                // console.log(queryfilter);
                // this.getData(queryfilter);
                this.$axios.get("/SysRole/GetRoleByOnameOrOenCode", {
                    params: {
                        PageIndex: "0",
                        PageSize: "20",
                        uid: "8",
                        orgid: "0",
                        value: this.select_word + ","+this.state_mark
                        //value: '{"EnCode*string*like":"this.select_word" , "Name*string*like":"this.select_word"}'
                    }
                }).then(
                    res => {
                        this.loading = false;

                        this.tableData = res.Record;
                        this.totalCount = Number(res.totalRows);
                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                    }
                );
                //this.loading = false;
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
                this.form = {};
                this.singleSelection= [];
                this.CheckedList = [];
                this.showForm = true;
                this.showForm2 = false;
                this.dialogState = "add";
                this.editVisible = true;
            },
            //编辑按钮
            PageEdit() {
                this.showForm = true;
                this.showForm2 = false;
                let list;
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                console.log(id);
                if (id != 0) {
                    this.$axios.get("/SysRole/GetSysRole", {
                        params: {
                            uid: "0",
                            orgid: "0",
                            id: id
                        }
                    }).then(res => {
                        //this.loading=false;
                        console.log(res);
                        this.form = res;
                        console.log(this.form);
                        this.dialogState = "edit";
                        this.editVisible = true;

                        this.singleSelection = [];
                        this.$forceUpdate();
                    });
                    this.$axios.get("/SysRole/GetAuthorizeListByRoleId", {
                        params: {
                            uid: "0",
                            orgid: "0",
                            id: id
                        }
                    }).then(res => {
                        console.log(res);
                        //this.CheckedList = [403181206000002, 403181206000003];
                        this.CheckedList = res;
                        console.log(this.CheckedList);
                        this.dialogState = "edit";
                        this.editVisible = true;
                        this.singleSelection = [];
                    });
                    //this.$refs.tree.setCheckedKeys(list);
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
                let length = this.singleSelection.length;
                let object = this.singleSelection;
                let id = object.length > 0 ? object[0].PhId : 0;
                console.log(id);
                if (length > 0) {
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
                            this.$axios.post("/SysRole/PostDelete", data)
                                .then(res => {
                                    this.tableData.splice(this.idx, 1);
                                    if(res.Status=='success'){
                                        this.$message.success("删除成功");
                                    }else{
                                        this.$message.error('删除失败,请重试!');
                                    }
                                    //this.$message.success("删除成功");
                                    this.singleSelection = [];
                                });
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                    this.getData('');
                } else {
                    this.$message({
                        message: "请选中列表的其中一行",
                        type: "warning"
                    });
                }
            },
            //密码重置
            PageReset() {
            },
            //发送邀请吗
            SendCode() {
            },
            //选择行
            handleClickRow(row) {
                this.singleSelection.push(row);

                console.log(row);
                console.log(this.singleSelection);
            },
            nextStep(){
                this.showForm = false;
                this.showForm2 = true;
            },
            backStep(){
                this.showForm = true;
                this.showForm2 = false;
                console.log(this.form2);
                console.log(this.$refs.tree.getCheckedKeys());
                console.log(this.$refs.tree.getCheckedNodes());
            },
            // 保存编辑
            saveEdit(formName) {
                //let infoData = this.form + this.form2;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: {Role:this.form, RoleAuthorizes:this.$refs.tree.getCheckedNodes()}
                        };
                        console.log(this.form);
                        if (this.dialogState == "add") {
                            this.$axios
                                .post("/SysRole/PostAdd", data)
                                .then(res => {
                                    console.log(this.form);
                                    let resultData = res;
                                    this.tableData.splice(this.idx, 1);
                                    if(res.Status=='success'){
                                        this.editVisible = false;
                                        this.$message.success("新增成功");
                                    }else{
                                        this.$message.error('新增失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getData('');
                                });
                        } else {
                            this.$axios
                                .post("/SysRole/PostUpdate", data)
                                .then(res => {
                                    console.log(this.form);
                                    let resultData = res;
                                    this.tableData.splice(this.idx, 1);
                                    if(res.Status=='success'){
                                        this.editVisible = false;
                                        this.$message.success("修改成功");
                                    }else{
                                        this.$message.error('修改失败,请重试!');
                                    }
                                    this.singleSelection = [];
                                    this.getData('');
                                });
                        }
                        this.getData('');
                        this.singleSelection = [];
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
