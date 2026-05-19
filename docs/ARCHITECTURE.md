# 通用 Vue3 摄像头系统 - 技术架构设计文档

## 1. 架构概述

### 1.1 技术栈
| 层级 | 技术选型 | 版本 |
|------|---------|------|
| 前端框架 | Vue 3 | 3.4+ |
| 构建工具 | Vite | 5.0+ |
| 组件库 | OpenTiny Vue | 3.22+ |
| 路由 | Vue Router | 4.2+ |
| 状态管理 | Pinia | 2.1+ |
| 语言 | TypeScript | 5.3+ |
| 样式 | SCSS | - |

### 1.2 系统架构图
```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   页面组件   │  │  业务组件    │  │  通用组件    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                      业务逻辑层                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pinia Store (状态管理)                              │  │
│  │  - cameraStore (摄像头状态)                          │  │
│  │  - mediaStore (媒体管理)                             │  │
│  │  - settingStore (设置配置)                           │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      服务层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ CameraService │  │ MediaService  │  │  ApiService  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                      工具层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   视频处理   │  │  文件处理    │  │  工具函数    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                      外部接口层                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REST API + WebSocket (后端对接)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 目录结构

```
/workspace
├── docs/                          # 文档目录
│   ├── PRD.md                    # 产品需求文档
│   ├── ARCHITECTURE.md           # 技术架构文档
│   └── API.md                    # 后端接口文档
├── src/
│   ├── assets/                    # 静态资源
│   │   ├── icons/
│   │   ├── images/
│   │   └── styles/
│   ├── components/               # 组件目录
│   │   ├── camera/              # 摄像头相关组件
│   │   │   ├── CameraPreview.vue
│   │   │   ├── CameraControl.vue
│   │   │   ├── CameraSelector.vue
│   │   │   ├── CameraParams.vue
│   │   │   └── PTZControl.vue
│   │   ├── media/               # 媒体管理组件
│   │   │   ├── MediaGallery.vue
│   │   │   ├── MediaItem.vue
│   │   │   └── MediaPreview.vue
│   │   ├── common/              # 通用组件
│   │   │   ├── Header.vue
│   │   │   ├── Sidebar.vue
│   │   │   └── StatusBar.vue
│   │   └── layout/              # 布局组件
│   │       └── MainLayout.vue
│   ├── composables/              # 组合式函数
│   │   ├── useCamera.ts
│   │   ├── useMedia.ts
│   │   ├── useRecording.ts
│   │   └── usePTZ.ts
│   ├── stores/                  # Pinia 状态管理
│   │   ├── camera.ts
│   │   ├── media.ts
│   │   └── setting.ts
│   ├── services/                # 服务层
│   │   ├── camera.service.ts
│   │   ├── media.service.ts
│   │   └── api.service.ts
│   ├── types/                   # TypeScript 类型定义
│   │   ├── camera.ts
│   │   ├── media.ts
│   │   └── api.ts
│   ├── utils/                   # 工具函数
│   │   ├── file.ts
│   │   ├── video.ts
│   │   └── index.ts
│   ├── views/                   # 页面组件
│   │   ├── CameraView.vue
│   │   ├── MediaLibrary.vue
│   │   └── Settings.vue
│   ├── router/                  # 路由配置
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. 核心模块设计

### 3.1 摄像头服务 (CameraService)
负责摄像头设备管理、视频流控制等核心功能。

```typescript
// 核心功能
- enumerateDevices(): Promise<MediaDeviceInfo[]>
- startCamera(deviceId?: string, constraints?: MediaTrackConstraints): Promise<MediaStream>
- stopCamera(): void
- switchCamera(deviceId: string): Promise<void>
- capturePhoto(): Promise<Blob>
- toggleMirror(): void
- applyConstraints(constraints: MediaTrackConstraints): Promise<void>
```

### 3.2 录制服务 (RecordingService)
负责视频录制功能。

```typescript
// 核心功能
- startRecording(options?: RecordingOptions): Promise<void>
- pauseRecording(): void
- resumeRecording(): void
- stopRecording(): Promise<Blob>
- getRecordingDuration(): number
```

### 3.3 媒体管理服务 (MediaService)
负责媒体文件管理。

```typescript
// 核心功能
- getMediaList(): Promise<MediaItem[]>
- saveMedia(file: File | Blob, metadata: MediaMetadata): Promise<MediaItem>
- deleteMedia(id: string): Promise<void>
- downloadMedia(id: string): Promise<void>
- batchDelete(ids: string[]): Promise<void>
```

### 3.4 云台控制 (PTZControl)
负责云台控制功能。

```typescript
// 核心功能
- move(direction: 'up' | 'down' | 'left' | 'right', speed?: number): Promise<void>
- stopMove(): Promise<void>
- zoom(direction: 'in' | 'out', speed?: number): Promise<void>
- setPreset(presetId: number, name?: string): Promise<void>
- callPreset(presetId: number): Promise<void>
- startCruise(presetList: number[]): Promise<void>
- stopCruise(): Promise<void>
```

---

## 4. 状态管理 (Pinia)

### 4.1 Camera Store
```typescript
interface CameraState {
  devices: MediaDeviceInfo[];
  currentDeviceId: string | null;
  stream: MediaStream | null;
  isActive: boolean;
  isMirror: boolean;
  resolution: Resolution;
  params: CameraParams;
  isRecording: boolean;
  recordingTime: number;
}
```

### 4.2 Media Store
```typescript
interface MediaState {
  items: MediaItem[];
  selectedItems: string[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  filterType: 'all' | 'image' | 'video';
}
```

### 4.3 Setting Store
```typescript
interface SettingState {
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  defaultCamera: string | null;
  autoSave: boolean;
  uploadConfig: UploadConfig;
}
```

---

## 5. 数据流设计

### 5.1 摄像头启动流程
```
用户点击开启
    ↓
获取设备权限
    ↓
enumerateDevices() 获取设备列表
    ↓
startCamera() 启动摄像头
    ↓
更新 Store 状态
    ↓
渲染视频画面
```

### 5.2 拍照流程
```
用户点击拍照
    ↓
capturePhoto() 捕获帧
    ↓
转换为 Blob
    ↓
saveMedia() 保存
    ↓
更新 Media Store
    ↓
显示预览
```

### 5.3 录制流程
```
用户开始录制
    ↓
startRecording() 启动 MediaRecorder
    ↓
定时更新录制时长
    ↓
用户停止录制
    ↓
stopRecording() 获取 Blob
    ↓
saveMedia() 保存文件
    ↓
更新 Media Store
```

---

## 6. 关键技术点

### 6.1 WebRTC API 使用
- `navigator.mediaDevices.enumerateDevices()` - 枚举设备
- `navigator.mediaDevices.getUserMedia()` - 获取视频流
- `MediaRecorder` - 录制视频

### 6.2 Canvas 图像处理
- 截图功能实现
- 滤镜效果应用
- 参数实时调整

### 6.3 IndexedDB 本地存储
- 媒体文件本地存储
- 配置持久化
- 离线支持

### 6.4 WebSocket (后端对接)
- 实时状态同步
- 远程云台控制
- 文件上传进度
