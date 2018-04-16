import helpers from 'web3-core-helpers'

export default {
  isAddress: address => helpers.utils.isAddress(address),
  isTxHash: hash => /^(?:0x|0X)[\da-f]{64}$/i.test(hash) || /^(?:0x|0X)[\dA-F]{64}$/i.test(hash),
  isNonce: nonce => /^(?:0x|0X)[\da-f]{16}$/i.test(nonce) || /^(?:0x|0X)[\dA-F]{16}$/i.test(nonce),
  isHex: quantity => helpers.utils.isHexStrict(quantity),
  isBlockTag: tag => /^latest|earliest|pending$/.test(tag),
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
}
