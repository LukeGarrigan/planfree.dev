import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      auth: false,
      title: 'Planning Poker'
    }
  },  
  {
    path: '/game/:id',
    name: 'Game',
    component: Game,
    meta: {
      auth: false,
      title: 'Planning Poker'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
