import { Component } from '@nestjs/common'
import NetworksRepository from '@/core/networks/networks.repository'

@Component()
export default class BlacklistService {
  constructor(private readonly networksRepository: NetworksRepository) { }

  async blacklist(network: string, chain: string) {
    return {
      blacklist: []
    }
  }
}
