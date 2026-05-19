import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mediaService } from '@/services/media.service'
import type { MediaItem, MediaType } from '@/types/media'

export const useMediaStore = defineStore('media', () => {
  const items = ref<MediaItem[]>([])
  const selectedItems = ref<string[]>([])
  const isLoading = ref(false)
  const viewMode = ref<'grid' | 'list'>('grid')
  const filterType = ref<'all' | MediaType>('all')
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)

  const filteredItems = computed(() => {
    if (filterType.value === 'all') {
      return items.value
    }
    return items.value.filter(item => item.type === filterType.value)
  })

  const hasSelected = computed(() => selectedItems.value.length > 0)

  async function loadMedia() {
    isLoading.value = true
    try {
      const result = mediaService.getMediaList(
        filterType.value,
        currentPage.value,
        pageSize.value
      )
      items.value = result.items
      total.value = result.total
    } catch (error) {
      console.error('加载媒体失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function saveMedia(file: Blob, metadata?: any) {
    try {
      const item = await mediaService.saveMedia(file, metadata)
      items.value.unshift(item)
      return item
    } catch (error) {
      console.error('保存媒体失败:', error)
      throw error
    }
  }

  async function deleteMedia(id: string) {
    try {
      await mediaService.deleteMedia(id)
      items.value = items.value.filter(item => item.id !== id)
      selectedItems.value = selectedItems.value.filter(itemId => itemId !== id)
    } catch (error) {
      console.error('删除媒体失败:', error)
      throw error
    }
  }

  async function batchDelete() {
    try {
      await mediaService.batchDelete(selectedItems.value)
      items.value = items.value.filter(
        item => !selectedItems.value.includes(item.id)
      )
      selectedItems.value = []
    } catch (error) {
      console.error('批量删除失败:', error)
      throw error
    }
  }

  async function downloadMedia(id: string) {
    try {
      await mediaService.downloadMedia(id)
    } catch (error) {
      console.error('下载媒体失败:', error)
      throw error
    }
  }

  function toggleSelection(id: string) {
    const index = selectedItems.value.indexOf(id)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    } else {
      selectedItems.value.push(id)
    }
  }

  function selectAll() {
    selectedItems.value = filteredItems.value.map(item => item.id)
  }

  function clearSelection() {
    selectedItems.value = []
  }

  function setFilterType(type: 'all' | MediaType) {
    filterType.value = type
    currentPage.value = 1
    loadMedia()
  }

  function setViewMode(mode: 'grid' | 'list') {
    viewMode.value = mode
  }

  function setPage(page: number) {
    currentPage.value = page
    loadMedia()
  }

  return {
    items,
    selectedItems,
    isLoading,
    viewMode,
    filterType,
    currentPage,
    pageSize,
    total,
    filteredItems,
    hasSelected,
    loadMedia,
    saveMedia,
    deleteMedia,
    batchDelete,
    downloadMedia,
    toggleSelection,
    selectAll,
    clearSelection,
    setFilterType,
    setViewMode,
    setPage
  }
})
