# scp-deploy

一个简单的部署工具，用于通过 SCP 将文件或目录部署到远程服务器。

## 安装

```bash
npm install scp-deploy
# 或
yarn add scp-deploy
# 或
pnpm add scp-deploy
```

## 作为命令行工具使用

全局安装:

```bash
npm install -g scp-deploy
```

### 命令行参数

```
使用方法: scp-deploy [选项] <源目录>

选项:
  -h, --help               显示帮助信息
  -c, --config <文件>      指定配置文件路径 (默认: .env)
  -H, --host <主机>        远程服务器主机地址
  -P, --port <端口>        远程服务器端口 (默认: 22)
  -u, --username <用户名>  远程服务器用户名
  -p, --password <密码>    远程服务器密码
  -k, --key <私钥文件>     SSH私钥文件路径
  -r, --remote-path <路径> 远程服务器部署路径
```

### 示例

```bash
# 使用命令行参数
scp-deploy -H example.com -u root -p password -r /var/www/html ./dist

# 使用配置文件
scp-deploy --config .env.production ./dist
```

### 配置文件

你可以创建一个 `.env` 文件（或者使用 `-c` 参数指定配置文件）来存储服务器信息：

```env
DEPLOY_SERVER_HOST=example.com
DEPLOY_SERVER_PORT=22
DEPLOY_SERVER_USERNAME=root
DEPLOY_SERVER_PASSWORD=your-password
# 或者使用私钥认证
DEPLOY_SERVER_PRIVATE_KEY=/path/to/your/private/key
DEPLOY_SERVER_PASSPHRASE=your-passphrase
DEPLOY_SERVER_PATH=/var/www/html
```

## 在代码中使用

```javascript
import deploy from 'scp-deploy';

// 基本用法
deploy({
  server: {
    host: 'example.com',
    port: 22,
    username: 'root',
    password: 'your-password',
    path: '/var/www/html'
  },
  source: './dist'
})
  .then(() => console.log('部署成功！'))
  .catch(err => console.error('部署失败:', err));

// 使用私钥认证
import fs from 'fs';

deploy({
  server: {
    host: 'example.com',
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync('/path/to/your/private/key', 'utf8'),
    passphrase: 'your-passphrase',
    path: '/var/www/html'
  },
  source: './dist'
});

// 使用回调函数
deploy({
  server: {
    host: 'example.com',
    username: 'root',
    password: 'your-password',
    path: '/var/www/html'
  },
  source: './dist',
  onSuccess: () => {
    console.log('部署成功！');
  },
  onError: (err) => {
    console.error('部署失败:', err);
  }
});
```

## API

### deploy(options)

部署文件或目录到远程服务器。

#### 参数

- `options` (Object): 部署选项
  - `server` (Object): 服务器配置
    - `host` (string): 主机地址
    - `port` (number, 可选): 端口号，默认为 22
    - `username` (string, 可选): 用户名
    - `password` (string, 可选): 密码
    - `privateKey` (string, 可选): SSH 私钥内容
    - `passphrase` (string, 可选): SSH 私钥密码
    - `path` (string): 远程服务器部署路径
  - `source` (string): 本地源文件或目录路径
  - `onSuccess` (Function, 可选): 部署成功回调函数
  - `onError` (Function, 可选): 部署失败回调函数
  - `onProgress` (Function, 可选): 部署进度回调函数

#### 返回值

- 返回一个 Promise，在部署完成时解析，在出错时拒绝。

## 许可证

MIT 