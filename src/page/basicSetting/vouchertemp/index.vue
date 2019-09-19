<template>
  <div class="container" style="font-size:18px">
    <div class="voucherList">
      <section class="listContainer">
        <div style="height:40px;min-width:1085px;font-size:14px;">
          <div style="display: inline-block;height: 30px;float: left">
            <span style="line-height: 30px">模板类型：</span>
          </div>
          <div style="float:left;" class="selectContainer">
            <select v-model="tempListType" @change="getvoucherList">
              <option value="0">全部</option>
              <option value="1">支出类</option>
              <option value="2">收入类</option>
              <option value="3">通用类</option>
            </select>
          </div>
          <div class="voucherNav">
            <ul>
              <a @click.prevent="handle('fresh')" style="width:30px">
                <li style="font-size:27px;" class="el-icon-refresh"></li>
              </a>
              <a class="btn" @click.prevent="handle('delete')">
                <li>删除</li>
              </a>
              <a class="btn" @click.prevent="handle('update')">
                <li>修改</li>
              </a>
              <a class="btn" @click.prevent="handle('add')">
                <li>新增</li>
              </a>
            </ul>
          </div>
          <div class="voucherSelect">
            <div class="searcherCon">
              <div
                style="margin-left:0; border-radius: 0;width:60px;"
                @click="getvoucherList('search')"
                class="searcherBtn"
              >搜索</div>
              <div class="searcherValue">
                <input
                  @keyup.13="getvoucherList('search')"
                  v-model="searchVal"
                  type="text"
                  placeholder="名称"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="listTitleCon">
          <div
            style="border:1px solid #bcbdbd;width:5%;left:0;top:0px;position:absolute;height:40px;line-height:40px;background:#d3e8f9;text-align:center"
          >
            <div style="width:50%;height:100%;float:left;border-right:1px solid #bcbdbd;">
              <el-checkbox v-model="listAll"></el-checkbox>
            </div>
            <div style="width:50%;height:100%;float:left;overflow:hidden;white-space:nowrap">序号</div>
          </div>
          <ul class="listTitle">
            <li>名称</li>
            <li>摘要</li>
            <li>科目</li>
            <li>借方金额(元)</li>
            <li>贷方金额(元)</li>
            <li>备注</li>
          </ul>
          <ul></ul>
        </div>
        <div class="listOver">
          <div
            style="text-align:center;height:40px;line-height:40px;color:#aaa;"
            v-if="voucherList.length==0"
          >暂无凭证信息！</div>
          <ul
            @click="chooseClick(item,index,$event)"
            :class="{choosed:item.checked}"
            class="listContent"
            v-for="(item,index) of voucherList"
            :key="index"
          >
            <li>
              <ul class="listIndex">
                <li>
                  <el-checkbox @change="choose(item,index,$event)" v-model="item.checked"></el-checkbox>
                </li>
                <li>{{index+1+(pageindex-1)*pagesize}}</li>
              </ul>
              <ul style="position: relative;">
                <li class="listTempName" :title="item.TemName" style="height:100%;">{{item.TemName}}</li>
                <li style="margin-left:15%;margin-right: 15%;" v-for="(dtl,ind) of item.Dtls" :key="ind">
                  <div class="wrapKemu">{{dtl.Abstract}}</div>
                  <div class="wrapKemu">
                    {{dtl.SubjectCode}}&nbsp;{{dtl.SubjectName}}
                    <span
                      v-for="(item,index) of dtl.DtlAccounts?dtl.DtlAccounts[0].NameValueDtls:0"
                      :key="index"
                    >.{{item.AuxiliaryName}}</span>
                  </div>
                  <div style="text-align: right">{{(dtl.JSum==0?'':dtl.JSum) | NUmTurn}}</div>
                  <div style="text-align: right">{{(dtl.DSum==0?'':dtl.DSum) | NUmTurn}}</div>
                </li>
                <li class="listTempName" :title="item.RMark" style="height: 100%;right: 0;top: 0;">{{item.RMark}}</li>
              </ul>
            </li>
          </ul>
          <div style="float:right">
            <el-pagination
              background
              @size-change="getvoucherList"
              @current-change="getvoucherList"
              :current-page.sync="pageindex"
              :page-sizes="[10,20, 30, 50, 70,100,500]"
              :page-size.sync="pagesize"
              layout="sizes, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>

        <div class="hideScroll"></div>
      </section>
    </div>
    <div class="tempVouBG" style="z-index:999;" v-if="tempCss=='add'||tempCss=='update'">
      <div class="vouchertempCon tempAdd">
        <p class="title">
          <span v-if="tempCss=='add'">新增模板</span>
          <span v-if="tempCss=='update'">修改模板</span>
          <i @click.stop="tempCss=''" class="el-icon-close"></i>
        </p>
        <div class="tempName">
          
          <!-- <div style="float:left" v-if="tempCss=='update'" class="flexPublic">
            <span>模板名称</span>
            <div class="inputContainer">
              <input type="text" v-model="TemName">
            </div>
          </div> -->
          <div style="float:right" class="btn" @click.stop="add()">保存模板</div>
          
         
          <div style="margin-top:40px"  class="flexPublic">
              <span style="width:80px;text-align:right">模板名称&nbsp;</span>
              <div style="width:79%;" class="inputContainer">
                  <input type="text" maxlength="150" placeholder="输入模板名称" v-model="TemName">
              </div>
              <div style="line-height: 30px;margin:0 10px;width:80px;text-align:right;">模板类型</div>
              <div style="display: inline-block" class="selectContainer">
                  <select v-model="tempDescription">
                      <option value="0">通用类</option>
                      <option value="1">收入类</option>
                      <option value="2">支出类</option>
                  </select>
              </div>
              
          </div>
          <div style="margin-top:10px"  class="flexPublic">
            <span style="width:80px;text-align:right">备注&nbsp;</span>
            <div class="inputContainer">
              <input type="text" maxlength="150" placeholder="请录入模板备注" v-model="RMark">
            </div>
          </div>
        </div>
        <temp-vou :dataList="voucherDataList" ref="voucher"></temp-vou>
      </div>
    </div>

    <saasconfirm
      :type="confirm.type"
      :message="confirm.message"
      v-show="confirm.visible"
      :btn1="confirm.btn1"
      :btn2="confirm.btn2"
      @ok-click="confirmOk"
      @no-click="confirmNo"
    ></saasconfirm>
    <message
      :message="saasMessage.message"
      :delay="saasMessage.delay"
      :visible.sync="saasMessage.visible"
    ></message>
  </div>
</template>

<script>
import userInfo from '@/util/auth'
import { mapState, mapActions } from 'vuex'
import tempVou from '../../finance/tempVou'
export default {
  name: 'vouchertempIndex',
  data() {
    return {
      voucherList: [], //展示的列表
      pageindex: 1,
      pagesize: 100,
      total: 0,
      listAll: false,
      chooseItem: [],
      searchVal: '',
      saasMessage: {},
      confirm: {},
      tempCss: '',
      TemName: '',//模板名称
      RMark:'',//备注
      voucherDataList: { bool: true, data: { Mst: {} } },
      tempDescription: 0,
      tempList: [], //全部模板
      tempListType: 0,
      inVoucherList: [], //收入模板
      outVoucherList: [], //支出模板
      norVoucherList: [] //通用模板
    }
  },
  activated() {
    this.uInfo = userInfo.getUserInfoData().userInfo
    this.getvoucherList()
  },
  computed: {
    ...mapState({
      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgName: state => state.user.orgName,
      dbname: state => state.user.dbname,
      orgcode: state => state.user.orgcode,
      Roleauthorize: state => state.user.Roleauthorize, //按钮权限
      cachePage: state => state.tagNav.cachePage //是否利用路由缓存
    })
  },

  methods: {
    handle(str) {
      switch (str) {
        case 'add':
          this.tempCss = 'add'
          this.TemName = ''
          this.voucherDataList = { bool: true, data: { Mst: {} } }
          break
        case 'update':
          if (this.chooseItem.length == 0) {
            this.saasMessage = {
              message: '请选择一个模板!',
              visible: true
            }
            return
          }
          if (this.chooseItem.length > 1) {
            this.saasMessage = {
              message: '一次只能修改一个模板!',
              visible: true
            }
            return
          }
          this.voucherDataList.data.Mst = this.chooseItem[0]
          this.RMark=this.chooseItem[0].RMark
          this.TemName = this.chooseItem[0].TemName
          this.tempDescription = this.chooseItem[0].Description
          if(!this.tempDescription){
              this.tempDescription='0';
          }
          this.tempCss = 'update'
          break
        case 'delete':
          if (this.chooseItem.length == 0) {
            this.saasMessage = {
              message: '请选择一个模板!',
              visible: true
            }
          } else {
            this.confirm = {
              visible: true,
              message: '此操作将永久删除凭证模板,是否继续!',
              type: 'delete'
            }
          }
          break
        case 'fresh':
          this.getvoucherList()
          this.listAll = false
          this.tempCss = ''
          this.chooseItem = []
          break
      }
    },
    //confirm确认框方法*******
    confirmOk(type) {
      this.confirm.visible = false
      switch (type) {
        case 'delete':
          let phids = []
          for (let item of this.chooseItem) {
            phids.push(item.PhId)
          }
          this.delete(phids)
          break
      }
    },
    confirmNo(type) {
      this.confirm.visible = false
    },
    //凭证列表***********
    getvoucherList() {
      var list = []
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        pagesize: this.pagesize,
        pageindex: this.pageindex - 1,
        queryfilter: {
          'TemName*str*llike*1': this.searchVal,
          'PType*str*eq': '记'
        }
      }
      // if(this.temptype=='jie'){
      //     data.queryfilter={"TemName*str*llike*1":this.searchVal,"PType*str*eq":"结"}
      // }
      const loading = this.$loading()
      this.$axios
        .get('PVoucherTemplateMst/GetVoucherTemplateList', { params: data })
        .then(
          res => {
            loading.close()
            this.chooseItem=[];
            this.tempList = res.Record
            this.inVoucherList = []
            this.outVoucherList = []
            this.norVoucherList = []
            for (let vou of res.Record) {
              if (vou.Description == 1) {
                this.inVoucherList.push(vou)
              } else if (vou.Description == 2) {
                this.outVoucherList.push(vou)
              } else {
                this.norVoucherList.push(vou)
              }
            }
            if (this.tempListType == '2') {
              this.voucherList = JSON.parse(JSON.stringify(this.inVoucherList))
            } else if (this.tempListType == '1') {
              this.voucherList = JSON.parse(JSON.stringify(this.outVoucherList))
            } else if (this.tempListType == '3') {
              this.voucherList = JSON.parse(JSON.stringify(this.norVoucherList))
            } else {
              this.voucherList = JSON.parse(JSON.stringify(this.tempList))
            }

            this.pageindex = res.index + 1
            this.total = res.totalRows
            this.pagesize = res.size
            for (let li of this.voucherList) {
              li.checked = false
            }
            if (this.voucherList.length <= 0) {
              this.$message('暂无新凭证')
            }
          },
          err => {
            loading.close()
            console.log(err)
          }
        )
        .catch(err => console.log(err))
    },
    //ul上的点击事件,和change顺序相反了
    chooseClick(item, index, $event) {
      if (
        $event.target.className == 'el-checkbox__inner' ||
        $event.target.className == 'el-checkbox__original'
      ) {
        return
      } else {
        item.checked = !item.checked
        this.choose(item, index)
        var val
        val = this.voucherList.every((val, index, arr) => {
          return val.checked == true
        })
        if (val) {
          this.listAll = true
        } else {
          this.listAll = false
        }
      }
    },
    //多选************* checkbox  @change事件
    choose(item, index, $event) {
      var val
      if (!item.checked) {
        this.chooseItem.forEach((val, i, arr) => {
          if (val.PhId == item.PhId) {
            arr.splice(i, 1)
          }
        })
        this.$forceUpdate()
      } else {
        this.chooseItem.push(item)
        this.$forceUpdate()
      }
      val = this.voucherList.every((val, index, arr) => {
        return val.checked == true
      })
      if (val) {
        this.listAll = true
      } else {
        this.listAll = false
      }
    },
    //添加修改******************
    add() {
      var url = 'add'
      this.voucherData()
      if (this.voucherDataList.data.Mst.Dtls.length <= 0) {
        this.$message('请输入内容!')
        return
      }
      this.voucherDataList.data.Mst.RMark=this.RMark
      this.voucherDataList.data.Mst.TemName = this.TemName
      this.voucherDataList.data.Mst.UseCount = this.uInfo.Account
      this.voucherDataList.data.Mst.Userid = this.uid
      this.voucherDataList.data.Mst.Description = this.tempDescription
      this.voucherDataList.data.Mst.PKeepingPerson=''
      this.voucherDataList.data.Mst.PAuditorName=''
      this.voucherDataList.data.Mst.PCashier=''
      this.voucherDataList.data.Mst.PMakePerson=''
   
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        infoData: this.voucherDataList.data
      }
      if (this.voucherDataList.data.Mst.PhId) {
        url = 'update'
      }
      const loading1 = this.$loading()
      this.$axios
        .post('/PVoucherTemplateMst/Post' + url, data)
        .then(
          res => {
            loading1.close()
            if (res.Status == 'success') {
              this.handle('fresh')
            }
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
          },
          err => {
            console.log(err)
          }
        )
        .catch(err => {
          console.log(err)
          loading1.close()
          this.saasMessage = {
            message: '保存失败!',
            visible: true
          }
        })
    },
    //删除*********************
    delete(phids) {
      var data = {
        uid: this.uid,
        orgid: this.orgid,
        infoData: phids
      }
      const loading = this.$loading()
      this.$axios
        .post('PVoucherTemplateMst/PostDeleteList', data)
        .then(
          res => {
            loading.close()
            if (res.Status == 'success') {
              this.handle('fresh')
            }
            this.saasMessage = {
              message: res.Msg,
              visible: true
            }
          },
          err => {
            loading.close()
            console.log(err)
          }
        )
        .catch(err => {
          loading.close()
          this.saasMessage = {
            message: '删除失败了!',
            visible: true
          }
        })
    },
    //接收voucher组件传值************
    voucherData() {
      this.voucherDataList.data = this.$refs.voucher.voucherData()
    }
  },
  watch: {
    listAll(bool) {
      //全选
      if (bool) {
        for (var vou of this.voucherList) {
          vou.checked = bool
        }
        this.chooseItem = JSON.parse(JSON.stringify(this.voucherList))
      } else if (
        this.voucherList.every((val, index, arr) => {
          return val.checked == true
        })
      ) {
        this.chooseItem = []
        for (var vou of this.voucherList) {
          vou.checked = bool
        }
      }
    }
  },
  filters: {
    //数字转换******************
    NUmTurn(value) {
      if (!value) return ''
      /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
      var intPart = Number(value) | 0 //获取整数部分
      var intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断

      var floatPart = '.00' //预定义小数部分
      var value2Array = value.toString().split('.')

      //=2表示数据有小数位
      if (value2Array.length == 2) {
        floatPart = value2Array[1].toString() //拿到小数部分

        if (floatPart.length == 1) {
          //补0,实际上用不着
          return intPartFormat + '.' + floatPart + '0'
        } else {
          return intPartFormat + '.' + floatPart
        }
      } else {
        return intPartFormat + floatPart
      }
    }
  },
  components: {
    tempVou
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 10px 30px 0px 20px;
  overflow: hidden;
  height: 100%;
  // position:relative;
}
.listContainer {
  margin: 10px 0;
  position: absolute;
  z-index: 0;
  overflow: hidden;
  left: 40px;
  right: 40px;
  top: 70px;
  bottom: 70px;
  padding-bottom: 20px;
  .listOver {
    //height:100%;

    overflow-y: scroll;
    position: absolute;
    left: 0;
    right: 0;
    top: 90px;
    bottom: 0;
  }
  .listTitleCon {
    // overflow-y: scroll;
    position: absolute;
    left: 0;
    right: 17px;
    top: 50px;
    height:40px;
  }
}
.listContainer > .listTitleCon > ul.listTitle {
  > li {
    border: 1px solid #bcbdbd;
    border-width: 1px 1px 1px 0;
    &:last-of-type {
      border-right: 1px solid #bcbdbd;
    }
  }
}
.listContainer ul.listTitle {
  height: 40px;
  width: 95%;
  background: #d3e8f9;
  color: #333;
  position: absolute;
  top: 0px;
  left: 0;
  margin-left: 5%;
}
.listContainer ul.listTitle li {
  float: left;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.listContainer ul.listTitle li:first-of-type {
  width: 15%;
}
.listContainer ul.listTitle li:nth-of-type(2) {
  width: 20%;
}
.listContainer ul.listTitle li:nth-of-type(3) {
  width: 20%;
}
.listContainer ul.listTitle li:nth-of-type(4) {
  width: 15%;
}
.listContainer ul.listTitle li:nth-of-type(5) {
  width: 15%;
}
.listContainer ul.listTitle li:nth-of-type(6) {
  width: 15%;
}
// .listContainer ul.listTitle li:nth-of-type(5){
//     width:20%;
// }
ul.listContent {
  border: 0px solid #bcbdbd;
  border-top: 1px solid #bcbdbd;
  margin-bottom: 20px;
  width: 100%;
  background: #fff;
  &:first-of-type {
    border-top: 0;
  }
}
ul.listContent.choosed > li > ul.listIndex {
  background: #00b7ee;
  color: #fff;
}

ul.listContent > li {
  width: 100%;
  height: 100%;

  overflow: hidden;

  position: relative;
}
ul.listContent > li > ul.listIndex {
  margin: 0;
  border: 1px solid #bcbdbd;
  border-top: 0;
  height: 100%;
  width: 5%;
  font-size: 18px;
  top: 0;
  left: 0;
  position: absolute;
}
ul.listContent > li > ul.listIndex > li {
  width: 50%;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
  padding: 0;
  justify-content: center;
}
ul.listContent > li > ul.listIndex > li:first-of-type {
  border: 0;
  width: 50%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border-right: 1px solid #bcbdbd;
  padding: 0;
}
ul.listContent > li > ul {
  height: 100%;
  width: 95%;
  margin-left: 5%;
}
ul.listContent > li > ul > li {
  height: 30px;
  line-height: 30px;
}
/*ul.listContent>li> ul>li:first-of-type{*/
/*padding:0 10px;*/
/*border:1px solid #bcbdbd;*/
/*border-top:0;*/
/*border-left: 0;*/
/*}*/
/*ul.listContent>li> ul>li:first-of-type>span{*/
/*margin-right: 50px;*/
/*}*/
ul.listContent > li > ul > li > div {
  float: left;
  height: 100%;
  text-align: left;
  padding: 0 10px;
  border: 1px solid #bcbdbd;
  border-top: 0;
  border-left: 0;
}
ul.listContent > li > ul > li div:first-of-type {
  width: 28.57%;
}
ul.listContent > li > ul > li div:nth-of-type(2) {
  width: 28.57%;
}
ul.listContent > li > ul > li div:nth-of-type(3) {
  width: 21.43%;
}
ul.listContent > li > ul > li div:nth-of-type(4) {
  width: 21.43%;
}

/*ul.listContent>li> ul>li:last-of-type>div{*/
/*text-align: left;*/
/*border:1px solid #bcbdbd;*/
/*border-top:0;*/
/*border-left:0;*/
/*width:20%;*/

/*}*/
/*ul.listContent>li> ul>li:last-of-type>div:first-of-type{*/
/*width:60%;*/
/*}*/
/*ul.listContent>li> ul:nth-of-type(2)>li>div:nth-last-of-type(1),ul.listContent>li> ul:nth-of-type(2)>li>div:nth-last-of-type(2){*/
/*text-align: right;*/
/*}*/

/*ul.listContent>li> ul:nth-of-type(2)>li:last-of-type>div{*/
/*padding-left:10%;*/
/*}*/
.voucherList {
  padding: 8px 20px 0 0px;
  margin-right: 10px;
  font-size: 18px;
  //position:relative;
  min-width: 920px;
  height: 100%;
  .voucherNav {
    float: right;
  }
  .voucherNav > ul {
    margin-bottom: 10px;
    position: relative;
    padding-right: 16px;
    //z-index:2;
    > a:nth-of-type(2):hover {
      opacity: 1;
    }
    &:last-of-type:after {
      clear: both;
      content: '';
      display: block;
    }
    > a {
      float: right;

      &.btn {
        color: #fff;
        &:hover {
          color: #00b7ee;
        }
      }
      border-radius: 3px;
      height: 30px;
      line-height: 30px;
      margin-left: 10px;
      cursor: pointer;
      width: 70px;

      text-align: center;

      &:hover {
        opacity: 0.8;
      }
      > li {
        > img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .voucherSelect {
    height: 30px;
    position: relative;
    float: right;
    // padding-right:16px;
    > div {
      float: left;

      min-width: 230px;
      line-height: 30px;
      > span,
      > div {
        float: left;
        margin-left: 5px;
      }
      > div {
        width: 50px;
        > input {
          padding: 0 0 0 5px;
        }
      }
    }
    > div:nth-of-type(2) {
      float: left;
      width: 180px;
      min-width: 180px;
      text-align: center;
      > label:nth-of-type(2) {
        margin-left: 20px;
      }
    }
    > div:last-of-type {
      float: right;

      min-width: 307px;
    }
    > div.searcherCon {
      .searcherValue {
        border-radius: 4px 0 0 4px;
      }
      > div {
        float: right;
        width: auto;
        margin: 0;
        &:first-of-type {
          margin-left: 10px;
          cursor: pointer;
          background: #00b7ee;
          height: 30px;
          line-height: 30px;
          width: 70px;
          color: #fff;
          text-align: center;
          border-radius: 3px;
        }
        &:nth-of-type(2) {
          width: 70px;
        }
        // &:nth-of-type(3){
        //     //min-width: 300px;
        // }
      }
    }
  }
}
.searcherCon {
  float: right;
  width: 40%;
  min-width: 170px;
  position: relative;
}
.searcherCon .highGradeCss > ul li > div:last-of-type .el-date-editor.el-input {
  width: 100%;
}
.searcherValue {
  border: 1px solid #ddd;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  padding-left: 10px;
  height: 30px;
}
.voucherList .voucherSelect > div.searcherCon > div.searcherValue {
  width: 150px;
}

.searcherValue > input {
  width: 100%;
  height: 30px;
  outline: none;
  margin: 0;
  font-size: 14px;
  border: 0;
}
.searcherBtn {
  height: 30px;
  width: 20%;
  text-align: center;
  line-height: 30px;
  background: #00b7ee;
  color: #fff;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
}
.tempName {
  overflow: hidden;
  padding: 5px;
  margin-top: 10px;
  font-size: 15px;
  > div:first-of-type {
    // width: 300px;
    > span {
      width: 100px;
    }
  }
}
.vouchertempCon {
  display: inline-block;
  vertical-align: middle;
  background: #fff;
  padding: 10px 30px 30px;
  width: 85%;
  min-width:950px;
  margin: 80px auto 0;
  border-radius: 10px;
  position: relative;
  i {
    cursor: pointer;
  }
  .title {
    border-bottom: 1px solid #ccc;
    padding: 5px 2px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 14pt;
    font-style: normal;
    font-weight: 700;
  }
  .voucherList {
    overflow-y: auto;
    height: 410px;
    width: 100%;
    > ul {
      display: flex;
      justify-content: flex-start;
      flex-flow: row wrap;
      margin-top: 20px;
      > li {
        width: 315px;
        height: 176px;
        margin: 0 25px 25px 0;
        > div:first-of-type {
          height: 33px;
          background: #00b7ee;
          color: #fff;
          > div {
            width: 65%;
            padding: 5px;
            &:last-of-type {
              width: 35%;
              &.jieModel {
                width: 13%;
              }
            }
            > img {
              width: 30px;
              height: 30px;
            }
            > span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            display: flex;
            align-items: center;
            &:nth-of-type(2) {
              > img {
                cursor: pointer;
              }
            }
          }
          img {
            width: 25px;
            height: 25px;
            margin-right: 5px;
          }
        }
        > div:nth-of-type(2) {
          height: 144px;
          border: 2px solid #00b7e4;
        }
        &.addModel:first-of-type {
          cursor: pointer;
          > div:first-of-type {
            background: #00b7ee;
            line-height: 33px;
            text-align: center;
            color: #fff;
            font-size: 16px;
          }
          > div:nth-of-type(2) {
            border: 2px solid #00b7ee;
            position: relative;
            &:before {
              position: absolute;
              content: '';
              width: 104px;
              height: 6px;
              background: #d9d9d9;
              left: 102px;
              top: 67px;
              border-radius: 4px;
            }
            &:after {
              position: absolute;
              content: '';
              width: 7px;
              height: 81px;
              background: #d9d9d9;
              left: 150px;
              top: 30px;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}
.tempVouBG {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  position: -ms-page;
  z-index: 999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  text-align: center;
  &:last-of-type {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
  }
}
.listTempName {
  width: 15%;
  border: 1px solid #ccc;
  position: absolute;
  border-width: 0 1px 1px 0;
  overflow-y: auto;
  padding: 5px;
}
.wrapKemu{
  overflow:hidden;
}
</style>
