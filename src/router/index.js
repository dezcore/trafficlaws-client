import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../pages/Login.vue"
import Trafficlaws from '../pages/Trafficlaws.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: Trafficlaws,
    meta: {
      isAuthenticated: false
    }
  },
  { 
    path: '/login',
    name: 'Auth',
    component : Login,
    meta: {
      isAuthenticated: false
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
