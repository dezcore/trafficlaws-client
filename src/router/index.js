import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../pages/Login.vue"
import Trafficlaws from '../pages/Trafficlaws.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/', 
    component: Trafficlaws
  },
  { 
    path: '/login',
    component : Login
  }
]

const router = new VueRouter({
  routes
})

export default router
