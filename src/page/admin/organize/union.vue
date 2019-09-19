<template>
    <div class="manageContent">
        <div class="unionState" style="height: 60px;">
            <ul class="flexPublic" style="float: left">
                <li class="flexPublic" style="float: left;width: 30%;margin-right: 30px">
                    <div>地区:</div>
                    <div  style="width: 70%">
                        <el-cascader
                            placeholder=""
                            :options="options"
                            @active-item-change="handleItemChange"
                            filterable
                            :clearable="clearable"
                            @change ="changeArea"
                            change-on-select
                        ></el-cascader>
                        <!--<select v-model="unionName">-->
                            <!--<option v-for="item in unionNameValues" :key="item.id" :value="item.id">{{item.name}}-->
                            <!--</option>-->
                        <!--</select>-->
                    </div>
                </li>
                <li class="flexPublic datepick" style="float: left;width: 40% ;margin-right: 30px;margin-top: -10px">
                    <div  style="margin-right: -150px">服务期限:</div>
                    <div style="width: 78%">
                        <!--<el-date-picker-->
                            <!--v-model="date1"-->
                            <!--type="date"-->
                            <!--placeholder="选择日期"-->
                            <!--value-format="yyyy-MM-dd">-->
                        <!--</el-date-picker>-->
                        <el-date-picker
                            v-model="state_time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            size="small"
                            style="width: 100%">
                        </el-date-picker>
                    </div>
                </li>
                <li class="flexPublic" style="float: right;width: 25%;margin-top: -10px">
                    <div>状态:</div>
                    <div class="selectContainer">
                        <select name="phoneHead" v-model="unionState">
                            <option v-for="item in unionStateValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                </li>
            </ul>
            <ul class="flexPublic handle" style="float:right">
                <a @click.prevent="routerTo('/admin/orgin/add')">
                    <li>新增</li>
                </a>
                <a @click.prevent="routerTo('/admin/orgin/edit')">
                    <li>修改</li>
                </a>
                <a>
                    <li>备份</li>
                </a>
                <a>
                    <li>恢复</li>
                </a>
                <a>
                    <li>导入</li>
                </a>
            </ul>
            <div class="flexPublic" style="float: right">
                <div class="searcherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text"
                                                  placeholder="组织编码/名称"></div>
                <div @click="unionSearch" class="searcherBtn btn" style="width: 60px">搜索</div>
            </div>
        </div>
        <div class="formData">
            <ul style="overflow-y: scroll">
                <li>序号</li>
                <li>用户号</li>
                <li>组织编码</li>
                <li>组织名称</li>
                <li>创建日期</li>
            </ul>
            <div class="hideScroll">

            </div>
            <div class="formData notChangeCol" style="margin-top: 0px; overflow-y: scroll; height: 500px">
                <ul class="formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}"
                    @click="chooseOn(index,item.PhId)" v-for="(item,index) of userInfo" :key="index" >
                    <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                    <li>{{item.UserAccount}}</li>
                    <li>{{item.EnCode}}</li>
                    <li>{{item.OrgName}}</li>
                    <li>{{item.NgInsertDt.replace('T',' ')}}</li>
                </ul>
            </div>

        </div>
        <div class="formDataPages">
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
        </div>
    </div>

</template>

<script>

    export default {
        name: "union",
        data() {
            return {
                state_time:[],
                date1: '',
                unionSearchValue: '',
                unionState: '',
                iiii:2,
                areaId:[],
                unionName: '',
                ng_insert_dt: '',
                options:[],
                clearable:true,
                PhIdList: '',
                orgname: '',
                pageIndex: 1,
                pageSize: '15',
                pageCount: [],
                unionNameValues: [
                    {id: 0, name: '杭州总工会'},
                    {id: 1, name: '政云工会'},
                    {id: 2, name: '相符工会'}
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
            }
        },
        methods: {
            getNodes (val) {
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
                console.log(idArea);
                this.$axios.get("/SysArea/GetAreaList", {
                    params: {
                        uid: "0",
                        orgid: this.qOrgId,
                        id: idArea
                    }
                }).then(response => {
                    if (response) {
                        let Items = response;
                        console.log(Items.length);
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
                                                console.log(Items.length);
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
            },
            //选中各级地址
            changeArea(val){
                console.log(val);
                this.getNodes(val);
                this.areaId = val;
            },
            //搜索按钮
            unionSearch() {
                console.log(this.areaId);
                console.log(this.state_time);
                let startT = '', endT='';
                if(this.state_time == null || this.state_time == [] || this.state_time.length < 1){
                    this.state_time = [];
                }else{
                    startT = this.state_time[0];
                    endT = this.state_time[1];
                }
                let l = this.areaId.length;
                if(l < 1){
                    this.areaId = ["","","",""];
                }else{
                    for(let j = l; j < 4; j++){
                        this.areaId[j] = "";
                    }
                }
                if(this.areaId =='' && this.state_time ==[] && this.unionState =='' && this.unionSearchValue == ''){
                    this.ajaxMode('');
                }else{
                    // var queryfilter={
                    //     ParentId:this.unionName,
                    //     ServiceEndTime:this.date1,
                    //     EnabledMark:this.unionState,
                    //     EnCode : this.unionSearchValue,
                    //     OrgName : this.unionSearchValue
                    // }
                    var data = {
                        uid: "0",
                        orgid: "0",
                        pagesize: this.pageSize,
                        pageindex: this.pageIndex - 1,
                        value: "union" +","+this.areaId[0]+","+this.areaId[1]+","+this.areaId[2]+','+this.areaId[3]+','+startT + ','+ endT+","
                            +this.unionState+","+this.unionSearchValue
                    }
                    this.$axios.get('/SysOrganize/GetOrganizesBy', {params: data})
                        .then(res => {
                            console.log(res)
                            this.userInfo = res.Record;
                            for (var i = 0; i < this.userInfo.length; i++) {
                                this.userInfoCssList[i] = {checked: false};
                            }
                            this.pageIndex = res.index + 1;
                            this.pageSize = res.size;
                            var newArr = [];
                            var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                            // maxP = Math.ceil(res.totalRows / daresta.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                            for (var i = 0; i < maxP; i++) {
                                newArr = i + 1;
                            }
                            this.pageCount = newArr;
                        })
                }
            },
            newPage(val) {//分页展示****************************************
                console.log()
                if (val == 'next') {
                    if (this.pageIndex % this.pageCount != 0 && this.pageIndex != this.pageCount) {
                        this.pageIndex++;
                    }
                } else if (val == 'pre') {
                    if (this.pageIndex % this.pageCount != 1) {
                        this.pageIndex--;
                        console.log(this.pageIndex)
                    }
                } else {
                    this.pageIndex = val + 1;
                }
                this.pageCssActive = this.pageIndex - 1;
                this.ajaxMode();
            },
            pageSizeSelect() {
                this.ajaxMode();
            },
            chooseOn(index, PhId) {
                this.userInfoCssList.map((value) => {
                    return value.checked = false
                })
                this.userInfoCssList[index].checked = true;
                // console.log(item.style);
                this.$forceUpdate();
                this.PhIdList = PhId;
            },
            routerTo(url) {
                if(url == '/admin/orgin/add'){
                    this.$store.commit("tagNav/upexcludeArr", []);
                    this.$router.push({path: url, query: {showFlam:false}});
                }else{
                    if(this.PhIdList.length == 0){
                        this.$message({ showClose: true,message: "请选中列表的其中一行", type: "warning"});
                        return;
                    }else{
                        this.$store.commit("tagNav/upexcludeArr", ['manage-add']);
                        this.$router.push({path: url, query: {PhId: this.PhIdList, showFlam:false}});
                        this.ajaxMode();
                        this.PhIdList = '';
                    }
                }
                // if (url == '/admin/orgin/add') {
                //     this.$router.push({path: url, query: {type: 'add'}});
                // } else {
                //     this.$router.push({path: url, query: {PhId: this.PhIdList}});
                // }
            },
            ajaxMode() {

                let data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                    infoData: null
                };
                this.$axios.get('/SysAdminOrganize/GetSysAdminOrganizeList', {params: data})
                    .then(res => {

                        this.userInfo = res.Record;
                        for (var i = 0; i < this.userInfo.length; i++) {
                            this.userInfoCssList[i] = {checked: false};
                        }
                        this.pageIndex = res.index + 1;
                        this.pageSize = res.size;
                        var newArr = [];
                        var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                        for (var i = 0; i < maxP; i++) {
                            newArr = i + 1;
                        }
                        this.pageCount = newArr;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        created() {
            this.$store.commit("tagNav/upexcludeArr", []);
            console.log("2222222");
            this.ajaxMode();
        },
        mounted() {
            this.ajaxMode();
            this.getNodes();
        },

    }

</script>

<style scoped>
    .hideScroll{
        position: absolute;
        top:85px;
        right:20px;
        width: 16px;
        height:100%;
        background: #fff;
    }

    .formData > ul > li {
        border-right: 1px solid #fff;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 25%;
    }

    .formData > ul > li:nth-of-type(4) {
        width: 30%;
    }

    .formData > ul > li:nth-of-type(5) {
        width: 15%;
    }

    .formData > ul:first-child > li:last-of-type {
        width: 15%;
        /*border-right: 1px solid #2780d1;*/
    }

    .formData > ul > li:first-child {
        width: 5%;
        min-width: 31px;
        padding: 0 2px;
    }
    .notChangeCol> ul:first-child {
        background: transparent;
        color: #000;
    }
    ul.formDataItems.flexPublic.userInfoCss {
        background: #ddd;
    }
    .formData > ul.formDataItems:hover {
        background-color: #fafafa;
        transition: background-color .25s ease;
    }
    .formDataItems {
        border-bottom: 1px solid #ddd;
    }
    .formData > ul.formDataItems > li {
        border-right: 1px solid #ddd;
        border-left: 0;
        border-bottom: 0;
        text-align: center;
        line-height: 40px;
        height: 40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .formData > ul.formDataItems > li:first-child {
        border-left: 1px solid #ddd;
    }


</style>
