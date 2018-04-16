import { Module } from '@nestjs/common'
import TickerController from '@/server/ticker/ticker.controller'
import TickerService from '@/server/ticker/ticker.service'

@Module({
    controllers: [TickerController],
    components: [TickerService],
})
export default class TickerModule {}
