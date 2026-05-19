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
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/InventoryView.vue')
  },
  {
    path: '/inventory/scan',
    name: 'InventoryScan',
    component: () => import('@/views/InventoryScanView.vue')
  },
  {
    path: '/inventory/records',
    name: 'InventoryRecords',
    component: () => import('@/views/InventoryRecordsView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
