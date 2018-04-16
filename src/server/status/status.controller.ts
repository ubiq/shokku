import { Get, HttpCode, Controller } from '@nestjs/common'
import StatusService from '@/api/server/status/status.service'

@Controller('status')
export default class StatusController {
  constructor(private readonly statusService: StatusService) {
  }

  @Get()
  root() {
    return this.statusService.status()
  }
}
