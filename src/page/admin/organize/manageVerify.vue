<template>
    <div class="manage-verify6">

        <div class="container">
            <div class="handle-box" style="margin-left: 30px">
                <el-row>
                    <el-col :span="50">
                        <span style="font-size: 25px;border-left: 5px solid rgb(136, 185, 39);padding-left: 10px;">组织信息</span>
                    </el-col>

                </el-row>
                <el-row>
                    <div style="margin: 20px">
                        <el-form ref="form" :model="form" label-width="150px">
                            <el-form-item label="工会名称">
                                <el-input v-model="form.OrgName"></el-input>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码">
                                <el-input v-model="form.EnterpriseCode"></el-input>
                            </el-form-item>
                            <el-form-item label="单位地址">
                                <el-input v-model="form.Address"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <el-input v-model="form.MobilePhone"></el-input>
                            </el-form-item>
                            <el-form-item label="隶属工会">
                                <el-input v-model="form.ParentName"></el-input>
                            </el-form-item>
                            <el-form-item label="工会主席">
                                <el-input v-model="form.Chairman"></el-input>
                            </el-form-item>
                            <el-form-item label="经审会主任">
                                <el-input v-model="form.Director"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-row>


                <el-row>
                    <el-col :span="50">
                        <span style="font-size: 25px;border-left: 5px solid rgb(136, 185, 39);padding-left: 10px;">审核状态</span>
                    </el-col>
                </el-row>
                <el-row style="margin:10px 0 40px 40px">
                    <template>
                        <el-radio v-model="Verify" label="1">通过</el-radio>
                        <el-radio v-model="Verify" label="2">不通过</el-radio>
                    </template>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="50">
                        <span style="font-size: 25px;border-left: 5px solid rgb(136, 185, 39);padding-left: 10px;">审核意见</span>
                    </el-col>
                </el-row>
                <el-row style="margin:10px 0 40px 40px">
                    <el-input
                        placeholder="请输入内容"
                        v-model="VerifyOpinion"
                        class=""
                        clearable>
                    </el-input>
                </el-row>
            </div>
            <div class="choose">
                <ul>

                    <li @click="addFinished(false)" style="color: #00B8EE; border-color: #00B8EE;background: #fff;">取消</li>
                    <li @click="addFinished(true)">保存</li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState, mapActions,store } from "vuex";
    import md5 from 'js-md5';
    import qs from 'qs';
    // export default {
    //     name: "manageVerify"
    // }
    export default {
        data () {
            return {
                Verify: '1',
                VerifyOpinion:'',
                form:{
                    PhId:'',
                    OrgName: '',
                    EnterpriseCode:'',
                    Address:'',
                    MobilePhone:'',
                    ParentName:'',
                    Chairman:'',
                    Director:''
                }
            };
        },
        methods: {
            addFinished(bool) {//添加文件上传**************************
                if (!bool) {
                    this.$store.commit("tagNav/removeTagNav", this.$route);
                    //this.$store.commit("tagNav/upexcludeArr", ['lookUnion']);
                    this.$router.push({path: "/admin/orgin"});
                } else {
                    console.log(this.form.PhId);
                    console.log(this.Verify+"*"+this.VerifyOpinion +"*" + this.form.PhId);
                    console.log(this.VerifyOpinion);
                    var data = {
                        uid: "0",
                        orgid: "0",
                        value: this.Verify+"*"+this.VerifyOpinion +"*" + this.form.PhId
                    };
                    this.$axios.post('/SysOrganize/PostAudit', data)
                        .then(res => {
                            console.log(res);
                            if (res.Status == 'success') {
                                this.$message.success("审核成功");
                                this.$store.commit("tagNav/removeTagNav", this.$route);
                                //this.$store.commit("tagNav/upexcludeArr", ['lookUnion']);
                                this.$router.push({path: "/admin/orgin"});
                                //this.$store.commit("tagNav/upexcludeArr", ['lookUnion']);
                                // this.$emit('LookUnion');
                                //this.$router.push({path: '/'});
                            }else{
                                this.$message.error('审核失败,请重试!');
                            }
                        })
                }
            },
            init() {
                var PhIdList = this.$route.query.PhId;
                var data = {
                    id: PhIdList
                };
                this.$axios.get('/SysOrganize/GetAllAreaSysOrganize', {params: data})
                    .then(res => {
                        console.log(res);
                        this.form.PhId = res.PhId;
                        this.form.OrgName = res.OrgName;
                        this.form.EnterpriseCode = res.EnterpriseCode;
                        this.form.Address = res.Address;
                        this.form.MobilePhone = res.MobilePhone;
                        this.form.ParentName = res.ParentName;
                        //this.Telephone = res.Telephone;
                        this.form.Chairman = res.Chairman;
                        this.form.Director = res.Director;
                        // this.EnableTime = res.EnableTime;
                        // this.ServiceStartTime = res.ServiceStartTime;
                        // this.ServiceEndTime = res.ServiceEndTime;
                        // //this.Parent = res.ParentId;
                        // this.ParentId = res.ParentId;
                        // this.ParentCode = res.ParentEnCode;
                        // this.AccountSystem = res.AccountSystem;
                        // this.Province = res.Province;
                        // this.City = res.City;
                        // this.County = res.County;
                        // this.Street = res.Street;
                        // this.EnterpriseAttachment= res.EnterpriseAttachment,
                        // this.ChairmanAttachment = res.ChairmanAttachment,
                        // this.NgRecordVer = res.NgRecordVer;
                    })
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    .el-input--suffix .el-input__inner {
        margin: 0;
        padding-right: 0;
        height: 100px;
        width: 400px;
    }
    .el-input__inner:hover {
        border-color: #c0c4cc;
        width: 400px;
    }
    .choose {
        background: #fff;
        padding: 5px;
        font-size: 15px;
    }
    .choose > ul {
        text-align: center;
    }

    .choose > ul > li {
        margin-left: 15px;

        border-radius: 3px;
        cursor: pointer;

        display: inline-block;
        height: 30px;
        line-height: 30px;
        width: 100px;
    }
    .choose >ul > li:nth-of-type(1){
        border: 1px solid #b7c2c5;
        background: #b7c2c5;
        color: #FFFFFF;
    }
    .choose >ul > li:nth-of-type(2){
        border: 1px solid #00B8EE;
        background: #00B8EE;
        color: #FFFFFF;
    }
    .choose > ul > li:nth-of-type(1):hover {
        background: #FFFFFF;
        color: #b7c2c5;
    }
    .choose > ul > li:nth-of-type(2):hover {
        background: #FFFFFF;
        color: #00B8EE;
    }
    .container{
        margin-bottom: 70px;
    }
</style>
<style>
    .manage-verify6 .el-input--suffix .el-input__inner {
        margin: 0;
        padding-right: 0;
        height: 120px;
        width: 800px;
    }
    .manage-verify6 .el-input__inner {
        border-color: #c0c4cc;
        width: 600px;
    }
</style>
