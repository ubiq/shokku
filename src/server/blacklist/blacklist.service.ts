import { Component } from '@nestjs/common'
import { NetworksRepository } from '@/networks/networks'

@Component()
export default class BlacklistService {
  constructor(private readonly networksRepository: NetworksRepository) { }

  async blacklist(networkId: string, chainId: string) {
    const network = this.networksRepository.get(networkId).networks.get(chainId)
    return {
      blacklist: network.blacklistedDomains()
    }
  }
}
