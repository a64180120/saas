<template>
<!--17-->
    <div class="addVoucher">
        <div class="unionState flexPublic">
            <div class="searcherCon">
                <div class="searcherValue" style="width:200px"><input @keyup.13.stop="getvoucherList('searcher')" type="text" v-model="superSearchVal.keyword" placeholder="科目/摘要/凭证号"></div>
                <div @click.stop="getvoucherList('searcher')"  class="searcherBtn btn">凭证定位</div>
                <ul class="fastGps">
                    <li class="btn" @click.stop="getvoucher('pre')"></li>
                    <li class="btn" @click.stop="getvoucher('next')"></li>
                    <li class="btn"  @click.prevent.stop="addVoucher('moreVoucher')">更多凭证</li>
                    <li class="btn" @click.stop="nextMonthShow" v-if="!voucherDataList.data.Mst.PhId">做下月账</li>
                </ul>
            </div>
            <ul class="handle">
                <li @click.stop="addVoucher('fresh')" style='float:right;margin:0 0 0 10px;cursor:pointer;font-size:27px;width:30px !important;background:none;color:#00b7ee;border:0' class="el-icon-refresh" ></li>
                <a style="position:relative;display:block;width:80px;height:30px;margin-left:10px">
                    <li class="more" style="width:80px">
                        <ul >
                            <li>更多</li>
                            <li v-if="voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('copy')">复制</li>
                            <li v-if="voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('cut')">剪切</li>
                            <li v-if="voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('chongh')">冲红</li>
                            <li @click.prevent.stop="addVoucher('reset')">凭证号重排</li>
                        </ul>
                    </li>
                </a>
                <!-- <a @click.prevent="addVoucher('print')"><li style="width:80px">保存并打印</li></a>  -->
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('delete')"><li >删除</li></a> 
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('unAudit')"><li >反审核</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('audit')"><li >审核</li></a>
                <a v-if="!voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('keepAdd')"><li style="width:80px">保存并新增</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('update')"><li >修改</li></a>
                <a v-if="!voucherDataList.data.Mst.PhId" @click.prevent.stop="addVoucher('keep')" ><li >保存</li></a>
                <a>
                    <li class="mode" style="width:60px;">
                        <div >模板</div>
                        <div @click.prevent.stop="addVoucher('modelList')" >普通类</div>
                        <div @click.prevent.stop="addVoucher('jieModel')" >结转类</div>
                        <div @click.prevent.stop="addVoucher('keepModel')">存为模板</div>
                    </li>
                </a> 
                <a @click.prevent.stop="addVoucher('fresh')"><li style="padding:0 5px;width:60px">新增</li></a>                  
            </ul>
        </div>
        <!--凭证组件*******************-->
        <div style="overflow-y:auto;width:100%;position:relative;z-index:9" :class="{voucherMask:voucherMask}" ref="print">
            <div  class="voucherContainer">
                <p v-if="voucherMask" class="title">
                    <span v-if="voucherMask=='copy'">复制凭证</span>
                    <span v-if="voucherMask=='cut'">剪切凭证</span>
                    <span v-if="voucherMask=='chongh'">冲红凭证</span>
                    <span v-if="voucherMask=='gengz'">更正凭证</span>
                    <span v-if="voucherMask=='update'">修改凭证</span>
                    <i @click="keepChoose(false)"></i>
                </p>
                <div style="height:40px;" v-if="voucherMask">
                    <span style="float:right" class="btn" @click.stop="keepChoose(voucherMask)">保存</span>
                    <span style="float:right" class="btn" @click.stop="keepChoose(false)">取消</span>
                </div>

                <div class="voucherDisabledCon">
                    <div :class="{voucherDisabled:voucherAdd}"></div>
                    <voucher :disabled="voucherAdd" :sideDate='sideDate' :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
                </div>
                 <div v-show="(!voucherMask)&&voucherDataList.bool" class="voucherBG"><img src="../../assets/images/d.png">  </div>            
            </div>
           
        </div>
        <!--右侧时间选择组件-->
        <div class="asideNav">
            <div @click.stop="yearSelShow"><span>会计期</span></div>
            <p>{{sideDate.split('-')[0]}}</p>
            <div style="overflow:hidden;height:87%">
                <div class="monthsContainer">
                    <ul style="top:0" @mouseleave.stop="dragLeave" @mousemove.stop="dragMove" @mouseup.stop="dragDown(false,$event)" @mousedown.prevent.stop="dragDown(true,$event)"   id="scrollMonth" class="months">
                        <li v-for="item of nowYear-startYear+1"  :key="item">
                            <ul>
                                <li>{{nowYear-item+1}}</li>
                                <li :class="{active:sideDate.split('-')[1]==i&&nowYear-item+1==sideDate.split('-')[0],unchecked:(i>checkedTime)&&(nowYear-item+1>=checkedYear),futureM:(nowYear-item+1>=nowYear)&&(i>(nowTime.getMonth()+1))}" @click="sideMonth(i,nowYear-item+1)" v-for="i of 12" :key="i">{{i}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <!--会计期弹窗*************************************-->
            <div v-show="yearSelCss" class="yearsContainer">
                <div class="yearsTitle">
                    <span @click="checkOutSel('kuaiji')" :class="{active:monthsSelCss=='kuaiji'}">会计期</span>
                    <span @click="checkOutSel('jiezhang')" :class="{active:monthsSelCss=='jiezhang'}">结账</span>
                    <span @click="checkOutSel('fanjiezhang')" :class="{active:monthsSelCss=='fanjiezhang'}">反结账</span>
                    
                </div>
                <div v-show="monthsSelCss=='kuaiji'" class="yearsContent">
                    <div class="flexPublic">
                        <div>{{year}}</div>
                        <div class="flexPublic">
                            <img @click="nextYear(false)" src="../../assets/icon/leftArr.svg" alt="">
                            <img @click="nextYear(true)" src="../../assets/icon/leftArr.svg" alt="">
                        </div>
                        <div style="clear:both"></div>
                    </div>
                    <ul @click="yearMonthClick"  class="year-month">
                        <li :class="{active:month==index}" v-for="index of 12" :key="index">{{index}}月</li>
                    </ul>
                </div>
                <div v-show="monthsSelCss=='jiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>结账至</span>
                        <i @click="nextMonth('pre',checkVal,'checkVal')"></i>
                        <div class="inputContainer"><input v-model="checkVal" type="text"></div>
                        <i @click="nextMonth('next',checkVal,'checkVal')"></i>
                        <span>月</span>
                        
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="nextMonthCss=true">确认</span>
                    </p>
                </div>
                <div v-show="monthsSelCss=='fanjiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>反结账至</span>
                        <i @click="nextMonth('pre',unCheckVal,'unCheckVal')"></i>
                        <div class="inputContainer"><input  v-model="unCheckVal" type="text"></div>
                        <i @click="nextMonth('next',unCheckVal,'unCheckVal')"></i>
                        <span>月</span>
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('uncheck',unCheckVal)">确认</span>
                    </p>
                </div>

            </div>
        </div>
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
        <!-- 凭证模板****************** -->
        <voucher-temp v-if="modelListCss" :temptype="temptype" @temp-click="tempClick"></voucher-temp>
        <!-- 下月账******************* -->
        <next-month :checkVal="checkVal" v-if="nextMonthCss" @child-click="nextMonthHandle"></next-month>
        <!-- <div class="footInfo " >
            <router-link to="">服务协议</router-link>
            <router-link to="">运营规范</router-link>
            <router-link to="">关于政云</router-link>
        </div> -->
        <!-- 存为模板******************** -->
        <div v-if="temp.tempMask" class="tempMask">
            <div>
                 <p  class="title">
                    <span>存为模板</span><i @click="tempMaskShow(false)"></i></p>
                <ul>
                    <li class="flexPublic">
                        <div>模板名称</div><div class="inputContainer"><input placeholder="必填" type="text" v-model="temp.TemName"></div>
                    </li>
                    <li class="flexPublic">
                        <div>保存金额</div>
                        <div><label > <input type="radio" name="tempM" v-model="temp.TemMoney" value='1'> 是 </label><label > <input type="radio" name="tempM" v-model="temp.TemMoney" value='0'> 否</label></div>
                    </li>
                </ul>
                <div class="flexPublic">
                    <span class="btn" @click="tempMaskShow(false)">取消</span><span class="btn" @click="tempMaskShow(true)">保存</span>    
                </div> 
            </div>
        </div>
        
        <!-- 弹窗*****message:信息******delay:延迟毫秒  默认4000 -->
        <message 
            :message="saasMessage.message" 
            :delay="saasMessage.delay"   
            :visible.sync="saasMessage.visible" >
        </message>
        <saasconfirm 
            :type="confirm.type"
            :message="confirm.message"
            v-show="confirm.visible" 
            @ok-click="confirmOk"
            @no-click="confirmNo">
        </saasconfirm>

        
    </div>
</template>

<script>
    import userInfo from '@/util/auth'
    import nextMonth from './nextMonthCheck'
    import voucher from './voucher'
    import {mapState, mapActions} from 'vuex'
    import voucherTemp from './vouchertemp'
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs';
    export default {
        name:'voucherAdd',
        data(){return {
            val1:'',
            sideDate:'',
            year:'',
            month:'',
            searchVal:'',
            temp:{ 
                TemName:'',
                TemMoney:0,
                tempMask:false
            },
            temptype:'',//模板类型
            superSearchVal:{//高级搜索参数******************
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
            userState:0,
            checkVal:'',
            unCheckVal:'',
            checkedTime:'',//下一个结账月*******
            checkedYear:'',//已经结账的年份
            startYear:'',//建账日期
            pagesize:100,
            pageindex:0,
            ascOrDesc:'ASC',
            totalRows:'',
            voucherDataList:{bool:false,data:{Mst:'',Attachements:[]}},//凭证数据***
            oldVoucherData:'',   //凭证传参时的中间值JSON
            newAddList:[],
            yearSelCss:false,
            nowTime:new Date,
            nowYear:(new Date).getFullYear(),
            monthsSelCss:'kuaiji',
            mouseDown:false,
            mouseStartY:'',
            count:0,
            modelListCss:false,
            nextMonthCss:false,
            allReset:'',
            resetShow:false,
            voucherMask:false,  //凭证状态遮罩层******************
            voucherAdd:false, //凭证不能修改的遮罩层******************       
            saasMessage:{
                visible:false,  //消息弹出框*******
                message:'', //消息主体内容**************
                delay:0
            },
            confirm:{
                message:'',
                visible:false,
                type:''
            },
            uInfo:''
        }},
        created(){ 
            if(this.$route.query.list){
                this.$store.commit("tagNav/upexcludeArr", []);
                this.voucherDataList.data.Mst=this.$route.query.list,
                this.resetVoucher();
                this.voucherAdd=true;
            }else if(this.$route.query.reset=='reset'){
                this.$store.commit("tagNav/upexcludeArr", []);
            }
            
        },
        mounted(){  
            this.getChecked();
            this.uInfo= userInfo.getUserInfoData().userInfo;
            this.startYear=userInfo.getUserInfoData().orgInfo.StartYear; 
            
            //this.moveNavTop();
        },
        methods:{
            //操作列表按钮********
            addVoucher(str){
                var Mst;
                switch(str){
                    case 'update':
                        this.voucherData();
                        var item =this.voucherDataList.data.Mst;
                        if(!(item.PMonth>=this.checkedTime&&item.Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        if(this.voucherDataList.data.Mst.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:'该凭证已审核,无法修改!'
                            }
                            return;
                        }
                        this.oldVoucherData=JSON.stringify(this.voucherDataList.data);
                        this.voucherMaskShow('update');
                        this.voucherAdd=false;
                        break;
                    case 'keep':
                        this.voucherData();
                        this.keepVoucher();
                        break;
                    case 'keepAdd':
                        this.voucherData();
                        this.keepVoucher('keepAdd');
                        this.resetVoucher();
                        break;
                    case 'modelList':
                        this.temptype='normal';
                        this.modelListCss=true;
                        break;
                    case 'jieModel':  //结转模板
                        this.temptype='jie';
                        this.modelListCss=true;
                        break;
                    case 'keepModel':
                        this.temp.tempMask=true;
                        this.temp.TemName='';      
                        break;
                    case 'moreVoucher':
                        //this.$store.commit("tagNav/turnCachePage",false);
                        this.$store.commit("tagNav/upexcludeArr", ['voucherList']);
                        this.$router.push({path:'/finance/voucherList',query:{reset:'reset'}})
                        
                        break;
                    case 'audit'://审核
                        this.voucherData();
                        var item =this.voucherDataList.data.Mst;
                        if(!(item.PMonth>=this.checkedTime&&item.Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        if(this.voucherDataList.data.Mst.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:'该凭证已审核!'
                            }
                            return;
                        }
                        this.audit(true,this.voucherDataList.data.Mst.PhId);
                        break;
                    case 'unAudit':
                        this.voucherData();
                        var item =this.voucherDataList.data.Mst;
                        if(!(item.PMonth>=this.checkedTime&&item.Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        if(!this.voucherDataList.data.Mst.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:'该凭证还未审核!'
                            }
                            return;
                        }
                        this.audit(false,this.voucherDataList.data.Mst.PhId);
                        break;
                    case 'copy'://复制
                        this.oldVoucherData=JSON.stringify(this.voucherDataList.data);
                        this.voucherMaskShow('copy');
                        this.voucherAdd=false;
                        break;
                    case 'cut':  //剪切
                        var item =this.voucherDataList.data.Mst;
                            if(!(item.PMonth>=this.checkedTime&&item.Uyear>=this.checkedYear)){
                                this.saasMessage={
                                    visible:true,
                                    delay:3000,
                                    message:'该月已结账,无法修改!'
                                }
                                return;
                            }
                        this.oldVoucherData=JSON.stringify(this.voucherDataList.data);
                        this.voucherMaskShow('cut');
                        break;
                    case 'chongh':   //冲红
                        var item =this.voucherDataList.data.Mst;
                        if(!(item.PMonth>=this.checkedTime&&item.Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                delay:3000,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        this.oldVoucherData=JSON.stringify(this.voucherDataList.data);
                        if(this.voucherDataList.data.Mst.WriteOff_PhIds.length>0){
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
                        this.voucherMaskShow('chongh');
                        this.voucherAdd=true;
                        this.chongh();
                        
                        break;
                    case 'delete' :  //删除
                        this.voucherData();
                        var item =this.voucherDataList.data.Mst;
                        if(!(item.PMonth>=this.checkedTime&&item.Uyear>=this.checkedYear)){
                            this.saasMessage={
                                visible:true,
                                message:'该月已结账,无法修改!'
                            }
                            return;
                        }
                        if(this.voucherDataList.data.Mst.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:'该凭证已审核,无法删除!'
                            }
                            return;
                        }
                        
                        if(this.voucherDataList.data.Mst.Dtls.length<=0){
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:'请输入内容!'
                            }
                            return;
                        }
                        this.confirm={
                            message:'此操作将永久删除凭证,是否继续?',
                            type:'delete',
                            visible:true
                        }
                        // if(confirm('确定删除记录!')){
                        //     var data1={
                        //         uid:this.uid,
                        //         orgid:this.orgid,
                        //         id:this.voucherDataList.data.Mst.PhId
                        //     }
                        //     this.delete(data1);
                        //     this.voucherDataList.data={
                        //         Mst:{},
                        //         Attachements:[]
                        //     }
                        //     this.resetVoucher();
                        //  }
                       
                        break;
                    case 'reset':
                        this.confirm={
                            message:'凭证号重排过程中不允许取消、暂停操作。确定重排？',
                            visible:true,
                            type:'reset'
                        }
                        break;
                    case 'print':
                        this.voucherData();
                        this.keepVoucher('print');
                        break;
                    case 'fresh':   //刷新
                        this.newAddList=[];
                         this.voucherDataList.data={
                            Mst:'',
                            Attachements:[]
                        }
                        this.superSearchVal.keyword='';
                        //this.resetVoucher();
                        //this.getChecked();
                        this.voucherAdd=false;
                        this.resetVoucher();               
                        break;
                }
            },
            //confirm确认框方法*******
            confirmOk(type){
                this.confirm.visible=false;
                switch (type){
                    case 'delete':
                        var data1={
                            uid:this.uid,
                            orgid:this.orgid,
                            id:this.voucherDataList.data.Mst.PhId
                        }
                        this.delete(data1);
                        break;
                    case 'reset':
                        this.resetShow=true;
                        break;
                    case 'gengz':
                        var vm = this;       
                        vm.voucherAdd=false;
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
                        
                        vm.voucherMask='gengz';
                         this.resetVoucher();
                        break;
                }
            },
            confirmNo(type){
                this.confirm.visible=false;
                switch(type){
                    case 'gengz':
                        this.getvoucherList();
                        break;
                }
               
            },
            // //导航栏位置上移************
            // moveNavTop(){
            //    var footer= document.getElementsByClassName("sys-footer")[0];
            //   var  navtitle= document.getElementsByClassName("navtitle")[0];
            //    console.log(footer,navtitle);
            //    footer.style.bottom="65px";
            //    navtitle.style.bottom="65px";
            // },
            //保存凭证*******************
            keepVoucher(str){
                
                var url='Add';
                var Vdata=this.voucherDataList.data;
                          
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
                    this.getvoucherList('update');
                    return;
                }
                if(str=='gengz'){
                    this.clearPhId(Vdata.Mst);
                    // Vdata.Mst.Dtls=Vdata.Mst.Dtls.splice(0,Vdata.Mst.Dtls.length/2);
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
                       Vdata.Mst.PDate=Vdata.Mst.PDate.substring(0,10);
                       Vdata.Mst.Uyear=Vdata.Mst.PDate.substring(0,4);
                       Vdata.Mst.PMonth=Vdata.Mst.PDate.substring(5,7);
                   }
               }else{
                   this.message={
                       message:'请输入凭证会计期!',
                       visible:true
                   }
                   return;
               }
               if((Vdata.Mst.Uyear>=this.checkedYear)&&(Vdata.Mst.PMonth>=this.checkedTime)){
                   var data = {
                       uid: this.uid,
                       orgid: this.orgid,
                       orgcode: this.orgcode,
                       infoData: this.voucherDataList.data
                   }
                   if (this.voucherDataList.data.Mst.PhId) {
                       url = 'Update';
                   }
                    this.voucherAdd=true;
                    const loading1=this.$loading();
                   this.$axios.post('/PVoucherMst/Post' + url, data)
                       .then(res => {
                            loading1.close();
                           if (res.Status == 'success') {
                               if(url=='Add'){
                                   this.ascOrDesc='DESC';
                                    this.getvoucherList(); 
                               }
                               
                               this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:res.Msg
                               };
                               
                               if(str=='keepAdd'){
                                   this.voucherDataList.data={
                                        Mst:{
                                        },
                                        Attachements:[]
                                    }
                                    this.voucherAdd=false;
                                    this.resetVoucher();
                                }
                               if(str=='print'){
                                   this.printContent();
                               }
                                  
                           } else {
                               this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:res.Msg
                               }
                           }
                           
                       },
                       err => {
                        console.log(err);
                            loading1.close();
                        } 
                       )
                       .catch(err =>{
                            loading1.close();
                            this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:'出错了!'
                               };
                       } )
               }else if(url=='update'){
                   this.$message('当前月份已结账,无法修改凭证!')
               }else{
                   this.$message('当前月份已结账,无法新增凭证!')
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
            //保存为模板弹窗确认******************
            tempMaskShow(bool){
                if(!bool){
                    this.temp.tempMask=false;
                }else{
                    if(!this.temp.TemName){
                        this.saasMessage={
                            message:'请输入模板名称!',
                            delay:4000,
                            visible:true
                        }
                    }else{
                        this.voucherData();
                        var data=JSON.parse(JSON.stringify(this.voucherDataList.data));
                        var dtls=data.Mst.Dtls;

                        if(this.temp.TemMoney==0){
                            for(var dtl of dtls){
                                dtl.JSum='';
                                dtl.DSum='';
                                if(dtl.DtlAccounts){
                                    dtl.DtlAccounts[0].JSum='';
                                    dtl.DtlAccounts[0].DSum='';
                                }
                            }
                        }            
                        this.keepModel(this.temp.TemName,data);
                        this.temp.tempMask=false;
                    }
                }
            },
            //保存模板**********************
            keepModel(name,data){
                if(data.Mst.PhId ){
                    this.clearPhId(data.Mst); 
                }
                if(data.Mst.Dtls.length<=0){
                    this.$message('请输入内容!')
                    return;
                }
                data.Mst.TemName=name;
                data.Mst.Userid=this.uid;
                data.Mst.UseCount=this.uInfo.Account;
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData:data
                }
                const loading=this.$loading();
                this.$axios.post('/PVoucherTemplateMst/PostAdd',data)
                    .then(res=>{
                        loading.close();
                        if(res.Status=='success'){
                            this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:res.Msg
                               };
                            // this.getvoucherList();
                        }else{
                            this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:res.Msg
                               };
                        }
                    },
                    err => {
                        console.log(err);
                           loading.close();
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading.close();})
            },
            //审核*****************
            audit(bool,PhId){
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
                        if(res.Status=='success'){
                            if(bool){
                                this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:'审核成功!'
                               };
                            }else{
                                 this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:'反审核成功!'
                               };
                            }
                            this.getVoucherData(PhId);
                        }else{
                           this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }
                        loading.close();
                    },err => {
                        console.log(err);
                            loading.close();
                    })
                    .catch(err=>{loading.close();this.$message({ showClose: true,message: err, type: "error"});})
            },
            //删除***********************
            delete(data){ 
                const loading=this.$loading();
                this.$axios.post('PVoucherMst/PostDelete',data)
                    .then(res=>{
                        loading.close();
                        if(res.Status=='success'){
                            this.ascOrDesc=='DESC';
                            this.getvoucherList();
                            if(this.voucherMask=='cut'){
                                this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:'剪切成功!'
                               }
                               this.voucherMask=false;
                               return;
                            }
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:res.Msg
                            };
                        }else{
                            this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }
                        
                    },err => {
                        console.log(err);
                        loading.close();
                    })
                    .catch(err=>{loading.close();this.$message({ showClose: true,message: err, type: "error"});})
            },
            voucherData(){//接收voucher组件传值************
                this.voucherDataList.data=this.$refs.voucher.voucherData();
                console.log('voucher组件传参',this.voucherDataList.data)
            },
            confirmData(data){
                
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
                
                if(Jcount.toFixed(2)==Dcount.toFixed(2)){
                    return true;
                }else{
                    return false;
                }
            },
             //获取最新一个凭证的时间放入引用的模板
            getFreshVouchsideDate(str,Mst){

                const loading1=this.$loading();
                if(!this.sideDate){
                    this.sideDate=this.nowTime.getFullYear()+'-'+this.nowTime.getMonth()
                }
               
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    sum1:'',
                    sum2:'',
                    keyword:'',
                    pagesize:1,
                    pageindex:0,
                    sort:['PDate DESC','PNo DESC'],
                   // itemValuePhid:649181122000008,
                    itemValuePhid:'',
                    queryfilter:{"PAccper*str*ge*1":this.sideDate.split('-')[1]>9?this.sideDate.replace("-",''):(this.sideDate.split('-')[0]+'0'+this.sideDate.split('-')[1]),
                                    "PAccper*str*le*1":this.sideDate.split('-')[1]>9?this.sideDate.replace("-",''):(this.sideDate.split('-')[0]+'0'+this.sideDate.split('-')[1])}
                }
             
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                      
                       loading1.close();
                        if(res.Record.length<=0){
                            Mst.PNo='';
                            Mst.PDate=this.sideDate; 
                            this.voucherDataList.data.Mst=Mst;
                            this.resetVoucher(); 
                            this.voucherAdd=false;
                                                
                        } else{                         
                            Mst.PNo='';
                            Mst.PDate=res.Record[0].PDate;
                            Mst.PMonth=res.Record[0].PMonth;
                            Mst.Uyear=res.Record[0].Uyear;
                            this.voucherDataList.data.Mst=Mst;
                            this.resetVoucher(); 
                            this.voucherAdd=false;
                        }   
                        console.log(Mst)
                        
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>{
                        this.$message({ showClose: true,message: '获取列表失败了!', type: "error"});loading1.close();
                    })
            },
            //接收temp组件传值***********************
            tempClick(data){
                if(data){ 
                    data.PersistentState=1;
                    for(var dtl of data.Dtls){
                        dtl.PersistentState=1;
                        if(dtl.DtlAccounts){
                            dtl.DtlAccounts[0].PersistentState=1;
                        }
                    }
                    this.getFreshVouchsideDate('temp',data);
                   
                    //data.PDate=new Date;
                    //data.PNo='';
                    // this.voucherDataList.data.Mst=data;
                    // this.resetVoucher(); 
                    // this.voucherAdd=false;
                }
                this.modelListCss=false;
            },
            //接收下月账传值******************
            nextMonthHandle(data){
                if(data===false){
                    this.nextMonthCss=false;
                    this.getChecked();
                }else{
                    console.log(data)
                }
            },
            //获取单个凭证**************
            getVoucherData(PhId){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    id:PhId
                }
                const loading2=this.$loading();
                this.$axios.get('/PVoucherMst/GetVoucher',{params:data})
                    .then(res=>{
                        if(res.Status=='success'){                            
                            this.voucherDataList.data.Mst=res.Data;
                            this.resetVoucher();
                        }else{
                            this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }  
                        loading2.close();                          
                    },err => {
                        console.log(err);
                           loading2.close();
                    })
                    .catch(err=>{
                        this.$message({ showClose: true,message: err, type: "error"});loading2.close();
                    })
            },
            //获取当前结账的最新月份************
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                const loading=this.$loading();
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{  
                            
                        loading.close();
                        if(!res.CheckRes){
                             this.saasMessage={
                                message:'当前组织未初始化!',
                                delay:4000,
                                visible:true
                            }
                            this.$router.push({path:'/setting/subjectstart'})
                            return;
                        }
                          
                        this.checkedTime=res.Record[0].JAccountPeriod+1;
                        this.checkedYear=res.Record[0].JYear;
                        this.sideDate=res.Record[0].JYear+'-'+this.checkedTime;
                        this.year=this.sideDate.split('-')[0];
                        this.month=this.sideDate.split('-')[1];
                        this.checkVal=this.checkedTime;
                        this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                        this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                        this.resetVoucher();         
                        this.$forceUpdate();         
                    },
                    err => {
                        console.log(err);
                           loading.close();
                    })
                    .catch(error=>{this.$message({ showClose: true,message: error, type: "error"});loading.close();})
            },
            //前后快速翻页定位凭证****************
            getvoucher(str){
                console.log(this.count)
                if(str=='pre'){
                    if(this.count>0){
                        this.count--;
                        this.voucherDataList.data={
                            Mst:this.newAddList[this.count]
                        };
                        this.resetVoucher();
                    }else{
                        if(this.pageindex>0){
                            this.pageindex--;
                            this.getvoucherList('pre');
                        }else{
                            this.$message("已到当前月份第一张!")
                        }
                    }
                }else if(str=='next'){
                    if(this.count<this.newAddList.length-1){
                        this.count++;
                        this.voucherDataList.data={
                            Mst:this.newAddList[this.count]
                        };
                        this.resetVoucher();
                    }else{
                        if(this.totalRows-this.pageindex*this.pagesize<=this.count+1){
                            this.$message("已到当前月份最后一张!")
                        }else{
                            this.pageindex++;
                            this.getvoucherList();
                        }
                    }
                }
            },       
            //凭证列表***************高级搜索***********************
            getvoucherList(val){
                var vm=this;
                var data={
                    uid:vm.uid,
                    orgid:vm.orgid,
                    sum1:vm.superSearchVal.sum1,
                    sum2:vm.superSearchVal.sum2,
                    keyword:vm.superSearchVal.keyword,
                    pagesize:vm.pagesize,
                    pageindex:vm.pageindex,
                    sort:['PNo ASC','PType','PDate ASC'],
                    itemValuePhid:vm.superSearchVal.assistItem.PhId,
                    queryfilter:{"PAccper*str*ge*1":vm.superSearchVal.date1.replace('-',''),"PAccper*str*le*1":vm.superSearchVal.date2.replace('-','')}
                }
                const loading1=this.$loading();
                vm.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        loading1.close();
                        
                         if(res.Status=='success'){        
                            vm.$message(res.Msg);
                            vm.voucherDataList.data={
                                         Mst:{},
                                         Attachements:[]
                             }
                             vm.resetVoucher();
                             return;
                        } else if(res.Status=='error'){
                            this.saasMessage={
                                visible:false,  //消息弹出框*******
                                message:'', //消息主体内容**************
                                delay:0
                            }
                        }
                        else{               
                            if(val=='searcher'&&res.Record.length>1){
                               vm.$store.commit("tagNav/upexcludeArr", ['voucherList']);
                                 vm.$router.push({path:'/finance/voucherList',query:{voucherList:res.Record}})   
                            }else if(res.Record.length==0){
                                vm.voucherDataList.data={
                                         Mst:{},
                                         Attachements:[]
                                }
                                vm.resetVoucher();
                                vm.$message('暂无新凭证!');                  
                                return;
                            }     
                            vm.newAddList=res.Record;
                            var  oldCount=vm.count;
                            vm.count=(val=='pre')?vm.newAddList.length-1:0;
                            if(vm.ascOrDesc=='DESC'){
                                vm.count=vm.newAddList.length-1;
                            }
                            if(val=='update'){
                                vm.count=oldCount;
                            }
                            vm.totalRows=res.totalRows;
                            vm.pagesize=res.size;
                            vm.pageindex=res.index;

                            vm.voucherDataList.data={
                                Mst:vm.newAddList[vm.count]
                            };
                             
                            vm.resetVoucher();                          
                        }
                    },
                    err => {
                        loading1.close();
                        console.log(err);
                       
                    })
                    .catch(err=>{loading1.close();vm.$message({ showClose: true,message: err, type: "error"});})
            },
            
            //选择会计期***************
            sideMonth(i,year){
                this.month=i;
                this.year=year;
                this.sideDate=year+'-'+i;
                this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                this.ascOrDesc='ASC';
                this.getvoucherList();
                this.voucherAdd=true;
            },
            //鼠标按下***************
            dragDown(bool,$event){
                if(bool){
                    this.mouseDown=true;
                    this.mouseStartY=$event.clientY;
                }else{
                    this.mouseDown=false;
                    this.mouseStartY='';
                }
            },
            //鼠标离开*********************
            dragLeave(){
                this.mouseDown=false;
                this.mouseStartY='';
            },
            //鼠标移动拖拽*********************
            dragMove($event){
                if(this.mouseDown){
                    var Y=$event.clientY-this.mouseStartY;  //鼠标移动距离
                    var month= document.getElementById('scrollMonth'); 
                    var H=window.getComputedStyle(month).height;  //元素高度
                    var top=parseInt(month.style.top);
                    if(top==0&&Y<0){           
                        return;
                    }else if(top>0){
                        month.style.top='0px';
                        return;
                    }else if(top<parseInt(H)*-1){
                        month.style.top=parseInt(H)*-1+'px';
                        return;
                    }
                    month.style.top=top-Y*2+'px';
                    this.mouseStartY=$event.clientY;
                }

            },
            //会计期[反]结账确认选择*****************************
            yearsTrue(str,val){
               if(str=='check'||str=='uncheck'){
                    this.checkOut(str,val);
               }else{
                    this.yearSelCss=false;
               }
            },
            //结账功能 //反结账功能*****************************************
            checkOut(str,val){
                var t;
                var url;
                if(str=='check'){
                    url='/PBusinessConfig/UpdateBusinessConfig';
                }else if(str=='uncheck'){
                    if(this.unCheckVal>this.checkedTime-1){
                        this.$message('当前月份还未结账,无法反结账!');
                        return;
                    }
                    url='/PBusinessConfig/GetUnUpdateBusinessConfig';
                }
                t=this.nowTime.getFullYear()+'-'+val
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    dateTime:t
                }
                const loading1=this.$loading();
                this.$axios.get(url,{params:data})
                    .then(res=>{
                        loading1.close();
                        if(res.Status=='success'){
                            this.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:str=='check'?'结账成功!':'反结账成功!'
                               };
                            this.getChecked();
                        }else{
                            this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }
                    },
                    err => {
                        console.log(err);
                           loading1.close();
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading1.close();})
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
            //结账月份加减********************
            nextMonth(str,val,name){
                if(str=='pre'&&val>1){
                    val--;
                }else if(str=='next'&&val<12){
                    val++;
                }
                this[name]=val;
            },
            //会计期弹窗年月份选择*****************
            yearMonthClick($event){
                this.month=parseInt($event.target.innerHTML)
                this.sideDate=this.year+'-'+this.month;
                this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                this.ascOrDesc='ASC';
                this.getvoucherList();
                this.voucherAdd=true;
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
                            
                            if(res.Status=='error'){
                                this.$message(res.Msg);
                            }else if(res.Status=='success'){
                                this.$message('重排成功!');
                                this.resetShow=false;
                            }
                            loading5.close();
                        },
                        err => {
                            console.log(err);
                                loading5.close();
                         })
                        .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading5.close();})
                }else{
                    this.resetShow=false;
                }
            },
            //会计期内容切换************************************
            checkOutSel(val){
                this.monthsSelCss=val;
            },
            //会计期窗口弹出**************************
            yearSelShow(){
                this.checkVal=this.checkedTime;
                this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                this.yearSelCss=!this.yearSelCss;
            },
            //做下月账****************
            nextMonthShow(){
                this.nextMonthCss=true;
            },
            //冲红***********************
            chongh(){
                var vm=this;
                this.voucherData();  
                var Mst=this.voucherDataList.data.Mst;
                if(Mst.WriteOff_PhIds.length>0){
                    this.saasMessage={
                        message:'该凭证已经冲红,无法冲红!',
                        delay:4000,
                        visible:true
                    }
                    this.voucherMaskShow(false);
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
                this.resetVoucher();        
                                    
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
                this.$print(this.$refs.print) // 使用
            },
            //复制剪切******************************
            voucherMaskShow(val){
                this.voucherMask=val;
            },
            keepChoose(val){
                var vm=this;
                console.log(val,this.voucherDataList.data);
                if(val){
                    this.voucherData();
                    var id = this.voucherDataList.data.Mst.PhId;
                    console.log(this.voucherDataList.data.Mst)
                    if(val=='cut'){
                        if(this.voucherDataList.data.Mst.Verify){
                            this.saasMessage={
                                visible:true,
                                delay:4000,
                                message:'该凭证已审核,无法剪切!'
                            }
                        }
                        var data1={
                            uid:this.uid,
                            orgid:this.orgid,
                            id:id
                        }
                
                        this.cut(vm,data1);
                    }else if(val=='chongh'){  //冲红
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

                             debugger
                            this.$axios.post('/PVoucherMst/PostAdd', data)
                                .then(res => {
                                    loading.close();
                                    console.log(this.voucherDataList.data)
                             debugger

                                    if (res.Status == 'success') {
                                        vm.voucherMask=false;
                                        vm.voucherAdd=true;
                                        this.confirm={
                                            visible:true,
                                            message:'保存成功，是否生成【更正凭证】？',
                                            type:'gengz'
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
                        if(val=='copy'){
                            this.clearPhId(this.voucherDataList.data.Mst);
                        }
                        this.keepVoucher(val);
                        this.voucherMask=false;
                        this.voucherAdd=true;   
                    } 
                }else{
                    this.voucherMask=false; 
                    this.voucherAdd=true;
                    this.voucherDataList.data=JSON.parse(this.oldVoucherData);
                    this.resetVoucher();
                }
                    
            },
            //剪切*****************
            cut(vm,data1){
                var url='Add';
                var Vdata=vm.voucherDataList.data; 
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
                   vm.$message('请输入凭证会计期!')
                   return;
               }
               vm.clearPhId(Vdata.Mst);
               if((Vdata.Mst.Uyear>=this.checkedYear)&&(Vdata.Mst.PMonth>=this.checkedTime)){
                   var data = {
                       uid: vm.uid,
                       orgid: vm.orgid,
                       orgcode: vm.orgcode,
                       infoData: vm.voucherDataList.data
                   }
                   if (vm.voucherDataList.data.Mst.PhId) {
                       url = 'Update';
                   }
                   const loading=vm.$loading();
                   vm.$axios.post('/PVoucherMst/Post' + url, data)
                       .then(res => {
                           loading.close();      
                           if (res.Status == 'success') {
                                vm.saasMessage={
                                  visible:true,
                                  delay:4000,
                                  message:res.Msg
                               };  
                               vm.delete(data1);
                           } else {
                               vm.$message('保存失败,请重试!')
                           }
                       },
                       err => {
                        console.log(err);
                        loading.close();    
                        }) 
                       .catch(err =>{loading.close();console.log(err);} )
               }else{
                   vm.$message('当前月份已结账,无法修改凭证!')
               }
            },
            //confirm确认*************
            okConfirm(data){
                console.log(data);
                this.saasConfirm.visible=false;
            },
            noConfirm(data){

            }
       
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
                uname: state => state.user.username,
                orgcode: state => state.user.orgcode,
                usercount:state => state.user,
                cachePage:state=>state.tagNav.cachePage  //是否利用路由缓存
            }),
            
        },
        components:{
            voucher,
            voucherTemp,
            nextMonth,
        }
    }
</script>

<style lang="scss" scoped>
    .addVoucher{
        width:100%;
        min-width: 920px;
        height:100%;
        overflow: hidden;
        overflow-y: auto;
        text-align: left;
        padding:8px 18px;
        padding-right:70px;
        margin-right:10px;
        font-size:14px;
        position:relative;
    }
    .unionState{
        padding-right: 10px;
       // margin-bottom: 30px;
        >ul{
            
            >a:nth-last-of-type(2){
                position:relative;
                width:70px;
                height:30px;
               
                .mode{
                    width:60px;
                    height:30px;       
                    overflow: hidden;
                    position:absolute; 
                            
                    transition:all 0.2s linear;
                    border:1px solid #00b7ee;
                    >div{
                        
                        width:100%;
                        margin-right:10px;
                        background: #fff;
                        opacity: 1;
                        &:first-of-type{
                            color:#fff;
                        }
                        &:hover{
                            background: #ccc;
                            color:#fff;
                        }
                        &:first-of-type{
                            background: #00b7ee;
                            border:0;
                        }
                    }
                    &:hover{
                        height:120px;
                        border:1px solid #00b7ee;
                        background: #fff;
                        opacity: 1;
                        z-index:99;           
                         >span{
                             &:first-of-type{
                                 color:#fff;
                             }
                         }
                        
                    }
                }

            }
            .more{
                height:30px;
                overflow:hidden; 
                position: absolute;
               
                width:100%;
                margin:0;  
                opacity:1;         
                >ul{
                    width:100%;  
                    >li{
                        width:100%;     
                        background: #fff;        
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
                
            }
            >a>li.more:hover{
                 height:auto;
                background: #00b7ee; 
                border-top:0; 
                 z-index: 99;
            }
        }

    }
    .searcherCon{
        >div{
            float:left;
        }
        min-width: 500px;  
        .searcherBtn{
            border-radius: 0;
        }   
    }
    .fastGps{

        >li{
            float:left;
            margin-left: 5px;
            padding:0 5px;
            border-radius: 0;
            height:30px;
            width:80px;
            line-height: 30px;
            text-align: center;
            cursor:pointer;
            &:first-of-type,&:nth-of-type(2){
                width:30px;
                position:relative;
                &:before{
                    content:"";
                    position: absolute;
                    width:10px;
                    height:10px;
                    top:8px;
                    left:10px;
                    border:2px solid #ddd;
                    border-width: 0 0 2px 2px ;
                    -webkit-transform: rotate(45deg);
                    -moz-transform: rotate(45deg);
                    -ms-transform: rotate(45deg);
                    -o-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
            }
            &:nth-of-type(2):before{
                border-width:2px 2px 0 0  ;
                left:7px;
            }
            &:nth-of-type(3){
                width:70px;
                padding:0;
            }
            // &:nth-of-type(4){
            //     background: #6acccb;
            // }
        }
    }
    .searcherValue{
        border:1px solid #ddd;
        border-radius: 10px 0 0 10px ;
        overflow: hidden;
        padding-left:10px;
    }
    .searcherValue{
        width:30%;
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
        width:60px;
        min-width: 70px;
        text-align: center;
        line-height: 30px;
        cursor:pointer;
    }
    .unionState .handle{
        min-width: 570px;
    }
    .unionState .handle>a{
        float:right;
        min-width:50px;
    }
    .unionState .handle>a>li.more:hover{
        opacity:1;
    }
    .unionState .handle>a>li{
        border:0;
        padding:0;
        color:#fff;
        cursor:pointer;
        border-radius: 3px;
        text-align: center;
        background: #00b7ee;
        width:100%;
        font-size:14px;
        width:50px;
        height:30px;
        line-height: 30px;    
        margin-right: 0;
        &:hover{
            background: #fff;
            color:#00b7ee;
            border:1px solid #00b7ee;
        }
        &.fresh{
            width:30px;
            min-width:30px;
            border-radius:50%;
            background:none;
            position:relative;
            left:-10px;
            >img{
                height:100%;
            }
            &:hover{
                background: none;
                border:0;
                opacity:0.8;
            }
        }
        
    }
    .unionState .handle>a:nth-of-type(4)>li{
        min-width: 60px;
    }
    .asideNav{
        width:55px;
        position:absolute;
        z-index:999;
        right:0px;
        top:0px;
        height: 95%;
        min-height:490px;
        background: #fff;  
        box-shadow:0 0 20px 2px #ccc;
        >div:first-of-type{
            height:34px;
            line-height: 34px;
            text-align: center;
            background: #45c0f7;
            color:#fff;
            cursor: pointer;
            &:hover{
               background:  #00b7ee;
            }
        }
        p{
            text-align: center;
            height:30px;
            line-height: 30px;
            font-size: 18px;
            background: #fff;
            color:#04a9f4;
        }
        .monthsContainer{
            height:100%;
            overflow-y:scroll;
            overflow-x: hidden;     
            position: relative;
            left:7px;     
            width:70px;
            >ul.months{
                position: relative;
                left:-5px;
               >li{
                   >ul> li{
                       &:nth-of-type(2):after,&:nth-of-type(1):after{
                           background: none;
                       }
                       &:after{
                           content:"";
                           position: absolute;
                           width:3px;
                           height:10px;
                           background: #02a7e7;
                           left:45%;
                           top:-12px;

                       }
                       &:first-of-type{
                           margin-top:0;
                       }
                       &:first-of-type:after{
                           content:"";
                           height:0;
                       } 
                       position: relative;
                       width:40px;
                       height:40px;
                       line-height: 40px;
                       font-size: 15px;
                       text-align: center;
                       margin:0 auto;
                       margin-top: 12px;
                       color: #45c0f7;
                       border: #c7e8f7 1px solid;
                       border-radius: 50%;
                       cursor:pointer;
                       &.active.unchecked{
                           color:#fff;
                           background: rgb(3, 169, 244);
                       }
                       &.active{
                           background: rgb(3, 169, 244);
                           box-shadow: 0px 2px 2px #dbf4ff;
                           border: #c7e8f7 1px solid;
                           color:#fff;
                       }
                       &.unchecked{
                           background: #fff;
                           border-color:transparent;
                           color: #CCC !important;
                           border: #ececec 1px solid !important;
                           box-shadow: 0px 2px 2px #e0e0e0 !important;
                           &:after{
                               background: #ccc;
                           }
                        //    &:hover{
                        //        border-color:#aaa;
                        //        background: #ccc;
                        //        color:#333;
                        //    }
                       }
                    //    &.futureM.unchecked{
                    //        
                    //        background: #ccc;
                    //        cursor:default;
                    //    }
                    //    &:hover{
                    //        background: #02a7e7;
                    //        color:#fff;
                    //    }
                       &:first-of-type{
                           border:0;
                           font-size: 15px;
                           font-weight: bold;
                           cursor:default;
                        //    &:hover{
                        //        background: none;
                        //        color:#333;
                        //    }
                       }
                       &:nth-of-type(2){
                           margin-top: 0;
                       }
                   }
               }
            }
        }
        
        .yearsContainer{
            &:before{
                position:absolute;
                content:"";
                right:-7px;
                top:30px;
                width:15px;
                height:15px;
                background: #fff;
                transform: rotate(-45deg);
                box-shadow: 0px 7px 5px 0px #D9D9D9;
            }
            position:absolute;
            top:0;
            z-index:9;
            left:-320px;
            width:300px;
            height:310px;
            background: #fff;
            padding:30px 10px 10px 10px;
            box-shadow: 7px 7px 5px 0px #D9D9D9;
            p{
                background: #fff;
            }
            .yearsTitle{
                border-bottom:1px solid #ccc;
                color:#aaa;
                padding-bottom: 10px;
                &:after{
                    content:"";
                    display:block;
                    clear: both;
                }
                >span{
                    float:left;
                    width:33.33%;
                    text-align: center;
                    border-right:1px solid #aaa;
                    font-weight: bold;
                    font-size:18px;
                    cursor:pointer;
                    &:hover{
                        color:#00b7ee ;
                    }
                    &.active{
                        color:#00b7ee ;
                    }
                    &:last-of-type{
                        border:0;
                    }
                }
            }
            .yearsContent{
                font-size: 15px;
                >div:first-of-type{
                    font-size: 18px;
                    font-weight: bold;
                    padding:10px 10px 0 10px ;
                    margin-left: 10px;
                    >div:nth-of-type(2){
                        float:right;
                        width:70px;
                        margin-right: 30px;
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
                            &:nth-of-type(2){
                                float:right;
                            }
                        }
                    }
                }
                
                >ul{          
                    padding:5px 20px;
                    width:100%;
                    &:after{
                        content:"";
                        display:list-item;
                        clear:both;
                    }
                    >li{
                        float:left;
                        width:60px;
                        height:60px;
                        line-height: 60px;
                        text-align: center;
                        cursor:pointer;
                        &:hover{
                            background:#00b7ee ;
                            color:#fff;
                        }
                        &.active{
                            background:#00b7ee;
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
                        color:#00b7ee ;
                        border:1px solid #00b7ee ;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #00b7ee ;
                        }
                    }
                }
            }
            .jiezhang{
                >div:first-of-type{
                    width:230px;
                    height:100px;
                    line-height:40px;
                    margin: 40px auto ;
                    padding:30px 0px;
                    >span{
                        float:left;
                    }
                    >div{
                        width:50px;
                        float:left;
                    }
                    >i{
                        float:left;
                        display: block;
                        width:24px;
                        height:24px;
                        border:1px solid #00b7ee ;
                        border-radius: 50%;
                        margin:0 5px;
                        margin-top:8px;
                        background: #00b7ee ;
                        position: relative;
                        cursor: pointer;
                        &:first-of-type{
                            background: none;
                            border-color:#ff9900;
                        }
                        &:before{
                            content:"";
                            width:14px;
                            height:1px;
                            background: #ff9900;
                            position: absolute;
                            top:11px;
                            left:4px;
                        }
                        &:nth-of-type(2):before{
                            background: #fff;
                        }
                        &:nth-of-type(2):after{
                            background: #fff;
                            content:"";
                            width:1px;
                            height:14px;
                            position: absolute;
                            top:4.5px;
                            left:11px;
                        }
                    }
                }
                >p{
                    >span{
                        float:left;
                    }
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
                            background:#00b7ee;
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
                        color:#00b7ee ;
                        border:1px solid #00b7ee ;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #00b7ee ;
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
    .voucherMaskActive{
        position:fixed;
        bottom: 0;
        z-index: -1;
    }
    .footInfo{
        position:fixed;
        z-index:9;
        bottom:0;
        left:0;
        width:100%;
        height:50px;
        line-height: 50px;
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
    .voucherContainer{
         position:relative;
         width:100%;
         padding:50px 0;
         overflow: hidden;
         margin-right: 10px;   
    }
    .voucherMask{
        position: fixed;
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index:99;
        background: rgba(0,0,0,0.5);
        .voucherContainer{        
          width:80%;
          position:absolute;
          background:#fff;
          top:100px;
          left:10%;
          overflow-y: auto;
          padding:10px;
          >div:first-of-type{
              //float:right;
              padding:5px 10px;
              position: relative;
              z-index: 1;
              >span{
                  margin-left: 20px;
              }
          } 
          >p{
              position: relative;
              z-index: 1;
          }
          
        }
    }
    .voucherBG{
                position:absolute;
                z-index:0;
                left:-40px;
                top:0;
                width:105%;
                height:100%;
                >img{
                    width:100%;
                    height:100%;
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
    

     .voucherDisabledCon{
         position:relative; 
        // min-height:516px;
         width:100%;  
         z-index: 1; 
         background:#fff;
        .voucherDisabled{            
            position:absolute;
            background: none;
            z-index: 99;
            width:74%;
            height:100%;
            top:74px;
            right:0;
            >div{
                position:relative;
                z-index:89;
            }
        }     

    }
    .tempMask{
        width:100%;
        height:100%;
        top:0;
        left:0;
        position: fixed;
        z-index: 999;
        background: rgba(0,0,0,.3);
        >div{
            position: absolute;
            left:30%;
            top:150px;
            width:552px;
            height:246px;
            background: #fff;
            border-radius: 5px;
            padding:5px 15px;
            >ul{
                padding:30px 50px;
                font-size:16px;
                >li{
           
                    height:100%;
                    line-height:100%;
                    &:first-of-type{
                        margin-bottom:30px;
                    }
                    
                    >div:first-of-type{
                        width:100px;
                        
                    }
                    >div{
                        >label{
                            margin-right: 20px;
                        }
                    }
                }
            }
            >div{
                justify-content: center;
                >span{
                    margin-left:60px;
                    width:110px;
                    height:35px;
                    line-height: 35px;
                }
            }
        }
    }
</style>
