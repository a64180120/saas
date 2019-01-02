<template>
  <el-table 
  ref="treetable"
  :data="formatData" 
  :row-style="showRow"
  :height="tableHeight"
  v-bind="$attrs" 
  @row-click="handleClickRow"
  @current-change="handleCurrentChange">
    <el-table-column v-if="isindex" type="index" label="序号" width="64" align="center"></el-table-column>
    <el-table-column v-if="columns.length===0" width="64" label="序号">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width":align="column.align">
      <template slot-scope="scope">
        <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.row[column.value]}}
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
export default {
  name: 'treeTable',
  data() {
    return {
      tableHeight:0
    }
  },
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    isindex:{
      type: Boolean,
      default: true
    },
    extraheight:{
      type: Number,
      default: function () {
          return 10
      }
    },
    rowClicks: {
      type: Function,
      default: function(){
          return null
      }
    }
  },
  created(){
    //document.documentElement.clientHeight:浏览器的body可用高度
    //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    //后面的50：根据需求空出的高度，自行调整
    //this.tableHeight=680
    console.log("document.documentElement.clientHeight:"+document.documentElement.clientHeight);
    console.log("window.innerHeight:"+window.innerHeight);
    this.tableHeight = document.documentElement.clientHeight - this.extraheight;
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  mounted(){},
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    handleClickRow(row, event, Column){
        //console.log(row);

        if (!Column || Column.type === 'selection' || Column.columnKey === 'operation' || Column.type === 'expand') {
          return
        }
        // const data = {
        //   row: row,
        //   event: event,
        //   column: Column
        // };
        this.$emit('onRowClick', row, event, Column)
    },
    handleCurrentChange(currentRow, oldCurrentRow){

        // const data = {
        //   currentRow: currentRow,
        //   oldCurrentRow: oldCurrentRow
        // };

      this.$emit('onCurrentChange', currentRow, oldCurrentRow)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
