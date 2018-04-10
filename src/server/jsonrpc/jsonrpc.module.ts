import { Module } from '@nestjs/common'
import JsonRpcController from '@/server/jsonrpc/jsonrpc.controller'
import JsonRpcService from '@/server/jsonrpc/jsonrpc.service'

@Module({
    controllers: [JsonRpcController],
    components: [JsonRpcService],
})
export default class JsonRpcModule {}
