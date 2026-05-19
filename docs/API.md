# 通用 Vue3 摄像头系统 - 后端 API 接口文档

## 1. 接口概述

### 1.1 基础信息
- **Base URL**: `/api/v1`
- **数据格式**: JSON
- **认证方式**: JWT Token (可选，根据实际需求)
- **字符编码**: UTF-8

### 1.2 通用响应格式

#### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

#### 错误响应
```json
{
  "code": 400,
  "message": "error message",
  "data": null
}
```

---

## 2. 摄像头管理 API

### 2.1 获取摄像头列表
```
GET /api/v1/cameras
```

**响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "cam_001",
      "name": "摄像头 1",
      "type": "usb",
      "status": "online",
      "resolution": "1920x1080",
      "ip": "192.168.1.100"
    },
    {
      "id": "cam_002",
      "name": "摄像头 2",
      "type": "ip",
      "status": "offline",
      "resolution": "1280x720",
      "ip": "192.168.1.101"
    }
  ]
}
```

### 2.2 获取摄像头详情
```
GET /api/v1/cameras/:id
```

**路径参数**:
- `id`: 摄像头 ID

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "id": "cam_001",
    "name": "摄像头 1",
    "type": "usb",
    "status": "online",
    "resolution": "1920x1080",
    "ip": "192.168.1.100",
    "ptzSupported": true,
    "params": {
      "brightness": 50,
      "contrast": 50,
      "saturation": 50,
      "hue": 50
    }
  }
}
```

### 2.3 更新摄像头参数
```
PUT /api/v1/cameras/:id/params
```

**请求体**:
```json
{
  "brightness": 60,
  "contrast": 55,
  "saturation": 50,
  "hue": 50,
  "exposure": "auto",
  "whiteBalance": "auto"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "参数更新成功",
  "data": null
}
```

---

## 3. 云台控制 API

### 3.1 云台移动
```
POST /api/v1/cameras/:id/ptz/move
```

**请求体**:
```json
{
  "direction": "up",
  "speed": 50
}
```

**参数说明**:
- `direction`: `up` | `down` | `left` | `right`
- `speed`: 0-100 (默认 50)

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 3.2 停止移动
```
POST /api/v1/cameras/:id/ptz/stop
```

### 3.3 云台缩放
```
POST /api/v1/cameras/:id/ptz/zoom
```

**请求体**:
```json
{
  "direction": "in",
  "speed": 50
}
```

### 3.4 获取预置位列表
```
GET /api/v1/cameras/:id/ptz/presets
```

### 3.5 设置预置位
```
POST /api/v1/cameras/:id/ptz/presets
```

**请求体**:
```json
{
  "id": 1,
  "name": "新位置"
}
```

### 3.6 调用预置位
```
POST /api/v1/cameras/:id/ptz/presets/:presetId/call
```

### 3.7 开始巡航
```
POST /api/v1/cameras/:id/ptz/cruise/start
```

**请求体**:
```json
{
  "presets": [1, 2, 3],
  "interval": 5
}
```

### 3.8 停止巡航
```
POST /api/v1/cameras/:id/ptz/cruise/stop
```

---

## 4. 媒体文件 API

### 4.1 获取媒体列表
```
GET /api/v1/media
```

**查询参数**:
- `type`: 可选，`image` | `video` | `all` (默认)
- `page`: 页码 (默认 1)
- `pageSize`: 每页数量 (默认 20)
- `sortBy`: 排序字段，`createdAt` | `name` | `size`
- `sortOrder`: `asc` | `desc`

### 4.2 上传媒体文件
```
POST /api/v1/media/upload
```

**Content-Type**: `multipart/form-data`

**请求参数**:
- `file`: 文件
- `type`: `image` | `video`
- `cameraId`: 摄像头 ID (可选)
- `metadata`: JSON 字符串 (可选)

### 4.3 删除媒体文件
```
DELETE /api/v1/media/:id
```

### 4.4 批量删除媒体文件
```
DELETE /api/v1/media/batch
```

**请求体**:
```json
{
  "ids": ["media_001", "media_002"]
}
```

### 4.5 下载媒体文件
```
GET /api/v1/media/:id/download
```

---

## 5. 盘点任务 API

### 5.1 获取盘点任务列表
```
GET /api/v1/inventory/tasks
```

**查询参数**:
- `status`: 可选，`pending` | `in_progress` | `completed` | `cancelled`
- `page`: 页码 (默认 1)
- `pageSize`: 每页数量 (默认 20)

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "inv_001",
        "name": "2024年第一季度盘点",
        "description": "仓库库存盘点任务",
        "status": "completed",
        "createdAt": "2024-01-01T00:00:00Z",
        "startedAt": "2024-01-02T09:00:00Z",
        "completedAt": "2024-01-02T18:00:00Z",
        "totalItems": 1000,
        "scannedItems": 985,
        "detectionType": "barcode",
        "autoSave": true
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

### 5.2 创建盘点任务
```
POST /api/v1/inventory/tasks
```

**请求体**:
```json
{
  "name": "2024年第一季度盘点",
  "description": "仓库库存盘点任务",
  "detectionType": "barcode",
  "totalItems": 1000,
  "autoSave": true
}
```

**参数说明**:
- `name`: 任务名称 (必填)
- `description`: 任务描述 (可选)
- `detectionType`: 识别类型 `object` | `barcode` | `qrcode` | `face`
- `totalItems`: 预计盘点数量 (可选)
- `autoSave`: 是否自动保存 (默认 true)

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "id": "inv_001",
    "name": "2024年第一季度盘点",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.3 获取任务详情
```
GET /api/v1/inventory/tasks/:id
```

### 5.4 更新任务状态
```
PUT /api/v1/inventory/tasks/:id/status
```

**请求体**:
```json
{
  "status": "in_progress"
}
```

### 5.5 删除盘点任务
```
DELETE /api/v1/inventory/tasks/:id
```

---

## 6. 盘点记录 API

### 6.1 获取任务记录列表
```
GET /api/v1/inventory/tasks/:taskId/records
```

**查询参数**:
- `type`: 可选，`barcode` | `qrcode` | `object` | `face`
- `page`: 页码 (默认 1)
- `pageSize`: 每页数量 (默认 50)

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "rec_001",
        "taskId": "inv_001",
        "barcode": "PRD-12345",
        "confidence": 98.5,
        "imageUrl": "/uploads/rec_001.jpg",
        "timestamp": "2024-01-02T10:30:00Z",
        "location": "A区-01-03",
        "notes": "商品完好"
      }
    ],
    "total": 985,
    "page": 1,
    "pageSize": 50
  }
}
```

### 6.2 添加盘点记录
```
POST /api/v1/inventory/tasks/:taskId/records
```

**请求体**:
```json
{
  "barcode": "PRD-12345",
  "confidence": 98.5,
  "imageUrl": "/uploads/rec_001.jpg",
  "location": "A区-01-03",
  "notes": "商品完好"
}
```

### 6.3 批量添加记录
```
POST /api/v1/inventory/tasks/:taskId/records/batch
```

**请求体**:
```json
{
  "records": [
    {
      "barcode": "PRD-12345",
      "confidence": 98.5
    },
    {
      "qrcode": "https://example.com/123",
      "confidence": 99.0
    }
  ]
}
```

### 6.4 更新记录备注
```
PUT /api/v1/inventory/records/:id/notes
```

**请求体**:
```json
{
  "notes": "商品完好，无损坏"
}
```

### 6.5 删除盘点记录
```
DELETE /api/v1/inventory/records/:id
```

### 6.6 清空任务所有记录
```
DELETE /api/v1/inventory/tasks/:taskId/records
```

---

## 7. 数据导出 API

### 7.1 导出任务数据
```
GET /api/v1/inventory/tasks/:taskId/export
```

**查询参数**:
- `format`: 导出格式 `csv` | `excel` | `pdf`
- `includeImages`: 是否包含图片 (默认 false)

**响应**: 文件流

### 7.2 批量导出
```
POST /api/v1/inventory/export
```

**请求体**:
```json
{
  "taskIds": ["inv_001", "inv_002"],
  "format": "csv",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-03-31"
  }
}
```

---

## 8. AI 识别 API

### 8.1 物体识别
```
POST /api/v1/ai/detect/object
```

**Content-Type**: `multipart/form-data`

**请求参数**:
- `image`: 图片文件

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "type": "object",
    "value": "Product ABC",
    "confidence": 92.5,
    "metadata": {
      "label": "Product ABC",
      "category": "Electronics"
    }
  }
}
```

### 8.2 条形码识别
```
POST /api/v1/ai/detect/barcode
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "type": "barcode",
    "value": "PRD-12345",
    "confidence": 99.0,
    "metadata": {
      "format": "CODE128"
    }
  }
}
```

### 8.3 二维码识别
```
POST /api/v1/ai/detect/qrcode
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "type": "qrcode",
    "value": "https://example.com/product/123",
    "confidence": 99.5,
    "metadata": {
      "version": 1
    }
  }
}
```

### 8.4 人脸识别
```
POST /api/v1/ai/detect/face
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "type": "face",
    "value": "face_001",
    "confidence": 95.0,
    "boundingBox": {
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 200
    },
    "metadata": {
      "age": 30,
      "gender": "male"
    }
  }
}
```

### 8.5 批量识别
```
POST /api/v1/ai/detect/batch
```

**请求体**:
```json
{
  "type": "barcode",
  "images": ["base64_image_1", "base64_image_2"]
}
```

---

## 9. WebSocket 接口

### 9.1 连接建立
```
WebSocket ws://your-domain/api/v1/ws
```

### 9.2 消息格式

#### 客户端 → 服务器
```json
{
  "type": "message_type",
  "data": {}
}
```

#### 服务器 → 客户端
```json
{
  "type": "message_type",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 9.3 消息类型

| 类型 | 方向 | 说明 |
|------|------|------|
| `camera_status` | S→C | 摄像头状态变更 |
| `ptz_status` | S→C | 云台状态更新 |
| `upload_progress` | S→C | 文件上传进度 |
| `inventory_progress` | S→C | 盘点进度更新 |
| `recognition_result` | S→C | AI 识别结果 |
| `ping` | C→S | 心跳检测 |
| `pong` | S→C | 心跳响应 |

---

## 10. 系统配置 API

### 10.1 获取系统配置
```
GET /api/v1/config
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "defaultCamera": "cam_001",
    "autoSave": true,
    "uploadPath": "/uploads",
    "maxFileSize": 104857600,
    "aiEnabled": true,
    "aiModelType": "local"
  }
}
```

### 10.2 更新系统配置
```
PUT /api/v1/config
```

**请求体**:
```json
{
  "defaultCamera": "cam_001",
  "autoSave": true,
  "aiEnabled": true,
  "aiModelType": "cloud",
  "aiApiEndpoint": "https://api.example.com"
}
```

---

## 11. 错误码说明

| Code | Message | 说明 |
|------|---------|------|
| 200 | success | 成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 413 | Payload Too Large | 文件过大 |
| 415 | Unsupported Media Type | 不支持的文件类型 |
| 500 | Internal Server Error | 服务器内部错误 |
