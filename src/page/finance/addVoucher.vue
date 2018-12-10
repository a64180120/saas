<template>
    <div class="addVoucher">
        <div class="unionState flexPublic">
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input type="text" v-model="searchVal" placeholder="科目/摘要/凭证号"></div>
                <div @click="searchVoucher"  class="searcherBtn">凭证定位</div>
                <ul class="fastGps">
                    <li @click="getvoucher('pre')"></li>
                    <li @click="getvoucher('next')"></li>
                    <li  @click.prevent="addVoucher('moreVoucher')">更多凭证</li>
                    <li @click.stop="nextMonthShow" v-if="!voucherDataList.data.Mst.PhId">做下月账</li>
                </ul>
            </div>
            <ul class="flexPublic handle">
                <a>
                    <li class="mode">
                        <span>模板</span>
                        <span @click.prevent="addVoucher('modelList')">引用模板</span>
                        <span @click.prevent="addVoucher('keepModel')">存为模板</span>
                    </li>
                </a>

                <a v-if="!voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('keep')"><li>保存</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('keep')"><li>修改</li></a>
                <a v-if="!voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('keepAdd')"><li>保存并新增</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('audit')"><li>审核</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('unAudit')"><li>反审核</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('delete')"><li>删除</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('copy')"><li>复制</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('paste')"><li>剪切</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('chongH')"><li>冲红</li></a>
                <a @click.prevent="addVoucher('print')"><li>保存并打印</li></a>
                <a @click.prevent="addVoucher('reset')"><li>凭证号重排</li></a>
            </ul>
        </div>
        <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
        <div class="asideNav">
            <div @click.stop="yearSelShow"><span>会计期</span></div>
            <p>{{sideDate.split('-')[0]}}</p>
            <div class="monthsContainer">
                <ul @mouseleave.stop="dragLeave" @mousemove.stop="dragMove" @mouseup.stop="dragDown(false)" @mousedown.prevent.stop="dragDown(true,$event)" @mousewheel.stop="monthsSel" id="scrollMonth" style="bottom: 0;" class="months">
                    <li v-for="item of sideDate.split('-')[0]-2000"  :key="item">
                        <ul>
                            <li>{{2000+item}}</li>
                            <li :class="{active:month==i&&2000+item==year,unchecked:i>sideDate.split('-')[1]&&2000+item>=sideDate.split('-')[0],futureM:2000+item==nowTime.getFullYear()&&i>nowTime.getMonth()}" @click="sideMonth(i,item+2000)" v-for="i of 12" :key="i">{{i}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div v-show="yearSelCss" class="yearsContainer">
                <p class="yearsTitle">
                    <span @click="checkOutSel('kuaiji')" :class="{active:monthsSelCss=='kuaiji'}">会计期</span>
                    <span @click="checkOutSel('jiezhang')" :class="{active:monthsSelCss=='jiezhang'}">结账</span>
                    <span @click="checkOutSel('fanjiezhang')" :class="{active:monthsSelCss=='fanjiezhang'}">反结账</span>
                </p>
                <div v-show="monthsSelCss=='kuaiji'" class="yearsContent">
                    <div class="flexPublic">
                        <div>{{year}}</div>
                        <div class="flexPublic">
                            <img @click="nextYear(false)" src="../../assets/icon/leftArr.svg" alt="">
                            <img @click="nextYear(true)" src="../../assets/icon/leftArr.svg" alt="">
                        </div>
                    </div>
                    <ul @click="yearMonthClick"  class="year-month">
                        <li :class="{active:month==index}" v-for="index of 12" :key="index">{{index}}月</li>
                    </ul>
                </div>
                <div v-show="monthsSelCss=='jiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>结账至</span>
                        <i></i>
                        <div class="inputContainer"><input v-model="checkVal" type="text"></div>
                        <i></i>
                        <span>月</span>
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('jiezhang')">确认</span>
                    </p>
                </div>
                <div v-show="monthsSelCss=='fanjiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>反结账至</span>
                        <i></i>
                        <div class="inputContainer"><input  v-model="unCheckVal" type="text"></div>
                        <i></i>
                        <span>月</span>
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('fanjiezhang')">确认</span>
                    </p>
                </div>

            </div>
        </div>
        <voucher-temp v-if="modelListCss" @temp-click="tempClick"></voucher-temp>
        <next-month v-if="nextMonthCss" @child-click="nextMonthHandle"></next-month>
    </div>
</template>

<script>
    import nextMonth from './nextMonthCheck'
    import voucher from './voucher'
    import {mapState, mapActions} from 'vuex'
    import voucherTemp from './vouchertemp'
    export default {
        data(){return {
            val1:'',
            sideDate:'',
            year:'2018',
            month:'',
            searchVal:'',
            userState:0,
            checkVal:'',
            unCheckVal:'',
            checkedTime:'2018-08',
            pagesize:9,
            pageindex:0,
            voucherDataList:{bool:true,data:{Mst:'',Attachements:[]}},
            newAddList:[],
            yearSelCss:false,
            nowTime:new Date,
            monthsSelCss:'kuaiji',
            mouseDown:false,
            mouseStartY:'',
            count:0,
            modelListCss:false,
            checkedEnd:'',
            nextMonthCss:false
        }},
        created(){
            this.sideDate=this.nowTime.getFullYear()+'-'+this.nowTime.getMonth();
            if(this.$route.query.list){
                this.voucherDataList.data.Mst=this.$route.query.list,
                this.voucherDataList.bool=true;
            }
        },
        mounted(){
            this.getChecked();
        },
        methods:{
            addVoucher(str){
                var Mst;
                switch(str){
                    case 'keep':
                        this.voucherData();
                        if(this.voucherDataList.data.Mst){
                            Mst=this.voucherDataList.data.Mst;
                        }
                        //判断凭证月份是否早于结账月份******************************
                        if(Mst.PMonth<=parseInt(this.checkedTime)&&Mst.Uyear<=this.checkedTime){
                            this.$message('该月份已结账,无法修改凭证!')
                            return;
                        }else{
                            this.keepVoucher();
                        }
                        break;
                    case 'keepAdd':
                        this.voucherData();
                        if(this.voucherDataList.data.Mst){
                            Mst=this.voucherDataList.data.Mst;
                        }
                        //判断凭证月份是否早于结账月份******************************
                        if(Mst.PMonth<=parseInt(this.checkedTime)&&Mst.UYear<=this.checkedTime){
                            this.$message('该月份已结账,无法修改凭证!')
                            return;
                        }else{
                            this.keepVoucher();
                        }
                        break;
                    case 'modelList':
                        this.modelListCss=true;
                        break;
                    case 'keepModel':
                        this.voucherData();
                        this.keepModel();
                        break;
                    case 'moreVoucher':
                        this.$router.push({path:'/finance/voucherList'})
                    case 'audit':
                        this.voucherData();
                        this.audit(true);
                        break;
                    case 'unAudit':
                        this.voucherData();
                        this.audit(false);
                        break;
                    case 'delete' :
                        this.voucherData();
                        this.delete();
                        break;
                }
            },
            //保存凭证*******************
            keepVoucher(){
                var url='Add';
               if(this.voucherDataList.data.Mst.Dtls.length<=0){
                   this.$message('请输入内容!')
                   return;
               }
               if(this.voucherDataList.data.Mst.PDate){
                   this.voucherDataList.data.Mst.UYear=this.voucherDataList.data.Mst.PDate.getFullYear();
                   this.voucherDataList.data.Mst.PMonth=this.voucherDataList.data.Mst.PDate.getMonth()+1;
               }else{
                   console.log(this.voucherDataList.data.Mst)
                   this.$message('请输入凭证会计期!')
                   return;
               }
               var data={
                   uid:this.uid,
                   orgid:this.orgid,
                   orgcode:this.orgcode,
                   infoData:this.voucherDataList.data
               }
                if(this.voucherDataList.data.Mst.PhId){
                   url='Update';
                }
               this.$axios.post('/PVoucherMst/Post'+url,data)
                   .then(res=>{
                       console.log(res)
                       if(res.Status=='success'){
                           this.$message('保存成功!')
                       }else{
                           this.$message('保存失败,请重试!')
                       }
                   })
                   .catch(err=>console.log(err))
            },
            //手动刷新voucher组件**************************
            resetVoucher(){
                this.voucherDataList.bool=false;
                var vm=this;
                function delay(){
                    vm.voucherDataList.bool=true
                }
                setTimeout(delay,5);
            },
            //保存模板**********************
            keepModel(){
                if(this.voucherDataList.data.Mst.Dtls.length<=0){
                    this.$message('请输入内容!')
                    return;
                }
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData:this.voucherDataList.data
                }
                console.log(data);
                this.$axios.post('/PVoucherTemplateMst/PostAdd',data)
                    .then(res=>{
                        if(res.Status=='success'){
                            this.$message('保存成功!')
                            this.voucherDataList.bool=false;
                            var vm=this;
                            function delay(){
                                vm.voucherDataList.bool=true
                            }
                            setTimeout(delay,10);
                        }else{
                            this.$message('保存失败,请重试!')
                        }
                    })
                    .catch(err=>console.log(err))
            },
            //审核*****************
            audit(bool){
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    realname:this.uname,
                    infoData:[this.voucherDataList.data.Mst.PhId]
                }

                var url='PVoucherMst/PostAudit';
                if(!bool){
                    url='PVoucherMst/PostUnAudit'
                }
                this.$axios.post(url,data)
                    .then(res=>{
                        if(res.Status=='success'){
                            if(bool){
                                this.$message('审核成功!')
                            }else{
                                this.$message('反审核成功!')
                            }
                        }else{
                            if(bool){
                                this.$message('审核失败!')
                            }else{
                                this.$message('反审核失败!')
                            }
                        }
                        console.log(this.voucherDataList.data)
                    })
                    .catch(err=>console.log(err))
            },
            //删除***********************
            delete(){
                if(this.voucherDataList.data.Mst.Dtls.length<=0){
                    alert('请输入内容!')
                    return;
                }
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    id:this.voucherDataList.data.Mst.PhId
                }
                console.log(data)
                this.$axios.post('PVoucherMst/PostDelete',data)
                    .then(res=>{
                        console.log(res)
                        if(res.Status=='success'){
                            this.$message('删除成功!')
                        }else{
                            this.$message('删除失败,请重试!')
                        }
                    })
                    .catch(err=>console.log(err))
            },
            voucherData(){//接收voucher组件传值************
                this.voucherDataList.data=this.$refs.voucher.voucherData();
            },
            //接收temp组件传值***********************
            tempClick(data){
                console.log(111,data);
                this.voucherDataList.data.Mst=data;
                this.resetVoucher();
                this.modelListCss=false;
            },
            //接收下月账传值******************
            nextMonthHandle(data){
                if(data===false){
                    this.nextMonthCss=false;
                }else{
                    console.log(data)
                }
            },
            //凭证搜索**************************
            searchVoucher(){
                const loading1=this.$loading();
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"SubjectCode*str*eq*1":this.searchVal,"SubjectName*str*eq*1":this.searchVal,"Abstract*str*eq*1":this.searchVal,"PNo*str*eq*1":this.searchVal}
                }
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        loading1.close();
                        this.newAddList=res.Record;
                        if(this.newAddList.length<=0){
                            this.$message('无法找到该凭证!')
                        } else{
                            this.count=0;
                            this.voucherDataList.data=this.newAddList[this.count];
                            this.resetVoucher();
                            console.log(this.voucherDataList.data)
                        }
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //获取当前结账的最新月份************
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"JYear*str*eq*1":this.sideDate.split('-')[0],"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        console.log(res)
                        if(res.Record.length>0){
                            this.checkedTime=res.Record;
                        }else{
                            this.checkedTime=1;
                        }
                    })
                    .catch(err=>console.log(err))
            },
          //前后翻页****************
            getvoucher(str){
                if(str=='pre'){
                    if(this.count>0){
                        this.count--;
                        this.voucherDataList.data=this.newAddList[this.count];
                        this.keepNew=true;
                        this.resetVoucher();
                    }else{
                        this.$message("已到当前月份第一张!")
                    }
                }else if(str=='next'){
                    if(this.count<this.newAddList.length-1){
                        this.count++;
                        this.voucherDataList.data=this.newAddList[this.count];
                        this.keepNew=true;
                        this.resetVoucher();
                    }else{
                        this.$message("已到当前月份最后一张!")
                    }
                }
            },
            //获取会计期凭证列表****************
            getvoucherList(){
                const loading1=this.$loading();
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    pagesize:this.pagesize,
                    pageindex:this.pageindex,
                    queryfilter:{"Uyear*str*eq*1":this.sideDate.split('-')[0],"PMonth*byte*eq*1":parseInt(this.sideDate.split('-')[1]),"OrgId*num*eq*1":521180820000002}
                    /*uyear:this.sideDate.split('-')[0],
                    pmonth:parseInt(this.sideDate.split('-')[1])*/
                }
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        loading1.close();
                        this.newAddList=res.Record;
                        if(this.newAddList.length<=0){
                            this.$message('暂无新凭证');
                        } else{
                            this.count=0;
                            this.voucherDataList.data=this.newAddList[this.count];
                            this.keepNew=true;
                            this.resetVoucher();
                        }
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //选择会计期***************
            sideMonth(i,year){
                this.month=i;
                this.year=year;
                this.sideDate=year+'-'+i;
                this.getvoucherList();
            },
            //鼠标滚轮移动月份选择****************
            monthsSel($event){
                var month= document.getElementById('scrollMonth');
                var bot=parseInt(month.style.bottom);
                if($event.deltaY=='-100'){
                    if(parseInt(bot)>0){
                        return;
                    }else{
                        month.style.bottom=bot-100+'px';
                    }
                }else if($event.deltaY=='100'){
                    if(bot>-100){
                        month.style.bottom='0px';
                    }else{
                        month.style.bottom=bot+100+'px';
                    }
                }
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
                    var Y=$event.clientY-this.mouseStartY;
                    console.log(Y)
                    var month= document.getElementById('scrollMonth');
                    var bot=parseInt(month.style.bottom);
                    if(bot>0){
                        month.style.bottom='0px';
                        return;
                    }
                        month.style.bottom=bot-Y*2+'px';
                    this.mouseStartY=$event.clientY;
                }

            },
            //会计期确认选择*****************************
            yearsTrue(val){
               if(val=='jiezhang'&&this.checkVal){
                        this.checkOut();
                        console.log(this.checkVal)

                }else if(val=='fanjiezhang'&&this.unCheckVal){
                    console.log(this.unCheckVal)
                } else {
                    this.yearSelCss=false;
                }
            },
            //结账功能**********************
            checkOut(){
                const loading1=this.$loading();
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    dateTime:this.nowTime.getFullYear()+'-'+(this.checkVal>9?this.checkVal:'0'+this.checkVal)
                }
                this.$axios.get('/PBusinessConfig/UpdateBusinessConfig',{params:data})
                    .then(res=>{
                        this.$message(res.Msg                                                               );
                        loading1.close();
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            nextYear(bool){
                var year=this.year;
                if(bool){
                    this.year=year>=this.sideDate.split('-')[0]?year:parseInt(year)+1;
                }else{
                   this.year=year<=2000?year:--year;
                }
            },
            yearMonthClick($event){
                this.month=parseInt($event.target.innerHTML)
                this.sideDate=this.year+'-'+this.month;
                this.getvoucherList();
            },
            //会计期内容切换************************************
            checkOutSel(val){
                this.monthsSelCss=val;
            },
            yearSelShow(){
                this.checkVal=this.checkedTime;
                this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                this.yearSelCss=!this.yearSelCss;
            },
            nextMonthShow(){
                this.nextMonthCss=true;
            }
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
                uname: state => state.user.username,
                orgcode: state => state.user.orgcode
            })
        },
        components:{
            voucher,
            voucherTemp,
            nextMonth
        }
    }
</script>

<style lang="scss" scoped>
    .addVoucher{
        width:100%;
        min-width: 1250px;
        height:100%;
        overflow-y: scroll;
        text-align: left;
        padding:8px 18px;
        padding-right:70px;
        margin-right:10px;
        font-size:14px;
        position:relative;
    }
    .unionState{
        padding-right: 10px;
        margin-bottom: 30px;
        >ul{
            >a:first-of-type{
                position:relative;
                width:80px;
                height:30px;
                margin-right: 10px;
                .mode{
                    width:80px;
                    display: flex;
                    flex-flow: column;
                    height:30px;
                    overflow: hidden;
                    position:absolute;
                    z-index: 9;
                    transition:all 0.2s linear;
                    >span{
                        &:first-of-type:hover{
                            background: #fff;
                            color:#52bab5;
                        }
                        &:hover{
                            background: #ff9900;
                            color:#fff;
                        }
                    }
                    &:hover{
                        height:90px;
                        background: #fff;
                        color:#52bab5;
                        >span:first-of-type{
                            border-bottom: 1px solid #ff9900;
                        }
                    }
                }
            }
        }

    }
    .searcherCon{
        width:50%;
        min-width: 300px;
        justify-content: flex-start;
    }
    .fastGps{
        display: flex;
        align-items: center;
        width:290px;
        >li{
            margin-left: 5px;
            padding:0 10px;
            background:#509edc;
            color:#fff;
            height:30px;
            width:100px;
            line-height: 30px;
            text-align: center;
            cursor:pointer;
            &:first-of-type,&:nth-of-type(2){
                width:40px;
                position:relative;
                &:before{
                    content:"";
                    position: absolute;
                    width:10px;
                    height:10px;
                    top:10px;
                    left:15px;
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
                left:12px;
            }
            &:nth-of-type(4){
                background: #6acccb;
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
        width:20%;
        text-align: center;
        line-height: 30px;
        background:#509edc;
        color:#fff;
        cursor:pointer;
    }
    .unionState .handle>a>li{
        border:1px solid #ff9900;
        cursor:pointer;
        border-radius: 3px;
        text-align: center;
        min-width:70px;
        font-size:13px;
        height:30px;
        line-height: 30px;
        margin-left:10px;
        margin-right: 0;
    }
    .unionState .handle>a:nth-of-type(4)>li{
        min-width: 60px;
    }
    .unionState .handle>a>li:hover{
        background: #ff9900;
        color:#fff;
    }
    .asideNav{
        width:55px;
        position:absolute;
        right:20px;
        top:10px;
        height: 700px;
        border: 1px solid #ccc;
        background: #fff;
        >div:first-of-type{
            height:34px;
            line-height: 34px;
            text-align: center;
            background: #ff9900;
            color:#fff;
            cursor: pointer;
            &:hover{
               background:  #2780d1;
            }
        }
        p{
            text-align: center;
            height:30px;
            line-height: 30px;
            font-size: 18px;
            background: #02a7e7;
        }
        .monthsContainer{
            height:620px;
            overflow: hidden;
            position: relative;
            >ul.months{
                position: absolute;
                left:7px;
                transition: all 0.8s linear;
               >li{
                   >ul> li{
                       width:40px;
                       height:40px;
                       line-height: 40px;
                       font-size: 15px;
                       text-align: center;
                       margin:0 auto;
                       margin-top: 12px;
                       border:1px solid #02a7e7;
                       border-radius: 50%;
                       cursor:pointer;
                       &.active.unchecked{
                           color:#333;
                       }
                       &.active{
                           background: #02a7e7;
                           color:#fff;
                       }
                       &.unchecked{
                           background: #fff;
                           border-color:#aaa;
                           &:hover{
                               border-color:#aaa;
                               background: #ccc;
                               color:#333;
                           }
                       }
                       &.futureM.unchecked{
                           border-color:#aaa;
                           background: #ccc;
                           cursor:default;
                       }
                       &:hover{
                           background: #02a7e7;
                           color:#fff;
                       }
                       &:first-of-type{
                           border:0;
                           font-size: 15px;
                           font-weight: bold;
                           &:hover{
                               background: none;
                               color:#333;
                           }
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
                display: flex;
                align-items: center;
                color:#aaa;
                padding-bottom: 10px;
                >span{
                    width:33.33%;
                    border-right:1px solid #aaa;
                    font-weight: bold;
                    cursor:pointer;
                    &:hover{
                        color:#3e8cbc;
                    }
                    &.active{
                        color:#3e8cbc;
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
                    padding:10px;
                    >div:nth-of-type(2){
                        width:70px;
                        margin-right: 50px;
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

                >ul{
                    display: flex;
                    align-items: center;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    padding:5px 20px;
                    width:100%;
                    height:160px;
                    >li{
                        width:50px;
                        height:50px;
                        line-height: 50px;
                        text-align: center;
                        cursor:pointer;
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
            }
            .jiezhang{
                >div{
                    width:230px;
                    margin: 50px auto ;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    >div{
                        width:50px;

                    }
                    >i{
                        display: block;
                        width:24px;
                        height:24px;
                        border:1px solid #3e8cbc;
                        border-radius: 50%;
                        margin: 5px;
                        background: #3e8cbc;
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
            }
        }
    }



</style>
