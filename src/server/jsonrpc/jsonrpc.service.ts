import { NetworkChainRequestEntity } from '@/core/entities'
import { NetworksRepository, SupportedRpcMethodsResponse } from '@/networks/networks'
import JsonRpcEntity from '@/server/jsonrpc/jsonrpc.entity'
import { Component } from '@nestjs/common'

@Component()
export default class JsonRpcService {
  constructor(private readonly repository: NetworksRepository) { }

  networks(): object {
    const networks = this.repository.getAllNetworkProviders().map(p => p.id)
    return { networks }
  }

  chains(entity: NetworkChainRequestEntity<any>): object {
    const network = this.repository.getNetworkProvider(entity.network)
    const chains = Array.from(network.networks.keys())
    return { chains }
  }

  methods(entity: NetworkChainRequestEntity<any>): SupportedRpcMethodsResponse {
    const chain = this.repository.getNetworkChain(entity.network, entity.chain)
    return chain.validRpcMethods()
  }

  rpcMethod(entity: NetworkChainRequestEntity<JsonRpcEntity>): object {
    throw new Error('Method not implemented.')
  }

  private randomId(): number {
    // 13 time related digits
    const dateId = new Date().getTime() * (10 ** 3)
    // 3 random digits
    const extraId = Math.floor(Math.random() * (10 ** 3))
    // 16 digits
    return dateId + extraId
  }
}
