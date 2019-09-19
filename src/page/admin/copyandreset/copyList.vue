<template>
  <div class="copyList">
    <p class="textR">
      <span @click="close"
            class="btngrey">取消</span>
      <span @click="confirm('delete')"
            style="margin-left:10px"
            class="btn">删除</span>
    </p>
    <div class="list">
      <el-table height="430px"
                border
                @selection-change="selectChange"
                tooltip-effect="dark"
                header-row-class-name="headerRow"
                :data="dataList">
        <el-table-column type="selection"
                         width="25px"
                         class-name="selection">

        </el-table-column>
        <el-table-column type="index"
                         label="序号"
                         width="40px"
                         class-name="selectionIndex"
                         :index="function(index){
                  return index+1}">

        </el-table-column>
        <el-table-column label="备份名称">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.Backupname">
              <div>
                {{scope.row.Backupname}}
              </div>
            </el-tooltip>

          </template>
        </el-table-column>
        <el-table-column label="备份时间">
          <template slot-scope="scope">
            <div>
              {{scope.row.NgInsertDt}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件大小">
          <template slot-scope="scope">
            <p>
              {{scope.row.Filesize}}KB
            </p>

          </template>
        </el-table-column>
        <el-table-column label="备份来源">
          <template slot-scope="scope">
            <p>
              {{source[scope.row.Backfrom]}}
            </p>

          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
import { GetOrganizeBackupList, GetDeleteOrganizeBackup } from '@/api/copyandreset'

export default {
  name: 'copyList',
  data () {
    return {
      selectedData: [],//选中的数据
      dataList: [],//所有备份数据
      source: ['手动备份', '结账前备份', '反结账前备份', '反初始化备份', '恢复前备份'],//备份来源
      confirmInfo: {
        'delete': ['此操作将永久删除数据,确定', '删除', '该备份?'],
      },
    }
  },
  mounted () {
    this.getBackupList();
  },
  methods: {
    close () {
      this.$emit('close');
    },
    refresh () { //刷新
      this.getBackupList();
    },
    confirm (str, data) {
      if (this.selectedData.length < 1) {
        this.$msgBox.show('请选择要删除的数据!')
        return;
      }
      let vm = this;
      const h = vm.$createElement;
      vm.$msgbox({
        customClass: 'confirmCon',
        title: '提示',
        type: 'success',
        iconClass: 'confirmImg',
        message: h('div', { style: "width:331px;height:65px;font-size:15px;transform: translateY(10px);    margin-left: 25px; text-indent:28px", }, [
          h('span', null, vm.confirmInfo[str][0]),
          h('span', { style: 'color:red' }, vm.confirmInfo[str][1]),
          h('span', null, vm.confirmInfo[str][2])
        ]),
        // message: h('div', { style: 'width:386px;height:120px', class: 'confirm' }, [
        //   h('div', { style: "width:55px;height:55px;float:left;    margin: 35px 5px 0 -5px;", class: 'confirmImg' }, ),
        //   h('div', { style: "width:331px;font-size:15px;float:left;    margin-top: 40px; text-indent:28px", }, [
        //     h('span', null, '为保证备份数据的完整性,'),
        //     h('span', { style: 'color:red' }, '请确保账套里其他用户已经退出系统'),
        //     h('span', null, ',确定执行备份?')
        //   ])

        // ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            console.log('备份')
            done();
          } else {
            done();
          }
        }
      }).then(action => {
        vm[str](data);
      }).catch(err => {
        console.log(err)
      });;
    },
    delete () {

      let phid = [];
      this.selectedData.map(data => {
        phid.push(data.PhId)
      })

      let data = {
        phid: phid
      }
      const loading = this.$loading()
      GetDeleteOrganizeBackup(data).then(res => {
        loading.close()
        if (res.Status == 'success') {
          this.$msgBox.show(res.Msg);
          this.refresh();
        } else {
          this.$msgBox.error(res.Msg);
        }

      }).catch(err => {
        loading.close()
        this.$msgBox.error('删除失败!')

      })


    },
    selectChange (val) {
      this.selectedData = val;
    },
    //获取备份列表
    getBackupList () {
      let data = {
        OrgId: this.$store.state.user.orgid
      }
      const loading = this.$loading()
      GetOrganizeBackupList(data).then(res => {
        loading.close();
        if (res.Status == 'success') {
          console.log(res)
          this.dataList = res.list;
        } else {
          this.$msgBox.error(res.Msg);
        }
      }).catch(err => {
        loading.close();
        console.log(err)
        this.$msgBox.error('获取备份数据失败!')
      })
    },
  }

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/baseColor.scss";
.copyList {
  height: 500px;
  > p {
    height: 50px;
    border-top: 1px solid $bordercolor;
    padding-top: 10px;
  }
  .list {
  }
}
</style>
<style lang="scss">
@import "@/assets/css/baseColor.scss";
.copyList {
  .el-table .headerRow th {
    background: #d3e8f9;
    color: #333;
    font-size: 19px;
    text-align: center;
  }
  .el-table--border,
  .el-table th,
  .el-table td {
    border-color: $bordercolor;
    text-align: center;
  }

  .el-table--group::after,
  .el-table--border::after,
  .el-table::before {
    background-color: $bordercolor;
  }
  .selection {
    border-right: 0;
    padding-right: 0;
    text-align: right !important;
    .cell {
      padding: 0;
    }
  }
  .selectionIndex {
    text-align: left !important;
    .cell {
      padding: 0 0 0 5px;
    }
  }
  .el-table .headerRow th {
    font-size: 17px !important;
  }
}
</style>

