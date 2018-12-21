<template>
    <div class="manageAdd">
        <div class="choose">
            <ul class="flexPublic">
                <li @click="addFinished(true)">保存</li>
                <li @click="addFinished(false)">取消</li>
                <li><a href="">刷新</a></li>
            </ul>
        </div>
        <div class="addFormContainer">
            <h6 class="addTitle">基层组织账套管理</h6>
            <ul class="addFormItems ul-flexChild">
                <li>
                    <div class="addFormItemTitle">工会名称</div>
                    <div class="inputContainer"><input  @blur="unionInput(true)" type="text" v-model="OrgName">
                    </div>
                    <div v-show="unionCss.name">请输入工会名称</div>
                </li>
                <li>
                    <div class="addFormItemTitle">统一社会信用代码</div>
                    <div class="inputContainer"><input  @blur="unionInput(false)" type="text" style="width: 90%"
                                                       v-model="EnterpriseCode"></div>
                    <div v-show="unionCss.id">请输入信用代码</div>
                    <div style="position: relative">
                        <el-upload
                            ref="uploadEnterprise"
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            :http-request='uploadFileMethodEnterprise'>
                            <img v-if="EnterpriseAttachment" :src="picUrl+EnterpriseAttachment" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
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
                        <select name="unionOwner" v-model="Parent" @change="changeParentOrg">
                            <option v-for="item of ParentNameValues" :key="item.PhId" :value="item">{{item.OrgName}}
                            </option>
                        </select>
                    </div>
                    <div></div>
                </li>
                <li v-show="showFlam">
                    <div class="addFormItemTitle">会计制度</div>
                    <div class="selectContainer">
                        <select name="unionOwner" v-model="AccountSystem">
                            <option v-for="item of AccountSystemValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                    <div></div>
                </li>
                <li v-show="showFlam">
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
                        <div class="inputContainer"><input type="text" v-model="Chairman" style="width: 90%" disabled>
                        </div>
                        <div style="position: relative; top: -20px">
                            <el-upload
                                ref="uploadChairman"
                                class="avatar-uploader"
                                action=""
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :http-request='uploadFileMethodChairman'>
                                <img v-if="ChairmanAttachment" :src="picUrl+ChairmanAttachment" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <!--<input @change="getFile($event)" type="file">-->
                    </div>
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
    import { mapState, mapActions } from "vuex";
    import pictureUpload from "@/components/upload";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****

    export default {
        name: "manage-update",
        data() {
            return {
                PhId: '',
                file: '1',
                OrgName: '',
                EnterpriseCode: '',
                Address: '',
                phoneHead: '1',
                MobilePhone: '',
                Telephone: '',
                Chairman: '工会主席',
                EnableTime: '',
                EnterpriseAttachment:'',
                ChairmanAttachment:'',
                showFlam:this.$route.query.showFlam,
                ServiceStartTime: '',
                ServiceEndTime: '',
                ParentId: '',
                ParentCode:'',
                Parent:'',
                ParentName: '',
                AccountSystem: '',
                Director:'',
                ParentNameValues: [],
                Province:"",
                City:"",
                County:"",
                Street:"",
                NgRecordVer:'',
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
            };
        },
        // mounted: function () {
        //     //this.getNodes();
        //     this.selectParentName();
        //     this.selectArea("0", 0);
        // },
        methods: {
            ...mapActions({
                uploadFile: 'uploadFile/Orgupload'
            }),
            //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif') || (file.type === 'image/jpg');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传图片只能是 JPG,png,gif,jpeg 格式!');
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                    return false
                }
            },
            uploadFileMethodEnterprise(param) {
                let fileObject = param.file;
                let formData = new FormData();
                //formData.append('id', this.PhId)
                formData.append("file", fileObject);

                this.uploadFile(formData).then(res => {
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    //回传的上传临时文件
                    if(res.Data[0]){
                        this.EnterpriseAttachment = res.Data[0];
                        this.$message.success("上传成功");
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
                })
            },
            uploadFileMethodChairman(param){
                let fileObject = param.file;
                let formData = new FormData();
                //formData.append('id', this.orgForm.PhId)
                formData.append("file", fileObject);

                this.uploadFile(formData).then(res => {
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }

                    //回传的上传临时文件
                    if(res.Data[0]){
                        this.ChairmanAttachment = res.Data[0];
                        this.$message.success("上传成功");
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
                })
            },
            handleChange(value) {//地址选择器的值******************
            },
            unionInput(bool) {
                if (bool) {
                    if (!this.unionName) {
                        this.unionCss.name = true;
                    } else {
                        this.unionCss.name = false;
                    }
                } else {
                    if (!this.unionId) {
                        this.unionCss.id = true;
                    } else {
                        this.unionCss.id = false;
                    }
                }
            },
            changeParentOrg(){
                console.log(this.Parent);
                this.ParentId = this.Parent.PhId;
                this.ParentName = this.Parent.OrgName;
                this.ParentCode = this.Parent.EnCode;
                console.log(this.ParentId);
                console.log(this.ParentCode);
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
                        let item;
                        console.log(this.ParentNameValues);
                        for(item of this.ParentNameValues){
                            if(this.ParentId == item.PhId){
                                this.Parent = item;
                            }
                        };
                        console.log(this.Parent);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            addFinished(bool) {//添加文件上传**************************
                if (!bool) {
                    //this.$router.go(-1);
                    this.$store.commit("tagNav/removeTagNav", this.$route);
                    this.$router.push({path: "/admin/orgin"});
                } else {
                    let formData = new FormData();
                    //文件上传预留****************************
                    /* let config = {
                       headers: {
                         'content-Type': 'multipart/form-data'
                       }
                     }
                     formData.append('unionId',this.unionId);
                     formData.append('file',this.file);*/
                    if(this.$route.query.showFlam){
                        var page = {
                            'PhId': this.PhId,
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
                            'ParentId': this.ParentId,
                            'ParentEnCode': this.ParentCode,
                            'AccountSystem': this.AccountSystem,
                            'Director': this.Director,
                            'EnterpriseAttachment': this.EnterpriseAttachment,
                            'ChairmanAttachment': this.ChairmanAttachment,
                            'NgRecordVer': this.NgRecordVer
                        };
                        if(this.Province!=''&& this.City !=''&& this.County!='' && this.Street != '' && this.OrgName!=''
                            && this.EnterpriseCode !='' && this.Chairman !='' && this.EnableTime != "" && this.ServiceStartTime !=''
                            && this.ServiceEndTime !='' && this.ParentName != '' && this.AccountSystem !=''&& this.Director !=''){
                            var data = {
                                uid: "0",
                                orgid: "0",
                                infoData: page
                            };
                            this.$axios.post('/SysOrganize/PostUpdate', data)
                                .then(res => {
                                    console.log(res);
                                    if (res.Status == 'success') {
                                        this.$message.success("修改成功");
                                        //this.$router.push({path: '/'});
                                    }else{
                                        this.$message.error('修改失败,请重试!');
                                    }
                                })
                        }else{
                            this.$message.error('请将信息填写完整再保存,请重试!');
                        }
                    }else{
                        var page = {
                            'PhId': this.PhId,
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
                            'ServiceStartTime': this.ServiceStartTime,
                            'ServiceEndTime': this.ServiceEndTime,
                            'ParentName': this.ParentName,
                            'ParentId': this.ParentId,
                            'ParentEnCode': this.ParentCode,
                            'Director': this.Director,
                            'EnterpriseAttachment': this.EnterpriseAttachment,
                            'ChairmanAttachment': this.ChairmanAttachment,
                            'NgRecordVer': this.NgRecordVer
                        };
                        if(this.Province!=''&& this.City !=''&& this.County!='' && this.Street != '' && this.OrgName!=''
                            && this.EnterpriseCode !='' && this.Chairman !='' && this.ServiceStartTime !=''
                            && this.ServiceEndTime !='' && this.Director !=''){
                            var data = {
                                uid: "0",
                                orgid: "0",
                                infoData: page
                            };
                            this.$axios.post('/SysAdminOrganize/PostUpdate', data)
                                .then(res => {
                                    console.log(res);
                                    if (res.Status == 'success') {
                                        this.$message.success("修改成功");
                                        //this.$router.push({path: '/'});
                                    }else{
                                        this.$message.error('修改失败,请重试!');
                                    }
                                })
                        }else{
                            this.$message.error('请将信息填写完整再保存,请重试!');
                        }
                    }
                    this.$store.commit("tagNav/removeTagNav", this.$route);
                    this.$router.push({path: "/admin/orgin"});
                    // var data = {
                    //     uid: "0",
                    //     orgid: "0",
                    //     infoData: page
                    // };
                    // this.$axios.post("/SysOrganize/PostUpdate", data)
                    //     .then(res => {
                    //         if (res.Status == 'success') {
                    //             this.$router.push({path: '/'})
                    //         }
                    //     })
                }
            },
            getFile($event) {
                this.file = $event.target.files[0];
            },
            init() {
                var PhIdList = this.$route.query.PhId;
                var data = {
                    id: PhIdList
                };
                //data.id=JSON.parse(data.infoData).PhId;
                if(this.$route.query.showFlam){
                    this.$axios.get('/SysOrganize/GetSysOrganize', {params: data})
                        .then(res => {
                            console.log(res);
                            this.PhId = res.PhId;
                            this.OrgName = res.OrgName;
                            this.EnterpriseCode = res.EnterpriseCode;
                            this.Address = res.Address;
                            this.MobilePhone = res.MobilePhone;
                            this.Telephone = res.Telephone;
                            this.Chairman = res.Chairman;
                            this.Director = res.Director;
                            this.EnableTime = res.EnableTime;
                            this.ServiceStartTime = res.ServiceStartTime;
                            this.ServiceEndTime = res.ServiceEndTime;
                            //this.Parent = res.ParentId;
                            this.ParentId = res.ParentId;
                            this.ParentCode = res.ParentEnCode;
                            this.ParentName = res.ParentName;
                            this.AccountSystem = res.AccountSystem;
                            this.Province = res.Province;
                            this.City = res.City;
                            this.County = res.County;
                            this.Street = res.Street;
                            this.EnterpriseAttachment= res.EnterpriseAttachment,
                            this.ChairmanAttachment = res.ChairmanAttachment,
                            this.NgRecordVer = res.NgRecordVer;
                            console.log(this.County);
                            this.selectArea(this.Province, 1);
                            this.selectArea(this.City, 2);
                            this.selectArea(this.County, 3);
                        })
                }else{
                    this.$axios.get('/SysAdminOrganize/GetSysAdminOrganize', {params: data})
                        .then(res => {
                            console.log(res);
                            this.PhId = res.PhId;
                            this.OrgName = res.OrgName;
                            this.EnterpriseCode = res.EnterpriseCode;
                            this.Address = res.Address;
                            this.MobilePhone = res.MobilePhone;
                            this.Telephone = res.Telephone;
                            this.Chairman = res.Chairman;
                            this.Director = res.Director;
                            this.ServiceStartTime = res.ServiceStartTime;
                            this.ServiceEndTime = res.ServiceEndTime;
                            //this.Parent = res.ParentId;
                            this.ParentId = res.ParentId;
                            this.ParentCode = res.ParentEnCode;
                            this.ParentName = res.ParentName;
                            this.Province = res.Province;
                            this.City = res.City;
                            this.County = res.County;
                            this.Street = res.Street;
                            this.NgRecordVer = res.NgRecordVer;
                            console.log(this.County);
                            this.selectArea(this.Province, 1);
                            this.selectArea(this.City, 2);
                            this.selectArea(this.County, 3);
                        })
                }
            }
        },
        mounted() {
            this.selectParentName();
            this.selectArea("0", 0);
            this.init();
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
<style>
    .avatar-uploader{
        position: absolute;
        z-index: 1;
        right: 0px;
        top: -10px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader .el-upload--text{
        width: 60px;
        height: 60px;
    }

    .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
    }
    .avatar {
        width: 60px;
        height: 60px;
        display: block;
    }
    .orgform .el-form-item__label{
        background: #00B8EE;
    }

    .orgform .el-form-item{
        margin-bottom: 2px;
    }
    .pictrueUpload{
        width:100%;
        height:100%;
    }
</style>
