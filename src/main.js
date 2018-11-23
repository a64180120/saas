// 生产环境中注释掉以下语句
import 'sysStatic/css/theme-default.scss'
import '../mock/index.js'


import Vue from "vue"
import ElementUI from 'element-ui'
import '../static/css/icon.css';
import router from './router'
import store from './store'
import axios from './util/ajax'
import i18n from './util/i18n'
import App from './index'
import 'babel-polyfill'
import './components/install'
import './plugins/install'

import '@/assets/css/myStyle.css'//自定义样式*************************
import '@/assets/css/font_li.css'  //阿里的图标样式

import ajax from './assets/js/ajaxMode' //自定义ajax头部配置*****
let Base64 = require('js-base64').Base64
Vue.prototype.$ajax=ajax
// 注册组件到Vue
Vue.prototype.$axios = axios


//完整引入element-ui 和 i18n语言
Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})

new Vue({
    i18n,
    axios,
    router,
    store,
    render: h => h(App)
}).$mount('#app')