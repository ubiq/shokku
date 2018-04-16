import { NetworkProvider } from '@/core/networks/network.provider'
import ShokkuNetworksFactory from '@/core/networks/shokku.networks.factory'
import { Component } from '@nestjs/common'

@Component()
export default class NetworksRepository {

  private readonly networks: Map<string, NetworkProvider>

  constructor() {
    this.networks = ShokkuNetworksFactory.create()
  }

  get(id: string): NetworkProvider {
    const network = this.networks[id]
    return network
  }

  getAll(): Array<NetworkProvider> {
    return Array.from(this.networks.values())
  }
}
