<template>
  <div
    :class="['media-item', { selected, 'list-mode': isListMode }]"
    @click="handleSelect"
  >
    <div class="media-checkbox" @click.stop>
      <tiny-checkbox v-model="checked" />
    </div>
    
    <div class="media-thumbnail">
      <img v-if="item.type === 'image'" :src="item.url" :alt="item.name" />
      <video v-else :src="item.url" muted />
      <div v-if="item.type === 'video'" class="video-badge">
        🎬
      </div>
    </div>
    
    <div class="media-info">
      <div class="media-name">{{ item.name }}</div>
      <div class="media-meta">
        <span>{{ formatSize(item.size) }}</span>
        <span>{{ formatDate(item.createdAt) }}</span>
      </div>
    </div>
    
    <div class="media-actions">
      <tiny-button
        size="tiny"
        @click.stop="handleDownload"
      >
        下载
      </tiny-button>
      <tiny-button
        size="tiny"
        type="danger"
        @click.stop="handleDelete"
      >
        删除
      </tiny-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@/stores/media'
import { TinyCheckbox, TinyButton } from '@opentiny/vue'
import type { MediaItem } from '@/types/media'

interface Props {
  item: MediaItem
  selected: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: []
  delete: []
  download: []
}>()

const mediaStore = useMediaStore()
const { viewMode } = storeToRefs(mediaStore)

const isListMode = computed(() => viewMode === 'list')

const checked = computed({
  get: () => props.selected,
  set: () => emit('select')
})

function handleSelect() {
  emit('select')
}

function handleDelete() {
  emit('delete')
}

function handleDownload() {
  emit('download')
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}
</script>

<style scoped lang="scss">
.media-item {
  position: relative;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border-color: #526ecc;
    background: #f5f7ff;
  }

  &.list-mode {
    display: flex;
    align-items: center;
    padding: 12px;
    gap: 12px;
  }
}

.media-checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  padding: 4px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;

  .list-mode & {
    position: static;
    padding: 0;
    background: transparent;
  }
}

.media-thumbnail {
  position: relative;
  aspect-ratio: 4/3;
  background: #f0f0f0;
  overflow: hidden;

  .list-mode & {
    width: 120px;
    height: 80px;
    aspect-ratio: auto;
    flex-shrink: 0;
    border-radius: 4px;
  }

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.video-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 2px 6px;
}

.media-info {
  padding: 12px;

  .list-mode & {
    flex: 1;
    padding: 0;
  }
}

.media-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .list-mode & {
    margin-bottom: 4px;
  }
}

.media-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #888;
}

.media-actions {
  display: none;
  position: absolute;
  bottom: 12px;
  right: 12px;
  gap: 8px;

  .media-item:hover & {
    display: flex;
  }

  .list-mode & {
    display: flex;
    position: static;
  }
}
</style>
