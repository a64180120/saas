<template>
    <div class="navtabCon">
        <ul class="navtab">
            <li @click="navSelect('finance')" :class="{active:activeTab=='finance'}">
                <img v-show="activeTab!='finance'" src="@/assets/images/datadriver/SAAS_tb4-1.png">
                <span v-show="activeTab=='finance'">财务运行</span>
            </li>
            <li @click="navSelect('accounting')" :class="{active:activeTab=='accounting'}">
                 <img v-show="activeTab!='accounting'" src="@/assets/images/datadriver/SAAS_tb1-1.png">
                <span v-show="activeTab=='accounting'">做账监督</span>
            </li>
            <li @click="navSelect('rank')" :class="{active:activeTab=='rank'}">
                 <img v-show="activeTab!='rank'" src="@/assets/images/datadriver/SAAS_tb5-1.png">
                <span v-show="activeTab=='rank'">收支排名</span>
            </li>
            <li @click="navSelect('store')" :class="{active:activeTab=='store'}">
                 <img v-show="activeTab!='store'" src="@/assets/images/datadriver/SAAS_tb8-1.png">
                <span v-show="activeTab=='store'">报表仓库</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:'navtab',
    data(){
        return {
            activeTab:'finance',
        }
    },
    mounted(){
        console.log(this.$route)
        if(this.$route.path=="/datadriver/rank"){
            this.activeTab='rank' 
        }else if(this.$route.path=="/datadriver/finance"){
            this.activeTab='finance'
        }else if(this.$route.path=="/datadriver/accounting"){
            this.activeTab='accounting'
        }else if(this.$route.path=="/datadriver/store"){
            this.activeTab='store'
        }
    },
    methods:{
        navSelect(str){
            this.activeTab=str;
            this.$router.push('/datadriver/'+str);
        }
    }

}
</script>

<style lang="scss" scoped>
.navtabCon{
    position: fixed;
    position:-ms-page;
    left:0;
    top:45%;
    height:150px;
    .navtab{
        >li{
            width:36px;
            text-align: center;
            background: #0f3b5e;
            height: 30px;
            margin-top: 3px;
            border-radius:0 4px 4px 0  ;
            line-height: 30px;
            color:#fff;
            cursor:pointer;
            overflow: hidden;
            transition: all 0.2s linear;
            >img{
                width:30px;
                height:30px;
            }
            &.active{
                width:76px;
            }
        }
    }
}
</style>
