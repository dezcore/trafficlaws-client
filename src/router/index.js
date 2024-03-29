import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from "../pages/Auth.vue"
import OpenAI from "../pages/OpenAI.vue"
import Studio from '../pages/Studio.vue'
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
    path: '/studio', 
    name: 'Studion',
    component: Studio,
    meta: {
      isAuthenticated: false
    }
  },
  { 
    path: '/openai', 
    name: 'OpenAI',
    component: OpenAI,
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

  const tokens = window.localStorage.getItem("tokens")
  
  if(window && to.name !== 'Auth' && (tokens === null || tokens === 'null')) {
    next({ name: 'Auth' })
  } else {
    next()
  }
})

export default router
