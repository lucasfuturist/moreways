import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { service: 'law-engine' }, 
  formatters: {
    level: (label) => { return { level: label.toUpperCase() }; },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});