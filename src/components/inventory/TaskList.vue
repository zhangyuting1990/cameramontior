<template>
  <div class="task-list">
    <div class="list-header">
      <h3 class="list-title">盘点任务列表</h3>
      <div class="list-actions">
        <tiny-button type="primary" size="small" @click="$emit('create')">
          新建任务
        </tiny-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">{{ taskStats.totalTasks }}</div>
        <div class="stat-label">总任务数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ taskStats.completedTasks }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ taskStats.totalRecords }}</div>
        <div class="stat-label">盘点记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ taskStats.averageAccuracy }}%</div>
        <div class="stat-label">平均准确率</div>
      </div>
    </div>

    <div class="filter-tabs">
      <tiny-button-group>
        <tiny-button
          v-for="tab in tabs"
          :key="tab.value"
          :type="activeTab === tab.value ? 'primary' : ''"
          @click="activeTab = tab.value"
        >
          {{ tab.label }} ({{ getTabCount(tab.value) }})
        </tiny-button>
      </tiny-button-group>
    </div>

    <div v-if="filteredTasks.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无任务</div>
      <tiny-button type="primary" @click="$emit('create')">创建第一个任务</tiny-button>
    </div>

    <div v-else class="tasks-grid">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        :class="['task-card', `status-${task.status}`]"
      >
        <div class="task-header">
          <div class="task-status">
            <span :class="['status-badge', task.status]">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
          <div class="task-actions">
            <tiny-button
              v-if="task.status === 'pending'"
              type="primary"
              size="tiny"
              @click="handleStart(task.id)"
            >
              开始
            </tiny-button>
            <tiny-button
              v-if="task.status === 'in_progress'"
              type="success"
              size="tiny"
              @click="handleContinue(task.id)"
            >
              继续
            </tiny-button>
            <tiny-button
              v-if="task.status === 'in_progress'"
              type="warning"
              size="tiny"
              @click="handleComplete(task.id)"
            >
              完成
            </tiny-button>
            <tiny-button
              type="danger"
              size="tiny"
              @click="handleDelete(task.id)"
            >
              删除
            </tiny-button>
          </div>
        </div>

        <div class="task-body">
          <h4 class="task-name">{{ task.name }}</h4>
          <p v-if="task.description" class="task-desc">{{ task.description }}</p>
          
          <div class="task-meta">
            <span class="meta-item">
              <span class="meta-icon">📷</span>
              {{ getDetectionTypeLabel(task.detectionType) }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              {{ formatDate(task.createdAt) }}
            </span>
          </div>

          <div class="task-progress">
            <div class="progress-info">
              <span>进度</span>
              <span>{{ task.scannedItems }} / {{ task.totalItems || '∞' }}</span>
            </div>
            <tiny-progress
              :percentage="task.totalItems ? Math.round((task.scannedItems / task.totalItems) * 100) : 0"
              :show-text="false"
            />
          </div>
        </div>

        <div class="task-footer">
          <tiny-button size="tiny" @click="handleViewRecords(task.id)">
            查看记录
          </tiny-button>
          <tiny-button size="tiny" @click="handleExport(task.id)">
            导出数据
          </tiny-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useRouter } from 'vue-router'
import { TinyButton, TinyButtonGroup, TinyProgress, TinyMessage, TinyModal } from '@opentiny/vue'
import type { InventoryStatus, DetectionType } from '@/types/inventory'

defineEmits<{
  create: []
}>()

const inventoryStore = useInventoryStore()
const router = useRouter()

const activeTab = ref<InventoryStatus | 'all'>('all')

const tabs = [
  { label: '全部', value: 'all' as const },
  { label: '待开始', value: 'pending' as const },
  { label: '进行中', value: 'in_progress' as const },
  { label: '已完成', value: 'completed' as const }
]

const taskStats = computed(() => inventoryStore.taskStats)

const filteredTasks = computed(() => {
  if (activeTab.value === 'all') {
    return inventoryStore.tasks
  }
  return inventoryStore.tasksByStatus[activeTab.value]
})

function getTabCount(status: InventoryStatus | 'all'): number {
  if (status === 'all') {
    return inventoryStore.tasks.length
  }
  return inventoryStore.tasksByStatus[status].length
}

function getStatusLabel(status: InventoryStatus): string {
  const labels: Record<InventoryStatus, string> = {
    pending: '待开始',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return labels[status]
}

function getDetectionTypeLabel(type: DetectionType): string {
  const labels: Record<DetectionType, string> = {
    object: '物体识别',
    barcode: '条形码',
    qrcode: '二维码',
    face: '人脸'
  }
  return labels[type]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function handleStart(taskId: string) {
  inventoryStore.setCurrentTask(taskId)
  inventoryStore.updateTaskStatus(taskId, 'in_progress')
  router.push('/inventory/scan')
}

function handleContinue(taskId: string) {
  inventoryStore.setCurrentTask(taskId)
  router.push('/inventory/scan')
}

function handleComplete(taskId: string) {
  TinyModal.confirm({
    message: '确定要完成此任务吗？',
    title: '确认完成'
  }).then(() => {
    inventoryStore.updateTaskStatus(taskId, 'completed')
    TinyMessage.success('任务已完成')
  })
}

function handleDelete(taskId: string) {
  TinyModal.confirm({
    message: '确定要删除此任务吗？此操作不可恢复！',
    title: '确认删除'
  }).then(() => {
    inventoryStore.deleteTask(taskId)
    TinyMessage.success('删除成功')
  })
}

function handleViewRecords(taskId: string) {
  inventoryStore.setCurrentTask(taskId)
  router.push('/inventory/records')
}

function handleExport(taskId: string) {
  inventoryStore.downloadExport({
    format: 'csv',
    taskId
  })
  TinyMessage.success('导出成功')
}
</script>

<style scoped lang="scss">
.task-list {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  text-align: center;

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    opacity: 0.9;
  }
}

.filter-tabs {
  margin-bottom: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #888;
  margin-bottom: 20px;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.task-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.status-completed {
    border-left: 4px solid #67c23a;
  }

  &.status-in_progress {
    border-left: 4px solid #409eff;
  }

  &.status-pending {
    border-left: 4px solid #909399;
  }
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  &.pending {
    background: #909399;
    color: white;
  }

  &.in_progress {
    background: #409eff;
    color: white;
  }

  &.completed {
    background: #67c23a;
    color: white;
  }

  &.cancelled {
    background: #f56c6c;
    color: white;
  }
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-body {
  padding: 16px;
}

.task-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.task-desc {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #888;
}

.meta-icon {
  font-size: 14px;
}

.task-progress {
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
    color: #666;
  }
}

.task-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
}
</style>
