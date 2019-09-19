<template>
  <div @click.stop="0"
       class="addAuxiDtl"
       style="z-index:99">
    <div :class="{batchAuxi:batchShow}">
      <p class="title">
        <span>
          {{batchShow?'设置辅助核算类型组合方式':'增加辅助核算初始明细'}}
        </span>
        <i @click.stop="close(false)">
        </i>
      </p>
      <div class="auxiDtl">
        <div v-if="!batchShow">
          <p class="auxiTitle">
            <span> {{subject.KCode}}</span>
            <span> {{subject.KName}}</span>
          </p>
          <ul class="auxiContent">
            <li>
              <div>
                辅助核算
              </div>

            </li>
            <li v-for="auxi of auxiList">
              <div>
                {{auxi.BaseName}}
              </div>
              <div>
                <el-select v-model="auxi.val"
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in auxi.Children"
                             :key="item.PhId"
                             :label="item.BaseName"
                             :value="item.PhId">
                  </el-option>
                </el-select>
              </div>

            </li>

          </ul>
          <p class="batchAdd">
            <span @click.stop="batchShow=true">
              批量新增(设置辅助项组合方式)
            </span>
          </p>
        </div>

        <batch-auxi ref="batchAuxiShow"
                    v-if="batchShow"
                    :Auxiliarys="auxiList"
                    :subject="subject" />
        <p class="auxiBtnCon">
          <span @click.stop="close(false)"
                class="btngrey">取消</span>
          <span @click.stop="confirm"
                style="margin-left:70px"
                class="btn">确定</span>
        </p>
      </div>
      <auxiMsgCon :dataList="repeatList.data"
                  v-if="repeatList.visible"
                  @msgFinish="msgFinish" />
    </div>

  </div>
</template>

<script>
import batchAuxi from './batchAuxi.vue'
import auxiMsgCon from './msg.vue'

export default {
  name: 'addAuxiDtl',
  props: {
    subject: Object,
    year: String
  },
  data () {
    return {
      auxiList: [],//科目下辅助项列表
      value: '',
      batchShow: false,
      repeatList: { visible: false, data: {} },//重复列表
    }
  },
  provide () {
    return { year: this.year }
  },
  mounted () {
    this.getAssist(this.subject)
  },
  methods: {
    //ajax获取科目下的辅助项***************************
    getAssist (val) {
      var data = {
        id: val.PhId,
        orgid: this.$store.state.user.orgid,
      }
      const loading1 = this.$loading();
      this.$axios.get("/PSubject/GetVoucherAuxiliaryBySubject", { params: data })
        .then(res => {
          loading1.close();
          if (res.Status == 'error') {
            this.$msgBox.error(res.Msg)
          } else {
            this.auxiList = res;
          }
        })
        .catch(err => { this.$message({ showClose: true, message: '获取辅助项失败了!', type: "error" }); loading1.close(); })

    },
    close (bool) {
      if (this.batchShow) {
        this.batchShow = !this.batchShow
      } else {
        this.$emit('finish', bool)
      }
    },
    confirm () {
      if (this.batchShow && this.$refs.batchAuxiShow.auxiChooseList) { //确认排列组合
        this.$refs.batchAuxiShow.getData();

      } else if (this.batchShow) {//确认选中项获取排列组合行
        let AddList = [];
        this.$refs.batchAuxiShow.auxiGroupList.AddListShow.map(list => {
          AddList.push(list.AddList)
        })

        let data = {
          AuxSubjectCommon: this.$refs.batchAuxiShow.auxiGroupList.AuxSubjectCommon,
          AddList: AddList
        }

        if (AddList.length == 0) {
          this.$msgBox.show('辅助项不能为空!')
          return
        }
        const loading = this.$loading()
        this.$axios.post('/AuxSubject/PostCheckAuxSubject', data).then(res => {
          loading.close()
          if (!res.RepeatList) {
            this.addAuxiInfo(res.AuxSubjectCommon, res.AddList)
          } else {

            this.repeatList.data = res;
            this.repeatList.visible = true;
          }
        }).catch(err => {
          loading.close()
          this.$msgBox.error('辅助项重复检查失败!')
        })
      } else { //单列数据保存
        let str = '';
        for (let auxi of this.auxiList) {
          if (!auxi.val) {
            this.$msgBox.show('辅助项明细不能为空!')
            return;
          }
          str = str + auxi.GLS + '-' + auxi.val + ','
        }

        str = str.replace(/\,$/g, '');
        let data = {
          AuxSubjectCommon: {
            FYear: this.year,    //2019年
            OrgId: this.$store.state.user.orgid,   //组织Id
            OrgCode: this.$store.state.user.orgcode,   //组织编码
            SubPhid: this.subject.PhId,   //科目Id
            SubCode: this.subject.KCode,  //科目编码
            KBalanceType: this.subject.KBalanceType  //余额方向
          },
          AddList: [str]
        }

        const loading = this.$loading()
        this.$axios.post('/AuxSubject/PostCheckAuxSubject', data).then(res => {
          loading.close()
          if (res.Status == 'error') {
            this.$msgBox.error(res.Msg)
          } else if (res.RepeatList) {
            this.$msgBox.error('该辅助项组合已存在,无需添加!')
          } else {
            this.addAuxiInfo(res.AuxSubjectCommon, res.AddList)
            // this.repeatList.data = res;
            // this.repeatList.visible = true;
          }
        }).catch(err => {
          loading.close()
          this.$msgBox.error('辅助项重复检查失败!')
        })
      }
    },
    addAuxiInfo (AuxSubjectCommon, AddList) {
      let vm = this;


      let data = {
        AuxSubjectCommon: AuxSubjectCommon,
        AddList: AddList
      }
      if (AddList.length == 0) {
        this.$msgBox.show('辅助项不能为空!')
        return
      }
      const loading = this.$loading()
      this.$axios.post("/AuxSubject/PostAddAuxSubject", data).then(res => {
        console.log(res)
        loading.close()
        if (res.Status == "success") {

          this.$msgBox.show({ content: res.Msg, fn: function () { vm.$emit('finish', true) } });

        } else {
          this.$msgBox.error(res.Msg)
        }

      }).catch(err => {
        loading.close()
        console.log(err)
        this.$msgBox.error('辅助项组合添加失败!')
      })
    },
    msgFinish (res) {
      this.repeatList.visible = false;
      if (res) {
        this.addAuxiInfo(res.AuxSubjectCommon, res.AddList)
      }
    }
  },
  components: {
    batchAuxi,
    auxiMsgCon
  }

}
</script>

<style lang="scss" scoped>
.addAuxiDtl {
  position: fixed;
  position: -ms-page;

  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;

  > div {
    width: 600px;
    max-height: 80%;
    overflow: auto;
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    padding: 0 20px;
    .title {
      height: 40px;
      border-bottom: 1px solid #ccc;
      padding: 8px 3px;
      width: 100%;
      font-size: 14pt;
      font-style: normal;
      font-weight: 700;
      > span {
        float: left;
      }
      i {
        float: right;
        background: url("../../../assets/icon/close.svg");
        background-size: cover;
        width: 20px;
        height: 20px;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
    .auxiDtl {
      padding: 20px;
      position: relative;
      height: 80%;
      .auxiTitle {
        color: #00b7ee;
      }
      .auxiContent {
        text-align: left;
        max-height: 500px;
        overflow: auto;
        > li {
          margin-bottom: 10px;
          height: 40px;
          line-height: 40px;
          > div {
            float: left;
            width: 200px;
            &:first-of-type {
              width: 100px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 40px;
              padding-left: 10px;
            }
            &:last-of-type {
              width: 400px;
              > div {
                width: 100%;
              }
            }
          }
          &:first-of-type {
            div:first-of-type {
              padding: 0;
            }
          }
        }
      }
    }
    .auxiBtnCon {
      margin-top: 25px;
      margin-bottom: -10px;
    }
    .batchAdd {
      text-align: right;
      text-decoration: underline;
      color: #00b7ee;
      padding-right: 20px;
      > span {
        cursor: pointer;
      }
    }
  }
  > div.batchAuxi {
    width: 900px;
  }
  &:after {
    content: "";
    width: 0;
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
<style lang="scss">
.addAuxiDtl .el-select .el-input--suffix .el-input__inner {
  border-width: 0 0 1px 0;
  border-radius: 0;
}
</style>

