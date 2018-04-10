import { Module } from '@nestjs/common'
import { RouterModule } from 'nest-router'
import AppController from '@/app.controller'
import { routes } from '@/app.routes'
import BlacklistModule from '@/server/blacklist/blacklist.module'
import JsonRpcModule from '@/server/jsonrpc/jsonrpc.module'
import StatusModule from '@/server/status/status.module'
import TickerModule from '@/server/ticker/ticker.module'

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    BlacklistModule,
    JsonRpcModule,
    StatusModule,
    TickerModule,
  ],
  controllers: [
    AppController,
  ],
  components: [],
})
export class ApplicationModule { }
