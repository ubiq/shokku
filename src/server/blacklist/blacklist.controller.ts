import { NetworkChain } from '@/core/decorators'
import { NetworkChainRequestEntity } from '@/core/entities'
import { NetworkChainValidatorPipe } from '@/core/pipes'
import BlacklistService from '@/server/blacklist/blacklist.service'
import { Controller, Get, HttpException, HttpStatus, UsePipes } from '@nestjs/common'
import { NetworkProviderNotFound } from '@/networks/networks'

@Controller('blacklist')
export default class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {
  }

  @Get(':network/:chain')
  async root(@NetworkChain() req: NetworkChainRequestEntity<any>) {
    try {
      return await this.blacklistService.blacklist(req)
    } catch (error) {
      throw this.toHttpException(error)
    }
  }

  toHttpException(error: Error): any {
    throw new HttpException('The server can\'t process properly this request. Please, try again it later.', HttpStatus.BAD_GATEWAY)
  }
}
