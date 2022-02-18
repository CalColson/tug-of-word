import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { initializeApp } from 'firebase/app'
import fbConfig from '../pass/FireBaseConfig'

import vmodal from 'vue-js-modal'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faFlag, faXmarkCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faFlag, faXmarkCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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
