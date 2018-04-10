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
import JsonRpcModel from '@/server/jsonrpc/model/jsonrpc.model'
import JsonRpcValidationPipe from '@/server/jsonrpc/pipes/jsonrpc.validation.pipe'
import JsonRpcTransformerPipe from '@/server/jsonrpc/pipes/jsonrpc.transformer.pipe'

@Controller('jsonrpc')
export default class JsonRpcController {
  constructor(private readonly jsonRpcService: JsonRpcService) {
  }

  @Get('networks')
  networks() {
    return this.jsonRpcService.networks()
  }

  @Get('methods')
  methods() {
    return this.jsonRpcService.methods()
  }

  @Get(':method')
  @UsePipes(new JsonRpcTransformerPipe(), new JsonRpcValidationPipe())
  getMethod(jsonRpcModel: JsonRpcModel) {
    try {
      return this.jsonRpcService.rpcMethod(jsonRpcModel)
    } catch (err) {
      this.toHttpException(err)
    }
  }

  @Post()
  postMethod(@Body(new JsonRpcValidationPipe()) jsonRpcModel: JsonRpcModel) {
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
