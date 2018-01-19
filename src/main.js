import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import  VueResource  from 'vue-resource'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload,{
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dist/loading.gif',
  attempt: 1,
  // loading:'/assets/images/loading.png'
})
Vue.use(VueResource) 


fastclick.attach(document.body)

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store:store
})
