import { Module } from '@nestjs/common'
import StatusController from '@/api/server/status/status.controller'
import StatusService from '@/api/server/status/status.service'

@Module({
    controllers: [StatusController],
    components: [StatusService],
})
export default class StatusModule {}
