<template>
    <div class="addVoucher">
      <div class="unionState flexPublic">
        <ul class="flexPublic">
          <li class="flexPublic">
            <div>账期:</div>
            <div class="selectContainer">
              <select  v-model="userState">
                <option v-for="item of userStateValues" :key="item.id" :value="item.id">{{item.name}}</option>
              </select>
            </div>
          </li>
        </ul>
        <div class="flexPublic searcherCon">
          <div class="searcherValue"><input type="text" placeholder="科目/摘要/凭证号"></div>
          <div  class="searcherBtn">搜索</div>
        </div>
        <ul class="flexPublic handle">
          <router-link to="/organize/add"><li>引入模板</li></router-link>
          <router-link to="/organize/add"><li>保存为模板</li></router-link>
          <router-link to="/organize/add"><li>保存并新增</li></router-link>
          <router-link to="/organize/add"><li>保存</li></router-link>
        </ul>
      </div>
      <voucher></voucher>
      <div class="newAddContainer">
        <div class="newAddTitle flexPublic">
          <span>最新新增凭证</span>
          <a href="">进入凭证列表</a>
        </div>
        <div class="newAddContent">
          <div class="newAddList">
            <ul class="flexPublic w-33">
              <li>序号</li>
              <li>凭证记号</li>
              <li>审核状态</li>
              <li>凭证日期</li>
            </ul>
            <ul class="flexPublic w-33">
              <li>序号</li>
              <li>凭证记号</li>
              <li>审核状态</li>
              <li>凭证日期</li>
            </ul>
            <ul v-if="newAddList.length>6" class="flexPublic w-33">
              <li>序号</li>
              <li>凭证记号</li>
              <li>审核状态</li>
              <li>凭证日期</li>
            </ul>
          </div>
          <ul class="newAddList">
            <li v-for="(item,index) of newAddList" :key="index">
              <ul class="flexPublic">
                <li>{{index+1}}</li>
                <li>记-{{item.id}}</li>
                <li :class="{newAddStateTrue:item.state,newAddStateFalse:!item.state}"></li>
                <li>{{item.date}}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

    </div>
</template>

<script>
  import voucher from './voucher'
  export default {
    data(){return {
      val1:'',
      fileList:[],
      voucherDate:'',
      userState:0,
      userStateValues:[
        {id:0,name:'全部'},{id:1,name:'2018-11'},{id:2,name:'2018-12'},{id:3,name:'2019-01'}
      ],
      newAddList:[
        {id:'0001',state:true,date:'2018-11-5'},
        {id:'0002',state:false,date:'2018-11-5'},
        {id:'0003',state:true,date:'2018-11-5'},
        {id:'0004',state:false,date:'2018-11-5'},
      ],
      moneyInputMask:false,
    }},
    methods:{
      inputBlur($event,item){
        let val=this.val1;
        if(val) {
          val = parseFloat(this.val1).toFixed(2).split('.');
          console.log(val)
          let num = val[0];
          let float = val[1];
          let children = $event.target.parentNode.parentNode.children;
          children[11].innerHTML = float[1];
          children[10].innerHTML = float[0];
          for(var i=num.length-1,j=9;i>=0;i--){
            children[j].innerHTML=num[i] ;
            j--;
          }
        }
      },
      moneyInputShow(item){
        item.moneyInput=true;
        this.moneyInputMask=true;
      },
      moneyInputHide($event){
        for(var input of this.voucherInfo){
          input.moneyInput=false;
        }
        this.moneyInputMask=false;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },
    components:{
      voucher,
    }
  }
</script>

<style scoped>
  .addVoucher{
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
    min-width:70px;
    font-size:13px;
    height:30px;
    line-height: 30px;
    margin-left:10px;
    margin-right: 0;
  }
  .unionState .handle>a:nth-of-type(4)>li{
    min-width: 60px;
  }
  .unionState .handle>a>li:hover{
    background: #ff9900;
    color:#fff;
  }
/*voucher*******************************************/

  /*凭证新增*********************************/
  .newAddTitle{
    background: #43c9d2;
    height:40px;
    color:#fff;
    padding:0 20px;
  }
  .newAddTitle>a{
    color:#fff;
    text-decoration: underline;
    font-size: 15px;
  }
  .newAddContent{
    padding:0 20px;
    margin:15px;
  }
  .newAddContent>div>ul>li{
    width:25%;
  }
  .newAddContent>div>ul>li:first-of-type{
    color:#6fbae4;
  }
  .newAddList{
    width:100%;
    margin-top:5px;
    height:90px;
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
  }
  div.newAddList{
    height:30px;
  }
  .newAddList>li{
    width:33.33%;
    height:30px;
  }
  .newAddList>li>ul>li{
    width:25%;
    position: relative;
  }
  .newAddContent li{
    text-align: center;
  }
  .newAddStateTrue:after{
    content:"";
    position:absolute;
    width:8px;
    height:18px;
    border:1px solid #02a7e7;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg);
    top:-12px;
  }
  .newAddStateFalse:before,.newAddStateFalse:after{
    content:"";
    position: absolute;
    width:18px;
    height:1px;
    background: #d8281d;
    transform: rotate(45deg);
    left:40px;
  }
  .newAddStateFalse:before{
    transform: rotate(-45deg);
  }

</style>
