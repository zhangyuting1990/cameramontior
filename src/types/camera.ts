export interface CameraParams {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  exposure: 'auto' | number
  whiteBalance: 'auto' | number
}

export interface Resolution {
  width: number
  height: number
}

export interface CameraDevice {
  id: string
  name: string
  type: 'usb' | 'ip'
  status: 'online' | 'offline'
  resolution?: string
  ip?: string
  port?: number
  username?: string
  password?: string
  ptzSupported?: boolean
  streamUrl?: string
}

export interface PTZParams {
  pan: number
  tilt: number
  zoom: number
  speed: number
}

export interface PTZPreset {
  id: string
  name: string
  pan: number
  tilt: number
  zoom: number
}

export interface CameraChannel {
  id: string
  deviceId: string
  name: string
  streamUrl: string
  isActive: boolean
  isRecording: boolean
  ptzSupported: boolean
  ptzParams: PTZParams
  presets: PTZPreset[]
}

export type GridLayout = '1x1' | '2x2' | '3x3' | '4x4'

export interface RecordingOptions {
  videoBitsPerSecond?: number
  audioBitsPerSecond?: number
  mimeType?: string
}
