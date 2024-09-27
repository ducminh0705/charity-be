# Makefile for Charity Donation Backend

# Biến
APP_NAME=charity-be
SRC_DIR=src
DIST_DIR=dist

# Mặc định sẽ chạy 'help'
.DEFAULT_GOAL := help

.PHONY: help
help: ## Hiển thị danh sách các lệnh
	@echo "Các lệnh thường dùng:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Cài đặt các dependencies
	@echo "Cài đặt dependencies..."
	npm install

.PHONY: build
build: ## Biên dịch TypeScript thành JavaScript
	@echo "Biên dịch mã nguồn..."
	npx tsc

.PHONY: start
start: build ## Chạy ứng dụng
	@echo "Khởi động ứng dụng..."
	node $(DIST_DIR)/index.js

.PHONY: dev
dev: ## Chạy ứng dụng trong chế độ phát triển
	@echo "Khởi động ứng dụng trong chế độ phát triển..."
	npx ts-node $(SRC_DIR)/index.ts

.PHONY: clean
clean: ## Xóa thư mục dist
	@echo "Dọn dẹp..."
	rm -rf $(DIST_DIR)

.PHONY: lint
lint: ## Kiểm tra mã nguồn với ESLint
	@echo "Kiểm tra mã nguồn với ESLint..."
	npx eslint $(SRC_DIR) --ext .ts

.PHONY: test
test: ## Chạy các bài kiểm thử
	@echo "Chạy các bài kiểm thử..."
	npm test

.PHONY: migrate
migrate: ## Chạy migration cơ sở dữ liệu
	@echo "Chạy migration cơ sở dữ liệu..."
	npx sequelize-cli db:migrate

.PHONY: seed
seed: ## Chạy seed dữ liệu
	@echo "Chạy seed dữ liệu..."
	npx sequelize-cli db:seed:all
