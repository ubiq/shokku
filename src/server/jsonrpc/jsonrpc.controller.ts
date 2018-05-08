import { NetworkChain } from '@/core/decorators'
import { NetworkChainRequestEntity } from '@/core/entities'
import { HttpExceptionAdapter } from '@/core/exceptions'
import JsonRpcEntity from '@/server/jsonrpc/jsonrpc.entity'
import JsonRpcService from '@/server/jsonrpc/jsonrpc.service'
import { Controller, Get, Post } from '@nestjs/common'

@Controller('jsonrpc')
export default class JsonRpcController {
  constructor(private readonly jsonRpcService: JsonRpcService) {}

  @Get('networks')
  networks() {
    return this.jsonRpcService.networks()
  }

  @Get(':network/chains')
  chains(
    @NetworkChain({ ignoreChain: true })
    req: NetworkChainRequestEntity<JsonRpcEntity>
  ) {
    try {
      return this.jsonRpcService.chains(req)
    } catch (err) {
      throw HttpExceptionAdapter.toHttpException(err)
    }
  }

  @Get(':network/:chain/methods')
  methods(@NetworkChain() req: NetworkChainRequestEntity<JsonRpcEntity>) {
    try {
      return this.jsonRpcService.methods(req)
    } catch (err) {
      throw HttpExceptionAdapter.toHttpException(err)
    }
  }

  @Get(':network/:chain/:method')
  getMethod(@NetworkChain() req: NetworkChainRequestEntity<JsonRpcEntity>) {
    try {
      return this.jsonRpcService.rpcMethod(req)
    } catch (err) {
      throw HttpExceptionAdapter.toHttpException(err)
    }
  }

  @Post(':network/:chain')
  postMethod(@NetworkChain() req: NetworkChainRequestEntity<JsonRpcEntity>) {
    try {
      return this.jsonRpcService.rpcMethod(req)
    } catch (err) {
      throw HttpExceptionAdapter.toHttpException(err)
    }
  }
}
