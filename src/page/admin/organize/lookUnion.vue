<template>
    <div class="manageContent" style="overflow: hidden">
        <div class="examineTab">
            <div @click="examineTabFn(true)" :class="{examineTabAct:examineTab}">待审核({{dVerifyNum}})</div>
            <div @click="examineTabFn(false)" :class="{examineTabAct:!examineTab}">已审核({{yVerifyNum}})</div>
        </div>
        <!--******待审核********-->
        <div v-show="examineTab" class="unionState" style="height: 40px">

            <ul class="flexPublic handle" style="float: right;white-space: nowrap">
                <!--<router-link to="/organize/add">-->
                    <!--<li>审核</li>-->
                <!--</router-link>-->
                <li >
                    <div class="searcherValue" style="width: 200px;float:left;height: 30px;border-radius: 4px 0 0 4px">
                        <input @keyup.enter="unionSearch" v-model="unionSearchValue1" type="text" placeholder="企业/单位名称">
                    </div>
                    <div @click="unionSearch(isSearch)" class="searcherBtn" style="width: 60px;float:left;">搜索</div>
                </li>
                <a  @click.prevent="routerTo('/admin/orgin/ver')" >
                    <li style="margin:0">审核</li>
                </a>
                <a @click="verifyMany">
                    <li>批量审核</li>
                </a>
                <!--<a @click="chooseAllList">-->
                    <!--<li>全选</li>-->
                <!--</a>-->
                <!--<a @click="noChooseAllList">-->
                    <!--<li>反选</li>-->
                <!--</a>-->

            </ul>
            <ul class="flexPublic" style="float: left">
                <li >
                    <div style="float:left;line-height: 30px">信息完整度:</div>
                    <div class="selectContainer" style="float:left">
                        <select v-model="infoPersentSelect" @change="unionSearch">
                            <option v-for="item of infoPersentSelectValues" :key="item.id" :value="item.id">
                                {{item.name}}
                            </option>
                        </select>
                    </div>
                </li>
                <li >
                    <div style="float:left;line-height: 30px">距试用结束时长:</div>
                    <div style="float:left" class="selectContainer">
                        <select name="tryTimeSelect" v-model="tryTimeSelect" @change="unionSearch">
                            <option v-for="item of tryTimeSelectValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                </li>

                <!--<li class="flexPublic" style="width: 280px">
                    <div class="searcherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue1" type="text" style="width: 200px"
                                                      placeholder="企业/单位名称/联系人姓名"></div>
                    <div @click="unionSearch" class="searcherBtn" style="width: 60px">搜索</div>
                </li>-->
            </ul>
        </div>
        <div v-show="examineTab" class="formData">
            <ul>
                <li><el-checkbox  v-model="listAll"></el-checkbox></li>
                <li>序号</li>
                <li>组织编码</li>
                <li>企业/单位名称</li>
                <li>管理员姓名</li>
                <li>联系电话</li>
                <li>联系地址</li>
                <li>信息完整度（%）</li>
                <li>
                    <div>距试用结束时长</div>
                    <div>（天）</div>
                </li>
            </ul>
            <div class="hideScrollT">

            </div>
            <div class="formData notChangeCol"  style="margin-top: 0px; overflow-y: scroll;position: absolute;right: 4px;left: 20px;bottom: 50px;top: 191px;">
                <ul class="formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}"
                    @click.ctrl="chooseMany(index, item.PhId)"  @click="chooseOn(index,item,$event)" v-for="(item,index) of userInfo" :key="index">
                    <li><el-checkbox @change="changeOn(index, item)"  v-model="item.checked"></el-checkbox></li>
                    <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                    <li>{{item.EnCode}}</li>
                    <li :title="item.OrgName">{{item.OrgName}}</li>
                    <li>{{item.AdminName}}</li>
                    <li>{{item.TelePhone||item.MobilePhone}}</li>
                    <li :title="item.Address">{{item.Address}}</li>
                    <li class="flexPublic">
                        <div class="progressContainer">
                            <div class="progress" :style="{background:infoStyle[index],width:item.Integrity+'%'}" style="background-color: #ffffff;color: #fff;padding-right: 10px;">
                                {{item.Integrity <= 80 ?'':item.Integrity+'%'}}
                            </div>
                            <div
                                :style="{color:infoStyle[index],width:(100-item.Integrity)<20?20:100-item.Integrity+'%',display:(100-item.Integrity)<20?'none':'block'}">
                                {{item.Integrity}}%
                            </div>
                        </div>
                    </li>
                    <li>{{item.ServiceEndTime}}</li>
                </ul>
            </div>
            <div style="position: absolute;bottom:10px;right:30px">
                <el-pagination
                    v-show="examineTab"
                    background
                    @size-change="ajaxMode"
                    @current-change="ajaxMode"
                    :current-page.sync="pageIndex"
                    :page-sizes="[10,20, 30, 50, 70,100]"
                    :page-size.sync="pageSize"
                    layout="sizes, prev, pager, next"
                    :total="totalRows">
                </el-pagination>

            </div>
            <el-dialog :title="'批量审核'" :visible.sync="editVisible" width="30%">
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
                <el-button @click="editVisible = false" style="color: #00B8EE; border-color: #00B8EE;">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
            </span>
            </el-dialog>
        </div>
        <!--******已审核********-->
        <div v-show="!examineTab" class="unionState " style="height:30px">

            <div style="float:right;">
                <div class="searcherValue" style="float:left;border-radius: 4px 0 0 4px;">
                    <input @keyup.enter="unionSearch" v-model="unionSearchValue2" type="text" style="width: 200px" placeholder="企业名称/单位名称">
                </div>
                <div @click="unionSearch(isSearch)" class="searcherBtn" style="width: 60px;float:left">搜索</div>
            </div>
            <ul class="flexPublic" style="float:left">
                <li class="flexPublic w-100 lookState">
                    <div>审核状态:</div>
                    <div class="selectContainer">
                        <select v-model="infoVerify" @change="unionSearch(isSearch)">
                            <option v-for="item of infoVerifyValues" :key="item.id" :value="item.id">{{item.name}}
                            </option>
                        </select>
                    </div>
                </li>
            </ul>
            <!--<div class="flexPublic">-->
                <!--<div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text"-->
                                                 <!--placeholder="组织编码/名称"></div>-->
                <!--<div @click="unionSearch" class="seacherBtn">搜索</div>-->
            <!--</div>-->
        </div>
        <div v-show="!examineTab" class="formData overVerify">
            <ul>
                <li>序号</li>
                <li>企业/单位名称</li>
                <li>管理员姓名</li>
                <li>联系电话</li>
                <li>联系地址</li>
                <li>审核状态</li>
                <li>审核时间</li>
            </ul>
            <div class="hideScrollT">

            </div>

            <div class="formData notChangeCol overVerify" style="overflow-y: scroll;margin-top: 0px;position: absolute;right: 4px;left: 20px;bottom: 50px;top: 181px;">
                <ul class=" formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}"
                    @click="chooseOn(index,item.PhId)" v-for="(item,index) of examined" :key="index">
                    <li>{{index+1+(pageIndex2-1)*pageSize2}}</li>
                    <li :title="item.OrgName">{{item.OrgName}}</li>
                    <li>{{item.AdminName}}</li>
                    <li>{{item.TelePhone||item.MobilePhone}}</li>
                    <li :title="item.Address">{{item.Address}}</li>
                    <li><i :class="{examSuccess : item.Verify,examFailed : !item.Verify}"></i></li>
                    <li>{{item.VerifyDt}}</li>
                </ul>

            </div>
            <div style="position: absolute;bottom:10px;right:30px">
                <el-pagination
                    v-show="!examineTab"
                    background
                    @size-change="ajaxMode"
                    @current-change="ajaxMode"
                    :current-page.sync="pageIndex2"
                    :page-sizes="[10,20, 30, 50, 70,100]"
                    :page-size.sync="pageSize2"
                    layout="sizes, prev, pager, next"
                    :total="totalRows2">
                </el-pagination>

            </div>

        </div>
        <!--<div class="formDataPages" style="position: absolute;bottom: 10px;right: 10px;">-->
            <!--<div class="flexPublic">-->
                <!--<div>每页显示</div>-->
                <!--<div class="selectContainer flexPublic">-->
                    <!--<select name="" @change="pageSizeSelect" v-model="pageSize">-->
                        <!--<option value="10">10</option>-->
                        <!--<option value="15">15</option>-->
                        <!--<option value="20">20</option>-->
                        <!--<option value="30">30</option>-->
                    <!--</select>-->
                <!--</div>-->
                <!--<div>条</div>-->
                <!--<div class="pagesContainer">-->
                    <!--<ul class="flexPublic">-->
                        <!--<li :class="{pageDisabled:!(this.pageIndex!=1)}" @click.stop="newPage('pre')">-->
                            <!--上一页-->
                        <!--</li>-->
                        <!--<li :class="{pageActive:pageCssActive==index}" @click.stop="newPage(index)" :key="index"-->
                            <!--v-for="(item,index) of pageCount">{{item}}-->
                        <!--</li>-->
                        <!--<li :class="{pageDisabled:!(this.pageIndex%this.pageCount!=0&&this.pageIndex!=this.pageCount)}"-->
                            <!--@click.stop="newPage('next')">下一页-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <!-- 弹窗*****message:信息******delay:延迟毫秒  默认4000 -->
        <message
            :message="saasMessage.message"
            :delay="saasMessage.delay"
            :visible.sync="saasMessage.visible" >
        </message>
    </div>

</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        created() {
            this.getInfoStyle();
        },
        name: "lookUnion",
        data() {
            return {
                isSearch: true, //用来鉴别是点击搜索的事件
                listAll:false,  //列表全选
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
                pageSize: 20,
                pageIndex2: 1,
                pageSize2: 20,
                pageCount: [],
                totalRows:0,
                totalRows2:0,
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
                examined: [],
                saasMessage:{
                    message:'',
                    visible:false
                }
            }
        },
        watch:{
            listAll(bool){
                if(bool){
                    for(var vou of this.userInfo){
                        vou.checked=bool;
                    }
                    this.PhIdLists =[];
                    for(var i =0;i<this.userInfo.length ;i++){
                        this.PhIdLists.push(this.userInfo[i].PhId);
                    }
                    if(this.PhIdLists.length ==1){
                        this.PhIdList = this.PhIdLists[0];
                    }
                    //this.PhIdLists=JSON.parse(JSON.stringify(this.userInfo));
                }else if(this.userInfo.every((val,index,arr)=>{
                    return val.checked==true;
                })){
                    this.PhIdLists=[];
                    for(var vou of this.userInfo){
                        vou.checked=bool;
                    }
                }

            },
        },
        methods: {
            //搜索按钮进行搜索
            unionSearch(isSearch) {
                let data;
                let verify;
                let infoPersent;
                let tryTime;
                let data1;
                if(this.examineTab){
                    if(isSearch){
                        this.pageIndex=1;
                    }
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
                        pagesize: this.pageSize,
                        pageindex: this.pageIndex - 1,
                        integrity: infoPersent,
                        serviceEndTime: tryTime,
                        name : this.unionSearchValue1,
                        verify: 0
                    };
                    data1={
                        pagesize: this.pageSize2,
                        pageindex: this.pageIndex2 - 1,
                        integrity: 0,
                        serviceEndTime: 0,
                        name : '',
                        verify: 3
                    }
                }else{
                    if(isSearch){
                        this.pageIndex2=1;
                    }
                    if(this.infoVerify == ''){
                        verify = '3';
                    }else{
                        verify = this.infoVerify;
                    }

                    data = {
                        pagesize: this.pageSize2,
                        pageindex: this.pageIndex2 - 1,
                        integrity: 0,
                        serviceEndTime: 0,
                        name : this.unionSearchValue2,
                        verify: verify
                    };
                }
                // if(this.verifyFlrm == '0'){
                //     if(!data.name && data.integrity ==0 && data.serviceEndTime==0&& data.verify ==0){
                //         this.ajaxMode();
                //         return;
                //     }
                // }else{
                //     if(!data.name && data.integrity ==0 && data.serviceEndTime==0&& data.verify =='3'){
                //         this.ajaxMode();
                //         return;
                //     }
                // }
                // if(this.examineTab){
                //     this.$axios.get('/SysOrganize/GetOrgListByQuery', {params: data1})
                //         .then(res => {
                //             console.log(res);
                //             this.yVerifyNum = res.totalRows;
                //         })
                //         .catch(err => {
                //             console.log(err)
                //         })
                // };
                if(this.examineTab) {
                    this.$axios.get('/SysOrganize/GetOrgListByQuery', {params: data})
                        .then(res => {
                            console.log(res);
                            let wTime = '-';
                            let dTime = new Date();
                            this.userInfo = res.Record;
                            this.dVerifyNum = res.totalRows;
                            if (res.length == '0') {
                                this.saasMessage = {
                                    message: '未找到对应数据!',
                                    visible: true
                                }
                            }
                            for (var i = 0; i < this.userInfo.length; i++) {
                                this.userInfo[i].checked = false;
                                if (this.userInfo[i].ServiceEndTime != null && this.userInfo[i].ServiceEndTime != '') {
                                    let eTime = new Date(this.userInfo[i].ServiceEndTime.replace('T', ' ').replace(/\-/g, "/"));
                                    let sTime = new Date(this.userInfo[i].ServiceStartTime.replace('T', ' ').replace(/\-/g, "/"));
                                    wTime = parseInt((eTime.getTime() - dTime.getTime()) / 3600 / 24 / 1000);
                                    if ((sTime.getTime() - dTime.getTime()) >= 0) {
                                        this.userInfo[i].ServiceEndTime = '未启用';
                                    } else if ((eTime.getTime() - dTime.getTime()) < 0) {
                                        this.userInfo[i].ServiceEndTime = '已到期';
                                    } else {
                                        this.userInfo[i].ServiceEndTime = wTime;
                                    }
                                } else {
                                    this.userInfo[i].ServiceEndTime = '已到期';
                                }
                                // if(this.userInfo[i].EnableTime != null && this.userInfo[i].EnableTime != ''){
                                //     let sTime = new Date(this.userInfo[i].EnableTime.replace('T',' ').replace(/\-/g, "/"));
                                //     wTime = parseInt((sTime.getTime() + 15*3600*24*1000- dTime.getTime() )/3600/24/1000);
                                //     if((sTime.getTime() - dTime.getTime()) >= 0){
                                //         this.userInfo[i].EnableTime = '未启用';
                                //     } else if((sTime.getTime()+ 15*3600*24*1000- dTime.getTime()) < 0){
                                //         this.userInfo[i].EnableTime = '已到期';
                                //     }else{
                                //         this.userInfo[i].EnableTime = wTime;
                                //     }
                                // } else{
                                //     this.userInfo[i].EnableTime = '已到期';
                                // }
                                if (this.userInfo[i].Integrity == null || this.userInfo[i].Integrity == '') {
                                    this.userInfo[i].Integrity = 35;
                                }
                                this.userInfoCssList[i] = {checked: false};
                                this.$forceUpdate();
                            }
                            var ulList = document.getElementsByClassName('notChangeCol')[0];
                            ulList.scrollTop = 0;
                            this.getInfoStyle();
                            this.pageIndex = res.index+1;
                            this.pageSize = res.size;
                            this.totalRows=res.totalRows;
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else{
                    this.$axios.get('/SysOrganize/GetOrgListByQuery', {params: data})
                        .then(res => {
                            if(res.Status=='error'){
                                this.examined=[];
                            }else{
                                this.examined = res.Record;
                                this.yVerifyNum = res.totalRows;
                            }
                            if(this.examined.length=='0'){
                                this.saasMessage={
                                    message:'未找到对应数据!',
                                    visible:true
                                }
                            }
                            for (var i = 0; i < this.examined.length; i++) {
                                //this.examined[i].checked = false;
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
                            var ulList=document.getElementsByClassName('notChangeCol overVerify')[0];
                            ulList.scrollTop=0;
                            this.getInfoStyle();
                            this.pageIndex2 = res.index+1;
                            this.pageSize2 = res.size;
                            this.totalRows2 = res.totalRows;
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }

                // if(this.examineTab){
                //     this.pageIndex = res.index+1;
                //     this.pageSize = res.size;
                //     this.totalRows=res.totalRows;
                // }else{
                //     this.pageIndex2 = res.index+1;
                //     this.pageSize2 = res.size;
                //     this.totalRows2 = res.totalRows;
                // }
                        // this.pageCount =[];
                        // this.pageIndex = res.index+1;
                        // this.pageSize = res.size;
                        //
                        // this.totalRows2 = res.totalRows;
                        // this.totalRows=res.totalRows;
                        // var newArr = [];
                        // var maxP = Math.ceil(res.totalRows / this.pageSize) > 10 ? 10 : Math.ceil(res.totalRows / this.pageSize);
                        // for (var i = 0; i < maxP; i++) {
                        //     newArr = i + 1;
                        // }
                        // this.pageCount = newArr;

            },
            //判断显示已审核或未审核页面
            examineTabFn(bool) {
                this.pageIndex= 1,
                this.pageSize= 20,
                this.pageIndex2= 1,
                this.pageSize2= 20,
                // this.pageIndex= 1,
                // this.pageSize= '15',
                this.examineTab = bool;
                if(bool){
                    this.verifyFlrm = "0";//审核
                }else{
                    this.verifyFlrm = "1";//未审核
                }
                //this.ajaxMode();
                this.unionSearch();
            },
            //列表中信息完整性样式展示
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

            },
            //分页展示
            newPage(val) {//分页展示****************************************
                if (val == 'next') {
                    if (this.pageIndex % this.pageCount != 0 && this.pageIndex != this.pageCount) {
                        this.pageIndex++;
                    }
                } else if (val == 'pre') {
                    if (this.pageIndex % this.pageCount != 1) {
                        this.pageIndex--;
                    }
                } else {
                    this.pageIndex = val + 1;
                }
                this.pageCssActive = this.pageIndex - 1;
                this.ajaxMode();
            },
            pageSizeSelect() {
                this.pageIndex=1;
                this.pageCssActive = this.pageIndex - 1;
                this.ajaxMode();
            },
            //反选事件
            noChooseAllList(){
                let list = this.PhIdLists;
                this.PhIdLists = [];
                let flam;
                for(let i=0;i< this.userInfo.length;i++){
                    flam = true;
                    if(this.userInfoCssList[i].checked){
                        this.userInfoCssList[i].checked = false;
                    }else{
                        this.userInfoCssList[i].checked = true;
                    }
                    for(let j =0;j<list.length;j++){
                        if(list[j] == this.userInfo[i].PhId){
                            flam = false;
                        }
                    }
                    if(flam){
                        this.PhIdLists.push(this.userInfo[i].PhId);
                    }
                }
                this.$forceUpdate();

            },
            //全选事件
            chooseAllList(){
                if(this.PhIdList.length==this.userInfo.length){
                    this.PhIdList = [];
                    this.userInfoCssList.map((value) => {
                        return value.checked = false;
                    })
                    this.$forceUpdate();
                }else{
                    this.PhIdList = [];
                    this.userInfoCssList.map((value) => {
                        return value.checked = true;
                    })
                    this.$forceUpdate();
                    for(let i =0;i<this.userInfo.length;i++){
                        this.PhIdList.push(this.userInfo[i].PhId);
                    }
                }
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

                if(this.PhIdLists.length < 1 && this.PhIdList == ""){
                    this.$message.error('请选择需要审核的组织,请重试!');
                    return;
                }else{
                    this.editVisible = true;
                }
            },
            //点击选择框
            changeOn(index, item){
                let list = this.PhIdLists;
                console.log(item);
                if(!item.checked){
                    this.PhIdLists.forEach((val,i,arr)=>{
                        if(val ==item.PhId){
                            this.PhIdLists.splice(i,1);
                            console.log(val);
                        }
                    });
                    this.$forceUpdate();
                }else{
                    this.PhIdLists.push(item.PhId);
                    this.$forceUpdate();
                }
                if(this.PhIdLists.length == 1){
                    this.PhIdList = this.PhIdLists[0];
                }else{
                    this.PhIdList = '';
                }
                let val;
                val=this.userInfo.every((val,index,arr)=>{
                    return val.checked==true
                })
                if(val){
                    this.listAll=true;
                }else{
                    this.listAll=false;
                }
                this.$forceUpdate();

            },
            //单选事件
            chooseOn(index, item,$event) {

                if($event.target.className=="el-checkbox__inner" || $event.target.className=="el-checkbox__original"){
                    return;
                }
                // else{
                //     if(item.checked){
                //         item.checked = false;
                //     }else {
                //         item.checked = true;
                //     }
                //     //item.checked =!item.checked;
                //     this.changeOn(index, item);
                // }
                let list = this.PhIdLists;
                if(item.checked){
                    item.checked = false;
                    this.PhIdLists.forEach((val,i,arr)=>{
                        if(val ==item.PhId){
                            this.PhIdLists.splice(i,1);
                            //console.log(this.PhIdList);
                        }
                    });
                    this.$forceUpdate();
                }else{
                    item.checked = true;
                    this.PhIdLists.push(item.PhId);
                    /*return;*/
                    this.$forceUpdate();
                }
                // if(flam){
                //     let list = this.PhIdLists;
                //     if(this.userInfoCssList[index].checked){
                //         this.userInfoCssList[index].checked = false;
                //         this.PhIdLists.forEach((val,i,arr)=>{
                //             if(val ==PhId){
                //                 this.PhIdLists.splice(i,1);
                //                 //console.log(this.PhIdList);
                //             }
                //         });
                //         this.$forceUpdate();
                //
                //     }else{
                //         this.userInfoCssList[index].checked = true;
                //         this.PhIdLists.push(PhId);
                //         this.$forceUpdate();
                //     }
                // }else{
                //     this.chFlam = true;
                // }
                if(this.PhIdLists.length == 1){
                    this.PhIdList = this.PhIdLists[0];
                }else{
                    this.PhIdList = '';
                }
                let val;
                val=this.userInfo.every((val,index,arr)=>{
                    return val.checked==true
                })
                if(val){
                    this.listAll=true;
                }else{
                    this.listAll=false;
                }

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
                var route=this.$route;
                if (this.PhIdList.length == 0) {
                    this.$message.error('请选择一个需要审核的组织!');
                    //alert('请点击你要审核的组织');
                    return;
                } else {
                    //this.$store.commit("tagNav/removeTagNav", route);
                    this.$router.push({path: url, query: {PhId: this.PhIdList}});
                }
            },
            ajaxMode() {
                this.listAll=false;
                this.PhIdLists =[];
                this.PhIdList ='';
                this.form.VerifyOpinion='';
                let data1={
                        pagesize: this.pageSize2,
                        pageindex: this.pageIndex2 - 1,
                        integrity: 0,
                        serviceEndTime: 0,
                        name : '',
                        verify: 3
                    };
                if(this.examineTab){
                    this.$axios.get('/SysOrganize/GetOrgListByQuery', {params: data1})
                        .then(res => {
                            console.log(res);
                            this.yVerifyNum = res.totalRows;
                        })
                        .catch(err => {
                            console.log(err)
                        })
                };
                this.unionSearch();
                // const loading=this.$loading();
                // if(this.examineTab){
                //     let  data = {
                //         pagesize: this.pageSize,
                //         pageindex: this.pageIndex - 1,
                //         integrity: 0,
                //         serviceEndTime: 0,
                //         name : '',
                //         verify: 0
                //     };
                //     // let data = {
                //     //     uid: "0",
                //     //     orgid: "0",
                //     //     pagesize: this.pageSize,
                //     //     pageindex: this.pageIndex - 1,
                //     //     value: '0',
                //     //     isSystem:'0'
                //     // };
                //     ///SysOrganize/GetOrganizesByAuditStatus
                //     this.$axios.get('/SysOrganize/GetOrgListByQuery', {params: data})
                //         .then(res => {
                //             loading.close();
                //             let wTime = 0;
                //             let dTime = new Date();
                //             this.userInfo = res.Record;
                //             this.dVerifyNum = res.totalRows;
                //             for(var vou of this.userInfo){
                //                 vou.checked=false;
                //             }
                //             // this.$emit("DVerifyNum",{dVerifyNum:this.dVerifyNum})
                //             for (var i = 0; i < this.userInfo.length; i++) {
                //                 if(this.userInfo[i].EnableTime != null && this.userInfo[i].EnableTime != ''){
                //                     let sTime = new Date(this.userInfo[i].EnableTime.replace('T',' ').replace(/\-/g, "/"));
                //                     wTime = parseInt((sTime.getTime() + 15*3600*24*1000- dTime.getTime() )/3600/24/1000);
                //
                //                     if((sTime.getTime() - dTime.getTime()) >= 0){
                //                         this.userInfo[i].EnableTime = '未启用';
                //                     } else if((sTime.getTime()+ 15*3600*24*1000- dTime.getTime()) < 0){
                //                         this.userInfo[i].EnableTime = '已到期';
                //                     }else{
                //                         this.userInfo[i].EnableTime = wTime;
                //                     }
                //                 } else{
                //                     this.userInfo[i].EnableTime = '已到期';
                //                 }
                //                 if(this.userInfo[i].Integrity == null || this.userInfo[i].Integrity == ''){
                //                     this.userInfo[i].Integrity = 35;
                //                 }
                //                 // if(this.userInfo[i].ServiceEndTime != null && this.userInfo[i].ServiceEndTime != ''){
                //                 //     let sTime = new Date(this.userInfo[i].ServiceEndTime.replace('T',' ').replace(/\-/g, "/"));
                //                 //     wTime = parseInt((sTime.getTime()- dTime.getTime())/3600/24/1000);
                //                 //     console.log(wTime);
                //                 //     if((sTime.getTime()- dTime.getTime()) >= 0){
                //                 //         this.userInfo[i].ServiceEndTime = wTime;
                //                 //     }else{
                //                 //         this.userInfo[i].ServiceEndTime = '已到期';
                //                 //     }
                //                 // } else{
                //                 //     this.userInfo[i].ServiceEndTime = '已到期';
                //                 // }
                //                 this.userInfoCssList[i] = {checked: false};
                //                 this.$forceUpdate();
                //             }
                //             this.pageCount =[];
                //             this.pageIndex = res.index + 1;
                //             this.pageSize = res.size;
                //             var newArr = [];
                //             var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                //             for (var i = 0; i < maxP; i++) {
                //                 newArr = i + 1;
                //             }
                //             this.pageCount = newArr;
                //             var ulList=document.getElementsByClassName('notChangeCol')[0];
                //             console.log(ulList)
                //             ulList.scrollTop=0;
                //
                //             this.getInfoStyle();
                //         })
                //         .catch(err => {
                //             loading.close();
                //             console.log(err)
                //         })
                //     let data2 = {
                //         uid: "0",
                //         orgid: "0",
                //         pagesize: this.pageSize,
                //         pageindex: this.pageIndex - 1,
                //         value: '1',
                //         isSystem:'0'
                //     };
                //     this.$axios.get('/SysOrganize/GetOrganizesByAuditStatus', {params: data2})
                //         .then(res => {
                //             loading.close();
                //             this.yVerifyNum = res.totalRows;
                //         })
                //         .catch(err => {
                //             loading.close();
                //             console.log(err)
                //         })
                // }else{
                //     let data2 = {
                //         uid: "0",
                //         orgid: "0",
                //         pagesize: this.pageSize,
                //         pageindex: this.pageIndex - 1,
                //         value: '1',
                //         isSystem:'0'
                //     };
                //     this.$axios.get('/SysOrganize/GetOrganizesByAuditStatus', {params: data2})
                //         .then(res => {
                //             loading.close();
                //             console.log(res);
                //             // var yVerifyList = res.Record;
                //             this.examined = res.Record;
                //             this.yVerifyNum = res.totalRows;
                //             // for (var i = 0; i < yVerifyList.length; i++) {
                //             //     if(yVerifyList[i].Verify == "1"){
                //             //         yVerifyList[i].Verify = true;
                //             //     }else{
                //             //         yVerifyList[i].Verify = false;
                //             //     }
                //             //     if(yVerifyList[i].VerifyDt != null && yVerifyList[i].VerifyDt != ''){
                //             //         yVerifyList[i].VerifyDt = yVerifyList[i].VerifyDt.replace('T',' ').substr(0,16);
                //             //     }else{
                //             //         yVerifyList[i].VerifyDt = "-";
                //             //     }
                //             //     this.userInfoCssList[i] = {checked: false};
                //             //     this.$forceUpdate();
                //             // }
                //             for (var i = 0; i < this.examined.length; i++) {
                //                 if(this.examined[i].Verify == "1"){
                //                     this.examined[i].Verify = true;
                //                 }else{
                //                     this.examined[i].Verify = false;
                //                 }
                //                 if(this.examined[i].VerifyDt != null && this.examined[i].VerifyDt != ''){
                //                     this.examined[i].VerifyDt = this.examined[i].VerifyDt.replace('T',' ').substr(0,16);
                //                 }else{
                //                     this.examined[i].VerifyDt = "-";
                //                 }
                //                 this.userInfoCssList[i] = {checked: false};
                //                 this.$forceUpdate();
                //             }
                //             this.pageCount =[];
                //             this.pageIndex = res.index + 1;
                //             this.pageSize = res.size;
                //             var newArr = [];
                //             var maxP = Math.ceil(res.totalRows / res.size) > 10 ? 10 : Math.ceil(res.totalRows / res.size);
                //             for (var i = 0; i < maxP; i++) {
                //                 newArr = i + 1;
                //             }
                //             this.pageCount = newArr;
                //             var ulList=document.getElementsByClassName('notChangeCol')[1];
                //             console.log(ulList)
                //             ulList.scrollTop=0;
                //         })
                //         .catch(err => {
                //             loading.close();
                //             console.log(err)
                //         })

            }
        },
        mounted() {
            this.ajaxMode();
        },
        activated(){
            this.ajaxMode();
            this.PhIdLists =[];
            this.PhIdList ='';
        },
        computed: {}
    }
</script>

<style scoped>

    .hideScroll{
        position: absolute;
        top:140px;
        right:20px;
        width: 16px;
        height:100%;
        background: #fff;
    }
    .hideScrollT{
        position: absolute;
        top:132px;
        right:4px;
        width: 17px;
        height:100%;
        background: #fff;
        z-index: 99;
    }
    .notChangeCol> ul:first-child {
        background: transparent;
        color: #000;
    }
    ul.formDataItems.flexPublic.userInfoCss {
        background: #bbb !important;
    }

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
        margin-right: 10px;
        width:auto;

    }

    .unionState > ul > li > div:first-of-type {
        width: 105px;
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
        font-size: 18px;
    }

    .formData > ul > li:nth-of-type(3) {
        width: 15%;
    }

    .formData > ul > li:nth-of-type(6) {
        width: 15%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData > ul > li:nth-of-type(5) {
        width: 15%;
    }
    .formData > ul > li:nth-of-type(4) {
        width: 20%;
    }
    .formData > ul > li:nth-of-type(7) {
        width: 20%;
    }
    .formData > ul > li:nth-of-type(8) {
        width: 15%;
    }
    .formData > ul > li:nth-of-type(2) {
        width: 8%;
    }

    .overVerify > ul > li {
        border-right: 1px solid #fff;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 15%;
    }
    .overVerify > ul > li:nth-of-type(3) {
        width: 10%;
    }
    .overVerify > ul > li:nth-of-type(6) {
        width: 10%;
    }
    .overVerify > ul > li:nth-of-type(7) {
        width: 15%;
    }
    .overVerify > ul > li:nth-of-type(5) {
        width: 25%;
    }
    .overVerify > ul > li:nth-of-type(4) {
        width: 15%;
    }
    .overVerify > ul > li:nth-of-type(2) {
        width: 20%;
    }
    .overVerify > ul > li:first-child {
        width: 5%;
        min-width: 31px;
        padding: 0 2px;
    }
    .overVerify > ul:first-child > li:last-of-type {
        width: 15%;
        /*border-right: 1px solid #2780d1;*/
        display: block;
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
        background-color: #fafafa;
        transition: background-color .25s ease;
    }

    .formData > ul.formDataItems > li {
        border-right: 1px solid #ddd;
        border-left: 0;
        border-bottom: 0;
        text-align: center;
        line-height: 40px;
        height: 40px;
        font-size: 18px;
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
        width: 5px;
        height: 14px;
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
        height: 15px;
        background: #ff0000;
        bottom: 5px;
        left: 11px;
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
