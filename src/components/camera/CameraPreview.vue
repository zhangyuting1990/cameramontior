<template>
  <div class="camera-preview" :class="{ mirror: isMirror }">
    <video
      ref="videoRef"
      class="video-element"
      autoplay
      playsinline
      muted
    ></video>
    <div v-if="!isActive" class="placeholder">
      <div class="placeholder-icon">📷</div>
      <div class="placeholder-text">点击启动摄像头</div>
    </div>
    <div v-if="isRecording" class="recording-indicator">
      <span class="recording-dot"></span>
      <span class="recording-time">{{ formatTime(recordingTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'

const videoRef = ref<HTMLVideoElement | null>(null)
const cameraStore = useCameraStore()
const { stream, isActive, isMirror, isRecording, recordingTime } = storeToRefs(cameraStore)

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const secs = seconds % 60
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

watch(stream, (newStream) => {
  if (videoRef.value && newStream) {
    videoRef.value.srcObject = newStream
  }
})

onMounted(() => {
  if (videoRef.value && stream.value) {
    videoRef.value.srcObject = stream.value
  }
})

onUnmounted(() => {
  cameraStore.stopCamera()
})
</script>

<style scoped lang="scss">
.camera-preview {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  &.mirror .video-element {
    transform: scaleX(-1);
  }
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #888;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.placeholder-text {
  font-size: 18px;
}

.recording-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.recording-dot {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
