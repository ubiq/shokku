import { NetworkChain } from '@/core/decorators'
import { NetworkChainRequestEntity } from '@/core/entities'
import { NetworkChainValidatorPipe } from '@/core/pipes'
import JsonRpcEntity from '@/server/jsonrpc/jsonrpc.entity'
import JsonRpcService from '@/server/jsonrpc/jsonrpc.service'
import { Controller, Get, Post, UsePipes } from '@nestjs/common'

@Controller('jsonrpc')
export default class JsonRpcController {
  constructor(private readonly jsonRpcService: JsonRpcService) {
  }

  @Get('networks')
  networks() {
    return this.jsonRpcService.networks()
  }

  @Get(':network/chains')
  chains(@NetworkChain() req: NetworkChainRequestEntity<JsonRpcEntity>) {
    return this.jsonRpcService.chains(req)
  }

  @Get(':network/:chain/methods')
  methods(@NetworkChain() req: NetworkChainRequestEntity<JsonRpcEntity>) {
    return this.jsonRpcService.methods(req)
  }

  @Get(':network/:chain/:method')
  getMethod(@NetworkChain() req: NetworkChainRequestEntity<JsonRpcEntity>) {
    try {
      return this.jsonRpcService.rpcMethod(req)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  @Post(':network/:chain')
  postMethod(@NetworkChain() req: NetworkChainRequestEntity<JsonRpcEntity>) {
    try {
      return this.jsonRpcService.rpcMethod(req)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  private toHttpException(error: Error): never {
    throw new Error('Not implemented yet!')
  }
}
