# 通用 Vue3 摄像头系统

基于 Vue3 + OpenTiny Vue 组件库构建的通用摄像头系统，支持实时预览、拍照、录像等功能，并集成了视频盘点系统的完整功能模块。

## 🚀 功能特性

### 📷 摄像头功能
- ✅ 多摄像头设备枚举与切换
- ✅ 实时视频预览
- ✅ 拍照功能
- ✅ 视频录制
- ✅ 镜像翻转
- ✅ 摄像头参数调节（亮度、对比度、饱和度等）

### 📁 媒体管理
- ✅ 图片/视频查看
- ✅ 文件下载
- ✅ 批量删除
- ✅ 网格/列表视图切换
- ✅ 文件类型过滤

### 📋 视频盘点系统
- ✅ 盘点任务创建与管理
- ✅ 多种识别类型支持
  - 物体识别
  - 条形码扫描
  - 二维码扫描
  - 人脸识别（预留）
- ✅ 盘点进度实时跟踪
- ✅ 识别结果记录与备注
- ✅ 数据导出（CSV/Excel）
- ✅ 盘点统计分析
- ✅ AI 识别预留接口

### 🔌 后端对接
- ✅ REST API 完整接口定义
- ✅ WebSocket 实时通信
- ✅ 支持多种导出格式

## 💻 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **组件库**: OpenTiny Vue 3
- **状态管理**: Pinia
- **路由**: Vue Router
- **语言**: TypeScript
- **样式**: SCSS

## 📁 项目结构

```
/workspace
├── docs/                          # 文档目录
│   ├── PRD.md                    # 产品需求文档
│   ├── ARCHITECTURE.md           # 技术架构文档
│   └── API.md                    # 后端接口文档
├── src/
│   ├── components/               # 组件目录
│   │   ├── camera/              # 摄像头相关组件
│   │   ├── media/               # 媒体管理组件
│   │   ├── inventory/           # 盘点系统组件
│   │   └── layout/              # 布局组件
│   ├── services/                 # 服务层
│   │   ├── camera.service.ts    # 摄像头服务
│   │   ├── media.service.ts     # 媒体服务
│   │   └── ai.service.ts        # AI 识别服务（预留）
│   ├── stores/                   # Pinia 状态管理
│   │   ├── camera.ts
│   │   ├── media.ts
│   │   └── inventory.ts         # 盘点状态管理
│   ├── types/                    # TypeScript 类型定义
│   │   ├── camera.ts
│   │   ├── media.ts
│   │   └── inventory.ts
│   ├── views/                    # 页面组件
│   │   ├── CameraView.vue
│   │   ├── MediaView.vue
│   │   ├── InventoryView.vue    # 盘点任务管理
│   │   ├── InventoryScanView.vue # 盘点扫描
│   │   └── InventoryRecordsView.vue # 记录查看
│   ├── router/                   # 路由配置
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 快速开始

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

## 📖 使用说明

### 1. 摄像头功能

#### 启动摄像头
- 点击"启动摄像头"按钮
- 允许浏览器访问摄像头权限
- 选择需要使用的摄像头设备

#### 拍照
- 点击"拍照"按钮
- 照片自动保存到媒体库

#### 录像
- 点击"录像"按钮开始录制
- 点击"停止"按钮结束录制
- 视频自动保存到媒体库

#### 媒体管理
- 切换到"媒体库"页面
- 查看、下载或删除拍摄的文件
- 支持多选批量操作

### 2. 视频盘点系统

#### 创建盘点任务
1. 进入"盘点管理"页面
2. 点击"新建任务"按钮
3. 填写任务名称、描述
4. 选择识别类型（物体/条形码/二维码/人脸）
5. 设置预期数量和自动保存选项
6. 点击"创建任务"

#### 开始盘点
1. 在任务列表中点击"开始"按钮
2. 进入盘点扫描页面
3. 使用摄像头进行识别
4. 支持拍照识别和手动输入
5. 实时查看识别结果

#### 查看记录
1. 点击任务卡片中的"查看记录"
2. 可以搜索、筛选记录
3. 添加备注信息
4. 导出数据（CSV/Excel）

#### 数据导出
- 支持按任务导出
- 支持批量导出
- 支持 CSV 和 Excel 格式
- 可选择是否包含图片

### 3. AI 识别功能（预留）

系统预留了完整的 AI 识别接口，支持：
- 物体识别
- 条形码/二维码识别
- 人脸识别

可通过配置启用本地模型或云端 API。

## 🔌 后端接口

后端接口文档详见 [docs/API.md](docs/API.md)，主要包含：

### 摄像头管理
- `GET /api/v1/cameras` - 获取摄像头列表
- `PUT /api/v1/cameras/:id/params` - 更新摄像头参数

### 云台控制
- `POST /api/v1/cameras/:id/ptz/move` - 云台移动
- `POST /api/v1/cameras/:id/ptz/zoom` - 云台缩放
- `GET /api/v1/cameras/:id/ptz/presets` - 获取预置位
- `POST /api/v1/cameras/:id/ptz/cruise/start` - 开始巡航

### 媒体文件
- `GET /api/v1/media` - 获取媒体列表
- `POST /api/v1/media/upload` - 上传文件
- `DELETE /api/v1/media/:id` - 删除文件

### 盘点管理
- `GET /api/v1/inventory/tasks` - 获取任务列表
- `POST /api/v1/inventory/tasks` - 创建任务
- `GET /api/v1/inventory/tasks/:id` - 获取任务详情
- `PUT /api/v1/inventory/tasks/:id/status` - 更新任务状态

### 盘点记录
- `GET /api/v1/inventory/tasks/:taskId/records` - 获取记录列表
- `POST /api/v1/inventory/tasks/:taskId/records` - 添加记录
- `PUT /api/v1/inventory/records/:id/notes` - 更新备注

### 数据导出
- `GET /api/v1/inventory/tasks/:taskId/export` - 导出任务数据
- `POST /api/v1/inventory/export` - 批量导出

### AI 识别
- `POST /api/v1/ai/detect/object` - 物体识别
- `POST /api/v1/ai/detect/barcode` - 条形码识别
- `POST /api/v1/ai/detect/qrcode` - 二维码识别
- `POST /api/v1/ai/detect/face` - 人脸识别

## 🌟 扩展计划

### 近期计划
- [ ] 云台控制组件完善
- [ ] 实时视频流优化
- [ ] 更多媒体格式支持
- [ ] 数据可视化报表

### 远期计划
- [ ] ERP/WMS 系统对接
- [ ] 多语言支持
- [ ] 权限管理
- [ ] 分布式部署支持

## 🔧 开发指南

### 添加新的识别类型

1. 在 `src/types/inventory.ts` 中定义类型
2. 在 `src/services/ai.service.ts` 中实现识别逻辑
3. 在 `src/stores/inventory.ts` 中添加状态管理
4. 在 `src/components/inventory/` 中创建组件

### 对接后端 API

1. 在 `src/services/` 中创建 API 服务
2. 实现 HTTP 请求方法
3. 在 Store 中调用 API 服务
4. 处理响应和错误

## ⚠️ 注意事项

1. **浏览器兼容性**: 推荐使用 Chrome/Edge 浏览器
2. **摄像头权限**: 需要 HTTPS 或 localhost 环境
3. **存储限制**: 媒体文件存储在浏览器本地，有大小限制
4. **AI 功能**: 需要根据实际情况配置 API

## 📄 License

MIT
