<template>
  <!--17下拉快捷搜索框-->
  <div @click.stop="0"
       class="vue-dropdown default-theme"
       v-show-extend="show">
    <div class="search-module clearfix"
         v-show="itemlists">
      <input class="search-text"
             v-model="searchValue"
             @keyup='search($event)'
             :placeholder="placeholder" />
      <span class="search-icon"><img src="../../assets/icon/search.svg"
             alt=""></span>
    </div>
    <ul class="list-module"
        v-show="inputFocus">
      <li class="flexPublic word-hidden"
          v-for="(item,index) in datalist"
          @click.stop="appClick(item)"
          :title="item.KCode+' '+item.KName"
          :key="index">
        <span class="list-item-text">{{item.KCode}} &nbsp;{{item.KName}}</span>
      </li>
    </ul>
    <div class="tip__nodata"
         v-show="false">
      <router-link to="/setting/subject">{{nodatatext}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {

    this.itemlist = this.itemlists;
  },
  data () {
    return {
      id: '',
      datalist: [],
      searchValue: '',
      inputFocus: true,
      itemlist: []
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
    },
    itemlists (val) {
      this.itemlist = this.itemlists;
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

    appClick: function (data) {
      this.searchValue = data;

      this.$emit('subadd-click', { data: this.searchValue });
      this.datalist = [];
    },
    search: function (e) {
      let vm = this, searchvalue = e.currentTarget.value;
      if (!searchvalue) {
        vm.datalist = vm.itemlist.concat();
      } else {
        var reg = new RegExp('^' + searchvalue);
        vm.datalist = vm.itemlist.filter(function (item, index, arr) {
          return reg.test(item.KCode) || item.KName.indexOf(searchvalue) != -1;
        });
      }
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
.vue-dropdown.default-theme {
  position: absolute;
  display: none;
  top: 0;
  left: 0;
  width: 100%;
  height: auto !important;
  margin: 0 auto;
  z-index: 99;
  background: #fff;
  box-shadow: 0px 0px 10px #ccc;
  &._self-show {
    display: block !important;
  }

  .search-module {
    position: relative;
    height: 45px;
    line-height: 45px;
    .search-text {
      width: 100%;
      height: 45px;
      line-height: 45px;
      color: #999;
      padding-right: 2em;
      padding-left: 0.5em;
      border: 1px solid transparent;
      border-bottom-color: #ddd;
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

  .list-module {
    max-height: 200px;
    overflow-y: auto;
    background: #fff;
    position: relative;
    z-index: 10;
    border: 1px solid #ccc;
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
  background: #ddd;
  height: 30px;
  line-height: 30px;
}
.vue-dropdown.default-theme .search-module {
  height: 30px;
  line-height: 100%;
}
.vue-dropdown.default-theme .search-module .search-text {
  height: 100%;
  line-height: 100%;
}
</style>
