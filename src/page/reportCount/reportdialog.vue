<template>
    <div  class="BudgetcountCon" style="z-index:9999999">
        <div class="Budgetcount">
            <p><span>提示</span><i @click="updateHide" class="el-icon-close"></i></p>
            <div style="text-align: left;margin:20px;color: #00B8EE;"><i class="el-icon-s-order"></i>请选择要汇总的报表</div>
            <select class="el-input__inner"  v-model="chooseOp" placeholder="点击选择" @change="routerTo">
                <option
                    v-for="item in chooseList"
                    :value="item.value"
                >{{item.label}}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
    import  {mapState,mapMutations} from 'vuex'
    export default {
        name: "reportdialog",
        data(){
            return{
                chooseOp:'',
                chooseList:[{value:0,label:'资产负债表'},{value:1,label:'收入支出表'},{value:2,label:'往来款项明细表'}],
            }
        },
        props:{

        },
        computed: {
            tagNavList() {
                return this.$store.state.tagNav.openedPageList;
            },
        },
        methods:{
            updateHide(){
                var path=this.$route.fullPath;
                this.$router.push(path);
                //this.$store.commit('updateRouterToReportcount',false);
                this.$router.push({path:'/home'})
                this.$store.commit('tagNav/removeTagNav',this.$route)
            },
            routerTo(){
                this.$router.push({path:'/report/reportaccount',query:{checkedBudget:this.chooseOp}})
                this.$store.commit('updateRouterToReportcount',false);
                this.$store.commit('tagNav/removeTagNav',this.$route)
            }
        },
        computed:{
            ...mapState({

            }),
            ...mapMutations({

            })
        }
    }
</script>

<style scoped lang="scss">
    .BudgetcountCon{
        position:fixed;
        position:-ms-page;
        left:0;
        right:0;
        top:0;
        bottom:0;
        background: rgba(0,0,0,0.5);
        text-align: center;
        &:after{
            width:0;
            height:100%;
            display: inline-block;
            content:'';
            vertical-align: middle;
        }

        >.Budgetcount{
            display: inline-block;
            width:600px;
            height:270px;
            background: #fff;
            box-shadow: 0 0 2px #ccc;
            vertical-align: middle;
            padding:10px 5px;
            font-size: 18px;
            border-radius: 4px;
            >p{
                text-align: left;
                border-bottom: 1px solid #333;
                padding:0 5px 5px 5px;
                font-weight: bold;
                color:#333;
                >i{
                    float:right;
                    font-size: 20px;
                    cursor:pointer;
                    &:hover{
                        color:#ccc;
                    }
                }
            }
            .licontent{
                padding-top:30px;

                >li{
                    float:left;
                    width:33.33%;

                    color:#1296db;
                    font-weight: bold;
                    padding:20px 30px;

                    >div{
                        cursor:pointer;
                        &:hover{
                            box-shadow: 0 0px 2px #aaa;
                            border-radius: 3px;
                        }
                    }
                    >div>p{
                        margin-top:10px;
                    }
                }
            }
        }
    }
    .el-icon-s-order{
        font-size: 23px;
        vertical-align: middle;
        padding-right: 10px;
    }
</style>
