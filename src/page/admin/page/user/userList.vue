<template>
    <div class="user" >
      <div class="manageContent">
        <div class="unionState flexPublic">
          <ul class="flexPublic">
            <li class="flexPublic">
              <div>地区:</div>
              <div class="selectContainer">
                <select  v-model="userState">
                  <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.uname}}</option>
                </select>
              </div>
            </li>
          </ul>
          <div class="flexPublic searcherCon">
            <div class="searcherValue"><input type="text" placeholder="组织编码/名称"></div>
            <div  class="searcherBtn">搜索</div>
          </div>
          <ul class="flexPublic handle">
            <router-link to="/environment/add"><li>添加</li></router-link>
            <router-link to="/environment/add"><li>修改</li></router-link>
            <router-link to="/environment/add"><li>密码重置</li></router-link>
            <router-link to="/environment/add"><li>发送邀请码</li></router-link>
          </ul>
        </div>
        <div class="flexPublic manageContent p0">
          <div class="unionLists">
            <p class="unionListsTitle">工会组织列表</p>
            <div class="unionListsContent">
              <ul>
                <li v-for="(sheng,index) of unionLists" :key="index">
                  <div @click="unionListOpen" :class="{moreList:unionLists.length>1}">{{sheng.sheng}}</div>
                  <ul>
                    <li v-for="(shi,index2) of sheng.child" :key="index2">
                      <div @click="unionListOpen" :class="{moreList:sheng.child.length>1}">{{shi.shi}}</div>
                      <ul>
                        <li v-for="(xian,index2) of shi.child" :key="index2">
                          <div @click="unionListOpen" :class="{moreList:xian.child.length>1}">{{xian.xian}}</div>
                          <ul>
                            <li v-for="(union,index3) of xian.child" :key="index3">{{union}}</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="formData">
            <ul>
              <li>序号</li>
              <li>用户编码</li>
              <li>用户名称</li>
              <li>手机号码</li>
              <li>所属工会</li>
              <li>用户状态</li>
            </ul>
            <ul class="formDataItems flexPublic" v-for="item of userManageInfo" :key="item.uid">
              <li>{{item.id}}</li>
              <li :title="item.userId">{{item.userId}}</li>
              <li>{{item.uname}}</li>
              <li>{{item.phone}}</li>
              <li :title="item.owner">{{item.owner}}</li>
              <li ><i :class="{userState0:item.ustate==0,userState1:item.ustate==1,userState2:item.ustate==2,}">!</i></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "user",
      data(){
          return{
            unionCss:false,
            unionLists:[
              {
                sheng:"浙江省",
                child:[
                  {
                    shi:'杭州市',
                    child:[
                      {
                        xian:'西湖区',
                        child:['政云工会','相符工会','666']
                      }
                    ]
                  },
                ]
              },
              {
                sheng:"浙江省",
                child:[
                  {
                    shi:'杭州市',
                    child:[
                      {
                        xian:'西湖区',
                        child:['政云工会','相符工会','666']
                      }
                    ]
                  },
                ]
              }
            ],
            userState:0,
            userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}],
            userManageInfo:[
              {id:1,userId:'33010100000_001',uname:'单位管理员',phone:'15168899870',owner:'杭州政云数据技术有限公司工会',ustate:'0'},
              {id:2,userId:'33010100000_002',uname:'主席',phone:'15168899870',owner:'杭州政云数据技术有限公司工会',ustate:'1'},
              {id:3,userId:'33010100000_003',uname:'财务主管',phone:'15168899870',owner:'杭州政云数据技术有限公司工会',ustate:'2'}
            ]
          }
      },
      mounted(){

      },
      methods:{
        unionListOpen($event){
          var e=$event.target;
          if(e.className=="moreList"){
            e.className="moreList moreListOpen";
            e.nextElementSibling.style.display='none';
          }
          else if(e.className=="moreList moreListOpen"){
            e.className="moreList"
            e.nextElementSibling.style.display='block';
          }
        }
      }
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
  .unionState>ul:first-of-type>li{
    width:150px;
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
  .searcherCon{
    width:40%;
    min-width: 170px;
  }
  .searcherValue{
    border:1px solid #ddd;
    border-radius: 10px 0 0 10px ;
    overflow: hidden;
    padding-left:10px;
  }
  .searcherValue{
    width:80%;
  }
  .searcherValue>input{
    width:100%;
    height:30px;
    outline: none;
    margin:0;
    font-size: 14px;
    border:0;
  }
  .searcherBtn{
    height:30px;
    width:20%;
    text-align: center;
    line-height: 30px;
    background:#509edc;
    color:#fff;
    cursor:pointer;
  }
  .unionState .handle>a>li{
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
  .unionState .handle>a>li:hover{
    background: #ff9900;
    color:#fff;
  }
  .unionState .handle>a:nth-of-type(4)>li{
    min-width: 70px;
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
    width:20%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .formData>ul>li:nth-of-type(5){
    width:25%;
  }
  .formData>ul>li:last-of-type{
    width:10%;
  }
  .formData>ul:first-child>li:last-of-type{
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
  .unionLists{
    width:20%;
    align-self: flex-start;
    margin-right: 10px;
    margin-top: 10px;
  }
  .manageContent:before{
    content:"";
    display: inline-block;
  }
  .unionLists~.formData{
    width:80%;
    align-self: flex-start;
  }
  .unionLists>p{
    text-align: center;
    background: #83c350;
    height:50px;
    line-height: 50px;
    color:#fff;
    font-size: 15px;
    margin-bottom: 5px;

  }
  .unionListsContent ul{
    padding-left: 15px;
    position: relative;
  }
  .unionListsContent ul:before{
    content:"";
    height:100%;
    width:1px;
    border-left:1px dotted #aaa;
    position: absolute;
    left:7.5px;
  }
  .unionListsContent ul>li{
    position: relative;
  }
  .unionListsContent ul>li:before{
    content:"";
    position: absolute;
    width:7.5px;
    left:-7.5px;
    top:9px;
    border-top: 1px dotted #aaa;
  }
  .unionListsContent ul>li:last-child:after{
    content:"";
    height:100%;
    width:7.5px;
    position: absolute;
    left:-7.5px;
    top:10px;
    background: #fff;
  }
  div.moreList{
    position:relative;
  }
  div.moreList:before{
    content:"+";
    display: block;
    width:10px;
    height:10px;
    line-height: 10px;
    text-align: center;
    border:1px solid #333;
    background: #d5f3fe;
    position:absolute;
    left:-12px;
    top:3px;
    color:#333;
    z-index: 2;
  }
  div.moreListOpen:before{
    content:"-";
    line-height: 8px;
  }
  .userState1,.userState2,.userState0{
    color:#40ff40;
    border:1px solid #40ff40;
    width:30px;
    height:30px;
    line-height: 30px;
    border-radius: 50%;
    display: inline-block;
    margin-top: 5px;
    font-style: normal;
    font-size: 25px;
  }
  .userState1{
    border-color:#ffff40;
    color:#ffff40;
  }
  .userState2{
    border-color:#ff2020;
    color:#ff2020;
  }
</style>
