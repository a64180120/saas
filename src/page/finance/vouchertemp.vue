<template>

    <div class="vouchertemp">
        <div v-if="tempCss=='list'" class="vouchertempCon">
            <p class="title"><span>凭证模板</span><i @click.stop="finish(false)"></i></p>
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input v-model="searchVal" @keyup.13="getvoucherList" type="text" placeholder="模板名称"></div>
                <div @click.stop="getvoucherList" style="border-radius:0;"  class="searcherBtn btn">搜索</div>
            </div>
            <div class="voucherList">
                <ul>
                    <li @click.stop="tempHandle('add')">
                        <div>模板</div>
                        <div></div>
                    </li>
                    <li v-for="(item,index) of voucherList" :key="index">
                        <div class="flexPublic">
                            <div><img src="@/assets/icon/0a7856c2-a547-424e-940f-1039697ec329.svg" alt=""><span :title="item.TemName">{{item.TemName}}</span></div>
                            <div>
                                <img @click.stop="finish(item)" title="使用模板" src="@/assets/icon/eye.svg" alt="">
                                <img @click.stop="tempHandle('update',item)" title="编辑" src="@/assets/icon/update.svg" alt="">
                                <img @click.stop="tempHandle('delete',item)" title="删除" src="@/assets/icon/delete.svg" alt="">
                            </div>
                        </div>
                        <div class="tempContentCon">
                            <div class="tempBG">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="tempContent">

                                <ul>
                                    <li><span>摘要</span><span>科目代码</span><span>科目名称</span></li>  
                                    <li  v-for="(it1,index2) of item.Dtls" :key="index2"><span :title="it1.Abstract">{{it1.Abstract}}</span><span :title="it1.SubjectCode">{{it1.SubjectCode}}</span><span>{{it1.SubjectName}}</span></li>
                                </ul>
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
        <div v-if="tempCss=='add'||tempCss=='update'" class="vouchertempCon tempAdd">
            <p class="title"><span v-if="tempCss=='add'">新建模板</span><span v-if="tempCss=='update'">修改模板</span><i @click="showList"></i></p>
            <div class="flexPublic tempName">
                <div v-if="tempCss=='add'" class="flexPublic"><span>模板名称</span><div class="inputContainer"><input type="text" placeholder="输入模板名称" v-model="TemName"></div></div>
                <div v-if="tempCss=='update'" class="flexPublic"><span>模板名称</span><div class="inputContainer"><input type="text"  v-model="TemName"></div></div>
                <div @click.stop="add()">保存模板</div>
            </div>
            <temp-vou :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></temp-vou>
        </div>
    </div>
</template>

<script>
    import tempVou from './tempVou'
    import {mapState, mapActions} from 'vuex'
    export default {
        name: "voucher-list",
        mounted(){
            this.getvoucherList();
        },
        data(){
            return {
                searchVal:'',
                TemName:'',
                voucherDataList:{bool:false,data:{Mst:'',Attachements:[]}},
                voucherList:[],
                pagesize:100,
                pageindex:0,
                tempCss:'list',
                
            }
        },
        methods:{
            //凭证列表***********
            getvoucherList(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    pagesize:this.pagesize,
                    pageindex:this.pageindex,
                    queryfilter:{"TemName*str*llike*1":this.searchVal}
                }
                this.$axios.get('PVoucherTemplateMst/GetVoucherTemplateList',{params:data})
                    .then(res=>{
                        this.voucherList=res.Record;
                        console.log(this.voucherList)
                        if(this.voucherList.length<=0){
                            this.$message('暂无新凭证');
                        }

                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>console.log(err))
            },
            //显示切换修改添加*****************
            tempHandle(val,item){
                if(!val){
                    this.showList();
                }else{
                    switch(val){
                        case 'add':
                            this.voucherDataList.data={Mst:'',Attachements:[]}
                            this.voucherDataList.bool=true;
                            this.tempCss='add';
                            break;
                        case 'delete':
                            this.delete(item);
                            break;
                        case 'update':
                            this.voucherDataList.data.Mst=item;
                            this.TemName=item.TemName;
                            this.voucherDataList.bool=true;
                            console.log(this.voucherDataList.data)
                            this.tempCss='update';
                            break;
                    }
                }
            },
            //添加修改******************
            add(){
                var url='add';
                this.voucherData();
                if(this.voucherDataList.data.Mst.Dtls.length<=0){
                    this.$message('请输入内容!')
                    return;
                }
                this.voucherDataList.data.Mst.TemName=this.TemName;
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData:this.voucherDataList.data
                }
                if(this.voucherDataList.data.Mst.PhId){
                    url='update';
                }
                const loading1=this.$loading();
                this.$axios.post('/PVoucherTemplateMst/Post'+url,data)
                    .then(res=>{
                        console.log(res)
                        if(res.Status=='success'){
                            this.$message('保存成功!')
                            this.showList();
                            /*继续添加
                            this.voucherDataList.bool=false;
                            var vm=this;
                            function delay(){
                                vm.voucherDataList.bool=true
                            }
                            setTimeout(delay,10);*/
                        }else{
                            this.$message('保存失败,请重试!')
                        }
                        loading1.close();
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //删除*********************
            delete(item){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    id: item.PhId
                }
                
                this.$axios.post('PVoucherTemplateMst/PostDelete',data)
                    .then(res=>{
                        console.log(res)
                        this.showList();
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>console.log(err))
            },
            //给父组件传值*************
            finish(item){
                if(item){             
                    this.clearPhId(item);
                }
                this.$emit('temp-click',item);
            },
            //清空凭证phid*****************
            clearPhId(item){
                item.PhId='';
                    for(var dtl of item.Dtls){
                        dtl.PhId='';
                        dtl.PhidTransaction='';
                        dtl.PhidVouchermst='';
                        if(dtl.DtlAccounts){
                            dtl.DtlAccounts[0].PhId='';
                            dtl.DtlAccounts[0].PhidTransaction='';
                            dtl.DtlAccounts[0].PhidVouchermst='';
                            dtl.DtlAccounts[0].PhidVoucherDel='';
                        }
                    }    
            },
            //凭证搜索**************************
            searchVoucher(val){
                const loading1=this.$loading();
                var data={
                    id:0,
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"SubjectCode*str*eq*1":this.searchVal,"SubjectName*str*eq*1":this.searchVal,"Abstract*str*eq*1":this.searchVal,"PNo*str*eq*1":this.searchVal}
                }
                this.$axios.get('PVoucherTemplateMst/GetVoucherTemplate',{params:data})
                    .then(res=>{
                        console.log(res)
                        this.voucherList=res.Record;
                        loading1.close();
                        if(this.voucherList.length<=0){
                            this.$message('无法找到该凭证!')
                        }
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //接收voucher组件传值************
            voucherData(){
                this.voucherDataList.data=this.$refs.voucher.voucherData();
                console.log(this.voucherDataList.data)
            },
            showList(){
               this.tempCss='list';
               this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}}
               this.getvoucherList();
            }
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
            })
        },
        filters:{
            sum(val,dtl){
                var sum=0;
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
            tempVou,
        }
    }
</script>

<style lang="scss" scoped>
    .searcherCon{
        width:30%;
        float: right;
        min-width: 170px;
        position:relative;
        margin-top: 20px;
        &:after{
            content:"";
            display: block;
            clear:both;
        }
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
                        background: #00b7e4;
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
        background:#00b7ee;
        color:#fff;
        cursor:pointer;
    }
    .vouchertemp{
        background: rgba(0,0,0,0.5);
        position: fixed;
        z-index: 99;
        left:0;
        top:0;
        width:100%;
        height:100%;
        .vouchertempCon{
            background: #fff;
            padding:10px 30px;
            width:1100px;
            height:540px;
            margin:80px auto 0;
            border-radius: 10px;
            .title{
                border-bottom: 1px solid #ccc;
                padding:5px 2px;
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
            .voucherList{
                overflow-y:auto;
                height:410px;
                width:100%;
                >ul{
                    display: flex;
                    justify-content: flex-start;
                    flex-flow: row wrap;
                    margin-top: 20px;
                    >li{
                        width:315px;
                        height:176px;
                        margin:0 25px 25px 0;
                        >div:first-of-type{
                            height:33px;
                            background: #00b7ee;
                            color:#fff;
                            >div{
                                width:65%;
                                padding:5px;
                                &:last-of-type{
                                    width:35%;
                                }
                                >img{
                                    width:30px;
                                    height:30px;
                                }
                                >span{
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                }
                                display: flex;
                                align-items: center;
                                &:nth-of-type(2){
                                    >img{
                                        cursor: pointer;
                                    }
                                }
                            }
                            img{
                                width:25px;
                                height:25px;
                                margin-right: 5px;
                            }
                        }
                        >div:nth-of-type(2){
                            height:143px;
                            border:2px solid #00b7e4;
                        }
                        &:first-of-type{
                            cursor:pointer;
                            >div:first-of-type{
                                background: #00b7ee;
                                line-height:33px;
                                text-align: center;
                                color:#fff;
                                font-size: 16px;
                            }
                            >div:nth-of-type(2){
                                border:2px solid #00b7ee;
                                position:relative;
                                &:before{
                                    position: absolute;
                                    content:"";
                                    width:104px;
                                    height:6px;
                                    background: #d9d9d9;
                                    left:102px;
                                    top:67px;
                                    border-radius: 4px;
                                }
                                &:after{
                                    position: absolute;
                                    content:"";
                                    width:7px;
                                    height:81px;
                                    background: #d9d9d9;
                                    left:150px;
                                    top:30px;
                                    border-radius: 4px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .tempAdd{
            .tempName{
                margin:20px 0;
                >div:first-of-type{
                    padding:0 10px;
                    width:300px;
                    >span{
                        width:100px;
                    }
                }
                >div:nth-of-type(2){
                    cursor: pointer;
                    background: #00b7ee;
                    color:#fff;
                    text-align: center;
                    border:1px solid #00b7ee;
                    border-radius: 5px;
                    height:30px;
                    line-height: 30px;
                    width:90px;
                    &:hover{
                        background: #fff;
                        color:#00b7ee;
                    }
                }
            }
        }
        .tempContentCon{
            position:relative;
            overflow-y: auto;
            >.tempBG{
                position: absolute;
                width:100%;
                height:100%;
                >div{
                    border-bottom: 0.5px solid #00b7e4;
                    width:100%;
                    height:25%;
                    &:after{
                        content:"";
                        position: absolute;
                        width:1px;
                        height:140px;
                        background: #00b7e4;
                        top:0;
                    }
                    &:first-of-type:after{
                        left:30%;
                    }
                    &:nth-of-type(2):after{
                        left:60%;
                    }
                    &:nth-of-type(3):after{
                        left:80%;
                    }
                }
            }
            >.tempContent{
                position: relative;
                z-index: 9;
                background: none;
                padding:10px 10px 10px 20px;
                overflow: auto;
                >ul{
                    >li{
                        display: flex;
                        align-items: center;
                        margin-bottom: 5px;
                        >span{
                            width:33.33%;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        >span:first-of-type{
                            
                            margin-right: 10px;
                        }
                    }
                }
            }

        }
    }

</style>
