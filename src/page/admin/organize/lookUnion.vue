<template>
    <div class="manageContent">
        <div class="examineTab">
            <div @click="examineTabFn(true)" :class="{examineTabAct:examineTab}">待审核({{dVerifyNum}})</div>
            <div @click="examineTabFn(false)" :class="{examineTabAct:!examineTab}">已审核({{yVerifyNum}})</div>
        </div>
        <!--******待审核********-->
        <div v-show="examineTab" class="unionState" style="height: 40px">
            <ul class="flexPublic" style="float: left">
                <li class="flexPublic">
                    <div>信息完整度:</div>
                    <div class="selectContainer">
                        <select v-model="infoPersentSelect">
                            <option v-for="item of infoPersentSelectValues" :key="item.id" :value="item.id">
                                {{item.name}}
                            </option>
                        </select>
                    </div>
                </li>
                <li class="flexPublic">
                    <div>距试用结束时长:</div>
                    <div class="selectContainer">
                        <select name="tryTimeSelect" v-model="tryTimeSelect">
                            <option v-for="item of tryTimeSelectValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                </li>
            </ul>
            <ul class="flexPublic handle" style="float: right">
                <!--<router-link to="/organize/add">-->
                    <!--<li>审核</li>-->
                <!--</router-link>-->
                <a @click.prevent="routerTo('/admin/orgin/ver')" >
                    <li>审核</li>
                </a>
                <a @click="verifyMany">
                    <li>批量审核</li>
                </a>
            </ul>
            <div class="flexPublic" style="float: right">
                <div class="searcherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue1" type="text" style="width: 200px"
                                                  placeholder="企业/单位名称/联系人姓名"></div>
                <div @click="unionSearch" class="searcherBtn btn" style="width: 60px">搜索</div>
            </div>
        </div>
        <div v-show="examineTab" class="formData">
            <ul>
                <li>序号</li>
                <li>企业/单位名称</li>
                <li>联系人姓名</li>
                <li>联系电话</li>
                <li>联系地址</li>
                <li>信息完整度（%）</li>
                <li>
                    <div>距试用结束时长</div>
                    <div>（天）</div>
                </li>
            </ul>
            <ul class="formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}"
                @click.ctrl="chooseMany(index, item.PhId)"  @click="chooseOn(index,item.PhId, chFlam)" v-for="(item,index) of userInfo" :key="index">
                <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                <li :title="item.OrgName">{{item.OrgName}}</li>
                <li>{{item.Director}}</li>
                <li>{{item.TelePhone||item.MobilePhone}}</li>
                <li :title="item.Address">{{item.Address}}</li>
                <li class="flexPublic">
                    <div class="progressContainer">
                        <div class="progress" :style="{background:infoStyle[index],width:item.Integrity+'%'}" style="background-color: #ffffff">
                            {{item.Integrity < 80 ?'':item.Integrity+' %'}}
                        </div>
                        <div
                            :style="{color:infoStyle[index],width:(100-item.Integrity)<20?20:100-item.Integrity+'%',display:(100-item.Integrity)<20?'none':'block'}">
                            {{item.Integrity}} %
                        </div>
                    </div>
                </li>
                <li>{{item.EnableTime}}</li>
            </ul>
            <el-dialog :title="'批量审核'" :visible.sync="editVisible" width="30%" :close="dialogClose">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
                    <el-form-item label="审核状态：" prop="Verify">
                        <template>
                            <el-radio v-model="form.Verify" label="1">通过</el-radio>
                            <el-radio v-model="form.Verify" label="2">不通过</el-radio>
                        </template>
                        <!--<el-radio-group v-model="form.Verify">-->
                            <!--<el-radio  :label="0">通过</el-radio>-->
                            <!--<el-radio  :label="1">不通过</el-radio>-->
                        <!--</el-radio-group>-->
                    </el-form-item>
                    <el-form-item label="审核意见：" prop="VerifyOpinion">
                        <el-input v-model="form.VerifyOpinion" style="height: 100px"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
            </el-dialog>
        </div>
        <!--******已审核********-->
        <div v-show="!examineTab" class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic w-100 lookState">
                    <div>审核状态:</div>
                    <div class="selectContainer">
                        <select v-model="infoVerify">
                            <option v-for="item of infoVerifyValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                </li>
            </ul>
            <div class="flexPublic">
                <div class="searcherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue2" type="text" style="width: 200px"
                                                  placeholder="企业名称/单位名称/联系人姓名"></div>
                <div @click="unionSearch" class="searcherBtn btn" style="width: 60px">搜索</div>
            </div>
            <!--<div class="flexPublic">-->
                <!--<div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text"-->
                                                 <!--placeholder="组织编码/名称"></div>-->
                <!--<div @click="unionSearch" class="seacherBtn">搜索</div>-->
            <!--</div>-->
        </div>
        <div v-show="!examineTab" class="formData">
            <ul>
                <li>序号</li>
                <li>企业/单位名称</li>
                <li>联系人姓名</li>
                <li>联系电话</li>
                <li>联系地址</li>
                <li>审核状态</li>
                <li>审核时间</li>
            </ul>
            <ul class=" formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}"
               @click="chooseOn(index,item.PhId)" v-for="(item,index) of examined" :key="index">
                <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                <li :title="item.OrgName">{{item.OrgName}}</li>
                <li>{{item.Director}}</li>
                <li>{{item.TelePhone||item.MobilePhone}}</li>
                <li :title="item.Address">{{item.Address}}</li>
                <li><i :class="{examSuccess : item.Verify,examFailed : !item.Verify}"></i></li>
                <li>{{item.VerifyDt}}</li>
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
    import {mapState, mapActions} from 'vuex'
    export default {
        created() {
            this.getInfoStyle();
        },
        data() {
            return {
                editVisible: false,
                form:{
                    Verify:"1",
                    VerifyOpinion: ""
                },
                rules:{},
                dVerifyNum:'',
                yVerifyNum:'',
                verifyFlrm : "0",
                infoPersentSelect: 0,
                tryTimeSelect: 0,
                orgname: '',
                examineTab: true,
                infoStyle: [],
                chFlam : true,
                ProvinceName : '',
                CityName: '',
                CountName: '',
                StreetName:'',
                userInfoCssList: [],
                unionSearchValue1: '',
                unionSearchValue2:'',
                PhIdList: '',
                PhIdLists:[],
                pageIndex: 1,
                pageSize: '15',
                pageCount: [],
                pageCssActive: '',
                pagePreDisabled: '',
                pageNextDisabled: '',
                infoVerify: '',
                infoVerifyValues: [{id: "", name: '全部'}, {id: 1, name: '通过'}, {id: 2, name: '未通过'}],
                infoPersentSelectValues: [{id: 0, name: '全部'}, {id: 1, name: '30%以下'}, {id: 2, name: '30%-50%'}, {
                    id: 3,
                    name: '50%-80%'
                }, {id: 4, name: '80%以上'}],
                tryTimeSelectValues: [{id: 0, name: '全部'}, {id: 1, name: '8h以内'}, {id: 2, name: '24h以内'}, {
                    id: 3, name: '48h以内'}],
                userInfo1: [],
                userInfo: [],
                examined: []
            }
        },
        methods: {
            //搜索按钮进行搜索
            unionSearch() {
                let data;
                let verify;
                let infoPersent;
                let tryTime;
                if(this.verifyFlrm == '0'){
                    if(this.infoPersentSelect == ''){
                        infoPersent = 0;
                    }else{
                        infoPersent = this.infoPersentSelect;
                    }
                    if(this.tryTimeSelect == ''){
                        tryTime = 0;
                    }else{
                        tryTime = this.tryTimeSelect;
                    }
                    data = {
                        integrity: this.infoPersentSelect,
                        serviceEndTime: tryTime,
                        name : this.unionSearchValue1,
                        verify: 0
                    };
                }else{
                    if(this.infoVerify == ''){
                        verify = '3';
                    }else{
                        verify = this.infoVerify;
                    }
                    console.log(verify);
                    data = {
                        integrity: 0,
                        serviceEndTime: 0,
                        name : this.unionSearchValue2,
                        verify: verify
                    };
                }
                this.$axios.get('/SysOrganize/GetOrgListByQuery', {params: data})
                    .then(res => {
                        if(this.verifyFlrm == "0"){
                            let wTime = '-';
                            let dTime = new Date();
                            this.userInfo = res;
                            for (var i = 0; i < this.userInfo.length; i++) {
                                if(this.userInfo[i].EnableTime != null && this.userInfo[i].EnableTime != ''){
                                    let sTime = new Date(this.userInfo[i].EnableTime.replace('T',' ').replace(/\-/g, "/"));
                                    wTime = parseInt((sTime.getTime() + 15*3600*24*1000- dTime.getTime() )/3600/24/1000);
                                    console.log(wTime);
                                    if((sTime.getTime() - dTime.getTime()) >= 0){
                                        this.userInfo[i].EnableTime = '未启用';
                                    } else if((sTime.getTime()+ 15*3600*24*1000- dTime.getTime()) < 0){
                                        this.userInfo[i].EnableTime = '已到期';
                                    }else{
                                        this.userInfo[i].EnableTime = wTime;
                                    }
                                } else{
                                    this.userInfo[i].EnableTime = '已到期';
                                }
                                this.userInfoCssList[i] = {checked: false};
                                this.$forceUpdate();
                            }
                        }else{
                            this.examined = res;
                            console.log(this.examined);
                            for (var i = 0; i < this.examined.length; i++) {
                                if(this.examined[i].Verify == "1"){
                                    this.examined[i].Verify = true;
                                }else{
                                    this.examined[i].Verify = false;
                                }
                                this.userInfoCssList[i] = {checked: false};
                                this.$forceUpdate();
                            }
                        }

                        this.pageIndex = this.pageIndex;
                        this.pageSize = this.pageSize;
                        console.log(res);
                        var newArr = [];
                        var maxP = Math.ceil(res.length / this.pageSize) > 10 ? 10 : Math.ceil(res.length / this.pageSize);
                        for (var i = 0; i < maxP; i++) {
                            newArr = i + 1;
                        }
                        this.pageCount = newArr;
                        this.getInfoStyle();
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            examineTabFn(bool) {
                this.examineTab = bool;
                if(bool){
                    this.verifyFlrm = "0";
                }else{
                    this.verifyFlrm = "1";
                }
                this.ajaxMode();
            },
            getInfoStyle() {
                var infos = this.userInfo;
                var val = [];
                for (var i in infos) {
                    infos[i].Integrity = parseInt(infos[i].Integrity);
                    val[i] = infos[i].Integrity;
                    if (val[i] < 30) {
                        val[i] = `#ff0000`;
                    } else if (val[i] >= 30 && val[i] < 50) {
                        val[i] = `#ff9900`;
                    } else if (val[i] >= 50 && val[i] < 80) {
                        val[i] = `#2473eb`;
                    } else {
                        val[i] = `#83c350`;
                    }
                }
                this.infoStyle = val;
                console.log(this.infoStyle);
            },
            newPage(val) {//分页展示****************************************
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
            //审核保存
            saveEdit(form){
                let data;
                if(this.PhIdList != ""){
                    data = {
                        uid: "0",
                        orgid: "0",
                        value: this.form.Verify+"*"+this.form.VerifyOpinion +"*" + this.PhIdList
                    };
                }else{
                    let list;
                    list = this.PhIdLists[0];
                    for(let i = 1;i< this.PhIdLists.length;i++){
                        list = list +"*"+ this.PhIdLists[i];
                    }
                    data = {
                        uid: "0",
                        orgid: "0",
                        value: this.form.Verify+"*"+this.form.VerifyOpinion +"*" + list
                    };
                }
                this.$axios.post('/SysOrganize/PostAudit', data)
                    .then(res => {
                        console.log(res);
                        if (res.Status == 'success') {
                            this.$message.success("审核成功");
                            this.editVisible = false;
                            this.ajaxMode();
                            this.$emit("time-click");
                            //this.$router.push({path: '/'});
                        }else{
                            this.$message.error('审核失败,请重试!');
                        }
                    })
                this.ajaxMode();
            },
            //批量审核
            verifyMany(){
                console.log(this.PhIdLists);
                console.log(this.PhIdList);
                if(this.PhIdLists.length < 1 && this.PhIdList == ""){
                    this.$message.error('请选择需要审核的组织,请重试!');
                    return;
                }else{
                    this.editVisible = true;
                }
            },
            //单选事件
            chooseOn(index, PhId, flam) {
                // console.log(this.chFlam);
                // console.log(this.PhIdLists);
                if(flam){
                    this.userInfoCssList.map((value) => {
                        return value.checked = false
                    })
                    this.userInfoCssList[index].checked = true;
                    this.$forceUpdate();
                    this.PhIdList = PhId;
                    // console.log(this.PhIdList);
                }else{
                    this.chFlam = true;
                }
                console.log(this.PhIdList);
            },
            //多选事件
            chooseMany(index, PhId){
                if(this.PhIdLists.length >0 && this.PhIdList != ''){
                    this.PhIdLists = [];
                }
                if(this.userInfoCssList[index].checked){
                    this.userInfoCssList[index].checked = false;
                    this.$forceUpdate();
                    for(let i = 0; i< this.PhIdLists.length; i++){
                        if(this.PhIdLists[i] == PhId){
                            this.PhIdLists.splice(i, 1);
                        }
                    }
                }else{
                    if(this.PhIdList != ''){
                        this.PhIdLists.push(this.PhIdList);
                        this.PhIdList = "";
                    }
                    this.userInfoCssList[index].checked = true;
                    this.$forceUpdate();
                    this.PhIdLists.push(PhId);
                }
                console.log(this.PhIdLists);
                this.chFlam = false;
            },
            routerTo(url) {
                if (this.PhIdList.length == 0) {
                    this.$message.error('请选择需要审核的组织!');
                    //alert('请点击你要审核的组织');
                    return;
                } else {
                    this.$router.push({path: url, query: {PhId: this.PhIdList}});
                }
            },
            ajaxMode() {
                let data = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                    value: '0'
                };
                this.$axios.get('/SysOrganize/GetOrganizesByAuditStatus', {params: data})
                    .then(res => {
                        let wTime = 0;
                        let dTime = new Date();
                        this.userInfo = res.Record;
                        this.dVerifyNum = res.totalRows;
                        // this.$emit("DVerifyNum",{dVerifyNum:this.dVerifyNum})
                        for (var i = 0; i < this.userInfo.length; i++) {
                            if(this.userInfo[i].EnableTime != null && this.userInfo[i].EnableTime != ''){
                                let sTime = new Date(this.userInfo[i].EnableTime.replace('T',' ').replace(/\-/g, "/"));
                                wTime = parseInt((sTime.getTime() + 15*3600*24*1000- dTime.getTime() )/3600/24/1000);
                                console.log(wTime);
                                if((sTime.getTime() - dTime.getTime()) >= 0){
                                    this.userInfo[i].EnableTime = '未启用';
                                } else if((sTime.getTime()+ 15*3600*24*1000- dTime.getTime()) < 0){
                                    this.userInfo[i].EnableTime = '已到期';
                                }else{
                                    this.userInfo[i].EnableTime = wTime;
                                }
                            } else{
                                this.userInfo[i].EnableTime = '已到期';
                            }
                            // if(this.userInfo[i].ServiceEndTime != null && this.userInfo[i].ServiceEndTime != ''){
                            //     let sTime = new Date(this.userInfo[i].ServiceEndTime.replace('T',' ').replace(/\-/g, "/"));
                            //     wTime = parseInt((sTime.getTime()- dTime.getTime())/3600/24/1000);
                            //     console.log(wTime);
                            //     if((sTime.getTime()- dTime.getTime()) >= 0){
                            //         this.userInfo[i].ServiceEndTime = wTime;
                            //     }else{
                            //         this.userInfo[i].ServiceEndTime = '已到期';
                            //     }
                            // } else{
                            //     this.userInfo[i].ServiceEndTime = '已到期';
                            // }
                            this.userInfoCssList[i] = {checked: false};
                            this.$forceUpdate();
                        }
                        this.pageIndex = res.index + 1;
                        this.pageSize = res.size;
                        var newArr = [];
                        var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                        for (var i = 0; i < maxP; i++) {
                            newArr = i + 1;
                        }
                        this.pageCount = newArr;
                        this.getInfoStyle();
                    })
                    .catch(err => {
                        console.log(err)
                    })
                let data2 = {
                    uid: "0",
                    orgid: "0",
                    pagesize: this.pageSize,
                    pageindex: this.pageIndex - 1,
                    value: '1'
                };
                this.$axios.get('/SysOrganize/GetOrganizesByAuditStatus', {params: data2})
                    .then(res => {
                        this.examined = res.Record;
                        this.yVerifyNum = res.totalRows;
                        for (var i = 0; i < this.examined.length; i++) {
                            if(this.examined[i].Verify == "1"){
                                this.examined[i].Verify = true;
                            }else{
                                this.examined[i].Verify = false;
                            }
                            if(this.examined[i].VerifyDt != null && this.examined[i].VerifyDt != ''){
                                this.examined[i].VerifyDt = this.examined[i].VerifyDt.replace('T',' ').substr(0,16);
                            }else{
                                this.examined[i].VerifyDt = "-";
                            }
                            this.userInfoCssList[i] = {checked: false};
                            this.$forceUpdate();
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
                // this.$axios.get('/SysOrganize/GetOrganizesByAuditStatus', {params: data})
                //     .then(res => {
                //         if(this.verifyFlrm == "0"){
                //             this.userInfo = res.Record;
                //             this.dVerifyNum = res.totalRows;
                //             for (var i = 0; i < this.userInfo.length; i++) {
                //                 this.userInfoCssList[i] = {checked: false};
                //                 this.$forceUpdate();
                //             }
                //         }else{
                //             this.examined = res.Record;
                //             this.yVerifyNum = res.totalRows;
                //             for (var i = 0; i < this.examined.length; i++) {
                //                 if(this.examined[i].Verify == "1"){
                //                     this.examined[i].Verify = true;
                //                 }else{
                //                     this.examined[i].Verify = false;
                //                 }
                //                 this.userInfoCssList[i] = {checked: false};
                //                 this.$forceUpdate();
                //             }
                //         }
                //
                //         this.pageIndex = res.index + 1;
                //         this.pageSize = res.size;
                //         var newArr = [];
                //         var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                //         for (var i = 0; i < maxP; i++) {
                //             newArr = i + 1;
                //         }
                //         this.pageCount = newArr;
                //     })
                //     .catch(err => {
                //         console.log(err)
                //     })
            }
        },
        mounted() {
            this.ajaxMode();
        },
        computed: {}
    }
</script>

<style scoped>

    .unionState > ul > li.lookState {
        width: 200px;
    }

    .examineTab {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
    }

    .examineTab > div {
        width: 130px;
        height: 60px;
        line-height: 60px;
        border-bottom: 8px solid transparent;
        text-align: center;
        font-size: 20px;
        font-weight: 500;
        cursor: pointer;
    }

    .examineTab > div:hover {
        border-bottom-color: #ff9900;
    }

    .examineTab > .examineTabAct {
        border-bottom-color: #83c350;
    }

    .examineTab > .examineTabAct:hover {
        border-bottom-color: #83c350;
    }

    .unionState > ul > li {
        margin-right: 20px;
        width: 50%;

    }

    .unionState > ul > li > div:first-of-type {
        width: 80px;
        font-size: 14px;
        text-align: center;
    }

    .unionState > ul > li:last-of-type > div:first-child {
        width: 110px;

    }

    .formData {
        margin-top: 10px;
    }

    .formData > ul:first-child {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
    }

    .formData > ul > li {
        border-right: 1px solid #fff;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 15%;
    }

    .formData > ul > li:nth-of-type(2) {
        width: 20%;
    }

    .formData > ul > li:nth-of-type(5) {
        width: 20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .formData > ul > li:nth-of-type(6) {
        width: 20%;
    }

    .formData > ul:first-child > li:last-of-type {
        width: 15%;
        /*border-right: 1px solid #2780d1;*/
        display: block;
    }

    .formData > ul:first-child > li:last-of-type > div {
        height: 40%;
        line-height: 25px;
    }

    .formData > ul > li:first-child {
        width: 5%;
        min-width: 31px;
        padding: 0 2px;
    }

    .formDataItems {

        border-bottom: 1px solid #ddd;
    }

    .formData > ul.formDataItems:hover {
        background: #ddd;
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

    .progressContainer {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        height: 27px;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 15px;
        background: #ebeef5;
        margin: 5px;
    }

    .progressContainer > div {
        text-align: left;
        padding-left: 3px;
    }

    .progressContainer > div.progress {
        border-radius: 15px;
        height: 100%;
        text-align: right;
        line-height: 27px;
    }

    .examSuccess, .examFailed {
        display: inline-block;
        width: 30px;
        height: 30px;
        position: relative;
        margin-top: 5px;
    }

    .examSuccess:after {
        content: "";
        position: absolute;
        width: 10px;
        height: 25px;
        border: 1px solid #3776ab;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        left: 10px;
        bottom: 5px;
    }

    .examFailed:after, .examFailed:before {
        content: "";
        position: absolute;
        width: 2px;
        height: 25px;
        background: #ff0000;
        bottom: 0px;
    }

    .examFailed:after {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    .examFailed:before {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

</style>
