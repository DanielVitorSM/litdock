import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from '@/router/auth.routes'
import guestRoutes from '@/router/guest.routes'
import appRoutes from '@/router/app.routes'
import { useAuthStore } from '@/stores/auth'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("@/pages/guest/LandingPage.vue"),
      meta: { guest: true }
    },
    {
      path: '/',
      children: [...authRoutes, ...guestRoutes],
      component: () => import('@/components/layouts/AuthLayout.vue'),
    },
    {
      path: '/app',
      children: appRoutes,
      meta: { auth: true },
      component: () => import('@/components/layouts/AppLayout.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/guest/NotFoundPage.vue'),
      meta: {
        title: 'Página não encontrada',
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  }
})

router.beforeEach((to) => {
  if (!to.hash) {
    NProgress.start()
  }

  const auth = useAuthStore()

  if (to.meta.auth && !auth.user) {
    return { name: 'login' }
  }

  if (to.meta.guest && auth.user) {
    return { name: 'home' }
  }
})

router.onError(() => {
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
