import { NetworkService, NetworkServicesFactory } from '@/common/providers/network.provider'
import { Component } from '@nestjs/common'
import Web3 from 'web3'

const UBIQ_DEFAULT_CLIENT_URL = 'http://localhost:8588'

const EXCHANGE_TICKERS = [
  'ubqusd',
  'ubqeur',
  'ubqbtc',
  'ubqeth',
  'ubqltc',
]

const VALID_RPC_METHODS = [
  'web3_clientVersion',
  'net_version',
  'net_listening',
  'net_peerCount',
  'eth_protocolVersion',
  'eth_syncing',
  'eth_mining',
  'eth_hashrate',
  'eth_gasPrice',
  'eth_accounts',
  'eth_blockNumber',
  'eth_getBalance',
  'eth_getStorageAt',
  'eth_getTransactionCount',
  'eth_getBlockTransactionCountByHash',
  'eth_getBlockTransactionCountByNumber',
  'eth_getUncleCountByBlockHash',
  'eth_getUncleCountByBlockNumber',
  'eth_getCode',
  'eth_call',
  'eth_getBlockByHash',
  'eth_getBlockByNumber',
  'eth_getTransactionByHash',
  'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex',
  'eth_getTransactionReceipt',
  'eth_getUncleByBlockHashAndIndex',
  'eth_getUncleByBlockNumberAndIndex',
  'eth_getCompilers',
  'eth_getLogs',
  'eth_getWork',
  'eth_sendRawTransaction',
  'eth_estimateGas',
  'eth_submitWork',
  'eth_submitHashrate',
]

@Component()
export default class UbiqWeb3ProvidersFactory implements NetworkServicesFactory {
  create(): Array<NetworkService> {
    const providers: Array<NetworkService> = []

    // Mainnet provider
    class UbiqMainnetWeb3Provider implements NetworkService {
      id() {
        return 'ubiq@mainnet'
      }

      network(): string {
        return 'ubiq'
      }

      chain(): string {
        return 'mainnet'
      }

      createWeb3Provider(): Web3 {
        const provider = new Web3.providers.HttpProvider(process.env.API_GUBIQ_MN || UBIQ_DEFAULT_CLIENT_URL)
        return new Web3(provider)
      }

      exchangeTickers(): String[] {
        return EXCHANGE_TICKERS
      }

      validRpcMethods(): String[] {
        throw VALID_RPC_METHODS
      }
    }
    const mainNet = new UbiqMainnetWeb3Provider()
    providers.push(mainNet)

    // Testnet provider
    class UbiqTestnetWeb3Provider implements NetworkService {
      id() {
        return 'ubiq@testnet'
      }

      network(): string {
        return 'ubiq'
      }

      chain(): string {
        return 'testnet'
      }

      createWeb3Provider(): Web3 {
        const provider = new Web3.providers.HttpProvider(process.env.API_GUBIQ_MN || UBIQ_DEFAULT_CLIENT_URL)
        return new Web3(provider)
      }

      exchangeTickers(): String[] {
        return EXCHANGE_TICKERS
      }

      validRpcMethods(): String[] {
        throw VALID_RPC_METHODS
      }
    }
    const test = new UbiqMainnetWeb3Provider()
    providers.push(test)

    return providers
  }
}
