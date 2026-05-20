<template>
  <div class="camera-grid" :style="gridStyle">
    <div
      v-for="channel in displayChannels"
      :key="channel.id"
      class="grid-cell"
      :class="{ active: channel.id === activeChannelId, offline: !channel.isActive }"
      @click="handleSelectChannel(channel.id)"
      @dblclick="handleMaximize(channel.id)"
    >
      <div class="cell-video">
        <video
          v-if="channel.isActive"
          class="video-element"
          autoplay
          playsinline
          muted
        ></video>
        <div v-else class="cell-placeholder">
          <div class="placeholder-icon">📹</div>
          <div class="placeholder-text">信号中断</div>
        </div>
      </div>

      <!-- 通道信息栏 -->
      <div class="cell-header">
        <span class="channel-name">{{ channel.name }}</span>
        <div class="channel-badges">
          <span v-if="channel.isRecording" class="badge recording-badge">● REC</span>
          <span v-if="channel.ptzSupported" class="badge ptz-badge">PTZ</span>
        </div>
      </div>

      <!-- 选中高亮边框 -->
      <div v-if="channel.id === activeChannelId" class="active-border"></div>

      <!-- 操作按钮 -->
      <div class="cell-actions">
        <button class="action-btn" title="放大" @click.stop="handleMaximize(channel.id)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
        <button
          class="action-btn"
          :class="{ recording: channel.isRecording }"
          :title="channel.isRecording ? '停止录制' : '开始录制'"
          @click.stop="handleToggleRecording(channel.id)"
        >
          <svg v-if="!channel.isRecording" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        </button>
        <button class="action-btn" title="截图" @click.stop="handleCapture(channel.id)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 空白通道占位 -->
    <div
      v-for="i in emptySlots"
      :key="`empty-${i}`"
      class="grid-cell empty-cell"
    >
      <div class="cell-placeholder">
        <div class="placeholder-icon">➕</div>
        <div class="placeholder-text">添加摄像头</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'

const cameraStore = useCameraStore()
const { channels, gridLayout, activeChannelId, gridCols, maxChannels } = storeToRefs(cameraStore)

const gridStyle = computed(() => ({
  'grid-template-columns': `repeat(${gridCols.value}, 1fr)`,
  'grid-template-rows': `repeat(${gridCols.value}, 1fr)`
}))

const displayChannels = computed(() =>
  channels.value.slice(0, maxChannels.value)
)

const emptySlots = computed(() => {
  const diff = maxChannels.value - channels.value.length
  return diff > 0 ? diff : 0
})

function handleSelectChannel(channelId: string) {
  cameraStore.selectChannel(channelId)
}

function handleMaximize(channelId: string) {
  cameraStore.maximizeChannel(channelId)
}

function handleToggleRecording(channelId: string) {
  cameraStore.toggleRecording(channelId)
}

function handleCapture(channelId: string) {
  // TODO: 截图功能
  console.log('Capture:', channelId)
}
</script>

<style scoped lang="scss">
.camera-grid {
  display: grid;
  gap: 4px;
  width: 100%;
  height: 100%;
  background: #0a0a0a;
  border-radius: 8px;
  overflow: hidden;
  padding: 4px;
}

.grid-cell {
  position: relative;
  background: #111;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: rgba(64, 158, 255, 0.5);

    .cell-actions {
      opacity: 1;
    }
  }

  &.active {
    border-color: #409eff;
  }

  &.offline {
    opacity: 0.6;
  }
}

.cell-video {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.cell-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #555;
}

.placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 12px;
  color: #666;
}

.cell-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%);
  z-index: 2;
}

.channel-name {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.channel-badges {
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.recording-badge {
  background: #ff4d4f;
  color: #fff;
  animation: blink 1s ease-in-out infinite;
}

.ptz-badge {
  background: rgba(64, 158, 255, 0.8);
  color: #fff;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.active-border {
  position: absolute;
  inset: 0;
  border: 2px solid #409eff;
  border-radius: 4px;
  pointer-events: none;
  z-index: 3;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.4);
}

.cell-actions {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 4;
}

.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(64, 158, 255, 0.8);
  }

  &.recording {
    color: #ff4d4f;
  }
}

.empty-cell {
  border: 2px dashed #333;
  cursor: default;

  &:hover {
    border-color: #444;
  }
}
</style>
