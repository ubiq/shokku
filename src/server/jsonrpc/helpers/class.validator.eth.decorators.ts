import _ from 'lodash'
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

const validRpcMethods = [
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

export default function IsRpcMethod() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsRpcMethod',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && _.includes(validRpcMethods, value)
        },
      },
    })
  }
}
