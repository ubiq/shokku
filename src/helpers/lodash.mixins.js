import web3 from 'web3'
import _ from 'lodash'

if (!_.isAddress) {
  const ethereum = {
    isAddress: address => web3.utils.isAddress(address),
    isTxHash: hash => /^0x[\da-fA-F]{64}$/i.test(hash),
    isNonce: nonce => /^0x[\da-fA-F]{16}$/i.test(nonce),
    isHex: quantity => web3.utils.isHexStrict(quantity),
    isBlockTag: tag => tag === 'latest' || tag === 'earliest' || tag === 'pending',
    isBlockTagOrHex: quantity => _.isBlockTag(quantity) || _.isHex(quantity)
  }

  _.mixin(ethereum)
}

if (!_.toBoolean) {
  _.mixin({
    toBoolean: str => {
      if (typeof str === 'string') {
        if (str === 'true') {
          return true
        } else if (str === 'false') {
          return false
        }
      } else if (typeof str === 'boolean') {
        return str
      }
      return undefined
    }
  })
}

export default _
