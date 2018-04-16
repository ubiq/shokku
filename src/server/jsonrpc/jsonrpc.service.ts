import { Component } from '@nestjs/common'
import JsonRpcModel from '@/server/jsonrpc/models/jsonrpc.model'
import NetworksRepository from '@/core/networks/networks.repository'

@Component()
export default class JsonRpcService {
  constructor(private readonly repository: NetworksRepository) { }

  networks(): object {
    const networks = this.repository.getAll().map(p => p.id)
    return { networks }
  }

  chains(network: string): object {
    const n = this.repository.get(network)
    const chains = Array.from(n.networks.keys())
    return { chains }
  }

  methods(network: string): object {
    const n = this.repository.get(network)

    return
  }

  rpcMethod(network: string, model: JsonRpcModel): object {
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
