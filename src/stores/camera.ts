import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CameraParams, CameraChannel, CameraDevice, GridLayout, PTZPreset } from '@/types/camera'

export const useCameraStore = defineStore('camera', () => {
  // 设备列表
  const devices = ref<CameraDevice[]>([])
  // 通道列表
  const channels = ref<CameraChannel[]>([])
  // 网格布局
  const gridLayout = ref<GridLayout>('2x2')
  // 当前选中的通道ID（用于放大/云台控制）
  const activeChannelId = ref<string | null>(null)
  // 是否放大模式
  const isMaximized = ref(false)
  // 摄像头参数
  const params = ref<CameraParams>({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    hue: 50,
    exposure: 'auto',
    whiteBalance: 'auto'
  })

  const activeChannel = computed(() =>
    channels.value.find(ch => ch.id === activeChannelId.value)
  )

  const gridCols = computed(() => {
    const map: Record<GridLayout, number> = {
      '1x1': 1,
      '2x2': 2,
      '3x3': 3,
      '4x4': 4
    }
    return map[gridLayout.value]
  })

  const maxChannels = computed(() => {
    const map: Record<GridLayout, number> = {
      '1x1': 1,
      '2x2': 4,
      '3x3': 9,
      '4x4': 16
    }
    return map[gridLayout.value]
  })

  // 加载设备列表（模拟数据，后端对接时替换）
  async function loadDevices() {
    try {
      // 模拟多路摄像头设备
      devices.value = [
        {
          id: 'cam-1',
          name: '前门摄像头',
          type: 'ip',
          status: 'online',
          resolution: '1920x1080',
          ip: '192.168.1.101',
          port: 554,
          ptzSupported: true,
          streamUrl: 'rtsp://192.168.1.101:554/stream1'
        },
        {
          id: 'cam-2',
          name: '后门摄像头',
          type: 'ip',
          status: 'online',
          resolution: '1920x1080',
          ip: '192.168.1.102',
          port: 554,
          ptzSupported: true,
          streamUrl: 'rtsp://192.168.1.102:554/stream1'
        },
        {
          id: 'cam-3',
          name: '仓库摄像头',
          type: 'ip',
          status: 'online',
          resolution: '1280x720',
          ip: '192.168.1.103',
          port: 554,
          ptzSupported: true,
          streamUrl: 'rtsp://192.168.1.103:554/stream1'
        },
        {
          id: 'cam-4',
          name: '停车场摄像头',
          type: 'ip',
          status: 'online',
          resolution: '1920x1080',
          ip: '192.168.1.104',
          port: 554,
          ptzSupported: true,
          streamUrl: 'rtsp://192.168.1.104:554/stream1'
        },
        {
          id: 'cam-5',
          name: '办公区摄像头',
          type: 'ip',
          status: 'offline',
          resolution: '1920x1080',
          ip: '192.168.1.105',
          port: 554,
          ptzSupported: false,
          streamUrl: 'rtsp://192.168.1.105:554/stream1'
        },
        {
          id: 'cam-6',
          name: '大厅摄像头',
          type: 'ip',
          status: 'online',
          resolution: '2560x1440',
          ip: '192.168.1.106',
          port: 554,
          ptzSupported: true,
          streamUrl: 'rtsp://192.168.1.106:554/stream1'
        }
      ]

      // 根据设备生成通道
      channels.value = devices.value.map(device => ({
        id: `channel-${device.id}`,
        deviceId: device.id,
        name: device.name,
        streamUrl: device.streamUrl || '',
        isActive: device.status === 'online',
        isRecording: false,
        ptzSupported: device.ptzSupported || false,
        ptzParams: { pan: 0, tilt: 0, zoom: 1, speed: 50 },
        presets: [
          { id: 'preset-1', name: '预置位1', pan: 0, tilt: 0, zoom: 1 },
          { id: 'preset-2', name: '预置位2', pan: 90, tilt: 45, zoom: 2 },
          { id: 'preset-3', name: '预置位3', pan: 180, tilt: 0, zoom: 1 }
        ]
      }))

      if (channels.value.length > 0 && !activeChannelId.value) {
        activeChannelId.value = channels.value[0].id
      }
    } catch (error) {
      console.error('加载设备失败:', error)
    }
  }

  function setGridLayout(layout: GridLayout) {
    gridLayout.value = layout
    if (layout === '1x1') {
      isMaximized.value = true
    } else {
      isMaximized.value = false
    }
  }

  function selectChannel(channelId: string) {
    activeChannelId.value = channelId
  }

  function toggleMaximize() {
    if (isMaximized.value) {
      isMaximized.value = false
      gridLayout.value = '2x2'
    } else {
      isMaximized.value = true
      gridLayout.value = '1x1'
    }
  }

  function maximizeChannel(channelId: string) {
    activeChannelId.value = channelId
    isMaximized.value = true
    gridLayout.value = '1x1'
  }

  // 云台控制
  function ptzMove(channelId: string, direction: 'up' | 'down' | 'left' | 'right') {
    const channel = channels.value.find(ch => ch.id === channelId)
    if (!channel || !channel.ptzSupported) return

    const step = channel.ptzParams.speed / 10
    switch (direction) {
      case 'up':
        channel.ptzParams.tilt = Math.min(90, channel.ptzParams.tilt + step)
        break
      case 'down':
        channel.ptzParams.tilt = Math.max(-90, channel.ptzParams.tilt - step)
        break
      case 'left':
        channel.ptzParams.pan = Math.max(-180, channel.ptzParams.pan - step)
        break
      case 'right':
        channel.ptzParams.pan = Math.min(180, channel.ptzParams.pan + step)
        break
    }

    // TODO: 发送云台控制指令到后端
    console.log(`PTZ Move: ${direction}, channel: ${channelId}`, channel.ptzParams)
  }

  function ptzZoom(channelId: string, zoomLevel: number) {
    const channel = channels.value.find(ch => ch.id === channelId)
    if (!channel || !channel.ptzSupported) return

    channel.ptzParams.zoom = Math.max(1, Math.min(20, zoomLevel))
    // TODO: 发送变焦指令到后端
    console.log(`PTZ Zoom: ${zoomLevel}, channel: ${channelId}`)
  }

  function ptzStop(channelId: string) {
    // TODO: 发送停止云台指令到后端
    console.log(`PTZ Stop: ${channelId}`)
  }

  function ptzGotoPreset(channelId: string, presetId: string) {
    const channel = channels.value.find(ch => ch.id === channelId)
    if (!channel || !channel.ptzSupported) return

    const preset = channel.presets.find(p => p.id === presetId)
    if (preset) {
      channel.ptzParams.pan = preset.pan
      channel.ptzParams.tilt = preset.tilt
      channel.ptzParams.zoom = preset.zoom
      // TODO: 发送预置位指令到后端
      console.log(`PTZ Goto Preset: ${presetId}, channel: ${channelId}`)
    }
  }

  function ptzSetPreset(channelId: string, name: string) {
    const channel = channels.value.find(ch => ch.id === channelId)
    if (!channel || !channel.ptzSupported) return

    const newPreset: PTZPreset = {
      id: `preset-${Date.now()}`,
      name,
      pan: channel.ptzParams.pan,
      tilt: channel.ptzParams.tilt,
      zoom: channel.ptzParams.zoom
    }
    channel.presets.push(newPreset)
    // TODO: 保存预置位到后端
    console.log(`PTZ Set Preset: ${name}, channel: ${channelId}`)
  }

  function setPtzSpeed(channelId: string, speed: number) {
    const channel = channels.value.find(ch => ch.id === channelId)
    if (!channel) return
    channel.ptzParams.speed = speed
  }

  // 通道录制控制
  function toggleRecording(channelId: string) {
    const channel = channels.value.find(ch => ch.id === channelId)
    if (!channel) return
    channel.isRecording = !channel.isRecording
    // TODO: 发送录制指令到后端
  }

  function updateParams(newParams: Partial<CameraParams>) {
    params.value = { ...params.value, ...newParams }
  }

  // 添加设备
  function addDevice(device: CameraDevice) {
    devices.value.push(device)
    channels.value.push({
      id: `channel-${device.id}`,
      deviceId: device.id,
      name: device.name,
      streamUrl: device.streamUrl || '',
      isActive: device.status === 'online',
      isRecording: false,
      ptzSupported: device.ptzSupported || false,
      ptzParams: { pan: 0, tilt: 0, zoom: 1, speed: 50 },
      presets: []
    })
  }

  // 移除设备
  function removeDevice(deviceId: string) {
    devices.value = devices.value.filter(d => d.id !== deviceId)
    channels.value = channels.value.filter(ch => ch.deviceId !== deviceId)
    if (activeChannelId.value === `channel-${deviceId}`) {
      activeChannelId.value = channels.value[0]?.id || null
    }
  }

  return {
    devices,
    channels,
    gridLayout,
    activeChannelId,
    isMaximized,
    params,
    activeChannel,
    gridCols,
    maxChannels,
    loadDevices,
    setGridLayout,
    selectChannel,
    toggleMaximize,
    maximizeChannel,
    ptzMove,
    ptzZoom,
    ptzStop,
    ptzGotoPreset,
    ptzSetPreset,
    setPtzSpeed,
    toggleRecording,
    updateParams,
    addDevice,
    removeDevice
  }
})
