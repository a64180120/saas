<template>
  <div class="batchAuxi">
    <div v-if="auxiChooseList">
      <div>
        <div style="float:right;"
             class="flexPublic">
          <div class="searcherValue"><input @keyup.enter="auxiSearch"
                   v-model="auxiSearchValue"
                   type="text"
                   placeholder="辅助类型编码/名称"></div>
          <div @click="auxiSearch"
               style="border-radius: 0 4px 4px 0;width:70px"
               class="searcherBtn btn">搜索</div>
        </div>
        <div class="auxiTypeCon">
          <ul>
            <li class="overText"
                :title="item.BaseName"
                @click="clickAuxiType(item)"
                :class="{active:checkedAuxi.BaseCode==item.BaseCode}"
                v-for="item of AuxiliaryTypes">{{item.BaseName}}</li>
          </ul>
          <i @click.stop="arrowTo(false)"
             :style="{color:arrowCss[0]?'#00b7ee':'#ccc'}"
             class="el-icon-d-arrow-left"></i>
          <i @click.stop="arrowTo(true)"
             :style="{color:arrowCss[1]?'#00b7ee':'#ccc'}"
             class="el-icon-d-arrow-right"></i>
        </div>

      </div>
      <div>
        <section class="listContainer listFont">
          <ul class="listTitle">
            <li>
              <el-checkbox :indeterminate="indeterminate"
                           @change="allChoose"
                           v-model="allList">序号</el-checkbox>
            </li>
            <li>编码</li>
            <li>名称</li>

          </ul>

          <div class="listOver">
            <div v-show="checkedAuxi.Children.length<1">暂无辅助项值</div>
            <ul class="listTitle listContent"
                v-for="(item,index) of checkedAuxi.Children"
                :key="index">
              <li @change="rowChoose">
                <el-checkbox v-model="item.checked">{{index+1}}</el-checkbox>
              </li>
              <li style="text-align:center;"
                  :title="item.BaseCode">{{item.BaseCode}}</li>
              <li>
                <el-tooltip v-if="item.BaseName.length > 7"
                            :content="item.BaseName"
                            placement="bottom-end">
                  <span>{{item.BaseName}}</span>
                </el-tooltip>
                <span v-else>{{item.BaseName}} </span>
              </li>

            </ul>
          </div>

        </section>
      </div>
    </div>

    <div v-else>
      <div class="auxiGroup">
        <section>
          <div class="tablelist">
            <el-table :data="auxiGroupList.AddListShow"
                      align="left"
                      border
                      :show-overflow-tooltip="true"
                      row-class-name="tableRow"
                      height="100%"
                      style="width: 100%">
              <el-table-column type="index"
                               sortable
                               header-align="center"
                               sort-by="index"
                               label="序号"
                               width="70">
              </el-table-column>
              <el-table-column header-align="center"
                               label="辅助核算类型组合方式">
                <el-table-column v-for="(item,i) of AuxiliaryTypes"
                                 :key="i"
                                 header-align="center"
                                 :prop="'NameList['+i.toString()+']'"
                                 :label="item.BaseName"
                                 min-width="60">
                </el-table-column>
              </el-table-column>
              <el-table-column label="操作"
                               class-name="icon"
                               align="center"
                               header-align="center"
                               width="70">
                <template slot-scope="scope">
                  <div>
                    <i @click="deleteRow(scope.$index, scope.row)"
                       class="el-icon-close"
                       style="font-size:30px;color:red;cursor:pointer"></i>
                  </div>

                </template>
              </el-table-column>
            </el-table>
          </div>

        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'batchAuxi',
  props: {
    subject: Object,
    Auxiliarys: Array
  },
  data () {
    return {
      auxiChooseList: true,
      allList: false,//列表全选状态
      indeterminate: false,//全选按钮样式
      auxiSearchValue: '',
      dataList: [{ KCode: 11, KName: 'ces1' }, { KCode: 22, KName: 'ces2' }, { KCode: 133, KName: 'ces3' }],
      arrowCss: [false, false],
      JSON_AuxiliaryTypes: [],//拷贝值
      AuxiliaryTypes: [],//父组件传值
      checkedAuxi: { Children: [] },//选中的辅助项类型
      auxiGroupList: {},//排列组合列表
    }
  },
  inject: ['year'],
  mounted () {
    this.Auxiliarys.map(types => {
      types.Children.map(auxi => {
        this.$set(auxi, 'checked', false)
      })
    })
    this.JSON_AuxiliaryTypes = JSON.stringify(this.Auxiliarys);
    this.AuxiliaryTypes = JSON.parse(this.JSON_AuxiliaryTypes);
    if (this.AuxiliaryTypes.length > 5) {
      this.$set(this.arrowCss, 0, true);
    }
    this.checkedAuxi = this.AuxiliaryTypes[0];
  },

  methods: {
    //搜索按钮
    auxiSearch () {
      let checkArr = []
      JSON.parse(this.JSON_AuxiliaryTypes).map(item => {
        if (this.checkedAuxi.BaseCode === item.BaseCode) {
          checkArr = item  //创建新的列表
          this.checkedAuxi.Children.map(auxi => {
            if (auxi.checked) {
              checkArr.Children.map(che => { //把当前选中的值的checked修改进新列表
                if (auxi.BaseCode == che.BaseCode) {
                  this.$set(che, 'checked', true)

                }
              })
            }
          })
        }
      })

      if (!this.auxiSearchValue.trim()) { //搜索值为空  
        this.$set(this.checkedAuxi, 'Children', checkArr.Children)
        this.rowChoose();
        return;
      } else {
        let newArr = []
        newArr = checkArr.Children.filter(item => {
          return item.BaseCode.indexOf(this.auxiSearchValue) != -1 || item.BaseName.indexOf(this.auxiSearchValue) != -1
        })
        this.$set(this.checkedAuxi, 'Children', newArr)
        this.rowChoose();
      }

    },
    //选择辅助项类型
    clickAuxiType (item) {
      this.checkedAuxi = item;
      this.rowChoose();
    },
    //排列组合的辅助项删除行
    deleteRow (index, item) {
      this.auxiGroupList.AddListShow.splice(index, 1);

    },
    //获取辅助项类型下的值列表
    getData () {
      let AuxSubjectCommon = {
        FYear: this.year,    //2019年
        OrgId: this.$store.state.user.orgid,   //组织Id
        OrgCode: this.$store.state.user.orgcode,   //组织编码
        SubPhid: this.subject.PhId,   //科目Id
        SubCode: this.subject.KCode,  //科目编码
        KBalanceType: this.subject.KBalanceType  //余额方向
      }
      let AddList = []
      let sum = ''
      this.AuxiliaryTypes.map(types => {
        let count = 0;
        types.Children.map(auxi => {
          if (auxi.checked) {
            count++
            AddList.push({
              SNumber: auxi.GLS,
              Value: auxi.PhId
            })
          }
        })
        if (count == '0') {
          sum = sum + types.BaseName + ','
        }
      })
      if (sum) {
        this.$msgBox.show({ content: '每种辅助项类型至少选择一行,请查看以下辅助项类型:' + sum.replace(/\,$/g, ''), timeout: 5 })
        return;
      } else {
        this.auxiChooseList = false
      }
      let data = {
        AuxSubjectCommon: AuxSubjectCommon,
        AddList: AddList
      }
      const loading1 = this.$loading();
      this.$axios.post("/AuxSubject/PostGetLinkAuxSubject", data)
        .then(res => {
          loading1.close();
          if (res.Status == 'error') {
            this.$msgBox.error(res.Msg)
          } else {
            this.auxiGroupList = res;
          }
        })
        .catch(err => { this.$message({ showClose: true, message: '获取辅助项失败了!', type: "error" }); loading1.close(); })

    },

    //左右箭头
    arrowTo (bool) {
      if (this.AuxiliaryTypes.length <= 5) {
        return;
      }
      let ul = document.querySelector('.auxiTypeCon>ul');
      if (!ul.style.marginLeft) {
        ul.style.marginLeft = '0px';

      }
      if (bool) {
        if (parseFloat(ul.style.marginLeft) > -50) {
          ul.style.marginLeft = '0px';
          this.$set(this.arrowCss, 1, false);

        } else {
          ul.style.marginLeft = parseFloat(ul.style.marginLeft) + 100 + 'px';
          this.$set(this.arrowCss, 0, true);
        }
      } else {

        if (500 - this.AuxiliaryTypes.length * 100 > parseFloat(ul.style.marginLeft) + 100 || 500 - this.subject.AuxiliaryTypes.length * 100 == parseFloat(ul.style.marginLeft)) {
          ul.style.marginLeft = 500 - this.AuxiliaryTypes.length * 100 + 'px'
          this.$set(this.arrowCss, 0, false);

        } else {
          ul.style.marginLeft = parseFloat(ul.style.marginLeft) - 100 + 'px'
          this.$set(this.arrowCss, 1, true);
        }


      }
    },
    allChoose (val) {
      this.indeterminate = false;
      this.checkedAuxi.Children.map(data => {
        this.$set(data, 'checked', val)
      })

    },
    rowChoose () {
      let count = 0;
      this.checkedAuxi.Children.map(data => {
        if (data.checked) {
          count++;
        }
      })
      if (count == 0) {
        this.allList = false;
        this.indeterminate = false;
      } else if (count == this.checkedAuxi.Children.length) {
        this.allList = true;
        this.indeterminate = false;
      } else {
        this.indeterminate = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.batchAuxi {
  height: 300px;
  .auxiTypeCon {
    width: 560px;
    height: 30px;
    text-align: left;
    overflow: hidden;
    position: relative;
    padding: 0 30px;
    > ul {
      transition: all 0.2s linear;
      overflow: hidden;
      height: 30px;
      line-height: 30px;
      > li {
        text-align: center;
        display: inline-block;
        height: 100%;
        line-height: 30px;
        width: 100px;
        cursor: pointer;
        &.active {
          background: #00b7ee;
          color: #fff;
        }
      }
    }
    > i {
      position: absolute;
      width: 30px;
      height: 100%;
      background: #fff;
      top: 0;
      padding-top: 3px;
      cursor: pointer;
      font-size: 25px;
      color: #00b7ee;

      &:first-of-type {
        left: 0;
      }
      &:last-of-type {
        right: 0;
      }
    }
  }
  .searcherValue {
    height: 32px;
    line-height: 32px;
  }
  .searcherBtn {
    height: 32px;
    line-height: 32px;
  }
  .listContainer {
    min-width: 810px;
    height: 90%;
    margin-top: 10px;
    position: relative;
    padding-top: 40px;
    padding-bottom: 20px;
    .listOver {
      max-height: 240px;
      overflow-y: scroll;
      ul > li:nth-of-type(6) {
        padding-right: 3px;
        > div {
          text-align: right;
          padding: 0;
        }
      }
    }
  }
  .listContainer > ul.listTitle:first-of-type {
    // width:100%;
    background: #d3e8f9;
    color: #333;
    position: absolute;
    top: 0;
    right: 17px;
    left: 0;
    // margin-right:5px;
    // overflow-y: scroll;
    > li {
      border: 1px solid #bcbdbd;
      border-left: 0;
      &:first-of-type {
        border-left: 1px solid #bcbdbd;
      }
    }
  }
  .listContainer ul.listTitle {
    height: auto;
    background: #fff;
    color: #333;
    // &:first-of-type{
    //     >li{
    //         background: #d3e9f9 ;
    //     }
    // }
    > li > div {
      height: 100%;
      width: 100%;
      position: relative;
    }
  }
  .listContainer ul.listTitle > li {
    float: left;
    text-align: center;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    position: relative;
  }
  .listContainer ul.listTitle > li:first-of-type {
    width: 15%;
    text-align: center;
    padding-left: 0;
    > label {
      text-align: left;
      display: inline-block;
      width: 60px;
    }
  }
  .listContainer ul.listTitle > li:nth-of-type(2) {
    width: 25%;
  }
  .listContainer ul.listTitle > li:nth-of-type(3) {
    text-align: center;
    width: 60%;
  }
  .listContainer ul.listContent {
    background: #fff;
    &.clickActive > li {
      background: #aaa;
      &.child {
        background: #fff;
      }
    }
    li {
      padding: 0 0 0 5px;
    }
    > li {
      border: 1px solid #bcbdbd;
      border-width: 0 1px 1px 0;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 0 0 5px;

      &:first-of-type {
        border-left: 1px solid #bcbdbd;
      }
      .inputContainer > input {
        border: 0;
      }
      .assistCss {
        display: inline-block;
        width: auto;
        margin-right: 5px;

        > img {
          height: 70%;
          vertical-align: middle;
          position: relative;
          top: -2px;
        }
      }
    }
  }
  .auxiGroup {
    width: 100%;
    height: 100%;
    overflow: auto;
    .listContainer {
      min-width: 810px;
      height: 90%;
      margin-top: 10px;

      position: relative;
      padding-top: 40px;
      padding-bottom: 20px;
      .listOver {
        height: 100%;
        overflow-y: scroll;
        ul > li:nth-of-type(6) {
          padding-right: 3px;
          > div {
            text-align: right;
            padding: 0;
          }
        }
      }
    }
    .listContainer > ul.listTitle:first-of-type {
      // width:100%;

      color: #333;
      position: absolute;
      top: 0;
      right: 17px;
      left: 0;
      // margin-right:5px;
      // overflow-y: scroll;
      > li {
        background: #d3e8f9;
        border: 1px solid #bcbdbd;
        border-left: 0;
        &:first-of-type {
          border-left: 1px solid #bcbdbd;
        }
      }
    }
    .listContainer ul.listTitle {
      height: auto;
      background: #fff;
      color: #333;
      // &:first-of-type{
      //     >li{
      //         background: #d3e9f9 ;
      //     }
      // }
      > li > div {
        height: 100%;
        width: 100%;
        position: relative;
      }
    }
    .listContainer ul.listTitle > li {
      float: left;
      text-align: center;
      width: 160px;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      position: relative;
    }
    .listContainer ul.listTitle > li:last-of-type,
    .listContainer ul.listTitle > li:first-of-type {
      width: 60px;
      text-align: center;
      padding-left: 0;
      > label {
        text-align: left;
        display: inline-block;
        width: 60px;
      }
    }

    .listContainer ul.listContent {
      background: #fff;
      overflow: hidden;
      &.clickActive > li {
        background: #aaa;
        &.child {
          background: #fff;
        }
      }
      li {
        padding: 0 0 0 5px;
      }
      > li {
        border: 1px solid #bcbdbd;
        border-width: 0 1px 1px 0;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 0 0 5px;

        &:first-of-type {
          border-left: 1px solid #bcbdbd;
        }
        .inputContainer > input {
          border: 0;
        }
        .assistCss {
          display: inline-block;
          width: auto;
          margin-right: 5px;

          > img {
            height: 70%;
            vertical-align: middle;
            position: relative;
            top: -2px;
          }
        }
      }
    }
  }
  .tablelist {
    height: 300px;
  }
}
</style>
<style>
.batchAuxi .icon {
  padding: 0;
}
</style>
