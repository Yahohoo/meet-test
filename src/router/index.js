import Vue from 'vue'
import VueRouter from 'vue-router'
import MeetingsPage from '@/views/MeetingsPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'meetings',
  },
  {
    path: '/meetings',
    name: 'meetings',
    component: MeetingsPage,
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "users" */ '@/views/UsersPage.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
