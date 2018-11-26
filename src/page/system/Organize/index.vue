<template>
    <div class="sys-page">
        <div class="container">
            <el-container>
                <el-header>
                    <div class="choose">
                        <ul class="flexPublic">
                            <li @click="save">修改</li>
                            <li>备份</li>
                            <li>恢复</li>
                        </ul>
                    </div>
                </el-header>
                <el-main>
                     <h3 class="addTitle">基层组织账套管理</h3>
                    <div class="container">
                        <el-form :model="orgForm" :rules="rules" ref="orgForm" label-width="200px" label-position="right" size="mini" v-loading.fullscreen.lock="loading">
                            <el-form-item label="工会名称：" prop="OrgName">
                                <el-input v-model="orgForm.OrgName"></el-input>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码：" prop="EnterpriseCode">
                                <el-input v-model="orgForm.EnterpriseCode"></el-input>
                            </el-form-item>
                            <el-form-item label="单位地址：">
                                <el-input v-model="orgForm.Address"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                <el-input v-model="orgForm.TelePhone"></el-input>
                            </el-form-item>
                            <el-form-item label="隶属工会：" prop="ParentName">
                                <el-input v-model="orgForm.ParentName"></el-input>
                            </el-form-item>
                            <el-form-item label="会计制度：">
                                <el-input v-model="orgForm.AccountSystem"></el-input>
                            </el-form-item>
                            <el-form-item label="启用日期：">
                                <el-date-picker
                                    v-model="orgForm.EnableTime"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="工会主席：" prop="Chairman">
                                <el-input v-model="orgForm.Chairman"></el-input>
                            </el-form-item>
                            <el-form-item label="经审会主任：" prop="Director">
                                <el-input v-model="orgForm.Director"></el-input>
                            </el-form-item>
                            <el-form-item label="使用期限：">
                                <el-date-picker
                                    v-model="orgForm.ServiceStartTime"
                                    type="date"
                                    placeholder="选择开始日期">
                                </el-date-picker>
                                --
                                <el-date-picker
                                    v-model="orgForm.ServiceEndTime"
                                    type="date"
                                    placeholder="选择结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import UserInfo from "@/util/auth";
import { SysOrgModel,SysOrgAdd } from '@/api/organize/orgInfo'

export default {
    name: 'demo',
    data(){
        return {
            loading: false,
            orgForm:{
                OrgName:'新中大',
                EnterpriseCode:'',
                Address:'',
                TelePhone:'',
                ParentName:'',
                AccountSystem:'',
                EnableTime:'',
                Chairman:'',
                Director:'',
                ServiceStartTime:'',
                ServiceEndTime:''
            },
            rules:{
                OrgName:[
                    { required: true, message: '请输入工会名称', trigger: 'blur' },
                ],
                EnterpriseCode:[
                    { required: true, message: '请输入统一社会信用代码：', trigger: 'blur' },
                ],
                ParentName:[
                    { required: true, message: '请输入隶属工会：', trigger: 'blur' },
                ],
                Chairman:[
                    { required: true, message: '请输入工会主席：', trigger: 'blur' },
                ],
                Director:[
                    { required: true, message: '请输入经审会主任：', trigger: 'blur' },
                ]
            }
        }
    },
    //组件
    components: {
        
    },
    created() {
        this.getData();
    },
    mounted(){
        console.log(this.$store.state.user);
    },
    computed:{
        ...mapState({
            userid: state => state.user.userid,
            orgid: state => state.user.orgid
        })
    },
    watch:{
        "orgForm.ServiceTime"(val){
            
            this.orgForm.ServiceStartTime=''
            this.orgForm.ServiceEndTime=''
        }
    },
    methods: {
        save(){
           var route=this.$route;
           var vm=this;
           this.loading = true;
         
          //提交asiox
          SysOrgAdd(vm,{
              otype:'edit',
              uid:this.userid,
              orgid:this.orgid,
              infoData: this.orgForm
          }).then(res => {
              this.loading = false;
              if(res.Status=='success'){              
                //移除TagNav
                this.$store.commit("tagNav/removeTagNav", route);
                //跳转路由
                this.$router.push('/home');
              }else{
                  this.$message.error('保存失败,请重试!');
              }
          }).catch(error =>{
            console.log(error);
            this.loading = false;
            this.$message.error('保存组织错误');
          })
        },
        getData(){
            var vm=this;
            this.loading = true;

            SysOrgModel(vm,{
                id:547181121000001,
                uid: this.userid,
                orgid: this.orgid
            }).then(res => {
                this.loading = false;
                if(res!=undefined){
                    this.orgForm=res;
                }else{
                    this.$message.error("获取组织信息失败！");
                }
            }).catch(error =>{
                console.log(error);
                this.loading = false;
                this.$message({
                    showClose: true,
                    message: '组织信息获取错误',
                    type: 'error'
                })
            })
        }
    }
}
</script>
<style scoped>
.choose{
  background:#fff;
  padding:5px;
  font-size: 15px;
}
  .choose>ul{
    justify-content: flex-end;
  }
.choose>ul>li{
  margin-left:15px;
  padding:2px 8px;
  border:1px solid #ff9900;
  border-radius: 3px;
  cursor:pointer;
}
.choose>ul>li:hover{
  background: #ff9900;
  color:#fff;
}
  .addTitle{
    font-size: 30px;
    font-size: 30px;
    text-align: center;
    padding-bottom: 10px;
  }
</style>