<template>
  <div class="sys-page" ref="printVoucher">

        <div class="manageContent" v-for="(item, n) in tableData" :key="n">
            <div class="title">
                <strong>{{item.mst.voucherTitle}}</strong>
                <div>附单据数：{{item.mst.billNum}}张</div>
            </div>
            <ul class="formDataItemsA flexPublic">
                <li>单位：{{item.mst.orgName}}</li>
                <li>日期：{{ item.mst.billdate}}</li>
                <li>凭证号：{{item.mst.voucherNum}}({{Math.floor(n+1)+'/'+(Math.floor(tableData.length))}})</li>
            </ul>
            <div class="formData" ref="printFrom">
                <ul>
                    <li class="align-center bolder">摘要</li>
                    <li class="align-center bolder">科目</li>
                    <li class="align-center bolder">借方</li>
                    <li class="align-center bolder">贷方</li>
                </ul>
                <ul class="formDataItems flexPublic" v-for="(del, k) in item.list" :key="k">
                      <li>{{del.abstract}}</li>
                      <li>{{del.subject}}</li>
                      <li class="align-right">{{del.deVal}}</li>
                      <li class="align-right">{{del.crVal}}</li>
                </ul>
                <ul class="formDataItems flexPublic">
                    <li style="width: 737px;min-width: 737px;max-width: 737px;">
                        合计： <span class="bolder"> {{item.mst.lotal | NumtoCHN}}</span>
                    </li>
                    <li style="display: none"></li>
                    <li class="align-right">{{item.mst.lotal}}</li>
                    <li class="align-right">{{item.mst.lotal}}</li>
                </ul>
            </div>
            <ul class="formDataItemsB flexPublic">
                <li>主管：{{item.mst.chager}}</li>
                <li>记账：{{item.mst.supervisor}}</li>
                <li>审核：{{item.mst.auditor}}</li>
                <li>出纳：{{item.mst.cashier}}</li>
                <li>制单：{{item.mst.producer}}</li>
            </ul>
        </div>
      </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import Auth from "@/util/auth";

//凭证打印
export default {
  name: "printVoucher",
  props: ["printData"],
  data() {
    return {
      //htmlTitle: "voucher"
      tableData:[]
    }
  },
  created() {  },
  //加载数据
  mounted:function(){},
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          orgid: state => state.user.orgid
      })
  },
  watch:{

  },
  methods: {
    printvoucher(){
        //数据制空初始化
        this.tableData=[];
        this.voucher5tr(
            setTimeout(()=>{
            //下载pdf
            this.getPdf(this.$refs.printVoucher);
            })
        )
    },
    //每5列切成一张凭证
    voucher5tr(){
        let tr5 = []; //[[{},{},{},{},{}]]一维变多维
        let mst = this.printData.mst;    //{}
        let del = this.printData.list;  //[]
        let index = 0;

        del.forEach((n, i) => {
            if (!tr5[index]) {
              tr5[index] = [];
            }
            tr5[index].push(n);
            if (tr5[index].length === 5) {
               index++;
            }
        });

        //最后一个,不足5条数据的要补充完成
        let last = tr5[tr5.length - 1];
        for (let i = 0,l = 5 - last.length; i < l; i++) {
          last.push({
            abstract: "", //摘要
            subject: "", //科目是否有辅助核算，有辅助核算，拼接上辅助核算
            deVal: "", //借方金额
            crVal: "" //贷方金额
          })
        }

        //this.tableData的赋值
        tr5.forEach(n=>{
          this.tableData.push({
            mst:mst,
            list:n
          })
        })
    }
  }
}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang="scss" scoped>
   .manageContent{
       margin: 110px 0 0px 0;
       font-size:17px;
       padding-bottom: 0;
    .title{
        font-size: 25px;
        text-align: center;
        padding-bottom: 40px;
        font-weight: 600;
    }
       .title div{
           font-size: 17px;
           text-align: right;
           font-weight: 100;
           position: relative;
           right: 10px;
           top: -20px;
       }
    .formData{
        margin-bottom: 5px;
    }
    .formData>ul>li{
        border-right:1px solid #ebeef5;;
        height:69px;
        line-height:69px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
       .formData>ul:first-child{
           font-size: 17px;
       }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #2780d1;
    }
    .formData>ul>li:nth-of-type(1){
        width:305px;
        min-width: 305px;
        max-width: 305px;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(2){
        width:407px;
        min-width: 407px;
        max-width: 407px;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(3),
    .formData>ul>li:nth-of-type(4){
        width:152px;
        min-width: 152px;
        max-width: 152px;
        padding:0 2px;
    }

    .formDataItems{
        border-bottom:1px solid #ebeef5;
        background: white;
    }
    .formDataItemsA{
        border-bottom:0;
    }
    .formDataItemsB>li{
        border-bottom:0;
        text-align: left;
    }
    .formData>ul.formDataItems>li{
        border-right:1px solid #ddd;
        border-left:0;
        border-bottom:0;
        text-align: center;
        line-height: 69px;
        height:69px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .bolder{
        font-weight: bold;
    }

    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .formData>ul.formDataItems>li{
        text-align: left;
        padding:0 15px;
    }
    .formData>ul.formDataItems>li.align-center{
        text-align: center;
        padding:0;
        text-indent: 40px;
    }
    .formData>ul.formDataItems>li.align-right{
        text-align: right;
    }
    .formData>ul.bottomForm>li{
        border:none;
        text-align: right;
        height:100px;
        line-height:100px;
    }
    .formData>ul.bottomForm>li:last-child{
        border-right:1px solid #ddd;
    }
   }

</style>
