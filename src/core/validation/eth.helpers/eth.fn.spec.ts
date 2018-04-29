import { isEthAddress, isEthBlockTag, isEthNonce, isEthTxHash, isHex, toBoolean } from './eth.fn'
import { expect } from 'chai'

describe('eth.fn', () => {

  describe('isAddress', () => {
    it('should validate a correct eth address (lowercase)', () => {
      const result = isEthAddress('0x407d73d8a49eeb85d32cf465507dd71d507100c1')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should validate a correct eth address (uppercase)', () => {
      const result = isEthAddress('0X407D73D8A49EEB85D32CF465507DD71D507100C1')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should not validate an incorrect eth address (lowercase)', () => {
      const result = isEthAddress('0x407d73d8a49eeb85d32cf465507dd71d507100c1c1c1c1c1')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an incorrect eth address (uppercase)', () => {
      const result = isEthAddress('0X407D73D8A49EEB85D32CF465507DD71D507100C1C1C1C1C1')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an mixed case eth address', () => {
      const result = isEthAddress('0x407D73D8A49eeB85D32CF465507dd71D507100c1')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate empty string', () => {
      const result = isEthAddress('')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate a correct eth address but with spaces between', () => {
      const result1 = isEthAddress('   0x407d73d8a49eeb85d32cf465507dd71d507100c1    ')
      const result2 = isEthAddress('   0x407d7 3d8a49eeb8  5d32cf46  5507dd71d507100c1    ')
      const result3 = isEthAddress('   0x 407d73d8a49eeb85d3 2cf465507  dd71d507100c1    ')

      expect(result1).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
    })
  })

  describe('isTxHash', () => {
    it('should validate a correct tx hash (lowercase)', () => {
      const result = isEthTxHash('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should validate a correct tx hash (uppercase)', () => {
      const result = isEthTxHash('0XB903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should not validate an incorrect tx hash (lowercase)', () => {
      const result = isEthTxHash('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238111111111111')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an incorrect tx hash (uppercase)', () => {
      const result = isEthTxHash('0XB903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238111111111111')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an mixed case tx hash', () => {
      const result = isEthTxHash('0xb903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408cbce568238')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate empty string', () => {
      const result = isEthTxHash('')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate a correct tx hash but with spaces between', () => {
      const result1 = isEthTxHash('   0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238    ')
      const result2 = isEthTxHash('   0xb90323  9f8543d04b5dc1ba6579132 b143087c68db1b2168786408fcbce568238    ')
      const result3 = isEthTxHash('   0x b903239f8543d04b5dc 1ba6579132b143 087c68 db1b2168786408fcb ce568238    ')

      expect(result1).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
    })
  })

  describe('isNonce', () => {
    it('should validate a correct nonce (lowercase)', () => {
      const result = isEthNonce('0x1279614836b8f22e')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should validate a correct nonce (uppercase)', () => {
      const result = isEthNonce('0x1279614836B8F22E')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should not validate an incorrect nonce (lowercase)', () => {
      const result = isEthNonce('0x1279614836b8f22e121211212')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an incorrect nonce (uppercase)', () => {
      const result = isEthNonce('0x1279614836B8F22E112121212')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate a mixed case nonce', () => {
      const result = isEthNonce('0x127961ab836b8F22e')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate empty string', () => {
      const result = isEthNonce('')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate a correct nonce but with spaces between', () => {
      const result1 = isEthNonce('   0x1279 614836 b8f22e    ')
      const result2 = isEthNonce('   0x127 961   4836b8   f2   2e    ')
      const result3 = isEthNonce('   0 x12 79  6148 36b 8f 2  2e    ')

      expect(result1).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
    })
  })

  describe('isHex', () => {
    it('should validate a proper hex numer: "0x10"', () => {
      const result = isHex('0x10')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should not validate an improper hex numer: "0x10TEST"', () => {
      const result = isHex('0x10TEST')
      expect(result).to.be.a('boolean').that.equals(false)
    })
  })

  describe('isBlockTag', () => {
    it('should validate properly a correct block tag: "latest"', () => {
      const result = isEthBlockTag('latest')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should validate properly a correct block tag: "pending"', () => {
      const result = isEthBlockTag('pending')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should validate properly a correct block tag: "earliest"', () => {
      const result = isEthBlockTag('earliest')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should not validate properly an incorrect block tag: "random"', () => {
      const result = isEthBlockTag('random')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate properly an empty block tag', () => {
      const result = isEthBlockTag('')
      expect(result).to.be.a('boolean').that.equals(false)
    })
  })

  describe('toBoolean', () => {
    it('should convert properly a string boolean: "true"', () => {
      const result = toBoolean('true')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should convert properly a string boolean: "false"', () => {
      const result = toBoolean('false')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not convert an incorrect string to boolean: "test"', () => {
      const result = toBoolean('test')
      expect(result).to.be.undefined
    })

    it('should not convert an incorrect string to boolean: ""', () => {
      const result = toBoolean('')
      expect(result).to.be.undefined
    })

    it('should not convert a number to boolean: 5', () => {
      const result = toBoolean(5)
      expect(result).to.be.undefined
    })
  })
})
