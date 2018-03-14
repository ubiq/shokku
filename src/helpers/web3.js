import Web3 from 'web3'
import { errors } from 'web3-core-helpers' // eslint-disable-line import/no-extraneous-dependencies
import Method from 'web3-core-method' // eslint-disable-line import/no-extraneous-dependencies

import Joi from 'joi'
import _ from 'helpers/lodash.mixins'

const web3mn = new Web3(new Web3.providers.HttpProvider(process.env.API_GUBIQ_MN || 'http://localhost:8588'))
const web3tn = new Web3(new Web3.providers.HttpProvider(process.env.API_GUBIQ_TN || 'http://localhost:8588'))

// Override basic web3 'Method' class to allow having better params validation
// (some calls have optional arguments, so we have to take those into account)
class EMethod extends Method {
  constructor(options) {
    super(options)
    this.validate = options.validate || (() => true)
    this.schema = options.schema || {}
  }

  validateArgs(args = []) {
    if (!_.isArray(args)) {
      throw errors.InvalidNumberOfParams(args.length, this.params, this.name)
    }

    if (args.length !== this.params) {
      throw errors.InvalidNumberOfParams(args.length, this.params, this.name)
    }

    const result = this.validate(args)
    if (!result) {
      throw errors.InvalidNumberOfParams(args.length, this.params, this.name)
    }
  }

  formatOutput(result) {
    if (this.outputFormatter) {
      return this.outputFormatter(result)
    }
    return result
  }
}

// Create safe property that only allows safe methods
const safe = {
  property: 'safe',
  methods: [
    new EMethod({
      name: 'web3_clientVersion',
      call: 'web3_clientVersion'
    }),
    new EMethod({
      name: 'net_version',
      call: 'net_version'
    }),
    new EMethod({
      name: 'net_listening',
      call: 'net_listening'
    }),
    new EMethod({
      name: 'net_peerCount',
      call: 'net_peerCount'
    }),
    new EMethod({
      name: 'eth_protocolVersion',
      call: 'eth_protocolVersion'
    }),
    new EMethod({
      name: 'eth_syncing',
      call: 'eth_syncing'
    }),
    new EMethod({
      name: 'eth_mining',
      call: 'eth_mining'
    }),
    new EMethod({
      name: 'eth_hashrate',
      call: 'eth_hashrate'
    }),
    new EMethod({
      name: 'eth_gasPrice',
      call: 'eth_gasPrice'
    }),
    new EMethod({
      name: 'eth_accounts',
      call: 'eth_accounts',
      outputFormatter: res => (_.isNull(res) ? [] : res)
    }),
    new EMethod({
      name: 'eth_blockNumber',
      call: 'eth_blockNumber'
    }),
    new EMethod({
      name: 'eth_getCompilers',
      call: 'eth_getCompilers'
    }),
    new EMethod({
      name: 'eth_getWork',
      call: 'eth_getWork',
      outputFormatter: res => (_.isNull(res) ? [] : res)
    }),
    new EMethod({
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
        const isQuantity = _.isBlockTagOrHex(quantity)
        if (!isQuantity) {
          return false
        }

        return true
      }
    }),
    new EMethod({
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
        const isBlockNumber = _.isBlockTagOrHex(blockNumber)
        if (!isBlockNumber) {
          return false
        }

        return true
      }
    }),
    new EMethod({
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
        const isQuantity = _.isBlockTagOrHex(quantity)
        if (!isQuantity) {
          return false
        }

        return true
      }
    }),
    new EMethod({
      name: 'eth_getBlockTransactionCountByHash',
      call: 'eth_getBlockTransactionCountByHash',
      params: 1,
      validate: args => {
        const txHash = args[0]
        return _.isTxHash(txHash)
      },
      outputFormatter: res => (_.isNull(res) ? '' : res)
    }),
    new EMethod({
      name: 'eth_getBlockTransactionCountByNumber',
      call: 'eth_getBlockTransactionCountByNumber',
      params: 1,
      validate: args => {
        const quantity = args[0]
        return _.isBlockTagOrHex(quantity)
      },
      outputFormatter: res => (_.isNull(res) ? '' : res)
    }),
    new EMethod({
      name: 'eth_getUncleCountByBlockHash',
      call: 'eth_getUncleCountByBlockHash',
      params: 1,
      validate: args => {
        const txHash = args[0]
        return _.isTxHash(txHash)
      },
      outputFormatter: res => (_.isNull(res) ? '' : res)
    }),
    new EMethod({
      name: 'eth_getUncleCountByBlockNumber',
      call: 'eth_getUncleCountByBlockNumber',
      params: 1,
      validate: args => {
        const quantity = args[0]
        return _.isBlockTagOrHex(quantity)
      },
      outputFormatter: res => (_.isNull(res) ? '' : res)
    }),
    new EMethod({
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
        const isQuantity = _.isBlockTagOrHex(quantity)
        if (!isQuantity) {
          return false
        }

        return true
      },
      outputFormatter: res => (_.isNull(res) ? '' : res)
    }),
    new EMethod({
      name: 'eth_call',
      call: 'eth_call',
      params: 2,
      validate: args => {
        const obj = args[0]
        const isObj = _.isObject(obj)
        if (!isObj) {
          return false
        }

        const schema = Joi.object().keys({
          from: Joi.string().regex(/^0x[0-9a-f]{40}$/i),
          to: Joi.string().regex(/^0x[0-9a-f]{40}$/i).required(),
          gas: Joi.string().hex(),
          gasPrice: Joi.string().hex(),
          value: Joi.string().hex(),
          data: Joi.string()
        })

        // Check if this object complies correctly with the format
        const result = Joi.validate(obj, schema)
        if (result.error) {
          return false
        }

        const quantity = args[1]
        const isQuantity = _.isBlockTagOrHex(quantity)
        if (!isQuantity) {
          return false
        }

        return true
      }
    }),
    new EMethod({
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
      outputFormatter: res => (_.isNull(res) ? {} : res)
    }),
    new EMethod({
      name: 'eth_getBlockByNumber',
      call: 'eth_getBlockByNumber',
      params: 2,
      validate: args => {
        const blockNumber = args[0]
        const isBlockNumber = _.isBlockTagOrHex(blockNumber)
        if (!isBlockNumber) {
          return false
        }

        const fullTx = args[1]
        const isFullTx = _.isBoolean(_.toBoolean(fullTx))
        if (!isFullTx) {
          return false
        }

        return true
      }
    }),
    new EMethod({
      name: 'eth_getTransactionByHash',
      call: 'eth_getTransactionByHash',
      params: 1,
      validate: args => {
        const txHash = args[0]
        const isTxHash = _.isBlockTagOrHex(txHash)
        return isTxHash
      },
      outputFormatter: res => (_.isNull(res) ? {} : res)
    }),
    new EMethod({
      name: 'eth_getTransactionByBlockHashAndIndex',
      call: 'eth_getTransactionByBlockHashAndIndex',
      params: 2,
      validate: () => true
    }),
    new EMethod({
      name: 'eth_getTransactionByBlockNumberAndIndex',
      call: 'eth_getTransactionByBlockNumberAndIndex',
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
      }
    }),
    new EMethod({
      name: 'eth_getTransactionReceipt',
      call: 'eth_getTransactionReceipt',
      params: 1,
      validate: args => {
        const txHash = args[0]
        return _.isTxHash(txHash)
      },
      outputFormatter: res => (_.isNull(res) ? {} : res)
    }),
    new EMethod({
      name: 'eth_getUncleByBlockNumberAndIndex',
      call: 'eth_getUncleByBlockNumberAndIndex',
      params: 2,
      validate: args => {
        const blockNumber = args[0]
        const isBlockNumber = _.isBlockTagOrHex(blockNumber)
        if (!isBlockNumber) {
          return false
        }

        const indexPos = args[1]
        const isIndexPos = _.isHex(indexPos)
        if (!isIndexPos) {
          return false
        }

        return true
      }
    }),
    new EMethod({
      name: 'eth_getLogs',
      call: 'eth_getLogs',
      params: 1,
      validate: args => {
        const filterObj = args[0]
        const isObj = _.isObj(filterObj)
        if (!isObj) {
          return false
        }

        const schema = {
          type: 'object',
          properties: {
            fromBlock: {
              type: 'eth_address'
            },
            toBlock: {
              type: 'eth_quantity'
            },
            address: {
              type: 'eth_quantity'
            },
            topics: {
              type: 'eth_quantity'
            }
          }
        }

        const isValidFilterObj = Joi.validate(schema, filterObj)

        return isValidFilterObj
      },
      outputFormatter: res => (_.isNull(res) ? [] : res)
    }),
    new EMethod({
      name: 'eth_sendRawTransaction',
      call: 'eth_sendRawTransaction',
      params: 1,
      validate: args => {
        const txHash = args[0]
        const isTxHash = _.isTxHash(txHash)
        return isTxHash
      }
    }),
    new EMethod({
      name: 'eth_estimateGas',
      call: 'eth_estimateGas',
      params: 2,
      validate: args => {
        const obj = args[0]
        const isObj = _.isObject(obj)
        if (!isObj) {
          return false
        }

        const schema = {
          type: 'object',
          properties: {
            from: {
              type: 'ethaddress'
            },
            to: {
              type: 'ethquantity'
            },
            gas: {
              type: 'ethquantity'
            },
            gasPrice: {
              type: 'ethquantity'
            },
            value: {
              type: 'ethquantity'
            },
            data: {
              type: 'string'
            }
          },
          required: ['to']
        }

        // Check if this object complies correctly with the format
        const isCorrectObj = Joi.validate(schema, obj)
        if (!isCorrectObj) {
          return false
        }

        const quantity = args[1]
        const isQuantity = _.isBlockTagOrHex(quantity)
        if (!isQuantity) {
          return false
        }

        return true
      },
      outputFormatter: res => (_.isNull(res) ? '' : res)
    }),
    new EMethod({
      name: 'eth_submitWork',
      call: 'eth_submitWork',
      params: 3,
      validate: args => {
        const powHash = args[0]
        const seedHash = args[1]
        const boundary = args[2]
      }
    }),
    new EMethod({
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
      }
    })
  ]
}

// Extend those on mainnet and testnet web3
web3mn.extend(safe)
web3tn.extend(safe)

export default {
  mn: web3mn,
  tn: web3tn
}
