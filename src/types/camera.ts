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
  ptzSupported?: boolean
}

export interface RecordingOptions {
  videoBitsPerSecond?: number
  audioBitsPerSecond?: number
  mimeType?: string
}
