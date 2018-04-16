import { Component } from '@nestjs/common'
import Web3 from 'web3'

export interface NetworkService {
  id(): string

  network(): string

  chain(): string

  createWeb3Provider(): Web3

  exchangeTickers(): Array<String>

  validRpcMethods(): Array<String>
}

export interface NetworkServicesFactory {
  create(options: object): Array<NetworkService>
}

@Component()
export class NetworksProvider {

  constructor(private readonly networks: Array<NetworkService>) {
    this.networks = networks
  }

  networkService(id: string): NetworkService {
    return this.networks[id]
  }
}
