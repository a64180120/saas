<template>
    <div>
        <div class="tips">提示：桌面个性化设置至少要显示4个版块，否则不允许保存。版块之间可以拖动，从而改变版块在首页的位置。</div>
        <draggable
            class="board-column-content"
            :list="panelList"
        @change="showChange">
            <template v-for="(item,index) in panelList" v-if="
            item.ModularCode=='001'&&Roleauthorize.homePage_voucherEntry!=0||
            item.ModularCode=='002'&&Roleauthorize.homePage_checkOut!=0||
            item.ModularCode=='003'&&Roleauthorize.homePage_regulation!=0||
            item.ModularCode=='004'&&Roleauthorize.homePage_workNotice!=0||
            item.ModularCode=='005'&&Roleauthorize.homePage_sysMessage!=0||
            item.ModularCode=='006'&&Roleauthorize.homePage_memorial!=0||
            item.ModularCode=='007'&&Roleauthorize.homePage_unitNews!=0||
            item.ModularCode=='008'&&Roleauthorize.homePage_reportCenter!=0||
            item.ModularCode=='009'&&Roleauthorize.homePage_accountBalance!=0||
            item.ModularCode=='010'&&Roleauthorize.homePage_subsidy!=0||
            item.ModularCode=='011'&&Roleauthorize.homePage_payment!=0||
            item.ModularCode=='012'&&Roleauthorize.homePage_delivery!=0">
                <div class="board-item" >
                    <div class="dragPanel">
                        {{item.ModularName}}
                    </div>
                    <div class="eyeArea">
                        <i class="el-icon-view" :class="{active: item.EnabledMark=='0'}" @click="showAye(index,true)"></i>
                        <i class="el-icon-view" :class="{active: item.EnabledMark=='1'}" @click="showAye(index,false)"><span style="position: absolute;left: 32px;">/</span></i>
                    </div>
                </div>

            </template>

            <div class="cover" :style="{top:Math.floor(panelList.length/4)*120+'px',left:(panelList.length%4)*25+'%'}"></div>
        </draggable>
        <div class="btnArea">
            <el-button class="cancelBtn" @click="$emit('close')">取消</el-button>
            <el-button class="confirmBtn" @click="save">保存</el-button>
        </div>
        <message :message="saasMessage.message"
                 :delay="saasMessage.delay"
                 :visible.sync="saasMessage.visible"
                 :callback="saasMessage.callback">
        </message>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import { mapState, mapActions } from 'vuex'
    import Auth from "@/util/auth";
    export default {
        name: "index",
        props:{
            homeAreaList:{
                type: Array,
                default(){
                    return []
                }
            }
        },
        data(){
            return{
                panelList:[],
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
            }
        },
        components: {
            draggable
        },
        //计算属性
        computed: {
            ...mapState({
                orgid: state => state.user.orgid,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                uid: state => state.user.userid,
                Roleauthorize: state => state.user.Roleauthorize,//按钮权限
            })
        },
        mounted(){
            this.panelList=JSON.parse(JSON.stringify(this.homeAreaList));
        },
        watch:{
            homeAreaList:{
                handler(val){
                    this.panelList=JSON.parse(JSON.stringify(this.homeAreaList));
                },
                deep:true
            }
        },
        methods:{
            showChange(val){
                console.log(val);
                console.log(this.panelList)
            },
            save: function() {
                console.log('保存')
                let uinfo=Auth.getUserInfoData();
                for( var i in this.panelList ){
                    this.panelList[i].SortCode=i+1;
                    this.panelList[i].PersistentState=2;
                }
                this.homeAreaList= this.panelList;
                let param={
                    uid:this.uid,
                    uAccount:uinfo.userInfo.Account,
                    infoData: this.panelList,
                }
                this.$axios.post('/SysShowbypeople/PostUpdateShowByPeoList',param).then( res=>{
                    console.log(res)
                    if(res.Status){
                        this.saasMessage = {
                            visible: true,
                            message: res.Msg,
                            callback: this.$emit('getData')
                        }
                    }
                } ).catch( err=>{
                    console.log(err)
                })
            },
            showAye(index,flag){
                console.log(this.panelList[index].EnabledMark)
                this.$set(this.panelList[index],'EnabledMark', flag?0:1);
                console.log(this.panelList[index].EnabledMark)
               // this.panelList[index].EnabledMark=(flag?0:1)    //true-显示，false，隐藏
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tips{
        color: red;
        padding-left: 10px;
    }
    /deep/.board-column-content{
        position: relative;
        background: linear-gradient(135deg, #00dcff 15%, #5b99de 45%, #944af7 100%);

        .board-item{
            display: inline-block;
            width: 25%;
            height: 120px;
            background-color: inherit;
            border: 10px solid #fff;
            position: relative;
            font-size: 20px;
            .dragPanel{
                width: 100%;
                height: 100px;
                background-color: rgba( 0, 0, 0, 0.2 );
                color: #fff;
                line-height: 100px;
                text-align: center;
                position: relative;
                z-index: 2;
                cursor: pointer;
                &:hover{
                    background-color: rgba( 0, 0, 0, 0);
                }
            }
            .eyeArea{
                position: absolute;
                right: 5px;
                bottom: 0px;
                z-index: 9;
                cursor: pointer;
                .el-icon-view{
                    color: #fff;
                }
                .active{
                    color: #ffeb00 !important;
                }
            }
        }
        .cover{
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #fff;
        }
    }
    .btnArea{
        text-align: center;
    }
    .cancelBtn{
        border: 1px solid #00B8EE;
        color: #00B8EE;
        background:#FFF ;
        padding: 10px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .confirmBtn{
        border: 1px solid #00B8EE;
        color: #fff;
        background: #00B8EE;
        padding: 10px 15px;
        width: 100px;
        border-radius: 3px;
    }
</style>
