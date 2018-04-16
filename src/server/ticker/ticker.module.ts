import { Module } from '@nestjs/common'
import TickerController from '@/api/server/ticker/ticker.controller'
import TickerService from '@/api/server/ticker/ticker.service'

@Module({
    controllers: [TickerController],
    components: [TickerService],
})
export default class TickerModule {}
