const fs = require("node:fs");
const path = require("node:path");

function loadEnvFile(fileName) {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) return {};

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return env;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return env;

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      env[key] = rawValue.replace(/^["']|["']$/g, "");
      return env;
    }, {});
}

const fileEnv = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local")
};

module.exports = {
  apps: [
    {
      name: "leadfix",
      script: "node_modules/next/dist/bin/next",
      args: "start --hostname 127.0.0.1 --port 3000",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        ...fileEnv,
        PROXYAPI_BASE_URL: fileEnv.PROXYAPI_BASE_URL || "https://openai.api.proxyapi.ru/v1",
        PROXYAPI_AUDIT_MODEL: fileEnv.PROXYAPI_AUDIT_MODEL || "gpt-5.4-mini",
        YOOKASSA_RETURN_URL: fileEnv.YOOKASSA_RETURN_URL || "https://leadfix.ru/checkout/success"
      }
    }
  ]
};
