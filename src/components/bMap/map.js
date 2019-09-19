export default {
  init: function() {
    const AK = 'BGriFuSUCrB40mCUiWe82qbunXLTM75p'
    const BMapURL =
      'https://api.map.baidu.com/api?v=3.0&ak=' +
      AK +
      '&callback=onBMapCallback'
    return new Promise((resolve, reject) => {
      // 如果已加载直接返回
      // if (typeof BMap !== 'undefined') {
      //   resolve(BMap)
      //   return true
      // }
      // 百度地图异步加载回调处理
      window.onBMapCallback = function() {
        console.log('百度地图脚本初始化成功...')
        // eslint-disable-next-line
        resolve(BMap)
        // 引入弹框
        require('./InfoBox')
      }
      // 插入script脚本
      let scriptNode = document.createElement('script')
      scriptNode.setAttribute('type', 'text/javascript')
      scriptNode.setAttribute('src', BMapURL)
      document.body.appendChild(scriptNode)
    })
  }
}
