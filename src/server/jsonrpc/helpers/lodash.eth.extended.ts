import _ from 'lodash'
import w3Helpers from 'web3-core-helpers'

if (!_.isAddress) {
  const ethereum = {
    isAddress: address => w3Helpers.utils.isAddress(address),
    isTxHash: hash => /^(?:0x|0X)[\da-f]{64}$/i.test(hash) || /^(?:0x|0X)[\dA-F]{64}$/i.test(hash),
    isNonce: nonce => /^(?:0x|0X)[\da-f]{16}$/i.test(nonce) || /^(?:0x|0X)[\dA-F]{16}$/i.test(nonce),
    isHex: quantity => w3Helpers.utils.isHexStrict(quantity),
    isBlockTag: tag => /^latest|earliest|pending$/.test(tag),
    isBlockTagOrHex: quantity => _.isBlockTag(quantity) || _.isHex(quantity),
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
    },
  })
}

export default _
