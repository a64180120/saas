<template>
    <div  class="BudgetcountCon" style="z-index:99999999">
        <div class="Budgetcount">
                <p><span>请选择要查看、汇总的预算内容：</span><i @click="updateHide" class="el-icon-close"></i></p>
                <div>
                    <ul class="licontent">
                        <li>
                            <div @click.stop="routerTo(0)">
                                <div><img src="@/assets/images/sb.png" alt=""></div>
                                <p>年初申报</p>
                            </div>
                        </li>
                        <li>
                            <div @click.stop="routerTo(1)">
                                <div><img width="87px" src="@/assets/images/js.png" alt=""></div>
                                <p>年中调整</p>
                            </div>

                        </li>
                        <li>
                            <div @click.stop="routerTo(2)">
                                <div><img width="88px" src="@/assets/images/tz.png" alt=""></div>
                                <p>年末决算</p>
                            </div>
                        </li>
                    </ul>
                </div>
        </div>
    </div>
</template>

<script>
    import  {mapState,mapMutations} from 'vuex'
    export default {
        name: "index",
        data(){
            return{

            }
        },
        props:{

        },
        methods:{
            updateHide(){
                var path=this.$route.fullPath;
                this.$router.push(path);
                this.$store.commit('updateRouterToBudgetcount',false);
            },
            routerTo(val){
                this.$router.push({path:'/budget/budgetcount',query:{checkedBudget:val}})
                this.$store.commit('updateRouterToBudgetcount',false);
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
</style>
