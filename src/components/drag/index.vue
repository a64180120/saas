<template>
  <div class="board-column">
    <div class="board-column-header">
      {{headerText}}
    </div>
    <draggable
      class="board-column-content"
      :list="list"
      :options="options">
      <div class="board-item" v-for="element in list" :key="element.id">
        <span>{{element.PType+'-'+element.PNo}}</span>
        <span> {{element.Dtls[0].Abstract}}</span>
        <span> {{element.Dtls[0].SubjectCode}}</span>
        <span> {{element.Dtls[0].SubjectName}}</span>
        <!-- <span>{{element.PDate.slice(0,10)}}</span> -->
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'dragKanban-demo',
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods:{
	  keep(){
		  console.log(this.list)
	  }
  }
}
</script>
<style lang="scss">
.board-column {
  min-width: 300px;
  min-height: 100px;
  height: 100%;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
  position:relative;
  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #00b7ee;
    color: #fff;
    border-radius: 3px 3px 0 0;
    position:absolute;
    top:0;
    left:0;
    width:100%;
  }
  .board-column-content {
    margin-top:50px;
    height: 95%;
    overflow-y:auto;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    .board-item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.2);
      >span{
        margin-right: 20px;
      }
    }
  }
}
</style>