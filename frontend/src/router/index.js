import { createRouter, createWebHistory } from 'vue-router'
import Login from '../Login.vue'
import SignUp from '../SignUp.vue'
import Profile from '../Profile.vue'
import EditProfile from '../EditProfile.vue'
import Feed from '../Feed.vue'
import Explore from '../components/Explore.vue'

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
  },
  {
    path: '/posts/new',
    name: 'CreatePost',
    component: () => import('../Feed.vue'), 
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore,
    meta: { requireAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/feed',
  },
  {
    path: '/profile/:username',
    name: 'ProfileUser',
    component: Profile,
    meta: { requireAuth: true }
  },
  {
    path: '/settings/profile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requireAuth: true }
  },
  {
    path: '/feed',
    name: 'Feed',
    component: Feed,
    meta: { requireAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    return next('/login');
  }

  next();
});

export default router