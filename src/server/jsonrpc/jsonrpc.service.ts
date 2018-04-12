import { Component } from '@nestjs/common'
import JsonRpcModel from '@/server/jsonrpc/models/jsonrpc.model'

@Component()
export default class JsonRpcService {
  networks(): object {
    return {
      networks: ['mainnet', 'testnet'],
    }
  }

  methods(): object {
    return {
      get: [
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
      ],
      post: [
        'eth_sendRawTransaction',
        'eth_estimateGas',
        'eth_submitWork',
        'eth_submitHashrate',
      ],
    }
  }

  rpcMethod(model: JsonRpcModel): object {
    throw new Error('Method not implemented.')
  }

  private randomId(): number {
    // 13 time related digits
    const dateId = new Date().getTime() * (10 ** 3)
    // 3 random digits
    const extraId = Math.floor(Math.random() * (10 ** 3))
    // 16 digits
    return dateId + extraId
  }
}
