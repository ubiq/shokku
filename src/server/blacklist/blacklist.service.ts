import { NetworkChainRequestEntity } from '@/core/entities'
import { NetworksRepository } from '@/networks/networks'
import { Component } from '@nestjs/common'

@Component()
export default class BlacklistService {
  constructor(private readonly networksRepository: NetworksRepository) { }

  async blacklist(entity: NetworkChainRequestEntity<any>) {
    const chain = this.networksRepository.getNetworkChain(entity.network, entity.chain)
    return {
      blacklist: chain.blacklistedDomains()
    }
  }
}
