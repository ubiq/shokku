import BlacklistModule from '@/server/blacklist/blacklist.module'
import JsonRpcModule from '@/server/jsonrpc/jsonrpc.module'
import StatusModule from '@/server/status/status.module'
import TickerModule from '@/server/ticker/ticker.module'
import { Routes } from 'nest-router'

export const routes: Routes = [
  {
    path: '/v1',
    children: [BlacklistModule, JsonRpcModule, StatusModule, TickerModule],
  },
]
