<template>
  <div class="unitList">
    <!-- <div class="searcherCon">
      <div class="btn">打印</div>
      <div class="btn">导出</div>
      <div @click="getvoucherList('search')"
           class="searcherBtn">搜索</div>
      <div class="searcherValue"><input @keyup.13="getvoucherList('search')"
               v-model="searchVal"
               type="text"
               placeholder="请输入工会名称"></div>

    </div>
    <div class="listHead">
      <span>共</span>
      <span>{{1}}</span>
      <span>条记录</span>
      <div>
        <el-checkbox v-model="allCheck">全选</el-checkbox>
      </div>

    </div>
    <div class="listCon">
      <div class="container">

      </div>
    </div> -->
    <div style="height: 35px;margin-top: -35px;">
      <ul class="flexUl">

        <li class="btn"
            @click="postOrgSheetExcel">导出</li>
        <li class="btn"
            @click="printContent">打印</li>
        <!--<li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>-->
      </ul>
      <ul class="flexUl"
          style="line-height: 30px">
        <div @click="searchCode"
             class="searcherBtn flexUl">搜索</div>
        <div class="searcherValue flexUl"
             style="height:30px"><input style="min-width:200px"
                 @keyup.13="searchCode"
                 v-model="inputKvalue"
                 type="text"
                 placeholder="请输入工会名称"></div>

      </ul>
    </div>
    <div>共
      <span style="color: #00B8EE;">{{units.length}}</span>
      条记录
      <el-checkbox style="margin-left: 10px;"
                   v-model="checked"
                   @change="checkedAll">全选</el-checkbox>
    </div>
    <div style="width: auto; margin: 0 auto;margin-top: 30px">
      <div class="container"
           style="position:static;margin-top: -20px;height:450px;overflow-y: auto">
        <!--<ul>
                      <template v-for="item in (showReportOrgType==1?SysOrgVerifyList:SysOrgNoVerifyList)">
                          <li style="height: 30px;line-height: 30px">{{item.OrgName}}</li>
                      </template>
                  </ul>-->

        <el-tree class="filter-tree"
                 :data="units"
                 :props="defaultProps"
                 show-checkbox
                 node-key="PhId"
                 @check-change="handleCheckChange"
                 ref="vuetree">
        </el-tree>
        <div style="display: none;">
          <div ref="unitDtl"
               class="print">
            <table class="form">
              <tr>
                <td colspan="6">{{monthType+'公会名单'}}</td>
              </tr>
              <tr>
                <td colspan="3">{{'制表人:'+uname}}</td>
                <td colspan="3">{{'编制日期:'+new Date().getFullYear()+'年'+(new Date().getMonth()>9?new Date().getMonth():'0'+new Date().getMonth())+'月'+(new Date().getDate()>9?new Date().getDate():'0'+new Date().getDate())+'日'}}</td>
              </tr>
              <tr>
                <td rowspan="2">
                  序号
                </td>
                <td colspan="4">
                  未上报工会
                </td>
                <td rowspan="2">
                  隶属工会
                </td>
              </tr>
              <tr>
                <td>名称</td>
                <td>工会主席</td>
                <td>财务主管</td>
                <td>联系电话</td>
              </tr>
              <tr v-for="(item,n) of checkedOrgList"
                  :key="n">
                <td>{{n+1}}</td>
                <td>{{item.OrgName}}</td>
                <td>{{item.Chairman}}</td>
                <td>{{item.Treasurer}}</td>
                <td>{{item.telePhone}}</td>
                <td>{{item.ParentName}}</td>
              </tr>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PostPublicRegisterList, PostPublicRegisterListToExcel } from '@/api/accountProgress'
import { mapState } from 'vuex'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
export default {
  name: 'unitList',
  props: {
    unitList: { //接收组织
      type: Array,
      default () {
        return []
      }
    },
    monthType: {
      type: String,
      default: ''
    },
    phids: {  //接收组织id列表
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      searchVal: '',
      allCheck: false,//全选
      defaultProps: {
        children: 'children',
        label: 'OrgName'
      },
      orglist: [],
      checkedOrgList: [],
      inputKvalue: '',
      checked: false,
      units: [],
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
    this.units = this.unitList;
  },
  methods: {

    handleCheckChange (val) {
      this.checkedOrgList = this.$refs.vuetree.getCheckedNodes()
    },

    checkedAll () {
      if (this.checked) {
        //全选
        this.$refs.vuetree.setCheckedNodes(this.unitList);
      } else {
        //取消选中
        this.$refs.vuetree.setCheckedKeys([]);
      }

    },
    //搜索
    searchCode () {
      debugger
      let data = {
        "addlist": this.phids,
        "OrgName": this.inputKvalue
      }
      const loading = this.$loading();
      PostPublicRegisterList(data).then(res => {
        loading.close()

        if (res.Status == 'error') {
          this.$msgBox.show(res.Msg)
        } else {
          this.units = res;

        }

      }).catch(err => {
        console.log(err)
        loading.close()
        this.$msgBox.error('获取单位明细失败!')
      })
    },
    //导出
    postOrgSheetExcel () {
      let vm = this;
      let list = [];
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      this.checkedOrgList.map(org => {
        list.push(org.PhId);
      })
      let data = {
        addlist: list,
        uid: this.uid,  //用户Uid
        MonthAndType: this.monthType //你传入的是几月份的什么类型的数据
      }
      PostPublicRegisterListToExcel(data).then(res => {
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
    // 打印
    printContent () {
      /*this.getPdf(this.$refs.printFrom);*/
      let print = document.createElement("div");
      let sto = this.$refs.unitDtl.cloneNode(true);
      print.appendChild(sto);
      this.$nextTick(() => this.$print(print))
    },
  },

}
</script>

<style lang="scss" scoped>
@page {
  //纵向打印
  size: A4 portrait !important;
}

.unitList {
  height: 500px;
}
.searcherCon {
  float: right;
  margin: 10px 0;
  min-width: 170px;
  position: relative;
  > div {
    float: right;
  }
  .btn {
    margin-left: 20px;
  }
}
.searcherCon .highGradeCss > ul li > div:last-of-type .el-date-editor.el-input {
  width: 100%;
}
.searcherValue {
  border: 1px solid #ddd;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  padding-left: 10px;
  float: left;
}
.searcherBtn {
  float: left;
  margin-right: 10px;
}
.listHead {
  clear: both;
  margin: 10px 0;
  padding-left: 10px;
  > div {
    display: inline-block;
    margin-left: 20px;
  }
}
.listCon {
  position: relative;
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
}
.container {
  width: 100%;
  height: 100%;
}
.flexUl {
  float: right;
}
.print {
  // margin: 50px 10px 0 10px;
  table {
    width: 100%;

    tr:first-of-type {
      font-size: 18px;
      height: 40px;
    }
    tr:nth-of-type(2) {
      > td {
        text-align: left;
        padding: 3px 10px;
        &:last-of-type {
          text-align: right;
        }
      }
    }
    tr {
      td {
        min-height: 40px;
        border: 1px solid #ccc;
        text-align: center;
      }
    }
  }
}
</style>
