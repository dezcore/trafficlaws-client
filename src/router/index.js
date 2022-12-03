import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from "../pages/Auth.vue"
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
    component : Auth,
    meta: {
      isAuthenticated: false
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(window && window.localStorage.getItem("tokens") === null && to.name !== 'Auth') {
    next({ name: 'Auth' })
  } else {
    next()
  }
})

export default router
