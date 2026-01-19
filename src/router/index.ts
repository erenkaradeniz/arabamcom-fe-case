import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
const AdvertDetailView = () => import('@/views/AdvertDetailView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/advert/:id',
      name: 'advert-detail',
      component: AdvertDetailView,
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
