import utils from 'web3-utils'

export function isEthAddress(address) {
  return utils.isAddress(address)
}

export function isEthTxHash(hash) {
  return /^(?:0x|0X)[\da-f]{64}$/i.test(hash) || /^(?:0x|0X)[\dA-F]{64}$/i.test(hash)
}

export function isEthNonce(nonce) {
  return /^(?:0x|0X)[\da-f]{16}$/i.test(nonce) || /^(?:0x|0X)[\dA-F]{16}$/i.test(nonce)
}

export function isEthBlockTag(tag) {
  return /^latest|earliest|pending$/.test(tag)
}

export function isHex(quantity) {
  return utils.isHexStrict(quantity)
}

export function toBoolean(raw: any) {
  if (typeof raw === 'string') {
    if (/^true|TRUE$/.test(raw)) {
      return true
    }

    if (/^false|FALSE$/.test(raw)) {
      return false
    }
  }

  if (typeof raw === 'boolean') {
    return raw
  }

  return undefined
}
