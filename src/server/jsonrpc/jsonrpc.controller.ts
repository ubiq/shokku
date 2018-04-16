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

  @Get()
  networks() {
    return this.jsonRpcService.networks()
  }

  @Get(':network/chains')
  chains(network) {
    return this.jsonRpcService.chains(network)
  }

  @Get(':network/methods')
  methods() {
    return this.jsonRpcService.methods()
  }

  @Get(':network/:method')
  @UsePipes(new JsonRpcPipe())
  getMethod(jsonRpcModel: JsonRpcModel) {
    try {
      return this.jsonRpcService.rpcMethod(jsonRpcModel)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  @Post()
  postMethod(@Body(new JsonRpcPipe()) jsonRpcModel: JsonRpcModel) {
    try {
      return this.jsonRpcService.rpcMethod(jsonRpcModel)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  private toHttpException(error: Error): never {
    throw new Error('Not implemented yet!')
  }
}
