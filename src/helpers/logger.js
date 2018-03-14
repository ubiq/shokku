import pino from 'pino'

const l = pino({
  name: process.env.API_APP_ID || 'shokku',
  level: process.env.API_LOG_LEVEL || 'debug',
  enabled: process.env.API_LOGS_ENABLED === 'true' || false
})

export default l
