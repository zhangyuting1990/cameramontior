<template>
  <div class="main-layout">
    <header class="layout-header">
      <div class="header-left">
        <div class="logo">📷 摄像头系统</div>
      </div>
      <div class="header-right">
        <tiny-button size="small" @click="navigateTo('camera')">摄像头</tiny-button>
        <tiny-button size="small" @click="navigateTo('media')">媒体库</tiny-button>
      </div>
    </header>
    
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { TinyButton } from '@opentiny/vue'

const router = useRouter()

function navigateTo(path: string) {
  router.push(`/${path}`)
}
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  gap: 12px;
}

.layout-main {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}
</style>
