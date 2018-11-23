<template>
    <div class="addVoucher">
        <div class="unionState  flexPublic">
            <ul class="voucherDel handle">
            <router-link to="/finance/voucherAdd"><li>新增</li></router-link>
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
        <div class="unionState ">
            <div class="flexPublic searcherCon ">
                <div class="searcherValue"><input type="text" placeholder="科目/摘要/凭证号"></div>
                <div  class="searcherBtn">搜索</div>
            </div>

        </div>
        <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
        <!--<div class="newAddContainer">
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

    </div>
</template>

<script>
    import voucher from './voucher'
    import qs from 'qs'
    export default {
        data(){return {
            val1:'',
            userState:0,
            pagesize:9,
            pageindex:0,
            voucherDataList:{bool:false,data:''},
        }},
        created(){
            this.voucherDataList.data=this.$route.params.list;
            console.log(this.voucherDataList)
            if( this.voucherDataList.data.PhId){
                this.voucherDataList.bool=true;
            }else{
                this.$router.push({path:'/finance/voucherList'});
            }
        },
        mounted(){

        },
        methods:{
            handleVoucher(str){
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
                var {config}=this.$ajax();
                var data={
                    uid:0,
                    orgid:0,
                    infoData:this.voucherDataList.data
                }
                this.$axios.post('http://10.0.15.3:8028/api/GCW/PVoucherMst/PostUpdate',qs.stringify(data),config)
                    .then(res=>{
                        res=JSON.parse(res);
                        console.log(res)
                        if(res.Status=='success'){
                            alert('保存成功!')
                            //this.$router.go(0);
                        }else{
                            alert('保存失败,请重试!')
                        }
                    })
                    .catch(err=>console.log(err))
            },
            voucherData(){//接收voucher组件传值************
                this.voucherDataList.data=this.$refs.voucher.voucherData();
                console.log( this.voucherDataList.data)
            },
           /* getvoucher(){
                var {config}=this.$ajax();
                var data={
                    uid:'0001',
                    orgid:52118082000000,
                    id:208181114000001
                }
                this.$axios.get('http://10.0.15.3:8028/api/GCW/PVoucherMst/GetVoucher',{params:data,headers:config.headers})
                    .then(res=>{
                        res=JSON.parse(res);
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
            },
            getvoucherList(){
                var {config}=this.$ajax();
                var data={
                    uid:'0001',
                    orgid:52118082000000,
                    pagesize:this.pagesize,
                    pageindex:this.pageindex,
                }
                this.$axios.get('http://10.0.15.3:8028/api/GCW/PVoucherMst/GetVoucherList',{params:data,headers:config.headers})
                    .then(res=>{
                        res=JSON.parse(res);
                        this.newAddList=res.Record;
                        if(this.newAddList.length<=0){
                            alert('暂无新凭证');
                        }
                    })
                    .catch(err=>console.log(err))
            },
            newVoucherList(){//获取最新新增凭证列表*****************
                var data={
                    "PhId": "266181114000001",
                    "PType": null,
                    "PNo": "1111",
                    "PDate": null,
                    "PAttachment": 0,
                    "PMonth": 12,
                    "PSource": null,
                    "PMakePerson": null,
                    "PFinancePerson": null,
                    "PKeepingPerson": null,
                    "PCashier": null,
                    "PAuditor": "0",
                    "PAuditorName": null,
                    "Verify": 0,
                    "OrgId": "0",
                    "OrgCode": null,
                    "Uyear": null,
                    "EnabledMark": 0,
                    "DeleteMark": 0,
                    "Description": "单元测试-636778027914703482",
                    "CreatorName": null,
                    "EditorName": null,
                    "Dtls": [{
                        "PhId": "266181114000001",
                        "PhidVouchermst": "266181114000001",
                        "SubjectCode": "1001",
                        "Abstract": "单元测试-636778027914703482",
                        "JSum": 110.00,
                        "DSum": 0.00,
                        "JForeignSum": 0.00,
                        "DForeignSum": 0.00,
                        "ExchangeRate": 0.00,
                        "AmountS": 0.00,
                        "AmountF": 0.00,
                        "Price": 0.00,
                        "SortCode": 1,
                        "DeleteMark": 0,
                        "Description": "借110",
                        "PhidTransaction": "0",
                        "DtlAccounts": null,
                        "ForeignKeys": [{
                            "PropertyName": "PhidVouchermst",
                            "ColumnName": "phid_vouchermst",
                            "IsPrimary": false,
                            "PropertyType": 2,
                            "Value": null,
                            "Direction": 0
                        }
                        ],
                        "BusinessPrimaryKeys": null,
                        "PersistentState": 0,
                        "NgRecordVer": 1,
                        "NgInsertDt": "2018-11-14 14:33:43",
                        "NgUpdateDt": "2018-11-14 14:33:43",
                        "Creator": "521180820000001",
                        "Editor": "521180820000001",
                        "CurOrgId": "521180820000002",
                        "_OldIdValue_": null,
                        "PropertyBytes": null,
                        "ExtendObjects": null
                    }, {
                        "PhId": "266181114000002",
                        "PhidVouchermst": "266181114000001",
                        "SubjectCode": "2001",
                        "Abstract": "单元测试-636778027914703482",
                        "JSum": 0.00,
                        "DSum": 110.00,
                        "JForeignSum": 0.00,
                        "DForeignSum": 0.00,
                        "ExchangeRate": 0.00,
                        "AmountS": 0.00,
                        "AmountF": 0.00,
                        "Price": 0.00,
                        "SortCode": 2,
                        "DeleteMark": 0,
                        "Description": "贷110",
                        "PhidTransaction": "0",
                        "DtlAccounts": [{
                            "PhId": "266181114000001",
                            "PhidVouchermst": "266181114000001",
                            "PhidVoucherDel": "266181114000002",
                            "JSum": 0.00,
                            "DSum": 110.00,
                            "JForeignSum": 0.00,
                            "DForeignSum": 0.00,
                            "AmountS": 0.00,
                            "AmountF": 0.00,
                            "Price": 0.00,
                            "ExchangeRate": 0.00,
                            "S01": "1",
                            "S02": "2",
                            "S03": "0",
                            "S04": "0",
                            "S05": "0",
                            "S06": "0",
                            "S07": "0",
                            "S08": "0",
                            "S09": "0",
                            "S10": "0",
                            "S11": "0",
                            "S12": "0",
                            "S13": "0",
                            "S14": "0",
                            "S15": "0",
                            "S16": "0",
                            "S17": "0",
                            "S18": "0",
                            "S19": "0",
                            "S20": "0",
                            "S21": "0",
                            "S22": "0",
                            "S23": "0",
                            "S24": "0",
                            "S25": "0",
                            "S26": "0",
                            "S27": "0",
                            "S28": "0",
                            "S29": "0",
                            "S30": "0",
                            "S31": "0",
                            "S32": "0",
                            "S33": "0",
                            "S34": "0",
                            "S35": "0",
                            "S36": "0",
                            "S37": "0",
                            "S38": "0",
                            "S39": "0",
                            "S40": "0",
                            "S41": "0",
                            "S42": "0",
                            "S43": "0",
                            "S44": "0",
                            "S45": "0",
                            "S46": "0",
                            "S47": "0",
                            "S48": "0",
                            "S49": "0",
                            "S50": "0",
                            "ForeignKeys": [{
                                "PropertyName": "PhidVouchermst",
                                "ColumnName": "phid_vouchermst",
                                "IsPrimary": false,
                                "PropertyType": 2,
                                "Value": null,
                                "Direction": 0
                            }
                            ],
                            "BusinessPrimaryKeys": null,
                            "PersistentState": 0,
                            "NgRecordVer": 1,
                            "NgInsertDt": "2018-11-14 14:33:44",
                            "NgUpdateDt": "2018-11-14 14:33:44",
                            "Creator": "521180820000001",
                            "Editor": "521180820000001",
                            "CurOrgId": "521180820000002",
                            "_OldIdValue_": null,
                            "PropertyBytes": null,
                            "ExtendObjects": null
                        }
                        ],
                        "ForeignKeys": [{
                            "PropertyName": "PhidVouchermst",
                            "ColumnName": "phid_vouchermst",
                            "IsPrimary": false,
                            "PropertyType": 2,
                            "Value": null,
                            "Direction": 0
                        }
                        ],
                        "BusinessPrimaryKeys": null,
                        "PersistentState": 0,
                        "NgRecordVer": 1,
                        "NgInsertDt": "2018-11-14 14:33:43",
                        "NgUpdateDt": "2018-11-14 14:33:43",
                        "Creator": "521180820000001",
                        "Editor": "521180820000001",
                        "CurOrgId": "521180820000002",
                        "_OldIdValue_": null,
                        "PropertyBytes": null,
                        "ExtendObjects": null
                    }
                    ],
                    "ForeignKeys": null,
                    "BusinessPrimaryKeys": null,
                    "PersistentState": 0,
                    "NgRecordVer": 1,
                    "NgInsertDt": "2018-11-14 14:33:43",
                    "NgUpdateDt": "2018-11-14 14:33:43",
                    "Creator": "521180820000001",
                    "Editor": "521180820000001",
                    "CurOrgId": "521180820000002",
                    "_OldIdValue_": null,
                    "PropertyBytes": null,
                    "ExtendObjects": null
                }
                this.voucherDataList.data=data;
            }*/
        },
        components:{
            voucher,
        }
    }
</script>

<style scoped>
    .addVoucher{
        width:100%;
        height:100%;
        overflow: scroll;
        text-align: left;
        padding:8px 18px;
        font-size:14px;
    }
    .unionState>.voucherDel{
        display: flex;
        width:100%;
        justify-content: flex-end;
        margin-bottom:10px;
        margin-right:20px;
    }
    .unionState>ul>li{
        margin-right:20px;
        width:33.33%;
    }
    .searcherCon{
        float:right;
        margin-right:50px;
        width:40%;
        min-width: 170px;
    }
    .unionState:after{
        content:"";
        clear:both;
        display: block;
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


    /*凭证新增*********************************/
  /*  .newAddTitle{
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
