<template>
  <div class="saasSubList">
    <ul @click.stop="childChoose($event,dataList,child,index)"
        v-for="(child,index) of dataList.children.length>0?dataList.children:dataList.AuxSubjectchildren"
        :key=index>
      <li :style="{padding:indexPadding}"
          :title="child.KCode">{{child.KCode}}</li>
      <li :title="child.KName"
          :style="{padding:indexPadding}">{{child.KName}}</li>
      <li><span v-if="child.KBalanceType==1">借</span><span v-if="child.KBalanceType==2">贷</span><span v-if="child.KBalanceType==3">借/贷</span></li>
      <li style="padding-left:5px">
        <div class="assistCss"
             v-for="(aux,inde) of child.AuxiliaryTypes"
             :key=inde>
          <img src="@/assets/images/finance/e43d0d92-28a3-4b66-8ef8-26681e276d6b.svg"
               alt="">
          <span>{{aux.BaseName}} &nbsp;</span>
        </div>
        <i @click.stop="showAddAuxi(child)"
           v-show="child.AuxiliaryTypes.length>0&&updatePage"
           class="el-icon-plus auxiAddIcon"></i>
      </li>
      <li>
        <div><i :class="{newAddStateTrue:!child.EnabledMark,newAddStateFalse:child.EnabledMark}"></i> </div>
        <!-- <div v-show="updatePage">
                                                                <label>启用 <input type="radio"></label>
                                                                <label>停用 <input type="radio"></label>
                                                            </div> -->
      </li>
      <li>
        <div :title="child.NCAccount | Num"
             v-show="(!updatePage)">{{child.NCAccount | Num}}</div>
        <div class="inputContainer"
             v-show="updatePage&&((child.IsLast==1&&!child.EnabledMark)||child.IsAuxSubject)"><input type="text"
                 @click.stop="balanceFocus(child,$event)"
                 @focus="balanceFocus(child,$event)"
                 @blur="balanceBlur(child)"
                 @keyup="clearNoNum($event)"
                 onafterpaste="this.value=this.value.replace(/e/g,'')"
                 v-model="child.NCAccount"></div>
      </li>

      <li v-if="child.children.length>0||child.AuxSubjectchildren"
          class="child">
        <saas-subList v-if="child.children.length>0"
                      :leaf="leaf+1"
                      :year="year"
                      :updatePage="updatePage"
                      :dataList="child" />
        <saas-subList v-if="child.AuxSubjectchildren"
                      :leaf="leaf+1"
                      :year="year"
                      :updatePage="updatePage"
                      :dataList="child" />

      </li>

    </ul>
    <div v-if="addAuxiShow">
      <addAuxiDtl :subject="addAuxiOfSubjec"
                  :year="year"
                  @finish="addAuxiFinish" />
    </div>

  </div>
</template>

<script>
import addAuxiDtl from './addAuxiDtl'
export default {
  name: 'saasSubList',
  props: {
    dataList: {
      type: Object,
      default () {
        return {}
      }
    },
    updatePage: {
      type: Boolean,
      default: false,
    },
    leaf: {
      type: Number,
      default: 1
    },
    year: {
      type: String,
      default: ''
    }
  },
  inject: ['update', 'childChoose', 'fresh',],
  data () {
    return {
      addAuxiShow: false,
      indexPadding: '20px',
      addAuxiOfSubjec: {},//设置辅助项的科目
    }
  },
  mounted () {
    this.indexPadding = '0 0 0 ' + 20 * this.leaf + 'px'
  },

  methods: {
    showAddAuxi (item) {
      this.addAuxiOfSubjec = item;
      this.addAuxiShow = true;
    },
    addAuxiFinish (data) {
      this.addAuxiShow = false;
      if (data) {
        this.fresh();
      }
    },
    balanceFocus (item, event) {
      var elem = event.target;
      if (item.NCAccount == '0.00' || item.NCAccount == 0) {
        item.NCAccount = '';
      }

      // var index=0;
      // console.log(elem.setSelectionRange)
      // if (elem.setSelectionRange) { // 标准浏览器
      //     elem.setSelectionRange(index, index)   
      // } else { // IE9-

      //     var range = elem.createTextRange()
      //     console.log(range)
      //     range.moveStart("character", -len)
      //     range.moveEnd("character", -len)
      //     range.moveStart("character", index)
      //     range.moveEnd("character", 0)
      //     range.select()
      // }
    },
    //输入余额框blur
    balanceBlur (item) {

      if (item.NCAccount) {
        item.NCAccount = parseFloat(item.NCAccount);
        item.NCAccount = item.NCAccount.toFixed(2);
      } else {
        item.NCAccount = '0.00';

      }
    },
    clearNoNum (event) {
      var obj = event.target;
      // obj.value = obj.value.replace(/[^\-]/g,"");return;
      //清除“数字”和“.”以外的字符  
      obj.value = obj.value.replace(/[^\-\d.]/g, "");  //清除“数字”和“.”以外的字符  
      obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的 
      obj.value = obj.value.replace("-", "$#$#").replace(/\-/g, "").replace("$#$#", "-");
      obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
      //         if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
      //             obj.value= parseFloat(obj.value); 
      //         } 
    },
  },
  filters: {
    Num (value) {
      if (!value) return '0.00';
      if (value == '0.00') return value;
      /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
      var intPart = Number(value) | 0; //获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
      var floatPart = ".00"; //预定义小数部分
      var value2Array = value.toString().split(".");
      //=2表示数据有小数位
      var res;
      if (value2Array.length == 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分

        if (floatPart.length == 1) { //补0,实际上用不着
          res = intPartFormat + "." + floatPart + '0';
          res = (res == 0.00 ? '' : res);
          return res;
        } else {
          res = intPartFormat + "." + floatPart;
          res = (res == 0.00 ? '' : res);
          return res;
        }

      } else {
        res = intPartFormat + floatPart;
        res = (res == 0.00 ? '' : res);
        return res;
      }

    }
  },
  components: {
    addAuxiDtl
  }
}
</script>

<style lang="scss" scoped>
.saasSubList {
  .child {
    width: 100%;
    border: 0;
    clear: both;
    height: auto !important;
  }
  > ul {
    &.clickActive {
      > li {
        background: #aaa;
      }
      ul {
        background: #fff;
        > li {
          background: #fff;
        }
      }
    }

    > li {
      float: left;
      height: 40px;
      position: relative;
      border: 1px solid #bcbdbd;
      border-width: 0 1px 1px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      &:first-of-type {
        width: 20%;
        border-width: 0 1px 1px 1px;
      }
      &:nth-of-type(2) {
        width: 13%;
      }
      &:nth-of-type(3) {
        text-align: center;
        width: 10%;
        padding: 0 0 0 5px;
      }
      &:nth-of-type(4) {
        width: 32%;
        padding-right: 30px;
      }
      &:nth-of-type(5) {
        width: 15%;
      }
      &:nth-of-type(6) {
        width: 10%;
        padding: 0 3px 0 5px;
        text-align: right;
      }
      > div {
        height: 100%;
      }
    }
  }
  .assistCss {
    display: inline-block;
    width: auto;
    margin-right: 5px;

    > img {
      height: 70%;
      vertical-align: middle;
      position: relative;
      top: -2px;
    }
  }
  i.newAddStateTrue:after {
    top: 5px;
  }
  .newAddStateFalse:before,
  .newAddStateFalse:after {
    top: 20px;
  }
  .inputContainer input {
    border: 0;
  }
  .auxiAddIcon {
    position: absolute;
    top: 6px;
    right: 5px;
    color: #aaa;
    cursor: pointer;
    font-size: 28px;
  }
  .clickActive .auxiAddIcon {
    color: #fff;
  }
}
</style>
