import JsonRpcService from '@/server/jsonrpc/jsonrpc.service'
import JsonRpcEntity from '@/server/jsonrpc/entities/jsonrpc.entity'
import JsonRpcPipe from '@/server/jsonrpc/pipes/jsonrpc.validation.pipe'
import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common'

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
  @UsePipes(new JsonRpcPipe())
  getMethod(@Param() params, entity: JsonRpcEntity) {
    try {
      return this.jsonRpcService.rpcMethod(params.network, entity)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  @Post(':network/:chain')
  postMethod(@Param() params, @Body(new JsonRpcPipe()) entity: JsonRpcEntity) {
    try {
      return this.jsonRpcService.rpcMethod(params.network, entity)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  private toHttpException(error: Error): never {
    throw new Error('Not implemented yet!')
  }
}
