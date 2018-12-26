<template>
  <div class="sys-page">
    <div class="container">
      <el-button type="primary" @click="printClick">打印</el-button>

      <div style="margin-top: 20px">{{ sumvalue| NumtoCHN}} </div>

      <print-tem ref="print" :printData="voucherdata"></print-tem>

      <!--<timerBtn ref="timerbtn" class="btn btn-default" @run="sendCode"></timerBtn>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Auth from "@/util/auth";
import printTem from "@/page/finance/vprint/printTemPdf"
import timerBtn from '@/components/timerBtn';

//科目期初
export default {
  name: "subjectInit",
  components: { printTem,timerBtn },
  data() {
    return {
      voucherdata:'',
      fileVisible:false,
      sumvalue:999999999999.123
    }
  },
  created() {
    this.printVoucher()
  },
  //加载数据
  mounted:function(){

  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          username: state => state.user.username,
          orgid: state => state.user.orgid
      })
  },
  methods: {
     //打印凭证
     printVoucher() {
       //日期

       //拼凑数据供打印使用,凭证头，尾信息
        var mst = {
          voucherTitle: "记账凭证", //记账凭证
          billNum: 4, //附件数
          orgName: "测试单位", //核算单位
          billdate:"2018-12-20", //日期
          voucherNum: "记-0001", //凭证号：记-0001
          lotal: '23987.20', //合计
          chager:'李四',
          supervisor: "张三", //记账
          auditor: "张伟", //审核
          cashier: "王五", //出纳
          producer: this.username //制单
        };

        var list=[
          { abstract: "代理收入",  subject: "112200050003 应收账款_3_宁波得志",  deVal: '5071.00',  crVal: ''},
          { abstract: "代理收入",  subject: "11220002 应收账款_陕西咸阳佳佳",  deVal: '18916.20',  crVal: ''},
          { abstract: "代理收入",  subject: "50010002 主营业务收入_二级收入",  deVal: '',  crVal: '4783.96'},
          { abstract: "代理收入",  subject: "50010002 主营业务收入_二级收入",  deVal: '',  crVal: '17845.47'},
          { abstract: "代理收入",  subject: "222100010007 应交税费_应交增值税_销项税额",  deVal: '',  crVal: '1357.77'},
          { abstract: "代理收入",  subject: "222100010007 应交税费_应交增值税_销项税额",  deVal: '',  crVal: '1357.77'}
        ];

        this.voucherdata={
          mst:mst,
          list:list
        };

     },
     printClick(){
       //this.fileVisible=true; //打印
       this.$refs.print.printvoucher(); //打印
     },
     sendCode(){
       this.$refs.timerbtn.setDisabled(true); //设置按钮不可用
     }

  }
}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>

</style>
