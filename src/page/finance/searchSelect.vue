<template>
  <!--17-->
  <div @click.stop="0"
       class="vueDropdown defaultTheme"
       v-show-extend="show">
    <div class="search-module clearfix"
         v-show="itemlists.kemu.length">
      <input class="search-text"
             v-model="searchValue"
             @keydown.down.prevent="selectDown(true)"
             @keydown.up.prevent="selectDown(false)"
             @keyup='search($event)'
             @keydown.13.prevent="selectFinish"
             :placeholder="placeholder" />
      <span class="search-icon"><img src="../../assets/icon/search.svg"
             alt=""></span>
    </div>
    <ul class="list-module"
        v-show="inputFocus">
      <li class="flexPublic word-hidden"
          :title="item.KCode+' '+item.KName"
          v-for="(item,index) in datalist"
          :class="{keyActive:index==indSel}"
          @click.stop="appClick(item)"
          :key="index">
        <span class="list-item-text">{{item.KCode}} &nbsp;{{item.KName}}</span>
      </li>
    </ul>
    <div @click.stop="addSubject"
         class="tip__nodata"
         v-show="inputFocus">{{nodatatext}}</div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.itemlist = this.itemlists.kemu;
    this.id = this.itemlists.id;
    this.$nextTick(this.inputAutoFocus);
  },
  data () {
    return {
      id: '',
      datalist: [],
      searchValue: '',
      inputFocus: true,
      itemlist: [],
      indSel: 0,
    }
  },
  props: {
    'show': {//用于外部控制组件的显示/隐藏
      type: Boolean,
      default: true
    },
    'itemlists': {},
    'placeholder': String,
    'nodatatext': String
  },
  watch: {
    itemlist: function (val) {
      this.datalist = val.concat();
    }

  },
  directives: {
    'show-extend': function (el, binding, vnode) {//bind和 update钩子
      let value = binding.value, searchInput = null;
      if (value) {
        el.style.display = 'block';
      } else {//隐藏后，恢复初始状态
        el.style.display = 'none';
        searchInput = el.querySelector(".search-text");
        searchInput.value = '';
        vnode.context.datalist = vnode.context.itemlist;//还原渲染数据
      }
    }
  },
  methods: {
    addSubject () {
      this.$emit('add-subject');
    },
    appClick: function (data) {
      this.searchValue = data;
      this.$emit('item-click', { data: data, id: this.id });
      this.searchValue = '';
      this.datalist = [];
    },
    search: function (e) {
      if (e.key == "ArrowDown" || e.key == "ArrowUp" || e.key == "Enter" || e.key == "Tab") {
        return;
      }
      let vm = this, searchvalue = e.currentTarget.value;
      var ul = document.getElementsByClassName('list-module')[0];
      if (!searchvalue) {
        //vm.datalist=[];
        vm.datalist = vm.itemlist.concat();
      } else {
        var reg = new RegExp('^' + searchvalue);
        this.indSel = 0;
        ul.scrollTop = 0;
        vm.datalist = vm.itemlist.filter(function (item, index, arr) {
          return reg.test(item.KCode) || item.KName.indexOf(searchvalue) != -1;
        });
      }
    },
    inputAutoFocus () {
      var inp = document.getElementsByClassName('search-text')[0];
      inp.focus();
    },
    //上下选择
    selectDown (bool) {
      var ul = document.getElementsByClassName('list-module')[0];
      if (bool) {
        if (this.indSel < this.datalist.length - 1)
          this.indSel++;
        console.log(ul.children[this.indSel].offsetTop, (ul.clientHeight + ul.scrollTop))
        if (ul.children[this.indSel].offsetTop >= (ul.clientHeight + ul.scrollTop - 1)) {
          ul.scrollTop = ul.scrollTop + 150;
        }
      } else {
        if (this.indSel > 0)
          this.indSel--;
        console.log(ul.children[this.indSel].offsetTop, ul.scrollTop)
        if (ul.children[this.indSel].offsetTop < ul.scrollTop - 1) {  //-1px好像是边框
          ul.scrollTop = ul.scrollTop - 150;
        }
      }
    },
    //选择完成
    selectFinish () {
      var vm = this;
      this.appClick(vm.datalist[vm.indSel]);
    }
  },
  computed: {
    length: function () {
      return this.datalist.length;
    }
  }

}
  //dropdown :itemlist="itemlist" :placeholder="placeholder"
  //:nodatatext="nodatatext"></dropdown>
</script>

<style lang="scss" scoped>
.vueDropdown.defaultTheme {
  position: absolute;
  left: 0;
  top: 55px;
  z-index: 99;
  display: none;
  width: 100%;
  height: auto !important;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0px 0px 10px #ccc;
  &._self-show {
    display: block !important;
  }

  .search-module {
    position: relative;
    height: 30px;
    line-height: 30px;
    .search-text {
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: #999;
      padding-right: 2em;
      padding-left: 0.5em;
      border: 1px solid transparent;

      box-shadow: none;
      position: relative;
      z-index: 10;
      &:focus {
        border: #2198f2;
      }
    }

    .search-icon {
      position: absolute;
      top: 5px;
      z-index: 10;
      right: 5px;
      color: #aaa;
      height: 20px;
      img {
        height: 100%;
      }
    }
  }
  .keyActive {
    background: #00a0e9;
    color: #fff;
  }
  .list-module {
    max-height: 150px;
    overflow-y: auto;
    background: #fff;
    position: relative;
    z-index: 10;
    li {
      &._self-hide {
        display: none;
      }
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-top: 1px solid #ddd;
      height: 30px;
      line-height: 30px;
      padding: 5px;
      &:hover {
        cursor: pointer;
        color: #fff;
        background: #00a0e9;
      }
      .list-item-text {
        font-size: 16px;
      }
    }
  }
}
.tip__nodata {
  font-size: 16px;
  border-bottom: 1px solid #999;
  background: #00b7ee;
  color: #fff;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
</style>
