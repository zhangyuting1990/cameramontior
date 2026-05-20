<template>
  <div class="grid-toolbar">
    <div class="toolbar-left">
      <div class="layout-group">
        <button
          v-for="layout in layouts"
          :key="layout.value"
          class="layout-btn"
          :class="{ active: gridLayout === layout.value }"
          :title="layout.label"
          @click="handleSetLayout(layout.value)"
        >
          <div class="layout-icon" :style="layout.iconStyle">
            <span v-for="i in layout.cells" :key="i" class="icon-cell"></span>
          </div>
          <span class="layout-label">{{ layout.label }}</span>
        </button>
      </div>
    </div>

    <div class="toolbar-center">
      <span class="toolbar-info">
        {{ onlineCount }} 在线 / {{ totalCount }} 总计
      </span>
    </div>

    <div class="toolbar-right">
      <button
        class="tool-btn"
        :class="{ active: isMaximized }"
        title="全屏切换"
        @click="handleToggleMaximize"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <template v-if="isMaximized">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </template>
          <template v-else>
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </template>
        </svg>
      </button>
      <button class="tool-btn" title="截图所有通道" @click="handleCaptureAll">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>
      <button class="tool-btn" title="添加摄像头" @click="handleAddDevice">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'
import type { GridLayout } from '@/types/camera'

const cameraStore = useCameraStore()
const { channels, gridLayout, isMaximized } = storeToRefs(cameraStore)

const layouts: { value: GridLayout; label: string; cells: number; iconStyle: Record<string, string> }[] = [
  {
    value: '1x1',
    label: '1画面',
    cells: 1,
    iconStyle: { 'grid-template-columns': '1fr', 'grid-template-rows': '1fr' }
  },
  {
    value: '2x2',
    label: '4画面',
    cells: 4,
    iconStyle: { 'grid-template-columns': 'repeat(2, 1fr)', 'grid-template-rows': 'repeat(2, 1fr)' }
  },
  {
    value: '3x3',
    label: '9画面',
    cells: 9,
    iconStyle: { 'grid-template-columns': 'repeat(3, 1fr)', 'grid-template-rows': 'repeat(3, 1fr)' }
  },
  {
    value: '4x4',
    label: '16画面',
    cells: 16,
    iconStyle: { 'grid-template-columns': 'repeat(4, 1fr)', 'grid-template-rows': 'repeat(4, 1fr)' }
  }
]

const onlineCount = computed(() => channels.value.filter(ch => ch.isActive).length)
const totalCount = computed(() => channels.value.length)

function handleSetLayout(layout: GridLayout) {
  cameraStore.setGridLayout(layout)
}

function handleToggleMaximize() {
  cameraStore.toggleMaximize()
}

function handleCaptureAll() {
  // TODO: 截图所有通道
  console.log('Capture all channels')
}

function handleAddDevice() {
  // TODO: 打开添加设备弹窗
  console.log('Add device')
}
</script>

<style scoped lang="scss">
.grid-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #1a1a2e;
  border-radius: 8px;
  margin-bottom: 8px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-center {
  display: flex;
  align-items: center;
}

.toolbar-info {
  font-size: 12px;
  color: #888;
  padding: 4px 12px;
  background: #252540;
  border-radius: 12px;
}

.layout-group {
  display: flex;
  gap: 4px;
}

.layout-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #252540;
    color: #ccc;
  }

  &.active {
    background: #252540;
    border-color: #409eff;
    color: #409eff;
  }
}

.layout-icon {
  display: grid;
  gap: 2px;
  width: 20px;
  height: 20px;
}

.icon-cell {
  background: currentColor;
  border-radius: 1px;
  opacity: 0.7;
}

.layout-label {
  font-size: 10px;
  white-space: nowrap;
}

.tool-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #252540;
    color: #ccc;
  }

  &.active {
    background: #252540;
    border-color: #409eff;
    color: #409eff;
  }
}
</style>
