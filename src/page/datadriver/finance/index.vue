<template>
  <div class="datafinance">
    <div class="datafinancetop">
      <div class="datafinancetopmap">
        <bmap></bmap>
      </div>
    </div>
  </div>
</template>

<script>
// import bmap from '@/components/bMap'

export default {
  name: 'datafinance',
  components: { bmap }
}
</script>

<style lang="scss" scoped>
.datafinance {
  padding: 15px;
  .datafinancetop {
    width: 100%;
    height: 300px;
    .datafinancetopmap {
      width: 49%;
      height: 100%;
      position: relative;
    }
  }
}
</style>
