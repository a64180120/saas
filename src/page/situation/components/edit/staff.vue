<template>
    <section>
        <div class="staff_header">
            <p><span></span><span>单位编制人数</span></p>
            <ul>
                <li>
                    <span>财政负担</span>
                    <span>
                        <el-input-number v-model="staffCountList.cz" placeholder="必填" @focus="handleFocus"  :controls="false" :min="0" size="mini" :step="1" :precision="0"></el-input-number>
                    </span>
                    <span>人</span>
                </li>
                <li>
                    <span>行政负担</span>
                    <span>
                        <el-input-number  v-model="staffCountList.xz" placeholder="必填" @focus="handleFocus"   :controls="false" :min="0" size="mini" :step="1" :precision="0"></el-input-number>
                    </span>
                    <span>人</span>
                </li>
                <li>
                    <span>工会经费</span>
                    <span>
                        <el-input-number  v-model="staffCountList.gh" placeholder="必填" @focus="handleFocus"   :controls="false" :min="0" size="mini" :step="1" :precision="0"></el-input-number>
                    </span>
                    <span>人</span>
                </li>
                <li>
                    <span>合计</span>
                    <span style="color: red;">{{staffCount}}</span>
                    <span>人</span>
                </li>
            </ul>
        </div>
        <div class="staff_header">
            <p><span></span><span>人员登记情况</span></p>
            <div style="position:absolute;overflow: auto;top: 130px;bottom: 20px;right: 20px;left: 20px;">
                <table id="stuffTable">
                    <thead>
                        <tr>
                            <td style="background-color: #fff;border: none;"></td>
                            <td>序号</td>
                            <td>姓名（必填）</td>
                            <td>身份证号（必填）</td>
                            <td>性别（必填）</td>
                            <td>行政编制负担类型（必填）</td>
                            <td>员工类型（必填）</td>
                            <td>是否财会人员（必填）</td>
                            <td>是否离退休（必填）</td>
                            <td>手机号码（选填）</td>
                            <td>所在部门（选填/最多25个字符或中文）</td>
                            <td>职务/岗位（选填/最多25个字符或中文）</td>
                            <td>入职日期（选填）</td>
                            <td>离休日期（选填）</td>
                            <td>退休日期（选填）</td>
                            <td style="background-color: #fff;border: none;"></td>
                        </tr>
                    </thead>
                    <tbody >  <!-- Name CardId Sex AdminstraType PersonType IsFinance IsRetire  MobilePhone Department Post EntryDate LeaveDate RetireDate-->
                        <tr v-for="(item,index) in staffList" v-if="!(item.PersistentState&&item.PersistentState==3)">
                            <td style="position: relative;border:none;padding:0 10px">
                                <i class="el-icon-plus" @click="aodStaff(index,0)"></i>
                                <i class="el-icon-minus" @click="aodStaff(index,1)"></i>
                            </td>
                            <td>{{index+1}}</td>
                            <td><input v-model="item.Name"/></td>
                            <td style="min-width: 210px"><input v-model="item.CardId" :style="{color:item['IdCardFlag']?'red':'black'}" @blur="IDTest(index,item.CardId)"/></td>
                            <td>
                                <el-radio-group v-model="item.Sex">
                                    <el-radio v-for="op in sexOption" :label="op.value">{{op.label}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td>
                                <el-radio-group v-model="item.AdministraType">
                                    <el-radio v-for="op in atOPtion" :label="op.value">{{op.label}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td>
                                <el-radio-group v-model="item.PersonType">
                                    <el-radio v-for="op in ptOption" :label="op.value">{{op.label}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td>
                                <el-radio-group v-model="item.IsFinance">
                                    <el-radio v-for="op in ifOption" :label="op.value">{{op.label}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td>
                                <el-radio-group v-model="item.IsRetire" @change="clearIsretire(index)">
                                    <el-radio v-for="op in irOption" :label="op.value">{{op.label}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td><input v-model.number="item.MobilePhone" @blur="phoneTest(index,item.MobilePhone)"></td>
                            <td :title="item.Department"><input maxlength="25" v-model="item.Department"></td>
                            <td :title="item.Post"><input maxlength="25" v-model="item.Post"> </td>
                            <td><el-date-picker  type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" :prefix-icon="' '" :clearable="true" v-model="item.EntryDate"></el-date-picker></td>
                            <td><el-date-picker :disabled="item.IsRetire==3" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" :prefix-icon="' '" :clearable="true" v-model="item.LeaveDate"></el-date-picker></td>
                            <td><el-date-picker :disabled="item.IsRetire==2" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" :prefix-icon="' '" :clearable="true" v-model="item.RetireDate"></el-date-picker></td>
                            <td style="position: relative;border:none;padding:0 10px">
                                <i class="el-icon-plus" @click="aodStaff(index,0)"></i>
                                <i class="el-icon-minus" @click="aodStaff(index,1)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </section>
</template>

<script>
    import saasMsg from '@/components/message/message'
    export default {
        name: "staff",
        props:{
            save:{
                type:Boolean,
                default(){
                    return false
                }
            },
            staffProps:{
                type:Object,
                default(){
                    return {
                        staffList:[],
                        staffCount:{},
                    }
                }
            }
        },
        data(){
            return {
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                staffCountList:{
                    cz:0,
                    xz:0,
                    gh:0
                },
                staffCount:0,//合计，不放一起，避免监听影响

                //员工数组-保存数据用
                staffList:[],
                //员工数组-删除用，防止下标不正常
                staffListDel:[],
                staffMsg:{
                    Name:'',//姓名
                    CardId:'',//身份证号
                    Sex:'',//性别
                    AdministraType:'',//行政编制负担类
                    PersonType:'',//员工类型
                    IsFinance:'',//是否财会人员
                    IsRetire:'',//是否离退休
                    MobilePhone:'',//手机号码
                    Department:'',//所在部门
                    Post:'',//职务、岗位
                    EntryDate:'',//入职时间
                    LeaveDate:'',//离休日期
                    RetireDate:'',//退休日期
                },//需要输入的员工信息，作为新增使用

                sexOption:[{label:'男',value:1},{label:'女',value:2}],//性别单选项
                atOPtion:[{label:'财政负担',value:1},{label:'行政负担（基层）',value:2},{label:'工会经费负担',value:3}],//行政编制单选项
                ptOption:[{label:'正式',value:1},{label:'聘用',value:2},{label:'其他',value:3}],//员工类型单选项
                ifOption:[{label:'否',value:1},{label:'专职',value:2},{label:'兼职',value:3}],//是否财会单选项
                irOption:[{label:'否',value:1},{label:'离休',value:2},{label:'退休',value:3}],//是否离退

                //添加msg，用于传递给上个页面，进行页面报错
                Msg:''
            }

        },
        components:{saasMsg},
        mounted(){
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        watch:{
            staffCountList:{
                handler(val) {
                    console.log(val);
                    this.staffCount=Number(val.cz||0)+Number(val.xz||0)+Number(val.gh||0)
                },
                deep:true
            },
            save:function(val){
                if(val){
                    this.dataFilter();

                    this.$nextTick(()=>{
                        var staffL=this.staffList.concat(this.staffListDel);
                        console.log(this.staffList.concat(this.staffListDel))
                        this.$emit('getStaff',{staffList:this.staffList.concat(this.staffListDel),staffNum:this.staffCountList,staffCount:this.staffCount,Msg:this.Msg})
                    })

                }
            },
            staffProps:{
                handler(val) {
                    if(val.staffList){
                        this.staffList=val.staffList;
                    }else{
                        var staff=JSON.parse(JSON.stringify(this.staffMsg));
                        this.staffList.push(staff)
                    }

                    /* 'FinancePerNum': this.editData.FinancePerNum,
                'AdminPerNum': this.editData.AdminPerNum,
                'FundPerNum': this.editData.FundPerNum,
                'SumPerNum': this.editData.SumPerNum,*/

                    this.staffCountList={
                        cz:val.staffCount.FinancePerNum,
                        xz:val.staffCount.AdminPerNum,
                        gh:val.staffCount.FundPerNum
                    }
                    this.staffCount=val.staffCount.SumPerNum;
                },
                deep:true
            },
        },
        methods:{
            handleFocus:function(val){
                if(val.target.value=='0.00'||val.target.value=='0'||val.target.value=='0.0'){
                    val.target.value='';
                }
            },
            //滚动事件
            handleScroll: function () {
                let scObj = document.getElementById('stuffTable');//打印区域滚动

                if(scObj==undefined){
                    window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件
                }else{
                    let topHeight=scObj.parentElement.scrollTop
                    let childList=scObj.firstElementChild.firstElementChild.childNodes;
                    if(topHeight>0){
                        for(var i in childList){
                            if(childList[i].nodeType==1){
                                childList[i].style.top=topHeight-1 + 'px';
                            }
                        }
                    }else{
                        for(var i in childList){
                            if(childList[i].nodeType==1){
                                childList[i].style.top='0px';
                            }
                        }
                    }
                }
            },
            //根据离退休清除后边时间
            clearIsretire:function(index){
                if(this.staffList[index].IsRetire==2){
                    this.staffList[index].RetireDate='';
                }else{
                    this.staffList[index].LeaveDate=''
                }

            },
            //新增-0/删除-1 一条数据
            aodStaff:function(val,type){
                //Object是引用数据类型（堆）；指针指向对象，直接赋值得到的是指针，所以都指向同一个对象，一旦修改其中一条数据，全部一起改变（其实只改了指针指向的对象）；所以需要先转成基本数据类型（栈）
                var staff=JSON.parse(JSON.stringify(this.staffMsg));
                if(type==0){
                    this.staffList.splice( val+1, 0, staff);
                }else{
                    //若是后台获取的数据，则修改状态，新增的就删除，通过phid判断
                    //PersistentState  新增1，修改2，删除3
                    if(!this.staffList[val].PhId){
                        this.staffList.splice( val, 1);
                    }else{
                        this.staffList[val].PersistentState=3;
                        var delList=this.staffList.splice( val, 1)
                        this.staffListDel.push(delList[0]);
                    }

                }
                if(this.staffList.length==0){
                    this.aodStaff(-1,0,staff)
                }else{
                    var count=0;
                    this.staffList.forEach((val,index)=>{
                        if(val.PersistentState==3){count++}
                    })
                    if(count==this.staffList.length){
                        this.aodStaff(-1,0,staff)
                    }
                }
                console.log(this.staffList.length)
                staff='';
            },
            //页面数据判断，进行页面报错提示
            dataFilter:function(){
                this.Msg='';
                if(!this.staffCountList.cz){
                    this.Msg='未填写财政负担人数，请检查';
                    this.saasMessage={
                        message:this.Msg,
                        delay:3000,
                        visible:true
                    };
                    return;
                }else if(!this.staffCountList.xz){
                    this.Msg='未填写行政负担（基层）人数，请检查';
                    this.saasMessage={
                        message:this.Msg,
                        delay:3000,
                        visible:true
                    };
                    return;
                }else if(!this.staffCountList.gh){
                    this.Msg='未填写工会经费负担人数，请检查';
                    this.saasMessage={
                        message:this.Msg,
                        delay:3000,
                        visible:true
                    };
                    return;
                }else{
                    for(var i in this.staffList){
                        if(this.staffList[i].PersistentState!=3){
                            for(var j in this.staffList[i]){
                                if(j=='Name'&&!this.staffList[i][j]){
                                    this.Msg='第'+(Number(i)+1)+'条未填写姓名，请检查';
                                    this.saasMessage={
                                        message:this.Msg,
                                        delay:3000,
                                        visible:true
                                    };
                                    return;
                                }else if(j=='CardId'){
                                    if(!this.staffList[i][j]){
                                        this.Msg='第'+(Number(i)+1)+'条未填写身份证号，请检查';
                                        this.saasMessage={
                                            message:this.Msg,
                                            delay:3000,
                                            visible:true
                                        };
                                        return
                                    }else{
                                        this.IDTest(i,this.staffList[i][j]);
                                    }

                                }else if(j=='Sex'&&!this.staffList[i][j]){
                                    this.Msg='第'+(Number(i)+1)+'条未选择性别，请检查';
                                    this.saasMessage={
                                        message:this.Msg,
                                        delay:3000,
                                        visible:true
                                    };
                                    return
                                }else if(j=='AdministraType'&&!this.staffList[i][j]){
                                    this.Msg='第'+(Number(i)+1)+'条未选择行政编制负担类，请检查';
                                    this.saasMessage={
                                        message:this.Msg,
                                        delay:3000,
                                        visible:true
                                    };
                                    return
                                }else if(j=='PersonType'&&!this.staffList[i][j]){
                                    this.Msg='第'+(Number(i)+1)+'条未选择员工类型，请检查';
                                    this.saasMessage={
                                        message:this.Msg,
                                        delay:3000,
                                        visible:true
                                    };
                                    return
                                }else if(j=='IsFinance'&&!this.staffList[i][j]){
                                    this.Msg='第'+(Number(i)+1)+'条未选择是否为财会人员，请检查';
                                    this.saasMessage={
                                        message:this.Msg,
                                        delay:3000,
                                        visible:true
                                    };
                                    return
                                }else if(j=='IsRetire'&&!this.staffList[i][j]){
                                    this.Msg='第'+(Number(i)+1)+'条未选择是否离退休，请检查';
                                    this.saasMessage={
                                        message:this.Msg,
                                        delay:3000,
                                        visible:true
                                    };
                                    return
                                }else if(j=='MobilePhone'){
                                    this.phoneTest(i,this.staffList[i][j]);
                                }
                            }
                        }

                    }
                }


            },
            //身份证验证
            IDTest:function(index,val){
                var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                if (!regIdCard.test(val)){
                    this.Msg='第'+(Number(index)+1)+'条身份证号有误，请检查';
                    this.saasMessage={
                        message:this.Msg,
                        delay:3000,
                        visible:true
                    };
                    this.$set(this.staffList[index],'IdCardFlag',true);
                }else{
                    for(var i in this.staffList){
                        this.$set(this.staffList[i],'IdCardFlag',false);
                        if(this.staffList[i].CardId==this.staffList[index].CardId&&i!=index){
                            this.Msg='第'+(Number(index)+1)+'条身份证号与第'+(Number(i)+1)+'条身份证号重复，请检查';
                            this.saasMessage={
                                message:this.Msg,
                                delay:3000,
                                visible:true
                            };
                            this.$set(this.staffList[index],'IdCardFlag',true);
                            this.$set(this.staffList[i],'IdCardFlag',true);
                            return;
                        }
                    }
                    this.Msg='';
                    this.$set(this.staffList[index],'IdCardFlag',false);
                }
            },
            //手机号验证
            phoneTest:function(index,val){
                if(val){
                    var regPhone=/^1[3456789]\d{9}$/;
                    if(!regPhone.test(val)){
                        this.Msg='第'+(Number(index)+1)+'条手机号有误，请检查';
                        this.saasMessage={
                            message:this.Msg,
                            delay:3000,
                            visible:true
                        };
                        this.$set(this.staffList[index],'PhoneFlag',true);
                    }else{
                        this.Msg='';
                        this.$set(this.staffList[index],'PhoneFlag',false);
                    }
                }

            }
        },
    }
</script>

<style scoped lang="scss">
    .staff_header thead td{
        position: relative;
        z-index: 100;
    }
    .staff_header{
        >p{
            height: auto;
            margin-bottom: 10px;
            >span:nth-of-type(1){
                display: inline-block;
                width: 5px;
                height: 20px;
                background-color: #ff7c2f;
                vertical-align: bottom;
            }
            >span:nth-of-type(2){
                margin-left: 15px;
                font-weight: bolder;
            }
        }
        >ul{
            height: 48px;
            line-height: 30px;
            >li{
                display: inline-block;
                float: left;
                margin-right: 15px;
            }
        }
    }
    .staff_header input{
        border: none;
        width: 100%;
    }
    .staff_header i{
        border: 1px solid;
        border-radius: 10px;
        line-height: 15px;
        height: 17px;
        width: 17px;
        padding:0px 3px;
        font-weight: bolder;
        font-size: 10px;
        margin-top: 3px;
        cursor: pointer;
        display: block;
        visibility: hidden;
    }
    tr:hover i{
        visibility:visible;
    }
    .staff_header .el-icon-plus:before,.staff_header .el-icon-minus:before{
        margin-left:-2px;
        color: #fff;
    }
    .staff_header .el-icon-plus{

        background-color: #00B8EE;
        border-color: #00B8EE;
    }
    .staff_header .el-icon-minus{
        background-color: red;
        border-color: red;
    }
</style>
<style>
    .staff_header .el-radio-group{
        white-space: nowrap;
    }
   .staff_header .el-input--suffix .el-input__inner{
        border: 0;
    }
    .staff_header .el-date-editor{
        overflow: hidden;
    }
</style>
