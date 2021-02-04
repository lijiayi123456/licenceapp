import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

//const importMyComponent = (file) => import(`../components/${file}.vue`);
//const importMyViews = (file)=>import(`../views/${file}.vue`);
const importMyViews = file => () => import(`../views/${file}.vue`);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true // 该组件需要被缓存
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: importMyViews('Login'),
  },
  {
    path: '/apply',
    name: 'Apply',
    component: importMyViews('ApplyLicence'),
    meta: {
      keepAlive: false // 该组件需要被缓存
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
