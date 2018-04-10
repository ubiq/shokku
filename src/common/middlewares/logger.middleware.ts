import {
  Middleware,
  NestMiddleware,
  ExpressMiddleware,
} from '@nestjs/common'
import l from '@/helpers/logger'

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
  resolve(name: string): ExpressMiddleware {
    return (req, res, next) => {
      l.log(`[${name}] Request...`)
      next()
    }
  }
}
