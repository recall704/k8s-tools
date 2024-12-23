# 镜像名称和版本
IMAGE_NAME := nfs-config-tool
VERSION := $(shell git describe --tags --always --dirty)
RElEASE_REGISTRY := docker.io/win7

# 默认目标
.PHONY: all
all: build

# 构建 Docker 镜像
.PHONY: build
build:
	@echo "Building Docker image..."
	docker build -t ${RElEASE_REGISTRY}/${IMAGE_NAME}:$(VERSION) .
	docker tag ${RElEASE_REGISTRY}/${IMAGE_NAME}:${VERSION} ${RElEASE_REGISTRY}/${IMAGE_NAME}:latest

# 推送镜像到仓库
.PHONY: push
push:
	@echo "Pushing Docker image..."
	docker push ${RElEASE_REGISTRY}/${IMAGE_NAME}:$(VERSION)
	docker push ${RElEASE_REGISTRY}/${IMAGE_NAME}:latest

# 运行容器
.PHONY: run
run:
	@echo "Running container..."
	docker run -p 3000:3000 ${RElEASE_REGISTRY}/${IMAGE_NAME}:latest

# 停止并删除容器
.PHONY: clean
clean:
	@echo "Cleaning up..."
	-docker stop $$(docker ps -a -q --filter ancestor=${RElEASE_REGISTRY}/${IMAGE_NAME}:latest)
	-docker rm $$(docker ps -a -q --filter ancestor=${RElEASE_REGISTRY}/${IMAGE_NAME}:latest)

# 显示帮助信息
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make build    - Build Docker image"
	@echo "  make push     - Push image to RElEASE_registry"
	@echo "  make run      - Run container"
	@echo "  make clean    - Stop and remove container"
	@echo "  make help     - Show this help"
