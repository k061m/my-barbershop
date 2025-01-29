const DEBUG = import.meta.env.DEV;

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  component?: string;
  data?: unknown;
  level?: LogLevel;
}

export const logger = {
  log: (message: string, options: LogOptions = {}) => {
    if (!DEBUG) return;

    const { component = '', data, level = 'info' } = options;
    const timestamp = new Date().toISOString();
    const prefix = component ? `[${component}]` : '';
    
    const logFn = {
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    }[level];

    if (data) {
      logFn(`${timestamp} ${prefix} ${message}`, '\nData:', data);
    } else {
      logFn(`${timestamp} ${prefix} ${message}`);
    }
  },

  info: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'info' });
  },

  warn: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'warn' });
  },

  error: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'error' });
  },

  debug: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'debug' });
  }
}; 
