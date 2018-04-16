import { NetworkChain, NetworkProvider, NetworkProviderFactory } from '@/core/networks/network.provider'
import { Joi, JoiRpcSchemas } from '@/core/validation/joi/joi.eth.extended'
import _ from '@/core/validation/lodash/lodash.eth.extended'
import { Web3Method } from '@/core/web3/web3.shokku'
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

const WEB3_VALID_RPC_METHODS = [
  new Web3Method({
    name: 'web3_clientVersion',
    call: 'web3_clientVersion',
  }),
  new Web3Method({
    name: 'net_version',
    call: 'net_version',
  }),
  new Web3Method({
    name: 'net_listening',
    call: 'net_listening',
  }),
  new Web3Method({
    name: 'net_peerCount',
    call: 'net_peerCount',
  }),
  new Web3Method({
    name: 'eth_protocolVersion',
    call: 'eth_protocolVersion',
  }),
  new Web3Method({
    name: 'eth_syncing',
    call: 'eth_syncing',
  }),
  new Web3Method({
    name: 'eth_mining',
    call: 'eth_mining',
  }),
  new Web3Method({
    name: 'eth_hashrate',
    call: 'eth_hashrate',
  }),
  new Web3Method({
    name: 'eth_gasPrice',
    call: 'eth_gasPrice',
  }),
  new Web3Method({
    name: 'eth_accounts',
    call: 'eth_accounts',
    outputFormatter: res => (_.isNull(res) ? [] : res),
  }),
  new Web3Method({
    name: 'eth_blockNumber',
    call: 'eth_blockNumber',
  }),
  new Web3Method({
    name: 'eth_getCompilers',
    call: 'eth_getCompilers',
  }),
  new Web3Method({
    name: 'eth_getWork',
    call: 'eth_getWork',
    outputFormatter: res => (_.isNull(res) ? [] : res),
  }),
  new Web3Method({
    name: 'eth_getBalance',
    call: 'eth_getBalance',
    params: 2,
    validate: args => {
      const address = args[0]
      const isAddress = _.isAddress(address)
      if (!isAddress) {
        return false
      }

      const quantity = args[1]
      const isQuantity = _.isBlockTag(quantity) || _.isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getStorageAt',
    call: 'eth_getStorageAt',
    params: 3,
    validate: args => {
      const address = args[0]
      const isAddress = _.isAddress(address)
      if (!isAddress) {
        return false
      }

      const position = args[1]
      const isPosition = _.isHex(position)
      if (!isPosition) {
        return false
      }

      const blockNumber = args[2]
      const isBlockNumber = _.isBlockTag(blockNumber) || _.isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getTransactionCount',
    call: 'eth_getTransactionCount',
    params: 2,
    validate: args => {
      const address = args[0]
      const isAddress = _.isAddress(address)
      if (!isAddress) {
        return false
      }

      const quantity = args[1]
      const isQuantity = _.isBlockTag(quantity) || _.isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getBlockTransactionCountByHash',
    call: 'eth_getBlockTransactionCountByHash',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return _.isTxHash(txHash)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getBlockTransactionCountByNumber',
    call: 'eth_getBlockTransactionCountByNumber',
    params: 1,
    validate: args => {
      const quantity = args[0]
      return _.isBlockTag(quantity) || _.isHex(quantity)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getUncleCountByBlockHash',
    call: 'eth_getUncleCountByBlockHash',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return _.isTxHash(txHash)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getUncleCountByBlockNumber',
    call: 'eth_getUncleCountByBlockNumber',
    params: 1,
    validate: args => {
      const quantity = args[0]
      return _.isBlockTag(quantity) || _.isHex(quantity)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getCode',
    call: 'eth_getCode',
    params: 2,
    validate: args => {
      const address = args[0]
      const isAddress = _.isAddress(address)
      if (!isAddress) {
        return false
      }

      const quantity = args[1]
      const isQuantity = _.isBlockTag(quantity) || _.isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_call',
    call: 'eth_call',
    params: 2,
    validate: args => {
      const obj = args[0]
      const isObj = _.isObject(obj)
      if (!isObj) {
        return false
      }

      const result = Joi.validate(obj, JoiRpcSchemas.SendTx)
      if (result.error) {
        return false
      }

      const quantity = args[1]
      const isQuantity = _.isBlockTag(quantity) || _.isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getBlockByHash',
    call: 'eth_getBlockByHash',
    params: 2,
    validate: args => {
      const txhash = args[0]
      const isTxHash = _.isTxHash(txhash)
      if (!isTxHash) {
        return false
      }

      const bool = args[1]
      const isBool = _.isBoolean(_.toBoolean(bool))
      if (!isBool) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getBlockByNumber',
    call: 'eth_getBlockByNumber',
    params: 2,
    validate: args => {
      const blockNumber = args[0]
      const isBlockNumber = _.isBlockTag(blockNumber) || _.isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      const bool = args[1]
      const isBoolean = _.isBoolean(_.toBoolean(bool))
      if (!isBoolean) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getTransactionByHash',
    call: 'eth_getTransactionByHash',
    params: 1,
    validate: args => {
      const txHash = args[0]
      const isTxHash = _.isBlockTag(txHash) || _.isHex(txHash)
      return isTxHash
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getTransactionByBlockHashAndIndex',
    call: 'eth_getTransactionByBlockHashAndIndex',
    params: 2,
    validate: args => {
      const txHash = args[0]
      const isTxHash = _.isTxHash(txHash)
      if (!isTxHash) {
        return false
      }

      const index = args[1]
      const isIndex = _.isHex(index)
      if (!isIndex) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getTransactionByBlockNumberAndIndex',
    call: 'eth_getTransactionByBlockNumberAndIndex',
    params: 2,
    validate: args => {
      const blockNumber = args[0]
      const isBlockNumber = _.isBlockTag(blockNumber) || _.isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      const index = args[1]
      const isIndex = _.isHex(index)
      if (!isIndex) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getTransactionReceipt',
    call: 'eth_getTransactionReceipt',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return _.isTxHash(txHash)
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getUncleByBlockNumberAndIndex',
    call: 'eth_getUncleByBlockNumberAndIndex',
    params: 2,
    validate: args => {
      const blockNumber = args[0]
      const isBlockNumber = _.isBlockTag(blockNumber) || _.isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      const indexPos = args[1]
      const isIndexPos = _.isHex(indexPos)
      if (!isIndexPos) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getUncleByBlockHashAndIndex',
    call: 'eth_getUncleByBlockHashAndIndex',
    params: 2,
    validate: args => {
      const txHash = args[0]
      const isTxHash = _.isTxHash(txHash)
      if (!isTxHash) {
        return false
      }

      const indexPos = args[1]
      const isIndexPos = _.isHex(indexPos)
      if (!isIndexPos) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getLogs',
    call: 'eth_getLogs',
    params: 1,
    validate: args => {
      const filterObj = args[0]
      const isObj = _.isObject(filterObj)
      if (!isObj) {
        return false
      }

      const result = Joi.validate(filterObj, JoiRpcSchemas.Filter)
      if (result.error) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? [] : res),
  }),
  new Web3Method({
    name: 'eth_sendRawTransaction',
    call: 'eth_sendRawTransaction',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return _.isTxHash(txHash)
    },
  }),
  new Web3Method({
    name: 'eth_estimateGas',
    call: 'eth_estimateGas',
    params: 2,
    validate: args => {
      const obj = args[0]
      const isObj = _.isObject(obj)
      if (!isObj) {
        return false
      }

      const result = Joi.validate(obj, JoiRpcSchemas.Filter)
      if (result.error) {
        return false
      }

      const quantity = args[1]
      const isQuantity = _.isBlockTag(quantity) || _.isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_submitWork',
    call: 'eth_submitWork',
    params: 3,
    validate: args => {
      const nonce = args[0]
      const isNonce = _.isNonce(nonce)
      if (!isNonce) {
        return false
      }

      const headerHash = args[1]
      const isHeaderHash = _.isTxHash(headerHash)
      if (!isHeaderHash) {
        return false
      }

      const mixDigest = args[2]
      const isMixDigest = _.isTxHash(mixDigest)
      if (!isMixDigest) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_submitHashrate',
    call: 'eth_submitHashrate',
    params: 2,
    validate: args => {
      const hashrate = args[0]
      const isHashrate = _.isTxHash(hashrate)
      if (!isHashrate) {
        return false
      }

      const id = args[1]
      const isId = _.isTxHash(id)
      if (!isId) {
        return false
      }

      return true
    },
  }),
]

const createWeb3Provider = () => {
  const provider = new Web3.providers.HttpProvider(process.env.API_GUBIQ_MN || UBIQ_DEFAULT_CLIENT_URL)
    const w3 = new Web3(provider)
    w3.extend({
      property: 'safe',
      methods: VALID_RPC_METHODS
    })
    return w3
}

class UbiqMainnetNetworkService implements NetworkChain {

  readonly w3: Web3

  constructor() {
    this.w3 = createWeb3Provider()
  }

  id() {
    return 'mainnet'
  }

  exchangeSupportedTickers(): String[] {
    return EXCHANGE_TICKERS
  }

  validRpcMethods(): String[] {
    throw VALID_RPC_METHODS
  }

}

class UbiqTestnetNetworkService implements NetworkChain {

  private readonly w3: Web3

  constructor() {
    this.w3 = createWeb3Provider()
  }

  id() {
    return 'testnet'
  }

  exchangeSupportedTickers(): String[] {
    return EXCHANGE_TICKERS
  }

  validRpcMethods(): String[] {
    throw VALID_RPC_METHODS
  }
}

export class UbiqNetworksProviderFactory implements NetworkProviderFactory {
  create(options: object): NetworkProvider {
    const chains: Map<String, NetworkChain> = new Map()

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
