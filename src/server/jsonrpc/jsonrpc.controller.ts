import {
  Get,
  Post,
  Query,
  Param,
  Body,
  UsePipes,
  HttpCode,
  Controller,
  LoggerService,
} from '@nestjs/common'
import JsonRpcService from '@/server/jsonrpc/jsonrpc.service'
import JsonRpcModel from '@/server/jsonrpc/models/jsonrpc.model'
import JsonRpcPipe from '@/server/jsonrpc/pipes/jsonrpc.validation.pipe'

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

  @Get(':network/methods')
  methods(@Param() params) {
    return this.jsonRpcService.methods(params.network)
  }

  @Get(':network/:method')
  @UsePipes(new JsonRpcPipe())
  getMethod(@Param() params, jsonRpcModel: JsonRpcModel) {
    try {
      return this.jsonRpcService.rpcMethod(params.network, jsonRpcModel)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  @Post(':network')
  postMethod(@Param() params, @Body(new JsonRpcPipe()) jsonRpcModel: JsonRpcModel) {
    try {
      return this.jsonRpcService.rpcMethod(params.network, jsonRpcModel)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  private toHttpException(error: Error): never {
    throw new Error('Not implemented yet!')
  }
}
