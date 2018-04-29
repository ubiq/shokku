import BlacklistController from '@/server/blacklist/blacklist.controller'
import BlacklistService from '@/server/blacklist/blacklist.service'
import { Module } from '@nestjs/common'

@Module({
    controllers: [
      BlacklistController
    ],
    components: [
      BlacklistService
    ],
})
export default class BlacklistModule {}
