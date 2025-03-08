declare module 'scp2' {
  interface ServerOptions {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    path?: string;
  }

  interface ScpClient {
    scp(source: string, server: ServerOptions, callback: (err?: Error) => void): void;
  }

  const client: ScpClient;
  export default client;
} 