<template>
  <div v-show="visible"
       class="quicklyCheckCon"
       style="z-index: 999;">

    <div class="quicklyCheck">
      <p class="title">
        {{title=='check'?'快速结账':'快速反结账'}}
        <i @click="close(false)"></i>
      </p>
      <div>
        <span>结账至</span>
        <el-date-picker v-model="value"
                        value-format="yyyy-MM"
                        format="yyyy-MM"
                        type="month"
                        placeholder="选择月">
        </el-date-picker>
      </div>
      <p>
        <span @click="close(false)"
              class="btngrey">取消</span>
        <span @click="check"
              class="btn">确认</span>
      </p>
    </div>
    <!-- 备份满20次提示 -->
    <el-dialog :visible.sync="ssss"
               append-to-body
               width="550px"
               title="提示"
               custom-class="eldialogClass">
      <over-msg @still-go="stillGo"
                @cancle="cancle" />
    </el-dialog>
    <next-month :checkVal="value.slice(5)"
                v-if="nextMonthCss"
                @child-click="nextMonthHandle"></next-month>
  </div>

</template>

<script>
import { GetOrganizeBackupList } from '@/api/copyandreset'
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import qs from 'qs'
import overMsg from '@/page/admin/copyandreset/overMsg'
import axios from 'axios'
import { mapState } from 'vuex'
import nextMonth from './nextMonthCheck'
export default {
  name: 'quicklyCheck',
  inject: ['checkedDate'],
  props: {
    visible: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'check'
    }
    // year: {
    //   type: String,
    //   default: 0
    // },
    // month: {
    //   type: String,
    //   default: 0
    // }
  },
  data () {
    return {
      value: '',
      overMsgShow: false,
      nextMonthCss: false,
      ssss: false
    }
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgcode: state => state.user.orgcode,
      orgname: state => state.user.orgName,
      autoS: state => state.user.autoSetting,//自动备份
      curOrg: state => state.user.curOrg,   //当前的组织信息
      Roleauthorize: state => state.user.Roleauthorize,
      usercount: state => state.user,
      jbuildDate: state => state.Pconfig.jbuildDate,//建账日期
      cachePage: state => state.tagNav.cachePage  //是否利用路由缓存
    }),

  },
  watch: {
    visible (val) {
      if (val) {
        let m = this.title == 'check' ? this.checkedDate.checkedTime : (this.checkedDate.checkedTime > 1 ? this.checkedDate.checkedTime - 1 : this.checkedDate.checkedTime);
        this.value = this.checkedDate.checkedYear + '-' + (m > 9 ? m : ('0' + m))
      }
    }
  },
  components: {
    overMsg,
    nextMonth
  },
  methods: {
    close (data) {

      this.$emit('update:visible', '')


    },
    uncheckFinish () {
      this.$emit('finish-check')
    },
    closeOverMsg () {  //关闭超过20个备份弹窗
      this.overMsgShow = false;
    },
    nextMonthHandle (data) {
      if (data === false) {

      } else if (data == 'success') {
        this.$msgBox.show('结账成功!')
        this.$emit('child-click', data)
      }
      this.nextMonthCss = false;

    },
    //结账功能 //反结账功能*****************************************
    check () {
      // this.overMsgShow = true;
      // return;
      let str = this.title;
      var url;
      let t;
      if (str == 'check') {
        this.nextMonthCss = true;
        return;
      } else if (str == 'uncheck') {
        if (!this.value) {
          this.$msgBox.show('请选择反结账月份!')
          return;
        }
        if ((parseInt(this.value.slice(5)) > this.checkedDate.checkedTime - 1) && (this.value.slice(0, 4) >= this.checkedDate.checkedYear)) {
          this.$msgBox.show('当前月份还未结账,无法反结账!')
          return;
        }
        if (this.autoS.BackBuySave != 0) {
          this.uncheck();
        } else {
          this.copyCheck();
        }

      }
    },
    uncheck () {
      let url = '/PBusinessConfig/GetUnUpdateBusinessConfig';
      var data = {
        orgid: this.orgid,
        uid: this.uid,
        dateTime: this.value
      }
      const loading1 = this.$loading();
      this.$axios.get(url, { params: data })
        .then(res => {
          loading1.close();
          if (res.Status == 'success') {
            this.$msgBox.show('反结账成功!')
            this.uncheckFinish();
            // this.addVoucher('fresh');
            // this.getChecked();
          } else {
            this.$message({ showClose: true, message: res.Msg, type: "error" });
          }
        },
          err => {
            console.log(err);
            loading1.close();
          })
        .catch(err => { this.$message({ showClose: true, message: str == 'check' ? '结账失败!' : '反结账失败!', type: "error" }); loading1.close(); })

    },
    cancle () {
      this.ssss = false;
    },
    copyCheck () {  //检查备份数量
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
      this.copy();

    },
    //备份
    copy () {
      var data = {
        OrgId: this.orgid,
        OrgCode: this.orgcode,
        OrgName: this.orgname,
        Backfrom: this.title == 'check' ? 1 : 2,//结账备份
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('系统正在结账前备份,请耐心等待....')
      axios.create(base).get('/OrganizeBackup/GetAddBackUp', { params: data, headers: new_header })
        .then(response => {

          loading.close()
          let res = JSON.parse(response.data)
          if (res.Status == 'success') {
            // this.$msgBox.show(res.Msg)
            this.uncheck();
          } else {
            this.$msgBox.error(res.Msg)
          }
        }).catch(err => {
          console.log(err)
          loading.close()
          this.$msgBox.error('备份失败!')
        })
    },

  },

}
</script>

<style lang="scss" scoped>
.quicklyCheckCon {
  position: fixed;
  position: -ms-page;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  &:after {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
    content: "";
  }
}
.quicklyCheck {
  text-align: left;
  display: inline-block;
  vertical-align: middle;
  width: 500px;
  height: 200px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 3px #ccc;
  padding: 0 10px;
  > div {
    padding: 20px;
    margin: 20px 0;
    font-size: 18px;
    > div {
      width: 370px;
    }
  }
  > p {
    text-align: right;
    > span {
      margin-left: 20px;
    }
  }
}
.quicklyCheck .title {
  color: #00b7ee;
  text-align: left;
}
</style>
