import { Module } from '@nestjs/common'
import StatusController from '@/server/status/status.controller'
import StatusService  from '@/server/status/status.service'

@Module({
    controllers: [StatusController],
    components: [StatusService],
})
export default class StatusModule {}
