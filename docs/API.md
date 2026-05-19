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

**响应示例**:
```json
{
  "code": 200,
  "message": "停止成功",
  "data": null
}
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

**参数说明**:
- `direction`: `in` | `out`
- `speed`: 0-100 (默认 50)

### 3.4 获取预置位列表
```
GET /api/v1/cameras/:id/ptz/presets
```

**响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "位置 1",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "位置 2",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
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

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "media_001",
        "name": "photo_20240101.jpg",
        "type": "image",
        "size": 1024000,
        "url": "/uploads/photo_20240101.jpg",
        "thumbnail": "/uploads/thumbnails/photo_20240101.jpg",
        "createdAt": "2024-01-01T00:00:00Z",
        "metadata": {
          "cameraId": "cam_001",
          "resolution": "1920x1080"
        }
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

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

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "id": "media_001",
    "name": "photo_20240101.jpg",
    "type": "image",
    "size": 1024000,
    "url": "/uploads/photo_20240101.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

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

## 5. WebSocket 接口

### 5.1 连接建立
```
WebSocket ws://your-domain/api/v1/ws
```

### 5.2 消息格式

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

### 5.3 消息类型

| 类型 | 方向 | 说明 |
|------|------|------|
| `camera_status` | S→C | 摄像头状态变更 |
| `ptz_status` | S→C | 云台状态更新 |
| `upload_progress` | S→C | 文件上传进度 |
| `ping` | C→S | 心跳检测 |
| `pong` | S→C | 心跳响应 |

#### 摄像头状态变更消息
```json
{
  "type": "camera_status",
  "data": {
    "cameraId": "cam_001",
    "status": "online",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

## 6. 系统配置 API

### 6.1 获取系统配置
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
    "maxFileSize": 104857600
  }
}
```

### 6.2 更新系统配置
```
PUT /api/v1/config
```

**请求体**:
```json
{
  "defaultCamera": "cam_001",
  "autoSave": true
}
```

---

## 7. 错误码说明

| Code | Message | 说明 |
|------|---------|------|
| 200 | success | 成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |
