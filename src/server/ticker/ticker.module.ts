import TickerController from '@/server/ticker/ticker.controller'
import TickerService from '@/server/ticker/ticker.service'
import { Module } from '@nestjs/common'

@Module({
    controllers: [TickerController],
    components: [TickerService],
})
export default class TickerModule {}
