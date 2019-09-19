<template>
  <div class="copyandreset">
    <div class="container">
      <p class="handleBtn">
        <span @click="confirm('copyCheck')"
              class="btn">开始备份</span>
        <i @click="refresh"
           class="el-icon-refresh"></i>
      </p>
      <div class="listCon">
        <div>
          <p class="fl infoCon">
            <strong>数据备份记录(</strong>
            <span>
              备份数据存储在云端,允许用户
            </span>
            <span class="colorR">
              最多存储20次
            </span>
            <span>
              ,超过存储次数后系统自动清除最早期的备份数据
            </span>
            <strong>)</strong>
          </p>
        </div>
        <div class="list">
          <el-table v-if="tableH"
                    ref="multipleTable"
                    :data="dataList"
                    :height="tableH"
                    border
                    tooltip-effect="dark"
                    header-row-class-name="headerRow"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="65"
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
                <el-tooltip :content="scope.row.NgInsertDt">
                  <div>
                    {{scope.row.NgInsertDt}}
                  </div>
                </el-tooltip>

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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <p class="tableHandle">
                  <span @click="confirm('recoverCheck',scope.row)">恢复</span>
                  <span @click="confirm('delete',scope.row)">删除</span>
                  <span @click="download(scope.row.Fileurl)">下载</span>
                  <span @click="renamingShow(scope.row)">重命名</span>
                </p>

              </template>

            </el-table-column>

          </el-table>
        </div>
        <div class="autoSetting">
          <p>
            <span>自动备份设置</span>
            <i class="settingIcon">
              <img @click="updateAutoSetting"
                   v-if="update"
                   src="../../../assets/images/bc_06.png"
                   alt="">
              <img @click="update=true"
                   v-else
                   src="../../../assets/images/bwl.png"
                   alt="">

            </i>

          </p>
          <ul>
            <li>
              <el-checkbox :disabled="!update"
                           v-model="autoSetting.check">每次结账前自动备份</el-checkbox>
            </li>
            <li>
              <el-checkbox :disabled="!update"
                           v-model="autoSetting.uncheck">每次反结账前自动备份</el-checkbox>
            </li>
            <li>
              <el-checkbox :disabled="!update"
                           v-model="autoSetting.uninit">每次反初始化前自动备份</el-checkbox>
            </li>
            <li>
              <el-checkbox :disabled="!update"
                           v-model="autoSetting.recover">每次恢复前自动备份</el-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="renameShow"
               width="500px"
               title="重命名">
      <div v-if="renameShow"
           class="renameCon">
        <div class='inputContainer'><input type="text"
                 placeholder="请输入新名称,50个汉字以内"
                 maxlength="50"
                 v-model="rename"></div>
        <p><span @click="renameShow=false"
                class="btngrey">取消</span><span @click="renaming"
                class="btn">保存</span></p>
      </div>

    </el-dialog>
    <el-dialog :visible.sync="ssss"
               width="550px"
               title="提示"
               custom-class="eldialogClass">
      <over-msg @still-go="stillGo"
                @cancle="cancle" />
    </el-dialog>
    <!-- <el-dialog :visible.sync="ssss"
               title="数据备份记录"
               custom-class="eldialogClass">
      <copy-list></copy-list>
    </el-dialog> -->
  </div>
</template>
<script>

import { GetOrganizeBackupList, GetUpdateOrganizeAutoSave, GetOrganizeBackupReName, GetDeleteOrganizeBackup, } from '@/api/copyandreset'
import overMsg from './overMsg'
import { mapState } from 'vuex'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import axios from 'axios'
export default {
  name: 'copyandreset',
  data () {
    return {
      activated: true,
      recoverData: '',//要恢复的phid
      copyType: false,//true为恢复前备份
      ssss: false,
      update: false,//开关自动设置
      dataList: [],//列表数据
      tableH: '',//动态设置高度固定表头
      source: ['手动备份', '结账前备份', '反结账前备份', '反初始化备份', '恢复前备份'],//备份来源
      autoSetting: {  //自动备份开关
        check: false,
        uncheck: false,
        uninit: false,
        recover: false
      },
      confirmInfo: {
        'copyCheck': ['为保证备份数据的完整性,', '请确保账套里其他用户已经退出系统', ',确定执行备份?'],
        'recoverCheck': ['您将把账套数据恢复到备份文件所在的状态,', '当前账套数据将被清空,此操作不可回退', ',请谨慎操作。请确保账套里的其他用户已经退出系统。'],
        'delete': ['确定', '删除', '该备份?'],
      },
      renameShow: false,//显示重命名框
      rename: '',//重命名
      renameData: '',//重命名的数据
    }
  },

  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      orgcode: state => state.user.orgcode,
      orgname: state => state.user.orgName,
      autoS: state => state.user.autoSetting,//自动备份
    })
  },
  activated () {
    if (this.activated) {
      this.refresh();
    }
    this.activated = true;
  },
  mounted () {
    this.activated = false;
    this.refresh();
    let vm = this;
    this.autoSetting.check = this.autoS.BuySave ? false : true;
    this.autoSetting.uncheck = this.autoS.BackBuySave ? false : true;
    this.autoSetting.uninit = this.autoS.BackInitSave ? false : true;
    this.autoSetting.recover = this.autoS.RecallSave ? false : true;
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
    autoS: {
      handler () {
        this.autoSetting.check = this.autoS.BuySave ? false : true;
        this.autoSetting.uncheck = this.autoS.BackBuySave ? false : true;
        this.autoSetting.uninit = this.autoS.BackInitSave ? false : true;
        this.autoSetting.recover = this.autoS.RecallSave ? false : true;
      },
      deep: true
    },
    ssss (val) {
      if (!val) {
        this.refresh();
      }
    }
  },
  methods: {
    refresh () {
      this.update = false;
      this.getBackupList();
    },
    cancle () {
      this.ssss = false;
    },
    confirm (str, data) {
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
      }).then(() => {
        vm[str](data);
      }).catch(err => {
        console.log(err)
      });
    },
    copyCheck () {  //检查备份数量
      this.copyType = false;
      let data = {
        OrgId: this.orgid
      }
      const loading = this.$loading()
      GetOrganizeBackupList(data).then(res => {
        loading.close();
        if (res.Status == 'success') {
          console.log(res)
          if (res.list.length >= 20) {
            this.ssss = true;

          } else {
            this.copy();
          }

        } else {
          this.$msgBox.error(res.Msg);
        }
      }).catch(err => {
        loading.close();
        console.log(err)
        this.$msgBox.error('获取备份数量失败!')
      })
    },
    stillGo () {//继续执行(满了20次备份)
      this.ssss = false;
      if (this.copyType) {
        this.beforeRecover();
      } else {
        this.copy();
      }


    },
    //备份
    copy () {
      var data = {
        OrgId: this.orgid,
        OrgCode: this.orgcode,
        OrgName: this.orgname,
        Backfrom: 0,
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('备份中,请耐心等待....')
      axios.create(base).get('/OrganizeBackup/GetAddBackUp', { params: data, headers: new_header })
        .then(response => {
          loading.close()
          let res = JSON.parse(response.data)
          if (res.Status == 'success') {

            this.$msgBox.show(res.Msg)
            this.refresh();
          } else {
            this.$msgBox.error(res.Msg)
          }
        }).catch(err => {
          console.log(err)
          loading.close()
          this.$msgBox.error('备份失败!')
        })
    },
    recoverCheck (data) {
      this.copyType = true;
      if (this.autoS.RecallSave != 0) {
        this.recover(data)
      } else {
        this.recoverData = data;
        let param = {
          OrgId: this.orgid
        }
        const loading = this.$loading()
        GetOrganizeBackupList(param).then(res => {
          loading.close();
          if (res.Status == 'success') {
            if (res.list.length >= 20) {
              this.ssss = true;

            } else {
              this.beforeRecover();
            }

          } else {
            this.$msgBox.error(res.Msg);
          }
        }).catch(err => {
          loading.close();
          console.log(err)
          this.$msgBox.error('获取备份数量失败!')
        })
      }
    },
    //恢复前备份
    beforeRecover () {
      var data = {
        OrgId: this.orgid,
        OrgCode: this.orgcode,
        OrgName: this.orgname,
        Backfrom: 4,
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('系统正在恢复前备份,请耐心等待....')
      axios.create(base).get('/OrganizeBackup/GetAddBackUp', { params: data, headers: new_header })
        .then(response => {
          loading.close()
          let res = JSON.parse(response.data)
          if (res.Status == 'success') {
            this.recover(this.recoverData)
          } else {
            this.$msgBox.error(res.Msg)
          }
        }).catch(err => {
          loading.close()
          this.$msgBox.error('备份失败!')
        })
    },
    //恢复
    recover (data) {
      var data = {
        phid: data.PhId
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('系统正在恢复中,请耐心等待....')
      axios.create(base).get('/OrganizeBackup/GetRecoverDataBackup', { params: data, headers: new_header })
        .then(response => {
          loading.close()
          console.log(response.data)
          let res = JSON.parse(response.data)

          if (res.Status == 'success') {
            this.$msgBox.show(res.Msg)
            this.refresh();
          } else {
            this.$msgBox.error(res.Msg)
          }
        }).catch(err => {
          loading.close()
          console.log(err)
          this.$msgBox.error('恢复失败!')
        })

    },
    delete (row) {
      let data = {
        phid: [row.PhId]
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
        console.log(err)
        loading.close()
        this.$msgBox.error('删除失败!')

      })


    },
    download (url) {
      let vm = this;
      let base = httpConfig.getAxiosBaseConfig();
      let baseURL = base.baseURL.replace('api/GCW', '')
      vm.downFileUrl = baseURL + url;
      window.open(vm.downFileUrl, "_blank")
    },
    renamingShow (data) {
      this.renameData = data;
      this.renameShow = true;
      this.rename = '';
    },
    renaming () {
      let data = {
        phid: this.renameData.PhId,
        newname: this.rename,
      }
      const loading = this.$loading()
      GetOrganizeBackupReName(data).then(res => {
        loading.close();
        console.log(res);
        if (res.Status == 'success') {
          this.$msgBox.show(res.Msg);
          this.renameShow = false;
          this.refresh();
        } else {
          this.$msgBox.error(res.Msg);
        }
      }).catch(err => {
        console.log(err)
        loading.close();
        this.$msgBox.error('修改名称失败!')
      })
    },

    //获取备份列表
    getBackupList () {
      let data = {
        OrgId: this.orgid
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
    //修改自动备份设置
    updateAutoSetting () {
      this.update = false;
      let data = {
        OrgId: this.orgid,
        BuySave: this.autoSetting.check ? 0 : 1,
        BackBuySave: this.autoSetting.uncheck ? 0 : 1,
        BackInitSave: this.autoSetting.uninit ? 0 : 1,
        RecallSave: this.autoSetting.recover ? 0 : 1,
      }
      const loading = this.$loading()
      GetUpdateOrganizeAutoSave(data).then(res => {
        loading.close();
        if (res.Status == 'success') {
          this.$msgBox.show(res.Msg);

          this.$store.commit('user/setAutoSetting', data);
        } else {
          this.$msgBox.error(res.Msg);
        }
      }).catch(err => {
        loading.close();
        console.log(err)
        this.$msgBox.error('保存自动备份设置失败!')
      })
    },
    //设置table高度
    setTableH () {
      let tableCon = document.querySelector('.listCon');
      let h = window.getComputedStyle(tableCon).height;
      this.tableH = parseFloat(h) - 200 + 'px';
    },
  },
  components: {
    overMsg
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/baseColor.scss";
.copyandreset {
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
  .handleBtn {
    float: right;
    > i {
      margin-left: 10px;
      font-size: 28px;
      vertical-align: middle;
      color: #00b7ee;
      cursor: pointer;
    }
  }
  .listCon {
    width: 100%;
    height: 100%;
    padding-top: 30px;
  }
  .infoCon {
    height: 35px;
    strong {
      font-size: 20px;
    }
    span {
      font-size: 17px;
      color: #666;
    }
    .colorR {
      color: red;
    }
  }
  .list {
    width: 100%;

    padding-top: 30px;
  }
  .autoSetting {
    height: 150px;
    padding-left: 20px;
    margin-top: 5px;
    p {
      text-align: left;
      font-size: 18px;
      .settingIcon {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        cursor: pointer;
        margin-left: -3px;
        margin-top: -1px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    ul {
      font-size: 16px;
      overflow: hidden;
      li {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .tableHandle {
    > span {
      text-decoration: underline;
      color: $blue;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .renameCon {
    border-top: 1px solid $bordercolor;
    margin-top: -30px;
    padding: 20px 10px 0;
    > .inputContainer {
      margin-bottom: 20px;
      height: 40px;
    }
    p {
      text-align: right;
      span {
        margin-left: 20px;
      }
    }
  }
}
.eldialogClass {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
<style lang="scss">
@import "@/assets/css/baseColor.scss";
.copyandreset .el-table .headerRow th {
  background: #d3e8f9;
  color: #333;
  font-size: 19px;
  text-align: center;
}
.copyandreset .el-table--border,
.copyandreset .el-table th,
.copyandreset .el-table td {
  border-color: $bordercolor;
  text-align: center;
}

.copyandreset .el-table--group::after,
.copyandreset .el-table--border::after,
.copyandreset .el-table::before {
  background-color: $bordercolor;
}
</style>
