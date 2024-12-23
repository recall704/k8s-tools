# K8S NFS 存储配置生成

## 概述

这是一个基于 Next.js 的 Web 应用程序，用于简化 Kubernetes 中 NFS 存储配置的生成过程。通过直观的 Web 界面，用户可以轻松生成 Kubernetes 的 PersistentVolume (PV) 和 PersistentVolumeClaim (PVC) 配置文件。

### 主要功能
- 自动生成 K8S NFS 存储配置
- 支持 PV 和 PVC 的配置定制
- 支持中英文双语界面
- 现代化的 Web 界面
- 丰富的 NFS 参数配置选项

## 基本原理

### NFS 存储配置
1. **PersistentVolume (PV)**
   - 定义 NFS 服务器连接信息
   - 配置存储容量和访问模式
   - 设置 NFS 协议参数

2. **PersistentVolumeClaim (PVC)**
   - 声明存储需求
   - 通过标签选择器匹配 PV
   - 指定所需的存储大小

### 配置参数说明
- **必填参数**
  - `nfs_server`: NFS 服务器地址
  - `nfs_path`: NFS 共享路径
  - `namespace`: Kubernetes 命名空间
  - `name`: PV/PVC 资源名称
  - `size`: 存储容量大小

- **可选参数**
  - `readonly`: 只读模式开关
  - `nfsvers`: NFS 协议版本 (3/4/4.0/4.1/4.2)
  - `proto`: 传输协议 (tcp/udp)
  - `retrans`: 重传次数
  - `nolock`: 文件锁定选项
  - `hard`: 硬挂载选项
  - `noresvport`: 端口预留选项

## 镜像构建

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 或 yarn
- Docker (可选，用于容器化部署)

### 构建步骤
```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# Docker 镜像构建（可选）
docker build -t nfs-config-generator .
```

## 运行

### 本地开发
```bash
# 启动开发服务器
npm run dev

# 访问地址
http://localhost:3000
```

### Docker 部署
```bash
# 运行容器
docker run -p 3000:3000 nfs-config-generator
```

### 使用说明

1. 填写基本配置
   - 输入 NFS 服务器地址和共享路径
   - 设置命名空间和资源名称
   - 指定存储容量

2. 配置高级选项（可选）
   - 选择 NFS 协议版本
   - 设置传输协议
   - 调整其他 NFS 挂载参数

3. 生成配置文件
   - 点击生成按钮获取 YAML 配置
   - 复制配置内容或下载文件

### 配置示例

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
    name: nfs-pv
    labels:
        pv: nfs-pv
spec:
    capacity:
        storage: 1Gi
    accessModes:
    - ReadWriteMany
    nfs:
        server: 10.10.10.10
        path: /share
    options:
        nfsvers: 3
        rsize: 1048576
        wsize: 1048576
        timeo: 600
        retrans: 2
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: nfs-pvc
spec:
    accessModes:
    - ReadWriteMany
    resources:
        requests:
            storage: 1Gi
    selector:
        matchLabels:
            pv: nfs-pv
```

### 注意事项
1. 确保 NFS 服务器可访问且共享路径存在
2. 检查 Kubernetes 集群是否安装 NFS 客户端
3. 注意存储容量设置需符合实际情况
4. 建议在生产环境中启用 hard 挂载选项
