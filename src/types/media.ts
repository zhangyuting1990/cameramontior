export type MediaType = 'image' | 'video'

export interface MediaMetadata {
  cameraId?: string
  resolution?: string
  duration?: number
  [key: string]: any
}

export interface MediaItem {
  id: string
  name: string
  type: MediaType
  size: number
  url: string
  thumbnail?: string
  createdAt: string
  metadata?: MediaMetadata
}

export interface MediaListResponse {
  items: MediaItem[]
  total: number
  page: number
  pageSize: number
}
