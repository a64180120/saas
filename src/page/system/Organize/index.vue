<template>
    <div class="sys-page">
        <div class="container">
            <el-container>
                <el-header>
                    <div class="unionState flexPublic">
                        <ul class="flexPublic">
                            <li class="flexPublic">
                            </li>
                        </ul>
                        <ul class="flexPublic handle" style="float: right">
                            <!--<a>-->
                                <!--<li @click="changeRecord">测试</li>-->
                            <!--</a>-->
                            <a>
                                <li v-show="!isedit" @click="edit">修改</li>
                            </a>
                            <a>
                                <li v-show="isedit" @click="save" style='margin:0 0 0px 10px;'>保存</li>
                            </a>
                            <a>
                                <li @click="Backups" style='margin:0 0 0px 10px;'>备份</li>
                            </a>
                            <a>
                                <li @click="Recover" style='margin:0 0 0px 10px;'>恢复</li>
                            </a>
                            <!--<a>-->
                                <!--<li  @click="testFile" style='margin:0 0 0px 10px;'>附件</li>-->
                            <!--</a>-->
                            <a>
                                <li class="el-icon-refresh" @click="freshPage" style='margin:0 0 0px 10px;background: #FFFFFF;border-color: #ffffff;'></li>
                            </a>
                            <!--<a @click="freshPage"><li class="fresh"><img src="@/assets/icon/fresh2.svg" alt=""> </li></a>-->
                        </ul>
                    </div>
                </el-header>
                <el-main style="min-width: 900px; margin: 0 auto">
                    <h4 class="addTitle" style="font-size: 30px;font-weight: bold">基层组织账套管理</h4>
                    <div class="container" v-if='isedit'>
                    <!--<el-dialog :title="'账套信息维护'" :visible.sync="editVisible" width="40%" style="height: 800px">-->
                        <el-form :model="orgForm" :rules="rules" ref="orgForm" class="orgform" label-width="200px"
                                 label-position="right" v-loading.fullscreen.lock="loading">
                            <el-form-item label="工会名称：" prop="OrgName">
                                <el-input v-model="orgForm.OrgName" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="工会编码：" prop="EnCode">
                                <el-input v-model="orgForm.EnCode" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码：" prop="EnterpriseCode">
                                <el-input v-model="orgForm.EnterpriseCode" class="pic-input"></el-input>
                                <el-upload
                                    ref="uploadEnterprise"
                                    class="avatar-uploader"
                                    action=""
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :http-request='uploadFileMethodEnterprise'>
                                    <img v-if="orgForm.EnterpriseAttachment" :src="picUrl+orgForm.EnterpriseAttachment"
                                         class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="单位地址：" prop="Address">
                                <div style="width: 20%;float: left">
                                    <el-select v-model="orgForm.Province" placeholder="" class="pic-input-area" @change="changeProvince">
                                        <el-option
                                            v-for="item in Provinces"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            {{item.label}}
                                        </el-option>
                                    </el-select>
                                    <span style="float: right;text-align: center">省&nbsp&nbsp&nbsp&nbsp</span>
                                </div>
                                <div style="width: 20%;float: left">
                                    <el-select v-model="orgForm.City" placeholder="" class="pic-input-area" @change="changeCity">
                                        <el-option
                                            v-for="item in Citys"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            {{item.label}}
                                        </el-option>
                                    </el-select>
                                    <span style="float: right">市&nbsp&nbsp&nbsp&nbsp</span>
                                </div>
                                <div style="width: 20%;float: left">
                                    <el-select v-model="orgForm.County" placeholder="" class="pic-input-area" @change="changeCounty">
                                        <el-option
                                            v-for="item in Countys"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            {{item.label}}
                                        </el-option>
                                    </el-select>
                                    <span style="float: right">区(县)&nbsp</span>
                                </div>
                                <div style="width: 20%;float: left">
                                    <el-select v-model="orgForm.Street" placeholder="" class="pic-input-area" @change="changeStreet">
                                        <el-option
                                            v-for="item in Streets"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            {{item.label}}
                                        </el-option>
                                    </el-select>
                                    <span style="float: right">街道&nbsp&nbsp</span>
                                </div>
                                <!--<el-input v-model="orgForm.Address" class="pic-input"></el-input>-->
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="orgForm.Address" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                <el-input v-model="orgForm.TelePhone" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="隶属工会：" prop="ParentName">
                                <div style="width: 100%; height: 100%">
                                    <el-select v-model="orgForm.Parent" placeholder="" class="pic-input" @change="changeParentOrg">
                                        <el-option
                                            v-for="item in ParentLists"
                                            :key="item.PhId"
                                            :label="item.OrgName"
                                            :value="item">
                                            {{item.OrgName}}
                                        </el-option>
                                    </el-select>
                                    <!--<el-input v-model="orgForm.ParentName" class="pic-input"></el-input>-->
                                </div>

                            </el-form-item>
                            <el-form-item label="财务账户账号：" prop="FinanceAccount">
                                <el-input v-model="orgForm.FinanceAccount" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="开户行名称：" prop="BankName">
                                <el-input v-model="orgForm.BankName" class="pic-input"></el-input>
                            </el-form-item>
                            <el-form-item label="开户行号：" prop="BankAccount">
                                <el-input v-model="orgForm.BankAccount" class="pic-input"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="会计制度：">-->
                                <!--<el-input v-model="orgForm.AccountSystem" class="pic-input"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="启用日期：">-->
                            <!--<el-date-picker-->
                            <!--v-model="orgForm.EnableTime"-->
                            <!--type="date"-->
                            <!--placeholder="选择日期">-->
                            <!--</el-date-picker>-->
                            <!--</el-form-item>-->
                            <el-form-item label="工会主席：" prop="Chairman">
                                <el-input v-model="orgForm.Chairman" class="pic-input"></el-input>
                                <el-upload
                                    ref="uploadChairman"
                                    class="avatar-uploader"
                                    action=""
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :http-request='uploadFileMethodChairman'>
                                    <img v-if="orgForm.ChairmanAttachment" :src="picUrl+orgForm.ChairmanAttachment"
                                         class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="经审会主任：" prop="Director">
                                <el-input v-model="orgForm.Director" class="pic-input"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="使用期限：">-->
                            <!--<el-date-picker-->
                            <!--v-model="orgForm.ServiceStartTime"-->
                            <!--type="date"-->
                            <!--placeholder="选择开始日期">-->
                            <!--</el-date-picker>-->
                            <!--&#45;&#45;-->
                            <!--<el-date-picker-->
                            <!--v-model="orgForm.ServiceEndTime"-->
                            <!--type="date"-->
                            <!--placeholder="选择结束日期">-->
                            <!--</el-date-picker>-->
                            <!--</el-form-item>-->
                        </el-form>
                    <!--</el-dialog>-->

                    </div>
                    <div class="container" v-else>
                        <ul>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">工会名称：</span></div>
                                <div class="orgedit-value">{{orgForm.OrgName}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">工会编码：</span></div>
                                <div class="orgedit-value">{{orgForm.EnCode}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">统一社会信用代码：</span></div>
                                <div class="orgedit-value">{{orgForm.EnterpriseCode}}
                                </div>
                                <div>
                                    <el-popover trigger="hover" v-if="orgForm.EnterpriseAttachment">
                                        <img :src="picUrl+orgForm.EnterpriseAttachment" style="height: 500px;width: 500px" />
                                        <img slot="reference" :src="picUrl+orgForm.EnterpriseAttachment" style="height: 30px;width: 30px"/>
                                    </el-popover>
                                </div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">单位地址：</span></div>
                                <div class="orgedit-value">{{orgForm.Address}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">联系电话：</span></div>
                                <div class="orgedit-value">{{orgForm.TelePhone}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">隶属工会：</span></div>
                                <div class="orgedit-value">{{orgForm.ParentName}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">财务账户账号：</span></div>
                                <div class="orgedit-value">{{orgForm.FinanceAccount}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">开户行名称：</span></div>
                                <div class="orgedit-value">{{orgForm.BankName}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">开户行号：</span></div>
                                <div class="orgedit-value">{{orgForm.BankAccount}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">会计制度：</span></div>
                                <div class="orgedit-value">{{orgForm.AccountSystem}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">启用日期：</span></div>
                                <div class="orgedit-value">{{orgForm.EnableTime}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">工会主席：</span></div>
                                <div class="orgedit-value">{{orgForm.Chairman}}</div>
                                <div>
                                    <el-popover trigger="hover" v-if="orgForm.ChairmanAttachment">
                                        <img :src="picUrl+orgForm.ChairmanAttachment" style="height: 500px;width: 500px"/>
                                        <img slot="reference" :src="picUrl+orgForm.ChairmanAttachment" style="height: 30px;width: 30px" />
                                    </el-popover>
                                </div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">经审会主任：</span></div>
                                <div class="orgedit-value">{{orgForm.Director}}</div>
                            </li>
                            <li class="orgedit-linehight">
                                <div class="orgedit-title"><span class="orgtitle-ringt">使用期限：</span></div>
                                <div class="orgedit-value">{{orgForm.ServiceStartTime}}-{{orgForm.ServiceEndTime}}</div>
                            </li>
                        </ul>
                    </div>
                    <div v-if='!isedit' class="inf-change-rec">
                        <div class="inf-change-record">
                            <span class="inf-change-recordz" @click="changeRecord">信息变更记录</span>
                        </div>
                    </div>

                </el-main>

            </el-container>
            <!-- 附件弹出框 -->
            <el-dialog title="选择附件" :visible.sync="fileVisible" width="40%">
                <picture-upload class="pictrueUpload" @uploadimg="uploadimg" :imgList="imglist" :limit="3"
                                @removeimg="removeimg"></picture-upload>
            </el-dialog>
        </div>

        <el-dialog :title="'变更记录'" :visible.sync="record" width="40%" style="height: 800px">
            <el-table
                :data="tableData"
                border
                height="400"
                :extraheight='extraheight'
                class="table"
                ref="roleListTable"
                highlight-current-row
                :header-cell-style="{background:'#d3e9f9',color:'#000',textAlign:'center'}">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="changeContents" label="变更事项"  width="120"></el-table-column>
                <el-table-column prop="beforeContents" label="变更前内容" align="center"></el-table-column>
                <el-table-column prop="afterContents" label="变更后内容" align="center"></el-table-column>
                <el-table-column prop="changeTime" label="变更日期" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="record = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!--<div class="footInfo " >-->
            <!--<router-link to="">服务协议</router-link>-->
            <!--<router-link to="">运营规范</router-link>-->
            <!--<router-link to="">关于政云</router-link>-->
        <!--</div>-->
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <message :visible.sync="message.visible" :delay="message.delay" :message='message.message'></message>
    </div>

</template>

<script>
    import {mapState, mapActions} from "vuex";
    import UserInfo from "@/util/auth";
    import {SysOrgModel, SysOrgUpdate, SysOrgUploadFile, SysOrgDelete, AllAreaSysOrgModel} from '@/api/organize/orgInfo'
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import pictureUpload from "@/components/upload";

    export default {
        name: 'demo',
        data() {
            return {
                message:{
                    message:'',
                    delay:0,
                    visible:false
                },
                record: false,
                changePhid:'',
                beforeChange:{},
                extraheight:300,
                routerTz:false,
                afterChange:{},
                isedit: false,
                fileVisible: false,
                editVisible: false,
                imglist: [
                    {
                        PhId: 0,
                        BTable: 'gcw3_voucher_mst',
                        BName: 'aa.jpg',
                        BType: '.jpg',
                        BSize: '203',
                        BFilebody: '',
                        BUrlPath: '/UpLoadFiles/Voucher/2018-12-07/62ad64e635a3435d82b6cc1c770124f7.jpg',
                        BRemark: '',
                        RelPhid: ''
                    }
                ],

                tableData:[],
                Provinces:[],
                Citys:[],
                Countys:[],
                Streets:[],
                ParentLists:[],
                orgForm: {
                    // PhId: 0,
                    OrgName: '',
                    EnCode:'',
                    EnterpriseCode: '',
                    EnterpriseAttachment: '',
                    Address: '',
                    TelePhone: '',
                    FinanceAccount:'',
                    Province:'',
                    City:'',
                    County:'',
                    Street:'',
                    Parent:'',
                    ParentId:'',
                    ParentName:'',
                    ParentEnCode:'',
                    BankName:'',
                    BankAccount:'',
                    AccountSystem: '',
                    EnableTime: '',
                    Chairman: '',
                    ChairmanAttachment: '',
                    Director: '',
                    ServiceStartTime: '',
                    ServiceEndTime: '',
                    Integrity: ''
                },
                rules: {
                    Address: [
                        {required: true, message: '请输入详细地址信息', trigger: 'blur'},
                    ],
                    EnCode: [
                        {required: true, message: '请输入工会编码', trigger: 'blur'},
                    ],
                    OrgName: [
                        {required: true, message: '请输入工会名称', trigger: 'blur'},
                    ],
                    EnterpriseCode: [
                        {required: true, message: '请输入统一社会信用代码：', trigger: 'blur'},
                    ],
                    ParentName: [
                        {required: true, message: '请输入隶属工会：', trigger: 'blur'},
                    ],
                    Chairman: [
                        {required: true, message: '请输入工会主席：', trigger: 'blur'},
                    ],
                    Director: [
                        {required: true, message: '请输入经审会主任：', trigger: 'blur'},
                    ]
                }
            }
        },
        //组件
        components: {
            pictureUpload,
        },
        created() {

        },
        mounted() {
            this.getData();
            let infoData=UserInfo.getUserInfoData();
            if(infoData.orgInfo.EnCode == '' || infoData.orgInfo.EnCode == null){
                this.routerTz = true;
                this.message={
                    message:'请尽快填写组织账套信息，以便更好地使用其他功能！',
                    delay:4000,
                    visible:true
                }
            }else{
                this.routerTz = false;
            }
            console.log(infoData.orgInfo.EnCode);
            // this.selectArea(0, 0);
            // this.selectArea(this.orgForm.Province, 1);
            // this.selectArea(this.orgForm.City, 2);
            // this.selectArea(this.orgForm.County, 3);
        },
        computed: {
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid
            }),
            picUrl: function () {
                return httpConfig.baseurl;
            }
        },
        watch: {
            "orgForm.ServiceTime"(val) {
                this.orgForm.ServiceStartTime = ''
                this.orgForm.ServiceEndTime = ''
            }
        },
        methods: {
            ...mapActions({
                uploadFile: 'uploadFile/Orgupload'
            }),
            //显示组织信息更改记录
            changeRecord(){
                this.record = true;
                console.log(this.record);
                var data = {
                    id: this.changePhid,
                }
                this.$axios.get('/SysOrganize/GetOrgChangeRecord', {params: data})
                    .then(res => {
                        console.log(res);
                        this.tableData = res;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //修改编辑页显示
            edit() {
                this.editVisible = true;
                this.isedit = true;
                this.getData();
                this.selectArea(0, 0);
                this.selectArea(this.orgForm.Province, 1);
                this.selectArea(this.orgForm.City, 2);
                this.selectArea(this.orgForm.County, 3);
                this.getAdminOrganize(this.orgForm.ParentId);
                this.getParentByArea(4, this.orgForm.Street);
            },
            //改变省后的点击事件
            changeProvince(){
                console.log(this.orgForm.Province);
                this.Streets = [];
                this.Countys = [];
                this.Citys = [];
                this.selectArea(this.orgForm.Province, 1);
            },
            //改变城市后的点击事件
            changeCity(){
                this.Streets = [];
                this.Countys = [];
                this.selectArea(this.orgForm.City, 2);
            },
            //改变区后的点击事件
            changeCounty(){
                this.Streets = [];
                this.selectArea(this.orgForm.County, 3);
            },
            //改变街道后的点击事件
            changeStreet(){
                this.getParentByArea(4, this.orgForm.Street);
                // this.orgForm.Parent = '';
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
                            this.Provinces = res;
                        }else if(i == 1){
                            this.Citys = res;
                        }else if(i == 2){
                            this.Countys = res;
                        }else if(i == 3){
                            this.Streets = res;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //修改隶属工会的点击事件
            changeParentOrg(){
                console.log(this.orgForm.Parent);
                this.orgForm.ParentId = this.orgForm.Parent.PhId;
                this.orgForm.ParentEnCode = this.orgForm.Parent.EnCode;
                this.orgForm.ParentName = this.orgForm.Parent.OrgName;
            },
            //根据地址信息获取父级机关工会
            getParentByArea(i, area){
                var data = {
                    rank: i,
                    areaCode: area
                }
                this.$axios.get('/SysAdminOrganize/GetParentAdminOrganizeByArea', {params: data})
                    .then(res => {
                        console.log(res);
                        this.ParentLists = res;
                        // if(res.length > 0){
                        //     this.orgForm.Parent = res[0];
                        //     this.orgForm.ParentId = res[0].PhId;
                        //     this.orgForm.ParentEnCode = res[0].EnCode;
                        //     this.orgForm.ParentName = res[0].OrgName;
                        // }else{
                        //     this.orgForm.Parent = '';
                        //     this.orgForm.ParentId = '';
                        //     this.orgForm.ParentEnCode = '';
                        //     this.orgForm.ParentName = '';
                        // }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            getAdminOrganize(phid){
                var data = {
                    id: phid
                };
                this.$axios.get('/SysAdminOrganize/GetSysAdminOrganize', {params: data})
                    .then(res => {
                        this.orgForm.Parent = res;
                        this.orgForm.ParentId = res.PhId;
                        this.orgForm.ParentEnCode = res.EnCode;
                        this.orgForm.ParentName = res.OrgName;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //刷新页面
            freshPage() {
                this.editVisible = false;
                this.isedit = false;
                this.getData();
            },
            //修改保存
            save() {
                var route = this.$route;
                var vm = this;
                this.loading = true;
                console.log(this.orgForm.Director);
                if(this.orgForm.OrgName ==null||this.orgForm.EnCode ==null|| this.orgForm.EnterpriseCode == null || this.orgForm.Parent == null || this.orgForm.Chairman == null || this.orgForm.Director == null
                    || this.orgForm.OrgName ==''||this.orgForm.EnCode ==''||  this.orgForm.EnterpriseCode == '' || this.orgForm.Parent == '' || this.orgForm.Chairman == '' || this.orgForm.Director == ''
                    || this.orgForm.Province ==null|| this.orgForm.City == null  || this.orgForm.County == null || this.orgForm.Street == null || this.orgForm.Address == null
                    || this.orgForm.Province ==''|| this.orgForm.City == '' || this.orgForm.County == '' || this.orgForm.Street == '' || this.orgForm.Address == '' ) {
                    this.$message.error('保存失败,请将必填信息填写完整!');
                    this.getData();
                    return;
                }
                this.orgForm.Integrity = '80';
                if(this.orgForm.EnterpriseAttachment != null && this.orgForm.EnterpriseAttachment != ''){
                    this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 5;
                }
                // if(this.orgForm.Address != null && this.orgForm.Address != ''){
                //     this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 20;
                // }
                if(this.orgForm.TelePhone != null && this.orgForm.TelePhone != ''){
                    this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 10;
                }
                if(this.orgForm.ChairmanAttachment != null && this.orgForm.ChairmanAttachment != ''){
                    this.orgForm.Integrity = parseInt(this.orgForm.Integrity) + 5;
                }
                console.log(this.orgForm.Integrity);
                this.afterChange = JSON.stringify(this.orgForm);
                //提交asiox
                SysOrgUpdate(vm, {
                    otype: 'edit',
                    uid: this.userid,
                    orgid: this.orgid,
                    infoData: this.orgForm
                }).then(res => {
                    this.loading = false;
                    if (res.Status == 'success') {
                        this.message={
                            message:'保存成功！',
                            delay:4000,
                            visible:true
                        }
                        //this.$message.success("保存成功！");
                        this.editVisible = false;
                        this.isedit = false;
                        this.getData();
                        let info=UserInfo.getUserInfoData();
                        info.orgInfo.OrgName = this.orgForm.OrgName;
                        info.orgInfo.EnCode = this.orgForm.EnCode;
                        this.$store.commit("user/setUserInfo", info);
                        let info2 = UserInfo.getUserInfoData();
                        console.log(info2);
                        if(this.routerTz){
                            this.$router.push('/setting/subjectstart');
                        }
                        //移除TagNav
                        //this.$store.commit("tagNav/removeTagNav", route);
                        //跳转路由
                        //this.$router.push('/system/organization');
                    } else {
                        this.$message.error('保存失败,请重试!');
                    }
                }).catch(error => {
                    console.log(error);
                    this.loading = false;
                    this.$message.error('保存组织错误');
                })
                console.log(this.afterChange);
                console.log(this.beforeChange);
                // var data = {
                //     beforeOrg: JSON.parse(this.beforeChange),
                //     afterOrg: JSON.parse(this.afterChange),
                // };
                var data = {
                    infoData: {BeforeOrg: JSON.parse(this.beforeChange), AfterOrg: JSON.parse(this.afterChange)},
                };
                this.$axios
                    .post("/SysOrganize/PostOrgChangeRecord", data)
                    .then(res => {
                    });
            },
            //获取组织信息
            getData() {
                var vm = this;
                this.loading = true;
                if(this.isedit){
                    SysOrgModel(vm, {
                        id: this.orgid,
                        uid: this.userid,
                        orgid: this.orgid
                    }).then(res => {
                        this.loading = false;
                        if (res.Status === "error") {
                            this.$message({showClose: true, message: res.Msg, type: 'error'});
                            return;
                        }
                        this.orgForm = res;
                        this.changePhid = res.PhId;
                        this.beforeChange = JSON.stringify(res);
                        console.log(this.beforeChange);
                    }).catch(error => {
                        console.log(error);
                        this.loading = false;
                        this.$message({
                            showClose: true,
                            message: '组织信息获取错误',
                            type: 'error'
                        })
                    })

                }else{
                    AllAreaSysOrgModel(vm, {
                        id: this.orgid,
                        uid: this.userid,
                        orgid: this.orgid
                    }).then(res => {
                        this.loading = false;
                        if (res.Status === "error") {
                            this.$message({showClose: true, message: res.Msg, type: 'error'});
                            return;
                        }
                        this.orgForm = res;
                        if(this.orgForm.EnableTime != null && this.orgForm.EnableTime != ''){
                            this.orgForm.EnableTime = this.orgForm.EnableTime.substr(0,10);
                        }
                        if(this.orgForm.ServiceStartTime != null && this.orgForm.ServiceStartTime != ''){
                            this.orgForm.ServiceStartTime = this.orgForm.ServiceStartTime.substr(0,16);
                        }
                        if(this.orgForm.ServiceEndTime != null && this.orgForm.ServiceEndTime != ''){
                            this.orgForm.ServiceEndTime = this.orgForm.ServiceEndTime.substr(0,16);
                        }
                        this.changePhid = res.PhId;
                    }).catch(error => {
                        console.log(error);
                        this.loading = false;
                        this.$message({
                            showClose: true,
                            message: '组织信息获取错误',
                            type: 'error'
                        })
                    })
                }
            },
            //备份
            Backups() {
                this.$message.error('正在开发中！');
            },
            Recover(){
                this.$message.error('正在开发中！');
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
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
                formData.append('id', this.orgForm.PhId)
                formData.append("file", fileObject);

                this.uploadFile(formData).then(res => {
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    //回传的上传临时文件
                    if (res.Data[0]) {
                        this.orgForm.EnterpriseAttachment = res.Data[0];
                        this.$message.success("上传成功");
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '上传附件失败', type: 'error'})
                })
            },
            uploadFileMethodChairman(param) {
                let fileObject = param.file;
                let formData = new FormData();
                formData.append('id', this.orgForm.PhId)
                formData.append("file", fileObject);

                this.uploadFile(formData).then(res => {
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }

                    //回传的上传临时文件
                    if (res.Data[0]) {
                        this.orgForm.ChairmanAttachment = res.Data[0];
                        this.$message.success("上传成功");
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '上传附件失败', type: 'error'})
                })
            },

            testFile() {
                //this.fileVisible=true;

            },
            removeimg(item, deleValue) {
                this.imglist = item;
                console.log(item)

                var param = {
                    PhId: deleValue.phid,
                    BTable: 'gcw3_voucher_mst',
                    BUrlPath: deleValue.imgPath
                };

                this.$axios({
                    url: '/PVoucherAttachment/PostDeleteFile',
                    method: "post",
                    data: param,
                }).then(res => {
                    if (res.Status === "error") {
                        this.$message({showClose: true, message: res.Msg, type: 'error'});
                        return;
                    }

                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '附件删除错误', type: 'error'});
                });
            },
            uploadimg(item) {
                //console.log(item)
                this.imglist.push(item);
            }
        }
    }
</script>
<style lang="scss" scoped>

    .el-icon-refresh:before {
        content: "\E633";
        font-size: 20px;
        color: #00B8EE;
    }
    .inf-change-recordz{
        /* width: 100%; */
        height: 100%;
        padding: 0;
        margin: 0;
        display: block;
        /* margin-top: -210px; */
        line-height: 37px;
        text-align: center;
        font-size: 30px;
        color: #FFF;
        font-weight: bold;
        /* box-shadow: 0 0; */
        text-shadow: 0 1px 1px #012631;
    }
    .inf-change-record{
        width: 46px;
        height: 100%;
        /* position: absolute; */
        /* left: -240px; */
        /* background: #000; */
        /* margin: auto auto 0; */
        /* display: block; */
        margin-left: 9px;
        /* background: #6F6F6F; */
    }
    .inf-change-rec{
        position: absolute;
        /* bottom: 200px; */
        border-top: 40px solid transparent;
        border-bottom: 40px solid transparent;
        border-right: 60px solid #00B8EE;
        height: 300px;
        width: 50px;
        line-height: 500px;
        right: 0;
        top: 50%;
        margin-top: -150px;
        /* box-shadow: 0 1px 1px #012631; */
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
    .footInfo{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        height:70px;
        line-height: 70px;
        background: #2b3245;
        text-align: center;
        color:#fff;
        font-size: 20px;
        >a{
            color:#fff;
            padding:0 20px;
            border-right:1px solid #fff;
            &:last-of-type{
                border:0;
            }
        }
    }

    .choose > ul > li:hover {
        background: #ff9900;
        color: #fff;
    }

    .addTitle {
        font-size: 18px;
        font-size: 18px;
        text-align: center;
        padding-bottom: 10px;
    }
    .el-input--suffix .el-input__inner {
        height: auto;
        margin: 0;
        padding-right: 0;
    }
    .pic-input {
        width: 80%;
        float: left;
    }
    .pic-input-area{
        width: 70%;
        float: left;
        height: 100%;
    }
    .orgedit-linehight {
        height: 40px;
        border: 1px solid #d9d9d9;
        line-height: 40px;
    }

    .orgedit-title {
        height: 100%;
        width: 30%;
        float: left;
        color: #fff;
        font-size: 18px;
        background: #00B8EE;
    }

    .orgtitle-ringt {
        float: right;
    }

    .orgedit-value {
        height: 100%;
        width: 60%;
        float: left;
        font-size: 18px;
        margin-left: 10px;
    }
</style>
<style>
    .avatar-uploader {
        position: absolute;
        z-index: 1;
        right: 25px;
        top: -20px;
    }
    .el-input--suffix .el-input__inner {
        height: auto;
        margin: 0;
        padding-right: 0;
        width: 100%;
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

    .avatar-uploader .el-upload--text {
        width: 80px;
        height: 80px;
    }

    .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
    }

    .avatar {
        width: 80px;
        height: 80px;
        display: block;
    }

    .orgform .el-form-item__label {
        background: #6acccb;
    }

    .orgform .el-form-item {
        margin-bottom: 2px;
    }

    .pictrueUpload {
        width: 100%;
        height: 100%;
    }
    .el-form-item.is-required .el-form-item__label:before {
        content: '*';
        color:#d8281d;
        margin-right: 4px;
        font-size: 15px;
    }
</style>
