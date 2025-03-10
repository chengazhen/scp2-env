/* eslint-disable no-console */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { consola } from 'consola';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import scpClient from 'scp2';

// 设置日志级别为 4 (debug)
consola.level = 4;

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
consola.info(`当前运行环境: ${mode}`);

// 加载对应环境的.env文件
const env = dotenv.config({ 
  path: `.env${mode !== 'development' ? `.${mode}` : ''}` 
});
expand(env);

// 打印所有环境变量，用于调试（隐藏密码）
consola.debug('环境变量:', {
  SCP2_DEPLOY_SERVER_HOST: process.env.SCP2_DEPLOY_SERVER_HOST,
  SCP2_DEPLOY_SERVER_PORT: process.env.SCP2_DEPLOY_SERVER_PORT,
  SCP2_DEPLOY_SERVER_USERNAME: process.env.SCP2_DEPLOY_SERVER_USERNAME,
  SCP2_DEPLOY_SERVER_PASSWORD: '******', // 隐藏密码
  SCP2_DEPLOY_SERVER_PATH: process.env.SCP2_DEPLOY_SERVER_PATH,
  SCP2_DEPLOY_SOURCE_DIR: process.env.SCP2_DEPLOY_SOURCE_DIR
});

// 测试服务器
const testServer = {
  host: process.env.SCP2_DEPLOY_SERVER_HOST || 'localhost',
  port: Number(process.env.SCP2_DEPLOY_SERVER_PORT || '22'),
  username: process.env.SCP2_DEPLOY_SERVER_USERNAME || 'root',
  password: process.env.SCP2_DEPLOY_SERVER_PASSWORD || '',
  path: process.env.SCP2_DEPLOY_SERVER_PATH || '/tmp',
};

// 将 scp 操作包装成 Promise
function scpPromise(source: string, server: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!source) {
      return reject(new Error('源目录不能为空'));
    }
    
    if (!server || !server.host || !server.path) {
      return reject(new Error('服务器配置不完整'));
    }

    consola.info(`开始传输: ${source} -> ${server.host}:${server.path}`);
    
    scpClient.scp(source, server, (err?: Error) => {
      if (err) {
        consola.error('传输失败:', err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function run(): Promise<void> {
  try {
    // 获取源目录，这里不再使用__dirname路径处理，直接使用环境变量中的目录
    const sourceDir = process.env.SCP2_DEPLOY_SOURCE_DIR || './dist';
    
    // 检查服务器配置是否完整
    if (!testServer.host || !testServer.path) {
      throw new Error('服务器配置不完整，请检查环境变量设置（SCP2_DEPLOY_SERVER_HOST, SCP2_DEPLOY_SERVER_PATH 等）');
    }
    
    // 检查源目录是否存在
    if (!sourceDir) {
      throw new Error('源目录未指定，请设置 SCP2_DEPLOY_SOURCE_DIR 环境变量');
    }

    // 执行部署
    consola.start(`开始部署到服务器 ${testServer.host}...`);
    consola.info(`源目录: ${sourceDir}`);
    consola.info(`目标路径: ${testServer.path}`);
    
    await scpPromise(sourceDir, testServer);
    consola.success(`部署到 ${testServer.host} 成功`);
  } catch (error: any) {
    consola.error('部署失败', error.message);
    // eslint-disable-next-line n/prefer-global/process, unicorn/no-process-exit
    process.exit(1);
  }
}

run();
