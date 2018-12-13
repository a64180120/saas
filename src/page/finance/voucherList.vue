<template>

    <div class="voucherList">
        <div class="voucherNav">
            <ul>
                <a><li>新增</li></a>
                <a><li>修改</li></a>
                <a><li>删除</li></a>
                <a><li>审核</li></a>
                <a><li>反审核</li></a>
                <a><li>复制</li></a>
                <a><li>剪切</li></a>
                <a><li>冲红</li></a>
                <a><li>凭证重排</li></a>
                <a><li>导入</li></a>
                <a><li>导出</li></a>
                <a><li>打印</li></a>
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
                <div v-show="highGradeCss" class="highGradeCss">
                    <div><span>高级查询</span><i @click.stop="highGradeToggle(false)" class="cancle"></i></div>
                    <ul>
                        <li>
                            <div>科目名称</div>
                            <div class="inputContainer"><input type="text"></div>
                        </li>
                        <li>
                            <div>辅助核算</div>
                            <div class="flexPublic">
                                <div class="selectContainer"><select></select></div>
                                <div class="inputContainer"><input type="text"></div>
                            </div>
                        </li>
                        <li>
                            <div>合计金额</div>
                            <div class="flexPublic">
                                <div class="inputContainer"><input type="text"></div>
                                <span>至</span>
                                <div class="inputContainer"><input type="text"></div>
                            </div>
                        </li>
                        <li>
                            <div>账期</div>
                            <div class="flexPublic">
                                <div class="block">
                                    <el-date-picker type="date" v-model="date3" placeholder="请选择日期">
                                    </el-date-picker>
                                </div>
                                <span>至</span>
                                <div class="block">
                                    <el-date-picker type="date" v-model="date4" placeholder="请选择日期">
                                    </el-date-picker>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div>
                        <div>重置</div>
                        <div>搜索</div>
                    </div>
                </div>
            </div>

        </div>
        <section class="listContainer">
            <ul class="listTitle">
                <li>序号</li>
                <li>摘要</li>
                <li>科目</li>
                <li>借方金额</li>
                <li>贷方金额</li>
            </ul>
            <ul class="listContent" v-for="(item,index) of voucherList" :key="index">
                <li>
                    <dl @click="voucherDel(item)" class="listIndex">{{index+1}}</dl>
                    <ul>
                        <li>
                            <span>凭证日期 : {{item.PDate?item.PDate.substring(0,10):''}}</span>
                            <span>凭证字号 : {{item.PNo}}</span>
                            <span>附件数 : {{item.PAttachment}}</span>
                            <span>制单人 : {{item.PMakePerson}}</span>
                            <span>审核 : {{item.PAuditor}}</span>
                        </li>
                        <li v-for="(dtl,ind) of item.Dtls" :key="ind">
                            <div>{{dtl.Abstract}}</div>
                            <div>{{dtl.SubjectCode}}&nbsp;{{dtl.SubjectName}}</div>
                            <div>{{dtl.JSum==0?'':dtl.JSum}}</div>
                            <div>{{dtl.DSum==0?'':dtl.DSum}}</div>
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
        <side-time @time-click="getSideDate"></side-time>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import sideTime from './sideTime'
    export default {
       // name: "voucher-list",
        mounted(){
            if(this.$route.query.voucherList){
                this.voucherList= this.$route.query.voucherList;
            }else{
                this.getvoucherList();
            }
            this.$store.commit("tagNav/turnCachePage",true);
            this.getChecked();
        },
        data(){
            return {
                date1:'',
                date2:'',
                date3:'',
                date4:'',
                sum1:'',
                sum2:'',
                nowTime:new Date,
                checkedTime:'',
                sideDate:'',
                searchVal:'',
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
                voucherList:[],
                highGradeCss:false,
                pagesize:100,
                pageindex:0,
            }
        },
        methods:{
            highGradeToggle(bool) {
                this.highGradeCss = bool;
            },
            voucherDel(item){
                this.$router.push({path:'/finance/voucherAdd',query:{list:item}});
            },
            /*getvoucher(){
                var data={
                    uid:'0001',
                    orgid:52118082000000,
                    id:168181205000001
                }
                this.$axios.get('/PVoucherMst/GetVoucher',{params:data})
                    .then(res=>{

                        console.log(res)

                    })
                    .catch(err=>console.log(err))
            },*/
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
            getvoucherList(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    pagesize:this.pagesize,
                    pageindex:this.pageindex,
                    keyword:this.searchValue,
                    queryfilter:{"OrgId*num*eq*1":this.orgid,"Uyear*str*eq*1":this.sideDate.split('-')[0],"PMonth*byte*eq*1":parseInt(this.sideDate.split('-')[1])}
                }
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                        this.voucherList= res.Record;
                        if(this.voucherList.length<=0){
                            this.$message('暂无新凭证');
                        }
                    })
                    .catch(err=>console.log(err))
            },
            //获取当前结账的最新月份************
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"JYear*str*eq*1":this.nowTime.getFullYear().toString(),"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        
                        this.checkedTime=res.Record[0].JEnableMonth+1;
                        this.sideDate=this.nowTime.getFullYear()+'-'+this.checkedTime;
                    })
                    .catch(err=>console.log(err))
            },
            getSideDate(data){
                this.sideDate=data.sideDate;
                this.getvoucherList();
            }
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
                cachePage:state=>state.tagNav.cachePage  //是否利用路由缓存
            })
        },
        filters:{
            sum(val,dtl){
                var sum=0;
                if(!dtl){
                    dtl=[]
                }
                switch(val){
                    case 'jie':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
                        }
                        sum=sum.toFixed(2);
                        break;
                    case 'dai':
                        for(var d of dtl){
                            if(d.DSum){
                                sum+=parseFloat(d.DSum);
                            }
                        }
                        sum=sum.toFixed(2);
                        break;
                    case 'sum':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
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
                        sum=INT+dot;
                        break;
                }
                return sum;

            }
        },
        components:{
            sideTime,
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
        background:#509edc;
        color:#fff;
        cursor:pointer;
    }
    .voucherList{
        padding:8px 18px;
        padding-right:70px;
        margin-right:10px;
        font-size:14px;
        position:relative;
        min-width: 1024px;
        height:800px;
        overflow-y: auto;
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
        .listContainer{
            overflow-y: auto;
            padding:5px;
            margin-top:10px;
            padding-bottom: 20px;
            ul.listTitle{
                display: flex;
                background: #2780d1;
                color:#fff;
                li{
                    text-align: center;
                    height:40px;
                    line-height: 40px;
                }
                li:first-of-type{
                    width:5%;
                }
                li:nth-of-type(2){
                    width:31%;
                }
                li:nth-of-type(3){
                    width:26%;
                }
                li:nth-of-type(4){
                    width:19%;
                }
                li:nth-of-type(5){
                    width:19%;
                }
            }
            ul.listContent{
                border-top:1px solid #ccc;
                margin-bottom: 20px;
                background: #fff;
                >li {
                    width:100%;
                    height:100%;
                    display: flex;
                    align-items: center;
                    position: relative;
                    > dl.listIndex{
                        border:1px solid #ccc;
                        border-top:0;
                        height:100%;
                        width:5%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position:absolute;
                    }
                    > ul {
                        height:100%;
                        width: 95%;
                        margin-left:5%;
                        >li{
                            display: flex;
                            justify-content: flex-start;
                            height:30px;
                            line-height: 30px;
                            &:first-of-type{
                                padding:0 10px;
                                border:1px solid #ccc;
                                border-top:0;
                                border-left: 0;
                                >span{
                                    margin-right: 50px;
                                }
                            }
                            >div{
                                text-align: center;
                                border:1px solid #ccc;
                                border-top:0;
                                border-left:0;
                            }
                            div:first-of-type{
                                width:32%;
                            }
                            div:nth-of-type(2){
                                width:28%;
                            }
                            div:nth-of-type(3){
                                width:20%;
                            }
                            div:nth-of-type(4){
                                width:20%;
                            }
                            &:last-of-type{
                                >div{
                                    text-align: center;
                                    border:1px solid #ccc;
                                    border-top:0;
                                    border-left:0;
                                    width:20%;
                                    &:first-of-type{
                                        width:60%;
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    }

</style>
