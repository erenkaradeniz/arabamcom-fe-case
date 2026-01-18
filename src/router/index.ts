import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
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
})

export default router
