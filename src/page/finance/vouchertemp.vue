<template>

  <div class="vouchertemp">
    <div v-if="tempCss=='list'"
         class="vouchertempCon"
         :class="{vouchertempJieCon:temptype!='normal'}">
      <p class="title"><span>凭证模板</span><i @click.stop="finish(false)"></i></p>
      <el-row class="body">
        <el-col :span="1"
                class="type-group">
          <ul>
            <li @click.stop="voucherType('out')">
              <div class="type-btn"
                   :class="{active:typeTab=='out'}">
                <span>支<br />出<br />类</span>
              </div>
            </li>
            <li @click.stop="voucherType('in')">
              <div class="type-btn"
                   :class="{active:typeTab=='in'}">
                <span>收<br />入<br />类</span>
              </div>
            </li>
            <li @click.stop="voucherType('normal')">
              <div class="type-btn"
                   :class="{active:typeTab=='normal'}">
                <span>通<br />用<br />类</span>
              </div>
            </li>
            <li @click.stop="voucherType('jie')">
              <div class="type-btn"
                   :class="{active:typeTab=='jie'}">
                <span>结<br />转<br />类</span>
              </div>
            </li>
          </ul>
        </el-col>
        <!--表格-->
        <el-col :span="17"
                class="voucherTable">
          <el-table :data="voucherList"
                    border
                    height="552px"
                    @row-dblclick="finish"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    :header-row-class-name="headerRowName">
            <el-table-column type="index"
                             label="序号"
                             width="50"
                             align="center"></el-table-column>
            <el-table-column prop="TemName"
                             label="模板名称"
                             header-align="center"
                             align="left"></el-table-column>
            <el-table-column label="操作"
                             width="150"
                             align="center">
              <template slot-scope="scope">
                <div class="iconCon">
                  <el-tooltip class="icon-btn"
                              effect="dark"
                              content="使用模板"
                              placement="bottom-start">
                    <img @click.stop="finish(scope.row)"
                         class="icon-use"
                         src="../../assets/img/k1.png">
                  </el-tooltip>
                  <el-tooltip class="icon-btn"
                              effect="dark"
                              content="编辑"
                              placement="bottom-start">
                    <img @click.stop="tempHandle('update',scope.row)"
                         class="icon-edit"
                         src="../../assets/img/k2.png">
                  </el-tooltip>
                  <el-tooltip v-if="scope.row.IsSystem==0"
                              class="icon-btn"
                              effect="dark"
                              content="删除"
                              placement="bottom-start">
                    <img @click.stop="tempHandle('delete',scope.row)"
                         class="icon-detail"
                         src="../../assets/img/k3.png">
                  </el-tooltip>
                </div>

              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <!--详情-->
        <el-col :span="6"
                class="detail">
          <div class="detail-main">
            <!--搜索-->
            <div class="search">
              <el-input @keyup.13.native="getvoucherList"
                        @clear="getvoucherList"
                        v-model="searchVal"
                        placeholder="模板名称"
                        :clearable="true"
                        class="search-btn"
                        size="medium">
                <img @click.stop="getvoucherList"
                     class="search-icon"
                     slot="suffix"
                     src="../../assets/img/search.png">
              </el-input>
            </div>
            <!--借贷科目-->
            <div class="loan">
              <span v-show="choosedItem&&choosedItem.Dtls.length==0">无科目</span>
              <div v-if="choosedItem"
                   v-html="choosedItem.subValue">

              </div>
            </div>
            <!--备注-->
            <div class="remark">
              <span v-show="choosedItem&&!choosedItem.RMark">无备注</span>
              <p v-if="choosedItem">{{choosedItem.RMark}}</p>
            </div>
            <!-- 新增模板 -->
            <div @click.stop="tempHandle('add')"
                 class="addBtn">
              <span>新增模板</span>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
    <div v-if="tempCss=='add'||tempCss=='update'"
         class="vouchertempCon tempAdd">
      <p class="title"><span v-if="tempCss=='add'">新增模板</span><span v-if="tempCss=='update'">修改模板</span><i @click="showList"></i></p>
      <div class=" tempName">
        <!-- <div style="float:left" v-if="tempCss=='add'" class="flexPublic"><span>模板名称</span><div class="inputContainer"><input type="text" placeholder="输入模板名称" v-model="TemName"></div></div>
                <div style="float:left" v-if="tempCss=='update'" class="flexPublic"><span>模板名称</span><div class="inputContainer"><input type="text"  v-model="TemName"></div></div> -->
        <div class="btn"
             style="float:right"
             @click.stop="add()">保存模板</div>
        <div style="margin-top:40px"
             class="flexPublic">
          <span style="width:80px;text-align:right">模板名称&nbsp;</span>
          <div style="width:79%;"
               class="inputContainer">
            <input type="text"
                   maxlength="150"
                   placeholder="输入模板名称"
                   v-model="TemName">
          </div>
          <div style="line-height: 30px;margin:0 10px;width:80px;text-align:right;">模板类型</div>
          <div style="display: inline-block"
               class="selectContainer">
            <select v-model="tempDescription">
              <option value="0">通用类</option>
              <option value="1">收入类</option>
              <option value="2">支出类</option>
            </select>
          </div>

        </div>
        <div style="margin-top:10px"
             class="flexPublic">
          <span style="width:80px;text-align:right">备注&nbsp;</span>
          <div class="inputContainer">
            <input type="text"
                   maxlength="150"
                   placeholder="请录入模板备注"
                   v-model="RMark">
          </div>
        </div>

      </div>
      <div style="overflow: auto;height: 420px;">
        <temp-vou :dataList="voucherDataList"
                  ref="voucher"></temp-vou>
      </div>
    </div>
    <!-- confirm -->
    <saasconfirm :type="confirm.type"
                 :message="confirm.message"
                 v-show="confirm.visible"
                 :btn1="confirm.btn1"
                 :btn2="confirm.btn2"
                 @ok-click="confirmOk"
                 @no-click="confirmNo">
    </saasconfirm>
  </div>
</template>

<script>
import userInfo from '@/util/auth'
import tempVou from './tempVou'
import { mapState, mapActions } from 'vuex'
export default {
  name: "voucher-list",
  mounted () {
    this.getvoucherList();
    this.uInfo = userInfo.getUserInfoData().userInfo;
  },
  // props:{
  //     temptype:String,//模板类型
  // },
  data () {
    return {
      temptype: 'normal',//普通模板和结转合并了  /jie/带表结转
      typeTab: 'normal',
      searchVal: '',
      TemName: '',//模板名称
      RMark: '',//模板备注
      voucherDataList: { bool: false, data: { Mst: '', Attachements: [] } },
      voucherList: [],//展示的数据
      pagesize: 100,
      pageindex: 0,
      tempCss: 'list',
      uInfo: '',
      deleteItem: '',//删除的模板
      confirm: {
        message: '',
        visible: false,
        type: '',
      },
      choosedItem: { Dtls: [] },//选中行数据
      inVoucherList: [],//收入模板
      outVoucherList: [],//支出模板
      norVoucherList: [],//通用模板
      tempDescription: '0',//收入支出通用
    }
  },
  methods: {
    //凭证列表***********
    getvoucherList () {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        pagesize: this.pagesize,
        pageindex: this.pageindex,
        queryfilter: { "TemName*str*like*1": this.searchVal, "PType*str*eq": "记" }
      }
      if (this.temptype == 'jie') {
        data.queryfilter = { "TemName*str*like*1": this.searchVal, "PType*str*eq": "结" }
      }
      this.$axios.get('PVoucherTemplateMst/GetVoucherTemplateList', { params: data })
        .then(res => {
          if (this.temptype == 'jie') {
            this.voucherList = res.Record;
          } else {
            this.inVoucherList = [];
            this.outVoucherList = [];
            this.norVoucherList = [];
            this.data = res.Record
            for (let vou of res.Record) {
              if (vou.Description == 1) {
                this.inVoucherList.push(vou);
              } else if (vou.Description == 2) {
                this.outVoucherList.push(vou);
              } else {
                this.norVoucherList.push(vou);
              }
            }
            if (this.typeTab == 'in') {
              this.voucherList = JSON.parse(JSON.stringify(this.inVoucherList));
            } else if (this.typeTab == 'out') {
              this.voucherList = JSON.parse(JSON.stringify(this.outVoucherList));
            } else {
              this.voucherList = JSON.parse(JSON.stringify(this.norVoucherList));
            }
          }

          // if(this.voucherList.length<=0){
          //     this.$message('暂无凭证模板!');
          // }

        }, err => {
          console.log(err);

        })
        .catch(err => console.log(err))
    },
    //选中行
    handleCurrentChange (val) {
      console.log(val)
      if (!val) {
        this.choosedItem = { Dtls: [] }
        return;
      }
      this.choosedItem = JSON.parse(JSON.stringify(val));
      let dom = '<p>科目:</p>';
      for (let a of this.choosedItem.Dtls) {

        dom += '<p>' + a.SubjectCode + '&nbsp;&nbsp;&nbsp;' + a.SubjectName + '</p>'
        if (!a.SubjectCode) {
          dom = '<span style="color:#ccc">无科目</span>';
          break;
        }
      }
      this.choosedItem.subValue = dom;
    },
    //confirm确认框方法*******
    confirmOk (type) {
      this.confirm.visible = false;
      switch (type) {
        case 'delete':
          this.delete(this.deleteItem);
          break;


      }
    },
    confirmNo (type) {
      this.confirm.visible = false;
    },
    //普通模板切换类型
    voucherType (val) {
      this.typeTab = val;
      if (val == 'jie') {
        this.temptype = val;
      } else {
        this.temptype = 'normal'
      }
      this.getvoucherList();
    },
    //显示,切换,修改,添加*****************
    tempHandle (val, item) {
      if (!val) {
        this.showList();
      } else {
        switch (val) {
          case 'add':
            this.voucherDataList.data = { Mst: '', Attachements: [] }
            this.voucherDataList.bool = true;
            this.TemName = '';
            this.RMark = '';
            if (this.typeTab == 'in') {
              this.tempDescription = 1;
            } else if (this.typeTab == 'out') {
              this.tempDescription = 2;
            } else {
              this.tempDescription = 0;
            }
            this.tempCss = 'add';
            break;
          case 'delete':
            this.confirm = {
              message: '此操作将永久删除凭证模板,是否继续?',
              type: 'delete',
              visible: true
            }
            this.deleteItem = item;

            break;
          case 'update':
            this.voucherDataList.data.Mst = item;
            this.TemName = item.TemName;
            this.RMark = item.RMark;
            this.tempDescription = item.Description;
            if (!item.Description) {
              this.tempDescription = '0';
            }
            this.tempCss = 'update';
            break;
        }
      }
    },
    //手动刷新voucher组件**************************
    resetVoucher () {
      var vm = this;
      this.voucherDataList.bool = false;

      function delay () {
        vm.voucherDataList.bool = true
      }
      setTimeout(delay, 5);
    },
    //添加修改******************
    add () {
      var url = 'add';
      this.voucherData();
      if (this.voucherDataList.data.Mst.Dtls.length <= 0) {
        this.$message('请输入内容!')
        return;
      }
      this.voucherDataList.data.Mst.TemName = this.TemName;
      this.voucherDataList.data.Mst.RMark = this.RMark;
      this.voucherDataList.data.Mst.UseCount = this.uInfo.Account;
      this.voucherDataList.data.Mst.Userid = this.uid;
      this.voucherDataList.data.Mst.Description = this.tempDescription;
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        infoData: this.voucherDataList.data
      }
      if (this.voucherDataList.data.Mst.PhId) {
        url = 'update';
      }
      const loading1 = this.$loading();
      this.$axios.post('/PVoucherTemplateMst/Post' + url, data)
        .then(res => {
          console.log(res)
          if (res.Status == 'success') {
            this.$message('保存成功!')
            this.showList();
            this.choosedItem = { Dtls: [] }
            /*继续添加
            this.voucherDataList.bool=false;
            var vm=this;
            function delay(){
                vm.voucherDataList.bool=true
            }
            setTimeout(delay,10);*/
          } else {
            this.$message('保存失败,请重试!')
          }
          loading1.close();
        }, err => {
          console.log(err);

        })
        .catch(err => { console.log(err); loading1.close(); })
    },
    //删除*********************
    delete (item) {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        id: item.PhId
      }

      this.$axios.post('PVoucherTemplateMst/PostDelete', data)
        .then(res => {
          this.showList();
        }, err => {
          console.log(err);

        })
        .catch(err => console.log(err))
    },
    //给父组件传值*************
    finish (item) {
      console.log(item)
      if (item) {
        this.clearPhId(item);
      }

      this.$emit('temp-click', item);
    },
    //清空凭证phid*****************
    clearPhId (item) {


      item.PhId = '';
      item.PMakePerson = this.username;
      item.PKeepingPerson = this.curOrg.AccountPeople;
      item.PFinancePerson = this.curOrg.Treasurer;
      item.PCashier = this.curOrg.Cashier;
      for (var dtl of item.Dtls) {

        dtl.PhId = '';
        dtl.PhidTransaction = '';
        dtl.PhidVouchermst = '';
        if (dtl.DtlAccounts) {

          dtl.DtlAccounts[0].PhId = '';
          dtl.DtlAccounts[0].PhidTransaction = '';
          dtl.DtlAccounts[0].PhidVouchermst = '';
          dtl.DtlAccounts[0].PhidVoucherDel = '';
        }
      }
    },
    //凭证搜索**************************
    searchVoucher (val) {
      const loading1 = this.$loading();
      var data = {
        id: 0,
        uid: this.uid,
        orgid: this.orgid,
        queryfilter: { "SubjectCode*str*eq*1": this.searchVal, "SubjectName*str*eq*1": this.searchVal, "Abstract*str*eq*1": this.searchVal, "PNo*str*eq*1": this.searchVal }
      }
      this.$axios.get('PVoucherTemplateMst/GetVoucherTemplate', { params: data })
        .then(res => {
          console.log(res)
          this.voucherList = res.Record;
          loading1.close();
          if (this.voucherList.length <= 0) {
            this.$message('无法找到该凭证!')
          }
        }, err => {
          console.log(err);

        })
        .catch(err => { console.log(err); loading1.close(); })
    },
    //接收voucher组件传值************
    voucherData () {
      this.voucherDataList.data = this.$refs.voucher.voucherData();
    },
    showList () {
      this.tempCss = 'list';
      this.voucherDataList = { bool: false, data: { Mst: '', Attachements: [] } }
      this.getvoucherList();
    },
    headerRowName () {
      return 'headerRowName'
    }
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      curOrg: state => state.user.curOrg,   //当前的组织信息
      username: state => state.user.username,
      orgcode: state => state.user.orgcode
    })
  },
  filters: {
    sum (val, dtl) {
      var sum = 0;
      switch (val) {
        case 'jie':
          for (var d of dtl) {
            if (d.JSum) {
              sum += parseFloat(d.JSum);
            }
          }
          sum = sum.toFixed(2);
          break;
        case 'dai':
          for (var d of dtl) {
            if (d.DSum) {
              sum += parseFloat(d.DSum);
            }
          }
          sum = sum.toFixed(2);
          break;
        case 'sum':
          for (var d of dtl) {
            if (d.JSum) {
              sum += parseFloat(d.JSum);
            }
          }
          sum = sum.toFixed(2);
          var arr1 = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];
          var arr2 = ['', '拾', '百', '千', '万', '亿'];
          var str = sum.toString().split('.');
          var dot = '元';
          var INTstr = str[0];
          var INT = '';
          var bool = false;
          var zero = '';
          if (parseInt(str[1]) != 0) {
            dot += arr1[str[1][0]] + '角';
            if (str[1][1] != 0) {
              dot += arr1[str[1][1]] + '分'
            }
          } else {
            dot += '整'
          }
          for (var i = INTstr.length - 1, j = 0; i >= 0; i-- , j++) {
            if (INTstr[i] != 0) {
              bool = true;
            }
            if (j == 4) {
              INT = arr2[j] + INT;
            } else if (j == 8) {
              INT = arr2[5] + INT;
            }
            if (bool) {
              if (INTstr[i] != 0) {
                if (zero == '零') {
                  zero = '';
                }
                if (j == 4) {
                  INT = arr1[INTstr[i]] + INT;
                  bool = false;
                } else if (j == 8) {
                  INT = arr1[INTstr[i]] + INT;
                } else {
                  INT = arr1[INTstr[i]] + arr2[j % 4] + INT;
                  bool = false;
                }
              } else {
                if (zero == '') {
                  INT = '零' + INT;
                  zero = '零';
                }
                if (j == 4) {
                  INT = arr2[j] + INT;
                  bool = false;
                } else if (j == 8) {
                  INT = arr2[5] + INT;
                  bool = false;
                }
              }
            }
          }
          sum = INT + dot;
          break;
      }
      return sum;

    },

  },
  components: {
    tempVou,
  }
}
</script>

<style lang="scss" scoped>
.vouchertemp {
  background: rgba(0, 0, 0, 0.5);

  position: fixed;
  position: -ms-page;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .vouchertempCon {
    background: #fff;
    padding: 10px 30px;
    width: 1100px;
    height: 650px;
    margin: 80px auto 0;
    border-radius: 10px;
    .title {
      border-bottom: 1px solid #ccc;
      padding: 5px 2px;
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 14pt;
      font-style: normal;
      font-weight: 700;
      i {
        background: url("../../assets/icon/close.svg");
        background-size: cover;
        width: 20px;
        height: 20px;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
    .body {
      margin-top: 20px;
      .type-group {
        margin-top: 1px;
        text-align: right;
        > ul {
          display: inline-block;
          width: 32px;
          > li {
            > .type-btn {
              border: 1px solid #dcdfe6;
              border-radius: 5px 0 0 5px;
              height: 100px;
              position: relative;
              cursor: pointer;
              > span {
                color: #606060;
                font-size: 18px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
            > .active {
              background-color: #00b7f0;
              border: 1px solid #00b7f0;
              > span {
                color: #ffffff;
              }
            }
          }
        }
      }
      .detail {
        > .detail-main {
          margin-left: 15px;
          > .search {
            width: 100%;
          }
          > .loan {
            overflow: auto;
            margin-top: 20px;
            width: 100%;
            height: 200px;
            border: 1px solid #dcdfe6;
            border-radius: 5px;
            padding: 10px;
            span {
              color: #ccc;
            }
          }
          > .remark {
            overflow: auto;
            margin-top: 20px;
            width: 100%;
            height: 220px;
            padding: 10px;
            border: 1px solid #dcdfe6;
            border-radius: 5px;
            > span {
              color: #ccc;
            }
          }
        }
      }
    }
  }
}
.icon-btn {
  margin: 0 5px;

  &:hover {
    cursor: pointer;
  }
  > .icon-use {
    width: 21px;
  }
  > .icon-edit {
    width: 21px;
  }
}
.addBtn {
  margin-top: 10px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background: #88b927;
  cursor: pointer;
  font-size: 18px;
  letter-spacing: 3px;
  padding: 0px;
  border: 0;
  border-radius: 5px;
}
.tempAdd {
  .tempName {
    overflow: hidden;
    margin: 20px 0;
    > div:first-of-type {
      padding: 0 10px;
      width: 100px;
      margin-left: 20px;
      > span {
        width: 100px;
      }
    }
    // >div:last-of-type{
    //     cursor: pointer;
    //     background: #00b7ee;
    //     color:#fff;
    //     text-align: center;
    //     border:1px solid #00b7ee;
    //     border-radius: 5px;
    //     height:30px;
    //     line-height: 30px;
    //     width:90px;
    //     &:hover{
    //         background: #fff;
    //         color:#00b7ee;
    //     }
    // }
  }
}
.iconCon {
  text-align: left;
}
</style>
<style scoped>
.search-btn >>> .el-input__inner {
  height: 40px;
}
.search-icon {
  width: 30px;
  margin: 5px 5px 0 0;
}
.search-icon:hover {
  cursor: pointer;
}
</style>
<style>
.headerRowName th {
  background-color: #00b8ee !important;
  color: #ffffff;
}
.vouchertemp .search-btn.el-input .el-input__icon.el-icon-circle-close {
  position: absolute;
  left: -30px;
}
</style>
