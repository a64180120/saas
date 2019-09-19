<template>
  <div class="board-column">
    <div class="board-column-header">
      {{headerText}}
        <i style="float: right;font-size: 25px;margin-top: 10px;cursor:pointer" @click.stop="close()" class="el-icon-close"></i>
    </div>
    <draggable
      class="board-column-content"
      :list="list"
      :options="options">
      <div class="board-item" v-for="element in list" :key="element.id">
        <div style="height:64px;background-color: #fff;box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.2);">
          <i @click.stop="detailInfoToggle($event)" class="el-icon-caret-bottom"></i>
          <span>{{element.PType+'-'+element.PNo}}</span>
          <span> {{element.PDate.split('T')[0]}}</span>
        </div>
        
        <div class="voucherDetail">
          <ul class="listTitle">
              <li>摘要</li>
              <li>科目</li>
              <li>借方金额(元)</li>
              <li>贷方金额(元)</li>
          </ul>
          <ul class="listContent">
              <li>
                  <span>凭证日期 : {{element.PDate?element.PDate.substring(0,10):''}}</span>
                  <span>凭证字号 : {{element.PType}}-{{element.PNo}}</span>
                  <span>附件数 : {{element.PAttachment}}</span>
                  <span>制单人 : {{element.PMakePerson}}</span>
                  <span>审核人 : {{element.PAuditorName}}</span>
              </li>
              <li v-for="(dtl,ind) of element.Dtls" :key="ind">
                  <div class="wrapKemu">
                      <div>{{dtl.Abstract}}</div>
                  </div>
                  <div class="wrapKemu"> 
                      <div> 
                          {{dtl.SubjectCode}}&nbsp;{{dtl.SubjectName}}
                          <span 
                              v-for="(item,index) of dtl.DtlAccounts?dtl.DtlAccounts[0].NameValueDtls:0" :key="index">
                              .{{item.AuxiliaryName}}
                          </span> 
                      </div>
                  </div>
                  <div>{{(dtl.JSum==0?'':dtl.JSum) | NUmTurn}}</div>
                  <div>{{(dtl.DSum==0?'':dtl.DSum) | NUmTurn}}</div>
              </li>
              <li>
                  <div>合计:{{'sum' | sum(element.Dtls)}}</div>
                  <div>{{'jie'| sum(element.Dtls)}}</div>
                  <div>{{'dai'| sum(element.Dtls)}}</div>
              </li>
          </ul>
          <div class="hideScroll"></div>
        </div>
        <!-- <span>{{element.PDate.slice(0,10)}}</span> -->
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'dragKanban-demo',
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods:{
      close(){
        this.$emit('drag-click',false);
      },
    detailInfoToggle($event){
      var targetDiv=$event.target.parentNode;
      var infoDiv=$event.target.parentNode.parentNode.children[$event.target.parentNode.parentNode.children.length-1];
      if(infoDiv.className=='voucherDetail'){
        infoDiv.className='voucherDetail voucherDetailShow';
        targetDiv.className="shadowActive"
      }else{
        infoDiv.className='voucherDetail';
        targetDiv.className='';
      }
    }
  },
  filters:{
            sum(val,dtl){
                var sum=0;
                var fu='';
                if(!dtl){
                    dtl=[]
                }
                function Num(value) {
                    if(!value||(value==0)) return '';                    
                    /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
                    var intPart =  Number(value)|0; //获取整数部分
                    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
                    var floatPart = ".00"; //预定义小数部分
                    var value2Array = value.toString().split(".");
                    //=2表示数据有小数位
                    if(value2Array.length == 2) {
                        floatPart = value2Array[1].toString(); //拿到小数部分

                        if(floatPart.length == 1) { //补0,实际上用不着
                            return intPartFormat + "." + floatPart + '0';
                        } else {
                            return intPartFormat + "." + floatPart;
                        }

                    } else {
                        return intPartFormat + floatPart;
                    }

                }
                switch(val){
                    case 'jie':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
                        }
                        sum=Num(sum);
                        break;
                    case 'dai':
                        for(var d of dtl){
                            if(d.DSum){
                                sum+=parseFloat(d.DSum);
                            }
                        }
                        sum=Num(sum);
                        break;
                    case 'sum':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
                        }
                        if(sum<0){
                            sum=-1*sum;
                            fu='(负数)'
                        }
                        sum=sum.toFixed(2);
                        var arr1=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'];
                        var arr2=['','拾','百','千','万','亿'];
                        var str=sum.toString().split('.');
                        var dot='元';
                        var INTstr=str[0];
                        var INT='';
                        var bool=false;
                        var zero='';
                        if(parseInt(str[1])!=0){
                            dot+=arr1[str[1][0]]+'角';
                            if(str[1][1]!=0){
                                dot+=arr1[str[1][1]]+'分'
                            }
                        }else{
                            dot+='整'
                        }
                        for(var i=INTstr.length-1,j=0;i>=0; i--,j++){
                            if(INTstr[i]!=0){
                                bool=true;
                            }
                            if(j==4){
                                INT=arr2[j]+INT;
                            }else if(j==8){
                                INT=arr2[5]+INT;
                            }
                            if(bool){
                                if(INTstr[i]!=0){
                                    if(zero=='零'){
                                        zero='';
                                    }
                                    if(j==4){
                                        INT=arr1[INTstr[i]]+INT;
                                        bool=false;
                                    }else if(j==8){
                                        INT=arr1[INTstr[i]]+INT;
                                    }else{
                                        INT=arr1[INTstr[i]]+arr2[j%4]+INT;
                                        bool=false;
                                    }
                                }else{
                                    if(zero==''){
                                        INT='零'+INT;
                                        zero='零';
                                    }
                                    if(j==4){
                                        INT=arr2[j]+INT;
                                        bool=false;
                                    }else if(j==8){
                                        INT=arr2[5]+INT;
                                        bool=false;
                                    }
                                }
                            }
                        }
                        sum=fu+INT+dot;
                        break;
                }
                
                return sum;

            },
            
            //数字转换******************
            NUmTurn(value){
                
                if(!value) return '';
                /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
                var intPart =  Number(value)|0; //获取整数部分
                var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断


                var floatPart = ".00"; //预定义小数部分
                var value2Array = value.toString().split(".");

                //=2表示数据有小数位
                if(value2Array.length == 2) {
                    floatPart = value2Array[1].toString(); //拿到小数部分

                    if(floatPart.length == 1) { //补0,实际上用不着
                        return intPartFormat + "." + floatPart + '0';
                    } else {
                        return intPartFormat + "." + floatPart;
                    }

                } else {
                    return intPartFormat + floatPart;
                }
            },
        }
}
</script>
<style lang="scss" scoped>
.board-column {
  min-width: 300px;
  min-height: 100px;
  height: 100%;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
  position:relative;
  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #00b7ee;
    color: #fff;
    border-radius: 3px 3px 0 0;
    position:absolute;
    top:0;
    left:0;
    width:100%;
  }
  .board-column-content {
   // margin-top:50px;
    position:absolute;
    top:50px;
    bottom:0px;
    left:0;
    right:0;
    overflow-y:auto;
    border: 10px solid transparent;
      margin-bottom: 30px;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    .board-item {
      cursor: pointer;
      width: 100%;
      //height: 64px;
      margin: 5px 0;
      // background-color: #fff;
      text-align: left;
      line-height: 54px;
      //padding: 5px 0px;
      position: relative;
      box-sizing: border-box;
      
      >div{
        padding:10px 0px 10px 10px;
        >span{
          margin-right: 20px;
        }
      }
    }
  }
}
.voucherDetail{
  position:relative;
  width:100%;
  padding:5px 10px;
  //border:1px solid #bcbdbd;
  display:none;
  background: #fff;
  box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.2);
 
}
.voucherDetailShow{
  margin-top:10px;
  display:block;
  position:relative;
  z-index:9;
  position:relative;
}
.listTitle{
  height:30px;
  overflow-y: scroll;
  >li{
    line-height:30px;
    height:100%;
    text-align: center;
    float:left;
    border:1px solid #bcbdbd;
    border-left:0;
    &:first-of-type{
        width:32%;
        border-left:1px solid #bcbdbd;
    }
    &:nth-of-type(2){
        width:28%;
    }
    &:nth-of-type(3){
        width:20%;
    }
    &:nth-of-type(4){
        width:20%;
    
    }
  }
  
}
.listContent{
   overflow-y:scroll;
   max-height:150px;
}
.listContent>li{
  height:28px;
  line-height: 30px;
  text-align: left;
  border:1px solid #bcbdbd;
  border-width:0 1px 1px 0;
  &:first-of-type{
    border-left:1px solid #bcbdbd;
   
  }
  >span{
    margin-left:5%;
  }
  >div{
    float:left;
    text-align: left;
    height:100%;
    padding:0 5px;
    border-left:1px solid #bcbdbd;
    &:first-of-type{
        width:32%;
 
    }
    &:nth-of-type(2){
        width:28%;
    }
    &:nth-of-type(3){
        width:20%;
        text-align:right;
    }
    &:nth-of-type(4){
        width:20%;
        text-align:right;
    
    }
  }
  &:last-of-type{
    >div{
      &:first-of-type{
        width:60%;
         padding-left:10%;
    }
    &:nth-of-type(2){
        width:20%;
        text-align:right;
    }
    &:nth-of-type(3){
        width:20%;
        text-align:right;
    }
   
    }
  }
}

</style>
