import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import fastClick from 'fastclick'
import './styles/reset.css'
import './styles/border.css'
import './assets/fonticon/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './styles/elementstyle.scss'
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import './qyFreeLogin.js';
import VueResource from 'vue-resource'

Vue.use(VueResource);

//fastClick.attach(document.body)
Vue.config.productionTip = false

Vue.use(ElementUI);

// 用一个固定的用户
// const userParam = {
//   "department": "部门2",
//   "other": "其他信息",
//   "userIdentify": "111",
//   "userName": "普通用户"
// }

router.beforeEach(async(to,from,next)=>{
  NProgress.start();
  
  next();
  // if(to.path === '/') {
  //   await next('/list')
  // } else {
  //   await next() 
  // }
  
})

router.afterEach(()=>{
  // 结束进度条
  NProgress.done();
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
