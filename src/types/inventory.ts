export type InventoryStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type DetectionType = 'object' | 'barcode' | 'qrcode' | 'face'

export type ExportFormat = 'excel' | 'csv' | 'pdf'

export interface InventoryTask {
  id: string
  name: string
  description?: string
  status: InventoryStatus
  createdAt: string
  startedAt?: string
  completedAt?: string
  totalItems: number
  scannedItems: number
  detectionType: DetectionType
  autoSave: boolean
  metadata?: Record<string, any>
}

export interface InventoryRecord {
  id: string
  taskId: string
  barcode?: string
  qrcode?: string
  detectedObject?: string
  confidence?: number
  imageUrl?: string
  timestamp: string
  location?: string
  notes?: string
  metadata?: Record<string, any>
}

export interface InventoryStats {
  totalTasks: number
  completedTasks: number
  totalRecords: number
  averageAccuracy: number
}

export interface ExportOptions {
  format: ExportFormat
  taskId?: string
  dateRange?: {
    start: string
    end: string
  }
  includeImages?: boolean
}
