// Determine if we're in development mode
const DEBUG = import.meta.env.DEV;

// Define the possible log levels
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Define the structure for log options
interface LogOptions {
  component?: string;  // Optional: Name of the component logging the message
  data?: unknown;      // Optional: Additional data to log
  level?: LogLevel;    // Optional: Log level (defaults to 'info' if not specified)
}

export const logger = {
  // Main logging function
  log: (message: string, options: LogOptions = {}) => {
    // Only log if in development mode
    if (!DEBUG) return;

    // Destructure options with defaults
    const { component = '', data, level = 'info' } = options;
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Create prefix if component is specified
    const prefix = component ? `[${component}]` : '';
    
    // Map log levels to corresponding console functions
    const logFn = {
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    }[level];

    // Log message with or without additional data
    if (data) {
      logFn(`${timestamp} ${prefix} ${message}`, '\nData:', data);
    } else {
      logFn(`${timestamp} ${prefix} ${message}`);
    }
  },

  // Convenience method for info level logging
  info: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'info' });
  },

  // Convenience method for warn level logging
  warn: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'warn' });
  },

  // Convenience method for error level logging
  error: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'error' });
  },

  // Convenience method for debug level logging
  debug: (message: string, options: Omit<LogOptions, 'level'> = {}) => {
    logger.log(message, { ...options, level: 'debug' });
  }
}
