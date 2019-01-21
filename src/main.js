
// import promise from 'es6-promise';
// promise.polyfill();
//import 'es6-promise/auto'
import '../static/serverconfig.js'
import Vue from "vue"
import App from './index'
import ElementUI from 'element-ui'
import '@/assets/css/theme-default.scss'
import '@/assets/css/icon/iconfont.css'
import '@/assets/css/myStyle.css'//自定义样式*************************
import store from './store'
import filter from './filter'
import directive from './directive'
import axios from './util/ajax'
import router from './router'
import i18n from './util/i18n'
import 'babel-polyfill'
import './components/install'
import './plugins/install'
import infiniteScroll from 'vue-infinite-scroll'
import Print from '@/plugins/printJS/print'
import getPdf from './plugins/PDF/getPdf'
//import httpajax from "axios";
//import Auth from "./util/auth";
//import $ from 'jquery'
// import VueHighlightJS from 'vue-highlight.js'
// import 'highlight.js/styles/atom-one-dark.css'
// Vue.use(VueHighlightJS)

import '../static/css/icon.css';  //阿里的图标样式
import saasMessage from "@/components/message"
import saasConfirm from "./components/confirm"


Vue.use(saasMessage)
Vue.use(saasConfirm)

// 注册组件到Vue
Vue.prototype.$axios = axios


//完整引入element-ui 和 i18n语言
Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})
//注册滚动加载插件
Vue.use(infiniteScroll)
// 注册打印
Vue.use(Print) 

// 注册Pdf
Vue.use(getPdf)

//Vue.prototype.getConfigJson()//调用声明的全局方法

new Vue({
    i18n,
    axios,
    router,
    store,
    filter,
    directive,
    render: h => h(App)
}).$mount('#app')