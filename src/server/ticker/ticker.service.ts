import { NetworkChainRequestEntity } from '@/core/entities'
import { NetworksRepository } from '@/networks'
import { Component } from '@nestjs/common'
import { HttpExceptionAdapter } from 'core/exceptions'

@Component()
export default class TickerService {
  constructor(private readonly networksRepository: NetworksRepository) {}

  symbols(entity: NetworkChainRequestEntity<any>) {
    const chain = this.networksRepository.getNetworkChain(entity.network, entity.chain)
    return chain.exchangeSupportedTickers()
  }

  async symbol(entity: NetworkChainRequestEntity<any>, symbol: string) {
    const chain = this.networksRepository.getNetworkChain(entity.network, entity.chain)
    try {
      return await chain.obtainExchangeTicker(symbol)
    } catch (error) {
      HttpExceptionAdapter.toHttpException(error)
    }
  }
}
