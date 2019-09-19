<template>
  <div class="sys-page">
    <div class="container">
      <div class="config">
        <div class="manageContent">
          <div class="unionState">
            <ul class="flexPublic handle">
              <a v-show="infoUpdate" @click.prevent="saveConfig">
                <li>保存</li>
              </a>
              <a v-show="infoUpdate" @click.prevent="cancle">
                <li style="border: 1px solid #00b7ee;background: #FFFFFF;color: #00b7ee">取消</li>
              </a>
              <a v-show="!infoUpdate" @click.prevent="infoUpdate=true">
                <li>编辑</li>
              </a>
              <a @click.prevent="fresh" class="refreshCon">
                <li class="el-icon-refresh"></li>
              </a>
            </ul>
          </div>
          <div class="auxiliary manageContent">
            <div class="auxiliaryNav">
              <p class="auxiliaryNavTitle">参数内容</p>
              <ul>
                <li
                  @click.stop="navTabTurn(item.code)"
                  :class="{active:navActive==item.code}"
                  v-for="(item,index) of navTab"
                  :key="index"
                >{{item.name}}</li>
              </ul>
            </div>
            <ul class="handle" v-show="navActive=='handle'">
              <li></li>
              <li>
                <p>系统试用时间设置</p>
                <div class="testTime">
                  <i :class="{disabled:!infoUpdate}" @click.stop="addDay(false)"></i>
                  <div class="inputContainer">
                    <input
                      style="text-align: center;"
                      @keyup="onlyNum($event)"
                      :disabled="!infoUpdate"
                      v-model="testTime"
                      type="text"
                    />
                  </div>
                  <i :class="{disabled:!infoUpdate}" @click.stop="addDay(true)"></i>
                  <span>天</span>
                </div>
                <p style="margin-left:40px;" class="notice">注意：系统试用时间不能超过30天!</p>
              </li>
            </ul>
            <ul class="print" v-show="navActive=='SQL'">
              <li></li>
              <li>
                <p>是否启用“按省”分数据库存储?</p>
                <div
                  style="color:red;font-size: 14px"
                >注意：系统数据库存储模式分：默认库、分省库两种。系统默认启用分省库模式。如果用户修改数据库存储模式后，将会影响系统业务数据存储与查询路径。请不要轻易变更数据库存储模式。</div>
                <div>
                  <label>
                    <input
                      name="sql"
                      :disabled="!infoUpdate"
                      v-model="SQLSetting"
                      value="true"
                      type="radio"
                    />是
                  </label>
                  <label>
                    <input
                      name="sql"
                      :disabled="!infoUpdate"
                      v-model="SQLSetting"
                      value="false"
                      type="radio"
                    />否
                  </label>
                </div>
              </li>
            </ul>
            <ul class="print" v-show="navActive=='systemTest'">
              <li></li>
              <li>
                <p>系统正版验证方式设置</p>
                <div>
                  <label>
                    <input
                      name="system"
                      :disabled="!infoUpdate"
                      v-model="versionTest"
                      value
                      type="radio"
                    />硬件验证
                  </label>
                  <label>
                    <input
                      name="system"
                      :disabled="!infoUpdate"
                      v-model="versionTest"
                      value="1"
                      type="radio"
                    />软验证
                  </label>
                  <label v-show="versionTest" class="inputContainer vNum">
                    加密狗号:
                    <input
                      :disabled="!infoUpdate"
                      name="system"
                      v-model="versionNum"
                      placeholder="请输入软验证加密狗号"
                      type="text"
                    />
                  </label>
                </div>
              </li>
            </ul>
            <ul class="print" v-show="navActive=='industry'">
              <li></li>
              <div class="formData auxiliaryContent">
                <ul>
                  <li>序号</li>
                  <li>行业编码</li>
                  <li>行业名称</li>
                  <li>启用/停用</li>
                  <li>备注</li>
                </ul>
                <div class="formData formDataContainer">
                  <ul
                    :class="{formDataItems:true, flexPublic:true,infoUpdate:infoUpdate}"
                    v-for="(item,index) of userInfo.filter(i=>i.ValueType=='industry_type'&&i.PersistentState!=3)"
                    :key="index"
                  >
                    <template v-if="item"></template>
                    <li>{{index+1}}</li>
                    <li style="text-align:center;">{{item.Code}}</li>
                    <li
                      :style="{'background-color': index!=0&&infoUpdate?'#fafafa':'','text-align':'left'}"
                    >
                      <input
                        v-if="infoUpdate"
                        maxlength="15"
                        :disabled="!infoUpdate||index==0"
                        type="text"
                        style="text-align:left"
                        v-model="item.Value"
                      />
                      <span v-else>{{item.Value}}</span>
                    </li>
                    <li>
                      <div v-if="!infoUpdate" style="position:relative;height:100%">
                        <i
                          :class="item.EnabledMark==0?'newsPublishStateTrue':'newsPublishStateFalse'"
                        ></i>
                      </div>
                      <div class="radios" v-else>
                        <el-radio v-model="item.EnabledMark" :label="0">是</el-radio>
                        <el-radio v-model="item.EnabledMark" :label="1">否</el-radio>
                      </div>
                    </li>
                    <li
                      :style="{'background-color': index!=0&&infoUpdate?'#fafafa':'','text-align':'left'}"
                    >
                      <input
                        v-if="infoUpdate"
                        maxlength="200"
                        :disabled="!infoUpdate||index==0"
                        type="text"
                        style="text-align:left"
                        v-model="item.Description"
                      />
                      <p
                        style="line-height:24px;"
                        v-else
                        :title="item.Description"
                      >{{item.Description}}</p>
                    </li>
                    <li v-show="infoUpdate" class="addIconCon">
                      <span class="addIcon" @click="handleIndustry(true,index,item)"></span>
                      <span class="deleteIcon" @click="handleIndustry(false,index,item)"></span>
                    </li>
                  </ul>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <message
      :message="saasMessage.message"
      :delay="saasMessage.delay"
      :visible.sync="saasMessage.visible"
    ></message>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'index',
  data() {
    return {
      navActive: 'handle',
      testTime: 15, //试用时间
      SQLSetting: true, //数据库设置
      versionTest: 610004, //版本验证
      versionNum: '', //加密狗号
      infoUpdate: false, //编辑状态
      userInfo: [], //获取的设置信息
      navTab: [
        { code: 'handle', name: '试用时间设置' },
        { code: 'industry', name: '单位所属行业设置' },
        { code: 'SQL', name: '数据库存储设置' },
        { code: 'systemTest', name: '系统正版验证设置' }
      ],
      saasMessage: {}
    }
  },

  activated() {
    this.getData()
  },
  //计算
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      orgcode: state => state.user.orgcode,
      uid: state => state.user.userid,
      user: state => state.user
    })
  },
  watch: {
    testTime(val) {
      if (val > 30) {
        this.saasMessage = {
          message: '试用时间不能多于30天!',
          visible: true
        }
        this.testTime = 30
        return
      }
    }
  },
  methods: {
    fresh() {
      this.getData()
    },
    //获取参数
    getData() {
      const loading = this.$loading()
      this.$axios
        .get('/SysConfig/GetSysConfigList')
        .then(res => {
          loading.close()
          if (res.Status == 'error') {
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
            return
          }
          this.userInfo = res.Record
          this.testTime = this.userInfo.find(
            item => item.ValueType == 'try_date'
          ).Value
          if (this.userInfo.find(item => item.ValueType == 'sn_number').Value) {
            this.versionTest = 1
            this.versionNum = this.userInfo.find(
              item => item.ValueType == 'sn_number'
            ).Value
          } else {
            this.versionTest = ''
            this.versionNum = ''
          }
          this.SQLSetting = this.userInfo.find(
            item => item.ValueType == 'change_db'
          ).Value
          this.infoUpdate = false
        })
        .catch(err => {
          loading.close()
          this.saasMessage = {
            message: '获取参数设置数据失败了!',
            visible: true
          }
        })
    },
    //选中类型
    navTabTurn(item) {
      this.navActive = item
    },
    //保存
    saveConfig() {
      this.userInfo.find(
        item => item.ValueType == 'try_date'
      ).Value = this.testTime
      if (
        this.userInfo.some(
          item =>
            item.Code == '' &&
            item.Value == '' &&
            item.ValueType == 'industry_type' &&
            item.PersistentState == 1
        )
      ) {
        this.saasMessage = {
          message: '新增行业名称不能为空!',
          visible: true
        }
        return
      }
      if (this.versionTest) {
        if (!this.versionNum) {
          this.saasMessage = {
            message: '加密狗号不能为空!',
            visible: true
          }
          return
        }
        this.userInfo.find(
          item => item.ValueType == 'sn_number'
        ).Value = this.versionNum
      } else {
        this.userInfo.find(item => item.ValueType == 'sn_number').Value = ''
      }
      this.userInfo.find(
        item => item.ValueType == 'change_db'
      ).Value = this.SQLSetting

      //   将除删除新增外的行业列修改为更新
      this.userInfo.forEach(item => {
        if (
          item.PersistentState != 3 &&
          item.PersistentState != 1 &&
          item.ValueType == 'industry_type'
        ) {
          item.PersistentState = 2
        }
      })
      //   剔除状态为删除，无编码的行业
      this.userInfo = this.userInfo.filter(
        item =>
          !(
            item.PersistentState == 3 &&
            item.Code == '' &&
            item.ValueType == 'industry_type'
          )
      )
      //  判断是否有重复行
      let newMap = new Map(),
        newArr = this.userInfo
          .filter(
            item =>
              item.PersistentState != 3 && item.ValueType == 'industry_type'
          )
          .map(i => i.Value)
      newArr.forEach((i, index) => {
        var pArr = []
        pArr.push(index + 1)
        for (let j = index + 1; j < newArr.length; j++) {
          if (newArr[j] == i) {
            pArr.push(j + 1)
          }
        }
        if (!newMap.get(i)) {
          newMap.set(i, pArr)
        }
      })
      let repeatArr = [...newMap].filter(i => i[1].length > 1)
      if (repeatArr.length) {
        //存在重复数据
        this.saasMessage = {
          message:
            '保存失败!行业记录中存在重命名情况:' +
            repeatArr
              .map(i => {
                // i:[(Value:string,repeatIndex:Number[]]
                return '第' + i[1].join(',') + '行名字重复'
              })
              .join(';'),
          visible: true
        }
        return
      }
      console.log(newArr, newMap)
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        infoData: this.userInfo
      }
      const loading = this.$loading()
      this.$axios
        .post('/SysConfig/PostUpdate2', data)
        .then(res => {
          loading.close()
          if (res.Status == 'success') {
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
            this.infoUpdate = false
            this.getData()
          } else {
            if (res.Data) {
              this.saasMessage = {
                message: res.Msg + res.Data.join('，'),
                visible: true,
                delay: 6000
              }
              this.cancle()
            } else {
              this.saasMessage = {
                message: res.Msg,
                visible: true
              }
            }
          }
        })
        .catch(err => {
          loading.close()
          this.saasMessage = {
            message: '修改参数设置失败了!',
            visible: true
          }
        })
    },
    //取消
    cancle() {
      this.infoUpdate = false
      this.getData()
    },
    //试用天数加减
    addDay(bool) {
      if (!this.infoUpdate) {
        return
      }
      if (bool) {
        this.testTime = parseInt(this.testTime) + 1
      } else if (this.testTime > 0) {
        this.testTime = parseInt(this.testTime) - 1
      }
    },
    //只能输入数字
    onlyNum(event) {
      var obj = event.target
      obj.value = obj.value.replace(/[^\d]/g, '') //清除“数字”以外的字符
      obj.value = obj.value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
      obj.value = obj.value
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') //只能输入两个小数
      if (obj.value.indexOf('.') < 0 && obj.value != '') {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value = parseFloat(obj.value)
      }
    },
    //行业添加删除
    handleIndustry(type, index, item) {
      if (type) {
        this.userInfo.push({
          PersistentState: 1,
          ValueType: 'industry_type',
          Value: '',
          IsSystem: 0,
          Description: '',
          Code: '',
          EnabledMark: 0
        })
      } else {
        if (item.Code == '9999') {
          this.saasMessage = {
            message: '无法删除内置行业！',
            visible: true
          }
          return
        } else {
          item.PersistentState = 3
          this.$forceUpdate()
        }
      }
    }
  }
}
</script>
<style scoped>
</style>
<style lang="scss" scoped>
.config {
  height: 100%;
}
.manageContent {
  height: 100%;
}
.container {
  height: 100%;
  //   overflow: hidden;
  font-size: 18px;
}
.auxiliary {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-size: 18px;
}
.auxiliaryNav {
  width: 250px;
  margin-top: 10px;
  padding-right: 5px;
}
.auxiliaryNavTitle {
  background: #d3e9f9;
  color: #333;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 19px;
}
.auxiliaryNav > ul {
  width: 250px;
  padding: 10px 20px;
}
.auxiliaryNav > ul > li {
  width: 90%;
  margin: auto;
  margin-bottom: 10px;
  min-width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #00b7ee;
  border-radius: 5px;
}
.auxiliaryNav > ul > li:hover {
  background: #00b7ee;
  color: #fff;
  cursor: pointer;
}
.auxiliaryNav > ul > li.active {
  background: #00b7ee;
  color: #fff;
}
.unionState > ul {
  justify-content: flex-end;
}
.auxiliary {
  justify-content: flex-start;
}
.auxiliary > ul {
  width: 100%;
  margin-top: 10px;
  margin-left: 20px;
  padding: 10px;
  padding-top: 0;
  color: #05a2d1;
  position: relative;
  > li {
    div {
      margin: 0 0 10px 70px;
    }
    > p {
      margin: 0 0 10px 0;
      padding-left: 30px;
      position: relative;
    }
    &:first-of-type {
      background: #00b7ee;
      height: 40px;
      margin-bottom: 20px;
    }
  }
}
.auxiliary > ul > li div.inputContainer {
  width: 70px;
  margin: 0;
}
.testTime {
  position: relative;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
}
.testTime > div,
.testTime > span {
  float: left;
}
.testTime > i.disabled {
  cursor: default;
}
.testTime > i {
  float: left;
  display: block;
  width: 24px;
  height: 24px;
  border: 1px solid #00b7ee;
  border-radius: 50%;
  margin: 0 5px;
  margin-top: 8px;
  background: #00b7ee;
  position: relative;
  cursor: pointer;
  &:first-of-type {
    background: none;
    border-color: #ff9900;
  }
  &:before {
    content: '';
    width: 14px;
    height: 1px;
    background: #ff9900;
    position: absolute;
    top: 11px;
    left: 4px;
  }
  &:nth-of-type(2):before {
    background: #fff;
  }
  &:nth-of-type(2):after {
    background: #fff;
    content: '';
    width: 1px;
    height: 14px;
    position: absolute;
    top: 4.5px;
    left: 11px;
  }
}
.print {
  label {
    margin-left: 20px;
  }
}
.unionState {
  padding-right: 30px;
}
.unionState .handle > a.refreshCon {
  width: 40px;
  > li {
    background: #fff;
    color: #00b7ee;
    border: 0;
    font-size: 27px;
    padding: 0;
    width: 30px;
    min-width: 30px;
  }
}
.print .vNum {
  width: 50%;
  margin-left: 8px;
  input {
    width: 50%;
  }
}
.newsPublishStateTrue:before,
.newsPublishStateTrue:after {
  content: '';
  position: absolute;
  width: 8px;
  height: 18px;
  border: 1px solid #02a7e7;
  border-width: 0 1px 1px 0;
  transform: rotate(45deg);
  top: 8px;
  left: 46%;
}
.newsPublishStateFalse:before,
.newsPublishStateFalse:after {
  content: '';
  position: absolute;
  width: 18px;
  height: 1px;
  background: #d8281d;
  transform: rotate(45deg);
  top: 19px;
  left: 44%;
}
.newsPublishStateFalse:before {
  transform: rotate(-45deg);
}
.notice {
  color: red;
  font-size: 14px;
}

.tableContent input {
  border: none;
  line-height: 40px;
  height: 40px;
  width: 100%;
}
.formData.auxiliaryContent {
  position: absolute;
  top: 40px;
  left: -15px;
  margin-top: 10px;
  right: 10px;
  bottom: 0;
  padding-left: 25px;
  overflow: hidden;
}
.formDataContainer {
  position: absolute;
  left: 1px;
  right: -17px;
  top: 30px;
  bottom: 0px;
  height: auto;
  padding-left: 24px;
  width: auto;
  overflow-y: scroll;
}

.formData > ul:first-of-type {
  border: 0;
  background: #d3e8f9;
  font-size: 18px;
}
.formData.formDataContainer > ul:first-of-type {
  border-bottom: 1px solid #bcbdbd;
  border-top: 0;
  height: 48px;
  background: #fff;
}
.formData > ul:first-of-type > li {
  border: 1px solid #bcbdbd;
  border-left: 0;
}
.formData.formDataContainer > ul:first-of-type > li {
  border-top: 0;
}

.formData > ul:first-of-type > li:first-of-type {
  border-left: 1px solid #bcbdbd;
}
.formData > ul > li {
  border: 1px solid #bcbdbd;
  border-left: 0;
  border-top: 0;
  height: 40px;
  line-height: 40px;
  text-align: center;
  padding: 0 10px;
}
.formData > ul > li:first-of-type {
  width: 10%;
  min-width: 31px;
}
.formData > ul > li:nth-of-type(2) {
  width: 15%;
}
.formData > ul > li:nth-of-type(3) {
  width: 30%;
}
.formData > ul > li:nth-of-type(4) {
  width: 15%;
}
.formData > ul > li:nth-of-type(5) {
  width: 30%;
}

// .formData > ul:first-child > li:last-of-type {
//   width: 15%;
// }

/* .formData>ul.formDataItems:hover{
        background: #ddd;
    } */
.formData > ul.formDataItems > li.addIconCon {
  position: absolute;
  width: 25px;
  left: -25px;
  border: 0;
  top: 0;
  display: none;
}
.formData > ul.formDataItems:hover > li.addIconCon {
  display: block;
}
.formDataItems {
  border-bottom: 1px solid #bcbdbd;
  color: #333;
}
.formData > ul.formDataItems.infoUpdate > li {
  overflow: hidden;
}
.formData > ul.formDataItems > li {
  border-right: 1px solid #bcbdbd;
  border-left: 0;
  border-bottom: 0;
  text-align: center;
  line-height: 48px;
  height: 48px;
  font-size: 18px;
  //   overflow: hidden;
  overflow: auto;
  word-break: break-all;
  text-overflow: ellipsis;
  position: relative;
  > input {
    width: 100%;
    height: 100%;
    // padding: 0 10px;
    border: 0;
  }
}
.formData > ul.formDataItems > li > i.newAddStateTrue:after {
  top: 5px;
}
.formData > ul.formDataItems > li > .newAddStateFalse:before,
.formData > ul.formDataItems > li > .newAddStateFalse:after {
  top: 20px;
}
.formData > ul.formDataItems > li:first-child {
  border-left: 1px solid #bcbdbd;
}
.formData > ul.formDataItems > li > div > label {
  margin-right: 12px;
}
.formData.formDataContainer > ul.formDataItems > li > div > label {
  margin: 0;
  &:first-of-type {
    margin-right: 10px;
  }
}
.formData > ul.formDataItems > li > div > label > input {
  margin-right: 5px;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
.addIcon,
.deleteIcon {
  width: 22px;
  height: 22px;
  position: absolute;
  left: 0;
  cursor: pointer;
}
.addIcon {
  top: 0px;
  background: url('../../../assets/icon/addition_fill.svg');
  background-size: cover;
}
.addIcon:hover {
  background: url('../../../assets/icon/addition.svg');
  background-size: cover;
}
.deleteIcon {
  bottom: 0px;
  background: url('../../../assets/icon/delete_fill.svg');
  background-size: cover;
}
.deleteIcon:hover {
  background: url('../../../assets/icon/delete.svg');
  background-size: cover;
}
</style>
