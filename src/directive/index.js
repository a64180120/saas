import Vue from 'vue'

import hljs from 'highlight.js' // 引入JS
import 'highlight.js/styles/atom-one-dark.css' //样式文件

/**
 * 高亮
 */
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

Vue.directive('drag', function (el) {
  let odiv = el;   //获取当前元素
  odiv.onmousedown = (e) => {
    //算出鼠标相对元素的位置
    let disX = e.clientX - odiv.offsetLeft;
    let disY = e.clientY - odiv.offsetTop;
    console.log(disY)
    document.onmousemove = (e) => {
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      let left = e.clientX - disX;
      let top = e.clientY - disY;

      //绑定元素位置到positionX和positionY上面
      // this.positionX = top;
      // this.positionY = left;

      //移动当前元素
      odiv.style.left = left + 'px';
      odiv.style.top = top + 'px';
      console.log(left, top, odiv.style)
    };
    document.onmouseup = (e) => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}
)
