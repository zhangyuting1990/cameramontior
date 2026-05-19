import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cameraService } from '@/services/camera.service'
import type { CameraParams, Resolution } from '@/types/camera'

export const useCameraStore = defineStore('camera', () => {
  const devices = ref<MediaDeviceInfo[]>([])
  const currentDeviceId = ref<string | null>(null)
  const stream = ref<MediaStream | null>(null)
  const isActive = ref(false)
  const isMirror = ref(false)
  const resolution = ref<Resolution>({ width: 1920, height: 1080 })
  const params = ref<CameraParams>({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    hue: 50,
    exposure: 'auto',
    whiteBalance: 'auto'
  })
  const isRecording = ref(false)
  const recordingTime = ref(0)
  const recordingTimer = ref<number | null>(null)

  const hasDevices = computed(() => devices.value.length > 0)
  const currentDevice = computed(() =>
    devices.value.find(d => d.deviceId === currentDeviceId.value)
  )

  async function loadDevices() {
    try {
      devices.value = await cameraService.enumerateDevices()
      if (devices.value.length > 0 && !currentDeviceId.value) {
        currentDeviceId.value = devices.value[0].deviceId
      }
    } catch (error) {
      console.error('加载设备失败:', error)
    }
  }

  async function startCamera(deviceId?: string) {
    try {
      const targetDeviceId = deviceId || currentDeviceId.value
      stream.value = await cameraService.startCamera(targetDeviceId)
      isActive.value = true
      if (targetDeviceId) {
        currentDeviceId.value = targetDeviceId
      }
    } catch (error) {
      console.error('启动摄像头失败:', error)
      throw error
    }
  }

  function stopCamera() {
    cameraService.stopCamera()
    stream.value = null
    isActive.value = false
    stopRecording()
  }

  async function switchCamera(deviceId: string) {
    try {
      stream.value = await cameraService.switchCamera(deviceId)
      currentDeviceId.value = deviceId
    } catch (error) {
      console.error('切换摄像头失败:', error)
      throw error
    }
  }

  async function capturePhoto() {
    try {
      return await cameraService.capturePhoto()
    } catch (error) {
      console.error('拍照失败:', error)
      throw error
    }
  }

  async function startRecording() {
    try {
      await cameraService.startRecording()
      isRecording.value = true
      recordingTime.value = 0
      recordingTimer.value = window.setInterval(() => {
        recordingTime.value = cameraService.getRecordingDuration()
      }, 100)
    } catch (error) {
      console.error('开始录制失败:', error)
      throw error
    }
  }

  function pauseRecording() {
    cameraService.pauseRecording()
  }

  function resumeRecording() {
    cameraService.resumeRecording()
  }

  async function stopRecording() {
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value)
      recordingTimer.value = null
    }

    if (isRecording.value) {
      try {
        const blob = await cameraService.stopRecording()
        isRecording.value = false
        recordingTime.value = 0
        return blob
      } catch (error) {
        console.error('停止录制失败:', error)
        isRecording.value = false
        throw error
      }
    }
  }

  function toggleMirror() {
    isMirror.value = !isMirror.value
  }

  function updateParams(newParams: Partial<CameraParams>) {
    params.value = { ...params.value, ...newParams }
  }

  return {
    devices,
    currentDeviceId,
    stream,
    isActive,
    isMirror,
    resolution,
    params,
    isRecording,
    recordingTime,
    hasDevices,
    currentDevice,
    loadDevices,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    toggleMirror,
    updateParams
  }
})
