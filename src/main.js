import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { initializeApp } from 'firebase/app'
// import { initializeAuth } from 'firebase/auth'
import fbConfig from '../pass/FireBaseConfig'

import vmodal from 'vue-js-modal'

// initialize firebase
initializeApp(fbConfig)

Vue.config.productionTip = false

// plugins
Vue.use(vmodal, { dialog: true })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
