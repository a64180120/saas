<template>
    <div class="addVoucher">
        <div class="unionState flexPublic">
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input type="text" placeholder="科目/摘要/凭证号"></div>
                <div  class="searcherBtn">凭证定位</div>
                <ul class="fastGps">
                    <li></li>
                    <li></li>
                    <li>更多凭证</li>
                    <li>做下月账</li>
                </ul>
            </div>

            <ul class="flexPublic handle">
                <a>
                    <li class="mode">
                        <span>模板</span>
                        <span>引用模板</span>
                        <span>存为模板</span>
                    </li>
                </a>

                <a @click.prevent="addVoucher('keep')"><li>保存</li></a>
                <a @click.prevent="addVoucher('keepAdd')"><li>保存并新增</li></a>
                <a @click.prevent="addVoucher('print')"><li>保存并打印</li></a>
                <a @click.prevent="addVoucher('reset')"><li>凭证号重排</li></a>
            </ul>
        </div>
        <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
       <!-- <div class="newAddContainer">
            <div class="newAddTitle flexPublic">
                <span>最新新增凭证</span>
                <a href="">进入凭证列表</a>
            </div>
            <div class="newAddContent">
                <div class="newAddList">
                    <ul class="flexPublic w-33">
                        <li>序号</li>
                        <li>凭证记号</li>
                        <li>审核状态</li>
                        <li>凭证日期</li>
                    </ul>
                    <ul class="flexPublic w-33">
                        <li>序号</li>
                        <li>凭证记号</li>
                        <li>审核状态</li>
                        <li>凭证日期</li>
                    </ul>
                    <ul v-if="newAddList.length>6" class="flexPublic w-33">
                        <li>序号</li>
                        <li>凭证记号</li>
                        <li>审核状态</li>
                        <li>凭证日期</li>
                    </ul>
                </div>
                <ul class="newAddList">
                    <li v-for="(item,index) of newAddList" :key="index">
                        <ul class="flexPublic">
                            <li>{{index+1}}</li>
                            <li>记-{{item.PNo}}</li>
                            <li :class="{newAddStateTrue:item.Verify,newAddStateFalse:!item.Verify}"></li>
                            <li>{{item.PDate?item.PDate.split('T')[0]:''}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>-->
        <div class="asideNav">
            <div @click.stop="yearSelShow"><span>会计期</span></div>
            <p>{{year}}</p>
            <div class="monthsContainer">
                <ul @mouseleave.stop="dragLeave" @mousemove.stop="dragMove" @mouseup.stop="dragDown(false)" @mousedown.prevent.stop="dragDown(true,$event)" @mousewheel.stop="monthsSel" id="scrollMonth" style="bottom: 0;" class="months">
                    <li v-for="item of sideDate.split('-')[0]-2000"  :key="item">
                        <ul>
                            <li>{{2000+item}}</li>
                            <li :class="{active:yearMonth==i&&2000+item==year,unchecked:i>sideDate.split('-')[1]&&2000+item>=sideDate.split('-')[0]}" @click="sideMonth(i,item+2000)" v-for="i of 12" :key="i">{{i}}</li>
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
                        <li :class="{active:yearMonth==index+1}" v-for="index of 12" :key="index">{{index+1}}月</li>
                    </ul>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('kuaiji')">确认</span>
                    </p>
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
    </div>
</template>

<script>
    import voucher from './voucher'
    export default {
        data(){return {
            val1:'',
            sideDate:'2018-05',
            year:'2018',
            month:'',
            userState:0,
            checkVal:'',
            unCheckVal:'',
            pagesize:9,
            pageindex:0,
            voucherDataList:{bool:true,data:''},
            userStateValues:[
                {id:0,name:'全部'},{id:1,name:'2018-11'},{id:2,name:'2018-12'},{id:3,name:'2019-01'}
            ],
            newAddList:[
            ],
            yearSelCss:false,
            monthsSelCss:'kuaiji',
            yearMonth:'',
            mouseDown:false,
            mouseStartY:''
        }},
        created(){
            // this.newVoucherList();
            //this.getvoucher();
            this.getvoucherList();
        },
        methods:{
            addVoucher(str){
                switch(str){
                    case 'resolve':
                        alert('yinru ');
                        break;
                    case 'keepModel':
                        alert('baocunmodel');
                        break;
                    case 'keepAdd':
                        alert('baocunxinzeng');
                        break;
                    case 'keep':
                        this.voucherData();
                        this.keepVoucher();
                        break;
                }
            },
            keepVoucher(){

               var data={
                   uid:0,
                   orgid:0,
                   infoData:this.voucherDataList.data
               }
               this.$axios.post('http://10.0.15.3:8028/api/GCW/PVoucherMst/PostUpdate',data)
                   .then(res=>{
                       console.log(res)
                       if(res.Status=='success'){
                           alert('保存成功!')
                           this.voucherDataList.bool=false;
                           var vm=this;
                           function delay(){
                               vm.voucherDataList.bool=true
                           }
                           setTimeout(delay,10);


                       }else{
                           alert('保存失败,请重试!')
                       }
                   })
                   .catch(err=>console.log(err))
            },
            voucherData(){//接收voucher组件传值************
                this.voucherDataList.data=this.$refs.voucher.voucherData();
            },
           /* getvoucher(){
                var data={
                    uid:'0001',
                    orgid:52118082000000,
                    id:208181114000001
                }
                this.$axios.get('http://10.0.15.3:8028/api/GCW/PVoucherMst/GetVoucher',{params:data})
                    .then(res=>{
                        console.log(res)
                        if(res.Status=='success'){
                            this.voucherDataList.data=res.Data[0];
                            this.voucherDataList.bool=true;
                            console.log(this.voucherDataList.data)
                        }else{
                            console.log(res.Msg)
                        }
                    })
                    .catch(err=>console.log(err))
            },*/
            getvoucherList(){
                var data={
                    uid:'0001',
                    orgid:52118082000000,
                    pagesize:this.pagesize,
                    pageindex:this.pageindex,
                }
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        this.newAddList=res.Record;
                        if(this.newAddList.length<=0){
                            alert('暂无新凭证');
                        }
                    })
                    .catch(err=>console.log(err))
            },
            //
            sideMonth(i,year){
                this.yearMonth=i;
                this.year=year;
                console.log(this.yearMonth,this.year)
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
                if(val=='kuaiji'){
                    if(this.year&&this.yearMonth){
                        console.log(this.year,this.yearMonth)
                    }else{
                        alert('请选择年月!')
                    }
                }else if(val=='jiezhang'&&this.checkVal){

                        console.log(this.checkVal)

                }else if(val=='fanjiezhang'&&this.unCheckVal){
                    console.log(this.unCheckVal)
                } else {
                    this.yearSelCss=false;
                }
            },
            nextYear(bool){
                var year=this.year;
                if(bool){
                    this.year=year>=this.sideDate.split('-')[0]?year:parseInt(year)+1;
                }else{
                   this.year=year<=2000?year:--year;
                }
                console.log(this.year)
            },
            yearMonthClick($event){
                this.yearMonth=parseInt($event.target.innerHTML)
                console.log( this.yearMonth)
            },
            //会计期内容切换************************************
            checkOutSel(val){
                this.monthsSelCss=val;
            },
            yearSelShow(){
                this.yearSelCss=!this.yearSelCss;
            }
        },
        computed:{

        },
        components:{
            voucher,
        }
    }
</script>

<style lang="scss" scoped>
    .addVoucher{
        width:100%;
        height:100%;
        overflow: auto;
        text-align: left;
        padding:8px 18px;
        padding-right:70px;
        margin-right:10px;
        font-size:14px;
    }
    .unionState{
        padding-right: 10px;
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
        height: 820px;
        border: 1px solid #ccc;
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
            height:740px;
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
                       margin-top: 20px;
                       border:1px solid #02a7e7;
                       border-radius: 50%;
                       cursor:pointer;
                       &.active{
                           background: #02a7e7;
                           color:#fff;
                       }
                       &.unchecked{
                           border-color:#aaa;
                           background: #ccc;
                           cursor:default;
                           &:hover{
                               border-color:#aaa;
                               background: #ccc;
                               color:#333;
                           }
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


  /*  !*凭证新增*********************************!
    .newAddTitle{
        background: #43c9d2;
        height:40px;
        color:#fff;
        padding:0 20px;
    }
    .newAddTitle>a{
        color:#fff;
        text-decoration: underline;
        font-size: 15px;
    }
    .newAddContent{
        padding:0 20px;
        margin:15px;
    }
    .newAddContent>div>ul>li{
        width:25%;
    }
    .newAddContent>div>ul>li:first-of-type{
        color:#6fbae4;
    }
    .newAddList{
        width:100%;
        margin-top:5px;
        height:90px;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
    }
    div.newAddList{
        height:30px;
    }
    .newAddList>li{
        width:33.33%;
        height:30px;
    }
    .newAddList>li>ul>li{
        width:25%;
        position: relative;
    }
    .newAddContent li{
        text-align: center;
    }
*/

</style>
