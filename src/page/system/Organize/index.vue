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
                     <!-- <h6 class="addTitle">基层组织账套管理</h6> -->
                    <div class="container">
                        <el-form :model="orgForm" :rules="rules" ref="orgForm" label-width="200px" label-position="right" size="mini">
                            <el-form-item label="工会名称：" prop="OrgName">
                                <!-- <el-input v-model="orgForm.OrgName"></el-input> -->
                                 <div>{{orgForm.OrgName}}  {{userid}} {{orgid}}</div>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码：" prop="EnterpriseCode">
                                <el-input v-model="orgForm.EnterpriseCode"></el-input>
                            </el-form-item>
                            <el-form-item label="单位地址：" prop="Address">
                                <el-input v-model="orgForm.Address"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话：" prop="TelePhone">
                                <el-input v-model="orgForm.TelePhone"></el-input>
                            </el-form-item>
                            <el-form-item label="隶属工会：" prop="ParentName">
                                <el-input v-model="orgForm.ParentName"></el-input>
                            </el-form-item>
                            <el-form-item label="会计制度：" prop="AccountSystem">
                                <el-input v-model="orgForm.AccountSystem"></el-input>
                            </el-form-item>
                            <el-form-item label="启用日期：" prop="EnableTime">
                                <el-input v-model="orgForm.EnableTime"></el-input>
                            </el-form-item>
                            <el-form-item label="工会主席：" prop="Chairman">
                                <el-input v-model="orgForm.Chairman"></el-input>
                            </el-form-item>
                            <el-form-item label="经审会主任：" prop="Director">
                                <el-input v-model="orgForm.Director"></el-input>
                            </el-form-item>
                            <el-form-item label="使用期限：" prop="ServiceEndTime">
                                <el-input v-model="orgForm.ServiceEndTime"></el-input>
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

export default {
    name: 'demo',
    data(){
        return {
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
                ]
            }
        }
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
    methods: {
        save(){
            var route=this.$route;

            //移除TagNav
            this.$store.commit("tagNav/removeTagNav", route);
            //跳转路由
            this.$router.push('/home');
        }
    },
    //组件
    components: {
        
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