<template>
  <div class="media-gallery">
    <div class="gallery-header">
      <div class="gallery-title">媒体库</div>
      <div class="gallery-actions">
        <tiny-button-group>
          <tiny-button
            :type="viewMode === 'grid' ? 'primary' : ''"
            @click="setViewMode('grid')"
          >
            网格
          </tiny-button>
          <tiny-button
            :type="viewMode === 'list' ? 'primary' : ''"
            @click="setViewMode('list')"
          >
            列表
          </tiny-button>
        </tiny-button-group>
        
        <tiny-select
          v-model="filterType"
          @change="handleFilterChange"
          style="width: 120px; margin-left: 12px"
        >
          <tiny-option label="全部" value="all" />
          <tiny-option label="图片" value="image" />
          <tiny-option label="视频" value="video" />
        </tiny-select>
      </div>
    </div>

    <div v-if="hasSelected" class="batch-actions">
      <tiny-button type="danger" size="small" @click="handleBatchDelete">
        批量删除 ({{ selectedItems.length }})
      </tiny-button>
      <tiny-button size="small" @click="clearSelection">取消选择</tiny-button>
    </div>

    <div v-if="isLoading" class="loading">加载中...</div>
    
    <div v-else-if="items.length === 0" class="empty">
      <div class="empty-icon">📁</div>
      <div class="empty-text">暂无媒体文件</div>
    </div>

    <div
      v-else
      :class="['gallery-content', `viewMode === 'grid' ? 'grid-view' : 'list-view'`]" 
    >
      <MediaItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :selected="selectedItems.includes(item.id)"
        @select="toggleSelection(item.id)"
        @delete="handleDelete(item.id)"
        @download="handleDownload(item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@/stores/media'
import { TinyButton, TinyButtonGroup, TinySelect, TinyOption, TinyMessage } from '@opentiny/vue'
import MediaItem from './MediaItem.vue'

const mediaStore = useMediaStore()
const {
  items,
  selectedItems,
  isLoading,
  viewMode,
  filterType,
  hasSelected
} = storeToRefs(mediaStore)
const {
  loadMedia,
  deleteMedia,
  batchDelete,
  downloadMedia,
  toggleSelection,
  clearSelection,
  setViewMode,
  setFilterType
} = mediaStore

function handleFilterChange(type: string) {
  setFilterType(type as any)
}

async function handleDelete(id: string) {
  try {
    await deleteMedia(id)
    TinyMessage.success('删除成功')
  } catch (error) {
    TinyMessage.error('删除失败')
  }
}

async function handleBatchDelete() {
  try {
    await batchDelete()
    TinyMessage.success('批量删除成功')
  } catch (error) {
    TinyMessage.error('批量删除失败')
  }
}

async function handleDownload(id: string) {
  try {
    await downloadMedia(id)
    TinyMessage.success('下载开始')
  } catch (error) {
    TinyMessage.error('下载失败')
  }
}

onMounted(() => {
  loadMedia()
})
</script>

<style scoped lang="scss">
.media-gallery {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.gallery-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.gallery-actions {
  display: flex;
  align-items: center;
}

.batch-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff3f3;
  border-radius: 4px;
}

.loading,
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.gallery-content {
  flex: 1;
  overflow-y: auto;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.list-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
