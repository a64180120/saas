<template>
  <div class="indexSetting sys-page" style="font-size:18px">
    <div class="container">
      <div class="unionState flexPublic2">
        <ul class="flexPublic handle">
          <div class="searcherValue" style="border-radius:4px 0 0 4px">
            <input
              @keyup.enter="unionSearch"
              v-model="unionSearchValue"
              type="text"
              placeholder="菜单名称"
            >
          </div>
          <div @click="unionSearch" class="searcherBtn" style="border-radius:0;width: 60px">搜索</div>
          <a v-if="!isEditing" @click.prevent="edit">
            <li>修改</li>
          </a>
          <a v-if="isEditing" @click.prevent="submitEdit">
            <li>保存</li>
          </a>
          <a v-if="isEditing" @click.prevent="cancelEdit">
            <li>取消</li>
          </a>
          <a>
            <li
              class="el-icon-refresh"
              @click="freshPage"
              style="margin:0 0 0px 10px;background: #FFFFFF;min-width:30px;padding:0;border:0;width:30px;height:30px;"
            ></li>
          </a>
        </ul>
      </div>
      <div class="auxiliary manageContent" style="font-size:18px">
        <div class="formData listContent">
          <table >
             <colgroup data-v-3dc091b5="">
                  <col  width="10%">
                  <col  width="36%">
                  <col  width="18%">
                  <col  width="36%">
                </colgroup>
            <tbody>
              <tr class="tHeader">
                <td >序号</th>
                <td >菜单名称</th>
                <td >是否显示</th>
                <td>备注</td>
              </tr>
            </tbody>
          </table>
          <div class="tableContent" >
            <table >
               <colgroup data-v-3dc091b5="">
                  <col  width="10%">
                  <col  width="18%">
                  <col  width="18%">
                  <col  width="18%">
                  <col  width="36%">
                </colgroup>
              <tbody>
                <template v-if="listInfo.length>0" >
                    <template v-for="(item,index) in listInfo">
                        <template v-if="item.Del&&item.Del.length>0">
                            <tr  v-for="(subitem,subindex) in item.Del">
                              <td ref='listIndex' width="120">{{subitem.count}}</td>
                              <td  v-if="subindex==0" class="noBg" :rowspan="item.Del.length">{{item.title}}</td>
                              <td >{{subitem.title}}</td>
                              <td width="240">
                                  <div v-if="!isEditing" style="position:relative;height:100%">
                                      <i
                                    :class="subitem.isshow==1?'newsPublishStateTrue':'newsPublishStateFalse'"
                                    ></i>
                                  </div>
                                  <div class="radios" v-else>
                                    <el-radio v-model="subitem.isshow" label="1">是</el-radio>
                                    <el-radio v-model="subitem.isshow" label="0">否</el-radio>
                                  </div>
                              </td>
                               <td :style="{'background-color': isEditing?'#fafafa':''}">
                                    <input maxlength="250" :disabled="!isEditing" type="text" style="text-align:left" :value="subitem.remarks">
                                </td>
                            </tr>
                        </template>
                        <tr  v-else>
                            <td ref='listIndex' width="120">{{item.count}}</td>
                            <td  :colspan="2">{{item.title}}</td>
                            <td width="240">
                                <div v-if="!isEditing" style="position:relative;height:100%">
                                    <i
                                        :class="item.isshow==1?'newsPublishStateTrue':'newsPublishStateFalse'"
                                    ></i>
                                </div>
                                <div class="radios" v-else>
                                    <el-radio v-model="item.isshow" label="1">是</el-radio>
                                    <el-radio v-model="item.isshow" label="0">否</el-radio>
                                </div>
                            </td>
                            <td :style="{'background-color': isEditing?'#fafafa':''}">
                                <input maxlength="250" :disabled="!isEditing" type="text" style="text-align:left" :value="item.remarks">
                            </td>
                        </tr>
                    </template>
                </template>
                <tr v-else style="border-top: #00b7ee;">
                  <td colspan="8" class="center" style="border-bottom-color: #00B8EE">当前搜索数据为空</td>
                </tr>
              </tbody>
            </table>
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
// import { mapState  } from 'vuex'

export default {
  name: 'indexSetting',
  data() {
    return {
      unionSearchValue: '',
      listInfo: [], //列表信息
      saasMessage: {},
      isEditing: false,
      oldList: [],
    }
  },
  mounted() {
    this.getData('')
  },
  //计算
//   computed: {
//     ...mapState({
//       orgid: state => state.user.orgid,
//       uid: state => state.user.userid,
//       username: state => state.user.username
//     })
//   },
  methods: {
    /**
     * 获取新闻信息
     * query:查询参数
     *  */
    getData(query) {
      let data = {
        value:"signin,signin2,signin3",
        uname: query
      }
      // 
        this.$axios
          .get('/SysMessage/GetSysWebMenuMessage', { params: data })
          .then(res => {
            if(res.Status==='error'){
                this.$message.error(res.Msg);
                return
            }
            var newList = [],count = 1
            for(let i in res){
                if(res[i].sign == 1){
                    if(!newList.length||!newList[0].Del){
                        Array.unshift(newList,{title:'登录',Del:[]})
                    }
                    newList[0].Del.push(
                        {
                            head:i,
                            count:count++,//序号
                            ...res[i],
                        }
                    )
                }else{
                    newList.push(
                        {
                            head:i,
                            count:count++,//序号
                            ...res[i],
                        }
                    )
                }
            }
            this.listInfo = newList
            if(this.isEditing){
                this.oldList = newList
            }
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err,
              type: 'error'
            })
          })
    },
    /**
     * 搜索按钮
     */
    unionSearch() {
      this.getData(this.unionSearchValue)
    },
    // 修改按钮
    edit() {
      // 新建一个对象，用于保存修改前状态
      this.oldList = JSON.parse(JSON.stringify(this.listInfo))
      this.isEditing = true
    },
     // 提交修改
    submitEdit() {
      this.$confirm('保存成功后信息将被发布，确定保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          ()=> {
            const loadings=this.$loading();
            let data = [],list = JSON.parse(JSON.stringify(this.listInfo))
            list.forEach((item)=>{
              if(item.Del&&item.Del.length>0){
                item.Del.forEach(subitem=>{
                  let newItem = {}
                  newItem.Name = subitem.head
                  delete subitem.head
                  delete subitem.count
                  newItem.Value = JSON.stringify(subitem)
                  data.push(newItem)
                })
              }else{
                  let newItem = {}
                  newItem.Name = item.head
                  delete item.head
                  delete item.count
                  newItem.Value = JSON.stringify(item)
                  data.push(newItem)
              }
            })
          this.$axios
          .post('/SysMessage/PostUpdateWebMenu',  {
              WebMenus:data
          } )
          .then(res => {
            loadings.close();
            if(res.Status==='error'){
                this.$message.error(res.Msg);
                return
            }
            this.saasMessage={
                message:res.Msg,
                delay:3000,
                visible:true
            };
            this.isEditing = false
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: '修改失败',
              type: 'error'
            })
          })
        })
        .catch(err => {
              console.log(err)
        })
    },
    // 不保存修改
    cancelEdit() {
      this.listInfo = this.oldList
      this.isEditing = false
    },
    //刷新当前页面
    freshPage() {
      this.isEditing = false
      this.unionSearchValue = ''
      this.getData('')
    },
  }
}
</script>

<style scoped  lang="less">
.formData table {
  width: 100%;
  tr td:first-of-type{
    text-align: center;
  }
  .tHeaderHide td {
    height: 0;
    border: 0 !important;
    overflow: hidden;
  }
  .tHeader td {
    text-align: center;
    height: 47px;
    background-color: #d3e9f9;
    color: #333;
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    border-left: 1px solid #bbb;
    border-top: 1px solid #bbb;
    border-bottom: 1px solid #bbb;
    &:last-child {
      border-right: 1px solid #bbb;
    }
  }
  td {
    color: #333;
    text-align: left;
    height: 40px;
    padding: 0 8px;
    min-width: 75px;
    border-left: 1px solid #bbb;
    border-bottom: 1px solid #bbb;
    background-clip: padding-box;
    &:last-child {
      border-right: 1px solid #bbb;
    }
  }
}
.indexSetting {
    .tableContent input {
        border: none;
        line-height: 40px;
        height: 40px;
        width: 100%;
    }
    table, td, th{
        border-collapse: unset !important;
    }
    .unionState .handle>a>li{
        display: inline-block;
    }
    .flexPublic > a{
        display: block;
    }
}
.indexSetting .tableContent {
  overflow-y: scroll;
  position: absolute;
  overflow-x: hidden;
  left: 0;
  right: -17px;
  top: 48px;
  bottom: 20px;
  tr:last-child {
    border-bottom: 1px solid #bbb;
  }
  tr:hover {
    background-color: #fafafa;
    transition: background-color 0.25s ease;
  }
  .radios {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .noBg {
    background: #fff !important;
  }

}
.indexSetting .newsPublishStateTrue:before,
.indexSetting .newsPublishStateTrue:after {
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
.el-icon-refresh:before {
  /* content: "\E6D0"; */
  font-size: 25px;
  color: #00b8ee;
}
.container {
  height: 100%;
  overflow-y: auto;
  position: relative;
}
.indexSetting .manageContent {
  position: absolute;
  left: 40px;
  right: 40px;
  top: 50px;
  bottom: 20px;
  height: auto;
  width: auto;
  padding: 0;
}
.indexSetting .pagenation {
  position: absolute;
  bottom: 0;
  left: 0;
}
.manageContent {
  padding-bottom: 0;
  height: auto;
  font-size: 18px;
}
.indexSetting .unionState {
  min-width: auto;
}
.unionState {
  padding: 0 10px;
  min-width: 1190px;
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
  margin-right: 15px;
}
.auxiliaryNavTitle {
  background: #d3e9f9;
  color: #333;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 15px;
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
  overflow: hidden;
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
.listContent {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.NoDataflex {
  height: 40px;
  border: 1px solid #d3e9f9;
  display: block;
  text-align: center;
  padding-top: 10px;
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
  top: 12px;
  left: 48%;
}
.newsPublishStateFalse:before,
.newsPublishStateFalse:after {
  content: '';
  position: absolute;
  width: 18px;
  height: 1px;
  background: #d8281d;
  transform: rotate(45deg);
  top: 22px;
  left: 44%;
}
.newsPublishStateFalse:before {
  transform: rotate(-45deg);
}
.flexPublic2 > ul,
.flexPublic2 > li,
.flexPublic2 > span,
.flexPublic2 > div {
  float: right;
}
</style>
<style>
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td {
  background-color: #ddd;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ddd;
}
.el-input__inner {
  line-height: 30px;
}
.indexSetting .el-radio__label {
  color: #333;
  font-size: 18px;
}
</style>


