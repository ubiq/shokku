import { ShokkuWeb3Provider } from '@/server/jsonrpc/helpers/web3.shokku'
import { Component } from '@nestjs/common'
import Web3 from 'web3'

const UBIQ_DEFAULT_HOST = 'http://localhost:8588'

@Component()
export default class UbiqWeb3ProvidersFactory {
  create(): Array<ShokkuWeb3Provider> {
    const providers: Array<ShokkuWeb3Provider> = []

    // Mainnet provider
    class UbiqMainnetWeb3Provider implements ShokkuWeb3Provider {
      id() {
        return 'ubiq-mainnet'
      }
      createProvider() {
        return new Web3.providers.HttpProvider(process.env.API_GUBIQ_MN || UBIQ_DEFAULT_HOST)
      }
    }
    const main = new UbiqMainnetWeb3Provider()
    providers.push(main)

    // Testnet provider
    class UbiqTestnetWeb3Provider implements ShokkuWeb3Provider {
      id() {
        return 'ubiq-testnet'
      }
      createProvider() {
        return new Web3.providers.HttpProvider(process.env.API_GUBIQ_MN || UBIQ_DEFAULT_HOST)
      }
    }
    const test = new UbiqMainnetWeb3Provider()
    providers.push(test)

    return providers
  }
}
