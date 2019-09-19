<template>
  <div class="newAdd">
    <div class="newAddContent">
      <div class="newAddTitle flexPublic">
        <span>类型分类</span>
        <span @click.stop="cancle"></span>
      </div>
      <ul class="contentItem">
        <li>
          <div>类型名称</div>
          <div class="inputContainer">
            <input type="text"
                   v-model="formData.BaseName">
          </div>
          <div class="btn"
               @click="fastCreate">立即创建</div>
        </li>
        <li>
          <div>是否启用</div>
          <div class="itemRadio">
            <label><input type="radio"
                     name="line"
                     v-model="formData.EnabledMark"
                     value="0">启用</label>
            <label><input type="radio"
                     name="line"
                     v-model="formData.EnabledMark"
                     value="1">停用</label>
          </div>
        </li>
        <!-- <li>
                    <div @click="btnShow('update')">修改</div>
                    <div @click="btnShow('delete')">删除</div>
                </li> -->
      </ul>
      <div class="itemBtnCon">
        <div v-show="!typeUpdate"
             class="btn"
             @click.stop="typeUpdate=true">编辑</div>
        <div v-show="typeUpdate"
             class="btngrey"
             @click.stop="typeUpdate=false;getData()">取消</div>
        <div v-show="typeUpdate"
             class="btn"
             @click.stop="newAdd">保存</div>

      </div>
      <div class="formContainer">
        <ul class="formTitle">
          <li>序号</li>
          <li>类型编码</li>
          <li>类型名称</li>
          <li>启用/停用</li>
        </ul>
        <ul v-for="(item,index) of dataList"
            :key="index"
            class="formData">
          <li>{{index+1}}</li>
          <li>{{item.BaseCode}}</li>
          <li>

            <div style="height:100%"
                 v-if="item.IsSystem!=1&&typeUpdate"
                 class="inputContainer">
              <input style="border:0;text-align:center"
                     type="text"
                     v-model="item.BaseName">
            </div>
            <div class="overText"
                 :title="item.BaseName"
                 v-else>
              {{item.BaseName}}
            </div>
          </li>
          <li>
            <i v-show="!typeUpdate"
               :class="{newAddStateTrue:item.EnabledMark==0,newAddStateFalse:item.EnabledMark==1}"></i>
            <div v-show="typeUpdate">
              <label><input type="radio"
                       :name="item.BaseName+item.BaseCode"
                       v-model="item.EnabledMark"
                       value="0">启用</label>
              <label><input type="radio"
                       :name="item.BaseName+item.BaseCode"
                       v-model="item.EnabledMark"
                       value="1">停用</label>
            </div>
          </li>
          <li v-show="typeUpdate"><i @click.stop="deleteData(item,index)"></i></li>
        </ul>

      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Auth from "@/util/auth";
import { dealAddString } from "@/util/validate";

export default {
  name: "auxiliary-type",
  props: {
    datalists: ''
  },
  created () {
    //this.dataList=JSON.parse(this.datalists);
  },
  mounted () {
    this.getData();
  },
  data () {
    return {
      typeUpdate: false,
      formData: { BaseCode: '', BaseName: '', EnabledMark: 0 },
      dataList: [],
      deleteList: [],
      updateCss: [],
      deleteCss: []
    }
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      orgcode: state => state.user.orgcode,
      uid: state => state.user.userid,
      username: state => state.user.username
    })
  },
  methods: {
    getData () {
      let data = {
        uid: this.uid,
        orgid: this.orgid
      };
      var vm = this;
      this.$axios.get('/PVoucherAuxiliaryType/GetVoucherAuxiliaryType', { params: data })
        .then(res => {

          if (res.Status === 'error') {
            this.$message.error(res.Msg);
            return
          }

          this.dataList = res.type;
          this.initCss();

        })
        .catch(err => {
          console.log(err)
          this.$message({ showClose: true, message: "辅助项获取错误", type: "error" });
        })
    },
    //新增保存
    newAdd () {

      for (var del of this.deleteList) {
        this.dataList.push(del);
      }
      let data = {
        uid: this.uid,
        orgid: this.orgid,
        infoData: this.dataList
      };

      var vm = this;
      this.$axios.post('/PVoucherAuxiliaryType/PostAddAuxiliaryType', data)
        .then(res => {
          if (res.Status === 'error') {
            this.$message.error(res.Msg);
            return
          }

          vm.$emit('type-click', true);
          this.$message.success("类型保存成功!");

        })
        .catch(err => {
          console.log(err)
        })


    },
    //取消
    cancle () {
      this.$emit('type-click', false);
      return;
    },
    //立即创建
    fastCreate () {

      //辅助项类型最多50个
      if (this.dataList.length >= 50) {
        this.$message.warning("当前组织辅助项数量已到上限!");
        return;
      }
      //名称不能为空
      if (this.formData.BaseName === '') {
        this.$message.warning("请填写类型名称！");
        return;
      }

      var lastObject = this.dataList[this.dataList.length - 1];

      var addData = {
        PhId: 0,
        BaseCode: dealAddString(lastObject.BaseCode),
        BaseName: this.formData.BaseName,
        GLS: dealAddString(lastObject.GLS),
        OrgId: this.orgid,
        OrgCode: this.orgcode,
        IsSystem: 0,
        EnabledMark: this.formData.EnabledMark,
        CreatorName: this.username,
        EditorName: this.username
      };

      var list = JSON.parse(JSON.stringify(this.dataList));
      list.push(addData);
      let data = {
        uid: this.uid,
        orgid: this.orgid,
        infoData: list
      };

      var vm = this;
      const loading = this.$loading();
      this.$axios.post('/PVoucherAuxiliaryType/PostAddAuxiliaryType', data)
        .then(res => {
          loading.close();
          if (res.Status === 'error') {
            this.$message.error(res.Msg);
            return
          }
          this.getData();
        })
        .catch(err => {
          loading.close();
          console.log(err)
        })


      // this.$nextTick(() => {
      //     this.formData.BaseCode='';
      //     this.formData.BaseName='';
      //     this.formData.EnabledMark=0;
      // })
      // this.initCss();
      // this.$forceUpdate();
      //
    },
    deleteData (item, index) {

      if (item.IsSystem != 1) {

        item.DeleteMark = 1;

        //添加删除信息 和移除list的删除
        this.deleteList.push(item);
        this.dataList.splice(index, 1);

        this.initCss();
        this.btnShow('delete');
      } else {
        this.$message.warning("内置辅助项不可删除");
      }
    },
    initCss () {
      for (var i in this.dataList) {
        this.updateCss[i] = { checked: false }
        this.deleteCss[i] = { checked: false }
      }
    },
    btnShow (val) {
      if (val == 'delete') {
        for (var del of this.deleteCss) {
          del.checked = !del.checked;
        }
      } else if (val == 'update') {
        for (var up of this.updateCss) {
          up.checked = !up.checked;
        }
      }
      this.$forceUpdate();
    },
  }
}
</script>

<style lang="scss" scoped>
.newAdd {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.newAddContent {
  background: #fff;
  overflow: hidden;
  position: absolute;
  left: 28%;
  top: 20%;
  width: 600px;
  .newAddTitle {
    background: #00b7ee;
    border-radius: 8px;
    height: 40px;
    line-height: 40px;
    width: 100%;
    color: #fff;
    padding: 0 10px;
    font-size: 16px;
    span:last-of-type {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #fff;
      position: relative;
      &::after,
      &::before {
        content: "";
        position: absolute;
        width: 15px;
        height: 1px;
        background: #00b7ee;
        top: 12px;
        left: 5px;
      }
      &::after {
        transform: rotate(45deg);
      }
      &::before {
        transform: rotate(-45deg);
      }
    }
  }
  .contentItem {
    padding: 10px 10px 0 10px;
    font-size: 15px;
    li {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
      div {
        height: 100%;
        margin-right: 5px;
        &:first-of-type {
          min-width: 70px;
        }
        &:nth-of-type(2) {
          width: 80%;
        }
        &:nth-of-type(3) {
          min-width: 70px;
          border-radius: 3px;
          text-align: center;
          cursor: pointer;
        }
      }
      &:nth-of-type(3) {
        justify-content: flex-end;
      }
      &:nth-of-type(3) > div {
        width: 70px;
        margin-left: 5px;
        border: 1px solid #ff9900;
        text-align: center;
        cursor: pointer;
        border-radius: 3px;
      }
      &:nth-of-type(3) > div:hover {
        color: #fff;
        background: #ff9900;
      }
      &:nth-of-type(3) > div:after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
}
.itemRadio {
  letter-spacing: 3px;
  label {
    input {
      margin-right: 3px;
    }
  }
}
.itemBtnCon {
  padding: 0 20px;
  height: 40px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  div {
    width: 70px;

    text-align: center;
    border-radius: 3px;

    height: 30px;
    line-height: 26px;
    font-size: 14px;

    margin-left: 10px;
    cursor: pointer;
  }
}
.formContainer {
  padding: 10px 20px 10px 10px;
  overflow-y: auto;
  height: 200px;
  ul {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 550px;
    &.formData {
      margin: 0;
    }
    &:first-of-type {
      background: #ccc;
      li {
        border-right-color: #fff;
        &:last-of-type {
          border-right-color: #ccc;
        }
      }
    }
    &:last-of-type {
      border-bottom: 1px solid #ccc;
    }
    li {
      border-top: 1px solid #ccc;
      border-right: 1px solid #ccc;
      width: 25%;
      height: 25px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      position: relative;
      &:first-of-type {
        border-left: 1px solid #ccc;
      }
      &:first-of-type {
        width: 10%;
      }
      &:nth-of-type(2) {
        width: 30%;
      }
      &:nth-of-type(3) {
        width: 35%;
      }
      &:nth-of-type(4) {
        width: 25%;
      }
      &:nth-of-type(5) {
        width: 0;
        border: 0;
        i {
          position: absolute;
          right: -23px;
          top: 0;
          width: 25px;
          height: 25px;
          cursor: pointer;
          background: url("../../../assets/icon/delete_fill.svg");
          background-size: cover;
          &:hover {
            background: url("../../../assets/icon/delete.svg");
            background-size: cover;
          }
        }
      }
    }
  }
}
li i.newAddStateTrue:after {
  top: 0px;
}
label {
  margin-left: 10px;
}
</style>
