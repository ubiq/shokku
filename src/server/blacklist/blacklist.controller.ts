import BlacklistService from '@/server/blacklist/blacklist.service'
import { Controller, Get, HttpException, HttpStatus, Param, UsePipes } from '@nestjs/common'
import { NetworkChainPipe } from '@/core/pipes/network.chain.pipe'
import { NetworkChainRequestEntity } from '@/core/entities/network.chain.request.entity'

@Controller('blacklist')
export default class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {
  }

  @Get(':network/:chain')
  @UsePipes(new NetworkChainPipe())
  async root(entity: NetworkChainRequestEntity<any>) {
    try {
      return await this.blacklistService.blacklist('', '')
    } catch (error) {
      throw this.toHttpException(error)
    }
  }

  toHttpException(error: Error): any {
    throw new HttpException('Can\'t retrieve blacklist resource from Github. Please, try again later.', HttpStatus.BAD_GATEWAY)
  }
}
