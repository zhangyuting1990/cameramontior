import type { CameraParams, RecordingOptions, Resolution } from '@/types/camera'

export class CameraService {
  private stream: MediaStream | null = null
  private mediaRecorder: MediaRecorder | null = null
  private recordedChunks: Blob[] = []
  private recordingStartTime: number = 0

  async enumerateDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter(device => device.kind === 'videoinput')
    } catch (error) {
      console.error('枚举设备失败:', error)
      throw error
    }
  }

  async startCamera(
    deviceId?: string,
    constraints?: MediaTrackConstraints
  ): Promise<MediaStream> {
    try {
      const mediaConstraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          ...constraints
        },
        audio: true
      }

      if (deviceId) {
        (mediaConstraints.video as MediaTrackConstraints).deviceId = deviceId
      }

      this.stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      return this.stream
    } catch (error) {
      console.error('启动摄像头失败:', error)
      throw error
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  async switchCamera(deviceId: string): Promise<MediaStream> {
    this.stopCamera()
    return this.startCamera(deviceId)
  }

  capturePhoto(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.stream) {
        reject(new Error('摄像头未启动'))
        return
      }

      const videoTrack = this.stream.getVideoTracks()[0]
      const imageCapture = new ImageCapture(videoTrack)

      imageCapture
        .takePhoto()
        .then(blob => resolve(blob))
        .catch(() => {
          const video = document.createElement('video')
          video.srcObject = this.stream!
          video.play()

          video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(video, 0, 0)
              canvas.toBlob(blob => {
                if (blob) resolve(blob)
                else reject(new Error('截图失败'))
              }, 'image/jpeg', 0.9)
            }
          }
        })
    })
  }

  async applyConstraints(constraints: MediaTrackConstraints): Promise<void> {
    if (!this.stream) {
      throw new Error('摄像头未启动')
    }

    const videoTrack = this.stream.getVideoTracks()[0]
    await videoTrack.applyConstraints(constraints)
  }

  startRecording(options?: RecordingOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.stream) {
        reject(new Error('摄像头未启动'))
        return
      }

      try {
        const mimeTypes = [
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm'
        ]

        const mimeType = options?.mimeType || mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm'

        this.recordedChunks = []
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType,
          videoBitsPerSecond: options?.videoBitsPerSecond || 2500000,
          audioBitsPerSecond: options?.audioBitsPerSecond || 128000
        })

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data)
          }
        }

        this.mediaRecorder.start(100)
        this.recordingStartTime = Date.now()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('未在录制中'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, {
          type: this.mediaRecorder!.mimeType
        })
        resolve(blob)
      }

      this.mediaRecorder.stop()
    })
  }

  getRecordingDuration(): number {
    if (!this.recordingStartTime) return 0
    return Date.now() - this.recordingStartTime
  }

  getStream(): MediaStream | null {
    return this.stream
  }
}

export const cameraService = new CameraService()
