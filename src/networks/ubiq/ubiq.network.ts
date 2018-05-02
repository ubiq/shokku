import { WEB3_SUPPORTED_RPC_METHODS } from '@/core/web3'
import { NetworkChain, NetworkProvider } from '@/networks/networks'
import axios from 'axios'
const Web3 = require('web3') // tslint:disable-line

const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=UBQ&tsyms=BTC,USD,EUR,ETH,LTC'

const metadata = require('./ubiq.metadata.json')

const createWeb3Provider = () => {
  const provider = new Web3.providers.HttpProvider(metadata.default_client_url)
  const w3 = new Web3(provider)
  w3.extend({
    property: 'safe',
    methods: WEB3_SUPPORTED_RPC_METHODS,
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

  blacklistedDomains(): string[] {
    return metadata.blacklist
  }

  exchangeSupportedTickers(): string[] {
    return metadata.exchange_tickers
  }

  validRpcMethods(options?: any) {
    return options.formatted ? metadata.supported_rpc_methods_as_request : metadata.supported_rpc_methods
  }

  async obtainExchangeTicker(symbol: string) {
    const res = await axios(CRYPTOCOMPARE_API)
    return this.toTickerJson(symbol, res.data)
  }

  private toTickerJson(symbol: string, json) {
    const currency = symbol.replace('ubq', '').toUpperCase()
    return {
      base: json.RAW.UBQ[currency].FROMSYMBOL,
      quote: json.RAW.UBQ[currency].TOSYMBOL,
      price: json.RAW.UBQ[currency].PRICE,
      open_24h: json.RAW.UBQ[currency].OPEN24HOUR,
      low_24h: json.RAW.UBQ[currency].LOW24HOUR,
      exchange: json.RAW.UBQ[currency].LASTMARKET,
      supply: json.RAW.UBQ[currency].SUPPLY,
      market_cap: json.RAW.UBQ[currency].MKTCAP,
      last_update: json.RAW.UBQ[currency].LASTUPDATE,
      total_volume_24h: json.RAW.UBQ[currency].TOTALVOLUME24H
    }
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
