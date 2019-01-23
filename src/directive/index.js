import Vue from 'vue'

import hljs from 'highlight.js' // 引入JS
import 'highlight.js/styles/atom-one-dark.css' //样式文件

/**
 * 高亮
 */
Vue.directive('highlight',function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block)=>{
        hljs.highlightBlock(block)
    })
})