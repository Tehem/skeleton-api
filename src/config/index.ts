/**
 * config.ts
 * =========
 *
 * Exports all environment variable from .env files as a JS plain object
 *
 * dotenv-flow loads environment variables from .env.* files into process.env
 * (https://github.com/kerimdzhanov/dotenv-flow#readme)
 *
 * Default values are set in .env file. Override those values with a .env.local file.
 */
type SentryConfig = {
  dsn?: string;
};

type LoggerConfig = {
  level: string;
  logAsJson: string;
  consoleEnabled: string;
};

type Auth0Config = {
  audience: string;
  domain: string;
};

type Config = {
  port: number;
  env: 'production' | 'test' | 'development';
  appName: string;
  logger: LoggerConfig;
  sentry: SentryConfig;
  auth0: Auth0Config;
};

export default {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME,
  logger: {
    level: process.env.LOGGER_LEVEL || 'debug',
    logAsJson: process.env.LOGGER_AS_JSON,
    consoleEnabled: process.env.LOGGER_CONSOLE_ENABLED,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  auth0: {
    audience: process.env.AUTH0_AUDIENCE,
    domain: process.env.AUTH0_DOMAIN,
  },
} as Config;
