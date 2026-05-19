import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/camera'
  },
  {
    path: '/camera',
    name: 'Camera',
    component: () => import('@/views/CameraView.vue')
  },
  {
    path: '/media',
    name: 'Media',
    component: () => import('@/views/MediaView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
