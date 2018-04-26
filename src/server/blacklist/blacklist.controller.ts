import { NetworkChain } from '@/core/decorators/decorators'
import { NetworkChainRequestEntity } from '@/core/entities/network.chain.request.entity'
import { NetworkChainValidatorPipe } from '@/core/pipes/network.chain.validator.pipe'
import BlacklistService from '@/server/blacklist/blacklist.service'
import { Controller, Get, HttpException, HttpStatus, UsePipes } from '@nestjs/common'
import { NetworkProviderNotFound } from 'networks/networks'

@Controller('blacklist')
export default class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {
  }

  @Get(':network/:chain')
  @UsePipes(new NetworkChainValidatorPipe())
  async root(@NetworkChain() entity: NetworkChainRequestEntity<any>) {
    try {
      return await this.blacklistService.blacklist(entity)
    } catch (error) {
      throw this.toHttpException(error)
    }
  }

  toHttpException(error: Error): any {
    if (error instanceof NetworkProviderNotFound) {
      throw new HttpException('Invalid network/chain requested', HttpStatus.NOT_FOUND)
    }

    throw new HttpException('Can\'t retrieve blacklist resource from Github. Please, try again later.', HttpStatus.BAD_GATEWAY)
  }
}
