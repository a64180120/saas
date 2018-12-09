<template>
    <div class="vouchertemp">
        <div class="vouchertempCon">
            <p class="title"><span>凭证模板</span><i></i></p>
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input v-model="unionSearchValue" type="text" placeholder="科目/摘要/凭证号"></div>
                <div  class="searcherBtn">搜索</div>
            </div>
            <div class="voucherList">
                <ul>
                    <li>
                        <div>模板</div>
                        <div></div>
                    </li>
                    <li>
                        <div class="flexPublic">
                            <div><img src="@/assets/icon/0a7856c2-a547-424e-940f-1039697ec329.svg" alt=""><span>付款</span></div>
                            <div>
                                <img title="使用模板" src="@/assets/icon/4944c1f1-16a7-4be9-a1c2-2b48609a4c0d.svg" alt="">
                                <img title="编辑" src="@/assets/icon/04f238df-7fa5-4cae-a1d8-eda3dfaef207.svg" alt="">
                                <img title="删除" src="@/assets/icon/5b110879-948e-411b-b56e-bbfe20b992d5.svg" alt="">
                            </div>
                        </div>
                        <div>

                        </div>
                    </li>
                    <li>
                        <div></div>
                        <div></div>
                    </li>
                    <li>
                        <div></div>
                        <div></div>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        name: "voucher-list",
        mounted(){
            this.getvoucherList();
        },
        data(){
            return {
                unionSearchValue:'',
                voucherList:[],
                pagesize:10,
                pageindex:0,
            }
        },
        methods:{
            getvoucherList(){
                var data={
                    uid:'0001',
                    orgid:521180820000002,
                    id:349181206000002,
                    pagesize:this.pagesize,
                    pageindex:this.pageindex,
                }
                this.$axios.get('PVoucherTemplateMst/GetVoucherTemplate',{params:data})
                    .then(res=>{
                        console.log(res)
                        this.voucherList=res.Data;
                        if(this.voucherList.length<=0){
                            this.$message('暂无新凭证');
                        }
                    })
                    .catch(err=>console.log(err))
            },
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
    .vouchertemp{
        background: rgba(0,0,0,0.5);
        position: absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        .vouchertempCon{
            background: #fff;
            padding:10px 30px;
            width:1100px;
            height:650px;
            margin:100px auto 0;
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
                }
            }
            .voucherList{
                overflow-y:auto;
                height:500px;
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
                            background: #6acccb;
                            color:#fff;
                            >div{
                                padding:5px;
                                >img{
                                    width:30px;
                                    height:30px;
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
                            border:2px solid #6acccb;
                        }
                        &:first-of-type{
                            cursor:pointer;
                            >div:first-of-type{
                                background: #ff9900;
                                line-height:33px;
                                text-align: center;
                                color:#fff;
                                font-size: 16px;
                            }
                            >div:nth-of-type(2){
                                border:2px solid #ff9900;
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
    }

</style>
