<template>
  <div class="inventory-scan">
    <div class="scan-header">
      <div class="header-left">
        <tiny-button size="small" @click="handleBack">返回</tiny-button>
        <h3 class="task-name">{{ currentTask?.name || '盘点任务' }}</h3>
      </div>
      <div class="header-right">
        <span class="progress-text">
          已扫描: {{ currentTask?.scannedItems || 0 }} / {{ currentTask?.totalItems || '∞' }}
        </span>
        <tiny-button type="success" @click="handleComplete">完成盘点</tiny-button>
      </div>
    </div>

    <div class="scan-content">
      <div class="scan-panel">
        <CameraPreview />
        
        <div class="scan-controls">
          <tiny-button type="primary" size="large" @click="handleCapture" :loading="isCapturing">
            📷 拍照识别
          </tiny-button>
          
          <div class="manual-input">
            <tiny-input
              v-model="manualInput"
              placeholder="手动输入条码/二维码"
              @keyup.enter="handleManualInput"
            />
            <tiny-button @click="handleManualInput">添加</tiny-button>
          </div>
        </div>
      </div>

      <div class="results-panel">
        <div class="panel-header">
          <h4>识别结果</h4>
          <tiny-button size="small" @click="handleClearResults">清空</tiny-button>
        </div>

        <div v-if="recentRecords.length === 0" class="empty-results">
          <span>暂无识别记录</span>
        </div>

        <div v-else class="records-list">
          <div
            v-for="record in recentRecords"
            :key="record.id"
            class="record-item"
          >
            <div class="record-icon">
              {{ getRecordIcon(record) }}
            </div>
            <div class="record-content">
              <div class="record-value">{{ getRecordValue(record) }}</div>
              <div class="record-meta">
                <span>{{ formatTime(record.timestamp) }}</span>
                <span v-if="record.confidence" class="confidence">
                  置信度: {{ record.confidence }}%
                </span>
              </div>
            </div>
            <div class="record-actions">
              <tiny-button size="tiny" type="danger" @click="handleDeleteRecord(record.id)">
                删除
              </tiny-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scan-tips">
      <div class="tip-item">
        <span class="tip-icon">💡</span>
        <span>识别类型: {{ getDetectionTypeLabel(currentTask?.detectionType || 'object') }}</span>
      </div>
      <div class="tip-item">
        <span class="tip-icon">📍</span>
        <span>自动保存: {{ currentTask?.autoSave ? '开启' : '关闭' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { useCameraStore } from '@/stores/camera'
import { TinyButton, TinyInput, TinyMessage, TinyModal } from '@opentiny/vue'
import CameraPreview from '@/components/camera/CameraPreview.vue'
import type { InventoryRecord, DetectionType } from '@/types/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()
const cameraStore = useCameraStore()

const manualInput = ref('')
const isCapturing = ref(false)

const currentTask = computed(() => inventoryStore.currentTask)
const recentRecords = computed(() => inventoryStore.currentTaskRecords.slice(0, 50))

function getDetectionTypeLabel(type: DetectionType): string {
  const labels: Record<DetectionType, string> = {
    object: '物体识别',
    barcode: '条形码扫描',
    qrcode: '二维码扫描',
    face: '人脸识别'
  }
  return labels[type]
}

function getRecordIcon(record: InventoryRecord): string {
  if (record.barcode) return '📊'
  if (record.qrcode) return '📱'
  if (record.detectedObject) return '🔍'
  if (record.imageUrl) return '📷'
  return '📝'
}

function getRecordValue(record: InventoryRecord): string {
  return record.barcode || record.qrcode || record.detectedObject || '已记录'
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('zh-CN')
}

async function handleCapture() {
  if (!currentTask.value) {
    TinyMessage.warning('请先选择任务')
    return
  }

  isCapturing.value = true
  try {
    const blob = await cameraStore.capturePhoto()
    const imageUrl = URL.createObjectURL(blob)

    const mockConfidence = Math.round(85 + Math.random() * 15)
    const mockValue = `${currentTask.value.detectionType.toUpperCase()}_${Date.now()}`

    inventoryStore.addRecord(currentTask.value.id, {
      barcode: currentTask.value.detectionType === 'barcode' ? mockValue : undefined,
      qrcode: currentTask.value.detectionType === 'qrcode' ? mockValue : undefined,
      detectedObject: currentTask.value.detectionType === 'object' ? mockValue : undefined,
      confidence: mockConfidence,
      imageUrl
    })

    TinyMessage.success('识别成功')
  } catch (error) {
    console.error('识别失败:', error)
    TinyMessage.error('识别失败，请重试')
  } finally {
    isCapturing.value = false
  }
}

function handleManualInput() {
  if (!currentTask.value || !manualInput.value.trim()) {
    return
  }

  const value = manualInput.value.trim()
  
  if (currentTask.value.detectionType === 'barcode') {
    inventoryStore.addRecord(currentTask.value.id, {
      barcode: value,
      confidence: 100
    })
  } else if (currentTask.value.detectionType === 'qrcode') {
    inventoryStore.addRecord(currentTask.value.id, {
      qrcode: value,
      confidence: 100
    })
  } else {
    inventoryStore.addRecord(currentTask.value.id, {
      detectedObject: value,
      confidence: 100
    })
  }

  manualInput.value = ''
  TinyMessage.success('添加成功')
}

function handleDeleteRecord(recordId: string) {
  inventoryStore.deleteRecord(recordId)
  TinyMessage.success('删除成功')
}

function handleClearResults() {
  TinyModal.confirm({
    message: '确定要清空所有识别记录吗？',
    title: '确认清空'
  }).then(() => {
    const taskId = currentTask.value?.id
    if (taskId) {
      const records = inventoryStore.getTaskRecords(taskId)
      records.forEach(r => inventoryStore.deleteRecord(r.id))
      TinyMessage.success('已清空')
    }
  })
}

function handleComplete() {
  TinyModal.confirm({
    message: '确定要完成此盘点任务吗？',
    title: '确认完成'
  }).then(() => {
    if (currentTask.value) {
      inventoryStore.updateTaskStatus(currentTask.value.id, 'completed')
      TinyMessage.success('任务已完成')
      router.push('/inventory')
    }
  })
}

function handleBack() {
  router.push('/inventory')
}

onMounted(async () => {
  if (!currentTask.value) {
    router.push('/inventory')
    return
  }

  try {
    await cameraStore.startCamera()
  } catch (error) {
    console.error('启动摄像头失败:', error)
  }
})
</script>

<style scoped lang="scss">
.inventory-scan {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.scan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.task-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 14px;
  color: #666;
}

.scan-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 16px;
  min-height: 0;
}

.scan-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scan-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.manual-input {
  display: flex;
  gap: 8px;
}

.results-panel {
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
}

.empty-results {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.records-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.record-icon {
  font-size: 24px;
}

.record-content {
  flex: 1;
}

.record-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.record-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #888;

  .confidence {
    color: #67c23a;
  }
}

.record-actions {
  display: flex;
  gap: 4px;
}

.scan-tips {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-top: 16px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.tip-icon {
  font-size: 16px;
}
</style>
