<template>
  <div class="ai-settings">
    <div class="settings-header">
      <h3 class="settings-title">AI 识别设置</h3>
    </div>

    <div class="settings-content">
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">启用 AI 识别</div>
          <div class="setting-desc">开启后支持物体识别、条形码/二维码扫描、人脸识别等智能功能</div>
        </div>
        <tiny-switch v-model="settings.enabled" />
      </div>

      <div v-if="settings.enabled" class="setting-section">
        <h4 class="section-title">识别模型</h4>
        
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-label">模型类型</div>
            <div class="setting-desc">本地模型：离线可用，响应快；云端模型：精度高，需联网</div>
          </div>
          <tiny-radio-group v-model="settings.modelType">
            <tiny-radio label="local">本地模型</tiny-radio>
            <tiny-radio label="cloud">云端模型</tiny-radio>
          </tiny-radio-group>
        </div>

        <div v-if="settings.modelType === 'cloud'" class="cloud-config">
          <div class="form-item">
            <label class="form-label">API 地址</label>
            <tiny-input
              v-model="settings.apiEndpoint"
              placeholder="https://api.example.com/v1/recognize"
            />
          </div>

          <div class="form-item">
            <label class="form-label">API Key</label>
            <tiny-input
              v-model="settings.apiKey"
              type="password"
              placeholder="请输入 API Key"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-label">物体识别</div>
            <div class="setting-desc">识别图像中的物体并返回标签和置信度</div>
          </div>
          <tiny-switch v-model="features.object" />
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-label">条形码/二维码扫描</div>
            <div class="setting-desc">快速识别各种条形码和二维码格式</div>
          </div>
          <tiny-switch v-model="features.barcode" />
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-label">人脸识别</div>
            <div class="setting-desc">检测人脸位置及基本属性（需授权）</div>
          </div>
          <tiny-switch v-model="features.face" />
        </div>
      </div>

      <div class="settings-actions">
        <tiny-button type="primary" @click="handleSave">保存设置</tiny-button>
        <tiny-button @click="handleReset">重置</tiny-button>
      </div>
    </div>

    <div class="settings-info">
      <div class="info-card">
        <div class="info-icon">💡</div>
        <div class="info-content">
          <h4>提示</h4>
          <ul>
            <li>本地模型使用浏览器端 AI，计算在本地完成，保护隐私</li>
            <li>云端模型需要网络连接，识别精度更高</li>
            <li>部分功能需要 HTTPS 环境才能正常使用</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { TinySwitch, TinyRadioGroup, TinyRadio, TinyInput, TinyButton, TinyMessage } from '@opentiny/vue'
import { aiService } from '@/services/ai.service'
import type { AIConfig } from '@/services/ai.service'

const settings = reactive<AIConfig>({
  enabled: false,
  modelType: 'local',
  apiEndpoint: '',
  apiKey: ''
})

const features = reactive({
  object: true,
  barcode: true,
  qrcode: true,
  face: false
})

function handleSave() {
  aiService.setConfig(settings)
  TinyMessage.success('设置已保存')
}

function handleReset() {
  settings.enabled = false
  settings.modelType = 'local'
  settings.apiEndpoint = ''
  settings.apiKey = ''
  features.object = true
  features.barcode = true
  features.qrcode = true
  features.face = false
}
</script>

<style scoped lang="scss">
.ai-settings {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.settings-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.settings-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-section {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.5;
}

.cloud-config {
  margin-top: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.form-item {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.settings-actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.settings-info {
  margin-top: 24px;
}

.info-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f0f9ff;
  border: 1px solid #91c5ff;
  border-radius: 8px;

  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #409eff;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    font-size: 13px;
    color: #666;
    line-height: 1.8;
  }
}

.info-icon {
  font-size: 32px;
}

.info-content {
  flex: 1;
}
</style>
