<template>
  <div class="inventory-view">
      <div class="view-header">
        <h2 class="view-title">盘点任务管理</h2>
      </div>
      
      <div v-if="showCreateForm" class="create-section">
        <TaskConfig @cancel="showCreateForm = false" />
      </div>
      
      <div v-else class="list-section">
        <TaskList @create="showCreateForm = true" />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskConfig from '@/components/inventory/TaskConfig.vue'
import TaskList from '@/components/inventory/TaskList.vue'

const showCreateForm = ref(false)
</script>

<style scoped lang="scss">
.inventory-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-header {
  margin-bottom: 20px;
}

.view-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.create-section,
.list-section {
  flex: 1;
  overflow: auto;
}
</style>
