import { Component } from '@nestjs/common'
import Web3 from 'web3'

export interface NetworkProviderFactory {
  create(options: object): NetworkProvider
}

export class NetworkProvider {
  constructor(readonly id: string, readonly networks: Map<string, NetworkChain>) {}
}

export interface NetworkChain {
  id(): string
  exchangeSupportedTickers(): Array<string>
  validRpcMethods(options?: any)
}
