import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/App.vue'
import AboutView from '../views/AboutPage.vue'
import MediaView from '../views/MediaPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/media',
    name: 'media',
    component: MediaView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
