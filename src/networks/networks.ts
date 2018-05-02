import { Component } from '@nestjs/common'
import { UbiqNetworksProviderFactory } from '@/networks/ubiq'

// Interfaces

export class NetworkProvider {
  constructor(readonly id: string, readonly networks: Map<string, NetworkChain>) {}
}

export interface NetworkChain {
  id(): string
  blacklistedDomains(): BlacklistedDomainsResponse
  exchangeSupportedTickers(): ExchangeTickersResponse
  obtainExchangeTicker(symbol: string): Promise<TickerResponse>
  validRpcMethods(): SupportedRpcMethodsResponse
}

// Models

export class BlacklistedDomainsResponse {
  constructor(readonly blacklist: string[]) {}
}

export class ExchangeTickersResponse {
  constructor(readonly symbols: string[]) {}
}

export class TickerResponse {
  constructor(
    readonly base: string,
    readonly quote: string,
    readonly price: string,
    readonly open_24h: string,
    readonly low_24h: string,
    readonly exchange: string,
    readonly supply: number,
    readonly market_cap: number,
    readonly last_update: number,
    readonly total_volume_24h: string
  ) {}
}

export class SupportedRpcMethodsResponse {
  constructor(readonly get: string[], readonly post: string[]) {}
}

// Errors

export class NetworkProviderNotFound extends Error {}

export class NetworkChainNotFound extends Error {}

export class TickerExchangeInvalidSymbol extends Error {}

export class TickerExchangeNotAvailable extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, TickerExchangeNotAvailable)
  }
}

// Factories

export class ShokkuNetworksFactory {
  static create(): Map<string, NetworkProvider> {
    const networks = new Map<string, NetworkProvider>()

    // Ubiq
    const ubiq = UbiqNetworksProviderFactory.create()
    networks.set(ubiq.id, ubiq)

    return networks
  }
}

// NestJs Repository

@Component()
export class NetworksRepository {
  private readonly networks: Map<string, NetworkProvider>

  constructor() {
    this.networks = ShokkuNetworksFactory.create()
  }

  getNetworkProvider(networkId: string): NetworkProvider {
    const provider = this.networks.get(networkId)
    if (!provider) {
      throw new NetworkProviderNotFound(`${networkId} is not a valid network provider`)
    }
    return provider
  }

  getNetworkChain(networkId: string, chainId: string): NetworkChain {
    const provider = this.getNetworkProvider(networkId)
    const chain = provider.networks.get(chainId)
    if (!chain) {
      throw new NetworkChainNotFound(`${chainId} is not a valid network chain`)
    }
    return chain
  }

  hasNetworkChain(networkId: string, chainId: string): boolean {
    try {
      return this.getNetworkChain(networkId, chainId) != null
    } catch (error) {
      return false
    }
  }

  getAllNetworkProviders(): NetworkProvider[] {
    return Array.from(this.networks.values())
  }
}
