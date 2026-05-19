import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  InventoryTask,
  InventoryRecord,
  InventoryStatus,
  DetectionType,
  ExportOptions
} from '@/types/inventory'

export const useInventoryStore = defineStore('inventory', () => {
  const tasks = ref<InventoryTask[]>([])
  const records = ref<InventoryRecord[]>([])
  const currentTaskId = ref<string | null>(null)
  const isLoading = ref(false)

  const currentTask = computed(() =>
    tasks.value.find(t => t.id === currentTaskId.value)
  )

  const currentTaskRecords = computed(() =>
    records.value.filter(r => r.taskId === currentTaskId.value)
  )

  const taskStats = computed(() => {
    const totalTasks = tasks.value.length
    const completedTasks = tasks.value.filter(t => t.status === 'completed').length
    const totalRecords = records.value.length
    const avgAccuracy = records.value.length > 0
      ? records.value.reduce((sum, r) => sum + (r.confidence || 0), 0) / records.value.length
      : 0

    return {
      totalTasks,
      completedTasks,
      totalRecords,
      averageAccuracy: Math.round(avgAccuracy * 100) / 100
    }
  })

  const tasksByStatus = computed(() => {
    return {
      pending: tasks.value.filter(t => t.status === 'pending'),
      inProgress: tasks.value.filter(t => t.status === 'in_progress'),
      completed: tasks.value.filter(t => t.status === 'completed'),
      cancelled: tasks.value.filter(t => t.status === 'cancelled')
    }
  })

  function generateId(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function createTask(
    name: string,
    detectionType: DetectionType,
    options?: {
      description?: string
      autoSave?: boolean
      totalItems?: number
    }
  ): InventoryTask {
    const task: InventoryTask = {
      id: generateId(),
      name,
      description: options?.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      totalItems: options?.totalItems || 0,
      scannedItems: 0,
      detectionType,
      autoSave: options?.autoSave ?? true
    }

    tasks.value.unshift(task)
    saveToStorage()
    return task
  }

  function updateTaskStatus(taskId: string, status: InventoryStatus): void {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      if (status === 'in_progress' && !task.startedAt) {
        task.startedAt = new Date().toISOString()
      } else if (status === 'completed' && !task.completedAt) {
        task.completedAt = new Date().toISOString()
      }
      saveToStorage()
    }
  }

  function updateTaskProgress(taskId: string, scannedItems: number): void {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.scannedItems = scannedItems
      saveToStorage()
    }
  }

  function addRecord(
    taskId: string,
    data: {
      barcode?: string
      qrcode?: string
      detectedObject?: string
      confidence?: number
      imageUrl?: string
      location?: string
      notes?: string
    }
  ): InventoryRecord {
    const record: InventoryRecord = {
      id: generateId(),
      taskId,
      ...data,
      timestamp: new Date().toISOString()
    }

    records.value.unshift(record)

    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.scannedItems = records.value.filter(r => r.taskId === taskId).length
    }

    saveToStorage()
    return record
  }

  function deleteTask(taskId: string): void {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    records.value = records.value.filter(r => r.taskId !== taskId)
    if (currentTaskId.value === taskId) {
      currentTaskId.value = null
    }
    saveToStorage()
  }

  function deleteRecord(recordId: string): void {
    const record = records.value.find(r => r.id === recordId)
    if (record) {
      const taskId = record.taskId
      records.value = records.value.filter(r => r.id !== recordId)

      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.scannedItems = records.value.filter(r => r.taskId === taskId).length
      }
      saveToStorage()
    }
  }

  function updateRecordNotes(recordId: string, notes: string): void {
    const record = records.value.find(r => r.id === recordId)
    if (record) {
      record.notes = notes
      saveToStorage()
    }
  }

  function setCurrentTask(taskId: string | null): void {
    currentTaskId.value = taskId
  }

  function getTaskRecords(taskId: string): InventoryRecord[] {
    return records.value.filter(r => r.taskId === taskId)
  }

  function exportData(options: ExportOptions): string {
    let dataToExport: any[] = []

    if (options.taskId) {
      dataToExport = getTaskRecords(options.taskId)
    } else {
      dataToExport = [...records.value]
    }

    if (options.dateRange) {
      dataToExport = dataToExport.filter(r => {
        const date = new Date(r.timestamp)
        return date >= new Date(options.dateRange!.start) &&
               date <= new Date(options.dateRange!.end)
      })
    }

    const headers = ['ID', '任务ID', '条形码', '二维码', '识别对象', '置信度', '时间', '位置', '备注']
    const rows = dataToExport.map(r => [
      r.id,
      r.taskId,
      r.barcode || '',
      r.qrcode || '',
      r.detectedObject || '',
      r.confidence ? `${r.confidence}%` : '',
      new Date(r.timestamp).toLocaleString('zh-CN'),
      r.location || '',
      r.notes || ''
    ])

    if (options.format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      return csvContent
    }

    return JSON.stringify({ headers, rows }, null, 2)
  }

  function downloadExport(options: ExportOptions): void {
    const content = exportData(options)
    const format = options.format
    const task = options.taskId ? tasks.value.find(t => t.id === options.taskId) : null
    const filename = task
      ? `inventory_${task.name}_${new Date().toISOString().split('T')[0]}`
      : `inventory_all_${new Date().toISOString().split('T')[0]}`

    let mimeType = 'text/plain'
    let extension = 'txt'

    if (format === 'csv') {
      mimeType = 'text/csv'
      extension = 'csv'
    } else if (format === 'excel') {
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      extension = 'xlsx'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function saveToStorage(): void {
    try {
      localStorage.setItem('inventory_tasks', JSON.stringify(tasks.value))
      localStorage.setItem('inventory_records', JSON.stringify(records.value))
    } catch (error) {
      console.error('保存盘点数据失败:', error)
    }
  }

  function loadFromStorage(): void {
    try {
      const storedTasks = localStorage.getItem('inventory_tasks')
      const storedRecords = localStorage.getItem('inventory_records')

      if (storedTasks) {
        tasks.value = JSON.parse(storedTasks)
      }
      if (storedRecords) {
        records.value = JSON.parse(storedRecords)
      }
    } catch (error) {
      console.error('加载盘点数据失败:', error)
    }
  }

  loadFromStorage()

  return {
    tasks,
    records,
    currentTaskId,
    currentTask,
    currentTaskRecords,
    taskStats,
    tasksByStatus,
    isLoading,
    createTask,
    updateTaskStatus,
    updateTaskProgress,
    addRecord,
    deleteTask,
    deleteRecord,
    updateRecordNotes,
    setCurrentTask,
    getTaskRecords,
    exportData,
    downloadExport,
    loadFromStorage
  }
})
