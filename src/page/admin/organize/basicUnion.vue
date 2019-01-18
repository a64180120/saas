<template>
    <div class="manageContent">
        <div class="unionState" style="height: 60px">
            <ul class="flexPublic" style="float: left">
                <li class="flexPublic" style="float: left">
                    <div>隶属工会:</div>
                    <div class="selectContainer">
                        <select v-model="unionName">
                            <option value="">全部</option>
                            <option v-for="item in unionNameValues" :key="item.PhId" :value="item.PhId">{{item.OrgName}}
                            </option>
                        </select>
                    </div>
                </li>
                <li class="flexPublic datepick" style="float: left">
                    <div>使用期限:</div>
                    <div class="block">
                        <el-date-picker
                            v-model="date1"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </li>
                <li class="flexPublic" style="float: right">
                    <div>状态:</div>
                    <div class="selectContainer">
                        <select name="phoneHead" v-model="unionState">
                            <option v-for="item in unionStateValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                </li>
            </ul>
            <ul class="flexPublic handle" style="float: right">
                <a @click.prevent="routerTo('/admin/orgin/add')" style="float: right">
                    <li>新增</li>
                </a>
                <a @click.prevent="routerTo('/admin/orgin/edit')" style="float: right">
                    <li>修改</li>
                </a>
                <a style="float: right">
                    <li>备份</li>
                </a>
                <a style="float: right">
                    <li>恢复</li>
                </a>
                <a style="float: right">
                    <li>导入</li>
                </a>
            </ul>
            <div class="flexPublic" style="float: right">
                <div class="searcherValue" style="float: left"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text"
                                                                      placeholder="组织编码/名称"></div>
                <div @click="unionSearch" class="searcherBtn btn" style="float: right; width: 60px">搜索</div>
            </div>
        </div>
        <div class="formData">
            <ul>
                <li>序号</li>
                <li>用户号</li>
                <li>组织编码</li>
                <li>组织名称</li>
                <li>隶属工会</li>
                <li class="zhangtao">
                    <div>账套</div>
                    <div class="flexPublic">
                        <span>建账日期</span>
                        <span>创建人</span>
                        <span>会计</span>
                    </div>
                </li>
                <li>启用/停用</li>
                <li>服务期限</li>
            </ul>
            <ul class="formDataItems">
                <li :class="{userInfoCss:userInfoCssList[index].checked}" @click="chooseOn(index,item.PhId)"
                    v-for="(item,index) of userInfo" :key="index">
                    <ul class="formDataItem flexPublic">
                        <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                        <li>{{item.UserAccount}}</li>
                        <li>{{item.EnCode}}</li>
                        <li>{{item.OrgName}}</li>
                        <li>{{item.ParentName}}</li>
                        <li>{{item.JBuildDate}}</li>
                        <li>{{item.Chairman}}</li>
                        <li>{{item.Director}}</li>
                        <li class="stateControl flexPublic">
                            <label><input :name="item.uid" type="radio" value="0" v-model="item.EnabledMark"
                                          @click="changeEnable(item.PhId, item.EnabledMark)">启用</label>
                            <label><input :name="item.uid" type="radio" value="1" v-model="item.EnabledMark"
                                          @click="changeEnable(item.PhId, item.EnabledMark)">停用</label>
                        </li>
                        <li>{{item.ServiceStartTime.substr(0, 10)}}-{{item.ServiceEndTime.substr(0,10)}}</li>
                    </ul>
                </li>
            </ul>
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
    import md5 from 'js-md5'

    export default {
        name: "basicUnion",
        data() {
            return {
                date1: '',
                unionSearchValue: '',
                unionState: '',
                unionName: '',
                PhIdList: '',
                pageIndex: 1,
                pageSize: '15',
                pageCount: [],
                unionNameValues: [
                    //{PhId: 0, OrgName: '全部'},
                    // {id: 1, name: '政云工会'},
                    // {id: 2, name: '相符工会'}
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
            selectUnionName(){
                var data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                }
                this.$axios.get('/SysAdminOrganize/GetAllAdminOrganizeByStreet', {params: data})
                    .then(res => {
                        console.log(res);
                        this.unionNameValues = res;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            unionSearch() {
                console.log(this.date1);
                if(this.date1 == null){
                    this.date1 = '';
                }
                if(this.unionName =='' && this.date1 =='' && this.unionState =='' && this.unionSearchValue == ''){
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
                        value: "Basic" +","+this.unionName+","+this.date1+","+this.unionState+","+this.unionSearchValue
                    }
                    this.$axios.get('/SysOrganize/GetOrganizesBy', {params: data})
                        .then(res => {
                            console.log(res)
                            this.userInfo = res.Record;
                            for (var i = 0; i < this.userInfo.length; i++) {
                                this.userInfoCssList[i] = {checked: false};
                                if(this.userInfo[i].ServiceStartTime == null){
                                    this.userInfo[i].ServiceStartTime ='';
                                }
                                if(this.userInfo[i].ServiceEndTime == null){
                                    this.userInfo[i].ServiceEndTime ='';
                                }
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
            changeEnable(PhId, EnabledMark) {
                this.PhIdList = PhId;
                if (EnabledMark == '0') {
                    EnabledMark = '1'
                } else {
                    EnabledMark = '0'
                }
                console.log(PhId.toString() + "," + EnabledMark.toString());
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
                this.$forceUpdate();
                this.PhIdList = PhId;
            },
            routerTo(url) {
                if(url == '/admin/orgin/add'){
                    this.$store.commit("tagNav/upexcludeArr", []);
                    this.$router.push({path: url, query: {showFlam:true}});
                    this.ajaxMode();
                }else{
                    if(this.PhIdList.length == 0){
                        this.$message({ showClose: true,message: "请选中列表的其中一行", type: "warning"});
                        return;
                    }else{
                        this.$store.commit("tagNav/upexcludeArr", []);
                        this.$router.push({path: url, query: {PhId: this.PhIdList, showFlam:true}});
                        this.ajaxMode();
                        this.PhIdList = '';
                    }
                }

                // if (url != '/admin/orgin/add' && this.PhIdList.length == 0) {
                //     alert('请点击你要修改的组织')
                //     return;
                // } else {
                //     this.$router.push({path: url, query: {PhId: this.PhIdList}});
                // }
            },
            ajaxMode(query) {
                const loading1 = this.$loading();
                let data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                    infoData:query
                };

                this.$axios.get('/SysOrganize/GetSysOrganizeList', {params: data})
                    .then(res => {
                        console.log(1);
                        console.log(res);
                        this.userInfo = res.Record;
                        loading1.close();
                        for (var i = 0; i < this.userInfo.length; i++) {
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
                        console.log(err);
                        loading1.close();
                    })
            }
        },
        created() {
            this.$store.commit("tagNav/upexcludeArr", []);
        },
        mounted() {
            this.selectUnionName();
            this.ajaxMode();
        }
    }
</script>

<style scoped>


    .formData > ul:first-child > li {
        border-right: 1px solid #fff;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 15%;
    }

    .formData > ul:first-child > li:nth-of-type(6) {
        line-height: 25px;
        width: 27%;
    }

    .formData > ul:first-child > li:nth-of-type(7) {
        width: 10%;
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
        background: #ddd;
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
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .formDataItem > li:nth-of-type(6),
    .formDataItem > li:nth-of-type(7),
    .formDataItem > li:nth-of-type(8) {
        width: 9%;
    }

    .formDataItem > li:nth-of-type(9) {
        width: 10%;
        padding: 0 8px;
    }


</style>
