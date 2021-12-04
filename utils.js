export const getSettings = () => {
  return {
    apiOrigin: process.env.API_ORIGIN,
    proxyListeningPath: process.env.PROXY_LISTENING_PATH,
    proxyDefaultPort: parseInt(process.env.PROXY_DEFAULT_PORT, 10),
    apiTimeout: parseInt(process.env.API_TIMEOUT, 10),
    allowCredentials: !!process.env.ALLOW_CREDENTIALS,
    allowHeaders: process.env.ALLOW_HEADERS,
  };
};
