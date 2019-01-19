<template>
    <div class="voucherList">               
        <div class="voucherNav">
            <ul>
                <a @click.prevent="handle('fresh')" style="width:30px"><li style='font-size:27px;' class="el-icon-refresh" ></li></a>
                <a style="position:relative;display:block;width:80px;height:30px;margin-left:10px">
                    <li class="more" style="width:80px">
                        <ul >
                            <li>更多</li>
                            <li  @click.stop="handle('copy')">复制</li>
                            <li  @click.stop="handle('cut')">剪切</li>
                            <li  @click.stop="handle('chongh')">冲红</li>
                            <li  @click.stop="handle('download')">
                                <span>导出</span>
                            </li>
                            <li @click.prevent="handle('upload')">
                                <div>导入</div>                       
                            </li>
                            <li @click.stop="handle('print')">打印</li>
                            <li @click.stop="handle('reset')">凭证号重排</li>
                        </ul>
                    </li>
                </a>            
                 <a class="btn" @click.prevent="handle('unaudit')"><li >反审核</li></a>    
                <a class="btn" @click.prevent="handle('audit')"><li >审核</li></a>    
                <a class="btn" @click.prevent="handle('delete')"><li >删除</li></a>
                <a class="btn" @click.prevent="handle('update')"><li >修改</li></a>
                <router-link class="btn" to="/home"><li >新增</li></router-link>          
            </ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        </div>
        <div class="voucherSelect">
            <div>
                <span>合计金额(元):&nbsp;</span> 
                <div class="inputContainer"><input v-model="sum1" type="text"></div> 
                <span>至:&nbsp;</span>
                <div class="inputContainer"><input v-model="sum2" type="text"></div>
            </div>
            <div>
                <el-checkbox  v-model="listAll">全选</el-checkbox>
                <!-- <el-checkbox v-model="listCancle">取消全选</el-checkbox> -->
            </div>
            <div class="searcherCon">
                <div @click.stop="highGradeToggle(!highGradeCss)">高级</div>
                <div  @click="getvoucherList('search')" class="searcherBtn">搜索</div>
                <div class="searcherValue"><input @keyup.13="getvoucherList('search')" v-model="searchVal" type="text" placeholder="科目/摘要/凭证号"></div>
                
                <!-- 高级搜索 -->
                <div v-if="highGradeCss" class="highGradeCss">
                    <div><span>高级查询</span><i @click.stop="highGradeToggle(false)" class="cancle"></i></div>
                    <ul>
                        <li>
                            <div>科目编码</div>
                            <div @click.stop="subjectSearchShow" >
                                <div >
                                    <span>{{superSearchVal.keyword}}</span>
                                    <sub-list @subadd-click="subjectData" v-if="subjectListShow" :placeholder='"搜索科目"' :itemlists="subjectList"></sub-list>

                                </div>
                            </div>
                        </li>
                        <li>
                            <div>辅助核算</div>
                            <div >
                                <div class="selectContainer">
                                    <select v-model="superSearchValPhId">
                                        <option value="0"></option>
                                        <option :value="item.PhId" v-for="(item,index) of superSearchVal.assistItemList.type" :key="index">{{item.BaseName}}</option>
                                    </select>
                                </div>
                                <div @click.stop="superSearchVal.show=!superSearchVal.show" class="searchSelectCon">
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
                            <div>凭证日期</div>
                            <div >
                                <el-date-picker
                                    v-model="timeValue"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </li>
                    </ul>
                    <div>
                        <div>
                            <div class="btn" @click.stop="highGradeToggle('reset')">重置</div>
                            <div class="btn" @click.stop="getvoucherList('highSearch')">搜索</div>
                        </div>    
                    </div>
                </div>
            </div>

        </div>
        <section  class="listContainer">
            <div style="width:5%;left:0;top:0;position:absolute;height:40px;line-height:40px;border-right:1px solid #fff;background:#d3e9f9;text-align:center">序号</div>
            <ul class="listTitle">
                <li>摘要</li>
                <li>科目</li>
                <li>借方金额(元)</li>
                <li>贷方金额(元)</li>
            </ul>
            <div class="hideScroll"></div>
            <div class="listOver">
                <ul  @click="choose(item,index)" :class="{choosed:item.checked}" class="listContent" v-for="(item,index) of voucherList" :key="index">
                    <li @dblclick="voucherDel(item)">
                        <ul class="listIndex"><li><span>{{index+1}}</span></li></ul>
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
                                <div>{{'jie'| sum(item.Dtls)}}</div>
                                <div>{{'dai'| sum(item.Dtls)}}</div>
                            </li>
                        </ul>
                    </li>
                </ul>    
            </div>
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
                <div style="height:40px" v-if="voucherMask">
                    <span class="btn" @click.stop="keepChoose(voucherMask)">保存</span>
                    <span class="btn" @click.stop="keepChoose(false)">取消</span>
                </div>
                <div class="voucherDisabledCon">
                    <div :class="{voucherDisabled:voucherMask=='chongh'}"></div>
                    <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
                </div>
            </div>            
        </div>
        <!-- 打印************ -->
        <div v-show="printCss" class="printCon">
            <span class="btn" @click.stop="print">确认打印</span>
            <span class="btn" @click.stop="printCss=false">取消打印 </span>
            <div class="container" ref="print">
                <div>
                   <div class="sys-page printDataCss" >

                        <div class="manageContent" v-for="(item, n) in tableData" :key="n">
                            <div class="title">
                                <strong>{{item.mst.voucherTitle}}</strong>
                                <div>附单据数：{{item.mst.billNum}}张</div>
                            </div>
                            <ul class="formDataItemsA flexPublic">
                                <li>单位：{{item.mst.orgName}}</li>
                                <li>日期：{{ item.mst.billdate}}</li>
                                <li>凭证号：{{item.mst.voucherNum}}-{{item.page+'/'+item.toltal}}</li>
                            </ul>
                            <div class="formData" ref="printFrom">
                                <ul>
                                    <li class="align-center bolder">摘要</li>
                                    <li class="align-center bolder">科目</li>
                                    <li class="align-center bolder">借方</li>
                                    <li class="align-center bolder">贷方</li>
                                </ul>
                                <ul class="formDataItems flexPublic" v-for="(del, k) in item.list" :key="k">
                                    <li>{{del.abstract}}</li>
                                    <li>{{del.subject}}</li>
                                    <li class="align-right">{{del.JSum}}</li>
                                    <li class="align-right">{{del.DSum}}</li>
                                </ul>
                                <ul class="formDataItems flexPublic">
                                    <li >
                                        合计： <span class="bolder"> {{item.mst.lotal | NumtoCHN}}</span>
                                    </li>
                                    <li class="align-right">{{item.mst.lotal}}</li>
                                    <li class="align-right">{{item.mst.lotal}}</li>
                                </ul>
                            </div>
                            <ul class="formDataItemsB flexPublic">
                                <li>主管：{{item.mst.chager}}</li>
                                <li>记账：{{item.mst.supervisor}}</li>
                                <li>审核：{{item.mst.auditor}}</li>
                                <li>出纳：{{item.mst.cashier}}</li>
                                <li>制单：{{item.mst.producer}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        
        <!-- 附件弹出框 -->
        <el-dialog title="选择附件" custom-class="fileDialog" :modal=false :visible.sync="fileVisible" width="40%">
            <file-upload  @uploadimg="uploadfile" :imgList="filelist" :limit="1" @removeimg="removefile"></file-upload>
            <div v-show="fileErrMsg.ErrMsg.length>0||fileErrMsg.IngoreMsg.length>0||fileSuccessMsg" class="fileCon">
                <ul class="fileErrMsg" v-show="fileErrMsg.ErrMsg.length>0">
                    <li>不可跳过错误:</li>  
                    <li v-for="(item,index) of fileErrMsg.ErrMsg" :key="index">{{item}}</li>
                </ul>
                <ul class="fileIngoreMsg" v-show="fileErrMsg.IngoreMsg.length>0">
                    <li>可跳过错误:</li>
                    <li v-for="(item2,index2) of fileErrMsg.IngoreMsg" :key="index2">{{item2}}</li>
                </ul> 
                <ul class="fileSuccessMsg">
                    <li>{{fileSuccessMsg}}</li>
                </ul>   
            </div>
            <div v-show="fileErrMsg.IngoreMsg.length>0" class="fileBtn">
                <div class="btn" @click.stop="fileErrHandle()">跳过</div> 
                <div class="btn" @click.stop="fileErrHandle('cover')">覆盖</div>   
            </div> 
            <div style="clear:both"></div>
        </el-dialog>
         <!-- 弹窗*****message:信息******delay:延迟毫秒默认4000毫秒 -->
        <message :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></message>
        <!-- btn1默认确定,btn2默认取消 -->
        <saasconfirm  
            :message="confirm.message" 
            :btn1="confirm.btn1" 
            :btn2="confirm.btn2" 
            :type="confirm.type"
            :visible.sync="confirm.visible"
            @ok-click="confirmOk"
            @no-click="confirmNo" >
            
        </saasconfirm>
    </div>
</template>

<script>
    import subList from './addSublist'
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
                this.listInit(this.voucherList);
            }else if(this.$route.query.reset){
                this.$store.commit("tagNav/upexcludeArr", []);
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
                chooseItem:[],
                nowTime:new Date,
                checkedTime:'',   //结账月****
                checkedYear:'',   //结账年*****
                sideDate:'',   //侧边会计期年月
                month:'',    //当前选中年
                year:'',     //月
                searchVal:'', //一般搜索值
                superSearchValPhId:"0",   //高级搜索
                subjectList:[],//科目列表
                subjectListShow:false,
                assistItemList:{id:0,kemu:[]},
                superSearchVal:{
                    assistItemList:{type:'',list:''},
                    assistItem:'',
                    sum1:'',
                    sum2:'',
                    date1:'',
                    date2:'',
                    PDate1:'',
                    PDate2:'',
                    keyword:'',
                    placeholder:'选择辅助项',
                    nodatatext:'',
                    show:true
                },
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeValue: '',
                voucherDataList:{bool:false,data:{Mst:'',Attachements:[]}},
                voucherList:[],
                highGradeCss:false,
                pagesize:100,
                pageindex:0,
                allReset:'',
                resetShow:false,
                voucherMask:false,
                voucherDisabled:true,
                printData:[],
                routerQuery:false,//路由是否传值************
                fileVisible:false,
                filelist:[], //文件上传的内容************
                fileErrMsg:{
                   IngoreMsg:'',
                   ErrMsg:''     
                },
                fileSuccessMsg:'',
                fresh:true,
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                confirm:{
                    message:'',
                    btn1:'',
                    btn2:'',
                    visible:false
                },
                listAll:false,  //列表全选
                listCancle:true, //列表取消选中
                printCss:false ,   //凭证打印显示***********
                printData:[],//打印数据
                tableData:[]   //打印的表格数据
            }
        },
        methods:{
            //操作导航******************
            handle(str){
                var item =JSON.parse(JSON.stringify(this.chooseItem));    
                switch(str){
                    case 'update'://修改**********
                        if(item.length!=1){
                            this.saasMessage={
                                message:"请选择且只选择一个凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        if(!(item[0].PMonth>=this.checkedTime&&item[0].Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        if(item[0].Verify){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该凭证已审核,无法修改!'
                            }
                            return;
                        }
                        this.voucherDataList.data.Mst=item[0];
                        
                        this.voucherMaskShow('update');
                        this.voucherDataList.bool=true;
                        break;
                    case 'audit'://审核**********  
                        if(item.length<=0){
                            this.saasMessage={
                                message:"请至少选择一个凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        for(var au of item){
                            if(!(au.PMonth>=this.checkedTime&&au.Uyear>=this.checkedYear)){
                                this.saasMessage={
                                    visible:true,
                                    
                                    message:'存在已结账凭证,无法审核!'
                                }
                                return;
                            }
                            if(au.Verify){
                                this.confirm={
                                    btn1:'继续',
                                    btn2:'取消',
                                    message:'存在已审核凭证,是否继续!',
                                    type:'audit',
                                    visible:true
                                }
                                return;
                            }
                        }
                        var PhIds=[];
                        for(var id of item){
                            PhIds.push(id.PhId);
                        }
                        this.audit(true,PhIds);
                        break;                      
                    case 'unaudit'://反审核************
                        if(item.length<=0){
                            this.saasMessage={
                                message:"请至少选择一个凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        for(var au of item){
                            if(!(au.PMonth>=this.checkedTime&&au.Uyear>=this.checkedYear)){
                                this.saasMessage={
                                    visible:true, 
                                    message:'存在已结账凭证,无法反审核!'
                                }
                                return;
                            }
                            if(!au.Verify){
                                this.confirm={
                                    btn1:'继续',
                                    btn2:'取消',
                                    message:'存在未审核凭证,是否继续!',
                                    type:'unaudit',
                                    visible:true
                                }
                                return;
                            }
                        }
                        var PhIds=[];
                        for(var id of item){
                            PhIds.push(id.PhId);
                        }
                        this.audit(false,PhIds);
                        break;
                    case 'delete' :
                        if(item.length<=0){
                            this.saasMessage={
                                message:"请至少选择一个凭证!",
                                visible:true
                            };
                            return;
                        }
                        for(var au of item){
                            if(!(au.PMonth>=this.checkedTime&&au.Uyear>=this.checkedYear)){
                                this.saasMessage={
                                    visible:true,
                                    message:'存在已结账凭证,无法删除!'
                                }
                                return;
                            }
                            if(au.Verify){
                                this.saasMessage={
                                    visible:true,
                                    message:'存在已审核凭证,无法删除!'
                                }
                                return;
                            }
                        }
                        this.confirm={
                            visible:true,
                            message:'此操作将永久删除凭证,是否继续!',
                            type:'delete'
                        }
                        break;
                    case 'reset':
                        this.confirm={
                            message:'凭证号重排过程中不允许取消、暂停操作。确定重排？',
                            type:'reset',
                            visible:true
                        }
                        break;
                    case 'print': 
                        this.printVoucher(); 
                        break;
                    case 'copy':  
                        if(item.length!=1){
                            this.saasMessage={
                                message:"请选择且只选择一个凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        this.voucherDataList.data.Mst=item[0];
                        this.clearPhId(this.voucherDataList.data.Mst);
                        this.voucherMaskShow('copy');
                        this.voucherDataList.bool=true;
                   
                        break;
                    case 'cut':   //剪切**************
                        if(item.length!=1){
                            this.saasMessage={
                                message:"请选择且只选择一个凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        if(!(item[0].PMonth>=this.checkedTime&&item[0].Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        if(item[0].Verify){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该凭证已审核,无法修改!'
                            }
                            return;
                        }
                        this.voucherDataList.data.Mst=item[0];
                        this.voucherMaskShow('cut');
                        this.voucherDataList.bool=true;        
                        break;
                    case 'chongh':  //冲红**************
                        if(item.length!=1){
                            this.saasMessage={
                                message:"请选择且只选择一个凭证!",
                                delay:3000,
                                visible:true
                            };
                            return;
                        }
                        if(!(item[0].PMonth>=this.checkedTime&&item[0].Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        if(item[0].Verify){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该凭证已审核,无法修改!'
                            }
                            return;
                        }
                        if(item[0].WriteOff_PhIds.length>0){
                            this.saasMessage={
                                message:'该凭证已经冲红,无法冲红!',
                                delay:4000,
                                visible:true
                            }
                            return;
                            // if(confirm("该凭证已经冲红,需要重新冲红吗?")){
                            //     return;
                            // }else{
                            //     this.voucherMaskShow(false);
                            //     return;
                            // }
                        }   
                        this.voucherDataList.data.Mst=item[0];
                        this.chongh();
                        this.voucherMaskShow('chongh');
                        this.voucherDataList.bool=true;    
                        break;
                    case 'download':  //下载**************
                        this.getvoucherList('yes');
                        break;
                    case 'upload': //导入************
                        this.testFile();
                        this.fileSuccessMsg='';
                        break;
                    case 'fresh':  //刷新**************
                        this.fresh=false;
                        this.sum1='';
                        this.sum2='';
                        this.searchVal='';
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
            //确认框btn1方法**********
            confirmOk(type){
                this.confirm.visible=false;
                var item =JSON.parse(JSON.stringify(this.chooseItem));
                switch(type){
                    case 'audit':
                        var PhIds=[];
                        for(var id of item){
                            PhIds.push(id.PhId);
                        }
                        this.audit(true,PhIds);
                        break;
                    case 'unaudit':
                        var PhIds=[];
                        for(var id of item){
                            PhIds.push(id.PhId);
                        }
                        this.audit(false,PhIds);
                        break;
                    case 'reset':
                        this.resetShow=true;
                        break;
                    case 'delete':
                        var PhIds=[];
                        for(var id of item){
                            PhIds.push(id.PhId);
                        }
                        var data={
                            uid:this.uid,
                            orgid:this.orgid,
                            infoData:PhIds
                        }
                         
                        this.delete(data);
                        break;
                    case 'gengZ':
                        var vm = this;
                        vm.voucherMask='gengz';
                        vm.voucherDataList.bool=true; 
                        console.log(vm.voucherDataList)
                        vm.voucherDataList.data.Mst.PSource='更正';
                        for(var dtl of  vm.voucherDataList.data.Mst.Dtls ){
                            if(dtl.Abstract){
                                dtl.Abstract=dtl.Abstract.replace("注销",'更正错账');
                                dtl.JSum=dtl.JSum?dtl.JSum*-1:'';
                                dtl.DSum=dtl.DSum?dtl.DSum*-1:'';
                                if(dtl.DtlAccounts){
                                    dtl.DtlAccounts[0].JSum=dtl.DtlAccounts[0].JSum?dtl.DtlAccounts[0].JSum*-1:'';
                                    dtl.DtlAccounts[0].DSum=dtl.DtlAccounts[0].DSum?dtl.DtlAccounts[0].DSum*-1:'';
                                }   
                            }                                            
                        }
                        
                          
                        break;
                }
            },
             //确认框btn2方法**********
            confirmNo(type){
                this.confirm.visible=false;
                switch(type){
                    case 'gengZ':
                        this.voucherMask=false;
                        this.getvoucherList();     
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
                    this.superSearchVal.PDate1=this.year+'-'+(this.month>9?this.month:('0'+this.month))+'-01';
                    this.superSearchVal.PDate2=this.year+'-'+(this.month>9?this.month:('0'+this.month))+'-01';
                    this.timeValue=[this.superSearchVal.PDate1,this.superSearchVal.PDate2];
                    this.superSearchVal.keyword='';                                       
                }else if(bool){
                    this.highGradeCss = bool;
                    this.subjectListShow=false;
                    if(!this.superSearchVal.assistItemList.type){
                        this.getAssist();
                    } 
                    if(this.subjectList.length<=0){
                        this.getSubjectList();
                    }
                }else{
                    this.highGradeCss = bool;
                    this.superSearchValPhId=0;                
                    this.assistItemList={id:0,kemu:[]};                                
                    this.superSearchVal.sum1='';
                    this.superSearchVal.sum2='';
                    this.superSearchVal.PDate1=this.year+'-'+(this.month>9?this.month:('0'+this.month))+'-01';
                    this.superSearchVal.PDate2=this.year+'-'+(this.month>9?this.month:('0'+this.month))+'-01';
                    this.timeValue=[this.superSearchVal.PDate1,this.superSearchVal.PDate2];
                    this.superSearchVal.keyword='';         
                }   
                
            },
            //
            subjectSearchShow(){
                this.subjectListShow=!this.subjectListShow;
            },
            //获取高级搜索的科目列表
            getSubjectList(){
                var data={
                    orgid:this.orgid,
                    Ryear:(new Date).getFullYear()
                }
                this.$axios.get('/PSubject/GetPSubjectListByOrgId',{params:data})
                    .then(res=>{
                        if(res.Status=='error'){
                            this.saasMessage={
                                delay:4000,
                                message:res.Msg,
                                visible:true
                            }
                        }
                        this.subjectList=res;
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>{this.$message({ showClose: true,message: '获取科目列表出错了!', type: "error"});})
            },
            //科目选择传值
            subjectData(data){
                this.subjectListShow=false;
                this.superSearchVal.keyword=data.data.KName;
             
            },
             //会计期年份上下切换******
            nextYear(bool){
                var year=this.year;
                if(bool){
                    this.year=year>=this.sideDate.split('-')[0]?year:parseInt(year)+1;
                }else{
                   this.year=year<=2000?year:--year;
                }
            },
            //凭证详情***************************
            voucherDel(item){
       
                this.$store.commit("tagNav/upexcludeArr", ['voucherAdd']);

                this.$router.push({path:'/home',query:{list:item}});
            },
            //凭证选择  单选**********************
            // choose(item){
            //     if(this.chooseItem.PhId==item.PhId){
            //        this.chooseItem=''; 
            //     }else{
            //         this.chooseItem=item;
            //     }
            // },

            //多选*************
            choose(item,index){
                if(item.checked){
                    item.checked=false;
                    this.chooseItem.forEach((val,i,arr)=>{
                        if(val.PhId==item.PhId){
                            arr.splice(i,1);
                        }
                    });
                    this.$forceUpdate();
                }else{
                    item.checked=true;                    
                    this.chooseItem.push(item);
                    this.$forceUpdate();
                }
            },
             //[反]审核*****************
            audit(bool,PhId){              
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    uname:this.uname,
                    infoData:PhId
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
                                  message:'审核成功!'
                               };
                            }else{
                                 this.saasMessage={
                                  visible:true,
                                  message:'反审核成功!'
                               };
                            }
                            this.getvoucherList();
                        }else{
                            if(bool){
                                 this.saasMessage={
                                  visible:true,
                                  message:'审核失败!'
                               };
                            }else{
                                 this.saasMessage={
                                  visible:true,
                                  message:'反审核成功!'
                               };
                            }
                        }
                    },err => {
                        console.log(err);
                           loading.close();
                    })
                    .catch(err=>{this.$message({ showClose: true,message: '审核出错了!', type: "error"}),loading.close();})
            },
            //删除***********************
            delete(data){ 
                const loading=this.$loading();
                this.$axios.post('PVoucherMst/PostDeleteBatch',data)
                    .then(res=>{
                        loading.close();      
                        if(res.Status=='success'){
                            this.getvoucherList(); 
                            if(this.voucherMask=='cut'){
                                this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:'剪切成功!'
                               }
                               this.voucherMask=false;
                            }else{
                                this.saasMessage={
                                    visible:true,
                                    delay:4000,
                                    message:res.Msg
                                };
                            }     
                        }else{
                             this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:res.Msg
                               };
                        } 
                    },err => {
                        console.log(err);
                           loading.close();
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
            //打印数据转换**************
            printDataTurn(vm,data){
                // Correct_PhIds: (...)
                // Creator: (...)
                // CreatorName: (...)
                // CurOrgId: (...)
                // DealWithPNo: (...)
                // DeleteMark: (...)
                // Description: (...)
                // Dtls: (...)
                // Editor: (...)
                // EditorName: (...)
                // EnabledMark: (...)
                // ExcelLineNo: (...)
                // NgInsertDt: (...)
                // NgRecordVer: (...)
                // NgUpdateDt: (...)
                // OrgCode: (...)
                // OrgId: (...)
                // PAccper: (...)
                // PAttachment: (...)
                // PAuditor: (...)
                // PAuditorName: (...)
                // PCashier: (...)
                // PDate: (...)
                // PFinancePerson: (...)
                // PKeepingPerson: (...)
                // PMakePerson: (...)
                // PMonth: (...)
                // PNo: (...)
                // PSource: (...)
                // PType: (...)
                // PersistentState: (...)
                // PhId: (...)
                // PhidTransaction: (...)
                // Uyear: (...)
                // Verify: (...)
                // WriteOff_PhIds: (...)
                var mst = {
                    voucherTitle: "记账凭证", //记账凭证
                    billNum: data.PAttachment, //附件数
                    orgName: vm.uname, //核算单位
                    
                    voucherNum: "记-"+data.PNo, //凭证号：记-0001
                    lotal: 0, //合计
                    supervisor: data.PKeepingPerson, //记账
                    auditor: data.PAuditorName, //审核
                    cashier: data.PCashier, //出纳
                    producer: data.PMakePerson //制单
                };
                if(data.PDate)
                mst.billdate=data.PDate.split('T')[0];//日期
               
                var list=[
                    //{ abstract: "代理收入",  subject: "112200050003 应收账款_3_宁波得志",  JSum: '5071.00', DSum: ''},
                   ];
                for(var dtl of data.Dtls){  //获取合计和list***
                    mst.lotal=parseFloat(dtl.JSum)+parseFloat(mst.lotal);
                    list.push({
                        abstract:dtl.Abstract,
                        subject:dtl.SubjectCode+' '+dtl.SubjectName,
                        JSum:dtl.JSum?dtl.JSum:'',
                        DSum:dtl.DSum?dtl.DSum:''
                    })
                }
                mst.lotal=mst.lotal.toFixed(2);
                return {
                    mst:mst,
                    list:list
                };
            },
            //获取打印凭证数据***************
            printVoucher() {
                if(this.chooseItem.length<=0){
                    this.saasMessage={
                        message:'请选择要打印的凭证!',
                        visible:true,
                    }
                    return;
                }
                var vm=this;
                this.printData=[];
                this.printCss=true;
                var data=document.getElementsByClassName('printCon')[0].children[2].children[0].children[0];
                data.className='sys-page printDataCss';
                var list=JSON.parse(JSON.stringify(this.chooseItem));
                //拼凑数据供打印使用,凭证头，尾信息
                for(var vou of list){
                    this.printData.push(vm.printDataTurn(vm,vou));  
                }
                vm.tableData=[];
                vm.voucher5tr(vm);
                
            },
            print(){
                var data=document.getElementsByClassName('printCon')[0].children[2].children[0].children[0];
                console.log(data)
                data.className='printDataCss';
                // console.log(data);debugger
                // var copyData=document.body.cloneNode(true);
                // copyData.innerHTML='';
                // copyData.appendChild(data);
                //console.log(copyData)
                 this.$print(data);
                 this.printCss=false;
               
            },
            //每5列切成一张凭证
            voucher5tr(vm){
                let mst;
                let del;
                let tr5;
                let index;
                let page;
                let toltal;
                for(let data of this.printData){
                    tr5 = []; //[[{},{},{},{},{}]]一维变多维
                    mst = data.mst;    //{}
                    del = data.list;  //[]
                    index = 0;
                    page = 1;
                    toltal = Math.ceil(del.length/5);
                    del.forEach((n, i) => {
                        if (!tr5[index]) {
                        tr5[index] = [];
                        }
                        tr5[index].push(n);
                        if (tr5[index].length === 5) {
                        index++;
                        }
                        if(index==5){
                            page++
                        }
                    });

                    //最后一个,不足5条数据的要补充完成
                    let last = tr5[tr5.length - 1];
                    for (let i = 0,l = 5 - last.length; i < l; i++) {
                    last.push({
                        abstract: "", //摘要
                        subject: "", //科目是否有辅助核算，有辅助核算，拼接上辅助核算
                        Jsum: "", //借方金额
                        Dsum: "" //贷方金额
                    })
                    }
                    //this.tableData的赋值
                    tr5.forEach(n=>{
                        this.tableData.push({
                            mst:mst,
                            list:n,
                            toltal:toltal,
                            page:page
                        })
                    })    
                }
                
            },
             //冲红***********************
            chongh(){
                var vm=this;
               //this.voucherData(); 
                var Mst=this.voucherDataList.data.Mst;
                if(Mst.WriteOff_PhIds.length>0){
                    this.saasMessage={
                        message:'该凭证已经冲红,无法冲红!',
                        delay:4000,
                        visible:true
                    }
                    return;
                    // if(confirm("该凭证已经冲红,需要重新冲红吗?")){
                    //     return;
                    // }else{
                    //     this.voucherMaskShow(false);
                    //     return;
                    // }
                }
                var year;
                var month;
                var date1;
                var oldPhId=this.voucherDataList.data.Mst.PhId;
                year=Mst.PDate.slice(0,4);
                month=Mst.PDate.slice(5,7);
                date1=Mst.PDate.slice(8,10);
                for(var dtl of Mst.Dtls){
                    dtl.Abstract=`注销${year}年${month}月${date1}号${Mst.PNo}号凭证`;                    
                    dtl.JSum=dtl.JSum?dtl.JSum*-1:'';
                    dtl.DSum=dtl.DSum?dtl.DSum*-1:'';
                    if(dtl.DtlAccounts){
                        dtl.DtlAccounts[0].JSum=dtl.DtlAccounts[0].JSum?dtl.DtlAccounts[0].JSum*-1:'';
                        dtl.DtlAccounts[0].DSum=dtl.DtlAccounts[0].DSum?dtl.DtlAccounts[0].DSum*-1:'';
                    }
                }
                
                this.voucherDataList.data.Mst.PhidTransaction=oldPhId;
                this.voucherDataList.data.Mst.PSource='冲红'
                //this.resetVoucher();        
                
                
                
                              
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
                    //Vdata.Mst.Dtls=Vdata.Mst.Dtls.splice(0,Vdata.Mst.Dtls.length/2);
                }
               if(Vdata.Mst.Dtls.length<=0){
                   this.$message('请输入内容!')
                   return;
               }
                //判断科目金额摘要不能为空
                for(var dtl of Vdata.Mst.Dtls){
                    if(!(dtl.SubjectCode&&dtl.Abstract&&(dtl.JSum||dtl.DSum))){
                        this.saasMessage={
                            message:'科目/金额/摘要不能为空!',
                            visible:true,
                            delay:4000
                        }
                        return;
                    }
                    
                }
                
                if(!this.dataCheck()){
                    this.saasMessage={
                        visible:true,
                        delay:4000,
                        message:'借贷不平衡,请查看!'
                    }
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
        
               if((Vdata.Mst.Uyear>=this.checkedYear)&&(Vdata.Mst.PMonth>=this.checkedTime)){
                 
                   var data = {
                       uid: this.uid,
                       Ryear:'',
                       Uname:'',
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
                            //    if(str=='print'){
                            //        this.printContent();
                            //    }
                            this.voucherMask=false;
                            this.getvoucherList(); 
                           } else {
                                this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               }
                           }   
                       },err => {
                        console.log(err);
                           loading.close();
                    })
                       .catch(err =>{
                           this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'出错了!'
                               }
                           loading.close()
                        } )
               }else{
                   this.$message('当前月份已结账,无法修改凭证!')
               }
            },
            //判断借贷平衡***********
            dataCheck(){
                var data=this.voucherDataList.data.Mst.Dtls;
                var Jcount=0;
                var Dcount=0;
                for(var dtl of data){
                    Jcount=parseFloat(Jcount)+parseFloat(dtl.JSum?dtl.JSum:0);
                    Dcount=parseFloat(Dcount)+parseFloat(dtl.DSum?dtl.DSum:0);
                }
                console.log(Jcount,Dcount,data)
                if(Jcount.toFixed(2)==Dcount.toFixed(2)){
                    return true;
                }else{
                    return false;
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
                        this.cut(vm,data1);
                    }else if(val=='chongh'){
                         var Vdata=JSON.parse(JSON.stringify(this.voucherDataList.data));
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
                        
                        this.clearPhId(Vdata.Mst); 
                        if((Vdata.Mst.Uyear>=this.checkedYear)&&(Vdata.Mst.PMonth>=this.checkedTime)){
                            var data = {
                                uid: this.uid,
                                orgid: this.orgid,
                                orgcode: this.orgcode,
                                infoData: Vdata
                            }
                            var oldPhId=this.voucherDataList.data.Mst.PhidTransaction;
                            var oldData=this.voucherDataList.data.Mst;
                            const loading=this.$loading();
                            //this.voucherMask=false; 
                           // this.voucherDataList.bool=false; 
                     
                            this.$axios.post('/PVoucherMst/PostAdd', data)
                                .then(res => {
                                     loading.close();
                                    if (res.Status == 'success') {
                                        vm.voucherMask=false;
                                        this.confirm={
                                            visible:true,
                                            message:'保存成功，是否生成【更正凭证】？',
                                            type:'gengZ'
                                        }
                                    
                                        // if(confirm('保存成功，是否生成【更正凭证】？')){
                                        //     vm.voucherDataList.bool=true; 
                                        //     vm.voucherDataList.data.Mst=oldData
                                        //     vm.voucherDataList.data.Mst.PhId=oldData.PhidTransaction;
                                        //     vm.voucherDataList.data.Mst.PSource='更正';
                                        //     for(var dtl of  vm.voucherDataList.data.Mst.Dtls ){
                                        //         if(dtl.SubjectCode){
                                        //             dtl.Abstract=dtl.Abstract.replace("注销",'更正错账');
                                        //             dtl.JSum=dtl.JSum?dtl.JSum*-1:'';
                                        //             dtl.DSum=dtl.DSum?dtl.DSum*-1:'';
                                        //             if(dtl.DtlAccounts){
                                        //                 dtl.DtlAccounts[0].JSum=dtl.DtlAccounts[0].JSum?dtl.DtlAccounts[0].JSum*-1:'';
                                        //                 dtl.DtlAccounts[0].DSum=dtl.DtlAccounts[0].DSum?dtl.DtlAccounts[0].DSum*-1:'';
                                        //             }   
                                        //         }                                            
                                        //     }
                                        //     vm.voucherMask='gengz'; 
                                        // }else{
                                        //     vm.voucherMask=false;
                                        //     vm.getvoucherList();     
                                        // }
                                    } else {
                                         this.saasMessage={
                                            visible:true,
                                            delay:3000,
                                            message:res.Msg
                                        };
                                    }
                                   
                                },err => {
                                    console.log(err);
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
                         
                        //this.voucherDataList.bool=false; 
                        //this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}};    
                    }    
                }else{
                    this.voucherMask=false;
                }                   
            },
            //剪切*****************
            cut(vm,data1){
                var url='Add';
                var Vdata=vm.voucherDataList.data; 
               if(Vdata.Mst.Dtls.length<=0){
                   vm.$message('请输入内容!')
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
                   vm.$message('请输入凭证会计期!')
                   return;
               }
               vm.clearPhId(Vdata.Mst)
               if((Vdata.Mst.Uyear>=this.checkedYear)&&(Vdata.Mst.PMonth>=this.checkedTime)){
                   var data = {
                       uid: vm.uid,
                       orgid: vm.orgid,
                       orgcode: vm.orgcode,
                       infoData: vm.voucherDataList.data
                   }
                   const loading=this.$loading();
                   vm.$axios.post('/PVoucherMst/Post' + url, data)
                       .then(res => {
                           loading.close();      
                           if (res.Status == 'success') {
                                vm.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                               
                               vm.delete(data1);
                           } else {
                               vm.$message('保存失败,请重试!')
                           }
                       },err => {
                        console.log(err);
                           loading.close();
                        })
                       
                       .catch(err =>{console.log(err);loading.close()} )
               }else{
                   vm.$message('当前月份已结账,无法修改凭证!')
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
                    sort:['PNo ASC','PType','PDate ASC'],
                   // itemValuePhid:649181122000008,
                    itemValuePhid:this.superSearchVal.assistItem.PhId,
                    queryfilter:{"PAccper*str*ge*1":this.superSearchVal.date1.replace('-',''),"PAccper*str*le*1":this.superSearchVal.date2.replace('-','')}
                }
                if(str=='highSearch'){
                    data.export2excel='';
                    if(typeof(this.timeValue[0])=='object'){
                        var month;
                        var date;
                        for(var t in this.timeValue){
                            month=this.timeValue[t].getMonth()+1;
                            date=this.timeValue[t].getDate();
                            this.timeValue[t]=this.timeValue[t].getFullYear()+'-'+(month<10?('0'+month):month)+'-'+(date<10?('0'+date):date);

                        }
                    }
                    console.log(this.timeValue)
                    this.superSearchVal.PDate1=this.timeValue[0].slice(0,10);
                    this.superSearchVal.PDate2=this.timeValue[1].slice(0,10);
                    data.queryfilter={
                        "PDate*date*ge*1":this.superSearchVal.PDate1,
                        "PDate*date*le*1":this.superSearchVal.PDate2,
                    }
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
                                delay:4000,
                                visible:true
                            };
                            return;
                        }  
                        if(str=='yes'){
                            window.location.href = base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;
                            return;
                        } 
                        if(res.Record.length<=0){
                            this.voucherList=[];
                            this.$message('无法找到该凭证!')
                        } else{
                            this.voucherList= res.Record;
                            
                        }
                        this.listInit(this.voucherList);
                        this.listAll=false;
                        this.chooseItem=[];

                    },err => {
                        console.log(err);
                        
                    })
                    .catch(err=>{this.$message({ showClose: true,message: '获取列表失败了!', type: "error"});})
            },
            //初始化列表选中样式*********
            listInit(item){
                for(var it of item){
                    it.checked=false;
                }
            },
            //获取time组件传参********************
            getSideDate(data){
                this.checkedTime=data.checkedTime;
                this.checkedYear=data.checkedYear;
                this.sideDate=data.sideDate;
                this.year=this.sideDate.split('-')[0];
                this.month=this.sideDate.split('-')[1];
                this.superSearchVal.date2=this.superSearchVal.date1=this.superSearchVal.PDate2=this.superSearchVal.PDate1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                this.timeValue=[this.superSearchVal.PDate2+'-01',this.superSearchVal.PDate1+'-01'];
                console.log(this.timeValue)
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
                        },err => {
                        console.log(err);
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
                         loading.close();
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            return
                        }
                        this.assistItemList.kemu=res.list;
                        this.superSearchVal.show=true;
                       
                    },err => {
                        console.log(err);
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
                    },err => {
                        console.log(err);
                        loading.close();
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
            //导入凭证***********************
            testFile(){
               // this.$message('功能开发中!!')
                this.fileVisible=true;
            },
            
            removefile(item,deleValue) {//移除文件的函数
               this.filelist=item;
                if(item.length<1){
                    return;
                }
                console.log(item,deleValue,this.filelist);
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
                },err => {
                    console.log(err);
                    
                }).catch(error => {
                    this.$message({ showClose: true, message: '附件删除错误', type: 'error'});
                });
        },
            uploadfile(item) {
                //this.imglist.push(item);
                //console.log(this.filelist,item);
                this.filelist=item;
                if(item){
                    this.ExcelValidMsg(item);    
                }
                console.log(item,this.filelist)
            },
            //校验excel文件中凭证信息***********
            ExcelValidMsg(param){
                var data={
                    fileName:param[0].BUrlPath,
                    orgid:this.orgid,
                    orgcode:this.orgcode,
                    uyear:this.year,
                    makePerson:this.uname,
                    dealwithPNo:0 //重复凭证字号处理方式: 0 禁止, 1 跳过, 2 覆盖
                }
                const loading=this.$loading();
                this.$axios.get('/PVoucherMst/GetImportVoucherListFromExcelValidMsg',{params:data})
                .then(res=>{
                    loading.close();
                    if(res.Status=='error'){
                        this.$message({ showClose: true, message: res.Msg, type: 'error'});
                        this.fileErrMsg={
                            ErrMsg:res.Data.ErrMsg,
                            IngoreMsg:res.Data.IngoreMsg
                        }
                    }else{
                        this.GetImportVoucherListFromExcel(data);
                    }
                },err => {
                        console.log(err);
                       loading.close(); 
                 })
                .catch(err=>{
                    loading.close();
                    this.$message({ showClose: true, message: err, type: 'error'});
                })
            },
            //忽略 或者 覆盖选项****************
            fileErrHandle(str){
                if(this.fileErrMsg.ErrMsg.length>0){
                    this.saasMessage={
                        message:'请先处理不可跳过的错误,并重新提交!',
                        delay:4000,
                        visible:true
                    }
                    return;
                }
                console.log(this.filelist)
                var data={
                    fileName:this.filelist[0].BUrlPath,
                    orgid:this.orgid,
                    orgcode:this.orgcode,
                    makePerson:this.uname,
                    uyear:this.year,
                    dealwithPNo:0 //重复凭证字号处理方式: 0 禁止, 1 跳过, 2 覆盖
                }
                if(str=='cover'){
                    data.dealwithPNo=2;
                }else{
                    data.dealwithPNo=1;
                }
                this.GetImportVoucherListFromExcel(data);
            },
            //excel文件导入**************
            GetImportVoucherListFromExcel(data){
                const loading=this.$loading();
                this.$axios.get('PVoucherMst/GetImportVoucherListFromExcel',{params:data})
                    .then(res=>{
                        loading.close();
                        if(res.Status=='success'){
                            this.saasMessage={
                                message:res.Msg,
                                delay:4000,
                                visible:true
                            }
                            this.fileErrMsg={
                                IngoreMsg:[],
                                ErrMsg:[]     
                            }
                            this.fileSuccessMsg=res.Msg; 
                                                         
                        }else{
                            this.saasMessage={
                                message:res.Msg,
                                delay:4000,
                                visible:true
                            }
                        }
                    },err => {
                        console.log(err);
                        loading.close();
                    })
                    .catch(err=>{
                        loading.close();
                        this.$message({ showClose: true, message: err, type: 'error'});
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
                     this.superSearchVal.assistItem=''
                    this.getData(val);
                }
                
            },
            listAll(bool){
                //this.listCancle=!bool;
                for(var vou of this.voucherList){
                        vou.checked=bool;
                }
                this.chooseItem=bool?this.voucherList:[];
                this.$forceUpdate();
            },
            // listCancle(bool){
            //     this.listAll=!bool;
            //     for(var vou of this.voucherList){
            //             vou.checked=!bool;
            //     }
            //     this.chooseItem=[];
            // }
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
            subList
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
            width:400px !important;
            background: #fff;
            z-index: 9;
            top:40px;
            right:20px;                                                                                                                                                                                                                                                                                                                                                                                              
            border:1px solid #ccc;
            box-shadow: 0 1px 8px #b3acac;
            border-radius: 7px 7px 0 0;     
            >div{
                width:100%;
                &:first-of-type{
                    height:33px;
                    background:#00b7ee;
                    border-radius: 7px 7px 0 0;         
                    color:#fff;
                    padding:0 10px;
                }
                &:last-of-type{
                    border-top:1px solid #ccc;         
                    height:40px;
                    width:100%;
                    padding:0 10px;
                    >div{
                        width:160px;
                        height:100%;
                        margin:0 auto;
                        >div{
                            float:left;
                            width:70px;
                            margin-top:5px;
                            
                            &:last-of-type{
                                margin-left:20px;
                            }
                            
                        }
                    }
                    
                }
                i.cancle{
                    float:right;
                    margin-top: 4px;
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
                   
                    margin-bottom: 5px;
                    &:first-of-type{
                        >div:nth-of-type(2){
                            height:100%;
                            position:relative;
                            background:#fff;
                           
                            >div{
                                border:1px solid #dcdfe6;
                                position:relative;
                                width:100%;
                                height:100%;
                                >span{
                                    padding-left:10px;
                                }
                                 >div{
                                    top:100%;
                                }
                            }
                        }
                    }
                    >div{
                        float:left;
                        padding:0 5px;
                    }
                    >div:first-of-type{
                        
                        text-align: right;
                        width:20%;
                    }
                    >div:last-of-type{
                        >div{
                            float:left;
                        }
                        width:78%;
                        .el-date-editor.el-input{
                            width:90px;
                        }
                    }
                    &:nth-of-type(2){
                        .selectContainer {
                            float:left;
                            width:120px;
                            height:100%;
                            margin-right:5px;
                        }
                        

                    }
                   
                    &:nth-of-type(3)>div:last-of-type{
                        >div{
                            width:45%;
                            >div{
                                width:100%;
                            }
                        }
                        >span{
                            float:left;
                            width:10%;
                            text-align: center;
                        }
                    }
                    &:nth-of-type(4)>div:last-of-type{
                        width:78%;
                        >div{
                            width:100%;
                            height:32px;
                            padding-top:0;
                            padding-bottom:0;
                            margin:0;
                            
                        }
                        
                    }
                }
            }
        }
    }
    .searcherCon .highGradeCss > ul li > div:last-of-type .el-date-editor.el-input{
        width:100%;
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
        padding:8px 60px 0 18px;
        margin-right:10px;
        font-size:14px;
        position:relative;
        min-width: 920px;
        height:93%;
        .voucherNav>ul{
            margin-bottom: 10px;
            position:relative;
            padding-right:16px;
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
               
                &.btn{
                    color:#fff;
                    &:hover{
                        color:#00b7ee;
                    }
                }
                border-radius: 3px;
                height:30px;
                line-height: 30px;
                margin-left:10px;
                cursor:pointer;
                width:60px;

                text-align: center;
                
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
            height:30px;
            position: relative;
            padding-right:16px;
            >div{
                float:left;
                
                min-width: 280px; 
                line-height: 30px;           
                >span,>div{
                    float:left;
                    margin-left:5px;
                }
                >div{
                    width: 70px;
                }
            }
            >div:nth-of-type(2){
                float:left;
                width: 180px;
                min-width: 180px;
                text-align: center;
                >label:nth-of-type(2){
                    margin-left:20px;
                }
            }
            >div:last-of-type{
                float:right;
           
                min-width:295px;
            }
            >div.searcherCon{
          
              
                >div{
                    float:right;
                    width:auto;
                    margin:0;
                    &:first-of-type{
                        
                        margin-left: 10px;
                        cursor:pointer;
                        background: #6aca25;
                        height:30px;
                        line-height: 30px;
                        width:60px;
                        color:#fff;
                        text-align: center;
                    }
                    &:nth-of-type(2){
                        width:40px;
                    }
                    // &:nth-of-type(3){
                    //     //min-width: 300px;
                    // }
                }
            }
        }
        
    }
    .codeResetContainer{
        background: rgba(0,0,0,0.5);
        position: fixed;
        z-index: 999;
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
                       
                        padding:0 15px;
                        >span{
                            height:40px;
                            line-height: 40px;
                        }
                    }
                }
                .year-month{
                    >li{
                        float:left;
                    }
                }
                >ul{
                   
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
                            background:#00b7ee ;
                            color:#fff;
                        }
                        &.active{
                            background:#00b7ee ;
                            color:#fff;
                        }
                    }
                }
                >p{
                   
                    font-size: 15px;
                    >span{
                        width:80px;
                        height:30px;
                        line-height: 30px;
                        text-align: center;
                        margin-left: 40px;
                        color:#00b7ee;
                        border:1px solid #00b7ee;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #00b7ee;
                        }
                    }
                }
                .allActive>li{
                    background:#00b7ee ;
                    color:#fff;
                }
            }
        }

    }
    .voucherMask{
        position: fixed;
        z-index:99;
        width:100%;
        height:100%;
        top:0;
        left:0;
        background: rgba(0,0,0,0.5);
        .voucherContainer{
          background: #fff;
          width:80%;
          position:absolute;
          top:100px;
          left:10%;
          padding:10px;
          >div:first-of-type{
              
              padding:5px 10px;
              >span{
                  float:right;
                  margin-left: 20px;
              }
          }  
        }
    }
    .title{
        border-bottom: 1px solid #ccc;
        padding:8px 3px;
        width:100%;
        font-family: Arial;
        font-size: 14.0pt;
        font-style: normal;
        font-weight: 700;
        i{
            float:right;
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
        height:90%;    
        margin-top:10px;
        position:relative;
        padding-top:40px;
        padding-bottom: 20px;
        .listOver{
            height:100%;
            overflow-y: scroll;
        }
    }
    .listContainer>ul.listTitle{
        >li{
            border-right:1px solid #fff;
            &:last-of-type{
                border-right:1px solid #d3e9f9;
            }
        }
    }
    .listContainer ul.listTitle{
        height:40px;
        width:95%;
        background: #d3e9f9 ;
        color:#333;
        position:absolute;
        top:0;
        left:0;
        overflow-y: scroll;
        margin-left:5%;
    }
    .listContainer ul.listTitle li{
        float:left;
        text-align: center;
        height:40px;
        line-height: 40px;
    }
    .listContainer ul.listTitle li:first-of-type{
        width:32%;
    }
    .listContainer ul.listTitle li:nth-of-type(2){
        width:28%;
    }
    .listContainer ul.listTitle li:nth-of-type(3){
        width:20%;
    }
    .listContainer ul.listTitle li:nth-of-type(4){
        width:20%;
    
    }
    // .listContainer ul.listTitle li:nth-of-type(5){
    //     width:20%;
    // }
    ul.listContent{
        border:1px solid #bbb;
        margin-bottom: 20px;
        width:100%;
        background: #fff;
    }    
    ul.listContent.choosed>li>ul.listIndex{
        background: #d3e9f9;
        color:#333;
    
    }
    
    ul.listContent>li {
        width:100%;
        height:100%;
        
        overflow: hidden;
 
        position: relative;
    }
        ul.listContent>li> ul.listIndex{
        margin:0;
        border:1px solid #ccc;
        border-top:0;
        height:100%;
        width:5%;
        font-size: 18px;
        top:0;
        left:0;
        position:absolute;
            
    }
    ul.listContent>li> ul.listIndex>li:first-of-type{
            border:0;
            width:100%;
            height:100%;
            position:relative;
            >span{
                position:absolute;
                left:43%;
                top:40%;
            }
        }
    ul.listContent>li> ul {
        height:100%;
        width: 95%;
        margin-left:5%;
        
    }
    ul.listContent>li> ul>li{
       
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
        float:left;
        height:100%;
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
        float:left;
        width:56%;
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
    .printCon{
        position: fixed;
        width:100%;
        height:100%;
        overflow-y: auto;
        overflow-x: auto;
        left:0;
        top:0;
        z-index:99;
        background:rgba(0,0,0,0.5);
        >.container{
            width:920px;
            padding:0;
            margin:8% auto;
            >.sys-page{
               padding:0;     
            }
        }
        >span{
            position:absolute;
            border:1px solid #fff;
            background-size:cover;
            left:55%;
            margin-top:3%;        
            cursor:pointer;
            &:first-of-type{
                left:45%;
            }
        }
        >div{
            background: #fff;
            width:90%;
            margin-left:5%;
            margin-top:5%;
        }
    }

    .fileCon{
        float:left;
        width:50%;
        height:120px;
        overflow-y: auto;
        border:1px dotted #ccc;
        padding:10px;
        >.fileIngoreMsg{
            color:rgb(45, 142, 221)
        }
        >.fileErrMsg{
            color:rgb(255, 0, 0)
        }
    }
    .fileBtn{
        float:left;
        margin-left:5px;
        >div{
            width:70px;
            margin-bottom:20px;
        }
    }
   .fileSuccessMsg{
       color:#6aca25;
   }
   .sys-page{
       overflow-y: auto;
   }
    .printDataCss,.sys-page{
        
        .manageContent{
            &:nth-of-type(2n+1){
                border:0;
                padding:0 ;
                margin: 0 0 30px 0;       
            }
            &:nth-of-type(2n):before{
                display: inline-block;
                content:"";
            }
            overflow: hidden;
            //height:861px;  
            height:500px;        
            font-size:17px;
           // padding: 50px;
            border-top:1px solid #aaa;
            .title{
                border-bottom:0;
                font-size: 25px;
                text-align: center;
                padding-bottom: 20px;
                font-weight: 600;
            }
            .title div{
                font-size: 17px;
                text-align: right;
                font-weight: 100;
                position: relative;
                right: 10px;
                top: -20px;
            }
            .formData{
                margin-bottom: 5px;
                >ul:last-of-type{
                    >li:first-of-type{
                        width:60%;
                    }
                    >li:nth-of-type(2){
                        width:20%;
                    }
                    >li:nth-of-type(3){
                        width:20%;
                    }
                }
            }
            .formData>ul>li{
                border-right:1px solid #aaa;;
                height:59px;
                line-height:59px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .formData>ul:first-child{
                font-size: 17px;
            }
            .formData>ul:first-child>li:last-of-type{
                border-right:1px solid #aaa;
            }
            .formData>ul>li:nth-of-type(1){
                width:30%;
                padding:0 2px;
            }
            .formData>ul>li:nth-of-type(2){
                width:30%;
                padding:0 2px;
            }
            .formData>ul>li:nth-of-type(3),
            .formData>ul>li:nth-of-type(4){
                width:20%;
                padding:0 2px;
            }

            .formDataItems{
                border-bottom:1px solid #aaa;
                background: white;
            }
            .formDataItemsA{
                border-bottom:0;
            }
            .formDataItemsB>li{
                border-bottom:0;
                text-align: left;
            }
            .formData>ul.formDataItems>li{
                border-right:1px solid #aaa;
                border-left:0;
                border-bottom:0;
                text-align: center;
                line-height: 39px;
                height:39px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .bolder{
                font-weight: bold;
            }

            .formData>ul.formDataItems>li:first-child{
                border-left:1px solid #aaa;
            }
            .formData>ul.formDataItems>li{
                text-align: left;
                padding:0 15px;
            }
            .formData>ul.formDataItems>li.align-center{
                text-align: center;
                padding:0;
                text-indent: 40px;
            }
            .formData>ul.formDataItems>li.align-right{
                text-align: right;
            }
            .formData>ul.bottomForm>li{
                border:none;
                text-align: right;
                height:100px;
                line-height:100px;
            }
            .formData>ul.bottomForm>li:last-child{
                border-right:1px solid #aaa;
            }
        }

    }  
     .hideScroll{
        position: absolute;
        top:0;
        right:0;
        width: 16px;
        height:100%;  
        background: #fff;      
    } 
    
</style>
<style>
    .highGradeCss .el-input--prefix .el-input__inner {
        padding-left: 24px;
        font-size:12px;
        line-height:30px;
    }
     .fileDialog .el-dialog__header{
            background: #d3e9f9;
    }
    /* .voucherList   .el-dialog{
            z-index:2008;
        }
     */
</style>

