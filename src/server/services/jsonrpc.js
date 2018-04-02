import errors from 'common-errors'

import web3 from '@/helpers/web3.shokku'
import l from '@/helpers/logger'

class JsonRpcService {
  async networks() {
    l.info('JsonRpcService - methods() / Retrieving JSON RPC networks!')
    return {
      networks: ['mainnet', 'testnet']
    }
  }

  async methods() {
    l.info('JsonRpcService - methods() / Retrieving JSON RPC methods!')
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
        'eth_getWork'
      ],
      post: [
        'eth_sendRawTransaction',
        'eth_estimateGas',
        'eth_submitWork',
        'eth_submitHashrate'
      ]
    }
  }

  async method(opts = {
    network: 'mn',
    method: '',
    params: ''
  }) {
    l.info(`JsonRpcService - method() / Current params: Network - ${opts.network} | Method - ${opts.method} | Params - ${opts.params}`)

    const isSafe = web3[opts.network].safe[opts.method]
    if (!isSafe) {
      l.error(`JsonRpcService - method() / Requested method is not safe. Method: ${opts.method}`)
      const msg = 'Bad JSON RPC method called. Please check the list of compatible methods doing a GET request in /jsonrpc/{network}/methods.'
      throw new errors.NotPermittedError(msg)
    }

    try {
      const response = await web3[opts.network].safe[opts.method].apply(this, opts.params)
      return {
        id: opts.id || this.randomId(),
        jsonrpc: '2.0',
        result: response
      }
    } catch (err) {
      const errMsg = err.message.replace(/"/g, "'")
      l.error('JsonRpcService - method() / ', errMsg)
      let error
      if (errMsg.match(/^Returned error/)) {
        error = new errors.Error(err.message)
      } else if (errMsg.match(/^Invalid number of parameters/)) {
        error = new errors.ArgumentError('Invalid number of params used', err)
      } else if (errMsg.match(/^(?:CONNECTION ERROR|CONNECTION TIMEOUT|Provider not set or invalid)/)) {
        error = new errors.ConnectionError('Impossible to connect to node.', err)
      } else if (errMsg.match(/^Invalid JSON RPC response/)) {
        error = new errors.InvalidOperationError('Invalid JSON RPC response', err)
      } else {
        error = new errors.Error('Invalid JSON RPC response from node')
      }
      throw error
    }
  }

  // Extracted from Sparrow code
  randomId() {
    // 13 time digits
    const datePart = new Date().getTime() * (10 ** 3)
    // 3 random digits
    const extraPart = Math.floor(Math.random() * (10 ** 3))
    // 16 digits
    return datePart + extraPart
  }
}

export default new JsonRpcService()
