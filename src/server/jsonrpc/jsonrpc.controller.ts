import { NetworkChain } from '@/core/decorators/decorators'
import { NetworkChainRequestEntity } from '@/core/entities/network.chain.request.entity'
import { NetworkChainValidatorPipe } from '@/core/pipes/network.chain.validator.pipe'
import JsonRpcEntity from '@/server/jsonrpc/jsonrpc.entity'
import JsonRpcService from '@/server/jsonrpc/jsonrpc.service'
import { Controller, Get, Param, Post, UsePipes } from '@nestjs/common'

@Controller('jsonrpc')
export default class JsonRpcController {
  constructor(private readonly jsonRpcService: JsonRpcService) {
  }

  @Get('networks')
  networks() {
    return this.jsonRpcService.networks()
  }

  @Get(':network/chains')
  chains(@Param() params) {
    return this.jsonRpcService.chains(params.network)
  }

  @Get(':network/:chain/methods')
  methods(@Param() params) {
    return this.jsonRpcService.methods(params.network)
  }

  @Get(':network/:chain/:method')
  @UsePipes(new NetworkChainValidatorPipe())
  getMethod(@NetworkChain() entity: NetworkChainRequestEntity<JsonRpcEntity>) {
    try {
      return this.jsonRpcService.rpcMethod(entity)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  @Post(':network/:chain')
  @UsePipes(new NetworkChainValidatorPipe())
  postMethod(@NetworkChain() entity: NetworkChainRequestEntity<JsonRpcEntity>) {
    try {
      return this.jsonRpcService.rpcMethod(entity)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  private toHttpException(error: Error): never {
    throw new Error('Not implemented yet!')
  }
}
