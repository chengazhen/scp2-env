/* eslint-disable no-console */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

import scpClient from 'scp2';

// 获取命令行参数中的环境模式，默认为development
const getMode = (): string => {
  const args = process.argv.slice(2);
  const modeIndex = args.findIndex(arg => arg === '--mode' || arg === '-m');
  if (modeIndex !== -1 && args[modeIndex + 1]) {
    return args[modeIndex + 1];
  }
  return process.env.NODE_ENV || 'development';
};

// 获取当前环境模式
const mode = getMode();
console.log(`当前运行环境: ${mode}`);

// 加载对应环境的.env文件
const env = dotenv.config({ 
  path: `.env${mode !== 'development' ? `.${mode}` : ''}` 
});
expand(env);


// 打印所有环境变量，用于调试
console.log('环境变量:', {
  VITE_DEPLOY_SERVER_HOST: process.env.VITE_DEPLOY_SERVER_HOST,
  VITE_DEPLOY_SERVER_PORT: process.env.VITE_DEPLOY_SERVER_PORT,
  VITE_DEPLOY_SERVER_USERNAME: process.env.VITE_DEPLOY_SERVER_USERNAME,
  VITE_DEPLOY_SERVER_PASSWORD: process.env.VITE_DEPLOY_SERVER_PASSWORD,
  VITE_DEPLOY_SERVER_PATH: process.env.VITE_DEPLOY_SERVER_PATH,
  VITE_BUILD_ROOT_CMD: process.env.VITE_BUILD_ROOT_CMD,
  VITE_BUILD_APP_CMD: process.env.VITE_BUILD_APP_CMD,
  VITE_DEPLOY_SOURCE_DIR: process.env.VITE_DEPLOY_SOURCE_DIR,
  MODE: process.env.MODE,
});

// 测试服务器
const testServer = {
  host: process.env.VITE_DEPLOY_SERVER_HOST || 'localhost',
  port: Number(process.env.VITE_DEPLOY_SERVER_PORT || '22'),
  username: process.env.VITE_DEPLOY_SERVER_USERNAME || 'root',
  password: process.env.VITE_DEPLOY_SERVER_PASSWORD || '',
  path: process.env.VITE_DEPLOY_SERVER_PATH || '/tmp',
};

// 将 scp 操作包装成 Promise
function scpPromise(source: string, server: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    scpClient.scp(source, server, (err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// ANSI 颜色代码
const colors = {
  reset: '\u001B[0m',
  bold: '\u001B[1m',
  dim: '\u001B[2m',
  // 前景色
  black: '\u001B[30m',
  red: '\u001B[31m',
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  blue: '\u001B[34m',
  magenta: '\u001B[35m',
  cyan: '\u001B[36m',
  white: '\u001B[37m',
};

// 颜色工具函数
const color = {
  red: (text: string): string => `${colors.red}${text}${colors.reset}`,
  green: (text: string): string => `${colors.green}${text}${colors.reset}`,
  yellow: (text: string): string => `${colors.yellow}${text}${colors.reset}`,
  blue: (text: string): string => `${colors.blue}${text}${colors.reset}`,
  magenta: (text: string): string => `${colors.magenta}${text}${colors.reset}`,
  cyan: (text: string): string => `${colors.cyan}${text}${colors.reset}`,
  bold: (text: string): string => `${colors.bold}${text}${colors.reset}`,
};

// 日志工具函数
const logger = {
  time: (): string => `[${new Date().toLocaleTimeString()}]`,
  info: (msg: string): void =>
    console.log(`${color.blue(logger.time())} ${color.cyan('INFO')} ${msg}`),
  success: (msg: string): void =>
    console.log(
      `${color.blue(logger.time())} ${color.green('SUCCESS')} ${msg}`,
    ),
  warn: (msg: string): void =>
    console.log(`${color.blue(logger.time())} ${color.yellow('WARN')} ${msg}`),
  error: (msg: string, error?: any): void =>
    console.error(
      `${color.blue(logger.time())} ${color.red('ERROR')} ${msg}`,
      error || '',
    ),
  step: (step: string, msg: string): void =>
    console.log(
      `${color.blue(logger.time())} ${color.magenta(`[${step}]`)} ${msg}`,
    ),
};

export async function run(): Promise<void> {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const testDir = path.resolve(__dirname, '../..');

    // 获取构建命令，如果环境变量未定义则使用默认值
    const rootBuildCmd = process.env.VITE_BUILD_ROOT_CMD || 'pnpm build';
    const appBuildCmd = process.env.VITE_BUILD_APP_CMD || 'pnpm build:test';

    // 执行构建
    logger.step('构建', color.bold('开始构建项目...'));
    logger.info(`构建目录: ${color.yellow(testDir)}`);

    logger.step('构建', `执行 ${rootBuildCmd}...`);
    execSync(rootBuildCmd, { cwd: testDir, stdio: 'inherit' });

    logger.step('构建', `执行 ${appBuildCmd}...`);
    execSync(appBuildCmd, { cwd: __dirname, stdio: 'inherit' });
    logger.success('构建完成 ✓');

    // 执行部署
    const sourceDir = process.env.VITE_DEPLOY_SOURCE_DIR || './dist';
    logger.step(
      '部署',
      color.bold(`开始部署到测试服务器 ${color.yellow(testServer.host)}...`),
    );
    logger.info(`源目录: ${color.yellow(sourceDir)}`);
    await scpPromise(sourceDir, testServer);
    logger.success(`部署到 ${color.yellow(testServer.host)} 成功 ✓`);
  } catch (error: any) {
    logger.error('部署失败', error.message);
    // eslint-disable-next-line n/prefer-global/process, unicorn/no-process-exit
    process.exit(1);
  }
}

run();
