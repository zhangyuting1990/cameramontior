<template>
  <div class="camera-control">
    <div class="control-row">
      <tiny-button
        v-if="!isActive"
        type="primary"
        size="large"
        @click="handleStart"
      >
        启动摄像头
      </tiny-button>
      <template v-else>
        <tiny-button size="large" @click="handleCapture">
          📷 拍照
        </tiny-button>
        <tiny-button
          v-if="!isRecording"
          type="danger"
          size="large"
          @click="handleStartRecording"
        >
          ⏺ 录制
        </tiny-button>
        <tiny-button
          v-else
          type="success"
          size="large"
          @click="handleStopRecording"
        >
          ⏹ 停止
        </tiny-button>
        <tiny-button size="large" @click="handleToggleMirror">
          {{ isMirror ? '🔄 取消镜像' : '🔄 镜像' }}
        </tiny-button>
        <tiny-button size="large" @click="handleStop">
          停止摄像头
        </tiny-button>
      </template>
    </div>

    <div class="device-selector" v-if="devices.length > 0">
      <tiny-select
        v-model="selectedDeviceId"
        placeholder="选择摄像头"
        :disabled="!isActive"
        @change="handleDeviceChange"
        style="width: 300px"
      >
        <tiny-option
          v-for="device in devices"
          :key="device.deviceId"
          :label="device.label || `摄像头 ${device.deviceId.slice(0, 8)}`"
          :value="device.deviceId"
        />
      </tiny-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'
import { useMediaStore } from '@/stores/media'
import { TinyButton, TinySelect, TinyOption } from '@opentiny/vue'
import { TinyMessage } from '@opentiny/vue'

const cameraStore = useCameraStore()
const mediaStore = useMediaStore()
const { devices, isActive, isMirror, isRecording, currentDeviceId } = storeToRefs(cameraStore)
const { startCamera, stopCamera, capturePhoto, startRecording, stopRecording, toggleMirror, switchCamera } = cameraStore

const selectedDeviceId = ref<string | null>(null)

watch(currentDeviceId, (id) => {
  selectedDeviceId.value = id
})

watch(devices, (newDevices) => {
  if (newDevices.length > 0 && !selectedDeviceId.value) {
    selectedDeviceId.value = newDevices[0].deviceId
  }
}, { immediate: true })

async function handleStart() {
  try {
    await startCamera(selectedDeviceId.value || undefined)
    TinyMessage.success('摄像头启动成功')
  } catch (error) {
    TinyMessage.error('摄像头启动失败，请检查权限')
  }
}

function handleStop() {
  stopCamera()
  TinyMessage.info('摄像头已停止')
}

async function handleCapture() {
  try {
    const blob = await capturePhoto()
    await mediaStore.saveMedia(blob)
    TinyMessage.success('拍照成功')
  } catch (error) {
    TinyMessage.error('拍照失败')
  }
}

async function handleStartRecording() {
  try {
    await startRecording()
    TinyMessage.success('开始录制')
  } catch (error) {
    TinyMessage.error('开始录制失败')
  }
}

async function handleStopRecording() {
  try {
    const blob = await stopRecording()
    if (blob) {
      await mediaStore.saveMedia(blob)
      TinyMessage.success('录制已保存')
    }
  } catch (error) {
    TinyMessage.error('停止录制失败')
  }
}

function handleToggleMirror() {
  toggleMirror()
}

async function handleDeviceChange(deviceId: string) {
  if (isActive) {
    try {
      await switchCamera(deviceId)
      TinyMessage.success('摄像头已切换')
    } catch (error) {
      TinyMessage.error('切换摄像头失败')
    }
  }
}
</script>

<style scoped lang="scss">
.camera-control {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.control-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.device-selector {
  display: flex;
  justify-content: center;
}
</style>
