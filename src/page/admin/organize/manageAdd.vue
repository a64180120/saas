<template>
    <div class="manageAdd">
        <div class="choose">
            <ul class="flexPublic">
                <li @click="addFinished(true)">保存</li>
                <li @click="addFinished(false)">取消</li>
                <li><a href="">附件?</a></li>
            </ul>
        </div>
        <div class="addFormContainer">
            <h6 class="addTitle">基层组织账套管理</h6>
            <ul class="addFormItems ul-flexChild">
                <li>
                    <div class="addFormItemTitle">工会名称</div>
                    <div class="inputContainer"><input @blur="unionInput(true)" type="text" placeholder="必填"
                                                       v-model="OrgName"></div>
                    <div v-show="unionCss.name">请输入工会名称</div>
                </li>
                <li>
                    <div class="addFormItemTitle">统一社会信用代码</div>
                    <div class="inputContainer"><input @blur="unionInput(false)" type="text" placeholder="必填"
                                                       v-model="EnterpriseCode"></div>
                    <div v-show="unionCss.id">请输入信用代码</div>
                </li>
                <li>
                    <div class="addFormItemTitle">单位地址</div>
                    <div class="block flexPublic">
                        <div class="selectContainer">
                            <select v-model="Province" @change="changeProvince">
                                <option v-for="item in ProvinceValue" :key="item.value" :value="item.value" >{{item.label}}
                                </option>
                            </select>
                        </div>
                        <div>省</div>
                        <div class="selectContainer">
                            <select v-model="City" @change="changeCity">
                                <option v-for="item in CityValue" :key="item.value" :value="item.value">{{item.label}}
                                </option>
                            </select>
                        </div>
                        <div>市</div>
                        <div class="selectContainer">
                            <select v-model="County" @change="changeCounty">
                                <option v-for="item in CountyValue" :key="item.value" :value="item.value">{{item.label}}
                                </option>
                            </select>
                        </div>
                        <div>县</div>
                        <div class="selectContainer">
                            <select v-model="Street" @change="changeStreet">
                                <option v-for="item in StreetValue" :key="item.value" :value="item.value">{{item.label}}
                                </option>
                            </select>
                        </div>
                        <div>街道</div>
                            <!--<el-cascader-->
                                <!--expand-trigger="hover"-->
                                <!--:options="options"-->
                                <!--@active-item-change="handleItemChange"-->
                                <!--style="width: 100%"-->
                                <!--:clearable="clearable"-->
                                <!--v-model="address"-->
                                <!--@change="handleChange">-->
                            <!--</el-cascader>-->
                    </div>
                    <div></div>
                </li>
                <li>
                    <div class="addFormItemTitle"></div>
                    <div class="inputContainer" >
                        <input style="width: 100%; margin: 0px" class="addressDetail " type="text" v-model="Address" placeholder="请输入详细地址">
                    </div>
                </li>
                <li>
                    <div class="addFormItemTitle">联系电话</div>
                    <div>
                        <div class="selectContainer">
                            <select name="phoneHead" v-model="phoneHead">
                                <option v-for="item in phoneHeadValues" :key="item.id" :value="item.id">{{item.name}}
                                </option>

                            </select>
                        </div>
                        <div>-</div>
                        <div class="inputContainer">
                            <input type="text" v-model="MobilePhone" placeholder="请输入联系电话">
                        </div>
                    </div>
                    <div></div>
                </li>
                <li>
                    <div class="addFormItemTitle">隶属工会</div>
                    <div class="selectContainer">
                        <select name="unionOwner" v-model="ParentName">
                            <option v-for="item of ParentNameValues" :key="item.EnCode" :value="item.EnCode">{{item.OrgName}}
                            </option>
                        </select>
                    </div>
                    <div></div>
                </li>
                <li>
                    <div class="addFormItemTitle">会计制度</div>
                    <div class="selectContainer">
                        <select name="unionOwner" v-model="AccountSystem">
                            <option v-for="item of AccountSystemValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                    <div></div>
                </li>
                <li>
                    <div class="addFormItemTitle">启用日期</div>
                    <div>
                        <el-date-picker
                            v-model="EnableTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div></div>
                </li>
                <li>
                    <div class="addFormItemTitle">工会主席</div>
                    <div>
                        <div class="inputContainer"><input type="text" v-model="Chairman" disabled></div>
                        <input @change="getFile($event)" type="file"></div>
                    <div></div>
                </li>
                <li>
                    <div class="addFormItemTitle">经审会主任</div>
                    <div class="inputContainer"><input type="text" v-model="Director"></div>
                    <div></div>
                </li>
                <li>
                    <div class="addFormItemTitle">服务期限</div>
                    <div>
                        <el-date-picker
                            v-model="ServiceStartTime"
                            type="date"
                            placeholder="开始日期">
                        </el-date-picker>
                        <div>-</div>
                        <el-date-picker
                            v-model="ServiceEndTime"
                            type="date"
                            placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div></div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    import qs from 'qs'

    export default {
        name: "manage-add",
        data() {
            return {
                //PhId: '1',
                file: '1',
                OrgName: '',
                EnterpriseCode: '',
                Address: '',
                address: [],
                clearable: true,
                phoneHead: '1',
                MobilePhone: '',
                Telephone: '',
                Chairman: '工会主席',
                Director: '',
                EnableTime: '',
                ServiceStartTime: '',
                ServiceEndTime: '',
                ParentName: '',
                AccountSystem: '',
                ParentNameValues: [],
                Province:"",
                City:"",
                County:"",
                Street:"",
                ProvinceValue:[],
                CityValue:[],
                CountyValue:[],
                StreetValue:[],
                AccountSystemValues: [{id: '0', name: '工会会计制度2009版'}, {id: '1', name: '工会会计制度2008版'}],
                phoneHeadValues: [{id: '0', name: '手机号'}, {id: '1', name: '0571'}, {id: '2', name: '010'}, {
                    id: '3',
                    name: '021'
                }],
                unionCss: {name: false, id: false},
                //日期选择器data******************************
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

                //地址选择器data*********************************
                //options: []
            };
        },
        mounted: function () {
            //this.getNodes();
            this.selectParentName();
            this.selectArea("0", 0);
        },
        methods: {
            handleChange(value) {//地址选择器的值******************
                this.address = value;
                console.log(this.address);
                console.log(value)
            },
            unionInput(bool) {
                if (bool) {
                    if (!this.OrgName) {
                        this.unionCss.name = true;
                    } else {
                        this.unionCss.name = false;
                    }
                } else {
                    if (!this.EnterpriseCode) {
                        this.unionCss.id = true;
                    } else {
                        this.unionCss.id = false;
                    }
                }
            },
            changeProvince(){
                console.log(this.Province);
                this.StreetValue = [];
                this.CountyValue = [];
                this.CityValue = [];
                this.selectArea(this.Province, 1);
            },
            changeCity(){
                this.StreetValue = [];
                this.CountyValue = [];
                this.selectArea(this.City, 2);
            },
            changeCounty(){
                this.StreetValue = [];
                this.selectArea(this.County, 3);
            },
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
                            this.ProvinceValue = res;
                        }else if(i == 1){
                            this.CityValue = res;
                        }else if(i == 2){
                            this.CountyValue = res;
                        }else if(i == 3){
                            this.StreetValue = res;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            selectParentName(){
                var data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1
                }
                this.$axios.get('/SysAdminOrganize/GetSysAdminOrganizeList', {params: data})
                    .then(res => {
                        console.log(res.Record);
                        this.ParentNameValues = res.Record;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            addFinished(bool) {//添加文件上传**************************
                if (!bool) {
                    this.$router.go(-1);
                } else {
                    var page = {
                        'Province': this.Province,
                        'City': this.City,
                        'County': this.County,
                        'Street': this.Street,
                        'file': this.file,
                        'OrgName': this.OrgName,
                        'EnterpriseCode': this.EnterpriseCode,
                        'Address': this.Address,
                        //'phoneHead': this.phoneHead,
                        'MobilePhone': this.MobilePhone,
                        //'Telephone': this.Telephone,
                        'Chairman': this.Chairman,
                        'EnableTime': this.EnableTime,
                        'ServiceStartTime': this.ServiceStartTime,
                        'ServiceEndTime': this.ServiceEndTime,
                        'ParentName': this.ParentName,
                        'AccountSystem': this.AccountSystem,
                        'Director': this.Director
                    };
                    if(this.Province!=''&& this.City !=''&& this.County!='' && this.Street != '' && this.OrgName!=''
                        && this.EnterpriseCode !='' && this.Chairman !='' && this.EnableTime != "" && this.ServiceStartTime !=''
                        && this.ServiceEndTime !='' && this.ParentName != '' && this.AccountSystem !=''&& this.Director !=''){
                        var data = {
                            uid: "0",
                            orgid: "0",
                            infoData: page
                        };
                        this.$axios.post('/SysOrganize/PostAdd', data)
                            .then(res => {
                                if (res.Status == 'success') {
                                    this.$message.success("新增成功");
                                    this.$router.push({path: '/'});
                                }else{
                                    this.$message.error('新增失败,请重试!');
                                }
                            })
                    }else{
                        this.$message.error('请将信息填写完整再保存,请重试!');
                    }
                    // if (this.OrgName.length > 0 && this.EnterpriseCode.length > 0) {
                    //     let formData = new FormData();
                    //     let config = {
                    //         headers: {
                    //             'content-Type': 'multipart/form-data'
                    //         }
                    //     }
                    //
                    //     formData.append('EnterpriseCode', this.EnterpriseCode);
                    //     formData.append('file', this.file);
                    //     // this.$axios.post("/trip/planerec", this.EnterpriseCode, config)
                    //     //     .then(console.log('finish'))
                    // } else {
                    //     alert('请输入工会名称和统一社会信用代码')
                    // }
                }
            },
            getFile($event) {
                this.file = $event.target.files[0];
            },
            ajaxMode() {
                var page = {
                    'Province': this.Province,
                    'City': this.City,
                    'County': this.County,
                    'Street': this.Street,
                    'file': this.file,
                    'OrgName': this.OrgName,
                    'EnterpriseCode': this.EnterpriseCode,
                    'Address': this.Address,
                    //'phoneHead': this.phoneHead,
                    'MobilePhone': this.MobilePhone,
                    //'Telephone': this.Telephone,
                    'Chairman': this.Chairman,
                    'EnableTime': this.EnableTime,
                    'ServiceStartTime': this.ServiceStartTime,
                    'ServiceEndTime': this.ServiceEndTime,
                    'ParentName': this.ParentName,
                    'AccountSystem': this.AccountSystem,
                    'Director': this.Director
                };
                if(this.Province!=''&& this.City !=''&& this.County!='' && this.Street != '' && this.OrgName!=''
                && this.EnterpriseCode !='' && this.Chairman !='' && this.EnableTime != "" && this.ServiceStartTime !=''
                && this.ServiceEndTime !='' && this.ParentName != '' && this.AccountSystem !=''&& this.Director !=''){
                    var data = {
                        uid: "0",
                        orgid: "0",
                        infoData: page
                    };
                    this.$axios.post('/SysOrganize/PostAdd', data)
                        .then(res => {
                            if (res.Status == 'success') {
                                this.$message.success("新增成功");
                                this.$router.push({path: '/'});
                            }else{
                                this.$message.error('新增失败,请重试!');
                            }
                        })
                }else{
                    this.$message.error('请将信息填写完整再保存,请重试!');
                }
            }
        }
    }
</script>

<style scoped>
    .addTitle {
        font-size: 30px;
    }

    .manageAdd {
        font-size: 15px;
    }

    .choose {
        background: #fff;
        padding: 5px;
        font-size: 15px;
    }

    .choose > ul {
        justify-content: flex-end;
    }

    .choose > ul > li {
        margin-left: 15px;
        padding: 2px 8px;
        border: 1px solid #ff9900;
        border-radius: 3px;
        cursor: pointer;
    }

    .choose > ul > li:hover {
        background: #ff9900;
        color: #fff;
    }

    .ul-flexChild > li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: start;
        align-items: center;
    }

    .addFormContainer {
        margin-bottom: 20px;
        padding-bottom: 80px;
    }

    .addFormItems > li {
        margin-top: 15px;
    }

    .addFormItems > li > div {
        line-height: 40px;
        height: 40px;
    }

    .addFormItems > li > .addFormItemTitle {
        text-align: right;
        width: 30%;
        padding: 0 10px;
    }

    .addFormItems > li > div:nth-child(1) {
        font-size: 18px;
        font-weight: 600;
    }

    .addFormItems > li > div:nth-child(2) {
        width: 50%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .addFormItems > li > div:nth-child(3) {
        width: 10%;
        text-align: left;
        color: red;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .block {
        text-align: left;
    }

    .block > span {
        width: 40%;
    }

    .addressDetail {
        width: 98%;
        margin: 0 0 0 10px;
    }

    input {
        margin: 0;
    }

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }

    input[type=file] {
        margin-left: 10px;
    }

</style>
