import { Logger, LoggerConfig } from '@/core/modules/logger/logger'

export function createLoggerProviders(config?: LoggerConfig) {
  return [
    {
      provide: Logger,
      useFactory: () => new Logger(config)
    }
  ]
}
