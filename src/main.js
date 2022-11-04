import Vue from 'vue'
import Vuex from "vuex"
import axios from "axios"
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import trafficlawstore from './store/trafficlaws'
import VueForceNextTick from 'vue-force-next-tick'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VueForceNextTick)

const store = new Vuex.Store({
  namespaced: true,
  modules: {
    trafficlawstore
  }
})

const app =  new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

window.App = app
