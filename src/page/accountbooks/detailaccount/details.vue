<template>
        <div class="manageContent">
            <div class="unionState flexPublic">
                <ul class="flexPublic">
                    <li class="flexPublic">
                        <div>账期:</div>
                        <div class="selectContainer">
                            <select  v-model="userState">
                                <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.uname}}</option>
                            </select>
                        </div>
                        <div>至</div>
                        <div class="selectContainer">
                            <select  v-model="userState">
                                <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.uname}}</option>
                            </select>
                        </div>
                    </li>
                </ul>
                <div class="flexPublic searcherCon">
                    <div class="searcherValue"><input type="text" placeholder="组织编码/名称"></div>
                    <div  class="searcherBtn">搜索</div>
                </div>
                <ul class="flexPublic handle">
                    <a href=""><li>打印</li></a>
                    <a href=""><li>导出</li></a>
                </ul>
            </div>
            <div class="flexPublic manageContent p0">
                <div class="unionLists">
                    <p class="unionListsTitle">科目列表</p>
                    <div class="unionListsContent">
                        <ul>
                            <li v-for="(sheng,index) of subjectLists" :key="index">
                                <div @click="unionListOpen" :class="{moreList:subjectLists.length>1}">{{sheng.sheng}}</div>
                                <ul>
                                    <li v-for="(shi,index2) of sheng.child" :key="index2">
                                        <div @click="unionListOpen" :class="{moreList:shi.child.length>1}">{{shi.shi}}</div>
                                        <ul>
                                            <li v-for="(xian,index3) of shi.child" :key="index3">
                                                <div @click="unionListOpen" :class="{moreList:xian.child.length>1}">{{xian.xian}}</div>
                                                <ul>
                                                    <li v-for="(union,index4) of xian.child" :key="index4">{{union}}</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="formData">
                    <ul>
                        <li>凭证日期</li>
                        <li>凭证字号</li>
                        <li>摘要</li>
                        <li>借方金额(元)</li>
                        <li>贷方金额(元)</li>
                        <li>方向</li>
                        <li>余额(元)</li>
                    </ul>
                    <ul class="formDataItems flexPublic" v-for="item of dataInfo" :key="item.uid">
                        <li>{{item.Pdate.slice(0,10)}}</li>
                        <li :title="item.Pno">{{item.Pno}}</li>
                        <li>{{item.Abstract}}</li>
                        <li>{{item.JSum}}</li>
                        <li :title="item.DSum">{{item.DSum}}</li>
                        <li >{{JD[item.DType]}}</li>
                        <li>{{item.Balance}}</li>
                    </ul>
                </div>
            </div>
        </div>
</template>

<script>
    import {delList} from '../../../api/detailaccount/details.js'
    export default {
        name: "user",
        data() {
            return {
                JD: ['平', '借', '贷'],
                subjectLists: [
                    {
                        sheng: "科目",
                        child: [
                            {
                                shi: '101 库存现金',
                                child: [
                                    {
                                        xian: '西湖区',
                                        child: ['政云工会', '相符工会', '666']
                                    }
                                ]
                            },
                            {
                                shi: '141 库存物品',
                                child: []
                            },
                            {
                                shi: '102 银行存款',
                                child: [
                                    {
                                        xian: '西湖区',
                                        child: ['政云工会', '相符工会', '666']
                                    }
                                ]
                            },
                        ]
                    }
                ],
                userState: 0,
                userStateValues: [{id: 0, uname: '全部'}, {id: 1, uname: '启用'}, {id: 2, uname: '停用'}, {
                    id: 3,
                    uname: '临时停用'
                }],
                dataInfo: []
            }
        },
        created() {
            this.getData();
        },
        mounted() {

        },
        methods: {
            getData() {
                var data = {
                    org: 0,
                    orgid: 0,
                    Kcode: '999',
                    Year: '2018',
                }
             /*   var vm = this;
                console.log(this.$delList)
                this.delList(vm, data)
                    .then(res => console.log(res))*/
                 this.$axios.get("http://10.0.45.51:8028/api/GCW/PVoucherMst/GetDetailAccount",{params:data})
                    .then(res=>{
                        this.dataInfo=res.Record;
                    })
                    .catch(err=>console.log(err))

            },
            unionListOpen($event) {
                var e = $event.target;
                if (e.className == "moreList") {
                    e.className = "moreList moreListOpen";
                    e.nextElementSibling.style.display = 'none';
                }
                else if (e.className == "moreList moreListOpen") {
                    e.className = "moreList"
                    e.nextElementSibling.style.display = 'block';
                }
            }
        },
    }
</script>

<style scoped>
    .unionState>ul>li{
        width:100%;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2){
        width:15%;
    }
    .formData>ul>li:nth-of-type(3){
        width:24%;
    }
    .formData>ul>li:nth-of-type(4){
        width:18%;
    }
    .formData>ul>li:nth-of-type(5){
        width:18%;
    }
    .formData>ul>li:nth-of-type(6){
        width:5%;
    }
    .formData>ul>li:nth-of-type(7){
        width:10%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #2780d1;
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 70px;
        padding:0 2px;
    }


    .formDataItems{

        border-bottom:1px solid #ddd;
    }
    .formData>ul.formDataItems>li{
        border-right:1px solid #ddd;
        border-left:0;
        border-bottom:0;
        text-align: center;
        line-height: 40px;
        height:40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .unionLists{
        width:20%;
        align-self: flex-start;
        margin-right: 10px;
        margin-top: 10px;
    }
    .manageContent:before{
        content:"";
        display: inline-block;
    }
    .unionLists~.formData{
        width:80%;
        align-self: flex-start;
    }
    .unionLists>p{
        text-align: center;
        background: #83c350;
        height:50px;
        line-height: 50px;
        color:#fff;
        font-size: 15px;
        margin-bottom: 5px;

    }
    .unionListsContent ul{
        padding-left: 15px;
        position: relative;
    }
    .unionListsContent ul:before{
        content:"";
        height:100%;
        width:1px;
        border-left:1px dotted #aaa;
        position: absolute;
        left:7.5px;
    }
    .unionListsContent ul>li{
        position: relative;
        cursor: pointer;
    }
    .unionListsContent ul>li:before{
        content:"";
        position: absolute;
        width:7.5px;
        left:-7.5px;
        top:9px;
        border-top: 1px dotted #aaa;
    }
    .unionListsContent ul>li:last-child:after{
        content:"";
        height:100%;
        width:7.5px;
        position: absolute;
        left:-7.5px;
        top:10px;
        background: #fff;
    }
    div.moreList{
        position:relative;
    }
    div.moreList:before{
        content:"-";
        display: block;
        width:10px;
        height:10px;
        line-height: 10px;
        text-align: center;
        border:1px solid #333;
        background: #d5f3fe;
        position:absolute;
        left:-12px;
        top:3px;
        color:#333;
        z-index: 2;
    }
    div.moreListOpen:before{
        content:"+";
        line-height: 8px;
    }

</style>
