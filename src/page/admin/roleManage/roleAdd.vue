<template>
  <div class="manageContent">
    <div class="unionState flexPublic">
      <ul class="flexPublic handle">
        <li>保存</li>
        <li>取消</li>
      </ul>
    </div>
    <div class="roleName">
      <div class="flexPublic">
        <span>角色名称</span>
        <div class="inputContainer"><input maxlength="8" placeholder="8位汉字以内" type="text"></div>
      </div>
      <div class="flexPublic">
        <span>备注</span>
        <div class="inputContainer"><input maxlength="15" placeholder="15位汉字以内" type="text"></div>
      </div>
    </div>
    <div class="formData">
      <ul>
        <li>序号</li>
        <li>用户名</li>
        <li>组织编码</li>
        <li>组织名称</li>
        <li>创建日期</li>
      </ul>
      <ul class="formDataItems flexPublic" v-for="item of userInfo" :key="item.uid">
        <li>{{item.uid}}</li>
        <li>{{item.uname}}</li>
        <li>{{item.orgId}}</li>
        <li>{{item.zuzhiname}}</li>
        <li>{{item.date}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
        name: "role-add"
    }
</script>

<style scoped>
  .container{
    padding:3px;
    display: flex;
    flex-flow:row nowrap;
    justify-content: start;
  }
  .manageContent{
    width:100%;
    text-align: left;
    padding:8px 18px;
    font-size:14px;
  }
  .unionState{
    justify-content: flex-end;
  }
  .unionState>ul>li{
    margin-right:20px;
    width:33.33%;

  }

  .unionState .handle>li{
    border:1px solid #ff9900;
    cursor:pointer;
    border-radius: 3px;
    text-align: center;
    min-width:60px;
    font-size:13px;
    height:30px;
    line-height: 30px;
    margin-left:10px;
    margin-right: 0;
  }
  .unionState .handle>li:hover{
    background: #ff9900;
    color:#fff;
  }
  .roleName{
    margin:20px 0;
  }
  .roleName>div{
    justify-content: flex-start;
    margin-bottom: 10px;
  }
  .roleName>div>span{
    width:90px;
    text-align: right;
    font-size: 18px;
    font-weight: 600;
    margin-right: 10px;
  }

  .formData{
    margin-top:10px;
  }
  .formData>ul:first-child{
    display:flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-size:13px;
  }
  .formData>ul:first-child{
    background: #2780d1;
    color:#fff;
  }
  .formData>ul>li{
    border-right:1px solid #fff;
    height:50px;
    line-height:50px;
    text-align: center;
    width:25%;
  }
  .formData>ul>li:nth-of-type(4){
    width:30%;
  }
  .formData>ul>li:nth-of-type(5){
    width:15%;
  }
  .formData>ul:first-child>li:last-of-type{
    width:15%;
    border-right:1px solid #2780d1;
  }

  .formData>ul>li:first-child{
    width:5%;
    min-width: 31px;
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
</style>
