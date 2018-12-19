<template>

    <div class="voucherList">
        <div class="voucherNav">
            <ul>
                <router-link to="/finance/voucherAdd"><li>新增</li></router-link>
                <a @click.prevent="handle('update')"><li>修改</li></a>
                <a @click.prevent="handle('delete')"><li>删除</li></a>
                <a @click.prevent="handle('audit')"><li>审核</li></a>
                <a @click.prevent="handle('unaudit')"><li>反审核</li></a>
                <a @click.prevent="handle('copy')"><li>复制</li></a>
                <a @click.prevent="handle('cut')"><li>剪切</li></a>
                <a @click.prevent="handle('chongh')"><li>冲红</li></a>
                <a @click.prevent="handle('reset')"><li>凭证重排</li></a>
                <a @click.prevent="handle('upload')"><li>导入</li></a>
                <a @click.prevent="handle('download')"><li>导出</li></a>
                <a @click.prevent="handle('print')"><li>打印</li></a>
            </ul>
        </div>
        <div class="voucherSelect">
            <div>
                <label >合计金额(元):&nbsp; <div class="inputContainer"><input v-model="sum1" type="text"></div> </label>
                <label >至:&nbsp;<div class="inputContainer"><input v-model="sum2" type="text"></div></label>
            </div>
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input @keyup.13="searchVoucher" v-model="searchVal" type="text" placeholder="科目/摘要/凭证号"></div>
                <div @click="searchVoucher" class="searcherBtn">搜索</div>
                <div @click.stop="highGradeToggle(true)">高级</div>
                <div v-if="highGradeCss" class="highGradeCss">
                    <div><span>高级查询</span><i @click.stop="highGradeToggle(false)" class="cancle"></i></div>
                    <ul>
                        <li>
                            <div>科目名称</div>
                            <div class="inputContainer"><input type="text" placeholder="科目名称" v-model="superSearchVal.keyword"></div>
                        </li>
                        <li>
                            <div>辅助核算</div>
                            <div class="flexPublic">
                                <div class="selectContainer">
                                    <select v-model="superSearchValPhId">
                                        <option value="0"></option>
                                        <option :value="item.PhId" v-for="(item,index) of superSearchVal.assistItemList.type" :key="index">{{item.BaseName}}</option>
                                    </select>
                                </div>
                                <div class="searchSelectCon">
                                    <span>{{superSearchVal.assistItem.BaseName}}</span>
                                    <searchSelect v-if="superSearchVal.show" :itemlists="assistItemList" :placeholder="superSearchVal.placeholder"
                                          :nodatatext="superSearchVal.nodatatext" @item-click="itemClick"></searchSelect>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>合计金额</div>
                            <div class="flexPublic">
                                <div class="inputContainer"><input type="text" v-model="superSearchVal.sum1"></div>
                                <span>至</span>
                                <div class="inputContainer"><input type="text" v-model="superSearchVal.sum2"></div>
                            </div>
                        </li>
                        <li>
                            <div>账期</div>
                            <div class="flexPublic">
                                <div class="block">
                                    <el-date-picker type="date" v-model="superSearchVal.date1" placeholder="请选择日期">
                                    </el-date-picker>
                                </div>
                                <span>至</span>
                                <div class="block">
                                    <el-date-picker type="date" v-model="superSearchVal.date2" placeholder="请选择日期">
                                    </el-date-picker>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div>
                        <div @click.stop="highGradeToggle('reset')">重置</div>
                        <div @click="getvoucherList">搜索</div>
                    </div>
                </div>
            </div>

        </div>
        <section ref="printList" class="listContainer">
            <ul class="listTitle">
                <li>序号</li>
                <li>摘要</li>
                <li>科目</li>
                <li>借方金额</li>
                <li>贷方金额</li>
            </ul>
            <ul  @click="choose(item)" :class="{choosed:item.PhId==chooseItem.PhId}" class="listContent" v-for="(item,index) of voucherList" :key="index">
                <li @dblclick="voucherDel(item)">
                    <ul @click="voucherDel(item)" class="listIndex"><li>{{index+1}}</li></ul>
                    <ul>
                        <li>
                            <span>凭证日期 : {{item.PDate?item.PDate.substring(0,10):''}}</span>
                            <span>凭证字号 : {{item.PNo}}</span>
                            <span>附件数 : {{item.PAttachment}}</span>
                            <span>制单人 : {{item.PMakePerson}}</span>
                            <span>审核 : {{item.Verify?'已审核':'未审核'}}</span>
                        </li>
                        <li v-for="(dtl,ind) of item.Dtls" :key="ind">
                            <div>{{dtl.Abstract}}</div>
                            <div>{{dtl.SubjectCode}}&nbsp;{{dtl.SubjectName}}</div>
                            <div>{{(dtl.JSum==0?'':dtl.JSum) | NumFormat}}</div>
                            <div>{{(dtl.DSum==0?'':dtl.DSum) | NumFormat}}</div>
                        </li>
                        <li>
                            <div>合计:{{'sum' | sum(item.Dtls)}}</div>
                            <div>{{'jie'|sum(item.Dtls)}}</div>
                            <div>{{'dai'|sum(item.Dtls)}}</div>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>
        <!--凭证重排****************************-->
        <div v-if="resetShow" class="codeResetContainer">
            <div>
                <p class="flexPublic">
                    <span>凭证重排</span>
                    <i @click="resetCode(false)"></i>
                </p>
                <div  class="yearsContent">
                    <p>请选择会计期</p>
                    <div class="flexPublic">
                        <div>{{year}}</div>
                        <div class="flexPublic">
                            <img @click="nextYear(false)" src="../../assets/icon/leftArr.svg" alt="">
                            <img @click="nextYear(true)" src="../../assets/icon/leftArr.svg" alt="">
                        </div>
                    </div>
                    <ul @click="resetCodeMonth" :class="{allActive:allReset}"  class="year-month">
                        <li :class="{active:month==index}" v-for="index of 12" :key="index">{{index}}月</li>
                    </ul>
                    <div>
                        <p>
                            <label ><input type="checkbox" v-model="allReset">对所有会计期进行凭证号重排</label>
                        </p>
                        <div>
                            <span @click="resetCode(false)" class="btn">取消</span>
                            <span @click="resetCode(true)" class="btn">确认</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <side-time @time-click="getSideDate" ref='sideDate'></side-time>
        <!-- 弹出凭证********************* -->
        <div :class="{voucherMask:voucherMask}">
            <div class="voucherContainer">
                <p v-if="voucherMask" class="title"><span v-if="voucherMask=='copy'">复制凭证</span><span v-if="voucherMask=='cut'">剪切凭证</span><span v-if="voucherMask=='chongh'">冲红</span><i @click="keepChoose(false)"></i></p>
                <div v-if="voucherMask">
                    <span class="btn" @click.stop="keepChoose(voucherMask)">保存</span>
                    <span class="btn" @click.stop="keepChoose(false)">取消</span>
                </div>
                <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
            </div>            
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import sideTime from './sideTime'
    import voucher from './voucher'
    import searchSelect from './searchList'
    export default {
        name: "voucher-list",
        mounted(){
            if(this.$route.query.voucherList){
                this.voucherList= this.$route.query.voucherList;
            }else{
                if(!this.sideDate){
                    this.getChecked();
                }
            }
            this.getAssist();
            this.$store.commit("tagNav/turnCachePage",true);
           
        },
        data(){
            return {                 
                sum1:'',
                sum2:'',
                chooseItem:'',
                nowTime:new Date,
                checkedTime:'',
                sideDate:'',
                month:'',
                year:'',
                searchVal:'',
                superSearchValPhId:'',
                assistItemList:{id:0,kemu:[]},
                superSearchVal:{
                    assistItemList:{type:'',list:''},
                    assistItem:'',
                    sum1:'',
                    sum2:'',
                    date1:'',
                    date2:'',
                    keyword:'',
                    placeholder:'选择辅助项',
                    nodatatext:'',
                    show:true
                },
                pickerOptions: {
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
                voucherDataList:{bool:false,data:{Mst:'',Attachements:[]}},
                voucherList:[],
                highGradeCss:false,
                pagesize:100,
                pageindex:0,
                allReset:'',
                resetShow:false,
                voucherMask:false
            }
        },
        methods:{
            //操作导航******************
            handle(str){
                switch(str){
                    case 'update'://修改**********
                        this.voucherDel(this.chooseItem);
                        break;
                    case 'audit'://审核**********  
                        if(!this.chooseItem.PhId){
                            this.$message("请先选择凭证!");
                            return;
                        }
                        this.audit(true,this.chooseItem.PhId);
                        break;
                    case 'unaudit'://反审核************
                        if(!this.chooseItem.PhId){
                            this.$message("请先选择凭证!");
                            return;
                        }
                        this.audit(false,this.chooseItem.PhId);
                        break;
                    case 'delete' :
                        if(!this.chooseItem.PhId){
                            this.$message("请先选择凭证!");
                            return;
                        }
                        var data1={
                            uid:this.uid,
                            orgid:this.orgid,
                            id:this.chooseItem.PhId
                        }
                        this.delete(data1);
                        break;
                    case 'reset':
                        if(confirm('凭证号重排过程中不允许取消、暂停操作。确定重排？')){
                            this.resetShow=true;
                        }
                        break;
                    case 'print':
                        this.printContent();
                        break;
                    case 'copy':
                        if(!this.chooseItem.PhId){
                            this.$message("请先选择凭证!");
                            return;
                        }
                        this.voucherDataList.data.Mst=this.chooseItem;
                        this.voucherMaskShow('copy');
                        this.voucherDataList.bool=true;
                   
                        break;
                    case 'cut':
                        if(!this.chooseItem.PhId){
                            this.$message("请先选择凭证!");
                            return;
                        }
                        this.voucherDataList.data.Mst=this.chooseItem;
                        this.voucherMaskShow('cut');
                        this.voucherDataList.bool=true;
                    
                        break;
                    case 'chongh':
                        if(!this.chooseItem.PhId){
                            this.$message("请先选择凭证!");
                            return;
                        }
                        this.voucherDataList.data.Mst=this.chooseItem;
                        this.chongh();
                        this.voucherMaskShow('chongh');
                        this.voucherDataList.bool=true;    
                        break;
                }
            },
            //高级搜索显示隐藏****************
            highGradeToggle(bool) {   
                if(bool=='reset'){
                    this.superSearchValPhId='',
                    this.assistItemList={id:0,kemu:[]},
                    this.superSearchVal={
                        assistItemList:{type:'',list:''},
                        assistItem:'',
                        sum1:'',
                        sum2:'',
                        date1:this.year+'-'+(this.month>9?this.month:('0'+this.month)),
                        date2:this.year+'-'+(this.month>9?this.month:('0'+this.month)),
                        keyword:'',
                        placeholder:'选择辅助项',
                        nodatatext:'',
                        show:true
                    }       
                }else{
                    this.highGradeCss = bool; 
                }   
                
            },
            //凭证详情***************************
            voucherDel(item){
                this.$router.push({path:'/finance/voucherAdd',query:{list:item}});
            },
            //凭证选择**********************
            choose(item){
                if(this.chooseItem.PhId==item.PhId){
                   this.chooseItem=''; 
                }else{
                    this.chooseItem=item;
                }
            },
             //审核*****************
            audit(bool,PhId){
                if(!this.chooseItem.PhId){
                    this.$message("请先选择凭证!");
                    return;
                }
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    realname:this.uname,
                    infoData:[PhId]
                }
                var url='PVoucherMst/PostAudit';
                if(!bool){
                    url='PVoucherMst/PostUnAudit'
                }
                const loading=this.$loading();
                this.$axios.post(url,data)
                    .then(res=>{  
                        loading.close();      
                        if(res.Status=='success'){
                            if(bool){ 
                                this.$message('审核成功!')
                            }else{
                                this.$message('反审核成功!')
                            }
                             this.getvoucherList();
                        }else{
                            if(bool){
                                this.$message('审核失败!')
                            }else{
                                this.$message('反审核失败!')
                            }
                        }
                       this.getvoucherList(); 
                    })
                    .catch(err=>{console.log(err),loading.close();})
            },
            //删除***********************
            delete(data){ 
                 const loading=this.$loading();
                this.$axios.post('PVoucherMst/PostDelete',data)
                    .then(res=>{
                        loading.close();      
                        if(res.Status=='success'){
                            this.$message('删除成功!');
                        }else{
                            this.$message('删除失败,请重试!')
                        }
                        this.getvoucherList(); 
                    })
                    .catch(err=>{console.log(err),loading.close();})
            },
             //冲红***********************
            chongh(){
                var vm=this;
               //this.voucherData();  
                var Mst=this.voucherDataList.data.Mst;
                for(var dtl of Mst.Dtls){                    
                    dtl.JSum=dtl.JSum?dtl.JSum*-1:'';
                   dtl.DSum=dtl.DSum?dtl.DSum*-1:'';
                    if(dtl.DtlAccounts){
                        dtl.DtlAccounts[0].JSum=dtl.DtlAccounts[0].JSum?dtl.DtlAccounts[0].JSum*-1:'';
                        dtl.DtlAccounts[0].DSum=dtl.DtlAccounts[0].DSum?dtl.DtlAccounts[0].DSum*-1:'';
                    }
                }
                this.clearPhId(this.voucherDataList.data.Mst); 
                //this.resetVoucher();        
                this.$message("请查看凭证信息,确认无误点击保存!")                      
            },
            //清空凭证phid*****************
            clearPhId(item){
                item.PhId='';
                if(item.PNo){
                    item.PNo='';
                }
                item.PersistentState=1;
                for(var dtl of item.Dtls){
                    dtl.PhId='';
                    dtl.PhidTransaction='';
                    dtl.PhidVouchermst='';
                    dtl.PersistentState=1;
                    if(dtl.DtlAccounts){
                        dtl.DtlAccounts[0].PhId='';
                        dtl.DtlAccounts[0].PhidTransaction='';
                        dtl.DtlAccounts[0].PhidVouchermst='';
                        dtl.DtlAccounts[0].PhidVoucherDel='';
                        dtl.DtlAccounts[0].PersistentState=1;
                    }
                }    
            },
             //手动刷新voucher组件**************************
            resetVoucher(){
                var vm=this;    
                this.voucherDataList.bool=false;
               
                function delay(){
                    vm.voucherDataList.bool=true
                }
                setTimeout(delay,5);
            },
            //打印******************
            // printLodop() {
            //     const me = this
            //     var html=this.$refs.print.innerHTML; 
            //     console.log(html) 
            //     let  LODOP = getLodop();
            //     LODOP.PRINT_INIT("凭证信息");      //首先一个初始化语句
            //     LODOP.SET_PRINT_STYLE("FontSize", 18);  //字体
            //     LODOP.SET_PRINT_STYLE("Bold", 1);
            //     //LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
            //     LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "凭证信息");
            //     LODOP.ADD_PRINT_HTM(88, 200, 350, 600,html);
            //     //LODOP.PRINT();
            //     LODOP.PREVIEW();
            // },
            
             // 打印
            printContent(e){
                this.$print(this.$refs.printList) // 使用
            },
            //保存凭证***********************
             keepVoucher(str){
                var url='Add';
                var Vdata=this.voucherDataList.data; 
               if(Vdata.Mst.Dtls.length<=0){
                   this.$message('请输入内容!')
                   return;
               }
               if(Vdata.Mst.PDate){
                   if(typeof(Vdata.Mst.PDate)=='object'){
                       Vdata.Mst.Uyear=Vdata.Mst.PDate.getFullYear();
                       Vdata.Mst.PMonth=Vdata.Mst.PDate.getMonth()+1;
                       var date=Vdata.Mst.PDate.getDate();
                       Vdata.Mst.PDate=(Vdata.Mst.Uyear+'-')+(Vdata.Mst.PMonth<10?('0'+Vdata.Mst.PMonth):Vdata.Mst.PMonth)+'-'+((date)<10?('0'+date):date);
                   }else {
                       Vdata.Mst.PDate=Vdata.Mst.PDate.substring(0,10)
                   }
               }else{
                   this.$message('请输入凭证会计期!')
                   return;
               }
               if(Vdata.Mst.Uyear==this.nowTime.getFullYear()&& Vdata.Mst.PMonth>=this.checkedTime) {
                   var data = {
                       uid: this.uid,
                       orgid: this.orgid,
                       orgcode: this.orgcode,
                       infoData: this.voucherDataList.data
                   }
                   if (this.voucherDataList.data.Mst.PhId) {
                       url = 'Update';
                   }
                   const loading=this.$loading();
                   this.$axios.post('/PVoucherMst/Post' + url, data)
                       .then(res => {
                           loading.close();      
                           if (res.Status == 'success') {
                               this.$message('保存成功!')
                               if(str=='print'){
                                   this.printContent();
                               }
                           } else {
                               this.$message('保存失败,请重试!')
                           }
                           this.getvoucherList(); 
                       })
                       .catch(err =>{console.log(err);loading.close()} )
               }else{
                   this.$message('当前月份已结账,无法修改凭证!')
               }
            },
            //复制剪切******************************
            voucherMaskShow(val){
                this.voucherMask=val;
            },
            keepChoose(val){
                if(val){
                    this.voucherData();
                    console.log(this.voucherDataList);
                    var id = this.voucherDataList.data.Mst.PhId;
                    if(val=='cut'){
                        var data1={
                            uid:this.uid,
                            orgid:this.orgid,
                            id:id
                        }
                        this.cut(data1);
                    }else{
                        this.clearPhId(this.voucherDataList.data.Mst); 
                        this.keepVoucher();
                    }    
                }
                this.voucherMask=false; 
                this.voucherDataList.bool=false; 
                this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}};
            },
            //剪切*****************
            cut(data1){
                 var url='Add';
                var Vdata=this.voucherDataList.data; 
               if(Vdata.Mst.Dtls.length<=0){
                   this.$message('请输入内容!')
                   return;
               }
               if(Vdata.Mst.PDate){
                   if(typeof(Vdata.Mst.PDate)=='object'){
                       Vdata.Mst.Uyear=Vdata.Mst.PDate.getFullYear();
                       Vdata.Mst.PMonth=Vdata.Mst.PDate.getMonth()+1;
                       var date=Vdata.Mst.PDate.getDate();
                       Vdata.Mst.PDate=(Vdata.Mst.Uyear+'-')+(Vdata.Mst.PMonth<10?('0'+Vdata.Mst.PMonth):Vdata.Mst.PMonth)+'-'+((date)<10?('0'+date):date);
                   }else {
                       Vdata.Mst.PDate=Vdata.Mst.PDate.substring(0,10)
                   }
               }else{
                   this.$message('请输入凭证会计期!')
                   return;
               }
               if(Vdata.Mst.Uyear==this.nowTime.getFullYear()&& Vdata.Mst.PMonth>=this.checkedTime) {
                   var data = {
                       uid: this.uid,
                       orgid: this.orgid,
                       orgcode: this.orgcode,
                       infoData: this.voucherDataList.data
                   }
                   if (this.voucherDataList.data.Mst.PhId) {
                       url = 'Update';
                   }
                   const loading=this.$loading();
                   this.$axios.post('/PVoucherMst/Post' + url, data)
                       .then(res => {
                           loading.close();      
                           if (res.Status == 'success') {
                               this.$message('保存成功!')
                               this.delete(data1);
                               if(str=='print'){
                                   this.printContent();
                               }
                           } else {
                               this.$message('保存失败,请重试!')
                           }
                       })
                       
                       .catch(err =>{console.log(err);loading.close()} )
               }else{
                   this.$message('当前月份已结账,无法修改凭证!')
               }
                
            },
            //接收voucher组件传值************
            voucherData(){
                this.voucherDataList.data=this.$refs.voucher.voucherData();
                console.log(this.voucherDataList);
            },
            //凭证搜索**************************
            searchVoucher(){
                const loading1=this.$loading();
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    sum1:this.sum1,
                    sum2:this.sum2,
                    keyword:this.searchValue,
                    queryfilter:{"OrgId*num*eq*1":this.orgid,"Uyear*str*eq*1":this.sideDate.split('-')[0],"PMonth*byte*eq*1":parseInt(this.sideDate.split('-')[1])}
                }
                console.log(data);
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        loading1.close();
                        if(res.Record.length<=0){
                            this.$message('无法找到该凭证!')
                        } else{
                            this.voucherList= res.Record;
                        }
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //搜索日期转换*************
            dateTurn(val){
                var str;
                if(typeof(val)=='object'){
                    str=val.getMonth()+1;
                    val=val.getFullYear();         
                    val=val.toString()+'-'+(str>9?str:('0'+str))
                }
                return val;
            },
            //凭证列表***************高级搜索***********************
            getvoucherList(){
                this.superSearchVal.date1=this.dateTurn(this.superSearchVal.date1)
                 this.superSearchVal.date2=this.dateTurn(this.superSearchVal.date2)
                const loading1=this.$loading();
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    sum1:this.superSearchVal.sum1,
                    sum2:this.superSearchVal.sum2,
                    keyword:this.superSearchVal.keyword,
                   // itemValuePhid:649181122000008,
                    itemValuePhid:this.superSearchVal.assistItem.PhId,
                    queryfilter:{"PAccper*str*ge*1":this.superSearchVal.date1.replace('-',''),"PAccper*str*le*1":this.superSearchVal.date2.replace('-','')}
                }
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        if(res.Status=='success'){
                            this.$message(res.Msg);
                        }
                        if(res.Record.length<=0){
                            this.$message('无法找到该凭证!')
                        } else{
                            this.voucherList= res.Record;
                        }
                         loading1.close();
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //凭证列表***************
            // getvoucherList(){
            //     var data={
            //         uid:this.uid,
            //         orgid:this.orgid,
            //         pagesize:this.pagesize,
            //         pageindex:this.pageindex,
            //         keyword:this.searchValue,
            //         queryfilter:{"OrgId*num*eq*1":this.orgid,"Uyear*str*eq*1":this.sideDate.split('-')[0],"PMonth*byte*eq*1":parseInt(this.sideDate.split('-')[1])}
            //     }
               
                // this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                //     .then(res=>{
                //         this.voucherList= res.Record;
                //         if(this.voucherList.length<=0){
                //             this.$message('暂无新凭证');
                //         }
                //     })
            //     //     .catch(err=>console.log(err))
            // },
             //获取当前结账的最新月份************
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"JYear*str*eq*1":this.nowTime.getFullYear().toString(),"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{                     
                        this.checkedTime=res.Record[0].JAccountPeriod+1;
                        this.sideDate=this.nowTime.getFullYear()+'-'+this.checkedTime;
                        this.year=this.sideDate.split('-')[0];
                        this.month=this.sideDate.split('-')[1];
                        this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                        this.getvoucherList();
                        this.$forceUpdate();
                    })
                    .catch(err=>console.log(err))
            },
            //获取time组件传参********************
            getSideDate(data){
                this.sideDate=data.sideDate;
                this.year=this.sideDate.split('-')[0];
                this.month=this.sideDate.split('-')[1];
                this.superSearchVal.date2=this.superSearchVal.date1=this.year+(this.month>9?this.month:('0'+this.month));
                this.getvoucherList();
            },
             //凭证重排月份选择******************
            resetCodeMonth($event){
              this.month= this.month=parseInt($event.target.innerHTML);
            },
            //数字转换******************
            NUmTurn(){
                if(!value) return '0.00';
                /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
                var intPart =  Number(value)|0; //获取整数部分
                var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断


                var floatPart = ".00"; //预定义小数部分
                var value2Array = value.toString().split(".");

                //=2表示数据有小数位
                if(value2Array.length == 2) {
                    floatPart = value2Array[1].toString(); //拿到小数部分

                    if(floatPart.length == 1) { //补0,实际上用不着
                        return intPartFormat + "." + floatPart + '0';
                    } else {
                        return intPartFormat + "." + floatPart;
                    }

                } else {
                    return intPartFormat + floatPart;
                }
            },
            //凭证号重排确认***************
            resetCode(val){
                if(val){
                    const loading5=this.$loading();
                    var data={
                        orgid:this.orgid,
                        Year:this.sideDate.split('-')[0],
                        Pmonth:this.sideDate.split('-')[1]
                    }
                    var url='/PVoucherMst/GetRebuilder';
                    if(this.allReset){
                        url='PVoucherMst/GetRebuilderForAllYear';
                        data={
                            orgid:this.orgid,
                            Year:this.sideDate.split('-')[0],
                        }
                    }
                    this.$axios.get(url,{params:data})
                        .then(res=>{
                            console.log(res)
                            if(res.Status=='error'){
                                this.$message(res.Msg);
                            }else if(res.Status=='success'){
                                this.$message('重排成功!');
                                this.resetShow=false;
                            }
                            loading5.close();
                        })
                        .catch(err=>{console.log(err);loading5.close();})
                }else{
                    this.resetShow=false;
                }
            },
            //  * 获取辅助项信息
            //  * query:查询参数
            //  *  */
            getData(query){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    typeId:query,
                    CodeOrName:''
                };
                const loading=this.$loading();
                this.$axios.get('/PVoucherAuxiliaryType/GetAuxiliaryQueryList',{params:data})
                    .then(res=>{
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.assistItemList.kemu=res.list;
                        this.superSearchVal.show=true;
                        console.log(this.assistItemList,res)
                        //this.$forceUpdate();
                        loading.close();
                    })
                    .catch(err=>{
                        console.log(err)
                        loading.close();
                        this.$message({ showClose: true,message: "辅助项获取错误", type: "error"});
                    })
            },
            //获取辅助项***************
            getAssist(){
                let data = {
                    uid: this.uid,//this.uid获取到store中的uid************
                    orgid: this.orgid,//this.orgid获取到store中的orgid************
                    infoData:null
                };
                const loading=this.$loading();
                var vm=this;
                this.$axios.get('/PVoucherAuxiliaryType/GetVoucherAuxiliaryTypeList',{params:data})
                    .then(res=>{
                         if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.superSearchVal.assistItemList.type=res.type;
                        this.superSearchValPhId=res.type[0].PhId;
                        this.assistItemList.kemu=res.list;
                        loading.close();
                        //this.userInfo=res.list;
                        //this.navTab=res.type;
                    })
                    .catch(err=>{
                        console.log(err);loading.close();
                    })
            },
            //获取searchSelect辅助项搜索值******************
            itemClick(childData){
                this.superSearchVal.assistItem=childData.data;
                this.superSearchVal.show=false;
            }
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
                uname: state => state.user.username,
                orgcode:state => state.user.orgcode,
                cachePage:state=>state.tagNav.cachePage  //是否利用路由缓存
            })
        },
        watch:{
            superSearchValPhId(val){
                console.log(val);
                if(val==0){
                    this.superSearchVal.show=false;
                    this.assistItemList.kemu=[];
                    this.superSearchVal.assistItem='';
                }else{
                    this.superSearchVal.show=false;
                this.getData(val);
                }
                
            }
        },
        filters:{
            sum(val,dtl){
                var sum=0;
                var fu='';
                if(!dtl){
                    dtl=[]
                }
                function Num(value) {
                    if(!value) return '0.00';                    
                    /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
                    var intPart =  Number(value)|0; //获取整数部分
                    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
                    var floatPart = ".00"; //预定义小数部分
                    var value2Array = value.toString().split(".");
                    //=2表示数据有小数位
                    if(value2Array.length == 2) {
                        floatPart = value2Array[1].toString(); //拿到小数部分

                        if(floatPart.length == 1) { //补0,实际上用不着
                            return intPartFormat + "." + floatPart + '0';
                        } else {
                            return intPartFormat + "." + floatPart;
                        }

                    } else {
                        return intPartFormat + floatPart;
                    }

                }
                switch(val){
                    case 'jie':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
                        }
                        sum=Num(sum);
                        break;
                    case 'dai':
                        for(var d of dtl){
                            if(d.DSum){
                                sum+=parseFloat(d.DSum);
                            }
                        }
                        sum=Num(sum);
                        break;
                    case 'sum':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
                        }
                        if(sum<0){
                            sum=-1*sum;
                            fu='负'
                        }
                        sum=sum.toFixed(2);
                        var arr1=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'];
                        var arr2=['','拾','百','千','万','亿'];
                        var str=sum.toString().split('.');
                        var dot='元';
                        var INTstr=str[0];
                        var INT='';
                        var bool=false;
                        var zero='';
                        if(parseInt(str[1])!=0){
                            dot+=arr1[str[1][0]]+'角';
                            if(str[1][1]!=0){
                                dot+=arr1[str[1][1]]+'分'
                            }
                        }else{
                            dot+='整'
                        }
                        for(var i=INTstr.length-1,j=0;i>=0; i--,j++){
                            if(INTstr[i]!=0){
                                bool=true;
                            }
                            if(j==4){
                                INT=arr2[j]+INT;
                            }else if(j==8){
                                INT=arr2[5]+INT;
                            }
                            if(bool){
                                if(INTstr[i]!=0){
                                    if(zero=='零'){
                                        zero='';
                                    }
                                    if(j==4){
                                        INT=arr1[INTstr[i]]+INT;
                                        bool=false;
                                    }else if(j==8){
                                        INT=arr1[INTstr[i]]+INT;
                                    }else{
                                        INT=arr1[INTstr[i]]+arr2[j%4]+INT;
                                        bool=false;
                                    }
                                }else{
                                    if(zero==''){
                                        INT='零'+INT;
                                        zero='零';
                                    }
                                    if(j==4){
                                        INT=arr2[j]+INT;
                                        bool=false;
                                    }else if(j==8){
                                        INT=arr2[5]+INT;
                                        bool=false;
                                    }
                                }
                            }
                        }
                        sum=fu+INT+dot;
                        break;
                }
                
                return sum;

            }
        },
        components:{
            searchSelect,
            sideTime,
            voucher
        }
    }
    
</script>

<style lang="scss" scoped>
    .searcherCon{
        width:40%;
        min-width: 170px;
        position:relative;
        .highGradeCss{
            position:absolute;
            width:300px !important;
            background: #fff;
            z-index: 9;
            top:40px;
            border:1px solid #ccc;
            >div{
                width:100%;
                &:first-of-type{
                    height:33px;
                    background:#3e8ebc;
                    border-radius: 7px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color:#fff;
                    padding:0 10px;
                }
                &:last-of-type{
                    border-top:1px solid #ccc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height:40px;
                    width:100%;
                    padding:0 10px;
                    >div{
                        cursor:pointer;
                        width:40%;
                        height:30px;
                        line-height: 30px;
                        background: #509edc;
                        text-align: center;
                        margin-left: 10px;
                        color:#fff;
                        font-size: 15px;
                        &:first-of-type{
                            background: #667a80;
                        }
                    }
                }
                i.cancle{
                    width:25px;
                    height:25px;
                    border-radius: 50%;
                    background: #fff;
                    position: relative;
                    cursor:pointer;
                    &::after,&::before{
                        content:"";
                        position: absolute;
                        width:15px;
                        height:1px;
                        background: #3e8cbc;
                        top:12px;
                        left:5px;
                    }
                    &::after{
                        transform: rotate(45deg);
                    }
                    &::before{
                        transform: rotate(-45deg);
                    }
                }
            }
            >ul{
                input,select{
                    background: #fff;
                }
                background: #eee;
                padding: 5px 10px ;
                li{
                    height:30px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                    >div:first-of-type{
                        width:25%;
                    }
                    >div:last-of-type{
                        width:80%;
                        .el-date-editor.el-input{
                            width:90px;
                        }
                    }
                }
            }
        }
    }
    .searcherValue{
        border:1px solid #ddd;
        border-radius: 10px 0 0 10px ;
        overflow: hidden;
        padding-left:10px;
    }
    .searcherValue{
        width:80%;
    }
    .searcherValue>input{
        width:100%;
        height:30px;
        outline: none;
        margin:0;
        font-size: 14px;
        border:0;
    }
    .searcherBtn{
        height:30px;
        width:20%;
        text-align: center;
        line-height: 30px;
        background:#00B8EE;
        color:#fff;
        cursor:pointer;
    }
    .voucherList{
        padding:8px 70px 50px 18px;
        margin-right:10px;
        margin-bottom: 50px;
        font-size:14px;
        position:relative;
        min-width: 1024px;
        height:100%;
        .voucherNav>ul{
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 10px;
            li{
                border:1px solid #ff9900;
                border-radius: 3px;
                padding:2px 8px;
                height:25px;
                margin-left:10px;
                cursor:pointer;
                &:hover{
                    background: #ff9900;
                    color:#fff;
                }
            }
        }
        .voucherSelect{
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            >div{
                display: flex;
                justify-content: flex-start;
                width:25%;
                min-width: 280px;
                >label{
                    display: flex;
                    align-items: center;
                    &:nth-of-type(2){
                        margin-left:5px ;
                        >div:first-of-type{
                            width:60px;
                        }
                        >div.inputContainer{
                            width:70px;
                        }
                    }
                    div{
                        text-align: center;
                    }
                }
                >label>div:first-of-type{
                    width:70px;
                }
                >label>div:nth-of-type(2)>div{
                    width:100px;
                }
            }
            >div:nth-of-type(2){
                margin-left:100px;
                width:25%;
            }
            >div.searcherCon{
                width:50%;
                display: flex;
                justify-content: flex-end;
                >div{
                    width:auto;
                    margin:0;
                    &:first-of-type{
                        min-width: 300px;
                    }
                    &:nth-of-type(2){
                        width:40px;
                    }
                    &:nth-of-type(3){
                        margin-left: 10px;
                        cursor:pointer;
                        background: #6aca25;
                        height:30px;
                        line-height: 30px;
                        width:60px;
                        color:#fff;
                        text-align: center;
                    }
                }
            }
        }
        
    }
    .codeResetContainer{
        background: rgba(0,0,0,0.5);
        position: absolute;
        z-index: 99;
        left:0;
        top:0;
        width:100%;
        height:100%;
        >div{
            width:300px;
            height:410px;
            margin: 150px auto 0;
            border-radius: 10px;
            background: #fff;
            padding:10px;
            >p:first-of-type{
                height:35px;
                font-size: 18px;
                font-weight: bold;
                border-bottom: 1px solid #ccc;
                padding:5px;
                >i{
                    width:25px;
                    height:25px;
                    background: url("../../assets/icon/close.svg");
                    background-size: cover;
                    cursor:pointer;
                }
            }
            .yearsContent{
                font-size: 15px;
                >p:first-of-type{
                    margin:10px 15px 5px;
                    padding: 5px 0;
                    font-size: 18px;
                    font-weight: bold;
                    border-bottom: 1px solid #ccc;
                }
                >div:first-of-type{
                    font-size: 18px;
                    font-weight: bold;
                    padding:5px 0 0 15px;
                    >div:nth-of-type(2){
                        width:70px;
                        margin-right: 20px;
                        >img{
                            width:20px;
                            height:20px;
                            transform: rotate(-90deg);
                            position:relative;
                            top:-8px;
                            cursor:pointer;
                            &:first-of-type{
                                transform: rotate(90deg);
                                top:0px;
                            }
                        }
                    }
                }
                >div:nth-of-type(2){
                    margin:0 15px;
                    >p{
                        >label{
                            display: flex;
                            align-items: center;
                            color:#000;
                            font-weight: 400;
                            font-size: 16px;
                            input{
                                margin-right: 10px;
                            }
                        }
                        margin-bottom: 20px;
                    }
                    >div{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding:0 15px;
                        >span{
                            height:40px;
                            line-height: 40px;
                        }
                    }
                }
                >ul{
                    display: flex;
                    align-items: center;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    padding:5px 20px;
                    width:100%;
                    >li{
                        width:60px;
                        height:60px;
                        line-height: 60px;
                        text-align: center;
                        cursor:pointer;
                        font-size: 16px;
                        &:hover{
                            background:#2780d1 ;
                            color:#fff;
                        }
                        &.active{
                            background:#2780d1 ;
                            color:#fff;
                        }
                    }
                }
                >p{
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    >span{
                        width:80px;
                        height:30px;
                        line-height: 30px;
                        text-align: center;
                        margin-left: 40px;
                        color:#3e8cbc;
                        border:1px solid #3e8cbc;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #3e8cbc;
                        }
                    }
                }
                .allActive>li{
                    background:#2780d1 ;
                    color:#fff;
                }
            }
        }

    }
    .voucherMask{
        position: absolute;
        width:100%;
        height:100%;
        top:0;
        left:0;
        background: rgba(0,0,0,0.3);
        .voucherContainer{
          background: #fff;
          width:80%;
          position:absolute;
          top:30px;
          left:100px;
          padding:10px;
          >div:first-of-type{
              display: flex;
              justify-content: flex-end;
              padding:5px 10px;
              >span{
                  margin-left: 20px;
              }
          }  
        }
    }
    .title{
        border-bottom: 1px solid #ccc;
        padding:8px 3px;
        display: flex;
        justify-content: space-between;
        width:100%;
        font-family: Arial;
        font-size: 14.0pt;
        font-style: normal;
        font-weight: 700;
        i{
            background: url("../../assets/icon/close.svg");
            background-size:cover ;
            width:20px;
            height:20px;
            cursor:pointer;
        }
    }
    .voucherMaskActive{
        position:absolute;
        bottom: 0;
        z-index: -1;
    }
    .listContainer{
        overflow-y: auto;
        padding:5px;
        margin-top:10px;
        padding-bottom: 20px;
    }
    .listContainer ul.listTitle{
        display: flex;
        background: #00B8EE;
        color:#fff;
        
    }
    .listContainer ul.listTitle li{
        text-align: center;
        height:40px;
        line-height: 40px;
    }
    .listContainer ul.listTitle li:first-of-type{
        width:5%;
    }
    .listContainer ul.listTitle li:nth-of-type(2){
        width:31%;
    }
    .listContainer ul.listTitle li:nth-of-type(3){
        width:26%;
    }
    .listContainer ul.listTitle li:nth-of-type(4){
        width:19%;
    }
    .listContainer ul.listTitle li:nth-of-type(5){
        width:19%;
    }
    ul.listContent{
        border-top:1px solid #ccc;
        margin-bottom: 20px;
        background: #fff;
    }    
    ul.listContent.choosed>li>ul.listIndex{
        background: #2780d1;
        color:#fff;
    
    }
    
    ul.listContent>li {
        width:100%;
        height:100%;
        display: flex;
        overflow: hidden;
        align-items: center;
        position: relative;
    }
        ul.listContent>li> ul.listIndex{
        margin:0;
        border:1px solid #ccc;
        border-top:0;
        height:100%;
        width:5%;
        font-size: 18px;
        cursor:pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position:absolute;
            
    }
    ul.listContent>li> ul.listIndex>li:first-of-type{
            border:0;
            width:100%;
            height:100%;
            display: flex;
            align-items: center;
            justify-content:center;
        }
    ul.listContent>li> ul {
        height:100%;
        width: 95%;
        margin-left:5%;
        
    }
    ul.listContent>li> ul>li{
        display: flex;
        justify-content: flex-start;
        height:30px;
        line-height: 30px;
    }
    ul.listContent>li> ul>li:first-of-type{
        padding:0 10px;
        border:1px solid #ccc;
        border-top:0;
        border-left: 0;
    }
    ul.listContent>li> ul>li:first-of-type>span{
            margin-right: 50px;
        }
    ul.listContent>li> ul>li>div{
        text-align: center;
        border:1px solid #ccc;
        border-top:0;
        border-left:0;
    }
    ul.listContent>li> ul>li div:first-of-type{
        width:32%;
    }
    ul.listContent>li> ul>li div:nth-of-type(2){
        width:28%;
    }
    ul.listContent>li> ul>li div:nth-of-type(3){
        width:20%;
    }
    ul.listContent>li> ul>li div:nth-of-type(4){
        width:20%;
    }
    
    ul.listContent>li> ul>li:last-of-type>div{
        text-align: center;
        border:1px solid #ccc;
        border-top:0;
        border-left:0;
        width:20%;
        
    }
    ul.listContent>li> ul>li:last-of-type>div:first-of-type{
            width:60%;
        }
    .searchSelectCon{
        position: relative;
        width:100%;
        height:30px;
        background: #fff;
        border:1px solid #ddd;
        padding:3px;
    }
            

        
    
</style>
