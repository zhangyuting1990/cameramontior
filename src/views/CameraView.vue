<template>
  <MainLayout>
    <div class="camera-view">
      <div class="view-left">
        <CameraPreview />
        <CameraControl />
      </div>
      <div class="view-right">
        <CameraParams />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCameraStore } from '@/stores/camera'
import MainLayout from '@/components/layout/MainLayout.vue'
import CameraPreview from '@/components/camera/CameraPreview.vue'
import CameraControl from '@/components/camera/CameraControl.vue'
import CameraParams from '@/components/camera/CameraParams.vue'

const cameraStore = useCameraStore()

onMounted(() => {
  cameraStore.loadDevices()
})
</script>

<style scoped lang="scss">
.camera-view {
  display: flex;
  gap: 16px;
  height: 100%;
}

.view-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.view-right {
  width: 320px;
  flex-shrink: 0;
}
</style>
