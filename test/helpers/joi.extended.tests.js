/* eslint-disable no-unused-expressions */

import chai from 'chai'
import {
  Joi,
  Schemas
} from 'helpers/joi.extended'

const expect = chai.expect

describe('joi.extended', () => {
  describe('ethereum address validations', () => {
    it('should validate properly a correct ethereum address', () => {
      const schema = Joi.eth().isAddress()
      const result = Joi.validate('0x407d73d8a49eeb85d32cf465507dd71d507100c1', schema)
      expect(result.error).to.be.null
    })

    it('should throw error with an incorrect ethereum address', () => {
      const schema = Joi.eth().isAddress()
      const result = Joi.validate('0x407d73d', schema)
      expect(result.error).to.not.be.null
    })

    it('should throw error with an empty ethereum address', () => {
      const schema = Joi.eth().isAddress()
      const result = Joi.validate('', schema)
      expect(result.error).to.not.be.null
    })
  })

  describe('ethereum block tx hash validations', () => {
    it('should validate properly a correct tx hash', () => {
      const schema = Joi.eth().isTxHash()
      const result = Joi.validate('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238', schema)
      expect(result.error).to.be.null
    })

    it('should throw error with an incorrect ethereum tx hash', () => {
      const schema = Joi.eth().isTxHash()
      const result = Joi.validate('0x407d73d', schema)
      expect(result.error).to.not.be.null
    })

    it('should throw error with an empty ethereum tx hash', () => {
      const schema = Joi.eth().isTxHash()
      const result = Joi.validate('', schema)
      expect(result.error).to.not.be.null
    })
  })

  describe('ethereum block tag or hex validations', () => {
    it('should validate properly a correct block tag: "latest"', () => {
      const schema = Joi.eth().isBlockTagOrHex()
      const result = Joi.validate('latest', schema)
      expect(result.error).to.be.null
    })

    it('should validate properly a correct block tag: "pending"', () => {
      const schema = Joi.eth().isBlockTagOrHex()
      const result = Joi.validate('pending', schema)
      expect(result.error).to.be.null
    })

    it('should validate properly a correct block tag: "earliest"', () => {
      const schema = Joi.eth().isBlockTagOrHex()
      const result = Joi.validate('earliest', schema)
      expect(result.error).to.be.null
    })

    it('should validate properly a correct block tag: "0x1"', () => {
      const schema = Joi.eth().isBlockTagOrHex()
      const result = Joi.validate('0x1', schema)
      expect(result.error).to.be.null
    })

    it('should validate properly a correct block tag: "0x1121afa"', () => {
      const schema = Joi.eth().isBlockTagOrHex()
      const result = Joi.validate('0x1121afa', schema)
      expect(result.error).to.be.null
    })

    it('should throw error with an empty block tag', () => {
      const schema = Joi.eth().isTxHash()
      const result = Joi.validate('', schema)
      expect(result.error).to.not.be.null
    })
  })

  describe('ethereum schemas validations', () => {
    describe('Filter', () => {
      it('should validate properly a correct filter object', () => {
        const schema = Schemas.Filter
        const filter = {
          fromBlock: 'earliest',
          toBlock: 'latest',
          address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
          topics: [
            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
            null, ['0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b', '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc']
          ]
        }
        const result = Joi.validate(filter, schema)
        expect(result.error).to.be.null
      })

      it('should validate properly a correct filter object with optional params: fromBlock', () => {
        const schema = Schemas.Filter
        const filter = {
          fromBlock: 'earliest'
        }
        const result = Joi.validate(filter, schema)
        expect(result.error).to.be.null
      })

      it('should validate properly a correct filter object with optional params: toBlock', () => {
        const schema = Schemas.Filter
        const filter = {
          toBlock: 'earliest'
        }
        const result = Joi.validate(filter, schema)
        expect(result.error).to.be.null
      })

      it('should validate properly a correct filter object with optional params: toBlock', () => {
        const schema = Schemas.Filter
        const filter = {
          address: '0x8888f1f195afa192cfee860698584c030f4c9db1'
        }
        const result = Joi.validate(filter, schema)
        expect(result.error).to.be.null
      })

      it('should validate properly a correct filter object with optional params: topics', () => {
        const schema = Schemas.Filter

        const filters = []
        filters.push({
          topics: [
            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
            null, ['0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b', '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc']
          ]
        })
        filters.push({
          topics: [
            ['0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b', '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc'],
            null,
            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b'
          ]
        })
        filters.push({
          topics: []
        })

        filters.forEach(f => {
          const result = Joi.validate(f, schema)
          expect(result.error).to.be.null
        })
      })

      it('should not validate an incorrect filter object', () => {
        const schema = Schemas.Filter
        const filters = []
        filters.push({
          address: '0x8888f1f195afa192cfe'
        })
        filters.push({
          fromBlock: '10'
        })
        filters.push({
          toBlock: 'p'
        })
        filters.push({
          topics: 1
        })
        filters.forEach(f => {
          const result = Joi.validate(f, schema)
          expect(result.error).to.be.not.null
        })
      })
    })

    describe('SendTx', () => {
      it('should validate correctly a send tx object', () => {
        const schema = Schemas.SendTx
        const sendTx = {
          from: '0x8888f1f195afa192cfee860698584c030f4c9db1',
          to: '0x8888f1f195afa192cfee860698584c030f4c9db1',
          gas: '0x10',
          gasPrice: '0x10',
          value: '0x10212',
          data: '0xcdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001'
        }
        const result = Joi.validate(sendTx, schema)
        expect(result.error).to.be.null
      })

      it('should validate correctly a send tx object with only required parameters', () => {
        const schema = Schemas.SendTx
        const sendTx = {
          to: '0x8888f1f195afa192cfee860698584c030f4c9db1'
        }
        const result = Joi.validate(sendTx, schema)
        expect(result.error).to.be.null
      })

      it('should not validate a send tx object without having required parameters', () => {
        const schema = Schemas.SendTx
        const sendTx = {
          from: '0x8888f1f195afa192cfee860698584c030f4c9db1'
        }
        const result = Joi.validate(sendTx, schema)
        expect(result.error).to.not.be.null
      })
    })
  })
})
