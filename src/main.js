import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from "vue-lazyload";

import "./common/stylus/index.styl"

Vue.use(VueLazyload,{
  loading:require('common/img/default.png')
})

fastclick.attach(document.body);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app');
