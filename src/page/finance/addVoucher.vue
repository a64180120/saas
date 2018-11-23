<template>
    <div class="addVoucher">
        <div class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic">
                    <div>账期:</div>
                    <div class="selectContainer">
                        <select  v-model="userState">
                            <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </li>
            </ul>
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input type="text" placeholder="科目/摘要/凭证号"></div>
                <div  class="searcherBtn">搜索</div>
            </div>
            <ul class="flexPublic handle">
                <a @click.prevent="addVoucher('resolve')"><li>引入模板</li></a>
                <a @click.prevent="addVoucher('keepModel')"><li>保存为模板</li></a>
                <a @click.prevent="addVoucher('keepAdd')"><li>保存并新增</li></a>
                <a @click.prevent="addVoucher('keep')"><li>保存</li></a>
            </ul>
        </div>
        <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
        <div class="newAddContainer">
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
        </div>

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
            voucherDataList:{bool:true,data:''},
            userStateValues:[
                {id:0,name:'全部'},{id:1,name:'2018-11'},{id:2,name:'2018-12'},{id:3,name:'2019-01'}
            ],
            newAddList:[

            ]
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
            },*/
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
    .unionState>ul:first-of-type>li{
        width:150px;
    }
    .unionState>ul>li{
        margin-right:20px;
        width:33.33%;
    }
    .unionState>ul>li>div:first-of-type{
        width:60px;
        font-size: 14px;
        text-align: center;
    }
    .searcherCon{
        width:40%;
        min-width: 170px;
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


</style>
