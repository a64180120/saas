<template>
    <div class="break-page">
         <a  class="btn btn2" @click.prevent="back">刷新</a>
    </div>
</template>

<script>
export default {
    methods: {
        back(){
            this.$router.push('/index')
        }
    }
}
</script>
<style lang="scss" scoped>
    .break-page{
        height: 100%;
        width: 100%;
        text-align: center;
        background: url("../../assets/images/sys_error.png") no-repeat fixed center;
    }
    .btn2{
        margin-top:20px;
        background: #007aff;
        border:1px solid #007aff;
    }
    .btn2:hover{
        background: #fff;
        color:#007aff;
    }
</style>
