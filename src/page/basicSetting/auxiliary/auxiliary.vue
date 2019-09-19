<template>
  <div class="sys-page">
    <div class="container">
      <div class="unionState">

        <ul style="float:right;"
            class="flexPublic handle">
          <a v-if="Roleauthorize.auxiliaryAccount_save!=0"
             @click.prevent="handlePage('save')">
            <li style="width:70px"
                :class="{updateActive:!updatePage}">保存</li>
          </a>
          <a v-if="Roleauthorize.auxiliaryAccount_edit!=0"
             @click.prevent="handlePage('update')">
            <li style="width:70px"
                :class="{updateActive:updatePage}">编辑</li>
          </a>
          <a v-if="Roleauthorize.auxiliaryAccount_manage!=0"
             @click.prevent="handlePage('type')">
            <li>辅助类型管理</li>
          </a>
          <a @click.prevent="handlePage('fresh')">
            <li style='font-size:27px;color:#00b7ee;background:none;border:0;padding: 0;
    min-width: 30px;'
                class="el-icon-refresh"></li>
          </a>
        </ul>
        <div style="float:right;"
             class="flexPublic">
          <div class="searcherValue"><input @keyup.enter="unionSearch"
                   v-model="unionSearchValue"
                   type="text"
                   placeholder="科目编码/科目名称"></div>
          <div @click="unionSearch"
               style="border-radius: 0 4px 4px 0;width:70px"
               class="searcherBtn btn">搜索</div>
        </div>
      </div>
      <div class="auxiliary manageContent">
        <div class="auxiliaryNav">
          <p class="auxiliaryNavTitle">辅助类型</p>
          <ul>
            <li class="overText"
                :title="item.BaseName"
                @click.stop="navTabTurn(item)"
                :class="{active:navActive.PhId==item.PhId}"
                v-for="(item,index) of navTab"
                :key="index">{{item.BaseName}}</li>
          </ul>
        </div>
        <div class="formData auxiliaryContent listFont">
          <ul>
            <li>序号</li>
            <li>编码</li>
            <li>名称</li>
            <li>启用/停用</li>
          </ul>
          <div v-if="userInfo.length==0"
               style="text-align:center;height:40px;line-height:40px;color:#aaa;">没有辅助项,请编辑添加!</div>
          <ul class="formDataItems flexPublic"
              v-for="(item,index) of userInfo"
              :key="index">
            <li>
              <span>{{index+1}}</span>
            </li>
            <li :class="{unUpdateBG:updatePage}">
              <span>{{item.BaseCode}}</span>
            </li>
            <li>
              <span v-show="!updatePage">{{item.BaseName}}</span>
              <div v-if="updatePage"
                   class="inputContainer"><input v-focus="index=='0'"
                       type="text"
                       v-model="item.BaseName"></div>
            </li>
            <li>
              <i v-show="!updatePage"
                 :class="{newAddStateTrue:!item.EnabledMark,newAddStateFalse:item.EnabledMark}"></i>
              <div v-show="updatePage">
                <label style="cursor:pointer"><input :name="'EnabledMark'+index"
                         v-model="item.EnabledMark"
                         value=0
                         type="radio">启用</label>
                <label style="cursor:pointer"><input :name="'EnabledMark'+index"
                         v-model="item.EnabledMark"
                         value=1
                         type="radio">停用</label>
              </div>
            </li>
            <li v-show="updatePage"
                class="addIconCon">
              <span @click="handleContent(true,index)"
                    class="addIcon"></span>
              <span @click="handleContent(false,index)"
                    class="deleteIcon"></span>
            </li>
          </ul>

        </div>
      </div>
      <!--辅助项类型页面-->
      <auxiliary-type datalists=""
                      @type-click="addTypeFinish"
                      v-if="handleNav=='type'"></auxiliary-type>
      <!--辅助项新增编辑页面-->
      <handle-update :PhIdList="{list:userInfo,name:handleNav,data:PhIdList,type:navActive}"
                     v-if="handleNav=='add'||handleNav=='update'"
                     @add-click="addFinish"></handle-update>
    </div>
    <message :visible.sync="message.visible"
             :delay="message.delay"
             :message='message.message'></message>
  </div>
</template>

<script>
import handleUpdate from './handleUpdate'
import auxiliaryType from './auxiliaryType'
import { mapState, mapActions } from 'vuex'
import { dealAddString } from "@/util/validate";
export default {
  name: 'auxiliary',
  directives: {
    focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  data () {
    return {
      unionSearchValue: '',
      deleteList: [],
      userInfo: [     //列表信息
        // {PhId:'111',BaseCode:'01',BaseName:'办公室',EnabledMark:0},
        // {PhId:'222',BaseCode:'03',BaseName:'财务科',EnabledMark:1},
      ],
      handleNav: '',    //类型 add update
      navActive: { id: '', BaseName: '部门' },
      navTab: [
        // {PhId:11,BaseCode:'01',EnabledMark:1,BaseName:'部门'},
        // {PhId:112,BaseCode:'02',EnabledMark:1,BaseName:'往来单位'},
        // {PhId:113,BaseCode:'03',EnabledMark:0,BaseName:'往来个人'},
        // {PhId:114,BaseCode:'04',EnabledMark:0,BaseName:'项目'}
      ],
      updatePage: false,
      message: {
        visible: false,
        message: '',
        delay: 0
      }
    }
  },
  methods: {
    unionSearch () {
      //alert('输入的是:'+this.unionSearchValue)
      // var queryfilter={
      //     BaseCode:this.unionSearchValue,
      //     BaseName:this.unionSearchValue
      // }

      this.getData('');
    },
    initInfo () {
      return { PhId: '', BaseCode: '', EnabledMark: 0, BaseName: '' }
    },
    handlePage (val) {
      switch (val) {
        case 'save':
          if (this.updatePage) {
            this.saveInfo();
          }

          break;
        case 'update':
          if (!this.updatePage) {
            var input;
            this.updatePage = true;
            if (this.userInfo.length == 0) {
              this.userInfo.push({ PhId: '', BaseCode: '', EnabledMark: 0, BaseName: '' }, )
            }
            // input=document.querySelector('.auxiliaryContent>.formDataItems').children[2].children[1].children[0];

            // console.log(input)
          }

          break;
        case 'type':
          this.handleNav = 'type';
          break;
        case 'fresh':
          this.fresh();
          break;
      }
    },
    //刷新*******
    fresh () {
      this.navTab = [];
      this.deleteList = [];
      this.updatePage = false;
      this.ajaxMode();
    },
    //添加删除行信息********************************
    handleContent (bool, index) {
      if (bool) {
        this.userInfo.push(this.initInfo());
        this.$nextTick(function () {
          var input, lis;
          lis = document.querySelectorAll('.auxiliaryContent>.formDataItems');
          input = lis[lis.length - 1].children[2].children[1].children[0];
          input.focus();
        });
      } else {
        if (this.userInfo[index].PhId) {
          this.userInfo[index].DeleteMark = 1;
          this.deleteList.push(this.userInfo[index]);
        }
        this.userInfo.splice(index, 1);
      }
    },
    /**
     * 获取辅助项类别信息
     */
    ajaxMode () {
      let data = {
        uid: this.uid,//this.uid获取到store中的uid************
        orgid: this.orgid,//this.orgid获取到store中的orgid************
        infoData: null
      };
      var vm = this;
      this.$axios.get('/PVoucherAuxiliaryType/GetVoucherAuxiliaryTypeList', { params: data })
        .then(res => {

          if (res.Status === 'error') {
            this.$message.error(res.Msg);
            return
          }
          if (res.list.length <= 0) {

            this.message = {
              message: '暂无辅助项,请先点击编辑添加辅助项!',
              delay: 4000,
              visible: true
            }
          }
          this.userInfo = res.list;
          this.navTab = res.type;

          if (!this.navTab.id) {
            this.navActive = this.navTab[0];
          }

        })
        .catch(err => {
          console.log(err)
          this.$message({ showClose: true, message: "辅助项获取错误", type: "error" });
        })
    },
    //保存信息***********
    saveInfo () {
      var userinfo = JSON.parse(JSON.stringify(this.userInfo));
      var info = [];
      for (var user of userinfo) {
        if (user.BaseName) {
          info.push(user);
        }
      }
      if (this.deleteList.length > 0) {
        for (var ind of this.deleteList) {
          info.push(ind);
        }
      }
      var data = {
        TypeId: this.navActive.PhId,
        UpdateList: info
      }
      const loading = this.$loading();
      this.$axios.post("/PVoucherAuxiliaryType/PostUpdateAuxiliary", data)
        .then(res => {
          loading.close();
          console.log(res)
          if (res.Status === 'error') {
            this.message = {
              delay: 4000,
              message: res.Msg,
              visible: true
            }
            return
          } else {
            this.message = {
              delay: 4000,
              message: '保存成功!',
              visible: true
            }
            this.userInfo = res.List;
            this.deleteList = [];
            this.updatePage = false;
            this.getData();
          }

        })
        .catch(err => {
          loading.close();
          this.message = {
            delay: 4000,
            message: err,
            visible: true
          }
        })
    },

    //切换辅助项分类**************************
    navTabTurn (item) {
      this.navActive = item;
      this.updatePage = false;
      //加载数据
      this.getData('');

    },
    /**
    * 获取辅助项信息
    * query:查询参数
    *  */
    getData (query) {
      let data = {
        uid: this.uid,
        orgid: this.orgid,
        typeId: this.navActive.PhId,
        CodeOrName: this.unionSearchValue
      };
      this.$axios.get('/PVoucherAuxiliaryType/GetAuxiliaryQueryList', { params: data })
        .then(res => {
          if (res.Status === 'error') {
            this.$message.error(res.Msg);
            return
          }
          if (res.list.length <= 0) {

            this.message = {
              message: '暂无辅助项,请先点击编辑添加辅助项!',
              delay: 4000,
              visible: true
            }
          }
          this.userInfo = res.list;


        })
        .catch(err => {
          console.log(err)
          this.$message({ showClose: true, message: "辅助项获取错误", type: "error" });
        })
    },
    //分类管理弹窗完成*************
    addTypeFinish (val) {
      this.handleNav = false;
      this.ajaxMode();
    },
    // addFinish(val){
    //     this.handleNav=val;
    //     this.navTabTurn(this.navActive);
    //     this.getData('');
    // },
    //删除
    // deleteBase(){

    //     this.PhIdList.DeleteMark=1;
    //     var data={
    //         uid:this.uid,
    //         orgid:this.orgid,
    //         infoData:this.PhIdList
    //     }

    //     this.$confirm('此操作将永久删除该辅助项, 是否继续?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //     }).then(() => {
    //         this.$axios.post('/PVoucherAuxiliaryType/PostAddAuxiliary',data)
    //             .then(res=>{
    //                 if(res.Status==='error'){
    //                     this.$message.error(res.Msg);
    //                     return
    //                 }
    //                 this.getData('');
    //                 this.$message.success('删除成功!');
    //             })
    //             .catch(err=>{
    //                 console.log(err)
    //                 this.$message({ showClose: true,message: "删除错误", type: "error"});
    //             })
    //     }).catch((err) => {
    //         console.log(err)
    //         //取消不弹提示**********
    //         //this.$message({ showClose: true,message: "删除错误1", type: "error"});
    //     });
    // }
  },
  activated () {  //activated没组件名导致没有进keepalive
    //加载辅助项类型
    this.ajaxMode();
  },
  //计算
  computed: {
    addupdate () {
      return { name: '', data: this.PhIdList }
    },
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      user: state => state.user,
      Roleauthorize: state => state.user.Roleauthorize,//按钮权限
    })
  },
  //组件
  components: {
    handleUpdate,
    auxiliaryType,
  }
}

</script>

<style scoped>
.container {
  height: 100%;
  overflow-y: auto;
  font-size: 18px;
}
.manageContent {
  padding-bottom: 0;
  height: auto;
  font-size: 18px;
}
.unionState {
  padding: 0 20px 0 10px;
}
.unionState .handle > a > li {
  font-size: 14px;
}
.formData > ul:first-of-type {
  border: 0;
  background: #d3e8f9;
}
.formData > ul:first-of-type > li {
  border: 1px solid #bcbdbd;
  border-left: 0;
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
}
.formData > ul > li:nth-of-type(2) {
  width: 30%;
}
.formData > ul > li:nth-of-type(3) {
  width: 45%;
}
.formData > ul > li:nth-of-type(4) {
  width: 15%;
}
.formData > ul:first-child {
}
.formData > ul:first-child > li:last-of-type {
  width: 15%;
}

.formData > ul > li:first-child {
  width: 10%;
  min-width: 31px;
  padding: 0 2px;
}

/* .formData>ul.formDataItems:hover{
        background: #ddd;
    } */
.formData > ul.formDataItems > li.addIconCon {
  position: absolute;
  width: 0;
  left: 0;
  top: 0;
}
.formData > ul.formDataItems:hover > li.addIconCon {
  width: 25px;
  left: -25px;
  border: 0;
}
.formDataItems {
  border-bottom: 1px solid #bcbdbd;
}
.formData > ul.formDataItems > li {
  border-right: 1px solid #bcbdbd;
  border-left: 0;
  border-bottom: 0;
  text-align: center;
  line-height: 48px;
  height: 48px;

  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
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
.formData > ul.formDataItems > li > div > label > input {
  margin-right: 5px;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
.auxiliary {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.auxiliaryNav {
  width: 15%;
  min-width: 138px;
  margin-top: 10px;
  padding-right: 5px;
  margin-right: 35px;
}
.auxiliaryNavTitle {
  background: #d3e9f9;
  color: #333;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
}
.auxiliaryNav > ul {
  padding: 10px 20px;
  border: 1px solid #d3e9f9;
}
.auxiliaryNav > ul > li {
  width: 90%;
  margin: auto;
  margin-bottom: 10px;
  min-width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #00b8ee;
  border-radius: 5px;
}
.auxiliaryNav > ul > li:hover {
  background: #00b8ee;
  color: #fff;
  cursor: pointer;
}
.auxiliaryNav > ul > li.active {
  background: #00b8ee;
  color: #fff;
}
.auxiliaryContent {
  width: 85%;
}
.auxiliaryContent > ul:first-of-type {
  font-size: 18px;
}

.formDataItems > li > .inputContainer {
  height: 100%;
}
.formDataItems > li > .inputContainer > input {
  border: 0;
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
  background: url("../../../assets/icon/addition_fill.svg");
  background-size: cover;
}
.addIcon:hover {
  background: url("../../../assets/icon/addition.svg");
  background-size: cover;
}
.deleteIcon {
  bottom: 0px;
  background: url("../../../assets/icon/delete_fill.svg");
  background-size: cover;
}
.deleteIcon:hover {
  background: url("../../../assets/icon/delete.svg");
  background-size: cover;
}

.handle > a > li.freshImg {
  background: none;
  border: 0;
  width: 30px;
  padding: 0;
}
.handle > a > li > img {
  height: 100%;
  width: 100%;
}
.handle > a > li.updateActive {
  background: #ccc;
  border: 1px solid #ccc;
  cursor: default;
}
.handle > a > li.updateActive:hover {
  background: #ccc;
  border: 1px solid #ccc;
  color: #fff;
}

.unUpdateBG {
  background: #ddd;
}
</style>
