import type { MediaItem, MediaMetadata, MediaType } from '@/types/media'

export class MediaService {
  private mediaItems: MediaItem[] = []
  private readonly STORAGE_KEY = 'camera_system_media'

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.mediaItems = JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载媒体数据失败:', error)
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mediaItems))
    } catch (error) {
      console.error('保存媒体数据失败:', error)
    }
  }

  private generateId(): string {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async saveMedia(file: Blob, metadata?: MediaMetadata): Promise<MediaItem> {
    const url = URL.createObjectURL(file)
    const timestamp = new Date().toISOString()
    const type: MediaType = file.type.startsWith('video') ? 'video' : 'image'
    const extension = type === 'image' ? 'jpg' : 'webm'
    const name = `${type}_${timestamp.replace(/[:.]/g, '-')}.${extension}`

    const item: MediaItem = {
      id: this.generateId(),
      name,
      type,
      size: file.size,
      url,
      createdAt: timestamp,
      metadata
    }

    this.mediaItems.unshift(item)
    this.saveToStorage()

    return item
  }

  getMediaList(
    type?: MediaType | 'all',
    page: number = 1,
    pageSize: number = 20
  ): { items: MediaItem[]; total: number; page: number; pageSize: number } {
    let items = [...this.mediaItems]

    if (type && type !== 'all') {
      items = items.filter(item => item.type === type)
    }

    const total = items.length
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      items: items.slice(start, end),
      total,
      page,
      pageSize
    }
  }

  getMediaItem(id: string): MediaItem | undefined {
    return this.mediaItems.find(item => item.id === id)
  }

  deleteMedia(id: string): Promise<void> {
    const index = this.mediaItems.findIndex(item => item.id === id)
    if (index > -1) {
      const item = this.mediaItems[index]
      if (item.url.startsWith('blob:')) {
        URL.revokeObjectURL(item.url)
      }
      this.mediaItems.splice(index, 1)
      this.saveToStorage()
    }
    return Promise.resolve()
  }

  async batchDelete(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.deleteMedia(id)
    }
  }

  downloadMedia(id: string): Promise<void> {
    const item = this.getMediaItem(id)
    if (!item) {
      throw new Error('媒体文件不存在')
    }

    const link = document.createElement('a')
    link.href = item.url
    link.download = item.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return Promise.resolve()
  }

  async getThumbnail(id: string): Promise<string | null> {
    const item = this.getMediaItem(id)
    if (!item) return null

    if (item.thumbnail) return item.thumbnail

    if (item.type === 'image') {
      return item.url
    }

    return null
  }
}

export const mediaService = new MediaService()
