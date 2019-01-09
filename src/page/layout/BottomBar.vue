<template>
    <div>
        <div class="navtitle">
            <el-button type="success" round size="small"  @click="Navingclick()">导航</el-button>
        </div>
        <div class="sys-footer">
            <transition name="move" mode="out-in" appear>
                <nav-bar v-show="barshow" :isCollapse="collapsevule"></nav-bar>
            </transition>
        </div>
         
    </div>
    
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NavBar from './NavBar'

export default {
    data() {
        return {
            collapsevule:this.isCollapse,
            barshow:false
        }
    },
    props: ["isCollapse"],
    computed: {
        ...mapState({
            username: state => state.user.name,
            lang: state => state.lang
        })
    },
    components:{
        NavBar
    },
    methods: {
        Navingclick(){
            //console.log('123456')
            var old=this.barshow;
            this.barshow=!old;
        }
    }
}
</script>
<style lang="scss" scoped>
.sys-footer{
    display: flex;
    position: absolute;
    box-shadow: 0 1px 8px #b3acac;
    border-color: #ccc;
    background: #fff;
    height: 60px;
    left: 60px;
    border-bottom: 1px solid #00B8EE;
    z-index: 20;
    bottom: 0;

    .move-enter-active{
        opacity: 1;
        transform: translate3d(0, 0, 0)
    }
    .move-enter, .move-leave{
        opacity: 0;
        transform: translate3d(24px, 0, 0)
    }

}

.navtitle{
    display: flex;
    position: absolute;
    background: #fff;
    width: 60px;
    height: 60px;
    z-index: 21;
    bottom: 0;
}
</style>