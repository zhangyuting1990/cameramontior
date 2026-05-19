<template>
  <div class="record-list">
    <div class="list-header">
      <div class="header-left">
        <tiny-button size="small" @click="handleBack">返回</tiny-button>
        <h3 class="list-title">{{ currentTask?.name || '盘点记录' }}</h3>
      </div>
      <div class="header-right">
        <tiny-button size="small" @click="handleExport('csv')">
          导出 CSV
        </tiny-button>
        <tiny-button size="small" @click="handleExport('excel')">
          导出 Excel
        </tiny-button>
      </div>
    </div>

    <div class="stats-summary">
      <div class="stat-item">
        <span class="stat-label">总记录数</span>
        <span class="stat-value">{{ records.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">平均置信度</span>
        <span class="stat-value">{{ averageConfidence }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">识别类型</span>
        <span class="stat-value">{{ getDetectionTypeLabel(currentTask?.detectionType || 'object') }}</span>
      </div>
    </div>

    <div class="filter-bar">
      <tiny-input
        v-model="searchKeyword"
        placeholder="搜索记录..."
        clearable
        style="width: 300px"
      />
      <tiny-select v-model="filterType" placeholder="筛选类型" style="width: 150px">
        <tiny-option label="全部" value="all" />
        <tiny-option label="条形码" value="barcode" />
        <tiny-option label="二维码" value="qrcode" />
        <tiny-option label="物体" value="object" />
      </tiny-select>
    </div>

    <div v-if="filteredRecords.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无记录</div>
    </div>

    <div v-else class="records-table">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>类型</th>
            <th>识别内容</th>
            <th>置信度</th>
            <th>时间</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in filteredRecords" :key="record.id">
            <td>{{ index + 1 }}</td>
            <td>
              <span class="type-badge">
                {{ getRecordTypeLabel(record) }}
              </span>
            </td>
            <td class="record-value">{{ getRecordValue(record) }}</td>
            <td>
              <span :class="['confidence', getConfidenceClass(record.confidence)]">
                {{ record.confidence ? `${record.confidence}%` : '-' }}
              </span>
            </td>
            <td>{{ formatDateTime(record.timestamp) }}</td>
            <td>
              <tiny-input
                v-if="editingId === record.id"
                v-model="editingNotes"
                size="small"
                @blur="handleSaveNotes(record.id)"
                @keyup.enter="handleSaveNotes(record.id)"
              />
              <span v-else @click="handleEditNotes(record)" class="notes-text">
                {{ record.notes || '点击添加备注' }}
              </span>
            </td>
            <td>
              <tiny-button
                v-if="record.imageUrl"
                size="tiny"
                @click="handleViewImage(record.imageUrl!)"
              >
                查看图片
              </tiny-button>
              <tiny-button
                size="tiny"
                type="danger"
                @click="handleDelete(record.id)"
              >
                删除
              </tiny-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <tiny-modal v-model="showImageModal" title="查看图片" width="800px">
      <div class="image-preview">
        <img :src="previewImage" alt="预览图片" />
      </div>
    </tiny-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { TinyButton, TinyInput, TinySelect, TinyOption, TinyModal, TinyMessage } from '@opentiny/vue'
import type { InventoryRecord, DetectionType } from '@/types/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()

const searchKeyword = ref('')
const filterType = ref('all')
const editingId = ref<string | null>(null)
const editingNotes = ref('')
const showImageModal = ref(false)
const previewImage = ref('')

const currentTask = computed(() => inventoryStore.currentTask)
const records = computed(() => inventoryStore.currentTaskRecords)

const averageConfidence = computed(() => {
  if (records.value.length === 0) return 0
  const total = records.value.reduce((sum, r) => sum + (r.confidence || 0), 0)
  return Math.round(total / records.value.length)
})

const filteredRecords = computed(() => {
  let result = [...records.value]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(r =>
      getRecordValue(r).toLowerCase().includes(keyword) ||
      r.notes?.toLowerCase().includes(keyword)
    )
  }

  if (filterType.value !== 'all') {
    result = result.filter(r => {
      if (filterType.value === 'barcode') return !!r.barcode
      if (filterType.value === 'qrcode') return !!r.qrcode
      if (filterType.value === 'object') return !!r.detectedObject
      return true
    })
  }

  return result
})

function getDetectionTypeLabel(type: DetectionType): string {
  const labels: Record<DetectionType, string> = {
    object: '物体识别',
    barcode: '条形码',
    qrcode: '二维码',
    face: '人脸'
  }
  return labels[type]
}

function getRecordTypeLabel(record: InventoryRecord): string {
  if (record.barcode) return '条形码'
  if (record.qrcode) return '二维码'
  if (record.detectedObject) return '物体'
  if (record.imageUrl) return '图片'
  return '未知'
}

function getRecordValue(record: InventoryRecord): string {
  return record.barcode || record.qrcode || record.detectedObject || '-'
}

function getConfidenceClass(confidence?: number): string {
  if (!confidence) return ''
  if (confidence >= 90) return 'high'
  if (confidence >= 70) return 'medium'
  return 'low'
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN')
}

function handleEditNotes(record: InventoryRecord) {
  editingId.value = record.id
  editingNotes.value = record.notes || ''
}

function handleSaveNotes(recordId: string) {
  inventoryStore.updateRecordNotes(recordId, editingNotes.value)
  editingId.value = null
  TinyMessage.success('备注已保存')
}

function handleViewImage(imageUrl: string) {
  previewImage.value = imageUrl
  showImageModal.value = true
}

function handleDelete(recordId: string) {
  TinyModal.confirm({
    message: '确定要删除此记录吗？',
    title: '确认删除'
  }).then(() => {
    inventoryStore.deleteRecord(recordId)
    TinyMessage.success('删除成功')
  })
}

function handleExport(format: 'csv' | 'excel') {
  if (currentTask.value) {
    inventoryStore.downloadExport({
      format,
      taskId: currentTask.value.id
    })
    TinyMessage.success(`导出${format.toUpperCase()}成功`)
  }
}

function handleBack() {
  router.push('/inventory')
}
</script>

<style scoped lang="scss">
.record-list {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.list-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  gap: 8px;
}

.stats-summary {
  display: flex;
  gap: 24px;
  padding: 16px 20px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .stat-label {
    font-size: 12px;
    color: #888;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.records-table {
  flex: 1;
  overflow: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      background: #f5f7fa;
      font-weight: 600;
      font-size: 13px;
      color: #333;
    }

    td {
      font-size: 13px;
      color: #666;
    }

    tbody tr:hover {
      background: #fafafa;
    }
  }
}

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
}

.record-value {
  font-weight: 500;
  color: #333;
}

.confidence {
  font-weight: 600;

  &.high {
    color: #67c23a;
  }

  &.medium {
    color: #e6a23c;
  }

  &.low {
    color: #f56c6c;
  }
}

.notes-text {
  cursor: pointer;
  color: #909399;

  &:hover {
    color: #409eff;
  }
}

.image-preview {
  text-align: center;

  img {
    max-width: 100%;
    max-height: 600px;
    border-radius: 8px;
  }
}
</style>
