import Vue from 'vue'
import Vuex from "vuex"
import axios from "axios"
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import Plotly from 'plotly.js-dist'
import vuetify from './plugins/vuetify'
import studio from './store/studio'
import trafficlawstore from './store/trafficlaws'
import VueForceNextTick from 'vue-force-next-tick'

Vue.use(Vuex)
Vue.use(Plotly)
Vue.use(VueAxios, axios)
Vue.use(VueForceNextTick)

Vue.config.productionTip = false
Vue.prototype.$Plotly = Plotly

const store = new Vuex.Store({
  namespaced: true,
  modules: {
    studio,
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
