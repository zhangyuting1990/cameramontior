<template>
  <div class="camera-params">
    <h3 class="params-title">参数调节</h3>
    
    <div class="param-item">
      <div class="param-label">亮度 ({{ params.brightness }})</div>
      <tiny-slider
        v-model="params.brightness"
        :min="0"
        :max="100"
        :step="1"
        @change="handleParamChange"
      />
    </div>

    <div class="param-item">
      <div class="param-label">对比度 ({{ params.contrast }})</div>
      <tiny-slider
        v-model="params.contrast"
        :min="0"
        :max="100"
        :step="1"
        @change="handleParamChange"
      />
    </div>

    <div class="param-item">
      <div class="param-label">饱和度 ({{ params.saturation }})</div>
      <tiny-slider
        v-model="params.saturation"
        :min="0"
        :max="100"
        :step="1"
        @change="handleParamChange"
      />
    </div>

    <div class="param-item">
      <div class="param-label">色调 ({{ params.hue }})</div>
      <tiny-slider
        v-model="params.hue"
        :min="0"
        :max="100"
        :step="1"
        @change="handleParamChange"
      />
    </div>

    <div class="param-item">
      <div class="param-label">曝光</div>
      <tiny-select v-model="exposureValue" @change="handleExposureChange">
        <tiny-option label="自动" value="auto" />
        <tiny-option label="手动" :value="50" />
      </tiny-select>
    </div>

    <div class="param-item">
      <div class="param-label">白平衡</div>
      <tiny-select v-model="whiteBalanceValue" @change="handleWhiteBalanceChange">
        <tiny-option label="自动" value="auto" />
        <tiny-option label="手动" :value="50" />
      </tiny-select>
    </div>

    <div class="params-actions">
      <tiny-button @click="handleReset">重置默认</tiny-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'
import { TinySlider, TinySelect, TinyOption, TinyButton } from '@opentiny/vue'

const cameraStore = useCameraStore()
const { params } = storeToRefs(cameraStore)
const { updateParams } = cameraStore

const exposureValue = ref<string | number>('auto')
const whiteBalanceValue = ref<string | number>('auto')

function handleParamChange() {
  updateParams({
    brightness: params.brightness,
    contrast: params.contrast,
    saturation: params.saturation,
    hue: params.hue
  })
}

function handleExposureChange(value: string | number) {
  updateParams({ exposure: value as any })
}

function handleWhiteBalanceChange(value: string | number) {
  updateParams({ whiteBalance: value as any })
}

function handleReset() {
  updateParams({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    hue: 50,
    exposure: 'auto',
    whiteBalance: 'auto'
  })
  exposureValue.value = 'auto'
  whiteBalanceValue.value = 'auto'
}
</script>

<style scoped lang="scss">
.camera-params {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.params-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.param-item {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.param-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.params-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}
</style>
