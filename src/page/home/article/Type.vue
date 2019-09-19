<template>
    <div class="newAdd">
        <div class="newAddContent">
            <div class="newAddTitle flexPublic">
                <span>信息类别</span>
                <span @click.stop="cancle"></span>
            </div>
            <ul class="contentItem">
                <li>
                    <div>类别名称</div>
                    <div class="inputContainer">
                        <input type="text" v-model="formData.Name">
                    </div>
                    <div @click="fastCreate">立即创建</div>
                </li>
                <li>
                    <div>是否启用</div>
                    <div class="itemRadio">
                        <label><input type="radio" name="line" v-model="formData.EnabledMark" value="0">启用</label>
                        <label><input type="radio" name="line" v-model="formData.EnabledMark" value="1">停用</label>
                    </div>
                </li>
                <li>
                    <div class="btn" v-show="!typeUpdate" @click="btnShow('update')">修改</div>
                    <!--<div @click="btnShow('delete')">删除</div>-->
                    <div  class="btn" v-show="typeUpdate" @click="newAdd">保存</div>
                </li>
            </ul>
            <div class="formContainer">
                <ul class="formTitle">
                    <li>序号</li>
                    <li>类别编码</li>
                    <li>类别名称</li>
                    <li>启用/停用</li>
                </ul>
                <ul v-for="(item,index) of dataList" :key="index" class="formData">
                    <li>{{index+1}}</li>
                    <li>{{item.Code}}</li>
                    <li ><input style="width:100%;border:0;padding:0 10px" :disabled="!typeUpdate" type="text" v-model="item.Name"></li>
                    <li>
                        <i v-show="!updateCss[index].checked" :class="{newAddStateTrue:item.EnabledMark==0,newAddStateFalse:item.EnabledMark==1}"></i>
                        <div v-show="updateCss[index].checked">
                            <label><input type="radio" :name="item.Name" v-model="item.EnabledMark" @change="radioChange(item,index)" value=0>启用</label>
                            <label><input type="radio" :name="item.Name" v-model="item.EnabledMark" @change="radioChange(item,index)" value=1>停用</label>
                        </div>
                    </li>
                    <li><i @click.stop="deleteData(item,index)" v-show="deleteCss[index].checked"></i></li>
                </ul>


            </div>
        </div>
        <message :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></message>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import Auth from "@/util/auth";
    import {dealAddString} from "@/util/validate";

    export default {
        name: "articleType",
        props: {
            datalists: ''
        },
        created() {
        },
        mounted() {
            this.getData();
        },
        data() {
            return {
                typeUpdate:false,//分类修改
                formData: { Code: '', Name: '', EnabledMark: 0 },
                dataList: [],
                deleteList: [],
                updateCss: [],
                deleteCss: [],
                saasMessage:{}
            }
        },
        computed: {
            ...mapState({
                orgid: state => state.user.orgid,
                orgcode: state => state.user.orgcode,
                uid: state => state.user.userid,
                username: state => state.user.username,
                dbname:state => state.user.dbname,
                defultdbname: state => state.user.defultdbname
            })
        },
        methods: {
            getData() {
                let data = {
                    uid: this.uid,
                    orgid: this.orgid
                };

                this.$axios.get('/SysNews/GetSysNewsTypeList', {params: data})
                    .then(res => {
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }

                        this.dataList = res;
                        this.initCss();
                        this.typeUpdate=false;
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({showClose: true, message: "新闻类型获取错误", type: "error"});
                    })
            },
            //新增保存
            newAdd() {
                for(var da of this.dataList){
                    da.PersistentState = 2;
                }
                for(var del of this.deleteList){
                    this.dataList.push(del);
                }

                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    infoData: this.dataList,
                    value:this.dbname==this.defultdbname?1:0
                };

                var vm = this;
                const loading = this.$loading();
                this.$axios.post('/SysNews/PostAddType', data)
                    .then(res => {
                        loading.close();
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }

                        vm.$emit('type-click', true);
                        this.$message.success("类型保存成功!");

                    })
                    .catch(err => {
                        console.log(err)
                        loading.close();
                    })
            },
            //取消
            cancle() {
                this.$emit('type-click', false);
                return;
            },
            //立即创建
            fastCreate() {
                //名称不能为空
                if (this.formData.Name === '') {
                    this.$message.warning("请填写类别名称！");
                    return;
                }
                if (this.dataList.some(v => v.Name === this.formData.Name)){
                    this.$message.warning("类别名称重复！");
                    return;
                }

                var length=this.dataList.length;

                var lastCode= length==0?'0000' :this.dataList[length-1].Code;

                var addData = {
                    PersistentState: 1,
                    PhId: 0,
                    ParentId: 0,
                    Category: '',
                    Code: dealAddString(lastCode),
                    Name: this.formData.Name,
                    SortCode: length+1||1,
                    Description: '',
                    EnabledMark: this.formData.EnabledMark,
                };


                 var list=JSON.parse(JSON.stringify(this.dataList));
                 list.push(addData);
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    infoData: list,
                    value:this.dbname==this.defultdbname?1:0
                };

                var vm = this;
                this.$axios.post('/SysNews/PostAddType', data)
                    .then(res => {
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        this.getData();
                    })
                    .catch(err=>{

                    })
                // this.updateCss[this.dataList.length-1] = {checked: this.typeUpdate}
                // this.deleteCss[this.dataList.length-1] = {checked: this.typeUpdate}
                // //清除状态
                // this.$nextTick(() => {
                //     this.formData.Code = '';
                //     this.formData.Name = '';
                //     this.formData.EnabledMark = 0;
                // })
                //
                //
                // //this.initCss();
                // this.$forceUpdate();

            },
            deleteData(item, index) {
                //添加删除信息 和移除list的删除
                //数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3
                if(item.Category=='system'){
                    this.saasMessage={
                        message:'内置项无法删除!',
                        visible:true
                    }
                    return;
                }
                item.PersistentState = 3
                this.deleteList.push(item);
                this.dataList.splice(index, 1);

                this.initCss();
                this.btnShow('delete');
            },
            initCss() {
                for (var i in this.dataList) {
                    this.updateCss[i] = {checked: false}
                    this.deleteCss[i] = {checked: false}
                }
            },
            radioChange(item, index) {
                //数据状态 PersistentState: Added = 1, Modified = 2, Deleted = 3

                //if (this.dataList.some(v => v.PhId === item.PhId)) return
                if(item.PersistentState==1)
                {
                    this.dataList.splice(index,1,item);
                }else{

                    item.PersistentState = 2
                    this.dataList.splice(index,1,item);
                }

            },
            //按钮事件
            btnShow(val) {
                if(val=='update'){

                    this.typeUpdate=true;
                }
                for(var del of this.deleteCss){
                    del.checked=this.typeUpdate;
                }
                for(var up of this.updateCss){
                    up.checked=this.typeUpdate;
                }
                this.$forceUpdate();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .newAdd{
        width:100%;
        height:100%;
        position: fixed;
        z-index:99;
        top:0;
        left:0;
        background: rgba(0,0,0,0.5);
    }
    .newAddContent{
        background: #fff;
        overflow: hidden;
        position:absolute;
        left:28%;
        top:20%;
        width:600px;
        .newAddTitle{
            background: #00b7ee;
            border-radius: 8px;
            height:40px;
            line-height: 40px;
            width:100%;
            color:#fff;
            padding:0 10px;
            font-size: 16px;
            span:last-of-type{
                width:25px;
                height:25px;
                border-radius: 50%;
                background: #fff;
                position: relative;
                &::after,&::before{
                    content:"";
                    position: absolute;
                    width:15px;
                    height:1px;
                    background: #00b7ee;
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
        .contentItem{
            padding:10px 10px 0 10px;
            font-size: 15px;
            li{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                height:30px;
                line-height: 30px;
                margin-bottom: 10px;
                div{
                    height:100%;
                    margin-right:5px;
                    &:first-of-type{
                        min-width:70px;
                    }
                    &:nth-of-type(2){
                        width:80%;
                    }
                    &:nth-of-type(3){
                        min-width:70px;
                        background: #00b7ee;
                        border-radius: 3px;
                        color:#fff;
                        text-align: center;
                        cursor:pointer;
                    }
                }
                &:nth-of-type(3){
                    justify-content: flex-end;
                }
                &:nth-of-type(3)>div{
                    width:70px;
                    margin-left: 5px;

                    text-align: center;
                    cursor:pointer;
                    border-radius: 3px;
                }

                &:nth-of-type(3)>div:after{
                    content:"";
                    display: block;
                    clear: both;
                }
            }
        }
    }
    .itemRadio{
        letter-spacing: 3px;
        label{
            input{
                margin-right:3px;
            }
        }
    }
    .itemBtnCon{
        border-top: 1px solid #ccc;
        padding:0 20px;
        height:40px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        div{
            width:70px;
            background: #00b7ee;
            text-align: center;
            border-radius: 3px;
            border:1px solid #00b7ee;
            height:30px;
            line-height: 26px;
            font-size: 14px;
            color:#fff;
            margin-left: 10px;
            cursor: pointer;
            &:hover{
                background:#fff;
                color:#00b7ee;
            }
        }
    }
    .formContainer{
        padding:10px 20px 10px 10px;
        overflow-y: auto;
        height:250px;
        ul{
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            width:550px;
            &.formData{
                margin:0;
            }
            &:first-of-type{
                background: #ccc;
                li{
                    border-right-color:#fff;
                    &:last-of-type{
                        border-right-color:#ccc;
                    }
                }
            }
            &:last-of-type{
                border-bottom: 1px solid #ccc;
            }
            li{
                border-top:1px solid #ccc;
                border-right:1px solid #ccc;
                width:25%;
                height:25px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                position:relative;
                &:first-of-type{
                    border-left: 1px solid #ccc;
                }
                &:first-of-type{
                    width:10%;
                }
                &:nth-of-type(2){
                    width:30%;
                }
                &:nth-of-type(3){
                    width:35%;
                }
                &:nth-of-type(4){
                    width:25%;
                }
                &:nth-of-type(5){
                    width:0;
                    border:0;
                    i{
                        position: absolute;
                        right:-23px;
                        top:0;
                        width:25px;
                        height:25px;
                        cursor:pointer;
                        background: url("../../../assets/icon/delete_fill.svg");
                        background-size:cover ;
                        &:hover{
                            background: url("../../../assets/icon/delete.svg");
                            background-size:cover ;
                        }
                    }
                }
            }
        }
    }
    li i.newAddStateTrue:after{
        top:0px;
    }
    label{margin-left:10px;}
</style>

