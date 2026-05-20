<template>
  <div class="ptz-control" v-if="channel">
    <h3 class="ptz-title">☁ 云台控制</h3>
    <div class="ptz-channel-name">{{ channel.name }}</div>

    <!-- 方向控制 -->
    <div class="direction-pad">
      <button
        class="dir-btn dir-up"
        @mousedown="startMove('up')"
        @mouseup="stopMove"
        @mouseleave="stopMove"
        title="上"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
      <button
        class="dir-btn dir-left"
        @mousedown="startMove('left')"
        @mouseup="stopMove"
        @mouseleave="stopMove"
        title="左"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <div class="dir-center">
        <div class="center-dot"></div>
      </div>
      <button
        class="dir-btn dir-right"
        @mousedown="startMove('right')"
        @mouseup="stopMove"
        @mouseleave="stopMove"
        title="右"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
      <button
        class="dir-btn dir-down"
        @mousedown="startMove('down')"
        @mouseup="stopMove"
        @mouseleave="stopMove"
        title="下"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </button>
    </div>

    <!-- 变焦控制 -->
    <div class="zoom-control">
      <div class="zoom-label">
        <span>变焦</span>
        <span class="zoom-value">{{ channel.ptzParams.zoom.toFixed(1) }}x</span>
      </div>
      <div class="zoom-buttons">
        <button class="zoom-btn zoom-out" @click="handleZoomOut" title="缩小">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <input
          type="range"
          class="zoom-slider"
          :min="1"
          :max="20"
          :step="0.5"
          :value="channel.ptzParams.zoom"
          @input="handleZoomChange"
        />
        <button class="zoom-btn zoom-in" @click="handleZoomIn" title="放大">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 速度控制 -->
    <div class="speed-control">
      <div class="speed-label">
        <span>速度</span>
        <span class="speed-value">{{ channel.ptzParams.speed }}</span>
      </div>
      <input
        type="range"
        class="speed-slider"
        :min="10"
        :max="100"
        :step="5"
        :value="channel.ptzParams.speed"
        @input="handleSpeedChange"
      />
    </div>

    <!-- 预置位 -->
    <div class="preset-section">
      <div class="preset-header">
        <span class="preset-title">预置位</span>
        <button class="preset-add-btn" @click="handleAddPreset">+ 添加</button>
      </div>
      <div class="preset-list">
        <div
          v-for="preset in channel.presets"
          :key="preset.id"
          class="preset-item"
          @click="handleGotoPreset(preset.id)"
        >
          <span class="preset-name">{{ preset.name }}</span>
          <span class="preset-info">P:{{ preset.pan }}° T:{{ preset.tilt }}° Z:{{ preset.zoom }}x</span>
        </div>
        <div v-if="channel.presets.length === 0" class="preset-empty">
          暂无预置位
        </div>
      </div>
    </div>

    <!-- 当前位置信息 -->
    <div class="position-info">
      <div class="info-title">当前位置</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">水平</span>
          <span class="info-value">{{ channel.ptzParams.pan.toFixed(1) }}°</span>
        </div>
        <div class="info-item">
          <span class="info-label">垂直</span>
          <span class="info-value">{{ channel.ptzParams.tilt.toFixed(1) }}°</span>
        </div>
        <div class="info-item">
          <span class="info-label">变焦</span>
          <span class="info-value">{{ channel.ptzParams.zoom.toFixed(1) }}x</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="ptz-control ptz-empty">
    <div class="empty-icon">☁</div>
    <div class="empty-text">请选择一个通道</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'

const cameraStore = useCameraStore()
const { activeChannel } = storeToRefs(cameraStore)

const channel = computed(() => activeChannel.value)

let moveTimer: number | null = null

function startMove(direction: 'up' | 'down' | 'left' | 'right') {
  if (!channel.value) return
  cameraStore.ptzMove(channel.value.id, direction)
  moveTimer = window.setInterval(() => {
    if (channel.value) {
      cameraStore.ptzMove(channel.value.id, direction)
    }
  }, 200)
}

function stopMove() {
  if (moveTimer) {
    clearInterval(moveTimer)
    moveTimer = null
  }
  if (channel.value) {
    cameraStore.ptzStop(channel.value.id)
  }
}

function handleZoomIn() {
  if (!channel.value) return
  cameraStore.ptzZoom(channel.value.id, channel.value.ptzParams.zoom + 0.5)
}

function handleZoomOut() {
  if (!channel.value) return
  cameraStore.ptzZoom(channel.value.id, channel.value.ptzParams.zoom - 0.5)
}

function handleZoomChange(e: Event) {
  if (!channel.value) return
  const value = parseFloat((e.target as HTMLInputElement).value)
  cameraStore.ptzZoom(channel.value.id, value)
}

function handleSpeedChange(e: Event) {
  if (!channel.value) return
  const value = parseInt((e.target as HTMLInputElement).value)
  cameraStore.setPtzSpeed(channel.value.id, value)
}

function handleGotoPreset(presetId: string) {
  if (!channel.value) return
  cameraStore.ptzGotoPreset(channel.value.id, presetId)
}

const newPresetName = ref('')

function handleAddPreset() {
  if (!channel.value) return
  const name = `预置位${channel.value.presets.length + 1}`
  cameraStore.ptzSetPreset(channel.value.id, name)
}
</script>

<style scoped lang="scss">
.ptz-control {
  padding: 16px;
  background: #1a1a2e;
  border-radius: 8px;
  color: #e0e0e0;
}

.ptz-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.ptz-channel-name {
  font-size: 12px;
  color: #409eff;
  margin-bottom: 16px;
}

/* 方向控制 */
.direction-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 6px;
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
}

.dir-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #252540;
  border: 1px solid #333;
  border-radius: 8px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-user-select: none;
  user-select: none;

  &:hover {
    background: #2d2d50;
    color: #409eff;
    border-color: #409eff;
  }

  &:active {
    background: #409eff;
    color: #fff;
    transform: scale(0.95);
  }
}

.dir-up { grid-column: 2; grid-row: 1; }
.dir-left { grid-column: 1; grid-row: 2; }
.dir-right { grid-column: 3; grid-row: 2; }
.dir-down { grid-column: 2; grid-row: 3; }

.dir-center {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #252540;
  border-radius: 8px;
  border: 1px solid #333;
}

.center-dot {
  width: 12px;
  height: 12px;
  background: #409eff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.5);
}

/* 变焦控制 */
.zoom-control {
  margin-bottom: 16px;
}

.zoom-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 8px;
  color: #aaa;
}

.zoom-value {
  color: #409eff;
  font-weight: 600;
}

.zoom-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #252540;
  border: 1px solid #333;
  border-radius: 6px;
  color: #ccc;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover {
    background: #2d2d50;
    color: #409eff;
    border-color: #409eff;
  }

  &:active {
    background: #409eff;
    color: #fff;
  }
}

.zoom-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #409eff;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(64, 158, 255, 0.5);
  }
}

/* 速度控制 */
.speed-control {
  margin-bottom: 16px;
}

.speed-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 8px;
  color: #aaa;
}

.speed-value {
  color: #67c23a;
  font-weight: 600;
}

.speed-slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #67c23a;
    border-radius: 50%;
    cursor: pointer;
  }
}

/* 预置位 */
.preset-section {
  margin-bottom: 16px;
}

.preset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.preset-title {
  font-size: 12px;
  color: #aaa;
}

.preset-add-btn {
  font-size: 11px;
  padding: 2px 8px;
  background: transparent;
  border: 1px solid #409eff;
  border-radius: 4px;
  color: #409eff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #409eff;
    color: #fff;
  }
}

.preset-list {
  max-height: 120px;
  overflow-y: auto;
}

.preset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #252540;
  }
}

.preset-name {
  font-size: 12px;
  color: #e0e0e0;
}

.preset-info {
  font-size: 10px;
  color: #888;
}

.preset-empty {
  text-align: center;
  font-size: 12px;
  color: #666;
  padding: 12px;
}

/* 位置信息 */
.position-info {
  padding-top: 12px;
  border-top: 1px solid #2a2a3e;
}

.info-title {
  font-size: 12px;
  color: #aaa;
  margin-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.info-item {
  text-align: center;
  padding: 6px;
  background: #252540;
  border-radius: 4px;
}

.info-label {
  display: block;
  font-size: 10px;
  color: #888;
  margin-bottom: 2px;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
}

/* 空状态 */
.ptz-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.3;
}

.empty-text {
  font-size: 14px;
  color: #666;
}
</style>
