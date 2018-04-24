import ShokkuNetworksFactory from '@/networks/shokku.networks.factory'
import { Component } from '@nestjs/common'

export class NetworkProvider {
  constructor(readonly id: string, readonly networks: Map<string, NetworkChain>) {}
}

export interface NetworkChain {
  id(): string
  blacklistedDomains(): string[]
  exchangeSupportedTickers(): string[]
  validRpcMethods(options?: any)
}

export class RpcMethodsOptions {
  readonly formatted?: boolean = true
}

@Component()
export class NetworksRepository {

  private readonly networks: Map<string, NetworkProvider>

  constructor() {
    this.networks = ShokkuNetworksFactory.create()
  }

  get(id: string): NetworkProvider {
    const provider = this.networks[id]
    if (!provider) {
      throw new NetworkProviderNotFound('${id} is not a valid network provider')
    }
    return provider
  }

  getAll(): NetworkProvider[] {
    return Array.from(this.networks.values())
  }
}

export class NetworkProviderNotFound extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, NetworkProviderNotFound)
  }
}
