<template>
  <div class="camera-view">
    <!-- 左侧：视频预览区域 -->
    <div class="view-main">
      <GridToolbar />
      <div class="preview-area">
        <CameraGrid />
      </div>
    </div>

    <!-- 右侧：控制面板 -->
    <div class="view-sidebar">
      <!-- 通道列表 -->
      <div class="sidebar-section channel-list-section">
        <h3 class="section-title">📹 通道列表</h3>
        <div class="channel-list">
          <div
            v-for="channel in channels"
            :key="channel.id"
            class="channel-item"
            :class="{
              active: channel.id === activeChannelId,
              offline: !channel.isActive,
              recording: channel.isRecording
            }"
            @click="handleSelectChannel(channel.id)"
          >
            <div class="channel-status-dot" :class="{ online: channel.isActive }"></div>
            <div class="channel-info">
              <span class="channel-name">{{ channel.name }}</span>
              <span class="channel-detail">
                {{ channel.isActive ? '在线' : '离线' }}
                <template v-if="channel.ptzSupported"> · PTZ</template>
              </span>
            </div>
            <div class="channel-actions-mini">
              <button
                v-if="channel.isActive"
                class="mini-btn"
                :class="{ rec: channel.isRecording }"
                @click.stop="handleToggleRecording(channel.id)"
                :title="channel.isRecording ? '停止录制' : '开始录制'"
              >
                {{ channel.isRecording ? '⏹' : '⏺' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 云台控制 -->
      <div class="sidebar-section ptz-section">
        <PTZControl />
      </div>

      <!-- 参数调节 -->
      <div class="sidebar-section params-section">
        <CameraParams />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'
import CameraGrid from '@/components/camera/cameragrid.vue'
import GridToolbar from '@/components/camera/gridtoolbar.vue'
import PTZControl from '@/components/camera/ptzcontrol.vue'
import CameraParams from '@/components/camera/CameraParams.vue'

const cameraStore = useCameraStore()
const { channels, activeChannelId } = storeToRefs(cameraStore)

onMounted(() => {
  cameraStore.loadDevices()
})

function handleSelectChannel(channelId: string) {
  cameraStore.selectChannel(channelId)
}

function handleToggleRecording(channelId: string) {
  cameraStore.toggleRecording(channelId)
}
</script>

<style scoped lang="scss">
.camera-view {
  display: flex;
  gap: 8px;
  height: 100%;
  background: #0f0f1a;
  border-radius: 8px;
  overflow: hidden;
}

.view-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.preview-area {
  flex: 1;
  min-height: 0;
}

.view-sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }
}

.sidebar-section {
  background: #1a1a2e;
  border-radius: 8px;
  overflow: hidden;
}

.section-title {
  margin: 0;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  border-bottom: 1px solid #2a2a3e;
}

/* 通道列表 */
.channel-list {
  max-height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-left: 3px solid transparent;

  &:hover {
    background: #252540;
  }

  &.active {
    background: #252540;
    border-left-color: #409eff;
  }

  &.offline {
    opacity: 0.5;
  }

  &.recording {
    .channel-status-dot.online {
      background: #ff4d4f;
      animation: pulse-dot 1s ease-in-out infinite;
    }
  }
}

.channel-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  flex-shrink: 0;

  &.online {
    background: #67c23a;
    box-shadow: 0 0 6px rgba(103, 194, 58, 0.5);
  }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.channel-info {
  flex: 1;
  min-width: 0;
}

.channel-name {
  display: block;
  font-size: 13px;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.channel-detail {
  display: block;
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.channel-actions-mini {
  flex-shrink: 0;
}

.mini-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }

  &.rec {
    color: #ff4d4f;
    opacity: 1;
  }
}

.params-section {
  :deep(.camera-params) {
    background: transparent;
    padding: 12px 16px;
  }
}
</style>
