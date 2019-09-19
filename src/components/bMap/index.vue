<template>
  <div id="bmap">
    <div id="allmap"></div>
    <div class="select">
      <el-select :disabled="moveAble" @change="move" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="search">
      <el-input placeholder="请输入基层工会Phid" v-model="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="icons">
      <span class="title">行业类型</span>
      <ul>
        <li v-for="item in icons">
          <span>
            <img :src="item.icon" :alt="item.name" />
            {{item.name}}
          </span>
          <span>{{item.count}}</span>
          <span style="float:right;line-height:21px">{{item.per}}</span>
        </li>
      </ul>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" append-to-body>
      <span>{{phid}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */

import BaiduMap from './map.js'
import icon1 from './1.png'
import icon2 from './2.png'
import cha from './cha.svg'
export default {
  name: 'bmap',
  data() {
    return {
      BMap: null, //百度地图实例
      map: null, //当前地图实例
      dialogVisible: false,
      phid: '',
      options: [
        {
          value: '001',
          label: '杭州市',
          position: [120.165205, 30.197661]
        },
        {
          value: '002',
          label: '温州市',
          position: [121.047117, 28.319976]
        },
        {
          value: '003',
          label: '宁波市',
          position: [121.435858, 29.293561]
        }
      ],
      value: '001',
      moveAble: true, //地图实例map加载成功前禁止改变！
      search: '',
      points: [
        {
          position: [120.165205, 30.197661],
          type: 1,
          phid: 0,
          name: '杭州总共工会'
        },
        {
          position: [120.164205, 30.196661],
          type: 2,
          phid: 1,
          name: '杭州1工会'
        },
        {
          position: [120.163205, 30.196661],
          type: 1,
          phid: 9999,
          name: '杭州2工会'
        },
        {
          position: [121.047117, 28.319976],
          type: 1,
          phid: 6666,
          name: '温州总共工会'
        }
      ],
      icons: [
        {
          name: '医疗卫生',
          icon: icon1,
          per: '50%',
          count: 212
        },
        {
          name: '教育',
          icon: icon2,
          per: '50%',
          count: 212
        }
      ]
    }
  },
  mounted() {
    var vm = this
    BaiduMap.init().then(BMap => {
      console.log(BMap)
      vm.BMap = BMap
      let detailInfoBox = null //用于控制infoBox数量，只允许同时显示一个，保存当前infoBox实例
      function showDetail(marker, item) {
        // 如果已打开，则关闭其他
        if (detailInfoBox) {
          if (item.phid != detailInfoBox._opts.phid) {
            detailInfoBox.close()
          } else {
            return
          }
        }
        // 点击覆盖物弹出的消息框
        detailInfoBox = new BMapLib.InfoBox(map, detailHtml(item), {
          //  offset: {Size} infoBox的偏移量
          //  boxClass : {String} 定义infoBox的class,
          //  boxStyle: {Json} 定义infoBox的style,此项会覆盖boxClass
          //  closeIconClass:{String} 定义关闭图片的class，默认infoBox-close
          //  closeIconMargin : {String} 关闭按钮的margin
          //  closeIconUrl: {String} 关闭按钮的url地址
          //  enableAutoPan : {Boolean} 是否启动自动平移功能
          //  align: {Number} 基于哪个位置进行定位，取值为[INFOBOX_AT_TOP,INFOBOX_AT_BOTTOM]
          boxStyle: {
            background: 'white',
            width: '100px',
            height: '100px'
          },
          enableAutoPan: true,
          enableCloseOnClick: false,
          clickOnBox: vm.test.bind(vm, item),
          phid: item.phid //传入phid，用于判断是否点击同一个弹框
        })
        detailInfoBox.open(marker)
        detailInfoBox.addEventListener('close', function() {
          detailInfoBox = null
        })
      }
      // 拼接html
      function detailHtml(item) {
        return `<div>${item.phid + item.name}</div>`
      }
      var map = new BMap.Map('allmap') // 创建Map实例
      // 设置个性化地图，地址只能使用point新建
      map.centerAndZoom(new BMap.Point(120.165205, 30.197661), 15)
      // map.addEventListener('click', function(e) {
      //   console.log('123123')
      // })
      vm.map = map
      vm.moveAble = false
      // 设置个性化地图
      map.setMapStyleV2({
        styleId: '2a667f2926bf1a9646785d6477663828'
      })
      // 新增图标，size要和图片大小一致px！
      var iconSize = new BMap.Size(16, 16)
      var mapIcons = vm.icons.map(item => new BMap.Icon(item.icon, iconSize))
      // 创建标注
      vm.points.forEach(item => {
        let pt = new BMap.Point(item.position[0], item.position[1])
        let marker = new BMap.Marker(pt, { icon: mapIcons[item.type - 1] })
        map.addOverlay(marker)
        marker.addEventListener('click', showDetail.bind(this, marker, item))
      })
      map.enableScrollWheelZoom() //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom() //启用地图惯性拖拽，默认禁用
    })
  },
  methods: {
    move(value) {
      console.log(value)
      if (!this.map) {
        return
      }
      let position = this.options.find(item => item.value == value).position
      // 位移，并重置缩放倍数
      this.map.panTo(new this.BMap.Point(position[0], position[1]))
      this.map.setZoom(15)
    },
    test(item) {
      this.phid = item.phid
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
#bmap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
#allmap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  font-family: '微软雅黑';
}

.infobox-close {
  width: 20px;
  height: 20px;
}
</style>
<style>
ul,
li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
#bmap .select {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
#bmap .search {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
}
#bmap .icons {
  display: inline-block;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #000;
  text-align: left;
}
#bmap .icons .title {
  color: #fff;
  position: absolute;
  transform: translateY(-100%);
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
}
#bmap .icons ul li span:first-of-type {
  min-width: 100px;
  display: inline-block;
}
.infoBox-close {
  display: none;
}
#bmap .anchorBL {
  display: none;
}
</style>

