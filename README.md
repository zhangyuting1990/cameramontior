# 通用 Vue3 摄像头系统

基于 Vue3 + OpenTiny Vue 组件库构建的通用摄像头系统，支持实时预览、拍照、录像等功能，为后续视频盘点系统提供基础。

## 功能特性

### 摄像头功能
- ✅ 多摄像头设备枚举与切换
- ✅ 实时视频预览
- ✅ 拍照功能
- ✅ 视频录制
- ✅ 镜像翻转
- ✅ 摄像头参数调节（亮度、对比度、饱和度等）

### 媒体管理
- ✅ 图片/视频查看
- ✅ 文件下载
- ✅ 批量删除
- ✅ 网格/列表视图切换
- ✅ 文件类型过滤

### 扩展性
- 📋 预留后端 API 接口
- 📋 支持云台控制
- 📋 为视频盘点系统预留扩展空间

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **组件库**: OpenTiny Vue 3
- **状态管理**: Pinia
- **路由**: Vue Router
- **语言**: TypeScript
- **样式**: SCSS

## 项目结构

```
/workspace
├── docs/                          # 文档目录
│   ├── PRD.md                    # 产品需求文档
│   ├── ARCHITECTURE.md           # 技术架构文档
│   └── API.md                    # 后端接口文档
├── src/
│   ├── assets/                    # 静态资源
│   ├── components/               # 组件目录
│   │   ├── camera/              # 摄像头相关组件
│   │   │   ├── CameraPreview.vue
│   │   │   ├── CameraControl.vue
│   │   │   ├── CameraParams.vue
│   │   │   └── PTZControl.vue   # 云台控制（预留）
│   │   ├── media/               # 媒体管理组件
│   │   │   ├── MediaGallery.vue
│   │   │   └── MediaItem.vue
│   │   └── layout/              # 布局组件
│   │       └── MainLayout.vue
│   ├── stores/                  # Pinia 状态管理
│   │   ├── camera.ts
│   │   ├── media.ts
│   │   └── setting.ts
│   ├── services/                # 服务层
│   │   ├── camera.service.ts
│   │   └── media.service.ts
│   ├── types/                   # TypeScript 类型定义
│   │   ├── camera.ts
│   │   └── media.ts
│   ├── views/                   # 页面组件
│   │   ├── CameraView.vue
│   │   └── MediaView.vue
│   ├── router/                  # 路由配置
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 使用说明

### 1. 启动摄像头
- 点击"启动摄像头"按钮
- 允许浏览器访问摄像头权限
- 选择需要使用的摄像头设备

### 2. 拍照
- 点击"拍照"按钮
- 照片自动保存到媒体库

### 3. 录像
- 点击"录像"按钮开始录制
- 点击"停止"按钮结束录制
- 视频自动保存到媒体库

### 4. 媒体管理
- 切换到"媒体库"页面
- 查看、下载或删除拍摄的文件
- 支持多选批量操作

## 后端接口

后端接口文档详见 [docs/API.md](docs/API.md)，主要包含：

- 摄像头管理接口
- 云台控制接口
- 媒体文件上传/下载接口
- WebSocket 实时通信

## 扩展计划

### 视频盘点系统
- 智能物体识别
- 盘点记录管理
- 数据导出与报表
- 与企业 ERP/WMS 系统对接

## 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari

**注意**: 摄像头功能需要 HTTPS 或 localhost 环境

## License

MIT
