<template>
  <div class="task-config">
    <div class="config-header">
      <h3 class="config-title">创建盘点任务</h3>
    </div>

    <div class="config-form">
      <div class="form-item">
        <label class="form-label">任务名称 <span class="required">*</span></label>
        <tiny-input
          v-model="formData.name"
          placeholder="请输入任务名称"
          :maxlength="100"
        />
      </div>

      <div class="form-item">
        <label class="form-label">任务描述</label>
        <tiny-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入任务描述（可选）"
          :rows="3"
          :maxlength="500"
        />
      </div>

      <div class="form-item">
        <label class="form-label">识别类型 <span class="required">*</span></label>
        <tiny-select v-model="formData.detectionType" placeholder="选择识别类型">
          <tiny-option label="物体识别" value="object" />
          <tiny-option label="条形码扫描" value="barcode" />
          <tiny-option label="二维码扫描" value="qrcode" />
          <tiny-option label="人脸识别" value="face" />
        </tiny-select>
      </div>

      <div class="form-item">
        <label class="form-label">预期数量</label>
        <tiny-numeric
          v-model="formData.totalItems"
          :min="0"
          :max="99999"
          placeholder="预计盘点数量（可选）"
        />
      </div>

      <div class="form-item">
        <label class="form-label">自动保存</label>
        <tiny-switch v-model="formData.autoSave" />
        <span class="switch-hint">开启后识别结果自动保存</span>
      </div>

      <div class="form-actions">
        <tiny-button type="primary" @click="handleCreate">
          创建任务
        </tiny-button>
        <tiny-button @click="handleReset">重置</tiny-button>
      </div>
    </div>

    <div v-if="createdTask" class="created-task">
      <div class="success-message">
        <span class="success-icon">✓</span>
        任务创建成功！
      </div>
      <div class="task-info">
        <div><strong>任务ID:</strong> {{ createdTask.id }}</div>
        <div><strong>任务名称:</strong> {{ createdTask.name }}</div>
        <div><strong>识别类型:</strong> {{ getDetectionTypeLabel(createdTask.detectionType) }}</div>
        <div><strong>创建时间:</strong> {{ formatDate(createdTask.createdAt) }}</div>
      </div>
      <tiny-button type="primary" @click="handleStartTask">
        开始盘点
      </tiny-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useRouter } from 'vue-router'
import { TinyInput, TinySelect, TinyOption, TinyNumeric, TinySwitch, TinyButton, TinyMessage } from '@opentiny/vue'
import type { DetectionType, InventoryTask } from '@/types/inventory'

const inventoryStore = useInventoryStore()
const router = useRouter()

const formData = reactive({
  name: '',
  description: '',
  detectionType: 'object' as DetectionType,
  totalItems: 0,
  autoSave: true
})

const createdTask = ref<InventoryTask | null>(null)

function getDetectionTypeLabel(type: DetectionType): string {
  const labels: Record<DetectionType, string> = {
    object: '物体识别',
    barcode: '条形码扫描',
    qrcode: '二维码扫描',
    face: '人脸识别'
  }
  return labels[type]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN')
}

function handleCreate() {
  if (!formData.name.trim()) {
    TinyMessage.warning('请输入任务名称')
    return
  }

  try {
    createdTask.value = inventoryStore.createTask(
      formData.name,
      formData.detectionType,
      {
        description: formData.description || undefined,
        totalItems: formData.totalItems || undefined,
        autoSave: formData.autoSave
      }
    )
    TinyMessage.success('任务创建成功')
  } catch (error) {
    TinyMessage.error('创建失败')
  }
}

function handleReset() {
  formData.name = ''
  formData.description = ''
  formData.detectionType = 'object'
  formData.totalItems = 0
  formData.autoSave = true
  createdTask.value = null
}

function handleStartTask() {
  if (createdTask.value) {
    inventoryStore.setCurrentTask(createdTask.value.id)
    inventoryStore.updateTaskStatus(createdTask.value.id, 'in_progress')
    router.push('/inventory/scan')
  }
}
</script>

<style scoped lang="scss">
.task-config {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.config-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.config-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;

  .required {
    color: #f56c6c;
    margin-left: 4px;
  }
}

.switch-hint {
  font-size: 12px;
  color: #888;
  margin-left: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.created-task {
  margin-top: 24px;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #91c5ff;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.success-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: white;
  border-radius: 50%;
  font-size: 14px;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
}
</style>
