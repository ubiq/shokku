import { Component } from '@nestjs/common'
import Web3 from 'web3'

export interface NetworkProviderFactory {
  create(options: object): NetworkProvider
}

export class NetworkProvider {
  constructor(readonly id: string, readonly networks: Map<String, NetworkChain>) {}
}

export interface NetworkChain {
  id(): string
  exchangeSupportedTickers(): Array<String>
  validRpcMethods(): Array<String>
}
