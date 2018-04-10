import { Module } from '@nestjs/common'
import BlacklistController from '@/server/blacklist/blacklist.controller'
import BlacklistService from '@/server/blacklist/blacklist.service'

@Module({
    controllers: [BlacklistController],
    components: [BlacklistService],
})
export default class BlacklistModule {}
