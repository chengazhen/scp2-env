/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEPLOY_SERVER_HOST: string;
  readonly VITE_DEPLOY_SERVER_PORT: string;
  readonly VITE_DEPLOY_SERVER_USERNAME: string;
  readonly VITE_DEPLOY_SERVER_PASSWORD: string;
  readonly VITE_DEPLOY_SERVER_PATH: string;
  readonly VITE_BUILD_ROOT_CMD: string;
  readonly VITE_BUILD_APP_CMD: string;
  readonly VITE_DEPLOY_SOURCE_DIR: string;
  readonly MODE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 