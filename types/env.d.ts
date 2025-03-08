/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SCP2_DEPLOY_SERVER_HOST: string;
  readonly SCP2_DEPLOY_SERVER_PORT: string;
  readonly SCP2_DEPLOY_SERVER_USERNAME: string;
  readonly SCP2_DEPLOY_SERVER_PASSWORD: string;
  readonly SCP2_DEPLOY_SERVER_PATH: string;
  readonly SCP2_DEPLOY_SOURCE_DIR: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 