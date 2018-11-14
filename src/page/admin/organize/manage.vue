<template>
    <div class="manage">
        <section class="container">
            <aside class="asideNav">
              <ul>
                <li @click="unionTab('/basic')" :class="{asideActive:asideActive=='/basic'}">基层工会组织</li>
                <li @click="unionTab('/union')" :class="{asideActive:asideActive=='/union'}">机关工会组织</li>
                <li @click="unionTab('/look')" :class="{asideActive:asideActive=='/look'}"><i>4</i>待审核基层组织</li>
              </ul>
            </aside>
              <router-view></router-view>
        </section>
    </div>
</template>

<script>
    export default {
        name: "manage",
        data(){
          return {
            asideActive:'/basic',
            pickerOptions1: {
              disabledDate(time) {
                return time.getTime() > Date.now();
              },
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }]
            },
            value1: '',
            value2: '',
          }
        },
        methods:{
          showdata(item){
            console.log(item)
          },
          unionTab(url){
            this.$router.push('/admin/orgin'+url);
            this.asideActive=url;
            sessionStorage.setItem("asideActive",url);//**防止刷新数据清空************* */
          }
        },
      mounted(){
          if(sessionStorage.getItem("asideActive")){
            this.asideActive=sessionStorage.getItem("asideActive");
          }

      }
    }
</script>

<style scoped>

  .manage{
    min-width: 1024px;
      height:100%;
  }
  .manageHead{
    background: #969ead;
    text-align: left;
    height:50px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    color:#fff;
    font-size: 15px;
    margin-right:18px;
  }
  .pageHandle{
    width:10%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    position:relative;
  }
  .pageHandle>span{
    position:relative;
  }
  .pageHandle>span:after{
    content:"";
    border:1px solid #fff;
    border-width:0 1px 1px 0;
    -moz-transform: rotate(45deg);
    transform: rotate(45deg);
    position:absolute;
    right:-20px;
    width:10px;
    height:10px;
  }
  .title{
    height:100%;
    width:90%;
    position:relative;
  }
  .title>ul{
    padding:0 40px;
    list-style: none;
    height:100%;
    margin:0;
  }
  .title>ul>li{
    float:left;
    height:93%;
    margin:2px 0;
    padding:0 10px;
    line-height: 50px;
    background: #fff;
    color:#333;
    font-size:14px;
  }
  .title>img{
    height:40px;
    position:absolute;
    top:5px;
  }
  .title>img:last-of-type{
    right:0;
  }
  .container{
    padding:3px;
      width:100%;
      height:100%;
      overflow: hidden;
    display: flex;
    flex-flow:row nowrap;
    justify-content: start;
  }
  .asideNav>ul{
    width:25px;
    font-size:13px;
  }
  .asideNav>ul>li{
    padding:20px 4px;
    position:relative;
    cursor: pointer;
  }
  .asideNav>ul>li>i{
    font-style: normal;
    position: absolute;
    top:0px;
    right:-10px;
    width:20px;
    height:20px;
    line-height:20px;
    text-align: center;
    background: red;
    color:#fff;
    border-radius: 50%;
  }
  .asideNav>ul>li.asideActive{
    background:#ff9900;
    color:#fff;
    }
.manageContent{
  width:100%;
  text-align: left;
  padding:8px 18px;
  font-size:14px;
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

  .seacherValue{
    border:1px solid #ddd;
    border-radius: 10px 0 0 10px ;
    overflow: hidden;
    padding-left:10px;
  }
  .seacherValue>input{
    width:139px;
    height:30px;
    outline: none;
    margin:0;
    font-size: 14px;
    border:0;
  }
  .seacherBtn{
    height:30px;
    width:60px;
    text-align: center;
    line-height: 30px;
    background:#509edc;
    color:#fff;
    cursor:pointer;
  }


</style>
