import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UploadConfig {
  autoUpload: boolean
  maxFileSize: number
}

export const useSettingStore = defineStore('setting', () => {
  const theme = ref<'light' | 'dark'>('light')
  const language = ref<'zh-CN' | 'en-US'>('zh-CN')
  const defaultCamera = ref<string | null>(null)
  const autoSave = ref(true)
  const uploadConfig = ref<UploadConfig>({
    autoUpload: false,
    maxFileSize: 100 * 1024 * 1024
  })

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
  }

  function setLanguage(newLanguage: 'zh-CN' | 'en-US') {
    language.value = newLanguage
  }

  function setDefaultCamera(cameraId: string | null) {
    defaultCamera.value = cameraId
  }

  function setAutoSave(value: boolean) {
    autoSave.value = value
  }

  function updateUploadConfig(config: Partial<UploadConfig>) {
    uploadConfig.value = { ...uploadConfig.value, ...config }
  }

  return {
    theme,
    language,
    defaultCamera,
    autoSave,
    uploadConfig,
    setTheme,
    setLanguage,
    setDefaultCamera,
    setAutoSave,
    updateUploadConfig
  }
})
