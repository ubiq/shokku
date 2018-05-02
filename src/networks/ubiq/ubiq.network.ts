import { WEB3_SUPPORTED_RPC_METHODS } from '@/core/web3'
import {
  NetworkChain,
  NetworkProvider,
  TickerResponse,
  BlacklistedDomainsResponse,
  ExchangeTickersResponse,
  SupportedRpcMethodsResponse,
  TickerExchangeNotAvailable
} from '@/networks/networks'
import axios from 'axios'
const Web3 = require('web3') // tslint:disable-line

const network = require('./ubiq.metadata.json') // tslint:disable-line

const createWeb3Provider = () => {
  const provider = new Web3.providers.HttpProvider(network.provider_url)
  const w3 = new Web3(provider)
  w3.extend({
    property: 'safe',
    methods: WEB3_SUPPORTED_RPC_METHODS
  })
  return w3
}

abstract class BaseUbiqNetworkService implements NetworkChain {
  readonly w3: Web3

  constructor() {
    this.w3 = createWeb3Provider()
  }

  id(): string {
    return ''
  }

  blacklistedDomains(): BlacklistedDomainsResponse {
    return new BlacklistedDomainsResponse(network.blacklist)
  }

  exchangeSupportedTickers(): ExchangeTickersResponse {
    return new ExchangeTickersResponse(network.exchange_tickers)
  }

  validRpcMethods(): SupportedRpcMethodsResponse {
    return new SupportedRpcMethodsResponse(network.supported_rpc_methods.get, network.supported_rpc_methods.post)
  }

  async obtainExchangeTicker(symbol: string): Promise<TickerResponse> {
    try {
      const res = await axios('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=UBQ&tsyms=BTC,USD,EUR,ETH,LTC')
      return this.toTickerResponse(symbol, res.data)
    } catch (error) {
      throw new TickerExchangeNotAvailable(error)
    }
  }

  private toTickerResponse(symbol: string, json) {
    const currency = symbol.replace('ubq', '').toUpperCase()

    const base = json.RAW.UBQ[currency].FROMSYMBOL
    const quote = json.RAW.UBQ[currency].TOSYMBOL
    const price = json.RAW.UBQ[currency].PRICE
    const open_24h = json.RAW.UBQ[currency].OPEN24HOUR
    const low_24h = json.RAW.UBQ[currency].LOW24HOUR
    const exchange = json.RAW.UBQ[currency].LASTMARKET
    const supply = json.RAW.UBQ[currency].SUPPLY
    const market_cap = json.RAW.UBQ[currency].MKTCAP
    const last_update = json.RAW.UBQ[currency].LASTUPDATE
    const total_volume_24h = json.RAW.UBQ[currency].TOTALVOLUME24H

    return new TickerResponse(base, quote, price, open_24h, low_24h, exchange, supply, market_cap, last_update, total_volume_24h)
  }
}

class UbiqMainnetNetworkService extends BaseUbiqNetworkService {
  id() {
    return 'mainnet'
  }
}

class UbiqTestnetNetworkService extends BaseUbiqNetworkService {
  id() {
    return 'testnet'
  }
}

export class UbiqNetworksProviderFactory {
  constructor() {}

  static create(options?: object): NetworkProvider {
    const chains: Map<string, NetworkChain> = new Map()

    // Mainnet provider
    const mainnet = new UbiqMainnetNetworkService()
    chains.set(mainnet.id(), mainnet)

    // Testnet provider
    const testnet = new UbiqTestnetNetworkService()
    chains.set(testnet.id(), testnet)

    const provider = new NetworkProvider('ubiq', chains)
    return provider
  }
}
