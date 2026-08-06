import { createRouter, createWebHistory } from 'vue-router'
import Login from '../Login.vue'
import SignUp from '../SignUp.vue'
import Profile from '../Profile.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideSidebar: true }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    meta: { hideSidebar: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requireAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router