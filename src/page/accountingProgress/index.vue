<template>
  <div class="container">
    <div class="yearListCon">
      <side-year @year-click="yearClick"
                 title="年度" />
    </div>
    <div class="accountingProgress">

      <div class="progressContent">
        <p class="handleBtn">
          <span v-if="update"
                @click="updateUnitCount"
                class="btn">保存</span>
          <span v-if="update"
                @click="refresh"
                class="btn">取消</span>
          <span v-if="Roleauthorize.progressControl_edit!=0&&!update"
                @click="update=true"
                class="btn">编辑</span>
          <span v-if="Roleauthorize.progressControl_export!=0"
                @click="postExcel"
                class="btn">导出</span>
          <span v-if="Roleauthorize.progressControl_print!=0"
                @click="print"
                class="btn">打印</span>
          <span @click="refresh"
                style="font-size:27px;color:#00b7ee;cursor:pointer;    vertical-align: middle;"
                class="el-icon-refresh"></span>
        </p>
        <div>
          <div class="count">
            <ul>
              <li class="countHead">
                <div style="float:left">
                  项目
                </div>
                <div style="float:left">
                  单位数量
                </div>
              </li>
              <li>
                <el-tooltip content="指:在工会主管部门注册且合法的单位。">
                  <div>
                    在册单位
                  </div>
                </el-tooltip>
                <div v-show="update"
                     class="inputContainer">
                  <input type="text"
                         style="text-align:center;height:28px;border:0"
                         v-model="dataList.onbookNumber"
                         placeholder="请输入整数">

                </div>
                <div v-show="!update">
                  {{dataList.onbookNumber}}
                </div>
              </li>
              <li>
                <el-tooltip content="指:在系统中,已经完成注册的单位(包括使用到期、未初始化的单位)。">
                  <div>
                    已注册单位
                  </div>
                </el-tooltip>
                <div>
                  <span @click="showUnit('已注册',dataList.zhuceNumber)"
                        class="countClick">
                    {{dataList.zhuceNumber.length}}
                  </span>

                </div>
              </li>
              <li>
                <el-tooltip content="指:在系统中,已经完成注册的、未完成或完成第一次初始化的单位（不包括使用到期的单位）。">
                  <div>
                    有效单位
                  </div>
                </el-tooltip>
                <div>
                  <span @click="showUnit('有效',dataList.youxiaoNumber)"
                        class="countClick">{{dataList.youxiaoNumber.length}}</span>

                </div>
              </li>
              <li>
                <el-tooltip content="指:在系统中,已经完成注册的、且完成第一次初始化的、使用未到期的单位。">
                  <div>
                    建账单位
                  </div>
                </el-tooltip>
                <div>
                  <span @click="showUnit('建账',dataList.jianzhangNumber)"
                        class="countClick">
                    {{dataList.jianzhangNumber.length}}
                  </span>

                </div>
              </li>
            </ul>
          </div>
          <div class="tableCon">
            <el-table v-if="tableH"
                      ref="multipleTable"
                      :data="dataList.monthLists"
                      :height="tableH"
                      tooltip-effect="dark"
                      header-align="center"
                      header-row-class-name="headerClass"
                      style="width: 100%">
              <el-table-column label="月份"
                               prop="Month">

              </el-table-column>
              <el-table-column label="做账进度(建账单位)">
                <el-table-column label="单位小计">
                  <el-table-column label="数量">
                    <template slot-scope="scope">
                      <span @click="showUnit('做账',scope.row.subtotalModel,scope.row.Month)"
                            class="countClick">
                        {{scope.row.subtotalModel.length}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="占在册单位比例">
                    <template slot-scope="scope">

                      <el-progress v-if="dataList.onbookNumber"
                                   :text-inside="true"
                                   :stroke-width="24"
                                   :percentage="parseFloat((scope.row.subtotalModel.length/dataList.onbookNumber*100).toFixed(2))"
                                   color="#83c350"></el-progress>

                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="已结账单位">
                  <el-table-column label="数量">
                    <template slot-scope="scope">
                      <span @click="showUnit('已结账',scope.row.finishModel,scope.row.Month)"
                            class="countClick">
                        {{scope.row.finishModel.length}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="占在册单位比例">
                    <template slot-scope="scope">
                      <el-progress v-if="dataList.onbookNumber"
                                   :text-inside="true"
                                   :stroke-width="24"
                                   :percentage="parseFloat((scope.row.finishModel.length/dataList.onbookNumber*100).toFixed(2))"
                                   color="#6acb9a"></el-progress>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="待结账单位">
                  <el-table-column label="数量">
                    <template slot-scope="scope">
                      <span @click="showUnit('待结账',scope.row.waitModel,scope.row.Month)"
                            class="countClick">
                        {{scope.row.waitModel.length}}
                      </span>
                    </template>

                  </el-table-column>
                  <el-table-column label="占在册单位比例">
                    <template slot-scope="scope">
                      <el-progress v-if="dataList.onbookNumber"
                                   :text-inside="true"
                                   :stroke-width="24"
                                   :percentage="parseFloat((scope.row.waitModel.length/dataList.onbookNumber*100).toFixed(2))"
                                   color="#fc0f3b"></el-progress>
                    </template>
                  </el-table-column>
                </el-table-column>

              </el-table-column>
            </el-table>
          </div>
        </div>

      </div>

    </div>
    <el-dialog :visible.sync="unitShow"
               width="750px"
               custom-class="unitListDialog"
               title="工会名单">
      <unit-list v-if="unitShow"
                 :phids="phids"
                 :monthType="monthType"
                 :unitList="unitList">
      </unit-list>
    </el-dialog>
    <!-- 打印 -->
    <div style="display:none">
      <div ref="unitprint"
           class='print'>
        <table cellspacing="0"
               cellpadding="0">
          <tr>
            <td>

              项目

            </td>
            <td>单位数量</td>
          </tr>
          <tr>
            <td>
              <div style="height:30px;line-height:30px">行政在册单位</div>
            </td>
            <td>{{dataList.onbookNumber}}</td>
          </tr>
          <tr>
            <td>
              <div style="height:30px;line-height:30px">已注册单位</div>
            </td>
            <td>{{dataList.zhuceNumber.length}}</td>
          </tr>
          <tr>
            <td>
              <div style="height:30px;line-height:30px">有效单位</div>
            </td>
            <td>{{dataList.youxiaoNumber.length}}</td>
          </tr>
          <tr>
            <td>
              <div style="height:30px;line-height:30px">建账单位</div>
            </td>
            <td>{{dataList.jianzhangNumber.length}}</td>
          </tr>
          <tr>
            <td>月份</td>
            <td class="monthList">

              <div>做账进度(建账单位)</div>
              <div>
                <div>单位小计</div>
                <div>已结账单位</div>
                <div>待结账单位</div>
              </div>
              <div>
                <div>
                  <div>数量</div>
                  <div>占行政在册单位比例</div>
                </div>
                <div>
                  <div>数量</div>
                  <div>占行政在册单位比例</div>
                </div>
                <div>
                  <div>数量</div>
                  <div>占行政在册单位比例</div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-for="(item , ind) of dataList.monthLists"
              :key="ind">
            <td> {{item.Month}}</td>
            <td class="listCon">
              <div>
                <div>{{item.subtotalModel.length}}</div>
                <div>{{dataList.onbookNumber?parseFloat((item.subtotalModel.length/dataList.onbookNumber*100).toFixed(2)):''}}</div>
              </div>
              <div>
                <div>{{item.finishModel.length}}</div>
                <div>{{dataList.onbookNumber?parseFloat((item.finishModel.length/dataList.onbookNumber*100).toFixed(2)):''}}</div>

              </div>
              <div>
                <div>{{item.waitModel.length}}</div>
                <div>{{dataList.onbookNumber?parseFloat((item.waitModel.length/dataList.onbookNumber*100).toFixed(2)):''}}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>
<script>
import unitList from './unitList'
import { GetAllPublicRegister, PostAddPublicRegister, PostPublicRegisterList, GetAllPublicRegisterToExcel, PostPublicRegisterListToExcel } from '@/api/accountProgress'
import { mapState, mapActions } from 'vuex'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import sideYear from './sideYear'
export default {
  name: "accountingProgress",
  data () {
    return {
      year: '',
      tableH: '',//表格高度
      update: false,//可编辑
      dataList: {
        zhuceNumber: [],
        jianzhangNumber: [],
        youxiaoNumber: [],
        monthLists: []
      },
      unitShow: false,//显示单位弹窗
      phids: [],//单位phid列表
      unitList: [],//单位列表
      monthType: '',//单位月份类型
    }
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgName: state => state.user.orgName,
      dbname: state => state.user.dbname,
      orgcode: state => state.user.orgcode,
      Roleauthorize: state => state.user.Roleauthorize,//按钮权限
      cachePage: state => state.tagNav.cachePage  //是否利用路由缓存
    }),
  },
  mounted () {
    let vm = this;
    window.addEventListener("resize", vm.setTableH);
    this.$nextTick(function () {
      //设置table列表高度
      this.setTableH();
    })
  },
  beforeDestroy () {
    let vm = this;
    window.removeEventListener("resize", vm.setTableH)
  },
  watch: {
    dataList: {
      handler (val) {
        if (parseInt(val.onbookNumber)) {
          val.onbookNumber = parseInt(val.onbookNumber)
        } else {
          val.onbookNumber = ''
        }

      },
      deep: true
    }
  },
  methods: {
    refresh () {
      this.update = false;
      this.getData();
    },
    getData () {
      let data = {
        OrgId: this.orgid,
        FYear: this.year,
        // OrgId: 430382,
        // FYear: 2019
      }
      const loading = this.$loading();
      GetAllPublicRegister(data).then(res => {
        loading.close();
        if (res.Status == 'error') {
          this.$msgBox.error(res.Msg)
        } else {
          this.dataList = res
        }
      }).catch(err => {
        loading.close();
        console.log(err)
        this.$msgBox.error('获取做账进度数据失败!')
      })
    },
    //修改行政在册单位数量
    updateUnitCount () {
      let data = {
        OrgId: this.orgid, //当前登录的组织Id
        OrgCode: this.orgcode,  //当前登录的组织code
        FYear: this.year,  //当前选中年度
        Numbers: this.dataList.onbookNumber  //（选填）用户输入的行政单位数
      }
      const loading = this.$loading();
      PostAddPublicRegister(data).then(res => {
        loading.close()
        this.$msgBox.show(res.Msg)
        if (res.Status == 'success') {
          this.refresh();
        }
      }).catch(err => {
        loading.close()
        console.log(err)
        this.$msgBox.error('修改行政在册单位数量失败!')
      })
    },
    //打印
    print () {
      // let data = this.$refs.unitprint;
      // document.querySelector('.el-table__body').style.height = 'auto';
      // document.querySelector('.el-table__body-wrapper').style.height = 'auto';
      // document.querySelector('.tableCon .el-table').style.height = 'auto';
      let print = document.createElement("div");
      let content = this.$refs.unitprint.cloneNode(true);
      print.appendChild(content)
      // console.log(data)
      this.$nextTick(() => {
        this.$print(print);
      })

    },
    //年度选择
    yearClick (data) {
      this.year = data
      this.refresh()
    },
    //设置table高度
    setTableH () {
      let tableCon = document.querySelector('.accountingProgress');
      let h = window.getComputedStyle(tableCon).height;
      this.tableH = parseFloat(h) - 220 + 'px';
    },
    //导出
    postExcel () {
      let vm = this;
      let list = [];
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      let data = {
        OrgId: this.orgid,   //当前登录的组织Id
        FYear: this.year, //当前选中年度
        uid: this.uid //用户Uid
      }
      GetAllPublicRegisterToExcel(data).then(res => {
        if (res.Status == 'error') {
          this.$msgBox.show(res.Msg)
        } else {
          vm.downFileUrl = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
          window.open(vm.downFileUrl, "_blank")
        }

      }).catch(err => {
        console.log(err)
        this.$msgBox.show('导出失败!')
      })
    },
    //显示单位明细列表
    showUnit (type, arr, month) {
      if (!arr.length) {
        return;
      }
      let data = {
        addlist: arr
      }
      const loading = this.$loading();
      PostPublicRegisterList(data).then(res => {
        loading.close()

        if (res.Status == 'error') {
          this.$msgBox.show(res.Msg)
        } else {
          this.phids = arr;
          this.unitList = res;
          this.unitShow = true;
          if (month) {

          }
          this.monthType = month ? (month + type) : type
        }

      }).catch(err => {
        console.log(err)
        loading.close()
        this.$msgBox.error('获取单位明细失败!')
      })

    }
  },
  components: {
    sideYear,
    unitList
  }
}
</script>
<style lang="scss" scoped>
@page {
  //横向打印
  size: A4 landscape;
}
.container {
  padding: 0;
  overflow: hidden;
  height: 100%;
}
.accountingProgress {
  width: 100%;
  height: 100%;
  padding-right: 55px;
}
.progressContent {
  width: 100%;
  height: 100%;
  padding: 10px 15px;
  .handleBtn {
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    > span {
      margin-left: 10px;
    }
  }
}
.count {
  font-size: 17px;
  width: 100%;
  .countHead {
    background: #d3e8f9;
    height: 40px;
    line-height: 40px;
    color: #333;
    > div {
      height: 40px;
      line-height: 40px;
      font-size: 19px;
      border-top: 1px solid #bcbdbd;
    }
  }
  li {
    color: #888;
    height: 30px;
    line-height: 30px;
    text-align: center;
    > div {
      height: 30px;
      line-height: 30px;
      border: 1px solid #bcbdbd;
      border-width: 0 1px 1px 0;
      float: left;
      width: 75%;

      &:first-of-type {
        width: 25%;
        border-left: 1px solid #bcbdbd;
      }
    }
    &:last-of-type {
      > div {
        border-bottom: 0;
      }
    }
  }
}
.yearListCon {
  float: right;
  height: 100%;
  margin-right: 0px;
}
.countClick {
  color: #00b7ee;
  text-decoration: underline;
  cursor: pointer;
}
.print {
  margin: 50px 10px 0 10px;
  table {
    width: 100%;

    tr:first-of-type {
      font-size: 18px;
      height: 40px;
    }
    tr {
      td {
        min-height: 40px;
        border: 1px solid #ccc;
        text-align: center;
      }
    }
  }
  .monthList {
    > div {
      overflow: hidden;
      height: 40px;
      line-height: 40px;
      &:first-of-type {
        border-bottom: 1px solid #ccc;
      }

      > div {
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        width: 33.33%;
        float: left;
        border-right: 1px solid #ccc;
        &:last-of-type {
          border: 0;
        }
        > div {
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
          width: 50%;
          height: 40px;
          line-height: 40px;
          float: left;
          &:last-of-type {
            border-right: 0;
          }
        }
      }
    }
  }
  .listCon {
    div {
      width: 33.33%;
      > div {
        width: 50%;
      }
      height: 30px;
      line-height: 30px;
      border-right: 1px solid #ccc;
      float: left;
      &:last-of-type {
        border: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.accountingProgress .el-table thead.is-group .headerClass th {
  background: #d3e8f9;
  text-align: center;
}
.accountingProgress {
  .el-table {
    font-family: "PFang", "PingFang", "songti", "Helvetica Neue", Helvetica,
      arial, sans-serif;
    border-color: #bcbdbd;
  }
  .el-table--group::after,
  .el-table--border::after,
  .el-table::before {
    background-color: #bcbdbd;
  }
  .el-table tr {
    border-color: #bcbdbd;
  }
  .el-table th {
    border-color: #bcbdbd;
    color: #333;
    font-size: 18px;
    font-family: "PFang", "PingFang", "songti", "Helvetica Neue", Helvetica,
      arial, sans-serif;
  }
  .el-table td {
    font-size: 17px;
    border-color: #bcbdbd;
    text-align: center;
    color: #888;
    font-family: "PFang", "PingFang", "songti", "Helvetica Neue", Helvetica,
      arial, sans-serif;
  }
}
.unitListDialog {
  .el-dialog__body {
    // padding: 0 20px;
  }
}
</style>
