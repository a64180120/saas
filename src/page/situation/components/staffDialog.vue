<template>
    <section>
        <div style="text-align: right">
            <el-input
                v-model="searchValue"
                placeholder="姓名/身份证"
                clearable
                size="mini"
                style="width: 300px;">
                <el-button slot="append" class="sb" @click="getData">搜索</el-button>
            </el-input>
        </div>


        <table id="stuffTable" style="margin-top: 10px">
            <thead>
            <tr>
                <td>序号</td>
                <td>姓名</td>
                <td>身份证号</td>
                <td>性别</td>
                <!--            <td>行政编制负担类型</td>
                            <td>员工类型</td>
                            <td>是否财会人员</td>
                            <td>是否离退</td>-->
                <td>手机号码</td>
                <td>所在部门</td>
                <td>职务/岗位</td>
                <td>入职日期</td>
                <td>离休日期</td>
                <td>退休日期</td>
            </tr>
            </thead>
            <tbody >  <!-- Name CardId Sex AdminstraType PersonType IsFinance IsRetire  MobilePhone Department Post EntryDate LeaveDate RetireDate-->
            <template v-if="staffList.length>0">
                <tr v-for="(item,index) in staffList">
                    <td>{{index+1}}</td>
                    <td>{{item.Name}}</td>
                    <td>{{item.CardId}}</td>
                    <td>{{sexOption[item.Sex]}}</td>
                    <!--<td>{{atOPtion[item.AdminstraType]}}</td>
                    <td>{{ptOption[item.PersonType]}}</td>
                    <td>{{ifOption[item.IsFinance]}}</td>
                    <td>{{irOption[item.IsRetire]}}</td>-->
                    <td>{{item.MobilePhone}}</td>
                    <td>{{item.Department}}</td>
                    <td>{{item.Post}}</td>
                    <td>{{item.EntryDate?item.EntryDate.substring(0,10):''}}</td>
                    <td>{{item.LeaveDate?item.LeaveDate.substring(0,10):''}}</td>
                    <td>{{item.RetireDate?item.RetireDate.substring(0,10):''}}</td>
                </tr>
            </template>
            <template v-else>
                <tr><td colspan="10" class="center">未查询到数据</td></tr>
            </template>
            </tbody>
        </table>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </section>

</template>

<script>
    import saasMsg from '@/components/message/message'
    export default {
        name: "staffDialog",
        props:{
            prop:{
                type:Object,
            }
        },
        data(){
            return{
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                searchValue:'',//搜索值
                //员工数组
                staffList:[
                    {
                        Name:'',//姓名
                        CardId:'',//身份证号
                        Sex:1,//性别
                        AdminstraType:'',//行政编制负担类
                        PersonType:'',//员工类型
                        IsFinance:'',//是否财会人员
                        IsRetire:'',//是否离退休
                        MobilePhone:'',//手机号码
                        Department:'',//所在部门
                        Post:'',//职务、岗位
                        EntryDate:'',//入职时间
                        LeaveDate:'',//离休日期
                        RetireDate:'',//退休日期
                    }
                ],
                sexOption:{1:'男',2:'女'},//性别单选项
                atOPtion:{1:'财政负担',2:'行政负担（基层）',3:'工会经费负担'},//行政编制单选项
                ptOption:{1:'正式',2:'聘用',3:'其他',},//员工类型单选项
                ifOption:{1:'否',2:'专职',3:'兼职'},//是否财会单选项
                irOption:{1:'否',2:'离休',3:'退休'},//是否离退
            }
        },
        components:{saasMsg},
        mounted(){
            this.getData();
        },
        methods:{
            getData:function(){
                console.log(this.prop)
                let loading = this.$loading();
                this.prop['Name']=this.searchValue;
                this.$axios.get(
                    '/SysPerInormation/GetSysPerList',{params:this.prop}
                ).then(res=>{
                    console.log(res);
                    loading.close();
                    if(res.Status=="success"){
                        this.staffList=res.Data;
                    }else{
                        this.saasMessage={
                            message:res.Msg,
                            delay:3000,
                            visible:true
                        };
                    }

                }).catch(err=>{
                    loading.close();
                    console.log(err)
                })

            }
        }
    }
</script>

<style scoped>
.sb{
    background-color: #00B8EE!important;
    color: #fff!important;
}
</style>
<style>
    .el-input-group__append{
        border-color: #00B8EE;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        overflow: hidden;
    }
</style>
