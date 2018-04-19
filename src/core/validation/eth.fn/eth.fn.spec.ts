import e from './eth.fn'
import { expect } from 'chai'

describe('eth.fn', () => {

  describe('isAddress', () => {
    it('should validate a correct eth address (lowercase)', () => {
      const result = e.isAddress('0x407d73d8a49eeb85d32cf465507dd71d507100c1')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should validate a correct eth address (uppercase)', () => {
      const result = e.isAddress('0X407D73D8A49EEB85D32CF465507DD71D507100C1')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should not validate an incorrect eth address (lowercase)', () => {
      const result = e.isAddress('0x407d73d8a49eeb85d32cf465507dd71d507100c1c1c1c1c1')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an incorrect eth address (uppercase)', () => {
      const result = e.isAddress('0X407D73D8A49EEB85D32CF465507DD71D507100C1C1C1C1C1')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an mixed case eth address', () => {
      const result = e.isAddress('0x407D73D8A49eeB85D32CF465507dd71D507100c1')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate empty string', () => {
      const result = e.isAddress('')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate a correct eth address but with spaces between', () => {
      const result1 = e.isAddress('   0x407d73d8a49eeb85d32cf465507dd71d507100c1    ')
      const result2 = e.isAddress('   0x407d7 3d8a49eeb8  5d32cf46  5507dd71d507100c1    ')
      const result3 = e.isAddress('   0x 407d73d8a49eeb85d3 2cf465507  dd71d507100c1    ')

      expect(result1).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
    })
  })

  describe('isTxHash', () => {
    it('should validate a correct tx hash (lowercase)', () => {
      const result = e.isAddress('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should validate a correct tx hash (uppercase)', () => {
      const result = e.isAddress('0XB903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238')
      expect(result).to.be.a('boolean').that.equals(true)
    })

    it('should not validate an incorrect tx hash (lowercase)', () => {
      const result = e.isAddress('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238111111111111')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an incorrect tx hash (uppercase)', () => {
      const result = e.isAddress('0XB903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238111111111111')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate an mixed case tx hash', () => {
      const result = e.isAddress('0xb903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408cbce568238')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate empty string', () => {
      const result = e.isAddress('')
      expect(result).to.be.a('boolean').that.equals(false)
    })

    it('should not validate a correct tx hash but with spaces between', () => {
      const result1 = e.isAddress('   0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238    ')
      const result2 = e.isAddress('   0xb90323  9f8543d04b5dc1ba6579132 b143087c68db1b2168786408fcbce568238    ')
      const result3 = e.isAddress('   0x b903239f8543d04b5dc 1ba6579132b143 087c68 db1b2168786408fcb ce568238    ')

      expect(result1).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
      expect(result2).to.be.a('boolean').that.equals(false)
    })
  })

  describe('isNonce', () => {
    it('to be tested', () => {
      expect(true).to.be.a('boolean').that.equals(true)
    })
  })

  describe('isHex', () => {
    it('to be tested', () => {
      expect(true).to.be.a('boolean').that.equals(true)
    })
  })

  describe('isBlockTag', () => {
    it('to be tested', () => {
      expect(true).to.be.a('boolean').that.equals(true)
    })
  })

  describe('toBoolean', () => {
    it('to be tested', () => {
      expect(true).to.be.a('boolean').that.equals(true)
    })
  })
})
