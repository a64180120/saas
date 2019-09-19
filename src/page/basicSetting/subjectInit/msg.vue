<template>
  <div class="auxiMsgCon"
       style="z-index:9">
    <div :style="{height:(showList?dataList.RepeatList.length*40+380:310)+'px'}">
      <p class="title">
        <span>
          辅助核算类型明细组合方式重复核查提示
        </span>
        <i @click="$emit('msgFinish',false)">

        </i>
      </p>
      <div class="auxiMsgContent">
        <div><img src="@/assets/images/message.png"
               alt=""></div>
        <div>
          当前辅助核算类型明细组合方式中,有<span class="redFont">{{dataList.RepeatList.length}}</span>条在数据库中已存在,系统不允许重复录入相同组合方式,请点击下方"点击查看重复的组合方式"核实。点击【继续执行】后,系统将忽略重复组合,继续添加其他组合。
        </div>
        <p>
          <span @click="$emit('msgFinish',false)"
                class="btngrey">取消</span>
          <span @click="$emit('msgFinish',dataList)"
                class="btn">继续执行</span>
        </p>
      </div>
      <div class="dataListCon">
        <p @click="showList=!showList">
          <i class="el-icon-menu"></i>
          <span>点击查看重复的组合方式</span>
          <i :class="{arrowRotate:showList}"
             class="el-icon-arrow-right"></i>
        </p>
        <div :style="{height:(showList?dataList.RepeatList.length*40+40:0)+'px'}">
          <section class="listContainer listFont">
            <ul class="listTitle">
              <li>
                序号
              </li>
              <li>编码</li>
              <li>名称</li>

            </ul>

            <div class="listOver">

              <ul class="listTitle listContent"
                  v-for="(item,index) of dataList.RepeatList">
                <li>
                  {{index+1}}
                </li>
                <li :title="item.Code">{{item.Code}}</li>
                <li>
                  <el-tooltip v-if="item.TypeName.length > 7"
                              :content="item.TypeName"
                              placement="bottom-end">
                    <span>{{item.TypeName}}</span>
                  </el-tooltip>
                  <span v-else>{{item.TypeName}} </span>
                </li>

              </ul>
            </div>

          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'auxiMsgCon',
  props: {
    dataList: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showList: false
    }
  }
  ,
  mounted () {
    console.log(this.dataList)
  }
}
</script>
<style lang="scss" scoped>
.auxiMsgCon {
  position: fixed;
  position: -ms-page;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  > div {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    width: 600px;
    overflow: hidden;
    max-height: 715px;
    // height: 300px;
    transition: all 0.3s linear;
    background: #fff;
    padding: 10px;
    .auxiMsgContent {
      padding: 10px;
      > div {
        float: left;
        height: 130px;
        img {
          width: 100%;
          vertical-align: middle;
        }
        &:first-of-type {
          width: 80px;
          line-height: 150px;
        }
        &:last-of-type {
          width: 470px;
          overflow: auto;
          white-space: normal;
          line-height: 1;
          margin: 20px 0 10px;
        }
      }
      > p {
        clear: both;
        text-align: right;
        > span {
          margin-right: 20px;
        }
      }
    }
  }
  &:after {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
  }
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
  .redFont {
    color: red;
  }
  .dataListCon {
    > p {
      color: #777;
      cursor: pointer;
      padding: 0 10px;
      > i:last-of-type {
        margin-top: 10px;
        float: right;
        transition: all 0.3s linear;
      }
    }
  }
}
.listContainer {
  margin-top: 15px;
  position: relative;
  padding-top: 40px;
  .listOver {
    max-height: 320px;
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
.arrowRotate {
  transform: rotate(90deg);
}
</style>
