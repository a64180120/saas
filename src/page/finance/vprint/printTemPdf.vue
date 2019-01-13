
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
                <li>凭证号：{{item.mst.voucherNum}}-{{item.page+'/'+item.toltal}}</li>
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
                      <li class="align-right">{{del.JSum}}</li>
                      <li class="align-right">{{del.DSum}}</li>
                </ul>
                <ul class="formDataItems flexPublic">
                    <li >
                        合计： <span class="bolder"> {{item.mst.lotal | NumtoCHN}}</span>
                    </li>
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
  props: {
      "printData":Array
 },
  data() {
    return {
      //htmlTitle: "voucher"
      tableData:[]
    }
  },
  created() { },
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
      printData(val){
          var vm=this;
          if(val.length>0){
            this.printvoucher(vm);
          }
         
      }
  },
  methods: {
    printvoucher(vm){
        //数据制空初始化
        var vm=this;
        vm.tableData=[];
       
        vm.voucher5tr(
            setTimeout(()=>{
                vm.$emit('print-click',true)
            //下载pdf

            // vm.getPdf(vm.$refs.printVoucher);
            })
        )   
                
    },
    //每5列切成一张凭证
    voucher5tr(vm){
        let mst;
        let del;
        let tr5;
        let index;
        let page;
        let toltal;
        for(let data of this.printData){
            tr5 = []; //[[{},{},{},{},{}]]一维变多维
            mst = data.mst;    //{}
            del = data.list;  //[]
            index = 0;
            page = 1;
            toltal = Math.ceil(del.length/5);
            del.forEach((n, i) => {
                if (!tr5[index]) {
                tr5[index] = [];
                }
                tr5[index].push(n);
                if (tr5[index].length === 5) {
                index++;
                }
                if(index==5){
                    page++
                }
            });

            //最后一个,不足5条数据的要补充完成
            let last = tr5[tr5.length - 1];
            for (let i = 0,l = 5 - last.length; i < l; i++) {
            last.push({
                abstract: "", //摘要
                subject: "", //科目是否有辅助核算，有辅助核算，拼接上辅助核算
                Jsum: "", //借方金额
                Dsum: "" //贷方金额
            })
            }
            //this.tableData的赋值
            tr5.forEach(n=>{
                this.tableData.push({
                    mst:mst,
                    list:n,
                    toltal:toltal,
                    page:page
                })
            })    
        }
          
    }
  }
}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang="scss" scoped>
   
   .manageContent{
       &:nth-of-type(2n+1){
           border:none;        
       }
       &:nth-of-type(2n):before{
           display: inline-block;
           content:"";
       }
       overflow: hidden;
       height:861px;        
       font-size:17px;
       padding:110px 50px;
       border-top:1px solid #aaa;
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
        >ul:last-of-type{
            >li:first-of-type{
                width:70%;
            }
            >li:nth-of-type(2){
                width:15%;
            }
            >li:nth-of-type(3){
                width:15%;
            }
        }
    }
    .formData>ul>li{
        border-right:1px solid #aaa;;
        height:59px;
        line-height:59px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
       .formData>ul:first-child{
           font-size: 17px;
       }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #aaa;
    }
    .formData>ul>li:nth-of-type(1){
        width:30%;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(2){
        width:40%;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(3),
    .formData>ul>li:nth-of-type(4){
        width:15%;
        padding:0 2px;
    }

    .formDataItems{
        border-bottom:1px solid #aaa;
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
        border-right:1px solid #aaa;
        border-left:0;
        border-bottom:0;
        text-align: center;
        line-height: 49px;
        height:49px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .bolder{
        font-weight: bold;
    }

    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #aaa;
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
        border-right:1px solid #aaa;
    }
   }

</style>
