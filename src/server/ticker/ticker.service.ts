import { NetworkChainRequestEntity } from '@/core/entities'
import { NetworksRepository } from '@/networks'
import { Component } from '@nestjs/common'
import axios from 'axios'

@Component()
export default class TickerService {
  constructor(private readonly networksRepository: NetworksRepository) {}

  symbols(entity: NetworkChainRequestEntity<any>) {
    const chain = this.networksRepository.getNetworkChain(entity.network, entity.chain)
    return {
      symbols: chain.exchangeSupportedTickers()
    }
  }

  async symbol(entity: NetworkChainRequestEntity<any>, symbol: string) {
    const chain = this.networksRepository.getNetworkChain(entity.network, entity.chain)
    return await chain.obtainExchangeTicker(symbol)
  }
}
