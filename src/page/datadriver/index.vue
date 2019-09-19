<template>
    <div class="dataCon">

        <data-head></data-head>
        <router-view/>
        <navtab></navtab>
    </div>
</template>

<script>
import dataHead from '@/page/datadriver/head'
import navtab from './navtab'
export default {
    name:'datadriver',
    components:{
        dataHead,
        navtab
    }
}
</script>

<style lang="scss" scoped>
.dataCon{
    width:100%;
    height:100%;
    min-width:1250px;
    overflow: hidden;
    background:url(../../assets/images/datadriver/bj.jpg)
}
</style>
