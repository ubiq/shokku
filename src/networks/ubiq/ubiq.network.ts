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
      const toCurrency = symbol.replace('ubq', '').toUpperCase()
      const res = await axios(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=UBQ&tsyms=${toCurrency}`)
      return this.toTickerResponse(toCurrency, res.data)
    } catch (error) {
      throw new TickerExchangeNotAvailable(error)
    }
  }

  private toTickerResponse(symbol: string, json) {
    const base = json.RAW.UBQ[symbol].FROMSYMBOL
    const quote = json.RAW.UBQ[symbol].TOSYMBOL
    const price = json.RAW.UBQ[symbol].PRICE
    const open_24h = json.RAW.UBQ[symbol].OPEN24HOUR
    const low_24h = json.RAW.UBQ[symbol].LOW24HOUR
    const exchange = json.RAW.UBQ[symbol].LASTMARKET
    const supply = json.RAW.UBQ[symbol].SUPPLY
    const market_cap = json.RAW.UBQ[symbol].MKTCAP
    const last_update = json.RAW.UBQ[symbol].LASTUPDATE
    const total_volume_24h = json.RAW.UBQ[symbol].TOTALVOLUME24H

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
