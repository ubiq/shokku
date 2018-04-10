import { Get, Controller, HttpException, HttpStatus } from '@nestjs/common'
import BlacklistService from '@/server/blacklist/blacklist.service'

@Controller('blacklist')
export default class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {
  }

  @Get()
  async root() {
    try {
      return await this.blacklistService.blacklist()
    } catch (error) {
      throw new HttpException('Can\'t retrieve blacklist resource from Github. Please, try again later.', HttpStatus.BAD_GATEWAY)
    }
  }
}
