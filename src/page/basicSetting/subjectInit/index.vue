<template>
    <div class="container">
        <div class="manageContent" v-loading="loading">
            <div class="unionSetting">
                <ul class="handle">
                    <a><li style='margin:0 0 0px 20px;' class="el-icon-refresh" @click="refresh"></li></a>
                    <a><li style='margin:0 0 0px 20px;'>科目设置</li ></a>
                    <a><li style='margin:0 0 0px 20px;'>反初始化</li ></a>
                    <a><li style='margin:0 0 0px 20px;'>开始初始化</li ></a>
                    <li style='margin:0 0 0px 20px;'>系统默认启用日期：2019年1月</li >
                    <li>
                        <div><input type="text" placeholder="凭证字号/摘要" v-model="inputKvalue"></div>
                        <div @click="selectBtn">搜索</div>
                    </li>
                </ul>
            </div>

            <div class="lineUl">
                <ul>
                    <li>资产类<i></i></li>
                    <li>负债类<i></i></li>
                    <li>净资产类<i></i></li>
                    <li>收入类<i></i></li>
                    <li>支出类<i></i></li>
                </ul>

            </div>
            <div class="formData" ref="printFrom">
                <ul>
                    <li>科目编码</li>
                    <li>科目名称</li>
                    <li>余额方向</li>
                    <li>辅助核算</li>
                    <li>停用/启用</li>
                    <li>年初余额</li>
                </ul>
                <div>
                    <template v-for="n in 15">
                        <ul class="formDataItems">
                            <li>101</li>
                            <li>库存现金</li>
                            <li class="align-center">借</li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </template>

                </div>

            </div>

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
    .formData>ul>li,.formData>div>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:15%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2),.formData>div>ul>li:nth-of-type(2){
        width:20%;
    }
    .formData>ul>li:nth-of-type(3),.formData>div>ul>li:nth-of-type(3){
        width:10%;
    }
    .formData>ul>li:nth-of-type(4),.formData>div>ul>li:nth-of-type(4){
        width:30%;
    }
    .formData>ul>li:nth-of-type(5),.formData>div>ul>li:nth-of-type(5){
        width:10%;
    }
    .formData>ul>li:nth-of-type(6),.formData>div>ul>li:nth-of-type(6){
        width:15%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #d3e9f9;
    }

    .formData>ul>li:first-child{
        padding:0 2px;
    }


    .formDataItems{
        background-color: white;
    }
    .formData>div{
        overflow-y: auto;
        position: relative;
        top: 0;
        bottom: 0;
        width: 100%;
    }
    .formData>div>ul.formDataItems>li{
        border-right:1px solid #ddd;
        border-left:0;
        border-bottom:1px solid #ddd;
        text-align: left;
        line-height: 40px;
        height:40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 15px;
        float: left;
    }
    .formData>div>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .formData>div>ul.formDataItems>li.bolder{
        font-weight: bold;
    }
    .formData>div>ul.formDataItems>li.align-center{
        text-align: center;
        padding:0;
    }
    .formData>div>ul.formDataItems>li.align-right{
        text-align: right;
        padding-right: 15px;
    }
    .unionSetting{
        display: table;
        width: 100%;
    }
    .unionSetting .handle{
        margin-right:20px;
        min-width: 590px;
    }
    .unionSetting .handle>a{
        float:right;
        width: auto;
        margin-right: 10px;
    }
    .unionSetting .handle>li{
        float: right;
    }
    .unionSetting .handle>li:last-child{
        float: left;
    }
    .unionSetting .handle>li>div{
        display: inline-block;
    }
    .unionSetting .handle>li>div:first-child{
         border: 1px solid #ddd;
         border-radius: 10px 0 0 10px;
         padding-left: 10px;
        margin-top: 1px;
        height: 34px;
     }
    .unionSetting .handle>li>div>input{
        border: none;
        height: 28px;
    }
    .unionSetting .handle>li>div:last-child{
        height: 34px;
        width: 60px;
        text-align: center;
        line-height: 30px;
        background: #00B8EE;
        color: #fff;
        cursor: pointer;
        margin-left: -5px;
    }
    .unionSetting .handle>a>li:hover{
        background-color: #fff;
        color: #00b7ee;
        border: 1px solid #00b7ee;
    }
    .unionSetting .handle>a>li {
        border: 1px solid #00b7ee;
        border: 0;
        padding: 0 10px;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        text-align: center;
        background: #00b7ee;
        width: auto;
        min-width:50px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }
    .lineUl{
        width: 100%;
        height: 80px;
        line-height: 40px;
        border-top: 2px solid #ccc;
        margin-top: 15px;
    }
    .lineUl li{
        display: inline-block;
        width: 20%;
        float: left;
        font-size: 20px;
        padding: 0 20px;
        text-align: center;
        margin-top: 20px;
        cursor: pointer;
    }
    .lineUl li:hover{
        color: #00b7ee;
    }
    .lineUl li .select{
        color: #00b7ee;
    }
    .lineUl ul li i{
        display: block;
        width: 80%;
        border-bottom:3px solid #cccccc;
        margin-left: 10%;
    }
    .lineUl li .select i{
        border-color: #e6a23c;
    }
    .lineUl li:hover >i{
        border-color: #e6a23c;
    }
    .lineUl:after{
        float: none;
    }
</style>
