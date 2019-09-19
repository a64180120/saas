<template>
  <!-- echart表格 -->
  <div id="piechart"
       class="chart-area"></div>
</template>

<script>
import echarts from 'echarts'
import '@/util/echarts.theme.default'

export default {
  data () {
    return {
      delay: false,//定时器延迟
      currentIndex: -1,//开始循环参数
      chart: '',//定时器
      chart2: {
        target: null,
        option: {
          title: {
            text: this.titleText, // 标题文本
            left: 'left'
          },
          tooltip: {
            // position:['50%','50%'],
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            y: 'middle',
            data: this.opinion,
            icon: "circle",
            textStyle: {
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          color: ['#938d84', '#8dce9b', '#bddac5', '#a5a094', '#bebdb2', '#e0ded1', '#7fb88c'],
          series: [
            {
              name: this.titleText,
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              center: ['35%', '50%'],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.opinionData
            }
          ]
        }
      }
    }
  },
  props: {
    // 标题文本
    titleText: {
      type: String,
      default: ''
    },
    // 扇形区域名称
    opinion: {
      type: Array,
      default () {
        return []
      }
    },
    // 扇形区域数据
    opinionData: {
      type: Array,
      default () {
        return []
      }
    },
  },
  watch: {
    opinionData () {
      if (this.opinionData.length) {
        this.draw()
        var vm = this;
        if (!this.chart) {
          this.chart = setInterval(vm.infinite, 1200);
        }
      }
    }
  },
  mounted () {

    this.$nextTick(() => {
      this.chartsInit()

    })

  },
  // activated(){
  //     console.log(22)
  //     this.$nextTick(() => {
  //         this.chartsInit()
  //
  //     })
  // },
  // deactivated(){
  //     console.log(333)
  //     var vm =this;
  //     window.removeEventListener("resize", () => { vm.chart2.target.resize();});
  // },
  // destroyed(){
  //     console.log(444)
  //     var vm =this;
  //     window.removeEventListener("resize", () => { vm.chart2.target.resize();});
  // },
  methods: {
    // 初始化图表
    chartsInit () {
      var vm = this;
      // 创建图表对象
      if (!this.chart2.target) {
        this.chart2.target = echarts.init(document.getElementById('piechart'), 'westeros')
      }
      // 绘制默认图表
      this.chart2.target.setOption(this.chart2.option);
      //自适应窗口  // 跳出打印窗口会有问题
      window.addEventListener("resize", () => { vm.chart2.target.resize(); });
      this.chart2.target.on('mouseover', function (params) {

        // 取消之前高亮的图形
        vm.chart2.target.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: vm.currentIndex
        });
        clearInterval(vm.chart);
        vm.delay = true;
        vm.chart = null;

        // 高亮当前图形
        vm.chart2.target.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: params.dataIndex
        });

      })
      this.chart2.target.on('mouseout', function (params) {
        vm.delay = false;
        vm.currentIndex = params.dataIndex;
        setTimeout(vm.delayInfinite, 1500)
      })

    },

    //停止循环
    stopInfinite () {
      var vm = this;
      clearInterval(vm.chart);
      vm.delay = true;
      vm.chart = null;
      // 取消之前高亮的图形
      vm.chart2.target.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: vm.currentIndex
      });
      // 控制悬浮的tooltip显示
      vm.chart2.target.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0,
        dataIndex: vm.currentIndex
      });
    },
    //延时触发循环
    delayInfinite () {
      var vm = this;
      if (!vm.delay && !vm.chart) {
        vm.chart = setInterval(vm.infinite, 1200);
      }
    },
    //高亮状态循环
    infinite () {
      var vm = this;
      var dataLen = vm.chart2.option.series[0].data.length;
      // 取消之前高亮的图形
      vm.chart2.target.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: vm.currentIndex
      });
      vm.currentIndex = (vm.currentIndex + 1) % dataLen;
      // 高亮当前图形
      vm.chart2.target.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: vm.currentIndex
      });
      // 显示 tooltip
      vm.chart2.target.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: vm.currentIndex
      });
    },
    // 重绘
    draw () {
      // 配置项需要变更
      let option = {
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'middle',
          data: this.opinion,
          icon: "circle",
        },
        series: [
          {
            name: this.titleText,
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['35%', '50%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.opinionData
          }
        ]
      }
      this.chart2.target.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-area {
  width: 100%;
  height: 300px;
}
</style>
