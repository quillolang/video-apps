import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView, meta: { title: 'Pie Shop' } },
    { path: '/login', component: LoginView, meta: { title: 'Log in · Pie Shop' } },
    {
      path: '/admin',
      component: () => import('../views/AdminView.vue'),
      meta: { title: 'Orders · Pie Shop', requiresAuth: true },
    },
  ],
})

// Staff only: anyone else is sent to log in first.
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.signedIn) {
    return { path: '/login', query: { next: to.fullPath } }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title
})

export default router
