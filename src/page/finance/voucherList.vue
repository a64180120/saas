<template>
    <div class="voucherList">               
        <div class="voucherNav">
            <ul>
                <a @click.prevent="handle('fresh')" style="background:#fff;width:30px;min-width:30px;border-radius:50%;"><li ><img src="@/assets/icon/fresh2.svg" alt=""> </li></a>
                <a style="position:relative;display:block;width:80px;height:30px;margin-left:10px">
                    <li class="more" style="width:80px">
                        <ul >
                            <li>更多</li>
                            <li  @click.prevent="handle('copy')">复制</li>
                            <li  @click.prevent="handle('cut')">剪切</li>
                            <li  @click.prevent="handle('chongh')">冲红</li>
                            <li @click.prevent="handle('reset')">凭证号重排</li>
                        </ul>
                    </li>
                </a>
                <a @click.prevent="handle('print')"><li >打印</li></a>
                <a @click.prevent="handle('download')">
                    <li  >
                        <span>导出</span>
                    </li>
                </a>
                 <a @click.prevent="handle('upload')">
                    <li >
                        <div @click.stop="1">导入</div>                       
                    </li>
                </a>
                 <a @click.prevent="handle('unaudit')"><li >反审核</li></a>    
                <a @click.prevent="handle('audit')"><li >审核</li></a>    
                <a @click.prevent="handle('delete')"><li >删除</li></a>
                <a @click.prevent="handle('update')"><li >修改</li></a>
                <router-link to="/home"><li >新增</li></router-link>          
            </ul>
        </div>
        <div class="voucherSelect">
            <div>
                <label >合计金额(元):&nbsp; <div class="inputContainer"><input v-model="sum1" type="text"></div> </label>
                <label >至:&nbsp;<div class="inputContainer"><input v-model="sum2" type="text"></div></label>
            </div>
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input @keyup.13="getvoucherList('search')" v-model="searchVal" type="text" placeholder="科目/摘要/凭证号"></div>
                <div  @click="getvoucherList('search')" class="searcherBtn">搜索</div>
                <div @click.stop="highGradeToggle(true)">高级</div>
                <div v-if="highGradeCss" class="highGradeCss">
                    <div><span>高级查询</span><i @click.stop="highGradeToggle(false)" class="cancle"></i></div>
                    <ul>
                        <li>
                            <div>科目名称</div>
                            <div class="inputContainer"><input type="text" placeholder="科目/凭证号/摘要" v-model="superSearchVal.keyword"></div>
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
                                    <el-date-picker type="date" v-model="superSearchVal.date1" placeholder="日期">
                                    </el-date-picker>
                                </div>
                                <span>至</span>
                                <div class="block">
                                    <el-date-picker type="date" v-model="superSearchVal.date2" placeholder="日期">
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
        <section  class="listContainer">
            <ul class="listTitle">
                <li>序号</li>
                <li>摘要</li>
                <li>科目</li>
                <li>借方金额(元)</li>
                <li>贷方金额(元)</li>
            </ul>
            <ul  @click="choose(item)" :class="{choosed:item.PhId==chooseItem.PhId}" class="listContent" v-for="(item,index) of voucherList" :key="index">
                <li @dblclick="voucherDel(item)">
                    <ul class="listIndex"><li>{{index+1}}</li></ul>
                    <ul>
                        <li>
                            <span>凭证日期 : {{item.PDate?item.PDate.substring(0,10):''}}</span>
                            <span>凭证字号 : 记-{{item.PNo}}</span>
                            <span>附件数 : {{item.PAttachment}}</span>
                            <span>制单人 : {{item.PMakePerson}}</span>
                            <span>审核人 : {{item.PAuditorName}}</span>
                        </li>
                        <li v-for="(dtl,ind) of item.Dtls" :key="ind">
                            <div class="wrapKemu">
                                <div>{{dtl.Abstract}}</div>
                            </div>
                            <div class="wrapKemu"> 
                                <div> 
                                    {{dtl.SubjectCode}}&nbsp;{{dtl.SubjectName}}
                                    <span 
                                        v-for="(item,index) of dtl.DtlAccounts?dtl.DtlAccounts[0].NameValueDtls:0" :key="index">
                                        .{{item.AuxiliaryName}}
                                    </span> 
                                </div>
                            </div>
                            <div>{{(dtl.JSum==0?'':dtl.JSum) | NUmTurn}}</div>
                            <div>{{(dtl.DSum==0?'':dtl.DSum) | NUmTurn}}</div>
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
        <!-- <div class="footInfo">
            <router-link to="">服务协议</router-link>
            <router-link to="">运营规范</router-link>
            <router-link to="">关于政云</router-link>
        </div> -->
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
        <!-- 年度选择 -->
        <side-time v-if="fresh" @time-click="getSideDate" ref='sideDate'></side-time>
        <!-- 弹出凭证********************* -->
        <div v-if="voucherMask" :class="{voucherMask:voucherMask}">
            <div class="voucherContainer">
                <p v-if="voucherMask" class="title"><span v-if="voucherMask=='copy'">复制凭证</span>
                        <span v-if="voucherMask=='cut'">剪切凭证</span><span v-if="voucherMask=='chongh'">冲红凭证</span>
                        <span v-if="voucherMask=='gengz'">更正凭证</span><span v-if="voucherMask=='update'">修改凭证</span>
                        <i @click="keepChoose(false)"></i>
                </p>
                <div v-if="voucherMask">
                    <span class="btn" @click.stop="keepChoose(voucherMask)">保存</span>
                    <span class="btn" @click.stop="keepChoose(false)">取消</span>
                </div>
                <div class="voucherDisabledCon">
                    <div :class="{voucherDisabled:voucherMask=='chongh'}"></div>
                    <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
                </div>
            </div>            
        </div>
        <!-- <print-tem  ref="print" :printData="printdata"></print-tem> -->
        <!-- 附件弹出框 -->
        <el-dialog title="选择附件" :visible.sync="fileVisible" width="40%">
            <file-upload  @uploadimg="uploadimg" :imgList="imglist" :limit="3" @removeimg="removeimg"></file-upload>
        </el-dialog>
         <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    import saasMsg from './message'
    import printTem from "@/page/finance/vprint/printTemPdf"
    import httpConfig from '@/util/ajaxConfig'
    import {mapState, mapActions} from 'vuex'
    import sideTime from './sideTime'
    import voucher from './voucher'
    import searchSelect from './searchList'
    import { SysOrgModel,SysOrgUpdate,SysOrgUploadFile,SysOrgDelete } from '@/api/organize/orgInfo'
    import fileUpload from "@/components/upload/fileUpload";
    export default {
        name: "voucherList",
        created(){     
            if(this.$route.query.voucherList){
                this.routerQuery=true;
                this.$store.commit("tagNav/upexcludeArr", []);
                this.voucherList= this.$route.query.voucherList;
            }else{
                // if(!this.sideDate){
                //     this.getChecked();
                // }
            }

            this.getAssist();        
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
                superSearchValPhId:"0",
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
                voucherMask:false,
                voucherDisabled:true,
                printdata:{},
                routerQuery:false,//路由是否传值************
                fileVisible:false,
                imglist:[], //文件上传的内容************
                fresh:true,
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                }
            }
        },
        methods:{
            //操作导航******************
            handle(str){
                var chooseItem=JSON.stringify(this.chooseItem);
                var item=JSON.parse(chooseItem);    
                switch(str){
                    case 'update'://修改**********
                        if(item.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该凭证已审核,无法修改!'
                            }
                            return;
                        }
                        this.voucherDataList.data.Mst=item;
                        this.voucherMaskShow('update');
                        this.voucherDataList.bool=true;
                        break;
                    case 'audit'://审核**********  
                    console.log(item,item.Verify)
                        if(!item.PhId){
                            this.saasMessage={
                                message:"请先选择凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        if(item.Verify){
                             this.saasMessage={
                                message:"该凭证已审核!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        this.audit(true,item.PhId);
                        break;
                    case 'unaudit'://反审核************
                        if(!item.PhId){
                            this.saasMessage={
                                message:"请先选择凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        if(!item.Verify){
                            this.saasMessage={
                                message:"该凭证还未审核,请先审核!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        this.audit(false,item.PhId);
                        break;
                    case 'delete' :
                        if(!item.PhId){
                           this.saasMessage={
                                message:"请先选择凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        if(item.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该凭证已审核,无法修改!'
                            }
                            return;
                        }
                        if(confirm('确定删除记录!')){
                            var data1={
                                uid:this.uid,
                                orgid:this.orgid,
                                id:item.PhId
                            }
                            this.delete(data1);
                        }
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
                        if(!item.PhId){
                            this.saasMessage={
                                message:"请先选择凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        this.voucherDataList.data.Mst=item;
                        this.clearPhId(this.voucherDataList.data.Mst);
                        this.voucherMaskShow('copy');
                        this.voucherDataList.bool=true;
                   
                        break;
                    case 'cut':
                        if(!item.PhId){
                            this.saasMessage={
                                message:"请先选择凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        this.voucherDataList.data.Mst=item;
                        this.voucherMaskShow('cut');
                        this.voucherDataList.bool=true;
                    
                        break;
                    case 'chongh':
                        if(!item.PhId){
                            this.saasMessage={
                                message:"请先选择凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        this.voucherDataList.data.Mst=item;
                        this.chongh();
                        this.voucherMaskShow('chongh');
                        this.voucherDataList.bool=true;    
                        break;
                    case 'download':
                        this.getvoucherList('yes');
                        break;
                    case 'fresh':
                        this.fresh=false;
                        this.sum1='';
                        this.sum2='';
                        this.searchVal='';
                        console.log(this.superSearchValPhId)
                        this.superSearchVal={
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
                        setTimeout(() => {
                           this.fresh=true; 
                        }, 10);
                        //this.getvoucherList();
                        break;
                }
            },
            //高级搜索显示隐藏****************
            highGradeToggle(bool) {   
                if(bool=='reset'){
                    this.superSearchValPhId=0;                
                    this.assistItemList={id:0,kemu:[]};                                
                    this.superSearchVal.sum1='';
                    this.superSearchVal.sum2='';
                    this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                    this.superSearchVal.date2=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                    console.log(this.superSearchVal.date1,this.year,(this.month>9?this.month:('0'+this.month)))
                    this.superSearchVal.keyword='';                                       
                }else{
                    this.highGradeCss = bool; 
                }   
                
            },
            //凭证详情***************************
            voucherDel(item){
       
                this.$store.commit("tagNav/upexcludeArr", ['voucherAdd']);

                this.$router.push({path:'/home',query:{list:item}});
            },
            //凭证选择**********************
            choose(item){
                console.log(item)
                if(this.chooseItem.PhId==item.PhId){
                   this.chooseItem=''; 
                }else{
                    this.chooseItem=item;
                }
            },
             //审核*****************
            audit(bool,PhId){
                var chooseItem=JSON.stringify(this.chooseItem);
                var item=JSON.parse(chooseItem);              
                if(!item.PhId){
                    this.$message("请先选择凭证!");
                    return;
                }
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    uname:this.uname,
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
                                this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'审核成功!'
                               };
                            }else{
                                 this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'反审核成功!'
                               };
                            }
                            this.getvoucherList();
                        }else{
                            if(bool){
                                 this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'审核失败!'
                               };
                            }else{
                                 this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'反审核成功!'
                               };
                            }
                        }
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"}),loading.close();})
            },
            //删除***********************
            delete(data){ 

                 const loading=this.$loading();
                this.$axios.post('PVoucherMst/PostDelete',data)
                    .then(res=>{
                        loading.close();      
                        if(res.Status=='success'){
                             this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'删除成功!'
                               };
                        }else{
                             this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                        }
                        this.getvoucherList(); 
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"}),loading.close();})
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
            // printContent(e){
                
            //     this.$print(this.$refs.printList) // 使用
            // },
            //获取打印凭证数据***************
            printVoucher() {
            //日期

            //拼凑数据供打印使用,凭证头，尾信息
                var mst = {
                    voucherTitle: "记账凭证", //记账凭证
                    billNum: 4, //附件数
                    orgName: "测试单位", //核算单位
                    billdate:"2018-12-20", //日期
                    voucherNum: "记-0001", //凭证号：记-0001
                    lotal: '23987.20', //合计
                    supervisor: "张三", //记账
                    auditor: "张伟", //审核
                    cashier: "王五", //出纳
                    producer: this.username //制单
                };

                var list=[
                    { abstract: "代理收入",  subject: "112200050003 应收账款_3_宁波得志",  deVal: '5071.00',  crVal: ''},
                    { abstract: "代理收入",  subject: "11220002 应收账款_陕西咸阳佳佳",  deVal: '18916.20',  crVal: ''},
                    { abstract: "代理收入",  subject: "50010002 主营业务收入_二级收入",  deVal: '',  crVal: '4783.96'},
                    { abstract: "代理收入",  subject: "50010002 主营业务收入_二级收入",  deVal: '',  crVal: '17845.47'},
                    { abstract: "代理收入",  subject: "222100010007 应交税费_应交增值税_销项税额",  deVal: '',  crVal: '1357.77'},
                    { abstract: "代理收入",  subject: "222100010007 应交税费_应交增值税_销项税额",  deVal: '',  crVal: '1357.77'}
                ];

                this.printdata={
                    mst:mst,
                    list:list
                };
            },
             //冲红***********************
            chongh(){
                var vm=this;
               //this.voucherData(); 
                var Mst=this.voucherDataList.data.Mst;
                if(Mst.WriteOff_PhIds.length>0){
                    if(confirm("该凭证已经冲红,需要重新冲红吗?")){
                        return;
                    }else{
                        this.voucherMaskShow(false);
                        return;
                    }
                }
                var month;
                var date1;
                var oldPhId=this.voucherDataList.data.Mst.PhId;
                month=Mst.PDate.slice(5,7);
                date1=Mst.PDate.slice(8,10);
                console.log(Mst)
                for(var dtl of Mst.Dtls){
                    dtl.Abstract=`注销${month}月${date1}号${Mst.PNo}号凭证`;                    
                    dtl.JSum=dtl.JSum?dtl.JSum*-1:'';
                    dtl.DSum=dtl.DSum?dtl.DSum*-1:'';
                    if(dtl.DtlAccounts){
                        dtl.DtlAccounts[0].JSum=dtl.DtlAccounts[0].JSum?dtl.DtlAccounts[0].JSum*-1:'';
                        dtl.DtlAccounts[0].DSum=dtl.DtlAccounts[0].DSum?dtl.DtlAccounts[0].DSum*-1:'';
                    }
                }
                console.log(Mst)
                this.clearPhId(this.voucherDataList.data.Mst); 
                this.voucherDataList.data.Mst.PhidTransaction=oldPhId;
                this.voucherDataList.data.Mst.PSource='冲红'
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
            //保存凭证***********************
             keepVoucher(str){
                var url='Add';
                var Vdata=this.voucherDataList.data; 
                if(str=='gengz'){
                    this.clearPhId(Vdata.Mst);
                    Vdata.Mst.Dtls=Vdata.Mst.Dtls.splice(0,Vdata.Mst.Dtls.length/2);
                }
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
                       infoData: Vdata
                   }
                   if(Vdata.Mst.PhId) {
                       url = 'Update';
                   }
                   const loading=this.$loading();
        
                   this.$axios.post('/PVoucherMst/Post' + url, data)
                       .then(res => {
                           loading.close();      
                           if (res.Status == 'success') {
                                this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                               if(str=='print'){
                                   this.printContent();
                               }
                               this.getvoucherList(); 
                           } else {
                                this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                           }   
                       })
                       .catch(err =>{this.$message({ showClose: true,message: err, type: "error"});loading.close()} )
               }else{
                   this.$message('当前月份已结账,无法修改凭证!')
               }
            },
            //复制剪切冲红******************************
            voucherMaskShow(val){
                this.voucherMask=val;
            },
            keepChoose(val){
                var vm=this;
                if(val){
                    this.voucherData();
                    var id = this.voucherDataList.data.Mst.PhId;
                    if(val=='cut'){
                        if(this.voucherDataList.data.Mst.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该凭证已审核,无法剪切!'
                            }
                            return;
                        }
                        var data1={
                            uid:this.uid,
                            orgid:this.orgid,
                            id:id
                        }
                        this.cut(data1);
                    }else if(val=='chongh'){
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
                                Vdata.Mst.PDate=Vdata.Mst.PDate.substring(0,10);
                                Vdata.Mst.Uyear=Vdata.Mst.PDate.substring(0,4);
                                Vdata.Mst.PMonth=Vdata.Mst.PDate.substring(5,7);
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
                            var oldPhId=this.voucherDataList.data.Mst.PhidTransaction;
                            var oldData=this.voucherDataList.data.Mst;
                            const loading=this.$loading();
                            //this.voucherMask=false; 
                            this.voucherDataList.bool=false; 
                            this.$axios.post('/PVoucherMst/PostAdd', data)
                                .then(res => {
                                    if (res.Status == 'success') {
                                        if(confirm('保存成功，是否生成【更正凭证】？')){
                                            vm.voucherDataList.bool=true; 
                                            vm.voucherDataList.data.Mst=oldData
                                            vm.voucherDataList.data.Mst.PhId=oldData.PhidTransaction;
                                            vm.voucherDataList.data.Mst.PSource='更正';
                                            for(var dtl of  vm.voucherDataList.data.Mst.Dtls ){
                                                if(dtl.SubjectCode){
                                                    dtl.Abstract=dtl.Abstract.replace("注销",'更正错账')
                                                }                                            
                                            }
                                            vm.voucherMask='gengz'; 
                                        }else{
                                            vm.voucherMask=false;
                                            vm.getvoucherList();     
                                        }
                                    } else {
                                         this.saasMessage={
                                            visible:true,
                                            delay:3000,
                                            message:res.Msg
                                        };
                                    }
                                    loading.close();
                                })
                                .catch(err=>{
                                    this.$message({ showClose: true,message: err, type: "error"});
                                    loading.close();    
                                })  
                        }else{
                            this.$message('当前月份已结账,无法新增凭证!')
                        }
                                 
                    }
                    else{
                        //this.clearPhId(this.voucherDataList.data.Mst); 
                        this.keepVoucher(val);
                        this.voucherMask=false; 
                        //this.voucherDataList.bool=false; 
                        //this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}};    
                    }    
                }else{
                    this.voucherMask=false;
                    this.chooseItem=''; 
                }                   
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
                                this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
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
            getvoucherList(str){
                let base=httpConfig.getAxiosBaseConfig();
                this.superSearchVal.date1=this.dateTurn(this.superSearchVal.date1)
                this.superSearchVal.date2=this.dateTurn(this.superSearchVal.date2)
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    pageindex:this.pageindex,
                    pagesize:this.pagesize,
                    sum1:this.superSearchVal.sum1,
                    sum2:this.superSearchVal.sum2,
                    keyword:this.superSearchVal.keyword,
                    export2excel:str,
                    sort:['PNo DESC','PType','PDate DESC'],
                   // itemValuePhid:649181122000008,
                    itemValuePhid:this.superSearchVal.assistItem.PhId,
                    queryfilter:{"PAccper*str*ge*1":this.superSearchVal.date1.replace('-',''),"PAccper*str*le*1":this.superSearchVal.date2.replace('-','')}
                }
                if(str=='search'){
                    data.sum1=this.sum1,
                    data.sum2=this.sum2,
                    data.keyword=this.searchVal
                }
           
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        if(res.Status=='success'){
                            this.saasMessage={
                                message:res.Msg,
                                delay:3000,
                                visible:true
                            };
                            return;
                        }  
                        if(str=='yes'){
                            window.location.href = base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;
                            return;
                        } 
                        if(res.Record.length<=0){
                            this.$message('无法找到该凭证!')
                        } else{
                            this.voucherList= res.Record;
                            this.chooseItem='';
                        }

                    })
                    .catch(err=>{this.$message({ showClose: true,message: 'err', type: "error"});})
            },
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
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"})})
            },
            //获取time组件传参********************
            getSideDate(data){
                this.checkedTime=data.checkedTime;
                this.sideDate=data.sideDate;
                this.year=this.sideDate.split('-')[0];
                this.month=this.sideDate.split('-')[1];
                this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                if(this.routerQuery){
                    this.routerQuery=false;
                }
                else{
                    this.getvoucherList();
                }
               
            },
             //凭证重排月份选择******************
            resetCodeMonth($event){
              this.month= this.month=parseInt($event.target.innerHTML);
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
                                this.getvoucherList();
                            }
                            loading5.close();
                        })
                        .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading5.close();})
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
                        loading.close();
                    })
                    .catch(err=>{
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
                        loading.close();
                         if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.superSearchVal.assistItemList.type=res.type;
                        //this.assistItemList.kemu=res.list;
                    })
                    .catch(err=>{
                        this.$message({ showClose: true,message: err, type: "error"});loading.close();
                    })
            },
            //获取searchSelect辅助项搜索值******************
            itemClick(childData){
                this.superSearchVal.assistItem=childData.data;
                this.superSearchVal.show=false;
            },
            testFile(){
                this.message('功能开发中!!')
                //this.fileVisible=true;
            },
            removeimg(item,deleValue) {//
               this.imglist=item;
                if(item.length<1){
                    return;
            }
                console.log(item,deleValue,this.imglist);
                // var urls=deleValue.imgPath.split('/');
                // console.log(this.imglist,item,urls,deleValue)
                // for(var i in item[0]){ 
                //     console.log(item[0][i].BName,urls[4])
                //     if(item[0][i].BName==urls[4]){
                //             console.log(item)
                //           item[0].splice(i,1);  
                //     }
                // } 
                var param={
                    PhId:deleValue.phid,
                    BTable:'gcw3_voucher_mst',
                    BUrlPath:deleValue.imgPath
                };
                this.$axios({
                    url: '/PVoucherAttachment/PostDeleteFile',
                    method: "post",
                    data: param,
                }).then(res => {
                if(res.Status==="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error'});
                        return;
                    }
                }).catch(error => {
                    this.$message({ showClose: true, message: '附件删除错误', type: 'error'});
                });
        },
            uploadimg(item) {
                //this.imglist.push(item);
                console.log(this.imglist);
                if(item){
                    this.ExcelValidMsg(item);    
                }
                
            },
            //校验excel文件中凭证信息***********
            ExcelValidMsg(param){
                var data={
                    fileName:param[0].BUrlPath,
                    orgid:this.orgid,
                    orgcode:this.orgcode,
                    uyear:this.year,
                    dealwithPNo:0 //重复凭证字号处理方式: 0 禁止, 1 跳过, 2 覆盖
                }
                this.$axios.get('/PVoucherMst/GetImportVoucherListFromExcelValidMsg',{params:data})
                .then(res=>{
                    if(res.Status=='error'){
                        this.$message({ showClose: true, message: res.Msg, type: 'error'});
                        if(res.Data.ErrMsg.length>0){
                            return;
                        }else if(res.Data.IgnoreMsg.length>0){
                            console.log(res.Data.IgnoreMsg);
                            //忽略**************
                            data.dealwithPNo=1;
                            this.GetImportVoucherListFromExcel(data);
                            //覆盖****************
                        }
                    }else{
                        this.GetImportVoucherListFromExcel(data);
                    }
                })
                .catch(err=>console.log(err))
            },
            //excel文件导入**************
            GetImportVoucherListFromExcel(data){
                this.$axios.get('PVoucherMst/GetImportVoucherListFromExcel',{params:data})
                    .then(res=>{
                        if(res.Status=='success'){
                            this.message(res.Msg)
                        }
                        console.log(res)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            // ...mapActions({
            //     uploadFile: 'uploadFile/Voucherupload'
            // }),
            
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
                uname: state => state.user.username,
                orgcode:state => state.user.orgcode,
                cachePage:state=>state.tagNav.cachePage  //是否利用路由缓存
            }),
            picUrl:function(){
                return httpConfig.baseurl;
        },
        },
        watch:{
            superSearchValPhId(val){
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
                    if(!value||(value==0)) return '';                    
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
                            fu='(负数)'
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

            },
            
            //数字转换******************
            NUmTurn(value){
                if(!value) return '';
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
        },
        components:{
            fileUpload,
            searchSelect,
            sideTime,
            voucher,
            printTem,
            saasMsg
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
        background: #00b7ee;
        color:#fff;
        cursor:pointer;
    }
    .voucherList{
        padding:8px 70px 0 18px;
        margin-right:10px;
        font-size:14px;
        position:relative;
        min-width: 920px;
        height:93%;
        .voucherNav>ul{
            margin-bottom: 10px;
            position:relative;
            z-index:2;
            >a:nth-of-type(2):hover{
                opacity:1;
            }
            &:last-of-type:after{
                    clear:both;
                    content:"";
                    display: block;
                }
            >a{
                float:right;
                border:0;
                color:#fff;
                border-radius: 3px;
                height:30px;
                line-height: 30px;
                margin-left:10px;
                cursor:pointer;
                width:60px;

                text-align: center;
                background: #00b7ee;
                &:hover{
                    opacity: 0.8;
                   
                }
                >li{
                    
                    >img{
                        height:100%;
                        width:100%;
                    }
                }
            }
            
        }
        .voucherSelect{
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            position: relative;
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
        z-index:2;
        width:100%;
        height:100%;
        top:0;
        left:0;
        background: rgba(0,0,0,0.5);
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
            &:hover{
                opacity:0.7;
            }
        }
    }
    .voucherMaskActive{
        position:absolute;
        bottom: 0;
        z-index: -1;
    }
    .listContainer{
        max-height:85%;
        overflow-y: auto;
        padding:5px;
        margin-top:10px;
        padding-bottom: 20px;
    }
    .listContainer ul.listTitle{
        display: flex;
        background: #d3e9f9 ;
        color:#333;
        
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
        background: #d3e9f9;
        color:#333;
    
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
        text-align: left;
        padding:0 10px;
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
        text-align: left;
        border:1px solid #ccc;
        border-top:0;
        border-left:0;
        width:20%;
        
    }
    ul.listContent>li> ul>li:last-of-type>div:first-of-type{
            width:60%;
        }
        ul.listContent>li> ul:nth-of-type(2)>li>div:nth-last-of-type(1),ul.listContent>li> ul:nth-of-type(2)>li>div:nth-last-of-type(2){
            text-align: right;
        }
    
         ul.listContent>li> ul:nth-of-type(2)>li:last-of-type>div{
             padding-left:10%;
         }
    .searchSelectCon{
        position: relative;
        width:100%;
        height:30px;
        line-height: 25px;
        background: #fff;
        border:1px solid #ddd;
        padding:3px;
    }
    .voucherDisabledCon{
         position:relative;    
        .voucherDisabled{
            position:absolute;
            background: none;
            z-index: 99;
            width:100%;
            height:100%;
            >div{
                position:relative;
                z-index:89;
            }
        }     

    }
      .wrapKemu{
          height:30px;
          font-size: 14px;
         
      }
      ul.listContent > li > ul > li div.wrapKemu>div{
          width:100%;
          height:30px;
          overflow-y: auto;         
      }  
      
       .ul.listContent > li > ul > li > div{
           text-align: left;
           overflow-y: auto;     
       } 
    .footInfo{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        margin: 30px 0 10px 0;
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
    .uploaderTitle{
        position:relative;
        width:40px;
        height:30px;  
        cursor:pointer; 
        background: url("../../assets/icon/f90c871a-13a3-4900-9b6f-ff9edc5c98c5.svg") no-repeat;
        background-size:40px 30px;
    }
    
    .avatar-uploader{
    position: absolute;
    z-index: 1;
    right: 61px;
    top: -20px;
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
.avatar-uploader .el-upload--text{
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
.orgform .el-form-item__label{
    background: #00B8EE;
}

.orgform .el-form-item{
    margin-bottom: 2px;
}
.more{
        height:30px;
        overflow:hidden; 
        position: absolute;
        z-index: 2;
        width:100%;
        margin:0;  
        opacity:1;         
        >ul{
            width:100%;  
            >li{
                width:100%;     
                background: #fff;         
                color:#999;
                &:hover{
                    background:#ccc;
                    color:#fff;
                }
                &:first-of-type{
                    background: #00b7ee;
                    border-radius: 3px;
                    color:#fff;
                }
            
            }
        }
        
        &:hover{
            height:auto;
            background: #00b7ee;  
        }
        
    }
</style>
<style>
    .highGradeCss .el-input--prefix .el-input__inner {
        padding-left: 24px;
        font-size:12px;
    }
    
    /* .voucherList   .el-dialog{
            z-index:2008;
        }
     */
</style>

