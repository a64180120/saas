<template>
    <div class="timeSelect detail">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px;min-width: 1260px;">
                        <div style="width:100%;float: right" id="elSelf"  v-if="!editType">
                            <ul class="flexUl handle">
                                <li @click="editBtn">编辑</li >
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                            <ul  class="flexUl handle" style="line-height: 30px">
                                <div class="flexPublic handle">
                                    <div class="searcherValue"><input type="text" placeholder="编码/账户名称" v-model="inputKvalue"></div>
                                    <div  class="searcherBtn" @click="searchBtn">搜索</div>
                                </div>
                            </ul>
                        </div>
                        <div style="width:100%;float: right" v-else>
                            <ul class="flexUl handle">
                                <li @click="cancelEdit">取消</li >
                                <li @click="saveData">保存</li >
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>

                        </div>
                    </div>
                    <div class="flexPublic  formData">
                        <div class="unionLists" >
                            <div class="unionListsTitle">
                                <div class="el-input el-input--prefix" style="text-align: center; padding: 3px 10px;height: 35px;overflow: hidden">类别</div>
                            </div>
                            <!--左侧类型筛选-->
                            <div class="unionListsContent">
                                <template v-for="(item,index) in subList">
                                    <div :class="{'select':selectObj.subCode==item.subCode}" @click="selectType(index)">{{item.subName}}</div>
                                </template>
                            </div>
                        </div>
                        <div class="formData" style="left: 270px;top: 0px;right: 0px;bottom: 0;width: auto;margin-top: 0;">
                            <div class="tbHeader">
                                <table>
                                    <colgroup>
                                        <col width="5%"/>
                                        <col width="5%"/>
                                        <col width="10%"/>
                                        <col width="25%"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                        <col width="15%"/>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <td style="visibility: hidden"></td>
                                            <td>序号</td>
                                            <td>编码</td>
                                            <td>账户名称</td>
                                            <td>科目</td>
                                            <td>期初余额</td>
                                            <td>停用/启用</td>
                                        </tr>
                                    </thead>

                                </table>
                            </div>
                            <div class="tbBody" id="ts">
                                <table  ref="printFrom">
                                    <colgroup>
                                        <col width="5%"/>
                                        <col width="5%"/>
                                        <col width="10%"/>
                                        <col width="25%"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                        <col width="15%"/>
                                    </colgroup>
                                    <tbody>
                                    <!--数据展示-->
                                        <template v-if="accountData.length>0">
                                            <tr v-for="(item,index) in accountData" v-if="item.DeleteMark==0">
                                                <td class="right" style="border: 0;">
                                                    <span style="float: right;" v-if="editType">
                                                        <span  class="icon blueDisIcon" @click="addAccountData">+</span>
                                                        <span  class="icon redAddIcon" @click="deletAccountData(index)">-</span>
                                                    </span>
                                                 </td>
                                                <td class="center">{{index+1}}</td>
                                                <td><input :disabled="!editType" v-model="item.Code" @change="fixCode(index)"/></td>
                                                <td ><input :disabled="!editType" v-model="item.Name" /></td>
                                                <td class="right" >
                                                    <el-select style="width: 100%;" v-model="item.Type" :disabled="!editType">
                                                        <template v-for="item in subList">
                                                            <el-option :label="item.subCode+'-'+item.subName" :value="item.subCode"></el-option>
                                                        </template>
                                                    </el-select>
                                                </td>
                                                <td class="right">
                                                    <input v-if="editType" style="text-align: right" :disabled="!editType"  v-model="item.Balance" @focus="handleFocus" @change="clearNum(index)"/>
                                                    <input v-else style="text-align: right" :disabled="true" :value="item.Balance | NumFormat" @change="clearNum(index)"/>
                                                </td>
                                                <td class="center">
                                                    <el-radio-group :disabled="!editType" v-model="item.EnabledMark">
                                                        <el-radio :key="0" :label="0" style="margin-right: 8px">启用</el-radio>
                                                        <el-radio :key="1" :label="1">停用</el-radio>
                                                    </el-radio-group>
                                                </td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td style="visibility: hidden"></td>
                                                <td class="center bolder" colspan="6">没有账户，请编辑添加！</td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
                <message :message="saasMessage.message" :visible.sync="saasMessage.visible"></message>

            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "accountTable",
        data(){
            return{
                editType:false,//是否编辑,默认不编辑
                inputKvalue:'',//搜索输入框值
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'' //消息主体内容**************
                },
                subList:[
                    {subCode:'101',subName:'库存现金',SubjectPhId: 315190115000003},
                    {subCode:'102',subName:'银行存款',SubjectPhId: 315190115000004}
                    ],
                selectObj:{subCode:'101',subName:'库存现金',SubjectPhId: 315190115000003},//选中的科目，101表示现金，102表示银行存款
                accountData:[],//存放账户列表
                accountMaxCode:['0','0'],//存放账户最大编码
            }

        },
        mounted(){
            this.getAccountData();
        },
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                orgName:state=>state.user.orgName,
                orgcode:state => state.user.orgcode,
                userid:state=>state.user.userid,
                user:state=>state,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
                dbname:state=>state.user.dbname,
            })
        },
        methods:{
            handleFocus:function(val){
                if(val.target.value=='0.00'||val.target.value=='0'){
                    val.target.value='';
                }
            },
            //禁用页面编辑
            /*disableInput:function(){
                let inputArea=document.getElementById('ts');
                let inputList=inputArea.getElementsByTagName('input');
                for(let i=0 ; i<inputList.length ; i++){
                    inputList[i].setAttribute('disabled',true);
                }
            },*/
            //页面数据获取方法
            getAccountData:function(){
                let data={
                    uid :this.userid,
                    orgid : this.orgid,
                    pageindex : '',
                    pagesize : '' ,
                    queryfilter:{"Type*str*eq*1":this.selectObj.subCode,"DeleteMark*byte*eq*1":0}
                };
                this.$axios.get('/CashierAccount/GetCashierList',{params:data}).then(res=>{
                    this.accountData=res.Record;
                }).catch(err=>{
                    console.log(err);
                })
            },
            //搜索方法
            searchBtn:function(){
                if(this.inputKvalue==''){
                    this.getAccountData();
                    return;
                }
                let loading=this.$loading();
                let data={
                    orgid:this.orgid,
                    nameOrCode:this.inputKvalue,
                    deleteMark:0,
                    enabledMark:0,
                    type:this.selectObj.subCode
                }
                this.$axios.get('/CashierAccount/GetCashiersByNameOrCode',{params:data}).then(res=>{
                    if(res.Status=='success'){
                        this.accountData=res.Data;
                    }else{
                        this.saasMessage={
                            message:'查询失败',
                            visible:true
                        };
                    }
                    loading.close();
                }).then(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //点击编辑，获取当前最大编码
            editBtn:function(){
                this.editType=true;
                let param={orgid:this.orgid};
                this.$axios.get('/CashierAccount/GetMaxCodeCashier',{params:param}).then(res=>{
                    console.log(res)
                    if(res.Data!=0){
                        this.accountMaxCode[0]=res.Data;//库存现金最大值
                        this.accountMaxCode[1]=res.Data2;//银行存款最大值
                    }
                    if(this.accountData.length==0){
                        this.addAccountData();
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            //添加一行
            addAccountData:function(){
                let code=this.selectObj.subCode=='001'?this.accountMaxCode[0]:this.accountMaxCode[1];
                if(this.accountData.length>0){
                    let currentCode=this.accountData[this.accountData.length-1].Code;
                    if(currentCode>=code){
                        code=(Number(currentCode)+1)+'';
                        if(code.length==1){
                            code='00'+code;
                        }else if(code.length==2){
                            code='0'+code;
                        }
                    }else{
                        code=(Number(code)+1)+'';
                        if(code.length==1){
                            code='00'+code;
                        }else if(code.length==2){
                            code='0'+code;
                        }
                    }
                }else{
                    if(code==0){
                        code='001'
                    }else{
                        code=(Number(code)+1)+'';
                        if(code.length==1){
                            code='00'+code;
                        }else if(code.length==2){
                            code='0'+code;
                        }
                    }
                }
                let account={
                    PhId: '',
                    Type: this.selectObj.subCode,
                    OrgId: this.orgid,
                    OrgCode: this.orgcode,
                    Code: code,
                    Name: "",
                    SubjectPhId: this.selectObj.SubjectPhId,
                    SubjectCode: this.selectObj.subCode,
                    Balance: 0,
                    DeleteMark: 0,
                    EnabledMark: 0,
                    PersistentState: 1,
                };
                //this.accountMaxCode=code;
                this.accountData.push(account);
                this.$forceUpdate;
            },
            //删除一行
            deletAccountData:function(index){
                let count=0;
                if(this.accountData[index].PhId===''){
                    if(index==this.accountData.length-1){
                        this.accountData.length=this.accountData.length-1
                    }else{
                        for(let i=index ;i<this.accountData.length-1 ;i++){
                            this.accountData[i]=this.accountData[i+1];
                        }
                        this.accountData.length=this.accountData.length-1;
                    }

                }else{
                    this.accountData[index].DeleteMark=1;
                    this.accountData[index].PersistentState=3;
                }
                for(let j=0 ; j<this.accountData.length ; j++){
                    if(this.accountData[j].DeleteMark==1){
                        count++;
                    }
                }
                if(count==this.accountData.length){
                    this.addAccountData();
                }
                this.$forceUpdate();
            },
            //修改编码
            fixCode:function(index){
                let code=this.accountData[index].Code;

                code=code.replace(/[^\d]/g,'');
                code=code.substring(0,3);
                if(code.length==1){
                    code='00'+code;
                }else if(code.length==2){
                    code='0'+code;
                }
                this.accountData[index].Code=code;
                for(let i=0 ;i<this.accountData.length ; i++){
                    if(i!=index&&code==this.accountData[i].Code){
                        this.saasMessage={
                            message:'编码有重复，请检查后，重新修改',
                            visible:true
                        };
                    }
                }
            },
            /*金额控制*/
            clearNum:function(index){
                let obj =this.accountData[index].Balance;
                //obj.value = obj.value.replace(/[\u4e00-\u9fa5]/g,"");  //清除“汉字”和“.”以外的字符
                obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
                obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
                if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                    obj= parseFloat(obj);
                }
                this.accountData[index].Balance=obj;
            },
            //左侧类型选择事件
            selectType:function(val){
                if(this.editType){
                    this.$confirm("当前页面未保存, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        this.selectObj=this.subList[val];
                        this.editType=false;
                        this.getAccountData();
                    }).catch(() => {});
                }else{
                    this.selectObj=this.subList[val];
                    this.getAccountData();
                }
            },
            //取消编辑
            cancelEdit:function(){
              this.editType=false;
              this.getAccountData();
            },
            //保存
            saveData:function(){
                let count=0,line=0;//count 删除的数量，未填的数量
                let loading=this.$loading();
                for(let i=0 ; i<this.accountData.length ; i++){
                    if(this.accountData[i].DeleteMark==1){
                        count++;
                    }
                    if(this.accountData[i].Code==''||this.accountData[i].Name==''){
                        line=i+1;
                    }
                    if(this.accountData[i].PersistentState==0){
                        this.accountData[i].PersistentState==2
                    }
                }
                if(count!=this.accountData.length-1&&line!=0){
                    this.saasMessage={
                        message:'第'+line+'行存在未填写的内容，请检查',
                        visible:true
                    };
                    loading.close();
                    return;
                }
                if(count==this.accountData.length-1&&line==this.accountData.length){

                    this.accountData.length=this.accountData.length-1;
                   /* if(this.accountData.length==0){
                        this.saasMessage={
                            message:'第1行存在未填写的内容，请检查',
                            visible:true
                        };
                        loading.close();
                        return;
                    }*/
                }
                if(this.accountData.length==0){

                    loading.close();
                    this.editType=false;
                    this.getAccountData();
                    return;
                }
                let data={
                    infoData:this.accountData
                }
                this.$axios.post('/CashierAccount/PostSaveCashierList',data).then(res=>{
                    if(res.Status=='success'){
                        this.saasMessage={
                            message:'保存成功',
                            visible:true
                        };
                        this.editType=false;
                        this.getAccountData();
                    }else{
                        this.saasMessage={
                            message:res.Msg,
                            visible:true
                        };
                    }
                    loading.close();
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                })
            },
            //页面刷新
            refresh:function(){
                this.searchBtn();
            },
        }

    }
</script>

<style scoped>
    .unionLists{
        width: 260px;
        min-width: 260px;
        margin-right: 10px;
        border: 1px solid #dadada;
        height: 100%;
    }
    .unionLists>div.unionListsTitle{
        text-align: center;
        background: #d3e9f9;
        height:48px;
        color:#333;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        z-index: 9;
        margin-left:-1px;
        border-bottom: 1px solid #dadada;
    }
    .unionListsContent{
        overflow: auto;
        width: 258px;
    }
    .unionListsContent>div{
        height: 40px;
        line-height: 40px;
        width: 80%;
        margin: auto;
        margin-top: 20px;
        border: 1px solid #00b7ee;
        color:#00b7ee;
        text-align: center;
    }
    .unionListsContent>div:hover{
        border-color: #eee;
    }
    .unionListsContent .select{
        color:#fff;
        background-color: #00b7ee;
    }

    .tbBody input{
        width: 100%;
        height: 30px;
        border: 0;
        text-align: center;
    }
    .tbBody .icon{
        display: block;
        width: 15px;
        height: 15px;
        padding: 0px;
        border-radius: 15px;
        line-height: 11px;
        text-align: center;
        cursor: pointer;
        text-indent: 0px;
    }
    .tbBody .redAddIcon{
        background-color: red;
        color: #fff;
        margin-top: 3px;
    }
    .tbBody .blueDisIcon{
        background-color: #00b7ee;
        color: #fff;
    }
    .tbBody tr span{
        display: none;
    }
    .tbBody tr:hover span{
        display: block;
    }
</style>
<style>
    .timeSelect .el-radio + .el-radio{
        margin-left: 0;
    }
</style>
