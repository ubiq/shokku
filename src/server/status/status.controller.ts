import StatusService from '@/server/status/status.service'
import { Controller, Get } from '@nestjs/common'

@Controller('status')
export default class StatusController {
  constructor(private readonly statusService: StatusService) {
  }

  @Get()
  root() {
    return this.statusService.status()
  }
}
