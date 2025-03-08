# scp2-env

一个简单实用的自动化部署工具，用于构建项目并通过SCP将文件部署到远程服务器。

## 功能特点

- 支持多环境配置（开发、测试、生产）
- 自动执行构建命令
- 通过SCP安全地将文件传输到远程服务器
- 友好的命令行界面和日志输出
- 可通过环境变量灵活配置

## 安装

```bash
# npm
npm install scp2-env

# yarn
yarn add scp2-env

# pnpm
pnpm add scp2-env
```

全局安装（作为命令行工具使用）:

```bash
npm install -g scp2-env
```

## 使用方法

### 命令行使用

```bash
# 使用默认开发环境
scp2-env

# 指定环境
scp2-env --mode test
scp2-env --mode production
scp2-env -m development
```

### 在项目中配置脚本

在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "deploy": "scp2-env",
    "deploy:dev": "scp2-env --mode development",
    "deploy:test": "scp2-env --mode test",
    "deploy:prod": "scp2-env --mode production"
  }
}
```

然后可以使用：

```bash
npm run deploy
npm run deploy:test
npm run deploy:prod
```

## 配置

### 环境变量配置

创建以下环境配置文件：

- `.env` - 默认配置（开发环境）
- `.env.test` - 测试环境配置
- `.env.production` - 生产环境配置

配置文件示例：

```
SCP2_DEPLOY_SERVER_HOST=example.com
SCP2_DEPLOY_SERVER_PORT=22
SCP2_DEPLOY_SERVER_USERNAME=deploy
SCP2_DEPLOY_SERVER_PASSWORD=secret
SCP2_DEPLOY_SERVER_PATH=/var/www/html
SCP2_BUILD_ROOT_CMD=pnpm build
SCP2_BUILD_APP_CMD=pnpm build:test  # 可选配置
SCP2_DEPLOY_SOURCE_DIR=./dist
MODE=development
```

### 配置项说明

| 配置项 | 说明 | 默认值 |
|-------|------|--------|
| SCP2_DEPLOY_SERVER_HOST | 远程服务器主机地址 | localhost |
| SCP2_DEPLOY_SERVER_PORT | 远程服务器端口 | 22 |
| SCP2_DEPLOY_SERVER_USERNAME | 远程服务器用户名 | root |
| SCP2_DEPLOY_SERVER_PASSWORD | 远程服务器密码 | - |
| SCP2_DEPLOY_SERVER_PATH | 远程服务器部署路径 | /tmp |
| SCP2_BUILD_ROOT_CMD | 根目录构建命令 | pnpm build |
| SCP2_BUILD_APP_CMD | 应用构建命令（可选） | - |
| SCP2_DEPLOY_SOURCE_DIR | 需要部署的源目录 | ./dist |
| MODE | 当前环境模式 | development |

## 开发

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 测试部署
pnpm deploy:dev
```

## 示例

1. 配置环境变量
2. 执行部署命令
3. 自动执行构建
4. 部署到远程服务器

```bash
# 部署到测试环境
pnpm deploy:test

# 部署到生产环境
pnpm deploy:prod
```

## 许可证

MIT 