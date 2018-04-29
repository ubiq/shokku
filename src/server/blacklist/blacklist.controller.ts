import { NetworkChain } from '@/core/decorators'
import { NetworkChainRequestEntity } from '@/core/entities'
import BlacklistService from '@/server/blacklist/blacklist.service'
import { Controller, Get } from '@nestjs/common'

@Controller('blacklist')
export default class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {
  }

  @Get(':network/:chain')
  root(@NetworkChain() req: NetworkChainRequestEntity<any>) {
    return this.blacklistService.blacklist(req)
  }
}
