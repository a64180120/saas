<template>
  <div class="voucher">
    <div class="voucherHead">
      <ul class="flexPublic">
        <li><span>凭证字号: 记-</span><span>{{PNo}}</span></li>
        <li>
          <div class="block">
            <span class="demonstration">凭证日期: </span>
            <el-date-picker
              v-model="PDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </li>
        <li class="flexPublic">
          <div class="flexPublic">附单据&nbsp;<span class="fileCount">{{PAttachment}}</span>&nbsp;张&nbsp;</div>
          <el-upload
            class="upload-demo flexPublic"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div title="只能上传jpg/png文件，且不超过500kb" slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </li>
      </ul>
    </div>
    <div  class="voucherContent">
      <div @click.stop="moneyInputHide" v-show="moneyInputMask" class="moneyInputMask"></div>
      <ul>
        <li>
          <ul class="flexPublic voucherContentItem">
            <li>摘要</li>
            <li>科目</li>
            <li>
              <div>借方金额</div>
              <div class="flexPublic money">
                <div>亿</div>
                <div>千</div>
                <div>百</div>
                <div>十</div>
                <div>万</div>
                <div>千</div>
                <div>百</div>
                <div>十</div>
                <div>元</div>
                <div>角</div>
                <div>分</div>
              </div>
            </li>
            <li>
              <div>贷方金额</div>
              <div class="flexPublic money">
                <div>亿</div>
                <div>千</div>
                <div>百</div>
                <div>十</div>
                <div>万</div>
                <div>千</div>
                <div>百</div>
                <div>十</div>
                <div>元</div>
                <div>角</div>
                <div>分</div>
              </div>
            </li>
          </ul>
        </li>
        <li v-for="(item,index) of voucherInfo" :key="index">
          <ul  class="flexPublic voucherContentItem">
            <li></li>
            <li @click.stop="handleKemuSel(index)" class="kemu">
              <div>
                <ul>
                  <li class="flexPublic">
                    <span>{{item.kemu}}</span>
                    <span v-for="(assist,index) of item.assistItem" :key="index">-{{assist}}</span>
                  </li>
                  <li v-show="item.kemu"><span>余额:</span><span></span></li>
                </ul>
              </div>
              <searchSelect :itemlists="itemlists[index]" :placeholder="itemlistText" :show="kemuSel[index].checked"
                        :nodatatext="itemlistText" @item-click="itemClick"></searchSelect>
                <searchSelect :itemlists="assistItems[index]" :placeholder="assistItemText" :show="assistItem[index].checked"
                              :nodatatext="assistItemText" @item-click="assistClick"></searchSelect>
            </li>
            <li @click="moneyInputShow(item,'jiefang')" class="flexPublic money">
                  <span v-show="item.moneyInput.jiefang" class="moneyValCon">
                    <input type="number" v-model="item.money.jiefang" @blur="inputBlur($event,item,'jiefang')" placeholder="请输入金额"
                           onkeyup="this.value=this.value.replace(/e/g,'')" onafterpaste="this.value=this.value.replace(/e/g,'')" >
                    <i class="inputCancle">X</i>
                  </span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
            <li @click="moneyInputShow(item,'daifang')" class="flexPublic money">
                  <span v-show="item.moneyInput.daifang" class="moneyValCon">
                    <input type="number" v-model="item.money.daifang" @blur="inputBlur($event,item,'daifang')" placeholder="请输入金额"
                           onkeyup="this.value=this.value.replace(/e/g,'')" onafterpaste="this.value=this.value.replace(/e/g,'')" >
                    <i class="inputCancle">X</i>
                  </span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
          </ul>
        </li>
        <li>
          <ul class="flexPublic voucherContentItem count">
            <li >合计</li>
            <li  class="flexPublic money">
              <span></span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
            <li  class="flexPublic money">
              <span></span>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </li>
          </ul>
        </li>

      </ul>
    </div>
    <div class="voucherFoot">
      <ul class="flexPublic">
        <li>财务主管: <span>{{PFinancePerson}}</span> </li>
        <li>记账: <span>{{PKeepingPerson}}</span></li>
        <li>审核: <span>{{PAuditor}}</span></li>
        <li>制单: <span>{{PMakePerson}}</span></li>
        <li>出纳: <span>{{PCashier}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import searchSelect from './searchSelect'
  export default {
    name: "voucher",
    data(){return{
      fileList:[],
      PDate:'',
      PNo:'0001',
      PAttachment:'1',
      PMakePerson:'张',
      PFinancePerson:'王',
      PKeepingPerson:'李',
      PCashier:'吴',
      PAuditor:'周',
      voucherInfo:[
        {moneyInput:{jiefang:false,daifang:false},kemu:'',assistItem:[],Abstract:'',money:{jiefang:'',daifang:''}},
        {moneyInput:{jiefang:false,daifang:false},kemu:'',assistItem:[],Abstract:'',money:{jiefang:'',daifang:''}},
        {moneyInput:{jiefang:false,daifang:false},kemu:'',assistItem:[],Abstract:'',money:{jiefang:'',daifang:''}},
        {moneyInput:{jiefang:false,daifang:false},kemu:'',assistItem:[],Abstract:'',money:{jiefang:'',daifang:''}}
      ],
      itemlists:[
        {id:0,kemu:['科目1','科目2','科目3','科目4','科目5']},
        {id:1,kemu:['科目1','科目2','科目3','科目4','科目5']},
        {id:2,kemu:['科目1','科目2','科目3','科目4','科目5']},
        {id:3,kemu:['科目1','科目2','科目3','科目4','科目5']}
      ],
      assistItems:[
        {id:0,kemu:['项目1-1','项目2-1','项目3','项目4','项目5']},
        {id:1,kemu:['项目1','项目2','项目3','项目4','项目5']},
        {id:2,kemu:['项目1','项目2','项目3','项目4','项目5']},
        {id:3,kemu:['项目1','项目2','项目3','项目4','项目5']}
      ],
      itemlistText:'输入科目',
      assistItemText:'输入辅助项',
      moneyInputMask:false,
      kemuSel:[{checked:false},{checked:false},{checked:false},{checked:false}],
      assistItem:[{checked:false},{checked:false},{checked:false},{checked:false}]
    }},
    methods:{
      assistClick(childMsg){
        this.voucherInfo[childMsg.id].assistItem.push(childMsg.data);
      },
      itemClick(childMsg){//科目下拉框选择的科目********************************
        this.voucherInfo[childMsg.id].kemu=childMsg.data;
        this.kemuSel[childMsg.id].checked=false;
        this.assistItem[childMsg.id].checked=true;
      },
      handleKemuSel(index){//选择框显示********************
        this.assistItem[index].checked=false;
        this.kemuSel[index].checked=true;
        this.moneyInputMask=true;
      },
      inputBlur($event,item,value){//金额输入框键入*******************
        var val=item.money[value];
        var children = $event.target.parentNode.parentNode.children;
        this.$forceUpdate();
        this.moneyTurn(val,children);
      },
      moneyTurn(val,children){
        if(val) {
          val = parseFloat(val).toFixed(2).split('.');
          var num = val[0];
          var float = val[1];
          children[11].innerHTML = float[1];
          children[10].innerHTML = float[0];
          for(var i=num.length-1,j=9;j>0;j--){
            if(i>=0){
              children[j].innerHTML=num[i] ;
              i--;
            }else{
              children[j].innerHTML='';
            }
          }
        }else{
          for(var i=11;i>0;i--){
            children[i].innerHTML='';
          }
        }
      },
      moneyInputShow(item,val){//金额输入框展示**********************
        if(item.kemu){
          item.moneyInput[val]=true;
          this.moneyInputMask=true;
        }else{
          alert('请先选择科目!')
        }
      },
      moneyInputHide($event){//输入框隐藏**********************
        for(var input of this.voucherInfo){
          input.moneyInput.jiefang=false;
          input.moneyInput.daifang=false;
        }
        for(var item of this.kemuSel){
          item.checked=false;
        }
        for(var assist of this.assistItem){
          assist.checked=false;
        }
        this.moneyInputMask=false;
      },
      handleRemove(file, fileList) {//预留文件上传**************************
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
    computed:{
      countJie:{
        get(){
          var sum=0;
          for(var item of this.voucherInfo){
            if(item.money.jiefang){
              sum+=parseFloat(item.money.jiefang);
            }
          }
          return sum.toFixed(2);
        },
      },
      countDai(){
        var sum=0;
        for(var item of this.voucherInfo){
          if(item.money.daifang){
            sum+=parseFloat(item.money.daifang);
          }
        }
        return sum.toFixed(2);
      }
    },
    watch:{
      countJie(){
        var jie=document.querySelector(".count>li:nth-child(2)");
        this.moneyTurn(this.countJie,jie.children);
      },
      countDai(){
        var dai=document.querySelector(".count>li:nth-child(3)");
        this.moneyTurn(this.countDai,dai.children);
      },
      kemuSel(){

        console.log(11111);
      }
    },
    components:{
      searchSelect,
    }
  }
</script>

<style scoped>
  .voucher{
    width:100%;
    text-align: left;
    padding:8px 18px;
    font-size:18px;
  }
  .fileCount{
    display: inline-block;
    text-align: right;
    border:1px solid #999;
    width:50px;
    height:30px;
    line-height: 30px;
    padding:0 3px;
  }
  .voucherContent{
    margin-top:10px;
    border-top:1px solid #aaa;
    position: relative;
  }
  .moneyInputMask{
    width:100%;
    height:100%;
    position: absolute;
    z-index:2;
  }
  .voucherContent>ul>li:first-child{
    height:55px;
  }
  .voucherContentItem,.voucherContent>ul>li{
    height:55px;
  }
  .voucherContent>ul>li:first-child>ul{
    height:55px;
    line-height:55px;
    background: #d3e8f9;
  }
  .voucherContent>ul>li:first-child>ul>li:nth-of-type(3),.voucherContent>ul>li:first-child>ul>li:nth-of-type(4){
    line-height:27.5px;
  }
  li:last-of-type>ul.voucherContentItem>li{
    width:30%;
  }
  li:last-of-type>ul.voucherContentItem>li:first-of-type{
    width:40%;
  }
  .voucherContentItem>li{
    width:20%;
    height:55px;
    line-height:55px;
    text-align: center;
    border-bottom:1px solid #ddd;
    border-right:1px solid #ddd;
    position:relative;
  }
  .voucherContentItem>li:first-of-type{
    border-left: 1px solid #dddddd;
  }
  .voucherContentItem>li:nth-of-type(3),.voucherContentItem>li:nth-of-type(4){
    width:30%;
  }
  .voucherContentItem>li,.voucherContentItem:nth-of-type(5)>li{
    border-right-color:#7a7a7a;
    border-bottom-color:#7a7a7a;
  }
  .voucherContentItem>li:first-of-type{
    border-left-color:#7a7a7a;
  }
  div~.money{
    border-top:1px solid #aaa;
  }
  .money{
    position:relative;
  }
  .money>div{
    border-right:1px solid #ddd;
    width:9.09%;
    height:100%;
    font-size: 14px;
    position: relative;
  }
  .money>div:nth-of-type(1){
    border-color:#53bff0;
  }
  .money>div:nth-of-type(2){
    border-color:#5dc2f0;
  }
  .money>div:nth-of-type(3){
    border-color:#8ed2ac;
  }
  .money>div:nth-of-type(4){
    border-color:#6dc594;
  }
  .money>div:nth-of-type(5){
    border-color:#8ad0a9;
  }
  .money>div:nth-of-type(6){
    border-color:#ffdf8b;
  }
  .money>div:nth-of-type(7){
    border-color:#ffe18f;
  }
  .money>div:nth-of-type(8){
    border-color:#ffdd80;
  }
  .money>div:nth-of-type(9){
    border-color:#ffdc7e;
  }
  .money>div:nth-of-type(10){
    border-color:#fe7b7b;
  }
  .money>div:last-of-type{
    border:0;
  }
  .money>.moneyInputActive{
    position:absolute;
    background: #fff;
    width:100%;
    height:100%;
  }
  .voucherFoot{
    margin:20px 0;
  }
  .voucherFoot>ul>li{
    width:20%;
    text-align: center;
  }
  .moneyValCon{
    position:absolute;
    width:100%;
    height:100%;
    background:#fff;
    outline:1px solid #fff;
    padding:0 30px 0 5px;
    z-index: 5;
  }
  .moneyValCon>input{
    width:100%;
    height:90%;
    border:0;
    outline: 0;
    font-size: 20px;
  }
  .inputCancle{
    border:1px solid red;
    width:25px;
    height:25px;
    line-height: 25px;
    color:red;
    border-radius: 50%;
    font-style: normal;
    position: absolute;
    right:2.5px;
    top:15px;
  }
  .kemu>.inputContainer>input{
    border:0;
  }
  .kemu>div{
    position:relative;
    z-index:5;
    width:100%;
    height:100%;
  }
  .kemu>div>ul{
    height:100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;
  }
  .kemu>div>ul>li{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding:0 3px;
    font-size: 13px;
    line-height: 15px;
  }
  .kemu>div>ul>li:last-of-type{

  }


</style>
